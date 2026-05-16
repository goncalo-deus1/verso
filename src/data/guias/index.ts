import type { PillarPageProps } from '../../pages/guias/PillarPage'
import amlNaoELisboa from './aml-nao-e-lisboa'

export const pillarData: Record<string, PillarPageProps> = {
  'aml-nao-e-lisboa': amlNaoELisboa,
}

export function getPillar(slug: string): PillarPageProps | undefined {
  return pillarData[slug]
}
