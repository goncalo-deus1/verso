// AUTO-GENERATED FROM INE Q4 2025 DATA
// Source: INE — Estatísticas de Preços da Habitação ao nível local
//         4.º trimestre de 2025, publicado 24 abr 2026
//         CSV: Últimos 12 meses, NUTS 2024 (concelhos)
// DO NOT EDIT MANUALLY. Regenerate when INE publishes Q1 2026 (jul 2026).

export interface ConcelhoData {
  /** Nome oficial do concelho */
  name: string;
  /** Slug para URLs (lowercase, hyphenated, no diacritics) */
  slug: string;
  /** Código INE NUTS 2024 */
  codigoINE: string;
  /** Sub-região NUTS III */
  subRegiao: 'Grande Lisboa' | 'Península de Setúbal';
  /** Preço mediano €/m² — 12 meses até dez 2025 */
  medianaT4_2025: number;
  /** Preço mediano €/m² — 12 meses até dez 2024 */
  medianaT4_2024: number;
  /** Preço mediano €/m² — 12 meses até dez 2023 */
  medianaT4_2023: number;
  /** Preço mediano €/m² — 12 meses até dez 2019 (baseline) */
  medianaT4_2019: number;
  /** 1.º quartil €/m² — 12 meses até dez 2025 */
  q1_T4_2025: number;
  /** 3.º quartil €/m² — 12 meses até dez 2025 */
  q3_T4_2025: number;
}

/** Sub-region totals — for "Lisboa vs AML" comparisons */
export const SUB_REGIOES_AML = {
  grandeLisboa: { mediana2025: 3439, yoy: 17.0 },
  peninsulaSetubal: { mediana2025: 2596, yoy: 22.6 },
  portugal: { mediana2025: 2076, yoy: 16.8 },
} as const;

/** All 18 AML concelhos, sorted by mediana 2025 descending */
export const CONCELHOS_AML: ConcelhoData[] = [
  {
    name: 'Lisboa',
    slug: 'lisboa',
    codigoINE: '1A01106',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 4875,
    medianaT4_2024: 4340,
    medianaT4_2023: 4167,
    medianaT4_2019: 3286,
    q1_T4_2025: 3966,
    q3_T4_2025: 6051,
  },
  {
    name: 'Cascais',
    slug: 'cascais',
    codigoINE: '1A01105',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 4550,
    medianaT4_2024: 4053,
    medianaT4_2023: 3976,
    medianaT4_2019: 2588,
    q1_T4_2025: 3582,
    q3_T4_2025: 5942,
  },
  {
    name: 'Oeiras',
    slug: 'oeiras',
    codigoINE: '1A01110',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 4187,
    medianaT4_2024: 3471,
    medianaT4_2023: 3158,
    medianaT4_2019: 2256,
    q1_T4_2025: 3345,
    q3_T4_2025: 4883,
  },
  {
    name: 'Odivelas',
    slug: 'odivelas',
    codigoINE: '1A01116',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 3282,
    medianaT4_2024: 2765,
    medianaT4_2023: 2517,
    medianaT4_2019: 1814,
    q1_T4_2025: 2778,
    q3_T4_2025: 3833,
  },
  {
    name: 'Almada',
    slug: 'almada',
    codigoINE: '1B01503',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 3160,
    medianaT4_2024: 2644,
    medianaT4_2023: 2374,
    medianaT4_2019: 1533,
    q1_T4_2025: 2563,
    q3_T4_2025: 3824,
  },
  {
    name: 'Loures',
    slug: 'loures',
    codigoINE: '1A01107',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 3057,
    medianaT4_2024: 2609,
    medianaT4_2023: 2482,
    medianaT4_2019: 1641,
    q1_T4_2025: 2277,
    q3_T4_2025: 3709,
  },
  {
    name: 'Amadora',
    slug: 'amadora',
    codigoINE: '1A01115',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 2986,
    medianaT4_2024: 2481,
    medianaT4_2023: 2260,
    medianaT4_2019: 1500,
    q1_T4_2025: 2487,
    q3_T4_2025: 3528,
  },
  {
    name: 'Mafra',
    slug: 'mafra',
    codigoINE: '1A01109',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 2860,
    medianaT4_2024: 2410,
    medianaT4_2023: 2200,
    medianaT4_2019: 1354,
    q1_T4_2025: 2210,
    q3_T4_2025: 3575,
  },
  {
    name: 'Alcochete',
    slug: 'alcochete',
    codigoINE: '1B01502',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 2765,
    medianaT4_2024: 2106,
    medianaT4_2023: 2086,
    medianaT4_2019: 1393,
    q1_T4_2025: 2162,
    q3_T4_2025: 3280,
  },
  {
    name: 'Sesimbra',
    slug: 'sesimbra',
    codigoINE: '1B01511',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 2765,
    medianaT4_2024: 2295,
    medianaT4_2023: 2086,
    medianaT4_2019: 1324,
    q1_T4_2025: 2253,
    q3_T4_2025: 3272,
  },
  {
    name: 'Sintra',
    slug: 'sintra',
    codigoINE: '1A01111',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 2733,
    medianaT4_2024: 2226,
    medianaT4_2023: 2014,
    medianaT4_2019: 1213,
    q1_T4_2025: 2273,
    q3_T4_2025: 3205,
  },
  {
    name: 'Seixal',
    slug: 'seixal',
    codigoINE: '1B01510',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 2654,
    medianaT4_2024: 2171,
    medianaT4_2023: 1992,
    medianaT4_2019: 1146,
    q1_T4_2025: 2218,
    q3_T4_2025: 3130,
  },
  {
    name: 'Vila Franca de Xira',
    slug: 'vila-franca-de-xira',
    codigoINE: '1A01114',
    subRegiao: 'Grande Lisboa',
    medianaT4_2025: 2605,
    medianaT4_2024: 2102,
    medianaT4_2023: 1897,
    medianaT4_2019: 1204,
    q1_T4_2025: 2149,
    q3_T4_2025: 3094,
  },
  {
    name: 'Barreiro',
    slug: 'barreiro',
    codigoINE: '1B01504',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 2508,
    medianaT4_2024: 1942,
    medianaT4_2023: 1687,
    medianaT4_2019: 948,
    q1_T4_2025: 2038,
    q3_T4_2025: 2949,
  },
  {
    name: 'Montijo',
    slug: 'montijo',
    codigoINE: '1B01507',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 2472,
    medianaT4_2024: 2040,
    medianaT4_2023: 1840,
    medianaT4_2019: 1204,
    q1_T4_2025: 1999,
    q3_T4_2025: 2849,
  },
  {
    name: 'Setúbal',
    slug: 'setubal',
    codigoINE: '1B01512',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 2468,
    medianaT4_2024: 2036,
    medianaT4_2023: 1835,
    medianaT4_2019: 1092,
    q1_T4_2025: 1995,
    q3_T4_2025: 3025,
  },
  {
    name: 'Palmela',
    slug: 'palmela',
    codigoINE: '1B01508',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 2263,
    medianaT4_2024: 1921,
    medianaT4_2023: 1764,
    medianaT4_2019: 967,
    q1_T4_2025: 1859,
    q3_T4_2025: 2703,
  },
  {
    name: 'Moita',
    slug: 'moita',
    codigoINE: '1B01506',
    subRegiao: 'Península de Setúbal',
    medianaT4_2025: 2226,
    medianaT4_2024: 1713,
    medianaT4_2023: 1498,
    medianaT4_2019: 792,
    q1_T4_2025: 1774,
    q3_T4_2025: 2633,
  },
];

/** Helper: get a concelho by slug */
export function getConcelhoBySlug(slug: string): ConcelhoData | undefined {
  return CONCELHOS_AML.find(c => c.slug === slug);
}

/** Helper: YoY growth percentage */
export function getYoY(c: ConcelhoData): number {
  return ((c.medianaT4_2025 - c.medianaT4_2024) / c.medianaT4_2024) * 100;
}

/** Helper: 6-year growth percentage (2019 baseline) */
export function getCrescimento6Anos(c: ConcelhoData): number {
  return ((c.medianaT4_2025 - c.medianaT4_2019) / c.medianaT4_2019) * 100;
}

/** Citation string for use in factSources */
export const INE_2025_FONTE =
  'INE — Estatísticas de Preços da Habitação ao nível local, Q4 2025 ' +
  '(12 meses até dez 2025), publicado 24 abr 2026';
