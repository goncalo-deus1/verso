import mdRaw from '../../../content/concelhos/04-oeiras.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine    = getConcelhoBySlug('oeiras')!
const lisboa = getConcelhoBySlug('lisboa')!
const lisboa6 = getCrescimento6Anos(lisboa)

export default buildHub({
  slug: 'oeiras',
  mdRaw,
  neighbors: ['cascais', 'lisboa', 'sintra', 'amadora'],
  lede: `Oeiras custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos — quase o dobro de Lisboa concelho (${fmtPct(lisboa6, 0)}). Tagus Park, Lagoas Park e Carcavelos ancoram um eixo de escritórios e escolas internacionais que sustenta o preço.`,
})
