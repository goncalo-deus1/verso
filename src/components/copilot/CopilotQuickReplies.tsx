import { Check } from 'lucide-react'
import type { QuickReply } from './types'

interface CopilotQuickRepliesProps {
  replies: QuickReply[]
  selected: string[]
  onSelect: (value: string) => void
  type: 'single' | 'multi'
  maxSelect?: number
  onConfirm?: () => void
  disabled?: boolean
}

export function CopilotQuickReplies({
  replies,
  selected,
  onSelect,
  type,
  maxSelect = 3,
  onConfirm,
  disabled = false,
}: CopilotQuickRepliesProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 px-5 pt-3 pb-2">
        {replies.map(reply => {
          const isSel = selected.includes(reply.value)
          const isDisabled = disabled || (type === 'multi' && selected.length >= maxSelect && !isSel)
          return (
            <button
              key={reply.value}
              onClick={() => !isDisabled && onSelect(reply.value)}
              className="flex items-center gap-1.5 text-sm font-medium transition-all duration-150"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: isSel ? '1.5px solid #C45D3E' : '1.5px solid #E8E4DC',
                background: isSel ? '#FEF3EE' : 'white',
                color: isSel ? '#C45D3E' : '#0A0A0B',
                opacity: isDisabled ? 0.35 : 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {reply.emoji && <span style={{ fontSize: '14px' }}>{reply.emoji}</span>}
              {reply.label}
              {type === 'multi' && isSel && (
                <span style={{ width: '14px', height: '14px', background: '#C45D3E', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={9} color="white" strokeWidth={3} />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {type === 'multi' && (
        <div className="px-5 pb-4 pt-2">
          <button
            onClick={onConfirm}
            disabled={selected.length === 0}
            className="w-full py-3 text-sm font-semibold transition-opacity duration-150"
            style={{
              background: selected.length > 0 ? '#0A0A0B' : '#C9C5BD',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            {selected.length > 0
              ? `Confirmar — ${selected.length} seleccionado${selected.length > 1 ? 's' : ''}`
              : 'Selecciona pelo menos 1'}
          </button>
        </div>
      )}
    </div>
  )
}
