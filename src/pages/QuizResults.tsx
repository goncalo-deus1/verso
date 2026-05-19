/**
 * QuizResults.tsx — Ecrã de resultados do quiz Habitta
 *
 * Estrutura editorial:
 *  1. Intro — contexto editorial e estatísticas da análise
 *  2. Resultado principal — zona com maior score (descrição + razões + trade-off + breakdown)
 *  3. Alternativas — 2ª e 3ª zonas em formato compacto
 *  4. Nota editorial + CTAs
 *
 * Route: /quiz/resultados
 * State: { answers: QuizAnswers } — redireciona para /quiz se ausente ou incompleto
 *
 * Loading: gerido pelo QuizContainer (800ms "A calcular…" antes de navegar).
 * O engine (runQuiz) é síncrono — rápido o suficiente para não precisar de estado de loading próprio.
 */

import { useMemo } from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'
import { ArrowRight, RotateCcw, Lock } from 'lucide-react'
import { runQuiz } from '../quiz/engine'
import type { QuizAnswers, ScoredZone, ZoneScoreBreakdown } from '../quiz/types'
import { useQuiz } from '../context/QuizContext'
import { useAuth } from '../context/AuthContext'
import { useLangSafe } from '../context/LanguageContext'
import { useT, type TKey } from '../i18n/translations'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 75) return '#6B7A5A'  // MOSS — excelente correspondência
  if (score >= 55) return '#C2553A'  // CLAY — boa correspondência
  return '#3A3B2E'                   // STONE — correspondência moderada
}

function formatPreco(precoMin: number): string {
  return `${(precoMin / 1000).toFixed(0)}k€`
}

// ─── Score Breakdown Grid ────────────────────────────────────────────────────

type BreakdownDim = { key: keyof Omit<ZoneScoreBreakdown, 'total'>; labelKey: TKey; max: number }

const BREAKDOWN_DIMS: BreakdownDim[] = [
  { key: 'geografia',       labelKey: 'pages.quizresults.dim.geografia', max: 30 },
  { key: 'orcamento',       labelKey: 'pages.quizresults.dim.orcamento', max: 20 },
  { key: 'lifestyle',       labelKey: 'pages.quizresults.dim.lifestyle', max: 20 },
  { key: 'preferenciaCasa', labelKey: 'pages.quizresults.dim.casa',      max: 10 },
  { key: 'objetivo',        labelKey: 'pages.quizresults.dim.objetivo',  max: 10 },
  { key: 'familia',         labelKey: 'pages.quizresults.dim.familia',   max: 10 },
]

function ScoreBreakdown({ breakdown }: { breakdown: ZoneScoreBreakdown }) {
  const { lang } = useLangSafe()
  const tr = useT(lang)
  return (
    <div>
      <p className="text-xs font-medium uppercase mb-3"
        style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '1px', fontSize: '10px' }}>
        {tr('pages.quizresults.breakdown.title')}
      </p>
      <div className="grid grid-cols-3 gap-x-5 gap-y-3.5">
        {BREAKDOWN_DIMS.map(({ key, labelKey, max }) => {
          const v = breakdown[key]
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
                  {tr(labelKey)}
                </span>
                <span className="text-xs" style={{ color: '#1E1F18', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
                  {v}/{max}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(30, 31, 24, 0.125)' }}>
                <div className="h-full" style={{ width: `${(v / max) * 100}%`, background: '#C2553A' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Gate de login ────────────────────────────────────────────────────────────

function LoginGate() {
  const { lang } = useLangSafe()
  const tr = useT(lang)
  return (
    <div className="flex flex-col items-center gap-4 py-6 px-4 text-center"
      style={{ background: '#F2EDE4', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
      <div className="w-9 h-9 flex items-center justify-center"
        style={{ background: '#1E1F18', borderRadius: '2px' }}>
        <Lock size={16} color="#F2EDE4" />
      </div>
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: '#1E1F18' }}>
          {tr('pages.quizresults.loginGate.title')}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: '#3A3B2E', maxWidth: '32ch', margin: '0 auto' }}>
          {tr('pages.quizresults.loginGate.body')}
        </p>
      </div>
      <div className="flex gap-2">
        <Link to="/entrar?mode=register"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold"
          style={{ background: '#1E1F18', color: '#F2EDE4', borderRadius: '2px', textDecoration: 'none' }}>
          {tr('auth.createTitle')}
        </Link>
        <Link to="/entrar"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium"
          style={{ border: '1px solid rgba(30, 31, 24, 0.125)', color: '#3A3B2E', borderRadius: '2px', textDecoration: 'none' }}>
          {tr('header.signIn')}
        </Link>
      </div>
    </div>
  )
}

// ─── Resultado Principal ──────────────────────────────────────────────────────

function PrimaryResult({ result, isLoggedIn }: { result: ScoredZone; isLoggedIn: boolean }) {
  const { zone, score, reasons, tradeOff, breakdown } = result
  const color = scoreColor(score)
  const { lang } = useLangSafe()
  const tr = useT(lang)

  return (
    <article style={{ background: '#ffffff', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>

      {/* Header */}
      <div className="p-8 lg:p-10 pb-0">

        {/* Tag editorial */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#C2553A' }} />
          <span className="text-xs font-semibold uppercase"
            style={{ color: '#C2553A', fontFamily: 'IBM Plex Mono', fontSize: '10px', letterSpacing: '2px' }}>
            {tr('pages.quizresults.tag.bestFit')}
          </span>
        </div>

        {/* Nome + Score */}
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="min-w-0">
            <p className="text-xs uppercase mb-1.5"
              style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>
              {zone.regiao}
            </p>
            {isLoggedIn ? (
              <h2 className="font-display text-4xl lg:text-5xl"
                style={{ color: '#1E1F18', letterSpacing: '-1.5px', lineHeight: '1.05' }}>
                {zone.nome}
              </h2>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="font-display text-4xl lg:text-5xl select-none"
                  style={{ color: '#1E1F18', letterSpacing: '-1.5px', lineHeight: '1.05', filter: 'blur(10px)', userSelect: 'none' }}>
                  {zone.nome}
                </h2>
                <Lock size={18} style={{ color: '#3A3B2E', flexShrink: 0 }} />
              </div>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-display text-5xl font-medium leading-none" style={{ color, letterSpacing: '-2px' }}>
              {score}
            </div>
            <div className="text-xs mt-1" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>/100</div>
          </div>
        </div>

        {/* Descrição editorial ou gate */}
        {isLoggedIn ? (
          <p className="text-sm leading-relaxed" style={{ color: '#3A3B2E' }}>
            {zone.pequenaDescricao}
          </p>
        ) : (
          <LoginGate />
        )}
      </div>

      {/* Divider */}
      <div className="mx-8 lg:mx-10 my-6" style={{ borderTop: '1px solid rgba(30, 31, 24, 0.125)' }} />

      {/* Secção: Porque esta zona faz sentido */}
      <div className="px-8 lg:px-10 pb-6">
        <p className="text-xs font-semibold uppercase mb-4"
          style={{ color: '#1E1F18', fontFamily: 'IBM Plex Mono', letterSpacing: '1px', fontSize: '10px' }}>
          {tr('pages.quizresults.why')}
        </p>
        <ul className="space-y-3">
          {reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#6B7A5A' }} />
              <span className="text-sm leading-relaxed" style={{ color: '#1E1F18' }}>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Secção: O principal trade-off */}
      <div className="px-8 lg:px-10 pb-8">
        <div className="p-4" style={{ background: '#F2EDE4', borderRadius: '2px', border: '1px solid rgba(30, 31, 24, 0.125)' }}>
          <p className="text-xs font-semibold uppercase mb-2"
            style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '1px', fontSize: '10px' }}>
            {tr('pages.quizresults.tradeOff')}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#3A3B2E' }}>{tradeOff}</p>
        </div>
      </div>

      {/* Divider + Score breakdown + Preço */}
      <div className="px-8 lg:px-10 pb-8" style={{ borderTop: '1px solid rgba(30, 31, 24, 0.125)', paddingTop: '24px' }}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <ScoreBreakdown breakdown={breakdown} />
          </div>
          <div className="flex-shrink-0 lg:text-right">
            <p className="text-xs mb-1" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
              {tr('pages.quizresults.priceMinT2')}
            </p>
            <p className="font-display text-2xl" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>
              {formatPreco(zone.precoMin)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Alternativa (2ª e 3ª zonas) ─────────────────────────────────────────────

function AlternativeCard({ result, isLoggedIn }: { result: ScoredZone; isLoggedIn: boolean }) {
  const { zone, score, reasons, tradeOff } = result
  const color = scoreColor(score)
  const { lang } = useLangSafe()
  const tr = useT(lang)

  return (
    <article className="p-6" style={{ background: '#ffffff', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-xs mb-1 uppercase"
            style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>
            {zone.regiao}
          </p>
          {isLoggedIn ? (
            <h3 className="font-display text-2xl" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>
              {zone.nome}
            </h3>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="font-display text-2xl select-none"
                style={{ color: '#1E1F18', letterSpacing: '-0.5px', filter: 'blur(8px)', userSelect: 'none' }}>
                {zone.nome}
              </h3>
              <Lock size={14} style={{ color: '#3A3B2E', flexShrink: 0 }} />
            </div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display text-2xl font-medium" style={{ color, letterSpacing: '-1px' }}>{score}</div>
          <div className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>/100</div>
        </div>
      </div>

      {/* Melhor razão */}
      {reasons[0] && (
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#6B7A5A' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#1E1F18' }}>{reasons[0]}</p>
        </div>
      )}

      {/* Trade-off */}
      <div className="flex items-start gap-2.5 mb-5">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(30, 31, 24, 0.125)' }} />
        <p className="text-sm leading-relaxed" style={{ color: '#3A3B2E' }}>{tradeOff}</p>
      </div>

      {/* Preço */}
      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(30, 31, 24, 0.125)' }}>
        <p className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
          {tr('pages.quizresults.priceMinT2')}
        </p>
        <p className="font-display font-medium" style={{ color: '#1E1F18' }}>
          {formatPreco(zone.precoMin)}
        </p>
      </div>
    </article>
  )
}

// ─── Fallback: sem resultados ─────────────────────────────────────────────────

function NoResultsFallback() {
  const { open: openQuiz } = useQuiz()
  const { lang } = useLangSafe()
  const tr = useT(lang)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: '#F2EDE4' }}>
      <div className="max-w-sm text-center">
        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-6"
          style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
          <span className="font-display text-lg" style={{ color: '#3A3B2E' }}>—</span>
        </div>
        <h1 className="font-display text-2xl mb-3" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>
          {tr('pages.quizresults.noMatches.title')}
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: '#3A3B2E', maxWidth: '36ch', margin: '0 auto 2rem' }}>
          {tr('pages.quizresults.noMatches.body')}
        </p>
        <button
          onClick={() => openQuiz()}
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold"
          style={{ background: '#1E1F18', color: '#F2EDE4', borderRadius: '2px', border: 'none', cursor: 'pointer' }}>
          <RotateCcw size={14} /> {tr('zd.redoQuiz')}
        </button>
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function QuizResults() {
  const location = useLocation()
  const { open: openQuiz } = useQuiz()
  const { user } = useAuth()
  const { lang } = useLangSafe()
  const tr = useT(lang)
  const isLoggedIn = user !== null
  const rawAnswers = location.state?.answers as QuizAnswers | undefined

  // useMemo sempre no topo — nunca condicional (regra dos hooks)
  const result = useMemo(
    () => (rawAnswers ? runQuiz(rawAnswers) : null),
    [rawAnswers]
  )

  // Redireciona se chegou sem respostas (acesso directo à URL)
  if (!rawAnswers || !result) {
    return <Navigate to="/" replace />
  }

  if (result.top.length === 0) {
    return <NoResultsFallback />
  }

  const [primary, ...alternatives] = result.top
  const totalAnalysed = result.all.length + result.filteredCount

  return (
    <div className="min-h-screen" style={{ background: '#F2EDE4' }}>

      <div className="max-w-2xl mx-auto px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-20">

        {/* Intro editorial */}
        <header className="mb-10">
          <p className="text-xs uppercase mb-3"
            style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '2px', fontSize: '10px' }}>
            {tr('pages.quizresults.headerEyebrow')}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl mb-4"
            style={{ color: '#1E1F18', letterSpacing: '-1.5px', lineHeight: '1.08' }}>
            {tr('pages.quizresults.headerTitle')}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#3A3B2E' }}>
            {(totalAnalysed === 1
              ? tr('pages.quizresults.intro.analysed.one')
              : tr('pages.quizresults.intro.analysed.many')
            ).replace('{n}', String(totalAnalysed))}
            {result.filteredCount > 0 && (
              (result.filteredCount === 1
                ? tr('pages.quizresults.intro.filtered.one')
                : tr('pages.quizresults.intro.filtered.many')
              ).replace('{n}', String(result.filteredCount))
            )}
            {tr('pages.quizresults.intro.bestMatch')}
          </p>
        </header>

        {/* Resultado principal */}
        <PrimaryResult result={primary} isLoggedIn={isLoggedIn} />

        {/* Alternativas */}
        {alternatives.length > 0 && (
          <section className="mt-8">
            <p className="text-xs font-semibold uppercase mb-4"
              style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>
              {tr('pages.quizresults.otherAreas')}
            </p>
            <div className="space-y-3">
              {alternatives.map(alt => (
                <AlternativeCard key={alt.zone.id} result={alt} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </section>
        )}

        {/* Nota editorial */}
        <div className="mt-8 p-5" style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#3A3B2E' }}>
            <span className="font-semibold" style={{ color: '#1E1F18' }}>{tr('pages.quizresults.note.label')}</span>{' '}
            {tr('pages.quizresults.note.body')}
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to="/areas"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold"
            style={{ background: '#1E1F18', color: '#F2EDE4', borderRadius: '2px' }}>
            {tr('pages.quizresults.cta.exploreAll')}
            <ArrowRight size={15} />
          </Link>
          <button
            onClick={() => openQuiz()}
            className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium"
            style={{ border: '1px solid rgba(30, 31, 24, 0.125)', color: '#3A3B2E', borderRadius: '2px', background: 'none', cursor: 'pointer' }}>
            <RotateCcw size={14} /> {tr('zd.redoQuiz')}
          </button>
        </div>

      </div>
    </div>
  )
}
