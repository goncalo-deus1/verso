import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeInSection } from '../animations/FadeInSection'
import { BlogPostCard } from '../blog/BlogPostCard'
import { getPostsByLocale } from '../../lib/blog'

export default function HomeBlogPreview() {
  const blogPosts = getPostsByLocale('pt').slice(0, 3)
  if (blogPosts.length === 0) return null

  return (
    <section
      style={{ background: '#EDE9E1', borderTop: '1px solid rgba(30,31,24,0.07)' }}
      className="py-16 sm:py-20 md:py-24 px-6 lg:px-20"
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <FadeInSection>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '9px',
                textTransform: 'uppercase',
                letterSpacing: '2.5px',
                color: '#C2553A',
                marginBottom: '10px',
              }}>
                - Leituras Habitta -
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(28px, 3.5vw, 42px)',
                  letterSpacing: '-1px',
                  lineHeight: '1.08',
                  color: '#1E1F18',
                  fontWeight: 400,
                }}
              >
                Antes de ver um anúncio
              </h2>
            </div>
            <Link
              to="/blog"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#1E1F18',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderBottom: '1px solid rgba(30,31,24,0.25)',
                paddingBottom: '2px',
                whiteSpace: 'nowrap',
              }}
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '20px' }}>
          {blogPosts.map((post, i) => (
            <FadeInSection key={post.meta.slug} delay={i * 0.07}>
              <BlogPostCard post={post} />
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}
