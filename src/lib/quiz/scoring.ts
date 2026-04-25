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
import type { TradeoffConfidence } from './tradeoffs'
import { concelhosAML } from '../../data/concelhosAML'
import type { QuizAnswers } from './questions'

export type { QuizAnswers }

export type ScoredZone = {
  zone:               Zone
  slug:               string              // zone.slug — atalho para testes e UI
  vector:             ZoneProfile         // zone.profile — atalho para inspecção nos testes
  concelhoSlug:       string             // ID de concelho (para regra de diversidade)
  score:              number             // 0–100, 100 é match perfeito
  justification:      string
  tradeoff:           string             // sentence or '' when none
  tradeoffConfidence: TradeoffConfidence // tier of the tradeoff sentence
  contributions:      Record<keyof ZoneProfile, number>  // 0–100 normalised, within this result
}

export type QuizResult = {
  best:            ScoredZone
  alternatives:    ScoredZone[]
  lowScoreWarning: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calculateContributions(
  userProfile: ZoneProfile,
  weights: Weights,
  zoneVector: ZoneProfile,
): Record<keyof ZoneProfile, number> {
  const raw = {} as Record<keyof ZoneProfile, number>

  for (const attr of Object.keys(userProfile) as (keyof ZoneProfile)[]) {
    // Alignment: 1.0 when perfect match, 0.0 when opposite extreme
    const alignment = 1 - Math.abs(userProfile[attr] - zoneVector[attr]) / 100
    raw[attr] = weights[attr] * alignment
  }

  // Normalise within this result: highest-contributing attribute = 100
  const maxContribution = Math.max(...Object.values(raw))
  const normalised = {} as Record<keyof ZoneProfile, number>

  for (const attr of Object.keys(raw) as (keyof ZoneProfile)[]) {
    normalised[attr] = maxContribution > 0
      ? Math.round((raw[attr] / maxContribution) * 100)
      : 0
  }

  return normalised
}

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
  maxMonthlyRent: number | null | typeof Infinity,
): Zone[] {
  // null = "Ainda estou a definir" → não filtra
  if (maxMonthlyRent === null) return allZones
  // Infinity = sem limite → não filtra
  if (maxMonthlyRent === Infinity) return allZones

  // maxMonthlyRent já está em €/mês (chamador converte preço de compra ou passa renda directa)
  const filtered = allZones.filter(z => {
    if (!z.budgetFitT2) return true   // sem dados → passa
    return z.budgetFitT2.min <= maxMonthlyRent
  })

  // Relaxa +20% se sobram menos de 10 zonas
  if (filtered.length < 10) {
    return allZones.filter(z => {
      if (!z.budgetFitT2) return true
      return z.budgetFitT2.min <= (maxMonthlyRent as number) * 1.2
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

  // Filtro de orçamento (q3_budget + q2_ownership)
  // Para compra: converte preço de compra em renda equivalente (÷ 300)
  // Para arrendamento: usa o valor de renda directamente — sem conversão
  const budgetOption = answers.q3_budget
  let filtered: Zone[]

  if (!budgetOption) {
    filtered = zones
  } else if (answers.q2_ownership === 'o2_rent') {
    // Renda: maxMonthlyRent directo
    const rentMap: Record<string, number | null | typeof Infinity> = {
      r1_600:       600,
      r2_600_900:   900,
      r3_900_1200:  1200,
      r4_1200_1600: 1600,
      r5_1600plus:  Infinity,
      r6_undecided: null,
    }
    filtered = applyBudgetFilter(zones, rentMap[budgetOption] ?? null)
  } else {
    // Compra: preço → renda equivalente (÷ 300)
    const buyMap: Record<string, number | null | typeof Infinity> = {
      b1_150:       150_000 / 300,   // ≈ 500 €/mês
      b2_150_250:   250_000 / 300,   // ≈ 833 €/mês
      b3_250_400:   400_000 / 300,   // ≈ 1 333 €/mês
      b4_400_600:   600_000 / 300,   // = 2 000 €/mês
      b5_600plus:   Infinity,
      b6_undecided: null,
    }
    filtered = applyBudgetFilter(zones, buyMap[budgetOption] ?? null)
  }

  // Pontuação de cada zona
  const scored: ScoredZone[] = filtered
    .map(zone => {
      const concelhoSlug = getZoneConcelhoId(zone)
      const concelho = concelhosAML.find(c => c.slug === concelhoSlug)
      const tradeoffResult = getTradeoff(userProfile, zone.profile, weights, concelho)
      return {
        zone,
        slug:               zone.slug,
        vector:             zone.profile,
        concelhoSlug,
        score:              euclideanScore(userProfile, zone.profile, weights),
        justification:      getJustification(userProfile, zone.profile, weights),
        tradeoff:           tradeoffResult.sentence ?? '',
        tradeoffConfidence: tradeoffResult.confidence,
        contributions:      calculateContributions(userProfile, weights, zone.profile),
      }
    })
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
