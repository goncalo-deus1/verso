import { useState, useMemo, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { getActiveProperties } from '../lib/supabase/properties'
import type { PropertyRow } from '../lib/supabase/properties'
import { BlockLabel, Callout, Divider } from '../components/Brand'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const budgetOptions = [
  { label: 'Todos os preços', value: '' },
  { label: 'Até 300k€', value: 'under-300k' },
  { label: '300k€ — 600k€', value: '300k-600k' },
  { label: '600k€ — 1M€', value: '600k-1m' },
  { label: 'Acima de 1M€', value: 'over-1m' },
]

const sortOptions = [
  { label: 'Mais recente', value: 'newest' },
  { label: 'Preço crescente', value: 'price-asc' },
  { label: 'Preço decrescente', value: 'price-desc' },
]

const TYPE_LABEL: Record<string, string> = {
  apartamento: 'Apartamento', moradia: 'Moradia',
  terreno: 'Terreno', comercial: 'Comercial', garagem: 'Garagem',
}

function PropertyCard({ p }: { p: PropertyRow }) {
  const cover = p.images?.[0] ?? null

  return (
    <div style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ aspectRatio: '4/3', background: '#E8E0D0', position: 'relative', overflow: 'hidden' }}>
        {cover ? (
          <img src={cover} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '12px', color: STONE, opacity: 0.4 }}>Sem foto</span>
          </div>
        )}
        {p.typology && (
          <span style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '11px', fontWeight: 700, background: INK, color: 'white', padding: '3px 8px', borderRadius: '4px' }}>
            {p.typology}
          </span>
        )}
        {p.images && p.images.length > 1 && (
          <span style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '11px', background: 'rgba(0,0,0,0.55)', color: 'white', padding: '2px 7px', borderRadius: '4px' }}>
            +{p.images.length - 1} fotos
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ fontSize: '15px', fontWeight: 700, color: INK, margin: 0, lineHeight: 1.3 }}>{p.title}</p>
        <p style={{ fontSize: '12px', color: STONE, margin: 0, fontFamily: 'IBM Plex Mono' }}>
          {TYPE_LABEL[p.property_type] ?? p.property_type}
          {p.sqm ? ` · ${p.sqm} m²` : ''}
          {p.bedrooms ? ` · ${p.bedrooms} qt` : ''}
          {p.municipality ? ` · ${p.municipality}` : ''}
        </p>
        {p.description && (
          <p style={{ fontSize: '13px', color: STONE, margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {p.description}
          </p>
        )}
        <p style={{ fontSize: '18px', fontWeight: 700, color: INK, margin: '4px 0 0', letterSpacing: '-0.4px' }}>
          {p.price.toLocaleString('pt-PT')} €
          {p.price_per_sqm && <span style={{ fontSize: '12px', fontWeight: 400, color: STONE, marginLeft: '6px' }}>{p.price_per_sqm.toLocaleString('pt-PT')} €/m²</span>}
        </p>
      </div>
    </div>
  )
}

export default function PropertyListingPage() {
  const [allProperties, setAllProperties] = useState<PropertyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [budget, setBudget] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')

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
    result.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    return result
  }, [allProperties, budget, bedrooms, sort, search])

  const hasFilters = budget || bedrooms || search

  return (
    <div className="min-h-screen" style={{ background: BONE }}>
      {/* Header */}
      <section style={{ background: INK }} className="pt-32 pb-14 lg:pt-40 lg:pb-16">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <BlockLabel light>Imóveis</BlockLabel>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h1 className="font-display text-white text-4xl lg:text-5xl" style={{ letterSpacing: '-1.5px', lineHeight: '1.1' }}>
              Selecção curada
            </h1>
            <p className="max-w-sm text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Só publicamos o que valeria a pena visitar.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <Callout>
          Cada imóvel na habitta foi avaliado pelo seu mérito real — localização, contexto urbanístico e potencial de valorização.
        </Callout>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-12 pb-20">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="relative flex-1 min-w-64">
            <input
              type="text"
              placeholder="Pesquisar zona, cidade..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 text-sm outline-none"
              style={{ border: `1px solid ${HAIRLINE}`, background: 'white', color: INK, borderRadius: '4px' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={13} style={{ color: STONE }} />
              </button>
            )}
          </div>

          {[
            { value: budget, set: setBudget, options: budgetOptions },
          ].map(({ value, set, options }, i) => (
            <div key={i} className="relative">
              <select value={value} onChange={e => set(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2.5 text-sm outline-none cursor-pointer"
                style={{ border: `1px solid ${HAIRLINE}`, background: value ? BONE : 'white', color: INK, borderRadius: '4px' }}>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: STONE }} />
            </div>
          ))}

          <div className="relative">
            <select value={bedrooms} onChange={e => setBedrooms(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 text-sm outline-none cursor-pointer"
              style={{ border: `1px solid ${HAIRLINE}`, background: bedrooms ? BONE : 'white', color: INK, borderRadius: '4px' }}>
              <option value="">Todos os quartos</option>
              {[1,2,3].map(n => <option key={n} value={n}>{n} quartos</option>)}
              <option value="4">4+ quartos</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: STONE }} />
          </div>

          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 text-sm outline-none cursor-pointer"
              style={{ border: `1px solid ${HAIRLINE}`, background: 'white', color: INK, borderRadius: '4px' }}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: STONE }} />
          </div>

          {hasFilters && (
            <button onClick={() => { setBudget(''); setBedrooms(''); setSearch('') }}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: STONE }}>
              <X size={13} /> Limpar
            </button>
          )}
        </div>

        {/* Count */}
        <p className="text-xs mb-8" style={{ color: STONE, fontFamily: 'IBM Plex Mono' }}>
          {loading ? 'A carregar…' : `${filtered.length} ${filtered.length === 1 ? 'imóvel' : 'imóveis'}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: 'white', border: `1px solid ${HAIRLINE}`, borderRadius: '10px', aspectRatio: '3/4', opacity: 0.4 }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filtered.map(p => <PropertyCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="py-20">
            <Divider />
            <h2 className="font-display text-2xl mb-3" style={{ color: INK }}>Sem resultados</h2>
            <p className="text-sm mb-6" style={{ color: STONE }}>Tente ajustar os filtros.</p>
            <button onClick={() => { setBudget(''); setBedrooms(''); setSearch('') }}
              className="px-6 py-3 text-white text-sm font-medium"
              style={{ background: INK, borderRadius: '50px' }}>
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
