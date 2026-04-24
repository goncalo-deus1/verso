import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ScoredZone } from '../../lib/quiz/scoring'
import type { Freguesia } from '../../data/freguesias'
import { CapaIlustrada } from './CapaIlustrada'
import { DossierStats } from './DossierStats'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

type Props = {
  best: ScoredZone
  freguesia: Freguesia | null
  isLoggedIn: boolean
  onAuth: (mode: 'register' | 'login') => void
  lowScoreWarning: boolean
}

function zoneHref(best: ScoredZone) {
  return best.zone.kind === 'freguesia' ? `/freguesia/${best.zone.slug}` : `/concelho/${best.zone.slug}`
}

function LoginGate({ onAuth }: { onAuth: (mode: 'register' | 'login') => void }) {
  return (
    <div style={{
      background: SAND,
      border: `1px solid ${HAIRLINE}`,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '34px', height: '34px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: INK,
        }}>
          <Lock size={14} color={BONE} />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: INK, margin: '0 0 2px' }}>
            Cria uma conta gratuita para ver o resultado completo
          </p>
          <p style={{ fontSize: '12px', color: STONE, margin: 0, lineHeight: 1.5 }}>
            O dossier detalhado fica reservado a utilizadores registados.
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => onAuth('register')} style={{
          padding: '10px 20px', background: INK, color: BONE,
          fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
          fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Criar conta
        </button>
        <button onClick={() => onAuth('login')} style={{
          padding: '10px 20px', background: 'none',
          border: `1px solid ${HAIRLINE}`, color: STONE,
          fontSize: '12px', fontWeight: 500, cursor: 'pointer',
          fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Entrar
        </button>
      </div>
    </div>
  )
}

export function HeroFreguesia({ best, freguesia, isLoggedIn, onAuth, lowScoreWarning }: Props) {
  const { zone, score, tradeoff } = best

  const description = isLoggedIn
    ? (freguesia?.honestDescription ?? zone.shortDescription)
    : null

  const referenceStreets = isLoggedIn ? (freguesia?.referenceStreets ?? null) : null

  const concelhoLabel = zone.kind === 'freguesia'
    ? `Freguesia · ${zone.concelho ?? 'Lisboa'}`
    : 'Concelho · AML'

  return (
    <section
      style={{
        background: BONE,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'clamp(40px,6vw,80px) clamp(20px,4vw,48px) clamp(40px,6vw,80px)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(32px, 5vw, 80px)',
          alignItems: 'start',
        }}>

          {/* ── LEFT: TEXTO ── */}
          <div>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <span style={{ display: 'block', width: '32px', height: '1px', background: CLAY }} aria-hidden />
              <p style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '9px', letterSpacing: '0.24em', textTransform: 'uppercase',
                color: CLAY, margin: 0,
              }}>
                Ensaio Cartográfico N.º&nbsp;01 · AML&nbsp;2026
              </p>
            </div>

            {/* Score badge */}
            <p style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: STONE, margin: '0 0 10px',
            }}>
              {concelhoLabel} · <span style={{ color: score >= 75 ? MOSS : score >= 55 ? CLAY : STONE }}>{score}/100</span>
            </p>

            {/* Zone name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <h1
                className="font-fraunces"
                style={{
                  fontSize: 'clamp(2.6rem, 6vw, 5rem)',
                  fontWeight: 400, lineHeight: 1.02, letterSpacing: '-0.03em', color: INK, margin: 0,
                  ...(isLoggedIn ? {} : { filter: 'blur(10px)', userSelect: 'none' }),
                }}
              >
                {zone.name}
              </h1>
              {!isLoggedIn && <Lock size={22} style={{ color: STONE, flexShrink: 0 }} />}
            </div>

            {/* oneLine */}
            <p style={{
              fontSize: '16px', lineHeight: 1.65, color: `${INK}99`, margin: '0 0 28px',
              fontStyle: 'italic',
              ...(isLoggedIn ? {} : { filter: 'blur(6px)', userSelect: 'none' }),
            }}>
              {zone.oneLine}
            </p>

            {/* Divider */}
            <div style={{ height: '1px', background: HAIRLINE, marginBottom: '28px' }} />

            {/* Description / gate */}
            {isLoggedIn ? (
              <div>
                <p style={{ fontSize: '15px', lineHeight: 1.75, color: INK, margin: '0 0 20px' }}>
                  {description}
                </p>

                {/* Tradeoff */}
                <div style={{
                  borderLeft: `3px solid ${CLAY}`,
                  paddingLeft: '16px',
                  marginBottom: '24px',
                }}>
                  <p style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: CLAY, margin: '0 0 6px',
                  }}>
                    O principal trade-off
                  </p>
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: MOSS, fontStyle: 'italic', margin: 0 }}>
                    {tradeoff}
                  </p>
                </div>

                {/* Reference streets */}
                {referenceStreets && referenceStreets.length > 0 && (
                  <div style={{ marginBottom: '28px' }}>
                    <p style={{
                      fontFamily: 'IBM Plex Mono, monospace', fontSize: '9px',
                      letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: STONE, margin: '0 0 12px',
                    }}>
                      Ruas de referência
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {referenceStreets.slice(0, 3).map(street => (
                        <div key={street.name} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <span style={{ color: CLAY, flexShrink: 0, marginTop: '2px', fontSize: '12px' }}>→</span>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: INK, margin: '0 0 2px' }}>
                              {street.name}
                            </p>
                            <p style={{ fontSize: '12px', color: STONE, margin: 0, lineHeight: 1.5 }}>
                              {street.note}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  to={zoneHref(best)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: INK, color: BONE, padding: '14px 24px',
                    fontSize: '11px', fontWeight: 500, textDecoration: 'none',
                    fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = CLAY)}
                  onMouseLeave={e => (e.currentTarget.style.background = INK)}
                >
                  Ver dossier completo
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </div>
            ) : (
              <LoginGate onAuth={onAuth} />
            )}

            {/* Low score warning */}
            {lowScoreWarning && (
              <div style={{
                marginTop: '20px',
                padding: '14px 18px',
                background: SAND,
                border: `1px solid ${HAIRLINE}`,
                borderLeft: `4px solid ${CLAY}`,
                fontSize: '13px', color: STONE, lineHeight: 1.6,
              }}>
                Nenhuma zona atingiu correspondência alta. Este é o resultado mais próximo — considera ajustar as prioridades.
              </div>
            )}
          </div>

          {/* ── RIGHT: ILUSTRAÇÃO + STATS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <CapaIlustrada score={score} profile={zone.profile} name={zone.name} />
            <DossierStats profile={zone.profile} />
          </div>

        </div>
      </div>
    </section>
  )
}
