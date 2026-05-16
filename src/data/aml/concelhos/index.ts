import type { ConcelhoData } from './_types'
import lisboa             from './lisboa'
import cascais            from './cascais'
import oeiras             from './oeiras'
import sintra             from './sintra'
import loures             from './loures'
import almada             from './almada'
import amadora            from './amadora'
import seixal             from './seixal'
import odivelas           from './odivelas'
import vilaFrancaDeXira   from './vila-franca-de-xira'
import setubal            from './setubal'
import mafra              from './mafra'
import barreiro           from './barreiro'
import moita              from './moita'
import montijo            from './montijo'
import alcochete          from './alcochete'
import sesimbra           from './sesimbra'
import palmela            from './palmela'

export const concelhoData: Record<string, ConcelhoData> = {
  lisboa,
  cascais,
  oeiras,
  sintra,
  loures,
  almada,
  amadora,
  seixal,
  odivelas,
  'vila-franca-de-xira': vilaFrancaDeXira,
  setubal,
  mafra,
  barreiro,
  moita,
  montijo,
  alcochete,
  sesimbra,
  palmela,
}

export function getConcelhoHub(slug: string): ConcelhoData | undefined {
  return concelhoData[slug]
}

/** All registered slugs, in fixed order. Used by sitemap generator. */
export const ALL_CONCELHO_SLUGS = Object.keys(concelhoData)
