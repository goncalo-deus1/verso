import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const INK  = '#1E1F18'
const BONE = '#F2EDE4'
const CLAY = '#C2553A'
const MOSS = '#6B7A5A'

export default function EmBreve() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: BONE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
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
        Em breve
      </p>

      <h1
        className="font-display"
        style={{
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: 400,
          color: INK,
          lineHeight: 1.1,
          letterSpacing: '-1px',
          maxWidth: '600px',
          marginBottom: '24px',
        }}
      >
        Os imóveis estão a chegar.
      </h1>

      <p
        style={{
          fontSize: '18px',
          color: MOSS,
          lineHeight: 1.6,
          maxWidth: '440px',
          marginBottom: '48px',
        }}
      >
        Esta secção está a ser preparada. Por enquanto, usa o quiz para encontrar a zona certa — os imóveis seguem-se em breve.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          to="/quiz"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            background: CLAY,
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            borderRadius: '4px',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Fazer o quiz
        </Link>

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
          <ArrowLeft size={14} /> Início
        </Link>
      </div>
    </div>
  )
}
