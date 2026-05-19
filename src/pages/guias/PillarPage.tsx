/**
 * PillarPage — long-form editorial guide template for /guias/:slug.
 *
 * Structurally different from FreguesiaPage / ConcelhoHub: each pillar is
 * an essay built around 3–5 numbered insights. The data carries the prose
 * and the (often large) data tables; the component just lays it out.
 *
 * Prerender-safe — pure render, no hooks, no router, no browser APIs.
 */

import {
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
import { articleJsonLd, breadcrumbListJsonLd } from '../../lib/jsonLd'
import { useLangSafe } from '../../context/LanguageContext'
import { useT } from '../../i18n/translations'

const BASE_URL = 'https://www.usehabitta.com'

export interface PillarInsight {
  /** Number prefix shown in the H2 ("01", "02", "03"). */
  number: string
  /** Full H2 sentence. May contain an emphasis phrase wrapped via { emphasis }. */
  headline: string
  /** The single word/phrase in the headline that becomes coral italic. */
  emphasis?: string
  /** 1–3 paragraphs (string array, each gets its own <p>). */
  paragraphs: string[]
}

export interface PillarPageProps {
  slug: string                       // e.g. "aml-nao-e-lisboa"
  eyebrow: string                    // e.g. "Guia · AML"
  title: string                      // H1 text
  titleEmphasis?: string             // word in title to render coral italic
  lede: string                       // 2–4 sentences
  thesis?: string                    // optional pullquote-style line below lede
  factRows?: DataBlockRow[]          // optional top-of-page data block
  factCaption?: string
  insights: PillarInsight[]
  /** Optional large data table — typically the centerpiece of the pillar. */
  table?: {
    caption?: string
    columns: ComparisonColumn[]
    rows: ComparisonRow[]
  }
  closing: {
    headline: string
    paragraphs: string[]
  }
  faqs: FAQItem[]
  cta: {
    headline: string
    href: string
    duration: string
  }
  meta: {
    updated: string
    nextReview: string
    sources: MetadataSource[]
    description: string
    heroImage?: string
  }
}

// ─── Style atoms ──────────────────────────────────────────────────────────────

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

// Render a headline, splitting on { emphasis } so we can italicize one phrase.
function renderHeadline(text: string, emphasis?: string) {
  if (!emphasis || !text.includes(emphasis)) return text
  const i = text.indexOf(emphasis)
  return (
    <>
      {text.slice(0, i)}
      <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>{emphasis}</em>
      {text.slice(i + emphasis.length)}
    </>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PillarPage(props: PillarPageProps) {
  const { lang } = useLangSafe()
  const tr = useT(lang)
  const url = `${BASE_URL}/guias/${props.slug}`

  const articleLd = articleJsonLd({
    headline:      props.title,
    description:   props.meta.description,
    url,
    image:         props.meta.heroImage,
    datePublished: props.meta.updated,
    dateModified:  props.meta.updated,
  })
  const breadcrumbLd = breadcrumbListJsonLd([
    { name: tr('pillar.breadcrumb.brand'),  url: BASE_URL },
    { name: tr('pillar.breadcrumb.guides'), url: `${BASE_URL}/guias` },
    { name: props.title, url },
  ])

  return (
    <article className="habitta-editorial">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="habitta-container" style={{ paddingBlock: 'var(--space-6)' }}>
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
          {props.eyebrow}
        </p>

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
          {renderHeadline(props.title, props.titleEmphasis)}
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-display-stack)',
            fontSize: 'clamp(22px, 2.6vw, 32px)',
            lineHeight: 1.32,
            letterSpacing: '-0.3px',
            color: 'var(--charcoal)',
            fontWeight: 300,
            margin: '0 0 var(--space-5)',
            maxWidth: '38em',
          }}
        >
          {props.lede}
        </p>

        {props.thesis ? (
          <figure
            style={{
              margin: 'var(--space-5) 0 var(--space-6)',
              borderLeft: '3px solid var(--clay)',
              paddingLeft: 'var(--space-3)',
            }}
          >
            <blockquote
              style={{
                fontFamily: 'var(--font-display-stack)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                lineHeight: 1.22,
                letterSpacing: '-0.4px',
                color: 'var(--charcoal)',
                fontWeight: 300,
                margin: 0,
                maxWidth: '24em',
              }}
            >
              {props.thesis}
            </blockquote>
          </figure>
        ) : null}

        {props.factRows ? (
          <DataBlock rows={props.factRows} caption={props.factCaption} />
        ) : null}

        {props.insights.map((ins, idx) => (
          <section key={idx}>
            <p
              style={{
                fontFamily: 'var(--font-mono-stack)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--clay)',
                margin: 'var(--space-6) 0 var(--space-2)',
              }}
            >
              {tr('pillar.insight').replace('{number}', ins.number)}
            </p>
            <h2 style={{ ...h2Style, margin: '0 0 var(--space-3)' }}>
              {renderHeadline(ins.headline, ins.emphasis)}
            </h2>
            {ins.paragraphs.map((p, j) => (
              <p key={j} style={proseStyle}>{p}</p>
            ))}
          </section>
        ))}

        {props.table ? (
          <>
            <h2 style={h2Style}>
              {tr('pillar.table.h2.before')} <em style={{ fontStyle: 'italic', color: 'var(--clay)' }}>{tr('pillar.table.h2.emphasis')}</em>{tr('pillar.table.h2.after')}
            </h2>
            <ComparisonTable
              columns={props.table.columns}
              rows={props.table.rows}
              caption={props.table.caption}
            />
          </>
        ) : null}

        <h2 style={h2Style}>{props.closing.headline}</h2>
        {props.closing.paragraphs.map((p, i) => (
          <p key={i} style={proseStyle}>{p}</p>
        ))}

        <FAQ items={props.faqs} />

        <CTA
          headline={props.cta.headline}
          href={props.cta.href}
          duration={props.cta.duration}
        />

        <Metadata
          updated={props.meta.updated}
          nextReview={props.meta.nextReview}
          sources={props.meta.sources}
        />
      </div>
    </article>
  )
}
