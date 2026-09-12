/**
 * generate-sitemap.mjs
 *
 * Runs after `vite build` (via postbuild script).
 * Reads all .mdx files in src/content/posts/pt/, extracts frontmatter with
 * gray-matter, and generates dist/sitemap.xml + dist/robots.txt.
 *
 * To add a new locale in the future, replicate the pt block for 'en'
 * and add the corresponding hreflang entries.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, '..')
const DIST      = join(ROOT, 'dist')
const POSTS_PT  = join(ROOT, 'src', 'content', 'posts', 'pt')

const BASE_URL  = 'https://www.usehabitta.com'
const NOW       = new Date().toISOString().split('T')[0]

const pathLabels = {
  'aml-nao-e-lisboa': 'A AML nao e Lisboa',
  setubal: 'Setúbal',
  'vila-franca-de-xira': 'Vila Franca de Xira',
}

function toIsoDate(value) {
  if (!value) return NOW
  if (value instanceof Date) return value.toISOString().split('T')[0]
  return String(value).split('T')[0]
}

function titleFromSlug(slug) {
  if (pathLabels[slug]) return pathLabels[slug]
  return String(slug)
    .split('-')
    .map(part => part ? part[0].toUpperCase() + part.slice(1) : part)
    .join(' ')
}

// ─── Static routes ────────────────────────────────────────────────────────────

const staticRoutes = [
  { url: '/',       changefreq: 'weekly',  priority: '1.0', lastmod: NOW },
  { url: '/quiz',   changefreq: 'monthly', priority: '0.9', lastmod: NOW },
  { url: '/blog',   changefreq: 'weekly',  priority: '0.8', lastmod: NOW },
  { url: '/blog/guia-do-comprador', changefreq: 'monthly', priority: '0.9', lastmod: '2026-05-26' },
  { url: '/ferramentas', changefreq: 'monthly', priority: '0.8', lastmod: NOW },
  { url: '/ferramentas/calculadora-credito-habitacao', changefreq: 'monthly', priority: '0.8', lastmod: '2026-05-26' },
  { url: '/ferramentas/calculadora-entrada-necessaria', changefreq: 'monthly', priority: '0.8', lastmod: NOW },
  { url: '/areas',  changefreq: 'monthly', priority: '0.7', lastmod: NOW },
  { url: '/sobre',  changefreq: 'yearly',  priority: '0.4', lastmod: NOW },
]

// ─── Read blog posts ───────────────────────────────────────────────────────────

function readBlogPosts(dir) {
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.mdx'))
      .map(file => {
        const raw = readFileSync(join(dir, file), 'utf-8')
        const { data } = matter(raw)
        return data
      })
      .filter(d => d.slug && d.publishedAt && !d.draft)
  } catch {
    return []
  }
}

// ─── Read prerender manifest (freguesia / pillar / comparison / hubs) ────────

async function readManifest() {
  const ssrPath = join(ROOT, 'dist-ssr', 'render.mjs')
  if (!existsSync(ssrPath)) {
    console.warn('[sitemap] dist-ssr/render.mjs not found — manifest entries skipped.')
    return []
  }
  const mod = await import(pathToFileURL(ssrPath).href)
  return Array.isArray(mod.prerenderManifest) ? mod.prerenderManifest : []
}

/**
 * Concelho hubs: all 18 are sitemap-listable regardless of manifest. The
 * manifest controls *prerender* (whether the body is baked into dist/).
 * The sitemap controls *discoverability* — these URLs exist as routes
 * with full data and benefit from being crawled.
 */
async function readConcelhoSlugs() {
  const ssrPath = join(ROOT, 'dist-ssr', 'render.mjs')
  if (!existsSync(ssrPath)) return []
  const mod = await import(pathToFileURL(ssrPath).href)
  return Array.isArray(mod.ALL_CONCELHO_SLUGS) ? mod.ALL_CONCELHO_SLUGS : []
}

// ─── Build sitemap ────────────────────────────────────────────────────────────

async function buildSitemap() {
  const ptPosts        = readBlogPosts(POSTS_PT)
  const manifest       = await readManifest()
  const concelhoSlugs  = await readConcelhoSlugs()

  const blogUrls = ptPosts.map(post => ({
    url:        `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority:   '0.7',
    lastmod:    toIsoDate(post.updatedAt ?? post.publishedAt ?? NOW),
  }))

  const concelhoUrls = concelhoSlugs.map(slug => ({
    url:        `/aml/${slug}`,
    changefreq: 'monthly',
    priority:   '0.8',
    lastmod:    NOW,
  }))

  const manifestUrls = manifest.map(entry => ({
    url:        entry.path,
    changefreq: entry.changefreq,
    priority:   entry.priority,
    lastmod:    toIsoDate(entry.lastmod),
  }))

  // De-dup: manifest may also list /aml/<slug> later — keep concelhoUrls as primary.
  const concelhoUrlSet = new Set(concelhoUrls.map(e => e.url))
  const dedupedManifest = manifestUrls.filter(e => !concelhoUrlSet.has(e.url))

  const allUrls = [
    ...staticRoutes,
    ...concelhoUrls,
    ...blogUrls,
    ...dedupedManifest,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
  .map(
    entry => `  <url>
    <loc>${BASE_URL}${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
    <xhtml:link rel="alternate" hreflang="pt-pt" href="${BASE_URL}${entry.url}"/>
  </url>`
  )
  .join('\n')}
</urlset>`

  writeFileSync(join(DIST, 'sitemap.xml'), xml, 'utf-8')
  console.log(`[sitemap] Generated ${allUrls.length} URLs → dist/sitemap.xml`)
}

// ─── Build robots.txt ─────────────────────────────────────────────────────────

function buildRobots() {
  // Mirrors public/robots.txt. Kept in sync manually — both must list the
  // same AI crawlers. The public/ copy is what Vite serves in dev; this
  // overwrites it in the production build with the same content.
  const aiBots = [
    'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
    'ClaudeBot', 'Claude-Web', 'anthropic-ai',
    'PerplexityBot', 'Perplexity-User',
    'Google-Extended', 'CCBot', 'Bytespider', 'Amazonbot',
    'Applebot-Extended', 'Meta-ExternalAgent',
  ]
  const aiBlock = aiBots.map(b => `User-agent: ${b}\nAllow: /\n`).join('\n')
  const robots = `# habitta — robots.txt
# AI crawlers are explicitly allowed.

${aiBlock}
User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`
  writeFileSync(join(DIST, 'robots.txt'), robots, 'utf-8')
  console.log('[sitemap] Generated → dist/robots.txt')
}

async function buildLlmsTxt() {
  const posts = readBlogPosts(POSTS_PT)
  const manifest = await readManifest()
  const concelhoSlugs = await readConcelhoSlugs()

  const postLines = posts
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .map(post => `- [${post.title}](${BASE_URL}/blog/${post.slug}): ${post.description}`)

  const concelhoLines = concelhoSlugs
    .map(slug => `- [${titleFromSlug(slug)}](${BASE_URL}/aml/${slug}): Concelho hub with buyer-fit context, area tradeoffs and local real estate signals.`)

  const guideLines = manifest
    .filter(entry => entry.type === 'pillar')
    .map(entry => {
      const slug = entry.path.split('/').filter(Boolean).at(-1)
      return `- [${titleFromSlug(slug)}](${BASE_URL}${entry.path}): Long-form guide for choosing where to live in the Lisbon Metropolitan Area.`
    })

  const content = `# habitta

> Editorial real estate discovery for the Lisbon Metropolitan Area.
> Pick the zone before the house. Data-driven, sourced, opinionated.

## Core
- [Início](${BASE_URL}/): The 2-minute zone quiz and main entry point for buyers.
- [Quiz](${BASE_URL}/quiz): Preference quiz for matching a buyer profile to AML zones.
- [Sobre](${BASE_URL}/sobre): Methodology behind habitta's recommendations.

## Tools
- [Ferramentas](${BASE_URL}/ferramentas): Home for buyer calculators.
- [Calculadora de credito habitacao](${BASE_URL}/ferramentas/calculadora-credito-habitacao): Monthly mortgage payment estimator for Portugal.
- [Calculadora de entrada necessaria](${BASE_URL}/ferramentas/calculadora-entrada-necessaria): Upfront cash and savings estimator for buying in Portugal.

## Guias
${guideLines.length ? guideLines.join('\n') : '- Guides are added as they ship under /guias/:slug.'}

## AML
${concelhoLines.length ? concelhoLines.join('\n') : '- AML concelho hubs ship under /aml/:concelho.'}

## Blog
${postLines.length ? postLines.join('\n') : '- Published editorial posts ship under /blog/:slug.'}

## Machine-readable files
- [Sitemap](${BASE_URL}/sitemap.xml): Canonical crawl map.
- [Robots](${BASE_URL}/robots.txt): Crawl permissions, including explicit AI crawler allow rules.
`

  writeFileSync(join(DIST, 'llms.txt'), content, 'utf-8')
  console.log('[sitemap] Generated → dist/llms.txt')
}

// ─── Run ──────────────────────────────────────────────────────────────────────

await buildSitemap()
buildRobots()
await buildLlmsTxt()
