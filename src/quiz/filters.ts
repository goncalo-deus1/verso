/**
 * quiz/filters.ts
 *
 * Hard filters — eliminam zonas que falham critérios absolutos.
 * Um filtro duro é binário: a zona passa ou é eliminada.
 * Filtros correm ANTES do scoring para manter o engine limpo.
 *
 * Ordem de aplicação (cada filtro recebe o resultado do anterior):
 *   1. filterByCidadeBase   → compatibilidade geográfica
 *   2. filterByCommute      → tempo de deslocação máximo
 *   3. filterByOrcamento    → preço mínimo vs orçamento do casal
 */

import type { Zone, QuizAnswers } from './types'
import { orcamentoParaTecto, commuteMaximo } from './mapping'

// ─── 1. Filtro por cidade base ────────────────────────────────────────────────

/**
 * Elimina zonas incompatíveis com a cidade onde o casal precisa de estar.
 *
 * Regras:
 *  - 'lisboa'              → zona tem de estar em cidadesCompativeis=['lisboa']
 *  - 'porto'               → zona tem de estar em cidadesCompativeis=['porto']
 *  - 'outra'               → todas passam (vivem noutra cidade ou irrelevante)
 *  - 'sem_localizacao_fixa' → todas passam
 *
 * Nota: 'outra' e 'sem_localizacao_fixa' abrem todas as zonas porque
 * não há constrangimento geográfico de cidade específica.
 */
export function filterByCidadeBase(zones: Zone[], answers: QuizAnswers): Zone[] {
  const { cidade_base } = answers

  if (cidade_base === 'outra' || cidade_base === 'sem_localizacao_fixa') {
    return zones
  }

  return zones.filter(zone => zone.cidadesCompativeis.includes(cidade_base))
}

// ─── 2. Filtro por commute ────────────────────────────────────────────────────

/**
 * Elimina zonas cujo tempo de deslocação ao centro de trabalho
 * excede o máximo tolerado (tolerância × factor do modo de trabalho).
 *
 * Regras:
 *  - remoto: sem filtro — tempo de commute não é relevante
 *  - presencial: commute real ≤ tolerância declarada (factor 1.0)
 *  - híbrido: commute real ≤ tolerância × 1.5 (mais flexível)
 *
 * Se a zona não tiver dados de commute para a cidade escolhida,
 * mas a cidade_base for 'outra'/'sem_localizacao_fixa', passa sempre.
 */
export function filterByCommute(zones: Zone[], answers: QuizAnswers): Zone[] {
  const { modo_trabalho, tolerancia_commute, cidade_base } = answers

  // Remoto: commute não elimina ninguém
  if (modo_trabalho === 'remoto') return zones

  // Sem cidade fixa: commute não é avaliável
  if (cidade_base === 'outra' || cidade_base === 'sem_localizacao_fixa') return zones

  const maxMinutos = commuteMaximo(tolerancia_commute, modo_trabalho)

  return zones.filter(zone => {
    const commute =
      cidade_base === 'lisboa' ? zone.tempoCentroLisboa :
      cidade_base === 'porto'  ? zone.tempoCentroPorto :
      undefined

    // Se não há dados de commute para esta cidade, a zona já devia ter sido
    // eliminada pelo filterByCidadeBase — passa por precaução
    if (commute === undefined) return true

    return commute <= maxMinutos
  })
}

// ─── 3. Filtro por orçamento ──────────────────────────────────────────────────

/**
 * Elimina zonas cujo preço mínimo realista (precoMin) é superior
 * ao tecto de orçamento do casal.
 *
 * Regra: se precoMin > tecto → eliminar.
 * Mantemos uma margem de 10% para negociação (um imóvel pode surgir abaixo do típico).
 */
export function filterByOrcamento(zones: Zone[], answers: QuizAnswers): Zone[] {
  const tecto = orcamentoParaTecto(answers.orcamento)
  const margemNegociacao = 0.10 // aceita zonas até 10% acima do tecto

  return zones.filter(zone => zone.precoMin <= tecto * (1 + margemNegociacao))
}

// ─── Aplicar todos os filtros em sequência ────────────────────────────────────

/**
 * Aplica os três filtros em sequência.
 * Retorna as zonas que passaram todos os critérios absolutos.
 *
 * @returns [zonas_aprovadas, numero_eliminadas]
 */
export function applyAllFilters(
  zones: Zone[],
  answers: QuizAnswers
): [passed: Zone[], filteredCount: number] {
  const afterCidade   = filterByCidadeBase(zones, answers)
  const afterCommute  = filterByCommute(afterCidade, answers)
  const afterOrcamento = filterByOrcamento(afterCommute, answers)

  const filteredCount = zones.length - afterOrcamento.length

  return [afterOrcamento, filteredCount]
}
