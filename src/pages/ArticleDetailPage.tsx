import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { editorials } from '../data/editorial'
import type { ContentBlock } from '../types'

const eyebrow: React.CSSProperties = {
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2.5px',
}

function ZoneBlock({ block }: { block: Extract<ContentBlock, { type: 'zone' }> }) {
  return (
    <div className="sand-card" style={{ padding: '32px', margin: '0 0 40px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ ...eyebrow, color: '#C2553A', marginBottom: '6px' }}>Preço médio</p>
          <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '15px', color: '#1E1F18', fontWeight: 500 }}>{block.price}</p>
        </div>
        <div style={{ flex: '2 1 300px' }}>
          <p style={{ ...eyebrow, color: '#6B7A5A', marginBottom: '6px' }}>Para quem</p>
          <p style={{ fontSize: '14px', color: '#1E1F18', lineHeight: '1.6' }}>{block.for}</p>
        </div>
      </div>
      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(30, 31, 24, 0.125)', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ ...eyebrow, color: '#3A3B2E', marginBottom: '6px' }}>Vibe</p>
          <p style={{ fontSize: '13px', color: '#3A3B2E', lineHeight: '1.6' }}>{block.vibe}</p>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ ...eyebrow, color: '#3A3B2E', marginBottom: '6px' }}>Potencial futuro</p>
          <p style={{ fontSize: '13px', color: '#3A3B2E', lineHeight: '1.6' }}>{block.future}</p>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ ...eyebrow, color: '#C2553A', marginBottom: '6px' }}>Atenção</p>
          <p style={{ fontSize: '13px', color: '#3A3B2E', lineHeight: '1.6' }}>{block.watch}</p>
        </div>
      </div>
    </div>
  )
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'lead':
      return (
        <p style={{ fontSize: '20px', color: '#1E1F18', lineHeight: '1.8', marginBottom: '40px', fontStyle: 'italic', borderLeft: '3px solid #C2553A', paddingLeft: '24px' }}>
          {block.text}
        </p>
      )
    case 'paragraph':
      return (
        <p style={{ fontSize: '17px', color: '#3A3A3A', lineHeight: '1.85', marginBottom: '24px' }}>
          {block.text}
        </p>
      )
    case 'heading':
      return block.level === 2 ? (
        <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.8px', lineHeight: '1.15', color: '#1E1F18', margin: '56px 0 24px', fontWeight: 400 }}>
          {block.text}
        </h2>
      ) : (
        <h3 className="font-display" style={{ fontSize: '22px', letterSpacing: '-0.4px', color: '#1E1F18', margin: '40px 0 16px', fontWeight: 400 }}>
          {block.text}
        </h3>
      )
    case 'callout':
      return (
        <div style={{ background: '#E8E0D0', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px', padding: '24px 28px', margin: '32px 0' }}>
          <p style={{ fontSize: '14px', color: '#3A3B2E', lineHeight: '1.7', fontStyle: 'italic' }}>{block.text}</p>
        </div>
      )
    case 'list':
      return (
        <ul style={{ margin: '0 0 32px', paddingLeft: 0, listStyle: 'none' }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ padding: '12px 0 12px 28px', position: 'relative', fontSize: '16px', color: '#3A3A3A', lineHeight: '1.6', borderBottom: '1px solid rgba(30, 31, 24, 0.125)' }}>
              <span style={{ position: 'absolute', left: 0, color: '#C2553A', fontWeight: 700, fontSize: '12px', top: '16px' }}>◆</span>
              {item}
            </li>
          ))}
        </ul>
      )
    case 'zone':
      return <ZoneBlock block={block} />
    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid rgba(30, 31, 24, 0.125)', margin: '56px 0' }} />
    case 'cta':
      return (
        <div style={{ background: '#1E1F18', borderRadius: '2px', padding: '56px 48px', margin: '64px 0 0', textAlign: 'center' }}>
          <h3 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#F2EDE4', letterSpacing: '-0.8px', marginBottom: '16px', fontWeight: 400 }}>
            {block.heading}
          </h3>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.75', maxWidth: '480px', margin: '0 auto 36px' }}>
            {block.body}
          </p>
          <Link to={block.href}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 32px', background: '#C2553A', color: 'white', fontSize: '15px', fontWeight: 600, textDecoration: 'none', borderRadius: '8px', transition: 'opacity 150ms' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            {block.label} <ArrowRight size={15} />
          </Link>
        </div>
      )
    case 'table':
      return (
        <div style={{ overflowX: 'auto', margin: '32px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
            <thead>
              <tr style={{ background: '#E8E0D0', borderBottom: '2px solid rgba(30, 31, 24, 0.125)' }}>
                {block.headers.map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', color: '#1E1F18', fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(30, 31, 24, 0.125)', background: i % 2 === 0 ? '#F2EDE4' : 'white' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '12px 16px', color: j === 0 ? '#1E1F18' : '#3A3A3A', fontWeight: j === 0 ? 500 : 400, lineHeight: '1.5' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return null
  }
}

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const article = editorials.find(e => e.slug === slug)

  if (!article) return <Navigate to="/editorial" replace />

  const others = editorials.filter(e => e.slug !== slug).slice(0, 3)

  return (
    <div style={{ background: '#F2EDE4', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ position: 'relative', height: 'clamp(320px, 45vw, 520px)', overflow: 'hidden' }}>
        <img src={article.image} alt={article.title}
          width={1200} height={520}
          fetchPriority="high"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30, 31, 24,0.88) 0%, rgba(30, 31, 24,0.3) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(24px, 4vw, 56px)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span style={{ display: 'inline-block', padding: '4px 12px', background: '#C2553A', color: 'white', ...eyebrow, fontSize: '9px', marginBottom: '16px' }}>
              {article.category}
            </span>
            <h1 className="font-display" style={{ fontSize: 'clamp(26px, 4vw, 48px)', color: '#F2EDE4', letterSpacing: '-1px', lineHeight: '1.12', fontWeight: 400 }}>
              {article.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px', fontFamily: 'IBM Plex Mono, monospace', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={11} /> {article.readTime} min de leitura</span>
              <span>{article.date}</span>
              <span>{article.author}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back nav */}
      <div className="px-5 sm:px-8" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '32px' }}>
        <Link to="/editorial"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#3A3B2E', textDecoration: 'none', fontWeight: 500, transition: 'color 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
          <ArrowLeft size={13} /> Todos os guias
        </Link>
      </div>

      {/* Article body */}
      <article className="px-5 sm:px-8" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: '80px' }}>
        {article.content ? (
          article.content.map((block, i) => <Block key={i} block={block} />)
        ) : (
          <p style={{ fontSize: '17px', color: '#3A3B2E', lineHeight: '1.85' }}>{article.excerpt}</p>
        )}
      </article>

      {/* More articles */}
      {others.length > 0 && (
        <section className="px-5 sm:px-8 md:px-12" style={{ borderTop: '1px solid rgba(30, 31, 24, 0.125)', background: '#E8E0D0', paddingTop: 'clamp(56px, 6vw, 80px)', paddingBottom: 'clamp(56px, 6vw, 80px)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <p style={{ ...eyebrow, color: '#C2553A', marginBottom: '32px' }}>Continuar a ler</p>
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '8px' }}>
              {others.map(a => (
                <Link key={a.id} to={`/editorial/${a.slug}`}
                  className="verso-card group"
                  style={{ textDecoration: 'none', overflow: 'hidden', display: 'block' }}>
                  <div style={{ height: '160px', overflow: 'hidden' }}>
                    <img src={a.image} alt={a.title}
                      width={800} height={160}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms' }}
                      className="group-hover:scale-[1.05]" />
                  </div>
                  <div style={{ padding: '20px 24px 24px' }}>
                    <span style={{ ...eyebrow, fontSize: '9px', color: '#C2553A', display: 'block', marginBottom: '8px' }}>{a.category}</span>
                    <h3 className="font-display" style={{ fontSize: '17px', color: '#1E1F18', lineHeight: '1.3', letterSpacing: '-0.3px', fontWeight: 400 }}>{a.title}</h3>
                    <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '11px', color: '#3A3B2E', marginTop: '12px' }}>{a.readTime} min</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
