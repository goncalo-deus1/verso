/**
 * CtaFinal.tsx — § 05  O que fazer agora
 *
 * Secção escura final com CTAs + "Refazer o quiz" para utilizadores autenticados.
 */

import { useNavigate, Link } from 'react-router-dom'
import SaveZoneButton from '../SaveZoneButton'
import { useLang } from '../../context/LanguageContext'
import { useT } from '../../i18n/translations'

type Props = {
  nome:        string
  slug:        string
  zoneKind:    'freguesia' | 'concelho'
  onRestart:   () => void
  showRefazer?: boolean   // only true for authenticated, non-gated users
}

export function CtaFinal({ nome, slug, zoneKind, showRefazer = false }: Props) {
  const navigate = useNavigate()
  const { lang } = useLang()
  const tr = useT(lang)

  return (
    <section className="bg-verso-midnight text-verso-paper py-20 md:py-28 px-6 sm:px-10 md:px-16">
      <div className="max-w-4xl mx-auto text-center">

        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-verso-clay mb-8">
          {tr('result.cta.eyebrow')}
        </p>

        <h2 className="font-display font-normal text-4xl sm:text-5xl md:text-[56px] leading-[1.05] tracking-[-0.025em] mb-8">
          {tr('result.cta.title.before')}
          <em className="italic text-verso-clay">{tr('result.cta.title.emphasis')}</em>
          {tr('result.cta.title.after')}
        </h2>

        <p className="text-lg md:text-xl text-verso-paper/70 max-w-[52ch] mx-auto mb-14 leading-[1.55]">
          {tr('result.cta.body')}
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
          {/* Primary — ver imóveis na zona */}
          <Link
            to="/em-breve"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '9px 22px', fontSize: '13px', fontWeight: 500,
              background: '#B24A30', color: '#F2EDE4',
              border: '1px solid #B24A30', borderRadius: '50px',
              textDecoration: 'none', transition: 'all 150ms',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#9A3D27'; el.style.borderColor = '#9A3D27' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = '#B24A30'; el.style.borderColor = '#B24A30' }}
          >
            {tr('result.cta.viewProps')}
          </Link>

          {/* Secondary — guardar análise */}
          <SaveZoneButton zoneSlug={slug} zoneKind={zoneKind} zoneName={nome} label={tr('result.cta.save')} darkBg />

          {/* Refazer — only for authenticated users */}
          {showRefazer && (
            <button
              onClick={() => navigate('/quiz?refazer=true')}
              style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '9px 22px', fontSize: '13px', fontWeight: 500,
                background: 'transparent', color: 'rgba(242,237,228,0.55)',
                border: '1px solid rgba(242,237,228,0.2)', borderRadius: '50px',
                cursor: 'pointer', transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F2EDE4'; e.currentTarget.style.borderColor = 'rgba(242,237,228,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(242,237,228,0.55)'; e.currentTarget.style.borderColor = 'rgba(242,237,228,0.2)' }}
            >
              {tr('result.cta.restart')}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
