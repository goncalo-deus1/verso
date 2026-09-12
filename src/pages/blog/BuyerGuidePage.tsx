import { Helmet } from 'react-helmet-async'
import { ArrowRight } from 'lucide-react'

const BASE_URL = 'https://www.usehabitta.com'
const PAGE_PATH = '/blog/guia-do-comprador'
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`
const PUBLISHED_AT = '2026-05-26'
const UPDATED_AT = '2026-05-26'

const INK = '#1E1F18'
const BONE = '#F2EDE4'
const CLAY = '#C2553A'
const STONE = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const seoTitle = 'Guia do comprador de casa em Portugal: passos, custos e erros a evitar'
const metaDescription = 'Vai comprar casa? Conhece os passos essenciais: orçamento, crédito habitação, escolha da zona, documentos, impostos, CPCV, escritura e erros comuns a evitar.'

const steps = [
  ['Definir orçamento real', 'Inclui entrada, prestação mensal, impostos, escritura, custos bancários, condomínio, obras e margem para imprevistos.'],
  ['Simular crédito habitação', 'Ajuda a perceber quanto o banco poderá financiar e qual a prestação mensal provável.'],
  ['Escolher a zona certa', 'A localização afeta rotina, transportes, serviços, qualidade de vida e potencial de valorização.'],
  ['Comparar imóveis', 'Analisa preço, área, estado, exposição solar, prédio, condomínio e envolvente.'],
  ['Visitar a casa e a zona', 'Não visites só o imóvel. Observa a rua, o ruído, os acessos, o estacionamento e os serviços próximos.'],
  ['Verificar documentos', 'Confirma propriedade, licença, registos, situação fiscal, certificado energético e dados do imóvel.'],
  ['Fazer proposta', 'Define preço, condições, prazos, sinal e eventuais cláusulas de segurança.'],
  ['Assinar CPCV', 'O Contrato-Promessa de Compra e Venda formaliza o compromisso entre comprador e vendedor.'],
  ['Finalizar o crédito', 'O banco confirma avaliação, aprovação final e condições do financiamento.'],
  ['Realizar a escritura', 'A compra é formalizada, os impostos são pagos e a propriedade é registada.'],
]

const beforeCards = [
  ['Quanto posso pagar?', 'O preço do imóvel não é o custo total. Considera entrada, impostos, prestação, seguros, escritura, condomínio, obras e custos de mudança.'],
  ['Onde faz sentido viver?', 'A casa pode ser renovada. A zona não. Avalia mobilidade, serviços, rotina, segurança percebida, escolas, comércio e evolução urbana.'],
  ['Que compromissos aceito?', 'Nenhuma zona é perfeita. Talvez tenhas de escolher entre centralidade, preço, espaço, transportes, tranquilidade ou potencial futuro.'],
]

const zoneCriteria = [
  ['Mobilidade', 'Quanto tempo demoro até ao trabalho, escola, família ou serviços importantes?'],
  ['Transportes', 'Consigo viver sem carro ou vou depender dele todos os dias?'],
  ['Preço', 'A zona cabe no meu orçamento real ou estou a esticar demasiado?'],
  ['Serviços', 'Tenho supermercados, saúde, escolas, comércio e espaços verdes próximos?'],
  ['Ritmo de vida', 'A zona combina comigo durante a semana, não apenas ao fim de semana?'],
  ['Segurança percebida', 'Sinto-me confortável a circular ali em diferentes horários?'],
  ['Evolução urbana', 'Há obras, projetos, alterações de PDM ou mudanças previstas?'],
  ['Liquidez futura', 'Se precisar de vender ou arrendar no futuro, a zona terá procura?'],
]

const costs = [
  ['Entrada inicial', 'Parte do valor que normalmente não é financiada pelo banco.'],
  ['IMT', 'Imposto Municipal sobre as Transmissões Onerosas de Imóveis.'],
  ['Imposto do Selo', 'Aplica-se à compra e também ao crédito habitação.'],
  ['Escritura e registos', 'Custos administrativos associados à formalização da compra.'],
  ['Avaliação bancária', 'O banco avalia o imóvel antes da aprovação final do crédito.'],
  ['Seguros', 'Normalmente incluem seguro de vida e seguro multirriscos.'],
  ['Condomínio', 'Custo recorrente importante em apartamentos.'],
  ['Obras e mobiliário', 'Frequentemente subestimados no orçamento inicial.'],
  ['Transportes', 'Uma zona mais barata pode sair mais cara se aumentar muito a dependência do carro.'],
]

const documents = [
  ['Caderneta predial', 'Confirma dados fiscais, áreas e identificação do imóvel.'],
  ['Certidão permanente', 'Confirma propriedade, ónus, encargos ou hipotecas.'],
  ['Licença de utilização', 'Confirma que o imóvel está licenciado para habitação.'],
  ['Certificado energético', 'Indica o desempenho energético do imóvel.'],
  ['Planta do imóvel', 'Ajuda a confirmar áreas, divisões e alterações.'],
  ['Atas de condomínio', 'Podem revelar dívidas, obras previstas, conflitos ou despesas relevantes.'],
  ['Ficha técnica da habitação', 'Quando aplicável, reúne informação técnica sobre construção e materiais.'],
  ['Comprovativos de obras', 'Importante se houve alterações estruturais ou remodelações relevantes.'],
]

const visitChecklist = [
  'Luz natural',
  'Ruído dentro e fora da casa',
  'Humidade, manchas ou cheiro intenso',
  'Estado do prédio',
  'Elevador, escadas, entrada e fachada',
  'Condomínio e obras previstas',
  'Exposição solar',
  'Estacionamento',
  'Rua e movimento envolvente',
  'Transportes próximos',
  'Comércio e serviços',
  'Sensação da zona em diferentes horários',
]

const creditCriteria = [
  ['Spread', 'Margem cobrada pelo banco.'],
  ['TAEG', 'Indicador do custo total do crédito.'],
  ['Taxa fixa, variável ou mista', 'Define o nível de estabilidade da prestação.'],
  ['Prazo', 'Afeta a prestação mensal e o custo total do crédito.'],
  ['Seguros associados', 'Podem influenciar muito o custo final.'],
  ['Comissões', 'Incluem avaliação, dossier, amortização e outros custos.'],
  ['Condições obrigatórias', 'Alguns bancos exigem domiciliação de ordenado, cartões ou produtos associados.'],
]

const contractSteps = [
  ['Proposta', 'Fazes uma oferta com preço, condições e prazos.'],
  ['Negociação', 'Comprador e vendedor ajustam preço, sinal, datas e condições.'],
  ['CPCV', 'Contrato-Promessa de Compra e Venda que formaliza o compromisso.'],
  ['Avaliação bancária', 'O banco avalia o imóvel para confirmar o financiamento.'],
  ['Aprovação final do crédito', 'O banco confirma as condições finais do empréstimo.'],
  ['Escritura', 'A propriedade é transmitida formalmente para o comprador.'],
  ['Registo', 'A titularidade é atualizada nos registos competentes.'],
]

const mistakes = [
  ['Começar pelos anúncios', 'Podes apaixonar-te por uma casa antes de perceber se a zona faz sentido.'],
  ['Ignorar custos extra', 'O orçamento real pode ser muito superior ao preço anunciado.'],
  ['Não comparar zonas', 'Podes escolher uma zona cara ou pouco adequada quando existiam alternativas melhores.'],
  ['Visitar só uma vez', 'Podes não perceber ruído, trânsito, falta de luz ou problemas da envolvente.'],
  ['Esticar demasiado a prestação', 'Ficas sem margem para imprevistos, obras ou alterações de vida.'],
  ['Ignorar o prédio', 'Um bom apartamento num prédio problemático pode trazer custos e conflitos.'],
  ['Não verificar documentos', 'Podes herdar problemas legais, fiscais ou urbanísticos.'],
  ['Decidir com pressa', 'O mercado pode pressionar, mas a decisão deve ser tua.'],
]

const faqs = [
  ['Qual é o primeiro passo para comprar casa em Portugal?', 'O primeiro passo é definir o orçamento real. Deves considerar entrada inicial, prestação mensal, impostos, escritura, custos bancários, condomínio, obras e margem para imprevistos.'],
  ['Devo escolher primeiro a casa ou a zona?', 'Idealmente, deves escolher primeiro a zona. A casa pode ser comparada ou renovada, mas a zona define a tua rotina, transportes, serviços, qualidade de vida e potencial de valorização.'],
  ['Que documentos devo pedir antes de comprar casa?', 'Os documentos mais comuns são a caderneta predial, certidão permanente, licença de utilização, certificado energético, planta do imóvel, atas de condomínio e comprovativos de obras, quando aplicável.'],
  ['O que é o CPCV?', 'O CPCV, ou Contrato-Promessa de Compra e Venda, é o contrato em que comprador e vendedor assumem o compromisso de realizar a compra. Normalmente inclui preço, sinal, prazos e condições de desistência.'],
  ['Que custos existem além do preço da casa?', 'Além do preço da casa, deves considerar IMT, Imposto do Selo, escritura, registos, custos bancários, avaliação, seguros, condomínio, obras, mobiliário e custos de mudança.'],
  ['Como saber se uma zona é boa para mim?', 'Uma zona é boa para ti se encaixar no teu orçamento, rotina, mobilidade, estilo de vida, necessidades familiares e planos futuros. Não existe uma zona perfeita para todos; existe uma zona certa para cada perfil.'],
  ['Vale a pena comprar numa zona mais barata longe de Lisboa?', 'Depende. Uma zona mais barata pode fazer sentido se continuar a oferecer bons acessos, serviços e qualidade de vida. Mas pode sair mais cara se aumentar muito os custos de transporte, tempo perdido ou dependência do carro.'],
  ['O que devo observar numa visita?', 'Deves observar luz natural, ruído, humidade, estado do prédio, exposição solar, condomínio, estacionamento, acessos, comércio próximo e sensação da rua em diferentes horários.'],
]

const internalLinks = [
  ['Início', '/'],
  ['Quiz de zona', '/quiz'],
  ['Dossier', '/quiz/dossier'],
  ['Comparar zonas', '/comparar'],
  ['Blog', '/blog'],
  ['Lisboa', '/aml/lisboa'],
  ['Oeiras', '/aml/oeiras'],
  ['Almada', '/aml/almada'],
  ['Cascais', '/aml/cascais'],
  ['Sintra', '/aml/sintra'],
]

function articleSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Guia do comprador de casa em Portugal',
    description: metaDescription,
    datePublished: PUBLISHED_AT,
    dateModified: UPDATED_AT,
    author: { '@type': 'Organization', name: 'habitta', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'habitta', url: BASE_URL },
    inLanguage: 'pt-PT',
    mainEntityOfPage: PAGE_URL,
    url: PAGE_URL,
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
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: 'Guia do comprador', item: PAGE_URL },
    ],
  }
}

function howToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Como comprar casa em Portugal',
    description: metaDescription,
    inLanguage: 'pt-PT',
    step: steps.map(([name, text], index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name,
      text,
    })),
  }
}

function Section({ id, title, intro, children }: { id: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ padding: 'clamp(48px, 7vw, 88px) 0', borderTop: `1px solid ${HAIRLINE}`, scrollMarginTop: 110 }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h2 className="font-display" style={{ fontSize: 'clamp(32px, 4.4vw, 54px)', lineHeight: 1.05, letterSpacing: '-0.025em', fontWeight: 400, color: INK }}>
          {title}
        </h2>
        {intro && <p style={{ color: STONE, fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: 1.75, maxWidth: 760, marginTop: 18 }}>{intro}</p>}
        <div style={{ marginTop: 32 }}>{children}</div>
      </div>
    </section>
  )
}

function Table({ columns, rows }: { columns: [string, string]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${HAIRLINE}`, background: '#F8F4EC' }}>
      <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column} style={{ textAlign: 'left', padding: '18px 20px', fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: STONE, borderBottom: `1px solid ${HAIRLINE}` }}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              <td style={{ width: '34%', padding: '18px 20px', color: INK, fontWeight: 700, verticalAlign: 'top', borderBottom: `1px solid ${HAIRLINE}` }}>{row[0]}</td>
              <td style={{ padding: '18px 20px', color: STONE, lineHeight: 1.6, verticalAlign: 'top', borderBottom: `1px solid ${HAIRLINE}`, borderLeft: `1px solid ${HAIRLINE}` }}>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CtaLink({ href, children, variant = 'primary' }: { href: string; children: React.ReactNode; variant?: 'primary' | 'secondary' }) {
  const primary = variant === 'primary'
  return (
    <a
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        padding: '14px 20px',
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

export function BuyerGuideContent() {
  return (
    <div style={{ background: BONE, color: INK, minHeight: '100vh' }}>
      <header className="habitta-px" style={{ background: INK, color: BONE, paddingTop: 'clamp(78px, 10vw, 132px)', paddingBottom: 'clamp(56px, 8vw, 96px)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: CLAY, marginBottom: 26 }}>
            GUIA DO COMPRADOR
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(46px, 7.8vw, 96px)', lineHeight: 0.96, letterSpacing: '-0.04em', fontWeight: 400, maxWidth: 840 }}>
            Guia do comprador de casa em Portugal
          </h1>
          <p style={{ color: 'rgba(242, 237, 228, 0.68)', fontSize: 'clamp(17px, 2vw, 21px)', lineHeight: 1.7, maxWidth: 720, marginTop: 28 }}>
            Comprar casa é uma das decisões financeiras mais importantes da vida. Este guia ajuda-te a perceber os passos essenciais antes de avançar: orçamento, crédito, escolha da zona, visitas, documentos, impostos, CPCV e escritura.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 34 }}>
            <CtaLink href="/quiz">Descobrir a minha zona ideal</CtaLink>
            <CtaLink href="/comparar" variant="secondary">Comparar zonas</CtaLink>
          </div>
        </div>
      </header>

      <main className="habitta-px" style={{ paddingBottom: 'clamp(56px, 8vw, 96px)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <aside style={{ transform: 'translateY(-28px)', background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${CLAY}`, padding: 'clamp(24px, 4vw, 38px)' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.08, fontWeight: 400, color: INK }}>Resposta rápida</h2>
            <p style={{ color: STONE, fontSize: 'clamp(16px, 2vw, 18px)', lineHeight: 1.75, marginTop: 16 }}>
              Para comprar casa em Portugal, começa por definir o orçamento real, simular o crédito habitação, escolher a zona certa, comparar imóveis, visitar a casa e a envolvente, verificar documentos como caderneta predial, certidão permanente, licença de utilização e certificado energético, negociar a proposta, assinar o CPCV e preparar a escritura. Antes de escolher o imóvel, avalia também transportes, serviços, custos, segurança percebida, evolução urbana e qualidade de vida da zona.
            </p>
          </aside>

          <nav aria-label="Links internos" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 30 }}>
            {internalLinks.map(([label, href]) => (
              <a key={href} href={href} style={{ color: STONE, textDecoration: 'none', border: `1px solid ${HAIRLINE}`, padding: '8px 11px', borderRadius: 999, fontSize: 13 }}>
                {label}
              </a>
            ))}
          </nav>

          <Section
            id="passos"
            title="Passos para comprar casa em Portugal"
            intro="O processo de compra começa antes das visitas. Quanto melhor definires orçamento, zona e critérios, menos provável é tomares uma decisão pressionada por anúncios ou visitas apressadas."
          >
            <Table columns={['Passo', 'Descrição']} rows={steps.map((row, index) => [`Passo ${index + 1}: ${row[0]}`, row[1]])} />
          </Section>

          <Section
            id="antes"
            title="Antes de veres casas, decide três coisas"
            intro="A maioria dos compradores começa pelos anúncios. Mas uma decisão informada começa antes: pelo orçamento, pela zona e pelos compromissos que estás disposto a aceitar."
          >
            <div className="grid md:grid-cols-3" style={{ gap: 12 }}>
              {beforeCards.map(([title, text]) => (
                <article key={title} style={{ background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: 24 }}>
                  <h3 className="font-display" style={{ fontSize: 25, lineHeight: 1.12, fontWeight: 400, color: INK }}>{title}</h3>
                  <p style={{ color: STONE, lineHeight: 1.65, marginTop: 14 }}>{text}</p>
                </article>
              ))}
            </div>
          </Section>

          <Section
            id="zona"
            title="Como escolher a zona certa para comprar casa"
            intro="Antes de escolheres uma casa, percebe se a zona encaixa na tua vida. A localização define a tua rotina diária, os tempos de deslocação, os custos escondidos e a qualidade de vida."
          >
            <Table columns={['Critério', 'Pergunta']} rows={zoneCriteria} />
            <div style={{ marginTop: 24 }}>
              <CtaLink href="/quiz">Descobrir a minha zona ideal</CtaLink>
            </div>
          </Section>

          <Section
            id="custos"
            title="Custos ao comprar casa em Portugal"
            intro="O preço anunciado não é o custo total da compra. Antes de avançar, deves prever impostos, custos bancários, escritura, seguros e despesas futuras."
          >
            <Table columns={['Custo', 'Descrição']} rows={costs} />
          </Section>

          <Section
            id="documentos"
            title="Documentos a pedir antes de comprar casa"
            intro="Antes de assinar qualquer compromisso, confirma a situação legal, fiscal e urbanística do imóvel. Em caso de dúvida, pede apoio profissional."
          >
            <Table columns={['Documento', 'Para que serve']} rows={documents} />
          </Section>

          <Section
            id="visitas"
            title="O que observar numa visita"
            intro="Uma visita não serve apenas para ver se gostas da casa. Serve para identificar riscos, custos futuros e sinais que podem passar despercebidos nas fotografias."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 10 }}>
              {visitChecklist.map(item => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: '13px 14px', color: STONE }}>
                  <span style={{ color: CLAY, fontWeight: 700 }}>✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <blockquote style={{ margin: '28px 0 0', padding: 22, background: INK, color: BONE, borderLeft: `4px solid ${CLAY}`, fontSize: 18, lineHeight: 1.55 }}>
              Não visites só a casa. Visita também a rua, o quarteirão e a rotina que vais ter ali.
            </blockquote>
          </Section>

          <Section
            id="credito"
            title="Crédito habitação: o que comparar"
            intro="Antes de fazer uma proposta, fala com o banco ou com um intermediário de crédito e percebe quanto poderás financiar. Não compares apenas a prestação mensal."
          >
            <Table columns={['Critério', 'Descrição']} rows={creditCriteria} />
          </Section>

          <Section
            id="cpcv"
            title="Do CPCV à escritura"
            intro="Depois da proposta aceite, o processo entra numa fase contratual. É importante perceber prazos, sinal, condições de desistência e responsabilidades de cada parte."
          >
            <Table columns={['Etapa', 'Descrição']} rows={contractSteps} />
            <div role="note" style={{ marginTop: 24, padding: 22, background: 'rgba(194, 85, 58, 0.1)', border: `1px solid rgba(194, 85, 58, 0.25)`, color: INK, lineHeight: 1.65, fontWeight: 700 }}>
              Nunca assines um CPCV sem perceber as consequências do sinal, os prazos e as condições de desistência.
            </div>
          </Section>

          <Section id="erros" title="Erros comuns ao comprar casa">
            <Table columns={['Erro', 'Consequência']} rows={mistakes} />
          </Section>

          <Section id="faq" title="Perguntas frequentes">
            <div style={{ display: 'grid', gap: 12 }}>
              {faqs.map(([question, answer]) => (
                <article key={question} style={{ background: '#F8F4EC', border: `1px solid ${HAIRLINE}`, padding: '22px 24px' }}>
                  <h3 className="font-display" style={{ fontSize: 24, lineHeight: 1.2, fontWeight: 400, color: INK }}>{question}</h3>
                  <p style={{ color: STONE, lineHeight: 1.7, marginTop: 12 }}>{answer}</p>
                </article>
              ))}
            </div>
          </Section>

          <section style={{ marginTop: 28, padding: 'clamp(30px, 5vw, 52px)', background: INK, color: BONE }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(34px, 5vw, 62px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400, maxWidth: 760 }}>
              Antes de escolheres casa, escolhe onde faz sentido viver
            </h2>
            <p style={{ color: 'rgba(242, 237, 228, 0.68)', fontSize: 18, lineHeight: 1.7, maxWidth: 720, marginTop: 20 }}>
              Comprar casa não é só encontrar bons anúncios. É perceber que zonas encaixam no teu orçamento, rotina, mobilidade e planos de vida. A habitta ajuda-te a começar pela decisão certa.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
              <CtaLink href="/quiz">Fazer o quiz de zona</CtaLink>
              <CtaLink href="/comparar" variant="secondary">Comparar duas zonas</CtaLink>
            </div>
          </section>

          <p style={{ color: 'rgba(30, 31, 24, 0.58)', fontSize: 13, lineHeight: 1.65, marginTop: 28 }}>
            Este guia tem fins informativos e não substitui aconselhamento jurídico, fiscal, financeiro ou técnico. Antes de assinar contratos ou tomar decisões financeiras, consulta profissionais qualificados.
          </p>
        </div>
      </main>
    </div>
  )
}

export default function BuyerGuidePage() {
  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:locale" content="pt_PT" />
        <meta property="og:site_name" content="habitta" />
        <meta property="article:published_time" content={PUBLISHED_AT} />
        <meta property="article:modified_time" content={UPDATED_AT} />
        <meta property="article:author" content="habitta" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <link rel="alternate" hrefLang="pt-pt" href={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(articleSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(howToSchema())}</script>
      </Helmet>
      <BuyerGuideContent />
    </>
  )
}

export const buyerGuideShell = {
  path: PAGE_PATH,
  title: seoTitle,
  description: metaDescription,
  url: PAGE_URL,
  publishedAt: PUBLISHED_AT,
  updatedAt: UPDATED_AT,
  jsonLd: [articleSchema(), faqSchema(), breadcrumbSchema(), howToSchema()],
}
