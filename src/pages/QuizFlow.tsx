/**
 * QuizFlow.tsx — Quiz Habitta (9 perguntas, 10 dimensões)
 *
 * Estados: welcome → q1 → q2 → q3 → q4 → q5 → q6 → q7 → q8 → q9 → loading → result
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useQuiz } from '../context/QuizContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { supabase } from '../lib/supabase'
import { scoreAnswers } from '../lib/quiz/scoring'
import type { QuizResult } from '../lib/quiz/scoring'
import type { QuizAnswers } from '../lib/quiz/questions'
import { questions } from '../lib/quiz/questions'
import type { Zone } from '../data/zones'
import { concelhosAML } from '../data/concelhosAML'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Screen =
  | 'welcome'
  | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9'
  | 'loading'
  | 'result'

const QUESTION_SCREENS: Screen[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9']
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

// ─── Componente: opção de pergunta ────────────────────────────────────────────

function QuizOption({
  label,
  selected,
  onSelect,
  focusRef,
}: {
  label: string
  selected: boolean
  onSelect: () => void
  focusRef?: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <button
      ref={focusRef}
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '14px 18px',
        background: BONE,
        border: selected ? `1px solid ${INK}` : `1px solid ${HAIRLINE}`,
        borderLeft: selected ? `4px solid ${CLAY}` : `4px solid transparent`,
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '15px',
        lineHeight: '1.45',
        color: INK,
        outline: 'none',
        transition: 'border-color 120ms ease',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = CLAY
          e.currentTarget.style.borderLeftColor = CLAY
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
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
      {label}
    </button>
  )
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
      {String(step).padStart(2, '0')} / 09
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

function AltZoneCard({ zone, score, tradeoff, isLoggedIn }: { zone: Zone; score: number; tradeoff: string; isLoggedIn: boolean }) {
  const concelhoSlug = zone.kind === 'freguesia' ? 'lisboa' : zone.slug
  const costVerified = concelhosAML.find(c => c.slug === concelhoSlug)?.costVerified ?? false

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
      {costVerified && (
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
  const bestCostVerified = concelhosAML.find(c => c.slug === best.concelhoSlug)?.costVerified ?? false

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
          {bestCostVerified && (
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

      if (screen === 'q7') {
        // multi-select — ArrowUp/Down cycling não aplicável da mesma forma
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
    const idx = SCREEN_ORDER.indexOf(screen)
    if (idx > 0) setScreen(SCREEN_ORDER[idx - 1])
  }, [screen])

  const goForward = useCallback(() => {
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

  // ── Helpers de selecção ────────────────────────────────────────────────────

  function getAllOptions(s: Screen): { id: string; label: string }[] {
    const map: Record<string, { id: string; label: string }[]> = {
      q1: questions.q1_household.options as unknown as { id: string; label: string }[],
      q2: questions.q2_budget.options    as unknown as { id: string; label: string }[],
      q3: questions.q3_lifestyle.options as unknown as { id: string; label: string }[],
      q4: questions.q4_work.options      as unknown as { id: string; label: string }[],
      q5: questions.q5_commute.options   as unknown as { id: string; label: string }[],
      q6: questions.q6_intent.options    as unknown as { id: string; label: string }[],
      q7: questions.q7_priority.options  as unknown as { id: string; label: string }[],
      q8: questions.q8_dwelling.options  as unknown as { id: string; label: string }[],
      q9: questions.q9_maturity.options  as unknown as { id: string; label: string }[],
    }
    return map[s] ?? []
  }

  function getCurrentValue(s: Screen, a: QuizAnswers): string | undefined {
    const map: Record<string, string | undefined> = {
      q1: a.q1_household,
      q2: a.q2_budget,
      q3: a.q3_lifestyle,
      q4: a.q4_work,
      q5: a.q5_commute,
      q6: a.q6_intent,
      q8: a.q8_dwelling,
      q9: a.q9_maturity,
    }
    return map[s]
  }

  function selectSingle(s: Screen, id: string) {
    const updates: Partial<QuizAnswers> = {}
    if (s === 'q1') updates.q1_household = id as QuizAnswers['q1_household']
    if (s === 'q2') updates.q2_budget    = id as QuizAnswers['q2_budget']
    if (s === 'q3') updates.q3_lifestyle = id as QuizAnswers['q3_lifestyle']
    if (s === 'q4') updates.q4_work      = id as QuizAnswers['q4_work']
    if (s === 'q5') updates.q5_commute   = id as QuizAnswers['q5_commute']
    if (s === 'q6') updates.q6_intent    = id as QuizAnswers['q6_intent']
    if (s === 'q8') updates.q8_dwelling  = id as QuizAnswers['q8_dwelling']
    if (s === 'q9') updates.q9_maturity  = id as QuizAnswers['q9_maturity']
    setAnswers(prev => ({ ...prev, ...updates }))
    const opts = getAllOptions(s)
    const label = opts.find(o => o.id === id)?.label ?? ''
    setAnn(`Seleccionado: ${label}`)
  }

  function toggleMulti(id: string) {
    const current = answers.q7_priority ?? []
    if ((current as string[]).includes(id)) {
      const next = (current as string[]).filter(v => v !== id) as QuizAnswers['q7_priority']
      setAnswers(prev => ({ ...prev, q7_priority: next }))
      setAnn(`Removido. ${next?.length ?? 0} seleccionado(s).`)
    } else if (current.length < 2) {
      const next = [...current, id] as QuizAnswers['q7_priority']
      setAnswers(prev => ({ ...prev, q7_priority: next }))
      setAnn(`Adicionado. ${next?.length ?? 0} seleccionado(s).`)
    } else {
      setAnn('Máximo de 2 selecções atingido.')
    }
  }

  function canAdvance(s: Screen, a: QuizAnswers): boolean {
    // Q2 (budget) e Q7 (priority) são opcionais — podem avançar sem selecção
    if (s === 'q2' || s === 'q7') return true
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
    questionKey: keyof typeof questions,
    opts: readonly { id: string; label: string }[],
    isMulti: boolean,
    selectedSingle: string | undefined,
    selectedMulti: string[],
    onSelectSingle: (id: string) => void,
    onSelectMulti: (id: string) => void,
    nextCb: () => void,
    prevCb: () => void,
    helpText?: string,
  ) {
    const q = questions[questionKey]
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
          {q.label}
        </h2>

        {helpText && (
          <p style={{ fontSize: '14px', color: STONE, margin: '0 0 32px', lineHeight: 1.5 }}>{helpText}</p>
        )}
        {!helpText && <div style={{ height: '32px' }} />}

        <div
          role="group"
          aria-label={`Pergunta ${stepNum} de 9`}
          style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}
        >
          {opts.map((opt, idx) => {
            const isSelected = isMulti
              ? selectedMulti.includes(opt.id)
              : opt.id === selectedSingle
            return (
              <QuizOption
                key={opt.id}
                label={opt.label}
                selected={isSelected}
                onSelect={() => isMulti ? onSelectMulti(opt.id) : onSelectSingle(opt.id)}
                focusRef={idx === 0 ? firstOptionRef : undefined}
              />
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
    if (nextScreen === 'loading') {
      runScoring()
    } else {
      setScreen(nextScreen)
    }
  }
  const goPrev = () => setScreen(prevScreen)

  // Q1 — Contexto (household)
  if (screen === 'q1') {
    return renderQuestion(
      1, 'q1_household',
      questions.q1_household.options as unknown as { id: string; label: string }[],
      false,
      answers.q1_household, [],
      id => selectSingle('q1', id), () => {},
      goNext, goPrev,
    )
  }

  // Q2 — Orçamento (skippable)
  if (screen === 'q2') {
    return renderQuestion(
      2, 'q2_budget',
      questions.q2_budget.options as unknown as { id: string; label: string }[],
      false,
      answers.q2_budget, [],
      id => selectSingle('q2', id), () => {},
      goNext, goPrev,
      questions.q2_budget.help,
    )
  }

  // Q3 — Estilo de vida
  if (screen === 'q3') {
    return renderQuestion(
      3, 'q3_lifestyle',
      questions.q3_lifestyle.options as unknown as { id: string; label: string }[],
      false,
      answers.q3_lifestyle, [],
      id => selectSingle('q3', id), () => {},
      goNext, goPrev,
    )
  }

  // Q4 — Modo de trabalho
  if (screen === 'q4') {
    return renderQuestion(
      4, 'q4_work',
      questions.q4_work.options as unknown as { id: string; label: string }[],
      false,
      answers.q4_work, [],
      id => selectSingle('q4', id), () => {},
      goNext, goPrev,
    )
  }

  // Q5 — Tolerância de percurso
  if (screen === 'q5') {
    return renderQuestion(
      5, 'q5_commute',
      questions.q5_commute.options as unknown as { id: string; label: string }[],
      false,
      answers.q5_commute, [],
      id => selectSingle('q5', id), () => {},
      goNext, goPrev,
    )
  }

  // Q6 — Intenção de compra
  if (screen === 'q6') {
    return renderQuestion(
      6, 'q6_intent',
      questions.q6_intent.options as unknown as { id: string; label: string }[],
      false,
      answers.q6_intent, [],
      id => selectSingle('q6', id), () => {},
      goNext, goPrev,
    )
  }

  // Q7 — Prioridades (multi-select, skippable)
  if (screen === 'q7') {
    return renderQuestion(
      7, 'q7_priority',
      questions.q7_priority.options as unknown as { id: string; label: string }[],
      true,
      undefined,
      (answers.q7_priority ?? []) as string[],
      () => {}, id => toggleMulti(id),
      goNext, goPrev,
      questions.q7_priority.help,
    )
  }

  // Q8 — Tipo de imóvel
  if (screen === 'q8') {
    return renderQuestion(
      8, 'q8_dwelling',
      questions.q8_dwelling.options as unknown as { id: string; label: string }[],
      false,
      answers.q8_dwelling, [],
      id => selectSingle('q8', id), () => {},
      goNext, goPrev,
    )
  }

  // Q9 — Maturidade da zona
  if (screen === 'q9') {
    return renderQuestion(
      9, 'q9_maturity',
      questions.q9_maturity.options as unknown as { id: string; label: string }[],
      false,
      answers.q9_maturity, [],
      id => selectSingle('q9', id), () => {},
      goNext, goPrev,
    )
  }

  return null
}
