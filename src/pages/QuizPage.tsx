/**
 * QuizPage.tsx — Quiz Habitta em página completa (layout editorial)
 *
 * Rota: /quiz
 * Layout: SectionHead + progresso lateral sticky + card de pergunta
 * Lógica: 8 perguntas, scoreAnswers → navegação para /quiz/dossier
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { useAuth } from '../context/AuthContext'
import { scoreAnswers } from '../lib/quiz/scoring'
import { questions } from '../lib/quiz/questions'
import type { QuizAnswers } from '../lib/quiz/questions'
import { SectionHead } from '../components/editorial/SectionHead'
import { QuizProgress } from '../components/quiz/QuizProgress'
import QuizInvestorWaitlist from './QuizInvestorWaitlist'
import { QuizConflictModal } from '../components/result/QuizConflictModal'
import { getUserQuiz, upsertUserQuiz } from '../lib/supabase/userQuiz'

// ─── Constantes ──────────────────────────────────────────────────────────────

type Screen = 'welcome' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'investor' | 'loading'

const Q_SCREENS: Screen[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8']
// investor is a non-linear branch — not in SCREEN_ORDER for back/forward
const SCREEN_ORDER: Screen[] = ['welcome', ...Q_SCREENS, 'loading']

const QUESTION_LABELS = [
  'Para quem', 'Comprar ou arrendar', 'Orçamento', 'Trabalho',
  'Deslocação', 'Ambiente', 'Espaço vs. centro', 'Prioridades',
]

// Tags opcionais por opção (acrescentam contexto técnico)
const OPTION_TAGS: Record<string, string> = {
  b1_150: '< 150k', b2_150_250: '150–250k', b3_250_400: '250–400k',
  b4_400_600: '400–600k', b5_600plus: '600k +', b6_undecided: 'A definir',
  r1_600: '< 600 €', r2_600_900: '600–900 €', r3_900_1200: '900–1200 €',
  r4_1200_1600: '1200–1600 €', r5_1600plus: '1600 € +',
  w3_remote: 'Flexível',
  p5_valuation: 'Valorização',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStep(screen: Screen): number {
  return Q_SCREENS.indexOf(screen) + 1  // 0 se não é pergunta
}

function getSelectedSingle(screen: Screen, a: QuizAnswers): string | undefined {
  const map: Partial<Record<Screen, string | undefined>> = {
    q1: a.q1_intent,
    q2: a.q2_ownership,
    q3: a.q3_budget,
    q4: a.q4_work,
    q5: a.q5_routine,
    q6: a.q6_sound,
    q7: a.q7_tradeoff,
  }
  return map[screen]
}

function canAdvance(screen: Screen, a: QuizAnswers): boolean {
  if (screen === 'q3' || screen === 'q8') return true  // opcionais
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
          Onde vais viver decide<br />
          mais do que a{' '}
          <em className="italic text-verso-clay">casa em si</em>.
        </h2>

        <p className="text-[15px] text-verso-midnight-soft leading-[1.65] max-w-[480px] mb-10">
          8 perguntas. 90 segundos. Uma resposta honesta.
          Cada escolha ajusta o peso de dez variáveis — desde densidade construída até
          proximidade a transporte e ruído nocturno.
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
  onToggleQ8: (id: string) => void
  onNext: () => void
  onPrev: () => void
}

function QuizCard({ screen, answers, onSelectSingle, onToggleQ8, onNext, onPrev }: QuizCardProps) {
  const step = getStep(screen)
  if (step === 0) return null

  const isMulti = screen === 'q8'

  // Resolve label and options depending on Q3 context
  let label: string
  let opts: readonly { id: string; label: string; helper?: string }[]

  if (screen === 'q3') {
    const isBuy = answers.q2_ownership !== 'o2_rent'
    label = isBuy ? questions.q3_budget.labelBuy : questions.q3_budget.labelRent
    opts  = isBuy ? questions.q3_budget.optionsBuy : questions.q3_budget.optionsRent
  } else {
    const keyMap: Partial<Record<Screen, keyof typeof questions>> = {
      q1: 'q1_intent', q2: 'q2_ownership', q4: 'q4_work',
      q5: 'q5_routine', q6: 'q6_sound', q7: 'q7_tradeoff', q8: 'q8_priority',
    }
    const qKey = keyMap[screen]
    if (!qKey) return null
    const q = questions[qKey]
    label = 'label' in q ? q.label : ''
    opts  = 'options' in q ? q.options as readonly { id: string; label: string }[] : []
  }

  const selectedSingle = getSelectedSingle(screen, answers)
  const selectedMulti  = (answers.q8_priority ?? []) as string[]
  const advance = canAdvance(screen, answers)
  const eyebrow = QUESTION_LABELS[step - 1]

  // First-option focus
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
          § Pergunta {String(step).padStart(2, '0')} · {eyebrow}
        </p>

        {/* Pergunta */}
        <h3 className="font-display font-normal text-3xl sm:text-[32px] leading-[1.1] tracking-[-0.02em] mb-2 max-w-[500px] text-verso-midnight">
          {label}
        </h3>

        <div className="mb-7" />

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
                onClick={() => isMulti ? onToggleQ8(opt.id) : onSelectSingle(opt.id)}
                aria-pressed={isSelected}
                data-option-id={opt.id}
                className={`group px-5 py-[18px] border text-left text-sm flex flex-col gap-1 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-verso-clay ${
                  isSelected
                    ? 'bg-verso-midnight text-verso-paper border-verso-midnight'
                    : 'border-verso-rule-soft text-verso-midnight hover:border-verso-midnight hover:bg-verso-paper-grain'
                }`}
              >
                <span className="flex justify-between items-center">
                  <span className="leading-snug">{opt.label}</span>
                  {tag && (
                    <span className={`font-mono text-[10px] tracking-[0.1em] uppercase ml-3 shrink-0 ${
                      isSelected ? 'text-verso-clay' : 'text-verso-midnight-soft'
                    }`}>
                      {tag}
                    </span>
                  )}
                </span>
                {opt.helper && (
                  <span className={`text-[12px] italic leading-snug ${isSelected ? 'text-verso-paper/70' : 'text-verso-midnight-soft'}`}>
                    {opt.helper}
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
            {step === 8 ? 'Ver resultado →' : 'Próxima pergunta →'}
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
  const [searchParams] = useSearchParams()
  const isRefazer = searchParams.get('refazer') === 'true'

  const [screen, setScreen] = useState<Screen>('welcome')
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [showRefazerModal, setShowRefazerModal] = useState(false)
  const { setQuizResult, setQuizAnswers } = useQuiz()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Prefill with saved answers when coming from "Refazer o quiz"
  useEffect(() => {
    if (!isRefazer || !user) return
    getUserQuiz(user.id).then(saved => {
      if (saved) {
        setAnswers(saved.answers)
        setScreen('q1')
      }
    }).catch(console.error)
  }, [isRefazer, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Navegação ──────────────────────────────────────────────────────────────

  const goForward = useCallback(() => {
    // Investor branch
    if (screen === 'q1' && answers.q1_intent === 'i4_invest') {
      setScreen('investor')
      return
    }
    const idx = SCREEN_ORDER.indexOf(screen)
    const next = SCREEN_ORDER[idx + 1]
    if (next === 'loading') {
      // Refazer: confirm before overwriting saved quiz
      if (isRefazer && user) {
        setShowRefazerModal(true)
        return
      }
      setScreen('loading')
      setTimeout(() => {
        const res = scoreAnswers(answers)
        setQuizResult(res)
        setQuizAnswers(answers)
        navigate('/quiz/dossier')
      }, 1100)
    } else if (next) {
      setScreen(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [screen, answers, navigate, setQuizResult, setQuizAnswers, isRefazer, user])

  const goBack = useCallback(() => {
    if (screen === 'investor') {
      setScreen('q1')
      return
    }
    const idx = SCREEN_ORDER.indexOf(screen)
    if (idx > 0) {
      setScreen(SCREEN_ORDER[idx - 1])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [screen])

  // ── Refazer confirm modal ──────────────────────────────────────────────────

  async function handleRefazerConfirm() {
    setShowRefazerModal(false)
    setScreen('loading')
    setTimeout(async () => {
      const res = scoreAnswers(answers)
      if (user) await upsertUserQuiz(user.id, answers, res).catch(console.error)
      setQuizResult(res)
      setQuizAnswers(answers)
      navigate('/quiz/dossier')
    }, 1100)
  }

  function handleRefazerCancel() {
    setShowRefazerModal(false)
  }

  // ── Selecção de respostas ──────────────────────────────────────────────────

  function selectSingle(id: string) {
    const map: Partial<Record<Screen, Partial<QuizAnswers>>> = {
      q1: { q1_intent:    id as QuizAnswers['q1_intent'] },
      q2: { q2_ownership: id as QuizAnswers['q2_ownership'], q3_budget: undefined },
      q3: { q3_budget:    id as QuizAnswers['q3_budget'] },
      q4: { q4_work:      id as QuizAnswers['q4_work'] },
      q5: { q5_routine:   id as QuizAnswers['q5_routine'] },
      q6: { q6_sound:     id as QuizAnswers['q6_sound'] },
      q7: { q7_tradeoff:  id as QuizAnswers['q7_tradeoff'] },
    }
    setAnswers(prev => ({ ...prev, ...(map[screen] ?? {}) }))
  }

  // Q8 multi-select: p7_none is mutually exclusive
  function toggleQ8(id: string) {
    const current = (answers.q8_priority ?? []) as string[]

    if (id === 'p7_none') {
      const next = current.includes('p7_none') ? [] : ['p7_none']
      setAnswers(prev => ({ ...prev, q8_priority: next as QuizAnswers['q8_priority'] }))
      return
    }

    const withoutNone = current.filter(v => v !== 'p7_none')
    if (withoutNone.includes(id)) {
      setAnswers(prev => ({ ...prev, q8_priority: withoutNone.filter(v => v !== id) as QuizAnswers['q8_priority'] }))
    } else if (withoutNone.length < 2) {
      setAnswers(prev => ({ ...prev, q8_priority: [...withoutNone, id] as QuizAnswers['q8_priority'] }))
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const step = getStep(screen)
  const isQuestion = Q_SCREENS.includes(screen)

  return (
    <>
    {showRefazerModal && (
      <QuizConflictModal
        variant="refazer"
        onPrimary={handleRefazerConfirm}
        onSecondary={handleRefazerCancel}
      />
    )}
    <div className="min-h-screen bg-verso-paper-deep relative z-[2]">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12 pt-28 sm:pt-32 pb-24">

        {/* Section head — visível em todas as sub-telas excepto loading e investor */}
        {screen !== 'loading' && screen !== 'investor' && (
          <SectionHead
            number="01"
            label="Questionário"
            title={
              <>
                Oito perguntas para{' '}
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

        {/* Investor waitlist */}
        {screen === 'investor' && (
          <div className="max-w-[640px] pt-16">
            <QuizInvestorWaitlist
              onRestartForLiving={() => {
                setAnswers(prev => ({ ...prev, q1_intent: undefined }))
                setScreen('q1')
              }}
            />
          </div>
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
                totalSteps={8}
                labels={QUESTION_LABELS}
              />
            </div>

            {/* Card da pergunta */}
            <div className="order-1 md:order-2">
              <QuizCard
                screen={screen}
                answers={answers}
                onSelectSingle={selectSingle}
                onToggleQ8={toggleQ8}
                onNext={goForward}
                onPrev={goBack}
              />
            </div>

          </div>
        )}

      </div>
    </div>
    </>
  )
}
