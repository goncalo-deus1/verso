import { useState } from 'react'
import { Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { editorials } from '../data/editorial'
import { BlockLabel, Callout } from '../components/Brand'

const categories = ['Todos', 'Guia do Comprador', 'Tendências de Mercado', 'Análise', 'Contexto Urbanístico']

export default function EditorialPage() {
  const [active, setActive] = useState('Todos')
  const [featured, ...rest] = editorials

  return (
    <div className="min-h-screen" style={{ background: '#F2EDE4' }}>
      {/* Header */}
      <section style={{ background: '#1E1F18' }} className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
          <BlockLabel light>Editorial</BlockLabel>
          <h1 className="font-display text-white text-4xl lg:text-5xl max-w-xl" style={{ letterSpacing: '-1.5px', lineHeight: '1.1' }}>
            Guias, análises e perspectivas
          </h1>
          <p className="mt-4 max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Tudo o que precisa de saber para comprar bem — sem ruído, sem pressão.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <Callout>
          Comprar um imóvel é uma das decisões mais complexas da vida. Os nossos guias existem para que essa complexidade não seja um obstáculo — mas uma vantagem.
        </Callout>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 pb-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className="px-4 py-2 text-sm font-medium transition-all duration-150"
              style={active === cat
                ? { background: '#1E1F18', color: '#F2EDE4', borderRadius: '2px' }
                : { background: '#F2EDE4', color: '#3A3B2E', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured */}
        {featured && (
          <Link to={`/editorial/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
          <article className="group relative overflow-hidden mb-8 cursor-pointer" style={{ minHeight: '460px', borderRadius: '2px' }}>
            <img src={featured.image} alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(10,10,11,0.9) 0%, rgba(10,10,11,0.5) 50%, transparent 100%)' }} />
            <div className="relative h-full flex flex-col justify-end p-10 lg:p-14" style={{ minHeight: '460px' }}>
              <span className="self-start px-2.5 py-1 text-white text-xs font-semibold uppercase mb-5"
                style={{ background: '#C2553A', letterSpacing: '1.5px', fontSize: '10px' }}>
                {featured.category}
              </span>
              <h2 className="font-display text-white text-3xl lg:text-4xl max-w-2xl mb-4" style={{ letterSpacing: '-1px', lineHeight: '1.12' }}>
                {featured.title}
              </h2>
              <p className="text-base leading-relaxed max-w-xl mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>{featured.excerpt}</p>
              <div className="flex items-center gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'IBM Plex Mono' }}>
                <span className="flex items-center gap-1.5"><Clock size={11} /> {featured.readTime} min</span>
                <span>{featured.date}</span>
                <span>{featured.author}</span>
              </div>
            </div>
          </article>
          </Link>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map(article => (
            <Link key={article.id} to={`/editorial/${article.slug}`} style={{ textDecoration: 'none' }}>
            <article
              className="group bg-white overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
              style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
              <div className="aspect-[16/9] overflow-hidden">
                <img src={article.image} alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold uppercase" style={{ color: '#C2553A', letterSpacing: '2px', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
                  {article.category}
                </span>
                <h3 className="font-display text-xl leading-tight mt-2 mb-3 transition-colors duration-150 group-hover:text-[#C2553A] line-clamp-2"
                  style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>
                  {article.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#3A3B2E' }}>{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', borderTop: '1px solid rgba(30, 31, 24, 0.125)', paddingTop: '12px' }}>
                  <span className="flex items-center gap-1.5"><Clock size={11} /> {article.readTime} min</span>
                  <span>{article.date}</span>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
