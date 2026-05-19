import mdRaw   from '../../../content/concelhos/16-alcochete.md?raw'
import mdRawEn from '../../../content/concelhos/en/16-alcochete.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'

const ine = getConcelhoBySlug('alcochete')!

export default buildHub({
  slug: 'alcochete',
  mdRaw,
  mdRawEn,
  neighbors: ['montijo', 'vila-franca-de-xira', 'palmela', 'moita'],
  lede: `Alcochete custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos. Concelho de 17 mil habitantes que vai sediar o novo aeroporto Luís de Camões. Entre 2034 e 2037 a equação muda inteiramente — quem comprar antes apanha a curva.`,
})
