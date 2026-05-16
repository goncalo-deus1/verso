interface CTAProps {
  headline: string
  href: string
  duration: string
}

/**
 * CTA — coral background, bone text. Always includes a duration promise.
 * The duration prop is REQUIRED — empty CTAs without a time commitment
 * violate the brand spec.
 */
export function CTA({ headline, href, duration }: CTAProps) {
  return (
    <aside
      style={{
        background: 'var(--clay)',
        color: 'var(--bone)',
        padding: 'var(--space-5) var(--space-4)',
        margin: 'var(--space-6) 0',
        borderRadius: '2px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono-stack)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: 'var(--bone)',
          opacity: 0.85,
          margin: '0 0 var(--space-2)',
        }}
      >
        {duration}
      </p>
      <h2
        style={{
          fontFamily: 'var(--font-display-stack)',
          fontSize: 'clamp(28px, 3.6vw, 44px)',
          lineHeight: 1.15,
          letterSpacing: '-0.6px',
          color: 'var(--bone)',
          fontWeight: 300,
          margin: '0 0 var(--space-3)',
          maxWidth: '18em',
        }}
      >
        {headline}
      </h2>
      <a
        href={href}
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-mono-stack)',
          fontSize: '13px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: 'var(--bone)',
          background: 'transparent',
          border: '1px solid var(--bone)',
          padding: 'var(--space-2) var(--space-3)',
          textDecoration: 'none',
        }}
      >
        Começar →
      </a>
    </aside>
  )
}
