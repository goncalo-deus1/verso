// scoring.ts — Motor de recomendação do quiz Habitta (v2)
// Passo 1: perfil de utilizador (profileBuilder.ts)
// Passo 2: filtro de orçamento
// Passo 3: pesos dinâmicos (weights.ts)
// Passo 4: distância euclidiana ponderada → score 0–100
// Passo 5: top 1 + até 3 alternativas com regra de diversidade de concelho

import { zones, getZoneConcelhoId } from '../../data/zones'
import { ATTRIBUTES } from '../../data/attributes'
import type { Zone } from '../../data/zones'
import type { ZoneProfile } from '../../data/attributes'
import { buildProfile } from './profileBuilder'
import { getWeights, maxDistance } from './weights'
import type { Weights } from './weights'
import { getTradeoff, getJustification } from './tradeoffs'
import type { QuizAnswers } from './questions'

export type { QuizAnswers }

export type ScoredZone = {
  zone:          Zone
  slug:          string         // zone.slug — atalho para testes e UI
  vector:        ZoneProfile    // zone.profile — atalho para inspecção nos testes
  concelhoSlug:  string         // ID de concelho (para regra de diversidade)
  score:         number         // 0–100, 100 é match perfeito
  justification: string
  tradeoff:      string
}

export type QuizResult = {
  best:            ScoredZone
  alternatives:    ScoredZone[]
  lowScoreWarning: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function euclideanScore(
  userProfile: ZoneProfile,
  zoneProfile: ZoneProfile,
  weights: Weights,
): number {
  const rawDistance = Math.sqrt(
    ATTRIBUTES.reduce((sum, attr) => {
      const delta = userProfile[attr] - zoneProfile[attr]
      return sum + delta * delta * weights[attr]
    }, 0),
  )
  const maxDist = maxDistance(weights)
  return Math.round(100 * (1 - rawDistance / maxDist))
}

function applyBudgetFilter(
  allZones: Zone[],
  maxBudget: number | null | typeof Infinity,
): Zone[] {
  // b6 "Ainda estou a definir" (null) → não filtra
  if (maxBudget === null) return allZones
  // b5 "Mais de 1M" (Infinity) → não filtra
  if (maxBudget === Infinity) return allZones

  const maxMonthlyRent = maxBudget / 300

  const filtered = allZones.filter(z => {
    if (!z.budgetFitT2) return true   // sem dados → passa
    return z.budgetFitT2.min <= maxMonthlyRent
  })

  // Relaxa +20% se sobram menos de 10 zonas
  if (filtered.length < 10) {
    return allZones.filter(z => {
      if (!z.budgetFitT2) return true
      return z.budgetFitT2.min <= maxMonthlyRent * 1.2
    })
  }

  return filtered
}

function selectAlternatives(
  ranked: ScoredZone[],
  bestZone: Zone,
  maxCount: number,
): ScoredZone[] {
  const bestConcelhoId = getZoneConcelhoId(bestZone)
  const result: ScoredZone[] = []
  let sameConcelhoCount = 0

  for (const candidate of ranked) {
    if (result.length >= maxCount) break
    if (candidate.concelhoSlug === bestConcelhoId && sameConcelhoCount >= 2) continue
    if (candidate.concelhoSlug === bestConcelhoId) sameConcelhoCount++
    result.push(candidate)
  }

  return result
}

// ─── Função principal ─────────────────────────────────────────────────────────

export function scoreAnswers(answers: QuizAnswers): QuizResult {
  const userProfile = buildProfile(answers)
  const weights     = getWeights(answers)

  // Filtro de orçamento (q2_budget)
  const budgetOption = answers.q2_budget
  let filtered: Zone[]

  if (!budgetOption) {
    filtered = zones
  } else {
    const maxBudgets: Record<string, number | null | typeof Infinity> = {
      b1: 250_000,
      b2: 400_000,
      b3: 600_000,
      b4: 1_000_000,
      b5: Infinity,
      b6: null,       // "Ainda estou a definir" — não filtra
    }
    const maxBudget = maxBudgets[budgetOption] ?? null
    filtered = applyBudgetFilter(zones, maxBudget)
  }

  // Pontuação de cada zona
  const scored: ScoredZone[] = filtered
    .map(zone => ({
      zone,
      slug:         zone.slug,
      vector:       zone.profile,
      concelhoSlug: getZoneConcelhoId(zone),
      score:        euclideanScore(userProfile, zone.profile, weights),
      justification: getJustification(userProfile, zone.profile, weights),
      tradeoff:     getTradeoff(userProfile, zone.profile, weights),
    }))
    .sort((a, b) => b.score - a.score)

  const viable = scored.filter(s => s.score >= 40)
  const lowScoreWarning = viable.length === 0

  if (lowScoreWarning) {
    return {
      best:            scored[0],
      alternatives:    scored.slice(1, 4),
      lowScoreWarning: true,
    }
  }

  const best         = viable[0]
  const alternatives = selectAlternatives(viable.slice(1), best.zone, 3)

  return { best, alternatives, lowScoreWarning: false }
}
