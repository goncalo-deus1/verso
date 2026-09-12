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

export const HOMEPAGE_FAQS = [
  {
    q: 'O que e a habitta?',
    a: 'A habitta ajuda compradores a escolher primeiro a zona certa na Area Metropolitana de Lisboa, antes de comparar casas ou falar com agencias.',
  },
  {
    q: 'A habitta e uma agencia imobiliaria?',
    a: 'Nao. A habitta e uma ferramenta editorial e de decisao para compradores. Nao representa vendedores, nao empurra visitas e nao cobra comissoes de mediacao.',
  },
  {
    q: 'Que zonas cobre a habitta?',
    a: 'A habitta cobre os 18 concelhos da Area Metropolitana de Lisboa e esta a organizar guias por concelho, freguesia e perfil de comprador.',
  },
  {
    q: 'Como funciona o quiz da habitta?',
    a: 'O quiz cruza orcamento, transportes, estilo de vida, familia, tolerancia a risco urbano e prioridades pessoais para recomendar zonas que fazem sentido para cada comprador.',
  },
  {
    q: 'A habitta mostra casas a venda?',
    a: 'A habitta foca-se primeiro na escolha da zona. O objetivo e dar contexto suficiente para o comprador procurar imoveis com menos ruido e mais criterio.',
  },
] satisfies FAQItem[]

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

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': `${BASE_URL}/#organization`,
    name: 'habitta',
    legalName: 'habitta',
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    image: `${BASE_URL}/og-image.png`,
    description: 'Ferramenta editorial e de decisao para escolher zonas onde viver na Area Metropolitana de Lisboa antes de procurar casa.',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Area Metropolitana de Lisboa',
      containedInPlace: {
        '@type': 'Country',
        name: 'Portugal',
      },
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lisboa',
      addressCountry: 'PT',
    },
    priceRange: '€',
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'habitta',
    url: BASE_URL,
    inLanguage: 'pt-PT',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/blog?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function homepageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: 'habitta - A zona certa antes da casa certa',
    description: 'Encontra a zona da AML que faz sentido para a tua vida. Sem agencias, sem pressao, sem compromisso.',
    inLanguage: 'pt-PT',
    isPartOf: {
      '@id': `${BASE_URL}/#website`,
    },
    about: {
      '@id': `${BASE_URL}/#organization`,
    },
  }
}

export function homepageFaqJsonLd() {
  return faqPageJsonLd(HOMEPAGE_FAQS)
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
