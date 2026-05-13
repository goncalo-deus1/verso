import { Link } from 'react-router-dom'
import { categoryLabel, type BlogPost } from '../../lib/blog'

const INK  = '#1E1F18'
const CLAY = '#C2553A'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Compact blog post card — used on homepage and quiz dossier.
 * Self-contained: bring a BlogPost, get a styled link card.
 */
export function BlogPostCard({ post }: { post: BlogPost }) {
  const { meta } = post
  return (
    <Link
      to={`/blog/${meta.slug}`}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <article
        style={{
          background: 'white',
          borderRadius: '2px',
          border: '1px solid rgba(30,31,24,0.08)',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = '0 8px 28px rgba(30,31,24,0.09)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = ''
          el.style.boxShadow = ''
        }}
      >
        {/* Image */}
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
          />
        </div>

        {/* Body */}
        <div
          style={{
            padding: '20px 22px 22px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: '17px',
              color: INK,
              lineHeight: '1.28',
              letterSpacing: '-0.3px',
              fontWeight: 400,
              marginBottom: '8px',
              flex: 1,
            }}
          >
            {meta.title}
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(30,31,24,0.5)',
              lineHeight: '1.55',
              marginBottom: '14px',
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
              justifyContent: 'space-between',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              color: 'rgba(30,31,24,0.28)',
              borderTop: '1px solid rgba(30,31,24,0.07)',
              paddingTop: '12px',
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
