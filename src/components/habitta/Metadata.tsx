import { useLangSafe } from '../../context/LanguageContext'
import { useT } from '../../i18n/translations'

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
 * "Updated: X · Next review: Y · Sources: A, B, C."
 * JetBrains Mono, small.
 */
export function Metadata({ updated, nextReview, sources }: MetadataProps) {
  const { lang } = useLangSafe()
  const tr = useT(lang)
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
      <span>{tr('habitta.metadata.updated')}: {updated}</span>
      <span aria-hidden> · </span>
      <span>{tr('habitta.metadata.nextReview')}: {nextReview}</span>
      {sources.length > 0 ? (
        <>
          <span aria-hidden> · </span>
          <span>
            {tr('habitta.metadata.sources')}:{' '}
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
