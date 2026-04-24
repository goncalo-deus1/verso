// ─── Habitta Copilot — Shared Types ─────────────────────────────────────────────

export type CopilotContext = 'homepage' | 'property' | 'area'
export type FlowPhase = 'questions' | 'thinking' | 'results'

export interface BuyerProfile {
  intent?: string
  budgetRange?: string
  targetArea?: string
  alternativeArea?: string
  householdType?: string
  commutePreference?: string
  lifestylePreferences?: string[]
  timeline?: string
  financingReady?: string
  budgetFlexibility?: string
  movingTimeline?: string
  propertyFit?: string
}

export interface CopilotMsg {
  id: string
  role: 'assistant' | 'user'
  text: string
  isTyping?: boolean
}

export interface QuickReply {
  label: string
  value: string
  emoji?: string
}

export interface FlowStep {
  id: string
  question: string
  field: keyof BuyerProfile
  type: 'single' | 'multi'
  maxSelect?: number
  replies: QuickReply[]
}

export interface Recommendation {
  id: string
  title: string
  subtitle?: string
  type: 'area' | 'property' | 'comparison'
  score: number
  summary: string
  reasons: string[]
  ctaLabel: string
  ctaHref?: string
  image?: string
}
