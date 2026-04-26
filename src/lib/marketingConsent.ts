/**
 * marketingConsent.ts — RGPD-compliant marketing consent persistence.
 * Saves user consent choice to the `profiles` table in Supabase.
 * The columns already exist: marketing_consent, marketing_consent_at,
 * marketing_consent_source, marketing_consent_text, marketing_unsubscribed,
 * marketing_unsubscribed_at.
 */

import { supabase } from './supabase'

export const MARKETING_CONSENT_TEXT_PT =
  'Quero receber dicas sobre as zonas certas para viver, novos artigos ' +
  'editoriais e atualizações ocasionais do Habitta. Posso cancelar a ' +
  'qualquer momento.'

export async function saveMarketingConsent(opts: {
  userId: string
  consented: boolean
  source: 'signup' | 'quiz_end'
}): Promise<void> {
  if (!opts.consented) {
    await supabase
      .from('profiles')
      .update({
        marketing_consent: false,
        marketing_consent_source: opts.source,
      })
      .eq('id', opts.userId)
    return
  }

  await supabase
    .from('profiles')
    .update({
      marketing_consent: true,
      marketing_consent_at: new Date().toISOString(),
      marketing_consent_source: opts.source,
      marketing_consent_text: MARKETING_CONSENT_TEXT_PT,
      marketing_unsubscribed: false,
      marketing_unsubscribed_at: null,
    })
    .eq('id', opts.userId)
}
