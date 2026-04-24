import { ArrowRight } from 'lucide-react'
import type { Recommendation } from './types'

interface CopilotRecommendationCardProps {
  rec: Recommendation
  onCTA: (rec: Recommendation) => void
}

export function CopilotRecommendationCard({ rec, onCTA }: CopilotRecommendationCardProps) {
  const scoreColor = rec.score >= 75 ? '#6B7A5A' : rec.score >= 55 ? '#C2553A' : '#3A3B2E'

  return (
    <div style={{ background: '#F2EDE4', border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
      {rec.image && (
        <div style={{ height: '110px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={rec.image}
            alt={rec.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,11,0.5), transparent)' }} />
          <div style={{
            position: 'absolute', top: '10px', right: '10px',
            background: '#C2553A', color: 'white',
            padding: '3px 9px', fontSize: '11px',
            fontFamily: 'IBM Plex Mono', fontWeight: 600,
            letterSpacing: '0.5px',
          }}>
            {rec.score}%
          </div>
        </div>
      )}

      <div style={{ padding: '14px 16px 16px' }}>
        {rec.subtitle && (
          <p style={{
            fontSize: '10px', color: '#3A3B2E', fontFamily: 'IBM Plex Mono',
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '3px',
          }}>
            {rec.subtitle}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h4 style={{
            fontFamily: 'Georgia, serif', fontSize: '17px',
            color: '#1E1F18', letterSpacing: '-0.3px', lineHeight: '1.2',
            flex: 1,
          }}>
            {rec.title}
          </h4>
          {!rec.image && (
            <span style={{
              background: scoreColor, color: 'white',
              padding: '3px 9px', fontSize: '11px',
              fontFamily: 'IBM Plex Mono', fontWeight: 600,
              flexShrink: 0, marginLeft: '8px',
            }}>
              {rec.score}%
            </span>
          )}
        </div>

        <ul style={{ marginBottom: '14px', paddingLeft: 0, listStyle: 'none' }}>
          {rec.reasons.map((r, i) => (
            <li key={i} style={{
              fontSize: '12px', color: '#3A3B2E', marginBottom: '5px',
              display: 'flex', alignItems: 'flex-start', gap: '7px',
            }}>
              <span style={{ color: '#C2553A', flexShrink: 0, marginTop: '2px', fontSize: '8px' }}>◆</span>
              {r}
            </li>
          ))}
        </ul>

        <button
          onClick={() => onCTA(rec)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            width: '100%', padding: '10px 16px',
            background: '#1E1F18', color: 'white',
            fontSize: '12px', fontWeight: 600,
            fontFamily: 'Inter, Arial, sans-serif',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            letterSpacing: '0.3px',
          }}
        >
          {rec.ctaLabel}
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
