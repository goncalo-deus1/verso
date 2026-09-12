import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { calculateIMT, type IMTPurpose, type IMTRegion } from '../../lib/taxes/imt'

const BASE_URL = 'https://www.usehabitta.com'
const PAGE_PATH = '/ferramentas/calculadora-credito-habitacao'
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`

const INK = '#1E1F18'
const BONE = '#F2EDE4'
const SAND = '#E8E0D0'
const CLAY = '#C2553A'
const STONE = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const seoTitle = 'Calculadora de crédito habitação: simula prestação e juros'
const metaDescription = 'Simula a prestação mensal do crédito habitação, valor do empréstimo, juros totais, entrada necessária e tabela de amortização antes de comprar casa.'

type RateType = 'fixa' | 'variavel'

const locations = [
  'Aveiro',
  'Beja',
  'Braga',
  'Bragança',
  'Castelo Branco',
  'Coimbra',
  'Évora',
  'Faro',
  'Guarda',
  'Leiria',
  'Lisboa',
  'Portalegre',
  'Porto',
  'Santarém',
  'Setúbal',
  'Viana do Castelo',
  'Vila Real',
  'Viseu',
  'Açores',
  'Madeira',
]

const faqs = [
  ['Como é calculada a prestação mensal?', 'A prestação é calculada através do método francês de amortização, em que a mensalidade se mantém constante para uma taxa definida e inclui juros e amortização de capital.'],
  ['Esta simulação é vinculativa?', 'Não. A calculadora é meramente informativa e não constitui uma proposta de crédito.'],
  ['O que é o loan-to-value?', 'É a percentagem do preço do imóvel que é financiada pelo crédito. Por exemplo, se compras uma casa de 300.000€ com 60.000€ de entrada, o empréstimo é de 240.000€ e o loan-to-value é de 80%.'],
  ['Porque é importante ver os juros totais?', 'Porque duas prestações mensais parecidas podem ter custos totais muito diferentes dependendo do prazo e da taxa de juro.'],
  ['A calculadora inclui IMT?', 'Sim. A calculadora estima o IMT com base no valor tributável, finalidade da habitação e localização fiscal. O valor final deve ser sempre confirmado antes da escritura.'],
  ['A calculadora inclui Imposto do Selo?', 'Sim. A calculadora estima o Imposto do Selo sobre a compra e, quando existe crédito habitação, o Imposto do Selo sobre o financiamento.'],
  ['A isenção jovem está incluída?', 'Sim, a calculadora pode aplicar uma estimativa do regime jovem quando o utilizador indica que tem até 35 anos, que se trata de primeira habitação própria permanente e que cumpre as condições necessárias. O enquadramento deve ser confirmado com fontes oficiais.'],
  ['O valor patrimonial tributário importa?', 'Sim. Em regra, o IMT e o Imposto do Selo incidem sobre o maior valor entre o preço declarado e o valor patrimonial tributário.'],
]

function webApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculadora de crédito habitação habitta',
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
      { '@type': 'ListItem', position: 3, name: 'Calculadora de crédito habitação', item: PAGE_URL },
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

function percent(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toLocaleString('pt-PT', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  })}%`
}

function formatNumberInput(value: number, decimals = 0) {
  return new Intl.NumberFormat('pt-PT', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

function parseNumberInput(value: string) {
  const clean = value.replace(/[^\d,.-]/g, '')
  const normalized = clean.includes(',')
    ? clean.replace(/\./g, '').replace(',', '.')
    : clean
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
}

function numberValue(value: number) {
  return Number.isFinite(value) ? value : 0
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

function NumberInput({ value, onChange, suffix }: { value: number; onChange: (value: number) => void; suffix?: string }) {
  const decimals = suffix === '%' ? 2 : 0
  const [draft, setDraft] = useState(formatNumberInput(value, decimals))
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (focused) return
    setDraft(formatNumberInput(value, decimals))
  }, [value, decimals, focused])

  const handleBlur = () => {
    setFocused(false)
    setDraft(formatNumberInput(parseNumberInput(draft), decimals))
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        inputMode={suffix === '%' ? 'decimal' : 'numeric'}
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
          padding: suffix ? '17px 56px 17px 18px' : '17px 18px',
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
      {suffix && (
        <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: STONE, fontSize: 19, fontWeight: 800 }}>
          {suffix}
        </span>
      )}
    </div>
  )
}

function OptionalNumberInput({ value, onChange, suffix, placeholder }: { value: string; onChange: (value: string) => void; suffix?: string; placeholder?: string }) {
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
          padding: suffix ? '17px 56px 17px 18px' : '17px 18px',
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
      {suffix && (
        <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: STONE, fontSize: 19, fontWeight: 800 }}>
          {suffix}
        </span>
      )}
    </div>
  )
}

function Segment<T extends string>({ value, options, onChange }: { value: T; options: { label: string; value: T }[]; onChange: (value: T) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`, border: `1px solid ${HAIRLINE}`, background: '#F8F4EC' }}>
      {options.map(option => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            style={{
              border: 'none',
              borderRight: option === options[options.length - 1] ? 'none' : `1px solid ${HAIRLINE}`,
              background: active ? INK : 'transparent',
              color: active ? BONE : INK,
              padding: '13px 12px',
              fontSize: 13,
              fontWeight: 700,
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

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, padding: '13px 0', borderTop: `1px solid ${HAIRLINE}` }}>
      <span style={{ color: 'rgba(242,237,228,0.58)', fontSize: 14 }}>{label}</span>
      <strong style={{ color: BONE, fontSize: 15, textAlign: 'right' }}>{value}</strong>
    </div>
  )
}

export function MortgageCalculatorContent() {
  const [propertyPrice, setPropertyPrice] = useState(300000)
  const [savings, setSavings] = useState(60000)
  const [patrimonialValue, setPatrimonialValue] = useState('')
  const [years, setYears] = useState(30)
  const [rateType, setRateType] = useState<RateType>('fixa')
  const [annualInterestRate, setAnnualInterestRate] = useState(3.5)
  const [location, setLocation] = useState('Lisboa')
  const [purpose, setPurpose] = useState<IMTPurpose>('permanentHome')
  const [region, setRegion] = useState<IMTRegion>('mainland')
  const [firstPermanentHome, setFirstPermanentHome] = useState<'sim' | 'nao'>('nao')
  const [ageUnder35, setAgeUnder35] = useState<'sim' | 'nao'>('nao')
  const [deedAndRegistryFees, setDeedAndRegistryFees] = useState(900)
  const [bankFees, setBankFees] = useState(500)
  const [showAmortization, setShowAmortization] = useState(false)

  const calculations = useMemo(() => {
    const price = numberValue(propertyPrice)
    const availableSavings = numberValue(savings)
    const parsedPatrimonialValue = Number(patrimonialValue)
    const taxableValue = Math.max(price, Number.isFinite(parsedPatrimonialValue) && parsedPatrimonialValue > 0 ? parsedPatrimonialValue : price)
    const loanAmount = Math.max(price - availableSavings, 0)
    const loanToValue = price > 0 ? (loanAmount / price) * 100 : 0
    const recommendedDownPayment = price * 0.1
    const monthlyRate = numberValue(annualInterestRate) / 100 / 12
    const numberOfPayments = years * 12
    const monthlyPayment = loanAmount === 0
      ? 0
      : monthlyRate > 0
        ? loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        : loanAmount / numberOfPayments
    const totalPaid = monthlyPayment * numberOfPayments
    const totalInterest = Math.max(totalPaid - loanAmount, 0)
    const imtResult = calculateIMT({
      taxableValue,
      purpose,
      region,
      ageUnder35: ageUnder35 === 'sim',
      firstPermanentHome: firstPermanentHome === 'sim',
    })
    const stampDutyPurchase = imtResult.exemptionType === 'total' ? 0 : taxableValue * 0.008
    const stampDutyMortgage = loanAmount > 5000 ? loanAmount * 0.006 : 0
    const totalTaxesAndFees = imtResult.imt + stampDutyPurchase + stampDutyMortgage + numberValue(deedAndRegistryFees) + numberValue(bankFees)
    const recommendedCashNeeded = recommendedDownPayment + totalTaxesAndFees

    let remainingBalance = loanAmount
    const annualRows: {
      year: number
      totalPaidThisYear: number
      totalPrincipalThisYear: number
      totalInterestThisYear: number
      remainingBalanceAtEndOfYear: number
    }[] = []

    for (let yearIndex = 1; yearIndex <= years; yearIndex++) {
      let totalPaidThisYear = 0
      let totalPrincipalThisYear = 0
      let totalInterestThisYear = 0

      for (let month = 1; month <= 12; month++) {
        if (remainingBalance <= 0) break
        const interestPayment = monthlyRate > 0 ? remainingBalance * monthlyRate : 0
        const principalPayment = Math.min(monthlyPayment - interestPayment, remainingBalance)
        const paidThisMonth = principalPayment + interestPayment
        remainingBalance = Math.max(remainingBalance - principalPayment, 0)

        totalPaidThisYear += paidThisMonth
        totalPrincipalThisYear += principalPayment
        totalInterestThisYear += interestPayment
      }

      annualRows.push({
        year: yearIndex,
        totalPaidThisYear,
        totalPrincipalThisYear,
        totalInterestThisYear,
        remainingBalanceAtEndOfYear: remainingBalance,
      })
    }

    return {
      loanAmount,
      loanToValue,
      taxableValue,
      recommendedDownPayment,
      recommendedCashNeeded,
      monthlyPayment,
      totalPaid,
      totalInterest,
      numberOfPayments,
      imt: imtResult.imt,
      imtNote: imtResult.note,
      imtExemptionType: imtResult.exemptionType,
      stampDutyPurchase,
      stampDutyMortgage,
      totalTaxesAndFees,
      annualRows,
      hasLowSavingsWarning: availableSavings < recommendedDownPayment,
      hasCashNeededWarning: availableSavings < recommendedCashNeeded,
    }
  }, [propertyPrice, savings, patrimonialValue, annualInterestRate, years, purpose, region, ageUnder35, firstPermanentHome, deedAndRegistryFees, bankFees])

  return (
    <div style={{ minHeight: '100vh', background: BONE, color: INK }}>
      <header className="habitta-px" style={{ background: INK, color: BONE, paddingTop: 'clamp(72px, 10vw, 128px)', paddingBottom: 'clamp(48px, 7vw, 86px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: CLAY, marginBottom: 26 }}>
            FERRAMENTA HABITTA
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.96, letterSpacing: '-0.04em', fontWeight: 400, maxWidth: 860 }}>
            Calculadora de crédito habitação
          </h1>
          <p style={{ color: 'rgba(242, 237, 228, 0.66)', fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: 1.7, maxWidth: 720, marginTop: 28 }}>
            Simula a prestação mensal, o valor do empréstimo, os juros totais e a amortização ao longo do prazo. A calculadora usa uma lógica financeira standard, mas a decisão de compra continua a precisar de contexto sobre a zona.
          </p>
        </div>
      </header>

      <main className="habitta-px" style={{ padding: 'clamp(34px, 5vw, 64px) 0 clamp(64px, 8vw, 100px)' }}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_420px]" style={{ maxWidth: 1180, margin: '0 auto', gap: 18, alignItems: 'start' }}>
          <section style={{ background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: 'clamp(22px, 4vw, 34px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <span style={{ width: 42, height: 42, borderRadius: 999, background: 'rgba(194, 85, 58, 0.1)', color: CLAY, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator size={20} />
              </span>
              <div>
                <h2 className="font-display" style={{ fontSize: 32, lineHeight: 1.05, fontWeight: 400 }}>Dados da simulação</h2>
                <p style={{ color: STONE, fontSize: 14, marginTop: 4 }}>Ajusta os campos para perceber a ordem de grandeza da prestação.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2" style={{ gap: 18 }}>
              <Field label="Preço do imóvel">
                <NumberInput value={propertyPrice} onChange={setPropertyPrice} suffix="€" />
              </Field>
              <Field label="Poupanças / entrada disponível">
                <NumberInput value={savings} onChange={setSavings} suffix="€" />
              </Field>
              <Field
                label="Valor patrimonial tributário, se souberes"
                hint="O IMT e o Imposto do Selo incidem sobre o maior valor entre o preço de compra e o valor patrimonial tributário."
              >
                <OptionalNumberInput value={patrimonialValue} onChange={setPatrimonialValue} suffix="€" placeholder="Usar preço do imóvel" />
              </Field>
              <Field label="Prazo em anos" hint={`${years} anos · ${years * 12} prestações`}>
                <input
                  type="range"
                  min={5}
                  max={40}
                  value={years}
                  onChange={event => setYears(Number(event.target.value))}
                  style={{ width: '100%', accentColor: CLAY }}
                />
              </Field>
              <Field label="Taxa de juro anual">
                <NumberInput value={annualInterestRate} onChange={setAnnualInterestRate} suffix="%" />
              </Field>
              <Field label="Tipo de taxa">
                <Segment<RateType>
                  value={rateType}
                  onChange={setRateType}
                  options={[
                    { label: 'Fixa', value: 'fixa' },
                    { label: 'Variável', value: 'variavel' },
                  ]}
                />
              </Field>
              <Field label="Localização do imóvel">
                <select
                  value={location}
                  onChange={event => setLocation(event.target.value)}
                  style={{ width: '100%', border: `1px solid ${HAIRLINE}`, background: '#F8F4EC', color: INK, padding: '15px 16px', fontSize: 16, borderRadius: 0, outlineColor: CLAY }}
                >
                  {locations.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
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
              <Field label="Escritura e registos estimados">
                <NumberInput value={deedAndRegistryFees} onChange={setDeedAndRegistryFees} suffix="€" />
              </Field>
              <Field label="Comissões bancárias estimadas">
                <NumberInput value={bankFees} onChange={setBankFees} suffix="€" />
              </Field>
            </div>

            <div style={{ marginTop: 28, padding: 18, border: `1px solid ${HAIRLINE}`, background: BONE }}>
              <strong style={{ color: INK }}>Como calculamos os impostos</strong>
              <p style={{ color: STONE, fontSize: 14, lineHeight: 1.65, marginTop: 8 }}>
                O IMT é estimado por escalões, conforme finalidade da habitação e localização fiscal. O Imposto do Selo sobre a compra é calculado a 0,8% e o Imposto do Selo sobre o crédito a 0,6% sobre o valor financiado, quando aplicável. Estes valores são estimativas informativas e devem ser confirmados antes da escritura.
              </p>
            </div>

            {calculations.imtNote && (
              <div style={{ marginTop: 14, padding: 18, border: `1px solid rgba(194, 85, 58, 0.25)`, background: 'rgba(194, 85, 58, 0.08)' }}>
                <p style={{ color: INK, fontSize: 14, lineHeight: 1.65 }}>
                  {calculations.imtNote}
                </p>
              </div>
            )}
          </section>

          <aside style={{ position: 'sticky', top: 108, background: INK, color: BONE, padding: 'clamp(24px, 4vw, 34px)', border: `1px solid ${INK}` }}>
            <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: CLAY, marginBottom: 14 }}>
              Resultado estimado
            </p>
            <p className="font-display" style={{ fontSize: 'clamp(46px, 5vw, 64px)', lineHeight: 1, fontWeight: 400, color: BONE }}>
              {euro(calculations.monthlyPayment)}
            </p>
            <p style={{ color: 'rgba(242,237,228,0.52)', marginTop: 10, lineHeight: 1.55 }}>
              Prestação mensal estimada com taxa {rateType === 'fixa' ? 'fixa' : 'variável'} de {percent(annualInterestRate)} em {location}.
            </p>

            <div style={{ marginTop: 24 }}>
              <ResultLine label="Valor do empréstimo" value={euro(calculations.loanAmount)} />
              <ResultLine label="Entrada disponível" value={euro(savings)} />
              <ResultLine label="Loan-to-value" value={percent(calculations.loanToValue)} />
              <ResultLine label="IMT estimado" value={euro(calculations.imt)} />
              <ResultLine label="Imposto do Selo sobre a compra" value={euro(calculations.stampDutyPurchase)} />
              <ResultLine label="Imposto do Selo sobre o crédito" value={euro(calculations.stampDutyMortgage)} />
              <ResultLine label="Escritura e registos" value={euro(deedAndRegistryFees)} />
              <ResultLine label="Comissões bancárias" value={euro(bankFees)} />
              <ResultLine label="Total de impostos e custos iniciais" value={euro(calculations.totalTaxesAndFees)} />
              <ResultLine label="Capital próprio necessário estimado" value={euro(calculations.recommendedCashNeeded)} />
              <ResultLine label="Entrada indicada" value={euro(savings)} />
              <ResultLine label="Capital próprio recomendado" value={euro(calculations.recommendedCashNeeded)} />
              <ResultLine label="Juros totais estimados" value={euro(calculations.totalInterest)} />
              <ResultLine label="Custo total do crédito" value={euro(calculations.totalPaid)} />
            </div>

            {calculations.hasLowSavingsWarning && (
              <div style={{ marginTop: 18, padding: 15, background: 'rgba(194, 85, 58, 0.14)', border: '1px solid rgba(194, 85, 58, 0.35)', color: BONE, fontSize: 13, lineHeight: 1.55 }}>
                Os bancos normalmente exigem uma entrada mínima. Esta simulação pode não refletir uma aprovação real.
              </div>
            )}

            {calculations.hasCashNeededWarning && (
              <div style={{ marginTop: 12, padding: 15, background: 'rgba(194, 85, 58, 0.14)', border: '1px solid rgba(194, 85, 58, 0.35)', color: BONE, fontSize: 13, lineHeight: 1.55 }}>
                A entrada indicada pode não cobrir a entrada recomendada e os custos iniciais.
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowAmortization(value => !value)}
              style={{ width: '100%', marginTop: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 18px', borderRadius: 999, border: `1px solid rgba(242,237,228,0.22)`, background: 'transparent', color: BONE, fontWeight: 700, cursor: 'pointer' }}
            >
              Ver tabela de amortização {showAmortization ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </aside>
        </div>

        {showAmortization && (
          <section style={{ maxWidth: 1180, margin: '18px auto 0', background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: 'clamp(20px, 4vw, 30px)' }}>
            <h2 className="font-display" style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 400, marginBottom: 18 }}>
              Tabela de amortização anual
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Ano', 'Pago no ano', 'Capital amortizado', 'Juros pagos', 'Capital em dívida'].map(column => (
                      <th key={column} style={{ textAlign: 'left', padding: '14px 16px', color: STONE, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: `1px solid ${HAIRLINE}` }}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calculations.annualRows.map(row => (
                    <tr key={row.year}>
                      <td style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}`, fontWeight: 700 }}>Ano {row.year}</td>
                      <td style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}` }}>{euro(row.totalPaidThisYear)}</td>
                      <td style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}` }}>{euro(row.totalPrincipalThisYear)}</td>
                      <td style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}` }}>{euro(row.totalInterestThisYear)}</td>
                      <td style={{ padding: '14px 16px', borderBottom: `1px solid ${HAIRLINE}` }}>{euro(row.remainingBalanceAtEndOfYear)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section style={{ maxWidth: 1180, margin: '18px auto 0', padding: 'clamp(28px, 5vw, 48px)', background: SAND, border: `1px solid ${HAIRLINE}` }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(34px, 5vw, 58px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400, maxWidth: 760 }}>
            E agora, onde faz sentido procurar?
          </h2>
          <p style={{ color: STONE, fontSize: 18, lineHeight: 1.7, maxWidth: 720, marginTop: 18 }}>
            Saber a prestação mensal é só o primeiro passo. A decisão certa também depende da zona: transportes, serviços, rotina, preço por metro quadrado e planos de vida.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
            <CtaLink href="/quiz">Descobrir a minha zona ideal</CtaLink>
            <CtaLink href="/comparar" variant="secondary">Comparar zonas</CtaLink>
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
            Esta calculadora tem fins informativos e não constitui aconselhamento financeiro, fiscal, jurídico ou proposta de crédito. Os valores de IMT, Imposto do Selo e benefícios fiscais podem mudar e devem ser confirmados junto da Autoridade Tributária, notário, solicitador, advogado ou instituição financeira.
          </p>
        </section>
      </main>
    </div>
  )
}

export default function MortgageCalculatorPage() {
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
      <MortgageCalculatorContent />
    </>
  )
}

export const mortgageCalculatorShell = {
  path: PAGE_PATH,
  title: seoTitle,
  description: metaDescription,
  url: PAGE_URL,
  jsonLd: [webApplicationSchema(), faqSchema(), breadcrumbSchema()],
}
