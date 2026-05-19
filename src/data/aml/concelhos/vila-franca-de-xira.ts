import mdRaw   from '../../../content/concelhos/10-vila-franca-de-xira.md?raw'
import mdRawEn from '../../../content/concelhos/en/10-vila-franca-de-xira.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('vila-franca-de-xira')!

export default buildHub({
  slug: 'vila-franca-de-xira',
  mdRaw,
  mdRawEn,
  neighbors: ['loures', 'odivelas', 'mafra', 'alcochete'],
  lede: `Vila Franca de Xira custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Margem norte do Tejo, com Linha Azambuja (CP) directa a Santa Apolónia. Para quem aceita 30 minutos de comboio, é o preço mais baixo da Grande Lisboa.`,
})
