import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

export default function DeleteAccountSection() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [modalOpen, setModalOpen]     = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting]   = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  // Fechar modal com Esc
  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen])

  // Focar input quando modal abre
  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [modalOpen])

  function closeModal() {
    setModalOpen(false)
    setConfirmText('')
    setError(null)
  }

  async function handleDelete() {
    if (confirmText !== 'ELIMINAR' || isDeleting) return

    setIsDeleting(true)
    setError(null)

    const { error: fnError } = await supabase.functions.invoke('delete-account')

    if (fnError) {
      setError('Não foi possível eliminar a conta. Tenta novamente ou contacta o suporte.')
      setIsDeleting(false)
      return
    }

    await signOut()
    navigate('/', { replace: true, state: { accountDeleted: true } })
  }

  const canSubmit = confirmText === 'ELIMINAR' && !isDeleting

  return (
    <>
      {/* Cartão exterior */}
      <div
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: '2px',
          padding: '28px',
          background: 'transparent',
        }}
      >
        <p
          style={{
            fontFamily: 'IBM Plex Mono',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2.5px',
            color: CLAY,
            margin: 0,
          }}
        >
          Zona de perigo
        </p>
        <h3
          className="font-display"
          style={{
            fontSize: '22px',
            color: INK,
            marginTop: '8px',
            marginBottom: '12px',
            fontWeight: 600,
          }}
        >
          Eliminar conta
        </h3>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: STONE,
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 0 20px',
          }}
        >
          Esta acção é permanente. Todos os teus dados — perfil, sessões de quiz,
          zonas guardadas — serão removidos definitivamente. Não há volta atrás.
        </p>
        <button
          aria-label="Abrir confirmação de eliminação de conta"
          onClick={() => setModalOpen(true)}
          style={{
            background: 'transparent',
            border: `1px solid ${CLAY}`,
            color: CLAY,
            padding: '10px 20px',
            fontFamily: 'IBM Plex Mono',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '1.4px',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'background 200ms ease, color 200ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = CLAY
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = CLAY
          }}
        >
          Eliminar a minha conta
        </button>
      </div>

      {/* Modal de confirmação */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(30, 31, 24, 0.72)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            style={{
              background: BONE,
              maxWidth: '520px',
              width: '100%',
              borderRadius: '6px',
              boxShadow: '0 32px 80px rgba(30,31,24,0.4)',
              padding: '36px 40px',
            }}
          >
            {/* Eyebrow */}
            <p
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '2.5px',
                color: CLAY,
                margin: 0,
              }}
            >
              Confirmar eliminação
            </p>

            {/* Título */}
            <h2
              id="delete-title"
              className="font-display"
              style={{
                fontSize: '28px',
                color: INK,
                margin: '12px 0 16px',
                fontWeight: 600,
              }}
            >
              Tens a certeza absoluta?
            </h2>

            {/* Descrição */}
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: STONE,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Vais perder o acesso a{' '}
              <strong style={{ color: INK }}>{user?.email}</strong>, todas as
              zonas guardadas e o teu perfil de quiz. Esta acção é irreversível.
            </p>

            {/* Label do input */}
            <p
              style={{
                fontFamily: 'IBM Plex Mono',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.4px',
                color: STONE,
                marginTop: '24px',
                marginBottom: '8px',
              }}
            >
              Escreve &ldquo;ELIMINAR&rdquo; para confirmar
            </p>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: `1px solid ${error ? CLAY : HAIRLINE}`,
                borderRadius: '4px',
                background: 'white',
                fontFamily: 'IBM Plex Mono',
                fontSize: '14px',
                letterSpacing: '1px',
                color: INK,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 150ms ease',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = CLAY)}
              onBlur={e => (e.currentTarget.style.borderColor = error ? CLAY : HAIRLINE)}
            />

            {/* Erro */}
            {error !== null && (
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  color: CLAY,
                  marginTop: '12px',
                  marginBottom: 0,
                }}
              >
                {error}
              </p>
            )}

            {/* Botões */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '28px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: `1px solid ${HAIRLINE}`,
                  color: INK,
                  padding: '12px 22px',
                  borderRadius: '50px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'border-color 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = STONE)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = HAIRLINE)}
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                disabled={!canSubmit}
                style={{
                  background: CLAY,
                  color: 'white',
                  border: 'none',
                  padding: '12px 22px',
                  borderRadius: '50px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  opacity: canSubmit ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 150ms ease',
                }}
              >
                {isDeleting && <Spinner />}
                {isDeleting ? 'A eliminar…' : 'Eliminar definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Spinner() {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '14px',
        height: '14px',
        border: '2px solid rgba(255,255,255,0.35)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'habitta-spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}
