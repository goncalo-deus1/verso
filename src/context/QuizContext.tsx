import { createContext, useContext, useState } from 'react'
import type { QuizResult } from '../lib/quiz/scoring'

const STORAGE_KEY = 'habitta_quiz_result'

function loadFromStorage(): QuizResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as QuizResult) : null
  } catch {
    return null
  }
}

interface QuizContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  quizResult: QuizResult | null
  setQuizResult: (r: QuizResult | null) => void
}

const QuizContext = createContext<QuizContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
  quizResult: null,
  setQuizResult: () => {},
})

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  // Lazy initializer — reads localStorage once on mount, no flash
  const [quizResult, setQuizResultState] = useState<QuizResult | null>(loadFromStorage)

  function setQuizResult(r: QuizResult | null) {
    setQuizResultState(r)
    try {
      if (r) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(r))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // localStorage unavailable (private browsing, quota exceeded) — state still updates
    }
  }

  return (
    <QuizContext.Provider value={{
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      quizResult,
      setQuizResult,
    }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuiz() {
  return useContext(QuizContext)
}
