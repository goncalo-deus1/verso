import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { concelhosAML } from '../data/concelhosAML'
import { editorials } from '../data/editorial'
import { useQuiz } from '../context/QuizContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { FadeInSection } from '../components/animations/FadeInSection'
import { CountUp } from '../components/animations/CountUp'
import { HeroEnsaio } from '../components/hero/HeroEnsaio'

// ─── Brand tokens ────────────────────────────────────────────────────────────

const eyebrow: React.CSSProperties = {
  fontFamily: 'Inter, Arial, sans-serif',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2.5px',
  color: '#C2553A',
}

// ─── Stats honestos ───────────────────────────────────────────────────────────

// STATS are now computed in the component to support translations
type Stat = { figure: number; suffix: string; labelKey: 'home.stats.s1.label'|'home.stats.s2.label'|'home.stats.s3.label'|'home.stats.s4.label'; subKey: 'home.stats.s1.sub'|'home.stats.s2.sub'|'home.stats.s3.sub'|'home.stats.s4.sub'; animate: boolean }
const STATS_CONFIG: Stat[] = [
  { figure: 18, suffix: '',    labelKey: 'home.stats.s1.label', subKey: 'home.stats.s1.sub', animate: true  },
  { figure: 24, suffix: '',    labelKey: 'home.stats.s2.label', subKey: 'home.stats.s2.sub', animate: true  },
  { figure: 3,  suffix: 'min', labelKey: 'home.stats.s3.label', subKey: 'home.stats.s3.sub', animate: false },
  { figure: 0,  suffix: '',    labelKey: 'home.stats.s4.label', subKey: 'home.stats.s4.sub', animate: false },
]

// ─── Componente de card de concelho (placeholder editorial) ───────────────────

function ConcelhoCard({ c, index, northLabel, southLabel, viewLabel }: { c: typeof concelhosAML[0]; index: number; northLabel: string; southLabel: string; viewLabel: string }) {
  return (
    <FadeInSection delay={index * 0.06}>
      <Link
        to={`/concelho/${c.slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          className="aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden"
          style={{
            position: 'relative',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
          onMouseEnter={e => {
            const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
            if (img) img.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={e => {
            const img = e.currentTarget.querySelector('img') as HTMLImageElement | null
            if (img) img.style.transform = 'scale(1)'
          }}
        >
          {/* Foto */}
          <img
            src={c.image.replace('w=800', 'w=480')}
            alt={c.name}
            loading={index < 4 ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              transition: 'transform 600ms cubic-bezier(0.22,1,0.36,1)',
            }}
          />
          {/* Gradiente escuro */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(30, 31, 24,0.88) 0%, rgba(30, 31, 24,0.25) 55%, rgba(30, 31, 24,0.1) 100%)',
          }} />
          {/* Texto */}
          <div className="p-3 sm:p-5" style={{
            position: 'relative', zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            boxSizing: 'border-box',
          }}>
            <p style={{
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2.5px',
              color: '#C2553A',
              marginBottom: '6px',
            }}>
              {c.margem === 'norte' ? northLabel : southLabel}
            </p>
            <h3 className="font-display text-base sm:text-xl" style={{
              color: '#F2EDE4',
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              fontWeight: 400,
              marginBottom: '4px',
            }}>
              {c.name}
            </h3>
            {c.budgetFitT2 && (
              <p className="text-[11px] sm:text-xs" style={{ color: 'rgba(242, 237, 228,0.6)', lineHeight: 1.4, marginBottom: '4px' }}>
                T2 a partir de {c.budgetFitT2.min.toLocaleString('pt-PT')}€/mês
              </p>
            )}
            {c.transport && (
              <p className="text-[11px] sm:text-xs" style={{ color: 'rgba(242, 237, 228,0.45)', lineHeight: 1.4, marginBottom: '8px' }}>
                {c.transport}
              </p>
            )}
            <div className="hidden sm:flex items-center" style={{ gap: '6px' }}>
              <span style={{ fontSize: '12px', color: '#C2553A', fontWeight: 500 }}>{viewLabel}</span>
              <ArrowRight size={11} style={{ color: '#C2553A' }} />
            </div>
          </div>
        </div>
      </Link>
    </FadeInSection>
  )
}

// ─── Componente de card editorial (sem imagem) ────────────────────────────────

function EditorialCardSmall({ article }: { article: typeof editorials[0] }) {
  return (
    <Link
      to={`/editorial/${article.slug}`}
      style={{ textDecoration: 'none', display: 'flex', flex: 1 }}
    >
      <div style={{
        background: '#E8E0D0',
        border: '1px solid rgba(30, 31, 24, 0.125)',
        borderLeft: '4px solid #C2553A',
        borderRadius: '2px',
        padding: '20px 24px',
        flex: 1,
        cursor: 'pointer',
        transition: 'border-color 400ms cubic-bezier(0.22,1,0.36,1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.borderColor = '#1E1F18'
          el.style.borderLeftColor = '#1E1F18'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(30, 31, 24, 0.125)'
          el.style.borderLeftColor = '#C2553A'
        }}
      >
        <span style={{ ...eyebrow, fontSize: '9px', display: 'block' }}>{article.category}</span>
        <h3 className="font-display" style={{
          color: '#1E1F18',
          fontSize: '16px',
          letterSpacing: '-0.2px',
          lineHeight: 1.35,
          fontWeight: 400,
        }}>
          {article.title}
        </h3>
        <p style={{ color: '#3A3B2E', fontSize: '13px', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {article.readTime} min <span style={{ color: 'rgba(30, 31, 24, 0.125)' }}>·</span> {article.date}
        </p>
      </div>
    </Link>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { open: openQuiz } = useQuiz()
  const { lang } = useLang()
  const tr = useT(lang)
  return (
    <div>

      <HeroEnsaio />

      {/* ━━━ 01 — COMO FUNCIONA ━━━ */}
      <section style={{ background: '#F2EDE4', borderTop: '1px solid rgba(30, 31, 24, 0.125)' }} className="habitta-px py-14 md:py-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '16px' }}>{tr('home.s01.eyebrow')}</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#1E1F18', marginBottom: '16px', maxWidth: '640px', fontWeight: 400 }}>
              {tr('home.s01.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
            <p style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#3A3B2E', maxWidth: '520px', lineHeight: '1.7', marginBottom: '64px' }}>
              {tr('home.s01.body')}
            </p>
          </FadeInSection>

          <div className="flex flex-col lg:flex-row items-stretch">
            {[
              { n: '01', title: tr('home.s01.step1.title'), body: tr('home.s01.step1.body') },
              { n: '02', title: tr('home.s01.step2.title'), body: tr('home.s01.step2.body') },
              { n: '03', title: tr('home.s01.step3.title'), body: tr('home.s01.step3.body') },
            ].map((card, i) => (
              <FadeInSection key={card.n} delay={i * 0.1} className="flex flex-col lg:flex-row items-stretch flex-1">
                <div className="verso-card verso-step-card flex-1" style={{ padding: '36px' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '28px', fontWeight: 400, color: '#C2553A', display: 'block', marginBottom: '20px' }}>{card.n}</span>
                  <h3 className="font-display" style={{ fontSize: '22px', marginBottom: '12px', color: '#1E1F18', fontWeight: 400 }}>{card.title}</h3>
                  <p style={{ color: '#3A3B2E', lineHeight: '1.7', fontSize: 'clamp(14px, 2vw, 15px)' }}>{card.body}</p>
                </div>
                {i < 2 && (
                  <div className="hidden lg:flex items-center justify-center" style={{ padding: '16px 20px' }}>
                    <ArrowRight size={18} style={{ color: 'rgba(30, 31, 24, 0.125)' }} />
                  </div>
                )}
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 02 — ZONAS (placeholder editorial) ━━━ */}
      <section style={{ paddingBottom: '80px', background: '#F2EDE4' }} className="habitta-px">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ ...eyebrow, marginBottom: '12px' }}>{tr('home.s02.eyebrow')}</p>
                <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#1E1F18', fontWeight: 400 }}>
                  {tr('home.s02.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
                </h2>
              </div>
              <button
                onClick={openQuiz}
                className="hidden md:flex"
                style={{ alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#3A3B2E', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
                {tr('home.s02.findZone')} <ArrowRight size={14} />
              </button>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {concelhosAML.map((c, i) => (
              <ConcelhoCard key={c.slug} c={c} index={i} northLabel={tr('home.s02.north')} southLabel={tr('home.s02.south')} viewLabel={tr('home.s02.viewArea')} />
            ))}
          </div>

          {/* Mobile CTA — hidden on md+ (desktop button is in the section header) */}
          <div className="flex md:hidden mt-6">
            <button
              onClick={openQuiz}
              className="flex w-full items-center justify-center"
              style={{ gap: '8px', padding: '14px 20px', background: '#1E1F18', color: 'white', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: '50px' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#C2553A')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1E1F18')}
            >
              {tr('home.s02.findZone')} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ 03 — MÉTRICAS (fundo Ink) ━━━ */}
      <section style={{ background: '#1E1F18' }} className="habitta-px py-12 md:py-16">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS_CONFIG.map((m, i) => (
              <FadeInSection key={m.labelKey} delay={i * 0.08}>
                <div className="p-6 lg:p-10" style={{
                  borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <p className="font-display flex items-baseline gap-2.5" style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-2px', color: '#F2EDE4', lineHeight: 1, fontWeight: 400 }}>
                    <span>
                      {m.animate
                        ? <CountUp to={m.figure} suffix={m.suffix} />
                        : <>{m.figure}{m.suffix}</>
                      }
                    </span>
                    <span style={{ fontSize: '0.45em', color: '#C2553A' }}>{tr(m.labelKey)}</span>
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.6', marginTop: '12px' }}>{tr(m.subKey)}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 03 — PORQUÊ A Habitta ━━━ */}
      <section style={{ background: '#F2EDE4', borderTop: '1px solid rgba(30, 31, 24, 0.125)' }} className="habitta-px py-14 md:py-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '16px' }}>{tr('home.s03.eyebrow')}</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#1E1F18', marginBottom: '16px', maxWidth: '680px', fontWeight: 400 }}>
              {tr('home.s03.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
            <p style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#3A3B2E', maxWidth: '520px', lineHeight: '1.7', marginBottom: '64px' }}>
              {tr('home.s03.body')}
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '8px', marginBottom: '64px' }}>
            {[
              { n: '01', title: tr('home.s03.f1.title'), body: tr('home.s03.f1.body') },
              { n: '02', title: tr('home.s03.f2.title'), body: tr('home.s03.f2.body') },
              { n: '03', title: tr('home.s03.f3.title'), body: tr('home.s03.f3.body') },
              { n: '04', title: tr('home.s03.f4.title'), body: tr('home.s03.f4.body') },
            ].map((item, i) => (
              <FadeInSection key={item.n} delay={i * 0.08}>
                <div className="sand-card" style={{ padding: '36px' }}>
                  <span style={{ ...eyebrow, display: 'block', marginBottom: '16px' }}>{item.n}</span>
                  <h3 className="font-display" style={{ fontSize: '22px', color: '#1E1F18', marginBottom: '12px', fontWeight: 400 }}>{item.title}</h3>
                  <p style={{ fontSize: 'clamp(14px, 2vw, 15px)', color: '#3A3B2E', lineHeight: '1.7' }}>{item.body}</p>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection>
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '64px', maxWidth: '880px', margin: '0 auto' }}>
              <div>
                <p style={{ ...eyebrow, color: '#6B7A5A', marginBottom: '20px' }}>{tr('home.s03.doTitle')}</p>
                <ul style={{ listStyle: 'none' }}>
                  {[tr('home.s03.do1'), tr('home.s03.do2'), tr('home.s03.do3'), tr('home.s03.do4'), tr('home.s03.do5')].map(item => (
                    <li key={item} style={{ padding: '10px 0 10px 24px', position: 'relative', color: '#3A3B2E', fontSize: '15px', borderBottom: '1px solid rgba(30, 31, 24, 0.125)' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#6B7A5A', fontWeight: 700 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p style={{ ...eyebrow, marginBottom: '20px' }}>{tr('home.s03.dontTitle')}</p>
                <ul style={{ listStyle: 'none' }}>
                  {[tr('home.s03.dont1'), tr('home.s03.dont2'), tr('home.s03.dont3'), tr('home.s03.dont4'), tr('home.s03.dont5')].map(item => (
                    <li key={item} style={{ padding: '10px 0 10px 24px', position: 'relative', color: '#3A3B2E', fontSize: '15px', borderBottom: '1px solid rgba(30, 31, 24, 0.125)' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#C2553A', fontWeight: 700 }}>✕</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ━━━ 04 — EDITORIAL (sem imagens stock) ━━━ */}
      <section style={{ background: '#F2EDE4', borderTop: '1px solid rgba(30, 31, 24, 0.125)' }} className="habitta-px py-14 md:py-20">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <FadeInSection>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ ...eyebrow, marginBottom: '12px' }}>{tr('home.s04.eyebrow')}</p>
                <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: '1.1', color: '#1E1F18', fontWeight: 400 }}>
                  {tr('home.s04.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
                </h2>
              </div>
              <Link
                to="/editorial"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#3A3B2E', textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C2553A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#3A3B2E')}>
                {tr('home.s04.viewAll')} <ArrowRight size={14} />
              </Link>
            </div>
          </FadeInSection>

          {/* TODO: substituir por imagens reais quando houver sessão fotográfica */}
          <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: '8px' }}>
            {editorials[0] && (
              <FadeInSection className="lg:col-span-7">
                <Link
                  to={`/editorial/${editorials[0].slug}`}
                  style={{ textDecoration: 'none', display: 'block', borderRadius: '2px', overflow: 'hidden', minHeight: '400px' }}
                >
                  <div style={{
                    background: '#1E1F18',
                    minHeight: '400px',
                    padding: '48px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                    transition: 'opacity 200ms',
                    borderLeft: '4px solid #C2553A',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <span style={{ display: 'inline-block', padding: '4px 10px', background: '#C2553A', color: 'white', ...eyebrow, fontSize: '9px', marginBottom: '20px', alignSelf: 'flex-start' }}>
                      {editorials[0].category}
                    </span>
                    <h3 className="font-display" style={{ color: '#F2EDE4', fontSize: '28px', letterSpacing: '-0.5px', lineHeight: '1.2', marginBottom: '14px', fontWeight: 400 }}>
                      {editorials[0].title}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
                      {editorials[0].excerpt}
                    </p>
                    <span style={{ fontSize: '12px', color: '#C2553A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {tr('home.s04.readArt')} <ArrowRight size={11} />
                    </span>
                  </div>
                </Link>
              </FadeInSection>
            )}

            <div className="lg:col-span-5 flex flex-col" style={{ gap: '8px' }}>
              {editorials.slice(1, 4).map((article, i) => (
                <FadeInSection key={article.id} delay={i * 0.08}>
                  <EditorialCardSmall article={article} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ CTA FINAL (fundo Ink) ━━━ */}
      <section
        data-hide-copilot
        id="closing-cta"
        style={{ background: '#1E1F18' }}
        className="py-16 sm:py-20 md:py-28 px-6 lg:px-20"
      >
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <FadeInSection>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-2px', lineHeight: '1.05', color: '#F2EDE4', marginBottom: '20px', fontWeight: 400 }}>
              {tr('home.cta2.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
            </h2>
            <p style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: 'rgba(255,255,255,0.45)', lineHeight: '1.7', marginBottom: '48px' }}>
              {tr('home.cta2.body')}
            </p>
            <button
              onClick={openQuiz}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '17px 36px', background: '#C2553A', color: 'white', fontSize: '15px', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: '8px', transition: 'opacity 150ms' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              {tr('home.cta2.btn')} <ArrowRight size={16} />
            </button>
          </FadeInSection>
        </div>
      </section>


    </div>
  )
}
