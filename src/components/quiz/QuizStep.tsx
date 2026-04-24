/**
 * QuizStep
 *
 * Renderiza uma pergunta com as suas opções.
 * Sem estado próprio — recebe a pergunta, o valor seleccionado e um callback.
 *
 * Acessibilidade: cada opção é um <button> real com focus-visible.
 */

import { Check } from 'lucide-react'
import type { QuizQuestionDef } from '../../quiz/questions'

interface Props {
  question: QuizQuestionDef
  selected: string | undefined
  onSelect: (value: string) => void
}

export default function QuizStep({ question, selected, onSelect }: Props) {
  return (
    <div className="flex-1">
      {/* Enunciado */}
      <h1
        className="font-display text-3xl lg:text-4xl mb-3"
        style={{ color: '#1E1F18', letterSpacing: '-1px', lineHeight: '1.15' }}>
        {question.question}
      </h1>

      {question.subtext && (
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: '#3A3B2E' }}>
          {question.subtext}
        </p>
      )}

      {!question.subtext && <div className="mb-8" />}

      {/* Opções */}
      <div className="space-y-2.5">
        {question.options.map((option) => {
          const isSel = selected === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="w-full flex items-center gap-4 p-5 text-left transition-all duration-150 focus-visible:outline-none"
              style={{
                border: isSel ? '2px solid #C2553A' : '2px solid rgba(30, 31, 24, 0.125)',
                background: isSel ? '#FEF3EE' : '#ffffff',
                borderRadius: '2px',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                if (!isSel) (e.currentTarget as HTMLElement).style.borderColor = '#3A3B2E'
              }}
              onMouseLeave={e => {
                if (!isSel) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(30, 31, 24, 0.125)'
              }}>

              {/* Label */}
              <span
                className="font-medium flex-1 text-sm"
                style={{ color: isSel ? '#C2553A' : '#1E1F18' }}>
                {option.label}
              </span>

              {/* Check mark */}
              {isSel ? (
                <div
                  className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                  style={{ background: '#C2553A' }}>
                  <Check size={11} color="white" strokeWidth={3} />
                </div>
              ) : (
                <div
                  className="w-5 h-5 flex-shrink-0"
                  style={{ border: '1.5px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
