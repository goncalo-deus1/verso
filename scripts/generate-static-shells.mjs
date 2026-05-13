/**
 * generate-static-shells.mjs
 *
 * Runs after generate-sitemap.mjs (postbuild chain).
 *
 * Problem: Vite SPA serves the same dist/index.html for every route. Meta tags
 * (title, canonical, OG, JSON-LD) are injected by React Helmet only after JS
 * executes. AI crawlers and social-sharing bots that don't run JS see the
 * homepage meta on every URL.
 *
 * Solution: for each known route that has unique meta, write a physical
 * dist/[route]/index.html that is identical to dist/index.html EXCEPT for the
 * <head> meta block, which is overridden with route-specific values.
 *
 * Vercel serves static files before applying rewrites, so
 * dist/blog/melhores-zonas-.../index.html is returned directly to crawlers.
 * When JS loads, React mounts fresh (no hydration — <div id="root"> is empty)
 * and React Helmet writes the same values already in the static head. No flash,
 * no mismatch.
 *
 * Routes covered:
 *   /blog                → dist/blog/index.html
 *   /blog/:slug          → dist/blog/:slug/index.html  (non-draft only)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname }                                        from 'path'
import { fileURLToPath }                                        from 'url'
import matter                                                   from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, '..')
const DIST      = join(ROOT, 'dist')
const POSTS_PT  = join(ROOT, 'src', 'content', 'posts', 'pt')
const BASE_URL  = 'https://www.usehabitta.com'

// ─── HTML attribute escaping ───────────────────────────────────────────────────

function esc(str) {
  return String(str ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/"/g,  '&quot;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString().split('T')[0]
  if (value instanceof Date) return value.toISOString().split('T')[0]
  return String(value).split('T')[0]
}

// ─── Read all non-draft published posts ───────────────────────────────────────

function readPosts() {
  try {
    return readdirSync(POSTS_PT)
      .filter(f => f.endsWith('.mdx'))
      .map(file => {
        const raw = readFileSync(join(POSTS_PT, file), 'utf-8')
        return matter(raw).data
      })
      .filter(d => d.slug && d.publishedAt && !d.draft)
  } catch (e) {
    console.error('[shells] Could not read posts:', e.message)
    return []
  }
}

// ─── Meta block builders ──────────────────────────────────────────────────────

/**
 * Replaces the section between <!-- Canonical --> and <!-- Google Analytics -->.
 * Must end with a blank line so the GA comment keeps its preceding blank line.
 */
function postMetaBlock(post) {
  const url         = `${BASE_URL}/blog/${post.slug}`
  const title       = `${post.title} | Habitta`
  const publishedAt = toIsoDate(post.publishedAt)
  const updatedAt   = toIsoDate(post.updatedAt ?? post.publishedAt)

  return `    <!-- Canonical -->
    <link rel="canonical" href="${url}">

    <!-- Primary meta -->
    <meta name="description" content="${esc(post.description)}">
    <meta name="robots" content="index, follow">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(post.description)}">
    <meta property="og:image" content="${esc(post.heroImage)}">
    <meta property="og:locale" content="pt_PT">
    <meta property="og:site_name" content="habitta">
    <meta property="article:published_time" content="${publishedAt}">
    <meta property="article:modified_time" content="${updatedAt}">
    <meta property="article:author" content="${esc(post.author)}">

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(post.description)}">
    <meta name="twitter:image" content="${esc(post.heroImage)}">

    <!-- hreflang -->
    <link rel="alternate" hreflang="pt-pt" href="${url}">

`
}

function blogIndexMetaBlock() {
  const url         = `${BASE_URL}/blog`
  const title       = 'Blog — habitta'
  const description = 'Artigos sobre imobiliário, zonas e mercado na Área Metropolitana de Lisboa.'

  return `    <!-- Canonical -->
    <link rel="canonical" href="${url}">

    <!-- Primary meta -->
    <meta name="description" content="${esc(description)}">

    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:image" content="${BASE_URL}/og-image.png">
    <meta property="og:locale" content="pt_PT">
    <meta property="og:site_name" content="habitta">

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">
    <meta name="twitter:image" content="${BASE_URL}/og-image.png">

`
}

// ─── JSON-LD builders (mirrors BlogPost.tsx schemas exactly) ──────────────────

function buildJsonLd(post) {
  const url         = `${BASE_URL}/blog/${post.slug}`
  const publishedAt = toIsoDate(post.publishedAt)
  const updatedAt   = toIsoDate(post.updatedAt ?? post.publishedAt)

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:      post.title,
    description:   post.description,
    image:         post.heroImage,
    datePublished: publishedAt,
    dateModified:  updatedAt,
    author:        { '@type': 'Organization', name: post.author },
    publisher:     { '@type': 'Organization', name: 'Habitta', url: BASE_URL },
    inLanguage:    'pt-PT',
    url,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Habitta', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog',    item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  let ld = `    <script type="application/ld+json">${JSON.stringify(article)}</script>\n`
  ld    += `    <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n`

  if (Array.isArray(post.faqs) && post.faqs.length > 0) {
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    }
    ld += `    <script type="application/ld+json">${JSON.stringify(faq)}</script>\n`
  }

  return ld
}

// ─── HTML mutation ─────────────────────────────────────────────────────────────

// Matches from <!-- Canonical --> up to (but not including) the <title> line.
// The Twitter block is the last meta section; <title> immediately follows after
// a blank line. This anchor is robust to GA moving in/out of <head>.
const META_SECTION_RE = /[ \t]*<!-- Canonical -->[\s\S]*?(?=[ \t]*<title>)/

// Matches the <title> element (appears exactly once in <head>)
const TITLE_RE = /<title>[^<]*<\/title>/

function applyShell(baseHtml, metaBlock, title, jsonLd) {
  if (!META_SECTION_RE.test(baseHtml)) {
    throw new Error(
      'generate-static-shells: could not locate <!-- Canonical --> block in dist/index.html. ' +
      'If index.html structure changed, update META_SECTION_RE in this script.'
    )
  }
  if (!TITLE_RE.test(baseHtml)) {
    throw new Error('generate-static-shells: could not locate <title> in dist/index.html.')
  }

  let html = baseHtml
  html = html.replace(META_SECTION_RE, metaBlock)
  html = html.replace(TITLE_RE, `<title>${title}</title>`)
  if (jsonLd) {
    // Inject JSON-LD scripts right before </head>
    // dist/index.html uses 2-space indent for </head>
    html = html.replace('  </head>', `${jsonLd}  </head>`)
  }
  return html
}

// ─── Write helper ──────────────────────────────────────────────────────────────

function writeShell(relPath, content) {
  const dir      = join(DIST, relPath)
  const fullPath = join(dir, 'index.html')
  mkdirSync(dir, { recursive: true })
  writeFileSync(fullPath, content, 'utf-8')
  console.log(`[shells] → dist/${relPath}/index.html`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const baseHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')
  const posts    = readPosts()

  // /blog index shell
  const blogIndexHtml = applyShell(
    baseHtml,
    blogIndexMetaBlock(),
    'Blog — habitta',
    null,
  )
  writeShell('blog', blogIndexHtml)

  // /blog/:slug shell for each published non-draft post
  for (const post of posts) {
    const html = applyShell(
      baseHtml,
      postMetaBlock(post),
      `${post.title} | Habitta`,
      buildJsonLd(post),
    )
    writeShell(`blog/${post.slug}`, html)
  }

  console.log(`[shells] Done — ${1 + posts.length} shells written`)
}

main()
