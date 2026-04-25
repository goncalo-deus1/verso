// profileBuilder.ts — Converte respostas do quiz em perfil de utilizador (0–100 por dimensão)
// Q1, Q2, Q5, Q6, Q7, Q8 modificam o perfil. Q3 (orçamento) e Q4 (trabalho) afectam apenas pesos.

import type { ZoneProfile } from '../../data/attributes'
import { ATTRIBUTES } from '../../data/attributes'
import type { QuizAnswers } from './questions'

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v))
}

export function buildProfile(answers: QuizAnswers): ZoneProfile {
  const p: Record<string, number> = {}
  for (const attr of ATTRIBUTES) p[attr] = 50  // neutro

  // ── Q1 — Para quem é a casa? ──────────────────────────────────────────────
  if (answers.q1_intent === 'i1_single') {
    p.jovem      += 15
    p.familiar   -= 15
    p.espaco     -= 10
    p.urbanidade += 10
  } else if (answers.q1_intent === 'i2_couple') {
    p.espaco        += 5
    p.tranquilidade += 5
    p.jovem         -= 5
  } else if (answers.q1_intent === 'i3_family') {
    p.familiar      += 25
    p.espaco        += 20
    p.tranquilidade += 15
    p.jovem         -= 15
    p.urbanidade    -= 10
  }
  // i4_invest: sem deltas de perfil (branch separado no UI)

  // ── Q2 — Comprar ou arrendar? ─────────────────────────────────────────────
  if (answers.q2_ownership === 'o1_buy') {
    p.maturidade += 5
  } else if (answers.q2_ownership === 'o2_rent') {
    p.maturidade -= 5
    p.jovem      += 5
  }

  // ── Q5 — Rotina de deslocação ─────────────────────────────────────────────
  if (answers.q5_routine === 'r1_walking') {
    p.centralidade   += 30
    p.urbanidade     += 25
    p.acessibilidade += 20
    p.espaco         -= 15
  } else if (answers.q5_routine === 'r2_transit') {
    p.acessibilidade += 20
    p.centralidade   += 10
    p.urbanidade     += 10
  } else if (answers.q5_routine === 'r3_car') {
    p.centralidade   -= 15
    p.urbanidade     -= 10
    p.espaco         += 15
    p.acessibilidade -= 5
  } else if (answers.q5_routine === 'r4_minimal') {
    p.espaco         += 10
    p.tranquilidade  += 10
    p.centralidade   -= 10
  }

  // ── Q6 — Ambiente sonoro ──────────────────────────────────────────────────
  if (answers.q6_sound === 's1_city') {
    p.urbanidade     += 25
    p.centralidade   += 20
    p.tranquilidade  -= 25
    p.jovem          += 10
  } else if (answers.q6_sound === 's2_neighborhood') {
    p.tranquilidade += 15
    p.familiar      += 5
  } else if (answers.q6_sound === 's3_silence') {
    p.tranquilidade += 30
    p.urbanidade    -= 20
    p.centralidade  -= 15
    p.espaco        += 10
  }

  // ── Q7 — Tradeoff espaço vs. centralidade ─────────────────────────────────
  if (answers.q7_tradeoff === 't1_space') {
    p.espaco         += 25
    p.centralidade   -= 20
    p.urbanidade     -= 15
    p.tranquilidade  += 10
  } else if (answers.q7_tradeoff === 't2_central') {
    p.centralidade   += 25
    p.urbanidade     += 20
    p.espaco         -= 20
    p.acessibilidade += 10
  } else if (answers.q7_tradeoff === 't3_balance') {
    p.espaco       += 5
    p.centralidade += 5
  }

  // ── Q8 — Prioridades (multi-select, até 2, p7_none sem deltas) ────────────
  // Sum deltas across all selected options (p7_none contributes nothing)
  for (const priority of answers.q8_priority ?? []) {
    if (priority === 'p1_sea') {
      p.mar           += 30
      p.tranquilidade += 15
      p.urbanidade    -= 10
    } else if (priority === 'p2_neighborhood') {
      p.urbanidade  += 25
      p.maturidade  += 20
      p.centralidade += 15
    } else if (priority === 'p3_family') {
      p.familiar      += 30
      p.tranquilidade += 20
      p.espaco        += 15
    } else if (priority === 'p4_silence') {
      p.tranquilidade += 25
      p.espaco        += 10
      p.urbanidade    -= 10
    } else if (priority === 'p5_valuation') {
      p.valorizacao += 25
      p.maturidade  -= 15
      p.jovem       += 5
    } else if (priority === 'p6_youth') {
      p.jovem      += 25
      p.urbanidade += 20
      p.familiar   -= 10
    }
    // p7_none: no deltas
  }

  // Clamp a [0, 100]
  for (const attr of ATTRIBUTES) {
    p[attr] = clamp(p[attr])
  }

  return p as ZoneProfile
}
