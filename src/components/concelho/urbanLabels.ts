export const CATEGORY_PT = {
  metro: 'Metro',
  ferrovia: 'Ferrovia',
  rodoviario: 'Rodoviário',
  escola: 'Escola',
  hospital: 'Hospital',
  habitacao: 'Habitação',
  parque: 'Parque',
  ciclovia: 'Ciclovia',
  requalificacao: 'Requalificação',
  outro: 'Outro',
} as const

export const STATUS_PT = {
  planeado: 'Planeado',
  aprovado: 'Aprovado',
  em_construcao: 'Em construção',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
} as const

export const STATUS_ACCENT_VAR: Record<string, string> = {
  planeado: 'var(--traco)',
  aprovado: 'var(--salva-claro)',
  em_construcao: 'var(--telha)',
  concluido: 'var(--salva)',
  cancelado: 'var(--traco)',
}
