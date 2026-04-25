import { describe, it, expect } from 'vitest'
import { scoreAnswers } from '../scoring'
import type { QuizAnswers } from '../scoring'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function topSlugs(result: ReturnType<typeof scoreAnswers>): string[] {
  return [result.best.slug, ...result.alternatives.map(a => a.slug)]
}

function randomAnswers(): QuizAnswers {
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]
  return {
    q1_intent:    pick(['i1_single', 'i2_couple', 'i3_family'] as const), // exclude i4_invest (no profile deltas)
    q2_ownership: pick(['o1_buy', 'o2_rent'] as const),
    q3_budget:    pick(['b1_150', 'b2_150_250', 'b3_250_400', 'b4_400_600', 'b5_600plus', 'b6_undecided'] as const),
    q4_work:      pick(['w1_onsite', 'w2_hybrid', 'w3_remote', 'w4_irrelevant'] as const),
    q5_routine:   pick(['r1_walking', 'r2_transit', 'r3_car', 'r4_minimal'] as const),
    q6_sound:     pick(['s1_city', 's2_neighborhood', 's3_silence'] as const),
    q7_tradeoff:  pick(['t1_space', 't2_central', 't3_balance'] as const),
    q8_priority:  [pick(['p1_sea', 'p2_neighborhood', 'p3_family', 'p4_silence', 'p5_valuation', 'p6_youth'] as const)],
  }
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('scoreAnswers', () => {

  it('1. Perfil urbano → zona central de Lisboa é a melhor', () => {
    const answers: QuizAnswers = {
      q1_intent:    'i2_couple',
      q5_routine:   'r1_walking',   // centro a pé
      q4_work:      'w1_onsite',    // presencial
      q6_sound:     's1_city',      // cidade a respirar
      q7_tradeoff:  't2_central',   // espaço compacto, central
      q8_priority:  ['p2_neighborhood'],
    }
    const result = scoreAnswers(answers)
    const centralZones = ['santo-antonio', 'santa-maria-maior', 'misericordia', 'avenidas-novas']
    expect(centralZones).toContain(result.best.slug)
  })

  it('2. Perfil familiar e suburbano → Oeiras, Cascais ou Alvalade é a melhor', () => {
    const answers: QuizAnswers = {
      q1_intent:    'i3_family',
      q2_ownership: 'o1_buy',
      q3_budget:    'b3_250_400',
      q4_work:      'w2_hybrid',
      q5_routine:   'r3_car',
      q6_sound:     's2_neighborhood',
      q7_tradeoff:  't1_space',
      q8_priority:  ['p3_family'],
    }
    const result = scoreAnswers(answers)
    expect(['oeiras', 'cascais', 'alvalade']).toContain(result.best.slug)
  })

  it('3. Perfil à beira-mar → Cascais ou Parque das Nações nas top 3', () => {
    const answers: QuizAnswers = {
      q1_intent:    'i2_couple',
      q4_work:      'w3_remote',
      q8_priority:  ['p1_sea'],
      q6_sound:     's3_silence',
    }
    const result = scoreAnswers(answers)
    const slugs = topSlugs(result)
    expect(slugs.some(s => s === 'cascais' || s === 'parque-das-nacoes')).toBe(true)
  })

  it('4. Orçamento buy b1_150 filtra zonas caras — Santa Maria Maior e Misericórdia não aparecem', () => {
    const answers: QuizAnswers = {
      q2_ownership: 'o1_buy',
      q3_budget:    'b1_150',
      q5_routine:   'r1_walking',
      q4_work:      'w1_onsite',
    }
    const result = scoreAnswers(answers)
    const slugs = topSlugs(result)
    expect(slugs).not.toContain('santa-maria-maior')
    expect(slugs).not.toContain('misericordia')
  })

  it('5. Score é sempre 0–100 em 100 runs aleatórios', () => {
    for (let i = 0; i < 100; i++) {
      const result = scoreAnswers(randomAnswers())
      expect(result.best.score).toBeGreaterThanOrEqual(0)
      expect(result.best.score).toBeLessThanOrEqual(100)
      for (const alt of result.alternatives) {
        expect(alt.score).toBeGreaterThanOrEqual(0)
        expect(alt.score).toBeLessThanOrEqual(100)
      }
    }
  })

  it('6. As alternativas nunca têm mais de 2 do mesmo concelho que a melhor zona', () => {
    const answers: QuizAnswers = {
      q1_intent:    'i2_couple',
      q5_routine:   'r1_walking',
      q4_work:      'w1_onsite',
      q6_sound:     's1_city',
      q7_tradeoff:  't2_central',
      q8_priority:  ['p2_neighborhood'],
    }
    const result = scoreAnswers(answers)
    const bestConcelhoSlug = result.best.concelhoSlug
    const sameCount = result.alternatives.filter(a => a.concelhoSlug === bestConcelhoSlug).length
    expect(sameCount).toBeLessThanOrEqual(2)
  })

  it('7. Renda máxima (rent path) também filtra zonas caras', () => {
    const answers: QuizAnswers = {
      q2_ownership: 'o2_rent',
      q3_budget:    'r1_600',        // apenas zonas com renda mínima ≤ 600 €
      q5_routine:   'r1_walking',
    }
    const result = scoreAnswers(answers)
    const slugs = topSlugs(result)
    // Lisboa centro tem rendas superiores a 600 €/mês para T2 — não deve aparecer
    expect(slugs).not.toContain('santa-maria-maior')
    expect(slugs).not.toContain('misericordia')
  })

  it('8. Q8 p7_none não altera perfil nem pesos — result igual a sem seleção', () => {
    const base: QuizAnswers = {
      q1_intent:   'i2_couple',
      q5_routine:  'r2_transit',
      q6_sound:    's2_neighborhood',
      q7_tradeoff: 't3_balance',
    }
    const withNone: QuizAnswers  = { ...base, q8_priority: ['p7_none'] }
    const withEmpty: QuizAnswers = { ...base, q8_priority: [] }

    const r1 = scoreAnswers(withNone)
    const r2 = scoreAnswers(withEmpty)
    expect(r1.best.slug).toBe(r2.best.slug)
    expect(r1.best.score).toBe(r2.best.score)
  })

})
