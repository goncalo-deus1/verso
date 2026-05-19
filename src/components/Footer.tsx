import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useQuiz } from '../context/QuizContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { Wordmark } from './Wordmark'

export default function Footer() {
  const { open: openQuiz } = useQuiz()
  const { lang } = useLang()
  const tr = useT(lang)

  return (
    <footer className="bg-[#080809] text-[#F2EDE4]" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Top strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-5 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
          <p className="text-[10px] sm:text-[11px] tracking-widest uppercase flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-[#6B7A5A] inline-block" style={{ boxShadow: '0 0 8px rgba(107,123,94,0.7)' }} />
            {tr('footer.availability')}
          </p>
          <button
            onClick={() => openQuiz()}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C2553A', padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
            onMouseLeave={e => (e.currentTarget.style.color = '#C2553A')}
          >
            {tr('footer.startQuiz')} <ArrowRight size={13} />
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
              {tr('footer.brandTagline')}
            </p>
          </div>

          {/* Explorar */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono' }}>
              {tr('footer.col.explore')}
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
                  {tr('footer.link.quiz')}
                </button>
              </li>
              <li>
                <Link to="/areas" className="transition-colors" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  {tr('footer.link.areas')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="transition-colors" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  {tr('footer.link.blog')}
                </Link>
              </li>
              <li>
                <Link to="/proprietario" className="transition-colors" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  {tr('footer.link.owner')}
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="transition-colors" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#F2EDE4')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                  {tr('footer.link.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono' }}>
              {tr('footer.col.resources')}
            </p>
            <ul className="flex flex-col gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {[
                tr('footer.res.buyerGuide'),
                tr('footer.res.purchaseCosts'),
                tr('footer.res.financing'),
                tr('footer.res.cpcv'),
                tr('footer.res.imtImi'),
              ].map(l => (
                <li key={l}><span style={{ cursor: 'default' }}>{l}</span></li>
              ))}
            </ul>
          </div>

          {/* Fontes Oficiais */}
          <div>
            <p className="text-[10px] tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'IBM Plex Mono' }}>
              {tr('footer.col.sources')}
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
            © {new Date().getFullYear()} Habitta — {tr('footer.disclaimer')}
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="https://www.instagram.com/usehabittapt/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tr('footer.followInstagram')}
              style={{ color: 'rgba(255,255,255,0.18)', transition: 'color 150ms', display: 'flex' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <div className="flex gap-4 sm:gap-6 text-[10px] sm:text-[11px]" style={{ fontFamily: 'IBM Plex Mono' }}>
              {[tr('footer.privacy'), tr('footer.terms'), tr('footer.contact')].map(l => (
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
      </div>
    </footer>
  )
}
