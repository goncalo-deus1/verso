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

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
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

// ─── Build sitemap ────────────────────────────────────────────────────────────

function buildSitemap() {
  const ptPosts = readBlogPosts(POSTS_PT)

  const blogUrls = ptPosts.map(post => ({
    url:        `/blog/${post.slug}`,
    changefreq: 'monthly',
    priority:   '0.7',
    lastmod:    toIsoDate(post.updatedAt ?? post.publishedAt ?? NOW),
  }))

  const allUrls = [...staticRoutes, ...blogUrls]

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
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`
  writeFileSync(join(DIST, 'robots.txt'), robots, 'utf-8')
  console.log('[sitemap] Generated → dist/robots.txt')
}

// ─── Run ──────────────────────────────────────────────────────────────────────

buildSitemap()
buildRobots()
