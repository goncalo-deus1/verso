/**
 * ZonaHero.tsx — § 00  A resposta, above the fold
 *
 * Layout 60/40: coluna de texto (esq.) + mini-mapa AML (dir.).
 * Em mobile: mapa em cima, texto em baixo.
 * Crossfade via AnimatePresence quando nome ou score muda (sliders alteram top).
 *
 * Hero hierarchy (v2 — trust layer):
 *  1. Concelho name (large serif)
 *  2. Summary sentence — promoted, large italic serif
 *  3. Compact score line  (AFINIDADE · X / 100)
 *  4. Winner trade-off callout (surfaced from § 01)
 *  5. Buttons
 */

import { AnimatePresence, motion } from 'framer-motion'
import SaveZoneButton from '../SaveZoneButton'
import { MapaAML } from '../hero/MapaAML'

type Props = {
  nome: string
  score: number
  leituraCurta: string
  tradeoff?: string
  costVerified?: boolean
  slug: string
  concelhoSlug: string
  zoneKind: 'freguesia' | 'concelho'
}

/** Prepend "contigo" if the string starts with "Alinha em ". */
function withContigo(s: string): string {
  if (s.startsWith('Alinha em ')) return s.replace('Alinha em ', 'Alinha contigo em ')
  return s
}

function ZonaNome({ nome }: { nome: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.h1
        key={nome}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="font-display font-normal leading-[0.92] tracking-[-0.025em] text-verso-midnight text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.5rem]"
      >
        {nome}
      </motion.h1>
    </AnimatePresence>
  )
}

export function ZonaHero({ nome, score, leituraCurta, tradeoff, costVerified, slug, concelhoSlug, zoneKind }: Props) {
  return (
    <section className="relative min-h-[92vh] bg-verso-paper border-b border-verso-rule-soft overflow-hidden">
      <div className="grid lg:grid-cols-[1.2fr_1fr] min-h-[92vh]">

        {/* Coluna esquerda — texto */}
        <div className="relative flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-16 md:py-20 lg:py-24 pt-28 md:pt-32 lg:pt-32 order-2 lg:order-1">

          {/* Eyebrow */}
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-verso-clay mb-8 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-verso-clay" aria-hidden />
            A tua zona
          </p>

          {/* 1 — Nome animado */}
          <ZonaNome nome={nome} />

          {/* 2 — Summary promoted */}
          <AnimatePresence mode="wait">
            <motion.p
              key={leituraCurta}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(24px, 2.8vw, 32px)',
                lineHeight: 1.25,
                color: 'var(--azeitona-medio)',
                maxWidth: '620px',
                marginTop: '20px',
                fontVariationSettings: '"SOFT" 60, "WONK" 1',
              }}
            >
              {withContigo(leituraCurta)}
            </motion.p>
          </AnimatePresence>

          {/* 3 — Compact score line */}
          <AnimatePresence mode="wait">
            <motion.p
              key={score}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: '24px',
              }}
            >
              <span style={{ color: 'var(--telha-forte)' }}>Afinidade</span>
              {' '}
              <span style={{ color: 'var(--azeitona)' }}>· {score} / 100</span>
            </motion.p>
          </AnimatePresence>

          {/* 4 — Winner trade-off surfaced from § 01 — suppressed until costVerified */}
          {tradeoff && costVerified && (
            <AnimatePresence mode="wait">
              <motion.div
                key={tradeoff}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                style={{
                  borderLeft: '2px solid var(--telha-forte)',
                  paddingLeft: '16px',
                  marginTop: '32px',
                  maxWidth: '520px',
                }}
              >
                <p style={{
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--telha-forte)',
                  marginBottom: '8px',
                }}>
                  Custo desta escolha
                </p>
                <p style={{
                  fontFamily: 'var(--serif)',
                  fontStyle: 'italic',
                  fontSize: '16px',
                  fontVariationSettings: '"SOFT" 50, "WONK" 1',
                  color: 'var(--azeitona-medio)',
                  lineHeight: 1.5,
                }}>
                  {tradeoff}
                </p>
              </motion.div>
            </AnimatePresence>
          )}

          {/* 5 — CTAs */}
          <div className="flex flex-wrap items-center gap-3 mt-10 md:mt-12">
            {/* Primary — scroll to § 01 */}
            <a
              href="#porque-esta-zona"
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '9px 22px', fontSize: '13px', fontWeight: 500,
                background: '#B24A30', color: '#F2EDE4',
                border: '1px solid #B24A30', borderRadius: '50px',
                textDecoration: 'none', transition: 'all 150ms',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#9A3D27'; el.style.borderColor = '#9A3D27' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#B24A30'; el.style.borderColor = '#B24A30' }}
            >
              Continuar ↓
            </a>
            {/* Secondary — save zone */}
            <SaveZoneButton
              zoneSlug={slug}
              zoneKind={zoneKind}
              zoneName={nome}
              label="Guardar esta análise"
            />
          </div>
        </div>

        {/* Coluna direita — mini-mapa AML */}
        <div className="relative order-1 lg:order-2 bg-verso-paper-deep border-l border-verso-rule-soft flex items-center justify-center p-8 sm:p-12 lg:p-16 min-h-[45vh] lg:min-h-[92vh]">

          {/* Metadados topo */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start" aria-hidden>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-verso-midnight-soft">
              AML · 18 concelhos
            </p>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-verso-clay text-right">
              Posição #1
            </p>
          </div>

          {/* Mini-mapa */}
          <div className="w-full max-w-[560px]">
            <MapaAML highlightedConcelho={concelhoSlug} mode="static" />
          </div>

          {/* Legenda inferior */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end" aria-hidden>
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-verso-midnight-soft mb-1">
                Destacado
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={nome}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-display text-xl text-verso-midnight"
                >
                  {nome}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-verso-midnight-soft/60 text-right leading-tight">
              Fonte<br />
              PDM · CML 2024
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
