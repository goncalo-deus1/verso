// ─── VERSO Copilot — Flow Definitions & Scoring ───────────────────────────────
import type { FlowStep, BuyerProfile, Recommendation } from './types'
import { areas } from '../../data/areas'

// ─── 01 HOMEPAGE FLOW ─────────────────────────────────────────────────────────

export const HOME_INTRO =
  'Olá! Vou ajudar-te a encontrar a zona certa em menos de 2 minutos.'

export const HOME_STEPS: FlowStep[] = [
  {
    id: 'intent',
    question: 'Estás a comprar para viver ou para investir?',
    field: 'intent',
    type: 'single',
    replies: [
      { label: 'Para viver', value: 'own_living', emoji: '🏡' },
      { label: 'Para investir', value: 'investment', emoji: '📈' },
    ],
  },
  {
    id: 'budget',
    question: 'Qual o teu orçamento?',
    field: 'budgetRange',
    type: 'single',
    replies: [
      { label: 'Até 300k€', value: 'under-300k' },
      { label: '300–600k€', value: '300k-600k' },
      { label: '600k€–1M€', value: '600k-1m' },
      { label: 'Acima de 1M€', value: 'over-1m' },
    ],
  },
  {
    id: 'region',
    question: 'Em que região ou cidade preferes?',
    field: 'targetArea',
    type: 'single',
    replies: [
      { label: 'Lisboa', value: 'Lisboa', emoji: '🏛️' },
      { label: 'Porto', value: 'Porto', emoji: '🍷' },
      { label: 'Cascais', value: 'Cascais', emoji: '🌊' },
      { label: 'Alentejo / Sul', value: 'Sul', emoji: '☀️' },
      { label: 'Flexível', value: 'flexible', emoji: '🗺️' },
    ],
  },
  {
    id: 'household',
    question: 'Como é o teu agregado familiar?',
    field: 'householdType',
    type: 'single',
    replies: [
      { label: 'Sozinho/a', value: 'single', emoji: '🧑' },
      { label: 'Casal', value: 'couple', emoji: '👫' },
      { label: 'Família com filhos', value: 'family', emoji: '👨‍👩‍👧' },
      { label: 'Para arrendar', value: 'rental', emoji: '🔑' },
    ],
  },
  {
    id: 'commute',
    question: 'Os transportes públicos são importantes para ti?',
    field: 'commutePreference',
    type: 'single',
    replies: [
      { label: 'Essenciais', value: 'essential', emoji: '🚇' },
      { label: 'Úteis', value: 'useful', emoji: '🚌' },
      { label: 'Não necessito', value: 'no', emoji: '🚗' },
    ],
  },
  {
    id: 'lifestyle',
    question: 'O que mais valorizas? (escolhe até 3)',
    field: 'lifestylePreferences',
    type: 'multi',
    maxSelect: 3,
    replies: [
      { label: 'Silêncio', value: 'quiet', emoji: '🌿' },
      { label: 'Animação', value: 'lively', emoji: '🎭' },
      { label: 'Praia', value: 'beach', emoji: '🏖️' },
      { label: 'Espaços verdes', value: 'green', emoji: '🌳' },
      { label: 'Escolas', value: 'schools', emoji: '🎒' },
      { label: 'Valorização', value: 'capital-gain', emoji: '📊' },
    ],
  },
  {
    id: 'timeline',
    question: 'Qual o teu horizonte de compra?',
    field: 'timeline',
    type: 'single',
    replies: [
      { label: 'Menos de 3 meses', value: 'urgent' },
      { label: '3 a 6 meses', value: 'soon' },
      { label: '6 a 12 meses', value: 'year' },
      { label: 'Só a explorar', value: 'exploring' },
    ],
  },
]

function scoreAreaForHome(area: any, profile: BuyerProfile) {
  let score = 55
  const reasons: string[] = []
  const budgetRanges: Record<string, [number, number]> = {
    'under-300k': [0, 300000], '300k-600k': [300000, 600000],
    '600k-1m': [600000, 1000000], 'over-1m': [1000000, Infinity],
  }
  if (profile.budgetRange) {
    const [lo, hi] = budgetRanges[profile.budgetRange] ?? [0, Infinity]
    if (area.priceRange.min >= lo && area.priceRange.min <= hi) {
      score += 15; reasons.push('Preços alinhados com o teu orçamento')
    } else if (area.priceRange.min < lo) {
      score += 8; reasons.push('Preços abaixo do orçamento — margem para negociar')
    } else {
      score -= 8
    }
  }
  if (profile.targetArea && profile.targetArea !== 'flexible') {
    if (
      area.city.toLowerCase().includes(profile.targetArea.toLowerCase()) ||
      area.name.toLowerCase().includes(profile.targetArea.toLowerCase())
    ) {
      score += 14; reasons.push(`Na região que preferes — ${profile.targetArea}`)
    }
  }
  if (profile.householdType === 'family' && ['Cascais', 'Braga Norte'].includes(area.name)) {
    score += 12; reasons.push('Excelente para famílias — escolas e espaços verdes')
  }
  if (['single', 'couple'].includes(profile.householdType ?? '') && ['Príncipe Real', 'Bonfim', 'Marvila'].includes(area.name)) {
    score += 10; reasons.push('Ideal para perfil urbano e moderno')
  }
  if (profile.householdType === 'rental' && ['Príncipe Real', 'Marvila', 'Bonfim'].includes(area.name)) {
    score += 8; reasons.push('Alta procura de arrendamento')
  }
  if (profile.commutePreference === 'essential' && ['Príncipe Real', 'Bonfim', 'Marvila'].includes(area.name)) {
    score += 10; reasons.push('Excelente rede de metro e transportes')
  }
  if (profile.commutePreference === 'essential' && area.name === 'Cascais') {
    score += 5; reasons.push('Linha de Cascais para Lisboa')
  }
  const prefs = profile.lifestylePreferences ?? []
  if (prefs.includes('beach') && ['Cascais', 'Comporta'].includes(area.name)) { score += 12; reasons.push('Proximidade ao mar') }
  if (prefs.includes('quiet') && ['Cascais', 'Comporta', 'Braga Norte'].includes(area.name)) { score += 8; reasons.push('Zona tranquila') }
  if (prefs.includes('lively') && ['Príncipe Real', 'Bonfim', 'Marvila'].includes(area.name)) { score += 8; reasons.push('Vida urbana activa e cultura') }
  if (prefs.includes('capital-gain') && area.priceChange > 10) { score += 10; reasons.push(`Valorização forte — +${area.priceChange}% no último ano`) }
  if (prefs.includes('schools') && ['Cascais', 'Braga Norte'].includes(area.name)) { score += 6; reasons.push('Boa oferta de escolas e equipamentos') }
  if (profile.intent === 'investment' && ['Marvila', 'Bonfim'].includes(area.name)) { score += 8; reasons.push('Zona emergente com potencial de retorno') }
  return { score: Math.min(Math.max(score, 25), 99), reasons: reasons.slice(0, 3) }
}

export function generateHomeRecs(profile: BuyerProfile): Recommendation[] {
  return areas
    .map(area => {
      const { score, reasons } = scoreAreaForHome(area, profile)
      return {
        id: area.id.toString(),
        title: area.name,
        subtitle: area.city,
        type: 'area' as const,
        score,
        summary: area.shortDescription,
        reasons,
        ctaLabel: 'Explorar zona',
        ctaHref: `/areas/${area.slug}`,
        image: area.image,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

// ─── 02 PROPERTY FIT FLOW ─────────────────────────────────────────────────────

export const PROPERTY_INTRO = (title: string) =>
  `Vou analisar se "${title}" encaixa no teu perfil. Só preciso de algumas respostas rápidas.`

export const PROPERTY_STEPS: FlowStep[] = [
  {
    id: 'intent',
    question: 'Este imóvel é para habitação própria ou investimento?',
    field: 'intent',
    type: 'single',
    replies: [
      { label: 'Habitação própria', value: 'own_living', emoji: '🏡' },
      { label: 'Investimento', value: 'investment', emoji: '📈' },
    ],
  },
  {
    id: 'budget',
    question: 'O preço está dentro do teu orçamento?',
    field: 'budgetFlexibility',
    type: 'single',
    replies: [
      { label: 'Sim, com folga', value: 'comfortable' },
      { label: 'Sim, no limite', value: 'tight' },
      { label: 'Precisaria de negociar', value: 'negotiate' },
      { label: 'Está fora do orçamento', value: 'out' },
    ],
  },
  {
    id: 'timeline',
    question: 'Quando pretendes mudar-te?',
    field: 'movingTimeline',
    type: 'single',
    replies: [
      { label: 'Menos de 3 meses', value: 'urgent', emoji: '🔥' },
      { label: '3 a 6 meses', value: 'soon' },
      { label: '6 a 12 meses', value: 'year' },
      { label: 'Sem pressa definida', value: 'flexible' },
    ],
  },
  {
    id: 'financing',
    question: 'Tens financiamento aprovado ou comprarias a pronto?',
    field: 'financingReady',
    type: 'single',
    replies: [
      { label: 'Crédito aprovado', value: 'approved', emoji: '✅' },
      { label: 'Crédito em processo', value: 'in_progress', emoji: '⏳' },
      { label: 'Ainda não tratei', value: 'no' },
      { label: 'Compra a pronto', value: 'cash', emoji: '💳' },
    ],
  },
  {
    id: 'fit',
    question: 'Este imóvel tem o que procuras?',
    field: 'propertyFit',
    type: 'single',
    replies: [
      { label: 'Sim, quase tudo', value: 'great' },
      { label: 'Falta alguma coisa', value: 'partial' },
      { label: 'Não é bem o que procuro', value: 'low' },
    ],
  },
]

export function generatePropertyFit(profile: BuyerProfile): Recommendation {
  let score = 55
  if (profile.budgetFlexibility === 'comfortable') score += 18
  else if (profile.budgetFlexibility === 'tight') score += 8
  else if (profile.budgetFlexibility === 'negotiate') score -= 3
  else if (profile.budgetFlexibility === 'out') score -= 22
  if (profile.movingTimeline === 'urgent') score += 10
  else if (profile.movingTimeline === 'soon') score += 5
  if (profile.financingReady === 'approved' || profile.financingReady === 'cash') score += 12
  else if (profile.financingReady === 'in_progress') score += 5
  if (profile.propertyFit === 'great') score += 15
  else if (profile.propertyFit === 'partial') score += 5
  else if (profile.propertyFit === 'low') score -= 15

  score = Math.min(Math.max(score, 15), 99)
  const good = score >= 68

  const reasons: string[] = []
  if (profile.budgetFlexibility === 'comfortable') reasons.push('Preço confortavelmente dentro do orçamento')
  if (profile.budgetFlexibility === 'tight') reasons.push('Preço no limite — possível com bom financiamento')
  if (profile.budgetFlexibility === 'out') reasons.push('Preço acima do orçamento indicado')
  if (profile.financingReady === 'approved') reasons.push('Financiamento aprovado — podes avançar imediatamente')
  if (profile.financingReady === 'cash') reasons.push('Compra a pronto — posição forte na negociação')
  if (profile.movingTimeline === 'urgent') reasons.push('Urgência alinhada com disponibilidade do imóvel')
  if (profile.propertyFit === 'great') reasons.push('O imóvel corresponde ao que procuras')
  if (profile.propertyFit === 'partial') reasons.push('O imóvel cobre a maioria dos teus critérios')
  if (profile.propertyFit === 'low') reasons.push('Pode valer a pena explorar alternativas disponíveis')

  return {
    id: 'property-fit',
    title: good ? 'Bom match com o teu perfil' : 'Compatibilidade parcial',
    type: 'property',
    score,
    summary: good
      ? 'Este imóvel alinha-se bem com o que procuras. Recomendamos agendar uma visita.'
      : 'O imóvel tem algumas características que correspondem ao teu perfil. Considera ver alternativas antes de decidir.',
    reasons: reasons.slice(0, 3),
    ctaLabel: good ? 'Agendar visita' : 'Ver alternativas',
    ctaHref: good ? undefined : '/imoveis',
  }
}

// ─── 03 AREA COMPARISON FLOW ──────────────────────────────────────────────────

export const AREA_INTRO = (areaName: string) =>
  `Vou comparar ${areaName} com outra zona — segundo o teu orçamento e estilo de vida.`

export function getAreaSteps(currentAreaSlug: string): FlowStep[] {
  const others = areas.filter(a => a.slug !== currentAreaSlug).slice(0, 5)
  return [
    {
      id: 'compareWith',
      question: 'Com que zona queres comparar?',
      field: 'alternativeArea',
      type: 'single',
      replies: others.map(a => ({ label: a.name, value: a.slug })),
    },
    {
      id: 'budget',
      question: 'Qual o teu orçamento?',
      field: 'budgetRange',
      type: 'single',
      replies: [
        { label: 'Até 300k€', value: 'under-300k' },
        { label: '300–600k€', value: '300k-600k' },
        { label: '600k€–1M€', value: '600k-1m' },
        { label: 'Acima de 1M€', value: 'over-1m' },
      ],
    },
    {
      id: 'profile',
      question: 'Qual o teu perfil de comprador?',
      field: 'householdType',
      type: 'single',
      replies: [
        { label: 'Jovem profissional', value: 'single', emoji: '🧑' },
        { label: 'Casal', value: 'couple', emoji: '👫' },
        { label: 'Família', value: 'family', emoji: '👨‍👩‍👧' },
        { label: 'Investidor', value: 'investor', emoji: '📊' },
      ],
    },
    {
      id: 'commute',
      question: 'Os transportes públicos são importantes?',
      field: 'commutePreference',
      type: 'single',
      replies: [
        { label: 'Essenciais', value: 'essential', emoji: '🚇' },
        { label: 'Úteis', value: 'useful', emoji: '🚌' },
        { label: 'Não necessito', value: 'no', emoji: '🚗' },
      ],
    },
  ]
}

function scoreAreaForComparison(area: any, profile: BuyerProfile) {
  let score = 55
  const reasons: string[] = []
  const budgetRanges: Record<string, [number, number]> = {
    'under-300k': [0, 300000], '300k-600k': [300000, 600000],
    '600k-1m': [600000, 1000000], 'over-1m': [1000000, Infinity],
  }
  if (profile.budgetRange) {
    const [lo, hi] = budgetRanges[profile.budgetRange] ?? [0, Infinity]
    if (area.priceRange.min >= lo && area.priceRange.min <= hi) {
      score += 15; reasons.push('Preços alinhados com o orçamento')
    } else if (area.priceRange.min < lo) {
      score += 7; reasons.push('Preços abaixo do orçamento')
    } else {
      score -= 8; reasons.push('Preços acima do orçamento')
    }
  }
  if (profile.householdType === 'family' && ['Cascais', 'Braga Norte'].includes(area.name)) {
    score += 12; reasons.push('Excelente para famílias')
  }
  if (['single', 'couple'].includes(profile.householdType ?? '') && ['Príncipe Real', 'Bonfim', 'Marvila'].includes(area.name)) {
    score += 10; reasons.push('Vida urbana activa e cultural')
  }
  if (profile.householdType === 'investor') {
    if (area.priceChange > 10) { score += 12; reasons.push(`Valorização — +${area.priceChange}% no último ano`) }
    if (['Marvila', 'Bonfim'].includes(area.name)) { score += 8; reasons.push('Zona emergente — bom potencial de retorno') }
  }
  if (profile.commutePreference === 'essential' && ['Príncipe Real', 'Bonfim', 'Marvila'].includes(area.name)) {
    score += 10; reasons.push('Boa rede de transportes públicos')
  }
  if (profile.commutePreference === 'no' && ['Cascais', 'Comporta'].includes(area.name)) {
    score += 6; reasons.push('Zona calma, adequada a quem tem carro')
  }
  return { score: Math.min(Math.max(score, 25), 99), reasons: reasons.slice(0, 3) }
}

export function generateAreaComparison(profile: BuyerProfile, currentAreaSlug: string): Recommendation[] {
  const area1 = areas.find(a => a.slug === currentAreaSlug) ?? areas[0]
  const area2 = areas.find(a => a.slug === profile.alternativeArea) ?? areas[1]
  return [area1, area2].map(area => {
    const { score, reasons } = scoreAreaForComparison(area, profile)
    return {
      id: area.id.toString(),
      title: area.name,
      subtitle: area.city,
      type: 'comparison' as const,
      score,
      summary: area.shortDescription,
      reasons,
      ctaLabel: `Explorar ${area.name}`,
      ctaHref: `/areas/${area.slug}`,
      image: area.image,
    }
  })
}
