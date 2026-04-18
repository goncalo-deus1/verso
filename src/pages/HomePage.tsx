import { Link } from 'react-router-dom'
import { ArrowRight, ArrowDown, Quote, Sparkles } from 'lucide-react'
import { properties } from '../data/properties'
import { areas } from '../data/areas'
import { editorials } from '../data/editorial'
import PropertyCard from '../components/PropertyCard'
import { CopilotWidget } from '../components/copilot/CopilotWidget'

function formatPrice(p: number) {
  return p >= 1000000 ? `${(p / 1000000).toFixed(1)}M€` : `${(p / 1000).toFixed(0)}k€`
}

const mono: React.CSSProperties = { fontFamily: 'IBM Plex Mono', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2.5px' }

const TICKER_ITEMS = [
  'Príncipe Real', '·', 'Comporta', '·', 'Marvila', '·', 'Cascais', '·', 'Bonfim', '·', 'Braga Norte',
  '·', 'PDM & Urbanismo', '·', 'Score de fit', '·', 'Curação editorial', '·', 'Decisão informada', '·',
]

const REVIEWS = [
  { name: 'Margarida F.', location: 'Compradora em Cascais', text: 'O quiz ajudou-me a perceber que Cascais era a zona certa antes de visitar um único imóvel. Cheguei à visita com contexto real.' },
  { name: 'Tiago R.', location: 'Comprador em Marvila', text: 'A informação de PDM e urbanismo foi o que faltava. Tomei a decisão com confiança e sem surpresas depois da escritura.' },
  { name: 'Inês M.', location: 'Compradora no Príncipe Real', text: 'Sem pressão de vendas, sem buzzwords. Só informação clara e honesta. Completamente diferente de tudo o resto.' },
  { name: 'Rui C.', location: 'Comprador no Bonfim', text: 'A perspectiva editorial fez toda a diferença. Perceber a zona antes do imóvel mudou completamente a minha abordagem.' },
]

export default function HomePage() {
  const featured = properties.filter(p => p.isFeatured)

  return (
    <div style={{ background: '#0A0A0B' }}>

      {/* ━━━ HERO ━━━ */}
      <section
        data-hide-copilot
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          background: '#F7F5F0',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.038) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.038) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          padding: '120px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle radial vignette at edges */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(247,245,240,0.6) 100%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>

          {/* Badge pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '48px',
            padding: '7px 18px',
            background: 'rgba(196,93,62,0.07)',
            border: '1px solid rgba(196,93,62,0.18)',
            borderRadius: '50px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C45D3E', display: 'inline-block', boxShadow: '0 0 6px rgba(196,93,62,0.7)' }} />
            <span style={{ ...mono, color: '#C45D3E', fontSize: '10px' }}>Plataforma imobiliária — Portugal</span>
          </div>

          {/* Title */}
          <h1 className="font-display" style={{
            fontSize: 'clamp(52px, 10vw, 108px)',
            letterSpacing: '-3.5px',
            lineHeight: '1',
            color: '#0A0A0B',
            marginBottom: '4px',
          }}>
            Encontre a zona
          </h1>

          {/* Second line with SVG underline accent */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '36px' }}>
            <span className="font-display" style={{
              fontSize: 'clamp(52px, 10vw, 108px)',
              letterSpacing: '-3.5px',
              lineHeight: '1',
              color: '#0A0A0B',
            }}>
              certa.
            </span>
            {/* Terracotta wave underline */}
            <svg
              style={{ position: 'absolute', bottom: '-14px', left: '-4%', width: '108%' }}
              viewBox="0 0 520 22"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M4,14 Q65,4 130,12 Q195,20 260,12 Q325,4 390,12 Q455,20 516,10"
                fill="none"
                stroke="#C45D3E"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: '18px', color: '#5A5A5A', maxWidth: '520px', lineHeight: '1.85', marginBottom: '52px', margin: '0 auto 52px' }}>
            Uma plataforma editorial para decisões de compra informadas — sem pressão, sem ruído.
          </p>

          {/* Dark pill CTA */}
          <Link to="/quiz"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '18px 40px',
              background: '#0A0A0B',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '50px',
              boxShadow: '0 4px 28px rgba(10,10,11,0.22), 0 1px 4px rgba(10,10,11,0.12)',
              letterSpacing: '0.1px',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 36px rgba(10,10,11,0.28), 0 2px 8px rgba(10,10,11,0.14)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 28px rgba(10,10,11,0.22), 0 1px 4px rgba(10,10,11,0.12)'
            }}
          >
            <Sparkles size={16} style={{ color: '#C45D3E' }} />
            Descobrir a minha zona
          </Link>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center" style={{ marginTop: '80px', borderTop: '1px solid #E8E4DC', paddingTop: '40px', gap: '0' }}>
            {[
              { num: '6', label: 'zonas curadas' },
              { num: '2.400+', label: 'perfis analisados' },
              { num: '94%', label: 'satisfação' },
            ].map((stat, i) => (
              <div key={stat.num} style={{
                flex: '1 1 120px',
                textAlign: 'center',
                padding: '0 32px',
                borderRight: i < 2 ? '1px solid #E8E4DC' : 'none',
              }}>
                <p className="font-display" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#0A0A0B', letterSpacing: '-1.5px', lineHeight: 1 }}>{stat.num}</p>
                <p style={{ ...mono, color: '#9A9590', marginTop: '8px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TICKER ━━━ */}
      <div style={{ background: '#0E0E10', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '18px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '56px', width: 'max-content', animation: 'ticker 28s linear infinite' }}>
          {[0, 1].map(copy =>
            TICKER_ITEMS.map((item, i) => (
              <span key={`${copy}-${i}`} style={{
                ...mono,
                fontSize: '11px',
                color: item === '·' ? '#C45D3E' : 'rgba(255,255,255,0.2)',
                whiteSpace: 'nowrap',
                letterSpacing: item === '·' ? '0' : '2px',
              }}>
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ━━━ 01 — COMO FUNCIONA ━━━ */}
      <section style={{ padding: '120px 80px' }} className="px-6 lg:px-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          <p style={{ ...mono, color: '#C45D3E', marginBottom: '16px' }}>01 — Como funciona</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#F7F5F0', marginBottom: '16px', maxWidth: '640px' }}>
            Uma abordagem diferente para uma decisão importante
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', maxWidth: '560px', lineHeight: '1.85', marginBottom: '72px' }}>
            A maioria das plataformas começa pelo anúncio. A VERSO começa pelo contexto — zona, planeamento, estilo de vida — e só depois pelo imóvel.
          </p>

          {/* Flow cards */}
          <div className="flex flex-col lg:flex-row items-stretch" style={{ gap: '0' }}>
            {[
              { n: '01', title: 'Defina o seu perfil', body: 'Um quiz de 8 perguntas sobre orçamento, estilo de vida e prioridades. Em 3 minutos, percebemos o que realmente importa para si.' },
              { n: '02', title: 'Descubra a zona certa', body: 'Recomendamos as zonas que melhor se alinham com o seu perfil — com contexto de preços, vida, transporte e planeamento urbano.' },
              { n: '03', title: 'Encontre o imóvel certo', body: 'Explore uma selecção curada com score de compatibilidade, informação urbanística e guias para tomar uma decisão informada.' },
            ].map((card, i) => (
              <div key={card.n} className="flex flex-col lg:flex-row items-stretch flex-1">
                <div className="glass-card flex-1" style={{ padding: '40px 36px' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '32px', fontWeight: 500, color: '#C45D3E', display: 'block', marginBottom: '24px', letterSpacing: '-1px' }}>{card.n}</span>
                  <h3 className="font-display" style={{ fontSize: '22px', marginBottom: '14px', letterSpacing: '-0.3px', color: '#F7F5F0' }}>{card.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.85', fontSize: '14.5px' }}>{card.body}</p>
                </div>
                {i < 2 && (
                  <div className="flex items-center justify-center py-5 lg:py-0" style={{ padding: '20px 20px' }}>
                    <ArrowRight className="hidden lg:block" size={20} style={{ color: 'rgba(196,93,62,0.5)' }} />
                    <ArrowDown className="block lg:hidden" size={20} style={{ color: 'rgba(196,93,62,0.5)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 02 — ZONAS ━━━ */}
      <section style={{ padding: '0 80px 120px' }} className="px-6 lg:px-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ ...mono, color: '#C45D3E', marginBottom: '12px' }}>02 — Zonas em destaque</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#F7F5F0' }}>
                Seis zonas. Curadas.<br />Com contexto real.
              </h2>
            </div>
            <Link to="/areas"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 200ms' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C45D3E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
              Ver todas as zonas <ArrowRight size={13} />
            </Link>
          </div>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 verso-zone-grid" style={{ gap: '10px' }}>
            {areas.slice(0, 6).map((area) => {
              const badgeOpacity = area.priceChange > 10 ? 1 : area.priceChange > 8 ? 0.82 : 0.65
              return (
                <Link key={area.id} to={`/areas/${area.slug}`} style={{ textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden', borderRadius: '2px', cursor: 'pointer' }}
                  className="group">
                  {/* Image fills 100% of grid cell */}
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <img src={area.image} alt={area.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 700ms' }}
                      className="group-hover:scale-[1.06]" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,11,0.88) 0%, rgba(10,10,11,0.2) 55%, transparent 100%)' }} />
                  </div>
                  {/* Mobile height fallback */}
                  <div className="lg:hidden" style={{ paddingTop: '75%' }} />
                  {/* Content */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <span style={{ ...mono, color: 'rgba(255,255,255,0.35)', fontSize: '9px', display: 'block', marginBottom: '6px' }}>{area.city}</span>
                        <h3 className="font-display" style={{ color: '#F7F5F0', fontSize: '22px', letterSpacing: '-0.5px', lineHeight: 1.1 }}>{area.name}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '6px', lineHeight: '1.5' }}>
                          A partir de {formatPrice(area.priceRange.min)}
                        </p>
                      </div>
                      <span style={{ ...mono, fontSize: '11px', fontWeight: 500, background: '#C45D3E', color: 'white', padding: '3px 8px', opacity: badgeOpacity, flexShrink: 0, marginLeft: '12px' }}>+{area.priceChange}%</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ━━━ 03 — IMÓVEIS ━━━ */}
      <section style={{ padding: '0 80px 120px' }} className="px-6 lg:px-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ ...mono, color: '#C45D3E', marginBottom: '12px' }}>03 — Selecção editorial</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#F7F5F0' }}>
                Só publicamos o que<br />valeria a pena visitar.
              </h2>
            </div>
            <Link to="/imoveis"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C45D3E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
              Ver todos os imóveis <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {featured.map(p => <PropertyCard key={p.id} property={p} dark />)}
          </div>
        </div>
      </section>

      {/* ━━━ 04 — MÉTRICAS ━━━ */}
      <section style={{ padding: '100px 80px', background: '#0E0E10', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="px-6 lg:px-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: '0' }}>
            {[
              { num: '6', unit: 'zonas', label: 'Curadas editorialmente de norte a sul' },
              { num: '94%', unit: '', label: 'Compradores satisfeitos com o processo' },
              { num: '3min', unit: '', label: 'Para perceber qual zona faz sentido para si' },
              { num: '0', unit: 'comissões', label: 'Nenhuma pressão de vendas. Nunca.' },
            ].map((m, i) => (
              <div key={m.num}
                style={{
                  padding: '48px 40px',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
                className={i >= 2 ? 'lg:border-b-0' : ''}>
                <p className="font-display" style={{ fontSize: 'clamp(36px, 4vw, 60px)', letterSpacing: '-2px', color: '#F7F5F0', lineHeight: 1 }}>
                  {m.num}
                  {m.unit && <span style={{ fontSize: '0.5em', color: '#C45D3E', marginLeft: '4px', letterSpacing: '-1px' }}>{m.unit}</span>}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', lineHeight: '1.6', marginTop: '14px', maxWidth: '200px' }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 05 — PORQUÊ A VERSO ━━━ */}
      <section style={{ padding: '120px 80px' }} className="px-6 lg:px-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ ...mono, color: '#C45D3E', marginBottom: '16px' }}>04 — Porquê a VERSO</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#F7F5F0', marginBottom: '16px', maxWidth: '680px' }}>
            Clareza que não se encontra<br />em mais um portal de anúncios.
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.35)', maxWidth: '520px', lineHeight: '1.85', marginBottom: '64px' }}>
            Construímos a VERSO para quem pensa antes de fazer. Para quem quer perceber a zona antes de visitar o imóvel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '12px', marginBottom: '64px' }}>
            {[
              { n: '01', title: 'Zona primeiro', body: 'Encontre a área certa antes de se comprometer com um imóvel. O contexto define a decisão.' },
              { n: '02', title: 'PDM e urbanismo', body: 'Planeamento municipal, ARU e sinais de transformação — para não ter surpresas após a compra.' },
              { n: '03', title: 'Curação editorial', body: 'Uma selecção de imóveis com análise independente, score de compatibilidade e custos reais.' },
              { n: '04', title: 'Sem pressão de vendas', body: 'Não temos comissões de agências. Só publicamos o que valeria a pena visitar.' },
            ].map(item => (
              <div key={item.n} className="glass-card" style={{ padding: '36px' }}>
                <span style={{ ...mono, color: '#C45D3E', fontSize: '11px', display: 'block', marginBottom: '16px' }}>{item.n}</span>
                <h3 className="font-display" style={{ fontSize: '22px', letterSpacing: '-0.3px', color: '#F7F5F0', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '14.5px', color: 'rgba(255,255,255,0.42)', lineHeight: '1.85' }}>{item.body}</p>
              </div>
            ))}
          </div>

          {/* Do / Don't */}
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '48px', maxWidth: '900px' }}>
            <div>
              <p style={{ ...mono, color: '#6B7B5E', marginBottom: '20px' }}>O que fazemos</p>
              <ul style={{ listStyle: 'none' }}>
                {['Zona antes de imóvel', 'Contexto de PDM e urbanismo', 'Custo real de aquisição', 'Score de compatibilidade', 'Guias editoriais independentes'].map(item => (
                  <li key={item} style={{ padding: '10px 0 10px 24px', position: 'relative', color: 'rgba(255,255,255,0.5)', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#6B7B5E', fontWeight: 700 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ ...mono, color: '#C45D3E', marginBottom: '20px' }}>O que não fazemos</p>
              <ul style={{ listStyle: 'none' }}>
                {['Anúncios sem curadoria', 'Pressão de venda', 'Buzzwords e hipérboles', 'Esconder custos reais', 'Stock photography genérica'].map(item => (
                  <li key={item} style={{ padding: '10px 0 10px 24px', position: 'relative', color: 'rgba(255,255,255,0.5)', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ position: 'absolute', left: 0, color: '#C45D3E', fontWeight: 700 }}>✕</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 05 — REVIEWS ━━━ */}
      <section style={{ padding: '0 80px 120px' }} className="px-6 lg:px-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ ...mono, color: '#C45D3E', marginBottom: '16px' }}>05 — O que dizem</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#F7F5F0', marginBottom: '48px' }}>
            Quem comprou com contexto.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '12px' }}>
            {REVIEWS.map((review) => (
              <div key={review.name} className="glass-card" style={{ padding: '36px' }}>
                <Quote size={24} style={{ color: '#C45D3E', opacity: 0.6, marginBottom: '20px' }} />
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.85', marginBottom: '28px', fontStyle: 'italic' }}>
                  "{review.text}"
                </p>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                  <p style={{ fontWeight: 600, color: '#F7F5F0', fontSize: '14px' }}>{review.name}</p>
                  <p style={{ ...mono, color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '4px' }}>{review.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 06 — EDITORIAL ━━━ */}
      <section style={{ padding: '0 80px 120px', borderTop: '1px solid rgba(255,255,255,0.05)' }} className="px-6 lg:px-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ ...mono, color: '#C45D3E', marginBottom: '12px' }}>06 — Editorial</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#F7F5F0' }}>
                Guias e perspectivas
              </h2>
            </div>
            <Link to="/editorial"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C45D3E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
              Ver todos os guias <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '12px' }}>
            {/* Featured editorial */}
            {editorials[0] && (
              <Link to="/editorial" className="lg:col-span-7 group" style={{ textDecoration: 'none', display: 'block', borderRadius: '2px', overflow: 'hidden', minHeight: '400px', position: 'relative' }}>
                <img src={editorials[0].image} alt={editorials[0].title}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 700ms' }}
                  className="group-hover:scale-[1.04]" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.3) 55%, transparent 100%)' }} />
                <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '36px', minHeight: '400px' }}>
                  <span style={{ display: 'inline-block', padding: '4px 10px', background: '#C45D3E', color: 'white', ...mono, fontSize: '10px', marginBottom: '16px', alignSelf: 'flex-start' }}>
                    {editorials[0].category}
                  </span>
                  <h3 className="font-display" style={{ color: '#F7F5F0', fontSize: '26px', letterSpacing: '-0.5px', lineHeight: '1.2', marginBottom: '12px' }}>
                    {editorials[0].title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.7' }}>
                    {editorials[0].excerpt}
                  </p>
                </div>
              </Link>
            )}

            {/* Side articles */}
            <div className="lg:col-span-5 flex flex-col" style={{ gap: '12px' }}>
              {editorials.slice(1, 4).map(article => (
                <Link key={article.id} to="/editorial" className="glass-card group flex" style={{ textDecoration: 'none', overflow: 'hidden', padding: '0' }}>
                  <div style={{ width: '100px', flexShrink: 0, overflow: 'hidden' }}>
                    <img src={article.image} alt={article.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '100px', transition: 'transform 500ms' }}
                      className="group-hover:scale-[1.08]" />
                  </div>
                  <div style={{ padding: '18px 20px', flex: 1, minWidth: 0 }}>
                    <span style={{ ...mono, color: '#C45D3E', fontSize: '9px', display: 'block', marginBottom: '6px' }}>{article.category}</span>
                    <h3 className="font-display group-hover:text-[#C45D3E] transition-colors duration-150" style={{ color: '#F7F5F0', fontSize: '15px', letterSpacing: '-0.2px', lineHeight: '1.3' }}>
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section
        data-hide-copilot
        style={{ padding: '120px 80px', borderTop: '1px solid rgba(255,255,255,0.05)' }}
        className="px-6 lg:px-20"
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '80px 64px', textAlign: 'center', background: 'rgba(196,93,62,0.04)', border: '1px solid rgba(196,93,62,0.12)' }}>
            <p style={{ ...mono, color: '#C45D3E', marginBottom: '24px' }}>Pronto para começar?</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-2px', lineHeight: '1.05', color: '#F7F5F0', marginBottom: '20px' }}>
              A decisão certa começa<br />com as perguntas certas.
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.85', marginBottom: '48px', maxWidth: '480px', margin: '0 auto 48px' }}>
              Em 3 minutos percebemos que zonas e imóveis fazem mais sentido para si. Sem pressão. Sem obrigações.
            </p>
            <Link to="/quiz"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '18px 36px', background: '#C45D3E', color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none', borderRadius: '8px' }}>
              Iniciar o quiz — 3 minutos <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CopilotWidget context="homepage" />
    </div>
  )
}
