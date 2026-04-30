import { useEffect } from 'react'
import { useParams, useSearchParams, Navigate, Link } from 'react-router-dom'
import { concelhosAML } from '../data/concelhosAML'

const AZEITONA       = 'var(--azeitona)'
const AZEITONA_MEDIO = 'var(--azeitona-medio)'
const LINHO          = 'var(--linho)'
const TELHA          = 'var(--telha)'
const TRACO          = 'var(--traco)'
const TELHA_DARK     = '#B24A30'

export default function SharedResult() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const ref = searchParams.get('ref')

  const concelho = concelhosAML.find(c => c.slug === slug)

  useEffect(() => {
    if (!slug) return
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'shared_result_view', {
      zone_slug:    slug,
      share_source: ref ?? 'unknown',
    })
  }, [slug, ref])

  if (!concelho) return <Navigate to="/quiz" replace />

  const populacao = concelho.populationApprox != null
    ? `${concelho.populationApprox.toLocaleString('pt-PT')} hab.`
    : '—'

  const renda = concelho.budgetFitT2 != null
    ? `€${concelho.budgetFitT2.min.toLocaleString('pt-PT')}–€${concelho.budgetFitT2.max.toLocaleString('pt-PT')}`
    : '—'

  const margem = concelho.margem === 'norte' ? 'Margem Norte' : 'Margem Sul'

  const facts: { label: string; value: string }[] = [
    { label: 'Margem', value: margem },
    { label: 'População', value: populacao },
    { label: 'Renda T2', value: renda },
    { label: 'Transportes', value: concelho.transport },
  ]

  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '64px',
        paddingBottom: '80px',
      }}
      className="habitta-px md:py-20"
    >
      {/* ── Secção 1: Hero ─────────────────────────────────────────── */}
      <section aria-labelledby="shared-result-heading">
        {/* Eyebrow principal */}
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: TELHA,
            margin: '0 0 20px',
          }}
        >
          Alguém partilhou contigo
        </p>

        {/* H1 */}
        <h1
          id="shared-result-heading"
          className="font-display"
          style={{
            fontSize: 'clamp(64px, 8vw, 96px)',
            letterSpacing: '-2px',
            lineHeight: 1.05,
            color: AZEITONA,
            margin: '0 0 24px',
          }}
        >
          o {concelho.name}
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 'clamp(18px, 2.2vw, 22px)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            color: AZEITONA_MEDIO,
            maxWidth: '640px',
            margin: '0 0 32px',
          }}
        >
          "{concelho.oneLine}"
        </p>

        {/* Eyebrow destaque */}
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: TELHA,
            margin: '0 0 12px',
          }}
          aria-hidden="true"
        >
          Destaque
        </p>

        {/* signalProperty */}
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '16px',
            lineHeight: 1.7,
            color: AZEITONA,
            maxWidth: '640px',
            margin: 0,
          }}
        >
          {concelho.signalProperty}
        </p>
      </section>

      {/* ── Secção 2: Quick facts ──────────────────────────────────── */}
      <section
        aria-label="Factos rápidos"
        style={{ marginTop: '64px' }}
      >
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
          className="md:grid-cols-4"
        >
          {facts.map(({ label, value }) => (
            <li
              key={label}
              style={{
                background: LINHO,
                border: `1px solid ${TRACO}`,
                padding: '24px',
                borderRadius: '2px',
              }}
            >
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1.4px',
                  color: TELHA,
                  margin: '0 0 10px',
                }}
              >
                {label}
              </p>
              <p
                className="font-display"
                style={{
                  fontSize: '24px',
                  color: AZEITONA,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {value}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Secção 3: CTA ──────────────────────────────────────────── */}
      <section
        aria-label="Fazer o teste"
        style={{ marginTop: '64px' }}
      >
        <div
          style={{
            background: TELHA_DARK,
            color: LINHO,
            padding: '48px',
            borderRadius: '2px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            {/* Eyebrow CTA */}
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2.5px',
                color: LINHO,
                opacity: 0.7,
                margin: '0 0 16px',
              }}
            >
              Ainda não fizeste o teste?
            </p>

            {/* H2 */}
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(40px, 5vw, 56px)',
                color: LINHO,
                margin: '0 0 20px',
                lineHeight: 1.1,
              }}
            >
              Descobre qual é a tua zona ideal.
            </h2>

            {/* Descrição */}
            <p
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '16px',
                color: LINHO,
                opacity: 0.85,
                maxWidth: '480px',
                margin: '0 auto 32px',
                lineHeight: 1.6,
              }}
            >
              A AML tem 18 concelhos. Cada um com perfil próprio.
              Em 2 minutos descobres qual faz mais sentido para ti.
            </p>

            {/* Botão */}
            <Link
              to="/quiz"
              aria-label="Fazer o teste de zona ideal da habitta"
              style={{
                display: 'inline-block',
                background: LINHO,
                color: TELHA_DARK,
                padding: '16px 32px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                borderRadius: '50px',
                textDecoration: 'none',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 31, 24, 0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Fazer o teste →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Secção 4: Footer leve ──────────────────────────────────── */}
      <footer
        style={{ marginTop: '64px', textAlign: 'center' }}
        aria-label="Rodapé da página partilhada"
      >
        <Link
          to="/"
          aria-label="Ir para a página inicial da habitta"
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: AZEITONA_MEDIO,
            opacity: 0.6,
            textDecoration: 'none',
            transition: 'color 150ms ease, opacity 150ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = TELHA
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = AZEITONA_MEDIO
            e.currentTarget.style.opacity = '0.6'
          }}
        >
          habitta · A zona certa antes da casa certa
        </Link>
      </footer>
    </div>
  )
}
