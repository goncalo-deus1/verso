import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Bed, Maximize2 } from 'lucide-react'
import type { Property } from '../types'

function formatPrice(price: number): string {
  if (price >= 1000000) return `${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 1)}M€`
  return `${(price / 1000).toFixed(0)}k€`
}

interface PropertyCardProps {
  property: Property
  showFitScore?: boolean
  dark?: boolean
}

export default function PropertyCard({ property, showFitScore = true, dark = false }: PropertyCardProps) {
  const [saved, setSaved] = useState(false)

  return (
    <div
      className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={dark
        ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px' }
        : { background: 'white', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }
      }
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* Fit score */}
        {showFitScore && (
          <div
            className="absolute top-3.5 left-3.5 px-2.5 py-1 text-white text-xs font-semibold"
            style={{ background: '#C2553A', fontFamily: 'IBM Plex Mono', letterSpacing: '0.5px' }}
          >
            {property.fitScore}%
          </div>
        )}

        {/* Save */}
        <button
          onClick={(e) => { e.preventDefault(); setSaved(!saved) }}
          className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center transition-all duration-150"
          style={{ background: 'rgba(247,245,240,0.92)', borderRadius: '2px' }}
          aria-label="Guardar"
        >
          <Heart size={14} style={{ color: saved ? '#C2553A' : '#3A3B2E', fill: saved ? '#C2553A' : 'none' }} />
        </button>

      </div>

      {/* Content */}
      <Link to={`/imoveis/${property.slug}`} className="block p-5">
        <p className="text-xs font-semibold uppercase mb-1.5" style={{ color: dark ? 'rgba(255,255,255,0.35)' : '#3A3B2E', letterSpacing: '2px', fontFamily: 'IBM Plex Mono' }}>
          {property.location}
        </p>

        <h3 className="font-display text-lg leading-snug mb-4 transition-colors duration-150 group-hover:text-[#C2553A]"
          style={{ color: dark ? '#F2EDE4' : '#1E1F18', letterSpacing: '-0.3px' }}>
          {property.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {property.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 font-medium uppercase"
              style={dark
                ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', fontSize: '10px', border: '1px solid rgba(255,255,255,0.08)' }
                : { background: '#F2EDE4', color: '#3A3B2E', letterSpacing: '1px', fontSize: '10px', border: '1px solid rgba(30, 31, 24, 0.125)' }
              }>
              {tag}
            </span>
          ))}
        </div>

        <div style={{ borderTop: dark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(30, 31, 24, 0.125)' }} className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm" style={{ color: dark ? 'rgba(255,255,255,0.45)' : '#3A3B2E' }}>
            <span className="flex items-center gap-1.5">
              <Bed size={13} style={{ color: dark ? 'rgba(255,255,255,0.25)' : '#3A3B2E' }} />
              {property.bedrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 size={13} style={{ color: dark ? 'rgba(255,255,255,0.25)' : '#3A3B2E' }} />
              {property.sqm} m²
            </span>
          </div>
          <div className="text-right">
            <p className="font-display text-xl font-medium" style={{ color: dark ? '#F2EDE4' : '#1E1F18', letterSpacing: '-0.5px' }}>
              {formatPrice(property.price)}
            </p>
            <p className="text-xs" style={{ color: dark ? 'rgba(255,255,255,0.3)' : '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>
              {property.pricePerSqm.toLocaleString('pt-PT')} €/m²
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
