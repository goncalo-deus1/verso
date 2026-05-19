import mdRaw   from '../../../content/concelhos/07-amadora.md?raw'
import mdRawEn from '../../../content/concelhos/en/07-amadora.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('amadora')!

export default buildHub({
  slug: 'amadora',
  mdRaw,
  mdRawEn,
  neighbors: ['lisboa', 'oeiras', 'odivelas', 'sintra'],
  lede: `Amadora custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. O concelho mais denso da AML, com metro directo a Lisboa e preço mediano abaixo de 3.000 €/m². Funciona para quem trabalha em Lisboa e prioriza transporte público sobre espaço.`,
})
