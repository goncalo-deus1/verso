import { useParams, Link, Navigate } from 'react-router-dom'
import { concelhos } from '../data/concelhos'
import { freguesias } from '../data/freguesias'
import SaveZoneButton from '../components/SaveZoneButton'
import { PdmSection } from '../components/concelho/PdmSection'
import { UrbanProjectsSection } from '../components/concelho/UrbanProjectsSection'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

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
      <article className="px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-24" style={{ maxWidth: '680px', margin: '0 auto', boxSizing: 'border-box' }}>

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

        {/* Save button */}
        <div style={{ marginBottom: '24px' }}>
          <SaveZoneButton zoneSlug={concelho.slug} zoneKind="concelho" zoneName={concelho.name} />
        </div>

        {/* Divisor */}
        <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '40px' }} />

        {/* Descrição */}
        <p style={{ fontSize: '19px', color: INK, lineHeight: 1.65, marginBottom: '48px' }}>
          {concelho.honestDescription}
        </p>

        {/* Hard facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 lg:p-8" style={{
          marginBottom: '48px',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '48px' }}>
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
          to="/areas"
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

      {/* PDM */}
      <section className="habitta-px py-16 md:py-20" style={{ background: SAND }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <PdmSection concelhoSlug={slug!} />
        </div>
      </section>

      {/* Projetos urbanos */}
      <section className="habitta-px py-16 md:py-20" style={{ background: BONE }}>
        <UrbanProjectsSection concelhoSlug={slug!} concelhoName={concelho.name} />
      </section>

    </div>
  )
}
