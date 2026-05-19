// tradeoffs.ts — Tiered tradeoff vocabulary + generator
// Architecture: gap-based confidence tiers (high / medium / low / none)
// Only "high" tier renders in the UI until per-concelho overrides populate "medium".

import type { ZoneProfile } from '../../data/attributes'
import { ATTRIBUTES, ATTRIBUTE_LABELS, ATTRIBUTE_LABELS_EN } from '../../data/attributes'
import type { Weights } from './weights'
import type { ConcelhoAML } from '../../data/concelhosAML'

export type Lang = 'pt' | 'en'

// ─── Confidence types ─────────────────────────────────────────────────────────

export type TradeoffConfidence = 'high' | 'medium' | 'low' | 'none'

export interface TradeoffResult {
  sentence:   string | null
  confidence: TradeoffConfidence
  attribute:  keyof ZoneProfile | null
  gap:        number   // absolute gap value, for debugging
}

// ─── Tiered vocabulary ────────────────────────────────────────────────────────
// high:   gap ≥ 70 — mismatch severe, generic sentence factually defensible
// medium: gap 40–69 — intentionally empty; requires per-concelho override
// low:    gap 20–39 — intentionally empty; never renders

export const tradeoffVocabulary: Record<
  keyof ZoneProfile,
  { high: string[]; medium: string[]; low: string[] }
> = {
  mar: {
    high: [
      'Longe do mar. Aqui não há praia.',
      'Interior completo — o mar fica a mais de meia hora de carro.',
    ],
    medium: [],
    low: [],
  },
  centralidade: {
    high: [
      'Periferia. A cidade fica longe no dia a dia.',
      'Fora do centro. Para quem quer movimento, é muito silêncio.',
    ],
    medium: [],
    low: [],
  },
  urbanidade: {
    high: [
      'Ritmo rural ou quase. Pouca vida de rua.',
      'Aqui a vida é doméstica — a rua não faz o entretenimento.',
    ],
    medium: [],
    low: [],
  },
  tranquilidade: {
    high: [
      'Zona animada. Quem procura sossego, não vem por aqui.',
      'Nível sonoro urbano alto — trânsito, esplanadas, gente.',
    ],
    medium: [],
    low: [],
  },
  familiar: {
    high: [
      'Perfil menos familiar — parques e equipamentos infantis escasseiam.',
      'Pouco virada para famílias com crianças.',
    ],
    medium: [],
    low: [],
  },
  jovem: {
    high: [
      'Demografia madura. Vida nocturna e cultural limitadas.',
      'Poucos jovens — a energia está noutro sítio.',
    ],
    medium: [],
    low: [],
  },
  acessibilidade: {
    high: [
      'Transportes públicos fracos. Precisas de carro quase sempre.',
      'A rede de transportes não chega a toda a hora.',
    ],
    medium: [],
    low: [],
  },
  espaco: {
    high: [
      'Oferta concentrada em tipologias compactas — estúdios e T1.',
      'Pouco espaço exterior — varandas e quintais são raros.',
    ],
    medium: [],
    low: [],
  },
  maturidade: {
    high: [
      'Zona ainda em transformação — conta com obras nos próximos anos.',
      'Tecido urbano em formação. Nem tudo está consolidado.',
    ],
    medium: [],
    low: [],
  },
  valorizacao: {
    high: [
      'Potencial de valorização modesto face a outras zonas da AML.',
      'Mercado relativamente estável — pouco upside esperado.',
    ],
    medium: [],
    low: [],
  },
}

// Same shape, EN strings. Indexed positionally with the PT pool so that the
// same Math.random() pick gives the same sentence in both languages.
export const tradeoffVocabularyEn: Record<
  keyof ZoneProfile,
  { high: string[]; medium: string[]; low: string[] }
> = {
  mar: {
    high: [
      'Far from the sea. No beach here.',
      'Fully inland — the sea is over half an hour by car.',
    ],
    medium: [],
    low: [],
  },
  centralidade: {
    high: [
      'On the periphery. The city is far in daily life.',
      'Outside the centre. For anyone who wants buzz, it is too quiet.',
    ],
    medium: [],
    low: [],
  },
  urbanidade: {
    high: [
      'A rural rhythm, or close to it. Little street life.',
      'Life here is domestic — the street is not the entertainment.',
    ],
    medium: [],
    low: [],
  },
  tranquilidade: {
    high: [
      'A lively area. Anyone looking for quiet should look elsewhere.',
      'High urban soundscape — traffic, terraces, people.',
    ],
    medium: [],
    low: [],
  },
  familiar: {
    high: [
      'Less family-oriented — parks and child amenities are scarce.',
      'Not particularly geared towards families with young children.',
    ],
    medium: [],
    low: [],
  },
  jovem: {
    high: [
      'Mature demographic. Nightlife and cultural offer are limited.',
      'Few young people — the energy is somewhere else.',
    ],
    medium: [],
    low: [],
  },
  acessibilidade: {
    high: [
      'Weak public transport. You will need a car most of the time.',
      'The transport network does not run around the clock.',
    ],
    medium: [],
    low: [],
  },
  espaco: {
    high: [
      'Supply concentrated in compact typologies — studios and 1-bedroom flats.',
      'Little outdoor space — balconies and gardens are rare.',
    ],
    medium: [],
    low: [],
  },
  maturidade: {
    high: [
      'An area still being shaped — expect construction over the coming years.',
      'Urban fabric in formation. Not everything is consolidated.',
    ],
    medium: [],
    low: [],
  },
  valorizacao: {
    high: [
      'Modest appreciation potential compared to other parts of AML.',
      'A relatively stable market — limited upside expected.',
    ],
    medium: [],
    low: [],
  },
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function getTradeoff(
  userProfile: ZoneProfile,
  zoneProfile: ZoneProfile,
  weights: Weights,
  concelho: ConcelhoAML | undefined,
  lang: Lang = 'pt',
): TradeoffResult {
  const userCaresAboutIt = (attr: keyof ZoneProfile) =>
    userProfile[attr] >= 60 || weights[attr] >= 1.3

  let worstAttribute: keyof ZoneProfile | null = null
  let worstGap = 0

  for (const attr of Object.keys(userProfile) as (keyof ZoneProfile)[]) {
    if (!userCaresAboutIt(attr)) continue
    const gap = userProfile[attr] - zoneProfile[attr]
    if (gap > worstGap) {
      worstGap = gap
      worstAttribute = attr
    }
  }

  if (!worstAttribute || worstGap < 20) {
    return { sentence: null, confidence: 'none', attribute: null, gap: worstGap }
  }

  const tier: TradeoffConfidence =
    worstGap >= 70 ? 'high' : worstGap >= 40 ? 'medium' : 'low'

  // Per-concelho override is PT-only (data layer); only used when lang === 'pt'.
  // EN always falls through to the generic vocabulary. Acceptable trade-off:
  // overrides are rare and editorial; not worth duplicating until they grow.
  const override = concelho?.tradeoffOverrides?.[worstAttribute]
  if (lang === 'pt') {
    if (tier === 'high' && override?.high) {
      return { sentence: override.high, confidence: 'high', attribute: worstAttribute, gap: worstGap }
    }
    if (tier === 'medium' && override?.medium) {
      return { sentence: override.medium, confidence: 'medium', attribute: worstAttribute, gap: worstGap }
    }
  }

  // Fall back to generic vocabulary in the active language.
  const vocab = lang === 'en' ? tradeoffVocabularyEn : tradeoffVocabulary
  const pool = vocab[worstAttribute][tier]
  if (pool.length === 0) {
    return { sentence: null, confidence: tier, attribute: worstAttribute, gap: worstGap }
  }

  const sentence = pool[Math.floor(Math.random() * pool.length)]
  return { sentence, confidence: tier, attribute: worstAttribute, gap: worstGap }
}

// ─── Justification (unchanged) ────────────────────────────────────────────────

/** Devolve string "Alinha em X, Y e Z." com os 3 atributos de menor diferença
 *  entre user e zona onde o peso ≥ 1.0. */
export function getJustification(
  userProfile: ZoneProfile,
  zoneProfile: ZoneProfile,
  weights: Weights,
  lang: Lang = 'pt',
): string {
  const candidates = ATTRIBUTES
    .filter(attr => weights[attr] >= 1.0)
    .map(attr => ({ attr, diff: Math.abs(userProfile[attr] - zoneProfile[attr]) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3)

  const labelDict = lang === 'en' ? ATTRIBUTE_LABELS_EN : ATTRIBUTE_LABELS

  if (candidates.length < 2) {
    return lang === 'en'
      ? 'A strong match for the profile you described.'
      : 'Alinha bem com o perfil que indicaste.'
  }

  const labels = candidates.map(c => labelDict[c.attr])
  if (lang === 'en') {
    if (labels.length === 2) return `Aligns on ${labels[0]} and ${labels[1]}.`
    return `Aligns on ${labels[0]}, ${labels[1]} and ${labels[2]}.`
  }
  if (labels.length === 2) return `Alinha em ${labels[0]} e ${labels[1]}.`
  return `Alinha em ${labels[0]}, ${labels[1]} e ${labels[2]}.`
}
