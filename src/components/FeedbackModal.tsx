import { useState, useEffect } from 'react'
import { X, Star, Send, CheckCircle } from 'lucide-react'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const STORAGE_KEY = 'habitta_feedback_done'

async function sendFeedback(rating: number, message: string) {
  const key = import.meta.env.VITE_WEB3FORMS_KEY
  if (key) {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        subject: `[habitta] Feedback do quiz — ${rating} estrela${rating !== 1 ? 's' : ''}`,
        from_name: 'habitta feedback',
        replyto: 'usehabitta@gmail.com',
        message: message || '(sem comentário)',
        rating,
      }),
    })
  }
}

interface Props {
  open: boolean
  onClose: () => void
  source?: 'quiz' | 'email_confirm'
}

export default function FeedbackModal({ open, onClose, source = 'quiz' }: Props) {
  const [rating, setRating]     = useState(0)
  const [hovered, setHovered]   = useState(0)
  const [message, setMessage]   = useState('')
  const [sending, setSending]   = useState(false)
  const [done, setDone]         = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const handle = async () => {
    if (rating === 0) return
    setSending(true)
    try {
      await sendFeedback(rating, message)
    } catch {
      // silent — UX flow continues regardless
    }
    localStorage.setItem(STORAGE_KEY, '1')
    setSending(false)
    setDone(true)
    setTimeout(() => onClose(), 2200)
  }

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    onClose()
  }

  const eyebrow = source === 'email_confirm'
    ? 'Conta criada'
    : 'O teu resultado está pronto'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(30, 31, 24, 0.6)',
        backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', boxSizing: 'border-box',
      }}
      onClick={e => { if (e.target === e.currentTarget) dismiss() }}
    >
      <div
        style={{
          background: BONE, width: '100%', maxWidth: '460px',
          borderRadius: '8px', padding: '36px 36px 32px',
          boxShadow: '0 24px 64px rgba(30,31,24,0.28)',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Fechar"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: STONE, padding: '6px', borderRadius: '4px',
            display: 'flex', alignItems: 'center', transition: 'color 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = INK)}
          onMouseLeave={e => (e.currentTarget.style.color = STONE)}
        >
          <X size={16} />
        </button>

        {done ? (
          /* ── Success state ── */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <CheckCircle size={40} style={{ color: CLAY, margin: '0 auto 16px', display: 'block' }} />
            <h2 className="font-display" style={{ fontSize: '22px', fontWeight: 400, color: INK, letterSpacing: '-0.5px', marginBottom: '8px' }}>
              Obrigado pelo feedback!
            </h2>
            <p style={{ fontSize: '14px', color: STONE, lineHeight: 1.6 }}>
              Ajudas-nos a melhorar a habitta para toda a gente.
            </p>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <p style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: '10px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '2px', color: CLAY, marginBottom: '16px',
            }}>
              {eyebrow}
            </p>

            <h2 className="font-display" style={{
              fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 400,
              color: INK, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: '8px',
            }}>
              Como foi a tua experiência?
            </h2>
            <p style={{ fontSize: '14px', color: STONE, lineHeight: 1.6, marginBottom: '28px' }}>
              30 segundos de feedback ajudam-nos a construir uma plataforma melhor.
            </p>

            {/* Stars */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {[1, 2, 3, 4, 5].map(n => {
                const active = n <= (hovered || rating)
                return (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${n} estrela${n !== 1 ? 's' : ''}`}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                      transition: 'transform 120ms',
                      transform: active ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    <Star
                      size={28}
                      fill={active ? CLAY : 'transparent'}
                      stroke={active ? CLAY : HAIRLINE}
                      strokeWidth={1.5}
                    />
                  </button>
                )
              })}
            </div>

            {/* Textarea */}
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="O que podemos melhorar? (opcional)"
              maxLength={600}
              rows={3}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'white', border: `1px solid ${HAIRLINE}`,
                borderRadius: '4px', padding: '12px 14px',
                fontSize: '14px', color: INK, lineHeight: 1.6,
                resize: 'vertical', fontFamily: 'inherit',
                outline: 'none', marginBottom: '20px',
                transition: 'border-color 150ms',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = CLAY)}
              onBlur={e => (e.currentTarget.style.borderColor = HAIRLINE)}
            />

            {/* Submit */}
            <button
              onClick={handle}
              disabled={rating === 0 || sending}
              style={{
                width: '100%', padding: '13px 24px',
                background: rating > 0 ? CLAY : 'rgba(30,31,24,0.08)',
                color: rating > 0 ? 'white' : 'rgba(30,31,24,0.3)',
                border: 'none', borderRadius: '4px', cursor: rating > 0 ? 'pointer' : 'default',
                fontSize: '14px', fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 200ms',
              }}
            >
              {sending ? 'A enviar…' : <><Send size={14} /> Enviar feedback</>}
            </button>

            <p style={{ fontSize: '11px', color: 'rgba(30,31,24,0.3)', textAlign: 'center', marginTop: '12px', fontFamily: 'IBM Plex Mono' }}>
              Anónimo · Não partilhamos os teus dados
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/** Returns true if feedback has already been submitted this session */
export function hasFeedbackDone(): boolean {
  return localStorage.getItem(STORAGE_KEY) === '1'
}
