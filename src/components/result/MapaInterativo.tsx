/**
 * MapaInterativo.tsx — § 02 A prova
 *
 * Mapa SVG dos concelhos da AML com 6 sliders de preferência.
 * Estado dos sliders controlado externamente (prefs / onPrefsChange).
 * Cores: top3 = clay, 4-8 = ochre, restantes = paper-deep.
 */

import { useState, useCallback, useMemo } from 'react'
import { concelhosAML } from '../../data/concelhosAML'

// ─── Tipos exportados ─────────────────────────────────────────────────────────

export type SliderKey = 'centralidade' | 'tranquilidade' | 'familiar' | 'acessibilidade' | 'espaco' | 'mar'

export type SliderPrefs = Record<SliderKey, number>

// ─── Constantes ───────────────────────────────────────────────────────────────

const SLIDER_KEYS: SliderKey[] = ['centralidade', 'tranquilidade', 'familiar', 'acessibilidade', 'espaco', 'mar']

const SLIDER_LABELS: Record<SliderKey, string> = {
  centralidade:   'Centro',
  tranquilidade:  'Tranquilidade',
  familiar:       'Familiar',
  acessibilidade: 'Transportes',
  espaco:         'Espaço',
  mar:            'Junto ao mar',
}

const SLIDER_POLES: Record<SliderKey, [string, string]> = {
  centralidade:   ['Periferia', 'Centro'],
  tranquilidade:  ['Animado', 'Silencioso'],
  familiar:       ['Jovem', 'Familiar'],
  acessibilidade: ['Carro', 'TP'],
  espaco:         ['Compacto', 'Amplo'],
  mar:            ['Interior', 'Litoral'],
}

// Polygons reusados do MapaAML — coordenadas no mesmo viewBox 400×500
const PATHS: Record<string, { d: string; lx: number; ly: number; name: string }> = {
  mafra:               { d: 'M 20 60 L 95 50 L 110 120 L 50 140 L 15 105 Z',                             lx: 62,  ly: 96,  name: 'MAFRA' },
  sintra:              { d: 'M 15 105 L 50 140 L 80 195 L 35 220 L 10 175 Z',                             lx: 40,  ly: 168, name: 'SINTRA' },
  loures:              { d: 'M 95 50 L 180 45 L 200 110 L 140 140 L 110 120 Z',                           lx: 150, ly: 90,  name: 'LOURES' },
  'vila-franca-de-xira': { d: 'M 180 45 L 270 55 L 285 140 L 200 110 Z',                                 lx: 230, ly: 86,  name: 'VF XIRA' },
  odivelas:            { d: 'M 110 120 L 140 140 L 148 178 L 108 178 Z',                                  lx: 128, ly: 158, name: 'ODIVELAS' },
  amadora:             { d: 'M 80 195 L 108 178 L 148 178 L 138 215 L 95 228 Z',                          lx: 115, ly: 204, name: 'AMADORA' },
  oeiras:              { d: 'M 35 220 L 80 195 L 95 228 L 70 260 L 20 255 Z',                             lx: 58,  ly: 234, name: 'OEIRAS' },
  cascais:             { d: 'M 10 175 L 35 220 L 20 255 L 5 245 Z',                                       lx: 17,  ly: 218, name: 'CASCAIS' },
  lisboa:              { d: 'M 95 228 L 138 215 L 148 178 L 200 175 L 220 225 L 190 275 L 120 278 Z',     lx: 160, ly: 234, name: 'LISBOA' },
  almada:              { d: 'M 90 345 L 170 340 L 175 395 L 105 400 Z',                                   lx: 132, ly: 372, name: 'ALMADA' },
  seixal:              { d: 'M 105 400 L 175 395 L 185 435 L 110 445 Z',                                  lx: 145, ly: 420, name: 'SEIXAL' },
  barreiro:            { d: 'M 175 395 L 230 390 L 235 430 L 185 435 Z',                                  lx: 205, ly: 414, name: 'BARREIRO' },
  moita:               { d: 'M 235 430 L 285 425 L 290 465 L 230 470 Z',                                  lx: 260, ly: 449, name: 'MOITA' },
  montijo:             { d: 'M 230 390 L 310 340 L 345 380 L 285 425 Z',                                  lx: 290, ly: 383, name: 'MONTIJO' },
  alcochete:           { d: 'M 310 340 L 360 340 L 370 375 L 345 380 Z',                                  lx: 342, ly: 360, name: 'ALCOCHETE' },
  sesimbra:            { d: 'M 105 445 L 185 445 L 170 485 L 90 480 Z',                                   lx: 137, ly: 465, name: 'SESIMBRA' },
  palmela:             { d: 'M 230 470 L 290 465 L 275 495 L 230 495 Z',                                  lx: 258, ly: 484, name: 'PALMELA' },
  setubal:             { d: 'M 290 465 L 360 460 L 350 495 L 275 495 Z',                                  lx: 317, ly: 480, name: 'SETÚBAL' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeRanking(prefs: SliderPrefs): { slug: string; name: string; score: number }[] {
  return concelhosAML
    .map(c => {
      const sumSq = SLIDER_KEYS.reduce((acc, k) => {
        const d = prefs[k] - c.profile[k]
        return acc + d * d
      }, 0)
      const rmse = Math.sqrt(sumSq / SLIDER_KEYS.length)
      return { slug: c.slug, name: c.name, score: Math.round(100 * (1 - rmse / 100)) }
    })
    .sort((a, b) => b.score - a.score)
}

function fillColor(rank: number): string {
  if (rank < 3) return '#C2553A'
  if (rank < 8) return '#94A383'
  return '#E8E0D0'
}

// ─── Componente ───────────────────────────────────────────────────────────────

type Props = {
  prefs: SliderPrefs
  onPrefsChange: (key: SliderKey, val: number) => void
  /** Slug do concelho do resultado do quiz — para mostrar score autoritativo */
  quizBestConcelhoSlug: string
  quizBestScore: number
  zonaNome: string
}

export function MapaInterativo({ prefs, onPrefsChange, quizBestConcelhoSlug, quizBestScore, zonaNome }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const ranking = useMemo(() => computeRanking(prefs), [prefs])
  const rankIndex = useMemo(
    () => Object.fromEntries(ranking.map((r, i) => [r.slug, i])),
    [ranking],
  )

  const updatePref = useCallback((key: SliderKey, val: number) => {
    onPrefsChange(key, val)
  }, [onPrefsChange])

  const top = ranking[0]
  const topScore = top?.slug === quizBestConcelhoSlug ? quizBestScore : top?.score

  return (
    <section className="py-20 bg-verso-paper-deep border-b border-verso-rule-soft">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12">

        {/* Section head */}
        <div className="grid md:grid-cols-[180px_1fr] gap-10 mb-14 items-start">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase pt-3 border-t border-verso-rule-soft text-verso-clay">
            § 02 — Onde se posiciona
          </div>
          <div>
            <h2 className="font-display font-normal text-4xl sm:text-5xl leading-[1.02] tracking-[-0.025em] text-verso-midnight">
              {zonaNome} face aos outros{' '}
              <em className="italic text-verso-clay">{concelhosAML.length - 1}</em> concelhos.
            </h2>
            <p className="mt-5 text-[15px] text-verso-midnight-soft leading-[1.6] max-w-[520px]">
              Mexe nos pesos abaixo. Se mudares o que mais valorizas, a zona no topo actualiza.
              Isto não é mágica — é a forma honesta de mostrares como o algoritmo funciona.
            </p>
          </div>
        </div>

        {/* Layout: mapa + sliders */}
        <div className="grid md:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">

          {/* Mapa SVG */}
          <div>
            <div className="relative aspect-[4/5] w-full max-w-[600px]">

              {/* Cantos */}
              {(['tl', 'tr', 'bl', 'br'] as const).map(pos => {
                const cls = {
                  tl: 'top-0 left-0 border-t border-l',
                  tr: 'top-0 right-0 border-t border-r',
                  bl: 'bottom-0 left-0 border-b border-l',
                  br: 'bottom-0 right-0 border-b border-r',
                }[pos]
                return <span key={pos} aria-hidden className={`absolute w-5 h-5 border-[#1E1F18]/25 ${cls}`} />
              })}

              <svg
                viewBox="0 0 400 500"
                className="w-full h-full"
                role="img"
                aria-label="Mapa de afinidade dos concelhos da AML"
              >
                {Object.entries(PATHS).map(([slug, { d, lx, ly, name }]) => {
                  const rank  = rankIndex[slug] ?? 17
                  const fill  = fillColor(rank)
                  const isTop = rank < 3
                  const isLis = slug === 'lisboa'
                  return (
                    <g
                      key={slug}
                      onMouseEnter={() => setHovered(slug)}
                      onMouseLeave={() => setHovered(null)}
                      className="cursor-default"
                    >
                      <path
                        d={d}
                        fill={hovered === slug ? '#A0503B' : fill}
                        stroke="#1E1F18"
                        strokeWidth={isLis ? '1.2' : '0.7'}
                        style={{ transition: 'fill 350ms ease' }}
                      />
                      {isTop && (
                        <path d={d} fill="none" stroke="#C2553A" strokeWidth="1.8" opacity="0.35"
                          style={{ pointerEvents: 'none' }} />
                      )}
                      <text
                        x={lx} y={ly}
                        textAnchor="middle"
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: isLis ? '7.5px' : '6px',
                          letterSpacing: '0.08em',
                          fill: isTop ? '#F2EDE4' : '#1E1F18',
                          pointerEvents: 'none',
                          userSelect: 'none',
                          transition: 'fill 350ms ease',
                        }}
                      >
                        {name}
                      </text>
                      {isTop && (
                        <text
                          x={lx} y={ly + 9}
                          textAnchor="middle"
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '5px',
                            fill: '#F2EDE4',
                            opacity: 0.65,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          }}
                        >
                          #{rank + 1}
                        </text>
                      )}
                    </g>
                  )
                })}

                {/* Tejo */}
                <path
                  d="M 0 285 Q 80 296 160 292 Q 240 288 320 298 L 400 300 L 400 322 Q 320 310 240 314 Q 160 318 80 312 Q 40 309 0 315 Z"
                  fill="#1E1F18" opacity="0.78" style={{ pointerEvents: 'none' }}
                />

                {/* Shimmer */}
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

                {/* Flowing edge */}
                <path
                  d="M 0 285 Q 80 296 160 292 Q 240 288 320 298 L 400 300"
                  fill="none" stroke="#C2553A" strokeWidth="0.8" opacity="0.4"
                  strokeDasharray="6 5" style={{ pointerEvents: 'none' }}
                >
                  <animate attributeName="stroke-dashoffset"
                    from="0" to="-11" dur="1.6s" repeatCount="indefinite" />
                </path>

                <text x="200" y="311" textAnchor="middle" style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: '7px',
                  letterSpacing: '0.3em', fill: '#F2EDE4', opacity: 0.4,
                  pointerEvents: 'none',
                }}>TEJO</text>
              </svg>

              {/* Legenda */}
              <div className="mt-4 flex flex-wrap gap-5 font-mono text-[9px] tracking-[0.1em] uppercase text-verso-midnight-soft">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 inline-block" style={{ background: '#C2553A' }} /> Top 3
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 inline-block" style={{ background: '#94A383' }} /> Perfil semelhante (4–8)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 inline-block border border-[#1E1F18]/20" style={{ background: '#E8E0D0' }} /> Restantes
                </span>
              </div>
            </div>
          </div>

          {/* Painel de sliders */}
          <div className="flex flex-col gap-7 pt-1">

            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-verso-clay pb-3 border-b border-verso-rule-soft">
              Ajustar preferências
            </p>

            {SLIDER_KEYS.map(key => (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-verso-midnight">
                    {SLIDER_LABELS[key]}
                  </span>
                  <span className="font-mono text-[10px] text-verso-clay tabular-nums">
                    {Math.round(prefs[key])}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] text-verso-midnight-soft opacity-50 w-11 text-right shrink-0">
                    {SLIDER_POLES[key][0]}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={prefs[key]}
                    onChange={e => updatePref(key, Number(e.target.value))}
                    className="flex-1 cursor-pointer"
                    style={{
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      height: '2px',
                      background: `linear-gradient(to right, #C2553A ${prefs[key]}%, rgba(30, 31, 24,0.18) ${prefs[key]}%)`,
                      outline: 'none',
                      accentColor: '#C2553A',
                    }}
                  />
                  <span className="font-mono text-[8px] text-verso-midnight-soft opacity-50 w-11 shrink-0">
                    {SLIDER_POLES[key][1]}
                  </span>
                </div>
              </div>
            ))}

            {/* Callout — melhor match actual */}
            <div className="mt-3 p-5 border border-verso-rule-soft bg-verso-paper relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-verso-clay" />
              <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-verso-clay mb-2">
                Melhor match actual
              </p>
              <p className="font-display text-2xl tracking-[-0.02em] text-verso-midnight leading-none">
                {top.name}
              </p>
              <p className="font-mono text-[10px] text-verso-midnight-soft mt-1.5">
                Afinidade · {topScore} / 100
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
