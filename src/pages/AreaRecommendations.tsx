import { useState, useMemo } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import { MapPin, TrendingUp, ArrowRight, Search } from 'lucide-react'
import { useQuiz } from '../context/QuizContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { areas } from '../data/areas'
import { portugalZones } from '../data/portugal-zones'
import { properties } from '../data/properties'
import { concelhosAML } from '../data/concelhosAML'
import type { QuizAnswers, Area, PortugalZone } from '../types'
import PropertyCard from '../components/PropertyCard'
import { BlockLabel, Callout, SectionNum, Divider } from '../components/Brand'




function formatPrice(price: number): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M€`
  return `${(price / 1000).toFixed(0)}k€`
}

function formatSqm(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
  return `${val}`
}

const tierColor: Record<string, { bg: string; text: string }> = {
  premium: { bg: '#C2553A', text: '#fff' },
  activo: { bg: '#6B7A5A', text: '#fff' },
  moderado: { bg: '#E8E0D0', text: '#3A3B2E' },
  escasso: { bg: '#F2EDE4', text: '#3A3B2E' },
}

function zoneImage(slug: string): string {
  return `https://picsum.photos/seed/${slug}/320/240`
}

// `tr` é injectado pelo componente pai para que as razões respeitem o idioma activo.
function scoreArea(
  area: Area,
  answers: QuizAnswers,
  tr: (key: 'area.reason.budgetAligned' | 'area.reason.belowBudget' | 'area.reason.lifestyleMatch' | 'area.reason.family' | 'area.reason.urbanLife' | 'area.reason.transit' | 'area.reason.appreciation' | 'area.reason.beach' | 'area.reason.valueForMoney') => string
): { score: number; reasons: string[] } {
  let score = 60
  const reasons: string[] = []

  const budgetMap: Record<string, [number, number]> = {
    'under-200k': [0, 200000], '200k-400k': [200000, 400000],
    '400k-700k': [400000, 700000], '700k-1.2m': [700000, 1200000], 'over-1.2m': [1200000, Infinity],
  }
  if (answers.budget && budgetMap[answers.budget]) {
    const [min, max] = budgetMap[answers.budget]
    if (area.priceRange.min >= min && area.priceRange.min <= max) { score += 15; reasons.push(tr('area.reason.budgetAligned')) }
    else if (area.priceRange.min < min) { score += 10; reasons.push(tr('area.reason.belowBudget')) }
  }

  const lifestyleMap: Record<string, string[]> = {
    'urban-vibrant': ['Príncipe Real', 'Bonfim', 'Marvila'],
    'urban-calm': ['Príncipe Real', 'Cascais'],
    coastal: ['Cascais', 'Comporta'],
    suburban: ['Cascais', 'Braga Norte'],
    emerging: ['Marvila', 'Bonfim'],
  }
  if (answers.lifestyle && lifestyleMap[answers.lifestyle]?.includes(area.name)) {
    score += 12; reasons.push(tr('area.reason.lifestyleMatch'))
  }

  if (['family-young', 'family-teens'].includes(answers.familyStatus ?? '')) {
    if (['Cascais', 'Braga Norte'].includes(area.name)) { score += 10; reasons.push(tr('area.reason.family')) }
  }
  if (['single', 'couple'].includes(answers.familyStatus ?? '')) {
    if (['Bonfim', 'Marvila', 'Príncipe Real'].includes(area.name)) { score += 8; reasons.push(tr('area.reason.urbanLife')) }
  }

  if (answers.commute === 'essential' && ['Príncipe Real', 'Bonfim', 'Marvila'].includes(area.name)) {
    score += 8; reasons.push(tr('area.reason.transit'))
  }

  if (answers.priorities) {
    if (answers.priorities.includes('capital-gain') && area.priceChange > 10) {
      score += 8; reasons.push(tr('area.reason.appreciation').replace('{n}', String(area.priceChange)))
    }
    if (answers.priorities.includes('beach') && ['Cascais', 'Comporta'].includes(area.name)) {
      score += 10; reasons.push(tr('area.reason.beach'))
    }
    if (answers.priorities.includes('price-value') && area.avgPricePerSqm < 4000) {
      score += 8; reasons.push(tr('area.reason.valueForMoney'))
    }
  }

  return { score: Math.min(score, 99), reasons: reasons.slice(0, 3) }
}

function ZoneCard({ zone }: { zone: PortugalZone }) {
  const { lang } = useLang()
  const tr = useT(lang)
  const tier   = tierColor[zone.data.marketTier] ?? tierColor.moderado
  const amlImg = concelhosAML.find(c => c.slug === zone.slug)?.image

  const tierLabelKey = (
    {
      premium:  'area.tier.premium',
      activo:   'area.tier.activo',
      moderado: 'area.tier.moderado',
      escasso:  'area.tier.escasso',
    } as const
  )[zone.data.marketTier as 'premium' | 'activo' | 'moderado' | 'escasso'] ?? 'area.tier.moderado'

  return (
    <Link
      to={`/concelho/${zone.slug}`}
      className="group flex gap-4 bg-white overflow-hidden p-4 transition-all duration-200 hover:-translate-y-0.5 w-full text-left"
      style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px', textDecoration: 'none', display: 'flex' }}>
      <div className="w-20 h-20 overflow-hidden flex-shrink-0" style={{ borderRadius: '2px' }}>
        <img
          src={amlImg ? amlImg.replace('w=800', 'w=160') : zoneImage(zone.slug)}
          alt={zone.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className="text-xs uppercase" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>
            {zone.district}
          </p>
          <span className="text-xs font-semibold px-2 py-0.5 flex-shrink-0" style={{ background: tier.bg, color: tier.text, fontFamily: 'IBM Plex Mono', fontSize: '10px', borderRadius: '2px' }}>
            {tr(tierLabelKey)}
          </span>
        </div>
        <h3 className="font-display text-base transition-colors duration-150 group-hover:text-[#C2553A]" style={{ color: '#1E1F18', letterSpacing: '-0.3px', margin: 0 }}>
          {zone.name}
        </h3>
        <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
          {zone.data.lifestyle.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-1.5 py-0.5" style={{ background: '#F2EDE4', color: '#3A3B2E', borderRadius: '2px', fontSize: '10px' }}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>
            {formatSqm(zone.data.pricePerSqm.min)}€ — {formatSqm(zone.data.pricePerSqm.max)}€/m²
          </div>
          <span style={{ fontSize: '11px', color: '#C2553A', fontWeight: 500 }}>{tr('area.viewAnalysis')}</span>
        </div>
      </div>
    </Link>
  )
}

export default function AreaRecommendations() {
  const location = useLocation()
  useParams<{ slug?: string }>()
  const answers = (location.state?.answers || {}) as QuizAnswers
  const hasAnswers = Object.keys(answers).length > 0
  const { open: openQuiz } = useQuiz()
  const { lang } = useLang()
  const tr = useT(lang)

  const ALL_DISTRICTS = tr('area.allDistricts')

  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState(ALL_DISTRICTS)

  const scoredAreas = areas.map((area) => {
    const { score, reasons } = scoreArea(area, answers, tr)
    return { ...area, matchScore: score, matchReasons: reasons }
  }).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))

  const topAreas = scoredAreas.slice(0, 3)
  const topAreaNames = topAreas.map((a) => a.name)
  const recommendedProperties = properties.filter((p) => topAreaNames.includes(p.area)).slice(0, 3)

  const districts = useMemo(() => {
    const d = Array.from(new Set(portugalZones.map(z => z.district))).sort()
    return [ALL_DISTRICTS, ...d]
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return portugalZones.filter(z => {
      const matchDistrict = district === ALL_DISTRICTS || z.district === district
      const matchSearch = !q || z.name.toLowerCase().includes(q) || z.district.toLowerCase().includes(q) || z.data.lifestyle.some(l => l.toLowerCase().includes(q))
      return matchDistrict && matchSearch
    })
  }, [search, district])

  return (
    <div className="min-h-screen" style={{ background: '#F2EDE4' }}>
      {/* Hero */}
      <section style={{ background: '#1E1F18' }} className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <BlockLabel light>{hasAnswers ? tr('area.eyebrowResult') : tr('area.eyebrowExplore')}</BlockLabel>
          <h1 className="font-display text-white text-4xl lg:text-5xl mb-4" style={{ letterSpacing: '-1.5px', lineHeight: '1.1' }}>
            {hasAnswers ? tr('area.titleResult') : tr('area.titleAll')}
          </h1>
          <p className="max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {hasAnswers ? tr('area.subResult') : tr('area.subAll')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <Callout>
          {tr('area.callout')}
        </Callout>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 pb-16">
        {/* Top matches (quiz results only) */}
        {hasAnswers && (
          <div className="mb-16">
            <SectionNum n="01" />
            <h2 className="font-display text-2xl mb-8" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>
              {tr('area.topMatches').replace('{n}', String(topAreas.length))}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {topAreas.map((area, index) => (
                <Link key={area.id} to={`/areas/${area.slug}`}
                  className="group relative bg-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                  style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                  {index === 0 && (
                    <div className="absolute top-4 left-4 z-10 px-2.5 py-1 text-white text-xs font-semibold uppercase"
                      style={{ background: '#C2553A', letterSpacing: '1px', fontSize: '10px' }}>
                      {tr('area.bestMatch')}
                    </div>
                  )}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={area.image} alt={area.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.6), transparent)' }} />
                    <div className="absolute bottom-3 right-4">
                      <span className="font-display text-white text-2xl font-medium" style={{ letterSpacing: '-1px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                        {area.matchScore}%
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={12} style={{ color: '#3A3B2E' }} />
                      <span className="text-xs uppercase" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>{area.city}</span>
                    </div>
                    <h3 className="font-display text-xl mb-3 transition-colors duration-150 group-hover:text-[#C2553A]" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>
                      {area.name}
                    </h3>
                    <ul className="space-y-2 mb-4">
                      {(area.matchReasons ?? []).map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#3A3B2E' }}>
                          <span className="w-1 h-1 mt-2 flex-shrink-0" style={{ background: '#C2553A', borderRadius: '50%' }} />
                          {r}
                        </li>
                      ))}
                    </ul>
                    <div style={{ borderTop: '1px solid rgba(30, 31, 24, 0.125)' }} className="pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>{tr('area.from')}</p>
                        <p className="font-display font-medium" style={{ color: '#1E1F18' }}>{formatPrice(area.priceRange.min)}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#6B7A5A' }}>
                        <TrendingUp size={13} /> +{area.priceChange}%
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Portugal zones database */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              {hasAnswers && <SectionNum n="02" />}
              <h2 className="font-display text-2xl" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>
                {tr('area.exploreAll')}
              </h2>
            </div>
            {!hasAnswers && (
              <button onClick={() => openQuiz()} className="flex items-center gap-2 text-sm font-medium transition-colors duration-150"
                style={{ color: '#C2553A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {tr('area.getRecommendations')} <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Search + District filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#3A3B2E' }} />
              <input
                type="text"
                placeholder={tr('area.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm outline-none"
                style={{ background: '#fff', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px', color: '#1E1F18', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="py-2.5 px-3 text-sm outline-none"
              style={{ background: '#fff', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px', color: '#1E1F18', fontFamily: 'IBM Plex Mono', fontSize: '12px', minWidth: '180px' }}>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Count */}
          <p className="text-xs mb-4" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>
            {(filtered.length === 1 ? tr('area.countSingular') : tr('area.countPlural')).replace('{n}', String(filtered.length))}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(zone => (
              <ZoneCard key={zone.slug} zone={zone} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm" style={{ color: '#3A3B2E' }}>{tr('area.noResults').replace('{q}', search)}</p>
            </div>
          )}
        </div>

        {/* Recommended properties */}
        {hasAnswers && recommendedProperties.length > 0 && (
          <div className="mt-20">
            <Divider />
            <div className="flex items-end justify-between mb-8">
              <div>
                <SectionNum n="03" />
                <h2 className="font-display text-2xl" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>{tr('area.propsInZones')}</h2>
              </div>
              <Link to="/imoveis" className="hidden lg:flex items-center gap-2 text-sm font-medium transition-colors duration-150"
                style={{ color: '#3A3B2E' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
                {tr('area.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendedProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        )}
      </div>


    </div>
  )
}
