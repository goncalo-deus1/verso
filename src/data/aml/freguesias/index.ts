/**
 * freguesias/index.ts — registry of freguesia data files.
 *
 * Static imports only (no dynamic require, no fetch). The Vite bundler
 * tree-shakes unused freguesias from the client; the SSR build imports
 * the whole registry so the prerender harness can render any of them.
 *
 * To register a new freguesia:
 *   1. Add the data file at ./<concelho>/<slug>.ts (default export of
 *      FreguesiaPageProps).
 *   2. Import it below and add it to the nested map.
 */

import type { FreguesiaPageProps } from '../../../pages/aml/FreguesiaPage'
import alvalade from './lisboa/alvalade'

export const freguesiaData: Record<string, Record<string, FreguesiaPageProps>> = {
  lisboa: {
    alvalade,
  },
}

export function getFreguesia(
  concelhoSlug: string,
  freguesiaSlug: string,
): FreguesiaPageProps | undefined {
  return freguesiaData[concelhoSlug]?.[freguesiaSlug]
}
