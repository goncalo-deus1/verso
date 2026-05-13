import { useParams, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { concelhosAML } from '../data/concelhosAML'
import SaveZoneButton from '../components/SaveZoneButton'
import { PdmSection } from '../components/concelho/PdmSection'
import { UrbanProjectsSection } from '../components/concelho/UrbanProjectsSection'
import { loadConcelhoContent } from '../lib/concelhoContent'
import type { ConcelhoContent } from '../lib/concelhoContent'
import ConcelhoSEO from '../components/concelho/ConcelhoSEO'
import ConcelhoSummary from '../components/concelho/ConcelhoSummary'
import ConcelhoEditorial from '../components/concelho/ConcelhoEditorial'
import ConcelhoFAQ from '../components/concelho/ConcelhoFAQ'
import ConcelhoSources from '../components/concelho/ConcelhoSources'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

export default function ConcelhoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const concelho = concelhosAML.find(c => c.slug === slug)

  // undefined = a carregar; null = sem ficheiro .md para este slug
  const [content, setContent] = useState<ConcelhoContent | null | undefined>(undefined)

  useEffect(() => {
    setContent(undefined)
    loadConcelhoContent(slug!).then(c => {
      if (import.meta.env.DEV && c === null) {
        console.warn(`[ConcelhoDetailPage] Sem ficheiro .md para slug="${slug}"`)
      }
      setContent(c)
    })
  }, [slug])

  if (!concelho) return <Navigate to="/404" replace />

  const eyebrow: React.CSSProperties = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '2.5px',
    color: CLAY,
    margin: '0 0 24px',
  }

  const facts = [
    {
      label: 'População aproximada',
      value: `${concelho.populationApprox.toLocaleString('pt-PT')} hab.`,
    },
    {
      label: 'Renda T2 estimada',
      value: concelho.budgetFitT2 != null
        ? `${concelho.budgetFitT2.min}–${concelho.budgetFitT2.max} €/mês`
        : '—',
    },
    {
      label: 'Transportes',
      value: concelho.transport,
    },
  ]

  return (
    <div style={{ background: BONE, minHeight: '100vh' }}>

      {/* SEO — injeta title, meta, canonical, og:* e JSON-LD no <head> */}
      {content && <ConcelhoSEO content={content} />}

      {/* ── HERO + STATS ──────────────────────────────────────────────────── */}
      <article
        className="px-5 sm:px-8 md:px-12 pt-24 sm:pt-28"
        style={{ maxWidth: '680px', margin: '0 auto', boxSizing: 'border-box' }}
      >
        {/* Eyebrow */}
        <p style={eyebrow}>
          CONCELHO · {concelho.margem === 'norte' ? 'MARGEM NORTE' : 'MARGEM SUL'}
        </p>

        {/* H1 */}
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 400, color: INK, lineHeight: 1.05, marginBottom: '16px' }}
        >
          {concelho.name}
        </h1>

        {/* oneLine */}
        <p style={{ fontSize: '22px', fontStyle: 'italic', color: MOSS, lineHeight: 1.5, marginBottom: '32px' }}>
          {concelho.oneLine}
        </p>

        {/* Save button */}
        <div style={{ marginBottom: '24px' }}>
          <SaveZoneButton zoneSlug={concelho.slug} zoneKind="concelho" zoneName={concelho.name} />
        </div>

        {/* Divisor */}
        <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '40px' }} />

        {/* Descrição */}
        <p style={{ fontSize: '19px', color: INK, lineHeight: 1.65, marginBottom: '48px' }}>
          {concelho.honestDescription}
        </p>

        {/* Hard facts */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 lg:p-8"
          style={{ background: SAND, borderRadius: '4px' }}
        >
          {facts.map(f => (
            <div key={f.label}>
              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, margin: '0 0 6px' }}>
                {f.label}
              </p>
              <p style={{ fontSize: '18px', color: INK, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </article>

      {/* ── EDITORIAL DO .MD ──────────────────────────────────────────────── */}
      {content && (
        <>
          {/* Resumo rápido */}
          <section className="habitta-px py-12 md:py-16">
            <div style={{ maxWidth: '768px', margin: '0 auto' }}>
              <ConcelhoSummary
                summary={content.summary}
                updatedAt={content.updatedAt}
              />
            </div>
          </section>

          {/* Secções editoriais H2/H3 */}
          <section className="habitta-px py-8 md:py-12">
            <article style={{ maxWidth: '768px', margin: '0 auto' }}>
              <ConcelhoEditorial sections={content.sections} />
            </article>
          </section>

          {/* FAQs — fundo --papel */}
          <section style={{ background: 'var(--papel)' }}>
            <div
              className="habitta-px py-12 md:py-16"
              style={{ maxWidth: '768px', margin: '0 auto' }}
            >
              <ConcelhoFAQ faqs={content.faqs} />
            </div>
          </section>

          {/* Fontes — fundo --linho */}
          <section style={{ background: 'var(--linho)' }}>
            <div
              className="habitta-px py-8 md:py-12"
              style={{ maxWidth: '768px', margin: '0 auto' }}
            >
              <ConcelhoSources sources={content.sources} />
            </div>
          </section>
        </>
      )}

      {/* ── QUEM SE DÁ + FREGUESIAS + CTA ────────────────────────────────── */}
      <article
        className="px-5 sm:px-8 md:px-12 pb-24"
        style={{ maxWidth: '680px', margin: '0 auto', boxSizing: 'border-box' }}
      >
        {/* Espaçamento topo — maior se veio editorial, mais pequeno se não */}
        <div style={{ paddingTop: content ? '48px' : '48px' }} />

        {/* Quem se dá bem / mal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '48px' }}>
          <div style={{ background: SAND, borderRadius: '4px', padding: '28px' }}>
            <p style={{ ...eyebrow, marginBottom: '12px' }}>Quem se dá bem aqui</p>
            <p style={{ fontSize: '16px', color: INK, lineHeight: 1.6, margin: 0 }}>{concelho.whoFitsHere}</p>
          </div>
          <div style={{ background: SAND, borderRadius: '4px', padding: '28px' }}>
            <p style={{ ...eyebrow, marginBottom: '12px' }}>Quem não se dá bem aqui</p>
            <p style={{ fontSize: '16px', color: INK, lineHeight: 1.6, margin: 0 }}>{concelho.whoDoesNotFit}</p>
          </div>
        </div>

      </article>

      {/* ── PDM ───────────────────────────────────────────────────────────── */}
      <section className="habitta-px py-16 md:py-20" style={{ background: SAND }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <PdmSection concelhoSlug={slug!} />
        </div>
      </section>

      {/* ── PROJETOS URBANOS ──────────────────────────────────────────────── */}
      <section className="habitta-px py-16 md:py-20" style={{ background: BONE }}>
        <UrbanProjectsSection concelhoSlug={slug!} concelhoName={concelho.name} />
      </section>

    </div>
  )
}
