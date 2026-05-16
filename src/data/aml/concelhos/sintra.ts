import mdRaw from '../../../content/concelhos/02-sintra.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('sintra')!

export default buildHub({
  slug: 'sintra',
  mdRaw,
  neighbors: ['mafra', 'cascais', 'amadora', 'loures'],
  lede: `Sintra custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. É o concelho mais populoso da AML — 388 mil habitantes — e divide-se entre dormitório de Lisboa e património serra. O preço sobe; a identidade é mais do que uma.`,
})
