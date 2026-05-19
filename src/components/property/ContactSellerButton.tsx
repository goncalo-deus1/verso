import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

interface ContactSellerButtonProps {
  propertyId: string
  ownerId: string
  className?: string
}

const CLAY = '#C2553A'

export default function ContactSellerButton({ propertyId, ownerId, className }: ContactSellerButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOwnListing = !!user && user.id === ownerId

  async function handleClick() {
    setError(null)

    // Se não logado, manda para o login e volta para esta página depois.
    // O AuthPage aceita ?redirect=<path> e usa-o para o navigate pós-login.
    if (!user) {
      const next = location.pathname + location.search
      navigate(`/entrar?redirect=${encodeURIComponent(next)}`)
      return
    }

    // Guard de UX — o servidor (RPC) repete esta validação.
    if (isOwnListing) return

    setBusy(true)
    try {
      // Uma chamada só. A RPC start_conversation (SECURITY DEFINER) faz
      // upsert atómico: devolve o id da conversa existente OU cria nova.
      // Falhas vêm com SQLSTATE distintos: 42501 (auth), P0002 (property
      // not found), 22023 (own listing) — usamos para mensagens precisas.
      const { data, error: rpcErr } = await supabase.rpc('start_conversation', {
        p_property_id: propertyId,
      })

      if (rpcErr || !data) {
        console.error('[ContactSellerButton] rpc error:', rpcErr?.code, rpcErr?.message)
        const msg =
          rpcErr?.code === '42501'  ? 'Precisas de iniciar sessão.' :
          rpcErr?.code === 'P0002'  ? 'Este imóvel já não está disponível.' :
          rpcErr?.code === '22023'  ? 'Não podes contactar o teu próprio anúncio.' :
          'Não foi possível abrir a conversa. Tenta de novo.'
        setError(msg)
        setBusy(false)
        return
      }

      navigate(`/inbox/${data}`)
    } catch (err) {
      console.error('[ContactSellerButton] unexpected error:', err)
      setError('Não foi possível abrir a conversa. Tenta de novo.')
      setBusy(false)
    }
  }

  if (isOwnListing) {
    return (
      <p className="text-sm text-center" style={{ color: '#3A3B2E' }}>
        Não podes contactar o teu próprio anúncio.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || authLoading}
        className={
          className ??
          'w-full py-3.5 rounded-lg font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed'
        }
        style={{ background: '#2C2C2A', color: '#F2EDE4' }}
      >
        {busy ? 'A abrir conversa…' : 'Contactar anunciante'}
      </button>
      {error && (
        <p className="text-xs text-center" style={{ color: CLAY }}>{error}</p>
      )}
    </div>
  )
}
