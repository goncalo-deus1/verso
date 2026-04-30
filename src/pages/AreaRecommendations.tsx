import { useState, useMemo, useEffect } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import { MapPin, TrendingUp, ArrowRight, Search, X, Users, ShieldCheck, Building2 } from 'lucide-react'
import { useQuiz } from '../context/QuizContext'
import { areas } from '../data/areas'
import { portugalZones } from '../data/portugal-zones'
import { properties } from '../data/properties'
import { concelhosAML } from '../data/concelhosAML'
import type { QuizAnswers, Area, PortugalZone } from '../types'
import PropertyCard from '../components/PropertyCard'
import { BlockLabel, Callout, SectionNum, Divider } from '../components/Brand'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const crimeColor: Record<string, string> = {
  'baixo': MOSS,
  'médio': '#8B7028',
  'elevado': CLAY,
}

function ZonePanel({ zone, onClose }: { zone: PortugalZone; onClose: () => void }) {
  const aml      = concelhosAML.find(c => c.slug === zone.slug)
  const parishes = aml?.parishes ?? []

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(30, 31, 24,0.5)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(520px, 100vw)',
        background: BONE,
        zIndex: 401,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-16px 0 48px rgba(30, 31, 24,0.18)',
        overflowY: 'auto',
      }}>

        {/* Photo */}
        {aml?.image && (
          <div style={{ position: 'relative', height: '200px', flexShrink: 0, overflow: 'hidden' }}>
            <img
              src={aml.image.replace('w=800', 'w=600')}
              alt={zone.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(30, 31, 24,0.7) 0%, transparent 60%)',
            }} />
            <button
              onClick={onClose}
              aria-label="Fechar"
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(30, 31, 24,0.5)', border: 'none',
                borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff',
              }}
            >
              <X size={16} />
            </button>
            <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '2px',
                color: CLAY, margin: '0 0 4px',
              }}>
                {aml?.margem === 'norte' ? 'Margem Norte' : aml?.margem === 'sul' ? 'Margem Sul' : zone.district}
              </p>
              <h2 className="font-display" style={{ fontSize: '28px', color: BONE, margin: 0, letterSpacing: '-0.5px', fontWeight: 400 }}>
                {zone.name}
              </h2>
            </div>
          </div>
        )}

        {/* No image fallback header */}
        {!aml?.image && (
          <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: CLAY, margin: '0 0 4px' }}>
                {zone.district}
              </p>
              <h2 className="font-display" style={{ fontSize: '28px', color: INK, margin: 0, letterSpacing: '-0.5px', fontWeight: 400 }}>
                {zone.name}
              </h2>
            </div>
            <button onClick={onClose} aria-label="Fechar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: STONE, padding: '4px' }}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* oneLine */}
          {aml?.oneLine && (
            <p style={{ fontSize: '15px', fontStyle: 'italic', color: MOSS, lineHeight: 1.6, margin: 0 }}>
              {aml.oneLine}
            </p>
          )}

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {/* Population */}
            <div style={{ background: SAND, borderRadius: '4px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Users size={14} style={{ color: CLAY }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, margin: 0 }}>
                População
              </p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: INK, margin: 0 }}>
                {aml ? `${(aml.populationApprox / 1000).toFixed(0)}k` : '—'}
              </p>
            </div>

            {/* Crime */}
            <div style={{ background: SAND, borderRadius: '4px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <ShieldCheck size={14} style={{ color: CLAY }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, margin: 0 }}>
                Criminalidade
              </p>
              <p style={{ fontSize: '14px', fontWeight: 600, color: aml ? crimeColor[aml.crimeLevel] : INK, margin: 0, textTransform: 'capitalize' }}>
                {aml?.crimeLevel ?? '—'}
              </p>
            </div>

            {/* T2 rent */}
            <div style={{ background: SAND, borderRadius: '4px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Building2 size={14} style={{ color: CLAY }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, margin: 0 }}>
                T2 / mês
              </p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: INK, margin: 0 }}>
                {aml?.budgetFitT2 ? `${aml.budgetFitT2.min.toLocaleString('pt-PT')}–${aml.budgetFitT2.max.toLocaleString('pt-PT')}€` : '—'}
              </p>
            </div>
          </div>

          {/* Resumo */}
          {aml?.shortDescription && (
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: CLAY, margin: '0 0 8px' }}>
                Resumo
              </p>
              <p style={{ fontSize: '14px', color: INK, lineHeight: 1.7, margin: 0 }}>
                {aml.shortDescription}
              </p>
            </div>
          )}

          {/* Planeamento urbano */}
          {(aml?.urbanPlanning || zone.data.urbanContext) && (
            <div style={{ borderLeft: `3px solid ${CLAY}`, paddingLeft: '16px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: CLAY, margin: '0 0 8px' }}>
                Planeamento urbano
              </p>
              <p style={{ fontSize: '14px', color: INK, lineHeight: 1.7, margin: 0 }}>
                {aml?.urbanPlanning || zone.data.urbanContext}
              </p>
            </div>
          )}

          {/* Who fits */}
          {aml?.whoFitsHere && (
            <div style={{ background: SAND, borderRadius: '4px', padding: '16px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: MOSS, margin: '0 0 6px' }}>
                Quem se adapta
              </p>
              <p style={{ fontSize: '13px', color: INK, lineHeight: 1.6, margin: 0 }}>
                {aml.whoFitsHere}
              </p>
            </div>
          )}

          {/* Freguesias */}
          {parishes.length > 0 && (
            <div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: CLAY, margin: '0 0 10px' }}>
                Freguesias ({parishes.length})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {parishes.map(name => (
                  <span
                    key={name}
                    style={{
                      fontSize: '12px', color: INK,
                      background: SAND, border: `1px solid ${HAIRLINE}`,
                      borderRadius: '2px', padding: '4px 10px',
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <Link
            to={`/concelho/${zone.slug}`}
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '14px 24px',
              background: INK, color: BONE,
              borderRadius: '4px', textDecoration: 'none',
              fontSize: '14px', fontWeight: 600,
              marginTop: 'auto',
            }}
          >
            Ver análise completa de {zone.name} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  )
}

function formatPrice(price: number): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M€`
  return `${(price / 1000).toFixed(0)}k€`
}

function formatSqm(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
  return `${val}`
}

const tierLabel: Record<string, string> = {
  premium: 'Premium',
  activo: 'Activo',
  moderado: 'Moderado',
  escasso: 'Escasso',
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

function scoreArea(area: Area, answers: QuizAnswers): { score: number; reasons: string[] } {
  let score = 60
  const reasons: string[] = []

  const budgetMap: Record<string, [number, number]> = {
    'under-200k': [0, 200000], '200k-400k': [200000, 400000],
    '400k-700k': [400000, 700000], '700k-1.2m': [700000, 1200000], 'over-1.2m': [1200000, Infinity],
  }
  if (answers.budget && budgetMap[answers.budget]) {
    const [min, max] = budgetMap[answers.budget]
    if (area.priceRange.min >= min && area.priceRange.min <= max) { score += 15; reasons.push('Preço médio alinhado com o teu orçamento') }
    else if (area.priceRange.min < min) { score += 10; reasons.push('Preços abaixo do orçamento — margem de negociação') }
  }

  const lifestyleMap: Record<string, string[]> = {
    'urban-vibrant': ['Príncipe Real', 'Bonfim', 'Marvila'],
    'urban-calm': ['Príncipe Real', 'Cascais'],
    coastal: ['Cascais', 'Comporta'],
    suburban: ['Cascais', 'Braga Norte'],
    emerging: ['Marvila', 'Bonfim'],
  }
  if (answers.lifestyle && lifestyleMap[answers.lifestyle]?.includes(area.name)) {
    score += 12; reasons.push('Zona alinhada com o estilo de vida descrito')
  }

  if (['family-young', 'family-teens'].includes(answers.familyStatus ?? '')) {
    if (['Cascais', 'Braga Norte'].includes(area.name)) { score += 10; reasons.push('Excelente para famílias — escolas e espaços verdes') }
  }
  if (['single', 'couple'].includes(answers.familyStatus ?? '')) {
    if (['Bonfim', 'Marvila', 'Príncipe Real'].includes(area.name)) { score += 8; reasons.push('Ideal para o perfil — vida urbana activa') }
  }

  if (answers.commute === 'essential' && ['Príncipe Real', 'Bonfim', 'Marvila'].includes(area.name)) {
    score += 8; reasons.push('Boa rede de metro e transportes públicos')
  }

  if (answers.priorities) {
    if (answers.priorities.includes('capital-gain') && area.priceChange > 10) {
      score += 8; reasons.push(`Valorização forte — +${area.priceChange}% no último ano`)
    }
    if (answers.priorities.includes('beach') && ['Cascais', 'Comporta'].includes(area.name)) {
      score += 10; reasons.push('Proximidade ao mar — uma das tuas prioridades')
    }
    if (answers.priorities.includes('price-value') && area.avgPricePerSqm < 4000) {
      score += 8; reasons.push('Excelente custo por m² — alinhado com as prioridades')
    }
  }

  return { score: Math.min(score, 99), reasons: reasons.slice(0, 3) }
}

function ZoneCard({ zone, onSelect }: { zone: PortugalZone; onSelect: () => void }) {
  const tier   = tierColor[zone.data.marketTier] ?? tierColor.moderado
  const amlImg = concelhosAML.find(c => c.slug === zone.slug)?.image

  return (
    <button
      onClick={onSelect}
      className="group flex gap-4 bg-white overflow-hidden p-4 transition-all duration-200 hover:-translate-y-0.5 w-full text-left"
      style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px', cursor: 'pointer', background: 'white' }}>
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
            {tierLabel[zone.data.marketTier]}
          </span>
        </div>
        <h3 className="font-display text-base transition-colors duration-150 group-hover:text-[#C2553A]" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>
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
          <span style={{ fontSize: '11px', color: '#C2553A', fontWeight: 500 }}>Ver resumo →</span>
        </div>
      </div>
    </button>
  )
}

const ALL_DISTRICTS = 'Todos'

export default function AreaRecommendations() {
  const location = useLocation()
  useParams<{ slug?: string }>()
  const answers = (location.state?.answers || {}) as QuizAnswers
  const hasAnswers = Object.keys(answers).length > 0
const { open: openQuiz } = useQuiz()

  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState(ALL_DISTRICTS)
  const [selectedZone, setSelectedZone] = useState<PortugalZone | null>(null)

  const scoredAreas = areas.map((area) => {
    const { score, reasons } = scoreArea(area, answers)
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
          <BlockLabel light>{hasAnswers ? 'O seu resultado' : 'Explorar zonas'}</BlockLabel>
          <h1 className="font-display text-white text-4xl lg:text-5xl mb-4" style={{ letterSpacing: '-1.5px', lineHeight: '1.1' }}>
            {hasAnswers ? 'As suas zonas recomendadas' : 'Todos os concelhos de Lisboa'}
          </h1>
          {hasAnswers ? (
            <p className="max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Com base no teu perfil, identificámos as zonas que melhor se alinham com o que procuras.
            </p>
          ) : (
            <p className="max-w-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              18 concelhos com dados de mercado, preços por m² e contexto real.
            </p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <Callout>
          A zona certa não é um detalhe — é a decisão mais importante de toda a compra. Escolhe primeiro onde viver, depois o imóvel.
        </Callout>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 pb-16">
        {/* Top matches (quiz results only) */}
        {hasAnswers && (
          <div className="mb-16">
            <SectionNum n="01" />
            <h2 className="font-display text-2xl mb-8" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>
              Top {topAreas.length} correspondências
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {topAreas.map((area, index) => (
                <Link key={area.id} to={`/areas/${area.slug}`}
                  className="group relative bg-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                  style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                  {index === 0 && (
                    <div className="absolute top-4 left-4 z-10 px-2.5 py-1 text-white text-xs font-semibold uppercase"
                      style={{ background: '#C2553A', letterSpacing: '1px', fontSize: '10px' }}>
                      Melhor match
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
                        <p className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>A partir de</p>
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
                Explorar todos os concelhos
              </h2>
            </div>
            {!hasAnswers && (
              <button onClick={() => openQuiz()} className="flex items-center gap-2 text-sm font-medium transition-colors duration-150"
                style={{ color: '#C2553A', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Obter recomendações <ArrowRight size={14} />
              </button>
            )}
          </div>

          {/* Search + District filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#3A3B2E' }} />
              <input
                type="text"
                placeholder="Pesquisar concelho, distrito ou estilo de vida…"
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
            {filtered.length} concelho{filtered.length !== 1 ? 's' : ''}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(zone => (
              <ZoneCard key={zone.slug} zone={zone} onSelect={() => setSelectedZone(zone)} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-sm" style={{ color: '#3A3B2E' }}>Nenhum resultado para "{search}".</p>
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
                <h2 className="font-display text-2xl" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>Imóveis nas tuas zonas</h2>
              </div>
              <Link to="/imoveis" className="hidden lg:flex items-center gap-2 text-sm font-medium transition-colors duration-150"
                style={{ color: '#3A3B2E' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendedProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        )}
      </div>


      {selectedZone && (
        <ZonePanel zone={selectedZone} onClose={() => setSelectedZone(null)} />
      )}
    </div>
  )
}
