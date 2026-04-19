/**
 * quiz/types.ts
 *
 * Todos os tipos do sistema de quiz VERSO para casais.
 * Scoped aqui para não poluir os tipos globais do projecto.
 */

// ─── Respostas do quiz ────────────────────────────────────────────────────────

export type CidadeBase =
  | 'lisboa'
  | 'porto'
  | 'outra'
  | 'sem_localizacao_fixa'

export type ModoTrabalho =
  | 'remoto'
  | 'hibrido'
  | 'presencial'

export type ToleranciaCommute =
  | '15min'
  | '15_30min'
  | '30_60min'
  | '60min_plus'

export type Orcamento =
  | 'ate_200k'
  | '200k_350k'
  | '350k_500k'
  | '500k_plus'

export type Lifestyle =
  | 'urbano_dinamico'
  | 'equilibrado'
  | 'tranquilo_espaco'

export type PreferenciaCasa =
  | 'localizacao_central'
  | 'espaco_interior'
  | 'espaco_exterior'
  | 'envolvente_natureza'

export type Objetivo =
  | 'viver_longo_prazo'
  | 'investimento'
  | 'equilibrio'

export type Familia =
  | 'manter_estilo'
  | 'pensar_filhos'
  | 'ja_temos_filhos'

/** Respostas completas do casal ao quiz de 8 perguntas. */
export interface QuizAnswers {
  cidade_base: CidadeBase
  modo_trabalho: ModoTrabalho
  tolerancia_commute: ToleranciaCommute
  orcamento: Orcamento
  lifestyle: Lifestyle
  preferencia_casa: PreferenciaCasa
  objetivo: Objetivo
  familia: Familia
}

/** Respostas parciais — usadas durante o preenchimento do quiz. */
export type PartialQuizAnswers = Partial<QuizAnswers>

// ─── Dados de zona ────────────────────────────────────────────────────────────

/**
 * Zona habitacional com atributos numéricos (0–10) para scoring.
 * Todos os atributos de 0–10 são subjectivos mas calibrados de forma consistente.
 */
export interface Zone {
  id: string
  nome: string
  regiao: string

  /** Cidade a que a zona pertence / serve. */
  cidadesCompativeis: CidadeBase[]

  /**
   * Preço mínimo realista para comprar um T2 habitável na zona.
   * Usado pelo filtro de orçamento.
   */
  precoMin: number

  /** Tempo de deslocação a Lisboa centro em minutos (carro + transporte público). */
  tempoCentroLisboa?: number

  /** Tempo de deslocação ao Porto centro em minutos (carro + transporte público). */
  tempoCentroPorto?: number

  // ─── Atributos de lifestyle (0 = mínimo, 10 = máximo) ─────────────────────
  centralidade: number    // Acesso a centro urbano, serviços, mobilidade pedonal
  espaco: number          // Espaço interior disponível por € investido
  exterior: number        // Acesso a espaço exterior privado (jardim, terraço)
  natureza: number        // Proximidade a natureza, verde, costa, serra
  urbano: number          // Vida urbana, restaurantes, cultura, dinamismo
  equilibrio: number      // Mix vida urbana + tranquilidade
  tranquilo: number       // Sossego, segurança, ritmo mais lento
  investimento: number    // Potencial de valorização / liquidez de mercado
  qualidadeVida: number   // Qualidade de vida global (infra, saúde, comércio)
  familia: number         // Adequação para famílias: escolas, segurança, espaço

  /** 2-3 frases que descrevem a zona de forma justa e directa. */
  pequenaDescricao: string
}

// ─── Resultados de scoring ────────────────────────────────────────────────────

/**
 * Breakdown detalhado de como a zona pontuou em cada dimensão.
 * Soma total = até 100 pontos.
 */
export interface ZoneScoreBreakdown {
  geografia: number       // 0–30
  orcamento: number       // 0–20
  lifestyle: number       // 0–20
  preferenciaCasa: number // 0–10
  objetivo: number        // 0–10
  familia: number         // 0–10
  total: number           // 0–100
}

/** Uma zona com score, breakdown e explicações geradas. */
export interface ScoredZone {
  zone: Zone
  breakdown: ZoneScoreBreakdown
  score: number          // alias de breakdown.total para acesso rápido
  reasons: string[]      // 3 razões pelas quais a zona faz sentido para este casal
  tradeOff: string       // 1 trade-off honesto
}

/** Resultado final do quiz. */
export interface QuizResult {
  top: ScoredZone[]      // Top 3 (ou menos se < 3 passaram filtros)
  all: ScoredZone[]      // Todas as zonas scored e ordenadas por score desc
  answers: QuizAnswers
  filteredCount: number  // Número de zonas eliminadas pelos filtros
}
