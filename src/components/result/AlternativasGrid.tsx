/**
 * AlternativasGrid.tsx — § 04 Alternativas
 *
 * 3 cards com nome, score, tags derivadas do ZoneProfile e nota de tradeoff.
 * Hover: translate-y-[-4px] + sombra.
 */

import { Link } from 'react-router-dom'
import type { ScoredZone } from '../../lib/quiz/scoring'
import type { ZoneProfile } from '../../data/attributes'
import { concelhosAML } from '../../data/concelhosAML'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function zoneHref(z: ScoredZone) {
  return z.zone.kind === 'freguesia' ? `/freguesia/${z.zone.slug}` : `/concelho/${z.zone.slug}`
}

function deriveTags(profile: ZoneProfile): string[] {
  const tags: string[] = []
  if (profile.centralidade >= 70)   tags.push('central')
  if (profile.tranquilidade >= 70)  tags.push('silencioso')
  if (profile.familiar >= 70)       tags.push('familiar')
  if (profile.jovem >= 65)          tags.push('perfil jovem')
  if (profile.acessibilidade >= 75) tags.push('bem servido')
  if (profile.mar >= 55)            tags.push('junto ao mar')
  if (profile.espaco >= 70)         tags.push('espaçoso')
  if (profile.valorizacao >= 70)    tags.push('em valorização')
  if (profile.maturidade <= 30)     tags.push('em transformação')
  if (profile.urbanidade >= 80)     tags.push('urbano')
  return tags.slice(0, 4)
}

function scoreBar(score: number) {
  return (
    <div className="w-full h-0.5 bg-verso-rule-soft mt-2 relative overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-verso-clay transition-all duration-500"
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function AltCard({ alt }: { alt: ScoredZone }) {
  const { zone, score, tradeoff } = alt
  const tags = deriveTags(alt.vector)
  const href = zoneHref(alt)
  const kind = zone.kind === 'freguesia' ? 'Freguesia · Lisboa' : 'Concelho · AML'
  const costVerified = concelhosAML.find(c => c.slug === alt.concelhoSlug)?.costVerified ?? false

  return (
    <Link
      to={href}
      className="group block bg-verso-paper border border-verso-rule-soft p-7 relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(30, 31, 24,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verso-clay"
    >
      {/* Barra topo */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-verso-rule-soft group-hover:bg-verso-clay transition-colors duration-300" />

      {/* Eyebrow */}
      <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-verso-midnight-soft mb-4">
        {kind}
      </p>

      {/* Nome */}
      <h3 className="font-display font-normal text-2xl tracking-[-0.02em] text-verso-midnight leading-tight mb-3 group-hover:text-verso-clay transition-colors">
        {zone.name}
      </h3>

      {/* Score */}
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-verso-midnight-soft">
            Afinidade
          </span>
          <span className="font-mono text-[12px] text-verso-clay tabular-nums">
            {score} / 100
          </span>
        </div>
        {scoreBar(score)}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 border border-verso-rule-soft text-verso-midnight-soft"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Tradeoff — suppressed until costVerified to avoid factual errors */}
      {costVerified && (
        <p className="text-[12px] text-verso-midnight-soft leading-[1.6] line-clamp-3">
          {tradeoff}
        </p>
      )}

      {/* Seta de link */}
      <div className="mt-5 pt-4 border-t border-verso-rule-soft flex justify-end">
        <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-verso-midnight-soft group-hover:text-verso-clay transition-colors flex items-center gap-1.5">
          Ver dossier
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
            <path d="M1 4h8m0 0L6 1m3 3L6 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

type Props = { alternatives: ScoredZone[] }

export function AlternativasGrid({ alternatives }: Props) {
  if (alternatives.length === 0) return null

  return (
    <section className="py-20 bg-verso-paper">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12">

        {/* Section head */}
        <div className="grid md:grid-cols-[180px_1fr] gap-10 mb-14 items-start">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase pt-3 border-t border-verso-rule-soft text-verso-clay">
            § 03 — Considerar também
          </div>
          <div>
            <h2 className="font-display font-normal text-4xl sm:text-5xl leading-[1.02] tracking-[-0.025em] text-verso-midnight">
              Outras zonas que se{' '}
              <em className="italic text-verso-clay">enquadram</em> contigo.
            </h2>
            <p className="mt-5 text-[15px] text-verso-midnight-soft leading-[1.6] max-w-[480px]">
              O algoritmo seleccionou estas alternativas garantindo diversidade geográfica — concelhos diferentes para contextos de vida distintos.
            </p>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alternatives.slice(0, 3).map(alt => (
            <AltCard key={alt.slug} alt={alt} />
          ))}
        </div>

      </div>
    </section>
  )
}
