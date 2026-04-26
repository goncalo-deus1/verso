import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useQuiz } from '../../context/QuizContext'
import { MapaAML } from './MapaAML'
import { trackEvent } from '../../lib/analytics'

const ease = [0.22, 1, 0.36, 1] as const

const TYPEWRITER_TEXT = 'casa certa'
const CHAR_DELAY = 0.06   // seconds between characters
const START_DELAY = 1.1   // seconds after page load before typing starts

function TypewriterText({ reduce }: { reduce: boolean | null }) {
  const [displayed, setDisplayed] = useState(reduce ? TYPEWRITER_TEXT : '')
  const [done, setDone] = useState(!!reduce)

  useEffect(() => {
    if (reduce) return
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(TYPEWRITER_TEXT.slice(0, i))
        if (i >= TYPEWRITER_TEXT.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, CHAR_DELAY * 1000)
      return () => clearInterval(interval)
    }, START_DELAY * 1000)
    return () => clearTimeout(timeout)
  }, [reduce])

  return (
    <>
      {displayed}
      {!done && (
        <motion.span
          aria-hidden
          style={{ display: 'inline-block', width: '0.05em', marginLeft: '0.03em', background: 'currentColor', verticalAlign: 'baseline', height: '0.85em', borderRadius: '1px' }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        />
      )}
    </>
  )
}

export function HeroEnsaio() {
  const reduce = useReducedMotion()
  const { open: openQuiz } = useQuiz()

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: 22 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
  }

  return (
    <section
      data-hide-copilot
      className="relative overflow-hidden"
      style={{
        background: '#F2EDE4',
        backgroundImage:
          'linear-gradient(rgba(30, 31, 24,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 31, 24,0.028) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        minHeight: '100vh',
      }}
    >
      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 pt-8 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center w-full">

          {/* ── COLUNA ESQUERDA — TEXTO ── */}
          <motion.div
            className="order-1 lg:order-1"
            variants={container}
            initial={reduce ? false : 'hidden'}
            animate="show"
          >
            {/* Eyebrow */}
            <motion.div variants={item} className="flex items-center gap-3 mb-8 sm:mb-10">
              <span className="block w-10 h-px bg-verso-clay" aria-hidden />
              <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-verso-midnight-soft">
                Ensaio Cartográfico N.º&nbsp;01 · AML&nbsp;2026
              </p>
            </motion.div>

            {/* Título */}
            <motion.h1
              variants={item}
              className="font-display font-normal leading-[0.96] tracking-[-0.03em] text-verso-midnight mb-9"
              style={{ fontSize: 'clamp(3rem, 6.5vw, 6rem)' }}
            >
              A zona certa <br />
              antes da{' '}
              <em className="italic text-verso-clay font-normal">
                <TypewriterText reduce={reduce} />
              </em>
              <span className="text-verso-clay">.</span>
            </motion.h1>

            {/* Descrição */}
            <motion.p
              variants={item}
              className="text-base sm:text-[17px] text-verso-midnight-soft leading-[1.6] max-w-[440px] mb-10"
            >
              A habitta não vende imóveis. Cruza o teu perfil com o Plano Diretor
              Municipal — zonamento, densidade, transporte, ruído, espaço verde —
              e revela as freguesias e concelhos da AML onde faz sentido viver.
            </motion.p>

            {/* CTA */}
            <motion.div variants={item}>
              <button
                onClick={() => { trackEvent('cta_clicked', { location: 'hero' }); openQuiz('hero') }}
                className="group inline-flex items-center gap-3.5 bg-verso-midnight text-verso-paper px-7 py-[18px] text-[13px] tracking-[0.14em] uppercase font-medium transition-all duration-300 hover:bg-verso-clay hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1E1F18] font-mono"
              >
                Encontrar a zona certa
                <svg
                  width="16" height="12" viewBox="0 0 16 12" fill="none"
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden
                >
                  <path d="M1 6h14m0 0L10 1m5 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* ── COLUNA DIREITA — MAPA ── */}
          <div className="order-2 lg:order-2">
            <MapaAML />
          </div>

        </div>
      </div>
    </section>
  )
}
