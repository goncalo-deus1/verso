import mdRaw from '../../../content/concelhos/05-loures.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('loures')!

export default buildHub({
  slug: 'loures',
  mdRaw,
  neighbors: ['lisboa', 'odivelas', 'vila-franca-de-xira', 'mafra'],
  lede: `Loures custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Norte de Lisboa, com ligação directa por metro a partir de 2027 (Linha Violeta). O preço por m² ainda comporta T3 em zona urbana abaixo dos 350.000 €.`,
})
