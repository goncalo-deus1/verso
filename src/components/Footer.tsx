import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const mono: React.CSSProperties = { fontFamily: 'IBM Plex Mono', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2.5px' }

export default function Footer() {
  return (
    <footer style={{ background: '#080809', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Top strip — availability badge */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 80px' }} className="px-6 lg:px-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6B7B5E', display: 'inline-block', boxShadow: '0 0 8px rgba(107,123,94,0.7)' }} />
            <span style={{ ...mono, color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>Plataforma disponível — Portugal</span>
          </div>
          <Link to="/quiz"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(196,93,62,0.1)', border: '1px solid rgba(196,93,62,0.2)', color: '#C45D3E', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRadius: '8px', transition: 'background 200ms' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(196,93,62,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(196,93,62,0.1)')}>
            Começar o quiz <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main footer content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 80px' }} className="px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-4" style={{ gap: '48px' }}>

          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-display" style={{ fontSize: '24px', letterSpacing: '-0.5px', color: '#F7F5F0', marginBottom: '16px' }}>VERSO</p>
            <p style={{ fontSize: '13px', lineHeight: '1.85', color: 'rgba(255,255,255,0.3)', maxWidth: '260px' }}>
              Encontre a zona certa antes de encontrar o imóvel certo. Uma plataforma editorial para decisões informadas em Portugal.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h4 style={{ ...mono, color: 'rgba(255,255,255,0.2)', marginBottom: '20px' }}>Explorar</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { to: '/imoveis', label: 'Imóveis' },
                { to: '/areas', label: 'Zonas' },
                { to: '/quiz', label: 'Quiz de comprador' },
                { to: '/editorial', label: 'Guias editoriais' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 150ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#F7F5F0')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 style={{ ...mono, color: 'rgba(255,255,255,0.2)', marginBottom: '20px' }}>Recursos</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Guia do comprador', 'Custos de compra', 'Financiamento', 'IMT & IMI', 'CPCV explicado'].map(l => (
                <li key={l}>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', cursor: 'default' }}>{l}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fontes Oficiais */}
          <div>
            <h4 style={{ ...mono, color: 'rgba(255,255,255,0.2)', marginBottom: '20px' }}>Fontes Oficiais</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'SNIT / DGT', href: 'https://snit.dgterritorio.gov.pt' },
                { label: 'Portal do Cidadão', href: 'https://www.portaldocidadao.pt' },
                { label: 'IRN — Escrituras', href: 'https://www.irn.mj.pt' },
                { label: 'INE — Estatísticas', href: 'https://www.ine.pt' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 150ms' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C45D3E')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                    {l.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '64px', paddingTop: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <p style={{ ...mono, color: 'rgba(255,255,255,0.18)', fontSize: '10px' }}>
            © 2025 VERSO — informação de carácter orientador, não substitui aconselhamento jurídico.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacidade', 'Termos', 'Contacto'].map(l => (
              <span key={l} style={{ ...mono, color: 'rgba(255,255,255,0.18)', fontSize: '10px', cursor: 'pointer', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C45D3E')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
