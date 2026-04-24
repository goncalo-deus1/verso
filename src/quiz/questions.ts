/**
 * quiz/questions.ts
 *
 * Definições das 9 perguntas do quiz Habitta.
 * Cada opção tem um `value` que mapeia directamente para o tipo da resposta.
 */

import type { QuizAnswers } from './types'

export interface QuizOption {
  value: string
  label: string
}

export interface QuizQuestionDef {
  step: number                  // 1-based, para display
  field: keyof QuizAnswers
  question: string
  subtext?: string
  options: QuizOption[]
}

export const questions: QuizQuestionDef[] = [
  {
    step: 1,
    field: 'agregado_familiar',
    question: 'Com quem vais viver nesta casa?',
    subtext: 'A composição do agregado influencia o espaço, as escolas e o bairro ideal.',
    options: [
      { value: 'sozinho_a',            label: 'Sozinho/a' },
      { value: 'casal_sem_filhos',     label: 'Casal sem filhos' },
      { value: 'casal_com_filhos',     label: 'Casal com filhos em casa' },
      { value: 'familia_monoparental', label: 'Pai ou mãe a solo' },
      { value: 'ninho_vazio',          label: 'Filhos crescidos — a repensar o espaço' },
    ],
  },
  {
    step: 2,
    field: 'cidade_base',
    question: 'Onde precisam de estar durante a semana?',
    subtext: 'Pensem no vosso centro de gravidade actual — onde passam a maior parte do tempo.',
    options: [
      { value: 'lisboa',               label: 'Lisboa' },
      { value: 'porto',                label: 'Porto' },
      { value: 'outra',                label: 'Outra cidade' },
      { value: 'sem_localizacao_fixa', label: 'Não temos localização fixa' },
    ],
  },
  {
    step: 3,
    field: 'modo_trabalho',
    question: 'Como trabalham actualmente?',
    subtext: 'Considerem a situação dos dois — se for diferente, escolham o que define mais o dia-a-dia.',
    options: [
      { value: 'remoto',     label: '100% remoto' },
      { value: 'hibrido',    label: 'Híbrido' },
      { value: 'presencial', label: 'Presencial' },
    ],
  },
  {
    step: 4,
    field: 'tolerancia_commute',
    question: 'Qual o tempo máximo de deslocação aceitável?',
    subtext: 'De casa ao local de trabalho, cada sentido. Se for remoto, escolham o que prefeririam.',
    options: [
      { value: '15min',      label: 'Até 15 min' },
      { value: '15_30min',   label: '15 – 30 min' },
      { value: '30_60min',   label: '30 – 60 min' },
      { value: '60min_plus', label: 'Mais de 60 min' },
    ],
  },
  {
    step: 5,
    field: 'orcamento',
    question: 'Qual o vosso orçamento para comprar casa?',
    subtext: 'Incluam o que podem financiar. Consideram o total disponível, não o que já têm em cash.',
    options: [
      { value: 'ate_200k',   label: 'Até 200k€' },
      { value: '200k_350k',  label: '200k€ – 350k€' },
      { value: '350k_500k',  label: '350k€ – 500k€' },
      { value: '500k_plus',  label: '500k€+' },
    ],
  },
  {
    step: 6,
    field: 'lifestyle',
    question: 'Que estilo de vida preferem?',
    subtext: 'Pensem no dia-a-dia ideal, não apenas nos fins-de-semana.',
    options: [
      { value: 'urbano_dinamico',  label: 'Urbano e dinâmico' },
      { value: 'equilibrado',      label: 'Equilibrado' },
      { value: 'tranquilo_espaco', label: 'Tranquilo e com mais espaço' },
    ],
  },
  {
    step: 7,
    field: 'preferencia_casa',
    question: 'O que valorizam mais na casa?',
    subtext: 'Escolham o que é verdadeiramente prioritário — não o que seria ideal em todos.',
    options: [
      { value: 'localizacao_central',  label: 'Localização central' },
      { value: 'espaco_interior',      label: 'Espaço interior' },
      { value: 'espaco_exterior',      label: 'Espaço exterior' },
      { value: 'envolvente_natureza',  label: 'Envolvente / natureza' },
    ],
  },
  {
    step: 8,
    field: 'objetivo',
    question: 'Qual o principal objectivo da compra?',
    options: [
      { value: 'viver_longo_prazo', label: 'Viver a longo prazo' },
      { value: 'investimento',      label: 'Investimento / valorização' },
      { value: 'equilibrio',        label: 'Equilíbrio entre viver e investir' },
    ],
  },
  {
    step: 9,
    field: 'familia',
    question: 'Estão a planear mudanças familiares nos próximos anos?',
    subtext: 'A resposta influencia a adequação das zonas a diferentes fases de vida.',
    options: [
      { value: 'manter_estilo',   label: 'Não, queremos manter o estilo de vida actual' },
      { value: 'pensar_filhos',   label: 'Pensamos ter filhos' },
      { value: 'ja_temos_filhos', label: 'Já temos filhos' },
    ],
  },
]

export const TOTAL_STEPS = questions.length
