/**
 * QuizNavigation
 *
 * Barra de navegação inferior — Voltar + Continuar/Ver resultados.
 * Botão "Continuar" fica desactivado se `canNext` for false.
 * Estado `isSubmitting` mostra feedback de loading no último passo.
 */

import { ArrowLeft, ArrowRight, Loader } from 'lucide-react'

interface Props {
  onPrev: () => void
  onNext: () => void
  canNext: boolean
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
}

export default function QuizNavigation({
  onPrev,
  onNext,
  canNext,
  isFirst,
  isLast,
  isSubmitting,
}: Props) {
  const prevLabel = isFirst ? 'Sair' : 'Voltar'

  let nextLabel: string
  if (isSubmitting) nextLabel = 'A calcular…'
  else if (isLast)  nextLabel = 'Ver resultados'
  else              nextLabel = 'Continuar'

  return (
    <div className="mt-10 flex items-center justify-between">
      {/* Voltar */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isSubmitting}
        className="flex items-center gap-2 text-sm font-medium transition-colors duration-150"
        style={{ color: '#3A3B2E', opacity: isSubmitting ? 0.4 : 1 }}
        onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.color = '#1E1F18' }}
        onMouseLeave={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.color = '#3A3B2E' }}>
        <ArrowLeft size={14} />
        {prevLabel}
      </button>

      {/* Continuar / Ver resultados */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext || isSubmitting}
        className="flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all duration-200"
        style={{
          background: canNext && !isSubmitting ? '#1E1F18' : 'rgba(30, 31, 24, 0.125)',
          color: '#F2EDE4',
          borderRadius: '2px',
          cursor: canNext && !isSubmitting ? 'pointer' : 'not-allowed',
          minWidth: '148px',
          justifyContent: 'center',
        }}>
        {isSubmitting
          ? <Loader size={14} className="animate-spin" />
          : null}
        {nextLabel}
        {!isSubmitting && <ArrowRight size={15} />}
      </button>
    </div>
  )
}
