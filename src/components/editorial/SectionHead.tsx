import type { ReactNode } from 'react'

type Props = {
  number: string          // "01", "02", "03", etc.
  label: string           // "Questionário", "Cartografia Interativa"
  title: ReactNode        // ReactNode para itálicos parciais com <em>
  lede?: string           // sub-parágrafo opcional
  theme?: 'paper' | 'midnight'
}

export function SectionHead({ number, label, title, lede, theme = 'paper' }: Props) {
  const colors =
    theme === 'midnight'
      ? {
          num:       'text-verso-clay',
          numBorder: 'border-verso-paper/20',
          title:     'text-verso-paper',
          lede:      'text-verso-paper/70',
        }
      : {
          num:       'text-verso-clay',
          numBorder: 'border-verso-rule-soft',
          title:     'text-verso-midnight',
          lede:      'text-verso-midnight-soft',
        }

  return (
    <div className="grid md:grid-cols-[180px_1fr] gap-10 mb-16 md:mb-20 items-start">
      {/* Coluna esquerda: número + label */}
      <div className={`font-mono text-[11px] tracking-[0.15em] uppercase pt-3 border-t ${colors.num} ${colors.numBorder}`}>
        § {number} — {label}
      </div>

      {/* Coluna direita: título + lede */}
      <div>
        <h2
          className={`font-display font-normal text-4xl sm:text-5xl md:text-[56px] leading-[1.02] tracking-[-0.025em] max-w-[780px] ${colors.title}`}
        >
          {title}
        </h2>
        {lede && (
          <p className={`mt-6 text-base leading-[1.6] max-w-[560px] ${colors.lede}`}>
            {lede}
          </p>
        )}
      </div>
    </div>
  )
}
