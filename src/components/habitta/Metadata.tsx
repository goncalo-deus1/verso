export interface MetadataSource {
  label: string
  href?: string
}

interface MetadataProps {
  /** ISO date string (YYYY-MM-DD). */
  updated: string
  /** ISO date string (YYYY-MM-DD). */
  nextReview: string
  sources: MetadataSource[]
}

/**
 * Metadata — page-footer attribution block.
 * "Atualizado: X · Próxima revisão: Y · Fontes: A, B, C."
 * JetBrains Mono, small.
 */
export function Metadata({ updated, nextReview, sources }: MetadataProps) {
  return (
    <footer
      style={{
        margin: 'var(--space-6) 0 0',
        paddingTop: 'var(--space-3)',
        borderTop: '1px solid rgba(44, 44, 42, 0.15)',
        fontFamily: 'var(--font-mono-stack)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: 'var(--charcoal)',
        opacity: 0.7,
        lineHeight: 1.7,
      }}
    >
      <span>Atualizado: {updated}</span>
      <span aria-hidden> · </span>
      <span>Próxima revisão: {nextReview}</span>
      {sources.length > 0 ? (
        <>
          <span aria-hidden> · </span>
          <span>
            Fontes:{' '}
            {sources.map((s, i) => (
              <span key={i}>
                {s.href ? (
                  <a
                    href={s.href}
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    {s.label}
                  </a>
                ) : (
                  s.label
                )}
                {i < sources.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        </>
      ) : null}
    </footer>
  )
}
