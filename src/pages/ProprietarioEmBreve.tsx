import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const INK  = '#1E1F18'
const BONE = '#F2EDE4'
const CLAY = '#C2553A'
const MOSS = '#6B7A5A'
const SAND = '#E8E0D0'

export default function ProprietarioEmBreve() {
  return (
    <div style={{ minHeight: '100vh', background: BONE }}>

      {/* Hero */}
      <div
        style={{
          background: INK,
          padding: 'clamp(80px, 12vw, 140px) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: CLAY,
            marginBottom: '32px',
          }}
        >
          Área do Proprietário · Em breve
        </p>

        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(32px, 6vw, 64px)',
            fontWeight: 400,
            color: BONE,
            lineHeight: 1.05,
            letterSpacing: '-1px',
            maxWidth: '720px',
            margin: '0 auto 24px',
          }}
        >
          Uma plataforma para quem tem imóveis, não apenas para quem os procura.
        </h1>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 19px)',
            color: 'rgba(242,237,228,0.55)',
            lineHeight: 1.65,
            maxWidth: '520px',
            margin: '0 auto',
          }}
        >
          Estamos a construir ferramentas para proprietários gerirem imóveis, publicarem anúncios e chegarem a compradores qualificados — sem intermediários desnecessários.
        </p>
      </div>

      {/* Cards do que vem aí */}
      <div
        className="px-5 sm:px-8 md:px-12"
        style={{ maxWidth: '880px', margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) 24px' }}
      >
        <p
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: CLAY,
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          O que vem aí
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: '56px' }}>
          {[
            {
              title: 'Publicar anúncios',
              body: 'Cria e gere anúncios de venda ou arrendamento com dados de mercado integrados.',
            },
            {
              title: 'Perfil do imóvel',
              body: 'PDM, classe energética, histórico de transações e zonamento num único lugar.',
            },
            {
              title: 'Contacto direto',
              body: 'Recebe pedidos de visita de compradores verificados — sem comissão de intermediário.',
            },
          ].map(card => (
            <div
              key={card.title}
              style={{
                background: SAND,
                borderRadius: '4px',
                padding: '28px 24px',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: MOSS,
                  marginBottom: '12px',
                }}
              >
                {card.title}
              </p>
              <p style={{ fontSize: '15px', color: INK, lineHeight: 1.6, margin: 0 }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA voltar */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'transparent',
              color: INK,
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
              borderRadius: '4px',
              border: '1px solid rgba(30, 31, 24, 0.2)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(30, 31, 24, 0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(30, 31, 24, 0.2)')}
          >
            <ArrowLeft size={14} /> Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
