import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang, type Lang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase/types'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

type MessageRow = Database['public']['Tables']['messages']['Row']
type ConversationRow = Database['public']['Tables']['conversations']['Row']

interface ConversationWithProperty extends ConversationRow {
  property: { id: string; title: string; municipality: string } | null
}

function fmtTime(iso: string, lang: Lang): string {
  const locale = lang === 'pt' ? 'pt-PT' : 'en-GB'
  const d = new Date(iso)
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(d)
  const date = new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit' }).format(d)
  return `${time} ${date}`
}

export default function ConversationThread() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const { lang } = useLang()
  const tr = useT(lang)

  const [conversation, setConversation] = useState<ConversationWithProperty | null>(null)
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Marca a conversa como lida — actualiza o timestamp do role do utilizador.
  const markAsRead = useCallback(async (conv: ConversationWithProperty) => {
    if (!user) return
    const role: 'buyer' | 'seller' = conv.buyer_id === user.id ? 'buyer' : 'seller'
    const patch = role === 'buyer'
      ? { buyer_last_read_at: new Date().toISOString() }
      : { seller_last_read_at: new Date().toISOString() }

    const { error: err } = await supabase
      .from('conversations')
      .update(patch)
      .eq('id', conv.id)
    if (err) console.error('[ConversationThread] markAsRead error:', err.message)
  }, [user])

  // Carrega conversa + mensagens iniciais.
  useEffect(() => {
    if (authLoading) return
    if (!user || !id) { setLoading(false); return }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const { data: conv, error: convErr } = await supabase
        .from('conversations')
        .select(`
          id, property_id, buyer_id, seller_id, created_at,
          last_message_at, buyer_last_read_at, seller_last_read_at,
          property:properties ( id, title, municipality )
        `)
        .eq('id', id!)
        .maybeSingle()

      if (cancelled) return

      if (convErr || !conv) {
        console.error('[ConversationThread] load conversation error:', convErr?.message)
        setError(tr('thread.notFound'))
        setLoading(false)
        return
      }

      // O Supabase devolve relação one-to-one como objecto OU array consoante a inferência.
      const rawProp = (conv as { property: unknown }).property
      const property = Array.isArray(rawProp) ? (rawProp[0] ?? null) : (rawProp ?? null)

      const normConv: ConversationWithProperty = {
        id: conv.id,
        property_id: conv.property_id,
        buyer_id: conv.buyer_id,
        seller_id: conv.seller_id,
        created_at: conv.created_at,
        last_message_at: conv.last_message_at,
        buyer_last_read_at: conv.buyer_last_read_at,
        seller_last_read_at: conv.seller_last_read_at,
        property: property as ConversationWithProperty['property'],
      }
      setConversation(normConv)

      const { data: msgs, error: msgErr } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id!)
        .order('created_at', { ascending: true })

      if (cancelled) return

      if (msgErr) {
        console.error('[ConversationThread] load messages error:', msgErr.message)
        setError(tr('thread.errorLoadMsgs'))
        setLoading(false)
        return
      }

      setMessages(msgs ?? [])
      setLoading(false)

      // Marca como lida ao abrir. Usamos o ref para a callback (que ainda
      // pode não estar montado abaixo) — mas no primeiro render é o mesmo.
      markAsRead(normConv)
    }

    load()
    return () => { cancelled = true }
    // Intencionalmente sem markAsRead nas deps: queremos um load por (id, user)
    // — não por mudança de referência da callback (ver pattern do canal abaixo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, authLoading])

  // Refs para conversation e markAsRead — o canal realtime tem de viver o
  // tempo todo da página. Sem refs, qualquer mudança nestes dois (incluindo
  // o set inicial de conversation depois do load) tearia down e re-subscreveria
  // o canal, criando janelas onde events do servidor são silenciosamente
  // perdidos. O bug que isto resolve: comprador deixou de receber resposta do
  // dono em real-time e só via depois de refresh.
  const conversationRef = useRef<ConversationWithProperty | null>(null)
  const markAsReadRef = useRef(markAsRead)
  useEffect(() => { conversationRef.current = conversation }, [conversation])
  useEffect(() => { markAsReadRef.current = markAsRead }, [markAsRead])

  // Subscrição realtime: ouve INSERT em messages desta conversa.
  // Dependências mínimas: id + user.id. O canal é criado uma vez por sessão
  // de utilizador nesta conversa e só é destruído ao desmontar.
  useEffect(() => {
    if (!id || !user) return

    const channel = supabase
      .channel(`messages:${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${id}` },
        payload => {
          const incoming = payload.new as MessageRow
          setMessages(prev => {
            if (prev.some(m => m.id === incoming.id)) return prev
            return [...prev, incoming]
          })
          if (incoming.sender_id !== user.id) {
            const conv = conversationRef.current
            if (conv) markAsReadRef.current(conv)
          }
        },
      )
      .subscribe(status => {
        // Útil em DevTools quando algo correr mal — sinaliza CHANNEL_ERROR ou
        // TIMED_OUT, que normalmente indicam JWT inválido ou RLS a bloquear.
        if (status !== 'SUBSCRIBED') {
          console.warn('[ConversationThread] realtime status:', status)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, user])

  // Auto-scroll para o fim sempre que mensagens mudam.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  async function sendMessage() {
    if (!user || !conversation || sending) return
    const body = draft.trim()
    if (!body) return
    if (body.length > 2000) {
      setError(tr('thread.tooLong'))
      return
    }

    setSending(true)
    setError(null)

    const { data: inserted, error: insErr } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        body,
      })
      .select('*')
      .single()

    if (insErr || !inserted) {
      console.error('[ConversationThread] send error:', insErr?.message)
      setError(tr('thread.errorSend'))
      setSending(false)
      return
    }

    // Adiciona localmente — se o realtime depois reenviar, o filtro por id deduplica.
    setMessages(prev => {
      if (prev.some(m => m.id === inserted.id)) return prev
      return [...prev, inserted]
    })
    setDraft('')
    setSending(false)
    textareaRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

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
        <p className="text-sm" style={{ color: STONE }}>
          {tr('inbox.authRequired')}
        </p>
      </div>
    )
  }

  if (error && !conversation) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20" style={{ background: BONE }}>
        <Link to="/inbox" className="text-sm" style={{ color: STONE }}>
          {tr('thread.back')}
        </Link>
        <p className="mt-6 text-sm" style={{ color: CLAY }}>{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8" style={{ background: BONE, minHeight: '70vh' }}>
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/inbox"
          className="inline-block text-sm font-medium mb-3 transition-colors"
          style={{ color: STONE }}
          onMouseEnter={e => (e.currentTarget.style.color = CLAY)}
          onMouseLeave={e => (e.currentTarget.style.color = STONE)}
        >
          {tr('thread.back')}
        </Link>
        <h1 className="font-display text-2xl" style={{ color: INK, letterSpacing: '-0.3px' }}>
          {conversation?.property?.title ?? tr('inbox.propertyFallback')}
        </h1>
        {conversation?.property?.municipality && (
          <p className="text-sm mt-1" style={{ color: STONE }}>
            {conversation.property.municipality}
          </p>
        )}
      </div>

      {/* Lista de mensagens */}
      <div
        className="px-4 py-5 mb-4 space-y-3"
        style={{
          background: 'white',
          border: `1px solid ${HAIRLINE}`,
          borderRadius: '8px',
          minHeight: '320px',
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        {messages.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: STONE }}>
            {tr('thread.empty')}
          </p>
        ) : (
          messages.map(m => {
            const mine = m.sender_id === user.id
            return (
              <div
                key={m.id}
                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[75%] px-3 py-2"
                  style={{
                    background: mine ? CLAY : BONE,
                    color: mine ? BONE : '#2C2C2A',
                    borderRadius: '12px',
                    borderBottomRightRadius: mine ? '4px' : '12px',
                    borderBottomLeftRadius: mine ? '12px' : '4px',
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>
                  <p
                    className="text-[10px] mt-1"
                    style={{
                      color: mine ? 'rgba(242,237,228,0.75)' : STONE,
                      fontFamily: 'IBM Plex Mono',
                    }}
                  >
                    {fmtTime(m.created_at, lang)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="text-xs mb-2" style={{ color: CLAY }}>{error}</p>
      )}

      {/* Input */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tr('thread.placeholder')}
          rows={2}
          maxLength={2000}
          disabled={sending}
          className="flex-1 px-4 py-3 text-sm outline-none resize-none"
          style={{
            background: 'white',
            border: `1px solid ${HAIRLINE}`,
            borderRadius: '8px',
            color: INK,
          }}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !draft.trim()}
          className="px-5 py-3 text-sm font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: '#2C2C2A', color: BONE }}
        >
          {sending ? tr('thread.sending') : tr('thread.send')}
        </button>
      </div>
    </div>
  )
}
