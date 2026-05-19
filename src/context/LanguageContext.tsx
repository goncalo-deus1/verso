import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'pt' | 'en'

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'habitta.lang'

function isLang(v: unknown): v is Lang {
  return v === 'pt' || v === 'en'
}

/**
 * Lê o idioma persistido ANTES do primeiro render (lazy initializer do
 * useState). Evita o flash PT → EN no carregamento de uma página em que
 * o utilizador já tinha escolhido EN antes.
 *
 * Defensivo para SSR: `window` pode não existir durante o prerender.
 * Nesse caso devolve 'pt' (default), e a hidratação no cliente substitui.
 */
function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'pt'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isLang(stored) ? stored : 'pt'
  } catch {
    return 'pt'
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(readInitialLang)

  // Persiste sempre que o idioma muda. localStorage pode falhar em
  // contextos especiais (modo privado, quota) — não queremos partir.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* silently ignore — language still works in-memory para esta sessão */
    }
  }, [lang])

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
