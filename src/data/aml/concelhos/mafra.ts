import mdRaw   from '../../../content/concelhos/12-mafra.md?raw'
import mdRawEn from '../../../content/concelhos/en/12-mafra.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('mafra')!

export default buildHub({
  slug: 'mafra',
  mdRaw,
  mdRawEn,
  neighbors: ['sintra', 'loures', 'cascais', 'vila-franca-de-xira'],
  lede: `Mafra custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Concelho rural-suburbano a norte de Sintra. Para quem trabalha remoto e quer espaço por orçamento de T2 em Lisboa, Mafra dá T3 com terreno.`,
})
