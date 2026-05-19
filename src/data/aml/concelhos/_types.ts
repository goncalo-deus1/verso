/**
 * _types.ts — shared type for concelho hub data files.
 *
 * Each src/data/aml/concelhos/{slug}.ts exports a ConcelhoData object.
 * The file is pure data (no JSX, no React imports). The component
 * (ConcelhoHub.tsx) does all lookups using the slug:
 *   • INE numbers from concelhos-aml-2025.ts
 *   • Legacy fields (oneLine, honestDescription, etc.) from concelhosAML.ts
 *   • MD content pre-parsed at module load (eager ?raw import)
 *
 * ─────────────────────────────────────────────────────────────────
 * REGRA EDITORIAL — VERIFICAÇÃO DE ENTIDADES NOMEADAS (obrigatória)
 * ─────────────────────────────────────────────────────────────────
 *
 * Listas-bala de entidades nomeadas (escolas, hospitais, estações,
 * empresas, restaurantes, monumentos) requerem verificação obrigatória.
 *
 * Antes de incluir uma lista do tipo "X, Y e Z são as principais
 * escolas/hospitais/etc do concelho":
 *
 *   1. Cada entidade tem morada postal verificada via web search.
 *   2. A morada postal pertence à freguesia/concelho que se está
 *      a descrever.
 *   3. Marketing da própria entidade (ex: "between Sintra and
 *      Cascais") NÃO override morada postal.
 *   4. Se entidade muito reconhecida não estiver tecnicamente no
 *      concelho, é melhor não a mencionar do que mencioná-la com
 *      qualificador confuso.
 *
 * Prose narrativa contínua tem requisito de verificação igualmente
 * estrito, mas tende a errar menos porque cada entidade aparece com
 * contexto. Listas-bala são onde a maioria dos erros nasce.
 *
 * Aplica-se a:
 *   - Ficheiros MD em src/content/concelhos/
 *   - Ficheiros TS em src/data/aml/concelhos/ e src/data/aml/freguesias/
 *   - Lede e prose em pillar pieces (src/data/guias/)
 *   - Ficheiros .ts de comparação
 *   - Qualquer conteúdo gerado por sub-agentes ou Claude Code futuro
 *
 * Esta regra está no mesmo nível da regra de fontes para números
 * (INE Q4 2025 → todos os €/m², YoY, etc.): verificável ou fora.
 *
 * Origem: auditoria de 17 MDs em maio 2026 encontrou 11 erros de
 * entidade, 9 dos quais em listas-bala. Os casos-tipo:
 *   - "Salesianos do Estoril (Linda-a-Velha)" — escola em Cascais,
 *     atribuída a Oeiras.
 *   - "Carlucci American School em Cascais" — em Sintra.
 *   - "Colégio Vasco da Gama em Odivelas-Vila" — em Belas/Sintra.
 */

import type { ConcelhoMdContent } from '../../../lib/concelhoMdSync'

export type SubRegiaoNUTS = 'GRANDE LISBOA' | 'PENÍNSULA DE SETÚBAL'

export interface ConcelhoDataFreguesia {
  slug: string
  name: string
  /** Optional 1-line habitta-voice characterization. Only Lisboa has these so far. */
  microDesc?: string
  /** Whether a dedicated page exists at /aml/{concelho}/{slug}. */
  hasPage?: boolean
}

export interface ConcelhoData {
  /** Concelho slug. Must match a row in concelhos-aml-2025.ts AND in concelhosAML.ts. */
  slug: string
  /** Canonical URL path, leading slash. */
  canonicalUrl: string
  eyebrow: {
    kind: 'CONCELHO'
    subRegiao: SubRegiaoNUTS
  }
  /**
   * Habitta-voice lede. 2–4 sentences. Sourced numbers come inline from
   * the data file (computed via fmtPrice / fmtPct against INE 2025).
   */
  lede: string
  /** 4 neighbor concelho slugs for the INE comparison table. */
  comparisonNeighbors: string[]
  /** All freguesias of the concelho. For Lisboa, includes micro-descriptions. */
  freguesias: ConcelhoDataFreguesia[]
  /** Pre-parsed MD content (Portuguese), loaded synchronously via Vite ?raw at module load. */
  md: ConcelhoMdContent
  /**
   * Optional English version. When present and `lang === 'en'`, the
   * consumer should prefer this over `md`. When absent, the page
   * gracefully falls back to the PT content (the alternative is a
   * broken EN page — undesirable).
   */
  mdEn?: ConcelhoMdContent
  /** ISO YYYY-MM-DD. */
  updated: string
  nextReview: string
}
