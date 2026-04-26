import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useQuiz } from '../context/QuizContext'
import { Wordmark } from './Wordmark'

export default function Footer() {
  const { open: openQuiz } = useQuiz()

  return (
    <footer className="bg-[#080809] text-[#F2EDE4]" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Top strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-5 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
          <p className="text-[10px] sm:text-[11px] tracking-widest uppercase flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-[#6B7A5A] inline-block" style={{ boxShadow: '0 0 8px rgba(107,123,94,0.7)' }} />
            Plataforma disponível — Lisboa e AML
          </p>
          <button
            onClick={() => openQuiz()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C2553A', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#C2553A')}
          >
            Começar o quiz <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Colunas principais */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-2xl mb-3"><Wordmark /></p>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Encontra a zona certa antes do imóvel certo. Uma plataforma editorial para decisões informadas em Portugal.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono' }}>
              Explorar
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <button
                  onClick={() => openQuiz()}
                  className="text-sm transition-colors"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  Quiz de comprador
                </button>
              </li>
              <li>
                <Link to="/areas" className="transition-colors" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  Zonas
                </Link>
              </li>
              <li>
                <Link to="/editorial" className="transition-colors" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  Guias editoriais
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono' }}>
              Recursos
            </p>
            <ul className="flex flex-col gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {['Guia do comprador', 'Custos de compra', 'Financiamento', 'CPCV explicado', 'IMT & IMI'].map(l => (
                <li key={l}><span style={{ cursor: 'default' }}>{l}</span></li>
              ))}
            </ul>
          </div>

          {/* Fontes Oficiais */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono' }}>
              Fontes oficiais
            </p>
            <ul className="flex flex-col gap-3 text-sm">
              {[
                { label: 'SNIT / DGT',       href: 'https://snit.dgterritorio.gov.pt' },
                { label: 'Portal do Cidadão', href: 'https://www.portaldocidadao.pt' },
                { label: 'IRN — Escrituras',  href: 'https://www.irn.mj.pt' },
                { label: 'INE — Estatísticas',href: 'https://www.ine.pt' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                    {l.label} <span className="text-[10px]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-6 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center sm:justify-between">
          <p className="text-[10px] sm:text-[11px] leading-relaxed max-w-2xl" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'IBM Plex Mono' }}>
            © {new Date().getFullYear()} Habitta — Informação de carácter orientador, não substitui aconselhamento jurídico.
          </p>
          <div className="flex gap-4 sm:gap-6 text-[10px] sm:text-[11px]" style={{ fontFamily: 'IBM Plex Mono' }}>
            {['Privacidade', 'Termos', 'Contacto'].map(l => (
              <span key={l} className="cursor-pointer transition-colors"
                style={{ color: 'rgba(255,255,255,0.18)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
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
