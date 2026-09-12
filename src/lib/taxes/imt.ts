export type IMTPurpose = 'permanentHome' | 'secondaryHome'
export type IMTRegion = 'mainland' | 'islands'
export type IMTExemptionType = 'none' | 'total' | 'partial'

export type IMTBracket = {
  min: number
  max: number
  rate: number
  deduction: number
  flatRateOnly?: boolean
}

export type CalculateIMTInput = {
  taxableValue: number
  purpose: IMTPurpose
  region: IMTRegion
  ageUnder35: boolean
  firstPermanentHome: boolean
}

export type CalculateIMTResult = {
  imt: number
  exemptionApplied: boolean
  exemptionType: IMTExemptionType
  note?: string
}

export const IMT_TABLES_2026: Record<IMTRegion, Record<IMTPurpose, IMTBracket[]>> = {
  mainland: {
    permanentHome: [
      { min: 0, max: 106346, rate: 0, deduction: 0 },
      { min: 106346, max: 145470, rate: 0.02, deduction: 2126.92 },
      { min: 145470, max: 198347, rate: 0.05, deduction: 6491.02 },
      { min: 198347, max: 330539, rate: 0.07, deduction: 10457.96 },
      { min: 330539, max: 660982, rate: 0.08, deduction: 13763.35 },
      { min: 660982, max: 1150853, rate: 0.06, deduction: 0, flatRateOnly: true },
      { min: 1150853, max: Infinity, rate: 0.075, deduction: 0, flatRateOnly: true },
    ],
    secondaryHome: [
      { min: 0, max: 106346, rate: 0.01, deduction: 0 },
      { min: 106346, max: 145470, rate: 0.02, deduction: 1063.46 },
      { min: 145470, max: 198347, rate: 0.05, deduction: 5427.56 },
      { min: 198347, max: 330539, rate: 0.07, deduction: 9394.50 },
      { min: 330539, max: 633931, rate: 0.08, deduction: 12699.89 },
      { min: 633931, max: 1150853, rate: 0.06, deduction: 0, flatRateOnly: true },
      { min: 1150853, max: Infinity, rate: 0.075, deduction: 0, flatRateOnly: true },
    ],
  },
  islands: {
    permanentHome: [
      { min: 0, max: 132933, rate: 0, deduction: 0 },
      { min: 132933, max: 181838, rate: 0.02, deduction: 2658.66 },
      { min: 181838, max: 247934, rate: 0.05, deduction: 8113.80 },
      { min: 247934, max: 413174, rate: 0.07, deduction: 13072.48 },
      { min: 413174, max: 826228, rate: 0.08, deduction: 17204.22 },
      { min: 826228, max: 1438566, rate: 0.06, deduction: 0, flatRateOnly: true },
      { min: 1438566, max: Infinity, rate: 0.075, deduction: 0, flatRateOnly: true },
    ],
    secondaryHome: [
      { min: 0, max: 132933, rate: 0.01, deduction: 0 },
      { min: 132933, max: 181838, rate: 0.02, deduction: 1329.33 },
      { min: 181838, max: 247934, rate: 0.05, deduction: 6784.47 },
      { min: 247934, max: 413174, rate: 0.07, deduction: 11743.15 },
      { min: 413174, max: 792414, rate: 0.08, deduction: 15874.89 },
      { min: 792414, max: 1438566, rate: 0.06, deduction: 0, flatRateOnly: true },
      { min: 1438566, max: Infinity, rate: 0.075, deduction: 0, flatRateOnly: true },
    ],
  },
}

// Estes limites devem ser validados e atualizados anualmente com fontes oficiais, porque podem mudar.
export const YOUNG_EXEMPTION_FULL_LIMIT = 324058
export const YOUNG_EXEMPTION_PARTIAL_LIMIT = 648022

function calculateFromTable(value: number, brackets: IMTBracket[]) {
  const safeValue = Math.max(value, 0)
  const bracket = brackets.find(item => safeValue <= item.max) ?? brackets[brackets.length - 1]
  const tax = bracket.flatRateOnly
    ? safeValue * bracket.rate
    : safeValue * bracket.rate - bracket.deduction

  return Math.max(tax, 0)
}

export function calculateIMT({
  taxableValue,
  purpose,
  region,
  ageUnder35,
  firstPermanentHome,
}: CalculateIMTInput): CalculateIMTResult {
  const safeTaxableValue = Math.max(taxableValue, 0)
  const table = IMT_TABLES_2026[region][purpose]
  const canApplyYoungRegime = ageUnder35 && firstPermanentHome && purpose === 'permanentHome'

  if (canApplyYoungRegime && safeTaxableValue <= YOUNG_EXEMPTION_FULL_LIMIT) {
    return {
      imt: 0,
      exemptionApplied: true,
      exemptionType: 'total',
      note: 'Aplicámos a isenção total jovem nesta estimativa.',
    }
  }

  if (canApplyYoungRegime && safeTaxableValue <= YOUNG_EXEMPTION_PARTIAL_LIMIT) {
    return {
      imt: calculateFromTable(safeTaxableValue - YOUNG_EXEMPTION_FULL_LIMIT, table),
      exemptionApplied: true,
      exemptionType: 'partial',
      note: 'Aplicámos uma estimativa simplificada da isenção parcial jovem. Confirma sempre o valor final com a Autoridade Tributária, notário ou solicitador.',
    }
  }

  return {
    imt: calculateFromTable(safeTaxableValue, table),
    exemptionApplied: false,
    exemptionType: 'none',
    note: canApplyYoungRegime
      ? 'O valor do imóvel pode ultrapassar o limite de aplicação do regime jovem.'
      : undefined,
  }
}
