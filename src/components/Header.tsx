import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, ChevronDown, MessageSquare, Info, Globe } from 'lucide-react'
import { useAuth, displayName } from '../context/AuthContext'
import { useQuiz } from '../context/QuizContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { useUnreadCount } from '../hooks/useUnreadCount'
import { Wordmark } from './Wordmark'

// Brand tokens — idênticos ao resto do site.
const INK      = '#1E1F18'
const STONE    = '#3A3B2E'
const CLAY     = '#C2553A'
const BONE     = '#F2EDE4'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

export default function Header() {
  const [open, setOpen] = useState(false)               // mobile menu
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const name = displayName(user)
  const unread = useUnreadCount()
  const { open: openQuiz, quizResult } = useQuiz()
  const { lang, toggle } = useLang()
  const tr = useT(lang)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fecha menus ao navegar.
  useEffect(() => { setOpen(false); setUserMenuOpen(false) }, [pathname])

  const isActive = (to: string) => pathname.startsWith(to)

  /* ------------------------------------------------------------------ *
   * Sub-renders                                                         *
   * ------------------------------------------------------------------ */

  // Ícone de chat com badge — usado no cluster da direita (auth) e no mobile.
  function ChatButton({ size = 36 }: { size?: number }) {
    return (
      <Link
        to="/inbox"
        aria-label={unread > 0 ? `Mensagens: ${unread} ${unread === 1 ? 'não lida' : 'não lidas'}` : 'Mensagens'}
        style={{
          position: 'relative',
          width: size, height: size,
          borderRadius: 999,
          border: unread > 0 ? `1px solid ${CLAY}` : `1px solid ${HAIRLINE}`,
          background: 'white',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: unread > 0 ? CLAY : STONE,
          textDecoration: 'none', transition: 'all 150ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = CLAY; e.currentTarget.style.color = CLAY }}
        onMouseLeave={e => {
          if (unread === 0) {
            e.currentTarget.style.borderColor = HAIRLINE
            e.currentTarget.style.color = STONE
          }
        }}
      >
        <MessageSquare size={Math.round(size * 0.42)} strokeWidth={2} />
        {unread > 0 && (
          <span
            aria-hidden
            style={{
              position: 'absolute', top: -2, right: -2,
              minWidth: 16, height: 16, padding: '0 4px',
              background: CLAY, color: BONE,
              borderRadius: 8, fontSize: 10, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'IBM Plex Mono',
              border: `2px solid ${'#F8F7F4'}`,
              lineHeight: 1,
            }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center" style={{ padding: '12px 16px' }}>
      {/* Floating pill */}
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          background: 'rgba(248,247,244,0.97)',
          border: `1px solid ${HAIRLINE}`,
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

          {/* Logo — sempre */}
          <div style={{ flex: 1 }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Wordmark variant="navbar" />
            </Link>
          </div>

          {/* Central nav — desktop md+ — difere por estado de auth */}
          <nav className="hidden md:flex items-center" style={{ gap: 22 }}>
            {user ? (
              <>
                {/* "A minha zona" só faz sentido se quizResult existir. Sem ele,
                    o link levaria a um dead end no /quiz/dossier. */}
                {quizResult && (
                  <Link
                    to="/quiz/dossier"
                    className="transition-opacity duration-150 inline-flex items-center"
                    style={{
                      color: INK, fontSize: 14, fontWeight: 500,
                      textDecoration: 'none', gap: 8,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: CLAY, display: 'inline-block' }} />
                    {tr('header.myZone')}
                  </Link>
                )}
                <NavLinkDesktop to="/imoveis" active={isActive('/imoveis')}>{tr('header.properties')}</NavLinkDesktop>
                <NavLinkDesktop to="/blog" active={isActive('/blog')}>{tr('header.guides')}</NavLinkDesktop>
              </>
            ) : (
              <>
                <button
                  onClick={() => openQuiz('header')}
                  className="transition-colors duration-150"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    color: INK, fontSize: 14, fontWeight: 500,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = CLAY)}
                  onMouseLeave={e => (e.currentTarget.style.color = INK)}
                >
                  {tr('header.findZone')}
                </button>
                <NavLinkDesktop to="/areas" active={isActive('/areas')}>{tr('header.areas')}</NavLinkDesktop>
                <NavLinkDesktop to="/blog" active={isActive('/blog')}>{tr('header.guides')}</NavLinkDesktop>
                <NavLinkDesktop to="/imoveis" active={isActive('/imoveis')}>{tr('header.properties')}</NavLinkDesktop>
              </>
            )}
          </nav>

          {/* Right cluster — desktop md+ */}
          <div className="hidden md:flex items-center" style={{ flex: 1, justifyContent: 'flex-end', gap: 10 }}>
            {user ? (
              <>
                <ChatButton size={32} />

                {/* Avatar dropdown — só inicial + chevron, sem nome no header */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    aria-label="Menu do utilizador"
                    aria-expanded={userMenuOpen}
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      gap: 6, padding: '4px 12px 4px 4px',
                      background: 'white', border: `1px solid ${HAIRLINE}`,
                      borderRadius: 999, cursor: 'pointer',
                      transition: 'border-color 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = CLAY)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = HAIRLINE)}
                  >
                    <span style={{
                      width: 28, height: 28, borderRadius: '50%', background: CLAY,
                      color: 'white', fontSize: 12, fontWeight: 600,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {name.charAt(0).toUpperCase() || '?'}
                    </span>
                    <ChevronDown size={12} style={{ color: STONE }} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div
                        role="menu"
                        className="absolute right-0 top-full mt-2 w-60 z-20 overflow-hidden"
                        style={{
                          background: INK, borderRadius: 12,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
                        }}
                      >
                        {/* Header do dropdown: email do user (confirmação de conta) */}
                        <div className="px-4 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'IBM Plex Mono' }}>{tr('header.loggedAs')}</p>
                          <p className="text-sm font-medium truncate mt-0.5" style={{ color: BONE }}>{user.email ?? ''}</p>
                        </div>
                        <div className="p-1.5">
                          <MenuItem to="/minha-conta" icon={<User size={14} />}>{tr('header.myAccount')}</MenuItem>
                          <MenuItem to="/inbox" icon={<MessageSquare size={14} />} badge={unread > 0 ? (unread > 9 ? '9+' : String(unread)) : undefined}>
                            {tr('header.messages')}
                          </MenuItem>
                          <MenuItem to="/sobre" icon={<Info size={14} />}>{tr('header.about')}</MenuItem>
                          {/* Idioma — toggle in-place. Não fecha o menu para o utilizador ver o switch. */}
                          <button
                            type="button"
                            onClick={toggle}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150"
                            style={{ color: 'rgba(255,255,255,0.55)', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={e => (e.currentTarget.style.color = BONE)}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                          >
                            <Globe size={14} />
                            <span style={{ flex: 1 }}>{tr('header.language')}</span>
                            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '0.5px' }}>
                              <span style={{ color: lang === 'pt' ? BONE : 'rgba(255,255,255,0.35)' }}>PT</span>
                              <span style={{ color: 'rgba(255,255,255,0.25)' }}> / </span>
                              <span style={{ color: lang === 'en' ? BONE : 'rgba(255,255,255,0.35)' }}>EN</span>
                            </span>
                          </button>

                          {/* Separator */}
                          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '6px 8px' }} />

                          <button
                            type="button"
                            onClick={() => { signOut(); setUserMenuOpen(false) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150"
                            style={{ color: 'rgba(255,255,255,0.55)', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                            onMouseEnter={e => (e.currentTarget.style.color = BONE)}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                          >
                            <LogOut size={14} /> {tr('header.signOut')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* EN/PT toggle — só estado guest (no auth fica dentro do dropdown). */}
                <button
                  onClick={toggle}
                  aria-label="Toggle language"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: STONE, fontSize: 12, fontWeight: 500,
                    fontFamily: 'IBM Plex Mono', letterSpacing: '0.5px',
                    padding: '4px 6px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = INK)}
                  onMouseLeave={e => (e.currentTarget.style.color = STONE)}
                >
                  {lang === 'pt' ? 'EN' : 'PT'}
                </button>

                {/* Entrar — sólido clay */}
                <Link
                  to="/entrar"
                  style={{
                    background: CLAY, color: 'white',
                    padding: '7px 16px', borderRadius: 8,
                    fontSize: 14, fontWeight: 500,
                    textDecoration: 'none', transition: 'opacity 150ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {tr('header.signIn')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile non-collapsing CTA — visible only <md, fora do hamburger */}
          <div className="flex md:hidden items-center" style={{ gap: 8 }}>
            {user ? (
              <ChatButton size={36} />
            ) : (
              <Link
                to="/entrar"
                style={{
                  background: CLAY, color: 'white',
                  padding: '7px 14px', borderRadius: 8,
                  fontSize: 13, fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {tr('header.signIn')}
              </Link>
            )}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
              aria-expanded={open}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: INK, padding: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — colapsa para dentro da pill */}
        {open && (
          <div className="md:hidden" style={{ borderTop: `1px solid ${HAIRLINE}`, padding: '20px 24px 24px' }}>
            <nav className="flex flex-col gap-5">
              {user ? (
                <>
                  {quizResult && (
                    <Link
                      to="/quiz/dossier"
                      onClick={() => setOpen(false)}
                      style={{ color: INK, fontSize: 16, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: CLAY, display: 'inline-block' }} />
                      {tr('header.myZone')}
                    </Link>
                  )}
                  <NavLinkMobile to="/imoveis" active={isActive('/imoveis')} onClick={() => setOpen(false)}>{tr('header.properties')}</NavLinkMobile>
                  <NavLinkMobile to="/blog" active={isActive('/blog')} onClick={() => setOpen(false)}>{tr('header.guides')}</NavLinkMobile>
                  <NavLinkMobile to="/sobre" active={isActive('/sobre')} onClick={() => setOpen(false)}>{tr('header.about')}</NavLinkMobile>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { openQuiz('header'); setOpen(false) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: INK, fontSize: 16, fontWeight: 500, textAlign: 'left', padding: 0 }}
                  >
                    {tr('header.findZone')}
                  </button>
                  <NavLinkMobile to="/areas" active={isActive('/areas')} onClick={() => setOpen(false)}>{tr('header.areas')}</NavLinkMobile>
                  <NavLinkMobile to="/blog" active={isActive('/blog')} onClick={() => setOpen(false)}>{tr('header.guides')}</NavLinkMobile>
                  <NavLinkMobile to="/imoveis" active={isActive('/imoveis')} onClick={() => setOpen(false)}>{tr('header.properties')}</NavLinkMobile>
                  <NavLinkMobile to="/sobre" active={isActive('/sobre')} onClick={() => setOpen(false)}>{tr('header.about')}</NavLinkMobile>
                </>
              )}
            </nav>

            <div style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: 20, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Language toggle */}
              <button
                onClick={toggle}
                style={{
                  alignSelf: 'flex-start', background: 'none', border: `1px solid ${HAIRLINE}`,
                  cursor: 'pointer', color: STONE, padding: '6px 14px',
                  borderRadius: 999, fontSize: 12, fontFamily: 'IBM Plex Mono',
                }}
              >
                {tr('header.switchLang')}
              </button>

              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center text-white text-sm font-semibold"
                      style={{ background: CLAY, borderRadius: '50%' }}>
                      {name.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: INK }}>{name}</p>
                      <p className="text-xs" style={{ color: STONE, fontFamily: 'IBM Plex Mono' }}>{user.email ?? ''}</p>
                    </div>
                  </div>
                  <Link
                    to="/minha-conta"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: STONE, textDecoration: 'none' }}
                  >
                    <User size={14} /> {tr('header.myAccount')}
                  </Link>
                  <button
                    onClick={() => { signOut(); setOpen(false) }}
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: STONE, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                  >
                    <LogOut size={14} /> {tr('header.signOut')}
                  </button>
                </>
              ) : (
                <Link
                  to="/entrar"
                  onClick={() => setOpen(false)}
                  className="block text-center py-3 text-white text-sm font-medium"
                  style={{ background: CLAY, borderRadius: 8, textDecoration: 'none' }}
                >
                  {tr('header.signIn')}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────── *
 * Helpers locais — links com peso correcto e estado activo            *
 * ──────────────────────────────────────────────────────────────────── */

function NavLinkDesktop({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="transition-colors duration-150"
      style={{
        color: active ? '#C2553A' : '#3A3B2E',
        fontSize: 14, fontWeight: 400,
        textDecoration: 'none',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#1E1F18' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#3A3B2E' }}
    >
      {children}
    </Link>
  )
}

function NavLinkMobile({ to, active, onClick, children }: { to: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        color: active ? '#C2553A' : '#1E1F18',
        fontSize: 16, fontWeight: 500,
        textDecoration: 'none',
        padding: '4px 0',
      }}
    >
      {children}
    </Link>
  )
}

function MenuItem({
  to, icon, badge, children,
}: {
  to: string
  icon: React.ReactNode
  badge?: string
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      className="flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150"
      style={{
        color: badge ? '#F2EDE4' : 'rgba(255,255,255,0.55)',
        borderRadius: 8,
        textDecoration: 'none',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
      onMouseLeave={e => (e.currentTarget.style.color = badge ? '#F2EDE4' : 'rgba(255,255,255,0.55)')}
    >
      {icon}
      <span style={{ flex: 1 }}>{children}</span>
      {badge && (
        <span style={{
          minWidth: 18, height: 18, padding: '0 5px',
          background: '#C2553A', color: '#F2EDE4',
          borderRadius: 9, fontSize: 11, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'IBM Plex Mono', lineHeight: 1,
        }}>
          {badge}
        </span>
      )}
    </Link>
  )
}
