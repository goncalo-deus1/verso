// TODO (sessão futura): script de fetching para popular hardFacts a partir
// de INE (população, idade, tendência) e Idealista (renda mediana T2).
// Os vetores permanecem editoriais — validação humana obrigatória.

import type { ZoneVector } from './vectorSchema'
import { VECTOR_DIMENSIONS } from './vectorSchema'
import { freguesias, type Freguesia } from './freguesias'

export type Concelho = {
  slug: string
  name: string
  margem: 'norte' | 'sul'
  circulo: 1 | 2 | 3
  vector: ZoneVector
  oneLine: string
  honestDescription: string
  whoFitsHere: string
  whoDoesNotFit: string
  hardFacts: {
    populationApprox: number | null
    medianCommuteToLisboaBaixaMinutes: number | null
    medianT2RentEuros: number | null
    populationTrend3y: 'growing' | 'stable' | 'declining' | null
  }
  freguesiasCovered: string[]
  photoCredits: Array<{ url: string; source: 'unsplash' | 'pexels' | 'owner'; author?: string }>
}

// ─── Utility: calcula o vector de um concelho a partir das suas freguesias cobertas ──

export function computeConcelhoVectorFromFreguesias(
  concelhoSlug: string,
  allFreguesias: Freguesia[]
): ZoneVector {
  const covered = allFreguesias.filter(f => f.concelhoSlug === concelhoSlug)
  if (covered.length === 0) {
    throw new Error(`computeConcelhoVectorFromFreguesias: nenhuma freguesia coberta para "${concelhoSlug}"`)
  }
  const n = covered.length
  const result = {} as Record<string, number>
  for (const dim of VECTOR_DIMENSIONS) {
    const sum = covered.reduce((acc, f) => acc + f.vector[dim], 0)
    result[dim] = Math.round(sum / n) as 0 | 1 | 2 | 3
  }
  return result as ZoneVector
}

// ─── Helper: vector fixo para concelhos sem cobertura de freguesia ────────────

function v(
  pace: 0|1|2|3, central: 0|1|2|3, green: 0|1|2|3, night: 0|1|2|3,
  family: 0|1|2|3, food: 0|1|2|3, walkable: 0|1|2|3, price: 0|1|2|3, character: 0|1|2|3
): ZoneVector {
  return { pace, central, green, night, family, food, walkable, price, character }
}

// Vetores fixos para concelhos sem cobertura de parishes
const HARDCODED_VECTORS: Record<string, ZoneVector> = {
  odivelas:              v(2, 1, 1, 1, 2, 1, 2, 1, 1),
  loures:                v(1, 1, 2, 1, 2, 1, 1, 1, 1),
  mafra:                 v(1, 0, 3, 1, 1, 1, 1, 1, 2),
  'vila-franca-de-xira': v(1, 0, 2, 1, 2, 1, 1, 1, 1),
  barreiro:              v(2, 1, 1, 1, 2, 1, 2, 1, 1),
  moita:                 v(1, 0, 2, 1, 2, 1, 1, 1, 1),
  montijo:               v(1, 0, 2, 1, 2, 1, 1, 1, 1),
  alcochete:             v(1, 0, 2, 1, 2, 1, 1, 1, 1),
  sesimbra:              v(1, 0, 3, 1, 1, 2, 1, 1, 2),
  palmela:               v(1, 0, 3, 1, 1, 1, 1, 1, 2),
}

// ─── Os 18 concelhos da AML ───────────────────────────────────────────────────

const concelhoData: Omit<Concelho, 'vector'>[] = [

  // ── Círculo 1 (Lisboa) ──────────────────────────────────────────────────────

  {
    slug: 'lisboa',
    name: 'Lisboa',
    margem: 'norte',
    circulo: 1,
    oneLine: 'A capital a sério — onde tudo custa mais e tudo está mais perto.',
    honestDescription:
      'Lisboa é a soma das suas freguesias — e cada uma delas tem um carácter próprio que o mapa administrativo não consegue capturar. ' +
      'O que une todas é a densidade: serviços, transportes, oferta cultural, mercado de trabalho. ' +
      'E o que divide é o preço: comprar dentro de Lisboa concelho é, em média, pagar o triplo do que se paga no Seixal pela mesma área útil. ' +
      'O município tem investido em reabilitação urbana nos bairros históricos, com resultados visíveis mas desiguais. ' +
      'As escolas públicas de referência existem, mas a procura excede a oferta nas freguesias mais valorizadas. ' +
      'O negativo estrutural: Lisboa não cresce em população de forma sustentada — cresce em preço e encolhe em residentes efectivos. ' +
      'Quem compra aqui está a comprar acesso à cidade, não apenas um endereço.',
    whoFitsHere:
      'Quem quer cidade a 100% — sem percurso, sem dependência de carro, com tudo resolvido a pé ou a uma viagem de metro.',
    whoDoesNotFit:
      'Quem precisa de área grande por preço razoável, ou de jardim privado como condição não negociável.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null,
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'declining',
    },
    freguesiasCovered: [
      'campo-de-ourique', 'principe-real', 'alvalade', 'graca-sao-vicente',
      'alcantara', 'marvila-beato', 'parque-das-nacoes', 'benfica',
      'estrela', 'areeiro', 'arroios', 'belem',
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/lisbon-tejo-city', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/lisbon-miradouro-alfama', source: 'unsplash' },
    ],
  },

  // ── Círculo 2 (Margem Norte) ────────────────────────────────────────────────

  {
    slug: 'oeiras',
    name: 'Oeiras',
    margem: 'norte',
    circulo: 2,
    oneLine: 'A linha de Cascais a preços ainda razoáveis — antes que a janela feche.',
    honestDescription:
      'Oeiras é o concelho da AML com melhor equilíbrio entre acessibilidade a Lisboa, qualidade de vida e preço — por agora. ' +
      'A linha de comboio de Cascais atravessa o concelho de leste a oeste, com múltiplas estações a menos de vinte e cinco minutos do Cais do Sodré. ' +
      'O Taguspark atraiu empresas de tecnologia e criou um mercado de trabalho local que reduz a pressão de percurso. ' +
      'As escolas públicas têm boa reputação média, e os jardins junto ao Tejo são bem mantidos. ' +
      'O negativo: a valorização dos últimos cinco anos foi rápida, e o diferencial de preço em relação a Lisboa estreitou-se significativamente. ' +
      'O que era barato por comparação já não é — é apenas menos caro.',
    whoFitsHere:
      'Famílias com crianças que precisam de escola pública de qualidade, comboio para Lisboa e jardim sem precisar de carro.',
    whoDoesNotFit:
      'Quem procura o preço de há cinco anos, ou quer distância a pé de Lisboa sem qualquer percurso.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    freguesiasCovered: ['oeiras-sao-juliao-da-barra', 'pacos-de-arcos', 'algés'],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/oeiras-tejo-linha-cascais', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/taguspark-oeiras-portugal', source: 'unsplash' },
    ],
  },

  {
    slug: 'cascais',
    name: 'Cascais',
    margem: 'norte',
    circulo: 2,
    oneLine: 'O Atlântico no jardim e Lisboa a quarenta minutos — o preço é o que é.',
    honestDescription:
      'Cascais é o concelho mais atlântico da AML — costa longa, ventos fortes, praias com nome próprio. ' +
      'A linha de comboio faz a ligação ao Cais do Sodré em menos de quarenta minutos desde Cascais vila, e em menos de trinta desde Carcavelos. ' +
      'A qualidade de vida medida em espaço verde, ar e espaço público está entre as mais altas da região. ' +
      'O mercado imobiliário reflecte isso: Cascais é o segundo concelho mais caro da AML depois de Lisboa, com procura sustentada de compradores nacionais e estrangeiros. ' +
      'O negativo mais prático: fora da época de verão, o ritmo desacelera — o comércio abranda, as esplanadas fecham, a vila fica mais silenciosa do que parece nos meses quentes.',
    whoFitsHere:
      'Quem quer praia atlântica, vila com vida própria e tolerância para o percurso de comboio diário para Lisboa.',
    whoDoesNotFit:
      'Quem espera preços acessíveis, serviços de Lisboa a minutos, ou actividade urbana densa todo o ano.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    freguesiasCovered: ['cascais-estoril', 'carcavelos-parede'],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/cascais-atlantic-village-portugal', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/cascais-boca-do-inferno', source: 'unsplash' },
    ],
  },

  {
    slug: 'sintra',
    name: 'Sintra',
    margem: 'norte',
    circulo: 2,
    oneLine: 'A Serra, os palácios e a linha de comboio — três razões que ainda não chegam a toda a gente.',
    honestDescription:
      'Sintra é o concelho da AML com maior diversidade interna: da vila histórica Património da UNESCO aos subúrbios dormitório de Cacém, a diferença é de mundos dentro do mesmo mapa. ' +
      'A linha de comboio de Sintra é uma das mais frequentes da região e liga ao Rossio e ao Oriente com regularidade. ' +
      'O parque natural de Sintra-Cascais cobre uma parte significativa do concelho e torna o verde acessível de forma quase única. ' +
      'O negativo mais claro: a qualidade do espaço urbano varia imenso de freguesia para freguesia. ' +
      'Escolher Sintra implica escolher uma freguesia específica — o município não é uma unidade homogénea.',
    whoFitsHere:
      'Quem quer natureza próxima e comboio para Lisboa, e tem paciência para escolher bem a freguesia dentro do concelho.',
    whoDoesNotFit:
      'Quem espera consistência de qualidade urbana em todo o concelho, ou quer resultados sem pesquisa cuidadosa.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    freguesiasCovered: ['sintra-santa-maria', 'queluz', 'agualva-cacem'],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/sintra-palace-portugal', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/sintra-serra-nature', source: 'unsplash' },
    ],
  },

  {
    slug: 'amadora',
    name: 'Amadora',
    margem: 'norte',
    circulo: 2,
    oneLine: 'O concelho mais denso da AML — onde o preço ainda não chegou e o metro já chegou.',
    honestDescription:
      'A Amadora é o município mais densamente povoado de Portugal continental — uma cidade que cresceu por acumulação sem plano de conjunto. ' +
      'O metro serve o eixo principal com ligação directa à Baixa em menos de vinte minutos. ' +
      'O preço médio de habitação é um dos mais baixos da margem norte, o que atrai compradores com orçamento restrito que precisam de estar perto de Lisboa. ' +
      'A oferta de serviços é razoável: hospital, escolas, comércio. ' +
      'O negativo mais concreto: a qualidade do espaço público é desigual, e alguns bairros têm problemas de coesão social que a proximidade a Lisboa não resolve.',
    whoFitsHere:
      'Quem precisa de metro para Lisboa e tem orçamento reduzido, sem exigências de qualidade de espaço público ou estética urbana.',
    whoDoesNotFit:
      'Quem procura bairro com identidade, rua com vida própria, ou qualidade de espaço público consistente.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    freguesiasCovered: ['alfragide'],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/amadora-lisbon-suburb', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/amadora-metro-lisbon', source: 'unsplash' },
    ],
  },

  {
    slug: 'odivelas',
    name: 'Odivelas',
    margem: 'norte',
    circulo: 2,
    oneLine: 'O metro chegou — e os preços ainda não perceberam.',
    honestDescription:
      'Odivelas ganhou metro em 2002 e a valorização que se seguiu foi real mas não ainda completa. ' +
      'O percurso ao centro de Lisboa é de vinte a vinte e cinco minutos na linha amarela, sem transferência. ' +
      'O parque urbano e o comércio de bairro cobrem o essencial. ' +
      'A qualidade do espaço urbano é variável — há zonas mais cuidadas e outras que reflectem o crescimento rápido dos anos 1980-90. ' +
      'O negativo mais prático: Odivelas não tem uma identidade de cidade forte — é percebida como extensão de Lisboa, o que torna a procura dependente do diferencial de preço.',
    whoFitsHere:
      'Quem quer metro directo a Lisboa, preço abaixo de Lisboa, e não precisa de identidade de bairro forte.',
    whoDoesNotFit:
      'Quem quer cidade com vida própria independente de Lisboa, ou investe esperando valorização rápida sem outros catalisadores.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/odivelas-lisbon-metro', source: 'unsplash' },
    ],
  },

  {
    slug: 'loures',
    name: 'Loures',
    margem: 'norte',
    circulo: 2,
    oneLine: 'Norte de Lisboa com mais campo do que cidade — e uma ligação de metro que está a mudar isso.',
    honestDescription:
      'Loures é um município vasto com realidades muito distintas: desde as zonas urbanas próximas de Odivelas e da linha de metro, até às áreas mais rurais a norte junto ao rio Grande da Pipa. ' +
      'A extensão do metro até Loures (estação de Loures inaugurada em 2024) está a mudar a percepção do concelho. ' +
      'Os preços são dos mais baixos da margem norte por comparação com o nível de serviços disponíveis. ' +
      'O negativo mais estrutural: a identidade do município é difusa — não há um centro de Loures reconhecível que sirva como âncora.',
    whoFitsHere:
      'Quem procura preço baixo, algum verde, e uma ligação de metro que cresce de importância.',
    whoDoesNotFit:
      'Quem precisa de bairro com identidade, espaço urbano consolidado, ou centro de cidade de referência.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/loures-lisbon-north', source: 'unsplash' },
    ],
  },

  {
    slug: 'mafra',
    name: 'Mafra',
    margem: 'norte',
    circulo: 2,
    oneLine: 'O palácio, a serra, o oceano — e uma ligação a Lisboa que é o compromisso principal.',
    honestDescription:
      'Mafra ainda aparece pouco nas conversas de imobiliário em Lisboa — e é essa exactamente a oportunidade de quem procura preços justos a menos de uma hora de Terreiro do Paço. ' +
      'O Palácio e Convento de Mafra dá ao município uma ancoragem histórica fora do comum. ' +
      'A proximidade à Serra de Sintra e ao oceano Atlântico (praias de Ericeira, Ribeira d\'Ilhas, Magoito) é uma vantagem real para quem trabalha remotamente. ' +
      'O negativo concreto: a ligação a Lisboa não tem linha de comboio directa — é feita por autocarro ou carro, com tempo variável entre 45 minutos e mais de uma hora.',
    whoFitsHere:
      'Quem trabalha remotamente e quer surf, serra e silêncio, sem a pressão de preço dos concelhos mais próximos de Lisboa.',
    whoDoesNotFit:
      'Quem precisa de percurso diário a Lisboa previsível e rápido, ou de serviços de cidade a metros de casa.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/mafra-palace-portugal', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/ericeira-surf-portugal', source: 'unsplash' },
    ],
  },

  {
    slug: 'vila-franca-de-xira',
    name: 'Vila Franca de Xira',
    margem: 'norte',
    circulo: 2,
    oneLine: 'No cruzamento do Tejo com a linha do Norte — mais cidade do que parece a quem nunca parou.',
    honestDescription:
      'Vila Franca de Xira fica no limite norte da AML e tem uma ligação ferroviária à Estação do Oriente em menos de trinta minutos — um percurso competitivo que contrasta com o preço dos imóveis. ' +
      'O município tem uma identidade própria: Tourada, Campinos, o rio largo — cultura ribatejana que não é Lisboa mas não é outra coisa. ' +
      'O estuário do Tejo aqui tem uma qualidade de vista diferente — mais ampla, menos urbana. ' +
      'O negativo mais directo: a vida urbana é limitada em comparação com os concelhos mais próximos de Lisboa, e o comércio fecha cedo.',
    whoFitsHere:
      'Quem quer linha de comboio rápida, preço baixo, e não tem nada contra viver fora do raio de influência directa de Lisboa.',
    whoDoesNotFit:
      'Quem precisa de serviços urbanos densos, vida nocturna, ou identidade de bairro lisboeta.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/vila-franca-xira-tejo-ribatejo', source: 'unsplash' },
    ],
  },

  // ── Círculo 3 (Margem Sul) ──────────────────────────────────────────────────

  {
    slug: 'almada',
    name: 'Almada',
    margem: 'sul',
    circulo: 3,
    oneLine: 'Do outro lado do Tejo — Lisboa a sete minutos de barco e a metade do preço.',
    honestDescription:
      'Almada é o maior município da margem sul e o que tem a ligação mais directa a Lisboa — o cacilheiro ao Cais do Sodré em sete a dez minutos, o metro a partir daí. ' +
      'O Cristo Rei é o marco mais visível, mas o município tem mais do que o monumento: frente de água em Costa da Caparica, centro histórico em Almada Velha, e Cacilhas com uma vida de bairro que a margem norte já não encontra facilmente. ' +
      'Os preços são significativamente mais baixos do que em Lisboa para a mesma área. ' +
      'O negativo: a ponte é o ponto único de falha de carro — um acidente ou encerramento tem consequências para dezenas de milhares de pessoas.',
    whoFitsHere:
      'Quem quer metros quadrados reais, cacilheiro para Lisboa e uma relação qualidade-preço que Lisboa já não pratica.',
    whoDoesNotFit:
      'Quem precisa de percurso de carro directo a Lisboa sem risco, ou de todos os serviços de Lisboa a pé.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    freguesiasCovered: ['almada-cova-da-piedade', 'cacilhas'],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/almada-cristo-rei-tejo', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/costa-caparica-beach-almada', source: 'unsplash' },
    ],
  },

  {
    slug: 'seixal',
    name: 'Seixal',
    margem: 'sul',
    circulo: 3,
    oneLine: 'O estuário largo e os preços baixos — a margem sul que ainda tem espaço.',
    honestDescription:
      'O Seixal ocupa uma posição invulgar: é o município da margem sul com melhor acesso ao estuário do Tejo e preços entre os mais baixos da AML. ' +
      'A ligação a Lisboa é por comboio ao Barreiro e daí ferry ou cacilheiro, o que implica duas ligações mas resulta em percursos razoáveis. ' +
      'O parque de bairro do Seixal e o passadiço ribeirinho são activos reais para quem tem filhos. ' +
      'O negativo mais concreto: o percurso com duas ligações é vulnerável a atrasos em cascata — um atraso no comboio implica perda de ferry, mais 30 minutos.',
    whoFitsHere:
      'Quem quer preço baixo, estuário próximo e aceitaum percurso com transferência para Lisboa.',
    whoDoesNotFit:
      'Quem precisa de percurso a Lisboa previsível ao minuto, ou de serviços urbanos densos no bairro.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    freguesiasCovered: ['amora'],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/seixal-estuario-tejo', source: 'unsplash' },
    ],
  },

  {
    slug: 'barreiro',
    name: 'Barreiro',
    margem: 'sul',
    circulo: 3,
    oneLine: 'A cidade operária que o tempo deixou quieta — e que o ferry ainda mantém viva.',
    honestDescription:
      'O Barreiro tem uma identidade operária clara que nenhuma reabilitação vai apagar rapidamente. ' +
      'A Quimiparque — antiga CUF — é o símbolo de uma cidade que foi industrial e ainda procura o que será a seguir. ' +
      'O ferry para o Terreiro do Paço é a ligação mais directa — vinte e cinco minutos, horários regulares. ' +
      'Os preços de habitação são entre os mais baixos da margem sul, o que torna o Barreiro atractivo para quem precisa de espaço a custo baixo. ' +
      'O negativo mais estrutural: a valorização imobiliária não tem catalisador evidente no curto prazo.',
    whoFitsHere:
      'Quem quer preço muito baixo, ferry para Lisboa e não precisa de identidade de bairro sofisticada.',
    whoDoesNotFit:
      'Quem procura ambiente de qualidade, espaço urbano cuidado, ou perspectiva de valorização de investimento.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'declining',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/barreiro-ferry-tejo-portugal', source: 'unsplash' },
    ],
  },

  {
    slug: 'moita',
    name: 'Moita',
    margem: 'sul',
    circulo: 3,
    oneLine: 'No estuário, entre o Barreiro e o Montijo — onde o preço ainda reflecte a distância.',
    honestDescription:
      'A Moita ainda aparece pouco nas conversas de imobiliário — e isso é exactamente o que a torna interessante para quem procura preço baixo na margem sul. ' +
      'A ligação a Lisboa faz-se por ferry do Montijo ou por comboio-ferry via Barreiro — percursos de quarenta a cinquenta minutos. ' +
      'A escala do município é humana: não tem a pressão de crescimento de Almada nem a industrial de Barreiro. ' +
      'O negativo mais directo: a oferta de serviços e comércio é limitada para quem está habituado a Lisboa.',
    whoFitsHere:
      'Quem quer preço baixo na margem sul, estuário próximo, e aceita o percurso de ferry ou comboio-ferry para Lisboa.',
    whoDoesNotFit:
      'Quem precisa de serviços urbanos densos ou de percurso a Lisboa com menos de trinta minutos.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/moita-estuario-tejo-margem-sul', source: 'unsplash' },
    ],
  },

  {
    slug: 'montijo',
    name: 'Montijo',
    margem: 'sul',
    circulo: 3,
    oneLine: 'Palmela ainda aparece pouco nas conversas — e é essa exactamente a oportunidade.',
    honestDescription:
      'O Montijo está na agenda de quem segue o aeroporto do Montijo — um projeto que, confirmado ou não, introduz especulação nos preços. ' +
      'Por agora, é um município com ferry directo para Lisboa (trinta minutos ao Terreiro do Paço), preços baixos e uma qualidade de vida tranquila. ' +
      'O centro histórico de Montijo tem dignidade própria — não é apenas subúrbio de Lisboa. ' +
      'O negativo mais relevante: a incerteza sobre o futuro do aeroporto cria volatilidade num mercado que ainda não tem outros catalisadores de valorização claros.',
    whoFitsHere:
      'Quem quer ferry directo a Lisboa, preço baixo e aceita incerteza de curto prazo no mercado imobiliário local.',
    whoDoesNotFit:
      'Quem precisa de certeza de valorização, ou de serviços urbanos disponíveis sem dependência de Lisboa.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/montijo-ferry-tejo-portugal', source: 'unsplash' },
    ],
  },

  {
    slug: 'alcochete',
    name: 'Alcochete',
    margem: 'sul',
    circulo: 3,
    oneLine: 'A Reserva Natural do Estuário e o preço que Lisboa esqueceu — para quem sabe esperar.',
    honestDescription:
      'Alcochete é o município mais pequeno da margem sul em termos de urbanização — grande parte do território é reserva natural. ' +
      'A ligação a Lisboa faz-se por A12 ou por ferry do Montijo. ' +
      'Os preços são dos mais baixos da AML e a escala da vila é humana — mercado, escola, saúde. ' +
      'O negativo estrutural: Alcochete não tem procura urbana suficiente para sustentar valorização sem um catalisador externo. ' +
      'É uma escolha de estilo de vida, não de estratégia de investimento.',
    whoFitsHere:
      'Quem quer natureza real, escala de vila e o estuário à porta, sem pressão de percurso diário a Lisboa.',
    whoDoesNotFit:
      'Quem precisa de percurso rápido a Lisboa, serviços urbanos, ou mercado imobiliário com liquidez.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/alcochete-estuario-reserva-natural', source: 'unsplash' },
    ],
  },

  {
    slug: 'sesimbra',
    name: 'Sesimbra',
    margem: 'sul',
    circulo: 3,
    oneLine: 'A baía mais protegida da Costa Azul — e um segredo que o mercado ainda não precificou de vez.',
    honestDescription:
      'Sesimbra tem uma das melhores baías do litoral português — protegida do norte, com água clara, pesca e escala de aldeia. ' +
      'A ligação a Lisboa é por carro em quarenta a cinquenta minutos, ou por autocarro — não há comboio nem ferry. ' +
      'O mercado imobiliário cresceu na última década mas mantém-se abaixo de Cascais pela distância e pela falta de transporte público eficiente. ' +
      'O negativo mais concreto: sem transporte público de qualidade, quem não tem carro está limitado. ' +
      'E quem tem carro, aceita a estrada pela Serra da Arrábida — bonita mas lenta.',
    whoFitsHere:
      'Quem trabalha remotamente, quer mar protegido e silêncio, e tem carro como condição não negociável.',
    whoDoesNotFit:
      'Quem depende de transporte público, precisa de percurso diário a Lisboa, ou quer serviços urbanos a pé.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/sesimbra-bay-portugal-atlantic', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/arrabida-setubal-coast', source: 'unsplash' },
    ],
  },

  {
    slug: 'setubal',
    name: 'Setúbal',
    margem: 'sul',
    circulo: 3,
    oneLine: 'A cidade do Sado — longe o suficiente para ser barata, perto o suficiente para ser tentadora.',
    honestDescription:
      'Setúbal é a maior cidade da margem sul fora de Almada, com porto, mercado, centro histórico e frente de estuário que a distingue dos subúrbios da AML. ' +
      'A ligação a Lisboa faz-se por comboio Fertagus ou auto-estrada — entre quarenta e sessenta minutos. ' +
      'O mercado do Livramento é um dos melhores mercados de peixe do país. ' +
      'A Arrábida começa a vinte minutos de carro — uma das reservas naturais mais impressionantes da AML. ' +
      'O negativo material: a ligação por comboio Fertagus existe mas não tem a frequência da linha de Cascais ou de Sintra — ao fim de semana, os horários são menos convenientes.',
    whoFitsHere:
      'Quem trabalha parcialmente remotamente, quer qualidade de vida real ao preço mais honesto da AML, e não tem medo de quarenta minutos de comboio.',
    whoDoesNotFit:
      'Quem precisa de estar em Lisboa todos os dias, ou de ligação de transporte público frequente e directa.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    freguesiasCovered: ['setubal-sao-sebastiao'],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/setubal-sado-estuario', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/arrabida-setubal-nature', source: 'unsplash' },
    ],
  },

  {
    slug: 'palmela',
    name: 'Palmela',
    margem: 'sul',
    circulo: 3,
    oneLine: 'Palmela ainda aparece pouco nas conversas — e é essa exactamente a oportunidade de quem procura preços justos a uma hora de Terreiro do Paço.',
    honestDescription:
      'Palmela é o município da margem sul com mais território agrícola e natural — vinhas, castelo medieval, Serra do Louro. ' +
      'A ligação a Lisboa faz-se por auto-estrada A2/A12 ou por comboio Fertagus até ao Barreiro e daí ferry. ' +
      'O castelo de Palmela é um dos mais bem conservados da AML e dá ao município uma ancoragem histórica genuína. ' +
      'Os preços são dos mais baixos da AML por metro quadrado. ' +
      'O negativo mais directo: sem transporte público eficiente, Palmela é dependente de carro para tudo — incluindo chegar a Setúbal para serviços básicos.',
    whoFitsHere:
      'Quem trabalha remotamente, quer espaço e natureza sem pressão de preço, e tem carro como condição de vida.',
    whoDoesNotFit:
      'Quem precisa de percurso rápido a Lisboa, serviços urbanos próximos, ou vida de bairro com alguma animação.',
    hardFacts: {
      populationApprox: null,              // TODO: confirmar via INE
      medianCommuteToLisboaBaixaMinutes: null, // TODO: confirmar via Google Maps
      medianT2RentEuros: null,             // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    freguesiasCovered: [],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/palmela-castle-setubal-portugal', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/palmela-vineyards-setubal', source: 'unsplash' },
    ],
  },
]

// ─── Construção final: calcula vetores para concelhos com cobertura de parishes ──

export const concelhos: Concelho[] = concelhoData.map(c => ({
  ...c,
  vector: c.freguesiasCovered.length > 0
    ? computeConcelhoVectorFromFreguesias(c.slug, freguesias)
    : HARDCODED_VECTORS[c.slug],
}))
