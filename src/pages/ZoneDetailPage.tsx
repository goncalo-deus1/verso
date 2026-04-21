/**
 * ZoneDetailPage.tsx — Página editorial de zona
 *
 * Route: /zona/:slug
 * Serve as 12 zonas do Círculo 1 (Lisboa) a partir de src/data/zones.ts.
 * Redireciona para 404 se o slug não existir.
 */

import { useParams, Link, Navigate } from 'react-router-dom'
import { findZoneBySlug } from '../data/zones'

// ─── Estilos partilhados ──────────────────────────────────────────────────────

const eyebrow: React.CSSProperties = {
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2.5px',
  color: '#B8624A',
}

// ─── Componente de facto duro ─────────────────────────────────────────────────

function HardFact({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div style={{
      padding: '20px 0',
      borderTop: '1px solid #D9D2C3',
    }}>
      <p style={{ ...eyebrow, color: '#6B6B68', marginBottom: '8px' }}>{label}</p>
      <p className="font-display" style={{
        fontSize: '24px',
        color: '#0E1116',
        letterSpacing: '-0.3px',
        fontWeight: 400,
      }}>
        {value !== null ? String(value) : '— a confirmar'}
      </p>
    </div>
  )
}

// ─── Labels legíveis dos factos duros ─────────────────────────────────────────

function populationTrendLabel(trend: 'growing' | 'stable' | 'declining'): string {
  if (trend === 'growing')   return 'A crescer'
  if (trend === 'declining') return 'A diminuir'
  return 'Estável'
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function ZoneDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const zone = slug ? findZoneBySlug(slug) : undefined

  if (!zone) {
    return <Navigate to="/404" replace />
  }

  const { hardFacts } = zone

  return (
    <div style={{ background: '#F5F1EA', minHeight: '100vh' }}>

      {/* Barra de topo mínima */}
      <div style={{
        borderBottom: '1px solid #D9D2C3',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" className="font-display" style={{
          fontSize: '17px',
          color: '#0E1116',
          letterSpacing: '-0.3px',
          textDecoration: 'none',
        }}>
          VERSO
        </Link>
        <Link to="/quiz" style={{
          fontSize: '13px',
          color: '#6B6B68',
          textDecoration: 'none',
          borderBottom: '1px solid #D9D2C3',
          paddingBottom: '1px',
        }}>
          Fazer o quiz
        </Link>
      </div>

      {/* Conteúdo editorial */}
      <article style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px 96px' }}>

        {/* Eyebrow */}
        <p style={{ ...eyebrow, marginBottom: '24px' }}>
          Bairro · {zone.municipality}
        </p>

        {/* Nome */}
        <h1 className="font-display" style={{
          fontSize: 'clamp(40px, 7vw, 64px)',
          letterSpacing: '-2px',
          lineHeight: '1.03',
          color: '#0E1116',
          marginBottom: '20px',
          fontWeight: 400,
        }}>
          {zone.name}
        </h1>

        {/* oneLine */}
        <p className="font-display" style={{
          fontSize: 'clamp(18px, 2.5vw, 22px)',
          fontStyle: 'italic',
          color: '#3E5A48',
          lineHeight: '1.5',
          marginBottom: '40px',
          fontWeight: 400,
        }}>
          {zone.oneLine}
        </p>

        {/* Divisor */}
        <hr style={{ border: 'none', borderTop: '1px solid #D9D2C3', marginBottom: '40px' }} />

        {/* Descrição honesta */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)',
          lineHeight: '1.7',
          color: '#0E1116',
          marginBottom: '56px',
        }}>
          {zone.honestDescription}
        </p>

        {/* Factos duros — 3 colunas */}
        <section style={{ marginBottom: '56px' }}>
          <p style={{ ...eyebrow, marginBottom: '0' }}>Factos</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0 32px',
          }}>
            <HardFact
              label="Idade mediana"
              value={hardFacts.medianAgeYears !== null ? `${hardFacts.medianAgeYears} anos` : null}
            />
            <HardFact
              label="Metro à Baixa"
              value={hardFacts.tramOrMetroToBaixaMinutes !== null ? `${hardFacts.tramOrMetroToBaixaMinutes} min` : null}
            />
            <HardFact
              label="Renda mediana T2"
              value={hardFacts.medianT2RentEuros !== null ? `${hardFacts.medianT2RentEuros}€/mês` : null}
            />
            <HardFact
              label="Tendência populacional"
              value={populationTrendLabel(hardFacts.populationTrend3y)}
            />
          </div>
        </section>

        {/* Quem se dá bem / quem não se dá */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '56px',
        }}>
          <div style={{
            background: '#E6DDCD',
            border: '1px solid #D9D2C3',
            borderRadius: '2px',
            padding: '28px',
          }}>
            <p style={{ ...eyebrow, color: '#3E5A48', marginBottom: '16px' }}>
              Quem se dá bem aqui
            </p>
            <p style={{ fontSize: '15px', color: '#0E1116', lineHeight: '1.65' }}>
              {zone.whoFitsHere}
            </p>
          </div>
          <div style={{
            background: '#E6DDCD',
            border: '1px solid #D9D2C3',
            borderRadius: '2px',
            padding: '28px',
          }}>
            <p style={{ ...eyebrow, color: '#6B6B68', marginBottom: '16px' }}>
              Quem não se dá bem aqui
            </p>
            <p style={{ fontSize: '15px', color: '#0E1116', lineHeight: '1.65' }}>
              {zone.whoDoesNotFit}
            </p>
          </div>
        </section>

        {/* Ruas de referência */}
        <section style={{ marginBottom: '56px' }}>
          <p style={{ ...eyebrow, marginBottom: '24px' }}>Três ruas para conhecer</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {zone.referenceStreets.map((street, i) => (
              <div
                key={street.name}
                style={{
                  padding: '24px 0',
                  borderTop: i === 0 ? '1px solid #D9D2C3' : undefined,
                  borderBottom: '1px solid #D9D2C3',
                }}
              >
                <p className="font-display" style={{
                  fontSize: '20px',
                  color: '#0E1116',
                  letterSpacing: '-0.2px',
                  marginBottom: '8px',
                  fontWeight: 400,
                }}>
                  {street.name}
                </p>
                <p style={{ fontSize: '14px', color: '#6B6B68', lineHeight: '1.6' }}>
                  {street.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <div style={{ paddingTop: '16px' }}>
          <Link
            to="/imoveis"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '15px 32px',
              background: '#B8624A',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              borderRadius: '2px',
              transition: 'opacity 150ms ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Ver os imóveis em {zone.name}
          </Link>
        </div>

      </article>
    </div>
  )
}
