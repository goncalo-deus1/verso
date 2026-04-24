/**
 * quiz/scoring.ts
 *
 * Motor de scoring ponderado — 6 dimensões, total 100 pontos.
 *
 * Pesos:
 *   geografia:        30 pts  ← distância, cidade, modo de trabalho
 *   orçamento:        20 pts  ← fit entre preço da zona e orçamento do casal
 *   lifestyle:        20 pts  ← estilo de vida preferido vs atributos da zona
 *   preferência casa: 10 pts  ← o que valorizam na casa/envolvente
 *   objetivo:         10 pts  ← viver, investir ou equilibrar
 *   família:          10 pts  ← adequação para o perfil familiar
 *
 * Cada função de score recebe (zone, answers) e retorna um número
 * dentro do peso máximo da sua dimensão.
 */

import type { Zone, QuizAnswers, ZoneScoreBreakdown } from './types'
import { orcamentoParaIdeal, orcamentoParaTecto, commuteParaMinutos } from './mapping'

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Normaliza um atributo 0–10 para o peso máximo da dimensão. */
function norm(attr: number, peso: number): number {
  return (attr / 10) * peso
}

/** Clamp a value to [0, max]. */
function clamp(v: number, max: number): number {
  return Math.min(Math.max(0, v), max)
}

// ─── 1. Score geográfico (0–30) ───────────────────────────────────────────────

/**
 * Avalia a adequação geográfica da zona ao perfil do casal.
 *
 * Lógica:
 *  - Remoto ou sem localização fixa → penalização mínima, foco na centralidade
 *  - Presencial/Híbrido → quanto melhor o commute vs tolerância, maior o score
 *
 * Destrinça entre "dentro de Lisboa/Porto" e "fora mas acessível":
 * estar a 5 min não é igual a estar a 55 min mesmo ambos "passarem" o filtro.
 */
export function scoreGeografia(zone: Zone, answers: QuizAnswers): number {
  const PESO = 30

  // Remoto ou sem localização fixa: commute não importa
  // Score baseado apenas na centralidade da zona (pode querer ficar próximo mesmo assim)
  if (
    answers.modo_trabalho === 'remoto' ||
    answers.cidade_base === 'sem_localizacao_fixa' ||
    answers.cidade_base === 'outra'
  ) {
    // 20 pts fixos (boa base) + até 10 pts de bónus pela centralidade
    return clamp(20 + norm(zone.centralidade, 10), PESO)
  }

  // Presencial ou híbrido: score proporcional ao quão confortável é o commute
  const commuteReal =
    answers.cidade_base === 'lisboa' ? zone.tempoCentroLisboa :
    answers.cidade_base === 'porto'  ? zone.tempoCentroPorto :
    undefined

  if (commuteReal === undefined) return 15 // sem dados → score neutro

  const toleranciaMin = commuteParaMinutos(answers.tolerancia_commute)
  const ratio = commuteReal / toleranciaMin // 0 = muito perto, 1 = no limite, >1 = fora

  if (ratio <= 0.25) return PESO               // excelente — muito abaixo da tolerância
  if (ratio <= 0.50) return clamp(27, PESO)    // muito bom
  if (ratio <= 0.75) return 22                 // bom
  if (ratio <= 1.00) return 16                 // aceitável — no limite
  if (ratio <= 1.25) return 10                 // streeeetch (só chega aqui em híbrido)
  return 5                                      // marginal
}

// ─── 2. Score orçamento (0–20) ────────────────────────────────────────────────

/**
 * Quão bem o preço da zona se encaixa no orçamento do casal?
 *
 * Lógica:
 *  - Zona muito abaixo do ideal → score alto (boa relação qualidade-preço)
 *  - Zona próxima do ideal → score alto (fit perfeito)
 *  - Zona acima do ideal mas abaixo do tecto → score moderado
 *  - Zona perto do tecto → score baixo (pouco espaço de manobra)
 */
export function scoreOrcamento(zone: Zone, answers: QuizAnswers): number {
  const PESO = 20
  const ideal = orcamentoParaIdeal(answers.orcamento)
  const tecto = orcamentoParaTecto(answers.orcamento)
  const preco = zone.precoMin

  if (preco <= ideal * 0.7) return PESO              // muito abaixo — excelente valor
  if (preco <= ideal)       return clamp(18, PESO)   // dentro do ideal
  if (preco <= ideal * 1.2) return 14                // ligeiramente acima do ideal
  if (preco <= tecto)       return 10                // acima mas ainda dentro do tecto
  if (preco <= tecto * 1.1) return 5                 // margem de negociação (passado pelo filtro)
  return 0                                            // não devia chegar aqui após filtro
}

// ─── 3. Score lifestyle (0–20) ────────────────────────────────────────────────

/**
 * Alinha o estilo de vida preferido com os atributos da zona.
 *
 * Mapeamento directo:
 *  - urbano_dinamico  → zone.urbano (principal) + zone.centralidade (bónus)
 *  - equilibrado      → zone.equilibrio (principal)
 *  - tranquilo_espaco → zone.tranquilo (principal) + zone.espaco (bónus)
 */
export function scoreLifestyle(zone: Zone, answers: QuizAnswers): number {
  const PESO = 20

  switch (answers.lifestyle) {
    case 'urbano_dinamico': {
      // 70% urbano + 30% centralidade
      const v = (zone.urbano * 0.7) + (zone.centralidade * 0.3)
      return clamp(Math.round(norm(v, PESO)), PESO)
    }
    case 'equilibrado': {
      // equilibrio é o atributo directo; pequeno bónus de qualidadeVida
      const v = (zone.equilibrio * 0.8) + (zone.qualidadeVida * 0.2)
      return clamp(Math.round(norm(v, PESO)), PESO)
    }
    case 'tranquilo_espaco': {
      // 60% tranquilo + 40% espaco
      const v = (zone.tranquilo * 0.6) + (zone.espaco * 0.4)
      return clamp(Math.round(norm(v, PESO)), PESO)
    }
  }
}

// ─── 4. Score preferência casa (0–10) ────────────────────────────────────────

/**
 * O que o casal mais valoriza na casa e envolvente.
 *
 * Mapeamento directo para atributo da zona.
 */
export function scorePreferenciaCasa(zone: Zone, answers: QuizAnswers): number {
  const PESO = 10

  switch (answers.preferencia_casa) {
    case 'localizacao_central': return clamp(Math.round(norm(zone.centralidade, PESO)), PESO)
    case 'espaco_interior':     return clamp(Math.round(norm(zone.espaco, PESO)), PESO)
    case 'espaco_exterior':     return clamp(Math.round(norm(zone.exterior, PESO)), PESO)
    case 'envolvente_natureza': return clamp(Math.round(norm(zone.natureza, PESO)), PESO)
  }
}

// ─── 5. Score objetivo (0–10) ────────────────────────────────────────────────

/**
 * Objetivo principal da compra.
 *
 * Mapeamento:
 *  - viver_longo_prazo → qualidadeVida
 *  - investimento      → investimento
 *  - equilibrio        → média de ambos
 */
export function scoreObjetivo(zone: Zone, answers: QuizAnswers): number {
  const PESO = 10

  switch (answers.objetivo) {
    case 'viver_longo_prazo': return clamp(Math.round(norm(zone.qualidadeVida, PESO)), PESO)
    case 'investimento':      return clamp(Math.round(norm(zone.investimento, PESO)), PESO)
    case 'equilibrio': {
      const v = (zone.qualidadeVida + zone.investimento) / 2
      return clamp(Math.round(norm(v, PESO)), PESO)
    }
  }
}

// ─── 6. Score família (0–10) ──────────────────────────────────────────────────

/**
 * Adequação da zona ao perfil familiar do casal.
 *
 * Combina duas respostas:
 *  - agregado_familiar: composição actual do agregado
 *  - familia: planos futuros
 *
 * Quem já tem filhos ou é monoparental → zona.familia pesa mais.
 * Quem está sozinho/a → zona.familia pesa menos; qualidadeVida domina.
 * Ninho vazio → tranquilidade e qualidade de vida.
 */
export function scoreFamilia(zone: Zone, answers: QuizAnswers): number {
  const PESO = 10

  // Peso base do atributo familia da zona consoante o agregado actual
  let familiaWeight: number
  switch (answers.agregado_familiar) {
    case 'casal_com_filhos':
    case 'familia_monoparental':
      familiaWeight = 0.8
      break
    case 'casal_sem_filhos':
      familiaWeight = 0.5
      break
    case 'ninho_vazio':
      familiaWeight = 0.3
      break
    case 'sozinho_a':
    default:
      familiaWeight = 0.2
      break
  }
  const qualidadeWeight = 1 - familiaWeight

  // Ajuste consoante planos futuros
  switch (answers.familia) {
    case 'ja_temos_filhos': {
      // Já foi capturado pelo agregado — zona.familia pesa 100%
      return clamp(Math.round(norm(zone.familia, PESO)), PESO)
    }
    case 'pensar_filhos': {
      // Preparar terreno: mistura do peso do agregado com reforço futuro
      const boostedFamilia = Math.min(1, familiaWeight + 0.2)
      const v = (zone.familia * boostedFamilia) + (zone.qualidadeVida * (1 - boostedFamilia))
      return clamp(Math.round(norm(v, PESO)), PESO)
    }
    case 'manter_estilo':
    default: {
      // Sem planos de mudança → mix baseado puramente no agregado actual
      const v = (zone.familia * familiaWeight) + (zone.qualidadeVida * qualidadeWeight)
      return clamp(Math.round(norm(v, PESO)), PESO)
    }
  }
}

// ─── Score total ──────────────────────────────────────────────────────────────

/**
 * Calcula o score completo de uma zona para um conjunto de respostas.
 * Retorna o breakdown detalhado + total.
 */
export function calcularScore(zone: Zone, answers: QuizAnswers): ZoneScoreBreakdown {
  const geografia      = scoreGeografia(zone, answers)
  const orcamento      = scoreOrcamento(zone, answers)
  const lifestyle      = scoreLifestyle(zone, answers)
  const preferenciaCasa = scorePreferenciaCasa(zone, answers)
  const objetivo       = scoreObjetivo(zone, answers)
  const familia        = scoreFamilia(zone, answers)

  const total = clamp(
    Math.round(geografia + orcamento + lifestyle + preferenciaCasa + objetivo + familia),
    100
  )

  return { geografia, orcamento, lifestyle, preferenciaCasa, objetivo, familia, total }
}
