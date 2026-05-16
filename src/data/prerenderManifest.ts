/**
 * prerenderManifest.ts — single source of truth for what gets baked into
 * dist/<route>/index.html at build time AND what appears in dist/sitemap.xml.
 *
 * Rules:
 *   • A page lives in the manifest ONLY when its data is real (no
 *     {{DADO_EM_FALTA}} tokens visible to crawlers).
 *   • Both scripts/generate-sitemap.mjs and scripts/generate-static-shells.mjs
 *     read from here (via the SSR bundle).
 *   • Blog posts are NOT in this manifest — they're discovered by the
 *     existing MDX frontmatter readers. Manifest covers freguesia /
 *     pillar / comparison / hub pages only.
 *
 * To add a freguesia:
 *   1. Fill the data file (src/data/freguesias/<concelho>/<slug>.ts) with
 *      every numeric field — no {{DADO_EM_FALTA}} tokens remaining.
 *   2. Add the entry below.
 *   3. Run `npm run build` and verify the page appears in
 *      dist/aml/<concelho>/<slug>/index.html AND dist/sitemap.xml.
 */

export type PrerenderType =
  | 'aml-hub'         // /aml
  | 'concelho-hub'    // /aml/:concelho
  | 'freguesia'       // /aml/:concelho/:freguesia
  | 'pillar'          // /guias/:slug
  | 'comparison'      // /comparar/:a-vs-b

export type PrerenderChangefreq =
  | 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export interface PrerenderEntry {
  /** URL path beginning with `/`. */
  path: string
  /** ISO YYYY-MM-DD. Drives sitemap <lastmod>. */
  lastmod: string
  changefreq: PrerenderChangefreq
  /** Sitemap priority. String "0.0".."1.0". */
  priority: string
  type: PrerenderType
}

const TODAY = '2026-05-15'

const CONCELHO_SLUGS = [
  'lisboa',
  'cascais',
  'oeiras',
  'sintra',
  'loures',
  'mafra',
  'odivelas',
  'amadora',
  'vila-franca-de-xira',
  'almada',
  'seixal',
  'setubal',
  'barreiro',
  'moita',
  'montijo',
  'alcochete',
  'sesimbra',
  'palmela',
] as const

export const prerenderManifest: PrerenderEntry[] = [
  ...CONCELHO_SLUGS.map<PrerenderEntry>(slug => ({
    path: `/aml/${slug}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.8',
    type: 'concelho-hub',
  })),
  {
    path: '/guias/aml-nao-e-lisboa',
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.9',
    type: 'pillar',
  },
]
