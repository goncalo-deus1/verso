const CLAY = '#C2553A'
const INK  = '#1E1F18'
const BONE = '#F2EDE4'

interface ComparisonItem {
  label: string
  a: string
  b: string
}

interface ComparisonBoxProps {
  zoneA: string
  zoneB: string
  items: ComparisonItem[]
  winner?: string
}

/**
 * ComparisonBox — comparação visual entre duas zonas.
 *
 * Usage in MDX:
 * <ComparisonBox
 *   zoneA="Almada"
 *   zoneB="Lisboa"
 *   winner="Almada"
 *   items={[
 *     { label: 'Preço médio', a: '[PREÇO_ALMADA]', b: '[PREÇO_LISBOA]' },
 *     { label: 'Metro', a: 'Cacilhas → 8 min de barco', b: 'Rede alargada' },
 *   ]}
 * />
 */
export function ComparisonBox({ zoneA, zoneB, items, winner }: ComparisonBoxProps) {
  return (
    <div
      style={{
        border: '1px solid rgba(30,31,24,0.12)',
        borderRadius: '2px',
        overflow: 'hidden',
        margin: '40px 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          background: INK,
        }}
      >
        <div style={{ padding: '14px 20px' }} />
        {[zoneA, zoneB].map(zone => (
          <div
            key={zone}
            style={{
              padding: '14px 20px',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: winner === zone ? CLAY : 'rgba(255,255,255,0.5)',
                margin: 0,
              }}
            >
              {zone}
              {winner === zone && ' ★'}
            </p>
          </div>
        ))}
      </div>

      {/* Rows */}
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            background: i % 2 === 0 ? BONE : 'white',
            borderTop: '1px solid rgba(30,31,24,0.08)',
          }}
        >
          <div
            style={{
              padding: '13px 20px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: 'rgba(30,31,24,0.45)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {item.label}
          </div>
          {[item.a, item.b].map((val, j) => (
            <div
              key={j}
              style={{
                padding: '13px 20px',
                fontSize: '14px',
                color: INK,
                lineHeight: '1.5',
                borderLeft: '1px solid rgba(30,31,24,0.08)',
              }}
            >
              {val}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
