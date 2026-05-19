import mdRaw   from '../../../content/concelhos/17-sesimbra.md?raw'
import mdRawEn from '../../../content/concelhos/en/17-sesimbra.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('sesimbra')!

export default buildHub({
  slug: 'sesimbra',
  mdRaw,
  mdRawEn,
  neighbors: ['setubal', 'almada', 'seixal', 'palmela'],
  lede: `Sesimbra custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Pesca, Arrábida e turismo de fim-de-semana. A futura ligação ferroviária a Lisboa (2028) é a variável a observar — pode separar Sesimbra de Setúbal pela primeira vez.`,
})
