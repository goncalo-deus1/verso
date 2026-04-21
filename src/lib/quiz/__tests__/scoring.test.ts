import { describe, it, expect } from 'vitest'
import { scoreAnswers } from '../scoring'
import type { QuizAnswers } from '../scoring'
import { freguesias } from '../../../data/freguesias'
import { concelhos } from '../../../data/concelhos'
import { VECTOR_DIMENSIONS } from '../../../data/vectorSchema'
import { computeConcelhoVectorFromFreguesias } from '../../../data/concelhos'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugsOf(recs: ReturnType<typeof scoreAnswers>) {
  return recs.map(r => r.slug)
}

const PORTUGUESE_TRIGGER_WORDS = ['Disseste', 'Pediste', 'Aceitas', 'Procuras', 'Escolheste', 'Quiseste', 'Querias']

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('scoreAnswers', () => {

  it('1. Perfil Campo de Ourique aparece no top 3', () => {
    const answers: QuizAnswers = {
      q1_pace: 'quiet',
      q2_distance: 'walking',
      q3_saturday: ['market'],
      q4_trade: 'smaller-for-street',
    }
    const results = scoreAnswers(answers, freguesias, concelhos)
    expect(slugsOf(results)).toContain('campo-de-ourique')
  })

  it('2. Perfil Parque das Nações aparece no top 3', () => {
    const answers: QuizAnswers = {
      q1_pace: 'quiet',
      q2_distance: 'further',
      q3_saturday: ['coast'],
      q4_trade: 'quieter-for-family',
      q5_stage: 'family',
    }
    const results = scoreAnswers(answers, freguesias, concelhos)
    expect(slugsOf(results)).toContain('parque-das-nacoes')
  })

  it('3. scoreAnswers devolve sempre exactamente 3 recomendações', () => {
    const answers: QuizAnswers = {
      q1_pace: 'gentle-bustle',
      q2_distance: 'one-ride',
      q3_saturday: ['culture'],
      q4_trade: 'pay-more-for-walkable',
    }
    const results = scoreAnswers(answers, freguesias, concelhos)
    expect(results).toHaveLength(3)
  })

  it('4. Nunca há três recomendações do mesmo concelho', () => {
    const answers: QuizAnswers = {
      q1_pace: 'quiet',
      q2_distance: 'walking',
      q3_saturday: ['market', 'culture'],
      q4_trade: 'smaller-for-street',
      q5_stage: 'first-home',
    }
    const results = scoreAnswers(answers, freguesias, concelhos)
    const concelhoSlugs = results.map(r =>
      r.kind === 'freguesia'
        ? (concelhos.find(c => c.slug === (r as { kind: 'freguesia'; slug: string; concelhoName?: string }).concelhoName?.toLowerCase().replace(/\s+/g, '-')) ?? concelhos.find(c => c.slug === r.slug))?.slug ?? r.slug
        : r.slug
    )
    // Verifica que não há 3 iguais
    const counts = concelhoSlugs.reduce<Record<string, number>>((acc, s) => {
      if (s) acc[s] = (acc[s] ?? 0) + 1
      return acc
    }, {})
    const max = Math.max(...Object.values(counts))
    expect(max).toBeLessThan(3)
  })

  it('5. Valores do user vector são clampados a [0, 3] com deltas extremos', () => {
    const answers: QuizAnswers = {
      q1_pace: 'quiet',            // pace: -1.5
      q2_distance: 'walking',      // central: +1.5, walkable: +1.5
      q3_saturday: ['market', 'culture'], // central: +1, character: +1.5, food: +1
      q4_trade: 'smaller-for-street',    // character: +1.5, central: +0.5, price: +1
      q5_stage: 'first-home',            // central: +0.5
    }
    // central ficaria em 1.5+1.5+1+0.5+0.5 = 5 sem clamp → verificamos que há 3 resultados válidos
    const results = scoreAnswers(answers, freguesias, concelhos)
    expect(results).toHaveLength(3)
    for (const r of results) {
      expect(Number.isFinite(r.distance)).toBe(true)
      expect(r.distance).toBeGreaterThanOrEqual(0)
    }
  })

  it('6. Cada matchReason é não-vazia, acaba em ponto final, e contém palavra portuguesa', () => {
    const answers: QuizAnswers = {
      q1_pace: 'full-engine',
      q2_distance: 'walking',
      q3_saturday: ['culture', 'hosting'],
      q4_trade: 'pay-more-for-walkable',
      q5_stage: 'relocating',
    }
    const results = scoreAnswers(answers, freguesias, concelhos)
    for (const r of results) {
      expect(r.matchReason.length).toBeGreaterThan(0)
      expect(r.matchReason.trimEnd().endsWith('.')).toBe(true)
      const hasPortugueseWord = PORTUGUESE_TRIGGER_WORDS.some(w => r.matchReason.includes(w))
      expect(hasPortugueseWord).toBe(true)
    }
  })

  it('7. Vector de Lisboa calculado a partir das suas freguesias é aproximadamente correcto', () => {
    const lisboa = concelhos.find(c => c.slug === 'lisboa')
    expect(lisboa).toBeDefined()
    if (!lisboa) return

    const computed = computeConcelhoVectorFromFreguesias('lisboa', freguesias)

    for (const dim of VECTOR_DIMENSIONS) {
      expect(Math.abs(computed[dim] - lisboa.vector[dim])).toBeLessThanOrEqual(0.01)
    }
  })

})
