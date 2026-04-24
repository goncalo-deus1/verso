/**
 * PorqueEstaZona.tsx — § 01  Argumento editorial
 *
 * Título + descrição + top-4 variáveis + trade-off.
 */

import type { ZoneProfile } from '../../data/attributes'
import { ATTRIBUTE_LABELS } from '../../data/attributes'
import type { TradeoffConfidence } from '../../lib/quiz/tradeoffs'

type Props = {
  nome: string
  vector: ZoneProfile
  descricao: string
  tradeoff?: string
  tradeoffConfidence?: TradeoffConfidence
}

function VariavelBar({ nome, valor }: { nome: string; valor: number }) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-verso-midnight-soft">
          {nome}
        </p>
        <p className="font-mono text-[10px] text-verso-clay tabular-nums">{valor}</p>
      </div>
      <div className="h-px bg-verso-rule-soft relative">
        <div
          className="absolute top-0 left-0 h-full bg-verso-clay transition-all duration-500"
          style={{ width: `${valor}%` }}
        />
      </div>
    </div>
  )
}

export function PorqueEstaZona({ vector, tradeoff, tradeoffConfidence }: Props) {
  // Top 4 atributos pelo valor mais alto
  const topVariaveis = (Object.entries(vector) as [keyof ZoneProfile, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([key, val]) => ({ nome: ATTRIBUTE_LABELS[key], valor: val }))

  return (
    <section
      id="porque-esta-zona"
      className="bg-verso-paper-deep py-20 md:py-32 px-6 sm:px-10 md:px-16 border-b border-verso-rule-soft"
    >
      <div className="max-w-6xl mx-auto">

        {/* Eyebrow */}
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-verso-clay mb-10">
          § 01 — Porque esta zona
        </p>

        {/* Título */}
        <div className="mb-14 md:mb-20">
          <h2 className="font-display font-normal text-4xl sm:text-5xl leading-[1.05] tracking-[-0.025em] text-verso-midnight">
            O que{' '}
            <em className="italic text-verso-clay">pesa</em>{' '}
            mais neste match.
          </h2>
        </div>

        {/* Top 4 variáveis */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-14 md:mb-20">
          {topVariaveis.map(v => (
            <VariavelBar key={v.nome} nome={v.nome} valor={v.valor} />
          ))}
        </div>

        {/* Trade-off — only renders at high confidence tier */}
        {tradeoff && tradeoffConfidence === 'high' && (
          <div className="border-l-2 border-verso-clay pl-6 md:pl-8 max-w-3xl">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-verso-clay mb-3">
              O que esta zona te custa
            </p>
            <p className="font-display italic text-xl md:text-2xl leading-[1.4] text-verso-midnight">
              {tradeoff}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
