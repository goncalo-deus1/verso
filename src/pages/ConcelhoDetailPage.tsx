import { useParams, Link, Navigate } from 'react-router-dom'
import { concelhos } from '../data/concelhos'
import { freguesias } from '../data/freguesias'

const INK      = '#0E1116'
const BONE     = '#F5F1EA'
const CLAY     = '#B8624A'
const MOSS     = '#3E5A48'
const SAND     = '#E6DDCD'
const STONE    = '#6B6B68'
const HAIRLINE = '#D9D2C3'

export default function ConcelhoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const concelho = concelhos.find(c => c.slug === slug)

  if (!concelho) return <Navigate to="/404" replace />

  const coveredFreguesias = freguesias.filter(f => concelho.freguesiasCovered.includes(f.slug))
  const totalEstimatedFreguesias = coveredFreguesias.length === 0 ? '?' : undefined

  const eyebrow: React.CSSProperties = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '2.5px',
    color: CLAY,
    margin: '0 0 24px',
  }

  const facts = [
    {
      label: 'População aproximada',
      value: concelho.hardFacts.populationApprox != null
        ? `${concelho.hardFacts.populationApprox.toLocaleString('pt-PT')} hab.`
        : '— a confirmar',
    },
    {
      label: 'Percurso mediano à Baixa',
      value: concelho.hardFacts.medianCommuteToLisboaBaixaMinutes != null
        ? `${concelho.hardFacts.medianCommuteToLisboaBaixaMinutes} min`
        : '— a confirmar',
    },
    {
      label: 'Renda mediana T2',
      value: concelho.hardFacts.medianT2RentEuros != null
        ? `${concelho.hardFacts.medianT2RentEuros} €/mês`
        : '— a confirmar',
    },
    {
      label: 'Tendência (3 anos)',
      value: concelho.hardFacts.populationTrend3y != null
        ? { growing: 'Em crescimento', stable: 'Estável', declining: 'Em declínio' }[concelho.hardFacts.populationTrend3y]
        : '— a confirmar',
    },
  ]

  return (
    <div style={{ background: BONE, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '32px 48px 0', maxWidth: '760px', margin: '0 auto' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ fontSize: '20px', color: INK, letterSpacing: '-0.5px' }}>VERSO</span>
        </Link>
      </div>

      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 48px 120px', boxSizing: 'border-box' }}>

        {/* Eyebrow */}
        <p style={eyebrow}>
          CONCELHO · {concelho.margem === 'norte' ? 'MARGEM NORTE' : 'MARGEM SUL'}
        </p>

        {/* H1 */}
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 400, color: INK, lineHeight: 1.05, marginBottom: '16px' }}
        >
          {concelho.name}
        </h1>

        {/* oneLine */}
        <p style={{ fontSize: '22px', fontStyle: 'italic', color: MOSS, lineHeight: 1.5, marginBottom: '32px' }}>
          {concelho.oneLine}
        </p>

        {/* Divisor */}
        <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '40px' }} />

        {/* Descrição */}
        <p style={{ fontSize: '19px', color: INK, lineHeight: 1.65, marginBottom: '48px' }}>
          {concelho.honestDescription}
        </p>

        {/* Hard facts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '24px',
          marginBottom: '48px',
          padding: '32px',
          background: SAND,
          borderRadius: '4px',
        }}>
          {facts.map(f => (
            <div key={f.label}>
              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, margin: '0 0 6px' }}>
                {f.label}
              </p>
              <p style={{ fontSize: '18px', color: INK, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {f.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quem se dá bem / mal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '48px',
        }}>
          <div style={{ background: SAND, borderRadius: '4px', padding: '28px' }}>
            <p style={{ ...eyebrow, marginBottom: '12px' }}>Quem se dá bem aqui</p>
            <p style={{ fontSize: '16px', color: INK, lineHeight: 1.6, margin: 0 }}>{concelho.whoFitsHere}</p>
          </div>
          <div style={{ background: SAND, borderRadius: '4px', padding: '28px' }}>
            <p style={{ ...eyebrow, marginBottom: '12px' }}>Quem não se dá bem aqui</p>
            <p style={{ fontSize: '16px', color: INK, lineHeight: 1.6, margin: 0 }}>{concelho.whoDoesNotFit}</p>
          </div>
        </div>

        {/* Freguesias cobertas */}
        <section style={{ marginBottom: '48px' }}>
          <h2
            className="font-display"
            style={{ fontSize: '26px', fontWeight: 400, color: INK, marginBottom: '8px' }}
          >
            Freguesias cobertas
          </h2>

          {coveredFreguesias.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                {coveredFreguesias.map(f => (
                  <Link
                    key={f.slug}
                    to={`/freguesia/${f.slug}`}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 20px',
                      background: SAND, borderRadius: '4px',
                      textDecoration: 'none',
                      color: INK,
                      fontSize: '16px',
                    }}
                  >
                    <span className="font-display" style={{ fontWeight: 400 }}>{f.name}</span>
                    <span style={{ color: CLAY, fontSize: '14px' }}>→</span>
                  </Link>
                ))}
              </div>
              <p style={{ fontSize: '14px', color: STONE, marginTop: '20px', lineHeight: 1.5 }}>
                Ainda só cobrimos {coveredFreguesias.length}{totalEstimatedFreguesias ? '' : ''} {coveredFreguesias.length === 1 ? 'freguesia' : 'freguesias'} deste concelho. Estamos a caminhar pelas outras.
              </p>
            </>
          ) : (
            <p style={{ fontSize: '16px', color: STONE, lineHeight: 1.5, marginTop: '16px' }}>
              Ainda não temos cobertura editorial de nenhuma freguesia de {concelho.name}. Estamos a caminhar por elas.
            </p>
          )}
        </section>

        {/* CTA */}
        <Link
          to="/imoveis"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: CLAY,
            color: 'white',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Ver os imóveis em {concelho.name}
        </Link>
      </article>
    </div>
  )
}
