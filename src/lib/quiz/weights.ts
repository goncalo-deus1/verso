// weights.ts — Pesos base e modificadores dinâmicos por Q4, Q6 e Q7
// Para ajustar pesos: editar BASE_WEIGHTS ou os modificadores abaixo. Nunca tocar em scoring.ts.

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

export function getWeights(answers: QuizAnswers): Weights {
  const w: Weights = { ...BASE_WEIGHTS }

  // Q4 — modo de trabalho
  if (answers.q4_work === 'w1') {
    // Presencial — proximidade e transportes pesam mais
    w.acessibilidade *= 1.6
    w.centralidade   *= 1.3
  } else if (answers.q4_work === 'w2') {
    // Híbrido — espaço e acessibilidade moderados
    w.acessibilidade *= 1.3
    w.espaco         *= 1.2
  } else if (answers.q4_work === 'w3') {
    // Remoto — centralidade importa menos, qualidade de vida importa mais
    w.acessibilidade *= 0.6
    w.espaco         *= 1.4
    w.tranquilidade  *= 1.3
    w.mar            *= 1.3
  }
  // w4: sem mudança

  // Q6 — intenção de compra
  if (answers.q6_intent === 'i1') {
    // Para viver — familiar e tranquilidade ligeiramente mais pesados
    w.familiar       *= 1.2
    w.tranquilidade  *= 1.1
  } else if (answers.q6_intent === 'i2') {
    // Para investir — valorização domina, vida pessoal importa menos
    w.valorizacao    *= 2.0
    w.maturidade     *= 0.7
    w.familiar       *= 0.6
    w.tranquilidade  *= 0.7
    w.centralidade   *= 1.3
    w.acessibilidade *= 1.2
  } else if (answers.q6_intent === 'i3') {
    // Arrendar — acessibilidade e centralidade sobem, valorização cai
    w.valorizacao    *= 0.4
    w.maturidade     *= 0.9
    w.espaco         *= 0.7
    w.acessibilidade *= 1.3
    w.centralidade   *= 1.2
  } else if (answers.q6_intent === 'i4') {
    // Ainda a explorar — suaviza todos os pesos para match mais equilibrado
    for (const attr of ATTRIBUTES) {
      w[attr] *= 0.85
    }
  }

  // Q7 — prioridades (cada opção selecionada, até 2)
  for (const p of answers.q7_priority ?? []) {
    if (p === 'p1') w.valorizacao    *= 1.2
    if (p === 'p2') w.espaco         *= 1.8
    if (p === 'p3') { w.centralidade *= 1.6; w.acessibilidade *= 1.3 }
    if (p === 'p4') w.familiar       *= 1.6
    if (p === 'p5') { w.urbanidade   *= 1.3; w.maturidade     *= 1.3 }
    if (p === 'p6') w.valorizacao    *= 1.8
  }

  return w
}

/** Distância máxima teórica (100 em todas as dimensões, com os pesos dados). */
export function maxDistance(weights: Weights): number {
  const sum = ATTRIBUTES.reduce((s, attr) => s + 100 * 100 * weights[attr], 0)
  return Math.sqrt(sum)
}
