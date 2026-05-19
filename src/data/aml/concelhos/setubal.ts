import mdRaw   from '../../../content/concelhos/11-setubal.md?raw'
import mdRawEn from '../../../content/concelhos/en/11-setubal.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('setubal')!
const yoy2024 = ((ine.medianaT4_2024 - ine.medianaT4_2023) / ine.medianaT4_2023) * 100

export default buildHub({
  slug: 'setubal',
  mdRaw,
  mdRawEn,
  neighbors: ['palmela', 'sesimbra', 'barreiro', 'seixal'],
  lede: `Setúbal custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Capital de distrito, Arrábida à porta, e a nova ligação ferroviária Sesimbra–Lisboa (planeada para 2028) já está precificada. Só em 2024 subiu ${fmtPct(yoy2024)}.`,
})
