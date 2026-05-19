import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/types'

// Trim defensivo: um trailing \n no env var partia o WebSocket do Realtime,
// porque o apikey ia parar à query string já com %0A no fim e a Supabase
// rejeitava a conexão (REST tolera, WS compara byte-a-byte).
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? ''
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? ''

if (!url || !anonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
})
