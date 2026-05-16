/**
 * FreguesiaPage — typed, prop-driven template for /aml/:concelho/:freguesia.
 *
 * Hard rules enforced by this file (do not relax without updating the brand spec):
 *   • Every numeric value comes from props. Missing data renders as the literal
 *     string "{{DADO_EM_FALTA}}" — easy to grep on review.
 *   • The <Lede> appears inside the first 200 rendered words so AI extractors
 *     anchor on it.
 *   • H2s are question-shaped or specific claim-shaped, not generic.
 *   • No useEffect, no useState, no router hooks, no Supabase — must be
 *     prerender-safe.
 */

import {
  Lede,
  DataBlock,
  ComparisonTable,
  FAQ,
  CTA,
  Metadata,
} from '../../components/habitta'
import type {
  DataBlockRow,
  FAQItem,
  ComparisonColumn,
  ComparisonRow,
  MetadataSource,
} from '../../components/habitta'
import {
  articleJsonLd,
  placeJsonLd,
  breadcrumbListJsonLd,
} from '../../lib/jsonLd'

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FreguesiaPageProps {
  freguesia: {
    /** Display name, e.g. "Alvalade". */
    name: string
    /** URL slug, e.g. "alvalade". */
    slug: string
    /** ISO 8601 lat/long. Optional — drives schema.org Place. */
    geo?: { latitude: number; longitude: number }
  }
  concelho: {
    name: string  // e.g. "Lisboa"
    slug: string  // e.g. "lisboa"
  }
  /**
   * Lede prose. Renders as one block, four sentences:
   *   "{name} custa <em>{pricePerSqm}</em> em {year}.
   *    {comparison}.
   *    Faz sentido para {fitsFor}.
   *    Não faz para {doesntFitFor}."
   * The comparison sentence is a complete editorial line written by the editor
   * (e.g. "Menos que Avenidas Novas, mais que Lumiar"). No trailing period.
   */
  lede: {
    pricePerSqm: string         // e.g. "6.915 €/m²" or "{{DADO_EM_FALTA}} €/m²"
    year: string                // e.g. "2026"
    comparison: string          // e.g. "Menos que Avenidas Novas, mais que Lumiar"
    fitsFor: string             // e.g. "famílias com filhos em idade escolar"
    doesntFitFor: string        // e.g. "quem vive de nightlife depois da 1h"
  }
  /** Data block — the 6 key facts. Strings only; numbers formatted upstream. */
  facts: {
    medianPricePerSqm: string
    yoyVariation: string
    medianRent: string
    timeToMarques: string       // e.g. "12 min metro · 18 min carro"
    schools: string             // e.g. "8 públicas · 3 privadas"
    greenAreas: string          // e.g. "2 jardins · 1 parque urbano"
  }
  factSources: {
    medianPricePerSqm: string
    yoyVariation: string
    medianRent: string
    timeToMarques: string
    schools: string
    greenAreas: string
  }
  /** Long-form prose for the four narrative H2 sections. */
  prose: {
    fitsBecause: string   // 150–200 words
    doesntFitBecause: string  // 100–150 words, honest
    tradeOff: string      // "O que estás a pagar (e o que não estás)"
    yearChange: string    // "Como mudou em 2026"
  }
  /** Comparison vs 3–4 adjacent freguesias. */
  comparison: {
    caption?: string
    columns: ComparisonColumn[]  // first column = "Freguesia"
    rows: ComparisonRow[]
  }
  faqs: FAQItem[]
  cta: {
    headline: string
    href: string
    duration: string
  }
  meta: {
    /** ISO YYYY-MM-DD. */
    updated: string
    /** ISO YYYY-MM-DD. */
    nextReview: string
    sources: MetadataSource[]
    /** Plain-text description for <meta description> / JSON-LD. */
    description: string
    /** Optional hero image URL for og:image / schema.org image. */
    heroImage?: string
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BASE_URL = 'https://www.usehabitta.com'

function pageUrl(props: FreguesiaPageProps): string {
  return `${BASE_URL}/aml/${props.concelho.slug}/${props.freguesia.slug}`
}

function buildFactRows(props: FreguesiaPageProps): DataBlockRow[] {
  return [
    { label: 'Preço mediano',         value: props.facts.medianPricePerSqm, source: props.factSources.medianPricePerSqm },
    { label: 'Variação YoY',          value: props.facts.yoyVariation,      source: props.factSources.yoyVariation },
    { label: 'Arrendamento mediano',  value: props.facts.medianRent,        source: props.factSources.medianRent },
    { label: 'Até Marquês de Pombal', value: props.facts.timeToMarques,     source: props.factSources.timeToMarques },
    { label: 'Escolas',               value: props.facts.schools,           source: props.factSources.schools },
    { label: 'Áreas verdes',          value: props.facts.greenAreas,        source: props.factSources.greenAreas },
  ]
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FreguesiaPage(props: FreguesiaPageProps) {
  const url = pageUrl(props)

  // JSON-LD: Article + Place + BreadcrumbList. (FAQ is emitted by the FAQ block.)
  const articleLd = articleJsonLd({
    headline:      `Viver em ${props.freguesia.name}, ${props.concelho.name} — 2026`,
    description:   props.meta.description,
    url,
    image:         props.meta.heroImage,
    datePublished: props.meta.updated,
    dateModified:  props.meta.updated,
  })

  const placeLd = placeJsonLd({
    name:        props.freguesia.name,
    description: props.meta.description,
    url,
    concelho:    props.concelho.name,
    geo:         props.freguesia.geo,
  })

  const breadcrumbLd = breadcrumbListJsonLd([
    { name: 'habitta', url: BASE_URL },
    { name: 'AML',     url: `${BASE_URL}/aml` },
    { name: props.concelho.name, url: `${BASE_URL}/aml/${props.concelho.slug}` },
    { name: props.freguesia.name, url },
  ])

  return (
    <article className="habitta-editorial">
      {/* Inline JSON-LD blocks — serialized into static HTML by prerender. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="habitta-container" style={{ paddingBlock: 'var(--space-6)' }}>
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: 'var(--font-mono-stack)',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: 'var(--clay)',
            margin: '0 0 var(--space-2)',
          }}
        >
          AML · {props.concelho.name}
        </p>

        {/* H1 — must include freguesia name + concelho */}
        <h1
          style={{
            fontFamily: 'var(--font-display-stack)',
            fontSize: 'clamp(48px, 7vw, 88px)',
            lineHeight: 1.02,
            letterSpacing: '-1.6px',
            color: 'var(--charcoal)',
            fontWeight: 300,
            margin: '0 0 var(--space-5)',
          }}
        >
          Viver em <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>{props.freguesia.name}</em>
        </h1>

        {/* Lede — inside first 200 words */}
        <Lede>
          {props.freguesia.name} custa <em>{props.lede.pricePerSqm}</em> em {props.lede.year}.
          {' '}{props.lede.comparison}.
          {' '}Faz sentido para {props.lede.fitsFor}.
          {' '}Não faz para {props.lede.doesntFitFor}.
        </Lede>

        {/* Data block — six key facts */}
        <DataBlock rows={buildFactRows(props)} caption="Dados-chave" />

        {/* H2 1 — "Para quem [freguesia] faz sentido" */}
        <h2
          style={{
            fontFamily: 'var(--font-display-stack)',
            fontSize: 'clamp(32px, 4vw, 48px)',
            lineHeight: 1.1,
            letterSpacing: '-0.8px',
            color: 'var(--charcoal)',
            fontWeight: 400,
            margin: 'var(--space-6) 0 var(--space-3)',
          }}
        >
          Para quem {props.freguesia.name} <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>faz sentido</em>
        </h2>
        <p style={proseStyle}>{props.prose.fitsBecause}</p>

        {/* H2 2 — "Para quem não faz" */}
        <h2 style={h2Style}>
          Para quem <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>não faz</em>
        </h2>
        <p style={proseStyle}>{props.prose.doesntFitBecause}</p>

        {/* H2 3 — trade-off */}
        <h2 style={h2Style}>
          O que estás a <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>pagar</em> (e o que não estás)
        </h2>
        <p style={proseStyle}>{props.prose.tradeOff}</p>

        {/* H2 4 — YoY change */}
        <h2 style={h2Style}>
          Como mudou em <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>2026</em>
        </h2>
        <p style={proseStyle}>{props.prose.yearChange}</p>

        {/* Comparison */}
        <h2 style={h2Style}>
          Comparado com <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>vizinhos</em>
        </h2>
        <ComparisonTable
          columns={props.comparison.columns}
          rows={props.comparison.rows}
          caption={props.comparison.caption}
        />

        {/* FAQ */}
        <FAQ items={props.faqs} />

        {/* CTA */}
        <CTA
          headline={props.cta.headline}
          href={props.cta.href}
          duration={props.cta.duration}
        />

        {/* Metadata */}
        <Metadata
          updated={props.meta.updated}
          nextReview={props.meta.nextReview}
          sources={props.meta.sources}
        />
      </div>
    </article>
  )
}

// ─── Inline style atoms (kept local to avoid a global stylesheet for primitives) ──

const h2Style = {
  fontFamily: 'var(--font-display-stack)',
  fontSize: 'clamp(32px, 4vw, 48px)',
  lineHeight: 1.1,
  letterSpacing: '-0.8px',
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
