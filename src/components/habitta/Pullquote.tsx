import type { ReactNode } from 'react'

interface PullquoteProps {
  children: ReactNode
  cite?: string
}

/**
 * Pullquote — oversized editorial quote.
 * Coral italic emphasis applied via <em> on the key phrase.
 */
export function Pullquote({ children, cite }: PullquoteProps) {
  return (
    <figure
      style={{
        margin: 'var(--space-6) 0',
        borderLeft: '3px solid var(--clay)',
        paddingLeft: 'var(--space-3)',
      }}
    >
      <blockquote
        style={{
          fontFamily: 'var(--font-display-stack)',
          fontSize: 'clamp(28px, 4vw, 44px)',
          lineHeight: 1.18,
          letterSpacing: '-0.6px',
          color: 'var(--charcoal)',
          fontWeight: 300,
          margin: 0,
          maxWidth: '20em',
        }}
      >
        {children}
      </blockquote>
      {cite ? (
        <figcaption
          style={{
            fontFamily: 'var(--font-mono-stack)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--charcoal)',
            opacity: 0.6,
            marginTop: 'var(--space-2)',
          }}
        >
          — {cite}
        </figcaption>
      ) : null}
    </figure>
  )
}
