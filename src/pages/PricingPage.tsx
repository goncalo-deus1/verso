import { Link } from 'react-router-dom'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { useQuiz } from '../context/QuizContext'

const INK = '#1E1F18'
const BONE = '#F2EDE4'
const SAND = '#E8E0D0'
const CLAY = '#C2553A'
const STONE = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

type PlanKey = 'explorar' | 'dossier' | 'acompanhado'
type Cell = string | true | false

const plans: {
  key: PlanKey
  name: string
  price: string
  ideal: string
  cta: string
  featured?: boolean
}[] = [
  {
    key: 'explorar',
    name: 'Explorar',
    price: 'Grátis',
    ideal: 'Quem quer perceber por onde começar',
    cta: 'Começar grátis',
  },
  {
    key: 'dossier',
    name: 'Habitta +',
    price: '29€',
    ideal: 'Quem está ativamente à procura',
    cta: 'Desbloquear dossier',
    featured: true,
  },
  {
    key: 'acompanhado',
    name: 'Habitta Pro',
    price: '99€',
    ideal: 'Quem quer decidir com apoio personalizado',
    cta: 'Pedir acompanhamento',
  },
]

const features: { label: string; values: Record<PlanKey, Cell> }[] = [
  { label: 'Nº de diagnósticos / quizzes', values: { explorar: '1 diagnóstico gratuito', dossier: 'Até 5 simulações', acompanhado: 'Ilimitado durante 30 dias' } },
  { label: 'Top zonas recomendadas', values: { explorar: 'Top 3', dossier: 'Top 7', acompanhado: 'Top 7' } },
  { label: 'Score geral por zona', values: { explorar: true, dossier: true, acompanhado: true } },
  { label: 'Score por critério', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Resumo do perfil', values: { explorar: true, dossier: true, acompanhado: true } },
  { label: 'Razões principais por zona', values: { explorar: 'Básicas', dossier: 'Detalhadas', acompanhado: 'Detalhadas + comentário humano' } },
  { label: 'Preços medianos', values: { explorar: 'Básicos', dossier: 'Detalhados', acompanhado: 'Detalhados' } },
  { label: 'Preço por tipologia', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Rendas estimadas', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Comparação lado a lado entre zonas', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Trade-offs de cada zona', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Zonas a evitar para o perfil', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Alternativas menos óbvias', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Transportes e tempos de deslocação', values: { explorar: 'Básico', dossier: 'Detalhado', acompanhado: 'Detalhado' } },
  { label: 'Projetos urbanos / PDM / riscos futuros', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Checklist personalizada de procura', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Plano de próximos passos', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'PDF exportável', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Guardar resultado', values: { explorar: true, dossier: true, acompanhado: true } },
  { label: 'Histórico de simulações', values: { explorar: false, dossier: true, acompanhado: true } },
  { label: 'Revisão humana do resultado', values: { explorar: false, dossier: false, acompanhado: true } },
  { label: 'Sessão com a equipa Habitta', values: { explorar: false, dossier: false, acompanhado: '30-45 min' } },
  { label: 'Dúvidas por email', values: { explorar: false, dossier: false, acompanhado: '7 dias' } },
  { label: 'Acesso a guias públicos', values: { explorar: true, dossier: true, acompanhado: true } },
]

function CellValue({ value, dark = false }: { value: Cell; dark?: boolean }) {
  if (value === true) {
    return (
      <span
        aria-label="Incluído"
        className="inline-flex items-center justify-center"
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          background: dark ? 'rgba(242, 237, 228, 0.12)' : 'rgba(194, 85, 58, 0.1)',
          color: dark ? BONE : CLAY,
        }}
      >
        <Check size={14} strokeWidth={2.4} />
      </span>
    )
  }

  if (value === false) {
    return (
      <span
        aria-label="Não incluído"
        className="inline-flex items-center justify-center"
        style={{ color: dark ? 'rgba(242, 237, 228, 0.36)' : 'rgba(30, 31, 24, 0.28)' }}
      >
        <Minus size={16} />
      </span>
    )
  }

  return <span>{value}</span>
}

function PlanCard({ plan }: { plan: typeof plans[number] }) {
  const { open } = useQuiz()
  const isFeatured = plan.featured
  const isExplorar = plan.key === 'explorar'
  const isAcompanhado = plan.key === 'acompanhado'

  const cta = isExplorar ? (
    <button
      type="button"
      onClick={() => open('pricing')}
      style={{
        width: '100%',
        padding: '13px 18px',
        borderRadius: 999,
        border: 'none',
        background: isFeatured ? BONE : CLAY,
        color: isFeatured ? INK : BONE,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {plan.cta}
    </button>
  ) : (
    <Link
      to={isAcompanhado ? 'mailto:hello@usehabitta.com?subject=Habitta%20Pro' : '/entrar?redirect=/quiz/dossier&mode=register'}
      style={{
        width: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '13px 18px',
        borderRadius: 999,
        background: isFeatured ? CLAY : 'transparent',
        color: isFeatured ? BONE : INK,
        border: isFeatured ? `1px solid ${CLAY}` : `1px solid ${HAIRLINE}`,
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {plan.cta} <ArrowRight size={15} />
    </Link>
  )

  return (
    <article
      style={{
        background: isFeatured ? INK : BONE,
        color: isFeatured ? BONE : INK,
        border: `1px solid ${isFeatured ? INK : HAIRLINE}`,
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        minHeight: 360,
        position: 'relative',
      }}
    >
      {isFeatured && (
        <span
          style={{
            alignSelf: 'flex-start',
            background: CLAY,
            color: BONE,
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 9,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '6px 9px',
            borderRadius: 999,
          }}
        >
          Mais escolhido
        </span>
      )}
      <div>
        <h2 className="font-display" style={{ fontSize: 34, lineHeight: 1, fontWeight: 400, letterSpacing: '-0.025em' }}>
          {plan.name}
        </h2>
        <p
          className="font-display"
          style={{
            fontSize: 'clamp(42px, 5vw, 64px)',
            lineHeight: 1,
            fontWeight: 400,
            marginTop: 22,
            color: isFeatured ? BONE : CLAY,
          }}
        >
          {plan.price}
        </p>
        <p style={{ color: isFeatured ? 'rgba(242, 237, 228, 0.62)' : STONE, fontSize: 15, lineHeight: 1.65, marginTop: 18 }}>
          {plan.ideal}
        </p>
      </div>
      <div style={{ marginTop: 'auto' }}>{cta}</div>
    </article>
  )
}

export default function PricingPage() {
  return (
    <div style={{ minHeight: '100vh', background: BONE }}>
      <section className="habitta-px pt-32 pb-16 md:pt-40 md:pb-20" style={{ background: INK, color: BONE }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: CLAY,
              marginBottom: 28,
            }}
          >
            Preços
          </p>
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-16 items-end">
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(44px, 7vw, 86px)',
                lineHeight: 0.98,
                letterSpacing: '-0.035em',
                fontWeight: 400,
                maxWidth: 760,
              }}
            >
              Escolhe o nível certo antes de escolher casa.
            </h1>
            <p style={{ color: 'rgba(242, 237, 228, 0.58)', fontSize: 18, lineHeight: 1.7, maxWidth: 460 }}>
              Começa com uma recomendação gratuita. Avança para o dossier quando precisares de comparar, reduzir risco e decidir com mais confiança.
            </p>
          </div>
        </div>
      </section>

      <section className="habitta-px py-12 md:py-16" style={{ background: SAND }}>
        <div className="grid lg:grid-cols-3" style={{ maxWidth: 1180, margin: '0 auto', gap: 12 }}>
          {plans.map(plan => <PlanCard key={plan.key} plan={plan} />)}
        </div>
      </section>

      <section className="habitta-px py-14 md:py-20" style={{ background: BONE }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 24, flexWrap: 'wrap', marginBottom: 30 }}>
            <div>
              <p
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: CLAY,
                  marginBottom: 12,
                }}
              >
                Comparação
              </p>
              <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4.2vw, 52px)', lineHeight: 1.04, fontWeight: 400, letterSpacing: '-0.025em', color: INK }}>
                O que está incluído.
              </h2>
            </div>
            <Link
              to="/quiz"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: CLAY,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Fazer diagnóstico <ArrowRight size={15} />
            </Link>
          </div>

          <div className="hidden md:block" style={{ overflowX: 'auto', border: `1px solid ${HAIRLINE}`, background: '#F8F4EC' }}>
            <table style={{ width: '100%', minWidth: 900, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '34%', textAlign: 'left', padding: '22px 24px', color: STONE, fontSize: 12, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: `1px solid ${HAIRLINE}` }}>
                    Funcionalidade
                  </th>
                  {plans.map(plan => (
                    <th
                      key={plan.key}
                      style={{
                        textAlign: 'center',
                        padding: '22px 18px',
                        color: plan.featured ? CLAY : INK,
                        fontSize: 13,
                        fontWeight: 700,
                        borderBottom: `1px solid ${HAIRLINE}`,
                        borderLeft: `1px solid ${HAIRLINE}`,
                      }}
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '18px 24px', fontWeight: 700, borderBottom: `1px solid ${HAIRLINE}` }}>Preço</td>
                  {plans.map(plan => (
                    <td key={plan.key} style={{ textAlign: 'center', padding: '18px', fontSize: 24, fontFamily: 'var(--serif)', color: plan.featured ? CLAY : INK, borderLeft: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
                      {plan.price}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '18px 24px', fontWeight: 700, borderBottom: `1px solid ${HAIRLINE}` }}>Ideal para</td>
                  {plans.map(plan => (
                    <td key={plan.key} style={{ textAlign: 'center', padding: '18px', color: STONE, fontSize: 13, lineHeight: 1.5, borderLeft: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
                      {plan.ideal}
                    </td>
                  ))}
                </tr>
                {features.map(feature => (
                  <tr key={feature.label}>
                    <td style={{ padding: '16px 24px', color: INK, fontSize: 14, borderBottom: `1px solid ${HAIRLINE}` }}>
                      {feature.label}
                    </td>
                    {plans.map(plan => (
                      <td key={plan.key} style={{ textAlign: 'center', padding: '16px 18px', color: STONE, fontSize: 13, lineHeight: 1.45, borderLeft: `1px solid ${HAIRLINE}`, borderBottom: `1px solid ${HAIRLINE}` }}>
                        <CellValue value={feature.values[plan.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:hidden" style={{ gap: 12 }}>
            {plans.map(plan => (
              <section key={plan.key} style={{ background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, marginBottom: 18 }}>
                  <h3 className="font-display" style={{ fontSize: 28, fontWeight: 400, color: INK }}>{plan.name}</h3>
                  <strong style={{ color: CLAY, fontSize: 24 }}>{plan.price}</strong>
                </div>
                <p style={{ color: STONE, fontSize: 14, lineHeight: 1.55, marginBottom: 18 }}>{plan.ideal}</p>
                <div style={{ display: 'grid', gap: 0 }}>
                  {features.map(feature => (
                    <div key={feature.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'center', padding: '11px 0', borderTop: `1px solid ${HAIRLINE}` }}>
                      <span style={{ color: INK, fontSize: 13, lineHeight: 1.35 }}>{feature.label}</span>
                      <span style={{ color: STONE, fontSize: 12, textAlign: 'right', maxWidth: 150 }}>
                        <CellValue value={feature.values[plan.key]} />
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
