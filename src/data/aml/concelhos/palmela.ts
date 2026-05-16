import mdRaw from '../../../content/concelhos/18-palmela.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('palmela')!

export default buildHub({
  slug: 'palmela',
  mdRaw,
  neighbors: ['setubal', 'sesimbra', 'montijo', 'moita'],
  lede: `Palmela custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Autoeuropa e Pinhal Novo (Fertagus) ancoram a economia. Pinhal Novo está a 30 minutos de Lisboa por comboio; Palmela-vila é outra coisa.`,
})
