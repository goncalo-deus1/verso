import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Bed, Bath, Maximize2, Zap, Car, Calendar, MapPin, Heart, Share2, Phone, ArrowRight, CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { properties } from '../data/properties'
import PropertyCard from '../components/PropertyCard'
import UrbanPlanningPanel from '../components/UrbanPlanningPanel'
import { SectionNum, Callout, Divider, BlockLabel } from '../components/Brand'

const fmt = (n: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const fmtN = (n: number) => new Intl.NumberFormat('pt-PT').format(n)

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const property = properties.find(p => p.slug === slug)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [saved, setSaved] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F2EDE4' }}>
      <div className="text-center">
        <h1 className="font-display text-3xl mb-4" style={{ color: '#1E1F18' }}>Imóvel não encontrado</h1>
        <Link to="/imoveis" style={{ color: '#C2553A' }}>Voltar aos imóveis</Link>
      </div>
    </div>
  )

  const similar = properties.filter(p => p.id !== property.id && p.municipality === property.municipality).slice(0, 3)
  const costs = { imt: Math.round(property.price * 0.06), stamp: Math.round(property.price * 0.008), notary: 1500, registry: 800 }
  const totalCosts = Object.values(costs).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen" style={{ background: '#F2EDE4' }}>
      {/* Gallery lightbox */}
      {galleryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(10,10,11,0.97)' }} onClick={() => setGalleryOpen(false)}>
          <button onClick={() => setGalleryOpen(false)} className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center text-white" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
            <X size={16} />
          </button>
          <button onClick={e => { e.stopPropagation(); setGalleryIndex(i => (i - 1 + property.images.length) % property.images.length) }}
            className="absolute left-6 w-10 h-10 flex items-center justify-center text-white" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={e => { e.stopPropagation(); setGalleryIndex(i => (i + 1) % property.images.length) }}
            className="absolute right-6 w-10 h-10 flex items-center justify-center text-white" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
            <ChevronRight size={20} />
          </button>
          <img src={property.images[galleryIndex]} alt={property.title}
            className="max-w-5xl max-h-[85vh] w-full h-full object-contain" onClick={e => e.stopPropagation()} />
          <p className="absolute bottom-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'IBM Plex Mono' }}>
            {galleryIndex + 1} / {property.images.length}
          </p>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 pt-24 lg:pt-28 pb-4">
        <Link to="/imoveis" className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-150" style={{ color: '#3A3B2E' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
          onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
          <ArrowLeft size={13} /> Todos os imóveis
        </Link>
      </div>

      {/* Gallery grid */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 mb-10">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden" style={{ height: '480px', borderRadius: '2px' }}>
          <div className="col-span-4 lg:col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
            onClick={() => { setGalleryIndex(0); setGalleryOpen(true) }}>
            <img src={property.images[0]} alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          </div>
          {property.images.slice(1, 4).map((img, i) => (
            <div key={i} className="col-span-2 lg:col-span-1 relative cursor-pointer group overflow-hidden"
              onClick={() => { setGalleryIndex(i + 1); setGalleryOpen(true) }}>
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              {i === 2 && property.images.length > 4 && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,10,11,0.55)' }}>
                  <span className="text-white font-medium text-sm">+{property.images.length - 4} fotos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Left */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={13} style={{ color: '#3A3B2E' }} />
                  <span className="text-xs font-semibold uppercase" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>{property.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSaved(!saved)} className="w-8 h-8 flex items-center justify-center transition-all duration-150" style={{ border: '1px solid rgba(30, 31, 24, 0.125)' }}>
                    <Heart size={14} style={{ color: saved ? '#C2553A' : '#3A3B2E', fill: saved ? '#C2553A' : 'none' }} />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center" style={{ border: '1px solid rgba(30, 31, 24, 0.125)' }}>
                    <Share2 size={14} style={{ color: '#3A3B2E' }} />
                  </button>
                </div>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl mb-5" style={{ color: '#1E1F18', letterSpacing: '-1px', lineHeight: '1.15' }}>
                {property.title}
              </h1>
              {/* Fit score */}
              <div className="inline-flex items-center gap-3 px-5 py-3" style={{ background: '#F2EDE4', border: '1px solid rgba(30, 31, 24, 0.125)' }}>
                <div className="w-9 h-9 flex items-center justify-center text-white font-display font-bold text-lg" style={{ background: '#C2553A' }}>
                  {property.fitScore}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase" style={{ color: '#C2553A', letterSpacing: '1.5px', fontSize: '10px' }}>Score de compatibilidade</p>
                  <p className="text-xs mt-0.5" style={{ color: '#3A3B2E' }}>{property.fitReasons[0]}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Bed size={16} />, label: 'Quartos', value: property.bedrooms },
                { icon: <Bath size={16} />, label: 'WC', value: property.bathrooms },
                { icon: <Maximize2 size={16} />, label: 'Área', value: `${property.sqm} m²` },
                { icon: <Car size={16} />, label: 'Parking', value: property.parkingSpots > 0 ? property.parkingSpots : '—' },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center text-center p-4 bg-white" style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                  <span className="mb-2" style={{ color: '#C2553A' }}>{stat.icon}</span>
                  <p className="font-display text-lg font-medium" style={{ color: '#1E1F18' }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <SectionNum n="01" />
              <h2 className="font-display text-xl mb-4" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>Sobre este imóvel</h2>
              <p className="leading-relaxed" style={{ color: '#3A3B2E' }}>{property.description}</p>
              {property.fitReasons[0] && (
                <Callout>{property.fitReasons[0]}</Callout>
              )}
            </div>

            {/* Highlights */}
            <div>
              <SectionNum n="02" />
              <h2 className="font-display text-xl mb-4" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>Destaques</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={14} style={{ color: '#C2553A', marginTop: '2px', flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: '#3A3B2E' }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div>
              <SectionNum n="03" />
              <h2 className="font-display text-xl mb-4" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>Detalhes</h2>
              <div style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }} className="overflow-hidden bg-white">
                {[
                  ['Tipologia', `T${property.bedrooms}`], ['Área útil', `${property.sqm} m²`],
                  ['Ano de construção', property.yearBuilt], ['Estado', property.condition],
                  ['Cert. energético', property.energyRating], ['Preço/m²', `${fmtN(property.pricePerSqm)} €/m²`],
                ].map(([label, value], idx, arr) => (
                  <div key={String(label)} className="flex items-center justify-between px-5 py-4"
                    style={idx < arr.length - 1 ? { borderBottom: '1px solid #F0EDE8' } : {}}>
                    <span className="text-sm" style={{ color: '#3A3B2E' }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color: '#1E1F18' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Costs */}
            <div>
              <SectionNum n="04" />
              <h2 className="font-display text-xl mb-2" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>Custos de aquisição</h2>
              <p className="text-sm mb-4" style={{ color: '#3A3B2E' }}>Estimativa. Consulte sempre um advogado.</p>
              <div style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }} className="overflow-hidden bg-white">
                {[
                  ['IMT', fmt(costs.imt), '~6%'], ['Imposto de Selo', fmt(costs.stamp), '0.8%'],
                  ['Notário', fmt(costs.notary), 'estimado'], ['Registo', fmt(costs.registry), 'estimado'],
                ].map(([label, value, note]) => (
                  <div key={String(label)} className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F0EDE8' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: '#3A3B2E' }}>{label}</span>
                      <span className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>({note})</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#1E1F18' }}>{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-4" style={{ background: '#F2EDE4', borderTop: '2px solid #1E1F18' }}>
                  <span className="text-sm font-semibold" style={{ color: '#1E1F18' }}>Total custos adicionais</span>
                  <span className="font-display font-medium" style={{ color: '#1E1F18' }}>{fmt(totalCosts)}</span>
                </div>
              </div>
            </div>

            {/* Urban planning */}
            <div>
              <SectionNum n="05" />
              <h2 className="font-display text-xl mb-4" style={{ color: '#1E1F18', letterSpacing: '-0.3px' }}>Contexto urbanístico</h2>
              <UrbanPlanningPanel data={property.urbanPlanning} propertyAddress={property.location} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-4">
              {/* Price */}
              <div className="p-6 bg-white" style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-display text-3xl font-medium" style={{ color: '#1E1F18', letterSpacing: '-1px' }}>{fmt(property.price)}</p>
                    <p className="text-xs mt-1" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>{fmtN(property.pricePerSqm)} €/m²</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1" style={{ background: '#F2EDE4', color: '#C2553A', fontFamily: 'IBM Plex Mono', border: '1px solid rgba(30, 31, 24, 0.125)' }}>
                    {property.fitScore}%
                  </span>
                </div>
                <div style={{ borderTop: '1px solid rgba(30, 31, 24, 0.125)' }} className="mt-5 pt-5 space-y-3">
                  <button onClick={() => setContactOpen(true)}
                    data-contact-trigger
                    className="w-full py-3.5 text-white font-semibold text-sm transition-opacity hover:opacity-85"
                    style={{ background: '#C2553A', borderRadius: '8px' }}>
                    Agendar visita
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all"
                    style={{ border: '1px solid rgba(30, 31, 24, 0.125)', color: '#1E1F18', borderRadius: '8px' }}>
                    <Phone size={14} /> Pedir contacto
                  </button>
                </div>
                <p className="text-xs text-center mt-4" style={{ color: '#3A3B2E' }}>Sem compromisso. Respondemos em 24h.</p>
              </div>

              {/* Fit reasons */}
              <div className="p-5" style={{ background: '#F2EDE4', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                <p className="text-xs font-semibold uppercase mb-3" style={{ color: '#3A3B2E', letterSpacing: '2px', fontFamily: 'IBM Plex Mono' }}>
                  Porque é uma boa opção
                </p>
                <ul className="space-y-2.5">
                  {property.fitReasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: '#3A3B2E' }}>
                      <CheckCircle size={13} style={{ color: '#C2553A', marginTop: '2px', flexShrink: 0 }} /> {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="p-5 bg-white" style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                <p className="text-xs font-semibold uppercase mb-3" style={{ color: '#3A3B2E', letterSpacing: '2px', fontFamily: 'IBM Plex Mono' }}>Características</p>
                <div className="flex flex-wrap gap-2">
                  {[...property.tags, `T${property.bedrooms}`, `${property.sqm}m²`, property.energyRating, property.condition].map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 font-medium uppercase"
                      style={{ background: '#F2EDE4', color: '#3A3B2E', border: '1px solid rgba(30, 31, 24, 0.125)', letterSpacing: '1px', fontSize: '10px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Building */}
              <div className="p-5 bg-white" style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={13} style={{ color: '#3A3B2E' }} />
                  <span className="text-xs font-semibold uppercase" style={{ color: '#3A3B2E', letterSpacing: '2px', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>Edifício</span>
                </div>
                <p className="text-sm" style={{ color: '#3A3B2E' }}>Construído em <strong style={{ color: '#1E1F18' }}>{property.yearBuilt}</strong> · {property.condition}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Zap size={12} style={{ color: '#3A3B2E' }} />
                  <span className="text-sm" style={{ color: '#3A3B2E' }}>Cert. energético <strong style={{ color: '#1E1F18' }}>{property.energyRating}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-20 pb-12">
            <Divider />
            <div className="flex items-end justify-between mb-8">
              <div>
                <BlockLabel>Na mesma zona</BlockLabel>
                <h2 className="font-display text-2xl lg:text-3xl" style={{ color: '#1E1F18', letterSpacing: '-0.5px' }}>Imóveis semelhantes</h2>
              </div>
              <Link to="/imoveis" className="hidden lg:flex items-center gap-2 text-sm font-medium transition-colors duration-150"
                style={{ color: '#3A3B2E' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {similar.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Contact modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: 'rgba(10,10,11,0.6)' }} onClick={() => setContactOpen(false)}>
          <div className="w-full max-w-lg bg-white p-8" style={{ borderRadius: '2px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl" style={{ color: '#1E1F18' }}>Agendar visita</h3>
                <p className="text-sm mt-1" style={{ color: '#3A3B2E' }}>{property.title}</p>
              </div>
              <button onClick={() => setContactOpen(false)} className="w-8 h-8 flex items-center justify-center" style={{ border: '1px solid rgba(30, 31, 24, 0.125)' }}>
                <X size={15} style={{ color: '#3A3B2E' }} />
              </button>
            </div>
            <div className="space-y-3">
              {['O seu nome', 'Telefone', 'Email'].map(ph => (
                <input key={ph} type="text" placeholder={ph}
                  className="w-full px-4 py-3.5 text-sm outline-none"
                  style={{ border: '1px solid rgba(30, 31, 24, 0.125)', color: '#1E1F18', borderRadius: '2px' }} />
              ))}
              <textarea placeholder="Mensagem (opcional)" rows={3}
                className="w-full px-4 py-3.5 text-sm outline-none resize-none"
                style={{ border: '1px solid rgba(30, 31, 24, 0.125)', color: '#1E1F18', borderRadius: '2px' }} />
              <button onClick={() => setContactOpen(false)}
                className="w-full py-4 text-white font-semibold text-sm transition-opacity hover:opacity-85"
                style={{ background: '#C2553A', borderRadius: '8px' }}>
                Enviar pedido de visita
              </button>
              <p className="text-xs text-center" style={{ color: '#3A3B2E' }}>Respondemos em menos de 24h. Sem compromisso.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
