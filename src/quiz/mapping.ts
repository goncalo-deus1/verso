/**
 * quiz/mapping.ts
 *
 * Funções de conversão de respostas do quiz em valores numéricos
 * usados pelos filtros e pelo motor de scoring.
 */

import type { Orcamento, ToleranciaCommute, ModoTrabalho } from './types'

// ─── Orçamento ────────────────────────────────────────────────────────────────

/**
 * Converte a resposta de orçamento no valor máximo em euros.
 * Usado para eliminar zonas acima do tecto.
 */
export const ORCAMENTO_TECTO: Record<Orcamento, number> = {
  'ate_200k':   200_000,
  '200k_350k':  350_000,
  '350k_500k':  500_000,
  '500k_plus':  999_999, // sem tecto prático
}

/**
 * Converte a resposta de orçamento no valor ideal (centro da banda).
 * Usado para scoring: quão bem o preço da zona se enquadra?
 */
export const ORCAMENTO_IDEAL: Record<Orcamento, number> = {
  'ate_200k':   170_000,
  '200k_350k':  275_000,
  '350k_500k':  425_000,
  '500k_plus':  650_000,
}

export function orcamentoParaTecto(o: Orcamento): number {
  return ORCAMENTO_TECTO[o]
}

export function orcamentoParaIdeal(o: Orcamento): number {
  return ORCAMENTO_IDEAL[o]
}

// ─── Commute ──────────────────────────────────────────────────────────────────

/**
 * Converte tolerância de commute em minutos máximos.
 * '60min_plus' é tratado como sem limite prático (999).
 */
export const COMMUTE_MINUTOS: Record<ToleranciaCommute, number> = {
  '15min':      15,
  '15_30min':   30,
  '30_60min':   60,
  '60min_plus': 999,
}

export function commuteParaMinutos(t: ToleranciaCommute): number {
  return COMMUTE_MINUTOS[t]
}

/**
 * Factor de tolerância por modo de trabalho.
 * Presencial é mais exigente; híbrido aceita mais margem.
 */
export const COMMUTE_FACTOR: Record<ModoTrabalho, number> = {
  'presencial': 1.0,  // limite duro: commute ≤ tolerância
  'hibrido':    1.5,  // aceita até 50% acima da tolerância declarada
  'remoto':     999,  // ignora commute completamente
}

export function commuteFactorParaModo(m: ModoTrabalho): number {
  return COMMUTE_FACTOR[m]
}

/**
 * Tempo máximo de commute tolerado para este perfil.
 * = tolerância_minutos × factor_modo_trabalho
 */
export function commuteMaximo(t: ToleranciaCommute, m: ModoTrabalho): number {
  return commuteParaMinutos(t) * commuteFactorParaModo(m)
}
