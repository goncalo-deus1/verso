/**
 * QuizPage.tsx — Quiz Habitta em página completa (layout editorial)
 *
 * Rota: /quiz
 * Layout: SectionHead + progresso lateral sticky + card de pergunta
 * Lógica: 9 perguntas, scoreAnswers → navegação para /quiz/dossier
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { scoreAnswers } from '../lib/quiz/scoring'
import { questions } from '../lib/quiz/questions'
import type { QuizAnswers } from '../lib/quiz/questions'
import { SectionHead } from '../components/editorial/SectionHead'
import { QuizProgress } from '../components/quiz/QuizProgress'

// ─── Constantes ──────────────────────────────────────────────────────────────

type Screen = 'welcome' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'loading'

const Q_SCREENS: Screen[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9']
const SCREEN_ORDER: Screen[] = ['welcome', ...Q_SCREENS, 'loading']

const QUESTION_LABELS = [
  'Contexto', 'Orçamento', 'Estilo de vida', 'Trabalho',
  'Deslocações', 'Intenção', 'Prioridades', 'Tipo de imóvel', 'Horizonte',
]

// Tags opcionais por opção (acrescentam contexto técnico)
const OPTION_TAGS: Record<string, string> = {
  b1: '< 250k', b2: '250–400k', b3: '400–600k', b4: '600k–1M', b5: '1M +', b6: 'A definir',
  c1: '20 min', c2: '35 min', c3: '50 min',
  w3: 'Flexível',
  l4: 'Mar / Verde', l5: 'Valorização',
  i1: 'Habitação', i2: 'ROI',
  m3: 'Potencial',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStep(screen: Screen): number {
  return Q_SCREENS.indexOf(screen) + 1  // 0 se não é pergunta
}

function getQuestionKey(screen: Screen): keyof typeof questions | null {
  const map: Partial<Record<Screen, keyof typeof questions>> = {
    q1: 'q1_household', q2: 'q2_budget', q3: 'q3_lifestyle',
    q4: 'q4_work', q5: 'q5_commute', q6: 'q6_intent',
    q7: 'q7_priority', q8: 'q8_dwelling', q9: 'q9_maturity',
  }
  return map[screen] ?? null
}

function getSelectedSingle(screen: Screen, a: QuizAnswers): string | undefined {
  const map: Partial<Record<Screen, string | undefined>> = {
    q1: a.q1_household, q2: a.q2_budget, q3: a.q3_lifestyle,
    q4: a.q4_work, q5: a.q5_commute, q6: a.q6_intent,
    q8: a.q8_dwelling, q9: a.q9_maturity,
  }
  return map[screen]
}

function canAdvance(screen: Screen, a: QuizAnswers): boolean {
  if (screen === 'q2' || screen === 'q7') return true  // opcionais
  return !!getSelectedSingle(screen, a)
}

// ─── Sub-componentes visuais ──────────────────────────────────────────────────

function WelcomeCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-[680px]">
      <div className="bg-verso-paper border border-verso-rule-soft p-10 sm:p-14 relative shadow-[0_20px_40px_-20px_rgba(30, 31, 24,0.10)]">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-verso-clay" />

        <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-verso-clay mb-6">
          Ensaio Cartográfico N.º 01 · AML 2026
        </p>

        <h2 className="font-display font-normal text-4xl sm:text-5xl leading-[1.05] tracking-[-0.025em] text-verso-midnight mb-6">
          Nove perguntas.<br />
          Uma recomendação{' '}
          <em className="italic text-verso-clay">territorial</em>.
        </h2>

        <p className="text-[15px] text-verso-midnight-soft leading-[1.65] max-w-[480px] mb-10">
          Não há respostas certas. Cada escolha ajusta o peso de dez variáveis —
          desde densidade construída até proximidade a transporte e ruído nocturno.
          Leva cerca de 3 minutos.
        </p>

        <button
          onClick={onStart}
          className="group inline-flex items-center gap-3.5 bg-verso-midnight text-verso-paper px-7 py-[18px] font-mono text-[12px] tracking-[0.14em] uppercase font-medium transition-all duration-300 hover:bg-verso-clay hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#1E1F18]"
        >
          Começar o questionário
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"
            className="transition-transform group-hover:translate-x-1" aria-hidden>
            <path d="M1 6h14m0 0L10 1m5 5l-5 5" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

type QuizCardProps = {
  screen: Screen
  answers: QuizAnswers
  onSelectSingle: (id: string) => void
  onToggleMulti: (id: string) => void
  onNext: () => void
  onPrev: () => void
}

function QuizCard({ screen, answers, onSelectSingle, onToggleMulti, onNext, onPrev }: QuizCardProps) {
  const step = getStep(screen)
  const qKey = getQuestionKey(screen)
  if (!qKey) return null

  const q = questions[qKey]
  const opts = q.options as readonly { id: string; label: string }[]
  const isMulti = screen === 'q7'
  const selectedSingle = getSelectedSingle(screen, answers)
  const selectedMulti = (answers.q7_priority ?? []) as string[]
  const advance = canAdvance(screen, answers)
  const label = QUESTION_LABELS[step - 1]

  // Primeira opção ref para focus
  const firstRef = useRef<HTMLButtonElement>(null)
  useEffect(() => { firstRef.current?.focus() }, [screen])

  return (
    <div className="bg-verso-paper border border-verso-rule-soft relative shadow-[0_20px_40px_-20px_rgba(30, 31, 24,0.12)]"
      style={{ minHeight: '480px' }}>
      {/* Barra clay topo */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-verso-clay" />

      <div className="p-8 sm:p-10 sm:p-12">
        {/* Eyebrow */}
        <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-verso-clay mb-5">
          § Pergunta {String(step).padStart(2, '0')} · {label}
        </p>

        {/* Pergunta */}
        <h3 className="font-display font-normal text-3xl sm:text-[32px] leading-[1.1] tracking-[-0.02em] mb-2 max-w-[500px] text-verso-midnight">
          {q.label}
        </h3>

        {'help' in q && q.help && (
          <p className="text-[13px] text-verso-midnight-soft mb-7 leading-[1.55]">{q.help}</p>
        )}
        {(!('help' in q) || !q.help) && <div className="mb-7" />}

        {/* Opções */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
          {opts.map((opt, idx) => {
            const isSelected = isMulti
              ? selectedMulti.includes(opt.id)
              : opt.id === selectedSingle
            const tag = OPTION_TAGS[opt.id]

            return (
              <button
                key={opt.id}
                ref={idx === 0 ? firstRef : undefined}
                onClick={() => isMulti ? onToggleMulti(opt.id) : onSelectSingle(opt.id)}
                aria-pressed={isSelected}
                className={`group px-5 py-[18px] border text-left text-sm flex justify-between items-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-verso-clay ${
                  isSelected
                    ? 'bg-verso-midnight text-verso-paper border-verso-midnight'
                    : 'border-verso-rule-soft text-verso-midnight hover:border-verso-midnight hover:bg-verso-paper-grain'
                }`}
              >
                <span className="leading-snug">{opt.label}</span>
                {tag && (
                  <span className={`font-mono text-[10px] tracking-[0.1em] uppercase ml-3 shrink-0 ${
                    isSelected ? 'text-verso-clay' : 'text-verso-midnight-soft'
                  }`}>
                    {tag}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Nav */}
        <div className="flex justify-between items-center pt-6 border-t border-verso-rule-soft">
          <button
            onClick={onPrev}
            disabled={step === 1}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-verso-midnight-soft flex items-center gap-2 disabled:opacity-30 hover:text-verso-midnight transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={onNext}
            disabled={!advance}
            className="bg-verso-midnight text-verso-paper px-6 py-3.5 font-mono text-[11px] tracking-[0.14em] uppercase hover:bg-verso-clay transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step === 9 ? 'Ver resultado →' : 'Próxima pergunta →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="max-w-[560px] mx-auto text-center py-20">
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-verso-clay mb-6">
        A calcular
      </p>
      <p className="font-display font-normal text-4xl sm:text-5xl leading-[1.05] tracking-[-0.025em] text-verso-midnight">
        A cruzar o teu perfil<br />
        com <em className="italic text-verso-clay">18 zonas</em> da AML…
      </p>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function QuizPage() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const { setQuizResult } = useQuiz()
  const navigate = useNavigate()

  // ── Navegação ──────────────────────────────────────────────────────────────

  const goForward = useCallback(() => {
    const idx = SCREEN_ORDER.indexOf(screen)
    const next = SCREEN_ORDER[idx + 1]
    if (next === 'loading') {
      setScreen('loading')
      setTimeout(() => {
        const res = scoreAnswers(answers)
        setQuizResult(res)
        navigate('/quiz/dossier')
      }, 1100)
    } else if (next) {
      setScreen(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [screen, answers, navigate, setQuizResult])

  const goBack = useCallback(() => {
    const idx = SCREEN_ORDER.indexOf(screen)
    if (idx > 0) {
      setScreen(SCREEN_ORDER[idx - 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [screen])

  // ── Selecção de respostas ──────────────────────────────────────────────────

  function selectSingle(id: string) {
    const map: Record<Screen, Partial<QuizAnswers>> = {
      q1: { q1_household: id as QuizAnswers['q1_household'] },
      q2: { q2_budget:    id as QuizAnswers['q2_budget'] },
      q3: { q3_lifestyle: id as QuizAnswers['q3_lifestyle'] },
      q4: { q4_work:      id as QuizAnswers['q4_work'] },
      q5: { q5_commute:   id as QuizAnswers['q5_commute'] },
      q6: { q6_intent:    id as QuizAnswers['q6_intent'] },
      q8: { q8_dwelling:  id as QuizAnswers['q8_dwelling'] },
      q9: { q9_maturity:  id as QuizAnswers['q9_maturity'] },
      welcome: {}, loading: {}, q7: {},
    }
    setAnswers(prev => ({ ...prev, ...map[screen] }))
  }

  function toggleMulti(id: string) {
    const current = (answers.q7_priority ?? []) as string[]
    if (current.includes(id)) {
      setAnswers(prev => ({ ...prev, q7_priority: current.filter(v => v !== id) as QuizAnswers['q7_priority'] }))
    } else if (current.length < 2) {
      setAnswers(prev => ({ ...prev, q7_priority: [...current, id] as QuizAnswers['q7_priority'] }))
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const step = getStep(screen)
  const isQuestion = Q_SCREENS.includes(screen)

  return (
    <div className="min-h-screen bg-verso-paper-deep relative z-[2]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 pt-28 sm:pt-32 pb-24">

        {/* Section head — visível em todas as sub-telas excepto loading */}
        {screen !== 'loading' && (
          <SectionHead
            number="01"
            label="Questionário"
            title={
              <>
                Nove perguntas para{' '}
                <em className="italic text-verso-clay">traçar o teu perfil</em>{' '}
                territorial.
              </>
            }
            lede="Não há respostas certas. Cada escolha ajusta o peso de dez variáveis — desde densidade construída até proximidade a transporte e ruído nocturno."
          />
        )}

        {/* Welcome */}
        {screen === 'welcome' && (
          <WelcomeCard onStart={() => setScreen('q1')} />
        )}

        {/* Loading */}
        {screen === 'loading' && <LoadingCard />}

        {/* Perguntas: progresso + card */}
        {isQuestion && (
          <div className="grid md:grid-cols-[260px_1fr] gap-10 md:gap-16 items-start">

            {/* Progresso — em mobile vai acima, em desktop fica sticky */}
            <div className="order-2 md:order-1">
              <QuizProgress
                currentStep={step}
                totalSteps={9}
                labels={QUESTION_LABELS}
              />
            </div>

            {/* Card da pergunta */}
            <div className="order-1 md:order-2">
              <QuizCard
                screen={screen}
                answers={answers}
                onSelectSingle={selectSingle}
                onToggleMulti={toggleMulti}
                onNext={goForward}
                onPrev={goBack}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
