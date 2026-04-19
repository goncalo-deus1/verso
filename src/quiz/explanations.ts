/**
 * quiz/explanations.ts
 *
 * Gera explicações textuais contextualizadas — não são genéricas.
 * Cada texto usa as respostas do casal + os atributos reais da zona.
 *
 * Output por zona:
 *  - reasons: string[]  → 3 razões pelas quais a zona faz sentido
 *  - tradeOff: string   → 1 trade-off honesto
 *
 * Filosofia: texto de amigo que conhece o mercado, não de brochura imobiliária.
 * Inclui o "mas" quando ele existe.
 */

import type { Zone, QuizAnswers, ZoneScoreBreakdown } from './types'

// ─── Labels de leitura humana ────────────────────────────────────────────────

const CIDADE_LABEL: Record<string, string> = {
  lisboa: 'Lisboa',
  porto: 'Porto',
  outra: 'a vossa cidade',
  sem_localizacao_fixa: 'onde estiverem',
}

const ORCAMENTO_LABEL: Record<string, string> = {
  'ate_200k':  'até 200k€',
  '200k_350k': '200k–350k€',
  '350k_500k': '350k–500k€',
  '500k_plus': 'acima de 500k€',
}

const MODO_TRABALHO_LABEL: Record<string, string> = {
  remoto:      'em modo remoto',
  hibrido:     'em modelo híbrido',
  presencial:  'presencialmente',
}

// ─── Generators de razões ─────────────────────────────────────────────────────

type ReasonGenerator = (zone: Zone, answers: QuizAnswers, breakdown: ZoneScoreBreakdown) => string | null

const reasonGenerators: ReasonGenerator[] = [
  // ── Geografia ──
  (zone, answers, breakdown) => {
    if (answers.modo_trabalho === 'remoto') {
      return `Trabalham ${MODO_TRABALHO_LABEL[answers.modo_trabalho]} — a localização não limita as opções.`
    }
    if (breakdown.geografia >= 22) {
      const cidade = CIDADE_LABEL[answers.cidade_base]
      const commute = answers.cidade_base === 'lisboa' ? zone.tempoCentroLisboa : zone.tempoCentroPorto
      if (commute !== undefined) {
        return `A ${commute} minutos de ${cidade} — dentro da vossa tolerância de commute.`
      }
    }
    return null
  },

  // ── Orçamento ──
  (zone, answers, breakdown) => {
    if (breakdown.orcamento >= 16) {
      const orcLabel = ORCAMENTO_LABEL[answers.orcamento]
      return `Preço mínimo realista (${(zone.precoMin / 1000).toFixed(0)}k€) bem dentro do orçamento de ${orcLabel}.`
    }
    if (breakdown.orcamento >= 10) {
      return `Zona acessível para o vosso orçamento — com margem para negociação.`
    }
    return null
  },

  // ── Lifestyle ──
  (zone, answers) => {
    switch (answers.lifestyle) {
      case 'urbano_dinamico':
        if (zone.urbano >= 8) return `Vida urbana de nível ${zone.urbano}/10 — exactamente o que procuram.`
        if (zone.urbano >= 6) return `Boa oferta urbana — restaurantes, cultura e mobilidade no dia-a-dia.`
        break
      case 'equilibrado':
        if (zone.equilibrio >= 8) return `Zona com equilíbrio urbano-tranquilidade acima da média (${zone.equilibrio}/10).`
        if (zone.equilibrio >= 6) return `Bom equilíbrio entre cidade e tranquilidade.`
        break
      case 'tranquilo_espaco':
        if (zone.tranquilo >= 8) return `Tranquilidade de ${zone.tranquilo}/10 — sossego e ritmo próprio.`
        if (zone.tranquilo >= 6) return `Mais calma e espaço que uma zona urbana densa.`
        if (zone.espaco >= 8) return `Rácio espaço/€ excelente (${zone.espaco}/10) para quem quer mais área.`
        break
    }
    return null
  },

  // ── Preferência de casa ──
  (zone, answers) => {
    switch (answers.preferencia_casa) {
      case 'localizacao_central':
        if (zone.centralidade >= 8) return `Centralidade de ${zone.centralidade}/10 — tudo acessível a pé ou em transporte.`
        break
      case 'espaco_interior':
        if (zone.espaco >= 7) return `Espaço interior (${zone.espaco}/10) — mais metros quadrados pelo mesmo dinheiro.`
        break
      case 'espaco_exterior':
        if (zone.exterior >= 7) return `Exterior de ${zone.exterior}/10 — terraços, jardins e varandas são comuns.`
        break
      case 'envolvente_natureza':
        if (zone.natureza >= 7) return `Natureza de ${zone.natureza}/10 — mar, verde ou serra a minutos de casa.`
        break
    }
    return null
  },

  // ── Objetivo ──
  (zone, answers) => {
    switch (answers.objetivo) {
      case 'viver_longo_prazo':
        if (zone.qualidadeVida >= 8) return `Qualidade de vida de ${zone.qualidadeVida}/10 — infra-estrutura, saúde e comércio de nível.`
        break
      case 'investimento':
        if (zone.investimento >= 8) return `Potencial de investimento de ${zone.investimento}/10 — valorização e liquidez verificáveis.`
        if (zone.investimento >= 6) return `Mercado com procura estável e bom histórico de valorização.`
        break
      case 'equilibrio':
        if (zone.investimento >= 7 && zone.qualidadeVida >= 7) {
          return `Bom equilíbrio viver/investir — qualidade de vida (${zone.qualidadeVida}/10) e investimento (${zone.investimento}/10) acima da média.`
        }
        break
    }
    return null
  },

  // ── Família ──
  (zone, answers) => {
    switch (answers.familia) {
      case 'pensar_filhos':
        if (zone.familia >= 7) return `Zona com boa aptidão familiar (${zone.familia}/10) — escolas e espaço para quando essa fase chegar.`
        break
      case 'ja_temos_filhos':
        if (zone.familia >= 8) return `Zona familiar de referência (${zone.familia}/10) — escolas, segurança e espaço já disponíveis.`
        if (zone.familia >= 6) return `Infra-estrutura familiar presente — escolas e parques acessíveis.`
        break
      case 'manter_estilo':
        if (zone.qualidadeVida >= 8) return `Qualidade de vida (${zone.qualidadeVida}/10) alinhada com o estilo de vida que querem manter.`
        break
    }
    return null
  },

  // ── Fallback: descrição directa da zona ──
  (zone) => zone.pequenaDescricao.split('.')[0] + '.',
]

// ─── Generator de trade-off ───────────────────────────────────────────────────

/**
 * Gera 1 trade-off honesto — a maior tensão entre o que o casal quer
 * e o que a zona oferece menos bem.
 */
export function generateTradeOff(zone: Zone, answers: QuizAnswers): string {
  // Commute longo para presenciais
  if (answers.modo_trabalho === 'presencial') {
    const commute = answers.cidade_base === 'lisboa' ? zone.tempoCentroLisboa : zone.tempoCentroPorto
    if (commute && commute > 30) {
      const cidade = CIDADE_LABEL[answers.cidade_base]
      return `${commute} min diários a ${cidade} — pesado se for presencial todos os dias.`
    }
  }

  // Preço elevado vs orçamento
  const precoK = (zone.precoMin / 1000).toFixed(0)
  if (answers.orcamento === 'ate_200k' && zone.precoMin > 200_000) {
    return `Preço mínimo (${precoK}k€) está no limite — pouco espaço de manobra para negociar.`
  }
  if (answers.orcamento === '200k_350k' && zone.precoMin > 300_000) {
    return `Preço mínimo de ${precoK}k€ deixa pouca margem no orçamento de 200k–350k€.`
  }

  // Família vs inadequação
  if (['pensar_filhos', 'ja_temos_filhos'].includes(answers.familia) && zone.familia < 6) {
    return `Zona ainda a consolidar em termos familiares — escolas e parques podem exigir deslocação.`
  }

  // Lifestyle urbano numa zona tranquila
  if (answers.lifestyle === 'urbano_dinamico' && zone.urbano < 6) {
    return `Vida urbana limitada — para restaurantes e cultura, vai depender de deslocações.`
  }

  // Tranquilidade num zona muito urbana
  if (answers.lifestyle === 'tranquilo_espaco' && zone.tranquilo < 5) {
    return `Zona movimentada — o sossego que procuram pode ser difícil de encontrar aqui.`
  }

  // Natureza num zona sem natureza
  if (answers.preferencia_casa === 'envolvente_natureza' && zone.natureza < 5) {
    return `Pouca natureza imediata — verde e mar ficam a alguma distância.`
  }

  // Investimento fraco
  if (answers.objetivo === 'investimento' && zone.investimento < 6) {
    return `Mercado de liquidez limitada — vender no futuro pode ser mais demorado.`
  }

  // Isolamento (Comporta-like)
  if (zone.centralidade <= 3) {
    return `Zona isolada — carro obrigatório para tudo, sem transportes públicos relevantes.`
  }

  // Fallback genérico
  return `Verificar se o estilo de vida da zona corresponde ao dia-a-dia real e não apenas ao fim-de-semana.`
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Gera as 3 melhores razões para uma zona, contextualizadas com as respostas.
 * Percorre os generators em prioridade e recolhe os primeiros 3 não-nulos.
 */
export function generateReasons(
  zone: Zone,
  answers: QuizAnswers,
  breakdown: ZoneScoreBreakdown
): string[] {
  const reasons: string[] = []

  for (const gen of reasonGenerators) {
    if (reasons.length >= 3) break
    const result = gen(zone, answers, breakdown)
    if (result && !reasons.includes(result)) {
      reasons.push(result)
    }
  }

  return reasons
}
