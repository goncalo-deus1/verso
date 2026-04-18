import { createContext, useContext, useState } from 'react'

interface User {
  name: string
  email: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, name?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  function login(email: string, name?: string) {
    setUser({ email, name: name ?? email.split('@')[0] })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
