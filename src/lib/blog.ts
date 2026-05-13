import type { ComponentType } from 'react'

// ─── Frontmatter (exported by remark-mdx-frontmatter, eager — metadata only) ──
const frontmatterModules = import.meta.glob(
  '../content/posts/**/*.mdx',
  { eager: true, import: 'frontmatter' }
)

// ─── Compiled MDX components (lazy — one chunk per post, loaded on demand) ────
const componentModules = import.meta.glob<{ default: ComponentType }>(
  '../content/posts/**/*.mdx'
)

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogPostFAQ {
  question: string
  answer: string
}

export interface BlogPostMeta {
  slug: string
  locale: 'pt' | 'en'
  draft?: boolean
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  author: string
  category: string
  tags: string[]
  heroImage: string
  heroImageAlt: string
  readingTime: number
  relatedPosts?: string[]
  faqs?: BlogPostFAQ[]
}

export interface BlogPost {
  meta: BlogPostMeta
  filePath: string
}

// ─── Draft helpers ────────────────────────────────────────────────────────────

/** True when running in the Vite dev server. */
const IS_DEV = import.meta.env.DEV

/**
 * Whether to include draft posts in this call.
 * - In dev: always show drafts (so you can edit them).
 * - In prod: never show drafts unless `includeDrafts` is explicitly true.
 */
function shouldShowDraft(meta: BlogPostMeta, includeDrafts: boolean): boolean {
  if (!meta.draft) return true          // not a draft → always show
  return IS_DEV || includeDrafts        // draft → only show in dev or when forced
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pathToLocale(filePath: string): string {
  const match = /\/posts\/([a-z]+)\//.exec(filePath)
  return match?.[1] ?? 'pt'
}

/** All posts for a given locale, sorted newest-first.
 *
 *  In production, draft posts are excluded by default.
 *  In dev, all posts are returned regardless of draft status.
 *  Pass `includeDrafts: true` to force-include drafts (e.g. preview mode).
 */
export function getPostsByLocale(
  locale: string,
  { includeDrafts = false }: { includeDrafts?: boolean } = {}
): BlogPost[] {
  return Object.entries(frontmatterModules)
    .filter(([path]) => pathToLocale(path) === locale)
    .map(([filePath, fm]) => {
      const meta = fm as BlogPostMeta
      return { meta, filePath }
    })
    .filter(p => Boolean(p.meta?.slug))
    .filter(p => shouldShowDraft(p.meta, includeDrafts))
    .sort(
      (a, b) =>
        new Date(b.meta.publishedAt).getTime() -
        new Date(a.meta.publishedAt).getTime()
    )
}

/** Single post by slug + locale.
 *
 *  Returns undefined (→ 404) when the post is draft and we're in production.
 */
export function getPostBySlug(
  slug: string,
  locale = 'pt',
  { includeDrafts = false }: { includeDrafts?: boolean } = {}
): BlogPost | undefined {
  return getPostsByLocale(locale, { includeDrafts }).find(p => p.meta.slug === slug)
}

/** Resolve a list of slugs to BlogPost objects (for related posts).
 *  Related posts obey the same draft rules as the listing.
 */
export function getRelatedPosts(
  slugs: string[],
  locale = 'pt',
  { includeDrafts = false }: { includeDrafts?: boolean } = {}
): BlogPost[] {
  const all = getPostsByLocale(locale, { includeDrafts })
  return slugs
    .map(slug => all.find(p => p.meta.slug === slug))
    .filter((p): p is BlogPost => Boolean(p))
}

/** Dynamically import the React component for a given file path. */
export async function loadPostComponent(filePath: string): Promise<ComponentType> {
  const loader = componentModules[filePath]
  if (!loader) throw new Error(`Post module not found: ${filePath}`)
  const mod = await loader()
  return mod.default
}

/** Human-readable category labels (PT). */
export const CATEGORY_LABELS: Record<string, string> = {
  'guia-do-comprador':   'Guia do Comprador',
  'financiamento':       'Financiamento',
  'zonas-lisboa':        'Zonas de Lisboa',
  'zonas-aml':           'Zonas da AML',
  'mercado':             'Mercado',
  'analise':             'Análise',
  'urbanismo':           'Urbanismo',
  'comparacoes':         'Comparações',
  'decisao-compra':      'Decisão de Compra',
}

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug
}
