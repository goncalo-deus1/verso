import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { to: '/imoveis', label: 'Imóveis' },
    { to: '/quiz', label: 'Encontrar a minha zona' },
    { to: '/areas', label: 'Zonas' },
    { to: '/editorial', label: 'Guias' },
  ]

  const isActive = (to: string) => pathname.startsWith(to)

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center" style={{ padding: '16px 24px' }}>
      {/* Floating pill */}
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          background: 'rgba(248,247,244,0.97)',
          border: '1px solid #E8E4DC',
          borderRadius: '100px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'
            : '0 4px 16px rgba(0,0,0,0.07)',
          transition: 'box-shadow 250ms ease',
        }}
      >
        <div className="flex items-center justify-between" style={{ height: '56px', padding: '0 24px' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span className="font-display" style={{ fontSize: '20px', letterSpacing: '-0.5px', color: '#0A0A0B' }}>
              VERSO
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: isActive(link.to) ? '#C45D3E' : '#5A5A5A', textDecoration: 'none' }}
                onMouseEnter={e => { if (!isActive(link.to)) e.currentTarget.style.color = '#0A0A0B' }}
                onMouseLeave={e => { if (!isActive(link.to)) e.currentTarget.style.color = '#5A5A5A' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 transition-colors duration-150"
                  style={{ border: '1px solid #E8E4DC', borderRadius: '50px', background: 'white' }}
                >
                  <div className="w-5 h-5 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ background: '#C45D3E', borderRadius: '50%' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate" style={{ color: '#0A0A0B' }}>
                    {user.name}
                  </span>
                  <ChevronDown size={11} style={{ color: '#9A9590' }} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 z-20 overflow-hidden"
                      style={{ background: '#0A0A0B', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.16)' }}>
                      <div className="px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-xs" style={{ color: '#9A9590', fontFamily: 'IBM Plex Mono' }}>ligado como</p>
                        <p className="text-sm font-medium truncate mt-0.5" style={{ color: '#F7F5F0' }}>{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link to="/perfil" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150"
                          style={{ color: '#C9C5BD', borderRadius: '8px' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#F7F5F0')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#C9C5BD')}>
                          <User size={14} /> O meu perfil
                        </Link>
                        <button onClick={() => { logout(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150"
                          style={{ color: '#C9C5BD', borderRadius: '8px' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#F7F5F0')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#C9C5BD')}>
                          <LogOut size={14} /> Terminar sessão
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
                  style={{ color: '#5A5A5A', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0B')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#5A5A5A')}>
                  Entrar
                </Link>
                <Link to="/entrar?mode=register"
                  className="px-5 py-2 text-sm font-semibold transition-all duration-150"
                  style={{ background: '#0A0A0B', color: '#F7F5F0', borderRadius: '50px', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#C45D3E')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#0A0A0B')}>
                  Criar conta
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2" style={{ color: '#0A0A0B' }} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu — drops inside the pill */}
        {open && (
          <div style={{ borderTop: '1px solid #E8E4DC', padding: '20px 24px 24px' }} className="lg:hidden">
            <nav className="flex flex-col gap-4">
              {links.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                  className="text-base font-medium"
                  style={{ color: isActive(link.to) ? '#C45D3E' : '#0A0A0B', textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div style={{ borderTop: '1px solid #E8E4DC', marginTop: '20px', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: '#C45D3E', borderRadius: '50%' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#0A0A0B' }}>{user.name}</p>
                      <p className="text-xs" style={{ color: '#9A9590', fontFamily: 'IBM Plex Mono' }}>{user.email}</p>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setOpen(false) }}
                    className="flex items-center gap-2 text-sm font-medium" style={{ color: '#5A5A5A' }}>
                    <LogOut size={14} /> Terminar sessão
                  </button>
                </>
              ) : (
                <>
                  <Link to="/entrar" onClick={() => setOpen(false)}
                    className="block text-center py-3 text-sm font-medium"
                    style={{ border: '1px solid #E8E4DC', color: '#0A0A0B', borderRadius: '50px', textDecoration: 'none' }}>
                    Entrar
                  </Link>
                  <Link to="/entrar?mode=register" onClick={() => setOpen(false)}
                    className="block text-center py-3 text-white text-sm font-semibold"
                    style={{ background: '#0A0A0B', borderRadius: '50px', textDecoration: 'none' }}>
                    Criar conta
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
