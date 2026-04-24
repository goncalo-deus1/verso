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
    q1_household: pick(['h1', 'h2', 'h3', 'h4'] as const),
    q2_budget:    pick(['b1', 'b2', 'b3', 'b4', 'b5', 'b6'] as const),
    q3_lifestyle: pick(['l1', 'l2', 'l3', 'l4', 'l5'] as const),
    q4_work:      pick(['w1', 'w2', 'w3', 'w4'] as const),
    q5_commute:   pick(['c1', 'c2', 'c3', 'c4'] as const),
    q6_intent:    pick(['i1', 'i2', 'i3', 'i4'] as const),
    q7_priority:  [pick(['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const)],
    q8_dwelling:  pick(['d1', 'd2', 'd3'] as const),
    q9_maturity:  pick(['m1', 'm2', 'm3'] as const),
  }
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('scoreAnswers', () => {

  it('1. Perfil urbano → zona central de Lisboa é a melhor', () => {
    const answers: QuizAnswers = {
      q1_household: 'h2',
      q3_lifestyle: 'l1',
      q4_work:      'w1',
      q5_commute:   'c1',
      q7_priority:  ['p3'],
      q9_maturity:  'm1',
    }
    const result = scoreAnswers(answers)
    const centralZones = ['santo-antonio', 'santa-maria-maior', 'misericordia', 'avenidas-novas']
    expect(centralZones).toContain(result.best.slug)
  })

  it('2. Perfil familiar e suburbano → Oeiras, Cascais ou Alvalade é a melhor', () => {
    const answers: QuizAnswers = {
      q1_household: 'h3',
      q2_budget:    'b3',
      q3_lifestyle: 'l3',
      q4_work:      'w2',
      q5_commute:   'c3',
      q7_priority:  ['p4'],
      q8_dwelling:  'd2',
      q9_maturity:  'm1',
    }
    const result = scoreAnswers(answers)
    expect(['oeiras', 'cascais', 'alvalade']).toContain(result.best.slug)
  })

  it('3. Perfil à beira-mar → Cascais ou Parque das Nações nas top 3', () => {
    const answers: QuizAnswers = {
      q1_household: 'h2',
      q3_lifestyle: 'l4',
      q7_priority:  ['p5'],
      q9_maturity:  'm2',
    }
    const result = scoreAnswers(answers)
    const slugs = topSlugs(result)
    expect(slugs.some(s => s === 'cascais' || s === 'parque-das-nacoes')).toBe(true)
  })

  it('4. Orçamento b1 filtra zonas caras — Santa Maria Maior e Misericórdia não aparecem', () => {
    const answers: QuizAnswers = {
      q2_budget:    'b1',
      q3_lifestyle: 'l1',
      q4_work:      'w1',
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
      q1_household: 'h2',
      q3_lifestyle: 'l1',
      q4_work:      'w1',
      q5_commute:   'c1',
      q7_priority:  ['p3'],
      q9_maturity:  'm1',
    }
    const result = scoreAnswers(answers)
    const bestConcelhoSlug = result.best.concelhoSlug
    const sameCount = result.alternatives.filter(a => a.concelhoSlug === bestConcelhoSlug).length
    expect(sameCount).toBeLessThanOrEqual(2)
  })

  it('7. Trade-off é sempre string não vazia terminada em ponto final', () => {
    const answers: QuizAnswers = {
      q1_household: 'h2',
      q3_lifestyle: 'l2',
      q4_work:      'w2',
      q5_commute:   'c2',
      q9_maturity:  'm2',
    }
    const result = scoreAnswers(answers)
    expect(result.best.tradeoff.length).toBeGreaterThan(0)
    expect(result.best.tradeoff.trimEnd().endsWith('.')).toBe(true)
    for (const alt of result.alternatives) {
      expect(alt.tradeoff.length).toBeGreaterThan(0)
      expect(alt.tradeoff.trimEnd().endsWith('.')).toBe(true)
    }
  })

})
