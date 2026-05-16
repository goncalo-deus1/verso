import mdRaw from '../../../content/concelhos/13-barreiro.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('barreiro')!

export default buildHub({
  slug: 'barreiro',
  mdRaw,
  neighbors: ['moita', 'seixal', 'setubal', 'montijo'],
  lede: `Barreiro custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos — o segundo concelho que mais valorizou na AML. Identidade industrial em reconversão; a Terceira Travessia do Tejo (planeada) pode acelerar a curva.`,
})
