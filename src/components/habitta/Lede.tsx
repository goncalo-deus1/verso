import type { ReactNode, CSSProperties } from 'react'

interface LedeProps {
  children: ReactNode
  style?: CSSProperties
}

/**
 * Lede — opening 2–3 sentences of any editorial page.
 * Must appear inside the first 200 rendered words so AI extractors
 * pick it up. Coral italic on <em> emphasis (handled by .habitta-editorial).
 */
export function Lede({ children, style }: LedeProps) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-display-stack)',
        fontSize: 'clamp(22px, 2.6vw, 32px)',
        lineHeight: 1.32,
        letterSpacing: '-0.3px',
        color: 'var(--charcoal)',
        fontWeight: 300,
        margin: '0 0 var(--space-5)',
        maxWidth: '38em',
        ...style,
      }}
    >
      {children}
    </p>
  )
}
