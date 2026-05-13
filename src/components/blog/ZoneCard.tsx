const CLAY = '#C2553A'
const INK  = '#1E1F18'

const eyebrow: React.CSSProperties = {
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '2px',
}

interface ZoneCardProps {
  name: string
  price: string
  for: string
  vibe: string
  future: string
  watch: string
}

/**
 * ZoneCard — bloco informativo de zona (migrado do ContentBlock 'zone').
 *
 * Usage in MDX:
 * <ZoneCard
 *   name="Marvila"
 *   price="4.200 – 6.800 €/m²"
 *   for="Jovens profissionais, primeiros compradores"
 *   vibe="Industrial reconvertido, galerias, Tejo próximo"
 *   future="Alto. Plano de urbanização em expansão"
 *   watch="Algumas zonas ainda em transição"
 * />
 */
export function ZoneCard({ name, price, for: forText, vibe, future, watch }: ZoneCardProps) {
  return (
    <div
      style={{
        background: '#E8E0D0',
        border: '1px solid rgba(30,31,24,0.1)',
        borderRadius: '2px',
        padding: '28px 32px',
        margin: '0 0 40px',
      }}
    >
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: CLAY,
          marginBottom: '16px',
        }}
      >
        {name}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: '1 1 180px' }}>
          <p style={{ ...eyebrow, color: CLAY, marginBottom: '6px' }}>Preço médio</p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', color: INK, fontWeight: 500 }}>{price}</p>
        </div>
        <div style={{ flex: '2 1 280px' }}>
          <p style={{ ...eyebrow, color: '#6B7A5A', marginBottom: '6px' }}>Para quem</p>
          <p style={{ fontSize: '14px', color: INK, lineHeight: '1.6' }}>{forText}</p>
        </div>
      </div>
      <div
        style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(30,31,24,0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
        }}
      >
        <div style={{ flex: '1 1 160px' }}>
          <p style={{ ...eyebrow, color: '#3A3B2E', marginBottom: '6px' }}>Vibe</p>
          <p style={{ fontSize: '13px', color: '#3A3B2E', lineHeight: '1.6' }}>{vibe}</p>
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <p style={{ ...eyebrow, color: '#3A3B2E', marginBottom: '6px' }}>Potencial</p>
          <p style={{ fontSize: '13px', color: '#3A3B2E', lineHeight: '1.6' }}>{future}</p>
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <p style={{ ...eyebrow, color: CLAY, marginBottom: '6px' }}>Atenção</p>
          <p style={{ fontSize: '13px', color: '#3A3B2E', lineHeight: '1.6' }}>{watch}</p>
        </div>
      </div>
    </div>
  )
}
