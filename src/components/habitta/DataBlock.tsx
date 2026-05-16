export interface DataBlockRow {
  label: string
  value: string
  source?: string
}

interface DataBlockProps {
  rows: DataBlockRow[]
  caption?: string
}

/**
 * DataBlock — two-column data grid (JetBrains Mono, uppercase labels).
 * Renders "preço mediano · variação YoY · …" style tables.
 * Source text is shown as a small superscript-style note per row.
 */
export function DataBlock({ rows, caption }: DataBlockProps) {
  return (
    <section
      aria-label={caption ?? 'Dados-chave'}
      style={{
        border: '1px solid rgba(44, 44, 42, 0.15)',
        borderRadius: '2px',
        background: 'var(--bone)',
        margin: 'var(--space-5) 0',
      }}
    >
      {caption ? (
        <p
          style={{
            fontFamily: 'var(--font-mono-stack)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--clay)',
            padding: 'var(--space-2) var(--space-3) 0',
            margin: 0,
          }}
        >
          {caption}
        </p>
      ) : null}
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1px',
          background: 'rgba(44, 44, 42, 0.15)',
          margin: 0,
          padding: '1px',
        }}
      >
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bone)',
              padding: 'var(--space-3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <dt
              style={{
                fontFamily: 'var(--font-mono-stack)',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '1.8px',
                color: 'var(--charcoal)',
                opacity: 0.7,
                margin: 0,
              }}
            >
              {row.label}
            </dt>
            <dd
              style={{
                fontFamily: 'var(--font-display-stack)',
                fontSize: '22px',
                color: 'var(--charcoal)',
                fontWeight: 400,
                letterSpacing: '-0.2px',
                margin: 0,
              }}
            >
              {row.value}
            </dd>
            {row.source ? (
              <p
                style={{
                  fontFamily: 'var(--font-mono-stack)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  color: 'var(--charcoal)',
                  opacity: 0.55,
                  margin: 0,
                }}
              >
                {row.source}
              </p>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  )
}
