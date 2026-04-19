/**
 * QuizContainer
 *
 * Orquestrador principal do quiz. Gere:
 *  - Estado das respostas (PartialQuizAnswers)
 *  - Navegação entre passos
 *  - Validação por passo
 *  - Submit com loading curto antes de navegar para resultados
 *
 * Não tem UI própria além dos sub-componentes — separa lógica de renderização.
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions, TOTAL_STEPS } from '../../quiz/questions'
import type { PartialQuizAnswers, QuizAnswers } from '../../quiz/types'
import ProgressIndicator from './ProgressIndicator'
import QuizStep from './QuizStep'
import QuizNavigation from './QuizNavigation'

const SUBMIT_DELAY_MS = 800

export default function QuizContainer() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex]     = useState(0)          // 0-based index
  const [answers, setAnswers]         = useState<PartialQuizAnswers>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[stepIndex]
  const currentStep     = stepIndex + 1                        // 1-based para display
  const isFirst         = stepIndex === 0
  const isLast          = stepIndex === TOTAL_STEPS - 1
  const selectedValue   = answers[currentQuestion.field] as string | undefined
  const canNext         = !!selectedValue

  // ── Seleccionar uma opção ────────────────────────────────────────────────────
  const handleSelect = useCallback((value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.field]: value }))
  }, [currentQuestion.field])

  // ── Avançar ──────────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (!canNext || isSubmitting) return

    if (isLast) {
      // Último passo: validar que todas as respostas estão preenchidas antes de submeter
      const allAnswered = questions.every(q => !!answers[q.field])
      if (!allAnswered) return

      setIsSubmitting(true)
      setTimeout(() => {
        navigate('/quiz/resultados', {
          state: { answers: answers as QuizAnswers },
        })
      }, SUBMIT_DELAY_MS)
    } else {
      setStepIndex(i => i + 1)
    }
  }, [canNext, isLast, isSubmitting, answers, navigate])

  // ── Recuar ───────────────────────────────────────────────────────────────────
  const handlePrev = useCallback(() => {
    if (isSubmitting) return
    if (isFirst) navigate('/')
    else setStepIndex(i => i - 1)
  }, [isFirst, isSubmitting, navigate])

  // ── Teclado: Enter para avançar ───────────────────────────────────────────
  // (registado no wrapper do container)

  return (
    <div
      className="flex-1 flex flex-col max-w-xl mx-auto w-full px-8 lg:px-0 pt-10 pb-12"
      onKeyDown={e => { if (e.key === 'Enter' && canNext && !isSubmitting) handleNext() }}>

      {/* Progresso */}
      <div className="mb-10">
        <ProgressIndicator current={currentStep} total={TOTAL_STEPS} />
      </div>

      {/* Pergunta actual — key muda para re-montar e limpar hover states */}
      <QuizStep
        key={stepIndex}
        question={currentQuestion}
        selected={selectedValue}
        onSelect={handleSelect}
      />

      {/* Navegação */}
      <QuizNavigation
        onPrev={handlePrev}
        onNext={handleNext}
        canNext={canNext}
        isFirst={isFirst}
        isLast={isLast}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
