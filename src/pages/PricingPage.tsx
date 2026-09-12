import { useState } from 'react'
import { ArrowRight, Check, Minus, X } from 'lucide-react'
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
    cta: 'Descobrir vantagens',
    featured: true,
  },
  {
    key: 'acompanhado',
    name: 'Habitta Pro',
    price: '99€',
    ideal: 'Quem quer decidir com apoio personalizado',
    cta: 'Descobrir vantagens',
  },
]

const dossierBenefits = [
  'Até 5 simulações para testar zonas e cenários diferentes.',
  'Top 7 zonas recomendadas com score geral e score por critério.',
  'Comparação lado a lado entre zonas, preços, rendas e trade-offs.',
  'Leitura de riscos futuros, projetos urbanos e zonas a evitar.',
  'Checklist personalizada, próximos passos e PDF exportável.',
]

const proBenefits = [
  'Simulações ilimitadas durante 30 dias.',
  'Tudo o que está incluído no Habitta +.',
  'Comentário humano sobre os resultados e principais trade-offs.',
  'Sessão com a equipa Habitta para discutir zonas, orçamento e próximos passos.',
  '7 dias de apoio por email para dúvidas depois da sessão.',
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

function PlanCard({ plan, onDiscover }: { plan: typeof plans[number]; onDiscover: () => void }) {
  const { open } = useQuiz()
  const isFeatured = plan.featured
  const isExplorar = plan.key === 'explorar'

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
    plan.key === 'dossier' || plan.key === 'acompanhado' ? (
      <button
        type="button"
        onClick={onDiscover}
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
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {plan.cta} <ArrowRight size={15} />
      </button>
    ) : null
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
  const [activeBenefitsPlan, setActiveBenefitsPlan] = useState<'dossier' | 'acompanhado' | null>(null)
  const activePlan = activeBenefitsPlan === 'acompanhado'
    ? { title: 'Habitta Pro', benefits: proBenefits }
    : { title: 'Habitta +', benefits: dossierBenefits }

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
            Planos
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
          {plans.map(plan => (
            <PlanCard
              key={plan.key}
              plan={plan}
              onDiscover={() => {
                if (plan.key === 'dossier' || plan.key === 'acompanhado') setActiveBenefitsPlan(plan.key)
              }}
            />
          ))}
        </div>
      </section>

      {activeBenefitsPlan && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dossier-benefits-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: 'rgba(30, 31, 24, 0.58)',
          }}
          onClick={() => setActiveBenefitsPlan(null)}
        >
          <div
            style={{
              width: 'min(100%, 560px)',
              background: BONE,
              color: INK,
              border: `1px solid ${HAIRLINE}`,
              boxShadow: '0 28px 90px rgba(30, 31, 24, 0.32)',
              padding: '26px',
            }}
            onClick={event => event.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
              <div>
                <p
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    borderRadius: 999,
                    background: 'rgba(194, 85, 58, 0.1)',
                    color: CLAY,
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    padding: '7px 10px',
                    marginBottom: 18,
                  }}
                >
                  Coming soon
                </p>
                <h2 id="dossier-benefits-title" className="font-display" style={{ fontSize: 'clamp(34px, 5vw, 50px)', lineHeight: 1, fontWeight: 400, color: INK }}>
                  {activePlan.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setActiveBenefitsPlan(null)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 999,
                  border: `1px solid ${HAIRLINE}`,
                  background: 'transparent',
                  color: INK,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flex: '0 0 auto',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: STONE, fontSize: 16, lineHeight: 1.65, marginTop: 18, marginBottom: 22 }}>
              Estamos a preparar uma camada mais completa para quem já está a comparar zonas e quer decidir com mais contexto antes de visitar imóveis.
            </p>

            <div style={{ display: 'grid', gap: 12 }}>
              {activePlan.benefits.map(benefit => (
                <div key={benefit} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10, alignItems: 'start' }}>
                  <CellValue value />
                  <span style={{ color: INK, fontSize: 14, lineHeight: 1.5 }}>{benefit}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 26, paddingTop: 20, borderTop: `1px solid ${HAIRLINE}` }}>
              <button
                type="button"
                disabled
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: 999,
                  border: `1px solid ${HAIRLINE}`,
                  background: 'rgba(30, 31, 24, 0.06)',
                  color: 'rgba(30, 31, 24, 0.46)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'not-allowed',
                }}
              >
                Disponível em breve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
