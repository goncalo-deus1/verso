import mdRaw   from '../../../content/concelhos/06-almada.md?raw'
import mdRawEn from '../../../content/concelhos/en/06-almada.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine    = getConcelhoBySlug('almada')!
const lisboa = getConcelhoBySlug('lisboa')!
const ratio2019 = (ine.medianaT4_2019 / lisboa.medianaT4_2019)
const ratio2025 = (ine.medianaT4_2025 / lisboa.medianaT4_2025)

export default buildHub({
  slug: 'almada',
  mdRaw,
  mdRawEn,
  neighbors: ['seixal', 'barreiro', 'lisboa', 'sesimbra'],
  lede: `Almada custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Em 2019 estava a ${(ratio2019 * 100).toFixed(0).replace('.', ',')}% do preço de Lisboa concelho; em 2025, a ${(ratio2025 * 100).toFixed(0).replace('.', ',')}%. A margem sul a aproximar-se — Almada é o concelho de fronteira dessa convergência.`,
})
