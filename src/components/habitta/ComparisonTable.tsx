export interface ComparisonColumn {
  key: string
  label: string
}

export type ComparisonRow = Record<string, string>

interface ComparisonTableProps {
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
  caption?: string
}

/**
 * ComparisonTable — compact "this vs adjacent freguesias" table.
 * Mono headers, Inter body. The first column is treated as the
 * row label (left-aligned, no opacity dim).
 */
export function ComparisonTable({ columns, rows, caption }: ComparisonTableProps) {
  if (!columns || columns.length === 0) return null
  const [firstCol, ...restCols] = columns

  return (
    <div
      style={{
        margin: 'var(--space-5) 0',
        overflowX: 'auto',
        border: '1px solid rgba(44, 44, 42, 0.15)',
        borderRadius: '2px',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-body-stack)',
          fontSize: '15px',
          color: 'var(--charcoal)',
        }}
      >
        {caption ? (
          <caption
            style={{
              captionSide: 'top',
              textAlign: 'left',
              fontFamily: 'var(--font-mono-stack)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--clay)',
              padding: 'var(--space-2) var(--space-3)',
            }}
          >
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr>
            <th
              scope="col"
              style={{
                fontFamily: 'var(--font-mono-stack)',
                fontSize: '11px',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '1.8px',
                color: 'var(--charcoal)',
                opacity: 0.7,
                textAlign: 'left',
                padding: 'var(--space-2) var(--space-3)',
                borderBottom: '1px solid rgba(44, 44, 42, 0.15)',
              }}
            >
              {firstCol.label}
            </th>
            {restCols.map(col => (
              <th
                key={col.key}
                scope="col"
                style={{
                  fontFamily: 'var(--font-mono-stack)',
                  fontSize: '11px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '1.8px',
                  color: 'var(--charcoal)',
                  opacity: 0.7,
                  textAlign: 'left',
                  padding: 'var(--space-2) var(--space-3)',
                  borderBottom: '1px solid rgba(44, 44, 42, 0.15)',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <th
                scope="row"
                style={{
                  fontFamily: 'var(--font-display-stack)',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: 'var(--charcoal)',
                  textAlign: 'left',
                  padding: 'var(--space-2) var(--space-3)',
                  borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgba(44, 44, 42, 0.1)',
                }}
              >
                {row[firstCol.key] ?? ''}
              </th>
              {restCols.map(col => (
                <td
                  key={col.key}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    borderBottom: i === rows.length - 1 ? 'none' : '1px solid rgba(44, 44, 42, 0.1)',
                  }}
                >
                  {row[col.key] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
