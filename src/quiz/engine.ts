/**
 * quiz/engine.ts
 *
 * Orquestrador do quiz VERSO para casais.
 * Pipeline completo: filtros → scoring → explicações → resultado.
 *
 * Uso:
 *   const result = runQuiz(answers)
 *   result.top    → top 3 zonas
 *   result.all    → todas as zonas scored
 *
 * Todas as dependências são funções puras — sem React, sem efeitos.
 */

import { zones } from './zones'
import { applyAllFilters } from './filters'
import { calcularScore } from './scoring'
import { generateReasons, generateTradeOff } from './explanations'
import type { QuizAnswers, ScoredZone, QuizResult } from './types'

const TOP_N = 3

// ─── Pipeline principal ───────────────────────────────────────────────────────

/**
 * Executa o quiz completo e devolve o resultado ordenado.
 *
 * Passos:
 *  1. Aplica filtros duros (cidade, commute, orçamento)
 *  2. Calcula score breakdown para cada zona aprovada
 *  3. Gera razões e trade-off para cada zona
 *  4. Ordena por score descendente
 *  5. Devolve top 3 + todas as zonas scored
 */
export function runQuiz(answers: QuizAnswers): QuizResult {
  // 1. Filtros duros
  const [passedZones, filteredCount] = applyAllFilters(zones, answers)

  // 2–3. Score + explicações
  const scored: ScoredZone[] = passedZones.map(zone => {
    const breakdown = calcularScore(zone, answers)
    const reasons   = generateReasons(zone, answers, breakdown)
    const tradeOff  = generateTradeOff(zone, answers)

    return {
      zone,
      breakdown,
      score: breakdown.total,
      reasons,
      tradeOff,
    }
  })

  // 4. Ordenar por score descendente
  const sorted = scored.sort((a, b) => b.score - a.score)

  return {
    top: sorted.slice(0, TOP_N),
    all: sorted,
    answers,
    filteredCount,
  }
}

// ─── Utilitários de debug ─────────────────────────────────────────────────────

/**
 * Imprime o resultado no console de forma legível.
 * Útil durante desenvolvimento para validar outputs sem UI.
 *
 * Uso: debugQuiz(answers)
 */
export function debugQuiz(answers: QuizAnswers): void {
  const result = runQuiz(answers)

  console.group('📍 VERSO Quiz Result')
  console.log(`Zonas analisadas: ${zones.length}`)
  console.log(`Zonas eliminadas por filtros: ${result.filteredCount}`)
  console.log(`Zonas aprovadas: ${result.all.length}`)
  console.groupEnd()

  result.top.forEach((s, i) => {
    console.group(`#${i + 1} ${s.zone.nome} — ${s.score}/100`)
    console.table(s.breakdown)
    console.log('Razões:', s.reasons)
    console.log('Trade-off:', s.tradeOff)
    console.groupEnd()
  })
}
