import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2EDE4' }}>
        <div style={{ width: '20px', height: '20px', border: '2px solid rgba(30, 31, 24, 0.125)', borderTopColor: '#C2553A', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />
  }

  return <>{children}</>
}
