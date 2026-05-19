import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeInSection } from '../components/animations/FadeInSection'
import { useQuiz } from '../context/QuizContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const eyebrow: React.CSSProperties = {
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2.5px',
  color: CLAY,
}

export default function SobrePage() {
  const { open: openQuiz } = useQuiz()
  const { lang } = useLang()
  const tr = useT(lang)

  return (
    <div style={{ background: BONE, minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: INK }} className="habitta-px pt-32 pb-20 md:pt-40 md:pb-28">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ ...eyebrow, marginBottom: '32px' }}>{tr('sobre.eyebrow.about')}</p>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 400,
              color: BONE,
              lineHeight: 1.02,
              letterSpacing: '-2px',
              marginBottom: '32px',
            }}
          >
            {tr('sobre.hero.title')}
          </h1>
          <p style={{ fontSize: '19px', color: 'rgba(242,237,228,0.55)', lineHeight: 1.7, maxWidth: '560px' }}>
            {tr('sobre.hero.body')}
          </p>
        </div>
      </section>

      {/* ── O PROBLEMA ───────────────────────────────────────────────────────── */}
      <section className="habitta-px py-16 md:py-24" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '24px' }}>{tr('sobre.eyebrow.problem')}</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '32px' }}
            >
              {tr('sobre.problem.title')}
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div style={{ fontSize: '17px', color: STONE, lineHeight: 1.8 }}>
              <p style={{ marginBottom: '20px' }}>{tr('sobre.problem.p1')}</p>
              <p style={{ marginBottom: '20px' }}>{tr('sobre.problem.p2')}</p>
              <p style={{ marginBottom: '0' }}>{tr('sobre.problem.p3')}</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── O QUE FAZEMOS ────────────────────────────────────────────────────── */}
      <section className="habitta-px py-16 md:py-24" style={{ background: SAND }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '24px' }}>{tr('sobre.eyebrow.whatWeDo')}</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '40px' }}
            >
              {tr('sobre.whatWeDo.title')}
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { n: '01', title: tr('sobre.whatWeDo.c1.title'), body: tr('sobre.whatWeDo.c1.body') },
              { n: '02', title: tr('sobre.whatWeDo.c2.title'), body: tr('sobre.whatWeDo.c2.body') },
              { n: '03', title: tr('sobre.whatWeDo.c3.title'), body: tr('sobre.whatWeDo.c3.body') },
              { n: '04', title: tr('sobre.whatWeDo.c4.title'), body: tr('sobre.whatWeDo.c4.body') },
            ].map((item, i) => (
              <FadeInSection key={item.n} delay={i * 0.08}>
                <div style={{ background: BONE, borderRadius: '4px', padding: '28px', height: '100%', boxSizing: 'border-box' }}>
                  <p style={{ ...eyebrow, color: CLAY, marginBottom: '16px' }}>{item.n}</p>
                  <h3 className="font-display" style={{ fontSize: '20px', fontWeight: 400, color: INK, marginBottom: '10px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: STONE, lineHeight: 1.7, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── OS NOSSOS VALORES ────────────────────────────────────────────────── */}
      <section className="habitta-px py-16 md:py-24" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '24px' }}>{tr('sobre.eyebrow.values')}</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '48px' }}
            >
              {tr('sobre.values.title')}
            </h2>
          </FadeInSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { title: tr('sobre.values.v1.title'), body: tr('sobre.values.v1.body') },
              { title: tr('sobre.values.v2.title'), body: tr('sobre.values.v2.body') },
              { title: tr('sobre.values.v3.title'), body: tr('sobre.values.v3.body') },
            ].map((v, i) => (
              <FadeInSection key={v.title} delay={i * 0.08}>
                <div style={{
                  padding: '32px 0',
                  borderTop: `1px solid ${HAIRLINE}`,
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '32px',
                  alignItems: 'start',
                }}
                  className="grid-cols-1 sm:grid-cols-[1fr_2fr]"
                >
                  <h3 className="font-display" style={{ fontSize: '20px', fontWeight: 400, color: CLAY, lineHeight: 1.2 }}>
                    {v.title}
                  </h3>
                  <p style={{ fontSize: '16px', color: STONE, lineHeight: 1.75, margin: 0 }}>
                    {v.body}
                  </p>
                </div>
              </FadeInSection>
            ))}
            <div style={{ borderTop: `1px solid ${HAIRLINE}` }} />
          </div>
        </div>
      </section>

      {/* ── QUEM SOMOS ───────────────────────────────────────────────────────── */}
      <section className="habitta-px py-16 md:py-24" style={{ background: SAND }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '24px' }}>{tr('sobre.eyebrow.who')}</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '32px' }}
            >
              {tr('sobre.who.title')}
            </h2>
            <p style={{ fontSize: '17px', color: STONE, lineHeight: 1.8, marginBottom: '20px' }}>{tr('sobre.who.p1')}</p>
            <p style={{ fontSize: '17px', color: STONE, lineHeight: 1.8, marginBottom: '20px' }}>{tr('sobre.who.p2')}</p>
            <p style={{ fontSize: '17px', color: STONE, lineHeight: 1.8, marginBottom: '0' }}>{tr('sobre.who.p3')}</p>
          </FadeInSection>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{ background: INK }} className="habitta-px py-20 md:py-28">
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '24px' }}>{tr('sobre.eyebrow.cta')}</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: BONE, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '20px' }}
            >
              {tr('sobre.cta.title')}
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(242,237,228,0.45)', lineHeight: 1.7, marginBottom: '40px' }}>
              {tr('sobre.cta.body')}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => openQuiz()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '15px 32px', background: CLAY, color: 'white',
                  fontSize: '15px', fontWeight: 600, border: 'none',
                  cursor: 'pointer', borderRadius: '4px', transition: 'opacity 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {tr('sobre.cta.takeQuiz')} <ArrowRight size={15} />
              </button>
              <Link
                to="/editorial"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '15px 28px', background: 'transparent', color: 'rgba(242,237,228,0.55)',
                  fontSize: '15px', fontWeight: 500, textDecoration: 'none',
                  border: '1px solid rgba(242,237,228,0.15)', borderRadius: '4px', transition: 'all 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = BONE; e.currentTarget.style.borderColor = 'rgba(242,237,228,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(242,237,228,0.55)'; e.currentTarget.style.borderColor = 'rgba(242,237,228,0.15)' }}
              >
                {tr('sobre.cta.readGuides')}
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

    </div>
  )
}
