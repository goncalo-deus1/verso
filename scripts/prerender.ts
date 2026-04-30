/**
 * scripts/prerender.ts
 *
 * Post-build step: generates one dist/concelho/[slug]/index.html per
 * concelho, with per-page <head> (title, meta description, canonical,
 * og:tags, JSON-LD) injected into the app-head placeholder.
 *
 * Run after `vite build`:
 *   npx tsx scripts/prerender.ts
 *
 * Or as part of the full build:
 *   npm run build:full
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const DIST      = path.join(ROOT, 'dist')
const TEMPLATE  = path.join(DIST, 'index.html')
const SITE_URL  = 'https://www.usehabitta.com'

// ── Import SEO data ───────────────────────────────────────────────────────────
// We import from the compiled source. tsx handles TypeScript imports.
const { concelhosSEO } = await import('../src/data/concelhosSEO.js') as typeof import('../src/data/concelhosSEO')

// ── Helpers ───────────────────────────────────────────────────────────────────

const IMAGES_WITH_FILE: Record<string, string> = {
  alcochete:          '/concelhos/alcochete.jpg',
  almada:             '/concelhos/almada.jpg',
  amadora:            '/concelhos/amadora.jpg',
  barreiro:           '/concelhos/barreiro.jpg',
  lisboa:             '/concelhos/lisboa.jpg',
  loures:             '/concelhos/loures.jpg',
  moita:              '/concelhos/moita.jpg',
  montijo:            '/concelhos/montijo.jpg',
  odivelas:           '/concelhos/odivelas.jpg',
  palmela:            '/concelhos/palmela.jpg',
  seixal:             '/concelhos/seixal.jpg',
  setubal:            '/concelhos/setubal.jpg',
  'vila-franca-de-xira': '/concelhos/vila-franca-de-xira.jpg',
}

function ogImage(slug: string): string {
  const local = IMAGES_WITH_FILE[slug]
  return local ? `${SITE_URL}${local}` : `${SITE_URL}/og-image.png`
}

function buildHead(entry: typeof concelhosSEO[number]): string {
  const { slug, title, metaDescription, canonical, lastUpdated, jsonLd } = entry
  const image = ogImage(slug)

  // BreadcrumbList JSON-LD
  const breadcrumb = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Concelhos', item: `${SITE_URL}/concelhos` },
      { '@type': 'ListItem', position: 3, name: slug, item: canonical },
    ],
  })

  // Article JSON-LD wrapper
  const articleLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    dateModified: lastUpdated,
    datePublished: lastUpdated,
    publisher: {
      '@type': 'Organization',
      name: 'habitta',
      url: SITE_URL,
    },
    url: canonical,
  })

  const lines = [
    `  <title>${escHtml(title)}</title>`,
    `  <meta name="description" content="${escAttr(metaDescription)}">`,
    `  <link rel="canonical" href="${escAttr(canonical)}">`,
    `  <meta property="og:type" content="article">`,
    `  <meta property="og:title" content="${escAttr(title)}">`,
    `  <meta property="og:description" content="${escAttr(metaDescription)}">`,
    `  <meta property="og:url" content="${escAttr(canonical)}">`,
    `  <meta property="og:image" content="${escAttr(image)}">`,
    `  <meta property="og:locale" content="pt_PT">`,
    `  <meta property="og:site_name" content="habitta">`,
    `  <meta name="twitter:card" content="summary_large_image">`,
    `  <meta name="twitter:title" content="${escAttr(title)}">`,
    `  <meta name="twitter:description" content="${escAttr(metaDescription)}">`,
    `  <meta name="twitter:image" content="${escAttr(image)}">`,
    `  <script type="application/ld+json">${jsonLd}</script>`,
    `  <script type="application/ld+json">${breadcrumb}</script>`,
    `  <script type="application/ld+json">${articleLd}</script>`,
  ]

  return lines.join('\n')
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function escAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

// ── Main ──────────────────────────────────────────────────────────────────────

if (!fs.existsSync(TEMPLATE)) {
  console.error(`ERROR: ${TEMPLATE} not found. Run 'npm run build' first.`)
  process.exit(1)
}

const rawTemplate = fs.readFileSync(TEMPLATE, 'utf-8')

// Strip the generic fallback tags from the template so per-page tags
// don't duplicate them. We identify them by the comment markers in index.html.
// The pattern removes title, description, canonical, og:, twitter: fallbacks.
function stripFallbackTags(html: string): string {
  return html
    // <title>...</title>
    .replace(/<title>[^<]*<\/title>\s*/gi, '')
    // <meta name="description" ...>
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    // <link rel="canonical" ...>
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    // <meta property="og:..." ...>
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
    // <meta name="twitter:..." ...>
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '')
}

const template = stripFallbackTags(rawTemplate)

let count = 0

for (const entry of concelhosSEO) {
  const { slug } = entry
  const head     = buildHead(entry)

  // Inject into template: replace <!--app-head--> placeholder
  const html = template.replace('    <!--app-head-->', head)

  // Write to dist/concelho/[slug]/index.html
  const dir = path.join(DIST, 'concelho', slug)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8')

  console.log(`  OK  /concelho/${slug}`)
  count++
}

console.log(`\nPrerendered ${count} pages in dist/concelho/`)
