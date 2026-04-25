import { createContext, useContext, useState } from 'react'
import type { QuizResult } from '../lib/quiz/scoring'
import type { QuizAnswers } from '../lib/quiz/questions'

const RESULT_KEY  = 'habitta_quiz_result'
const ANSWERS_KEY = 'habitta_quiz_answers'

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

interface QuizContextValue {
  isOpen:         boolean
  open:           () => void
  close:          () => void
  quizResult:     QuizResult | null
  setQuizResult:  (r: QuizResult | null) => void
  quizAnswers:    QuizAnswers | null
  setQuizAnswers: (a: QuizAnswers | null) => void
}

const QuizContext = createContext<QuizContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  quizResult: null,
  setQuizResult: () => {},
  quizAnswers: null,
  setQuizAnswers: () => {},
})

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [quizResult,  setQuizResultState]  = useState<QuizResult  | null>(() => loadFromStorage<QuizResult>(RESULT_KEY))
  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswers | null>(() => loadFromStorage<QuizAnswers>(ANSWERS_KEY))

  function setQuizResult(r: QuizResult | null) {
    setQuizResultState(r)
    try {
      if (r) localStorage.setItem(RESULT_KEY, JSON.stringify(r))
      else    localStorage.removeItem(RESULT_KEY)
    } catch { /* localStorage unavailable */ }
  }

  function setQuizAnswers(a: QuizAnswers | null) {
    setQuizAnswersState(a)
    try {
      if (a) localStorage.setItem(ANSWERS_KEY, JSON.stringify(a))
      else    localStorage.removeItem(ANSWERS_KEY)
    } catch { /* localStorage unavailable */ }
  }

  return (
    <QuizContext.Provider value={{
      isOpen,
      open:  () => setIsOpen(true),
      close: () => setIsOpen(false),
      quizResult,
      setQuizResult,
      quizAnswers,
      setQuizAnswers,
    }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  return useContext(QuizContext)
}
