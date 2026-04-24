// questions.ts — As 9 perguntas do quiz Habitta (v2)

export const questions = {
  q1_household: {
    order: 1,
    label: 'Qual é o teu contexto?',
    options: [
      { id: 'h1', label: 'Vivo sozinho' },
      { id: 'h2', label: 'Vivo em casal' },
      { id: 'h3', label: 'Vivo em casal com filhos' },
      { id: 'h4', label: 'Somos uma família numerosa' },
    ],
  },
  q2_budget: {
    order: 2,
    label: 'Qual é o teu orçamento?',
    help: 'Valor de compra. Se ainda não sabes, escolhe a última opção — ajustamos o cálculo.',
    options: [
      { id: 'b1', label: 'Até 250 mil €',             maxBudget: 250_000 },
      { id: 'b2', label: 'De 250 mil € a 400 mil €',  maxBudget: 400_000 },
      { id: 'b3', label: 'De 400 mil € a 600 mil €',  maxBudget: 600_000 },
      { id: 'b4', label: 'De 600 mil € a 1 milhão €', maxBudget: 1_000_000 },
      { id: 'b5', label: 'Mais de 1 milhão €',        maxBudget: Infinity },
      { id: 'b6', label: 'Ainda estou a definir',     maxBudget: null },
    ],
  },
  q3_lifestyle: {
    order: 3,
    label: 'Como gostavas de viver?',
    options: [
      { id: 'l1', label: 'No centro, com tudo a pé' },
      { id: 'l2', label: 'Num bairro residencial equilibrado' },
      { id: 'l3', label: 'Numa zona tranquila e familiar' },
      { id: 'l4', label: 'Perto do mar e com vida ao ar livre' },
      { id: 'l5', label: 'Numa zona com potencial de valorização' },
    ],
  },
  q4_work: {
    order: 4,
    label: 'Como trabalhas atualmente?',
    options: [
      { id: 'w1', label: 'Trabalho presencialmente' },
      { id: 'w2', label: 'Trabalho em regime híbrido' },
      { id: 'w3', label: 'Trabalho remotamente' },
      { id: 'w4', label: 'O trabalho não influencia a minha escolha' },
    ],
  },
  q5_commute: {
    order: 5,
    label: 'Quanto tempo de deslocação aceitas no dia a dia?',
    options: [
      { id: 'c1', label: 'Até 20 minutos',                maxMinutes: 20 },
      { id: 'c2', label: 'Até 35 minutos',                maxMinutes: 35 },
      { id: 'c3', label: 'Até 50 minutos',                maxMinutes: 50 },
      { id: 'c4', label: 'Não é uma prioridade para mim', maxMinutes: null },
    ],
  },
  q6_intent: {
    order: 6,
    label: 'Estás à procura de casa para quê?',
    options: [
      { id: 'i1', label: 'Comprar casa para viver' },
      { id: 'i2', label: 'Comprar casa para investir' },
      { id: 'i3', label: 'Arrendar casa' },
      { id: 'i4', label: 'Ainda estou a explorar opções' },
    ],
  },
  q7_priority: {
    order: 7,
    label: 'O que pesa mais na tua decisão?',
    help: 'Escolhe até duas.',
    multiSelect: true,
    maxSelections: 2,
    options: [
      { id: 'p1', label: 'Preço' },
      { id: 'p2', label: 'Espaço' },
      { id: 'p3', label: 'Localização' },
      { id: 'p4', label: 'Escolas e serviços' },
      { id: 'p5', label: 'Vida de bairro' },
      { id: 'p6', label: 'Potencial de valorização' },
    ],
  },
  q8_dwelling: {
    order: 8,
    label: 'Que tipo de imóvel procuras?',
    options: [
      { id: 'd1', label: 'Apartamento' },
      { id: 'd2', label: 'Moradia' },
      { id: 'd3', label: 'Tanto faz' },
    ],
  },
  q9_maturity: {
    order: 9,
    label: 'Preferes uma zona mais consolidada ou com margem de crescimento?',
    options: [
      { id: 'm1', label: 'Consolidada e previsível' },
      { id: 'm2', label: 'Equilibrada' },
      { id: 'm3', label: 'Em crescimento, com potencial de valorização' },
    ],
  },
} as const

export type QuizAnswers = {
  q1_household?: 'h1' | 'h2' | 'h3' | 'h4'
  q2_budget?:    'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6'
  q3_lifestyle?: 'l1' | 'l2' | 'l3' | 'l4' | 'l5'
  q4_work?:      'w1' | 'w2' | 'w3' | 'w4'
  q5_commute?:   'c1' | 'c2' | 'c3' | 'c4'
  q6_intent?:    'i1' | 'i2' | 'i3' | 'i4'
  q7_priority?:  Array<'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6'>
  q8_dwelling?:  'd1' | 'd2' | 'd3'
  q9_maturity?:  'm1' | 'm2' | 'm3'
}

export const QUESTION_ORDER: (keyof typeof questions)[] = [
  'q1_household', 'q2_budget', 'q3_lifestyle', 'q4_work', 'q5_commute',
  'q6_intent', 'q7_priority', 'q8_dwelling', 'q9_maturity',
]
