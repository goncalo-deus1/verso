/**
 * matchPhrases.ts
 *
 * 18 entradas (9 dimensões × 2 níveis) em português europeu, voz VERSO.
 * Cada função recebe o nome do sítio e devolve uma frase que acaba em ponto final.
 */

export const matchPhrases: Record<string, (target: string) => string> = {
  'pace-low':
    (t) => `Disseste que querias ouvir os elétricos. Em ${t}, consegues.`,

  'pace-high':
    (t) => `Pediste motor, trânsito, gente a caminhar depressa. ${t} tem isso todos os dias úteis.`,

  'central-high':
    (t) => `Pediste estar a pé de tudo. ${t} está.`,

  'central-low':
    (t) => `Aceitas trocar centro por espaço e verde. ${t} devolve-te essa troca com juros.`,

  'green-high':
    (t) => `Pediste parque à porta. ${t} tem-no — e tem-no a sério, não por decreto.`,

  'green-low':
    (t) => `Não precisas de verde a metros de casa. ${t} compensa com densidade e acesso.`,

  'night-high':
    (t) => `Pediste cidade que não dorme. ${t} ainda tem luz acesa quando chegares do jantar.`,

  'night-low':
    (t) => `Querias rua silenciosa à meia-noite. ${t} deita-se cedo — como tu.`,

  'family-high':
    (t) => `Pediste uma casa que coubesse à família. ${t} foi desenhado para isso.`,

  'family-low':
    (t) => `Não tens filhos em casa — ou não quiseste que pesassem. ${t} não te obriga a pensar nisso.`,

  'food-high':
    (t) => `Pediste mercado e almoço longo lá fora. ${t} vive disso.`,

  'food-low':
    (t) => `A oferta gastronómica não era a tua prioridade. ${t} tem outras razões para existir.`,

  'walkable-high':
    (t) => `Quiseste que o teu raio de acção fosse a pé. ${t} faz isso possível — e sem esforço.`,

  'walkable-low':
    (t) => `Aceitas pegar no carro ou no comboio. ${t} devolve-te espaço e verde em troca.`,

  'price-high':
    (t) => `Escolheste um sítio caro porque vale o preço. Em ${t}, pagares mais é pagar pelo sítio em si.`,

  'price-low':
    (t) => `Procuras onde o dinheiro ainda faz sentido. ${t} é um desses sítios — por agora.`,

  'character-high':
    (t) => `Pediste uma rua com história, não com decoração. ${t} tem essa espessura.`,

  'character-low':
    (t) => `Não precisas de bairro com nome nos guias. ${t} tem outras qualidades que interessam mais.`,
}
