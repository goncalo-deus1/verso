/**
 * Metodologia.tsx — § 05 Metodologia
 *
 * Tabela editorial com as 10 variáveis do modelo Habitta (V.01–V.10)
 * + nota lateral + botão para repetir o quiz.
 */

import { useLang } from '../../context/LanguageContext'
import { useT, type TKey } from '../../i18n/translations'

// ─── Dados ────────────────────────────────────────────────────────────────────

const VARIABLES: { code: string; dimKey: TKey; descKey: TKey }[] = [
  { code: 'V.01', dimKey: 'result.method.v01.dim', descKey: 'result.method.v01.desc' },
  { code: 'V.02', dimKey: 'result.method.v02.dim', descKey: 'result.method.v02.desc' },
  { code: 'V.03', dimKey: 'result.method.v03.dim', descKey: 'result.method.v03.desc' },
  { code: 'V.04', dimKey: 'result.method.v04.dim', descKey: 'result.method.v04.desc' },
  { code: 'V.05', dimKey: 'result.method.v05.dim', descKey: 'result.method.v05.desc' },
  { code: 'V.06', dimKey: 'result.method.v06.dim', descKey: 'result.method.v06.desc' },
  { code: 'V.07', dimKey: 'result.method.v07.dim', descKey: 'result.method.v07.desc' },
  { code: 'V.08', dimKey: 'result.method.v08.dim', descKey: 'result.method.v08.desc' },
  { code: 'V.09', dimKey: 'result.method.v09.dim', descKey: 'result.method.v09.desc' },
  { code: 'V.10', dimKey: 'result.method.v10.dim', descKey: 'result.method.v10.desc' },
]

// ─── Componente ───────────────────────────────────────────────────────────────

type Props = { onRestart: () => void }

export function Metodologia({ onRestart }: Props) {
  const { lang } = useLang()
  const tr = useT(lang)
  return (
    <section className="py-20 bg-verso-paper-deep">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 md:px-12">

        {/* Section head */}
        <div className="grid md:grid-cols-[180px_1fr] gap-10 mb-14 items-start">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase pt-3 border-t border-verso-rule-soft text-verso-clay">
            {tr('result.method.eyebrow')}
          </div>
          <div>
            <h2 className="font-display font-normal text-4xl sm:text-5xl leading-[1.02] tracking-[-0.025em] text-verso-midnight">
              {tr('result.method.title.before')}
              <em className="italic text-verso-clay">{tr('result.method.title.emphasis')}</em>
              {tr('result.method.title.after')}
            </h2>
          </div>
        </div>

        {/* Tabela + nota lateral */}
        <div className="grid md:grid-cols-[1fr_260px] gap-12 md:gap-16 items-start">

          {/* Tabela */}
          <div>
            <div className="border border-verso-rule-soft overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[80px_160px_1fr] gap-0 bg-verso-midnight px-5 py-3">
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-verso-paper/40">{tr('result.method.col.code')}</span>
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-verso-paper/40">{tr('result.method.col.dimension')}</span>
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-verso-paper/40 hidden sm:block">{tr('result.method.col.description')}</span>
              </div>

              {/* Linhas */}
              {VARIABLES.map((v, i) => (
                <div
                  key={v.code}
                  className={`grid grid-cols-[80px_1fr] sm:grid-cols-[80px_160px_1fr] gap-0 px-5 py-4 border-t border-verso-rule-soft ${i % 2 === 0 ? 'bg-verso-paper' : 'bg-verso-paper-deep'}`}
                >
                  <span className="font-mono text-[10px] tracking-[0.1em] text-verso-clay self-start pt-0.5">
                    {v.code}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.06em] uppercase text-verso-midnight self-start pt-0.5 sm:pr-4">
                    {tr(v.dimKey)}
                  </span>
                  <p className="col-span-2 sm:col-span-1 mt-2 sm:mt-0 text-[12px] text-verso-midnight-soft leading-[1.6]">
                    {tr(v.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nota editorial lateral */}
          <div className="flex flex-col gap-8">
            <div className="p-6 border border-verso-rule-soft bg-verso-paper relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-verso-clay" />
              <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-verso-clay mb-4">
                {tr('result.method.note.label')}
              </p>
              <p className="text-[13px] text-verso-midnight-soft leading-[1.7]">
                {tr('result.method.note.p1')}
              </p>
              <p className="text-[13px] text-verso-midnight-soft leading-[1.7] mt-3">
                {tr('result.method.note.p2')}
              </p>
              <p className="text-[13px] text-verso-midnight-soft leading-[1.7] mt-3">
                {tr('result.method.note.p3')}
              </p>
            </div>

            {/* Versão do modelo */}
            <div className="px-4 py-3 border border-verso-rule-soft">
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-verso-midnight-soft whitespace-pre-line">
                {tr('result.method.version')}
              </p>
            </div>

            {/* CTA repetir quiz */}
            <button
              onClick={onRestart}
              className="group inline-flex items-center gap-3 border border-verso-rule-soft px-5 py-4 font-mono text-[10px] tracking-[0.14em] uppercase text-verso-midnight hover:border-verso-midnight hover:bg-verso-midnight hover:text-verso-paper transition-all duration-250"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden
                className="transition-transform group-hover:-translate-x-0.5">
                <path d="M4 1L1 5m0 0l3 4M1 5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {tr('result.method.restart')}
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
