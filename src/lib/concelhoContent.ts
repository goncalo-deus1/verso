/**
 * concelhoContent.ts
 * Carrega e parseia os ficheiros Markdown editoriais de /src/content/concelhos/*.md.
 * Usa import.meta.glob (Vite) para embeber o texto dos ficheiros no bundle em tempo de build.
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ConcelhoFrontmatter = {
  title: string
  slug: string
  meta_description: string
  language: string
  last_updated: string  // sempre YYYY-MM-DD como string
  canonical: string
}

export type ConcelhoSection = {
  heading: string  // texto do H2
  body: string     // markdown (pode incluir H3, parágrafos, bold, listas)
}

export type ConcelhoFAQ = {
  question: string
  answer: string
}

export type ConcelhoContent = {
  frontmatter: ConcelhoFrontmatter
  summary: string          // parágrafo **Resumo rápido:** como markdown
  updatedAt: string        // e.g. "30 de abril de 2026"
  sections: ConcelhoSection[]
  faqs: ConcelhoFAQ[]
  sources: string          // markdown da secção Fontes
  jsonLd: string           // JSON pronto para injetar no <head>
}

// ─── Glob (Vite embebe os ficheiros no bundle em build time) ─────────────────

const mdFiles = import.meta.glob<string>(
  '/src/content/concelhos/*.md',
  { query: '?raw', import: 'default', eager: true }
)

// ─── Parser de frontmatter (browser-safe, sem gray-matter) ───────────────────

/**
 * Extrai o bloco YAML entre os primeiros dois `---` e devolve o corpo restante.
 * Funciona com o nosso frontmatter simples (key: "value" ou key: value).
 * Não depende de Node.js — seguro para browser.
 */
function parseFrontmatterAndBody(raw: string): {
  fm: Record<string, string>
  body: string
} {
  // Normaliza CRLF
  const text = raw.replace(/\r\n/g, '\n')

  // Frontmatter: começa e termina com ---
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { fm: {}, body: text }

  const yamlBlock = match[1]
  const body      = match[2]
  const fm: Record<string, string> = {}

  for (const line of yamlBlock.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1 || colonIdx === 0) continue

    const key = line.slice(0, colonIdx).trim()
    let value = line.slice(colonIdx + 1).trim()

    // Remove aspas envolventes (simples ou duplas)
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

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Carrega e parseia o conteúdo editorial de um concelho pelo seu slug.
 * Devolve null se o ficheiro não existir — a página não deve partir nesse caso.
 */
export function loadConcelhoContent(slug: string): ConcelhoContent | null {
  const entry = Object.entries(mdFiles).find(([path]) =>
    path.endsWith(`-${slug}.md`)
  )
  if (!entry) return null

  const [, raw] = entry
  const { fm, body } = parseFrontmatterAndBody(raw)

  const frontmatter: ConcelhoFrontmatter = {
    title:            fm.title            ?? '',
    slug:             fm.slug             ?? '',
    meta_description: fm.meta_description ?? '',
    language:         fm.language         ?? 'pt-PT',
    last_updated:     fm.last_updated     ?? '',
    canonical:        fm.canonical        ?? '',
  }

  // O body tem 5 chunks separados por linhas HR (`\n---\n`):
  //   [0] intro  → H1 + Resumo rápido + *Atualizado*
  //   [1] secções editoriais H2/H3
  //   [2] Perguntas frequentes
  //   [3] Fontes
  //   [4] JSON-LD
  const chunks = body.split(/\n---\n/)

  const introChunk   = chunks[0] ?? ''
  const mainChunk    = chunks[1] ?? ''
  const faqChunk     = chunks[2] ?? ''
  const fontesChunk  = chunks[3] ?? ''
  const jsonLdChunk  = chunks[4] ?? ''

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

// ─── Helpers de parsing ───────────────────────────────────────────────────────

/** Extrai o parágrafo "**Resumo rápido:** ..." do chunk de introdução. */
function parseSummary(chunk: string): string {
  // Captura desde **Resumo rápido:** até ao fim do parágrafo (linha vazia ou *Atualizado*)
  const match = chunk.match(/(\*\*Resumo rápido:\*\*[\s\S]*?)(?=\n\n|\*Atualizado|$)/m)
  return match ? match[1].trim() : ''
}

/** Extrai a data de "Atualizado a X." do chunk de introdução. */
function parseUpdatedAt(chunk: string): string {
  const match = chunk.match(/\*Atualizado a ([^*]+)\.\*/)
  return match ? match[1].trim() : ''
}

/**
 * Parseia as secções H2 do bloco editorial principal.
 * Cada entrada tem heading (texto do H2) e body (markdown restante, incluindo H3s).
 */
function parseMainSections(chunk: string): ConcelhoSection[] {
  if (!chunk.trim()) return []

  // Divide no início de cada linha ## (lookahead para não consumir o delimitador)
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

/**
 * Parseia os pares Pergunta/Resposta do bloco de FAQs.
 * Cada ### é uma pergunta; o texto que se segue é a resposta.
 */
function parseFAQs(chunk: string): ConcelhoFAQ[] {
  if (!chunk.trim()) return []

  // Remove o cabeçalho "## Perguntas frequentes"
  const content = chunk.replace(/^## Perguntas frequentes\s*/m, '').trim()
  if (!content) return []

  // Divide no início de cada ### (lookahead)
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

/** Extrai o texto das fontes (remove o cabeçalho "## Fontes"). */
function parseSources(chunk: string): string {
  return chunk.replace(/^## Fontes\s*/m, '').trim()
}

/**
 * Extrai o JSON do bloco ```html ... ``` que contém o <script type="application/ld+json">.
 * Devolve string vazia se não existir ou se o JSON for inválido.
 */
function parseJsonLd(chunk: string): string {
  // Procura <script type="application/ld+json">...</script> dentro do bloco de código
  const scriptMatch = chunk.match(/<script[^>]*>([\s\S]*?)<\/script>/)
  if (!scriptMatch) return ''

  const json = scriptMatch[1].trim()
  try {
    JSON.parse(json)  // validação
    return json
  } catch {
    console.warn('[concelhoContent] JSON-LD inválido encontrado.')
    return ''
  }
}
