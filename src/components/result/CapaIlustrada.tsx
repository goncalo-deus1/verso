import type { ZoneProfile } from '../../data/attributes'

type Props = {
  score: number
  profile: ZoneProfile
  name: string
}

function getMood(profile: ZoneProfile): { bg1: string; bg2: string; accent: string } {
  if (profile.mar > 55)          return { bg1: '#94A383', bg2: '#4A7A8F', accent: '#D9ECF2' }
  if (profile.centralidade > 65) return { bg1: '#C2553A', bg2: '#7A3A28', accent: '#F5DCCC' }
  if (profile.tranquilidade > 65 && profile.familiar > 55)
                                  return { bg1: '#6B7A5A', bg2: '#253830', accent: '#C8DAC0' }
  return { bg1: '#3A3B2E', bg2: '#3E3E3C', accent: '#E8E0D0' }
}

const ATTRS: (keyof ZoneProfile)[] = [
  'centralidade', 'acessibilidade', 'tranquilidade',
  'familiar', 'valorizacao', 'maturidade', 'urbanidade', 'espaco',
]

export function CapaIlustrada({ score, profile, name }: Props) {
  const { bg1, bg2, accent } = getMood(profile)

  const W = 480
  const H = 380
  const barW = 28
  const gap = 14
  const maxBarH = 120
  const baseY = 280
  const totalW = ATTRS.length * barW + (ATTRS.length - 1) * gap
  const startX = (W - totalW) / 2

  return (
    <div className="relative w-full select-none" style={{ aspectRatio: '480/380' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        aria-hidden
        role="presentation"
      >
        <defs>
          {/* Grain filter */}
          <filter id={`grain-${score}`} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grey" />
            <feBlend in="SourceGraphic" in2="grey" mode="multiply" result="blend" />
            <feComponentTransfer in="blend">
              <feFuncA type="linear" slope="0.08" />
            </feComponentTransfer>
          </filter>
          {/* Background gradient */}
          <linearGradient id={`bgGrad-${score}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={bg1} stopOpacity="0.18" />
            <stop offset="100%" stopColor={bg2} stopOpacity="0.08" />
          </linearGradient>
          {/* Accent gradient for bars */}
          <linearGradient id={`barGrad-${score}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bg1} stopOpacity="0.9" />
            <stop offset="100%" stopColor={bg2} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width={W} height={H} fill="#F2EDE4" />
        <rect width={W} height={H} fill={`url(#bgGrad-${score})`} />

        {/* Subtle grid */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`hg-${i}`}
            x1={0} y1={(H / 6) * i} x2={W} y2={(H / 6) * i}
            stroke="#1E1F18" strokeWidth="0.4" opacity="0.05"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`vg-${i}`}
            x1={(W / 6) * i} y1={0} x2={(W / 6) * i} y2={H}
            stroke="#1E1F18" strokeWidth="0.4" opacity="0.05"
          />
        ))}

        {/* Wave accent */}
        <path
          d={`M 0 ${H * 0.65} Q ${W * 0.25} ${H * 0.58} ${W * 0.5} ${H * 0.62} Q ${W * 0.75} ${H * 0.66} ${W} ${H * 0.60} L ${W} ${H} L 0 ${H} Z`}
          fill={accent} opacity="0.22"
        />

        {/* Attribute bars */}
        {ATTRS.map((attr, i) => {
          const val = profile[attr] ?? 50
          const barH = Math.max(4, (val / 100) * maxBarH)
          const x = startX + i * (barW + gap)
          const y = baseY - barH
          return (
            <rect
              key={attr}
              x={x} y={y} width={barW} height={barH}
              fill={`url(#barGrad-${score})`}
              opacity="0.55"
            />
          )
        })}

        {/* Horizontal baseline for bars */}
        <line
          x1={startX - 4} y1={baseY} x2={startX + totalW + 4} y2={baseY}
          stroke="#1E1F18" strokeWidth="0.8" opacity="0.15"
        />

        {/* Giant score */}
        <text
          x={W / 2} y={H / 2 + 30}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: '140px',
            fontWeight: 400,
            fill: bg1,
            opacity: 0.12,
            letterSpacing: '-4px',
          }}
        >
          {score}
        </text>

        {/* Score label */}
        <text
          x={W / 2} y={H / 2 + 72}
          textAnchor="middle"
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
            letterSpacing: '0.22em',
            fill: bg1,
            opacity: 0.55,
            textTransform: 'uppercase',
          }}
        >
          {score} / 100
        </text>

        {/* Zone name label at bottom */}
        <text
          x={W / 2} y={H - 18}
          textAnchor="middle"
          style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '8px',
            letterSpacing: '0.28em',
            fill: '#1E1F18',
            opacity: 0.35,
            textTransform: 'uppercase',
          }}
        >
          {name.toUpperCase()}
        </text>

        {/* Corner marks */}
        {[
          [8, 8, 18, 8, 8, 18],
          [W - 8, 8, W - 18, 8, W - 8, 18],
          [8, H - 8, 18, H - 8, 8, H - 18],
          [W - 8, H - 8, W - 18, H - 8, W - 8, H - 18],
        ].map(([x1, y1, x2, y2, x3, y3], i) => (
          <polyline
            key={i}
            points={`${x1},${y1} ${x2},${y2} ${x1},${y1} ${x3},${y3}`}
            fill="none" stroke="#1E1F18" strokeWidth="1" opacity="0.25"
          />
        ))}

        {/* Grain overlay */}
        <rect width={W} height={H} filter={`url(#grain-${score})`} opacity="0.4" />
      </svg>
    </div>
  )
}
