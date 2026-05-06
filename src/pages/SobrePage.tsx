import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeInSection } from '../components/animations/FadeInSection'
import { useQuiz } from '../context/QuizContext'

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

  return (
    <div style={{ background: BONE, minHeight: '100vh' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section style={{ background: INK }} className="habitta-px pt-32 pb-20 md:pt-40 md:pb-28">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ ...eyebrow, marginBottom: '32px' }}>Sobre a habitta</p>
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
            Construída por quem percebeu que o mercado imobiliário favorece quem já sabe — e quis mudar isso.
          </h1>
          <p style={{ fontSize: '19px', color: 'rgba(242,237,228,0.55)', lineHeight: 1.7, maxWidth: '560px' }}>
            A habitta não vende imóveis. Não tem agentes. Não tem comissões. Tem dados, contexto e uma pergunta simples: onde faz sentido viveres?
          </p>
        </div>
      </section>

      {/* ── O PROBLEMA ───────────────────────────────────────────────────────── */}
      <section className="habitta-px py-16 md:py-24" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '24px' }}>O problema</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '32px' }}
            >
              Toda a gente fala em imóveis. Quase ninguém fala em zonas.
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <div style={{ fontSize: '17px', color: STONE, lineHeight: 1.8 }}>
              <p style={{ marginBottom: '20px' }}>
                Quando alguém decide comprar ou arrendar casa em Portugal, o processo começa quase sempre da mesma forma: portais de anúncios, visitas apressadas e uma decisão de centenas de milhares de euros tomada com base em fotografias de imóveis.
              </p>
              <p style={{ marginBottom: '20px' }}>
                O problema não é a falta de informação. É o excesso de informação errada na ordem errada. As pessoas olham para os imóveis antes de perceberem onde querem viver — e descobrem tarde demais que escolheram uma zona que não se encaixa na sua vida.
              </p>
              <p style={{ marginBottom: '0' }}>
                O Plano Diretor Municipal de cada concelho existe. As estatísticas de transporte, densidade e crescimento populacional existem. Simplesmente não estavam organizadas para quem compra.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ── O QUE FAZEMOS ────────────────────────────────────────────────────── */}
      <section className="habitta-px py-16 md:py-24" style={{ background: SAND }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '24px' }}>O que fazemos</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '40px' }}
            >
              Cruzamos o teu perfil com dados que normalmente estão escondidos em PDFs municipais.
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                n: '01',
                title: 'Quiz de zona',
                body: 'Sete perguntas sobre orçamento, estilo de vida, transporte e prioridades. Em 90 segundos, recomendamos as zonas da AML que fazem sentido para o teu perfil.',
              },
              {
                n: '02',
                title: 'Perfis editoriais de concelho',
                body: 'Cada um dos 18 concelhos da Área Metropolitana de Lisboa tem um guia completo: rendas reais, projetos urbanos, PDM, transporte e o retrato honesto de quem lá vive bem.',
              },
              {
                n: '03',
                title: 'Dados de planeamento urbano',
                body: 'Integrámos zonamento do PDM, histórico de projetos urbanísticos e previsões de crescimento — informação que antes exigia horas de pesquisa em portais municipais.',
              },
              {
                n: '04',
                title: 'Sem pressão de vendas',
                body: 'Não temos imóveis para vender. Não temos objetivos de comissão. O nosso interesse é que tomes uma decisão informada — mesmo que isso signifique esperar mais um ano.',
              },
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
            <p style={{ ...eyebrow, marginBottom: '24px' }}>Como trabalhamos</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '48px' }}
            >
              Três princípios que guiam tudo o que publicamos.
            </h2>
          </FadeInSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              {
                title: 'Honestidade antes de tudo',
                body: 'Não escrevemos sobre uma zona sem incluir os seus problemas reais. Se o trânsito é mau, dizemos. Se a oferta escolar é fraca, dizemos. Uma decisão informada exige os dois lados.',
              },
              {
                title: 'Dados com contexto',
                body: 'Um número sem contexto é ruído. Publicamos preços, densidades e projeções sempre com a fonte, a data e a explicação do que significa — não apenas o valor.',
              },
              {
                title: 'Independência total',
                body: 'Não somos pagos por promotores imobiliários, construtoras ou agências. Não temos relações comerciais com os concelhos que analisamos. A nossa única responsabilidade é para com quem nos lê.',
              },
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
            <p style={{ ...eyebrow, marginBottom: '24px' }}>Quem somos</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '32px' }}
            >
              Uma equipa pequena obcecada com uma decisão grande.
            </h2>
            <p style={{ fontSize: '17px', color: STONE, lineHeight: 1.8, marginBottom: '20px' }}>
              A habitta nasceu em Lisboa, de uma frustração que muitos reconhecem: o mercado imobiliário é opaco, pressiona as decisões e favorece quem já tem experiência — ou um contacto certo.
            </p>
            <p style={{ fontSize: '17px', color: STONE, lineHeight: 1.8, marginBottom: '20px' }}>
              Somos uma equipa de produto, dados e editorial que acredita que comprar ou arrendar casa em Portugal deve ser uma decisão informada, não uma lotaria. Cruzamos urbanismo, dados demográficos e jornalismo de dados para dar às pessoas o contexto que os portais de anúncios nunca vão dar.
            </p>
            <p style={{ fontSize: '17px', color: STONE, lineHeight: 1.8, marginBottom: '0' }}>
              Estamos sediados em Lisboa e focados exclusivamente na Área Metropolitana de Lisboa — por enquanto.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{ background: INK }} className="habitta-px py-20 md:py-28">
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <FadeInSection>
            <p style={{ ...eyebrow, marginBottom: '24px' }}>Pronto para começar?</p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, color: BONE, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '20px' }}
            >
              Descobre a zona certa antes de veres o primeiro imóvel.
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(242,237,228,0.45)', lineHeight: 1.7, marginBottom: '40px' }}>
              90 segundos. Sem registo. Sem compromisso.
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
                Fazer o quiz <ArrowRight size={15} />
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
                Ler os guias
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

    </div>
  )
}
