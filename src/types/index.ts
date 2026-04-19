export interface Property {
  id: string
  title: string
  slug: string
  location: string
  municipality: string
  area: string
  price: number
  pricePerSqm: number
  bedrooms: number
  bathrooms: number
  sqm: number
  image: string
  images: string[]
  tags: string[]
  fitScore: number
  fitReasons: string[]
  description: string
  highlights: string[]
  yearBuilt: number
  condition: string
  energyRating: string
  parkingSpots: number
  isFeatured: boolean
  urbanPlanning: UrbanPlanningData
}

export interface UrbanPlanningData {
  municipality: string
  pdmStatus: string
  pdmRevisionInProgress: boolean
  planningNotes: string[]
  nearbyProjects: string[]
  officialSourceUrl: string
  disclaimer: string
}

export interface Area {
  id: string
  name: string
  city: string
  slug: string
  image: string
  description: string
  shortDescription: string
  priceRange: { min: number; max: number }
  tags: string[]
  highlights: string[]
  commute: string
  vibe: string
  populationTrend: string
  avgPricePerSqm: number
  priceChange: number
  matchScore?: number
  matchReasons?: string[]
}

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'lead'; text: string }
  | { type: 'callout'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'zone'; name: string; price: string; for: string; vibe: string; future: string; watch: string }
  | { type: 'divider' }
  | { type: 'cta'; heading: string; body: string; label: string; href: string }

export interface Editorial {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  image: string
  readTime: number
  date: string
  author: string
  content?: ContentBlock[]
}

export type MarketTier = 'premium' | 'activo' | 'moderado' | 'escasso'
export type Region = 'Norte' | 'Centro' | 'Lisboa e Vale do Tejo' | 'Alentejo' | 'Algarve' | 'Açores' | 'Madeira'

export interface PortugalZone {
  name: string
  district: string
  region: Region
  slug: string
  imageSearchQueries: string[]
  heroImageDescription: string
  supportingImages: string[]
  data: {
    description: string
    pricePerSqm: { min: number; max: number }
    marketTier: MarketTier
    lifestyle: string[]
    connectivity: string
    urbanContext: string
    whoFor: string
  }
  trustElements: string[]
}

// ─── Quiz Engine ──────────────────────────────────────────────────────────────

export interface ZoneScore {
  zone: PortugalZone
  score: number        // 0–100 weighted score
  reasons: string[]    // "Porquê" — positives matched to answers
  tradeOffs: string[]  // Honest trade-offs for this zone
  hardFiltered: boolean // true = eliminated by a hard filter (budget, region)
}

export interface QuizResult {
  top: ZoneScore[]     // Top N zones (default 3)
  all: ZoneScore[]     // All zones, scored and sorted descending
  answers: QuizAnswers
}

// ─── Quiz Input ───────────────────────────────────────────────────────────────

export interface QuizAnswers {
  budget?: string
  area?: string
  lifestyle?: string
  commute?: string
  size?: string
  familyStatus?: string
  purpose?: string
  priorities?: string[]
}

export interface QuizQuestion {
  id: string
  step: number
  question: string
  subtext?: string
  type: 'single' | 'multi' | 'range'
  options?: { value: string; label: string; emoji?: string }[]
  field: keyof QuizAnswers
}
