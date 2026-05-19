import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Bed, Bath, Maximize2, Zap, Car, Calendar,
  Share2, CheckCircle, ChevronLeft, ChevronRight, X,
  MapPin,
} from 'lucide-react'
import { getPropertyById } from '../lib/supabase/properties'
import type { PropertyRow } from '../lib/supabase/properties'
import { SectionNum, Callout, Divider, BlockLabel } from '../components/Brand'
import ContactSellerButton from '../components/property/ContactSellerButton'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const fmt  = (n: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const fmtN = (n: number) => new Intl.NumberFormat('pt-PT').format(n)

const CONDITION_LABEL: Record<string, string> = {
  novo: 'Novo', usado: 'Usado', para_recuperar: 'Para recuperar', em_construcao: 'Em construção',
}
const TYPE_LABEL: Record<string, string> = {
  apartamento: 'Apartamento', moradia: 'Moradia',
  terreno: 'Terreno', comercial: 'Comercial', garagem: 'Garagem',
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<PropertyRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    getPropertyById(id).then(data => {
      setProperty(data)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BONE }}>
      <div style={{ width: '20px', height: '20px', border: `2px solid ${HAIRLINE}`, borderTopColor: CLAY, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!property) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BONE }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="font-display text-3xl mb-4" style={{ color: INK }}>Imóvel não encontrado</h1>
        <Link to="/imoveis" style={{ color: CLAY }}>Voltar aos imóveis</Link>
      </div>
    </div>
  )

  const images = property.images ?? []
  const costs = {
    imt: Math.round(property.price * 0.06),
    stamp: Math.round(property.price * 0.008),
    notary: 1500,
    registry: 800,
  }
  const totalCosts = Object.values(costs).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen" style={{ background: BONE }}>

      {/* Gallery lightbox */}
      {galleryOpen && images.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(10,10,11,0.97)' }}
          onClick={() => setGalleryOpen(false)}>
          <button onClick={() => setGalleryOpen(false)}
            className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center text-white"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
            <X size={16} />
          </button>
          {images.length > 1 && <>
            <button onClick={e => { e.stopPropagation(); setGalleryIndex(i => (i - 1 + images.length) % images.length) }}
              className="absolute left-6 w-10 h-10 flex items-center justify-center text-white"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={e => { e.stopPropagation(); setGalleryIndex(i => (i + 1) % images.length) }}
              className="absolute right-6 w-10 h-10 flex items-center justify-center text-white"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              <ChevronRight size={20} />
            </button>
          </>}
          <img src={images[galleryIndex]} alt={property.title}
            className="max-w-5xl max-h-[85vh] w-full h-full object-contain"
            onClick={e => e.stopPropagation()} />
          <p className="absolute bottom-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'IBM Plex Mono' }}>
            {galleryIndex + 1} / {images.length}
          </p>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 pt-24 lg:pt-28 pb-4">
        <Link to="/imoveis"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-150"
          style={{ color: STONE }}
          onMouseEnter={e => (e.currentTarget.style.color = CLAY)}
          onMouseLeave={e => (e.currentTarget.style.color = STONE)}>
          <ArrowLeft size={13} /> Todos os imóveis
        </Link>
      </div>

      {/* Gallery grid */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 mb-10">
        {images.length > 0 ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden" style={{ height: '480px', borderRadius: '6px' }}>
            <div className="col-span-4 lg:col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
              onClick={() => { setGalleryIndex(0); setGalleryOpen(true) }}>
              <img src={images[0]} alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
            {images.slice(1, 5).map((img, i) => (
              <div key={i} className="col-span-2 lg:col-span-1 relative cursor-pointer group overflow-hidden"
                onClick={() => { setGalleryIndex(i + 1); setGalleryOpen(true) }}>
                <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                {i === 3 && images.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(10,10,11,0.55)' }}>
                    <span className="text-white font-medium text-sm">+{images.length - 5} fotos</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ height: '320px', background: '#E8E0D0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '14px', color: STONE, opacity: 0.4 }}>Sem fotografias</span>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-10">

            {/* Title block */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={13} style={{ color: STONE }} />
                  <span className="text-xs font-semibold uppercase" style={{ color: STONE, fontFamily: 'IBM Plex Mono', letterSpacing: '1.5px', fontSize: '10px' }}>
                    {property.location}
                  </span>
                </div>
                <button className="w-8 h-8 flex items-center justify-center transition-all" style={{ border: `1px solid ${HAIRLINE}` }}>
                  <Share2 size={14} style={{ color: STONE }} />
                </button>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl mb-3" style={{ color: INK, letterSpacing: '-1px', lineHeight: '1.15' }}>
                {property.title}
              </h1>
              <p style={{ fontSize: '13px', color: STONE, fontFamily: 'IBM Plex Mono' }}>
                {TYPE_LABEL[property.property_type] ?? property.property_type}
                {property.typology ? ` · ${property.typology}` : ''}
                {property.municipality ? ` · ${property.municipality}` : ''}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <Bed size={16} />, label: 'Quartos', value: property.bedrooms || '—' },
                { icon: <Bath size={16} />, label: 'WC', value: property.bathrooms || '—' },
                { icon: <Maximize2 size={16} />, label: 'Área', value: property.sqm ? `${property.sqm} m²` : '—' },
                { icon: <Car size={16} />, label: 'Parking', value: property.parking_spots > 0 ? property.parking_spots : '—' },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center text-center p-4 bg-white"
                  style={{ border: `1px solid ${HAIRLINE}`, borderRadius: '6px' }}>
                  <span className="mb-2" style={{ color: CLAY }}>{stat.icon}</span>
                  <p className="font-display text-lg font-medium" style={{ color: INK }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: STONE, fontFamily: 'IBM Plex Mono' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <SectionNum n="01" />
                <h2 className="font-display text-xl mb-4" style={{ color: INK, letterSpacing: '-0.3px' }}>Sobre este imóvel</h2>
                <p className="leading-relaxed" style={{ color: STONE }}>{property.description}</p>
              </div>
            )}

            {/* Highlights */}
            {property.highlights && property.highlights.length > 0 && (
              <div>
                <SectionNum n="02" />
                <h2 className="font-display text-xl mb-4" style={{ color: INK, letterSpacing: '-0.3px' }}>Destaques</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={14} style={{ color: CLAY, marginTop: '2px', flexShrink: 0 }} />
                      <span className="text-sm" style={{ color: STONE }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details table */}
            <div>
              <SectionNum n="03" />
              <h2 className="font-display text-xl mb-4" style={{ color: INK, letterSpacing: '-0.3px' }}>Detalhes</h2>
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: '6px' }} className="overflow-hidden bg-white">
                {([
                  ['Tipologia', property.typology],
                  ['Área útil', property.sqm ? `${property.sqm} m²` : null],
                  ['Ano de construção', property.year_built],
                  ['Estado', property.condition ? CONDITION_LABEL[property.condition] : null],
                  ['Cert. energético', property.energy_rating],
                  ['Preço/m²', property.price_per_sqm ? `${fmtN(property.price_per_sqm)} €/m²` : null],
                  ['Orientação', property.orientation],
                  ['Condomínio', property.condominium_fee ? `${fmtN(property.condominium_fee)} €/mês` : null],
                ] as [string, string | number | null][]).filter(([, v]) => v != null).map(([label, value], idx, arr) => (
                  <div key={String(label)} className="flex items-center justify-between px-5 py-4"
                    style={idx < arr.length - 1 ? { borderBottom: '1px solid #F0EDE8' } : {}}>
                    <span className="text-sm" style={{ color: STONE }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color: INK }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extras */}
            {(property.has_elevator || property.has_garden || property.has_pool || property.has_terrace || property.has_storage) && (
              <div>
                <SectionNum n="04" />
                <h2 className="font-display text-xl mb-4" style={{ color: INK, letterSpacing: '-0.3px' }}>Extras</h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    [property.has_elevator, 'Elevador'],
                    [property.has_garden, 'Jardim'],
                    [property.has_pool, 'Piscina'],
                    [property.has_terrace, 'Terraço'],
                    [property.has_storage, 'Arrecadação'],
                  ].filter(([v]) => v).map(([, label]) => (
                    <span key={String(label)} style={{ fontSize: '12px', fontWeight: 600, padding: '4px 10px', background: BONE, border: `1px solid ${HAIRLINE}`, borderRadius: '4px', color: STONE }}>
                      {String(label)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Acquisition costs */}
            <div>
              <SectionNum n="05" />
              <h2 className="font-display text-xl mb-2" style={{ color: INK, letterSpacing: '-0.3px' }}>Custos de aquisição</h2>
              <p className="text-sm mb-4" style={{ color: STONE }}>Estimativa. Consulte sempre um advogado.</p>
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: '6px' }} className="overflow-hidden bg-white">
                {([
                  ['IMT', costs.imt, '~6%'],
                  ['Imposto de Selo', costs.stamp, '0.8%'],
                  ['Notário', costs.notary, 'estimado'],
                  ['Registo', costs.registry, 'estimado'],
                ] as [string, number, string][]).map(([label, value, note]) => (
                  <div key={label} className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F0EDE8' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: STONE }}>{label}</span>
                      <span className="text-xs" style={{ color: STONE, fontFamily: 'IBM Plex Mono' }}>({note})</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: INK }}>{fmt(value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-4" style={{ background: BONE, borderTop: `2px solid ${INK}` }}>
                  <span className="text-sm font-semibold" style={{ color: INK }}>Total custos adicionais</span>
                  <span className="font-display font-medium" style={{ color: INK }}>{fmt(totalCosts)}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {property.tags && property.tags.length > 0 && (
              <div>
                <Callout>{property.tags.join(' · ')}</Callout>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-4">
              {/* Price card */}
              <div className="p-6 bg-white" style={{ border: `1px solid ${HAIRLINE}`, borderRadius: '8px' }}>
                <p className="font-display text-3xl font-medium" style={{ color: INK, letterSpacing: '-1px' }}>{fmt(property.price)}</p>
                {property.price_per_sqm && (
                  <p className="text-xs mt-1" style={{ color: STONE, fontFamily: 'IBM Plex Mono' }}>{fmtN(property.price_per_sqm)} €/m²</p>
                )}
                <div style={{ borderTop: `1px solid ${HAIRLINE}` }} className="mt-5 pt-5 space-y-3">
                  <button onClick={() => setContactOpen(true)}
                    className="w-full py-3.5 text-white font-semibold text-sm transition-opacity hover:opacity-85"
                    style={{ background: CLAY, borderRadius: '8px' }}>
                    Agendar visita
                  </button>
                  <ContactSellerButton
                    propertyId={property.id}
                    ownerId={property.owner_id}
                    className="w-full py-3.5 rounded-lg font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-center mt-4" style={{ color: STONE }}>Sem compromisso. Respondemos em 24h.</p>
              </div>

              {/* Building info */}
              {(property.year_built || property.condition || property.energy_rating) && (
                <div className="p-5 bg-white" style={{ border: `1px solid ${HAIRLINE}`, borderRadius: '8px' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={13} style={{ color: STONE }} />
                    <span className="text-xs font-semibold uppercase" style={{ color: STONE, letterSpacing: '2px', fontFamily: 'IBM Plex Mono', fontSize: '10px' }}>Edifício</span>
                  </div>
                  {property.year_built && (
                    <p className="text-sm" style={{ color: STONE }}>
                      Construído em <strong style={{ color: INK }}>{property.year_built}</strong>
                      {property.condition ? ` · ${CONDITION_LABEL[property.condition] ?? property.condition}` : ''}
                    </p>
                  )}
                  {property.energy_rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <Zap size={12} style={{ color: STONE }} />
                      <span className="text-sm" style={{ color: STONE }}>Cert. energético <strong style={{ color: INK }}>{property.energy_rating}</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 pb-12">
          <Divider />
          <BlockLabel>Mais imóveis</BlockLabel>
          <Link to="/imoveis"
            className="inline-flex items-center gap-2 text-sm font-medium mt-2"
            style={{ color: CLAY, textDecoration: 'none' }}>
            Ver todos os imóveis →
          </Link>
        </div>
      </div>

      {/* Contact modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(10,10,11,0.6)' }}
          onClick={() => setContactOpen(false)}>
          <div className="w-full max-w-lg bg-white p-8" style={{ borderRadius: '8px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl" style={{ color: INK }}>Agendar visita</h3>
                <p className="text-sm mt-1" style={{ color: STONE }}>{property.title}</p>
              </div>
              <button onClick={() => setContactOpen(false)}
                className="w-8 h-8 flex items-center justify-center"
                style={{ border: `1px solid ${HAIRLINE}` }}>
                <X size={15} style={{ color: STONE }} />
              </button>
            </div>
            <div className="space-y-3">
              {['O seu nome', 'Telefone', 'Email'].map(ph => (
                <input key={ph} type="text" placeholder={ph}
                  className="w-full px-4 py-3.5 text-sm outline-none"
                  style={{ border: `1px solid ${HAIRLINE}`, color: INK, borderRadius: '4px' }} />
              ))}
              <textarea placeholder="Mensagem (opcional)" rows={3}
                className="w-full px-4 py-3.5 text-sm outline-none resize-none"
                style={{ border: `1px solid ${HAIRLINE}`, color: INK, borderRadius: '4px' }} />
              <button onClick={() => setContactOpen(false)}
                className="w-full py-4 text-white font-semibold text-sm transition-opacity hover:opacity-85"
                style={{ background: CLAY, borderRadius: '8px' }}>
                Enviar pedido de visita
              </button>
              <p className="text-xs text-center" style={{ color: STONE }}>Respondemos em menos de 24h. Sem compromisso.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
