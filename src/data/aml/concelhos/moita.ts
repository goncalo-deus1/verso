import mdRaw from '../../../content/concelhos/14-moita.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine      = getConcelhoBySlug('moita')!
const barreiro = getConcelhoBySlug('barreiro')!

export default buildHub({
  slug: 'moita',
  mdRaw,
  neighbors: ['barreiro', 'montijo', 'palmela', 'alcochete'],
  lede: `Moita custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE) — o concelho mais barato da AML. Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos, a maior valorização percentual da AML. Em 2019 custava ${fmtPrice(ine.medianaT4_2019)}; em 2025, custa praticamente o que o Barreiro custava em 2019 (${fmtPrice(barreiro.medianaT4_2019)}).`,
})
