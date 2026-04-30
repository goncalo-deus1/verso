// concelhosAML.ts — 18 concelhos da Área Metropolitana de Lisboa
// budgetFitT2: renda mensal estimada de T2 em 2026, euros. null = a confirmar via Idealista.

import type { ZoneProfile } from './attributes'

export type ConcelhoAML = {
  slug: string
  name: string
  margem: 'norte' | 'sul'
  profile: ZoneProfile
  oneLine: string
  shortDescription: string
  signalProperty: string
  budgetFitT2: { min: number; max: number } | null
  image: string
  populationApprox: number
  populationTrend3y: 'growing' | 'stable' | 'declining'
  crimeLevel: 'baixo' | 'médio' | 'elevado'
  urbanPlanning: string
  parishes: string[]
  frecuesiasCovered: string[]
  transport: string
  honestDescription: string
  whoFitsHere: string
  whoDoesNotFit: string
  /**
   * tradeoffOverrides — per-concelho sentence overrides for the tiered tradeoff system.
   * When set, these replace the generic vocabulary for the specified attribute × tier.
   * Leave unset to use generic vocabulary. Populate only after manual verification.
   */
  tradeoffOverrides?: Partial<Record<keyof ZoneProfile, { medium?: string; high?: string }>>
}

export const concelhosAML: ConcelhoAML[] = [
  // ─── Lisboa ──────────────────────────────────────────────────────────────────
  {
    slug: 'lisboa',
    name: 'Lisboa',
    margem: 'norte',
    profile: { centralidade: 100, urbanidade: 100, tranquilidade: 30, familiar: 55, jovem: 65, acessibilidade: 100, mar: 20, espaco: 20, maturidade: 90, valorizacao: 50 },
    oneLine: 'A capital — onde tudo está mais perto, e tudo custa mais.',
    shortDescription: 'Lisboa é a soma das suas 24 freguesias — cada uma com carácter próprio. O que une todas é a densidade: serviços, transportes, oferta cultural a pé. O que divide é o preço: de Carnide a Santo António, a diferença pode ser 4x o valor por m². Comprar em Lisboa é comprar acesso à cidade, não apenas um endereço.',
    signalProperty: 'Marvila, Beato e Mouraria — as zonas com maior potencial de valorização dentro do município.',
    budgetFitT2: { min: 1100, max: 2800 },
    image: '/concelhos/lisboa.jpg',
    populationApprox: 545_000,
    populationTrend3y: 'declining',
    crimeLevel: 'médio',
    urbanPlanning: 'Forte pressão turística no centro histórico. ARU (Áreas de Reabilitação Urbana) em múltiplos bairros. Restrições ao alojamento local aprovadas em 2023. Plano Director Municipal em revisão.',
    parishes: [
      'Ajuda', 'Alcântara', 'Alvalade', 'Areeiro', 'Arroios',
      'Avenidas Novas', 'Beato', 'Belém', 'Benfica', 'Campo de Ourique',
      'Campolide', 'Carnide', 'Estrela', 'Lumiar', 'Marvila',
      'Misericórdia', 'Olivais', 'Parque das Nações', 'Penha de França',
      'Santa Clara', 'Santa Maria Maior', 'Santo António',
      'São Domingos de Benfica', 'São Vicente',
    ],
    frecuesiasCovered: [
      'campo-de-ourique', 'principe-real', 'alvalade', 'graca-sao-vicente',
      'alcantara', 'marvila-beato', 'parque-das-nacoes', 'benfica',
      'estrela', 'areeiro', 'arroios', 'belem',
    ],
    transport: 'Metro + Comboio',
    honestDescription:
      'Lisboa é a soma das suas freguesias — e cada uma delas tem um carácter próprio que o mapa administrativo não consegue capturar. ' +
      'O que une todas é a densidade: serviços, transportes, oferta cultural, mercado de trabalho. ' +
      'E o que divide é o preço: comprar dentro de Lisboa concelho é, em média, pagar o triplo do que se paga no Seixal pela mesma área útil. ' +
      'O município tem investido em reabilitação urbana nos bairros históricos, com resultados visíveis mas desiguais. ' +
      'As escolas públicas de referência existem, mas a procura excede a oferta nas freguesias mais valorizadas. ' +
      'O negativo estrutural: Lisboa não cresce em população de forma sustentada — cresce em preço e encolhe em residentes efectivos. ' +
      'Quem compra aqui está a comprar acesso à cidade, não apenas um endereço.',
    whoFitsHere: 'Quem quer cidade a 100% — sem percurso, sem dependência de carro, com tudo resolvido a pé ou a uma viagem de metro.',
    whoDoesNotFit: 'Quem precisa de área grande por preço razoável, ou de jardim privado como condição não negociável.',
  },
  // ─── Margem Norte ─────────────────────────────────────────────────────────────
  {
    slug: 'oeiras',
    name: 'Oeiras',
    margem: 'norte',
    profile: { centralidade: 35, urbanidade: 45, tranquilidade: 75, familiar: 90, jovem: 40, acessibilidade: 75, mar: 60, espaco: 85, maturidade: 80, valorizacao: 60 },
    oneLine: 'Entre Lisboa e Cascais, com comboio, parques e infraestrutura empresarial.',
    shortDescription: 'Oeiras tem comboio, parques, hub tecnológico e boas escolas. É a opção de família que combina acessibilidade e espaço. T2 entre €1.100 e €1.700. A costa é curta mas existe. A valorização dos últimos anos foi acima da média da AML.',
    signalProperty: 'Parque dos Poetas, linha de Cascais e uma das maiores concentrações de tecnologia da AML.',
    budgetFitT2: { min: 1100, max: 1700 },
    image: 'https://images.unsplash.com/photo-1747997421995-5ff402818f31?w=800&q=80',
    populationApprox: 175_000,
    populationTrend3y: 'growing',
    crimeLevel: 'baixo',
    urbanPlanning: 'Município com PDM actualizado e forte aposta no corredor tecnológico do Taguspark. Reabilitação do espaço ribeirinho em curso. Boa infraestrutura de ciclovias junto ao Tejo.',
    parishes: [
      'Algés, Linda-a-Velha e Cruz Quebrada-Dafundo',
      'Barcarena',
      'Carnaxide e Queijas',
      'Oeiras e São Julião da Barra, Paço de Arcos e Caxias',
      'Porto Salvo',
    ],
    frecuesiasCovered: ['oeiras-sao-juliao-da-barra', 'pacos-de-arcos', 'algés'],
    transport: 'Comboio',
    honestDescription:
      'Oeiras é o concelho da AML com melhor equilíbrio entre acessibilidade a Lisboa, qualidade de vida e preço — por agora. ' +
      'A linha de comboio de Cascais atravessa o concelho de leste a oeste, com múltiplas estações a menos de vinte e cinco minutos do Cais do Sodré. ' +
      'O Taguspark atraiu empresas de tecnologia e criou um mercado de trabalho local que reduz a pressão de percurso. ' +
      'As escolas públicas têm boa reputação média, e os jardins junto ao Tejo são bem mantidos. ' +
      'O negativo: a valorização dos últimos cinco anos foi rápida, e o diferencial de preço em relação a Lisboa estreitou-se significativamente. ' +
      'O que era barato por comparação já não é — é apenas menos caro.',
    whoFitsHere: 'Famílias com crianças que precisam de escola pública de qualidade, comboio para Lisboa e jardim sem precisar de carro.',
    whoDoesNotFit: 'Quem procura o preço de há cinco anos, ou quer distância a pé de Lisboa sem qualquer percurso.',
  },
  {
    slug: 'cascais',
    name: 'Cascais',
    margem: 'norte',
    profile: { centralidade: 20, urbanidade: 55, tranquilidade: 70, familiar: 75, jovem: 40, acessibilidade: 55, mar: 90, espaco: 80, maturidade: 75, valorizacao: 65 },
    oneLine: 'Vila junto ao Atlântico com comboio direto a Lisboa.',
    shortDescription: 'Cascais consolidou-se como destino residencial premium da margem norte. Mar, transportes (linha de comboio), escolas internacionais e qualidade de vida. T2 dificilmente abaixo de €1.400, frequentemente acima de €2.000. A dependência do comboio para Lisboa é assumida. O trânsito no verão é o tradeoff conhecido.',
    signalProperty: 'A baía de Cascais e a linha de costa até ao Guincho — a 30 min de comboio do centro de Lisboa.',
    budgetFitT2: { min: 1400, max: 2200 },
    image: 'https://images.unsplash.com/photo-1526922179445-52bb746f3b9a?w=800&q=80',
    populationApprox: 215_000,
    populationTrend3y: 'growing',
    crimeLevel: 'baixo',
    urbanPlanning: 'Plano de urbanização centrado na preservação da frente costeira e da identidade de vila. Restrições ao alojamento local e pressão crescente para habitação acessível nas freguesias do interior.',
    parishes: [
      'Alcabideche',
      'Cascais e Estoril',
      'Carcavelos e Parede',
      'São Domingos de Rana',
    ],
    frecuesiasCovered: ['cascais-estoril', 'carcavelos-parede'],
    transport: 'Comboio',
    honestDescription:
      'Cascais é o concelho mais atlântico da AML — costa longa, ventos fortes, praias com nome próprio. ' +
      'A linha de comboio faz a ligação ao Cais do Sodré em menos de quarenta minutos desde Cascais vila, e em menos de trinta desde Carcavelos. ' +
      'A qualidade de vida medida em espaço verde, ar e espaço público está entre as mais altas da região. ' +
      'O mercado imobiliário reflecte isso: Cascais é o segundo concelho mais caro da AML depois de Lisboa, com procura sustentada de compradores nacionais e estrangeiros. ' +
      'O negativo mais prático: fora da época de verão, o ritmo desacelera — o comércio abranda, as esplanadas fecham, a vila fica mais silenciosa do que parece nos meses quentes.',
    whoFitsHere: 'Quem quer praia atlântica, vila com vida própria e tolerância para o percurso de comboio diário para Lisboa.',
    whoDoesNotFit: 'Quem espera preços acessíveis, serviços de Lisboa a minutos, ou actividade urbana densa todo o ano.',
  },
  {
    slug: 'sintra',
    name: 'Sintra',
    margem: 'norte',
    profile: { centralidade: 10, urbanidade: 35, tranquilidade: 80, familiar: 80, jovem: 40, acessibilidade: 50, mar: 30, espaco: 90, maturidade: 70, valorizacao: 60 },
    oneLine: 'A vila do Romantismo, com a serra à porta e Lisboa a 40 minutos de comboio.',
    shortDescription: 'Sintra é o concelho mais cinematográfico da AML. UNESCO, casas com jardim, ar fresco da Serra. T2 entre €850 e €1.400. Ligação a Lisboa por comboio (40 minutos) ou A16. Escolas razoáveis. Para quem trabalha remotamente e quer espaço, é uma das melhores propostas da AML.',
    signalProperty: 'A Serra de Sintra e quintas com jardim a preços que Lisboa há muito deixou de oferecer.',
    budgetFitT2: { min: 850, max: 1400 },
    image: 'https://images.unsplash.com/photo-1562195168-c82fea0f0953?w=800&q=80',
    populationApprox: 388_000,
    populationTrend3y: 'stable',
    crimeLevel: 'médio',
    urbanPlanning: 'Grande diversidade urbanística entre freguesias. Parque Natural de Sintra-Cascais limita construção em zonas protegidas. PDM distingue fortemente zonas históricas (UNESCO) de zonas suburbanas como Cacém e Agualva.',
    parishes: [
      'Agualva e Mira Sintra',
      'Almargem do Bispo, Pêro Pinheiro e Montelavar',
      'Belas',
      'Casal de Cambra',
      'Colares',
      'Mem Martins',
      'Montemor e Ranholas',
      'Queluz e Belas',
      'Rio de Mouro',
      'Santa Maria e São Miguel, São Martinho e São Pedro de Penaferrim',
      'São João das Lampas e Terrugem',
    ],
    frecuesiasCovered: ['sintra-santa-maria', 'queluz', 'agualva-cacem'],
    transport: 'Comboio',
    honestDescription:
      'Sintra é o concelho da AML com maior diversidade interna: da vila histórica Património da UNESCO aos subúrbios dormitório de Cacém, a diferença é de mundos dentro do mesmo mapa. ' +
      'A linha de comboio de Sintra é uma das mais frequentes da região e liga ao Rossio e ao Oriente com regularidade. ' +
      'O parque natural de Sintra-Cascais cobre uma parte significativa do concelho e torna o verde acessível de forma quase única. ' +
      'O negativo mais claro: a qualidade do espaço urbano varia imenso de freguesia para freguesia. ' +
      'Escolher Sintra implica escolher uma freguesia específica — o município não é uma unidade homogénea.',
    whoFitsHere: 'Quem quer natureza próxima e comboio para Lisboa, e tem paciência para escolher bem a freguesia dentro do concelho.',
    whoDoesNotFit: 'Quem espera consistência de qualidade urbana em todo o concelho, ou quer resultados sem pesquisa cuidadosa.',
  },
  {
    slug: 'amadora',
    name: 'Amadora',
    margem: 'norte',
    profile: { centralidade: 40, urbanidade: 75, tranquilidade: 35, familiar: 60, jovem: 55, acessibilidade: 80, mar: 0, espaco: 35, maturidade: 65, valorizacao: 55 },
    oneLine: 'Densa, multicultural, com metro direto a Lisboa em 20 minutos.',
    shortDescription: 'A Amadora é dos municípios mais densos do país e dos mais multiculturais. O metro chegou e os preços subiram, mas continuam abaixo de Lisboa. T2 entre €700 e €1.100. Algumas zonas em requalificação. Para quem trabalha presencialmente e quer reduzir tempo de viagem sem disparar a renda.',
    signalProperty: 'Metro direto ao centro de Lisboa em 20 minutos — e T2 abaixo de €1.000 ainda disponíveis.',
    budgetFitT2: { min: 700, max: 1100 },
    image: '/concelhos/amadora.jpg',
    populationApprox: 175_000,
    populationTrend3y: 'stable',
    crimeLevel: 'elevado',
    urbanPlanning: 'Município com forte pressão urbanística e défice histórico de espaços verdes. Planos de requalificação urbana em curso em várias zonas. Linha de metro como eixo estruturante do desenvolvimento.',
    parishes: [
      'Alfragide',
      'Encosta do Sol',
      'Falagueira-Venda Nova',
      'Mina de Água',
      'Reboleira',
      'Venteira',
    ],
    frecuesiasCovered: ['alfragide'],
    transport: 'Metro + Comboio',
    honestDescription:
      'A Amadora é o município mais densamente povoado de Portugal continental — uma cidade que cresceu por acumulação sem plano de conjunto. ' +
      'O metro serve o eixo principal com ligação directa à Baixa em menos de vinte minutos. ' +
      'O preço médio de habitação é um dos mais baixos da margem norte, o que atrai compradores com orçamento restrito que precisam de estar perto de Lisboa. ' +
      'A oferta de serviços é razoável: hospital, escolas, comércio. ' +
      'O negativo mais concreto: a qualidade do espaço público é desigual, e alguns bairros têm problemas de coesão social que a proximidade a Lisboa não resolve.',
    whoFitsHere: 'Quem precisa de metro para Lisboa e tem orçamento reduzido, sem exigências de qualidade de espaço público ou estética urbana.',
    whoDoesNotFit: 'Quem procura bairro com identidade, rua com vida própria, ou qualidade de espaço público consistente.',
  },
  {
    slug: 'odivelas',
    name: 'Odivelas',
    margem: 'norte',
    profile: { centralidade: 30, urbanidade: 65, tranquilidade: 50, familiar: 65, jovem: 50, acessibilidade: 75, mar: 0, espaco: 55, maturidade: 60, valorizacao: 60 },
    oneLine: 'Lisboa a 15 minutos de metro, com preços que ainda resistem.',
    shortDescription: 'Odivelas cresceu rápido com a chegada do metro, que trouxe investimento e novos moradores. T2 entre €800 e €1.200. Identidade urbana em construção — algumas zonas mais consolidadas, outras a descobrir-se. Para quem prioriza acessibilidade e custo, e está disposto a apostar em bairros em valorização.',
    signalProperty: 'Metro direto a Lisboa e preços ainda controlados nas ruas fora da linha principal.',
    budgetFitT2: { min: 800, max: 1200 },
    image: '/concelhos/odivelas.jpg',
    populationApprox: 145_000,
    populationTrend3y: 'growing',
    crimeLevel: 'médio',
    urbanPlanning: 'Identidade urbana em definição após chegada do metro. Novos empreendimentos residenciais junto às estações. Câmara aposta em requalificação de espaço público nas zonas mais antigas.',
    parishes: [
      'Caneças',
      'Odivelas',
      'Pontinha e Famões',
      'Póvoa de Santo Adrião e Olival Basto',
    ],
    frecuesiasCovered: [],
    transport: 'Metro + Comboio',
    honestDescription:
      'Odivelas ganhou metro em 2002 e a valorização que se seguiu foi real mas não ainda completa. ' +
      'O percurso ao centro de Lisboa é de vinte a vinte e cinco minutos na linha amarela, sem transferência. ' +
      'O parque urbano e o comércio de bairro cobrem o essencial. ' +
      'A qualidade do espaço urbano é variável — há zonas mais cuidadas e outras que reflectem o crescimento rápido dos anos 1980-90. ' +
      'O negativo mais prático: Odivelas não tem uma identidade de cidade forte — é percebida como extensão de Lisboa, o que torna a procura dependente do diferencial de preço.',
    whoFitsHere: 'Quem quer metro directo a Lisboa, preço abaixo de Lisboa, e não precisa de identidade de bairro forte.',
    whoDoesNotFit: 'Quem quer cidade com vida própria independente de Lisboa, ou investe esperando valorização rápida sem outros catalisadores.',
  },
  {
    slug: 'loures',
    name: 'Loures',
    margem: 'norte',
    profile: { centralidade: 20, urbanidade: 45, tranquilidade: 60, familiar: 65, jovem: 40, acessibilidade: 60, mar: 0, espaco: 70, maturidade: 60, valorizacao: 55 },
    oneLine: 'Verde, espaço e proximidade ao Tejo — a margem norte mais rural.',
    shortDescription: 'Loures combina zonas suburbanas, áreas industriais em reconversão e aldeias rurais. O metro chega a Odivelas mas não ao resto do concelho. T2 entre €750 e €1.100. Bom para quem trabalha remotamente ou tem carro. Oferta escolar razoável. Não é a primeira escolha de quem quer vida urbana a pé, mas dá outra coisa.',
    signalProperty: 'Reserva Natural do Estuário do Tejo e quintas a preços que Lisboa não tem.',
    budgetFitT2: { min: 750, max: 1100 },
    image: '/concelhos/loures.jpg',
    populationApprox: 205_000,
    populationTrend3y: 'stable',
    crimeLevel: 'médio',
    urbanPlanning: 'Concelho extenso com realidades muito díspares. Eixo da A1 e linha do Norte definem a lógica de desenvolvimento. Zonas industriais em reconversão parcial. Portela e Bobadela têm planos de requalificação distintos.',
    parishes: [
      'Bucelas',
      'Cabeço de Montachique e Fanhões',
      'Loures',
      'Lousa',
      'Moscavide e Portela',
      'Prior Velho',
      'Santa Iria de Azóia, São João da Talha e Bobadela',
      'Santo António dos Cavaleiros e Frielas',
      'Unhos',
    ],
    frecuesiasCovered: [],
    transport: 'Comboio',
    honestDescription:
      'Loures é um município vasto com realidades muito distintas: desde as zonas urbanas próximas de Odivelas e da linha de metro, até às áreas mais rurais a norte junto ao rio Grande da Pipa. ' +
      'A extensão do metro até Loures está a mudar a percepção do concelho. ' +
      'Os preços são dos mais baixos da margem norte por comparação com o nível de serviços disponíveis. ' +
      'O negativo mais estrutural: a identidade do município é difusa — não há um centro de Loures reconhecível que sirva como âncora.',
    whoFitsHere: 'Quem procura preço baixo, algum verde, e uma ligação de metro que cresce de importância.',
    whoDoesNotFit: 'Quem precisa de bairro com identidade, espaço urbano consolidado, ou centro de cidade de referência.',
  },
  {
    slug: 'mafra',
    name: 'Mafra',
    margem: 'norte',
    profile: { centralidade: 5, urbanidade: 20, tranquilidade: 85, familiar: 65, jovem: 35, acessibilidade: 30, mar: 60, espaco: 90, maturidade: 65, valorizacao: 65 },
    oneLine: 'Ericeira, Palácio e 40 km de costa a uma hora de Lisboa.',
    shortDescription: 'Mafra vive da dualidade entre o Palácio Barroco e as praias da Ericeira. Quem trabalha remotamente e quer surf, ar limpo e preços controlados encontra aqui uma proposta diferente. T2 entre €700 e €1.100. Carro habitualmente necessário. A comunidade de nómadas digitais e expatriados está a crescer — e a fazer subir os preços mais depressa do que o esperado.',
    signalProperty: 'A Ericeira — reserva mundial de surf com praias a 10 minutos de casa.',
    budgetFitT2: { min: 700, max: 1100 },
    image: 'https://images.unsplash.com/photo-1468585906473-093d326a67df?w=800&q=80',
    populationApprox: 88_000,
    populationTrend3y: 'growing',
    crimeLevel: 'baixo',
    urbanPlanning: 'PDM restritivo junto ao Parque Natural Sintra-Cascais. Ericeira com pressão turística crescente e planos de contenção do alojamento local. Zona interior mais tranquila com potencial de construção.',
    parishes: [
      'Azueira e Sobral da Abelheira',
      'Carvoeira',
      'Cheleiros',
      'Encarnação',
      'Enxara do Bispo, Ermegeira e Gradil',
      'Ericeira',
      'Mafra',
      'Malveira e São Miguel de Alcainça',
      'Milharado',
      'Santo Isidoro',
      'Venda do Pinheiro',
    ],
    frecuesiasCovered: [],
    transport: 'Comboio',
    honestDescription:
      'Mafra ainda aparece pouco nas conversas de imobiliário em Lisboa — e é essa exactamente a oportunidade de quem procura preços justos a menos de uma hora de Terreiro do Paço. ' +
      'O Palácio e Convento de Mafra dá ao município uma ancoragem histórica fora do comum. ' +
      'A proximidade à Serra de Sintra e ao oceano Atlântico (praias de Ericeira, Ribeira d\'Ilhas, Magoito) é uma vantagem real para quem trabalha remotamente. ' +
      'O negativo concreto: a ligação a Lisboa não tem linha de comboio directa — é feita por autocarro ou carro, com tempo variável entre 45 minutos e mais de uma hora.',
    whoFitsHere: 'Quem trabalha remotamente e quer surf, serra e silêncio, sem a pressão de preço dos concelhos mais próximos de Lisboa.',
    whoDoesNotFit: 'Quem precisa de percurso diário a Lisboa previsível e rápido, ou de serviços de cidade a metros de casa.',
  },
  {
    slug: 'vila-franca-de-xira',
    name: 'Vila Franca de Xira',
    margem: 'norte',
    profile: { centralidade: 15, urbanidade: 45, tranquilidade: 60, familiar: 65, jovem: 35, acessibilidade: 55, mar: 0, espaco: 75, maturidade: 60, valorizacao: 55 },
    oneLine: 'Tejo largo, comboio frequente e preços que refletem a distância.',
    shortDescription: 'Vila Franca de Xira tem ligação direta a Lisboa por comboio. T2 entre €650 e €950. Serviços básicos, espaço e natureza a pé. Não tem grande comércio especializado — é a escolha de quem prioriza preço e espaço, e aceita o tempo de viagem.',
    signalProperty: 'Comboio direto a Lisboa e os últimos terrenos com potencial de construção acessível na margem norte.',
    budgetFitT2: { min: 650, max: 950 },
    image: '/concelhos/vila-franca-de-xira.jpg',
    populationApprox: 145_000,
    populationTrend3y: 'stable',
    crimeLevel: 'médio',
    urbanPlanning: 'Desenvolvimento ao longo da linha do Norte e do Tejo. Frente ribeirinha com potencial de requalificação. Zonas industriais em coexistência com residencial. Câmara investe em mobilidade suave.',
    parishes: [
      'Alhandra, São João dos Montes e Calhandriz',
      'Alverca do Ribatejo e Sobralinho',
      'Castanheira do Ribatejo e Cachoeiras',
      'Forte da Casa',
      'Póvoa de Santa Iria e Forte da Casa',
      'Vialonga',
      'Vila Franca de Xira',
    ],
    frecuesiasCovered: [],
    transport: 'Comboio',
    honestDescription:
      'Vila Franca de Xira fica no limite norte da AML e tem uma ligação ferroviária à Estação do Oriente em menos de trinta minutos — um percurso competitivo que contrasta com o preço dos imóveis. ' +
      'O município tem uma identidade própria: Tourada, Campinos, o rio largo — cultura ribatejana que não é Lisboa mas não é outra coisa. ' +
      'O estuário do Tejo aqui tem uma qualidade de vista diferente — mais ampla, menos urbana. ' +
      'O negativo mais directo: a vida urbana é limitada em comparação com os concelhos mais próximos de Lisboa, e o comércio fecha cedo.',
    whoFitsHere: 'Quem quer linha de comboio rápida, preço baixo, e não tem nada contra viver fora do raio de influência directa de Lisboa.',
    whoDoesNotFit: 'Quem precisa de serviços urbanos densos, vida nocturna, ou identidade de bairro lisboeta.',
  },
  // ─── Margem Sul ───────────────────────────────────────────────────────────────
  {
    slug: 'almada',
    name: 'Almada',
    margem: 'sul',
    profile: { centralidade: 30, urbanidade: 50, tranquilidade: 60, familiar: 70, jovem: 55, acessibilidade: 70, mar: 45, espaco: 70, maturidade: 65, valorizacao: 70 },
    oneLine: 'Cristo Rei, ferry e cidade a sério — a margem sul que está a ser descoberta.',
    shortDescription: 'Almada tem o Cacilheiro para o centro de Lisboa em 10 minutos, praias urbanas e preços a dois terços dos bairros equivalentes em Lisboa. T2 entre €850 e €1.300. A dependência do ferry é parte do estilo de vida — quando há greve ou mau tempo, a Ponte 25 de Abril é a alternativa. As zonas novas têm qualidade urbana variável.',
    signalProperty: 'O Cacilheiro — 10 minutos para o Cais do Sodré, o argumento que faz muita gente atravessar o Tejo.',
    budgetFitT2: { min: 850, max: 1300 },
    image: '/concelhos/almada.jpg',
    populationApprox: 175_000,
    populationTrend3y: 'growing',
    crimeLevel: 'médio',
    urbanPlanning: 'Frente ribeirinha em requalificação com novos empreendimentos junto ao Tejo. Costa da Caparica com regulação específica de uso turístico. Câmara investe em transportes e ciclismo urbano.',
    parishes: [
      'Almada, Cova da Piedade, Pragal e Cacilhas',
      'Caparica e Trafaria',
      'Charneca de Caparica e Sobreda',
      'Costa da Caparica',
      'Laranjeiro e Feijó',
    ],
    frecuesiasCovered: ['almada-cova-da-piedade', 'cacilhas'],
    transport: 'Metro Sul do Tejo + Comboio',
    honestDescription:
      'Almada é o maior município da margem sul e o que tem a ligação mais directa a Lisboa — o cacilheiro ao Cais do Sodré em sete a dez minutos, o metro a partir daí. ' +
      'O Cristo Rei é o marco mais visível, mas o município tem mais do que o monumento: frente de água em Costa da Caparica, centro histórico em Almada Velha, e Cacilhas com uma vida de bairro que a margem norte já não encontra facilmente. ' +
      'Os preços são significativamente mais baixos do que em Lisboa para a mesma área. ' +
      'O negativo: a ponte é o ponto único de falha de carro — um acidente ou encerramento tem consequências para dezenas de milhares de pessoas.',
    whoFitsHere: 'Quem quer metros quadrados reais, cacilheiro para Lisboa e uma relação qualidade-preço que Lisboa já não pratica.',
    whoDoesNotFit: 'Quem precisa de percurso de carro directo a Lisboa sem risco, ou de todos os serviços de Lisboa a pé.',
  },
  {
    slug: 'seixal',
    name: 'Seixal',
    margem: 'sul',
    profile: { centralidade: 25, urbanidade: 55, tranquilidade: 60, familiar: 70, jovem: 40, acessibilidade: 65, mar: 30, espaco: 65, maturidade: 65, valorizacao: 55 },
    oneLine: 'Margem sul próxima de Lisboa, com praias fluviais e preços controlados.',
    shortDescription: 'O Seixal tem ferry para Lisboa e uma faixa costeira com praias fluviais. T2 entre €750 e €1.100. A ligação de transporte público fora do ferry é menos eficiente. Há zonas novas de urbanização com qualidade. Para quem quer margem sul sem se afastar demasiado e usa o Cacilheiro como rotina.',
    signalProperty: 'Praias fluviais do estuário e preços a dois terços de Lisboa para zonas com qualidade urbana equivalente.',
    budgetFitT2: { min: 750, max: 1100 },
    image: '/concelhos/seixal.jpg',
    populationApprox: 160_000,
    populationTrend3y: 'growing',
    crimeLevel: 'médio',
    urbanPlanning: 'Novos empreendimentos residenciais no Laranjeiro e Corroios. Praias fluviais como activo de planeamento urbano. Boa integração entre zonas verdes e habitacional nas zonas novas.',
    parishes: [
      'Aldeia de Paio Pires',
      'Amora',
      'Corroios',
      'Fernão Ferro',
      'Paio Pires',
      'Seixal',
    ],
    frecuesiasCovered: ['amora'],
    transport: 'Metro Sul do Tejo + Comboio',
    honestDescription:
      'O Seixal ocupa uma posição invulgar: é o município da margem sul com melhor acesso ao estuário do Tejo e preços entre os mais baixos da AML. ' +
      'A ligação a Lisboa é por comboio ao Barreiro e daí ferry ou cacilheiro, o que implica duas ligações mas resulta em percursos razoáveis. ' +
      'O parque de bairro do Seixal e o passadiço ribeirinho são activos reais para quem tem filhos. ' +
      'O negativo mais concreto: o percurso com duas ligações é vulnerável a atrasos em cascata — um atraso no comboio implica perda de ferry, mais 30 minutos.',
    whoFitsHere: 'Quem quer preço baixo, estuário próximo e aceita um percurso com transferência para Lisboa.',
    whoDoesNotFit: 'Quem precisa de percurso a Lisboa previsível ao minuto, ou de serviços urbanos densos no bairro.',
  },
  {
    slug: 'barreiro',
    name: 'Barreiro',
    margem: 'sul',
    profile: { centralidade: 20, urbanidade: 60, tranquilidade: 50, familiar: 60, jovem: 40, acessibilidade: 60, mar: 20, espaco: 55, maturidade: 65, valorizacao: 50 },
    oneLine: 'Frente de rio, património industrial em reconversão, e os preços mais acessíveis a 25 minutos de Lisboa.',
    shortDescription: 'Barreiro tem ferry para Lisboa, património industrial relevante e preços dos mais baixos da AML. T2 entre €550 e €850. A população está a envelhecer e há projetos de requalificação em curso. É uma aposta de valorização a médio-longo prazo — para quem quer entrar antes do mercado descobrir.',
    signalProperty: 'Ferry para Lisboa e o último grande stock de edifícios industriais do século XX por reconverter.',
    budgetFitT2: { min: 550, max: 850 },
    image: '/concelhos/barreiro.jpg',
    populationApprox: 78_000,
    populationTrend3y: 'declining',
    crimeLevel: 'médio',
    urbanPlanning: 'Câmara debate o futuro do vasto parque industrial herdado do século XX. Reconversão parcial em curso mas lenta. Frente de rio com potencial de valorização a médio prazo.',
    parishes: [
      'Alto do Seixalinho, Santo André e Verderena',
      'Barreiro e Lavradio',
      'Coina',
      'Palhais',
    ],
    frecuesiasCovered: [],
    transport: 'Comboio',
    honestDescription:
      'O Barreiro tem uma identidade operária clara que nenhuma reabilitação vai apagar rapidamente. ' +
      'A Quimiparque — antiga CUF — é o símbolo de uma cidade que foi industrial e ainda procura o que será a seguir. ' +
      'O ferry para o Terreiro do Paço é a ligação mais directa — vinte e cinco minutos, horários regulares. ' +
      'Os preços de habitação são entre os mais baixos da margem sul, o que torna o Barreiro atractivo para quem precisa de espaço a custo baixo. ' +
      'O negativo mais estrutural: a valorização imobiliária não tem catalisador evidente no curto prazo.',
    whoFitsHere: 'Quem quer preço muito baixo, ferry para Lisboa e não precisa de identidade de bairro sofisticada.',
    whoDoesNotFit: 'Quem procura ambiente de qualidade, espaço urbano cuidado, ou perspectiva de valorização de investimento.',
  },
  {
    slug: 'moita',
    name: 'Moita',
    margem: 'sul',
    profile: { centralidade: 15, urbanidade: 45, tranquilidade: 60, familiar: 65, jovem: 30, acessibilidade: 50, mar: 20, espaco: 65, maturidade: 60, valorizacao: 45 },
    oneLine: 'Estuário do Tejo, espaço e os preços mais baixos de T2 da AML.',
    shortDescription: 'A Moita é dos concelhos mais acessíveis da AML. T2 entre €500 e €800. A ligação a Lisboa depende de autocarro e comboio — exige tempo. Para quem prioriza custo e espaço acima de tudo, e trabalha remotamente ou tem carro. Comunidade pequena e tranquila junto ao estuário.',
    signalProperty: 'Os preços mais baixos de T2 da AML com acesso ao estuário do Tejo.',
    budgetFitT2: { min: 500, max: 800 },
    image: '/concelhos/moita.jpg',
    populationApprox: 67_000,
    populationTrend3y: 'stable',
    crimeLevel: 'médio',
    urbanPlanning: 'Desenvolvimento contido sem grande pressão de crescimento. Câmara com recursos limitados para investimento público. Zonas ribeirinhas como activo natural com pouca valorização urbanística.',
    parishes: [
      'Alhos Vedros',
      'Baixa da Banheira e Vale da Amoreira',
      'Gaio-Rosário e Sarilhos Pequenos',
      'Moita',
    ],
    frecuesiasCovered: [],
    transport: 'Comboio',
    honestDescription:
      'A Moita ainda aparece pouco nas conversas de imobiliário — e isso é exactamente o que a torna interessante para quem procura preço baixo na margem sul. ' +
      'A ligação a Lisboa faz-se por ferry do Montijo ou por comboio-ferry via Barreiro — percursos de quarenta a cinquenta minutos. ' +
      'A escala do município é humana: não tem a pressão de crescimento de Almada nem a industrial de Barreiro. ' +
      'O negativo mais directo: a oferta de serviços e comércio é limitada para quem está habituado a Lisboa.',
    whoFitsHere: 'Quem quer preço baixo na margem sul, estuário próximo, e aceita o percurso de ferry ou comboio-ferry para Lisboa.',
    whoDoesNotFit: 'Quem precisa de serviços urbanos densos ou de percurso a Lisboa com menos de trinta minutos.',
  },
  {
    slug: 'montijo',
    name: 'Montijo',
    margem: 'sul',
    profile: { centralidade: 15, urbanidade: 45, tranquilidade: 65, familiar: 65, jovem: 30, acessibilidade: 50, mar: 25, espaco: 70, maturidade: 55, valorizacao: 65 },
    oneLine: 'Porta do Alentejo com ferry, ponte e a expectativa do novo aeroporto.',
    shortDescription: 'Montijo ganhou atenção com a discussão do novo aeroporto. T2 entre €600 e €950. Tem ferry para Lisboa, ainda que com horários limitados. Os preços já antecipam algum cenário futuro. Quem aposta na valorização a médio prazo tem argumentos. Quem quer qualidade de vida imediata, encontra aqui calma e proximidade ao estuário.',
    signalProperty: 'Ferry para Lisboa e a aposta no novo aeroporto — especulação com base em dados reais.',
    budgetFitT2: { min: 600, max: 950 },
    image: '/concelhos/montijo.jpg',
    populationApprox: 54_000,
    populationTrend3y: 'growing',
    crimeLevel: 'baixo',
    urbanPlanning: 'Aeroporto potencial como catalisador de desenvolvimento. PDM em revisão antecipando crescimento. Frente ribeirinha com projecto de requalificação aprovado mas execução incerta.',
    parishes: [
      'Afonsoeiro',
      'Atalaia e Alto Estanqueiro-Jardia',
      'Canha',
      'Montijo',
      'Pegões',
      'Sarilhos Grandes',
    ],
    frecuesiasCovered: [],
    transport: 'Comboio',
    honestDescription:
      'O Montijo está na agenda de quem segue o aeroporto do Montijo — um projecto que, confirmado ou não, introduz especulação nos preços. ' +
      'Por agora, é um município com ferry directo para Lisboa (trinta minutos ao Terreiro do Paço), preços baixos e uma qualidade de vida tranquila. ' +
      'O centro histórico de Montijo tem dignidade própria — não é apenas subúrbio de Lisboa. ' +
      'O negativo mais relevante: a incerteza sobre o futuro do aeroporto cria volatilidade num mercado que ainda não tem outros catalisadores de valorização claros.',
    whoFitsHere: 'Quem quer ferry directo a Lisboa, preço baixo e aceita incerteza de curto prazo no mercado imobiliário local.',
    whoDoesNotFit: 'Quem precisa de certeza de valorização, ou de serviços urbanos disponíveis sem dependência de Lisboa.',
  },
  {
    slug: 'alcochete',
    name: 'Alcochete',
    margem: 'sul',
    profile: { centralidade: 10, urbanidade: 30, tranquilidade: 75, familiar: 60, jovem: 30, acessibilidade: 40, mar: 35, espaco: 80, maturidade: 55, valorizacao: 65 },
    oneLine: 'Sapal, sal-marinho e silêncio — o lado calmo da Ponte Vasco da Gama.',
    shortDescription: 'Alcochete é pequena, calma e com uma frente de rio excecional. T2 entre €650 e €950. A ligação a Lisboa depende de carro ou autocarro. Ideal para quem trabalha remotamente, tem filhos e quer espaço sem pagar Cascais. A valorização é moderada — pressão de procura ainda contida.',
    signalProperty: 'Reserva Natural do Estuário do Tejo e silêncio que Lisboa não consegue oferecer.',
    budgetFitT2: { min: 650, max: 950 },
    image: '/concelhos/alcochete.jpg',
    populationApprox: 20_000,
    populationTrend3y: 'stable',
    crimeLevel: 'baixo',
    urbanPlanning: 'Pequeno município com PDM conservador. Reserva Natural do Estuário do Tejo condiciona grande parte do território. Crescimento urbano contido e controlado.',
    parishes: [
      'Alcochete',
      'Samouco',
      'São Francisco',
    ],
    frecuesiasCovered: [],
    transport: 'Comboio',
    honestDescription:
      'Alcochete é o município mais pequeno da margem sul em termos de urbanização — grande parte do território é reserva natural. ' +
      'A ligação a Lisboa faz-se por A12 ou por ferry do Montijo. ' +
      'Os preços são dos mais baixos da AML e a escala da vila é humana — mercado, escola, saúde. ' +
      'O negativo estrutural: Alcochete não tem procura urbana suficiente para sustentar valorização sem um catalisador externo. ' +
      'É uma escolha de estilo de vida, não de estratégia de investimento.',
    whoFitsHere: 'Quem quer natureza real, escala de vila e o estuário à porta, sem pressão de percurso diário a Lisboa.',
    whoDoesNotFit: 'Quem precisa de percurso rápido a Lisboa, serviços urbanos, ou mercado imobiliário com liquidez.',
  },
  {
    slug: 'sesimbra',
    name: 'Sesimbra',
    margem: 'sul',
    profile: { centralidade: 5, urbanidade: 25, tranquilidade: 85, familiar: 65, jovem: 35, acessibilidade: 30, mar: 95, espaco: 80, maturidade: 70, valorizacao: 60 },
    oneLine: 'Uma das praias mais bonitas da AML, com escala de vila piscatória.',
    shortDescription: 'Sesimbra tem uma das melhores baías do país e preços abaixo dos concelhos costeiros comparáveis. T2 entre €550 e €900. A ligação a Lisboa é por autocarro e carro — sem comboio. Para residência permanente, exige adesão ao estilo de vida de vila costeira: ritmo mais lento, comunidade próxima.',
    signalProperty: 'A baía de Sesimbra e a Arrábida a 15 minutos — o melhor litoral acessível da margem sul.',
    budgetFitT2: { min: 550, max: 900 },
    image: 'https://images.unsplash.com/photo-1754383956633-62651ba1dfb5?w=800&q=80',
    populationApprox: 50_000,
    populationTrend3y: 'growing',
    crimeLevel: 'baixo',
    urbanPlanning: 'Frente costeira com regulação rigorosa. Parque Natural da Arrábida limita muito a construção na faixa sul. Vila com PDM que preserva a escala e o carácter de vila piscatória.',
    parishes: [
      'Quinta do Conde',
      'Santiago',
      'Sesimbra',
    ],
    frecuesiasCovered: [],
    transport: 'Autocarro',
    honestDescription:
      'Sesimbra tem uma das melhores baías do litoral português — protegida do norte, com água clara, pesca e escala de aldeia. ' +
      'A ligação a Lisboa é por carro em quarenta a cinquenta minutos, ou por autocarro — não há comboio nem ferry. ' +
      'O mercado imobiliário cresceu na última década mas mantém-se abaixo de Cascais pela distância e pela falta de transporte público eficiente. ' +
      'O negativo mais concreto: sem transporte público de qualidade, quem não tem carro está limitado. ' +
      'E quem tem carro, aceita a estrada pela Serra da Arrábida — bonita mas lenta.',
    whoFitsHere: 'Quem trabalha remotamente, quer mar protegido e silêncio, e tem carro como condição não negociável.',
    whoDoesNotFit: 'Quem depende de transporte público, precisa de percurso diário a Lisboa, ou quer serviços urbanos a pé.',
  },
  {
    slug: 'setubal',
    name: 'Setúbal',
    margem: 'sul',
    profile: { centralidade: 10, urbanidade: 50, tranquilidade: 60, familiar: 65, jovem: 45, acessibilidade: 40, mar: 70, espaco: 70, maturidade: 65, valorizacao: 55 },
    oneLine: 'Cidade portuária com Arrábida à porta e Atlântico próximo.',
    shortDescription: 'Setúbal é uma cidade real, não um subúrbio. Tem serviços, comércio, universidade e uma proximidade à Arrábida que poucos lugares oferecem. T2 entre €600 e €950. Ligação a Lisboa por A2 ou comboio (45 a 60 minutos). Para quem quer qualidade de vida mediterrânica e está disposto a sair da pendularidade lisboeta.',
    signalProperty: 'A Arrábida a 15 minutos de casa — o argumento decisivo para quem está a sair de Lisboa.',
    budgetFitT2: { min: 600, max: 950 },
    image: '/concelhos/setubal.jpg',
    populationApprox: 118_000,
    populationTrend3y: 'stable',
    crimeLevel: 'médio',
    urbanPlanning: 'Cidade com plano de expansão da frente ribeirinha. Centro histórico com reabilitação activa. Proximidade da Arrábida gera pressão turística que o PDM tenta conter.',
    parishes: [
      'Gâmbia-Pontes-Alto da Guerra',
      'São Lourenço e São Simão',
      'São Sebastião',
      'Setúbal (São Julião, Nossa Senhora da Anunciada e Santa Maria da Graça)',
      'Sado',
    ],
    frecuesiasCovered: ['setubal-sao-sebastiao'],
    transport: 'Comboio',
    honestDescription:
      'Setúbal é a maior cidade da margem sul fora de Almada, com porto, mercado, centro histórico e frente de estuário que a distingue dos subúrbios da AML. ' +
      'A ligação a Lisboa faz-se por comboio Fertagus ou auto-estrada — entre quarenta e sessenta minutos. ' +
      'O mercado do Livramento é um dos melhores mercados de peixe do país. ' +
      'A Arrábida começa a vinte minutos de carro — uma das reservas naturais mais impressionantes da AML. ' +
      'O negativo material: a ligação por comboio Fertagus existe mas não tem a frequência da linha de Cascais ou de Sintra — ao fim de semana, os horários são menos convenientes.',
    whoFitsHere: 'Quem trabalha parcialmente remotamente, quer qualidade de vida real ao preço mais honesto da AML, e não tem medo de quarenta minutos de comboio.',
    whoDoesNotFit: 'Quem precisa de estar em Lisboa todos os dias, ou de ligação de transporte público frequente e directa.',
  },
  {
    slug: 'palmela',
    name: 'Palmela',
    margem: 'sul',
    profile: { centralidade: 5, urbanidade: 20, tranquilidade: 85, familiar: 65, jovem: 25, acessibilidade: 30, mar: 15, espaco: 90, maturidade: 65, valorizacao: 55 },
    oneLine: 'Vinho do Setúbal, castelo medieval e tranquilidade rural.',
    shortDescription: 'Palmela é rural no sentido honesto da palavra: quintas, silêncio, vistas para a Serra. T2 entre €500 e €800. Carro necessário. Sem vida urbana a pé. Ideal para teletrabalho permanente com gosto por espaço, vinha e natureza.',
    signalProperty: 'Quintas com vinha, castelo medieval e paisagens da Arrábida sem pagar preço de Cascais.',
    budgetFitT2: { min: 500, max: 800 },
    image: '/concelhos/palmela.jpg',
    populationApprox: 63_000,
    populationTrend3y: 'stable',
    crimeLevel: 'baixo',
    urbanPlanning: 'Município essencialmente rural com PDM restritivo. Castelo e zona histórica com estatuto de protecção. Vinhas classificadas condicionam o desenvolvimento nas encostas da Serra da Arrábida.',
    parishes: [
      'Marateca e Poceirão',
      'Palmela',
      'Pinhal Novo',
      'Quinta do Anjo',
    ],
    frecuesiasCovered: [],
    transport: 'Comboio',
    honestDescription:
      'Palmela é o município da margem sul com mais território agrícola e natural — vinhas, castelo medieval, Serra do Louro. ' +
      'A ligação a Lisboa faz-se por auto-estrada A2/A12 ou por comboio Fertagus até ao Barreiro e daí ferry. ' +
      'O castelo de Palmela é um dos mais bem conservados da AML e dá ao município uma ancoragem histórica genuína. ' +
      'Os preços são dos mais baixos da AML por metro quadrado. ' +
      'O negativo mais directo: sem transporte público eficiente, Palmela é dependente de carro para tudo — incluindo chegar a Setúbal para serviços básicos.',
    whoFitsHere: 'Quem trabalha remotamente, quer espaço e natureza sem pressão de preço, e tem carro como condição de vida.',
    whoDoesNotFit: 'Quem precisa de percurso rápido a Lisboa, serviços urbanos próximos, ou vida de bairro com alguma animação.',
  },
]
