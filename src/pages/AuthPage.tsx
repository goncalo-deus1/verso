import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [params] = useSearchParams()
  const defaultMode = params.get('mode') === 'register' ? 'register' : 'login'
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Preencha todos os campos.'); return }
    if (mode === 'register' && !form.name) { setError('Introduza o seu nome.'); return }
    if (form.password.length < 6) { setError('A password deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    login(form.email, mode === 'register' ? form.name : undefined)
    navigate('/')
  }

  function switchMode(next: 'login' | 'register') {
    setMode(next); setError(''); setForm({ name: '', email: '', password: '' })
  }

  const perks = ['Imóveis guardados', 'Perfil de comprador', 'Alertas personalizados', 'Histórico do quiz']

  const inputStyle = {
    width: '100%', padding: '12px 16px', fontSize: '14px', outline: 'none',
    border: '1px solid #E8E4DC', background: 'white', color: '#0A0A0B', borderRadius: '2px',
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16" style={{ background: '#0A0A0B' }}>
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80" alt=""
          className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.12 }} />
        <div className="relative">
          <Link to="/">
            <span className="font-display text-2xl" style={{ color: '#F7F5F0', letterSpacing: '-0.5px' }}>VERSO</span>
          </Link>
        </div>
        <div className="relative space-y-10">
          <div>
            <p className="text-xs font-semibold uppercase mb-5" style={{ color: '#C45D3E', letterSpacing: '3px', fontFamily: 'IBM Plex Mono' }}>
              A sua conta
            </p>
            <h2 className="font-display text-white text-4xl" style={{ letterSpacing: '-1px', lineHeight: '1.15' }}>
              Decisões melhores<br />começam aqui.
            </h2>
            <p className="mt-4 leading-relaxed max-w-sm text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Crie a sua conta gratuita e aceda a recomendações personalizadas, imóveis guardados e guias editoriais.
            </p>
          </div>
          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,93,62,0.15)', border: '1px solid rgba(196,93,62,0.3)' }}>
                  <Check size={10} style={{ color: '#C45D3E' }} />
                </div>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'IBM Plex Mono' }}>© 2025 VERSO</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-24" style={{ background: '#F7F5F0' }}>
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link to=""><span className="font-display text-2xl" style={{ color: '#0A0A0B', letterSpacing: '-0.5px' }}>VERSO</span></Link>
        </div>

        <Link to="/" className="hidden lg:inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors duration-150"
          style={{ color: '#9A9590' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#C45D3E')}
          onMouseLeave={e => (e.currentTarget.style.color = '#9A9590')}>
          <ArrowLeft size={13} /> Voltar ao início
        </Link>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          {/* Toggle */}
          <div className="flex p-1 mb-8" style={{ background: '#E8E4DC', borderRadius: '2px' }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className="flex-1 py-2.5 text-sm font-semibold transition-all duration-150"
                style={mode === m
                  ? { background: '#F7F5F0', color: '#0A0A0B', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                  : { color: '#9A9590' }}>
                {m === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <h1 className="font-display text-3xl mb-2" style={{ color: '#0A0A0B', letterSpacing: '-0.8px' }}>
            {mode === 'login' ? 'Bem-vindo de volta' : 'Criar conta gratuita'}
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: '#9A9590' }}>
            {mode === 'login'
              ? 'Aceda aos seus imóveis guardados e recomendações.'
              : 'Junte-se à VERSO e encontre o imóvel certo — de forma informada.'}
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: '#5A5A5A', letterSpacing: '1.5px', fontFamily: 'IBM Plex Mono' }}>Nome</label>
                <input name="name" type="text" placeholder="O seu nome" value={form.name} onChange={onChange} style={inputStyle} />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: '#5A5A5A', letterSpacing: '1.5px', fontFamily: 'IBM Plex Mono' }}>Email</label>
              <input name="email" type="email" placeholder="o.seu@email.com" value={form.email} onChange={onChange} style={inputStyle} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase" style={{ color: '#5A5A5A', letterSpacing: '1.5px', fontFamily: 'IBM Plex Mono' }}>Password</label>
                {mode === 'login' && (
                  <button type="button" className="text-xs font-medium transition-colors duration-150" style={{ color: '#C45D3E' }}>
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <input name="password" type={showPwd ? 'text' : 'password'} placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={onChange} style={{ ...inputStyle, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-150" style={{ color: '#9A9590' }}>
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs px-4 py-3 font-medium" style={{ color: '#C45D3E', background: '#FEF3EE', border: '1px solid #FDDDD3', borderRadius: '2px' }}>
                {error}
              </p>
            )}

            {mode === 'register' && (
              <p className="text-xs leading-relaxed" style={{ color: '#9A9590' }}>
                Ao criar uma conta, aceita os{' '}
                <span className="cursor-pointer transition-colors duration-150" style={{ color: '#C45D3E' }}>Termos de Serviço</span>
                {' '}e a{' '}
                <span className="cursor-pointer transition-colors duration-150" style={{ color: '#C45D3E' }}>Política de Privacidade</span>.
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 text-white font-semibold text-sm transition-opacity duration-150 mt-2"
              style={{ background: loading ? '#C9C5BD' : '#0A0A0B', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: '8px' }}>
              {loading ? 'A processar...' : mode === 'login' ? 'Entrar na conta' : 'Criar conta gratuita'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: '#E8E4DC' }} />
            <span className="text-xs" style={{ color: '#C9C5BD', fontFamily: 'IBM Plex Mono' }}>ou</span>
            <div className="flex-1 h-px" style={{ background: '#E8E4DC' }} />
          </div>

          {/* Google */}
          <button type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 text-sm font-medium transition-all duration-150"
            style={{ border: '1px solid #E8E4DC', color: '#0A0A0B', background: 'white', borderRadius: '8px' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#FAF8F3')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.6 29.4 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.1 3l5.7-5.7C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.7 20-21 0-1.4-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 6 1.1 8.1 3l5.7-5.7C34.5 5.1 29.5 3 24 3c-7.7 0-14.4 4.4-17.7 11.7z"/>
              <path fill="#4CAF50" d="M24 45c5.3 0 10.2-1.9 13.9-5.1l-6.4-5.4A13 13 0 0 1 24 37c-5.4 0-9.6-3.4-11.3-8H6.2l-6.5 4.9C5.6 40.6 14.3 45 24 45z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.4 5.4C41 35.9 44 30.4 44 24c0-1.4-.1-2.7-.4-4z"/>
            </svg>
            Continuar com Google
          </button>

          <p className="text-center text-xs mt-6" style={{ color: '#9A9590' }}>
            {mode === 'login' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
            <button type="button" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="font-semibold transition-colors duration-150" style={{ color: '#C45D3E' }}>
              {mode === 'login' ? 'Criar conta gratuita' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
