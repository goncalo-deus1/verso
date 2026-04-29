import { useUrbanData } from '../../hooks/useUrbanData'

type Props = {
  concelhoSlug: string
}

export function PdmSection({ concelhoSlug }: Props) {
  const { pdm, loading } = useUrbanData(concelhoSlug)

  if (loading || !pdm) return null

  return (
    <div
      style={{
        background: 'var(--papel)',
        border: '1px solid var(--traco)',
        borderRadius: '2px',
        padding: '32px',
      }}
    >
      <p
        style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: 'var(--telha)',
          margin: 0,
        }}
      >
        Plano Diretor Municipal
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
        <h3
          className="font-display"
          style={{ fontSize: '22px', color: 'var(--azeitona)', fontWeight: 400, margin: 0 }}
        >
          PDM {pdm.pdm_year}
        </h3>
        {pdm.in_revision && (
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              background: 'rgba(194, 85, 58, 0.12)',
              color: 'var(--telha)',
              padding: '4px 10px',
              borderRadius: '50px',
            }}
          >
            Em revisão
          </span>
        )}
      </div>

      {pdm.highlights && (
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            color: 'var(--azeitona-medio)',
            lineHeight: 1.7,
            marginTop: '12px',
            marginBottom: 0,
            maxWidth: '640px',
          }}
        >
          {pdm.highlights}
        </p>
      )}

      <a
        href={pdm.source_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Consultar PDM oficial de ${concelhoSlug} (abre em nova janela)`}
        style={{
          display: 'inline-block',
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '13px',
          color: 'var(--telha)',
          marginTop: '16px',
          textDecoration: 'none',
        }}
      >
        Consultar PDM oficial ↗
      </a>
    </div>
  )
}
