import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User, SupabaseClient } from '@supabase/supabase-js'

// Lazy-loaded singleton — defers the 187 KB Supabase bundle until after first render
let _sb: SupabaseClient | null = null
async function getSupabase() {
  if (!_sb) {
    const { supabase } = await import('../lib/supabase')
    _sb = supabase
  }
  return _sb
}

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null; userId?: string }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  // Legacy aliases for components that still use the old API
  login: (email: string, name?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cleanup: (() => void) | undefined

    getSupabase().then(sb => {
      // Get initial session
      sb.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })

      // Listen for auth changes
      const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      })
      cleanup = () => subscription.unsubscribe()
    })

    return () => cleanup?.()
  }, [])

  async function signUp(email: string, password: string, name?: string): Promise<{ error: string | null; userId?: string }> {
    const sb = await getSupabase()
    const { data: signUpData, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { name: name ?? email.split('@')[0] },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) return { error: error.message }

    const userId = signUpData.user?.id

    if (name && userId) {
      await sb.from('profiles').upsert({ id: userId, email, name })
    }

    return { error: null, userId }
  }

  async function signIn(email: string, password: string): Promise<{ error: string | null }> {
    const sb = await getSupabase()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  async function signInWithMagicLink(email: string): Promise<{ error: string | null }> {
    const sb = await getSupabase()
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    })
    if (error) return { error: error.message }
    return { error: null }
  }

  async function signOut() {
    const sb = await getSupabase()
    await sb.auth.signOut()
  }

  // Legacy shims — kept so existing components don't break during migration
  function login(_email: string, _name?: string) {
    // no-op: auth is now handled by Supabase
  }
  function logout() {
    signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signInWithMagicLink, signOut, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

// Helper: display name from Supabase user
export function displayName(user: User | null): string {
  if (!user) return ''
  return user.user_metadata?.name as string || user.email?.split('@')[0] || ''
}
