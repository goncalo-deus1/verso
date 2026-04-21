import { useParams, Link, Navigate } from 'react-router-dom'
import { freguesias } from '../data/freguesias'
import { concelhos } from '../data/concelhos'

const INK      = '#0E1116'
const BONE     = '#F5F1EA'
const CLAY     = '#B8624A'
const MOSS     = '#3E5A48'
const SAND     = '#E6DDCD'
const STONE    = '#6B6B68'
const HAIRLINE = '#D9D2C3'

export default function FreguesiDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const freguesia = freguesias.find(f => f.slug === slug)

  if (!freguesia) return <Navigate to="/404" replace />

  const concelho = concelhos.find(c => c.slug === freguesia.concelhoSlug)

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
      label: 'Idade mediana',
      value: freguesia.hardFacts.medianAgeYears != null
        ? `${freguesia.hardFacts.medianAgeYears} anos`
        : '— a confirmar',
    },
    {
      label: 'Metro/elétrico/comboio à Baixa',
      value: freguesia.hardFacts.tramMetroOrTrainToBaixaMinutes != null
        ? `${freguesia.hardFacts.tramMetroOrTrainToBaixaMinutes} min`
        : '— a confirmar',
    },
    {
      label: 'Renda mediana T2',
      value: freguesia.hardFacts.medianT2RentEuros != null
        ? `${freguesia.hardFacts.medianT2RentEuros} €/mês`
        : '— a confirmar',
    },
    {
      label: 'Tendência populacional (3 anos)',
      value: freguesia.hardFacts.populationTrend3y != null
        ? { growing: 'Em crescimento', stable: 'Estável', declining: 'Em declínio' }[freguesia.hardFacts.populationTrend3y]
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

      {/* Conteúdo editorial */}
      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 48px 120px', boxSizing: 'border-box' }}>

        {/* Eyebrow */}
        <p style={eyebrow}>
          FREGUESIA · {(concelho?.name ?? 'Lisboa').toUpperCase()}
        </p>

        {/* H1 */}
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 400, color: INK, lineHeight: 1.05, marginBottom: '16px' }}
        >
          {freguesia.name}
        </h1>

        {/* oneLine */}
        <p style={{ fontSize: '22px', fontStyle: 'italic', color: MOSS, lineHeight: 1.5, marginBottom: '32px' }}>
          {freguesia.oneLine}
        </p>

        {/* Divisor */}
        <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '40px' }} />

        {/* Descrição honesta */}
        <p style={{ fontSize: '19px', color: INK, lineHeight: 1.65, marginBottom: '48px' }}>
          {freguesia.honestDescription}
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
            <p style={{ fontSize: '16px', color: INK, lineHeight: 1.6, margin: 0 }}>{freguesia.whoFitsHere}</p>
          </div>
          <div style={{ background: SAND, borderRadius: '4px', padding: '28px' }}>
            <p style={{ ...eyebrow, marginBottom: '12px' }}>Quem não se dá bem aqui</p>
            <p style={{ fontSize: '16px', color: INK, lineHeight: 1.6, margin: 0 }}>{freguesia.whoDoesNotFit}</p>
          </div>
        </div>

        {/* Três ruas para conhecer */}
        <section style={{ marginBottom: '56px' }}>
          <h2
            className="font-display"
            style={{ fontSize: '26px', fontWeight: 400, color: INK, marginBottom: '24px' }}
          >
            Três ruas para conhecer
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {freguesia.referenceStreets.map(street => (
              <div key={street.name} style={{ borderLeft: `2px solid ${HAIRLINE}`, paddingLeft: '20px' }}>
                <p className="font-display" style={{ fontSize: '18px', fontWeight: 400, color: INK, margin: '0 0 4px' }}>
                  {street.name}
                </p>
                <p style={{ fontSize: '15px', color: STONE, margin: 0, lineHeight: 1.5 }}>
                  {street.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
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
            Ver os imóveis em {freguesia.name}
          </Link>

          {concelho && (
            <Link
              to={`/concelho/${concelho.slug}`}
              style={{ color: STONE, fontSize: '14px', textDecoration: 'underline' }}
            >
              Parte do concelho de {concelho.name} ↗
            </Link>
          )}
        </div>
      </article>
    </div>
  )
}
