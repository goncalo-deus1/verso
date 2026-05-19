// questions.ts — As 8 perguntas do quiz Habitta (v3)
//
// PT é a fonte de verdade (estrutura, IDs, ordem, scoring).
// `questionsEn` é um mirror estrito com as mesmas keys/IDs e apenas
// labels/helpers traduzidos. `getQuestions(lang)` devolve a versão certa.

import type { Lang } from '../../context/LanguageContext'

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

// ── EN mirror ────────────────────────────────────────────────────────────────
// Mesma forma que `questions`, com IDs idênticos. Apenas labels e helpers
// mudam. Os campos numéricos (order, maxSelections) e booleanos (optional,
// multiSelect) repetem-se exactamente.

export const questionsEn = {
  q1_intent: {
    order: 1,
    label: 'Who is the home for?',
    options: [
      { id: 'i1_single', label: 'To live on my own' },
      { id: 'i2_couple', label: 'To live as a couple' },
      { id: 'i3_family', label: 'To live as a family' },
      { id: 'i4_invest', label: 'To invest or rent out' },
    ],
  },
  q2_ownership: {
    order: 2,
    label: 'Are you buying or renting?',
    options: [
      { id: 'o1_buy',  label: 'Buy',  helper: 'first home or moving' },
      { id: 'o2_rent', label: 'Rent', helper: 'for now' },
    ],
  },
  q3_budget: {
    order: 3,
    labelBuy:  "What's your budget to buy?",
    labelRent: "What's your maximum monthly rent?",
    optional: true,
    optionsBuy: [
      { id: 'b1_150',       label: 'Up to €150,000' },
      { id: 'b2_150_250',   label: '€150,000 – €250,000' },
      { id: 'b3_250_400',   label: '€250,000 – €400,000' },
      { id: 'b4_400_600',   label: '€400,000 – €600,000' },
      { id: 'b5_600plus',   label: 'More than €600,000' },
      { id: 'b6_undecided', label: 'Still deciding' },
    ],
    optionsRent: [
      { id: 'r1_600',       label: 'Up to €600' },
      { id: 'r2_600_900',   label: '€600 – €900' },
      { id: 'r3_900_1200',  label: '€900 – €1,200' },
      { id: 'r4_1200_1600', label: '€1,200 – €1,600' },
      { id: 'r5_1600plus',  label: 'More than €1,600' },
      { id: 'r6_undecided', label: 'Still deciding' },
    ],
  },
  q4_work: {
    order: 4,
    label: 'How do you currently work?',
    options: [
      { id: 'w1_onsite',     label: 'In-person — fixed office' },
      { id: 'w2_hybrid',     label: 'Hybrid — some days at home' },
      { id: 'w3_remote',     label: 'Remote — work from home' },
      { id: 'w4_irrelevant', label: 'Between projects / N/A' },
    ],
  },
  q5_routine: {
    order: 5,
    label: 'In your day-to-day, you need…',
    options: [
      {
        id: 'r1_walking',
        label: 'The centre on foot',
        helper: 'cafés, work, friends — everything within walking distance',
      },
      {
        id: 'r2_transit',
        label: 'Frequent public transport',
        helper: "you don't need to live in the centre, but you need to get there easily",
      },
      {
        id: 'r3_car',
        label: 'Car and parking',
        helper: 'you go where you need to, on your own time',
      },
      {
        id: 'r4_minimal',
        label: 'Minimal commuting',
        helper: 'your life mostly happens near home',
      },
    ],
  },
  q6_sound: {
    order: 6,
    label: 'Where you live, you want to hear…',
    options: [
      {
        id: 's1_city',
        label: 'The city breathing',
        helper: 'traffic, terraces, people — part of urban life',
      },
      {
        id: 's2_neighborhood',
        label: 'A quiet neighbourhood',
        helper: 'normal background sound, little nightlife',
      },
      {
        id: 's3_silence',
        label: 'Near-total silence',
        helper: 'nature, or a street with no night traffic',
      },
    ],
  },
  q7_tradeoff: {
    order: 7,
    label: 'If you had to choose now, would you prefer…',
    options: [
      {
        id: 't1_space',
        label: 'More space, further out',
        helper: 'more square metres per euro, the city is further away',
      },
      {
        id: 't2_central',
        label: 'Compact space, more central',
        helper: 'less space, but close to everything',
      },
      {
        id: 't3_balance',
        label: 'A balance between the two',
        helper: 'mid-sized home, 15–25 minutes from the centre',
      },
    ],
  },
  q8_priority: {
    order: 8,
    label: "If there are one or two things you really can't give up…",
    optional: true,
    multiSelect: true,
    maxSelections: 2,
    options: [
      { id: 'p1_sea',          label: 'Sea and nature',           helper: 'beach, river, greenery, views' },
      { id: 'p2_neighborhood', label: 'Neighbourhood life',       helper: 'cafés, local shops, familiar faces' },
      { id: 'p3_family',       label: 'Schools and family',       helper: 'good schools, parks, room to grow up' },
      { id: 'p4_silence',      label: 'Silence and tranquillity', helper: 'away from urban noise' },
      { id: 'p5_valuation',    label: 'Appreciation potential',   helper: 'an area that will be worth more in 10 years' },
      { id: 'p6_youth',        label: 'Buzz and young people',    helper: 'midweek nights with movement, culture, friends' },
      { id: 'p7_none',         label: 'None of this in particular', helper: 'I trust the balance' },
    ],
  },
} as const

/**
 * Devolve a versão localizada das perguntas. PT é o default.
 * O cast para `typeof questions` mantém-se compatível com consumers
 * que esperam o shape exacto do source PT (os IDs e a estrutura batem).
 */
export function getQuestions(lang: Lang): typeof questions {
  return (lang === 'en' ? (questionsEn as unknown as typeof questions) : questions)
}
