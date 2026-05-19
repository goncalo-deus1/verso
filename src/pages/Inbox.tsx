import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

interface ConversationListItem {
  id: string
  property_id: string
  buyer_id: string
  seller_id: string
  last_message_at: string
  buyer_last_read_at: string | null
  seller_last_read_at: string | null
  property: { title: string; municipality: string } | null
  lastMessage: { body: string; sender_id: string } | null
}

function timeAgo(iso: string): string {
  const d = new Date(iso)
  const now = Date.now()
  const diff = Math.max(0, now - d.getTime())
  const mins = Math.floor(diff / 60000)
  if (mins < 1)   return 'agora'
  if (mins < 60)  return `há ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7)   return `há ${days}d`
  return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit' }).format(d)
}

export default function Inbox() {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<ConversationListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      // Carrega conversas com property joined e todas as mensagens
      // (precisamos da última para o preview e para saber se é nossa).
      const { data, error: err } = await supabase
        .from('conversations')
        .select(`
          id, property_id, buyer_id, seller_id,
          last_message_at, buyer_last_read_at, seller_last_read_at,
          property:properties ( title, municipality ),
          messages ( body, sender_id, created_at )
        `)
        .or(`buyer_id.eq.${user!.id},seller_id.eq.${user!.id}`)
        .order('last_message_at', { ascending: false })

      if (cancelled) return

      if (err) {
        console.error('[Inbox] load error:', err.message)
        setError('Não foi possível carregar as conversas.')
        setLoading(false)
        return
      }

      type RawConv = {
        id: string
        property_id: string
        buyer_id: string
        seller_id: string
        last_message_at: string
        buyer_last_read_at: string | null
        seller_last_read_at: string | null
        property: { title: string; municipality: string } | { title: string; municipality: string }[] | null
        messages: { body: string; sender_id: string; created_at: string }[] | null
      }

      const normalised: ConversationListItem[] = (data as RawConv[] | null ?? []).map(row => {
        const msgs = (row.messages ?? []).slice().sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        const last = msgs[0] ?? null
        const prop = Array.isArray(row.property) ? row.property[0] ?? null : row.property
        return {
          id: row.id,
          property_id: row.property_id,
          buyer_id: row.buyer_id,
          seller_id: row.seller_id,
          last_message_at: row.last_message_at,
          buyer_last_read_at: row.buyer_last_read_at,
          seller_last_read_at: row.seller_last_read_at,
          property: prop,
          lastMessage: last ? { body: last.body, sender_id: last.sender_id } : null,
        }
      })

      setItems(normalised)
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BONE }}>
        <div style={{ width: '20px', height: '20px', border: `2px solid ${HAIRLINE}`, borderTopColor: CLAY, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20" style={{ background: BONE }}>
        <h1 className="font-display text-3xl mb-3" style={{ color: INK, letterSpacing: '-0.5px' }}>Mensagens</h1>
        <p className="text-sm" style={{ color: STONE }}>
          Precisas de estar autenticado para ver as mensagens.
        </p>
        <Link
          to="/entrar?redirect=%2Finbox"
          className="inline-block mt-5 px-5 py-2.5 text-sm font-medium rounded-lg"
          style={{ background: '#2C2C2A', color: BONE }}
        >
          Entrar
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12" style={{ background: BONE }}>
      <h1 className="font-display text-3xl mb-6" style={{ color: INK, letterSpacing: '-0.5px' }}>
        Mensagens
      </h1>

      {error && (
        <p className="text-sm mb-6" style={{ color: CLAY }}>{error}</p>
      )}

      {items.length === 0 ? (
        <p className="text-sm" style={{ color: STONE }}>
          Ainda não tens conversas. Quando contactares um anunciante, a conversa aparece aqui.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map(item => {
            const lastIsMine = item.lastMessage?.sender_id === user.id
            const myRole: 'buyer' | 'seller' = item.buyer_id === user.id ? 'buyer' : 'seller'
            const myReadAt = myRole === 'buyer' ? item.buyer_last_read_at : item.seller_last_read_at
            // Não-lida se a última mensagem é do outro e (nunca li OU mensagem é mais recente que o read).
            const unread =
              !lastIsMine && !!item.lastMessage &&
              (!myReadAt || new Date(item.last_message_at).getTime() > new Date(myReadAt).getTime())

            const preview = item.lastMessage
              ? (lastIsMine ? 'Tu: ' : '') + item.lastMessage.body
              : 'Sem mensagens'

            return (
              <li key={item.id}>
                <Link
                  to={`/inbox/${item.id}`}
                  className="block p-4 bg-white transition-colors hover:bg-[#FBF7EE]"
                  style={{ border: `1px solid ${HAIRLINE}`, borderRadius: '8px' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {unread && (
                          <span
                            aria-label="Não lida"
                            style={{ width: 8, height: 8, borderRadius: '50%', background: CLAY, display: 'inline-block', flexShrink: 0 }}
                          />
                        )}
                        <p
                          className="font-medium text-sm truncate"
                          style={{ color: INK }}
                        >
                          {item.property?.title ?? 'Imóvel'}
                          {item.property?.municipality ? (
                            <span style={{ color: STONE, fontWeight: 400 }}> · {item.property.municipality}</span>
                          ) : null}
                        </p>
                      </div>
                      <p
                        className="text-xs truncate"
                        style={{ color: unread ? INK : STONE, fontWeight: unread ? 500 : 400 }}
                      >
                        {preview}
                      </p>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: STONE, fontFamily: 'IBM Plex Mono' }}>
                      {timeAgo(item.last_message_at)}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
