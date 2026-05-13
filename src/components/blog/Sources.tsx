const CLAY = '#C2553A'
const INK  = '#1E1F18'

interface Source {
  label: string
  href?: string
  note?: string
}

interface SourcesProps {
  items: Source[]
}

/**
 * Sources — lista de fontes citadas no artigo.
 *
 * Usage in MDX:
 * <Sources items={[
 *   { label: 'INE — Censos 2021', href: 'https://www.ine.pt', note: 'Dados demográficos' },
 *   { label: 'PDM de Lisboa 2023', note: 'Aprovado em Câmara Municipal' },
 * ]} />
 */
export function Sources({ items }: SourcesProps) {
  if (!items || items.length === 0) return null

  return (
    <section
      style={{
        margin: '64px 0 0',
        paddingTop: '32px',
        borderTop: '1px solid rgba(30,31,24,0.1)',
      }}
    >
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: CLAY,
          marginBottom: '16px',
        }}
      >
        Fontes
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((src, i) => (
          <li
            key={i}
            style={{
              fontSize: '13px',
              color: '#3A3B2E',
              display: 'flex',
              gap: '10px',
              alignItems: 'baseline',
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                color: CLAY,
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              [{i + 1}]
            </span>
            <span>
              {src.href ? (
                <a
                  href={src.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: INK, textDecoration: 'underline', textDecorationColor: 'rgba(30,31,24,0.3)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.textDecorationColor = CLAY)}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.textDecorationColor = 'rgba(30,31,24,0.3)')}
                >
                  {src.label}
                </a>
              ) : (
                <span style={{ color: INK }}>{src.label}</span>
              )}
              {src.note && (
                <span style={{ color: 'rgba(30,31,24,0.45)', marginLeft: '8px' }}>— {src.note}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
