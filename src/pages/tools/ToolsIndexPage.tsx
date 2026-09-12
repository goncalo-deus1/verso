import { Helmet } from 'react-helmet-async'
import type { ReactNode } from 'react'
import { ArrowRight, CheckCircle, Clock, Wrench } from 'lucide-react'

const BASE_URL = 'https://www.usehabitta.com'
const PAGE_PATH = '/ferramentas'
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`

const INK = '#1E1F18'
const BONE = '#F2EDE4'
const SAND = '#E8E0D0'
const CLAY = '#C2553A'
const STONE = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const seoTitle = 'Ferramentas para comprar casa e escolher onde viver'
const metaDescription = 'Calculadoras e ferramentas da habitta para simular crédito habitação, calcular entrada necessária, comparar zonas e tomar decisões mais informadas antes de comprar casa.'

type ToolStatus = 'Disponível' | 'Em breve'

const tools: {
  category: string
  name: string
  description: string
  benefits: string[]
  status: ToolStatus
  cta: string
  href?: string
}[] = [
  {
    category: 'CRÉDITO HABITAÇÃO',
    name: 'Calculadora de crédito habitação',
    description: 'Simula a prestação mensal, valor do empréstimo, juros totais, IMT, Imposto do Selo e tabela de amortização.',
    benefits: ['Prestação mensal estimada', 'IMT e custos iniciais', 'Juros totais e amortização'],
    status: 'Disponível',
    cta: 'Simular crédito',
    href: '/ferramentas/calculadora-credito-habitacao',
  },
  {
    category: 'POUPANÇA',
    name: 'Calculadora de entrada necessária',
    description: 'Percebe quanto precisas de poupar para comprar casa, incluindo entrada, impostos, escritura e custos bancários.',
    benefits: ['Capital próprio necessário', 'Quanto ainda falta poupar', 'Tempo estimado até ao objetivo'],
    status: 'Disponível',
    cta: 'Ver ferramenta',
    href: '/ferramentas/calculadora-entrada-necessaria',
  },
  {
    category: 'ZONAS',
    name: 'Comparar zonas',
    description: 'Compara duas zonas da Área Metropolitana de Lisboa com base no teu perfil, orçamento, mobilidade e prioridades.',
    benefits: ['Prós e contras por perfil', 'Score por critério', 'Trade-offs claros'],
    status: 'Em breve',
    cta: 'Comparar zonas',
    href: '/comparar',
  },
  {
    category: 'ORÇAMENTO',
    name: 'Quanto posso pagar por uma casa?',
    description: 'Calcula o preço máximo confortável com base no teu rendimento, entrada disponível, prazo e taxa de esforço.',
    benefits: ['Prestação máxima confortável', 'Orçamento máximo estimado', 'Zonas compatíveis'],
    status: 'Em breve',
    cta: 'Calcular orçamento',
  },
  {
    category: 'DECISÃO',
    name: 'Comprar ou arrendar?',
    description: 'Compara o custo de comprar casa com o custo de continuar a arrendar, considerando prazo, prestação, renda e custos iniciais.',
    benefits: ['Custo total comparado', 'Ponto de equilíbrio', 'Flexibilidade vs propriedade'],
    status: 'Em breve',
    cta: 'Comparar opções',
  },
  {
    category: 'VISITAS',
    name: 'Checklist de visita a imóvel',
    description: 'Gera uma checklist simples para avaliar casa, prédio, rua e envolvente antes de fazer uma proposta.',
    benefits: ['Sinais de alerta', 'Perguntas a fazer', 'Documentos a pedir'],
    status: 'Em breve',
    cta: 'Criar checklist',
  },
]

const faqs = [
  ['As ferramentas da habitta substituem aconselhamento financeiro?', 'Não. As ferramentas têm fins informativos e não substituem aconselhamento financeiro, fiscal, jurídico ou técnico. Os valores devem ser confirmados com profissionais qualificados antes de tomar decisões.'],
  ['A habitta vende imóveis?', 'Não. A habitta não é uma imobiliária, não vende imóveis e não trabalha com comissões. O objetivo é ajudar-te a decidir melhor onde viver.'],
  ['A calculadora de crédito habitação é vinculativa?', 'Não. A calculadora dá uma estimativa com base nos valores introduzidos. As condições reais dependem da análise de instituições financeiras, avaliação do imóvel e legislação aplicável.'],
  ['Porque é que a habitta fala tanto de zonas?', 'Porque a casa é apenas uma parte da decisão. A zona define transportes, rotina, serviços, custos escondidos, qualidade de vida e potencial de valorização.'],
  ['As ferramentas vão ser atualizadas?', 'Sim. A habitta deve atualizar ferramentas, dados e metodologias sempre que existam alterações relevantes em impostos, regras de crédito ou dados territoriais.'],
]

const tableRows = [
  ['Calculadora de crédito habitação', 'Simular prestação, juros, impostos e amortização', 'Disponível'],
  ['Calculadora de entrada necessária', 'Saber quanto precisas de poupar', 'Disponível'],
  ['Comparar zonas', 'Comparar prós, contras e trade-offs entre zonas', 'Em breve'],
  ['Quanto posso pagar?', 'Estimar orçamento máximo confortável', 'Em breve'],
  ['Comprar ou arrendar?', 'Comparar custo de comprar vs arrendar', 'Em breve'],
  ['Checklist de visita', 'Avaliar imóvel, prédio e envolvente', 'Em breve'],
]

function collectionPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: seoTitle,
    description: metaDescription,
    url: PAGE_URL,
    publisher: { '@type': 'Organization', name: 'habitta', url: BASE_URL },
    inLanguage: 'pt-PT',
  }
}

function breadcrumbSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'habitta', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Ferramentas', item: PAGE_URL },
    ],
  }
}

function itemListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: tool.href ? `${BASE_URL}${tool.href}` : undefined,
    })),
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

function StatusBadge({ status }: { status: ToolStatus }) {
  const available = status === 'Disponível'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: `1px solid ${available ? 'rgba(194,85,58,0.35)' : HAIRLINE}`,
        background: available ? 'rgba(194,85,58,0.09)' : 'rgba(30,31,24,0.04)',
        color: available ? CLAY : STONE,
        padding: '7px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {available ? <CheckCircle size={13} /> : <Clock size={13} />}
      {status}
    </span>
  )
}

function ToolCard({ tool }: { tool: typeof tools[number] }) {
  const active = tool.status === 'Disponível' || Boolean(tool.href)
  return (
    <article style={{ minHeight: '100%', background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: '26px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start' }}>
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: CLAY }}>
          {tool.category}
        </p>
        <StatusBadge status={tool.status} />
      </div>
      <div>
        <h3 className="font-display" style={{ fontSize: 30, lineHeight: 1.06, fontWeight: 400, color: INK }}>{tool.name}</h3>
        <p style={{ color: STONE, fontSize: 15, lineHeight: 1.65, marginTop: 12 }}>{tool.description}</p>
      </div>
      <ul style={{ display: 'grid', gap: 9, color: INK, fontSize: 14, lineHeight: 1.45, marginTop: 2 }}>
        {tool.benefits.map(item => (
          <li key={item} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <span style={{ width: 5, height: 5, borderRadius: 999, background: CLAY, marginTop: 8, flexShrink: 0 }} />
            {item}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 'auto', paddingTop: 4 }}>
        {active && tool.href ? (
          <a href={tool.href} style={{ color: INK, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 14 }}>
            {tool.cta} <ArrowRight size={15} />
          </a>
        ) : (
          <span style={{ color: 'rgba(30,31,24,0.38)', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 14, cursor: 'default' }}>
            {tool.cta} <Clock size={15} />
          </span>
        )}
      </div>
    </article>
  )
}

export function ToolsIndexContent() {
  return (
    <div style={{ minHeight: '100vh', background: BONE, color: INK }}>
      <header className="habitta-px" style={{ background: INK, color: BONE, paddingTop: 'clamp(72px, 10vw, 128px)', paddingBottom: 'clamp(48px, 7vw, 86px)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: CLAY, marginBottom: 26 }}>
            FERRAMENTAS
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.96, letterSpacing: '-0.04em', fontWeight: 400, maxWidth: 920 }}>
            Ferramentas para decidir melhor onde viver
          </h1>
          <p style={{ color: 'rgba(242, 237, 228, 0.66)', fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: 1.7, maxWidth: 760, marginTop: 28 }}>
            Calculadoras, comparadores e checklists para perceber orçamento, custos, zonas e próximos passos antes de começares a procurar casa.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 30 }}>
            <CtaLink href="/ferramentas/calculadora-credito-habitacao">Simular crédito habitação</CtaLink>
            <CtaLink href="/quiz" variant="secondary">Descobrir a minha zona ideal</CtaLink>
          </div>
        </div>
      </header>

      <main className="habitta-px" style={{ padding: 'clamp(42px, 6vw, 78px) 0 clamp(64px, 8vw, 100px)' }}>
        <section style={{ maxWidth: 980, margin: '0 auto clamp(42px, 6vw, 76px)' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
            Antes da casa certa, vem a decisão certa
          </h2>
          <p style={{ color: STONE, fontSize: 18, lineHeight: 1.75, marginTop: 18 }}>
            Comprar casa não começa nos anúncios. Começa por perceber quanto podes pagar, que custos vais ter, que zonas fazem sentido para o teu perfil e que compromissos estás disposto a aceitar. As ferramentas da habitta ajudam-te a transformar dúvidas em decisões mais claras.
          </p>
        </section>

        <section style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 24 }}>
            <span style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(194,85,58,0.1)', color: CLAY, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={19} />
            </span>
            <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 46px)', lineHeight: 1.05, fontWeight: 400 }}>Todas as ferramentas</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 18 }}>
            {tools.map(tool => <ToolCard key={tool.name} tool={tool} />)}
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: 'clamp(42px, 6vw, 76px) auto 0', display: 'grid', gap: 18 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 50px)', lineHeight: 1.05, fontWeight: 400 }}>Como usar estas ferramentas</h2>
          <div className="grid md:grid-cols-3" style={{ gap: 18 }}>
            {[
              ['1', 'Percebe o teu orçamento', 'Começa por simular prestação, entrada necessária e custos iniciais para saberes a ordem de grandeza da compra.'],
              ['2', 'Escolhe melhor a zona', 'Depois, cruza o orçamento com transportes, serviços, rotina, estilo de vida e prioridades.'],
              ['3', 'Decide com mais contexto', 'Usa comparadores, checklists e guias para reduzir risco antes de visitar casas ou fazer propostas.'],
            ].map(([step, title, text]) => (
              <article key={step} style={{ background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: 24 }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', color: CLAY, fontWeight: 800, fontSize: 12 }}>PASSO {step}</span>
                <h3 className="font-display" style={{ fontSize: 28, lineHeight: 1.08, fontWeight: 400, marginTop: 14 }}>{title}</h3>
                <p style={{ color: STONE, lineHeight: 1.65, marginTop: 11 }}>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: '18px auto 0', padding: 'clamp(28px, 5vw, 48px)', background: SAND, border: `1px solid ${HAIRLINE}` }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
            Não sabes por onde começar?
          </h2>
          <p style={{ color: STONE, fontSize: 18, lineHeight: 1.7, maxWidth: 720, marginTop: 18 }}>
            Responde ao quiz da habitta e descobre que zonas da Área Metropolitana de Lisboa fazem mais sentido para o teu perfil.
          </p>
          <div style={{ marginTop: 28 }}>
            <CtaLink href="/quiz">Fazer o quiz de zona</CtaLink>
          </div>
        </section>

        <section style={{ maxWidth: 1180, margin: 'clamp(42px, 6vw, 76px) auto 0', background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: 'clamp(20px, 4vw, 30px)' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.05, fontWeight: 400, marginBottom: 18 }}>Ferramentas disponíveis vs futuras</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Ferramenta', 'Para que serve', 'Estado'].map(column => (
                    <th key={column} style={{ textAlign: 'left', padding: '14px 16px', color: STONE, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: `1px solid ${HAIRLINE}` }}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map(([name, purpose, status]) => (
                  <tr key={name}>
                    <td style={{ padding: '15px 16px', borderBottom: `1px solid ${HAIRLINE}`, fontWeight: 800 }}>{name}</td>
                    <td style={{ padding: '15px 16px', borderBottom: `1px solid ${HAIRLINE}`, color: STONE }}>{purpose}</td>
                    <td style={{ padding: '15px 16px', borderBottom: `1px solid ${HAIRLINE}` }}>{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </section>

        <section style={{ maxWidth: 1180, margin: 'clamp(42px, 6vw, 76px) auto 0', padding: 'clamp(30px, 5vw, 54px)', background: INK, color: BONE }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.98, letterSpacing: '-0.03em', fontWeight: 400, maxWidth: 760 }}>
            Antes de escolheres casa, escolhe melhor a zona
          </h2>
          <p style={{ color: 'rgba(242,237,228,0.68)', fontSize: 18, lineHeight: 1.7, maxWidth: 760, marginTop: 18 }}>
            Usa as ferramentas da habitta para perceber orçamento, custos e localização antes de perderes tempo em anúncios que não encaixam na tua vida.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
            <CtaLink href="/quiz">Descobrir a minha zona ideal</CtaLink>
            <CtaLink href="/ferramentas/calculadora-credito-habitacao" variant="secondary">Simular crédito habitação</CtaLink>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function ToolsIndexPage() {
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
        <script type="application/ld+json">{JSON.stringify(collectionPageSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema())}</script>
      </Helmet>
      <ToolsIndexContent />
    </>
  )
}

export const toolsIndexShell = {
  path: PAGE_PATH,
  title: seoTitle,
  description: metaDescription,
  url: PAGE_URL,
  jsonLd: [collectionPageSchema(), breadcrumbSchema(), itemListSchema(), faqSchema()],
}
