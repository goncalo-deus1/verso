import { Link } from 'react-router-dom'

const INK  = '#1E1F18'
const CLAY = '#C2553A'
const BONE = '#F2EDE4'

interface HabittaCalloutProps {
  children: React.ReactNode
  /** When true renders a dark CTA block instead of the editorial callout */
  cta?: boolean
  heading?: string
  href?: string
  label?: string
}

/**
 * HabittaCallout — two modes:
 *
 * 1. Editorial callout (default): ivory bg, clay left border, italic prose.
 *    Usage in MDX: <HabittaCallout>Texto da caixa.</HabittaCallout>
 *
 * 2. CTA block: dark ink bg, used at the end of articles.
 *    Usage in MDX:
 *    <HabittaCallout cta heading="Título" href="/quiz" label="Fazer o quiz">
 *      Subtexto do CTA.
 *    </HabittaCallout>
 */
export function HabittaCallout({
  children,
  cta = false,
  heading,
  href = '/quiz',
  label = 'Fazer o quiz',
}: HabittaCalloutProps) {
  if (cta) {
    return (
      <div
        style={{
          background: INK,
          borderRadius: '2px',
          padding: 'clamp(40px, 5vw, 64px) clamp(32px, 5vw, 56px)',
          margin: '64px 0 0',
          textAlign: 'center',
        }}
      >
        {heading && (
          <h3
            className="font-display"
            style={{
              fontSize: 'clamp(22px, 3vw, 34px)',
              color: BONE,
              letterSpacing: '-0.7px',
              marginBottom: '14px',
              fontWeight: 400,
            }}
          >
            {heading}
          </h3>
        )}
        <div
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '1.75',
            maxWidth: '480px',
            margin: '0 auto 32px',
          }}
        >
          {children}
        </div>
        <Link
          to={href}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 30px',
            background: CLAY,
            color: 'white',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
            borderRadius: '4px',
            transition: 'opacity 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {label}
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        borderLeft: `3px solid ${CLAY}`,
        background: '#EDE9E1',
        padding: '22px 28px',
        margin: '36px 0',
        borderRadius: '0 2px 2px 0',
      }}
    >
      <div
        style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '18px',
          lineHeight: '1.65',
          color: INK,
          margin: 0,
        }}
      >
        {children}
      </div>
    </div>
  )
}
