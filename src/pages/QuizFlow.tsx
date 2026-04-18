import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { quizQuestions } from '../data/quiz'
import type { QuizAnswers } from '../types'

export default function QuizFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [multiSelected, setMultiSelected] = useState<string[]>([])

  const current = quizQuestions[step]
  const isLast = step === quizQuestions.length - 1
  const progress = ((step + 1) / quizQuestions.length) * 100

  function handleSingle(value: string) {
    setAnswers((prev) => ({ ...prev, [current.field]: value }))
  }

  function handleMultiToggle(value: string) {
    setMultiSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : prev.length >= 3 ? prev : [...prev, value]
    )
  }

  function handleNext() {
    if (current.type === 'multi') setAnswers((prev) => ({ ...prev, priorities: multiSelected }))
    if (isLast) navigate('/areas', { state: { answers: { ...answers, priorities: multiSelected } } })
    else setStep((s) => s + 1)
  }

  const canProceed = current.type === 'multi' ? multiSelected.length > 0 : !!answers[current.field]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F5F0' }}>
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ background: '#E8E4DC' }}>
        <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: '#C45D3E' }} />
      </div>

      {/* Logo */}
      <div className="px-8 lg:px-12 pt-8 pb-0">
        <span className="font-display text-xl" style={{ color: '#0A0A0B', letterSpacing: '-0.5px' }}>VERSO</span>
      </div>

      <div className="flex-1 flex flex-col max-w-xl mx-auto w-full px-8 lg:px-0 pt-12 pb-12">
        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => { if (step === 0) navigate('/'); else setStep((s) => s - 1) }}
            className="w-8 h-8 flex items-center justify-center transition-colors duration-150"
            style={{ border: '1px solid #E8E4DC' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#E8E4DC')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <ArrowLeft size={15} style={{ color: '#5A5A5A' }} />
          </button>
          <span className="text-xs font-medium" style={{ color: '#9A9590', fontFamily: 'IBM Plex Mono' }}>
            {step + 1} / {quizQuestions.length}
          </span>
          <div className="flex items-center gap-1.5 ml-1">
            {quizQuestions.map((_, i) => (
              <div key={i} className="transition-all duration-300" style={{
                height: '3px',
                borderRadius: '1px',
                width: i === step ? '20px' : '6px',
                background: i < step ? '#C45D3E' : i === step ? '#0A0A0B' : '#E8E4DC',
              }} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="flex-1">
          <h1 className="font-display text-3xl lg:text-4xl mb-3" style={{ color: '#0A0A0B', letterSpacing: '-1px', lineHeight: '1.15' }}>
            {current.question}
          </h1>
          {current.subtext && (
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#9A9590' }}>{current.subtext}</p>
          )}
          {current.type === 'multi' && (
            <p className="text-xs mb-8" style={{ color: '#9A9590', fontFamily: 'IBM Plex Mono' }}>
              {multiSelected.length} / 3 seleccionados
            </p>
          )}

          <div className="space-y-2.5">
            {current.options?.map((option) => {
              const isSel = current.type === 'multi' ? multiSelected.includes(option.value) : answers[current.field] === option.value
              const isDisabled = current.type === 'multi' && multiSelected.length >= 3 && !multiSelected.includes(option.value)

              return (
                <button key={option.value}
                  onClick={() => current.type === 'multi' ? handleMultiToggle(option.value) : handleSingle(option.value)}
                  disabled={isDisabled}
                  className="w-full flex items-center gap-4 p-5 text-left transition-all duration-150"
                  style={{
                    border: isSel ? '2px solid #C45D3E' : '2px solid #E8E4DC',
                    background: isSel ? '#FEF3EE' : 'white',
                    opacity: isDisabled ? 0.35 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    borderRadius: '2px',
                  }}>
                  {option.emoji && <span className="text-2xl w-8 text-center flex-shrink-0">{option.emoji}</span>}
                  <span className="font-medium flex-1 text-sm" style={{ color: isSel ? '#C45D3E' : '#0A0A0B' }}>
                    {option.label}
                  </span>
                  {isSel && (
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: '#C45D3E' }}>
                      <Check size={11} color="white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex justify-between items-center">
          <button onClick={() => { if (step === 0) navigate('/'); else setStep((s) => s - 1) }}
            className="flex items-center gap-2 text-sm font-medium transition-colors duration-150"
            style={{ color: '#9A9590' }}>
            <ArrowLeft size={14} /> Voltar
          </button>
          <button onClick={handleNext} disabled={!canProceed}
            className="flex items-center gap-2 px-7 py-3.5 text-white text-sm font-semibold transition-opacity duration-150"
            style={{ background: canProceed ? '#0A0A0B' : '#C9C5BD', cursor: canProceed ? 'pointer' : 'not-allowed', borderRadius: '8px' }}>
            {isLast ? 'Ver resultados' : 'Continuar'}
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
