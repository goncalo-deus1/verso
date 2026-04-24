// zones.ts — Unificador: exporta todas as zonas da AML com kind: 'freguesia' | 'concelho'
// Para estender: adicionar entradas em frequesiasLisboa.ts ou concelhosAML.ts — nunca aqui.

import { frequesiasLisboa } from './frequesiasLisboa'
import { concelhosAML } from './concelhosAML'
import type { ZoneProfile } from './attributes'

// TODO: ligar ao CRM via API em fase 2
export type Property = { id: string }

export type Zone = {
  slug: string
  name: string
  kind: 'freguesia' | 'concelho'
  concelho?: 'Lisboa'        // preenchido para kind === 'freguesia'
  margem?: 'norte' | 'sul'  // preenchido para kind === 'concelho'
  profile: ZoneProfile
  oneLine: string
  shortDescription: string
  signalProperty: string
  budgetFitT2: { min: number; max: number } | null
  properties: Property[]    // TODO: ligar ao CRM via API em fase 2
}

export const zones: Zone[] = [
  ...frequesiasLisboa.map(f => ({
    slug: f.slug,
    name: f.name,
    kind: 'freguesia' as const,
    concelho: f.concelho,
    profile: f.profile,
    oneLine: f.oneLine,
    shortDescription: f.shortDescription,
    signalProperty: f.signalProperty,
    budgetFitT2: f.budgetFitT2,
    properties: [] as Property[],
  })),
  ...concelhosAML.map(c => ({
    slug: c.slug,
    name: c.name,
    kind: 'concelho' as const,
    margem: c.margem,
    profile: c.profile,
    oneLine: c.oneLine,
    shortDescription: c.shortDescription,
    signalProperty: c.signalProperty,
    budgetFitT2: c.budgetFitT2,
    properties: [] as Property[],
  })),
]

/** Retorna o slug do grupo de diversidade de uma zona.
 *  Todas as freguesias pertencem ao grupo 'lisboa'.
 *  Cada concelho tem o seu próprio grupo (o próprio slug). */
export function getZoneConcelhoId(zone: Zone): string {
  return zone.kind === 'freguesia' ? 'lisboa' : zone.slug
}

/** Lookup rápido por slug. Retorna undefined se não encontrar. */
export function findZoneBySlug(slug: string): Zone | undefined {
  return zones.find(z => z.slug === slug)
}
