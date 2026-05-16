/**
 * render.tsx — server entry for the prerender harness.
 *
 * Built by vite.ssr.config.ts into dist-ssr/render.mjs. The build scripts
 * (generate-sitemap.mjs, generate-static-shells.mjs) import this bundle
 * and use it to (a) discover what to prerender via the manifest, (b)
 * render each entry to a string.
 *
 * Constraints on anything imported transitively from this file:
 *   • No useEffect / useLayoutEffect.
 *   • No `window`, `document`, `localStorage`, `navigator` references.
 *   • No react-router hooks. Pages take props.
 *   • No Supabase, framer-motion, or other side-effect-heavy modules.
 *   • Inline `style={}` is fine; CSS classes are fine.
 */

import { renderToString } from 'react-dom/server'
import FreguesiaPage, { type FreguesiaPageProps } from '../pages/aml/FreguesiaPage'
import ConcelhoHub from '../pages/aml/ConcelhoHub'
import type { ConcelhoData } from '../data/aml/concelhos/_types'
import PillarPage, { type PillarPageProps } from '../pages/guias/PillarPage'
import { getFreguesia } from '../data/aml/freguesias'
import { getConcelhoHub, ALL_CONCELHO_SLUGS } from '../data/aml/concelhos'
import { getPillar } from '../data/guias'
import {
  prerenderManifest,
  type PrerenderEntry,
} from '../data/prerenderManifest'

export { prerenderManifest, ALL_CONCELHO_SLUGS }
export type { PrerenderEntry }

// ─── Freguesia ────────────────────────────────────────────────────────────────

export function renderFreguesia(props: FreguesiaPageProps): string {
  return renderToString(<FreguesiaPage {...props} />)
}

export function renderFreguesiaBySlug(
  concelhoSlug: string,
  freguesiaSlug: string,
): { html: string; props: FreguesiaPageProps } | null {
  const props = getFreguesia(concelhoSlug, freguesiaSlug)
  if (!props) return null
  return { html: renderFreguesia(props), props }
}

// ─── Concelho hub ────────────────────────────────────────────────────────────

export function renderConcelhoHub(data: ConcelhoData): string {
  return renderToString(<ConcelhoHub data={data} />)
}

export function renderConcelhoHubBySlug(
  concelhoSlug: string,
): { html: string; data: ConcelhoData } | null {
  const data = getConcelhoHub(concelhoSlug)
  if (!data) return null
  return { html: renderConcelhoHub(data), data }
}

// ─── Pillar ──────────────────────────────────────────────────────────────────

export function renderPillar(props: PillarPageProps): string {
  return renderToString(<PillarPage {...props} />)
}

export function renderPillarBySlug(
  slug: string,
): { html: string; props: PillarPageProps } | null {
  const props = getPillar(slug)
  if (!props) return null
  return { html: renderPillar(props), props }
}
