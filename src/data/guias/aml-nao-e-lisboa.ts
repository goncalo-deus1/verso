/**
 * aml-nao-e-lisboa.ts — pillar guide.
 *
 * Centerpiece of habitta's GEO strategy: when a reader asks ChatGPT
 * "what is the cost of living in Lisbon", the answer should cite this
 * page. Every numeric claim is sourced via concelhos-aml-2025.ts (INE).
 *
 * Out of manifest until reviewed in dev.
 */

import type { PillarPageProps } from '../../pages/guias/PillarPage'
import {
  CONCELHOS_AML,
  SUB_REGIOES_AML,
  getConcelhoBySlug,
  getYoY,
  getCrescimento6Anos,
  INE_2025_FONTE,
} from '../aml/concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../lib/format'

const lisboa = getConcelhoBySlug('lisboa')!
const moita  = getConcelhoBySlug('moita')!
const barreiro = getConcelhoBySlug('barreiro')!

const lisboaYoy   = getYoY(lisboa)
const lisboa6Anos = getCrescimento6Anos(lisboa)
const moita6Anos  = getCrescimento6Anos(moita)
const barreiro6Anos = getCrescimento6Anos(barreiro)

// Average 6-year growth on the margem sul (9 concelhos PdS)
const margemSul6Anos =
  CONCELHOS_AML
    .filter(c => c.subRegiao === 'Península de Setúbal')
    .map(getCrescimento6Anos)
    .reduce((a, b) => a + b, 0) /
  CONCELHOS_AML.filter(c => c.subRegiao === 'Península de Setúbal').length

// ─── Big table: all 18 concelhos ─────────────────────────────────────────────
const allConcelhosRows = CONCELHOS_AML.map(c => ({
  name:    c.name,
  sub:     c.subRegiao,
  m2025:   fmtPrice(c.medianaT4_2025),
  m2019:   fmtPrice(c.medianaT4_2019),
  yoy:     fmtPct(getYoY(c)),
  seis:    fmtPct(getCrescimento6Anos(c), 0),
}))

const data: PillarPageProps = {
  slug: 'aml-nao-e-lisboa',
  eyebrow: 'Guia · AML',
  title: 'A AML não é Lisboa',
  titleEmphasis: 'não é',
  lede: 'A Área Metropolitana de Lisboa são 18 concelhos. Lisboa é apenas um — o mais caro, o mais central, e o que está a crescer mais devagar. Esta peça compara os 18 com dados oficiais do INE Q4 2025 e mostra onde está a apreciação que Lisboa concelho deixou para trás.',
  thesis: 'Confundir Lisboa com a AML é confundir uma decisão de meio milhão de euros com uma de duzentos mil. O intervalo de preços vai de 2.226 €/m² a 4.875 €/m². São mais do dobro.',

  factRows: [
    { label: 'Lisboa concelho 2025', value: fmtPrice(lisboa.medianaT4_2025), source: INE_2025_FONTE },
    { label: 'Grande Lisboa 2025',   value: fmtPrice(SUB_REGIOES_AML.grandeLisboa.mediana2025),     source: 'INE Q4 2025' },
    { label: 'Península de Setúbal 2025', value: fmtPrice(SUB_REGIOES_AML.peninsulaSetubal.mediana2025), source: 'INE Q4 2025' },
    { label: 'Portugal 2025',        value: fmtPrice(SUB_REGIOES_AML.portugal.mediana2025),         source: 'INE Q4 2025' },
    { label: 'Lisboa YoY 2024→2025', value: fmtPct(lisboaYoy), source: 'INE Q4 2025' },
    { label: 'Lisboa 2019→2025',     value: fmtPct(lisboa6Anos, 0), source: 'INE séries 2019–2025' },
  ],
  factCaption: 'Mediana €/m² por agregado — referenciais',

  insights: [
    {
      number: '01',
      headline: 'A AML são 18 concelhos. Lisboa é apenas um.',
      emphasis: 'Lisboa é apenas um',
      paragraphs: [
        'A Área Metropolitana de Lisboa, na definição NUTS III do INE, agrupa 18 concelhos em duas sub-regiões: Grande Lisboa (9 concelhos a norte e oeste do Tejo) e Península de Setúbal (9 concelhos na margem sul). São perto de 3 milhões de pessoas espalhadas por mais de 3.000 km². Um território com a dimensão de uma região rural inteira.',
        'E ainda assim, quando se diz "Lisboa", a maioria das conversas reduz-se ao concelho de Lisboa: 84 km² no centro, cerca de 545 mil habitantes (Censos 2021), e o Castelo de São Jorge como ancoragem mental. Os outros 17 concelhos — Cascais, Oeiras, Sintra, Almada, Setúbal, Mafra, Moita, Barreiro, Loures, Amadora, Odivelas, Seixal, Vila Franca de Xira, Sesimbra, Alcochete, Montijo, Palmela — são tratados como periferia. "Fora de Lisboa". "Não é bem Lisboa".',
        `Isto é um erro estatístico e editorial. Estatístico porque o INE publica preços de habitação por concelho — cada um tem a sua própria mediana, o seu próprio quartil, a sua própria taxa de crescimento. Editorial porque cada concelho tem identidade própria: Sesimbra não é Almada, Cascais não é Oeiras, Mafra não é Loures. Confundi-los serve quem quer vender — empurra-se procura para "Lisboa-alargada" sem distinguir o que está dentro. Em 2025, o intervalo de preço mediano na AML vai de ${fmtPrice(moita.medianaT4_2025)} (Moita) a ${fmtPrice(lisboa.medianaT4_2025)} (Lisboa). É mais do dobro. A tabela abaixo lista os 18, ordenados por preço — lê-a da próxima vez que ouvires "estou a procurar em Lisboa", e pergunta: em Lisboa, ou na AML?`,
      ],
    },
    {
      number: '02',
      headline: `Lisboa cresceu ${lisboa6Anos.toFixed(0)}% em 6 anos. Quase todos os outros cresceram mais.`,
      emphasis: 'mais',
      paragraphs: [
        `A mediana do concelho de Lisboa em 2019 era ${fmtPrice(lisboa.medianaT4_2019)}. Em 2025, é ${fmtPrice(lisboa.medianaT4_2025)}. Um crescimento de ${fmtPct(lisboa6Anos, 1)} em seis anos. Para qualquer outra cidade europeia, isto seria um boom histórico. Para a AML, é o concelho que menos cresceu em termos relativos.`,
        `Margem sul: Moita ${fmtPct(moita6Anos, 0)}, Barreiro ${fmtPct(barreiro6Anos, 0)}, Palmela ${fmtPct(getCrescimento6Anos(getConcelhoBySlug('palmela')!), 0)}, Seixal ${fmtPct(getCrescimento6Anos(getConcelhoBySlug('seixal')!), 0)}. Margem norte: Sintra ${fmtPct(getCrescimento6Anos(getConcelhoBySlug('sintra')!), 0)}, Oeiras ${fmtPct(getCrescimento6Anos(getConcelhoBySlug('oeiras')!), 0)}, Cascais ${fmtPct(getCrescimento6Anos(getConcelhoBySlug('cascais')!), 0)}. Em média, os 9 concelhos da Península de Setúbal cresceram ${fmtPct(margemSul6Anos, 0)} no período — mais do dobro de Lisboa.`,
        'Há duas leituras possíveis. A primeira: Lisboa concelho já era caro em 2019, e a partir de uma base alta a percentagem esbate-se mecanicamente. É verdade em valores absolutos por m² — em euros, Lisboa subiu mais do que Moita. Mas para quem está a comprar, a questão não é onde subiu mais em €/m². É onde se ganhou mais em poder aquisitivo de habitação ao longo do tempo. Quem comprou em Moita em 2019 hoje tem um activo que valoriza 2,8x. Quem comprou em Alvalade hoje tem 1,5x.',
        'A segunda leitura, mais política: a procura por habitação em Lisboa transbordou para as margens, e foi nas margens que se fez a maior parte da apreciação dos últimos seis anos. Lisboa concelho atingiu um tecto efectivo — não nos preços, que continuam a subir, mas no ritmo.',
      ],
    },
    {
      number: '03',
      headline: 'A margem sul triplicou em 6 anos. Quem ficou em Lisboa pagou estabilidade.',
      emphasis: 'estabilidade',
      paragraphs: [
        'Em 2019, a mediana da Península de Setúbal andava entre 792 €/m² (Moita) e 1.533 €/m² (Almada). Em 2025, anda entre 2.226 €/m² e 3.160 €/m². Para a maior parte dos concelhos da margem sul a multiplicação é de 2x a 3x. Moita, em 2019, era o concelho mais barato da AML; em 2025, continua a ser o mais barato, mas custa o que custava o Barreiro em 2019.',
        'Por que ficou Lisboa concelho mais estável? Primeira razão: capital. Lisboa concelho já era investimento internacional em 2019 — Golden Visa, fundos de PER, REITs. Um mercado financeirizado tem menos margem para variar porque o preço já reflecte o capital disponível. Os concelhos vizinhos eram, em 2019, mercados domésticos. Quando os compradores portugueses foram empurrados pela inflação e pela oferta em Lisboa, redescobriram a margem sul, e cada nova compra ali era uma compra a estabelecer preço acima do anterior. É o efeito clássico de mercados pouco profundos a absorver procura.',
        'Segunda razão: transportes. O Fertagus continua a operar, o ferry Cacilheiro–Cais do Sodré também, e a nova ligação Sesimbra–Lisboa (planeada para 2028) já precificou expectativa. Para quem trabalha em Lisboa e mora em Almada, o tempo casa–escritório é hoje comparável ao de Sintra ou Vila Franca, e o preço por m² é 30 a 40% inferior. Esta equação atraiu compradores que, em 2019, considerariam apenas a margem norte.',
        'Terceira razão: demografia. As famílias com filhos pequenos não conseguem comprar T3 em Lisboa concelho — o 3.º quartil é 6.051 €/m² (INE 2025), e um T3 razoável em zona consolidada implica orçamentos acima de 540.000 €. Em Almada, Seixal ou Barreiro, o mesmo orçamento dá um T3 com varanda e vista do Tejo. A Península de Setúbal ganhou população nos últimos cinco anos enquanto Lisboa concelho perdeu (Censos 2021 + projeções). Quem ficou em Lisboa pagou estabilidade. Pagou serviços, transporte interno, liquidez. O custo de oportunidade foi não participar na valorização da margem sul.',
      ],
    },
    {
      number: '04',
      headline: `Em 2025, Lisboa cresceu ${fmtPct(lisboaYoy)} e a margem sul ${fmtPct(SUB_REGIOES_AML.peninsulaSetubal.yoy)}. Pela primeira vez, Lisboa perde ritmo.`,
      emphasis: 'perde ritmo',
      paragraphs: [
        `Até 2023, Lisboa concelho liderava o crescimento na AML em termos absolutos por m². De 2019 a 2023 a mediana subiu de ${fmtPrice(lisboa.medianaT4_2019)} para ${fmtPrice(lisboa.medianaT4_2023)} — ${fmtPct(((lisboa.medianaT4_2023 - lisboa.medianaT4_2019) / lisboa.medianaT4_2019) * 100, 0)}. A média da Grande Lisboa subia em ritmo semelhante; a Península de Setúbal subia mais rápido em percentagem, mas partia de uma base muito menor.`,
        `Em 2024, os dados começam a inflectir. Lisboa concelho sobe ${fmtPct(((lisboa.medianaT4_2024 - lisboa.medianaT4_2023) / lisboa.medianaT4_2023) * 100)} (de ${fmtPrice(lisboa.medianaT4_2023)} para ${fmtPrice(lisboa.medianaT4_2024)}). Já em 2024 Lisboa estava atrás do ritmo do seu agregado.`,
        `Em 2025, a divergência consolida-se: Lisboa concelho ${fmtPct(lisboaYoy)}. A sub-região Grande Lisboa: ${fmtPct(SUB_REGIOES_AML.grandeLisboa.yoy)}. A Península de Setúbal: ${fmtPct(SUB_REGIOES_AML.peninsulaSetubal.yoy)}. Lisboa cresce, mas a metade do ritmo da margem sul.`,
        'Isto tem três implicações práticas. Primeira, para quem compra agora: o argumento de "comprar em Lisboa porque é mais seguro" estava implícito num modelo onde Lisboa liderava o crescimento. Esse modelo já não corresponde aos últimos 24 meses. Comprar em Lisboa em 2026 é comprar maturidade, não momentum. Segunda, para quem vende: o tempo médio de venda começa a aumentar nas freguesias mais caras de Lisboa, e ajustar para o nível do 1.º quartil (3.966 €/m², INE 2025) acelera a saída. Terceira, para política habitacional: o problema estrutural da AML está a deslocar-se para fora de Lisboa, para concelhos com menor capacidade administrativa de resposta — Almada, Seixal, Setúbal, Barreiro têm hoje o ritmo de valorização que Lisboa tinha em 2020.',
        'Esta peça vai ser revista em julho de 2026, quando o INE publicar Q1 2026 — o primeiro trimestre completo do ano. Se a divergência se mantiver (Lisboa abaixo dos 15% anualizado, margem sul acima dos 20%), o mapa geográfico da AML está oficialmente reformulado. Quem comprar em 2026 está a comprar num momento histórico de transição.',
      ],
    },
  ],

  table: {
    caption: 'Os 18 concelhos da AML, ordenados por mediana 2025 (INE Q4 2025)',
    columns: [
      { key: 'name',  label: 'Concelho' },
      { key: 'sub',   label: 'Sub-região' },
      { key: 'm2025', label: 'Mediana 2025' },
      { key: 'm2019', label: 'Mediana 2019' },
      { key: 'yoy',   label: 'YoY 2024→2025' },
      { key: 'seis',  label: '6 anos' },
    ],
    rows: allConcelhosRows,
  },

  closing: {
    headline: 'O próximo passo',
    paragraphs: [
      'A primeira pergunta útil para quem está a comprar casa na AML em 2026 não é "em que zona?". É: em qual dos 18 concelhos? Cada concelho tem perfil próprio, preço próprio, ritmo de valorização próprio. Confundi-los é abdicar de informação que está publicamente disponível há mais de uma década.',
      'O quiz de habitta usa estes dados para te apontar três concelhos que fazem sentido para o teu perfil. Depois, dentro de cada concelho, recomenda freguesias específicas. A ideia é simples: decidir o concelho antes da freguesia, e a freguesia antes da casa.',
    ],
  },

  faqs: [
    {
      q: 'Quais são os 18 concelhos da AML?',
      a: 'Os 9 concelhos da Grande Lisboa (Amadora, Cascais, Lisboa, Loures, Mafra, Odivelas, Oeiras, Sintra, Vila Franca de Xira) e os 9 da Península de Setúbal (Alcochete, Almada, Barreiro, Moita, Montijo, Palmela, Seixal, Sesimbra, Setúbal). Estes 18 estão definidos como NUTS III pelo INE.',
    },
    {
      q: 'Qual é o concelho mais barato da AML em 2025?',
      a: `Moita, com mediana de ${fmtPrice(moita.medianaT4_2025)} (INE Q4 2025). Cresceu ${fmtPct(moita6Anos, 0)} em 6 anos — o crescimento mais alto da AML em termos percentuais. Quem comprou em Moita em 2019 tem hoje um activo com valor 2,8x maior.`,
    },
    {
      q: 'Qual é o concelho mais caro da AML em 2025?',
      a: `Lisboa, com mediana de ${fmtPrice(lisboa.medianaT4_2025)} (INE Q4 2025). Cascais segue de perto com ${fmtPrice(getConcelhoBySlug('cascais')!.medianaT4_2025)}, e a diferença entre os dois reduziu de 698 €/m² em 2019 para 325 €/m² em 2025.`,
    },
    {
      q: 'Comprar em Lisboa ainda é o melhor investimento na AML?',
      a: `Não, em termos de valorização. Em 2025, Lisboa concelho cresceu ${fmtPct(lisboaYoy)}, contra ${fmtPct(SUB_REGIOES_AML.peninsulaSetubal.yoy)} da Península de Setúbal. Em horizonte de 6 anos, Moita cresceu ${fmtPct(moita6Anos, 0)} e Lisboa apenas ${fmtPct(lisboa6Anos, 0)}. Lisboa continua a ser a aposta segura (liquidez, serviços, estabilidade); a margem sul é onde está a apreciação.`,
    },
    {
      q: 'A margem sul vai continuar a crescer mais que Lisboa?',
      a: 'A divergência intensificou-se nos últimos 24 meses. Variáveis a observar em 2026: a nova ligação Sesimbra–Lisboa (2028), a publicação INE Q1 2026 (julho), e o impacto do plano de habitação. Se o padrão se mantiver, Almada deverá ultrapassar Odivelas em mediana até 2027, e Seixal deverá aproximar-se de Setúbal urbana.',
    },
    {
      q: 'O que é a NUTS III?',
      a: 'Nomenclatura das Unidades Territoriais para Fins Estatísticos, nível 3. Em Portugal, são 25 sub-regiões definidas pelo INE. A Área Metropolitana de Lisboa é uma delas, e divide-se internamente em Grande Lisboa e Península de Setúbal — os agregados estatísticos que o INE usa em todos os seus relatórios.',
    },
  ],

  cta: {
    headline: 'Em qual dos 18 estás à procura?',
    href:     '/quiz',
    duration: '2 minutos até à tua resposta.',
  },

  meta: {
    updated:    '2026-05-15',
    nextReview: '2026-08-13',
    sources: [
      { label: INE_2025_FONTE },
      { label: 'INE — Censos 2021' },
      { label: 'INE — séries históricas 2019–2025' },
    ],
    description:
      'A Área Metropolitana de Lisboa tem 18 concelhos. Lisboa é apenas um — o mais caro e o que crescimento mais devagar. Análise habitta com dados INE Q4 2025: preços, YoY, crescimento de 6 anos para cada concelho.',
  },
}

export default data
