import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import FeedbackModal, { hasFeedbackDone } from '../components/FeedbackModal'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [redirectTo,   setRedirectTo]   = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const redirect = sessionStorage.getItem('auth_redirect') ?? '/'
        sessionStorage.removeItem('auth_redirect')

        if (!hasFeedbackDone()) {
          setRedirectTo(redirect)
          setFeedbackOpen(true)
        } else {
          navigate(redirect, { replace: true })
        }
      } else {
        navigate('/entrar', { replace: true })
      }
    })
  }, [navigate])

  const handleClose = () => {
    setFeedbackOpen(false)
    navigate(redirectTo ?? '/', { replace: true })
  }

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2EDE4' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '24px', height: '24px', border: '2px solid rgba(30, 31, 24, 0.125)', borderTopColor: '#C2553A', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '14px', color: '#3A3B2E' }}>A autenticar…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
      <FeedbackModal
        open={feedbackOpen}
        onClose={handleClose}
        source="email_confirm"
      />
    </>
  )
}
