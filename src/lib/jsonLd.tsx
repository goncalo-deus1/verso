/**
 * jsonLd.ts — Schema.org JSON-LD builders for habitta editorial pages.
 *
 * Each helper returns a plain object (not a React element). Pages embed
 * the result via:
 *   <script type="application/ld+json"
 *           dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
 *
 * Or via the JsonLd component below.
 *
 * Why plain objects + JSON.stringify: pre-render writes the JSON-LD to
 * static HTML. AI crawlers extract from there, so the object must be
 * fully resolvable at build time (no React-only types).
 */

import type { FAQItem } from '../components/habitta/FAQ'

const BASE_URL = 'https://www.usehabitta.com'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ArticleInput {
  headline: string
  description: string
  url: string
  image?: string
  datePublished: string  // ISO YYYY-MM-DD
  dateModified?: string
  authorName?: string
}

export interface PlaceInput {
  name: string
  description: string
  url: string
  /** Concelho name, used for containedInPlace. */
  concelho: string
  geo?: {
    latitude: number
    longitude: number
  }
  /** Country override. Defaults to Portugal. */
  country?: string
}

export interface BreadcrumbCrumb {
  name: string
  url: string
}

export interface DatasetInput {
  name: string
  description: string
  url: string
  /** ISO date (YYYY-MM-DD) of last data refresh. */
  dateModified: string
  /** License URL or short name (e.g., "CC BY 4.0"). */
  license?: string
  /** Distribution URLs (CSV/JSON downloads). */
  distributionUrl?: string
  /** Content type of distribution. */
  distributionType?: string
  creatorName?: string
}

// ─── Builders ─────────────────────────────────────────────────────────────────

export function articleJsonLd(input: ArticleInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:      input.headline,
    description:   input.description,
    image:         input.image,
    datePublished: input.datePublished,
    dateModified:  input.dateModified ?? input.datePublished,
    author:        { '@type': 'Organization', name: input.authorName ?? 'Habitta' },
    publisher:     { '@type': 'Organization', name: 'Habitta', url: BASE_URL },
    inLanguage:    'pt-PT',
    url:           input.url,
  }
}

export function faqPageJsonLd(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function placeJsonLd(input: PlaceInput) {
  const place: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name:        input.name,
    description: input.description,
    url:         input.url,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: input.concelho,
      containedInPlace: {
        '@type': 'Country',
        name: input.country ?? 'Portugal',
      },
    },
  }
  if (input.geo) {
    place.geo = {
      '@type': 'GeoCoordinates',
      latitude:  input.geo.latitude,
      longitude: input.geo.longitude,
    }
  }
  return place
}

export function breadcrumbListJsonLd(crumbs: BreadcrumbCrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }
}

export function datasetJsonLd(input: DatasetInput) {
  const dataset: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name:         input.name,
    description:  input.description,
    url:          input.url,
    dateModified: input.dateModified,
    inLanguage:   'pt-PT',
  }
  if (input.license) dataset.license = input.license
  if (input.creatorName) {
    dataset.creator = { '@type': 'Organization', name: input.creatorName }
  }
  if (input.distributionUrl) {
    dataset.distribution = {
      '@type': 'DataDownload',
      contentUrl:   input.distributionUrl,
      encodingFormat: input.distributionType ?? 'application/json',
    }
  }
  return dataset
}

// ─── React helper ─────────────────────────────────────────────────────────────

/**
 * <JsonLd ld={…} /> — emits a <script type="application/ld+json"> element.
 * Use this inside React component trees; the prerender step serializes it
 * into the static HTML.
 */
export function JsonLd({ ld }: { ld: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  )
}
