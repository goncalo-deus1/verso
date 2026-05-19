/**
 * QuizInvestorWaitlist.tsx — Ecrã de espera para investidores
 *
 * Mostrado quando o utilizador seleciona "Para investir ou arrendar" em Q1.
 * Recolhe o email localmente (localStorage) como holding pattern.
 *
 * TODO: Antes de escalar para tráfico de produção, ligar a lista de emails
 * a um sistema de armazenamento real (Supabase ou lista de mailing externa).
 * A chave localStorage `habitta_investor_waitlist` é uma medida temporária.
 */

import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'

const STORAGE_KEY = 'habitta_investor_waitlist'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

function saveEmail(email: string): boolean {
  try {
    const existing = localStorage.getItem(STORAGE_KEY) ?? ''
    const list = existing ? existing.split('\n') : []
    if (list.includes(email)) return true  // no-op — already present
    list.push(email)
    localStorage.setItem(STORAGE_KEY, list.join('\n'))
    return true
  } catch {
    return false  // localStorage unavailable — still show success state
  }
}

type Props = {
  onRestartForLiving: () => void
}

export default function QuizInvestorWaitlist({ onRestartForLiving }: Props) {
  const { lang } = useLang()
  const tr = useT(lang)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setError(tr('quizInv.invalidEmail'))
      return
    }
    saveEmail(trimmed)
    setSubmitted(true)
    setError('')
  }

  return (
    <div style={{ width: '100%' }}>
      <h2
        className="font-display"
        style={{
          fontSize: '28px',
          fontWeight: 400,
          color: INK,
          lineHeight: 1.1,
          margin: '0 0 24px',
          letterSpacing: '-0.5px',
        }}
      >
        {tr('quizInv.title')}
      </h2>

      <p
        className="font-display"
        style={{
          fontSize: '17px',
          fontStyle: 'italic',
          color: MOSS,
          lineHeight: 1.65,
          margin: '0 0 32px',
          maxWidth: '480px',
        }}
      >
        {tr('quizInv.body')}
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ maxWidth: '360px' }}>
          <label
            htmlFor="investor-email"
            style={{
              display: 'block',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1.8px',
              color: STONE,
              marginBottom: '8px',
            }}
          >
            {tr('quizInv.emailLabel')}
          </label>
          <input
            id="investor-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={tr('quizInv.emailPh')}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 14px',
              background: BONE,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: '4px',
              fontSize: '15px',
              color: INK,
              marginBottom: '12px',
              boxSizing: 'border-box',
              outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = CLAY }}
            onBlur={e => { e.currentTarget.style.borderColor = HAIRLINE }}
          />
          {error && (
            <p style={{ fontSize: '13px', color: CLAY, margin: '0 0 10px' }}>{error}</p>
          )}
          <button
            type="submit"
            style={{
              display: 'block',
              width: '100%',
              padding: '13px 24px',
              background: INK,
              color: BONE,
              border: 'none',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.2px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = CLAY }}
            onMouseLeave={e => { e.currentTarget.style.background = INK }}
          >
            {tr('quizInv.submit')}
          </button>
        </form>
      ) : (
        <div>
          <p
            style={{
              fontSize: '16px',
              color: MOSS,
              fontWeight: 600,
              marginBottom: '24px',
            }}
          >
            {tr('quizInv.thanks')}
          </p>
          <button
            onClick={onRestartForLiving}
            style={{
              padding: '12px 28px',
              background: 'none',
              border: `1px solid ${HAIRLINE}`,
              borderRadius: '4px',
              fontSize: '14px',
              color: STONE,
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = INK }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = HAIRLINE }}
          >
            {tr('quizInv.startLiving')}
          </button>
        </div>
      )}
    </div>
  )
}
