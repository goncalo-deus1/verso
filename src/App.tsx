import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import QuizFlow from './pages/QuizFlow'
import AreaRecommendations from './pages/AreaRecommendations'
import PropertyListingPage from './pages/PropertyListingPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import EditorialPage from './pages/EditorialPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import AuthPage from './pages/AuthPage'
import ProfilePage from './pages/ProfilePage'
import QuizResults from './pages/QuizResults'
import ZoneDetailPage from './pages/ZoneDetailPage'
import FreguesiDetailPage from './pages/FreguesiDetailPage'
import ConcelhoDetailPage from './pages/ConcelhoDetailPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Standalone pages — no header/footer */}
        <Route path="/quiz" element={<QuizFlow />} />
        <Route path="/quiz/resultados" element={<QuizResults />} />
        <Route path="/entrar" element={<AuthPage />} />

        {/* Zone detail (legado) */}
        <Route path="/zona/:slug" element={<ZoneDetailPage />} />

        {/* Nova camada geográfica */}
        <Route path="/freguesia/:slug" element={<FreguesiDetailPage />} />
        <Route path="/concelho/:slug" element={<ConcelhoDetailPage />} />

        {/* Main layout */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/areas" element={<Layout><AreaRecommendations /></Layout>} />
        <Route path="/areas/:slug" element={<Layout><AreaRecommendations /></Layout>} />
        <Route path="/imoveis" element={<Layout><PropertyListingPage /></Layout>} />
        <Route path="/imoveis/:slug" element={<Layout><PropertyDetailPage /></Layout>} />
        <Route path="/editorial" element={<Layout><EditorialPage /></Layout>} />
        <Route path="/editorial/:slug" element={<Layout><ArticleDetailPage /></Layout>} />
        <Route path="/perfil" element={<Layout><ProfilePage /></Layout>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
