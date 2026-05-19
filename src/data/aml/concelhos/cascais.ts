import mdRaw   from '../../../content/concelhos/03-cascais.md?raw'
import mdRawEn from '../../../content/concelhos/en/03-cascais.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine    = getConcelhoBySlug('cascais')!
const lisboa = getConcelhoBySlug('lisboa')!
const gap2019 = lisboa.medianaT4_2019 - ine.medianaT4_2019
const gap2025 = lisboa.medianaT4_2025 - ine.medianaT4_2025

export default buildHub({
  slug: 'cascais',
  mdRaw,
  mdRawEn,
  neighbors: ['lisboa', 'oeiras', 'sintra', 'mafra'],
  lede: `Cascais custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. A diferença para Lisboa concelho reduziu-se de ${gap2019} €/m² em 2019 para ${gap2025} em 2025 — é o concelho que mais se aproximou de Lisboa em preço.`,
})
