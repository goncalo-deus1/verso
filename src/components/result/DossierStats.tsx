import type { ZoneProfile, Attribute } from '../../data/attributes'

type StatDef = {
  attr: Attribute
  label: string
  lowLabel: string
  highLabel: string
}

const STATS: StatDef[] = [
  { attr: 'centralidade',   label: 'Centralidade',     lowLabel: 'periférico', highLabel: 'central'    },
  { attr: 'acessibilidade', label: 'Transportes',      lowLabel: 'carro',      highLabel: 'sem carro'  },
  { attr: 'tranquilidade',  label: 'Tranquilidade',    lowLabel: 'animado',    highLabel: 'silencioso' },
  { attr: 'familiar',       label: 'Ambiente familiar', lowLabel: 'jovem',     highLabel: 'familiar'   },
  { attr: 'maturidade',     label: 'Consolidação',     lowLabel: 'em evolução', highLabel: 'maduro'    },
  { attr: 'valorizacao',    label: 'Valorização',      lowLabel: 'estável',    highLabel: 'em subida'  },
]

const INK      = '#1E1F18'
const CLAY     = '#C2553A'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'
const STONE    = '#3A3B2E'

type Props = { profile: ZoneProfile }

export function DossierStats({ profile }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px 24px',
        padding: '20px',
        background: '#F2EDE4',
        border: `1px solid ${HAIRLINE}`,
      }}
    >
      <p style={{
        gridColumn: '1 / -1',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '9px',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: STONE,
        margin: 0,
      }}>
        Perfil da zona
      </p>

      {STATS.map(({ attr, label, lowLabel, highLabel }) => {
        const val = profile[attr] ?? 50
        const pct = `${val}%`
        return (
          <div key={attr}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '9px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: STONE,
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '9px',
                color: val >= 70 ? CLAY : STONE,
                letterSpacing: '0.08em',
              }}>
                {val >= 70 ? highLabel : val <= 30 ? lowLabel : '—'}
              </span>
            </div>
            {/* Bar track */}
            <div style={{ height: '3px', background: HAIRLINE, borderRadius: '1px' }}>
              <div style={{
                height: '100%',
                width: pct,
                background: val >= 70 ? CLAY : val >= 50 ? INK : STONE,
                borderRadius: '1px',
                opacity: val >= 50 ? 1 : 0.45,
                transition: 'width 600ms ease',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
