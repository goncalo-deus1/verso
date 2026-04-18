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
}

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
