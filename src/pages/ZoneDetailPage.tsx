/**
 * ZoneDetailPage.tsx — Página de zona (legacy route /zona/:slug)
 * Usa o novo tipo Zone de src/data/zones.ts.
 */

import { useParams, Link, Navigate } from 'react-router-dom'
import { findZoneBySlug } from '../data/zones'
import { ATTRIBUTE_LABELS } from '../data/attributes'
import type { Attribute } from '../data/attributes'
import { useQuiz } from '../context/QuizContext'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const eyebrow: React.CSSProperties = {
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2.5px',
  color: CLAY,
}

// ─── Barra de perfil (dimensão → valor) ──────────────────────────────────────

function ProfileBar({ attr, value }: { attr: Attribute; value: number }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', color: STONE }}>{ATTRIBUTE_LABELS[attr]}</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: INK }}>{value}</span>
      </div>
      <div style={{ height: '4px', background: HAIRLINE, borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${value}%`,
          background: value >= 70 ? MOSS : value >= 40 ? CLAY : HAIRLINE,
          borderRadius: '2px',
          transition: 'width 400ms ease',
        }} />
      </div>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function ZoneDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const zone = slug ? findZoneBySlug(slug) : undefined
  const { open: openQuiz } = useQuiz()

  if (!zone) return <Navigate to="/" replace />

  const profileEntries = Object.entries(zone.profile) as [Attribute, number][]

  return (
    <div style={{ background: BONE, minHeight: '100vh' }}>

      <article className="px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-24" style={{ maxWidth: '680px', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Eyebrow */}
        <p style={{ ...eyebrow, marginBottom: '24px' }}>
          {zone.kind === 'freguesia' ? `Freguesia · Lisboa` : `Concelho · AML`}
          {zone.budgetFitT2 && (
            <span style={{ color: STONE }}>
              {' '}· T2 a partir de {zone.budgetFitT2.min.toLocaleString('pt-PT')}€/mês
            </span>
          )}
        </p>

        {/* Nome */}
        <h1 className="font-display" style={{
          fontSize: 'clamp(40px, 7vw, 64px)',
          letterSpacing: '-2px',
          lineHeight: '1.03',
          color: INK,
          marginBottom: '20px',
          fontWeight: 400,
        }}>
          {zone.name}
        </h1>

        {/* oneLine */}
        <p className="font-display" style={{
          fontSize: 'clamp(18px, 2.5vw, 22px)',
          fontStyle: 'italic',
          color: MOSS,
          lineHeight: '1.5',
          marginBottom: '40px',
          fontWeight: 400,
        }}>
          {zone.oneLine}
        </p>

        <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '40px' }} />

        {/* Descrição */}
        <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', lineHeight: '1.7', color: INK, marginBottom: '48px' }}>
          {zone.shortDescription}
        </p>

        {/* Imóvel de referência */}
        {zone.signalProperty && (
          <div style={{
            background: SAND,
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `4px solid ${CLAY}`,
            borderRadius: '4px',
            padding: '20px 24px',
            marginBottom: '48px',
          }}>
            <p style={{ ...eyebrow, color: STONE, marginBottom: '8px' }}>Imóvel de referência</p>
            <p style={{ fontSize: '15px', color: INK, lineHeight: 1.6 }}>{zone.signalProperty}</p>
          </div>
        )}

        {/* Perfil de zona */}
        <section style={{ marginBottom: '56px' }}>
          <p style={{ ...eyebrow, marginBottom: '24px' }}>Perfil da zona</p>
          {profileEntries.map(([attr, value]) => (
            <ProfileBar key={attr} attr={attr} value={value} />
          ))}
        </section>

        {/* Orçamento */}
        {zone.budgetFitT2 && (
          <section style={{ marginBottom: '56px' }}>
            <p style={{ ...eyebrow, marginBottom: '16px' }}>Orçamento T2 estimado</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'A partir de', value: `${zone.budgetFitT2.min.toLocaleString('pt-PT')}€/mês` },
                { label: 'Até',         value: `${zone.budgetFitT2.max.toLocaleString('pt-PT')}€/mês` },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: SAND, borderRadius: '4px', padding: '20px' }}>
                  <p style={{ ...eyebrow, color: STONE, marginBottom: '8px' }}>{label}</p>
                  <p className="font-display" style={{ fontSize: '22px', color: INK, fontWeight: 400 }}>{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div style={{ paddingTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/em-breve"
            style={{
              display: 'inline-block',
              padding: '15px 32px',
              background: CLAY,
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '4px',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Ver imóveis em {zone.name}
          </Link>
          <button
            onClick={() => openQuiz()}
            style={{
              display: 'inline-block',
              padding: '15px 24px',
              background: 'none',
              color: INK,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              borderRadius: '4px',
              border: `1px solid ${HAIRLINE}`,
            }}
          >
            Refazer o quiz
          </button>
        </div>

      </article>
    </div>
  )
}
