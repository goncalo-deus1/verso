/**
 * CtaFinal.tsx — § 05  O que fazer agora
 *
 * Secção escura final com CTAs + "Refazer o quiz" para utilizadores autenticados.
 */

import { useNavigate } from 'react-router-dom'
import SaveZoneButton from '../SaveZoneButton'

type Props = {
  nome:        string
  slug:        string
  zoneKind:    'freguesia' | 'concelho'
  onRestart:   () => void
  showRefazer?: boolean   // only true for authenticated, non-gated users
}

export function CtaFinal({ nome, slug, zoneKind, showRefazer = false }: Props) {
  const navigate = useNavigate()

  return (
    <section className="bg-verso-midnight text-verso-paper py-20 md:py-28 px-6 sm:px-10 md:px-16">
      <div className="max-w-4xl mx-auto text-center">

        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-verso-clay mb-8">
          § 05 — O que fazer agora
        </p>

        <h2 className="font-display font-normal text-4xl sm:text-5xl md:text-[56px] leading-[1.05] tracking-[-0.025em] mb-8">
          Uma zona é apenas{' '}
          <em className="italic text-verso-clay">onde se começa</em>.
        </h2>

        <p className="text-lg md:text-xl text-verso-paper/70 max-w-[52ch] mx-auto mb-14 leading-[1.55]">
          Agora que sabes onde — podes guardar, partilhar com quem decide contigo, ou ler o guia completo desta zona. Cada passo fica disponível.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4">
          {/* Primary — ver imóveis na zona */}
          {/* TODO: route /zona/[slug]/imoveis needs to be built */}
          <a
            href={`/zona/${slug}/imoveis`}
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
            Ver imóveis nesta zona
          </a>

          {/* Secondary — guardar análise */}
          <SaveZoneButton zoneSlug={slug} zoneKind={zoneKind} zoneName={nome} label="Guardar" darkBg />

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
              Refazer o quiz
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
