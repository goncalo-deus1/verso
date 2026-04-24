// tradeoffs.ts — Tiered tradeoff vocabulary + generator
// Architecture: gap-based confidence tiers (high / medium / low / none)
// Only "high" tier renders in the UI until per-concelho overrides populate "medium".

import type { ZoneProfile } from '../../data/attributes'
import { ATTRIBUTES, ATTRIBUTE_LABELS } from '../../data/attributes'
import type { Weights } from './weights'
import type { ConcelhoAML } from '../../data/concelhosAML'

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

// ─── Generator ────────────────────────────────────────────────────────────────

export function getTradeoff(
  userProfile: ZoneProfile,
  zoneProfile: ZoneProfile,
  weights: Weights,
  concelho: ConcelhoAML | undefined,
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

  // Try per-concelho override first
  const override = concelho?.tradeoffOverrides?.[worstAttribute]
  if (tier === 'high' && override?.high) {
    return { sentence: override.high, confidence: 'high', attribute: worstAttribute, gap: worstGap }
  }
  if (tier === 'medium' && override?.medium) {
    return { sentence: override.medium, confidence: 'medium', attribute: worstAttribute, gap: worstGap }
  }

  // Fall back to generic vocabulary
  const pool = tradeoffVocabulary[worstAttribute][tier]
  if (pool.length === 0) {
    // No sentence available at this tier — fail closed
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
