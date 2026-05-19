import { useEffect, useState, useRef, useCallback, type ComponentType } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MDXProvider } from '@mdx-js/react'
import { ArrowLeft } from 'lucide-react'
import {
  getPostBySlug,
  getRelatedPosts,
  loadPostComponent,
  categoryLabel,
  type BlogPostMeta,
  type BlogPost,
} from '../../lib/blog'
import { BlogPostMetaProvider } from '../../lib/blogContext'
import { HabittaCallout } from '../../components/blog/HabittaCallout'
import { DataTable } from '../../components/blog/DataTable'
import { ZoneCard } from '../../components/blog/ZoneCard'
import { ComparisonBox } from '../../components/blog/ComparisonBox'
import { MapEmbed } from '../../components/blog/MapEmbed'
import { FAQ } from '../../components/blog/FAQ'
import { Sources } from '../../components/blog/Sources'
import { useLangSafe, type Lang } from '../../context/LanguageContext'
import { useT } from '../../i18n/translations'

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://www.usehabitta.com'
const INK      = '#1E1F18'
const CLAY     = '#C2553A'
const BONE     = '#F2EDE4'
const SAND     = '#E8E0D0'

// ─── MDX component map ────────────────────────────────────────────────────────

function makeSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const mdxComponents = {
  HabittaCallout,
  DataTable,
  ZoneCard,
  ComparisonBox,
  MapEmbed,
  FAQ,
  Sources,

  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="font-display"
      style={{
        fontSize: 'clamp(30px, 4vw, 46px)',
        letterSpacing: '-1.2px',
        lineHeight: '1.08',
        color: INK,
        margin: '0 0 36px',
        fontWeight: 400,
      }}
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof props.children === 'string' ? props.children : ''
    const id = makeSlug(text)
    return (
      <h2
        id={id}
        className="font-display"
        style={{
          fontSize: 'clamp(22px, 2.6vw, 32px)',
          letterSpacing: '-0.6px',
          lineHeight: '1.18',
          color: INK,
          margin: '64px 0 20px',
          fontWeight: 400,
          scrollMarginTop: '96px',
        }}
        {...props}
      />
    )
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-display"
      style={{
        fontSize: 'clamp(18px, 1.8vw, 22px)',
        letterSpacing: '-0.2px',
        lineHeight: '1.28',
        color: INK,
        margin: '44px 0 14px',
        fontWeight: 500,
      }}
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      style={{
        fontSize: '17px',
        color: '#2A2B24',
        lineHeight: '1.85',
        marginBottom: '26px',
        letterSpacing: '0.01em',
      }}
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      style={{
        borderLeft: `3px solid ${CLAY}`,
        paddingLeft: '24px',
        margin: '40px 0',
        fontStyle: 'italic',
        color: INK,
        fontSize: '19px',
        lineHeight: '1.72',
      }}
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul style={{ margin: '0 0 28px', paddingLeft: 0, listStyle: 'none' }} {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol style={{ margin: '0 0 28px', paddingLeft: '24px' }} {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      style={{
        padding: '10px 0 10px 28px',
        position: 'relative',
        fontSize: '16px',
        color: '#2A2B24',
        lineHeight: '1.65',
        borderBottom: '1px solid rgba(30,31,24,0.07)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 0,
          color: CLAY,
          fontSize: '9px',
          top: '15px',
        }}
      >
        ◆
      </span>
      {props.children}
    </li>
  ),
  hr: () => (
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid rgba(30,31,24,0.1)',
        margin: '56px 0',
      }}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      style={{
        color: INK,
        textDecoration: 'underline',
        textDecorationColor: `rgba(194,85,58,0.35)`,
        textUnderlineOffset: '3px',
        transition: 'text-decoration-color 150ms',
      }}
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong style={{ color: INK, fontWeight: 600 }} {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '14px',
        background: SAND,
        padding: '2px 6px',
        borderRadius: '2px',
        color: INK,
      }}
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      style={{
        background: SAND,
        border: '1px solid rgba(30,31,24,0.1)',
        borderRadius: '2px',
        padding: '20px 24px',
        overflowX: 'auto',
        margin: '32px 0',
      }}
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div style={{ overflowX: 'auto', margin: '32px 0' }}>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}
        {...props}
      />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      style={{
        background: SAND,
        borderBottom: '2px solid rgba(30,31,24,0.12)',
      }}
      {...props}
    />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      style={{
        padding: '12px 16px',
        textAlign: 'left',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: INK,
      }}
      {...props}
    />
  ),
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      style={{
        padding: '12px 16px',
        color: '#2A2B24',
        lineHeight: '1.5',
        borderBottom: '1px solid rgba(30,31,24,0.08)',
      }}
      {...props}
    />
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <figure style={{ margin: '44px 0' }}>
      <img
        style={{ width: '100%', borderRadius: '2px' }}
        loading="lazy"
        decoding="async"
        {...props}
      />
      {props.alt && (
        <figcaption
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'rgba(30,31,24,0.4)',
            marginTop: '10px',
            fontStyle: 'italic',
          }}
        >
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),
}

// ─── GA4 helpers ──────────────────────────────────────────────────────────────

function trackPostView(meta: BlogPostMeta) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'blog_post_view', {
    post_slug:     meta.slug,
    post_category: meta.category,
    post_title:    meta.title,
  })
}

function useScrollCompletion(slug: string) {
  useEffect(() => {
    let fired = false
    const handleScroll = () => {
      if (fired) return
      const el = document.documentElement
      const progress = (el.scrollTop + el.clientHeight) / el.scrollHeight
      if (progress >= 0.9) {
        fired = true
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'blog_post_complete', { post_slug: slug })
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [slug])
}

// ─── TOC ──────────────────────────────────────────────────────────────────────

interface TocItem {
  id: string
  text: string
}

function useToc(contentReady: boolean): TocItem[] {
  const [items, setItems] = useState<TocItem[]>([])

  useEffect(() => {
    if (!contentReady) return
    // Small delay to ensure DOM is painted
    const id = setTimeout(() => {
      const headings = Array.from(
        document.querySelectorAll<HTMLHeadingElement>('article h2[id]')
      )
      setItems(
        headings.map(h => ({ id: h.id, text: h.textContent ?? '' }))
      )
    }, 80)
    return () => clearTimeout(id)
  }, [contentReady])

  return items
}

function useActiveTocId(items: TocItem[]): string {
  const [active, setActive] = useState('')

  useEffect(() => {
    if (items.length === 0) return
    const onScroll = () => {
      const scrollY = window.scrollY + 120
      let current = items[0]?.id ?? ''
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.offsetTop <= scrollY) current = item.id
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [items])

  return active
}

function TableOfContents({ items, tr }: { items: TocItem[]; tr: ReturnType<typeof useT> }) {
  const activeId = useActiveTocId(items)
  if (items.length < 2) return null

  return (
    <nav
      aria-label={tr('blog.post.toc.label')}
      style={{
        position: 'sticky',
        top: '112px',
        width: '220px',
        flexShrink: 0,
        alignSelf: 'flex-start',
      }}
    >
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '9px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: 'rgba(30,31,24,0.35)',
          marginBottom: '14px',
        }}
      >
        {tr('blog.post.toc.heading')}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map(item => {
          const isActive = item.id === activeId
          return (
            <li key={item.id} style={{ margin: '2px 0' }}>
              <a
                href={`#${item.id}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  display: 'block',
                  fontSize: '13px',
                  lineHeight: '1.45',
                  padding: '5px 0 5px 12px',
                  borderLeft: `2px solid ${isActive ? CLAY : 'rgba(30,31,24,0.1)'}`,
                  color: isActive ? CLAY : 'rgba(30,31,24,0.5)',
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: 'none',
                  transition: 'color 150ms, border-color 150ms',
                }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// ─── Related posts card ───────────────────────────────────────────────────────

function RelatedCard({ post, tr }: { post: BlogPost; tr: ReturnType<typeof useT> }) {
  const { meta } = post
  return (
    <Link
      to={`/blog/${meta.slug}`}
      style={{ textDecoration: 'none', overflow: 'hidden', display: 'block' }}
    >
      <article
        style={{
          border: '1px solid rgba(30,31,24,0.08)',
          borderRadius: '2px',
          overflow: 'hidden',
          transition: 'transform 200ms',
          background: 'white',
        }}
        className="group"
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.transform = ''
        }}
      >
        <div style={{ height: '160px', overflow: 'hidden' }}>
          <img
            src={meta.heroImage}
            alt={meta.heroImageAlt}
            width={800}
            height={160}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 500ms',
            }}
            className="group-hover:scale-[1.05]"
          />
        </div>
        <div style={{ padding: '20px 24px 24px' }}>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: CLAY,
              display: 'block',
              marginBottom: '8px',
            }}
          >
            {categoryLabel(meta.category)}
          </span>
          <h3
            className="font-display"
            style={{
              fontSize: '17px',
              color: INK,
              lineHeight: '1.3',
              letterSpacing: '-0.3px',
              fontWeight: 400,
            }}
          >
            {meta.title}
          </h3>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              color: 'rgba(30,31,24,0.4)',
              marginTop: '10px',
            }}
          >
            {tr('blog.readTimeLong').replace('{n}', String(meta.readingTime))}
          </p>
        </div>
      </article>
    </Link>
  )
}

// ─── JSON-LD helpers ──────────────────────────────────────────────────────────

function articleSchema(meta: BlogPostMeta, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    image: meta.heroImage,
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt,
    author: { '@type': 'Organization', name: meta.author },
    publisher: { '@type': 'Organization', name: 'Habitta', url: BASE_URL },
    inLanguage: lang === 'en' ? 'en-GB' : 'pt-PT',
    url: `${BASE_URL}/blog/${meta.slug}`,
  }
}

function breadcrumbSchema(meta: BlogPostMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Habitta', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      {
        '@type': 'ListItem',
        position: 3,
        name: meta.title,
        item: `${BASE_URL}/blog/${meta.slug}`,
      },
    ],
  }
}

function faqSchema(faqs: BlogPostMeta['faqs']) {
  if (!faqs || faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

// ─── Sticky mobile CTA ────────────────────────────────────────────────────────

function MobileStickyCta({ tr }: { tr: ReturnType<typeof useT> }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) setVisible(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    timerRef.current = setTimeout(() => setVisible(true), 8000)
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div
      className="lg:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: INK,
        padding: '12px 20px',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.18)',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms ease',
      }}
    >
      <Link
        to="/quiz"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '13px',
          background: CLAY,
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        {tr('blog.post.mobileCta')}
      </Link>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BlogPost() {
  const { lang } = useLangSafe()
  const tr = useT(lang)
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug, lang) : undefined
  const [PostComponent, setPostComponent] = useState<ComponentType | null>(null)
  const [loadError, setLoadError] = useState(false)
  const tracked = useRef(false)

  useScrollCompletion(slug ?? '')

  const contentReady = PostComponent !== null
  const tocItems = useToc(contentReady)

  const handleLoad = useCallback((Component: ComponentType) => {
    setPostComponent(() => Component)
  }, [])

  useEffect(() => {
    if (!post) return
    setPostComponent(null)
    setLoadError(false)
    loadPostComponent(post.filePath).then(handleLoad).catch(() => setLoadError(true))
  }, [post?.filePath, handleLoad])

  useEffect(() => {
    if (PostComponent && post && !tracked.current) {
      tracked.current = true
      trackPostView(post.meta)
    }
  }, [PostComponent, post])

  useEffect(() => {
    tracked.current = false
  }, [slug])

  if (!post) return <Navigate to="/blog" replace />

  const { meta } = post
  const related = getRelatedPosts(meta.relatedPosts ?? [], lang)
  const pageUrl = `${BASE_URL}/blog/${meta.slug}`
  const faq = faqSchema(meta.faqs)

  return (
    <div style={{ background: BONE, minHeight: '100vh' }}>
      <Helmet>
        <title>{meta.title} | Habitta</title>
        <meta name="description" content={meta.description} />
        {meta.draft
          ? <meta name="robots" content="noindex, nofollow" />
          : <meta name="robots" content="index, follow" />
        }
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={`${meta.title} | Habitta`} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.heroImage} />
        <meta property="og:locale" content={lang === 'en' ? 'en_GB' : 'pt_PT'} />
        <meta property="article:published_time" content={meta.publishedAt} />
        <meta property="article:modified_time" content={meta.updatedAt} />
        <meta property="article:author" content={meta.author} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${meta.title} | Habitta`} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.heroImage} />
        <link rel="alternate" hrefLang={lang === 'en' ? 'en' : 'pt-pt'} href={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(articleSchema(meta, lang))}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema(meta))}</script>
        {faq && <script type="application/ld+json">{JSON.stringify(faq)}</script>}
      </Helmet>

      {/* ── Draft banner (dev only) ────────────────────────────────────────── */}
      {meta.draft && (
        <div
          style={{
            background: '#FBBF24',
            color: '#1E1F18',
            textAlign: 'center',
            padding: '8px 20px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            letterSpacing: '1px',
            fontWeight: 600,
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          {tr('blog.post.draftBanner')}
        </div>
      )}

      {/* ── Hero image ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(320px, 45vw, 540px)',
          overflow: 'hidden',
        }}
      >
        <img
          src={meta.heroImage}
          alt={meta.heroImageAlt}
          width={1200}
          height={540}
          fetchPriority="high"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(20,21,16,0.92) 0%, rgba(20,21,16,0.4) 50%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'clamp(24px, 4vw, 56px)',
          }}
        >
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <Link
              to="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.5px',
                marginBottom: '20px',
              }}
            >
              <ArrowLeft size={11} /> {tr('blog.post.backToBlog')}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  background: CLAY,
                  color: 'white',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                {categoryLabel(meta.category)}
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.5px',
                }}
              >
                {tr('blog.readTime').replace('{n}', String(meta.readingTime))}
              </span>
            </div>
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(24px, 4vw, 48px)',
                color: BONE,
                letterSpacing: '-1px',
                lineHeight: '1.1',
                fontWeight: 400,
                maxWidth: '680px',
              }}
            >
              {meta.title}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginTop: '16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.28)',
                flexWrap: 'wrap',
              }}
            >
              <span>{meta.author}</span>
              <span>·</span>
              <span>
                {new Date(meta.publishedAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Layout: prose + TOC sidebar ────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: 'clamp(40px, 5vw, 72px) clamp(20px, 4vw, 40px) 0',
          display: 'flex',
          gap: '72px',
          alignItems: 'flex-start',
        }}
      >
        {/* ── Main prose ─────────────────────────────────────────────────── */}
        <article style={{ flex: '1 1 0', minWidth: 0, maxWidth: '680px' }}>
          {loadError && (
            <p style={{ color: '#2A2B24', fontSize: '17px', lineHeight: '1.85' }}>
              {meta.description}
            </p>
          )}

          {!PostComponent && !loadError && (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  border: `2px solid ${CLAY}`,
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  margin: '0 auto',
                  animation: 'habitta-spin 0.8s linear infinite',
                }}
                aria-label={tr('blog.post.loadingAria')}
              />
            </div>
          )}

          {PostComponent && (
            <BlogPostMetaProvider value={meta}>
              <MDXProvider components={mdxComponents}>
                <PostComponent />
              </MDXProvider>
            </BlogPostMetaProvider>
          )}

          {/* Bottom padding so TOC has room */}
          <div style={{ paddingBottom: 'clamp(60px, 8vw, 100px)' }} />
        </article>

        {/* ── TOC sidebar (desktop only) ──────────────────────────────────── */}
        <div className="hidden lg:block" style={{ width: '220px', flexShrink: 0 }}>
          <TableOfContents items={tocItems} tr={tr} />
        </div>
      </div>

      {/* ── Related posts ──────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          style={{
            borderTop: '1px solid rgba(30,31,24,0.08)',
            background: SAND,
            padding:
              'clamp(56px, 6vw, 80px) clamp(20px, 4vw, 40px) clamp(80px, 10vw, 100px)',
            marginTop: 'clamp(40px, 5vw, 60px)',
          }}
        >
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '2.5px',
                color: CLAY,
                marginBottom: '32px',
              }}
            >
              {tr('blog.post.related')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map(p => (
                <RelatedCard key={p.meta.slug} post={p} tr={tr} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Mobile sticky CTA ──────────────────────────────────────────────── */}
      <MobileStickyCta tr={tr} />
    </div>
  )
}
