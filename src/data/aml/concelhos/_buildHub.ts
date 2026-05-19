/**
 * _buildHub.ts — factory for ConcelhoData per /aml/:concelho hub.
 *
 * Each data file (one per concelho) calls buildHub() with the few
 * fields that are concelho-specific:
 *   • slug
 *   • mdRaw       — raw MD content via Vite ?raw import
 *   • lede        — habitta-voice 2–4 sentences, numbers via fmtPrice/fmtPct
 *   • neighbors   — 4 concelho slugs for the INE comparison table
 *   • freguesias  — optional override; defaults to legacy parishes slugified
 *
 * The factory pulls INE 2025 numbers and the legacy concelho record
 * to derive subRegiao, canonical URL, and the freguesia list.
 */

import type { ConcelhoData, ConcelhoDataFreguesia, SubRegiaoNUTS } from './_types'
import { getConcelhoBySlug } from '../concelhos-aml-2025'
import { concelhosAML } from '../../concelhosAML'
import { parseConcelhoMd } from '../../../lib/concelhoMdSync'

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toUpperSubRegiao(s: 'Grande Lisboa' | 'Península de Setúbal'): SubRegiaoNUTS {
  return s === 'Grande Lisboa' ? 'GRANDE LISBOA' : 'PENÍNSULA DE SETÚBAL'
}

export interface BuildHubInput {
  slug: string
  /** Raw markdown in Portuguese. Required. */
  mdRaw: string
  /**
   * Optional raw markdown in English. When provided, the EN version is
   * pre-parsed and stored alongside the PT version so the consumer can
   * pick per-language at render time without any extra fetch.
   */
  mdRawEn?: string
  lede: string
  neighbors: string[]
  /** Optional override. Default: legacy parishes slugified, no microDesc. */
  freguesias?: ConcelhoDataFreguesia[]
  /** Override the auto-set updated date. */
  updated?: string
  /** Override nextReview (defaults to +90 days). */
  nextReview?: string
}

export function buildHub(input: BuildHubInput): ConcelhoData {
  const ine    = getConcelhoBySlug(input.slug)
  const legacy = concelhosAML.find(c => c.slug === input.slug)
  if (!ine)    throw new Error(`buildHub: INE row missing for slug=${input.slug}`)
  if (!legacy) throw new Error(`buildHub: legacy row missing for slug=${input.slug}`)

  const freguesias: ConcelhoDataFreguesia[] =
    input.freguesias ??
    legacy.parishes.map(name => ({ name, slug: slugify(name) }))

  return {
    slug: input.slug,
    canonicalUrl: `/aml/${input.slug}`,
    eyebrow: {
      kind: 'CONCELHO',
      subRegiao: toUpperSubRegiao(ine.subRegiao),
    },
    lede: input.lede,
    comparisonNeighbors: input.neighbors,
    freguesias,
    md:   parseConcelhoMd(input.mdRaw),
    mdEn: input.mdRawEn ? parseConcelhoMd(input.mdRawEn) : undefined,
    updated:    input.updated    ?? '2026-05-15',
    nextReview: input.nextReview ?? '2026-08-15',
  }
}
