import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, X, RotateCcw } from 'lucide-react'

import type { CopilotContext, BuyerProfile, CopilotMsg, Recommendation, FlowStep, FlowPhase } from './types'
import {
  HOME_INTRO, HOME_STEPS, generateHomeRecs,
  PROPERTY_INTRO, PROPERTY_STEPS, generatePropertyFit,
  AREA_INTRO, getAreaSteps, generateAreaComparison,
} from './flows'
import { CopilotMessage } from './CopilotMessage'
import { CopilotProgressBar } from './CopilotProgressBar'
import { CopilotQuickReplies } from './CopilotQuickReplies'
import { CopilotRecommendationCard } from './CopilotRecommendationCard'
import type { Property } from '../../types'

interface CopilotWidgetProps {
  context: CopilotContext
  property?: Property
  areaSlug?: string
  areaName?: string
}

let _id = 0
const uid = () => String(++_id)

export function CopilotWidget({ context, property, areaSlug, areaName }: CopilotWidgetProps) {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<FlowPhase>('questions')
  const [steps, setSteps] = useState<FlowStep[]>([])
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState<BuyerProfile>({})
  const [messages, setMessages] = useState<CopilotMsg[]>([])
  const [multi, setMulti] = useState<string[]>([])
  const [recs, setRecs] = useState<Recommendation[]>([])
  const [inputDisabled, setInputDisabled] = useState(false)
  const [started, setStarted] = useState(false)
  const [triggerVisible, setTriggerVisible] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Show trigger only after scrolling past [data-hide-copilot] sections
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('[data-hide-copilot]'))
    if (targets.length === 0) {
      setTriggerVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some(e => e.isIntersecting)
        setTriggerVisible(!anyVisible)
      },
      { threshold: 0.1 },
    )
    targets.forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, recs])

  const triggerLabel = {
    homepage: 'Encontrar a minha zona',
    property: 'Este imóvel encaixa em mim?',
    area: 'Comparar com outra zona',
  }[context]

  const triggerSubLabel = {
    homepage: 'Qualificação em 2 minutos',
    property: 'Análise de compatibilidade',
    area: 'Comparação personalizada',
  }[context]

  function addMsg(role: 'assistant' | 'user', text: string, delay = 0, typing = false): string {
    const id = uid()
    if (delay === 0) {
      setMessages(prev => [...prev, { id, role, text, isTyping: typing }])
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, { id, role, text, isTyping: typing }])
      }, delay)
    }
    return id
  }

  function replaceMsg(id: string, text: string, delay = 0) {
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text, isTyping: false } : m))
    }, delay)
  }

  function startFlow() {
    let flowSteps: FlowStep[]
    let intro: string

    if (context === 'homepage') {
      flowSteps = HOME_STEPS
      intro = HOME_INTRO
    } else if (context === 'property') {
      flowSteps = PROPERTY_STEPS
      intro = PROPERTY_INTRO(property?.title ?? 'este imóvel')
    } else {
      flowSteps = getAreaSteps(areaSlug ?? '')
      intro = AREA_INTRO(areaName ?? 'esta zona')
    }

    setSteps(flowSteps)
    setStep(0)
    setMessages([])
    setProfile({})
    setMulti([])
    setRecs([])
    setPhase('questions')
    setInputDisabled(false)
    setStarted(true)

    // Intro message
    addMsg('assistant', intro)

    // First question (with small delay for feel)
    const typId = addMsg('assistant', '', 500, true)
    setTimeout(() => {
      replaceMsg(typId, flowSteps[0].question)
    }, 1100)
  }

  function handleOpen() {
    setOpen(true)
    if (!started) startFlow()
  }

  function handleSingleSelect(field: keyof BuyerProfile, value: string, label: string) {
    if (inputDisabled) return
    setInputDisabled(true)

    addMsg('user', label)

    const newProfile: BuyerProfile = { ...profile, [field]: value }
    setProfile(newProfile)

    const nextStep = step + 1
    if (nextStep < steps.length) {
      setStep(nextStep)
      setInputDisabled(false)
      // Typing indicator → question
      const typId = addMsg('assistant', '', 500, true)
      setTimeout(() => {
        replaceMsg(typId, steps[nextStep].question)
        setInputDisabled(false)
      }, 1100)
    } else {
      finishFlow(newProfile)
    }
  }

  function handleMultiConfirm() {
    if (inputDisabled || multi.length === 0) return
    setInputDisabled(true)

    const labels = steps[step].replies
      .filter(r => multi.includes(r.value))
      .map(r => r.label)
      .join(', ')

    addMsg('user', labels)

    const newProfile: BuyerProfile = { ...profile, [steps[step].field]: multi as any }
    setProfile(newProfile)
    setMulti([])

    const nextStep = step + 1
    if (nextStep < steps.length) {
      setStep(nextStep)
      const typId = addMsg('assistant', '', 500, true)
      setTimeout(() => {
        replaceMsg(typId, steps[nextStep].question)
        setInputDisabled(false)
      }, 1100)
    } else {
      finishFlow(newProfile)
    }
  }

  function finishFlow(finalProfile: BuyerProfile) {
    setPhase('thinking')
    setInputDisabled(true)

    const thinkingMsgs = {
      homepage: 'A calcular compatibilidade com as zonas da Habitta...',
      property: 'A avaliar o match com o teu perfil...',
      area: 'A comparar as duas zonas segundo o teu perfil...',
    }

    const typId = addMsg('assistant', '', 500, true)
    setTimeout(() => {
      replaceMsg(typId, thinkingMsgs[context])
    }, 1000)

    setTimeout(() => {
      let recommendations: Recommendation[]
      let resultMsg: string

      if (context === 'homepage') {
        recommendations = generateHomeRecs(finalProfile)
        resultMsg = `Encontrei ${recommendations.length} zonas que se alinham com o teu perfil.`
      } else if (context === 'property') {
        recommendations = [generatePropertyFit(finalProfile)]
        const score = recommendations[0].score
        resultMsg = score >= 70
          ? `Score de compatibilidade: ${score}% — boa correspondência.`
          : `Score de compatibilidade: ${score}% — considera ver alternativas.`
      } else {
        recommendations = generateAreaComparison(finalProfile, areaSlug ?? '')
        resultMsg = 'Aqui está a comparação detalhada entre as duas zonas.'
      }

      setRecs(recommendations)
      setPhase('results')
      addMsg('assistant', resultMsg)
    }, 2600)
  }

  function handleCTA(rec: Recommendation) {
    if (rec.ctaHref) {
      setOpen(false)
      navigate(rec.ctaHref)
    } else if (context === 'property' && rec.score >= 68) {
      // Trigger visit booking — scroll to contact section
      setOpen(false)
      const btn = document.querySelector('[data-contact-trigger]') as HTMLButtonElement | null
      if (btn) btn.click()
    }
  }

  function handleRestart() {
    setStarted(false)
    startFlow()
  }

  const currentStep = steps[step]
  const isMultiStep = currentStep?.type === 'multi'

  return (
    <>
      {/* ─── Trigger button ─────────────────────────────── */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-end group hover:-translate-y-0.5"
        style={{
          filter: 'drop-shadow(0 4px 16px rgba(196,93,62,0.3))',
          opacity: !open && triggerVisible ? 1 : 0,
          transform: !open && triggerVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 300ms ease-out, transform 300ms ease-out',
          pointerEvents: !open && triggerVisible ? 'auto' : 'none',
        }}
        aria-label="Abrir assistente"
      >
        <div
          className="flex items-center gap-2.5 px-4 py-3 text-white font-semibold transition-all duration-200"
          style={{ background: '#C2553A', borderRadius: '8px 8px 0 0', fontFamily: 'Inter, Arial, sans-serif', fontSize: '13px' }}
        >
          <Sparkles size={14} />
          {triggerLabel}
        </div>
        <div
          className="px-3 py-1 text-xs mt-0.5"
          style={{ background: '#1E1F18', color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono', letterSpacing: '0.5px', borderRadius: '0 0 8px 8px' }}
        >
          {triggerSubLabel}
        </div>
      </button>

      {/* ─── Drawer ──────────────────────────────────────── */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-[55] lg:hidden"
            style={{ background: 'rgba(10,10,11,0.45)' }}
            onClick={() => setOpen(false)}
          />

          {/* Panel — mobile: bottom sheet / desktop: right sidebar */}
          <div
            className="fixed z-[60] flex flex-col overflow-hidden
              bottom-0 left-0 right-0 h-[88vh] rounded-t-xl
              lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto lg:w-[420px] lg:h-screen lg:rounded-none"
            style={{ background: 'white', boxShadow: '-8px 0 48px rgba(0,0,0,0.14)' }}
          >
            {/* Desktop override via style tag trick — use Tailwind classes instead */}
            {/* Inner wrapper handles responsive */}
            <div className="flex flex-col h-full">
              {/* ─── Header ─── */}
              <div
                className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                style={{ background: '#1E1F18', borderBottom: 'none' }}
              >
                <div className="flex items-center gap-3">
                  <div style={{ width: '28px', height: '28px', background: '#C2553A', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={13} color="white" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-medium" style={{ color: '#F2EDE4', letterSpacing: '-0.3px' }}>
                      Habitta Copilot
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'IBM Plex Mono' }}>
                      {context === 'homepage' ? 'Descoberta de zonas' : context === 'property' ? 'Análise de imóvel' : 'Comparação de zonas'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {started && phase === 'results' && (
                    <button
                      onClick={handleRestart}
                      className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                      title="Recomeçar"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="w-7 h-7 flex items-center justify-center transition-colors duration-150"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* ─── Progress bar ─── */}
              {phase === 'questions' && steps.length > 0 && (
                <CopilotProgressBar current={step + 1} total={steps.length} />
              )}

              {/* ─── Messages ─── */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-0" style={{ background: '#FDFCFA' }}>
                {messages.map(msg => (
                  <CopilotMessage key={msg.id} msg={msg} />
                ))}

                {/* Recommendation cards */}
                {phase === 'results' && recs.length > 0 && (
                  <div className="mt-4 space-y-0">
                    {recs.map(rec => (
                      <CopilotRecommendationCard key={rec.id} rec={rec} onCTA={handleCTA} />
                    ))}
                    <p className="text-center text-xs pb-2" style={{ color: 'rgba(30, 31, 24, 0.125)', fontFamily: 'IBM Plex Mono' }}>
                      Recomendações Habitta — baseadas no teu perfil
                    </p>
                  </div>
                )}

                <div ref={endRef} />
              </div>

              {/* ─── Quick replies ─── */}
              {phase === 'questions' && currentStep && (
                <div className="flex-shrink-0" style={{ borderTop: '1px solid #F0EDE8', background: 'white' }}>
                  <CopilotQuickReplies
                    replies={currentStep.replies}
                    selected={isMultiStep ? multi : (profile[currentStep.field] as string ? [profile[currentStep.field] as string] : [])}
                    onSelect={(value) => {
                      if (isMultiStep) {
                        setMulti(prev =>
                          prev.includes(value)
                            ? prev.filter(v => v !== value)
                            : prev.length >= (currentStep.maxSelect ?? 3) ? prev : [...prev, value]
                        )
                      } else {
                        const label = currentStep.replies.find(r => r.value === value)?.label ?? value
                        handleSingleSelect(currentStep.field, value, label)
                      }
                    }}
                    type={currentStep.type}
                    maxSelect={currentStep.maxSelect}
                    onConfirm={handleMultiConfirm}
                    disabled={inputDisabled && !isMultiStep}
                  />
                </div>
              )}

              {/* ─── Results footer ─── */}
              {phase === 'results' && (
                <div className="flex-shrink-0 px-5 py-4" style={{ borderTop: '1px solid #F0EDE8', background: 'white' }}>
                  <button
                    onClick={handleRestart}
                    className="w-full py-3 text-sm font-medium transition-colors duration-150"
                    style={{ border: '1px solid rgba(30, 31, 24, 0.125)', color: '#3A3B2E', borderRadius: '8px', background: 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F2EDE4'; e.currentTarget.style.color = '#1E1F18' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3A3B2E' }}
                  >
                    Recomeçar com novo perfil
                  </button>
                </div>
              )}

              {/* Thinking state footer */}
              {phase === 'thinking' && (
                <div className="flex-shrink-0 px-5 py-4 text-center" style={{ borderTop: '1px solid #F0EDE8' }}>
                  <p className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>
                    A calcular compatibilidade...
                  </p>
                </div>
              )}
            </div>
          </div>

          <style>{`
            @keyframes copilot-blink {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </>
      )}
    </>
  )
}
