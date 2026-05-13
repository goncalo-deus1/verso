const CLAY = '#C2553A'
const INK  = '#1E1F18'
const BONE = '#F2EDE4'

interface DataTableProps {
  headers: string[]
  rows: string[][]
  caption?: string
  source?: string
}

/**
 * DataTable — tabela de dados com cabeçalhos em mono caps.
 *
 * Usage in MDX:
 * <DataTable
 *   headers={['Concelho', 'Preço médio €/m²', 'Score Habitta']}
 *   rows={[
 *     ['Lisboa', '[PREÇO_LISBOA]', '82'],
 *     ['Almada', '[PREÇO_ALMADA]', '74'],
 *   ]}
 *   caption="Tabela comparativa AML 2026"
 *   source="INE, 2026"
 * />
 */
export function DataTable({ headers, rows, caption, source }: DataTableProps) {
  return (
    <figure style={{ margin: '40px 0', overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '15px',
          minWidth: '480px',
        }}
      >
        {caption && (
          <caption
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: CLAY,
              textAlign: 'left',
              paddingBottom: '12px',
            }}
          >
            {caption}
          </caption>
        )}
        <thead>
          <tr style={{ background: '#E8E0D0', borderBottom: `2px solid rgba(30,31,24,0.15)` }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: INK,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: 600,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '1px solid rgba(30,31,24,0.1)',
                background: i % 2 === 0 ? BONE : 'white',
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: '12px 16px',
                    color: j === 0 ? INK : '#3A3A3A',
                    fontWeight: j === 0 ? 500 : 400,
                    lineHeight: '1.5',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {source && (
        <figcaption
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            color: 'rgba(30,31,24,0.4)',
            marginTop: '8px',
            textAlign: 'right',
          }}
        >
          Fonte: {source}
        </figcaption>
      )}
    </figure>
  )
}
