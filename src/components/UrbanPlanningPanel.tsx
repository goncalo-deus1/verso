import { useState } from 'react'
import type { UrbanPlanningData } from '../types'
import { MapPin, FileText, AlertCircle, ExternalLink, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'

interface UrbanPlanningPanelProps {
  data: UrbanPlanningData
  propertyAddress?: string
}

export default function UrbanPlanningPanel({ data, propertyAddress }: UrbanPlanningPanelProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ border: '1px solid #E8E4DC' }}>
      {/* Header */}
      <div style={{ background: '#FAF8F3', borderBottom: '1px solid #E8E4DC' }} className="px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: '#E8E4DC' }}>
              <MapPin size={14} style={{ color: '#5A5A5A' }} />
            </div>
            <div>
              <h3 className="font-display text-lg" style={{ color: '#0A0A0B', letterSpacing: '-0.3px' }}>
                Contexto Urbanístico
              </h3>
              <p className="text-xs mt-0.5" style={{ color: '#9A9590', fontFamily: 'IBM Plex Mono' }}>
                {data.municipality} — planeamento territorial
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
            style={{ color: '#9A9590' }}
          >
            {expanded ? <><ChevronUp size={13} /> Menos</> : <><ChevronDown size={13} /> Ver tudo</>}
          </button>
        </div>
      </div>

      <div className="px-6 py-6 bg-white space-y-6">
        {/* PDM Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={13} style={{ color: '#9A9590' }} />
            <span className="text-xs font-semibold uppercase" style={{ color: '#9A9590', letterSpacing: '2px', fontFamily: 'IBM Plex Mono' }}>
              Plano Director Municipal
            </span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#0A0A0B' }}>{data.pdmStatus}</p>

          <div className="mt-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
              style={data.pdmRevisionInProgress
                ? { background: '#FEF3C7', color: '#92400E', borderRadius: '2px' }
                : { background: '#DCFCE7', color: '#166534', borderRadius: '2px' }}>
              {data.pdmRevisionInProgress
                ? <><RefreshCw size={10} className="animate-spin" /> Revisão do PDM em curso</>
                : <><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> PDM estabilizado</>}
            </div>
          </div>
        </div>

        {/* Planning notes */}
        {data.planningNotes.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase mb-3" style={{ color: '#9A9590', letterSpacing: '2px', fontFamily: 'IBM Plex Mono' }}>
              Condicionantes e zonamento
            </p>
            <ul className="space-y-2">
              {data.planningNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: '#5A5A5A' }}>
                  <span className="w-1 h-1 mt-2 flex-shrink-0" style={{ background: '#C45D3E', borderRadius: '50%' }} />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nearby projects (expanded) */}
        {expanded && data.nearbyProjects.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase mb-3" style={{ color: '#9A9590', letterSpacing: '2px', fontFamily: 'IBM Plex Mono' }}>
              Sinais de transformação urbana
            </p>
            <div className="p-4 space-y-2.5" style={{ background: '#FAF8F3', border: '1px solid #E8E4DC' }}>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#9A9590' }}>
                Os projetos abaixo são sinais de planeamento e não devem ser interpretados como obras confirmadas.
              </p>
              {data.nearbyProjects.map((project, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: '#C45D3E' }}>◆</span>
                  <p className="text-sm" style={{ color: '#5A5A5A' }}>{project}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!expanded && data.nearbyProjects.length > 0 && (
          <button onClick={() => setExpanded(true)}
            className="text-xs font-medium transition-colors duration-150"
            style={{ color: '#C45D3E' }}>
            + {data.nearbyProjects.length} {data.nearbyProjects.length === 1 ? 'sinal' : 'sinais'} de transformação urbana
          </button>
        )}

        {propertyAddress && (
          <div className="px-4 py-3 flex items-start gap-2" style={{ background: '#FAF8F3' }}>
            <MapPin size={12} style={{ color: '#9A9590', marginTop: '2px', flexShrink: 0 }} />
            <p className="text-xs leading-relaxed" style={{ color: '#9A9590' }}>
              <strong style={{ color: '#5A5A5A' }}>Imóvel:</strong> {propertyAddress}
            </p>
          </div>
        )}

        {/* Official source */}
        <a href={data.officialSourceUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-150"
          style={{ color: '#C45D3E' }}>
          <ExternalLink size={13} />
          Fonte oficial — {data.municipality}
        </a>

        {/* Disclaimer */}
        <div className="p-4 flex items-start gap-3" style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}>
          <AlertCircle size={14} style={{ color: '#C45D3E', marginTop: '1px', flexShrink: 0 }} />
          <p className="text-xs leading-relaxed" style={{ color: '#78350F' }}>
            <strong>Aviso legal:</strong> {data.disclaimer}
          </p>
        </div>
      </div>
    </div>
  )
}
