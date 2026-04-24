import { Link } from 'react-router-dom'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

type Props = {
  onRestart: () => void
}

export function ResultMetodologia({ onRestart }: Props) {
  return (
    <section style={{
      background: SAND,
      borderTop: `1px solid ${HAIRLINE}`,
    }}>
      <div style={{
        maxWidth: '1440px', margin: '0 auto',
        padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,48px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(32px, 4vw, 64px)',
        alignItems: 'start',
      }}>

        {/* Nota editorial */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ display: 'block', width: '24px', height: '1px', background: CLAY }} aria-hidden />
            <p style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase',
              color: CLAY, margin: 0,
            }}>
              Nota metodológica
            </p>
          </div>
          <p className="font-fraunces" style={{
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.02em', color: INK,
            margin: '0 0 16px',
          }}>
            Isto é um começo,<br />
            não um veredicto.
          </p>
          <p style={{ fontSize: '14px', lineHeight: 1.75, color: STONE, margin: 0 }}>
            O algoritmo mede distâncias entre o teu perfil e 10 dimensões de cada zona —
            centralidade, transportes, tranquilidade, ambiente familiar, e mais.
            Score 100 seria correspondência perfeita em todas as dimensões.
            A realidade é sempre mais rica do que um número.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            to="/areas"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px',
              background: INK, color: BONE,
              fontSize: '12px', fontWeight: 500, textDecoration: 'none',
              fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = CLAY)}
            onMouseLeave={e => (e.currentTarget.style.background = INK)}
          >
            Explorar todas as zonas
            <span>→</span>
          </Link>

          <Link
            to="/editorial"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px',
              background: 'none', color: INK,
              fontSize: '12px', fontWeight: 500, textDecoration: 'none',
              border: `1px solid ${HAIRLINE}`,
              fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Ler artigos editoriais
            <span>→</span>
          </Link>

          <button
            onClick={onRestart}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: STONE, fontSize: '12px', textDecoration: 'underline',
              padding: '8px 0', textAlign: 'left',
              fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            ← Refazer o questionário
          </button>
        </div>

      </div>
    </section>
  )
}
