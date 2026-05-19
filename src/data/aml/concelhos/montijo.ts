import mdRaw   from '../../../content/concelhos/15-montijo.md?raw'
import mdRawEn from '../../../content/concelhos/en/15-montijo.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('montijo')!

export default buildHub({
  slug: 'montijo',
  mdRaw,
  mdRawEn,
  neighbors: ['alcochete', 'moita', 'palmela', 'barreiro'],
  lede: `Montijo custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. O novo aeroporto Luís de Camões em Alcochete (vizinho) começou a precificar a região há 2 anos — Montijo é beneficiária indirecta da decisão.`,
})
