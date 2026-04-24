type Props = {
  currentStep: number   // 1-indexed (1-9); 0 = welcome
  totalSteps: number
  labels: string[]
}

export function QuizProgress({ currentStep, totalSteps, labels }: Props) {
  return (
    <aside className="md:sticky md:top-28">
      <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-verso-clay pb-3 border-b border-verso-rule-soft mb-7">
        Progresso ·{' '}
        {String(Math.max(1, currentStep)).padStart(2, '0')} de{' '}
        {String(totalSteps).padStart(2, '0')}
      </p>

      <div className="flex flex-col gap-4">
        {labels.map((label, i) => {
          const step = i + 1
          const state =
            step < currentStep ? 'done' : step === currentStep ? 'active' : 'pending'
          const opacity =
            state === 'active' ? 'opacity-100' : state === 'done' ? 'opacity-60' : 'opacity-35'
          const textColor =
            state === 'active' ? 'text-verso-midnight' : 'text-verso-midnight-soft'

          return (
            <div
              key={i}
              className={`grid grid-cols-[44px_1fr] gap-2 items-start font-mono text-[11px] tracking-[0.12em] uppercase transition-opacity duration-300 ${opacity} ${textColor}`}
            >
              <span className="text-verso-clay">{String(step).padStart(2, '0')}</span>
              <span>
                {label}
                {state === 'active' && (
                  <span className="block h-px bg-verso-clay mt-1.5 w-full" />
                )}
                {state === 'done' && (
                  <span className="block h-px bg-verso-midnight/20 mt-1.5 w-full" />
                )}
              </span>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
