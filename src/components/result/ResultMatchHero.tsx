/**
 * ResultMatchHero.tsx — § 03 Resultado principal
 *
 * Secção bg-verso-midnight com:
 * - Esquerda: ilustração SVG abstracta (topografia + score)
 * - Direita: nome da zona + grelha 2×3 de dados
 */

import { Link } from 'react-router-dom'
import type { ScoredZone } from '../../lib/quiz/scoring'
import type { Freguesia } from '../../data/freguesias'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function zoneHref(z: ScoredZone) {
  return z.zone.kind === 'freguesia' ? `/freguesia/${z.zone.slug}` : `/concelho/${z.zone.slug}`
}

function trendLabel(t: string | null | undefined): string {
  if (!t) return '—'
  return t === 'growing' ? '↑ Em subida' : t === 'declining' ? '↓ Em queda' : '→ Estável'
}

function profileTag(v: number): string {
  if (v >= 80) return 'Muito alto'
  if (v >= 60) return 'Alto'
  if (v >= 40) return 'Médio'
  if (v >= 20) return 'Baixo'
  return 'Muito baixo'
}

// ─── Ilustração SVG ───────────────────────────────────────────────────────────

function IllustracaoScore({ score }: { score: number }) {
  return (
    <svg viewBox="0 0 280 320" className="w-full h-full" aria-hidden>
      {/* Grid de fundo */}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 46} x2="280" y2={i * 46}
          stroke="#F2EDE4" strokeWidth="0.4" opacity="0.06" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`v${i}`} x1={i * 47} y1="0" x2={i * 47} y2="320"
          stroke="#F2EDE4" strokeWidth="0.4" opacity="0.06" />
      ))}

      {/* Linhas topográficas — elipses concêntricas centradas */}
      {[120, 96, 72, 50, 30].map((rx, i) => (
        <ellipse key={i} cx="140" cy="160" rx={rx} ry={rx * 0.6}
          fill="none" stroke="#F2EDE4" strokeWidth="0.6"
          opacity={0.04 + i * 0.025} />
      ))}

      {/* Score number — fundo gigante */}
      <text
        x="140" y="185"
        textAnchor="middle"
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: '140px',
          fontStyle: 'italic',
          fontWeight: 300,
          fill: '#C2553A',
          opacity: 0.18,
          letterSpacing: '-0.04em',
          userSelect: 'none',
        }}
      >
        {score}
      </text>

      {/* Linha clay — horizonte */}
      <line x1="32" y1="250" x2="248" y2="250"
        stroke="#C2553A" strokeWidth="0.8" opacity="0.4" />

      {/* Score em destaque */}
      <text
        x="140" y="175"
        textAnchor="middle"
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: '72px',
          fontStyle: 'italic',
          fontWeight: 300,
          fill: '#C2553A',
          letterSpacing: '-0.03em',
          userSelect: 'none',
        }}
      >
        {score}
      </text>

      {/* Label */}
      <text
        x="140" y="200"
        textAnchor="middle"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.2em',
          fill: '#F2EDE4',
          opacity: 0.45,
          textTransform: 'uppercase',
          userSelect: 'none',
        }}
      >
        / 100
      </text>

      {/* Cantos decorativos */}
      <rect x="24" y="24" width="12" height="1.5" fill="#F2EDE4" opacity="0.2" />
      <rect x="24" y="24" width="1.5" height="12" fill="#F2EDE4" opacity="0.2" />
      <rect x="244" y="24" width="12" height="1.5" fill="#F2EDE4" opacity="0.2" />
      <rect x="254.5" y="24" width="1.5" height="12" fill="#F2EDE4" opacity="0.2" />
    </svg>
  )
}

// ─── Linha de stat ─────────────────────────────────────────────────────────────

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-verso-paper/10 last:border-0">
      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-verso-paper opacity-40">
        {label}
      </span>
      <span className="font-mono text-[13px] text-verso-paper leading-tight">
        {value}
      </span>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

type Props = {
  best: ScoredZone
  freguesia: Freguesia | null
  lowScoreWarning: boolean
}

export function ResultMatchHero({ best, freguesia, lowScoreWarning }: Props) {
  const { zone, score, tradeoff, vector } = best
  const stats = freguesia?.stats ?? null
  const tags  = freguesia?.tags ?? []

  const href = zoneHref(best)
  const kind = zone.kind === 'freguesia' ? `Freguesia · Lisboa` : 'Concelho · AML'

  return (
    <section className="py-20 bg-verso-midnight">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12">

        {/* Section head */}
        <div className="grid md:grid-cols-[180px_1fr] gap-10 mb-14 items-start">
          <div className="font-mono text-[11px] tracking-[0.15em] uppercase pt-3 border-t border-verso-paper/20 text-verso-clay">
            § 03 — Resultado
          </div>
          <div>
            <h2 className="font-display font-normal text-4xl sm:text-5xl leading-[1.02] tracking-[-0.025em] text-verso-paper">
              A tua{' '}
              <em className="italic text-verso-clay">recomendação territorial</em>.
            </h2>
          </div>
        </div>

        {/* Aviso de score baixo */}
        {lowScoreWarning && (
          <div className="mb-10 px-5 py-4 border border-verso-clay/30 bg-verso-clay/10">
            <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-verso-clay">
              Nota editorial · As tuas respostas revelam um perfil muito específico. A recomendação abaixo é a mais próxima disponível — pode valer a pena rever as prioridades.
            </p>
          </div>
        )}

        {/* Conteúdo principal */}
        <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-16 items-start">

          {/* Ilustração com score */}
          <div className="order-2 md:order-1 aspect-[7/8] w-full max-w-[280px]">
            <IllustracaoScore score={score} />
          </div>

          {/* Texto + dados */}
          <div className="order-1 md:order-2">

            {/* Eyebrow */}
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-verso-clay mb-5">
              {kind} · Afinidade {score} / 100
            </p>

            {/* Nome da zona */}
            <Link
              to={href}
              className="group block font-display font-normal leading-[0.96] tracking-[-0.03em] text-verso-paper mb-4 hover:text-verso-clay transition-colors"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            >
              {zone.name}
              <svg
                width="20" height="16" viewBox="0 0 20 16" fill="none"
                className="inline-block ml-3 mb-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden
              >
                <path d="M1 8h18m0 0L13 2m6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            {/* Linha editorial */}
            <p className="text-[15px] text-verso-paper/60 leading-[1.6] max-w-[480px] mb-8">
              {zone.oneLine}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-9">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] tracking-[0.14em] uppercase px-2.5 py-1.5 border border-verso-paper/20 text-verso-paper/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Grelha de dados 2 colunas */}
            <div className="grid grid-cols-2 border-t border-verso-paper/10 max-w-[440px]">
              <StatCell
                label="Afinidade"
                value={`${score} / 100`}
              />
              <StatCell
                label="Tendência"
                value={trendLabel(stats?.populationTrend3y ?? null)}
              />
              <StatCell
                label="Centralidade"
                value={profileTag(vector.centralidade)}
              />
              <StatCell
                label="Tranquilidade"
                value={profileTag(vector.tranquilidade)}
              />
              <StatCell
                label="Transportes"
                value={stats?.tramMetroOrTrainToBaixaMinutes
                  ? `${stats.tramMetroOrTrainToBaixaMinutes} min`
                  : profileTag(vector.acessibilidade)}
              />
              <StatCell
                label="T2 mediano"
                value={stats?.medianT2RentEuros
                  ? `${stats.medianT2RentEuros.toLocaleString('pt-PT')} €/mês`
                  : '—'}
              />
            </div>

            {/* Tradeoff editorial */}
            <div className="mt-8 pt-8 border-t border-verso-paper/10 max-w-[480px]">
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-verso-clay mb-3">
                Nota de equilíbrio
              </p>
              <p className="text-[14px] text-verso-paper/55 leading-[1.65]">
                {tradeoff}
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
