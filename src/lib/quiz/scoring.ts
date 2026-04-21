/**
 * scoring.ts — Motor de recomendação do quiz VERSO
 *
 * 1. Converte respostas em vector de utilizador (9 dimensões, escala 0–3)
 * 2. Calcula distância euclidiana para cada freguesia e cada concelho
 * 3. Aplica regras de mistura (máx 1 por concelho, barreira de 1.5 para freguesias)
 * 4. Devolve exactamente 3 recomendações
 * 5. Gera matchReason a partir da dimensão mais alinhada
 */

import type { ZoneVector } from '../../data/vectorSchema'
import { VECTOR_DIMENSIONS } from '../../data/vectorSchema'
import type { Freguesia } from '../../data/freguesias'
import type { Concelho } from '../../data/concelhos'
import { matchPhrases } from './matchPhrases'

// ─── Tipos públicos ───────────────────────────────────────────────────────────

export type QuizAnswers = {
  q1_pace: 'quiet' | 'gentle-bustle' | 'full-engine'
  q2_distance: 'walking' | 'one-ride' | 'further'
  q3_saturday: Array<'market' | 'coast' | 'culture' | 'hosting' | 'weekend-away'>
  q4_trade: 'smaller-for-street' | 'longer-commute-for-space' | 'pay-more-for-walkable' | 'quieter-for-family'
  q5_stage?: 'first-home' | 'family' | 'downsizing' | 'relocating' | 'prefer-not-say'
}

export type Recommendation = {
  kind: 'freguesia' | 'concelho'
  slug: string
  name: string
  concelhoName?: string   // preenchido se kind === 'freguesia'
  distance: number        // distância euclidiana — menor = melhor
  matchReason: string     // em português, termina em ponto final
  oneLine: string
  vector: ZoneVector
}

// ─── Conversão de respostas em vector ────────────────────────────────────────

function clamp(v: number): number {
  return Math.min(3, Math.max(0, v))
}

function answersToVector(answers: QuizAnswers): Record<string, number> {
  const vec: Record<string, number> = {
    pace: 1.5, central: 1.5, green: 1.5, night: 1.5,
    family: 1.5, food: 1.5, walkable: 1.5, price: 1.5, character: 1.5,
  }

  // Q1 — ritmo da rua
  if (answers.q1_pace === 'quiet')         vec.pace    -= 1.5
  if (answers.q1_pace === 'gentle-bustle') vec.pace    += 0.5
  if (answers.q1_pace === 'full-engine')   vec.pace    += 1.5

  // Q2 — distância ao centro
  if (answers.q2_distance === 'walking') {
    vec.central  += 1.5
    vec.walkable += 1.5
  }
  if (answers.q2_distance === 'further') {
    vec.central  -= 1.5
    vec.green    += 1
    vec.price    -= 0.5
  }

  // Q3 — sábado ideal (multi-select)
  for (const choice of answers.q3_saturday) {
    if (choice === 'market')      { vec.food      += 1;   vec.character += 0.5 }
    if (choice === 'coast')       { vec.green     += 1;   vec.central   -= 0.5 }
    if (choice === 'culture')     { vec.central   += 1;   vec.character += 1 }
    if (choice === 'hosting')     { vec.family    += 0.5; vec.green     += 0.5 }
    // 'weekend-away' → neutro
  }

  // Q4 — trade-off
  if (answers.q4_trade === 'smaller-for-street')       { vec.character += 1.5; vec.central  += 0.5; vec.price += 1 }
  if (answers.q4_trade === 'longer-commute-for-space') { vec.central   -= 1;   vec.green    += 1 }
  if (answers.q4_trade === 'pay-more-for-walkable')    { vec.walkable  += 1.5; vec.central  += 1 }
  if (answers.q4_trade === 'quieter-for-family')       { vec.family    += 1.5; vec.night    -= 1 }

  // Q5 — fase de vida (opcional)
  if (answers.q5_stage === 'family')     { vec.family  += 1;   vec.night   -= 0.5 }
  if (answers.q5_stage === 'first-home') { vec.central += 0.5 }
  if (answers.q5_stage === 'downsizing') { vec.pace    -= 0.5 }

  // Clamp a [0, 3]
  for (const dim of VECTOR_DIMENSIONS) {
    vec[dim] = clamp(vec[dim])
  }

  return vec
}

// ─── Distância euclidiana ────────────────────────────────────────────────────

function euclidean(userVec: Record<string, number>, zoneVec: ZoneVector): number {
  let sum = 0
  for (const dim of VECTOR_DIMENSIONS) {
    const diff = userVec[dim] - zoneVec[dim]
    sum += diff * diff
  }
  return Math.sqrt(sum)
}

// ─── Geração do matchReason ──────────────────────────────────────────────────

function generateMatchReason(userVec: Record<string, number>, zoneVec: ZoneVector, name: string): string {
  let bestDim: typeof VECTOR_DIMENSIONS[number] = VECTOR_DIMENSIONS[0]
  let bestDiff = Infinity

  for (const dim of VECTOR_DIMENSIONS) {
    const diff = Math.abs(userVec[dim] - zoneVec[dim])
    if (diff < bestDiff) {
      bestDiff = diff
      bestDim  = dim
    }
  }

  const level = zoneVec[bestDim] >= 2 ? 'high' : 'low'
  const key   = `${bestDim}-${level}`
  const fn    = matchPhrases[key]

  if (!fn) {
    return `${name} alinha bem com o que disseste sobre o teu dia-a-dia.`
  }

  return fn(name)
}

// ─── Regras de mistura freguesia/concelho ────────────────────────────────────

/**
 * scoreAnswers
 *
 * Devolve sempre exactamente 3 recomendações.
 * Regras:
 * - Pool combinada: todas as freguesias + todos os concelhos, ordenados por distância euclidiana.
 * - Nunca inclui duas entradas do mesmo concelho (uma freguesia bloqueia o seu concelho e vice-versa).
 * - Prefere freguesias quando disponíveis — por entrarem no pool pela mesma ordem de distância.
 */
export function scoreAnswers(
  answers: QuizAnswers,
  allFreguesias: Freguesia[],
  allConcelhos: Concelho[]
): Recommendation[] {
  const userVec = answersToVector(answers)

  type Candidate = {
    kind: 'freguesia' | 'concelho'
    slug: string
    name: string
    concelhoSlug: string
    concelhoName?: string
    distance: number
    oneLine: string
    vector: ZoneVector
  }

  // Score todas as freguesias
  const scoredFreguesias: Candidate[] = allFreguesias.map(f => ({
    kind: 'freguesia',
    slug: f.slug,
    name: f.name,
    concelhoSlug: f.concelhoSlug,
    concelhoName: allConcelhos.find(c => c.slug === f.concelhoSlug)?.name,
    distance: euclidean(userVec, f.vector),
    oneLine: f.oneLine,
    vector: f.vector,
  }))

  // Score todos os concelhos
  const scoredConcelhos: Candidate[] = allConcelhos.map(c => ({
    kind: 'concelho',
    slug: c.slug,
    name: c.name,
    concelhoSlug: c.slug,
    distance: euclidean(userVec, c.vector),
    oneLine: c.oneLine,
    vector: c.vector,
  }))

  // Pool combinada, ordenada por distância crescente
  const pool = [...scoredFreguesias, ...scoredConcelhos]
    .sort((a, b) => a.distance - b.distance)

  const results: Recommendation[] = []
  const usedConcelhos = new Set<string>()

  for (const candidate of pool) {
    if (results.length >= 3) break
    if (usedConcelhos.has(candidate.concelhoSlug)) continue
    usedConcelhos.add(candidate.concelhoSlug)
    results.push({
      kind: candidate.kind,
      slug: candidate.slug,
      name: candidate.name,
      concelhoName: candidate.concelhoName,
      distance: candidate.distance,
      matchReason: generateMatchReason(userVec, candidate.vector, candidate.name),
      oneLine: candidate.oneLine,
      vector: candidate.vector,
    })
  }

  return results
}
