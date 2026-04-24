// attributes.ts — 10 dimensões ortogonais do modelo Habitta

export type Attribute =
  | 'centralidade'   // 0 periferia, 100 centro histórico
  | 'urbanidade'     // 0 subúrbio/rural, 100 denso urbano
  | 'tranquilidade'  // 0 barulho constante, 100 silêncio
  | 'familiar'       // 0 não familiar, 100 desenhado para famílias
  | 'jovem'          // 0 envelhecido, 100 pendor jovem/estudante
  | 'acessibilidade' // 0 carro obrigatório, 100 transportes densos
  | 'mar'            // 0 interior, 100 à beira-mar
  | 'espaco'         // 0 casas pequenas, 100 casas amplas/quintais
  | 'maturidade'     // 0 em transformação, 100 consolidada
  | 'valorizacao'    // 0 mercado estagnado, 100 forte potencial

export const ATTRIBUTES: Attribute[] = [
  'centralidade', 'urbanidade', 'tranquilidade', 'familiar', 'jovem',
  'acessibilidade', 'mar', 'espaco', 'maturidade', 'valorizacao',
]

export type ZoneProfile = Record<Attribute, number>  // cada valor 0–100

export const ATTRIBUTE_LABELS: Record<Attribute, string> = {
  centralidade:   'centralidade',
  urbanidade:     'urbanidade',
  tranquilidade:  'tranquilidade',
  familiar:       'ambiente familiar',
  jovem:          'perfil jovem',
  acessibilidade: 'acessibilidade',
  mar:            'proximidade ao mar',
  espaco:         'espaço',
  maturidade:     'consolidação',
  valorizacao:    'potencial de valorização',
}
