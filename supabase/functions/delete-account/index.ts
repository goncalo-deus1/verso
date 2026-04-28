// Deploy: supabase functions deploy delete-account --no-verify-jwt=false
// Set secret: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': 'https://www.usehabitta.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  // Verify Authorization header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Unauthorized' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

  // Validate JWT using anon client (respects RLS / token expiry)
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  })

  const { data: { user }, error: userError } = await userClient.auth.getUser()
  if (userError || !user) {
    return json({ error: 'Token inválido ou expirado' }, 401)
  }

  // Admin client — bypasses RLS, can call auth.admin.*
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  try {
    // 1. Dados relacionados com user_id
    await admin.from('quiz_sessions').delete().eq('user_id', user.id)
    await admin.from('saved_zones').delete().eq('user_id', user.id)
    await admin.from('user_quiz').delete().eq('user_id', user.id)

    // 2. Waitlist — identificada por email (não tem user_id)
    if (user.email) {
      await admin.from('waitlist').delete().eq('email', user.email)
    }

    // 3. Perfil
    await admin.from('profiles').delete().eq('id', user.id)

    // 4. Apagar utilizador do auth.users (permanente)
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
    if (deleteError) throw deleteError

    return json({ ok: true }, 200)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return json({ error: message }, 500)
  }
})
