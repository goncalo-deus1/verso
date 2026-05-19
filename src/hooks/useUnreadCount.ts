import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface ConvRow {
  id: string
  buyer_id: string
  seller_id: string
  last_message_at: string
  buyer_last_read_at: string | null
  seller_last_read_at: string | null
  messages: { sender_id: string; created_at: string }[] | null
}

/**
 * Devolve o número de conversas com pelo menos uma mensagem não-lida para
 * o utilizador autenticado. Atualiza em 3 momentos:
 *  1. Mudança de utilizador (login/logout).
 *  2. Navegação entre rotas — cobre o caso "abri a conversa, marquei como
 *     lida, voltei: badge desce". Garantia barata e fiável.
 *  3. Realtime — INSERT em messages OU UPDATE em conversations (read cursor
 *     dos participantes). Best-effort; se o WS falhar (env, network), o
 *     fluxo 1+2 mantém a contagem correcta.
 */
export function useUnreadCount(): number {
  const { user } = useAuth()
  const location = useLocation()
  const [count, setCount] = useState(0)

  const refetch = useCallback(async () => {
    if (!user) { setCount(0); return }

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        id, buyer_id, seller_id,
        last_message_at, buyer_last_read_at, seller_last_read_at,
        messages ( sender_id, created_at )
      `)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)

    if (error) {
      console.error('[useUnreadCount] error:', error.message)
      setCount(0)
      return
    }

    let unread = 0
    for (const conv of (data as ConvRow[] | null ?? [])) {
      const msgs = conv.messages ?? []
      if (msgs.length === 0) continue
      const last = msgs.reduce((a, b) =>
        new Date(a.created_at).getTime() > new Date(b.created_at).getTime() ? a : b
      )
      if (last.sender_id === user.id) continue   // última é minha → não conta
      const myRole: 'buyer' | 'seller' = conv.buyer_id === user.id ? 'buyer' : 'seller'
      const myReadAt = myRole === 'buyer' ? conv.buyer_last_read_at : conv.seller_last_read_at
      if (!myReadAt || new Date(conv.last_message_at).getTime() > new Date(myReadAt).getTime()) {
        unread++
      }
    }
    setCount(unread)
  }, [user])

  // (1) e (2): refetch quando user muda OU quando a URL muda.
  useEffect(() => { refetch() }, [refetch, location.pathname])

  // (3): realtime — RLS filtra os events aos da própria conta, mas o tópico
  // é user-scoped para evitar duplicação se houver vários componentes a
  // subscreverem o mesmo. INSERT em messages cobre "chegou mensagem nova";
  // UPDATE em conversations cobre "marquei como lida do outro lado" (raro,
  // mas mantém a contagem coerente entre tabs).
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel(`unread:${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, refetch)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversations' }, refetch)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, refetch])

  return count
}
