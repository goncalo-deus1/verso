// questions.ts — As 8 perguntas do quiz Habitta (v3)

export const questions = {
  // ── Q1 — Para quem é a casa? ──────────────────────────────────────────────
  q1_intent: {
    order: 1,
    label: 'Para quem é a casa?',
    options: [
      { id: 'i1_single', label: 'Para viver sozinho/a' },
      { id: 'i2_couple', label: 'Para viver em casal' },
      { id: 'i3_family', label: 'Para viver em família' },
      { id: 'i4_invest', label: 'Para investir ou arrendar' },
    ],
  },

  // ── Q2 — Vais comprar ou arrendar? ────────────────────────────────────────
  q2_ownership: {
    order: 2,
    label: 'Vais comprar ou arrendar?',
    options: [
      { id: 'o1_buy',  label: 'Comprar', helper: 'primeira casa ou mudança' },
      { id: 'o2_rent', label: 'Arrendar', helper: 'por agora' },
    ],
  },

  // ── Q3 — Orçamento (duas variantes consoante Q2) ──────────────────────────
  q3_budget: {
    order: 3,
    // Label e opções dependem da resposta a Q2 — o UI lê labelBuy/labelRent e optionsBuy/optionsRent
    labelBuy:  'Qual o teu orçamento para comprar?',
    labelRent: 'Qual a tua renda máxima por mês?',
    optional: true,
    optionsBuy: [
      { id: 'b1_150',       label: 'Até 150.000 €' },
      { id: 'b2_150_250',   label: '150.000 – 250.000 €' },
      { id: 'b3_250_400',   label: '250.000 – 400.000 €' },
      { id: 'b4_400_600',   label: '400.000 – 600.000 €' },
      { id: 'b5_600plus',   label: 'Mais de 600.000 €' },
      { id: 'b6_undecided', label: 'Ainda estou a definir' },
    ],
    optionsRent: [
      { id: 'r1_600',       label: 'Até 600 €' },
      { id: 'r2_600_900',   label: '600 – 900 €' },
      { id: 'r3_900_1200',  label: '900 – 1200 €' },
      { id: 'r4_1200_1600', label: '1200 – 1600 €' },
      { id: 'r5_1600plus',  label: 'Mais de 1600 €' },
      { id: 'r6_undecided', label: 'Ainda estou a definir' },
    ],
  },

  // ── Q4 — Como trabalhas? ──────────────────────────────────────────────────
  q4_work: {
    order: 4,
    label: 'Como trabalhas atualmente?',
    options: [
      { id: 'w1_onsite',     label: 'Presencial — escritório fixo' },
      { id: 'w2_hybrid',     label: 'Híbrido — alguns dias em casa' },
      { id: 'w3_remote',     label: 'Remoto — trabalho de casa' },
      { id: 'w4_irrelevant', label: 'Entre projetos / irrelevante' },
    ],
  },

  // ── Q5 — Rotina de deslocação ─────────────────────────────────────────────
  q5_routine: {
    order: 5,
    label: 'No teu dia-a-dia, precisas de...',
    options: [
      {
        id: 'r1_walking',
        label: 'O centro a pé',
        helper: 'cafés, trabalho, amigos — tudo à distância de caminhada',
      },
      {
        id: 'r2_transit',
        label: 'Transportes frequentes',
        helper: 'não precisas de viver no centro, mas precisas de lá chegar fácil',
      },
      {
        id: 'r3_car',
        label: 'Carro e estacionamento',
        helper: 'vais onde precisas de ir, no teu tempo',
      },
      {
        id: 'r4_minimal',
        label: 'Pouco deslocamento',
        helper: 'a tua vida acontece maioritariamente perto de casa',
      },
    ],
  },

  // ── Q6 — Ambiente sonoro ──────────────────────────────────────────────────
  q6_sound: {
    order: 6,
    label: 'Onde vais viver, queres ouvir...',
    options: [
      {
        id: 's1_city',
        label: 'Cidade a respirar',
        helper: 'trânsito, esplanadas, gente — faz parte da vida urbana',
      },
      {
        id: 's2_neighborhood',
        label: 'Vizinhança tranquila',
        helper: 'som de fundo normal, pouca animação noturna',
      },
      {
        id: 's3_silence',
        label: 'Silêncio quase total',
        helper: 'natureza, ou rua sem trânsito nocturno',
      },
    ],
  },

  // ── Q7 — Tradeoff espaço vs. centralidade ─────────────────────────────────
  q7_tradeoff: {
    order: 7,
    label: 'Se tivesses de escolher agora, preferias...',
    options: [
      {
        id: 't1_space',
        label: 'Espaço grande, mais longe',
        helper: 'mais metros quadrados por euro, a cidade fica mais distante',
      },
      {
        id: 't2_central',
        label: 'Espaço compacto, mais central',
        helper: 'menos metros, mas perto de tudo',
      },
      {
        id: 't3_balance',
        label: 'Equilíbrio entre os dois',
        helper: 'casa média, a 15-25 minutos do centro',
      },
    ],
  },

  // ── Q8 — Prioridades (multi-select, máx. 2, p7_none mutuamente exclusivo) ─
  q8_priority: {
    order: 8,
    label: 'Se houver uma ou duas coisas que não queres mesmo abdicar...',
    optional: true,
    multiSelect: true,
    maxSelections: 2,
    options: [
      { id: 'p1_sea',          label: 'Mar e natureza',            helper: 'praia, rio, verde, vistas' },
      { id: 'p2_neighborhood', label: 'Vida de bairro',            helper: 'cafés, comércio local, gente conhecida' },
      { id: 'p3_family',       label: 'Escolas e família',         helper: 'boas escolas, parques, ambiente para crescer' },
      { id: 'p4_silence',      label: 'Silêncio e tranquilidade',  helper: 'longe do ruído urbano' },
      { id: 'p5_valuation',    label: 'Potencial de valorização',  helper: 'uma zona que vai valer mais daqui a 10 anos' },
      { id: 'p6_youth',        label: 'Animação e gente jovem',    helper: 'noites de semana com movimento, cultura, amigos' },
      { id: 'p7_none',         label: 'Nada disto em particular',  helper: 'confio no equilíbrio' },
    ],
  },
} as const

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type QuizAnswers = {
  q1_intent?:    'i1_single' | 'i2_couple' | 'i3_family' | 'i4_invest'
  q2_ownership?: 'o1_buy' | 'o2_rent'
  /** Merges buy option IDs (b*) and rent option IDs (r*) — active set depends on q2_ownership */
  q3_budget?:
    | 'b1_150' | 'b2_150_250' | 'b3_250_400' | 'b4_400_600' | 'b5_600plus' | 'b6_undecided'
    | 'r1_600' | 'r2_600_900' | 'r3_900_1200' | 'r4_1200_1600' | 'r5_1600plus' | 'r6_undecided'
  q4_work?:      'w1_onsite' | 'w2_hybrid' | 'w3_remote' | 'w4_irrelevant'
  q5_routine?:   'r1_walking' | 'r2_transit' | 'r3_car' | 'r4_minimal'
  q6_sound?:     's1_city' | 's2_neighborhood' | 's3_silence'
  q7_tradeoff?:  't1_space' | 't2_central' | 't3_balance'
  /** Ordered array — order of selection determines dampened-compounding weight priority */
  q8_priority?:  Array<'p1_sea' | 'p2_neighborhood' | 'p3_family' | 'p4_silence' | 'p5_valuation' | 'p6_youth' | 'p7_none'>
}

export const QUESTION_ORDER: (keyof typeof questions)[] = [
  'q1_intent', 'q2_ownership', 'q3_budget', 'q4_work',
  'q5_routine', 'q6_sound', 'q7_tradeoff', 'q8_priority',
]
