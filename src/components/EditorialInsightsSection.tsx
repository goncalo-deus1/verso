import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import type { Editorial } from '../types'

interface EditorialInsightsSectionProps {
  articles: Editorial[]
  title?: string
  showViewAll?: boolean
}

export default function EditorialInsightsSection({ articles, title = 'Guias e perspectivas', showViewAll = true }: EditorialInsightsSectionProps) {
  const [featured, ...rest] = articles

  return (
    <section className="py-20 lg:py-28" style={{ background: '#F2EDE4', borderTop: '1px solid rgba(30, 31, 24, 0.125)' }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase mb-3" style={{ color: '#C2553A', letterSpacing: '3px', fontFamily: 'IBM Plex Mono' }}>
              Editorial
            </p>
            <h2 className="font-display text-3xl lg:text-4xl max-w-md" style={{ color: '#1E1F18', letterSpacing: '-1px', lineHeight: '1.15' }}>
              {title}
            </h2>
          </div>
          {showViewAll && (
            <Link to="/editorial" className="hidden lg:flex items-center gap-2 text-sm font-medium transition-colors duration-150"
              style={{ color: '#3A3B2E' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
              Ver todos os guias <ArrowRight size={14} />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Featured */}
          {featured && (
            <article className="lg:col-span-7 group relative overflow-hidden cursor-pointer" style={{ minHeight: '420px' }}>
              <img src={featured.image} alt={featured.title}
                width={1200} height={420}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.3) 50%, transparent 100%)' }} />
              <div className="relative h-full flex flex-col justify-end p-8" style={{ minHeight: '420px' }}>
                <span className="self-start px-2.5 py-1 text-white text-xs font-semibold uppercase mb-4"
                  style={{ background: '#C2553A', letterSpacing: '1.5px', fontSize: '10px' }}>
                  {featured.category}
                </span>
                <h3 className="font-display text-white text-2xl lg:text-3xl mb-3 leading-tight" style={{ letterSpacing: '-0.5px' }}>
                  {featured.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono' }}>
                  <span className="flex items-center gap-1.5"><Clock size={11} /> {featured.readTime} min</span>
                  <span>{featured.date}</span>
                </div>
              </div>
            </article>
          )}

          {/* Side articles */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {rest.map((article) => (
              <article key={article.id}
                className="group flex gap-4 bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                <div className="w-28 flex-shrink-0 overflow-hidden">
                  <img src={article.image} alt={article.title}
                    width={112} height={110}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    style={{ minHeight: '110px' }} />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="text-xs font-semibold uppercase" style={{ color: '#C2553A', letterSpacing: '2px', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
                      {article.category}
                    </span>
                    <h3 className="font-display text-base leading-tight mt-1.5 transition-colors duration-150 group-hover:text-[#C2553A] line-clamp-2"
                      style={{ color: '#1E1F18', letterSpacing: '-0.2px' }}>
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-3" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>
                    <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime} min</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {showViewAll && (
          <div className="mt-8 lg:hidden">
            <Link to="/editorial" className="flex items-center gap-2 text-sm font-medium" style={{ color: '#3A3B2E' }}>
              Ver todos os guias <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
