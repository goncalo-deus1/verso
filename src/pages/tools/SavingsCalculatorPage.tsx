import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Landmark, PiggyBank } from 'lucide-react'
import { calculateIMT, type IMTPurpose, type IMTRegion } from '../../lib/taxes/imt'

const BASE_URL = 'https://www.usehabitta.com'
const PAGE_PATH = '/ferramentas/calculadora-entrada-necessaria'
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`

const INK = '#1E1F18'
const BONE = '#F2EDE4'
const SAND = '#E8E0D0'
const CLAY = '#C2553A'
const STONE = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const seoTitle = 'Calculadora de entrada necessária: quanto preciso de poupar para comprar casa?'
const metaDescription = 'Calcula quanto precisas de poupar para comprar casa: entrada, IMT, Imposto do Selo, escritura, custos bancários e capital próprio necessário.'

const faqs = [
  ['Quanto dinheiro preciso para comprar casa?', 'Depende do preço do imóvel, da entrada, dos impostos, da escritura, dos custos bancários e da margem de segurança. Esta calculadora estima o capital próprio necessário com base nesses fatores.'],
  ['A entrada é o único dinheiro que preciso ter?', 'Não. Além da entrada, deves considerar IMT, Imposto do Selo, escritura, registos, comissões bancárias, seguros, mudanças, mobiliário e eventuais obras.'],
  ['A calculadora inclui IMT?', 'Sim. A calculadora estima o IMT com base no valor tributável, finalidade da habitação e localização fiscal. O valor final deve ser confirmado antes da escritura.'],
  ['A calculadora inclui Imposto do Selo?', 'Sim. Estima o Imposto do Selo sobre a compra e, quando existe crédito, também o Imposto do Selo sobre o financiamento.'],
  ['Posso comprar casa com 10% de entrada?', 'Em muitos casos, os bancos exigem uma entrada mínima, mas as condições dependem da instituição, do imóvel e do perfil financeiro. A simulação é apenas informativa.'],
  ['Como saber se já estou pronto para comprar?', 'Estás mais preparado quando as tuas poupanças cobrem a entrada, os impostos, os custos iniciais e ainda deixam margem para imprevistos após a compra.'],
]

function webApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de entrada necessária habitta',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: PAGE_URL,
    description: metaDescription,
    publisher: { '@type': 'Organization', name: 'habitta', url: BASE_URL },
    inLanguage: 'pt-PT',
  }
}

function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

function breadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'habitta', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Ferramentas', item: `${BASE_URL}/ferramentas` },
      { '@type': 'ListItem', position: 3, name: 'Calculadora de entrada necessária', item: PAGE_URL },
    ],
  }
}

function euro(value: number) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

function formatNumberInput(value: number) {
  return new Intl.NumberFormat('pt-PT', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

function parseNumberInput(value: string) {
  const parsed = Number(value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
}

function numberValue(value: number) {
  return Number.isFinite(value) ? value : 0
}

function monthsLabel(months: number | null) {
  if (months === null) return 'Por estimar'
  if (months <= 0) return 'Objetivo atingido'
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (rest === 0) return `${years} ${years === 1 ? 'ano' : 'anos'}`
  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${rest} ${rest === 1 ? 'mês' : 'meses'}`
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label style={{ display: 'grid', gap: 9 }}>
      <span style={{ color: INK, fontSize: 14, fontWeight: 700 }}>{label}</span>
      {children}
      {hint && <span style={{ color: 'rgba(30,31,24,0.52)', fontSize: 12, lineHeight: 1.45 }}>{hint}</span>}
    </label>
  )
}

function NumberInput({ value, onChange, suffix = '€' }: { value: number; onChange: (value: number) => void; suffix?: string }) {
  const [draft, setDraft] = useState(formatNumberInput(value))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (focused) return
    setDraft(formatNumberInput(value))
  }, [value, focused])

  const handleBlur = () => {
    setFocused(false)
    setDraft(formatNumberInput(parseNumberInput(draft)))
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onFocus={() => setFocused(true)}
        onChange={event => {
          setDraft(event.target.value)
          onChange(parseNumberInput(event.target.value))
        }}
        onBlur={handleBlur}
        style={{
          width: '100%',
          border: `1px solid ${HAIRLINE}`,
          background: '#F8F4EC',
          color: INK,
          padding: '17px 56px 17px 18px',
          fontSize: 19,
          lineHeight: 1.1,
          fontWeight: 650,
          letterSpacing: '0.01em',
          fontVariantNumeric: 'tabular-nums',
          borderRadius: 0,
          outlineColor: CLAY,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.38)',
        }}
      />
      <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: STONE, fontSize: 19, fontWeight: 800 }}>
        {suffix}
      </span>
    </div>
  )
}

function OptionalNumberInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  const numericValue = Number(value)
  const [draft, setDraft] = useState(Number.isFinite(numericValue) && value !== '' ? formatNumberInput(numericValue) : '')
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (focused) return
    const nextValue = Number(value)
    setDraft(Number.isFinite(nextValue) && value !== '' ? formatNumberInput(nextValue) : '')
  }, [value, focused])

  const handleBlur = () => {
    setFocused(false)
    if (draft.trim() === '') return
    const parsed = parseNumberInput(draft)
    setDraft(formatNumberInput(parsed))
    onChange(String(parsed))
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onChange={event => {
          setDraft(event.target.value)
          onChange(event.target.value.trim() === '' ? '' : String(parseNumberInput(event.target.value)))
        }}
        onBlur={handleBlur}
        style={{
          width: '100%',
          border: `1px solid ${HAIRLINE}`,
          background: '#F8F4EC',
          color: INK,
          padding: '17px 56px 17px 18px',
          fontSize: 19,
          lineHeight: 1.1,
          fontWeight: 650,
          letterSpacing: '0.01em',
          fontVariantNumeric: 'tabular-nums',
          borderRadius: 0,
          outlineColor: CLAY,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.38)',
        }}
      />
      <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: STONE, fontSize: 19, fontWeight: 800 }}>
        €
      </span>
    </div>
  )
}

function Segment<T extends string | number>({ value, options, onChange }: { value: T; options: { label: string; value: T }[]; onChange: (value: T) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`, border: `1px solid ${HAIRLINE}`, background: '#F8F4EC' }}>
      {options.map((option, index) => {
        const active = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            style={{
              border: 'none',
              borderRight: index === options.length - 1 ? 'none' : `1px solid ${HAIRLINE}`,
              background: active ? INK : 'transparent',
              color: active ? BONE : INK,
              minHeight: 54,
              padding: '13px 12px',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function ResultLine({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, padding: '13px 0', borderTop: `1px solid ${emphasis ? 'rgba(242,237,228,0.22)' : HAIRLINE}` }}>
      <span style={{ color: emphasis ? 'rgba(242,237,228,0.62)' : STONE, fontSize: 14 }}>{label}</span>
      <strong style={{ color: emphasis ? BONE : INK, fontSize: 15, textAlign: 'right' }}>{value}</strong>
    </div>
  )
}

function CtaLink({ href, children, variant = 'primary' }: { href: string; children: ReactNode; variant?: 'primary' | 'secondary' }) {
  const primary = variant === 'primary'
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        padding: '14px 18px',
        borderRadius: 999,
        textDecoration: 'none',
        background: primary ? CLAY : 'transparent',
        color: primary ? BONE : 'currentColor',
        border: primary ? `1px solid ${CLAY}` : '1px solid currentColor',
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      {children} <ArrowRight size={15} />
    </a>
  )
}

export function SavingsCalculatorContent() {
  const [propertyPrice, setPropertyPrice] = useState(300000)
  const [currentSavings, setCurrentSavings] = useState(35000)
  const [monthlySavings, setMonthlySavings] = useState(750)
  const [downPaymentRate, setDownPaymentRate] = useState(0.1)
  const [patrimonialValue, setPatrimonialValue] = useState('')
  const [purpose, setPurpose] = useState<IMTPurpose>('permanentHome')
  const [region, setRegion] = useState<IMTRegion>('mainland')
  const [ageUnder35, setAgeUnder35] = useState<'sim' | 'nao'>('nao')
  const [firstPermanentHome, setFirstPermanentHome] = useState<'sim' | 'nao'>('nao')
  const [deedAndRegistryFees, setDeedAndRegistryFees] = useState(900)
  const [bankFees, setBankFees] = useState(500)

  const calculations = useMemo(() => {
    const price = numberValue(propertyPrice)
    const savings = numberValue(currentSavings)
    const monthly = numberValue(monthlySavings)
    const parsedPatrimonialValue = Number(patrimonialValue)
    const taxableValue = Math.max(price, Number.isFinite(parsedPatrimonialValue) && parsedPatrimonialValue > 0 ? parsedPatrimonialValue : price)
    const recommendedDownPayment = price * downPaymentRate
    const loanAmount = Math.max(0, price - recommendedDownPayment)
    const imtResult = calculateIMT({
      taxableValue,
      purpose,
      region,
      ageUnder35: ageUnder35 === 'sim',
      firstPermanentHome: firstPermanentHome === 'sim',
    })
    const stampDutyPurchase = taxableValue * 0.008
    const stampDutyMortgage = loanAmount > 5000 ? loanAmount * 0.006 : 0
    const totalTaxesAndFees = imtResult.imt + stampDutyPurchase + stampDutyMortgage + numberValue(deedAndRegistryFees) + numberValue(bankFees)
    const cashNeeded = recommendedDownPayment + totalTaxesAndFees
    const amountMissing = Math.max(0, cashNeeded - savings)
    const monthsToGoal = monthly > 0 ? Math.ceil(amountMissing / monthly) : null

    let statusTitle = 'Ainda precisa de poupança'
    let statusMessage = 'Com os valores indicados, ainda precisas de reforçar poupanças antes de comprar com mais segurança.'
    if (amountMissing === 0) {
      statusTitle = 'Pronto para avançar'
      statusMessage = 'As tuas poupanças parecem cobrir a entrada e os custos iniciais estimados. Confirma sempre os valores reais antes de fazer proposta.'
    } else if (amountMissing <= cashNeeded * 0.1) {
      statusTitle = 'Quase lá'
      statusMessage = 'Estás perto do capital próprio estimado. Pode fazer sentido reforçar margem antes de avançar.'
    }

    return {
      taxableValue,
      recommendedDownPayment,
      loanAmount,
      imt: imtResult.imt,
      imtNote: imtResult.note,
      stampDutyPurchase,
      stampDutyMortgage,
      totalTaxesAndFees,
      cashNeeded,
      amountMissing,
      monthsToGoal,
      statusTitle,
      statusMessage,
      showMonthlySavingsPrompt: monthly <= 0 && amountMissing > 0,
      showYoungNote: ageUnder35 === 'sim' && firstPermanentHome === 'sim' && purpose === 'permanentHome',
    }
  }, [propertyPrice, currentSavings, monthlySavings, downPaymentRate, patrimonialValue, purpose, region, ageUnder35, firstPermanentHome, deedAndRegistryFees, bankFees])

  return (
    <div style={{ minHeight: '100vh', background: BONE, color: INK }}>
      <header className="habitta-px" style={{ background: INK, color: BONE, paddingTop: 'clamp(72px, 10vw, 128px)', paddingBottom: 'clamp(48px, 7vw, 86px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: CLAY, marginBottom: 26 }}>
            FERRAMENTAS
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.96, letterSpacing: '-0.04em', fontWeight: 400, maxWidth: 900 }}>
            Quanto preciso de poupar para comprar casa?
          </h1>
          <p style={{ color: 'rgba(242, 237, 228, 0.66)', fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: 1.7, maxWidth: 740, marginTop: 28 }}>
            Estima a entrada, impostos e custos iniciais para perceber se já tens capital próprio suficiente antes de começares a procurar casa.
          </p>
        </div>
      </header>

      <main className="habitta-px" style={{ padding: 'clamp(34px, 5vw, 64px) 0 clamp(64px, 8vw, 100px)' }}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_420px]" style={{ maxWidth: 1180, margin: '0 auto', gap: 18, alignItems: 'start' }}>
          <section style={{ background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: 'clamp(22px, 4vw, 34px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <span style={{ width: 42, height: 42, borderRadius: 999, background: 'rgba(194, 85, 58, 0.1)', color: CLAY, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <PiggyBank size={21} />
              </span>
              <div>
                <h2 className="font-display" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 400 }}>Dados da compra</h2>
                <p style={{ color: STONE, fontSize: 14, marginTop: 4 }}>Ajusta os campos para perceber a meta de capital próprio.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2" style={{ gap: 18 }}>
              <Field label="Preço do imóvel">
                <NumberInput value={propertyPrice} onChange={setPropertyPrice} />
              </Field>
              <Field label="Poupanças atuais">
                <NumberInput value={currentSavings} onChange={setCurrentSavings} />
              </Field>
              <Field label="Poupança mensal">
                <NumberInput value={monthlySavings} onChange={setMonthlySavings} />
              </Field>
              <Field label="Percentagem de entrada pretendida">
                <Segment<number>
                  value={downPaymentRate}
                  onChange={setDownPaymentRate}
                  options={[
                    { label: '10%', value: 0.1 },
                    { label: '15%', value: 0.15 },
                    { label: '20%', value: 0.2 },
                  ]}
                />
              </Field>
              <Field
                label="Valor patrimonial tributário, se souberes"
                hint="O IMT e o Imposto do Selo incidem sobre o maior valor entre o preço de compra e o valor patrimonial tributário."
              >
                <OptionalNumberInput value={patrimonialValue} onChange={setPatrimonialValue} placeholder="Usar preço do imóvel" />
              </Field>
              <Field label="Finalidade da habitação">
                <Segment<IMTPurpose>
                  value={purpose}
                  onChange={setPurpose}
                  options={[
                    { label: 'Habitação própria permanente', value: 'permanentHome' },
                    { label: 'Habitação secundária', value: 'secondaryHome' },
                  ]}
                />
              </Field>
              <Field label="Localização fiscal">
                <Segment<IMTRegion>
                  value={region}
                  onChange={setRegion}
                  options={[
                    { label: 'Continente', value: 'mainland' },
                    { label: 'Açores ou Madeira', value: 'islands' },
                  ]}
                />
              </Field>
              <Field label="Tens 35 anos ou menos?">
                <Segment<'sim' | 'nao'>
                  value={ageUnder35}
                  onChange={setAgeUnder35}
                  options={[
                    { label: 'Sim', value: 'sim' },
                    { label: 'Não', value: 'nao' },
                  ]}
                />
              </Field>
              <Field label="Primeira compra de habitação própria permanente?">
                <Segment<'sim' | 'nao'>
                  value={firstPermanentHome}
                  onChange={setFirstPermanentHome}
                  options={[
                    { label: 'Sim', value: 'sim' },
                    { label: 'Não', value: 'nao' },
                  ]}
                />
              </Field>
              <Field label="Escritura e registos estimados">
                <NumberInput value={deedAndRegistryFees} onChange={setDeedAndRegistryFees} />
              </Field>
              <Field label="Comissões bancárias estimadas">
                <NumberInput value={bankFees} onChange={setBankFees} />
              </Field>
            </div>

            <div style={{ marginTop: 28, padding: 18, border: `1px solid ${HAIRLINE}`, background: BONE }}>
              <strong style={{ color: INK }}>Como calculamos</strong>
              <p style={{ color: STONE, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
                Estimamos a entrada com base na percentagem escolhida. O IMT é calculado por escalões, conforme finalidade da habitação e localização fiscal. O Imposto do Selo sobre a compra é estimado a 0,8% e o Imposto do Selo sobre o crédito a 0,6% sobre o valor financiado, quando aplicável.
              </p>
            </div>

            {calculations.showYoungNote && (
              <div style={{ marginTop: 14, padding: 18, border: `1px solid rgba(194, 85, 58, 0.25)`, background: 'rgba(194, 85, 58, 0.08)' }}>
                <p style={{ color: INK, fontSize: 14, lineHeight: 1.65 }}>
                  Poderás beneficiar de isenções ou reduções em alguns impostos na primeira compra de habitação própria permanente, dependendo do valor do imóvel e das regras em vigor. Confirma sempre com fontes oficiais ou profissionais qualificados.
                </p>
              </div>
            )}

            {calculations.imtNote && (
              <div style={{ marginTop: 14, padding: 18, border: `1px solid ${HAIRLINE}`, background: '#F8F4EC' }}>
                <p style={{ color: STONE, fontSize: 13, lineHeight: 1.65 }}>{calculations.imtNote}</p>
              </div>
            )}
          </section>

          <aside style={{ position: 'sticky', top: 108, background: INK, color: BONE, padding: 'clamp(24px, 4vw, 34px)', border: `1px solid ${INK}` }}>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: CLAY, marginBottom: 14 }}>
              Capital próprio estimado
            </p>
            <p className="font-display" style={{ fontSize: 'clamp(46px, 5vw, 64px)', lineHeight: 1, fontWeight: 400, color: BONE }}>
              {euro(calculations.cashNeeded)}
            </p>
            <div style={{ marginTop: 18, padding: 16, background: 'rgba(242,237,228,0.08)', border: '1px solid rgba(242,237,228,0.16)' }}>
              <strong style={{ display: 'block', color: BONE, fontSize: 18 }}>{calculations.statusTitle}</strong>
              <p style={{ color: 'rgba(242,237,228,0.62)', fontSize: 13, lineHeight: 1.58, marginTop: 7 }}>{calculations.statusMessage}</p>
            </div>

            <div style={{ marginTop: 24 }}>
              <ResultLine label="Entrada recomendada" value={euro(calculations.recommendedDownPayment)} emphasis />
              <ResultLine label="Impostos e custos iniciais" value={euro(calculations.totalTaxesAndFees)} emphasis />
              <ResultLine label="Poupanças atuais" value={euro(currentSavings)} emphasis />
              <ResultLine label="Falta poupar" value={euro(calculations.amountMissing)} emphasis />
              <ResultLine label="Tempo estimado até ao objetivo" value={monthsLabel(calculations.monthsToGoal)} emphasis />
            </div>

            {calculations.showMonthlySavingsPrompt && (
              <div style={{ marginTop: 16, padding: 15, background: 'rgba(194, 85, 58, 0.14)', border: '1px solid rgba(194, 85, 58, 0.35)', color: BONE, fontSize: 13, lineHeight: 1.55 }}>
                Indica uma poupança mensal para estimarmos quanto tempo falta até ao objetivo.
              </div>
            )}
          </aside>
        </div>

        <section style={{ maxWidth: 1180, margin: '18px auto 0', background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: 'clamp(20px, 4vw, 30px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Landmark size={19} color={CLAY} />
            <h2 className="font-display" style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 400 }}>Breakdown da estimativa</h2>
          </div>
          <div className="grid md:grid-cols-2" style={{ gap: '0 32px' }}>
            <ResultLine label="Entrada recomendada" value={euro(calculations.recommendedDownPayment)} />
            <ResultLine label="IMT estimado" value={euro(calculations.imt)} />
            <ResultLine label="Imposto do Selo sobre a compra" value={euro(calculations.stampDutyPurchase)} />
            <ResultLine label="Imposto do Selo sobre o crédito" value={euro(calculations.stampDutyMortgage)} />
            <ResultLine label="Escritura e registos" value={euro(deedAndRegistryFees)} />
            <ResultLine label="Comissões bancárias" value={euro(bankFees)} />
            <ResultLine label="Total de impostos e custos iniciais" value={euro(calculations.totalTaxesAndFees)} />
            <ResultLine label="Capital próprio necessário" value={euro(calculations.cashNeeded)} />
            <ResultLine label="Poupanças atuais" value={euro(currentSavings)} />
            <ResultLine label="Falta poupar" value={euro(calculations.amountMissing)} />
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: '18px auto 0', padding: 'clamp(28px, 5vw, 48px)', background: SAND, border: `1px solid ${HAIRLINE}` }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(34px, 5vw, 58px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400, maxWidth: 780 }}>
            Já sabes quanto precisas de poupar. Agora percebe onde esse orçamento faz sentido.
          </h2>
          <p style={{ color: STONE, fontSize: 18, lineHeight: 1.7, maxWidth: 760, marginTop: 18 }}>
            O capital próprio é só uma parte da decisão. A zona certa também depende de transportes, serviços, preços por metro quadrado, rotina e planos de vida.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
            <CtaLink href="/quiz">Descobrir a minha zona ideal</CtaLink>
            <CtaLink href="/ferramentas/calculadora-credito-habitacao" variant="secondary">Simular crédito habitação</CtaLink>
          </div>
        </section>

        <section style={{ maxWidth: 980, margin: 'clamp(46px, 7vw, 84px) auto 0' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 50px)', lineHeight: 1.05, fontWeight: 400 }}>Perguntas frequentes</h2>
          <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
            {faqs.map(([question, answer]) => (
              <article key={question} style={{ background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: '22px 24px' }}>
                <h3 className="font-display" style={{ fontSize: 23, lineHeight: 1.2, fontWeight: 400 }}>{question}</h3>
                <p style={{ color: STONE, lineHeight: 1.7, marginTop: 10 }}>{answer}</p>
              </article>
            ))}
          </div>
          <p style={{ color: 'rgba(30,31,24,0.58)', fontSize: 13, lineHeight: 1.65, marginTop: 24 }}>
            Esta ferramenta tem fins informativos e não constitui aconselhamento financeiro, fiscal, jurídico ou proposta de crédito. Os valores de impostos, custos e benefícios fiscais podem mudar e devem ser confirmados junto da Autoridade Tributária, notário, solicitador, advogado ou instituição financeira.
          </p>
        </section>
      </main>
    </div>
  )
}

export default function SavingsCalculatorPage() {
  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:locale" content="pt_PT" />
        <meta property="og:site_name" content="habitta" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <link rel="alternate" hrefLang="pt-pt" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(webApplicationSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema())}</script>
      </Helmet>
      <SavingsCalculatorContent />
    </>
  )
}

export const savingsCalculatorShell = {
  path: PAGE_PATH,
  title: seoTitle,
  description: metaDescription,
  url: PAGE_URL,
  jsonLd: [webApplicationSchema(), faqSchema(), breadcrumbSchema()],
}
