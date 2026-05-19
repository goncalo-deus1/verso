import mdRaw   from '../../../content/concelhos/01-lisboa.md?raw'
import mdRawEn from '../../../content/concelhos/en/01-lisboa.md?raw'
import { getConcelhoBySlug, getCrescimento6Anos } from '../concelhos-aml-2025'
import { fmtPriceEuroM2 as fmtPrice, fmtPct } from '../../../lib/format'
import { buildHub } from './_buildHub'
import type { ConcelhoDataFreguesia } from './_types'

const ine = getConcelhoBySlug('lisboa')!

const freguesias: ConcelhoDataFreguesia[] = [
  { slug: 'ajuda',                  name: 'Ajuda',                  microDesc: 'Palácio Nacional e Tapada; residencial tradicional com encostas íngremes.' },
  { slug: 'alcantara',              name: 'Alcântara',              microDesc: 'Antigo industrial reconvertido em ateliers e novos prédios; LX Factory como âncora.' },
  { slug: 'alvalade',               name: 'Alvalade',               microDesc: 'Centralidade lenta, premium estável; famílias com filhos em idade escolar.', hasPage: false },
  { slug: 'areeiro',                name: 'Areeiro',                microDesc: 'Valor em transição, eixo Saldanha; oferta gastronómica em expansão recente.' },
  { slug: 'arroios',                name: 'Arroios',                microDesc: 'Densidade alta e diversidade demográfica; o coração diverso de Lisboa.' },
  { slug: 'avenidas-novas',         name: 'Avenidas Novas',         microDesc: 'Centro reformatado; escritórios premium, edifícios de gama alta.' },
  { slug: 'beato',                  name: 'Beato',                  microDesc: 'Frente ribeirinha oriental; Hub Criativo e fábricas em conversão.' },
  { slug: 'belem',                  name: 'Belém',                  microDesc: 'Monumentos, museus e rio à porta; premium turístico estabelecido.' },
  { slug: 'benfica',                name: 'Benfica',                microDesc: 'Bairro consolidado a noroeste; estádio e Estrada de Benfica como espinha.' },
  { slug: 'campo-de-ourique',       name: 'Campo de Ourique',       microDesc: 'Bairro de família por excelência; mercado, gastronomia e comércio local denso.' },
  { slug: 'campolide',              name: 'Campolide',              microDesc: 'Sete Rios e Universidade Nova; conectividade ferroviária central.' },
  { slug: 'carnide',                name: 'Carnide',                microDesc: 'Colina norte com núcleo histórico preservado; perfil residencial tranquilo.' },
  { slug: 'estrela',                name: 'Estrela',                microDesc: 'Premium clássico; Jardim da Estrela, embaixadas, hospitais centrais.' },
  { slug: 'lumiar',                 name: 'Lumiar',                 microDesc: 'Subúrbio com metro; expansão familiar e zona com mais transações em 2025.' },
  { slug: 'marvila',                name: 'Marvila',                microDesc: 'Frente ribeirinha em reconversão; criativos, breweries e novos prédios.' },
  { slug: 'misericordia',           name: 'Misericórdia',           microDesc: 'Bairro Alto, Chiado, Príncipe Real; núcleo histórico com nightlife.' },
  { slug: 'olivais',                name: 'Olivais',                microDesc: 'Habitação planeada anos 60; periférico-central, equilíbrio preço/serviços.' },
  { slug: 'parque-das-nacoes',      name: 'Parque das Nações',      microDesc: 'Expo 98, planeamento moderno, rio; a freguesia mais nova de Lisboa.' },
  { slug: 'penha-de-franca',        name: 'Penha de França',        microDesc: 'Bairro de colina; miradouro, transição residencial em curso.' },
  { slug: 'santa-clara',            name: 'Santa Clara',            microDesc: 'Alta de Lisboa; periferia norte com habitação social planeada.' },
  { slug: 'santa-maria-maior',      name: 'Santa Maria Maior',      microDesc: 'Alfama, Mouraria, Castelo; turismo intensivo, habitação histórica.' },
  { slug: 'santo-antonio',          name: 'Santo António',          microDesc: 'Avenida da Liberdade; luxo, escritórios corporativos, hotéis 5 estrelas.' },
  { slug: 'sao-domingos-de-benfica', name: 'São Domingos de Benfica', microDesc: 'Burguesia consolidada; embaixadas, Quinta da Granja, edifícios anos 60–80.' },
  { slug: 'sao-vicente',            name: 'São Vicente',            microDesc: 'Graça, miradouros, panteão; gentrificação activa, núcleo vibrante.' },
]

export default buildHub({
  slug: 'lisboa',
  mdRaw,
  mdRawEn,
  neighbors: ['cascais', 'oeiras', 'loures', 'amadora'],
  freguesias,
  lede: `Lisboa concelho custa ${fmtPrice(ine.medianaT4_2025)} em 2025 (INE). Cresceu ${fmtPct(getCrescimento6Anos(ine), 0)} em 6 anos — a margem sul, no mesmo período, mais do dobro. A Lisboa que conheces é um dos 18 concelhos da AML, e está entre os que crescem mais devagar.`,
})
