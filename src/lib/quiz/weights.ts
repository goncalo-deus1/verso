// weights.ts — Pesos base e modificadores dinâmicos (v3)
// Q2 (ownership), Q4 (work), Q7 (tradeoff), Q8 (priority) modificam pesos.
// Q1, Q3, Q5, Q6 não tocam em pesos.
// Para ajustar: editar BASE_WEIGHTS ou os modificadores abaixo. Nunca tocar em scoring.ts.

import type { Attribute } from '../../data/attributes'
import { ATTRIBUTES } from '../../data/attributes'
import type { QuizAnswers } from './questions'

export type Weights = Record<Attribute, number>

export const BASE_WEIGHTS: Weights = {
  centralidade:   1.0,
  urbanidade:     1.0,
  tranquilidade:  1.0,
  familiar:       1.0,
  jovem:          0.7,
  acessibilidade: 1.0,
  mar:            0.6,
  espaco:         1.0,
  maturidade:     0.8,
  valorizacao:    0.8,
}

// ── Atributo primário e secundário de cada opção de Q8 ────────────────────────

type PriorityWeightSpec = {
  primary:    Attribute
  secondary?: { attr: Attribute; mult: number }
}

const Q8_WEIGHT_SPECS: Partial<Record<string, PriorityWeightSpec>> = {
  p1_sea:          { primary: 'mar' },
  p2_neighborhood: { primary: 'urbanidade', secondary: { attr: 'maturidade', mult: 1.3 } },
  p3_family:       { primary: 'familiar' },
  p4_silence:      { primary: 'tranquilidade' },
  p5_valuation:    { primary: 'valorizacao' },
  p6_youth:        { primary: 'jovem', secondary: { attr: 'urbanidade', mult: 1.2 } },
  // p7_none: no weight changes
}

export function getWeights(answers: QuizAnswers): Weights {
  const w: Weights = { ...BASE_WEIGHTS }

  // ── Q2 — Comprar ou arrendar? ─────────────────────────────────────────────
  if (answers.q2_ownership === 'o1_buy') {
    w.valorizacao *= 1.3
    w.maturidade  *= 1.2
  } else if (answers.q2_ownership === 'o2_rent') {
    w.valorizacao *= 0.3
    w.maturidade  *= 0.8
  }

  // ── Q4 — Modo de trabalho ─────────────────────────────────────────────────
  if (answers.q4_work === 'w1_onsite') {
    w.acessibilidade *= 1.6
    w.centralidade   *= 1.3
  } else if (answers.q4_work === 'w2_hybrid') {
    w.acessibilidade *= 1.3
    w.espaco         *= 1.2
  } else if (answers.q4_work === 'w3_remote') {
    w.acessibilidade *= 0.6
    w.espaco         *= 1.4
    w.tranquilidade  *= 1.4
    w.mar            *= 1.2
  }
  // w4_irrelevant: sem mudança

  // ── Q7 — Tradeoff espaço vs. centralidade ─────────────────────────────────
  if (answers.q7_tradeoff === 't1_space') {
    w.espaco *= 1.4
  } else if (answers.q7_tradeoff === 't2_central') {
    w.centralidade *= 1.4
    w.urbanidade   *= 1.2
  }
  // t3_balance: sem mudança

  // ── Q8 — Prioridades: dampened compounding ────────────────────────────────
  //
  // Regra:
  //   1 opção selecionada (não p7_none): primário × 1.8 + secundário (se definido)
  //   2 opções selecionadas:
  //     - 1.ª opção (order[0]): primário × 1.5   (sem secundário)
  //     - 2.ª opção (order[1]): primário × 1.3   (sem secundário)
  //   p7_none ou sem seleção: sem mudança
  //
  // O array q8_priority preserva a ordem de selecção (ver StorageRequirement na spec).

  const priorities = (answers.q8_priority ?? []).filter(p => p !== 'p7_none')

  if (priorities.length === 1) {
    const spec = Q8_WEIGHT_SPECS[priorities[0]]
    if (spec) {
      w[spec.primary] *= 1.8
      if (spec.secondary) {
        w[spec.secondary.attr] *= spec.secondary.mult
      }
    }
  } else if (priorities.length === 2) {
    const spec0 = Q8_WEIGHT_SPECS[priorities[0]]
    const spec1 = Q8_WEIGHT_SPECS[priorities[1]]
    if (spec0) w[spec0.primary] *= 1.5
    if (spec1) w[spec1.primary] *= 1.3
  }

  return w
}

/** Distância máxima teórica (100 em todas as dimensões, com os pesos dados). */
export function maxDistance(weights: Weights): number {
  const sum = ATTRIBUTES.reduce((s, attr) => s + 100 * 100 * weights[attr], 0)
  return Math.sqrt(sum)
}
