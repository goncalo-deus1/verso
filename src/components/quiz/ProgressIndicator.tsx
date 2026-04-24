/**
 * ProgressIndicator
 *
 * Mostra "3 / 8" + barra de progresso + dots para cada passo.
 * Sem estado próprio — recebe current (1-based) e total.
 */

interface Props {
  current: number   // 1-based
  total: number
}

export default function ProgressIndicator({ current, total }: Props) {
  const pct = (current / total) * 100

  return (
    <div className="w-full">
      {/* Barra de progresso superior */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5" style={{ background: 'rgba(30, 31, 24, 0.125)' }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: '#C2553A' }}
        />
      </div>

      {/* Contador + dots */}
      <div className="flex items-center gap-4">
        <span
          className="text-xs font-medium tabular-nums"
          style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>
          {current} / {total}
        </span>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }, (_, i) => {
            const done    = i + 1 < current
            const active  = i + 1 === current
            return (
              <div
                key={i}
                className="transition-all duration-300 ease-out"
                style={{
                  height: '3px',
                  borderRadius: '2px',
                  width: active ? '20px' : '6px',
                  background: done ? '#C2553A' : active ? '#1E1F18' : 'rgba(30, 31, 24, 0.125)',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
