/**
 * QuizFlow.tsx — Quiz Habitta (8 perguntas, 10 dimensões)
 *
 * Estados: welcome → q1 → [investor] | q2 → q3 → q4 → q5 → q6 → q7 → q8 → loading → result
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { trackEvent } from '../lib/analytics'
import { useQuiz } from '../context/QuizContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { supabase } from '../lib/supabase'
import { scoreAnswers } from '../lib/quiz/scoring'
import type { QuizResult } from '../lib/quiz/scoring'
import type { QuizAnswers } from '../lib/quiz/questions'
import { questions } from '../lib/quiz/questions'
import type { Zone } from '../data/zones'
import QuizInvestorWaitlist from './QuizInvestorWaitlist'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Screen =
  | 'welcome'
  | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8'
  | 'investor'
  | 'loading'
  | 'result'

const QUESTION_SCREENS: Screen[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8']
// investor is a non-linear branch — not in SCREEN_ORDER for back/forward
const SCREEN_ORDER: Screen[] = ['welcome', ...QUESTION_SCREENS, 'loading', 'result']

// ─── Tokens visuais ───────────────────────────────────────────────────────────

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

// ─── Helper: URL da zona ──────────────────────────────────────────────────────

function zoneHref(zone: Zone): string {
  return zone.kind === 'freguesia' ? `/freguesia/${zone.slug}` : `/concelho/${zone.slug}`
}

// ─── Componente: eyebrow de progresso ─────────────────────────────────────────

function ProgressEyebrow({ step }: { step: number }) {
  return (
    <p style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2.5px',
      color: CLAY,
      margin: '0 0 20px',
    }}>
      {String(step).padStart(2, '0')} / 08
    </p>
  )
}

// ─── Componente: barra de navegação das perguntas ─────────────────────────────

function QuizNav({
  canAdvance,
  onPrev,
  onNext,
  backLabel,
  nextLabel,
}: {
  canAdvance: boolean
  onPrev: () => void
  onNext: () => void
  backLabel: string
  nextLabel: string
}) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={onPrev}
        style={{
          background: 'none',
          border: `1px solid ${HAIRLINE}`,
          borderRadius: '4px',
          padding: '12px 24px',
          cursor: 'pointer',
          color: STONE,
          fontSize: '14px',
        }}
      >
        {backLabel}
      </button>
      <button
        onClick={onNext}
        disabled={!canAdvance}
        style={{
          background: canAdvance ? CLAY : HAIRLINE,
          border: 'none',
          borderRadius: '4px',
          padding: '12px 32px',
          cursor: canAdvance ? 'pointer' : 'not-allowed',
          color: canAdvance ? 'white' : STONE,
          fontSize: '15px',
          fontWeight: 600,
          opacity: canAdvance ? 1 : 0.6,
          transition: 'background 150ms ease, opacity 150ms ease',
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}

// ─── Componente: cartão de zona alternativa ───────────────────────────────────

function AltZoneCard({ zone, score, tradeoff, tradeoffConfidence, isLoggedIn }: { zone: Zone; score: number; tradeoff: string; tradeoffConfidence: string; isLoggedIn: boolean }) {
  return (
    <div style={{
      background: BONE,
      border: `1px solid ${HAIRLINE}`,
      borderRadius: '4px',
      padding: '20px',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      <p style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: CLAY,
        margin: '0 0 8px',
      }}>
        {zone.kind === 'freguesia' ? 'Freguesia · Lisboa' : 'Concelho'} · {score}/100
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <h3
          className="font-display"
          style={{
            fontSize: '20px', fontWeight: 400, color: INK, margin: 0, lineHeight: 1.15,
            ...(isLoggedIn ? {} : { filter: 'blur(7px)', userSelect: 'none' }),
          }}
        >
          {zone.name}
        </h3>
        {!isLoggedIn && <Lock size={13} style={{ color: STONE, flexShrink: 0 }} />}
      </div>
      {tradeoffConfidence === 'high' && (
        <p style={{ fontSize: '13px', color: STONE, margin: '0 0 10px', lineHeight: 1.5 }}>
          {tradeoff}
        </p>
      )}
    </div>
  )
}

// ─── Componente: ecrã de resultado ────────────────────────────────────────────

function ResultScreen({ result, onRestart, isLoggedIn, tr, onAuth }: { result: QuizResult; onRestart: () => void; isLoggedIn: boolean; tr: (k: Parameters<ReturnType<typeof useT>>[0]) => string; onAuth: (mode: 'register' | 'login') => void }) {
  const { best, alternatives, lowScoreWarning } = result

  return (
    <div style={{ width: '100%' }}>

      {/* 1 — Score badge + zona recomendada */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: CLAY,
          margin: '0 0 8px',
        }}>
          {best.zone.kind === 'freguesia' ? 'Freguesia · Lisboa' : 'Concelho'} · {best.score}/100
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <h1
            className="font-display"
            style={{
              fontSize: '36px', fontWeight: 400, color: INK, lineHeight: 1.05, margin: 0, letterSpacing: '-0.8px',
              ...(isLoggedIn ? {} : { filter: 'blur(10px)', userSelect: 'none' }),
            }}
          >
            {best.zone.name}
          </h1>
          {!isLoggedIn && <Lock size={20} style={{ color: STONE, flexShrink: 0 }} />}
        </div>
        {isLoggedIn ? (
          <p style={{ fontSize: '18px', color: STONE, margin: '0 0 4px', lineHeight: 1.55 }}>
            {best.zone.oneLine}
          </p>
        ) : (
          <div style={{
            background: SAND, border: `1px solid ${HAIRLINE}`, borderRadius: '4px',
            padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: INK, borderRadius: '4px', flexShrink: 0,
              }}>
                <Lock size={14} color={BONE} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: INK, margin: '0 0 2px' }}>
                  {tr('quiz.lock.title')}
                </p>
                <p style={{ fontSize: '13px', color: STONE, margin: 0 }}>
                  {tr('quiz.lock.body')}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => onAuth('register')} style={{
                padding: '10px 20px', background: INK, color: BONE,
                borderRadius: '4px', fontSize: '13px', fontWeight: 600,
                border: 'none', cursor: 'pointer',
              }}>
                {tr('quiz.lock.register')}
              </button>
              <button onClick={() => onAuth('login')} style={{
                padding: '10px 20px', background: 'none',
                border: `1px solid ${HAIRLINE}`, color: STONE, borderRadius: '4px',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              }}>
                {tr('quiz.lock.signin')}
              </button>
            </div>
          </div>
        )}

        {lowScoreWarning && (
          <p style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: SAND,
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${CLAY}`,
            borderRadius: '4px',
            fontSize: '14px',
            color: STONE,
            lineHeight: 1.5,
          }}>
            {tr('quiz.result.lowScore')}
          </p>
        )}
      </div>

      {/* 2 — Justificação + trade-off */}
      {isLoggedIn && (
        <div style={{
          background: SAND,
          borderRadius: '4px',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          <p style={{ fontSize: '16px', color: INK, margin: 0, lineHeight: 1.6 }}>
            {best.justification}
          </p>
          {best.tradeoffConfidence === 'high' && (
            <p style={{ fontSize: '15px', fontStyle: 'italic', color: MOSS, margin: 0, lineHeight: 1.6 }}>
              <strong style={{ fontStyle: 'normal', fontWeight: 600, color: INK }}>{tr('quiz.result.tradeoff')}</strong>{' '}
              {best.tradeoff}
            </p>
          )}
          <Link
            to={zoneHref(best.zone)}
            style={{
              color: CLAY,
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              marginTop: '4px',
              letterSpacing: '0.2px',
            }}
          >
            {tr('quiz.result.discover')} {best.zone.name} →
          </Link>
        </div>
      )}

      {/* 3 — Alternativas */}
      {alternatives.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: STONE,
            margin: '0 0 12px',
          }}>
            {tr('quiz.result.altTitle')}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(alternatives.length, 3)}, 1fr)`,
            gap: '8px',
          }}>
            {alternatives.map(alt => (
              <AltZoneCard
                key={alt.zone.slug}
                zone={alt.zone}
                score={alt.score}
                tradeoff={alt.tradeoff}
                tradeoffConfidence={alt.tradeoffConfidence}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4 — CTAs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '28px',
      }}>
        <Link
          to="/areas"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: CLAY,
            color: 'white',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {tr('quiz.result.viewProp')}
        </Link>
        {isLoggedIn && (
          <Link
            to={zoneHref(best.zone)}
            style={{
              display: 'inline-block',
              padding: '14px 24px',
              background: 'none',
              color: INK,
              borderRadius: '4px',
              border: `1px solid ${HAIRLINE}`,
              fontSize: '14px',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            {tr('quiz.result.explore')} {best.zone.name}
          </Link>
        )}
        <button
          onClick={onRestart}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: STONE,
            fontSize: '14px',
            textDecoration: 'underline',
            padding: 0,
          }}
        >
          {tr('quiz.result.restart')}
        </button>
      </div>

      {/* 5 — Rodapé honesto */}
      <p style={{
        fontSize: '14px',
        fontStyle: 'italic',
        color: STONE,
        lineHeight: 1.6,
        borderTop: `1px solid ${HAIRLINE}`,
        paddingTop: '24px',
        margin: 0,
      }}>
        Isto é um começo, não um veredicto. O algoritmo mede distâncias — só tu sabes o que é chegar a casa.
        Caminha por algumas destas ruas antes de decidir.
      </p>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function QuizFlow({ onClose }: { onClose?: () => void }) {
  const [screen, setScreen]     = useState<Screen>('welcome')
  const [answers, setAnswers]   = useState<QuizAnswers>({})
  const [result,  setResult]    = useState<QuizResult | null>(null)
  const [announcement, setAnn]  = useState<string>('')
  const { user } = useAuth()
  const { close, setQuizResult } = useQuiz()
  const isLoggedIn = user !== null
  const { lang } = useLang()
  const tr = useT(lang)
  const navigate = useNavigate()

  function handleAuth(mode: 'register' | 'login') {
    close()
    navigate(`/entrar${mode === 'register' ? '?mode=register' : ''}`)
  }

  const firstOptionRef = useRef<HTMLButtonElement | null>(null)

  // Foco na primeira opção quando muda de ecrã
  useEffect(() => {
    if (QUESTION_SCREENS.includes(screen) && firstOptionRef.current) {
      firstOptionRef.current.focus()
    }
  }, [screen])

  // Navegação por teclado
  useEffect(() => {
    if (!QUESTION_SCREENS.includes(screen)) return

    const allOpts = getAllOptions(screen)
    const currentVal = getCurrentValue(screen, answers)

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        goBack()
        return
      }

      if (screen === 'q8') {
        // Q8 multi-select: Arrow keys move focus, Space toggles
        const opts = getAllOptions('q8')
        const focused = document.activeElement as HTMLButtonElement | null
        const focusedIdx = focused ? opts.findIndex(o => o.id === focused.dataset?.optionId) : -1

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault()
          const next = (focusedIdx + 1) % opts.length
          const btn = document.querySelector<HTMLButtonElement>(`[data-option-id="${opts[next].id}"]`)
          btn?.focus()
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault()
          const prev = (focusedIdx - 1 + opts.length) % opts.length
          const btn = document.querySelector<HTMLButtonElement>(`[data-option-id="${opts[prev].id}"]`)
          btn?.focus()
        } else if (e.key === ' ' && focused?.dataset?.optionId) {
          e.preventDefault()
          toggleQ8(focused.dataset.optionId)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (canAdvance(screen, answers)) goForward()
        }
        return
      }

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        const idx = allOpts.findIndex(o => o.id === currentVal)
        const next = allOpts[(idx + 1) % allOpts.length]
        selectSingle(screen, next.id)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const idx = allOpts.findIndex(o => o.id === currentVal)
        const prev = allOpts[(idx - 1 + allOpts.length) % allOpts.length]
        selectSingle(screen, prev.id)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (canAdvance(screen, answers)) goForward()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, answers])

  // ── Helpers de navegação ──────────────────────────────────────────────────

  const goBack = useCallback(() => {
    if (screen === 'investor') {
      setScreen('q1')
      return
    }
    const idx = SCREEN_ORDER.indexOf(screen)
    if (idx > 0) setScreen(SCREEN_ORDER[idx - 1])
  }, [screen])

  const goForward = useCallback(() => {
    // Investor branch: Q1 → investor when i4_invest
    if (screen === 'q1' && answers.q1_intent === 'i4_invest') {
      setScreen('investor')
      return
    }
    const idx = SCREEN_ORDER.indexOf(screen)
    const next = SCREEN_ORDER[idx + 1]
    if (next === 'loading') {
      runScoring()
    } else if (next) {
      setScreen(next)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, answers])

  const runScoring = useCallback(() => {
    setScreen('loading')
    setTimeout(() => {
      const res = scoreAnswers(answers)
      setResult(res)
      setQuizResult(res)
      trackEvent('quiz_completed', { result_zone: res.best.zone.name })
      // Auto-save best zone to profile if user is logged in
      if (user) {
        const best = res.best
        supabase.from('saved_zones')
          .select('id')
          .eq('user_id', user.id)
          .eq('zone_slug', best.slug)
          .maybeSingle()
          .then(({ data }) => {
            if (!data) {
              supabase.from('saved_zones').insert({
                user_id: user.id,
                zone_slug: best.slug,
                zone_kind: best.zone.kind ?? 'concelho',
                zone_name: best.zone.name,
              })
            }
          })
      }
      close()
      navigate('/quiz/dossier')
    }, 900)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, user])

  const restart = useCallback(() => {
    setAnswers({})
    setResult(null)
    setScreen('welcome')
  }, [])

  // ── Helpers de opções ─────────────────────────────────────────────────────

  function getAllOptions(s: Screen): { id: string; label: string; helper?: string }[] {
    const isBuy = answers.q2_ownership !== 'o2_rent'

    const map: Partial<Record<Screen, { id: string; label: string; helper?: string }[]>> = {
      q1: questions.q1_intent.options    as unknown as { id: string; label: string }[],
      q2: questions.q2_ownership.options as unknown as { id: string; label: string; helper?: string }[],
      q3: (isBuy ? questions.q3_budget.optionsBuy : questions.q3_budget.optionsRent) as unknown as { id: string; label: string }[],
      q4: questions.q4_work.options      as unknown as { id: string; label: string }[],
      q5: questions.q5_routine.options   as unknown as { id: string; label: string; helper?: string }[],
      q6: questions.q6_sound.options     as unknown as { id: string; label: string; helper?: string }[],
      q7: questions.q7_tradeoff.options  as unknown as { id: string; label: string; helper?: string }[],
      q8: questions.q8_priority.options  as unknown as { id: string; label: string; helper?: string }[],
    }
    return map[s] ?? []
  }

  function getCurrentValue(s: Screen, a: QuizAnswers): string | undefined {
    const map: Partial<Record<Screen, string | undefined>> = {
      q1: a.q1_intent,
      q2: a.q2_ownership,
      q3: a.q3_budget,
      q4: a.q4_work,
      q5: a.q5_routine,
      q6: a.q6_sound,
      q7: a.q7_tradeoff,
    }
    return map[s]
  }

  function selectSingle(s: Screen, id: string) {
    const updates: Partial<QuizAnswers> = {}
    if (s === 'q1') updates.q1_intent    = id as QuizAnswers['q1_intent']
    if (s === 'q2') {
      updates.q2_ownership = id as QuizAnswers['q2_ownership']
      // Reset budget if switching buy ↔ rent
      updates.q3_budget = undefined
    }
    if (s === 'q3') updates.q3_budget    = id as QuizAnswers['q3_budget']
    if (s === 'q4') updates.q4_work      = id as QuizAnswers['q4_work']
    if (s === 'q5') updates.q5_routine   = id as QuizAnswers['q5_routine']
    if (s === 'q6') updates.q6_sound     = id as QuizAnswers['q6_sound']
    if (s === 'q7') updates.q7_tradeoff  = id as QuizAnswers['q7_tradeoff']
    setAnswers(prev => ({ ...prev, ...updates }))
    const opts = getAllOptions(s)
    const label = opts.find(o => o.id === id)?.label ?? ''
    setAnn(`Seleccionado: ${label}`)
  }

  // Q8 multi-select: p7_none is mutually exclusive
  function toggleQ8(id: string) {
    const current = answers.q8_priority ?? []

    if (id === 'p7_none') {
      // p7_none selected — deselect everything else
      const next = (current as string[]).includes('p7_none') ? [] : ['p7_none']
      setAnswers(prev => ({ ...prev, q8_priority: next as QuizAnswers['q8_priority'] }))
      setAnn(next.length ? 'Seleccionado: Nada disto em particular.' : 'Removido.')
      return
    }

    // Non-p7_none selected — deselect p7_none if present
    const withoutNone = (current as string[]).filter(v => v !== 'p7_none')

    if (withoutNone.includes(id)) {
      // Deselect
      const next = withoutNone.filter(v => v !== id) as QuizAnswers['q8_priority']
      setAnswers(prev => ({ ...prev, q8_priority: next }))
      setAnn(`Removido. ${next?.length ?? 0} seleccionado(s).`)
    } else if (withoutNone.length < 2) {
      // Select (max 2 non-none options)
      const next = [...withoutNone, id] as QuizAnswers['q8_priority']
      setAnswers(prev => ({ ...prev, q8_priority: next }))
      setAnn(`Adicionado. ${next?.length ?? 0} seleccionado(s).`)
    } else {
      setAnn('Máximo de 2 selecções atingido.')
    }
  }

  function canAdvance(s: Screen, a: QuizAnswers): boolean {
    // q3 (budget) and q8 (priority) are optional — always can advance
    if (s === 'q3' || s === 'q8') return true
    const val = getCurrentValue(s, a)
    return !!val
  }

  // ── Layout base ──────────────────────────────────────────────────────────

  function shell(content: React.ReactNode) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {content}
      </div>
    )
  }

  // ── Ecrã de boas-vindas ───────────────────────────────────────────────────

  if (screen === 'welcome') {
    return shell(
      <div>
        <h1
          className="font-display"
          style={{ fontSize: '34px', lineHeight: 1.08, color: INK, margin: '0 0 16px', fontWeight: 400, letterSpacing: '-0.8px' }}
        >
          {tr('quiz.welcome.title')}
        </h1>
        <p style={{ fontSize: '16px', fontStyle: 'italic', color: MOSS, lineHeight: 1.65, margin: '0 0 32px' }}>
          {tr('quiz.welcome.sub')}
        </p>
        <button
          onClick={() => setScreen('q1')}
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: CLAY,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.3px',
            marginBottom: '16px',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          {tr('quiz.welcome.start')}
        </button>
        <div>
          <button
            onClick={() => onClose ? onClose() : (window.location.href = '/areas')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: STONE, fontSize: '13px', textDecoration: 'underline', padding: 0 }}
          >
            {tr('quiz.welcome.skip')}
          </button>
        </div>
      </div>
    )
  }

  // ── Ecrã de investidor ────────────────────────────────────────────────────

  if (screen === 'investor') {
    return shell(
      <QuizInvestorWaitlist
        onRestartForLiving={() => {
          setAnswers(prev => ({ ...prev, q1_intent: undefined }))
          setScreen('q1')
        }}
      />
    )
  }

  // ── Ecrã de carregamento ──────────────────────────────────────────────────

  if (screen === 'loading') {
    return shell(
      <div style={{ maxWidth: '480px' }}>
        <p style={{ fontSize: '22px', fontStyle: 'italic', color: MOSS, lineHeight: 1.5 }}>
          {tr('quiz.loading')}
        </p>
      </div>
    )
  }

  // ── Ecrã de resultado ─────────────────────────────────────────────────────

  if (screen === 'result' && result) {
    return shell(<ResultScreen result={result} onRestart={restart} isLoggedIn={isLoggedIn} tr={tr} onAuth={handleAuth} />)
  }

  // ── Perguntas ─────────────────────────────────────────────────────────────

  function renderQuestion(
    stepNum: number,
    opts: { id: string; label: string; helper?: string }[],
    isMulti: boolean,
    selectedSingle: string | undefined,
    selectedMulti: string[],
    onSelectSingle: (id: string) => void,
    onSelectMulti: (id: string) => void,
    nextCb: () => void,
    prevCb: () => void,
    label: string,
    helpText?: string,
  ) {
    const advance = canAdvance(screen, answers)

    return shell(
      <div>
        {/* Aria live */}
        <div aria-live="polite" className="sr-only">{announcement}</div>

        <ProgressEyebrow step={stepNum} />

        <h2
          className="font-display"
          style={{
            fontSize: '26px',
            fontWeight: 400,
            color: INK,
            lineHeight: 1.2,
            margin: '0 0 8px',
            letterSpacing: '-0.4px',
          }}
        >
          {label}
        </h2>

        {helpText && (
          <p style={{ fontSize: '14px', color: STONE, margin: '0 0 32px', lineHeight: 1.5 }}>{helpText}</p>
        )}
        {!helpText && <div style={{ height: '32px' }} />}

        <div
          role="group"
          aria-label={`Pergunta ${stepNum} de 8`}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}
        >
          {opts.map((opt, idx) => {
            const isSelected = isMulti
              ? selectedMulti.includes(opt.id)
              : opt.id === selectedSingle
            return (
              <button
                key={opt.id}
                ref={idx === 0 ? firstOptionRef : undefined}
                onClick={() => isMulti ? onSelectMulti(opt.id) : onSelectSingle(opt.id)}
                aria-pressed={isSelected}
                // data-option-id enables arrow-key focus movement for Q8
                data-option-id={opt.id}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 18px',
                  background: BONE,
                  border: isSelected ? `1px solid ${INK}` : `1px solid ${HAIRLINE}`,
                  borderLeft: isSelected ? `4px solid ${CLAY}` : `4px solid transparent`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '15px',
                  lineHeight: '1.45',
                  color: INK,
                  outline: 'none',
                  transition: 'border-color 120ms ease',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = CLAY
                    e.currentTarget.style.borderLeftColor = CLAY
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = HAIRLINE
                    e.currentTarget.style.borderLeftColor = 'transparent'
                  }
                }}
                onFocus={e => {
                  e.currentTarget.style.outline = `2px solid ${CLAY}`
                  e.currentTarget.style.outlineOffset = '2px'
                }}
                onBlur={e => {
                  e.currentTarget.style.outline = 'none'
                }}
              >
                <span style={{ display: 'block' }}>{opt.label}</span>
                {opt.helper && (
                  <span style={{ display: 'block', fontSize: '12px', color: STONE, marginTop: '3px', fontStyle: 'italic' }}>
                    {opt.helper}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <QuizNav
          canAdvance={advance}
          onPrev={prevCb}
          onNext={nextCb}
          backLabel={tr('quiz.nav.back')}
          nextLabel={tr('quiz.nav.next')}
        />
      </div>
    )
  }

  const prevScreen = SCREEN_ORDER[SCREEN_ORDER.indexOf(screen) - 1]
  const nextScreen = SCREEN_ORDER[SCREEN_ORDER.indexOf(screen) + 1]

  const goNext = () => {
    if (screen === 'q1' && answers.q1_intent === 'i4_invest') {
      setScreen('investor')
      return
    }
    if (nextScreen === 'loading') {
      runScoring()
    } else {
      setScreen(nextScreen)
    }
  }
  const goPrev = () => setScreen(prevScreen)

  // Q1 — Para quem é a casa?
  if (screen === 'q1') {
    return renderQuestion(
      1,
      questions.q1_intent.options as unknown as { id: string; label: string }[],
      false,
      answers.q1_intent, [],
      id => selectSingle('q1', id), () => {},
      goNext, goPrev,
      questions.q1_intent.label,
    )
  }

  // Q2 — Comprar ou arrendar?
  if (screen === 'q2') {
    return renderQuestion(
      2,
      questions.q2_ownership.options as unknown as { id: string; label: string; helper?: string }[],
      false,
      answers.q2_ownership, [],
      id => selectSingle('q2', id), () => {},
      goNext, goPrev,
      questions.q2_ownership.label,
    )
  }

  // Q3 — Orçamento (label e opções dependem de Q2)
  if (screen === 'q3') {
    const isBuy = answers.q2_ownership !== 'o2_rent'
    const q3Label = isBuy ? questions.q3_budget.labelBuy : questions.q3_budget.labelRent
    const q3Opts  = (isBuy ? questions.q3_budget.optionsBuy : questions.q3_budget.optionsRent) as unknown as { id: string; label: string }[]
    return renderQuestion(
      3,
      q3Opts,
      false,
      answers.q3_budget, [],
      id => selectSingle('q3', id), () => {},
      goNext, goPrev,
      q3Label,
    )
  }

  // Q4 — Modo de trabalho
  if (screen === 'q4') {
    return renderQuestion(
      4,
      questions.q4_work.options as unknown as { id: string; label: string }[],
      false,
      answers.q4_work, [],
      id => selectSingle('q4', id), () => {},
      goNext, goPrev,
      questions.q4_work.label,
    )
  }

  // Q5 — Rotina de deslocação
  if (screen === 'q5') {
    return renderQuestion(
      5,
      questions.q5_routine.options as unknown as { id: string; label: string; helper?: string }[],
      false,
      answers.q5_routine, [],
      id => selectSingle('q5', id), () => {},
      goNext, goPrev,
      questions.q5_routine.label,
    )
  }

  // Q6 — Ambiente sonoro
  if (screen === 'q6') {
    return renderQuestion(
      6,
      questions.q6_sound.options as unknown as { id: string; label: string; helper?: string }[],
      false,
      answers.q6_sound, [],
      id => selectSingle('q6', id), () => {},
      goNext, goPrev,
      questions.q6_sound.label,
    )
  }

  // Q7 — Tradeoff espaço vs. centralidade
  if (screen === 'q7') {
    return renderQuestion(
      7,
      questions.q7_tradeoff.options as unknown as { id: string; label: string; helper?: string }[],
      false,
      answers.q7_tradeoff, [],
      id => selectSingle('q7', id), () => {},
      goNext, goPrev,
      questions.q7_tradeoff.label,
    )
  }

  // Q8 — Prioridades (multi-select, skippable, p7_none mutuamente exclusivo)
  if (screen === 'q8') {
    return renderQuestion(
      8,
      questions.q8_priority.options as unknown as { id: string; label: string; helper?: string }[],
      true,
      undefined,
      (answers.q8_priority ?? []) as string[],
      () => {}, id => toggleQ8(id),
      goNext, goPrev,
      questions.q8_priority.label,
    )
  }

  return null
}
