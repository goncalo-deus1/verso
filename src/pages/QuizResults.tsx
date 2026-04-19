/**
 * QuizResults.tsx — Ecrã de resultados do quiz VERSO
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
import { ArrowRight, RotateCcw } from 'lucide-react'
import { runQuiz } from '../quiz/engine'
import type { QuizAnswers, ScoredZone, ZoneScoreBreakdown } from '../quiz/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 75) return '#3E5A48'  // MOSS — excelente correspondência
  if (score >= 55) return '#B8624A'  // CLAY — boa correspondência
  return '#6B6B68'                   // STONE — correspondência moderada
}

function formatPreco(precoMin: number): string {
  return `${(precoMin / 1000).toFixed(0)}k€`
}

// ─── Score Breakdown Grid ────────────────────────────────────────────────────

type BreakdownDim = { key: keyof Omit<ZoneScoreBreakdown, 'total'>; label: string; max: number }

const BREAKDOWN_DIMS: BreakdownDim[] = [
  { key: 'geografia',      label: 'Geografia',  max: 30 },
  { key: 'orcamento',      label: 'Orçamento',  max: 20 },
  { key: 'lifestyle',      label: 'Lifestyle',  max: 20 },
  { key: 'preferenciaCasa', label: 'Casa',      max: 10 },
  { key: 'objetivo',       label: 'Objetivo',   max: 10 },
  { key: 'familia',        label: 'Família',    max: 10 },
]

function ScoreBreakdown({ breakdown }: { breakdown: ZoneScoreBreakdown }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase mb-3"
        style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', letterSpacing: '1px', fontSize: '10px' }}>
        Score por dimensão
      </p>
      <div className="grid grid-cols-3 gap-x-5 gap-y-3.5">
        {BREAKDOWN_DIMS.map(({ key, label, max }) => {
          const v = breakdown[key]
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
                  {label}
                </span>
                <span className="text-xs" style={{ color: '#0E1116', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
                  {v}/{max}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: '#D9D2C3' }}>
                <div className="h-full" style={{ width: `${(v / max) * 100}%`, background: '#B8624A' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Resultado Principal ──────────────────────────────────────────────────────

function PrimaryResult({ result }: { result: ScoredZone }) {
  const { zone, score, reasons, tradeOff, breakdown } = result
  const color = scoreColor(score)

  return (
    <article style={{ background: '#ffffff', border: '1px solid #D9D2C3', borderRadius: '2px' }}>

      {/* Header */}
      <div className="p-8 lg:p-10 pb-0">

        {/* Tag editorial */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#B8624A' }} />
          <span className="text-xs font-semibold uppercase"
            style={{ color: '#B8624A', fontFamily: 'IBM Plex Mono', fontSize: '10px', letterSpacing: '2px' }}>
            A zona que melhor encaixa convosco
          </span>
        </div>

        {/* Nome + Score */}
        <div className="flex items-start justify-between gap-6 mb-4">
          <div className="min-w-0">
            <p className="text-xs uppercase mb-1.5"
              style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>
              {zone.regiao}
            </p>
            <h2 className="font-display text-4xl lg:text-5xl"
              style={{ color: '#0E1116', letterSpacing: '-1.5px', lineHeight: '1.05' }}>
              {zone.nome}
            </h2>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="font-display text-5xl font-medium leading-none" style={{ color, letterSpacing: '-2px' }}>
              {score}
            </div>
            <div className="text-xs mt-1" style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono' }}>/100</div>
          </div>
        </div>

        {/* Descrição editorial */}
        <p className="text-sm leading-relaxed" style={{ color: '#6B6B68' }}>
          {zone.pequenaDescricao}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-8 lg:mx-10 my-6" style={{ borderTop: '1px solid #D9D2C3' }} />

      {/* Secção: Porque esta zona faz sentido */}
      <div className="px-8 lg:px-10 pb-6">
        <p className="text-xs font-semibold uppercase mb-4"
          style={{ color: '#0E1116', fontFamily: 'IBM Plex Mono', letterSpacing: '1px', fontSize: '10px' }}>
          Porque esta zona faz sentido
        </p>
        <ul className="space-y-3">
          {reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#3E5A48' }} />
              <span className="text-sm leading-relaxed" style={{ color: '#0E1116' }}>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Secção: O principal trade-off */}
      <div className="px-8 lg:px-10 pb-8">
        <div className="p-4" style={{ background: '#F5F1EA', borderRadius: '2px', border: '1px solid #D9D2C3' }}>
          <p className="text-xs font-semibold uppercase mb-2"
            style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', letterSpacing: '1px', fontSize: '10px' }}>
            O principal trade-off
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#6B6B68' }}>{tradeOff}</p>
        </div>
      </div>

      {/* Divider + Score breakdown + Preço */}
      <div className="px-8 lg:px-10 pb-8" style={{ borderTop: '1px solid #D9D2C3', paddingTop: '24px' }}>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1">
            <ScoreBreakdown breakdown={breakdown} />
          </div>
          <div className="flex-shrink-0 lg:text-right">
            <p className="text-xs mb-1" style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
              Preço mínimo (T2)
            </p>
            <p className="font-display text-2xl" style={{ color: '#0E1116', letterSpacing: '-0.5px' }}>
              {formatPreco(zone.precoMin)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── Alternativa (2ª e 3ª zonas) ─────────────────────────────────────────────

function AlternativeCard({ result }: { result: ScoredZone }) {
  const { zone, score, reasons, tradeOff } = result
  const color = scoreColor(score)

  return (
    <article className="p-6" style={{ background: '#ffffff', border: '1px solid #D9D2C3', borderRadius: '2px' }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-xs mb-1 uppercase"
            style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>
            {zone.regiao}
          </p>
          <h3 className="font-display text-2xl" style={{ color: '#0E1116', letterSpacing: '-0.5px' }}>
            {zone.nome}
          </h3>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-display text-2xl font-medium" style={{ color, letterSpacing: '-1px' }}>{score}</div>
          <div className="text-xs" style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>/100</div>
        </div>
      </div>

      {/* Melhor razão */}
      {reasons[0] && (
        <div className="flex items-start gap-2.5 mb-2.5">
          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#3E5A48' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#0E1116' }}>{reasons[0]}</p>
        </div>
      )}

      {/* Trade-off */}
      <div className="flex items-start gap-2.5 mb-5">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#D9D2C3' }} />
        <p className="text-sm leading-relaxed" style={{ color: '#6B6B68' }}>{tradeOff}</p>
      </div>

      {/* Preço */}
      <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #D9D2C3' }}>
        <p className="text-xs" style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>
          Preço mínimo (T2)
        </p>
        <p className="font-display font-medium" style={{ color: '#0E1116' }}>
          {formatPreco(zone.precoMin)}
        </p>
      </div>
    </article>
  )
}

// ─── Fallback: sem resultados ─────────────────────────────────────────────────

function NoResultsFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: '#F5F1EA' }}>
      <div className="max-w-sm text-center">
        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-6"
          style={{ border: '1px solid #D9D2C3', borderRadius: '2px' }}>
          <span className="font-display text-lg" style={{ color: '#6B6B68' }}>—</span>
        </div>
        <h1 className="font-display text-2xl mb-3" style={{ color: '#0E1116', letterSpacing: '-0.5px' }}>
          Sem correspondências
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B6B68', maxWidth: '36ch', margin: '0 auto 2rem' }}>
          Nenhuma zona passou os critérios combinados de orçamento, localização e commute.
          Tenta relaxar uma das restrições — especialmente o orçamento ou a tolerância de deslocação.
        </p>
        <Link to="/quiz"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold"
          style={{ background: '#0E1116', color: '#F5F1EA', borderRadius: '2px' }}>
          <RotateCcw size={14} /> Refazer o quiz
        </Link>
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function QuizResults() {
  const location = useLocation()
  const rawAnswers = location.state?.answers as QuizAnswers | undefined

  // useMemo sempre no topo — nunca condicional (regra dos hooks)
  const result = useMemo(
    () => (rawAnswers ? runQuiz(rawAnswers) : null),
    [rawAnswers]
  )

  // Redireciona se chegou sem respostas (acesso directo à URL)
  if (!rawAnswers || !result) {
    return <Navigate to="/quiz" replace />
  }

  if (result.top.length === 0) {
    return <NoResultsFallback />
  }

  const [primary, ...alternatives] = result.top
  const totalAnalysed = result.all.length + result.filteredCount

  return (
    <div className="min-h-screen" style={{ background: '#F5F1EA' }}>

      {/* Logo */}
      <div className="px-8 lg:px-12 pt-8">
        <Link to="/" className="font-display text-xl" style={{ color: '#0E1116', letterSpacing: '-0.5px', textDecoration: 'none' }}>
          VERSO
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-8 lg:px-0 pt-10 pb-20">

        {/* Intro editorial */}
        <header className="mb-10">
          <p className="text-xs uppercase mb-3"
            style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', letterSpacing: '2px', fontSize: '10px' }}>
            Resultado do quiz
          </p>
          <h1 className="font-display text-4xl lg:text-5xl mb-4"
            style={{ color: '#0E1116', letterSpacing: '-1.5px', lineHeight: '1.08' }}>
            A vossa recomendação
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#6B6B68' }}>
            Analisámos {totalAnalysed} zona{totalAnalysed !== 1 ? 's' : ''}.
            {result.filteredCount > 0 && (
              <> {result.filteredCount} eliminada{result.filteredCount !== 1 ? 's' : ''} por orçamento ou localização.</>
            )}
            {' '}Esta é a melhor correspondência para o vosso perfil.
          </p>
        </header>

        {/* Resultado principal */}
        <PrimaryResult result={primary} />

        {/* Alternativas */}
        {alternatives.length > 0 && (
          <section className="mt-8">
            <p className="text-xs font-semibold uppercase mb-4"
              style={{ color: '#6B6B68', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>
              Outras zonas a considerar
            </p>
            <div className="space-y-3">
              {alternatives.map(alt => (
                <AlternativeCard key={alt.zone.id} result={alt} />
              ))}
            </div>
          </section>
        )}

        {/* Nota editorial */}
        <div className="mt-8 p-5" style={{ border: '1px solid #D9D2C3', borderRadius: '2px' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#6B6B68' }}>
            <span className="font-semibold" style={{ color: '#0E1116' }}>Nota:</span>{' '}
            A zona certa não é um detalhe — é a decisão mais importante de toda a compra.
            Esta recomendação é um ponto de partida informado, não uma prescrição.
            Visitem, explorem e confirmem antes de decidir.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to="/areas"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold"
            style={{ background: '#0E1116', color: '#F5F1EA', borderRadius: '2px' }}>
            Explorar todas as zonas
            <ArrowRight size={15} />
          </Link>
          <Link to="/quiz"
            className="flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium"
            style={{ border: '1px solid #D9D2C3', color: '#6B6B68', borderRadius: '2px' }}>
            <RotateCcw size={14} /> Refazer o quiz
          </Link>
        </div>

      </div>
    </div>
  )
}
