/**
 * ConcelhoHub — /aml/:concelho page.
 *
 * Pure-props component. Receives a ConcelhoData object (built once at
 * module load per concelho). All numbers come from INE 2025 via the
 * helpers; all editorial prose comes from the MD (pre-parsed) and the
 * legacy concelhosAML.ts record.
 *
 * Render order (per the migration spec):
 *   1.  Eyebrow + H1 + oneLine
 *   2.  SaveZoneButton (ClientOnly)
 *   3.  Lede + DataBlock INE
 *   4.  ComparisonTable vs neighbors (INE)
 *   5.  honestDescription
 *   6.  Hard facts grid (population, budgetFitT2, transport)
 *   7.  Resumo rápido (MD)
 *   8.  Editorial completo (MD H2/H3 sections)
 *   9.  Freguesias list (Lisboa: 24 with microDesc; others: simples)
 *   10. FAQ (MD)
 *   11. Sources (MD)
 *   12. Cards "Quem se dá bem / mal"
 *   13. PdmSection (Supabase, ClientOnly)
 *   14. UrbanProjectsSection (Supabase, ClientOnly)
 *   15. CTA
 *   16. Metadata footer
 */

import type { ConcelhoData } from '../../data/aml/concelhos/_types'
import {
  getConcelhoBySlug,
  getYoY,
  getCrescimento6Anos,
  INE_2025_FONTE,
} from '../../data/aml/concelhos-aml-2025'
import { concelhosAML } from '../../data/concelhosAML'
import { fmtPriceEuroM2 as fmtPrice, fmtPct, fmtThousand } from '../../lib/format'

import {
  Lede,
  DataBlock,
  ComparisonTable,
  CTA,
  Metadata,
} from '../../components/habitta'
import type {
  DataBlockRow,
  ComparisonColumn,
  ComparisonRow,
  MetadataSource,
} from '../../components/habitta'
import { ClientOnly } from '../../components/habitta/ClientOnly'
import {
  articleJsonLd,
  placeJsonLd,
  breadcrumbListJsonLd,
} from '../../lib/jsonLd'

import SaveZoneButton             from '../../components/SaveZoneButton'
import ConcelhoSummary            from '../../components/concelho/ConcelhoSummary'
import ConcelhoEditorial          from '../../components/concelho/ConcelhoEditorial'
import ConcelhoFAQ                from '../../components/concelho/ConcelhoFAQ'
import ConcelhoSources            from '../../components/concelho/ConcelhoSources'
import { PdmSection }             from '../../components/concelho/PdmSection'
import { UrbanProjectsSection }   from '../../components/concelho/UrbanProjectsSection'

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://www.usehabitta.com'
const SAND     = '#E8E0D0'
const MOSS     = '#6B7A5A'

// ─── Style atoms ──────────────────────────────────────────────────────────────

const h2Style = {
  fontFamily: 'var(--font-display-stack)',
  fontSize: 'clamp(28px, 3.4vw, 40px)',
  lineHeight: 1.12,
  letterSpacing: '-0.7px',
  color: 'var(--charcoal)',
  fontWeight: 400,
  margin: 'var(--space-6) 0 var(--space-3)',
} as const

const proseStyle = {
  fontFamily: 'var(--font-body-stack)',
  fontSize: 'clamp(17px, 1.4vw, 19px)',
  lineHeight: 'var(--leading-body)',
  color: 'var(--charcoal)',
  maxWidth: '38em',
  margin: '0 0 var(--space-3)',
} as const

const eyebrowStyle = {
  fontFamily: 'var(--font-mono-stack)',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '2.5px',
  color: 'var(--clay)',
  margin: '0 0 var(--space-2)',
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface ConcelhoHubProps {
  data: ConcelhoData
}

export default function ConcelhoHub({ data }: ConcelhoHubProps) {
  const ine    = getConcelhoBySlug(data.slug)!
  const legacy = concelhosAML.find(c => c.slug === data.slug)!

  const url      = `${BASE_URL}${data.canonicalUrl}`
  const yoy      = getYoY(ine)
  const seisAnos = getCrescimento6Anos(ine)

  // ─── JSON-LD payloads ─────────────────────────────────────────────────
  const articleLd = articleJsonLd({
    headline:      `O concelho de ${legacy.name} em 2026 — habitta`,
    description:   data.md.frontmatter.meta_description,
    url,
    datePublished: data.updated,
    dateModified:  data.updated,
  })
  const placeLd = placeJsonLd({
    name:        legacy.name,
    description: data.md.frontmatter.meta_description,
    url,
    concelho:    'Área Metropolitana de Lisboa',
  })
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: 'habitta',  url: BASE_URL },
    { name: 'AML',      url: `${BASE_URL}/aml` },
    { name: legacy.name, url },
  ])

  // ─── Data block — 5 rows, all INE ─────────────────────────────────────
  const factRows: DataBlockRow[] = [
    { label: 'Mediana 2025',         value: fmtPrice(ine.medianaT4_2025), source: INE_2025_FONTE },
    { label: '1.º quartil 2025',     value: fmtPrice(ine.q1_T4_2025),     source: 'INE Q4 2025' },
    { label: '3.º quartil 2025',     value: fmtPrice(ine.q3_T4_2025),     source: 'INE Q4 2025' },
    { label: 'YoY (2024→2025)',      value: fmtPct(yoy),                  source: 'INE Q4 2025' },
    { label: '6 anos (2019→2025)',   value: fmtPct(seisAnos, 0),          source: 'INE séries 2019–2025' },
  ]

  // ─── Comparison table — this concelho + 4 neighbors ───────────────────
  const compColumns: ComparisonColumn[] = [
    { key: 'name',  label: 'Concelho' },
    { key: 'sub',   label: 'Sub-região' },
    { key: 'price', label: 'Mediana 2025' },
    { key: 'yoy',   label: 'YoY' },
    { key: 'seis',  label: '6 anos' },
  ]
  const compRows: ComparisonRow[] = [
    {
      name:  legacy.name,
      sub:   ine.subRegiao,
      price: fmtPrice(ine.medianaT4_2025),
      yoy:   fmtPct(yoy),
      seis:  fmtPct(seisAnos, 0),
    },
    ...data.comparisonNeighbors
      .map(slug => getConcelhoBySlug(slug))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map(c => ({
        name:  c.name,
        sub:   c.subRegiao,
        price: fmtPrice(c.medianaT4_2025),
        yoy:   fmtPct(getYoY(c)),
        seis:  fmtPct(getCrescimento6Anos(c), 0),
      })),
  ]

  // ─── Metadata footer sources ──────────────────────────────────────────
  const metadataSources: MetadataSource[] = [
    { label: INE_2025_FONTE },
    { label: 'INE — Censos 2021' },
  ]

  // ─── Hard facts grid (legacy data) ────────────────────────────────────
  const legacyFacts = [
    {
      label: 'População',
      value: `${fmtThousand(legacy.populationApprox)} hab.`,
    },
    {
      label: 'Renda T2 estimada',
      value: legacy.budgetFitT2
        ? `${legacy.budgetFitT2.min}–${legacy.budgetFitT2.max} €/mês`
        : '—',
    },
    {
      label: 'Transportes',
      value: legacy.transport,
    },
  ]

  // ─── Freguesias rendering helpers ─────────────────────────────────────
  const hasMicroDescs = data.freguesias.some(f => f.microDesc)

  return (
    <article className="habitta-editorial">
      {/* JSON-LD (inline; serialized to static HTML by prerender) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {data.md.jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data.md.jsonLd }} />
      ) : null}

      <div className="habitta-container" style={{ paddingBlock: 'var(--space-6)' }}>
        {/* 1. Eyebrow + H1 + oneLine */}
        <p style={eyebrowStyle}>
          {data.eyebrow.kind} · {data.eyebrow.subRegiao}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display-stack)',
            fontSize: 'clamp(48px, 7vw, 88px)',
            lineHeight: 1.02,
            letterSpacing: '-1.6px',
            color: 'var(--charcoal)',
            fontWeight: 300,
            margin: '0 0 var(--space-3)',
          }}
        >
          O concelho de <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>{legacy.name}</em>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-display-stack)',
            fontSize: 'clamp(20px, 2vw, 24px)',
            fontStyle: 'italic',
            color: MOSS,
            lineHeight: 1.4,
            margin: '0 0 var(--space-4)',
            maxWidth: '32em',
          }}
        >
          {legacy.oneLine}
        </p>

        {/* 2. SaveZoneButton — ClientOnly */}
        <div style={{ margin: '0 0 var(--space-5)' }}>
          <ClientOnly>
            <SaveZoneButton
              zoneSlug={data.slug}
              zoneKind="concelho"
              zoneName={legacy.name}
            />
          </ClientOnly>
        </div>

        {/* 3. Lede + DataBlock INE */}
        <Lede>{data.lede}</Lede>
        <DataBlock rows={factRows} caption="Dados-chave (INE Q4 2025)" />

        {/* 4. ComparisonTable */}
        <h2 style={h2Style}>
          Comparado com <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>vizinhos</em>
        </h2>
        <ComparisonTable
          columns={compColumns}
          rows={compRows}
          caption={`${legacy.name} vs ${compRows.length - 1} concelhos vizinhos (INE Q4 2025)`}
        />

        {/* 5. honestDescription */}
        <h2 style={h2Style}>
          O que é <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>{legacy.name}</em>
        </h2>
        <p style={proseStyle}>{legacy.honestDescription}</p>

        {/* 6. Hard facts grid (legacy) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 'var(--space-2)',
            background: SAND,
            borderRadius: '4px',
            padding: 'var(--space-4)',
            margin: 'var(--space-4) 0 var(--space-5)',
          }}
        >
          {legacyFacts.map(f => (
            <div key={f.label}>
              <p
                style={{
                  fontFamily: 'var(--font-mono-stack)',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.8px',
                  color: 'var(--charcoal)',
                  opacity: 0.7,
                  margin: '0 0 6px',
                }}
              >
                {f.label}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-display-stack)',
                  fontSize: '20px',
                  color: 'var(--charcoal)',
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {f.value}
              </p>
            </div>
          ))}
        </div>

        {/* 7. Resumo rápido (MD) */}
        {data.md.summary ? (
          <ConcelhoSummary summary={data.md.summary} updatedAt={data.md.updatedAt} />
        ) : null}

        {/* 8. Editorial completo (MD) */}
        {data.md.sections.length > 0 ? (
          <ConcelhoEditorial sections={data.md.sections} />
        ) : null}

        {/* 9. Freguesias list */}
        <h2 style={h2Style}>
          As <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>freguesias</em> de {legacy.name}
        </h2>
        {hasMicroDescs ? (
          // Lisboa-style: 3-col grid with anchored microDescs
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 'var(--space-3) 0 var(--space-6)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            {data.freguesias.map(f => {
              const href = f.hasPage
                ? `/aml/${data.slug}/${f.slug}`
                : `/aml/${data.slug}#freguesia-${f.slug}`
              return (
                <li
                  key={f.slug}
                  id={`freguesia-${f.slug}`}
                  style={{
                    borderTop: '1px solid rgba(44, 44, 42, 0.15)',
                    paddingTop: 'var(--space-2)',
                    scrollMarginTop: 'var(--space-5)',
                  }}
                >
                  <a
                    href={href}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-display-stack)',
                      fontSize: '19px',
                      color: 'var(--charcoal)',
                      textDecoration: 'none',
                      fontWeight: 400,
                      marginBottom: '4px',
                    }}
                  >
                    {f.name}
                    {f.hasPage ? (
                      <span
                        aria-hidden
                        style={{
                          marginLeft: '8px',
                          fontFamily: 'var(--font-mono-stack)',
                          fontSize: '10px',
                          letterSpacing: '1.5px',
                          textTransform: 'uppercase',
                          color: 'var(--clay)',
                        }}
                      >
                        · página
                      </span>
                    ) : null}
                  </a>
                  {f.microDesc ? (
                    <p
                      style={{
                        fontFamily: 'var(--font-body-stack)',
                        fontSize: '14px',
                        lineHeight: 1.45,
                        color: 'var(--charcoal)',
                        opacity: 0.75,
                        margin: 0,
                      }}
                    >
                      {f.microDesc}
                    </p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        ) : (
          // Simple list — no microDescs (other 17 concelhos)
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 'var(--space-3) 0 var(--space-6)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 'var(--space-2)',
            }}
          >
            {data.freguesias.map(f => (
              <li
                key={f.slug}
                id={`freguesia-${f.slug}`}
                style={{
                  fontFamily: 'var(--font-body-stack)',
                  fontSize: '16px',
                  color: 'var(--charcoal)',
                  scrollMarginTop: 'var(--space-5)',
                }}
              >
                {f.name}
              </li>
            ))}
          </ul>
        )}

        {/* 10. FAQ (MD) */}
        {data.md.faqs.length > 0 ? (
          <ConcelhoFAQ faqs={data.md.faqs} />
        ) : null}

        {/* 11. Sources (MD) */}
        {data.md.sources ? (
          <ConcelhoSources sources={data.md.sources} />
        ) : null}

        {/* 12. Cards "Quem se dá bem / mal" */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-3)',
            margin: 'var(--space-6) 0 var(--space-5)',
          }}
        >
          <div style={{ background: SAND, borderRadius: '4px', padding: 'var(--space-4)' }}>
            <p style={eyebrowStyle}>Quem se dá bem aqui</p>
            <p
              style={{
                fontFamily: 'var(--font-body-stack)',
                fontSize: '16px',
                color: 'var(--charcoal)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {legacy.whoFitsHere}
            </p>
          </div>
          <div style={{ background: SAND, borderRadius: '4px', padding: 'var(--space-4)' }}>
            <p style={eyebrowStyle}>Quem não se dá bem aqui</p>
            <p
              style={{
                fontFamily: 'var(--font-body-stack)',
                fontSize: '16px',
                color: 'var(--charcoal)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {legacy.whoDoesNotFit}
            </p>
          </div>
        </div>

        {/* 13. PdmSection — ClientOnly (Supabase dynamic data) */}
        <div style={{ margin: 'var(--space-6) 0 var(--space-5)' }}>
          <ClientOnly>
            <PdmSection concelhoSlug={data.slug} />
          </ClientOnly>
        </div>

        {/* 14. UrbanProjectsSection — ClientOnly */}
        <div style={{ margin: 'var(--space-5) 0' }}>
          <ClientOnly>
            <UrbanProjectsSection concelhoSlug={data.slug} concelhoName={legacy.name} />
          </ClientOnly>
        </div>

        {/* 15. CTA */}
        <CTA
          headline="2 minutos até saberes em qual."
          href="/quiz"
          duration="2 minutos até à tua resposta."
        />

        {/* 16. Metadata footer */}
        <Metadata
          updated={data.updated}
          nextReview={data.nextReview}
          sources={metadataSources}
        />
      </div>
    </article>
  )
}
