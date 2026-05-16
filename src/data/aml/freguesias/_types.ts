/**
 * _types.ts — re-export of FreguesiaPageProps for the freguesias data layer.
 *
 * The canonical type lives in src/pages/aml/FreguesiaPage.tsx (next to
 * the component). This re-export gives every src/data/aml/freguesias/*.ts
 * file a single, stable import path and makes this directory the natural
 * home for the editorial rule below.
 *
 * ─────────────────────────────────────────────────────────────────
 * REGRA EDITORIAL — VERIFICAÇÃO DE ENTIDADES NOMEADAS (obrigatória)
 * ─────────────────────────────────────────────────────────────────
 *
 * Listas-bala de entidades nomeadas (escolas, hospitais, estações,
 * empresas, restaurantes, monumentos) requerem verificação obrigatória.
 *
 * Antes de incluir uma lista do tipo "X, Y e Z são as principais
 * escolas/hospitais/etc da freguesia":
 *
 *   1. Cada entidade tem morada postal verificada via web search.
 *   2. A morada postal pertence à freguesia/concelho que se está
 *      a descrever.
 *   3. Marketing da própria entidade (ex: "between Sintra and
 *      Cascais") NÃO override morada postal.
 *   4. Se entidade muito reconhecida não estiver tecnicamente na
 *      freguesia, é melhor não a mencionar do que mencioná-la com
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
 * entidade, 9 dos quais em listas-bala. Casos-tipo:
 *   - "Salesianos do Estoril (Linda-a-Velha)" — escola em Cascais,
 *     atribuída a Oeiras.
 *   - "Carlucci American School em Cascais" — em Sintra.
 *   - "Colégio Vasco da Gama em Odivelas-Vila" — em Belas/Sintra.
 */

export type { FreguesiaPageProps } from '../../../pages/aml/FreguesiaPage'
