import { useParams, Link } from 'react-router-dom'
import { freguesias } from '../data/freguesias'
import { concelhosAML } from '../data/concelhosAML'
import SaveZoneButton from '../components/SaveZoneButton'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

export default function FreguesiDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const freguesia = slug ? freguesias.find(f => f.slug === slug) : undefined

  if (!freguesia) return (
    <main className="min-h-screen bg-verso-paper flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-verso-clay mb-4">
          § Freguesia não encontrada
        </p>
        <p className="font-display text-3xl text-verso-midnight mb-6">
          Esta freguesia não existe no nosso atlas.
        </p>
        <Link to="/" className="font-mono text-xs tracking-[0.15em] uppercase text-verso-midnight hover:text-verso-clay">
          ← Voltar ao mapa
        </Link>
      </div>
    </main>
  )

  const concelho = concelhosAML.find(c => c.slug === freguesia.concelhoSlug)

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
      {/* Conteúdo editorial */}
      <article className="px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-24" style={{ maxWidth: '680px', margin: '0 auto', boxSizing: 'border-box' }}>

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

        {/* Save button */}
        <div style={{ marginBottom: '24px' }}>
          <SaveZoneButton zoneSlug={freguesia.slug} zoneKind="freguesia" zoneName={freguesia.name} />
        </div>

        {/* Divisor */}
        <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '40px' }} />

        {/* Descrição honesta */}
        <p style={{ fontSize: '19px', color: INK, lineHeight: 1.65, marginBottom: '48px' }}>
          {freguesia.honestDescription}
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
