// TODO (sessão futura): script de fetching para popular hardFacts a partir
// de INE (população, idade, tendência) e Idealista (renda mediana T2).
// Os vetores permanecem editoriais — validação humana obrigatória.

export type ZoneVector = {
  pace:      0 | 1 | 2 | 3  // 0 = silencioso, 3 = cheio de movimento
  central:   0 | 1 | 2 | 3  // 0 = periferia, 3 = centro histórico
  green:     0 | 1 | 2 | 3  // 0 = betão, 3 = muito parque/verde
  night:     0 | 1 | 2 | 3  // 0 = morre às 22h, 3 = vida até tarde
  family:    0 | 1 | 2 | 3  // 0 = zero crianças, 3 = muito familiar
  food:      0 | 1 | 2 | 3  // 0 = básico, 3 = denso em restaurantes
  walkable:  0 | 1 | 2 | 3  // 0 = carro obrigatório, 3 = tudo a pé
  price:     0 | 1 | 2 | 3  // 0 = barato, 3 = caro
  character: 0 | 1 | 2 | 3  // 0 = genérico, 3 = histórico/marcado
}

export const VECTOR_DIMENSIONS = [
  'pace', 'central', 'green', 'night', 'family', 'food', 'walkable', 'price', 'character',
] as const

export type VectorDimension = typeof VECTOR_DIMENSIONS[number]
