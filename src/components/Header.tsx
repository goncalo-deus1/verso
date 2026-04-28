import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth, displayName } from '../context/AuthContext'
import { useQuiz } from '../context/QuizContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { Wordmark } from './Wordmark'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const name = displayName(user)
  const { open: openQuiz, quizResult } = useQuiz()
  const { lang, toggle } = useLang()
  const tr = useT(lang)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/areas', label: tr('header.areas') },
    { to: '/editorial', label: tr('header.guides') },
  ]

  const isActive = (to: string) => pathname.startsWith(to)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center" style={{ padding: '12px 16px' }}>
      {/* Floating pill */}
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          background: 'rgba(248,247,244,0.97)',
          border: '1px solid rgba(30, 31, 24, 0.125)',
          borderRadius: open ? '20px' : '100px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 4px 16px rgba(0,0,0,0.07)',
          transition: 'box-shadow 250ms ease',
        }}
      >
        <div className="flex items-center" style={{ height: '52px', padding: '0 18px' }}>

          {/* Logo */}
          <div style={{ flex: 1 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Wordmark variant="navbar" />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => openQuiz('header')}
              className="text-sm font-medium transition-colors duration-150"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3A3B2E', padding: 0 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1E1F18')}
              onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}
            >
              {tr('header.findZone')}
            </button>
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: isActive(link.to) ? '#C2553A' : '#3A3B2E', textDecoration: 'none' }}
                onMouseEnter={e => { if (!isActive(link.to)) e.currentTarget.style.color = '#1E1F18' }}
                onMouseLeave={e => { if (!isActive(link.to)) e.currentTarget.style.color = '#3A3B2E' }}
              >
                {link.label}
              </Link>
            ))}
            {user && quizResult && (
              <Link
                to="/quiz/dossier"
                className="text-sm font-medium transition-colors duration-150 flex items-center gap-1.5"
                style={{ color: '#C2553A', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <span style={{ fontSize: '10px', opacity: 0.6 }}>●</span>
                A minha zona
              </Link>
            )}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-2" style={{ flex: 1, justifyContent: 'flex-end' }}>

            {/* Language toggle */}
            <button
              onClick={toggle}
              className="text-xs font-semibold transition-colors duration-150"
              style={{
                background: 'none', border: '1px solid rgba(30, 31, 24, 0.125)', cursor: 'pointer',
                color: '#3A3B2E', padding: '5px 10px', borderRadius: '50px',
                fontFamily: 'IBM Plex Mono', letterSpacing: '0.5px',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C2553A'; e.currentTarget.style.color = '#C2553A' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(30, 31, 24, 0.125)'; e.currentTarget.style.color = '#3A3B2E' }}
              aria-label="Toggle language"
            >
              {lang === 'pt' ? 'EN' : 'PT'}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 transition-colors duration-150"
                  style={{ border: '1px solid rgba(30, 31, 24, 0.125)', borderRadius: '50px', background: 'white' }}
                >
                  <div className="w-5 h-5 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ background: '#C2553A', borderRadius: '50%' }}>
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate" style={{ color: '#1E1F18' }}>
                    {name}
                  </span>
                  <ChevronDown size={11} style={{ color: '#3A3B2E' }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 z-20 overflow-hidden"
                      style={{ background: '#1E1F18', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}>
                      <div className="px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono' }}>{tr('header.loggedAs')}</p>
                        <p className="text-sm font-medium truncate mt-0.5" style={{ color: '#F2EDE4' }}>{user.email ?? ''}</p>
                      </div>
                      <div className="p-1.5">
                        <Link to="/minha-conta" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150"
                          style={{ color: 'rgba(255,255,255,0.55)', borderRadius: '8px' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                          <User size={14} /> {tr('header.myProfile')}
                        </Link>
                        <button onClick={() => { signOut(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150"
                          style={{ color: 'rgba(255,255,255,0.55)', borderRadius: '8px' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                          <LogOut size={14} /> {tr('header.signOut')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/entrar"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-150"
                  style={{ color: '#3A3B2E', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#1E1F18')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
                  {tr('header.signIn')}
                </Link>
                <Link to="/entrar?mode=register"
                  className="px-5 py-2 text-sm font-semibold transition-all duration-150"
                  style={{ background: '#1E1F18', color: '#F2EDE4', borderRadius: '50px', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#C2553A')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1E1F18')}>
                  {tr('header.createAcc')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2" style={{ color: '#1E1F18' }} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu — drops inside the pill */}
        {open && (
          <div style={{ borderTop: '1px solid rgba(30, 31, 24, 0.125)', padding: '20px 24px 24px' }} className="lg:hidden">
            <nav className="flex flex-col gap-5">
              <button
                onClick={() => { openQuiz('header'); setOpen(false) }}
                className="text-base font-medium text-left"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C2553A', padding: 0 }}
              >
                {tr('header.findZone')}
              </button>
              {links.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                  className="text-base font-medium py-1"
                  style={{ color: isActive(link.to) ? '#C2553A' : '#1E1F18', textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ))}
              {user && quizResult && (
                <Link to="/quiz/dossier" onClick={() => setOpen(false)}
                  className="text-base font-medium flex items-center gap-2"
                  style={{ color: '#C2553A', textDecoration: 'none' }}>
                  <span style={{ fontSize: '10px', opacity: 0.6 }}>●</span>
                  A minha zona
                </Link>
              )}
            </nav>
            <div style={{ borderTop: '1px solid rgba(30, 31, 24, 0.125)', marginTop: '20px', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Language toggle mobile */}
              <button
                onClick={toggle}
                style={{
                  alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(30, 31, 24, 0.125)',
                  cursor: 'pointer', color: '#3A3B2E', padding: '6px 14px',
                  borderRadius: '50px', fontSize: '12px', fontFamily: 'IBM Plex Mono',
                }}
              >
                {lang === 'pt' ? 'Switch to English' : 'Mudar para Português'}
              </button>

              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: '#C2553A', borderRadius: '50%' }}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1E1F18' }}>{name}</p>
                      <p className="text-xs" style={{ color: '#3A3B2E', fontFamily: 'IBM Plex Mono' }}>{user.email ?? ''}</p>
                    </div>
                  </div>
                  <button onClick={() => { signOut(); setOpen(false) }}
                    className="flex items-center gap-2 text-sm font-medium" style={{ color: '#3A3B2E' }}>
                    <LogOut size={14} /> {tr('header.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/entrar" onClick={() => setOpen(false)}
                    className="block text-center py-3 text-sm font-medium"
                    style={{ border: '1px solid rgba(30, 31, 24, 0.125)', color: '#1E1F18', borderRadius: '50px', textDecoration: 'none' }}>
                    {tr('header.signIn')}
                  </Link>
                  <Link to="/entrar?mode=register" onClick={() => setOpen(false)}
                    className="block text-center py-3 text-white text-sm font-semibold"
                    style={{ background: '#1E1F18', borderRadius: '50px', textDecoration: 'none' }}>
                    {tr('header.createAcc')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
