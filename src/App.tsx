import { useEffect, useRef, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { QuizProvider, useQuiz } from './context/QuizContext'
import { LanguageProvider } from './context/LanguageContext'
import CookieBanner from './components/CookieBanner'
import Header from './components/Header'
import Footer from './components/Footer'
import { PaperGrain } from './components/layout/PaperGrain'

/**
 * Minimal page skeleton shown while a lazy route chunk is being fetched.
 * Uses the site background colour so there is no flash of white and no CLS.
 */
function PageSkeleton() {
  return (
    <div
      aria-hidden
      style={{
        minHeight: '100vh',
        background: '#F2EDE4',
      }}
    />
  )
}

const HomePage           = lazy(() => import('./pages/HomePage'))
const QuizFlow           = lazy(() => import('./pages/QuizFlow'))
const AreaRecommendations = lazy(() => import('./pages/AreaRecommendations'))
const EditorialPage      = lazy(() => import('./pages/EditorialPage'))
const ArticleDetailPage  = lazy(() => import('./pages/ArticleDetailPage'))
const AuthPage           = lazy(() => import('./pages/AuthPage'))
const ProfilePage        = lazy(() => import('./pages/ProfilePage'))
const QuizResults        = lazy(() => import('./pages/QuizResults'))
const ZoneDetailPage     = lazy(() => import('./pages/ZoneDetailPage'))
const ConcelhoDetailPage = lazy(() => import('./pages/ConcelhoDetailPage'))
const AuthCallback       = lazy(() => import('./pages/AuthCallback'))
const MinhaConta         = lazy(() => import('./pages/MinhaConta'))
const QuizDossier        = lazy(() => import('./pages/QuizDossier'))
const QuizPage           = lazy(() => import('./pages/QuizPage'))

const INK  = '#1E1F18'
const BONE = '#F2EDE4'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PageTracker() {
  const { pathname } = useLocation()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    if (typeof window.gtag !== 'function') return
    window.gtag('event', 'page_view', {
      page_path:  pathname,
      page_title: document.title,
    })
  }, [pathname])

  return null
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-[72px] md:pt-[88px]">{children}</main>
      <Footer />
    </div>
  )
}

// ─── Quiz Modal ───────────────────────────────────────────────────────────────

function QuizModal() {
  const { isOpen, close } = useQuiz()

  // Bloqueia scroll do body quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(30, 31, 24,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div
        style={{
          background: BONE,
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '6px',
          boxShadow: '0 32px 80px rgba(30, 31, 24,0.4), 0 8px 24px rgba(30, 31, 24,0.2)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Header da modal */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 28px',
          borderBottom: '1px solid rgba(30, 31, 24, 0.125)',
          position: 'sticky',
          top: 0,
          background: BONE,
          zIndex: 1,
          flexShrink: 0,
        }}>
          <span className="font-display" style={{ fontSize: '16px', color: INK, letterSpacing: '-0.3px' }}>
            habitta
          </span>
          <button
            onClick={close}
            aria-label="Fechar quiz"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#3A3B2E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '4px',
              transition: 'color 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = INK)}
            onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo do quiz */}
        <div style={{ padding: '36px 40px 40px', flex: 1 }}>
          <Suspense fallback={null}>
            <QuizFlow onClose={close} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// ─── Rotas ────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ScrollToTop />
      <PageTracker />
      <Routes>
        {/* /quiz — página completa com layout editorial */}
        <Route path="/quiz" element={<Layout><QuizPage /></Layout>} />

        {/* Auth — sem Layout (design split próprio) */}
        <Route path="/entrar" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Com Layout completo (Header + Footer) */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/areas" element={<Layout><AreaRecommendations /></Layout>} />
        <Route path="/areas/:slug" element={<Layout><AreaRecommendations /></Layout>} />
        <Route path="/editorial" element={<Layout><EditorialPage /></Layout>} />
        <Route path="/editorial/:slug" element={<Layout><ArticleDetailPage /></Layout>} />
        <Route path="/quiz/resultados" element={<Layout><QuizResults /></Layout>} />
        <Route path="/quiz/dossier" element={<Layout><QuizDossier /></Layout>} />
        <Route path="/zona/:slug" element={<Layout><ZoneDetailPage /></Layout>} />

        <Route path="/concelho/:slug" element={<Layout><ConcelhoDetailPage /></Layout>} />

        {/* Protected */}
        <Route path="/minha-conta" element={<Layout><ProtectedRoute><MinhaConta /></ProtectedRoute></Layout>} />
        <Route path="/perfil" element={<Layout><ProfilePage /></Layout>} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <QuizProvider>
            <PaperGrain />
            <QuizModal />
            <CookieBanner />
            <AppRoutes />
          </QuizProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
