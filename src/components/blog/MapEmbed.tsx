const CLAY = '#C2553A'

interface MapEmbedProps {
  zone: string
  caption?: string
}

/**
 * MapEmbed — placeholder para futuro embed do mapa interativo.
 * Substitui por um iframe ou componente real quando o mapa estiver pronto.
 *
 * Usage in MDX:
 * <MapEmbed zone="Amadora" caption="Mapa das freguesias da Amadora" />
 */
export function MapEmbed({ zone, caption }: MapEmbedProps) {
  return (
    <figure style={{ margin: '40px 0' }}>
      <div
        style={{
          background: '#E8E0D0',
          border: '1px solid rgba(30,31,24,0.1)',
          borderRadius: '2px',
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}
        aria-label={`Mapa de ${zone}`}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke={CLAY}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'rgba(30,31,24,0.4)',
          }}
        >
          Mapa — {zone}
        </p>
      </div>
      {caption && (
        <figcaption
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '11px',
            color: 'rgba(30,31,24,0.4)',
            marginTop: '10px',
            fontStyle: 'italic',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
