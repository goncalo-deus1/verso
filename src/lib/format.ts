/**
 * format.ts — number formatting helpers.
 *
 * Manual implementation rather than Intl.NumberFormat because Node's
 * ICU may not insert the pt-PT thousands separator on 4-digit numbers,
 * which produces SSR/CSR drift. These helpers are deterministic across
 * environments.
 */

/** Insert "." as thousands separator (pt-PT convention). */
export function fmtThousand(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Format a €/m² value: "4.875 €/m²". */
export function fmtPriceEuroM2(n: number): string {
  return `${fmtThousand(n)} €/m²`
}

/** Format a percentage with comma decimal: "+12,3%" or "-2,1%". */
export function fmtPct(n: number, digits = 1): string {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(digits).replace('.', ',')}%`
}
