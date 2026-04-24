/**
 * quiz/zones.ts
 *
 * Zonas de Lisboa para o motor de quiz Habitta.
 * Valores calibrados para ser realistas e consistentes entre zonas.
 *
 * Escala de atributos (0–10):
 *  0–3  = fraco / ausente
 *  4–6  = moderado
 *  7–8  = bom
 *  9–10 = excelente / referência
 */

import type { Zone } from './types'

export const zones: Zone[] = [
  {
    id: 'principe-real',
    nome: 'Príncipe Real',
    regiao: 'Lisboa',
    cidadesCompativeis: ['lisboa'],
    precoMin: 550000,
    tempoCentroLisboa: 5,

    centralidade:  10,
    espaco:         3,
    exterior:       4,
    natureza:       5,
    urbano:        10,
    equilibrio:     7,
    tranquilo:      5,
    investimento:   9,
    qualidadeVida:  9,
    familia:        5,

    pequenaDescricao:
      'O bairro mais sofisticado de Lisboa — jardins históricos, restaurantes de referência e uma comunidade cosmopolita. ' +
      'Preços elevados para apartamentos pequenos; o metro quadrado é dos mais caros do país. ' +
      'Ideal para quem quer Lisboa a 100% sem carro.',
  },

  {
    id: 'marvila',
    nome: 'Marvila',
    regiao: 'Lisboa Oriental',
    cidadesCompativeis: ['lisboa'],
    precoMin: 270000,
    tempoCentroLisboa: 15,

    centralidade:   7,
    espaco:         7,
    exterior:       5,
    natureza:       4,
    urbano:         8,
    equilibrio:     6,
    tranquilo:      4,
    investimento:  10,
    qualidadeVida:  6,
    familia:        4,

    pequenaDescricao:
      'A zona mais interessante para investimento em Lisboa — fábricas convertidas, preços moderados e crescimento acelerado. ' +
      'Ribeirinha emergente com breweries e galerias de arte. ' +
      'Não recomendado para quem precisa de infra-estrutura familiar já estabelecida.',
  },
]
