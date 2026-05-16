/**
 * concelhoMdSync.ts — synchronous variant of concelhoContent.ts.
 *
 * Existing concelhoContent.ts uses an async glob loader (one .md per
 * client chunk). For the new /aml/:concelho hub we want the parsed
 * content available at module load time so the page is prerender-safe
 * and renders synchronously without a useEffect.
 *
 * Each data file imports its MD via Vite `?raw` and calls parseConcelhoMd
 * once. The result is part of the data file's exports.
 */

export interface ConcelhoFrontmatter {
  title: string
  slug: string
  meta_description: string
  language: string
  last_updated: string
  canonical: string
}

export interface ConcelhoSection {
  heading: string
  body: string
}

export interface ConcelhoFAQ {
  question: string
  answer: string
}

export interface ConcelhoMdContent {
  frontmatter: ConcelhoFrontmatter
  summary:   string
  updatedAt: string
  sections:  ConcelhoSection[]
  faqs:      ConcelhoFAQ[]
  sources:   string
  jsonLd:    string
}

// ─── Parser entry ─────────────────────────────────────────────────────────────

export function parseConcelhoMd(raw: string): ConcelhoMdContent {
  const { fm, body } = parseFrontmatterAndBody(raw)

  const frontmatter: ConcelhoFrontmatter = {
    title:            fm.title            ?? '',
    slug:             fm.slug             ?? '',
    meta_description: fm.meta_description ?? '',
    language:         fm.language         ?? 'pt-PT',
    last_updated:     fm.last_updated     ?? '',
    canonical:        fm.canonical        ?? '',
  }

  const chunks = body.split(/\n---\n/)
  const introChunk  = chunks[0] ?? ''
  const mainChunk   = chunks[1] ?? ''
  const faqChunk    = chunks[2] ?? ''
  const fontesChunk = chunks[3] ?? ''
  const jsonLdChunk = chunks[4] ?? ''

  return {
    frontmatter,
    summary:   parseSummary(introChunk),
    updatedAt: parseUpdatedAt(introChunk),
    sections:  parseMainSections(mainChunk),
    faqs:      parseFAQs(faqChunk),
    sources:   parseSources(fontesChunk),
    jsonLd:    parseJsonLd(jsonLdChunk),
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFrontmatterAndBody(raw: string): {
  fm: Record<string, string>
  body: string
} {
  const text = raw.replace(/\r\n/g, '\n')
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { fm: {}, body: text }
  const yamlBlock = match[1]
  const body      = match[2]
  const fm: Record<string, string> = {}
  for (const line of yamlBlock.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx <= 0) continue
    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key) fm[key] = value
  }
  return { fm, body }
}

function parseSummary(chunk: string): string {
  const match = chunk.match(/(\*\*Resumo rápido:\*\*[\s\S]*?)(?=\n\n|\*Atualizado|$)/m)
  if (!match) return ''
  return match[1]
    .replace(/^\*\*Resumo rápido:\*\*\s*/, '')
    .replace(/^Resumo rápido:\s*/, '')
    .trim()
}

function parseUpdatedAt(chunk: string): string {
  const match = chunk.match(/\*Atualizado a ([^*]+)\.\*/)
  return match ? match[1].trim() : ''
}

function parseMainSections(chunk: string): ConcelhoSection[] {
  if (!chunk.trim()) return []
  const parts = chunk.split(/(?=^## )/m).filter(s => s.trim())
  return parts.map(part => {
    const firstNewline = part.indexOf('\n')
    if (firstNewline === -1) {
      return { heading: part.replace(/^## /, '').trim(), body: '' }
    }
    const heading = part.slice(0, firstNewline).replace(/^## /, '').trim()
    const body    = part.slice(firstNewline + 1).trim()
    return { heading, body }
  })
}

function parseFAQs(chunk: string): ConcelhoFAQ[] {
  if (!chunk.trim()) return []
  const content = chunk.replace(/^## Perguntas frequentes\s*/m, '').trim()
  if (!content) return []
  const parts = content.split(/(?=^### )/m).filter(s => s.trim())
  return parts.map(part => {
    const firstNewline = part.indexOf('\n')
    if (firstNewline === -1) {
      return { question: part.replace(/^### /, '').trim(), answer: '' }
    }
    const question = part.slice(0, firstNewline).replace(/^### /, '').trim()
    const answer   = part.slice(firstNewline + 1).trim()
    return { question, answer }
  })
}

function parseSources(chunk: string): string {
  return chunk.replace(/^## Fontes\s*/m, '').trim()
}

function parseJsonLd(chunk: string): string {
  const scriptMatch = chunk.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  if (!scriptMatch) return ''
  const json = scriptMatch[1].trim()
  try {
    JSON.parse(json)
    return json
  } catch {
    return ''
  }
}
