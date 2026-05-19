import { createContext, useContext, useState } from 'react'

export type Lang = 'pt' | 'en'

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')
  const toggle = () => setLang(l => l === 'pt' ? 'en' : 'pt')
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}

/**
 * Variante para componentes que podem ser renderizados sem provider
 * (ex: rotas pre-renderizadas em SSR onde o provider não existe na árvore).
 * Devolve sempre PT como default seguro, sem partir.
 */
export function useLangSafe(): { lang: Lang; toggle: () => void } {
  const ctx = useContext(LanguageContext)
  return ctx ?? { lang: 'pt', toggle: () => {} }
}
