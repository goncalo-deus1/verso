// tradeoffs.ts — Dicionário de trade-offs por atributo e direção
// Gerado automaticamente a partir do perfil do utilizador vs. perfil da zona.
// Para adicionar atributos: acrescentar entrada aqui — nunca escrever trade-offs à mão por zona.

import type { Attribute } from '../../data/attributes'
import { ATTRIBUTES, ATTRIBUTE_LABELS } from '../../data/attributes'
import type { ZoneProfile } from '../../data/attributes'
import type { Weights } from './weights'

type TradeoffEntry = {
  high_to_low: string  // utilizador quer muito, zona tem pouco
  low_to_high: string  // utilizador quer pouco, zona tem muito
}

const tradeoffs: Record<Attribute, TradeoffEntry> = {
  centralidade: {
    high_to_low: 'Menos central do que preferias — és um percurso de transportes, não um passo, do centro.',
    low_to_high: 'Mais central do que pediste — há mais movimento e ruído à volta do que esperavas.',
  },
  urbanidade: {
    high_to_low: 'Menos densa e urbana do que idealmente — mais subúrbio do que cidade.',
    low_to_high: 'Mais urbana e densa do que pediste — a vida de rua é intensa.',
  },
  tranquilidade: {
    high_to_low: 'Menos calma do que ideal — é uma zona viva, e isso nota-se todos os dias.',
    low_to_high: 'Mais calma do que esperavas — terás de te deslocar para encontrar a azáfama.',
  },
  familiar: {
    high_to_low: 'Menos pensada para famílias com crianças do que gostavas — infraestrutura e escala de bairro são diferentes.',
    low_to_high: 'Zona muito familiar — excelente para crianças, menos animada para outros.',
  },
  jovem: {
    high_to_low: 'Perfil mais envelhecido do que pediste — menos dinamismo jovem, mais estabilidade.',
    low_to_high: 'Bairro com muita população jovem e em transição — energia e alguma rotatividade.',
  },
  acessibilidade: {
    high_to_low: 'Precisas de carro para a maioria das deslocações — os transportes não chegam a toda a hora.',
    low_to_high: 'Bem ligado em transportes públicos — mesmo que não fosse prioridade, é uma vantagem real.',
  },
  mar: {
    high_to_low: 'Longe do mar — terás de te deslocar para o ver.',
    low_to_high: 'Junto ao mar — vantagem se um dia mudares de ideias sobre o estilo de vida costeiro.',
  },
  espaco: {
    high_to_low: 'Menos espaço do que zonas mais periféricas — os metros quadrados custam mais aqui.',
    low_to_high: 'Tens mais espaço do que pediste — e pagas por ele, mas pode valer a pena.',
  },
  maturidade: {
    high_to_low: 'Zona em transformação — em cinco anos vai parecer outra, para bem ou para mal.',
    low_to_high: 'Bairro consolidado — menos surpresas mas também menos potencial de mudança rápida.',
  },
  valorizacao: {
    high_to_low: 'É estável — não é onde o mercado está a subir mais depressa.',
    low_to_high: 'Zona em pressão de valorização — o custo de entrada pode subir mais depressa do que planeaste.',
  },
}

/** Devolve o atributo onde a diferença é maior E o utilizador valoriza
 *  (user value ≥ 60 ou peso ≥ 1.3). */
export function getTradeoff(
  userProfile: ZoneProfile,
  zoneProfile: ZoneProfile,
  weights: Weights,
): string {
  let worstAttr: Attribute = ATTRIBUTES[0]
  let worstScore = -1

  for (const attr of ATTRIBUTES) {
    const diff = Math.abs(userProfile[attr] - zoneProfile[attr])
    const userCaresAboutIt = userProfile[attr] >= 60 || weights[attr] >= 1.3
    if (userCaresAboutIt && diff > worstScore) {
      worstScore = diff
      worstAttr  = attr
    }
  }

  // Se nenhum atributo com diff relevante, usa o pior absoluto
  if (worstScore < 0) {
    for (const attr of ATTRIBUTES) {
      const diff = Math.abs(userProfile[attr] - zoneProfile[attr])
      if (diff > worstScore) { worstScore = diff; worstAttr = attr }
    }
  }

  const direction = userProfile[worstAttr] > zoneProfile[worstAttr] ? 'high_to_low' : 'low_to_high'
  return tradeoffs[worstAttr][direction]
}

/** Devolve string "Alinha em X, Y e Z." com os 3 atributos de menor diferença
 *  entre user e zona onde o peso ≥ 1.0. */
export function getJustification(
  userProfile: ZoneProfile,
  zoneProfile: ZoneProfile,
  weights: Weights,
): string {
  const candidates = ATTRIBUTES
    .filter(attr => weights[attr] >= 1.0)
    .map(attr => ({ attr, diff: Math.abs(userProfile[attr] - zoneProfile[attr]) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3)

  if (candidates.length < 2) {
    return 'Alinha bem com o perfil que indicaste.'
  }

  const labels = candidates.map(c => ATTRIBUTE_LABELS[c.attr])
  if (labels.length === 2) return `Alinha em ${labels[0]} e ${labels[1]}.`
  return `Alinha em ${labels[0]}, ${labels[1]} e ${labels[2]}.`
}
