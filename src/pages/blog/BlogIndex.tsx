import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPostsByLocale, categoryLabel, type BlogPost } from '../../lib/blog'

const INK  = '#1E1F18'
const CLAY = '#C2553A'
const BONE = '#F2EDE4'
const SAND = '#E8E0D0'

const BASE_URL = 'https://www.usehabitta.com'

const ALL_CATEGORIES = [
  'todos',
  'guia-do-comprador',
  'financiamento',
  'zonas-lisboa',
  'zonas-aml',
  'mercado',
  'analise',
  'urbanismo',
  'comparacoes',
  'decisao-compra',
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Featured card — large hero layout ───────────────────────────────────────

function FeaturedCard({ post }: { post: BlogPost }) {
  const { meta } = post
  return (
    <Link to={`/blog/${meta.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        className="group"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '2px',
          minHeight: 'clamp(380px, 46vw, 520px)',
          cursor: 'pointer',
        }}
      >
        <img
          src={meta.heroImage}
          alt={meta.heroImageAlt}
          width={1200}
          height={520}
          fetchPriority="high"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 700ms ease',
          }}
          className="group-hover:scale-[1.03]"
        />
        {/* Gradient: strong left → transparent right (desktop) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, rgba(14,15,11,0.94) 0%, rgba(14,15,11,0.6) 45%, rgba(14,15,11,0.15) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'clamp(28px, 4vw, 52px)',
            minHeight: 'clamp(380px, 46vw, 520px)',
          }}
        >
          <div style={{ maxWidth: '560px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '18px',
              }}
            >
              <span
                style={{
                  background: CLAY,
                  color: 'white',
                  padding: '4px 10px',
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
                {meta.readingTime} min
              </span>
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(24px, 3.2vw, 40px)',
                color: BONE,
                letterSpacing: '-0.8px',
                lineHeight: '1.12',
                fontWeight: 400,
                marginBottom: '14px',
              }}
            >
              {meta.title}
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(255,255,255,0.48)',
                lineHeight: '1.65',
                marginBottom: '20px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {meta.description}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              <span>{formatDate(meta.publishedAt)}</span>
              <span>·</span>
              <span>{meta.author}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

// ─── Regular post card ────────────────────────────────────────────────────────

function PostCard({ post }: { post: BlogPost }) {
  const { meta } = post
  return (
    <Link to={`/blog/${meta.slug}`} style={{ textDecoration: 'none' }}>
      <article
        className="group"
        style={{
          background: 'white',
          overflow: 'hidden',
          borderRadius: '2px',
          border: '1px solid rgba(30,31,24,0.08)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = '0 8px 32px rgba(30,31,24,0.08)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = ''
          el.style.boxShadow = ''
        }}
      >
        <div style={{ aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={meta.heroImage}
            alt={meta.heroImageAlt}
            width={800}
            height={450}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 600ms ease',
            }}
            className="group-hover:scale-[1.05]"
          />
        </div>
        <div style={{ padding: '22px 24px 26px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: CLAY,
              display: 'block',
              marginBottom: '10px',
            }}
          >
            {categoryLabel(meta.category)}
          </span>
          <h3
            className="font-display"
            style={{
              fontSize: '18px',
              color: INK,
              lineHeight: '1.28',
              letterSpacing: '-0.3px',
              fontWeight: 400,
              marginBottom: '10px',
              flex: 1,
            }}
          >
            {meta.title}
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(30,31,24,0.55)',
              lineHeight: '1.6',
              marginBottom: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {meta.description}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'rgba(30,31,24,0.3)',
              borderTop: '1px solid rgba(30,31,24,0.07)',
              paddingTop: '14px',
            }}
          >
            <span>{meta.readingTime} min</span>
            <span>{formatDate(meta.publishedAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

// ─── Category filter pills ────────────────────────────────────────────────────

function FilterPills({
  categories,
  active,
  onChange,
  counts,
}: {
  categories: string[]
  active: string
  onChange: (c: string) => void
  counts: Record<string, number>
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '40px',
      }}
    >
      {categories.map(cat => {
        const isActive = cat === active
        const label = cat === 'todos' ? 'Todos' : categoryLabel(cat)
        const count = counts[cat] ?? 0
        if (cat !== 'todos' && count === 0) return null
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            style={
              isActive
                ? {
                    background: INK,
                    color: BONE,
                    border: `1px solid ${INK}`,
                    borderRadius: '2px',
                    padding: '7px 14px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }
                : {
                    background: 'transparent',
                    color: 'rgba(30,31,24,0.5)',
                    border: '1px solid rgba(30,31,24,0.15)',
                    borderRadius: '2px',
                    padding: '7px 14px',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }
            }
            onMouseEnter={e => {
              if (!isActive) {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = INK
                el.style.color = INK
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = 'rgba(30,31,24,0.15)'
                el.style.color = 'rgba(30,31,24,0.5)'
              }
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState('todos')
  const allPosts = getPostsByLocale('pt')

  // Count posts per category (for hiding empty filter pills)
  const counts = allPosts.reduce<Record<string, number>>((acc, p) => {
    acc[p.meta.category] = (acc[p.meta.category] ?? 0) + 1
    acc['todos'] = (acc['todos'] ?? 0) + 1
    return acc
  }, {})

  const filtered =
    activeCategory === 'todos'
      ? allPosts
      : allPosts.filter(p => p.meta.category === activeCategory)

  const [featured, ...rest] = filtered
  const ogUrl = `${BASE_URL}/blog`

  return (
    <div className="min-h-screen" style={{ background: BONE }}>
      <Helmet>
        <title>Blog | Habitta</title>
        <meta
          name="description"
          content="Análises, guias e comparações sobre zonas da AML. Conteúdo editorial honesto para quem quer comprar bem."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={ogUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:title" content="Blog | Habitta" />
        <meta
          property="og:description"
          content="Análises, guias e comparações sobre zonas da AML. Conteúdo editorial honesto para quem quer comprar bem."
        />
        <meta property="og:locale" content="pt_PT" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="pt-pt" href={ogUrl} />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ background: INK }} className="pt-32 pb-14 lg:pt-40 lg:pb-18">
        <div
          style={{
            maxWidth: '1160px',
            margin: '0 auto',
            padding: '0 clamp(20px, 4vw, 40px)',
          }}
        >
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '2.5px',
              color: CLAY,
              marginBottom: '14px',
            }}
          >
            — Habitta Editorial
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(36px, 5vw, 58px)',
              letterSpacing: '-2px',
              lineHeight: '1.05',
              fontWeight: 400,
              color: BONE,
              maxWidth: '480px',
            }}
          >
            Blog
          </h1>
          <p
            style={{
              marginTop: '12px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'rgba(255,255,255,0.22)',
            }}
          >
            — Análises · Guias · Zonas da AML —
          </p>
        </div>
      </section>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: '1160px',
          margin: '0 auto',
          padding: 'clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px) clamp(64px, 8vw, 100px)',
        }}
      >
        <FilterPills
          categories={ALL_CATEGORIES}
          active={activeCategory}
          onChange={setActiveCategory}
          counts={counts}
        />

        {filtered.length === 0 && (
          <p style={{ color: 'rgba(30,31,24,0.4)', fontSize: '16px', padding: '40px 0' }}>
            Nenhum artigo nesta categoria ainda.
          </p>
        )}

        {/* Featured (newest / first in filtered list) */}
        {featured && (
          <div style={{ marginBottom: '32px' }}>
            <FeaturedCard post={featured} />
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            style={{ gap: '20px' }}
          >
            {rest.map(post => (
              <PostCard key={post.meta.slug} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: SAND,
          borderTop: '1px solid rgba(30,31,24,0.07)',
          padding: 'clamp(48px, 6vw, 72px) clamp(20px, 4vw, 40px)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: CLAY,
            marginBottom: '16px',
          }}
        >
          Quiz gratuito
        </p>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            letterSpacing: '-0.8px',
            color: INK,
            marginBottom: '14px',
            fontWeight: 400,
          }}
        >
          Encontra a zona certa em 2 minutos
        </h2>
        <p
          style={{
            color: 'rgba(30,31,24,0.5)',
            fontSize: '15px',
            lineHeight: '1.7',
            marginBottom: '28px',
            maxWidth: '400px',
            margin: '0 auto 28px',
          }}
        >
          Orçamento, estilo de vida, transportes. Cruza tudo e recebe o teu dossier de zonas.
        </p>
        <Link
          to="/quiz"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 28px',
            background: INK,
            color: BONE,
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'background 150ms',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.5px',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.background = CLAY)}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.background = INK)}
        >
          Fazer o quiz →
        </Link>
      </section>
    </div>
  )
}
