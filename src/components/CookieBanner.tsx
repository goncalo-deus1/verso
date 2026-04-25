import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// ─── Tokens ───────────────────────────────────────────────────────────────────

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const STORAGE_KEY = 'verso_cookie_consent'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface CookiePrefs {
  necessary: true
  performance: boolean
  functional: boolean
  marketing: boolean
}

type CategoryKey = keyof CookiePrefs

interface Category {
  key: CategoryKey
  label: string
  description: string
  alwaysOn?: boolean
}

const CATEGORIES: Category[] = [
  {
    key: 'necessary',
    label: 'Cookies Necessários',
    alwaysOn: true,
    description:
      'Estes cookies são indispensáveis para o funcionamento do site. Não podem ser desactivados porque são necessários para coisas básicas como navegar entre páginas, guardar as tuas preferências e manter a sessão activa.',
  },
  {
    key: 'performance',
    label: 'Cookies de Desempenho',
    description:
      'Permitem-nos contar visitas e perceber de onde vêm os utilizadores para medirmos e melhorarmos o desempenho do site. Toda a informação é agregada e anónima.',
  },
  {
    key: 'functional',
    label: 'Cookies Funcionais',
    description:
      'Permitem ao site recordar escolhas que fez — como a língua ou a região — para oferecer funcionalidades mais personalizadas. A informação recolhida não identifica o utilizador.',
  },
  {
    key: 'marketing',
    label: 'Cookies de Marketing',
    description:
      'Utilizados para mostrar anúncios mais relevantes para ti e para os teus interesses. Podem também ser usados para limitar o número de vezes que vês um anúncio e medir a eficácia das campanhas.',
  },
]

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        background: on ? MOSS : HAIRLINE,
        position: 'relative',
        flexShrink: 0,
        transition: 'background 200ms',
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: on ? '23px' : '3px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left 200ms',
        display: 'block',
      }} />
    </button>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [activeTab, setActiveTab] = useState<CategoryKey>('necessary')
  const [prefs, setPrefs] = useState<CookiePrefs>({
    necessary: true,
    performance: false,
    functional: false,
    marketing: false,
  })

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(t)
  }, [])

  function save(p: CookiePrefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    setVisible(false)
    setShowPrefs(false)
  }

  function acceptAll() {
    save({ necessary: true, performance: true, functional: true, marketing: true })
  }

  function rejectAll() {
    save({ necessary: true, performance: false, functional: false, marketing: false })
  }

  function confirmChoices() {
    save(prefs)
  }

  if (!visible) return null

  const activeCategory = CATEGORIES.find(c => c.key === activeTab)!

  // ── Preference center ─────────────────────────────────────────────────────

  if (showPrefs) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(30, 31, 24,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          background: BONE,
          width: '100%',
          maxWidth: '680px',
          borderRadius: '6px',
          boxShadow: '0 32px 80px rgba(30, 31, 24,0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: `1px solid ${HAIRLINE}`,
            flexShrink: 0,
          }}>
            <div>
              <span className="font-display" style={{ fontSize: '13px', color: CLAY, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                habitta
              </span>
              <h2 className="font-display" style={{ fontSize: '18px', color: INK, fontWeight: 400, margin: 0, letterSpacing: '-0.3px' }}>
                Centro de Preferências de Privacidade
              </h2>
            </div>
            <button
              onClick={() => setShowPrefs(false)}
              aria-label="Fechar"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: STONE, padding: '6px', display: 'flex' }}
              onMouseEnter={e => (e.currentTarget.style.color = INK)}
              onMouseLeave={e => (e.currentTarget.style.color = STONE)}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'column' }}>

            {/* Tabs — horizontal scroll on mobile */}
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              borderBottom: `1px solid ${HAIRLINE}`,
              flexShrink: 0,
            }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  style={{
                    flexShrink: 0,
                    textAlign: 'left',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === cat.key ? `2px solid ${CLAY}` : '2px solid transparent',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: activeTab === cat.key ? 600 : 400,
                    color: activeTab === cat.key ? INK : STONE,
                    whiteSpace: 'nowrap',
                    transition: 'color 150ms',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', gap: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: INK, margin: 0, lineHeight: 1.4 }}>
                  {activeCategory.label}
                </h3>
                {activeCategory.alwaysOn ? (
                  <span style={{
                    fontSize: '10px',
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: MOSS,
                    whiteSpace: 'nowrap',
                    padding: '4px 8px',
                    background: 'rgba(62,90,72,0.1)',
                    borderRadius: '2px',
                  }}>
                    Sempre activo
                  </span>
                ) : (
                  <Toggle
                    on={prefs[activeCategory.key] as boolean}
                    onChange={v => setPrefs(prev => ({ ...prev, [activeCategory.key]: v }))}
                  />
                )}
              </div>
              <p style={{ fontSize: '13px', color: STONE, lineHeight: 1.7, margin: 0 }}>
                {activeCategory.description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            gap: '10px',
            padding: '16px 24px',
            borderTop: `1px solid ${HAIRLINE}`,
            flexShrink: 0,
            flexWrap: 'wrap',
          }}>
            <button
              onClick={confirmChoices}
              style={{ padding: '11px 20px', background: MOSS, color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Confirmar as minhas escolhas
            </button>
            <button
              onClick={rejectAll}
              style={{ padding: '11px 20px', background: 'none', color: STONE, border: `1px solid ${HAIRLINE}`, borderRadius: '4px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = INK)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = HAIRLINE)}
            >
              Rejeitar todos
            </button>
            <button
              onClick={acceptAll}
              style={{ padding: '11px 20px', background: CLAY, color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Aceitar todos
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Bottom bar ────────────────────────────────────────────────────────────

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10000,
      background: INK,
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexWrap: 'wrap',
      boxShadow: '0 -8px 32px rgba(30, 31, 24,0.3)',
    }}>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0, maxWidth: '680px' }}>
        Ao clicar em "Aceitar todos os cookies", concordas com o armazenamento de cookies no teu dispositivo para melhorar a navegação, analisar a utilização do site e apoiar os nossos esforços de marketing.{' '}
        <button
          onClick={() => setShowPrefs(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: CLAY, fontSize: '13px', textDecoration: 'underline', padding: 0 }}
        >
          Política de Privacidade
        </button>
      </p>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={() => setShowPrefs(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: 500, textDecoration: 'underline', padding: '10px 4px' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'white')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
        >
          Definições de cookies
        </button>
        <button
          onClick={acceptAll}
          style={{ padding: '11px 22px', background: CLAY, color: 'white', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Aceitar todos os cookies
        </button>
      </div>
    </div>
  )
}
