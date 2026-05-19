import mdRaw   from '../../../content/concelhos/09-odivelas.md?raw'
import mdRawEn from '../../../content/concelhos/en/09-odivelas.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('odivelas')!

export default buildHub({
  slug: 'odivelas',
  mdRaw,
  mdRawEn,
  neighbors: ['loures', 'amadora', 'lisboa', 'vila-franca-de-xira'],
  lede: `Odivelas custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Metro directo a Lisboa pela Linha Amarela, com preços inferiores à Amadora vizinha. A Linha Violeta (2027) vai mudar esta equação.`,
})
