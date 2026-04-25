import { useState, useMemo } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { properties } from '../data/properties'
import PropertyCard from '../components/PropertyCard'
import { BlockLabel, Callout, Divider } from '../components/Brand'

const budgetOptions = [
  { label: 'Todos os preços', value: '' },
  { label: 'Até 300k€', value: 'under-300k' },
  { label: '300k€ — 600k€', value: '300k-600k' },
  { label: '600k€ — 1M€', value: '600k-1m' },
  { label: 'Acima de 1M€', value: 'over-1m' },
]

const sortOptions = [
  { label: 'Melhor match', value: 'match' },
  { label: 'Preço crescente', value: 'price-asc' },
  { label: 'Preço decrescente', value: 'price-desc' },
  { label: 'Mais recente', value: 'newest' },
]

export default function PropertyListingPage() {
  const [budget, setBudget] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [sort, setSort] = useState('match')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = [...properties]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.area.toLowerCase().includes(q))
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
      if (sort === 'match') return b.fitScore - a.fitScore
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return b.yearBuilt - a.yearBuilt
    })
    return result
  }, [budget, bedrooms, sort, search])

  const hasFilters = budget || bedrooms || search

  return (
    <div className="min-h-screen" style={{ background: '#F2EDE4' }}>
      {/* Header */}
      <section style={{ background: '#1E1F18' }} className="pt-32 pb-14 lg:pt-40 lg:pb-16">
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

      <div className="max-w-7xl mx-auto px-8 lg:px-12 pb-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <input type="text" placeholder="Pesquisar zona, cidade..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 text-sm outline-none"
              style={{ border: '1px solid rgba(30, 31, 24, 0.125)', background: 'white', color: '#1E1F18', borderRadius: '2px' }} />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={13} style={{ color: '#3A3B2E' }} /></button>}
          </div>

          {/* Budget */}
          <div className="relative">
            <select value={budget} onChange={e => setBudget(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 text-sm outline-none cursor-pointer"
              style={{ border: '1px solid rgba(30, 31, 24, 0.125)', background: budget ? '#F2EDE4' : 'white', color: '#1E1F18', borderRadius: '2px' }}>
              {budgetOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#3A3B2E' }} />
          </div>

          {/* Bedrooms */}
          <div className="relative">
            <select value={bedrooms} onChange={e => setBedrooms(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 text-sm outline-none cursor-pointer"
              style={{ border: '1px solid rgba(30, 31, 24, 0.125)', background: bedrooms ? '#F2EDE4' : 'white', color: '#1E1F18', borderRadius: '2px' }}>
              <option value="">Todos os quartos</option>
              {[1,2,3].map(n => <option key={n} value={n}>{n} quartos</option>)}
              <option value="4">4+ quartos</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#3A3B2E' }} />
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 text-sm outline-none cursor-pointer"
              style={{ border: '1px solid rgba(30, 31, 24, 0.125)', background: 'white', color: '#1E1F18', borderRadius: '2px' }}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#3A3B2E' }} />
          </div>

          {hasFilters && (
            <button onClick={() => { setBudget(''); setBedrooms(''); setSearch('') }}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-150"
              style={{ color: '#3A3B2E' }}>
              <X size={13} /> Limpar
            </button>
          )}
        </div>

        {/* Count */}
        <p className="text-xs mb-8" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>
          {filtered.length} {filtered.length === 1 ? 'imóvel' : 'imóveis'}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        ) : (
          <div className="py-20">
            <Divider />
            <h2 className="font-display text-2xl mb-3" style={{ color: '#1E1F18' }}>Sem resultados</h2>
            <p className="text-sm mb-6" style={{ color: '#3A3B2E' }}>Tente ajustar os filtros ou explore todas as zonas.</p>
            <button onClick={() => { setBudget(''); setBedrooms(''); setSearch('') }}
              className="px-6 py-3 text-white text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: '#1E1F18', borderRadius: '8px' }}>
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
