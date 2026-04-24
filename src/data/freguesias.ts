// TODO (sessão futura): script de fetching para popular hardFacts a partir
// de INE (população, idade, tendência) e Idealista (renda mediana T2).
// Os vetores permanecem editoriais — validação humana obrigatória.

import type { ZoneVector } from './vectorSchema'

export type FreguesiaStats = {
  score?: number
  medianAgeYears?: number | null
  tramMetroOrTrainToBaixaMinutes?: number | null
  medianT2RentEuros?: number | null
  populationTrend3y?: 'growing' | 'stable' | 'declining' | null
}

export type Freguesia = {
  slug: string
  name: string
  concelhoSlug: string
  archetype: 'central-calm' | 'central-dense' | 'peripheral-residential' | 'transition' | 'coastal' | 'family-suburb'
  vector: ZoneVector
  oneLine: string
  honestDescription: string
  whoFitsHere: string
  whoDoesNotFit: string
  hardFacts: {
    medianAgeYears: number | null
    tramMetroOrTrainToBaixaMinutes: number | null
    medianT2RentEuros: number | null
    populationTrend3y: 'growing' | 'stable' | 'declining' | null
  }
  referenceStreets: Array<{ name: string; note: string }>
  photoCredits: Array<{ url: string; source: 'unsplash' | 'pexels' | 'owner'; author?: string }>
  tags?: string[]
  stats?: FreguesiaStats
}

export const freguesias: Freguesia[] = [

  // ─── Lisboa (12) ──────────────────────────────────────────────────────────────

  {
    slug: 'campo-de-ourique',
    name: 'Campo de Ourique',
    concelhoSlug: 'lisboa',
    archetype: 'central-calm',
    vector: { pace: 1, central: 2, green: 1, night: 1, family: 2, food: 2, walkable: 3, price: 3, character: 3 },
    oneLine: 'O último monte calmo antes de o roteiro turístico deixar de existir.',
    honestDescription:
      'Campo de Ourique cresceu à margem do turismo — não por acidente, mas porque os seus moradores nunca quiseram ser descobertos. ' +
      'As ruas têm nomes de políticos do século XIX e a padaria ainda conhece a encomenda pelo nome de família. ' +
      'O bairro funciona: escola, médico, mercado e jardim a distância de caminhada. ' +
      'O Jardim da Parada tem coreto. O Jardim de Santos tem banco para sentar. ' +
      'A Avenida Álvares Cabral faz a transição entre a calma e o resto da cidade com uma elegância que a maioria das avenidas lisboetas não consegue. ' +
      'O negativo mais concreto: os preços sobem há três anos consecutivos. ' +
      'O T2 abaixo de 1.400 euros por mês praticamente desapareceu. ' +
      'Quem comprou há dez anos tem mais-valias assinaláveis; quem procura agora paga o preço de ter sido segredo durante tempo a mais.',
    whoFitsHere:
      'Quem quer bairro a sério — farmácia, peixaria, vizinho de rosto familiar — sem abrir mão de estar a dez minutos do Chiado a pé.',
    whoDoesNotFit:
      'Quem precisa de vida nocturna a metros de casa, ou de linha de metro directa ao aeroporto sem transferência.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (elétrico 28)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua Ferreira Borges', note: 'o coração do bairro — padaria, talho, papelaria num raio de cem metros' },
      { name: 'Rua Coelho da Rocha', note: 'residencial tranquila com árvores nos passeios e portões que os moradores conhecem pelo som' },
      { name: 'Avenida Álvares Cabral', note: 'a fronteira sul — para cima é o bairro, para baixo é já o Rato' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/campo-de-ourique-lisboa', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/mercado-campo-de-ourique', source: 'unsplash' },
    ],
  },

  {
    slug: 'principe-real',
    name: 'Príncipe Real',
    concelhoSlug: 'lisboa',
    archetype: 'central-dense',
    vector: { pace: 2, central: 3, green: 2, night: 3, family: 1, food: 3, walkable: 3, price: 3, character: 3 },
    oneLine: 'Lisboa condensada num só jardim — o melhor e o mais caro ao mesmo tempo.',
    honestDescription:
      'Príncipe Real é o bairro que os guias de viagem descobriram e nunca mais largaram. ' +
      'O Jardim das Flores, a Embaixada, a Rua Dom Pedro V — tudo tem nome e fotografia no Instagram antes de ter história. ' +
      'A densidade de restaurantes por metro quadrado é provavelmente a mais alta da cidade. ' +
      'Ao fim de semana, a circulação abranda por causa do mercado de design e dos grupos com auriculares. ' +
      'De manhã, durante a semana, a rua tem uma qualidade quase provinciana — cafés com mesas cá fora, pessoas que se conhecem. ' +
      'O problema é o preço: é o bairro mais caro de Lisboa por metro quadrado, e a tendência é estável apenas porque já subiu tudo o que havia a subir. ' +
      'Quem não tem orçamento para comprar frequenta-o — e é esse o seu charme partilhado.',
    whoFitsHere:
      'Quem quer Lisboa a 100%, trabalha remotamente ou no centro histórico, e tem orçamento para pagar por isso sem arrependimento.',
    whoDoesNotFit:
      'Famílias com crianças pequenas à procura de espaço, ou quem precisa de carro e estacionamento todos os dias.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua Dom Pedro V', note: 'o eixo principal — galerias, restaurantes de referência e a subida para o Bairro Alto' },
      { name: 'Praça do Príncipe Real', note: 'o jardim-coração do bairro, com a feira de antiguidades ao sábado de manhã' },
      { name: 'Rua da Escola Politécnica', note: 'onde a escala baixa e o trânsito abranda — o museu de ciência e o jardim botânico' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/principe-real-lisboa', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/jardim-principe-real-lisbon', source: 'unsplash' },
    ],
  },

  {
    slug: 'alvalade',
    name: 'Alvalade',
    concelhoSlug: 'lisboa',
    archetype: 'central-calm',
    vector: { pace: 1, central: 2, green: 2, night: 1, family: 3, food: 2, walkable: 3, price: 2, character: 2 },
    oneLine: 'O bairro que o Estado Novo planeou para durar — e durou melhor do que esperado.',
    honestDescription:
      'Alvalade foi desenhado nos anos 40 com praças, escola, igreja e farmácia a distância regulada. Resultou. ' +
      'As moradias de dois pisos da Célula 8 são das mais procuradas de Lisboa para famílias que não querem apartamento. ' +
      'A Avenida dos Estados Unidos da América tem uma fila de castanheiros que em outubro muda tudo. ' +
      'As escolas — de primária a secundária — têm boa reputação sem serem exclusivas. ' +
      'O mercado de Alvalade é mais discreto do que o do Campo de Ourique mas funciona com a mesma lógica de rotina. ' +
      'O que falta: vida nocturna praticamente inexistente, e os restaurantes fecham antes das 22h com facilidade. ' +
      'Quem quer sair depois do jantar tem de pegar no metro ou no carro — o bairro não tem essa oferta.',
    whoFitsHere:
      'Famílias que valorizam escola, parque e padaria no mesmo raio de 400 metros, e dormem melhor quando a rua está silenciosa.',
    whoDoesNotFit:
      'Jovens que querem cidade com ritmo ou quem espera encontrar a animação do Bairro Alto a cinco minutos de percurso.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (metro Alvalade)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Avenida dos Estados Unidos da América', note: 'os castanheiros em outubro, o Pingo Doce no rés-do-chão, o bairro todo a passar' },
      { name: 'Rua Acácio de Paiva', note: 'residencial de escala humana — moradia com jardim de frente que ainda acontece aqui' },
      { name: 'Praça de Alvalade', note: 'centro de gravidade do bairro — mercado, café, banco, corrida das crianças' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/alvalade-lisboa', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/avenida-estados-unidos-america-lisbon', source: 'unsplash' },
    ],
    tags: ['família', 'escola', 'parque', 'planeado', 'silencioso'],
    stats: {
      medianAgeYears: 44,
      tramMetroOrTrainToBaixaMinutes: 15,
      medianT2RentEuros: 1350,
      populationTrend3y: 'stable',
    },
  },

  {
    slug: 'graca-sao-vicente',
    name: 'Graça e São Vicente',
    concelhoSlug: 'lisboa',
    archetype: 'central-dense',
    vector: { pace: 2, central: 2, green: 1, night: 2, family: 1, food: 2, walkable: 3, price: 2, character: 3 },
    oneLine: 'O monte mais honesto de Lisboa — sem curadoria, sem vergonha dos seus defeitos.',
    honestDescription:
      'A Graça não se vendeu ao turismo — mas o turismo encontrou-a na mesma. ' +
      'O miradouro da Graça e o da Senhora do Monte são os mais autênticos da cidade, embora isso seja cada vez menos verdade ao fim de semana. ' +
      'Há ainda mercearias de bairro onde se compra azeite a granel e a conversa não tem preço. ' +
      'As travessas íngremes desencoraja quem não gosta de andar a pé e tornam a Graça resistente à gentrificação acelerada — não imune, mas resistente. ' +
      'O Convento da Graça e a Igreja de São Vicente de Fora marcam o skyline com uma seriedade que outros bairros não têm. ' +
      'O que falta: supermercados de dimensão razoável. ' +
      'As compras semanais implicam descer ao Mouraria ou ao Intendente. ' +
      'O estacionamento é uma penitência diária sem alternativa real.',
    whoFitsHere:
      'Quem aprecia uma rua que não foi decorada para agradar a ninguém, e não tem medo de subir escadas para chegar a casa.',
    whoDoesNotFit:
      'Famílias com carrinho de bebé, pessoas com mobilidade reduzida, ou quem precisa de carro estacionado em porta.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (elétrico 28)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Rua da Graça', note: 'o eixo principal do bairro — do miradouro ao mercado, tudo passa por aqui' },
      { name: 'Calçada do Monte', note: 'a subida mais fotogénica de Lisboa — e a mais cansativa nos dias de chuva' },
      { name: 'Largo da Graça', note: 'a praça do bairro — banco à sombra, café com cadeiras de plástico, elétrico que passa' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/graca-lisbon-miradouro', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/sao-vicente-de-fora-lisbon', source: 'unsplash' },
    ],
    tags: ['carácter', 'autêntico', 'histórico', 'vistas', 'resistente'],
    stats: {
      medianAgeYears: 42,
      tramMetroOrTrainToBaixaMinutes: 18,
      medianT2RentEuros: 1400,
      populationTrend3y: 'growing',
    },
  },

  {
    slug: 'alcantara',
    name: 'Alcântara',
    concelhoSlug: 'lisboa',
    archetype: 'transition',
    vector: { pace: 2, central: 2, green: 1, night: 2, family: 1, food: 2, walkable: 2, price: 2, character: 2 },
    oneLine: 'Entre a ponte e o rio, um bairro que ainda não decidiu o que quer ser.',
    honestDescription:
      'Alcântara tem duas histórias a acontecer ao mesmo tempo. ' +
      'Do lado do rio, o LX Factory e os restaurantes novos atraem um público que não mora ali. ' +
      'Do lado de cima, a Rua de Alcântara e os bairros de encosta têm uma realidade mais operária, mais encaixada no quotidiano. ' +
      'A acessibilidade é boa — o comboio para Cascais passa aqui, o elétrico 15E faz a ligação ao Cais do Sodré. ' +
      'O estacionamento é mais fácil do que na colina. ' +
      'O que pesa: a passagem da 2.ª Circular cria uma barreira sonora e visual que divide o bairro de Monsanto. ' +
      'A qualidade do ar perto do viaduto é mensurável e inferior. ' +
      'Alcântara não é um bairro que se aprecia por completo — é um bairro que se escolhe por razões práticas.',
    whoFitsHere:
      'Quem trabalha em Belém ou no centro e quer percurso rápido de comboio, com valores de renda ainda abaixo de Príncipe Real.',
    whoDoesNotFit:
      'Quem procura coerência de bairro — identidade forte, comércio de proximidade estabelecido, sentido de comunidade evidente.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio + elétrico)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Rua de Alcântara', note: 'a rua que os moradores usam — o café, o talho, a farmácia do dia-a-dia' },
      { name: 'Rua Maria Luísa Holstein', note: 'onde o LX Factory acontece ao fim de semana e nada acontece durante a semana' },
      { name: 'Calçada da Tapada', note: 'a subida para Ajuda — uma perspectiva diferente sobre o bairro' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/alcantara-lisbon-lx-factory', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/ponte-25-abril-tejo', source: 'unsplash' },
    ],
  },

  {
    slug: 'marvila-beato',
    name: 'Marvila e Beato',
    concelhoSlug: 'lisboa',
    archetype: 'transition',
    vector: { pace: 1, central: 1, green: 2, night: 2, family: 1, food: 3, walkable: 2, price: 2, character: 2 },
    oneLine: 'Onde as fábricas fecharam e os estúdios abriram — ainda a meio caminho.',
    honestDescription:
      'Marvila e Beato são a mesma aposta urbana por parte de promotores e da Câmara de Lisboa: reconversão de armazéns e silos em habitação, escritórios criativos e restaurantes de referência. ' +
      'O Beato Innovation District, a proximidade ao rio, as cervejeiras instaladas em antigas fábricas — a lógica é clara, a execução é faseada. ' +
      'O resultado ainda é fragmentado: uma frente ribeirinha que impressiona, ruas traseiras que ainda esperam. ' +
      'A distância ao Terreiro do Paço de autocarro é aceitável; a pé, é longa. ' +
      'O supermercado de dimensão adequada é o que falta há mais tempo — o Intermercado do Beato resolveu parcialmente. ' +
      'O ponto fraco mais concreto: a ausência de escolas públicas de qualidade já estabelecida obriga as famílias a procurar noutros bairros.',
    whoFitsHere:
      'Compradores com paciência para um bairro em transição e orçamento para aproveitar o preço antes de acabar de subir.',
    whoDoesNotFit:
      'Famílias que precisam de infra-estrutura consolidada já agora — escola pública de referência, pediatria, actividades extracurriculares.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Rua do Açúcar', note: 'onde os armazéns ainda guardam a memória industrial e os novos inquilinos fazem barulho diferente' },
      { name: 'Rua Capitão Leitão', note: 'residencial de bairro antigo que coexiste com a reabilitação — duas idades no mesmo passeio' },
      { name: 'Largo do Intendente', note: 'o ponto de encontro que está a ganhar escala — mercado, café e esplanada que ainda cabe toda a gente' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/marvila-lisbon-warehouse', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/beato-lisbon-tejo', source: 'unsplash' },
    ],
  },

  {
    slug: 'beato-marvila',
    name: 'Beato e Marvila',
    concelhoSlug: 'lisboa',
    archetype: 'transition',
    vector: { pace: 1, central: 1, green: 2, night: 2, family: 1, food: 3, walkable: 2, price: 2, character: 2 },
    oneLine: 'O corredor ribeirinho que Lisboa ainda está a descobrir — criativo, industrial, em aberto.',
    honestDescription:
      'Beato e Marvila partilham uma lógica de transformação que avança frente por frente. ' +
      'Os armazéns do século XX deram lugar a cervejeiras artesanais, ateliers de arquitectura e restaurantes que não existiam há três anos. ' +
      'A frente ribeirinha tem passadiços novos e a vista para o Tejo é das mais largas de Lisboa. ' +
      'O Beato Innovation District e a entrada de escritórios de tecnologia estabilizaram o perfil do bairro sem o elitizar de vez. ' +
      'O que ainda falta: escola pública de referência consolidada, supermercado de dimensão familiar e transporte público de alta frequência no interior dos bairros. ' +
      'Quem compra agora compra o potencial — e esse potencial está cada vez mais precificado.',
    whoFitsHere:
      'Compradores com horizonte de três a cinco anos, tolerância para um bairro em construção e olho para o que o rio e a reabilitação industrial podem valer.',
    whoDoesNotFit:
      'Famílias com crianças que precisam de infra-estrutura consolidada já agora — escola, pediatria, actividades ao fim de semana.',
    hardFacts: {
      medianAgeYears: 35,
      tramMetroOrTrainToBaixaMinutes: 25,
      medianT2RentEuros: 1100,
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Rua do Açúcar', note: 'onde o industrial e o criativo coexistem — fábrica da manhã, restaurante à noite' },
      { name: 'Rua de Marvila', note: 'o eixo histórico — ainda com pastelaria de bairro, café de reformados e loja de ferragens' },
      { name: 'Rua Capitão Leitão', note: 'residencial que ainda resiste à transformação — dois bairros num só percurso' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/marvila-lisbon-creative-district', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/beato-lisbon-ribeirinho', source: 'unsplash' },
    ],
    tags: ['potencial', 'criativo', 'industrial', 'junto ao rio', 'em transformação'],
    stats: {
      medianAgeYears: 35,
      tramMetroOrTrainToBaixaMinutes: 25,
      medianT2RentEuros: 1100,
      populationTrend3y: 'growing',
    },
  },

  {
    slug: 'parque-das-nacoes',
    name: 'Parque das Nações',
    concelhoSlug: 'lisboa',
    archetype: 'peripheral-residential',
    vector: { pace: 1, central: 1, green: 3, night: 1, family: 3, food: 2, walkable: 2, price: 2, character: 1 },
    oneLine: 'A cidade planeada de raiz — funcional como nenhuma outra, mas ainda à procura de alma.',
    honestDescription:
      'O Parque das Nações foi construído para a Expo98 e nunca deixou de o mostrar. ' +
      'O urbanismo é impecável — frente de água, parques, passeios largos, boa iluminação — mas tem a frieza de tudo o que foi desenhado de uma vez só, sem tempo e sem acidente. ' +
      'Os equipamentos são novos: o hospital, as escolas, o Vasco da Gama. O metro é rápido. O Teleférico funciona. ' +
      'O que falta é o que o tempo ainda não trouxe: o café de esquina que existe há trinta anos, a padaria que conhece o nome do filho, a rua que tem história porque as pessoas ali envelheceram juntas. ' +
      'Para famílias jovens com crianças pequenas, o Parque das Nações é difícil de bater em termos práticos. ' +
      'Para quem quer cidade com espessura, falta qualquer coisa que não se compra nem se planeia.',
    whoFitsHere:
      'Famílias jovens com crianças pequenas que querem equipamento novo, passeio junto ao Tejo e escola pública de qualidade.',
    whoDoesNotFit:
      'Quem procura bairro com história, comércio de vizinhança consolidado, ou tolerância para ruas não planeadas.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (metro Oriente)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Alameda dos Oceanos', note: 'o eixo principal — largo, arborizado, e silencioso às 21h de um domingo' },
      { name: 'Passeio do Tejo', note: 'a frente de água que define o bairro — ciclistas, famílias, o rio sempre à vista' },
      { name: 'Rua da Pimenta', note: 'o lado mais residencial — onde os moradores fazem as compras de semana no Continente do rés-do-chão' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/parque-nacoes-lisbon-expo', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/vasco-da-gama-tower-lisbon', source: 'unsplash' },
    ],
  },

  {
    slug: 'benfica',
    name: 'Benfica',
    concelhoSlug: 'lisboa',
    archetype: 'peripheral-residential',
    vector: { pace: 2, central: 1, green: 2, night: 1, family: 3, food: 1, walkable: 2, price: 1, character: 1 },
    oneLine: 'O bairro que cresceu demasiado depressa mas ainda tem jardim e escola à porta.',
    honestDescription:
      'Benfica é um dos maiores bairros residenciais de Lisboa em número de habitantes, e a sua escala tem os prós e contras de sempre: ' +
      'infra-estrutura completa — escola, centro de saúde, supermercados, farmácias — mas sem a identidade singular dos bairros históricos. ' +
      'O Estádio da Luz e o Centro Colombo são marcos de orientação mais do que de qualidade urbana. ' +
      'O parque de Monsanto é a grande compensação: o maior parque urbano de Lisboa começa aqui, a minutos a pé. ' +
      'O metro chega, mas a rede de autocarros para o centro é mais lenta do que a distância em linha recta sugere. ' +
      'O ponto fraco a nomear: os anos 1980 e 1990 deixaram aqui edifícios de qualidade arquitectónica baixa que envelheceram mal, ' +
      'e a reabilitação urbana é lenta por comparação com o que acontece nos bairros mais a leste.',
    whoFitsHere:
      'Famílias que precisam de espaço real — quarto de criança que é mesmo quarto — a preços ainda razoáveis dentro do concelho de Lisboa.',
    whoDoesNotFit:
      'Quem quer bairro com identidade própria, rua com carácter, ou distância a pé do centro histórico.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (metro Colégio Militar)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Estrada de Benfica', note: 'o eixo histórico — o trânsito, o comércio, o Colombo no fundo' },
      { name: 'Rua Padre Américo', note: 'residencial com prédios de diferentes décadas lado a lado — o bairro em miniatura' },
      { name: 'Rua Fernando Palha', note: 'a entrada de Monsanto — onde o asfalto cede à terra batida e os cães correm' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/benfica-lisbon-stadium', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/monsanto-park-lisbon', source: 'unsplash' },
    ],
  },

  {
    slug: 'estrela',
    name: 'Estrela',
    concelhoSlug: 'lisboa',
    archetype: 'central-calm',
    vector: { pace: 1, central: 2, green: 2, night: 1, family: 2, food: 2, walkable: 3, price: 3, character: 2 },
    oneLine: 'A basílica, o jardim, os embaixadores — e uma rua que desce para o Chiado.',
    honestDescription:
      'A Estrela tem dois rostos. ' +
      'O de cima — a Basílica, o Jardim da Estrela com o coreto e os pavões — é um dos melhores pontos de paragem de Lisboa, frequentado por famílias ao fim de semana sem o alvoroço turístico de Alfama. ' +
      'O de baixo — a Rua de São Bento, a Assembleia da República, as embaixadas — dá ao bairro uma sobriedade que afasta o ruído. ' +
      'A ligação ao Chiado é a pé em quinze minutos por um percurso agradável. ' +
      'O que falta: a oferta de supermercados é limitada para a densidade habitacional. ' +
      'A Rua de São Bento tem restaurantes que fecham cedo e lojas de artesanato para turistas — não a mercearia de que um morador precisa de manhã. ' +
      'Compras semanais implicam, na maioria das vezes, ir até ao Rato ou ao Campo de Ourique.',
    whoFitsHere:
      'Casais sem filhos ou com crianças pequenas que valorizam jardim, silêncio relativo e boa ligação ao Chiado a pé.',
    whoDoesNotFit:
      'Quem precisa de fazer compras a pé de casa ou quer supermercado grande disponível sem desvio.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (autocarros + a pé)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Jardim da Estrela', note: 'tecnicamente um jardim, não uma rua — mas é o centro gravitacional de todo o bairro' },
      { name: 'Rua de São Bento', note: 'a artéria política — a Assembleia, as embaixadas, os antiquários, os cafés que não mudam' },
      { name: 'Rua do Século', note: 'desce do bairro para o Chiado com uma suavidade que convida à caminhada' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/basilica-estrela-lisbon', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/jardim-estrela-lisbon', source: 'unsplash' },
    ],
  },

  {
    slug: 'areeiro',
    name: 'Areeiro',
    concelhoSlug: 'lisboa',
    archetype: 'central-calm',
    vector: { pace: 1, central: 2, green: 1, night: 1, family: 2, food: 2, walkable: 2, price: 2, character: 2 },
    oneLine: 'O nó de transportes mais subestimado de Lisboa — funcional antes de ser bonito.',
    honestDescription:
      'O Areeiro não tem charme imediato. ' +
      'A Praça Francisco Sá Carneiro é dominada pelo tráfego e o acesso ao metro dá de frente para um edifício de finanças. ' +
      'Mas o bairro funciona com uma eficiência que muitas zonas mais bonitas não têm: metro de ligação directa ao aeroporto e ao Marquês, elétrico para Alfama, supermercados de dimensão adequada, farmácias, serviços. ' +
      'Os edifícios dos anos 1960-80 têm apartamentos generosos em termos de área por preço — um T3 aqui tem frequentemente a metragem que só um T2 tem no Príncipe Real. ' +
      'O ponto fraco: o ruído do trânsito é uma constante nas avenidas principais, e o espaço verde é escasso a não ser que se conte o jardim formal da praça.',
    whoFitsHere:
      'Quem prioriza acessibilidade e área útil sobre ambiente e estética — e entende que essa é uma troca honesta.',
    whoDoesNotFit:
      'Quem quer rua com vida, cafés na calçada e passeios de fim de semana sem precisar de sair do bairro.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (metro Areeiro)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Praça Francisco Sá Carneiro', note: 'o centro do Areeiro — tráfego, metro, finanças e a farmácia de sempre' },
      { name: 'Avenida de Roma', note: 'o eixo de comércio — o Pingo Doce, o banco, o café do lado' },
      { name: 'Rua Visconde de Valmor', note: 'residencial com edifícios de traça mais cuidada, perto do jardim do mesmo nome' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/areeiro-lisbon', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/avenida-roma-lisboa', source: 'unsplash' },
    ],
  },

  {
    slug: 'arroios',
    name: 'Arroios',
    concelhoSlug: 'lisboa',
    archetype: 'central-dense',
    vector: { pace: 2, central: 2, green: 1, night: 2, family: 2, food: 3, walkable: 3, price: 2, character: 2 },
    oneLine: 'O bairro mais cosmopolita de Lisboa — não por turismo, mas por imigração a sério.',
    honestDescription:
      'Arroios tem a maior densidade de comunidades imigrantes de Lisboa, e isso nota-se na oferta alimentar, nos horários dos comércios e na temperatura da rua. ' +
      'O Martim Moniz como ponto gravitacional, a Mouraria a encosta acima, o Intendente em recuperação — Arroios é onde a Lisboa real acontece sem teatro. ' +
      'Há metro de ligação directa ao centro, hospital de Santa Maria a distância razoável, e renda mediana ainda abaixo dos bairros históricos do Chiado. ' +
      'O que pesa: alguns blocos habitacionais da Avenida Almirante Reis têm espaço público de qualidade variável, ' +
      'e algumas ruas do interior têm problemas de iluminação e conservação que nem o optimismo imobiliário apaga. ' +
      'A pressão de valorização é real — os preços subiram mais rápido do que a qualidade do espaço público.',
    whoFitsHere:
      'Quem valoriza diversidade real, comércio étnico e estar perto de tudo sem pagar preços de Príncipe Real.',
    whoDoesNotFit:
      'Quem precisa de ambiente tranquilo à noite ou de ruas inteiramente seguras para crianças pequenas circularem sozinhas.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (metro Intendente / Anjos)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Rua do Benformoso', note: 'o coração cosmopolita — temperos de três continentes à venda no mesmo quarteirão' },
      { name: 'Largo do Intendente Pina Manique', note: 'a praça que está a ganhar vida — café, restaurante, esplanada, algum ruído' },
      { name: 'Avenida Almirante Reis', note: 'o eixo maior do bairro — funcional, ruidoso e cheio de coisas a acontecer' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/intendente-lisbon', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/mouraria-lisbon', source: 'unsplash' },
    ],
    tags: ['cosmopolita', 'diverso', 'central', 'em alta', 'vibrante'],
    stats: {
      medianAgeYears: 37,
      tramMetroOrTrainToBaixaMinutes: 12,
      medianT2RentEuros: 1200,
      populationTrend3y: 'growing',
    },
  },

  {
    slug: 'belem',
    name: 'Belém',
    concelhoSlug: 'lisboa',
    archetype: 'peripheral-residential',
    vector: { pace: 1, central: 1, green: 2, night: 1, family: 2, food: 2, walkable: 2, price: 2, character: 3 },
    oneLine: 'O sítio onde Lisboa olhou para o mundo — e o mundo ficou a olhar para cá.',
    honestDescription:
      'Belém tem uma concentração de monumentos históricos que não existe em mais nenhum bairro português: a Torre, os Jerónimos, o Padrão dos Descobrimentos, o Centro Cultural de Belém. ' +
      'Ao fim de semana, a frente ribeirinha tem uma qualidade de passeio que justifica o congestionamento. ' +
      'Durante a semana, o bairro tem uma dimensão de vila que surpreende — ruas residenciais silenciosas, jardins bem tratados, o elétrico que passa de hora a hora. ' +
      'O ponto negativo é estrutural: Belém é turístico de uma forma que impede o comércio de proximidade de se instalar. ' +
      'A Padaria de Belém existe para os turistas, não para os moradores. ' +
      'Compras da semana obrigam a ir à Ajuda ou a ter carro. ' +
      'A ligação ao centro por transporte público é lenta — o elétrico 15E é belo mas não é rápido.',
    whoFitsHere:
      'Quem trabalha remotamente, valoriza o rio e o verde, e não depende de supermercado a duzentos metros.',
    whoDoesNotFit:
      'Quem precisa de percurso rápido para o Marquês ou para o Parque das Nações, ou de supermercado a caminhar.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (elétrico 15E)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua Vieira Portuense', note: 'a rua residencial de Belém — onde os moradores de facto vivem, longe dos autocarros turísticos' },
      { name: 'Avenida de Brasília', note: 'a frente ribeirinha — os Jerónimos duma parte, o rio da outra' },
      { name: 'Calçada do Galvão', note: 'sobe para Ajuda com uma inclinação que poucos turistas enfrentam e muitos moradores sobem todos os dias' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/jeronimos-monastery-belem-lisbon', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/torre-belem-tejo', source: 'unsplash' },
    ],
  },

  // ─── Oeiras (3) ───────────────────────────────────────────────────────────────

  {
    slug: 'oeiras-sao-juliao-da-barra',
    name: 'Oeiras — São Julião da Barra',
    concelhoSlug: 'oeiras',
    archetype: 'family-suburb',
    vector: { pace: 1, central: 1, green: 2, night: 1, family: 3, food: 2, walkable: 2, price: 2, character: 1 },
    oneLine: 'A linha de Cascais começa aqui — e o preço ainda não chegou ao que o sítio merecia.',
    honestDescription:
      'Oeiras-São Julião da Barra é o coração administrativo do concelho de Oeiras — câmara, escola secundária de referência, piscinas municipais, jardim junto ao Tejo. ' +
      'A linha do comboio faz a ligação a Cascais em quinze minutos e ao Cais do Sodré em vinte e cinco. ' +
      'O palácio dos Marqueses de Pombal e o jardim tornam a visita ao núcleo histórico uma obrigação — não são decoração, são escala humana real. ' +
      'O negativo concreto: o bairro divide-se entre o núcleo histórico cuidado e os condomínios dos anos 80 e 90 nas encostas, de qualidade arquitectónica desigual. ' +
      'Quem compra aqui paga pelo acesso ao comboio e pelas escolas — não pelo carácter da rua em si.',
    whoFitsHere:
      'Famílias com crianças em idade escolar que precisam de escola pública de qualidade e acesso a Lisboa sem carro.',
    whoDoesNotFit:
      'Quem quer vida nocturna, bairro histórico denso, ou distância a pé de Lisboa centro.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio linha Cascais)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua Marquês de Pombal', note: 'o núcleo histórico — câmara num extremo, jardim no outro, comboio a trezentos metros' },
      { name: 'Rua Direita', note: 'onde o comércio local sobrevive entre as cadeias — a papelaria que ainda vende esferográficas avulsas' }, // TODO: validar com morador
      { name: 'Avenida Marginal', note: 'a linha de água e parque que separa Oeiras da vontade de ir para Cascais' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/oeiras-palacio-marques-pombal', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/oeiras-tejo-linha-cascais', source: 'unsplash' },
    ],
  },

  {
    slug: 'pacos-de-arcos',
    name: 'Paços de Arcos',
    concelhoSlug: 'oeiras',
    archetype: 'coastal',
    vector: { pace: 1, central: 0, green: 2, night: 1, family: 3, food: 1, walkable: 2, price: 2, character: 1 },
    oneLine: 'À beira-rio, a trinta minutos do Cais do Sodré — e ainda não toda a gente sabe.',
    honestDescription:
      'Paços de Arcos tem uma praia de rio, um comboio e escolas — a equação básica de quem deixa Lisboa sem largar o emprego na cidade. ' +
      'A estação de comboio fica a poucos minutos a pé das praias fluviais e do centro da vila. ' +
      'O casario histórico à volta da igreja é mais contido do que o de Cascais mas tem a sua dignidade. ' +
      'A oferta de restauração é modesta — um ou dois sítios de referência local, sem a densidade de Cascais. ' +
      'O comércio de proximidade cobre o essencial: peixaria, talho, padaria, farmácia. ' +
      'O ponto negativo concreto: o trânsito na EN6 ao final da tarde é um desgaste regular para quem não consegue apanhar o comboio de regresso — uma constante de quem vive na linha.',
    whoFitsHere:
      'Famílias que querem praia fluvial, jardim e escola pública a pé de casa, com orçamento médio e tolerância para o comboio diário.',
    whoDoesNotFit:
      'Quem precisa de centro urbano denso, vida nocturna, ou distância a pé de Lisboa sem depender do comboio.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio linha Cascais)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua Marquês de Pombal', note: 'eixo central da vila histórica — farmácia, padaria, talho, banco' }, // TODO: validar com morador
      { name: 'Rua da Praia', note: 'desce para as piscinas fluviais — mais procurada no verão, mais silenciosa no inverno' },
      { name: 'Rua do Conde', note: 'casario residencial dos anos 60 que envelheceu melhor do que parece na Google Street View' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/pacos-de-arcos-praia-tejo', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/linha-cascais-comboio', source: 'unsplash' },
    ],
  },

  {
    slug: 'algés',
    name: 'Algés',
    concelhoSlug: 'oeiras',
    archetype: 'transition',
    vector: { pace: 1, central: 1, green: 1, night: 1, family: 2, food: 2, walkable: 2, price: 2, character: 1 },
    oneLine: 'A fronteira entre Lisboa e Oeiras — com os preços de Oeiras e a facilidade de Lisboa.',
    honestDescription:
      'Algés é tecnicamente concelho de Oeiras mas funciona como extensão de Lisboa — a linha de comboio e o elétrico tornam a fronteira invisível. ' +
      'A rua principal tem supermercado, farmácia, padaria, e um mercado municipal que funciona de manhã. ' +
      'O parque de Algés junto ao Tejo tem coreto e campo de futebol — parque de bairro de escala familiar. ' +
      'Os edifícios são maioritariamente dos anos 1950-1990, sem a qualidade arquitectónica dos bairros históricos mas com áreas brutas generosas por preço. ' +
      'O que falta: a identidade de Algés é difusa. ' +
      'Não tem o charme histórico de Oeiras vila nem a densidade urbana de Lisboa. ' +
      'É um bairro que escolhem pela praticidade, raramente pela emoção.',
    whoFitsHere:
      'Quem quer estar perto de Lisboa sem pagar preços de Lisboa, com acesso fácil ao comboio e ao elétrico 15E.',
    whoDoesNotFit:
      'Quem procura bairro com identidade forte, vida nocturna, ou passeios a pé de interesse histórico ou natural.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio + elétrico)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua do Moinho', note: 'residencial silencioso — moradores que se conhecem, gatos que passam' }, // TODO: validar com morador
      { name: 'Avenida de Pádua', note: 'comercial e funcional — o supermercado, a farmácia, a escola pública' },
      { name: 'Rua Capitão Leitão', note: 'desce para o Tejo com um vislumbre da Ponte 25 de Abril nos dias claros' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/algés-tejo-ponte', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/oeiras-linha-cascais-tejo', source: 'unsplash' },
    ],
  },

  // ─── Cascais (2) ──────────────────────────────────────────────────────────────

  {
    slug: 'cascais-estoril',
    name: 'Cascais e Estoril',
    concelhoSlug: 'cascais',
    archetype: 'coastal',
    vector: { pace: 1, central: 0, green: 3, night: 2, family: 2, food: 3, walkable: 2, price: 3, character: 2 },
    oneLine: 'O fim da linha onde o Atlântico começa — e os preços acabaram por chegar.',
    honestDescription:
      'Cascais e Estoril partilham a linha de comboio e a orla atlântica, mas têm personalidades distintas. ' +
      'Estoril tem o Casino, as pensões históricas e uma atmosfera vagamente decadente que a distingue. ' +
      'Cascais tem a vila histórica, o Boca do Inferno, o Farol e uma oferta de restauração que cresce todos os anos. ' +
      'A linha de comboio faz a ligação a Lisboa em quarenta minutos sem trânsito — o que a torna numa das alternativas mais convincentes à vida na cidade. ' +
      'O preço acompanhou a procura: o T2 na vila histórica de Cascais está já acima de muitos bairros de Lisboa. ' +
      'O negativo central: fora da temporada de verão, Cascais fecha mais cedo do que esperado — restaurantes com horários reduzidos, comércio que encerra ao domingo.',
    whoFitsHere:
      'Quem quer praia atlântica, vila com carácter e tolerância para quarenta minutos de comboio todos os dias.',
    whoDoesNotFit:
      'Quem depende de serviços públicos especializados em Lisboa diariamente, ou de mobilidade a pé para tudo.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio linha Cascais)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Rua Frederico Arouca', note: 'o centro histórico de Cascais — onde o turismo e o quotidiano se encontram sem animosidade' },
      { name: 'Avenida da República (Estoril)', note: 'a fachada art déco em frente ao Casino — fora de temporada, é quase toda para os moradores' },
      { name: 'Rua do Poço Novo', note: 'residencial de Cascais vila — casas do século XX com jardim e portão verde' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/cascais-vila-historica-portugal', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/estoril-casino-atlantic', source: 'unsplash' },
    ],
  },

  {
    slug: 'carcavelos-parede',
    name: 'Carcavelos e Parede',
    concelhoSlug: 'cascais',
    archetype: 'coastal',
    vector: { pace: 1, central: 0, green: 2, night: 1, family: 3, food: 2, walkable: 2, price: 2, character: 1 },
    oneLine: 'A praia mais acessível de comboio — o segredo que os lisboetas ainda guardam para si.',
    honestDescription:
      'Carcavelos tem a praia de mar com maior capacidade da linha de Cascais: areão longo, ondas, estacionamento fácil fora do verão, e acesso directo da estação de comboio. ' +
      'A Parede tem uma escala mais recatada — bairro residencial de moradias e apartamentos baixos, com jardins e ruas sem grandes preocupações estéticas mas com a praticidade do dia-a-dia resolvida. ' +
      'A linha de comboio faz a ligação ao Cais do Sodré em vinte e cinco minutos. ' +
      'O IBS está em Carcavelos e traz uma população jovem sem criar agitação nocturna excessiva. ' +
      'O ponto negativo: o trânsito na EN6 ao fim de semana de verão é um bloqueio sistemático para quem vai de carro — o comboio é obrigatório.',
    whoFitsHere:
      'Famílias com crianças que querem praia de mar regular, escola pública sólida e percurso de comboio para Lisboa.',
    whoDoesNotFit:
      'Quem precisa de bairro denso com vida própria, comércio a pé de casa sete dias por semana, ou vida nocturna.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio linha Cascais)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Avenida Jorge V (Carcavelos)', note: 'a rua da linha — estação, café, supermercado, o caminho para a praia' },
      { name: 'Rua do Moinho de Cima (Parede)', note: 'residencial de moradias — o tipo de rua onde as crianças ainda andam de bicicleta' }, // TODO: validar com morador
      { name: 'Rua da Parede', note: 'vila histórica com escala de aldeia — a farmácia, a peixaria, o café de sempre' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/carcavelos-beach-cascais-line', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/parede-cascais-residential', source: 'unsplash' },
    ],
  },

  // ─── Sintra (3) ───────────────────────────────────────────────────────────────

  {
    slug: 'sintra-santa-maria',
    name: 'Sintra — Santa Maria',
    concelhoSlug: 'sintra',
    archetype: 'peripheral-residential',
    vector: { pace: 1, central: 0, green: 3, night: 1, family: 2, food: 2, walkable: 2, price: 2, character: 3 },
    oneLine: 'O palácio, a névoa, a Serra — e um centro histórico que serve o turismo antes de servir os moradores.',
    honestDescription:
      'Sintra é Património Mundial da UNESCO e isso pesa sobre o dia-a-dia de quem mora na vila histórica. ' +
      'O centro é dominado pelo turismo — as lojas de recordações substituíram a mercearia, e o Palácio Nacional é o marco de orientação para os autocarros turísticos. ' +
      'A Serra de Sintra começa a minutos e oferece percursos de caminhada que estão entre os melhores da AML. ' +
      'O comboio liga ao Rossio em quarenta minutos — uma ligação frequente e fiável. ' +
      'O problema concreto: viver na vila histórica implica aceitar que o comércio de proximidade quotidiano quase não existe. ' +
      'Supermercados, farmácia e serviços práticos estão nos arredores. ' +
      'Comprar pão de manhã na vila é turístico por definição.',
    whoFitsHere:
      'Quem trabalha remotamente, valoriza arquitectura, natureza e silêncio, e tem carro para as compras semanais.',
    whoDoesNotFit:
      'Quem precisa de comércio de proximidade diário, percurso de comboio abaixo de trinta minutos, ou vida de bairro urbano.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio linha Sintra)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua João de Deus', note: 'a rua da estação — onde o quotidiano tenta sobreviver ao fluxo turístico' },
      { name: 'Rua Visconde de Monserrate', note: 'desce da vila para os palácios — os melhores vislumbres da Serra' },
      { name: 'Rua Dr. Alfredo da Costa', note: 'residencial de Sintra fora do centro — onde as pessoas realmente vivem' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/sintra-palace-serra-fog', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/pena-palace-sintra-portugal', source: 'unsplash' },
    ],
  },

  {
    slug: 'queluz',
    name: 'Queluz',
    concelhoSlug: 'sintra',
    archetype: 'peripheral-residential',
    vector: { pace: 2, central: 1, green: 1, night: 1, family: 2, food: 1, walkable: 2, price: 1, character: 1 },
    oneLine: 'O palácio barroco no meio de um bairro que cresceu sem plano — e resulta à sua maneira.',
    honestDescription:
      'Queluz é conhecida pelo Palácio Nacional — um dos mais impressionantes do barroco português — mas a realidade residencial do bairro é outra: blocos de habitação dos anos 1960-90, ruas sem continuidade clara, e uma mistura de classes que é mais rara nos bairros da moda. ' +
      'A acessibilidade por comboio é muito boa: a estação de Queluz-Belas está na linha de Sintra e liga ao Rossio em menos de vinte minutos. ' +
      'Há supermercados de dimensão razoável, escola pública, farmácia. ' +
      'O que falta: o comércio de rua tem lacunas evidentes, e a qualidade do espaço público varia muito de rua para rua. ' +
      'Queluz é escolhida pela praticidade e pelo preço — não pela experiência de bairro.',
    whoFitsHere:
      'Quem precisa de acessibilidade a Lisboa por comboio com orçamento reduzido e não prioriza estética urbana.',
    whoDoesNotFit:
      'Quem quer bairro com carácter, rua com vida, ou investimento com perspectiva de valorização rápida.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio Queluz-Belas)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua António Enes', note: 'o centro funcional de Queluz — não o palácio, a farmácia e o Pingo Doce' },
      { name: 'Largo 20 de Outubro', note: 'praça junto à estação — ponto de encontro funcional, não decorativo' },
      { name: 'Rua Dom António de Lencastre', note: 'entre o bairro residencial e o palácio — dois Queluz num só percurso' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/queluz-palace-national-portugal', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/queluz-sintra-residential', source: 'unsplash' },
    ],
  },

  {
    slug: 'agualva-cacem',
    name: 'Agualva-Cacém',
    concelhoSlug: 'sintra',
    archetype: 'peripheral-residential',
    vector: { pace: 2, central: 1, green: 1, night: 1, family: 2, food: 1, walkable: 2, price: 1, character: 1 },
    oneLine: 'A cidade que ninguém planeou e toda a gente conhece porque o comboio passa aqui.',
    honestDescription:
      'Agualva-Cacém é um dos maiores aglomerados urbanos do concelho de Sintra — resultado de décadas de imigração interna e construção não planeada. ' +
      'O comboio é o eixo principal: a estação de Cacém está na linha de Sintra com ligações frequentes ao Rossio e ao Oriente. ' +
      'A escala urbana é grande para o que a infra-estrutura consegue suportar: há congestão de trânsito sistemática, estacionamento difícil e um urbanismo que reflecte a falta de planeamento original. ' +
      'O centro comercial Aqua é o ponto de referência de comércio. Há mercado, escolas, saúde. ' +
      'O negativo mais claro: a qualidade do espaço público é baixa por comparação com outros aglomerados da linha, e o sentido de bairro é quase inexistente — é uma cidade-dormitório sem remorsos.',
    whoFitsHere:
      'Quem precisa de preço baixo com acesso a Lisboa por comboio e aceita o compromisso de espaço urbano sem charme.',
    whoDoesNotFit:
      'Quem procura identidade de bairro, qualidade de espaço público, ou investimento com perspectiva de valorização clara.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio Cacém)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Avenida Padre Himalaia', note: 'eixo principal de Cacém — onde o trânsito e o comércio se organizam sem elegância mas com eficiência' },
      { name: 'Rua de Agualva', note: 'o lado mais antigo — algumas casas com jardim que sobreviveram à densidade' },
      { name: 'Rua do Comércio', note: 'nome que cumpre o que promete — supermercado, farmácia, cabeleireiro' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/cacem-sintra-residential-suburb', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/linha-sintra-comboio-portugal', source: 'unsplash' },
    ],
  },

  // ─── Amadora (1) ──────────────────────────────────────────────────────────────

  {
    slug: 'alfragide',
    name: 'Alfragide',
    concelhoSlug: 'amadora',
    archetype: 'family-suburb',
    vector: { pace: 1, central: 1, green: 1, night: 1, family: 2, food: 1, walkable: 1, price: 1, character: 1 },
    oneLine: 'O bairro dos escritórios e dos centros comerciais — habitação que acontece no intervalo.',
    honestDescription:
      'Alfragide é, antes de mais, zona de escritórios e comércio de grande superfície — a Decathlon, o Dolce Vita Amadora, os parques empresariais — e a escala é automóvel por definição. ' +
      'As zonas residenciais existem nas margens deste tecido comercial e têm qualidade desigual: condomínios privados dos anos 1990-2000 convivem com bairros de habitação social. ' +
      'A acessibilidade por carro é boa — a 2.ª Circular e a A5 estão a minutos. ' +
      'Por transporte público, a situação é mais difícil: não há metro, os autocarros cobrem o essencial mas com frequência baixa. ' +
      'O negativo mais concreto: Alfragide não tem rua de bairro. Não tem praça. Não tem café de esquina onde os vizinhos se encontram. ' +
      'A vida quotidiana passa pelos grandes volumes e pelos parques de estacionamento.',
    whoFitsHere:
      'Quem trabalha em Alfragide ou na A5 e quer minimizar o percurso, com carro próprio e tolerância para ambiente de parque empresarial.',
    whoDoesNotFit:
      'Quem procura vida de bairro, rua a pé, transporte público frequente, ou qualquer tipo de carácter urbano.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (autocarro)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Rua Alfredo da Silva', note: 'a artéria principal — escritórios, supermercados e pouco mais' },
      { name: 'Avenida de Alfragide', note: 'a entrada de carro — parques de estacionamento de ambos os lados' },
      { name: 'Rua das Escolas', note: 'residencial tranquilo onde os moradores de facto vivem, longe dos escritórios' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/alfragide-amadora-lisbon', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/dolce-vita-amadora-shopping', source: 'unsplash' },
    ],
  },

  // ─── Almada (2) ───────────────────────────────────────────────────────────────

  {
    slug: 'almada-cova-da-piedade',
    name: 'Almada — Cova da Piedade',
    concelhoSlug: 'almada',
    archetype: 'transition',
    vector: { pace: 2, central: 1, green: 1, night: 1, family: 2, food: 1, walkable: 2, price: 1, character: 1 },
    oneLine: 'Do outro lado do Tejo — a mesma cidade a preços de margem sul.',
    honestDescription:
      'Almada e Cova da Piedade formam o núcleo habitacional principal da margem sul de Lisboa. ' +
      'O acesso ao centro de Lisboa faz-se por dois caminhos: o cacilheiro mais metro em quarenta minutos porta-a-porta, ou a Ponte 25 de Abril de carro — o que em hora de ponta pode transformar quarenta minutos em mais de uma hora. ' +
      'A oferta de serviços é completa: hospital Garcia de Orta, escolas, supermercados, farmácias. ' +
      'Os preços de habitação são significativamente mais baixos do que na margem norte para a mesma área útil. ' +
      'O negativo mais relevante: a dependência do rio é real — quando há atrasos nos cacilheiros ou acidentes na ponte, o percurso duplica de tempo. ' +
      'Para quem está sujeito a horários rígidos, este risco é material.',
    whoFitsHere:
      'Quem quer metros quadrados reais ao preço que Lisboa já não pratica, com tolerância para o Tejo como elemento do percurso diário.',
    whoDoesNotFit:
      'Quem precisa de percurso a Lisboa previsível ao minuto, ou de acesso a Lisboa de carro sem risco de congestionamento.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (cacilheiro + metro)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Rua Capitão Leitão (Almada)', note: 'o centro histórico de Almada — a câmara, a praça, o café de sempre' },
      { name: 'Rua Manuel Maria Barbosa du Bocage', note: 'a rua do poeta — ligação entre o núcleo histórico e os bairros residenciais' },
      { name: 'Avenida Dom Nuno Álvares Pereira (Cova da Piedade)', note: 'o eixo principal da Cova — supermercado, farmácia, escola secundária' },
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/almada-tejo-cristo-rei', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/margem-sul-tejo-cacilheiro', source: 'unsplash' },
    ],
  },

  {
    slug: 'cacilhas',
    name: 'Cacilhas',
    concelhoSlug: 'almada',
    archetype: 'transition',
    vector: { pace: 2, central: 1, green: 1, night: 2, family: 1, food: 3, walkable: 2, price: 1, character: 2 },
    oneLine: 'O cais, os tascos, a vista — e o cacilheiro que faz tudo mais perto do que parece.',
    honestDescription:
      'Cacilhas é a frente de água da margem sul com mais carácter — o cais dos cacilheiros, a vista para o Tejo e para Lisboa, os tascos que servem choco frito e bica a preços que Lisboa abandonou. ' +
      'A ligação a Lisboa é directa: o cacilheiro sai a cada vinte minutos e chega ao Cais do Sodré em sete minutos — o percurso mais curto de qualquer alternativa fora da cidade. ' +
      'A densidade residencial é menor do que em Almada centro, e a rua tem uma escala que permite vida de bairro real. ' +
      'O negativo concreto: a oferta residencial é limitada — a maioria dos imóveis é antiga, com necessidade de reabilitação, e a pressão de valorização começa a fazer-se sentir exactamente porque a localização é irresistível.',
    whoFitsHere:
      'Quem quer vida de bairro, preços de margem sul e sete minutos de barco para o centro de Lisboa.',
    whoDoesNotFit:
      'Quem precisa de imóvel moderno sem obras, famílias com muitas crianças, ou percurso de carro directo para Lisboa.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (cacilheiro directo)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'growing',
    },
    referenceStreets: [
      { name: 'Rua Cândido dos Reis', note: 'o coração de Cacilhas — do cais aos tascos, tudo passa por aqui' },
      { name: 'Rua Dom Francisco de Almeida', note: 'residencial tranquilo acima do cais — vistas para o Tejo nos dias claros' },
      { name: 'Rua do Prior', note: 'onde o bairro existe de facto — padaria, café, moradores que se conhecem' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/cacilhas-cais-cacilheiro-lisbon', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/cacilhas-tejo-view-lisbon', source: 'unsplash' },
    ],
  },

  // ─── Seixal (1) ───────────────────────────────────────────────────────────────

  {
    slug: 'amora',
    name: 'Amora',
    concelhoSlug: 'seixal',
    archetype: 'family-suburb',
    vector: { pace: 1, central: 0, green: 2, night: 1, family: 2, food: 1, walkable: 1, price: 1, character: 1 },
    oneLine: 'O subúrbio que cresceu junto ao estuário — acessível por comboio, invisível nos guias.',
    honestDescription:
      'Amora é uma das maiores freguesias do concelho do Seixal — resultado de décadas de construção residencial impulsionada por trabalhadores de Lisboa que procuravam preço. ' +
      'O comboio da linha do Seixal liga ao Barreiro, e dali cacilheiro ou ferry para Lisboa. ' +
      'O percurso tem partes móveis — duas ligações, dois meios de transporte — o que significa que um atraso multiplica. ' +
      'A oferta de bairro cobre o básico: supermercados, farmácias, escola, centro de saúde. ' +
      'O estuário do Tejo está próximo e tem troços de passadiço genuinamente agradáveis. ' +
      'O negativo concreto: Amora é uma cidade-dormitório na acepção mais directa do termo — a maior parte dos moradores trabalha fora, e a rua fica silenciosa nas horas fora do percurso casa-trabalho.',
    whoFitsHere:
      'Quem precisa de preço baixo, área grande, e aceita um percurso mais longo com uma ou duas transferências para Lisboa.',
    whoDoesNotFit:
      'Quem precisa de percurso directo a Lisboa, vida de bairro, ou qualidade de espaço público acima da média.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio + ferry)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Avenida da República (Amora)', note: 'o eixo principal — funcional, sem pretensões estéticas' },
      { name: 'Rua de Amora', note: 'o núcleo histórico pequeno que sobreviveu à expansão residencial' }, // TODO: validar com morador
      { name: 'Rua Dr. José Formosinho', note: 'residencial de blocos dos anos 80 — o Amora que a maioria dos moradores conhece' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/amora-seixal-estuario-tejo', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/seixal-margem-sul-lisboa', source: 'unsplash' },
    ],
  },

  // ─── Setúbal (1) ──────────────────────────────────────────────────────────────

  {
    slug: 'setubal-sao-sebastiao',
    name: 'Setúbal — São Sebastião',
    concelhoSlug: 'setubal',
    archetype: 'peripheral-residential',
    vector: { pace: 1, central: 0, green: 2, night: 1, family: 2, food: 2, walkable: 2, price: 1, character: 1 },
    oneLine: 'A cidade do Sado — longe o suficiente para ser barata, perto o suficiente para ser tentadora.',
    honestDescription:
      'Setúbal é a maior cidade da Margem Sul fora de Almada — com porto, mercado, centro histórico real e uma frente de estuário que a distingue dos subúrbios da AML. ' +
      'A ligação a Lisboa é por comboio Fertagus ou auto-estrada — entre quarenta e sessenta minutos dependendo do trânsito e da ligação. ' +
      'São Sebastião é a principal área residencial nova de Setúbal — urbanizações dos anos 1990-2010 com serviços completos e preços ainda significativamente abaixo de Lisboa. ' +
      'O mercado do Livramento é um dos melhores mercados de peixe do país e justifica por si só uma visita. ' +
      'O negativo material: Setúbal está fora da rede de metro e cacilheiro — a ligação a Lisboa é por comboio Fertagus, que tem horários mas não tem a frequência da linha de Cascais.',
    whoFitsHere:
      'Quem trabalha parcialmente remotamente, quer qualidade de vida real ao preço mais honesto da AML, e não tem medo de quarenta minutos de comboio.',
    whoDoesNotFit:
      'Quem precisa de estar em Lisboa todos os dias, ou de uma ligação de transporte público mais frequente e directa.',
    hardFacts: {
      medianAgeYears: null,                  // TODO: confirmar via INE
      tramMetroOrTrainToBaixaMinutes: null,   // TODO: confirmar via Google Maps (comboio Fertagus)
      medianT2RentEuros: null,               // TODO: confirmar via Idealista
      populationTrend3y: 'stable',
    },
    referenceStreets: [
      { name: 'Avenida Luísa Todi', note: 'a avenida ribeirinha — o mercado do Livramento numa extremidade, o estuário do Sado no olhar' },
      { name: 'Rua de Bocage', note: 'o centro histórico de Setúbal — o poeta, a câmara, as arcadas' },
      { name: 'Rua Dr. Alberto Gaio (São Sebastião)', note: 'residencial de São Sebastião — supermercado, escola, farmácia sem ter de ir ao centro' }, // TODO: validar com morador
    ],
    photoCredits: [
      { url: 'https://unsplash.com/s/photos/setubal-sado-estuario-portugal', source: 'unsplash' },
      { url: 'https://unsplash.com/s/photos/mercado-livramento-setubal', source: 'unsplash' },
    ],
  },
]
