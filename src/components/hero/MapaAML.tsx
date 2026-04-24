import { useState } from 'react'

// ─── tipos ────────────────────────────────────────────────────────────────────

type Mode = 'hero' | 'static'

type ConcelhoPathProps = {
  id: string
  name: string
  d: string
  labelX: number
  labelY: number
  highlighted: string
  mode: Mode
  onHover?: (id: string) => void
}

// ─── Polígono de concelho ─────────────────────────────────────────────────────

function ConcelhoPath({ id, name, d, labelX, labelY, highlighted, mode, onHover }: ConcelhoPathProps) {
  const active = highlighted === id
  const isLisboa = id === 'lisboa'
  const isStatic = mode === 'static'

  const handlers = isStatic
    ? {}
    : {
        onMouseEnter: () => onHover?.(id),
        onTouchStart: () => onHover?.(id),
        onFocus:      () => onHover?.(id),
      }

  return (
    <g
      {...handlers}
      tabIndex={isStatic ? -1 : 0}
      role="img"
      aria-label={name}
      className={isStatic ? 'cursor-default' : 'cursor-default focus:outline-none'}
    >
      <path
        d={d}
        fill={active ? '#C2553A' : isLisboa ? '#E8E0D0' : '#F2EDE4'}
        fillOpacity={active ? 0.9 : isStatic && !active ? 0.7 : 1}
        stroke="#1E1F18"
        strokeWidth={isLisboa ? '1.2' : '0.7'}
        strokeOpacity={isStatic && !active ? 0.35 : 1}
        style={isStatic ? undefined : { transition: 'fill 280ms ease, fill-opacity 280ms ease' }}
      />
      {active && (
        <path d={d} fill="url(#hatch)" className="pointer-events-none" />
      )}
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        style={{
          fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
          fontSize: isLisboa ? '6px' : '5px',
          letterSpacing: '0.04em',
          fill: active ? '#F2EDE4' : '#1E1F18',
          fontWeight: isLisboa ? 500 : 400,
          opacity: isStatic && !active ? 0.45 : 1,
          transition: isStatic ? undefined : 'fill 280ms ease',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {name}
      </text>
    </g>
  )
}

// ─── Cantos decorativos ───────────────────────────────────────────────────────

function CornerMark({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 'w-5 h-5 border-[#1E1F18]/25'
  const map = {
    tl: `absolute top-0 left-0 border-t border-l ${size}`,
    tr: `absolute top-0 right-0 border-t border-r ${size}`,
    bl: `absolute bottom-0 left-0 border-b border-l ${size}`,
    br: `absolute bottom-0 right-0 border-b border-r ${size}`,
  }
  return <span aria-hidden className={map[pos]} />
}

// ─── Componente principal ─────────────────────────────────────────────────────

type MapaAMLProps = {
  /** Concelho destacado (slug). Default: "lisboa" */
  highlightedConcelho?: string
  /** "hero" = interactivo com hover (default). "static" = destaque fixo, sem interactividade */
  mode?: Mode
}

export function MapaAML({ highlightedConcelho = 'lisboa', mode = 'hero' }: MapaAMLProps = {}) {
  const [hoveredConcelho, setHoveredConcelho] = useState('lisboa')

  const highlighted = mode === 'static' ? highlightedConcelho : hoveredConcelho

  const pathProps = (id: string, name: string, d: string, labelX: number, labelY: number) => ({
    id, name, d, labelX, labelY,
    highlighted,
    mode,
    onHover: mode === 'hero' ? setHoveredConcelho : undefined,
  })

  return (
    <div className="relative aspect-[4/5] w-full max-w-[680px] mx-auto select-none">
      {/* Frame corners */}
      <CornerMark pos="tl" />
      <CornerMark pos="tr" />
      <CornerMark pos="bl" />
      <CornerMark pos="br" />

      {/* Bússola */}
      <div className="absolute top-3 right-5 flex flex-col items-center gap-0.5 z-10" aria-hidden>
        <span style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px', letterSpacing: '0.3em',
          color: '#1E1F18', opacity: 0.55,
        }}>N</span>
        <svg width="20" height="28" viewBox="0 0 20 28">
          <circle cx="10" cy="14" r="8" fill="none" stroke="#1E1F18" strokeWidth="0.5" opacity="0.35" />
          <path d="M10 6 L12 14 L10 12 L8 14 Z" fill="#C2553A" />
          <path d="M10 22 L8 14 L10 16 L12 14 Z" fill="#1E1F18" opacity="0.3" />
        </svg>
      </div>

      {/* Escala */}
      <div className="absolute bottom-16 left-3 flex flex-col gap-1 z-10" aria-hidden>
        <div className="flex">
          <span className="w-7 h-[1.5px] bg-[#1E1F18] opacity-35 inline-block" />
          <span className="w-7 h-[1.5px] border-t border-b border-[#1E1F18] bg-[#F2EDE4] opacity-35 inline-block" />
        </div>
        <div className="flex justify-between w-14" style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '7px', color: '#1E1F18', opacity: 0.4, letterSpacing: '0.05em',
        }}>
          <span>0</span><span>10</span><span>20km</span>
        </div>
      </div>

      {/* Legenda inferior */}
      <div className="absolute bottom-2 right-4 text-right z-10" aria-hidden>
        <p style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '7px', letterSpacing: '0.25em',
          color: '#C2553A', textTransform: 'uppercase',
        }}>Área Metropolitana</p>
        <p style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '7px', letterSpacing: '0.15em',
          color: '#1E1F18', opacity: 0.4, marginTop: '2px',
        }}>CAOP · DGT 2024</p>
      </div>

      {/* SVG — fades in via CSS animation; no framer-motion dependency needed here */}
      <svg
        viewBox="0 0 400 500"
        className="w-full h-full"
        role="img"
        aria-label="Mapa esquemático da Área Metropolitana de Lisboa"
        style={{
          animation: mode === 'static'
            ? 'mapa-fade 0.4s ease forwards'
            : 'mapa-fade 1.2s ease 0.4s both',
        }}
      >
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#F2EDE4" strokeWidth="1.2" opacity="0.5" />
          </pattern>
        </defs>

        {/* ── MARGEM NORTE ── */}

        <ConcelhoPath {...pathProps('mafra', 'MAFRA', 'M 20 60 L 95 50 L 110 120 L 50 140 L 15 105 Z', 62, 96)} />
        <ConcelhoPath {...pathProps('sintra', 'SINTRA', 'M 15 105 L 50 140 L 80 195 L 35 220 L 10 175 Z', 40, 168)} />
        <ConcelhoPath {...pathProps('loures', 'LOURES', 'M 95 50 L 180 45 L 200 110 L 140 140 L 110 120 Z', 150, 90)} />
        <ConcelhoPath {...pathProps('vila-franca-de-xira', 'VF XIRA', 'M 180 45 L 270 55 L 285 140 L 200 110 Z', 230, 86)} />
        <ConcelhoPath {...pathProps('odivelas', 'ODIVELAS', 'M 110 120 L 140 140 L 148 178 L 108 178 Z', 128, 158)} />
        <ConcelhoPath {...pathProps('amadora', 'AMADORA', 'M 80 195 L 108 178 L 148 178 L 138 215 L 95 228 Z', 115, 204)} />
        <ConcelhoPath {...pathProps('oeiras', 'OEIRAS', 'M 35 220 L 80 195 L 95 228 L 70 260 L 20 255 Z', 58, 234)} />
        <ConcelhoPath {...pathProps('cascais', 'CASCAIS', 'M 10 175 L 35 220 L 20 255 L 5 245 Z', 17, 218)} />

        {/* Lisboa — destaque central */}
        <ConcelhoPath {...pathProps('lisboa', 'LISBOA', 'M 95 228 L 138 215 L 148 178 L 200 175 L 220 225 L 190 275 L 120 278 Z', 160, 234)} />

        {/* ── TEJO ── */}
        <path
          d="M 0 285 Q 80 296 160 292 Q 240 288 320 298 L 400 300 L 400 322 Q 320 310 240 314 Q 160 318 80 312 Q 40 309 0 315 Z"
          fill="#1E1F18" opacity="0.78"
        />

        {/* Shimmer — slow glint that slides through the river */}
        <path
          d="M 0 292 Q 80 300 160 297 Q 240 294 320 302 L 400 304"
          fill="none" stroke="#F2EDE4" strokeWidth="1.2"
          strokeDasharray="24 600" opacity="0.18" style={{ pointerEvents: 'none' }}
        >
          <animateTransform attributeName="transform" type="translate"
            from="-400 0" to="400 0" dur="5s" repeatCount="indefinite" />
        </path>
        <path
          d="M 0 292 Q 80 300 160 297 Q 240 294 320 302 L 400 304"
          fill="none" stroke="#F2EDE4" strokeWidth="0.8"
          strokeDasharray="14 600" opacity="0.12" style={{ pointerEvents: 'none' }}
        >
          <animateTransform attributeName="transform" type="translate"
            from="-400 0" to="400 0" dur="5s" begin="2.5s" repeatCount="indefinite" />
        </path>

        {/* Flowing edge — terracotta current line */}
        <path
          d="M 0 285 Q 80 296 160 292 Q 240 288 320 298 L 400 300"
          fill="none" stroke="#C2553A" strokeWidth="0.8" opacity="0.5"
          strokeDasharray="6 5"
        >
          <animate attributeName="stroke-dashoffset"
            from="0" to="-11" dur="1.6s" repeatCount="indefinite" />
        </path>

        <text x="200" y="311" textAnchor="middle" style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: '7px',
          letterSpacing: '0.3em', fill: '#F2EDE4', opacity: 0.45,
          textTransform: 'uppercase', pointerEvents: 'none',
        }}>TEJO</text>

        {/* ── MARGEM SUL ── */}

        <ConcelhoPath {...pathProps('almada', 'ALMADA', 'M 90 345 L 170 340 L 175 395 L 105 400 Z', 132, 372)} />
        <ConcelhoPath {...pathProps('seixal', 'SEIXAL', 'M 105 400 L 175 395 L 185 435 L 110 445 Z', 145, 420)} />
        <ConcelhoPath {...pathProps('barreiro', 'BARREIRO', 'M 175 395 L 230 390 L 235 430 L 185 435 Z', 205, 414)} />
        <ConcelhoPath {...pathProps('moita', 'MOITA', 'M 235 430 L 285 425 L 290 465 L 230 470 Z', 260, 449)} />
        <ConcelhoPath {...pathProps('montijo', 'MONTIJO', 'M 230 390 L 310 340 L 345 380 L 285 425 Z', 290, 383)} />
        <ConcelhoPath {...pathProps('alcochete', 'ALCOCHETE', 'M 310 340 L 360 340 L 370 375 L 345 380 Z', 342, 360)} />
        <ConcelhoPath {...pathProps('sesimbra', 'SESIMBRA', 'M 105 445 L 185 445 L 170 485 L 90 480 Z', 137, 465)} />
        <ConcelhoPath {...pathProps('palmela', 'PALMELA', 'M 230 470 L 290 465 L 275 495 L 230 495 Z', 258, 484)} />
        <ConcelhoPath {...pathProps('setubal', 'SETÚBAL', 'M 290 465 L 360 460 L 350 495 L 275 495 Z', 317, 480)} />

        {/* Ponto de Lisboa */}
        <circle cx="160" cy="238" r="2.5" fill="#C2553A" />
        <circle cx="160" cy="238" r="9" fill="none" stroke="#C2553A" strokeWidth="0.7" opacity="0.35" />
      </svg>

      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes mapa-fade {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes mapa-fade {
            from { opacity: 1; }
            to   { opacity: 1; }
          }
        }
      `}</style>

    </div>
  )
}
