import type { ReactNode } from 'react'

type Props = {
  title: ReactNode
  badge: string
  description: string
}

export function EditorialCard({ title, badge, description }: Props) {
  return (
    <div
      style={{
        background: 'white',
        borderLeft: '3px solid var(--telha)',
        padding: '14px 18px',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
        }}
      >
        <strong
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontWeight: 500,
            fontSize: '17px',
            color: 'var(--azeitona)',
          }}
        >
          {title}
        </strong>
        <code
          style={{
            fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--salva)',
            background: 'none',
            padding: 0,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {badge}
        </code>
      </div>
      <p
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '14px',
          lineHeight: 1.6,
          color: 'var(--azeitona-medio)',
          margin: '6px 0 0',
        }}
      >
        {description}
      </p>
    </div>
  )
}
