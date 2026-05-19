import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronDown, ChevronLeft, ChevronRight, Bed, Bath, Maximize2, MapPin, Heart } from 'lucide-react'
import { getActiveProperties } from '../lib/supabase/properties'
import type { PropertyRow } from '../lib/supabase/properties'
import { useLang, type Lang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const fmt = (n: number, lang: Lang) =>
  new Intl.NumberFormat(lang === 'pt' ? 'pt-PT' : 'en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

// ─── Horizontal property card ─────────────────────────────────────────────────

function PropertyCard({ p }: { p: PropertyRow }) {
  const { lang } = useLang()
  const tr = useT(lang)
  const images = p.images ?? []
  const [idx, setIdx] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [saved, setSaved] = useState(false)

  // Mapeamento dinâmico do property_type para a label traduzida.
  const typeLabel = (type: PropertyRow['property_type']): string => {
    switch (type) {
      case 'apartamento': return tr('props.type.apartamento')
      case 'moradia':     return tr('props.type.moradia')
      case 'terreno':     return tr('props.type.terreno')
      case 'comercial':   return tr('props.type.comercial')
      case 'garagem':     return tr('props.type.garagem')
      default:            return type
    }
  }

  function prev(e: React.MouseEvent) {
    e.preventDefault()
    setIdx(i => (i - 1 + images.length) % images.length)
  }
  function next(e: React.MouseEvent) {
    e.preventDefault()
    setIdx(i => (i + 1) % images.length)
  }

  return (
    <div style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '8px', overflow: 'hidden', display: 'flex', transition: 'box-shadow 200ms' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.09)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>

      {/* Image */}
      <div
        style={{ flexShrink: 0, width: '280px', height: '210px', background: '#E8E0D0', position: 'relative', overflow: 'hidden' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={`/imoveis/${p.id}`} style={{ display: 'block', width: '100%', height: '210px', textDecoration: 'none' }}>
          {images.length > 0 ? (
            <img
              key={idx}
              src={images[idx]}
              alt={p.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 200ms' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', color: STONE, opacity: 0.35 }}>{tr('props.noPhoto')}</span>
            </div>
          )}
        </Link>

        {/* Arrows — only when multiple photos and hovered */}
        {images.length > 1 && hovered && (
          <>
            <button onClick={prev}
              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              <ChevronLeft size={15} color={INK} />
            </button>
            <button onClick={next}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              <ChevronRight size={15} color={INK} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px', zIndex: 2 }}>
            {images.map((_, i) => (
              <div key={i} style={{ width: i === idx ? '16px' : '6px', height: '6px', borderRadius: '3px', background: i === idx ? 'white' : 'rgba(255,255,255,0.5)', transition: 'all 200ms' }} />
            ))}
          </div>
        )}

        {p.typology && (
          <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '11px', fontWeight: 700, background: INK, color: 'white', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px', zIndex: 2 }}>
            {p.typology}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <div>
          {/* Location + save */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={12} color={STONE} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: STONE, fontFamily: 'IBM Plex Mono' }}>{p.location}{p.municipality ? `, ${p.municipality}` : ''}</span>
            </div>
            <button
              onClick={() => setSaved(s => !s)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
              <Heart size={16} style={{ color: saved ? CLAY : HAIRLINE, fill: saved ? CLAY : 'none', transition: 'all 150ms' }} />
            </button>
          </div>

          {/* Title */}
          <Link to={`/imoveis/${p.id}`} style={{ textDecoration: 'none' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: INK, margin: '0 0 10px', lineHeight: 1.3, letterSpacing: '-0.3px' }}
              onMouseEnter={e => (e.currentTarget.style.color = CLAY)}
              onMouseLeave={e => (e.currentTarget.style.color = INK)}>
              {p.title}
            </h2>
          </Link>

          {/* Stats row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {p.typology && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: STONE, background: BONE, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${HAIRLINE}` }}>
                {p.typology}
              </span>
            )}
            <span style={{ fontSize: '12px', color: STONE }}>{typeLabel(p.property_type)}</span>
            {p.bedrooms > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: STONE }}>
                <Bed size={13} /> {p.bedrooms} {p.bedrooms === 1 ? tr('props.bedroomSingular') : tr('props.bedroomPlural')}
              </span>
            )}
            {p.bathrooms > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: STONE }}>
                <Bath size={13} /> {p.bathrooms} WC
              </span>
            )}
            {p.sqm && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: STONE }}>
                <Maximize2 size={13} /> {p.sqm} m²
              </span>
            )}
          </div>

          {/* Description */}
          {p.description && (
            <p style={{ fontSize: '13px', color: STONE, lineHeight: 1.6, margin: 0,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {p.description}
            </p>
          )}
        </div>

        {/* Bottom row: price + CTA */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '22px', fontWeight: 700, color: INK, margin: 0, letterSpacing: '-0.5px' }}>
              {fmt(p.price, lang)}
            </p>
            {p.price_per_sqm && (
              <p style={{ fontSize: '12px', color: STONE, margin: '2px 0 0', fontFamily: 'IBM Plex Mono' }}>
                {p.price_per_sqm.toLocaleString(lang === 'pt' ? 'pt-PT' : 'en-GB')} €/m²
              </p>
            )}
          </div>
          <Link to={`/imoveis/${p.id}`}
            style={{ padding: '9px 20px', background: CLAY, color: 'white', borderRadius: '50px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', transition: 'opacity 150ms', whiteSpace: 'nowrap' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
            {tr('props.viewProperty')}
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Advertise CTA ───────────────────────────────────────────────────────────

function AdvertiseCTA() {
  const { lang } = useLang()
  const tr = useT(lang)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '28px 32px', background: INK, borderRadius: '8px', flexWrap: 'wrap' }}>
      <div>
        <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
          {tr('props.advertise.title')}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          {tr('props.advertise.body')}
        </p>
      </div>
      <Link
        to="/adicionar-imovel"
        style={{ padding: '10px 22px', background: CLAY, color: 'white', borderRadius: '50px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'opacity 150ms', flexShrink: 0 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        {tr('props.advertise.cta')}
      </Link>
    </div>
  )
}

// ─── Filter select ────────────────────────────────────────────────────────────

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ appearance: 'none', padding: '9px 32px 9px 14px', fontSize: '13px', border: `1px solid ${value ? CLAY : HAIRLINE}`, background: value ? 'rgba(194,85,58,0.05)' : 'white', color: value ? CLAY : STONE, borderRadius: '50px', cursor: 'pointer', outline: 'none', fontWeight: value ? 600 : 400 }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={12} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: value ? CLAY : STONE }} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PropertyListingPage() {
  const { lang } = useLang()
  const tr = useT(lang)
  const [allProperties, setAllProperties] = useState<PropertyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [budget, setBudget] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')

  // Opções construídas dentro do componente para reagirem a mudanças de idioma.
  const budgetOptions = [
    { label: tr('props.filter.anyPrice'), value: '' },
    { label: tr('props.filter.under300k'), value: 'under-300k' },
    { label: tr('props.filter.300k600k'), value: '300k-600k' },
    { label: tr('props.filter.600k1m'), value: '600k-1m' },
    { label: tr('props.filter.over1m'), value: 'over-1m' },
  ]

  const sortOptions = [
    { label: tr('props.sort.newest'), value: 'newest' },
    { label: tr('props.sort.priceAsc'), value: 'price-asc' },
    { label: tr('props.sort.priceDesc'), value: 'price-desc' },
  ]

  useEffect(() => {
    getActiveProperties().then(data => {
      setAllProperties(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let result = [...allProperties]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.municipality.toLowerCase().includes(q)
      )
    }
    if (budget) {
      const ranges: Record<string, [number, number]> = {
        'under-300k': [0, 300000], '300k-600k': [300000, 600000],
        '600k-1m': [600000, 1000000], 'over-1m': [1000000, Infinity],
      }
      const [min, max] = ranges[budget] ?? [0, Infinity]
      result = result.filter(p => p.price >= min && p.price <= max)
    }
    if (bedrooms) {
      const n = parseInt(bedrooms)
      result = result.filter(p => n === 4 ? p.bedrooms >= 4 : p.bedrooms === n)
    }
    if (propertyType) {
      result = result.filter(p => p.property_type === propertyType)
    }
    result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    return result
  }, [allProperties, budget, bedrooms, propertyType, sort, search])

  const hasFilters = budget || bedrooms || propertyType || search

  const typeOptions = [
    { label: tr('props.filter.type'), value: '' },
    { label: tr('props.type.apartamento'), value: 'apartamento' },
    { label: tr('props.type.moradia'), value: 'moradia' },
    { label: tr('props.type.terreno'), value: 'terreno' },
    { label: tr('props.type.comercial'), value: 'comercial' },
  ]

  const bedroomOptions = [
    { label: tr('props.filter.rooms'), value: '' },
    { label: 'T0', value: '0' },
    { label: 'T1', value: '1' },
    { label: 'T2', value: '2' },
    { label: 'T3', value: '3' },
    { label: 'T4+', value: '4' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: BONE }}>

      {/* Page header */}
      <div style={{ background: INK, paddingTop: '100px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: CLAY, fontFamily: 'IBM Plex Mono', marginBottom: '8px' }}>
            habitta
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'white', letterSpacing: '-1px', margin: 0, lineHeight: 1.1 }}>
            {tr('props.heading')}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '8px' }}>
            {tr('props.subtitle')}
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div style={{ background: 'white', borderBottom: `1px solid ${HAIRLINE}`, position: 'sticky', top: '64px', zIndex: 40 }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '12px 24px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder={tr('props.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 36px 9px 14px', fontSize: '13px', border: `1px solid ${HAIRLINE}`, borderRadius: '50px', outline: 'none', color: INK, boxSizing: 'border-box' }}
              onFocus={e => (e.currentTarget.style.borderColor = CLAY)}
              onBlur={e => (e.currentTarget.style.borderColor = HAIRLINE)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={13} color={STONE} />
              </button>
            )}
          </div>

          <FilterSelect value={propertyType} onChange={setPropertyType} options={typeOptions} />
          <FilterSelect value={bedrooms} onChange={setBedrooms} options={bedroomOptions} />
          <FilterSelect value={budget} onChange={setBudget} options={budgetOptions} />

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: HAIRLINE }} />

          {/* Sort */}
          <FilterSelect value={sort} onChange={setSort} options={sortOptions} />

          {hasFilters && (
            <button onClick={() => { setBudget(''); setBedrooms(''); setPropertyType(''); setSearch('') }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: CLAY, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              <X size={12} /> {tr('props.clear')}
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px 80px' }}>
        <p style={{ fontSize: '12px', color: STONE, fontFamily: 'IBM Plex Mono', marginBottom: '20px' }}>
          {loading
            ? tr('props.loading')
            : `${filtered.length} ${filtered.length === 1 ? tr('props.countSingular') : tr('props.countPlural')}`}
        </p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '200px', background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '8px', opacity: 0.5 }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filtered.map(p => <PropertyCard key={p.id} p={p} />)}
            <AdvertiseCTA />
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', padding: '60px 0 48px' }}>
              <p style={{ fontSize: '18px', fontWeight: 700, color: INK, marginBottom: '8px' }}>{tr('props.noResults')}</p>
              <p style={{ fontSize: '14px', color: STONE, marginBottom: '24px' }}>{tr('props.tryAdjusting')}</p>
              <button onClick={() => { setBudget(''); setBedrooms(''); setPropertyType(''); setSearch('') }}
                style={{ padding: '10px 24px', background: INK, color: 'white', borderRadius: '50px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                {tr('props.clearFilters')}
              </button>
            </div>
            <AdvertiseCTA />
          </div>
        )}
      </div>
    </div>
  )
}
