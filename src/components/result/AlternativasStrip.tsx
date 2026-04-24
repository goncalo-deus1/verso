import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ScoredZone } from '../../lib/quiz/scoring'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

function zoneHref(z: ScoredZone) {
  return z.zone.kind === 'freguesia' ? `/freguesia/${z.zone.slug}` : `/concelho/${z.zone.slug}`
}

function scoreColor(s: number) {
  if (s >= 75) return MOSS
  if (s >= 55) return CLAY
  return STONE
}

type AltCardProps = { alt: ScoredZone; isLoggedIn: boolean }

function AltCard({ alt, isLoggedIn }: AltCardProps) {
  const { zone, score, tradeoff } = alt
  const concelhoLabel = zone.kind === 'freguesia'
    ? `Freguesia · ${zone.concelho ?? 'Lisboa'}`
    : 'Concelho · AML'

  return (
    <article style={{
      background: BONE,
      border: `1px solid ${HAIRLINE}`,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Eyebrow */}
      <p style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: STONE, margin: 0,
      }}>
        {concelhoLabel} · <span style={{ color: scoreColor(score) }}>{score}/100</span>
      </p>

      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h3 className="font-fraunces" style={{
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: INK, margin: 0,
          ...(isLoggedIn ? {} : { filter: 'blur(8px)', userSelect: 'none' }),
        }}>
          {zone.name}
        </h3>
        {!isLoggedIn && <Lock size={15} style={{ color: STONE, flexShrink: 0 }} />}
      </div>

      {/* oneLine */}
      <p style={{
        fontSize: '13px', color: STONE, lineHeight: 1.6, margin: 0,
        fontStyle: 'italic',
        ...(isLoggedIn ? {} : { filter: 'blur(5px)', userSelect: 'none' }),
      }}>
        {zone.oneLine}
      </p>

      {/* Tradeoff */}
      <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: '12px' }}>
        <p style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: CLAY, margin: '0 0 4px',
        }}>
          Trade-off
        </p>
        <p style={{ fontSize: '13px', color: STONE, lineHeight: 1.55, margin: 0 }}>
          {tradeoff}
        </p>
      </div>

      {/* Link — only if logged in */}
      {isLoggedIn && (
        <Link to={zoneHref(alt)} style={{
          fontSize: '11px', color: CLAY, textDecoration: 'none', letterSpacing: '0.08em',
          fontFamily: 'IBM Plex Mono, monospace', marginTop: 'auto',
        }}>
          Explorar {zone.name} →
        </Link>
      )}
    </article>
  )
}

type Props = {
  alternatives: ScoredZone[]
  isLoggedIn: boolean
}

export function AlternativasStrip({ alternatives, isLoggedIn }: Props) {
  if (alternatives.length === 0) return null

  return (
    <section style={{
      maxWidth: '1440px', margin: '0 auto',
      padding: 'clamp(40px,5vw,64px) clamp(20px,4vw,48px)',
    }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <span style={{ display: 'block', width: '32px', height: '1px', background: HAIRLINE }} aria-hidden />
        <p style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: STONE, margin: 0,
        }}>
          Outras zonas a considerar
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(alternatives.length, 3)}, 1fr)`,
        gap: '1px',
        background: HAIRLINE,
      }}>
        {alternatives.slice(0, 3).map(alt => (
          <AltCard key={alt.zone.slug} alt={alt} isLoggedIn={isLoggedIn} />
        ))}
      </div>

      {/* Budget hint */}
      {alternatives[0]?.zone?.budgetFitT2 && (
        <p style={{
          fontSize: '11px', color: STONE, marginTop: '16px',
          fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em',
        }}>
          T2 estimado: {alternatives[0].zone.budgetFitT2.min}–{alternatives[0].zone.budgetFitT2.max}€/mês — valores indicativos, sujeitos a actualização.
        </p>
      )}
    </section>
  )
}
