import { useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Check, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { useT, type TKey } from '../i18n/translations'
import { Wordmark } from '../components/Wordmark'
import { saveMarketingConsent } from '../lib/marketingConsent'
import { trackCompleteRegistration } from '../lib/pixel'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

type Mode = 'login' | 'register'
type Method = 'password' | 'magic'

export default function AuthPage() {
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { signIn, signUp, signInWithMagicLink } = useAuth()
  const { lang } = useLang()
  const tr = useT(lang)

  // translateError consome strings retornadas pelo Supabase Auth (sempre EN).
  // Mapeia para chaves de tradução; fallback é o próprio msg do servidor.
  function translateError(msg: string): string {
    if (msg.includes('Invalid login credentials')) return tr('auth.err.invalidCreds')
    if (msg.includes('Email not confirmed'))       return tr('auth.err.notConfirmed')
    if (msg.includes('User already registered'))   return tr('auth.err.exists')
    if (msg.includes('Password should be'))        return tr('auth.err.passwordLen')
    if (msg.includes('rate limit'))                return tr('auth.err.rateLimit')
    return msg
  }

  const defaultMode: Mode = params.get('mode') === 'register' ? 'register' : 'login'
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [method, setMethod] = useState<Method>('password')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [marketingConsent, setMarketingConsent] = useState(false)

  const redirectParam = params.get('redirect')
  const from = redirectParam ?? (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setMagicSent(false)
    setForm({ name: '', email: '', password: '' })
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.password) { setError(tr('auth.err.fillAll')); return }
    if (mode === 'register' && !form.name) { setError(tr('auth.err.enterName')); return }
    if (form.password.length < 6) { setError(tr('auth.err.passwordLen')); return }

    setLoading(true)
    setError('')

    if (mode === 'register') {
      if (from !== '/') sessionStorage.setItem('auth_redirect', from)
      const { error, userId } = await signUp(form.email, form.password, form.name)
      setLoading(false)
      if (error) { sessionStorage.removeItem('auth_redirect'); setError(translateError(error)); return }
      // Save marketing consent (non-blocking — signup always succeeds regardless)
      if (userId) {
        saveMarketingConsent({ userId, consented: marketingConsent, source: 'signup' })
          .catch(err => console.warn('[marketingConsent] signup save failed:', err))
      }
      // Show "check your email" message
      trackCompleteRegistration()
      setMagicSent(true)
    } else {
      const { error } = await signIn(form.email, form.password)
      setLoading(false)
      if (error) { setError(translateError(error)); return }
      navigate(from, { replace: true })
    }
  }

  async function handleMagicSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email) { setError(tr('auth.err.enterEmail')); return }

    setLoading(true)
    setError('')
    if (from !== '/') sessionStorage.setItem('auth_redirect', from)
    const { error } = await signInWithMagicLink(form.email)
    setLoading(false)
    if (error) { sessionStorage.removeItem('auth_redirect'); setError(translateError(error)); return }
    setMagicSent(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', fontSize: '14px', outline: 'none',
    border: `1px solid ${HAIRLINE}`, background: 'white', color: INK, borderRadius: '2px',
    boxSizing: 'border-box',
  }

  const perks = [
    tr('auth.perk.savedProps'),
    tr('auth.perk.buyerProfile'),
    tr('auth.perk.alerts'),
    tr('auth.perk.quizHistory'),
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between" style={{ padding: '64px', background: INK }}>
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
        <div style={{ position: 'relative' }}>
          <Link to="/"><span style={{ fontSize: '24px', color: BONE }}><Wordmark /></span></Link>
        </div>
        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '3px', color: CLAY, fontFamily: 'IBM Plex Mono', marginBottom: '20px' }}>
            {tr('auth.left.eyebrow')}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display, serif)', color: 'white', fontSize: '36px', letterSpacing: '-1px', lineHeight: '1.15', marginBottom: '16px' }}>
            {tr('auth.left.title').split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '340px', marginBottom: '40px' }}>
            {tr('auth.left.body')}
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {perks.map(p => (
              <li key={p} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.55)' }}>
                <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'rgba(196,93,62,0.15)', border: '1px solid rgba(196,93,62,0.3)' }}>
                  <Check size={10} color={CLAY} />
                </div>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p style={{ position: 'relative', fontSize: '11px', color: 'rgba(255,255,255,0.15)', fontFamily: 'IBM Plex Mono' }}>© 2025 Habitta</p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 32px', background: BONE }}>
        {/* Mobile logo */}
        <div className="lg:hidden" style={{ marginBottom: '40px' }}>
          <Link to="/"><span style={{ fontSize: '24px', color: INK }}><Wordmark /></span></Link>
        </div>

        <Link to="/" className="hidden lg:inline-flex" style={{ alignItems: 'center', gap: '8px', fontSize: '14px', color: STONE, textDecoration: 'none', marginBottom: '40px', display: 'inline-flex' }}
          onMouseEnter={e => (e.currentTarget.style.color = CLAY)}
          onMouseLeave={e => (e.currentTarget.style.color = STONE)}>
          <ArrowLeft size={13} /> {tr('auth.backHome')}
        </Link>

        <div style={{ maxWidth: '380px', width: '100%', margin: '0 auto' }}>
          {magicSent ? (
            <ConfirmationScreen email={form.email} isRegister={mode === 'register'} tr={tr} />
          ) : (
            <>
              {/* Mode toggle */}
              <div style={{ display: 'flex', padding: '4px', marginBottom: '32px', background: 'rgba(30, 31, 24, 0.125)', borderRadius: '2px' }}>
                {(['login', 'register'] as const).map(m => (
                  <button key={m} onClick={() => switchMode(m)}
                    style={{
                      flex: 1, padding: '10px', fontSize: '14px', fontWeight: 600,
                      border: 'none', cursor: 'pointer', borderRadius: '2px', transition: 'all 150ms',
                      background: mode === m ? BONE : 'transparent',
                      color: mode === m ? INK : STONE,
                      boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}>
                    {m === 'login' ? tr('auth.tab.login') : tr('auth.tab.register')}
                  </button>
                ))}
              </div>

              <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', color: INK, letterSpacing: '-0.8px', marginBottom: '8px' }}>
                {mode === 'login' ? tr('auth.welcome') : tr('auth.createTitle')}
              </h1>
              <p style={{ fontSize: '14px', color: STONE, lineHeight: 1.6, marginBottom: '32px' }}>
                {mode === 'login' ? tr('auth.loginBlurb') : tr('auth.registerBlurb')}
              </p>

              {/* Method toggle (only login) */}
              {mode === 'login' && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {(['password', 'magic'] as const).map(m => (
                    <button key={m} onClick={() => { setMethod(m); setError('') }}
                      style={{
                        flex: 1, padding: '8px 12px', fontSize: '13px', fontWeight: 500,
                        border: `1px solid ${method === m ? INK : HAIRLINE}`,
                        background: method === m ? INK : 'white',
                        color: method === m ? BONE : STONE,
                        borderRadius: '6px', cursor: 'pointer', transition: 'all 150ms',
                      }}>
                      {m === 'password' ? tr('auth.method.password') : tr('auth.method.magic')}
                    </button>
                  ))}
                </div>
              )}

              {method === 'magic' && mode === 'login' ? (
                <form onSubmit={handleMagicSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, fontFamily: 'IBM Plex Mono', marginBottom: '6px' }}>{tr('auth.field.email')}</label>
                    <input name="email" type="email" placeholder={tr('auth.field.emailPh')} value={form.email} onChange={onChange} style={inputStyle} autoFocus />
                  </div>
                  {error && <ErrorBanner text={error} />}
                  <button type="submit" disabled={loading}
                    style={{ width: '100%', padding: '14px', background: loading ? HAIRLINE : INK, color: loading ? STONE : BONE, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Mail size={15} />
                    {loading ? tr('auth.sending') : tr('auth.sendMagic')}
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {mode === 'register' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, fontFamily: 'IBM Plex Mono', marginBottom: '6px' }}>{tr('auth.field.name')}</label>
                      <input name="name" type="text" placeholder={tr('auth.field.namePh')} value={form.name} onChange={onChange} style={inputStyle} autoFocus />
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, fontFamily: 'IBM Plex Mono', marginBottom: '6px' }}>{tr('auth.field.email')}</label>
                    <input name="email" type="email" placeholder={tr('auth.field.emailPh')} value={form.email} onChange={onChange} style={inputStyle} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, fontFamily: 'IBM Plex Mono' }}>{tr('auth.field.password')}</label>
                      {mode === 'login' && (
                        <button type="button" onClick={() => { setMethod('magic'); setError('') }}
                          style={{ fontSize: '12px', fontWeight: 500, color: CLAY, background: 'none', border: 'none', cursor: 'pointer' }}>
                          {tr('auth.forgot')}
                        </button>
                      )}
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input name="password" type={showPwd ? 'text' : 'password'} placeholder={tr('auth.field.passwordPh')}
                        value={form.password} onChange={onChange} style={{ ...inputStyle, paddingRight: '44px' }} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)}
                        style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: STONE }}>
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  {error && <ErrorBanner text={error} />}

                  {mode === 'register' && (
                    <>
                      <p style={{ fontSize: '12px', color: STONE, lineHeight: 1.5 }}>
                        {tr('auth.terms.before')} <span style={{ color: CLAY }}>{tr('auth.terms.tos')}</span> {tr('auth.terms.middle')} <span style={{ color: CLAY }}>{tr('auth.terms.privacy')}</span>{tr('auth.terms.suffix')}
                      </p>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={marketingConsent}
                          onChange={e => setMarketingConsent(e.target.checked)}
                          style={{ marginTop: '2px', flexShrink: 0, accentColor: CLAY, width: '15px', height: '15px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', color: STONE, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                          {tr('auth.marketing')}
                        </span>
                      </label>
                    </>
                  )}

                  <button type="submit" disabled={loading}
                    style={{ width: '100%', padding: '14px', background: loading ? HAIRLINE : INK, color: loading ? STONE : BONE, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}>
                    {loading ? tr('auth.processing') : mode === 'login' ? tr('auth.loginCta') : tr('auth.registerCta')}
                  </button>
                </form>
              )}

              <p style={{ textAlign: 'center', fontSize: '13px', color: STONE, marginTop: '24px' }}>
                {mode === 'login' ? tr('auth.noAccount') + ' ' : tr('auth.hasAccount') + ' '}
                <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  style={{ fontWeight: 600, color: CLAY, background: 'none', border: 'none', cursor: 'pointer' }}>
                  {mode === 'login' ? tr('auth.signUpLink') : tr('auth.signInLink')}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ErrorBanner({ text }: { text: string }) {
  return (
    <p style={{ fontSize: '13px', color: '#C2553A', background: '#FEF3EE', border: '1px solid #FDDDD3', borderRadius: '2px', padding: '10px 14px' }}>
      {text}
    </p>
  )
}

function ConfirmationScreen({
  email, isRegister, tr,
}: {
  email: string
  isRegister: boolean
  tr: (key: TKey) => string
}) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ width: '52px', height: '52px', background: '#FEF3EE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Mail size={24} color={CLAY} />
      </div>
      <h2 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '24px', color: INK, letterSpacing: '-0.5px', marginBottom: '12px' }}>
        {isRegister ? tr('auth.confirm.titleReg') : tr('auth.confirm.titleLogin')}
      </h2>
      <p style={{ fontSize: '14px', color: STONE, lineHeight: 1.65, marginBottom: '8px' }}>
        {tr('auth.confirm.sentTo')}
      </p>
      <p style={{ fontSize: '14px', fontWeight: 600, color: INK, marginBottom: '24px', fontFamily: 'IBM Plex Mono' }}>
        {email}
      </p>
      <p style={{ fontSize: '13px', color: STONE, lineHeight: 1.6 }}>
        {isRegister ? tr('auth.confirm.bodyReg') : tr('auth.confirm.bodyLogin')}
      </p>
    </div>
  )
}
