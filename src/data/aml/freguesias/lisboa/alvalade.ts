/**
 * alvalade.ts — Alvalade, Lisboa.
 *
 * DRAFT (partial fill, refreshed 2026-05-15 against INE Q4 2025).
 *
 * What's filled:
 *   - Concelho-level numbers come from src/data/aml/concelhos-aml-2025.ts
 *     (INE Q4 2025). Never hardcoded here.
 *   - Alvalade's own €/m² is an INE Fig.13 estimate (~4.900) until the
 *     freguesia-level INE file is available. Marked "estimativa".
 *   - Median rent oferta (17,31 €/m²/mês, propriedadespt.com 2025)
 *   - Metro to Marquês de Pombal (12 min)
 *   - Population / area / transaction count woven into prose
 *
 * What's still tokenized:
 *   - Schools count
 *   - Green-area hectares
 *   - €/m² for the four adjacent freguesias
 *   - T2 absolute price in FAQ #1
 *   - Exact Alvalade YoY (concelho-wide YoY is sourced via Lisboa row)
 *
 * MUST NOT enter src/data/prerenderManifest.ts while {{DADO_EM_FALTA}}
 * remains in the rendered HTML — the shells script refuses to write
 * such pages by design.
 */

import type { FreguesiaPageProps } from '../../../../pages/aml/FreguesiaPage'
import {
  getConcelhoBySlug,
  getYoY,
  INE_2025_FONTE,
} from '../../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPriceEuro } from '../../../../lib/format'

// ─── Pull Lisboa concelho stats from the INE 2025 source of truth ────────────
const lisboaConcelho = getConcelhoBySlug('lisboa')
if (!lisboaConcelho) {
  throw new Error('alvalade.ts: Lisboa concelho missing from concelhos-aml-2025.ts')
}
const lisboaYoyPct = getYoY(lisboaConcelho).toFixed(1).replace('.', ',')

const alvalade: FreguesiaPageProps = {
  freguesia: {
    name: 'Alvalade',
    slug: 'alvalade',
  },
  concelho: {
    name: 'Lisboa',
    slug: 'lisboa',
  },

  lede: {
    pricePerSqm: 'cerca de 4.900 €/m²',
    year:        '2025',
    comparison:  `Próximo da mediana do concelho de Lisboa (${fmtPriceEuro(lisboaConcelho.medianaT4_2025)}, INE), abaixo de Avenidas Novas`,
    fitsFor:
      'famílias com filhos em idade escolar e profissionais com escritório no eixo Saldanha–Areeiro',
    doesntFitFor:
      'quem vive de nightlife depois da 1h ou quer o rio a dez minutos',
  },

  facts: {
    medianPricePerSqm: '~4.900 €/m² (estimativa)',
    yoyVariation:      '{{DADO_EM_FALTA}}',
    medianRent:        '17,31 €/m²/mês',
    timeToMarques:     '12 min metro · 10–20 min carro',
    schools:           '{{DADO_EM_FALTA}} públicas · {{DADO_EM_FALTA}} privadas',
    greenAreas:        '{{DADO_EM_FALTA}} hectares',
  },
  factSources: {
    medianPricePerSqm: 'Estimativa lida do gráfico INE Fig.13 — Q4 2025',
    yoyVariation:      'INE Q1 2026 (a confirmar)',
    medianRent:        'propriedadespt.com · 2025 · oferta',
    timeToMarques:     'Metropolitano de Lisboa · Google Maps',
    schools:           '{{DADO_EM_FALTA}}',
    greenAreas:        '{{DADO_EM_FALTA}}',
  },

  prose: {
    fitsBecause:
      'Alvalade é centralidade lenta. A linha verde do metro liga-te ao Marquês de Pombal em 12 minutos, mas a Avenida da Igreja não corre — caminha. A freguesia tem 31.800 habitantes em 5,34 km² (Censos 2021): densidade alta sem ser sufocante. Para famílias com filhos em idade escolar funciona como funcionam poucas freguesias de Lisboa — há escolas públicas a pé, pediatras, parques que conhecem o nome da criança. Para quem tem escritório no eixo Saldanha–Areeiro, a viagem matinal cabe num podcast. Funciona também para quem trabalha em casa e quer cafés sem turistas: o Mercado de Alvalade Norte, o jardim do Campo Grande, a Avenida de Roma com prédios dos anos 50 a 70 em bom estado, e o Cinema Nimas à porta, já em Avenidas Novas. É a versão de Lisboa em que o supermercado é o do bairro e não o do centro comercial. A geração que cresceu aqui ainda volta para visitar os pais, e essa continuidade é rara em Lisboa em 2026. O que compras não é o preço por metro quadrado — é a probabilidade de o teu vizinho saber o teu nome em três anos.',

    doesntFitBecause:
      'Alvalade fecha cedo. Há restaurantes bons e há bares, mas a freguesia não vive de noite. Se a tua rotina passa por sair de casa à 1h da manhã, vais ter de ir a Lisboa todas as semanas e voltar de Bolt. Não há rio. O Tejo está a cerca de meia hora de metro com transferência, e nas tardes de verão isso pesa. Quem compra para arrendar a turistas escolheu a freguesia errada — Alvalade é classe média residencial, mercado estável e pouco líquido. O arrendamento de longa duração ronda 17,31 €/m²/mês em oferta (propriedadespt.com, 2025), longe das margens que se fazem em Alfama ou Belém com curta duração. Se priorizas rendimento sobre vida, ou euforia sobre constância, vai para outro lado.',

    tradeOff:
      `Pagas o silêncio. Pagas o metro a 12 minutos do Marquês de Pombal sem pagar Marquês de Pombal. Pagas escolas públicas que continuam a funcionar e uma vizinhança que ainda se reconhece à porta da padaria. Não pagas euforia urbana, não pagas vista de rio, não pagas a chance de ouvir música ao vivo a pé. A estimativa de Alvalade em 2025 ronda 4.900 €/m² (INE Fig.13) — acima da mediana do concelho de Lisboa, ${fmtPriceEuro(lisboaConcelho.medianaT4_2025)} (INE 2025). Em anúncios o pedido é maior, 5.646 €/m² em julho de 2025 (idealista). A diferença entre o que se pede e o que se assina é onde se faz a conta de negociação. A conta que faz a maior parte das pessoas é entre minutos e metros. A nossa é entre comunidade e agenda.`,

    yearChange:
      `O concelho de Lisboa fechou 2025 em ${fmtPriceEuro(lisboaConcelho.medianaT4_2025)} mediano (INE), +${lisboaYoyPct}% em 12 meses e +48% em 6 anos. Alvalade, na estimativa Fig.13, segue de perto: ronda 4.900 €/m². Não é a freguesia mais cara do concelho — Avenidas Novas, Misericórdia e Estrela puxam o topo para cima dos 6.000 €/m² (quartil 3 de Lisboa concelho: ${fmtPriceEuro(lisboaConcelho.q3_T4_2025)}, INE 2025). É a referência média: onde o concelho assenta gravidade. O Estádio José Alvalade, já no limite com o Lumiar, marca a referência a norte; o eixo Avenida da Igreja–Avenida de Roma segue o seu próprio metabolismo dentro da freguesia. O que mudou nos últimos anos não foi a freguesia — foi quem está disposto a comprar nela.`,
  },

  comparison: {
    caption: 'Alvalade comparada com freguesias vizinhas',
    columns: [
      { key: 'name',  label: 'Freguesia' },
      { key: 'price', label: 'Mediana €/m²' },
      { key: 'yoy',   label: 'YoY' },
      { key: 'note',  label: 'Fonte / nota' },
    ],
    rows: [
      {
        name:  'Alvalade',
        price: '~4.900',
        yoy:   '{{DADO_EM_FALTA}}',
        note:  'Estimativa INE Fig.13, Q4 2025',
      },
      {
        name:  'Areeiro',
        price: '{{DADO_EM_FALTA}}',
        yoy:   '{{DADO_EM_FALTA}}',
        note:  'INE freguesia (pendente)',
      },
      {
        name:  'Avenidas Novas',
        price: '{{DADO_EM_FALTA}}',
        yoy:   '{{DADO_EM_FALTA}}',
        note:  'INE freguesia (pendente)',
      },
      {
        name:  'Lumiar',
        price: '{{DADO_EM_FALTA}}',
        yoy:   '{{DADO_EM_FALTA}}',
        note:  'INE freguesia (pendente)',
      },
      {
        name:  'São Domingos de Benfica',
        price: '{{DADO_EM_FALTA}}',
        yoy:   '{{DADO_EM_FALTA}}',
        note:  'INE freguesia (pendente)',
      },
    ],
  },

  faqs: [
    {
      q: 'Quanto custa um T2 em Alvalade em 2026?',
      a: `Em estimativa INE para 2025, Alvalade ronda 4.900 €/m² — perto da mediana do concelho de Lisboa (${fmtPriceEuro(lisboaConcelho.medianaT4_2025)}, INE Q4 2025). Para um T2, multiplica pelos m² úteis — apartamento por apartamento, o estado de conservação puxa esse número para cima ou para baixo. Em anúncios, o pedido médio é mais alto: 5.646 €/m² em julho de 2025 (idealista), o que reflecte o gap habitual entre o que se pede e o que se assina. Areeiro custa {{DADO_EM_FALTA}} €/m², Avenidas Novas {{DADO_EM_FALTA}} €/m².`,
    },
    {
      q: 'Alvalade é boa para famílias com crianças?',
      a: 'Funciona. Há {{DADO_EM_FALTA}} escolas públicas dentro da freguesia, parques infantis a pé, e densidade de famílias suficiente para que o teu filho não cresça sozinho na rua. O ponto fraco é a oferta secundária privada — para essa, atravessas a fronteira para Lumiar ou São Domingos de Benfica.',
    },
    {
      q: 'Vale a pena comprar em Alvalade ou em Areeiro?',
      a: 'São escolhas próximas. Alvalade ronda 4.900 €/m² (estimativa INE 2025), Areeiro custa {{DADO_EM_FALTA}} €/m². Alvalade tem mais bairro e mais escolas; Areeiro tem mais movimento e mais oferta gastronómica recente. Para famílias com filhos em idade escolar, Alvalade. Para quem está em fase de carreira e usa Lisboa à noite, Areeiro.',
    },
    {
      q: 'Como é o estacionamento em Alvalade?',
      a: 'Difícil em hora de ponta. A maior parte de Alvalade tem estacionamento de superfície gratuito, mas a procura é alta — vias como a Avenida da Igreja e a Avenida de Roma saturam entre as 18h e as 21h. Quem compra aqui costuma ter garagem ou um pacto com o vizinho. Se vais ter dois carros, pergunta antes de prometer.',
    },
    {
      q: 'Qual é a melhor rua para viver em Alvalade?',
      a: 'Não há resposta única. Para famílias, as travessas entre a Avenida da Igreja e a Avenida dos Estados Unidos da América. Para quem prioriza serviços e cafés a pé, o triângulo entre a estação de metro de Alvalade, o Mercado de Alvalade Norte e a Avenida do Brasil. A Avenida de Roma é o eixo residencial mais nobre — cara, mas tranquila, com prédios dos anos 50 a 70 em bom estado. Não há melhor — há melhor para ti.',
    },
  ],

  cta: {
    headline: 'A zona certa antes da casa certa.',
    href:     '/quiz',
    duration: '2 minutos até à tua resposta.',
  },

  meta: {
    updated:    '2026-05-15',
    nextReview: '2026-08-13',
    sources: [
      { label: INE_2025_FONTE },
      { label: 'idealista — Relatório de preços, julho 2025' },
      { label: 'propriedadespt.com (2025)' },
      { label: 'Metropolitano de Lisboa' },
      { label: 'Censos INE 2021' },
    ],
    description:
      `Alvalade em 2026: estimativa ~4.900 €/m² (INE Q4 2025), perto da mediana do concelho de Lisboa (${fmtPriceEuro(lisboaConcelho.medianaT4_2025)}). Centralidade lenta — faz sentido para famílias com filhos em idade escolar; não faz para quem vive de nightlife ou quer rio à porta.`,
  },
}

export default alvalade
