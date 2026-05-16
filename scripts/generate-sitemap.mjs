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

function toIsoDate(value) {
  if (!value) return NOW
  if (value instanceof Date) return value.toISOString().split('T')[0]
  return String(value).split('T')[0]
}

// ─── Static routes ────────────────────────────────────────────────────────────

const staticRoutes = [
  { url: '/',       changefreq: 'weekly',  priority: '1.0', lastmod: NOW },
  { url: '/quiz',   changefreq: 'monthly', priority: '0.9', lastmod: NOW },
  { url: '/blog',   changefreq: 'weekly',  priority: '0.8', lastmod: NOW },
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

// ─── Run ──────────────────────────────────────────────────────────────────────

await buildSitemap()
buildRobots()
