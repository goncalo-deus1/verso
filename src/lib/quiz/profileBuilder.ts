// profileBuilder.ts — Converte respostas do quiz em perfil de utilizador (0–100 por dimensão)
// Q1, Q3, Q5, Q8, Q9 modificam o perfil. Q4, Q6, Q7 modificam apenas pesos (ver weights.ts).

import type { ZoneProfile } from '../../data/attributes'
import { ATTRIBUTES } from '../../data/attributes'
import type { QuizAnswers } from './questions'

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v))
}

export function buildProfile(answers: QuizAnswers): ZoneProfile {
  const p: Record<string, number> = {}
  for (const attr of ATTRIBUTES) p[attr] = 50  // neutro

  // Q1 — contexto (household)
  if (answers.q1_household === 'h1') {
    // Vivo sozinho
    p.jovem          += 15
    p.familiar       -= 20
    p.espaco         -= 15
    p.urbanidade     += 10
  } else if (answers.q1_household === 'h3') {
    // Casal com filhos
    p.familiar       += 25
    p.espaco         += 15
    p.tranquilidade  += 15
    p.jovem          -= 15
  } else if (answers.q1_household === 'h4') {
    // Família numerosa
    p.familiar       += 30
    p.espaco         += 30
    p.tranquilidade  += 20
    p.urbanidade     -= 15
  }
  // h2 casal: neutro

  // Q3 — estilo de vida
  if (answers.q3_lifestyle === 'l1') {
    // No centro, com tudo a pé
    p.centralidade   += 30
    p.urbanidade     += 25
    p.acessibilidade += 20
    p.espaco         -= 15
    p.tranquilidade  -= 15
  } else if (answers.q3_lifestyle === 'l2') {
    // Bairro residencial equilibrado
    p.maturidade     += 10
    p.tranquilidade  += 5
  } else if (answers.q3_lifestyle === 'l3') {
    // Tranquila e familiar
    p.familiar       += 25
    p.tranquilidade  += 25
    p.espaco         += 10
    p.urbanidade     -= 10
  } else if (answers.q3_lifestyle === 'l4') {
    // Perto do mar
    p.mar            += 35
    p.espaco         += 10
    p.tranquilidade  += 10
    p.centralidade   -= 15
  } else if (answers.q3_lifestyle === 'l5') {
    // Potencial de valorização
    p.valorizacao    += 30
    p.maturidade     -= 20
    p.jovem          += 10
  }

  // Q5 — tolerância de percurso
  if (answers.q5_commute === 'c1') {
    // Até 20 min
    p.acessibilidade += 25
    p.centralidade   += 15
  } else if (answers.q5_commute === 'c2') {
    // Até 35 min
    p.acessibilidade += 10
  } else if (answers.q5_commute === 'c4') {
    // Não é prioridade
    p.centralidade   -= 10
    p.espaco         += 10
  }
  // c3: neutro

  // Q8 — tipo de imóvel
  if (answers.q8_dwelling === 'd1') {
    // Apartamento
    p.urbanidade     += 10
    p.centralidade   += 5
  } else if (answers.q8_dwelling === 'd2') {
    // Moradia
    p.espaco         += 25
    p.urbanidade     -= 15
    p.centralidade   -= 10
  }
  // d3: neutro

  // Q9 — maturidade da zona
  if (answers.q9_maturity === 'm1') {
    // Consolidada e previsível
    p.maturidade     += 25
    p.valorizacao    -= 10
  } else if (answers.q9_maturity === 'm3') {
    // Em crescimento
    p.maturidade     -= 25
    p.valorizacao    += 25
    p.jovem          += 10
  }
  // m2: neutro

  // Clamp a [0, 100]
  for (const attr of ATTRIBUTES) {
    p[attr] = clamp(p[attr])
  }

  return p as ZoneProfile
}
