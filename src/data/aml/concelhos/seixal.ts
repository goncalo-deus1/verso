import mdRaw from '../../../content/concelhos/08-seixal.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine    = getConcelhoBySlug('seixal')!
const lisboa = getConcelhoBySlug('lisboa')!
const descLisboa = ((1 - ine.medianaT4_2025 / lisboa.medianaT4_2025) * 100).toFixed(0).replace('.', ',')

export default buildHub({
  slug: 'seixal',
  mdRaw,
  neighbors: ['almada', 'barreiro', 'moita', 'sesimbra'],
  lede: `Seixal custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Margem sul com Fertagus directo a Lisboa, e preços ${descLisboa}% abaixo do concelho de Lisboa. Para famílias com filhos pequenos, é onde a aritmética compensa.`,
})
