// resultGate.ts — defines which dossier sections are visible to anonymous users
// and which require authentication.

export const RESULT_GATE = {
  /** Always rendered without any filter — the value the user takes before signing in. */
  visible: ['name', 'editorialSummary'] as const,

  /**
   * Rendered but blurred (filter: blur(8px); pointer-events: none) when the
   * user is not authenticated. The first blurred section (affinity) additionally
   * carries the login CTA overlay; subsequent ones are just blurred.
   */
  blurred: [
    'affinity',        // "Afinidade · X / 100" score readout
    'mapLocation',     // mini-mapa AML column in ZonaHero
    'porqueEstaZona',  // § 01 contribution bars + editorial argument
    'mapaInterativo',  // § 02 interactive sliders map
    'alternativas',    // § 03 alternative zones
    'metodologia',     // § 04 variables table
    'actions',         // § 05 final CTAs (save, refazer)
  ] as const,
} as const

export type GatedSection = (typeof RESULT_GATE.blurred)[number]
