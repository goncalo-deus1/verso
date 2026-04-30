import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { concelhos } from '../data/concelhos'
import { concelhosSEO } from '../data/concelhosSEO'
import { concelhosAML } from '../data/concelhosAML'
import { freguesias } from '../data/freguesias'
import SaveZoneButton from '../components/SaveZoneButton'
import { PdmSection } from '../components/concelho/PdmSection'
import { UrbanProjectsSection } from '../components/concelho/UrbanProjectsSection'

const INK      = '#1E1F18'
const BONE     = '#F2EDE4'
const CLAY     = '#C2553A'
const MOSS     = '#6B7A5A'
const SAND     = '#E8E0D0'
const STONE    = '#3A3B2E'
const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

const SITE_URL = 'https://www.usehabitta.com'

function absoluteImage(src: string): string {
  if (!src) return `${SITE_URL}/og-image.png`
  if (src.startsWith('http')) return src
  return `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`
}

function formatDate(iso: string): string {
  // "2026-04-30" -> "30 de abril de 2026"
  const [y, m, d] = iso.split('-').map(Number)
  const months = [
    'janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
  ]
  return `${d} de ${months[(m ?? 1) - 1]} de ${y}`
}

export default function ConcelhoDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const concelho = concelhos.find(c => c.slug === slug)

  if (!concelho) return <Navigate to="/404" replace />

  const coveredFreguesias = freguesias.filter(f => concelho.freguesiasCovered.includes(f.slug))

  const seoData = concelhosSEO.find(c => c.slug === slug)
  const amlData = concelhosAML.find(c => c.slug === slug)

  // "Concelhos proximos": same margem, excluding self, up to 4
  const nearby = concelhosAML
    .filter(c => c.slug !== slug && c.margem === amlData?.margem)
    .slice(0, 4)

  const ogImage = amlData ? absoluteImage(amlData.image) : `${SITE_URL}/og-image.png`

  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Concelhos', item: `${SITE_URL}/concelhos` },
      { '@type': 'ListItem', position: 3, name: concelho.name, item: seoData?.canonical ?? `${SITE_URL}/concelho/${slug}` },
    ],
  })

  const eyebrow: React.CSSProperties = {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '2.5px',
    color: CLAY,
    margin: '0 0 24px',
  }

  const facts = [
    {
      label: 'Populacao aproximada',
      value: concelho.hardFacts.populationApprox != null
        ? `${concelho.hardFacts.populationApprox.toLocaleString('pt-PT')} hab.`
        : '— a confirmar',
    },
    {
      label: 'Percurso mediano a Baixa',
      value: concelho.hardFacts.medianCommuteToLisboaBaixaMinutes != null
        ? `${concelho.hardFacts.medianCommuteToLisboaBaixaMinutes} min`
        : '— a confirmar',
    },
    {
      label: 'Renda mediana T2',
      value: concelho.hardFacts.medianT2RentEuros != null
        ? `${concelho.hardFacts.medianT2RentEuros} €/mes`
        : '— a confirmar',
    },
    {
      label: 'Tendencia (3 anos)',
      value: concelho.hardFacts.populationTrend3y != null
        ? { growing: 'Em crescimento', stable: 'Estavel', declining: 'Em declinio' }[concelho.hardFacts.populationTrend3y]
        : '— a confirmar',
    },
  ]

  return (
    <>
      {/* ── SEO Head ──────────────────────────────────────────────── */}
      {seoData && (
        <Helmet>
          <title>{seoData.title}</title>
          <meta name="description" content={seoData.metaDescription} />
          <link rel="canonical" href={seoData.canonical} />

          <meta property="og:type" content="article" />
          <meta property="og:title" content={seoData.title} />
          <meta property="og:description" content={seoData.metaDescription} />
          <meta property="og:url" content={seoData.canonical} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:locale" content="pt_PT" />
          <meta property="og:site_name" content="habitta" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoData.title} />
          <meta name="twitter:description" content={seoData.metaDescription} />
          <meta name="twitter:image" content={ogImage} />

          {/* Article JSON-LD from MD file */}
          {seoData.jsonLd && (
            <script type="application/ld+json">{seoData.jsonLd}</script>
          )}

          {/* BreadcrumbList */}
          <script type="application/ld+json">{breadcrumbJsonLd}</script>
        </Helmet>
      )}

      <div style={{ background: BONE, minHeight: '100vh' }}>
        <article
          className="px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-24"
          style={{ maxWidth: '680px', margin: '0 auto', boxSizing: 'border-box' }}
        >
          {/* Breadcrumb */}
          <nav aria-label="Navegacao de migas de pao" style={{ marginBottom: '32px' }}>
            <ol style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              color: STONE,
            }}>
              <li><Link to="/" style={{ color: STONE, textDecoration: 'none' }}>Inicio</Link></li>
              <li aria-hidden="true" style={{ color: HAIRLINE }}>›</li>
              <li><Link to="/concelhos" style={{ color: STONE, textDecoration: 'none' }}>Concelhos</Link></li>
              <li aria-hidden="true" style={{ color: HAIRLINE }}>›</li>
              <li style={{ color: INK, fontWeight: 500 }}>{concelho.name}</li>
            </ol>
          </nav>

          {/* Eyebrow */}
          <p style={eyebrow}>
            CONCELHO · {concelho.margem === 'norte' ? 'MARGEM NORTE' : 'MARGEM SUL'}
          </p>

          {/* H1 */}
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 400, color: INK, lineHeight: 1.05, marginBottom: '16px' }}
          >
            {concelho.name}
          </h1>

          {/* oneLine */}
          <p style={{ fontSize: '22px', fontStyle: 'italic', color: MOSS, lineHeight: 1.5, marginBottom: '32px' }}>
            {concelho.oneLine}
          </p>

          {/* Save button */}
          <div style={{ marginBottom: '24px' }}>
            <SaveZoneButton zoneSlug={concelho.slug} zoneKind="concelho" zoneName={concelho.name} />
          </div>

          {/* Divisor */}
          <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '40px' }} />

          {/* Descricao */}
          <p style={{ fontSize: '19px', color: INK, lineHeight: 1.65, marginBottom: '48px' }}>
            {concelho.honestDescription}
          </p>

          {/* Hard facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 lg:p-8" style={{
            marginBottom: '48px',
            background: SAND,
            borderRadius: '4px',
          }}>
            {facts.map(f => (
              <div key={f.label}>
                <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: STONE, margin: '0 0 6px' }}>
                  {f.label}
                </p>
                <p style={{ fontSize: '18px', color: INK, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {f.value}
                </p>
              </div>
            ))}
          </div>

          {/* Quem se da bem / mal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '48px' }}>
            <div style={{ background: SAND, borderRadius: '4px', padding: '28px' }}>
              <p style={{ ...eyebrow, marginBottom: '12px' }}>Quem se da bem aqui</p>
              <p style={{ fontSize: '16px', color: INK, lineHeight: 1.6, margin: 0 }}>{concelho.whoFitsHere}</p>
            </div>
            <div style={{ background: SAND, borderRadius: '4px', padding: '28px' }}>
              <p style={{ ...eyebrow, marginBottom: '12px' }}>Quem nao se da bem aqui</p>
              <p style={{ fontSize: '16px', color: INK, lineHeight: 1.6, margin: 0 }}>{concelho.whoDoesNotFit}</p>
            </div>
          </div>

          {/* Freguesias cobertas */}
          <section style={{ marginBottom: '48px' }}>
            <h2
              className="font-display"
              style={{ fontSize: '26px', fontWeight: 400, color: INK, marginBottom: '8px' }}
            >
              Freguesias cobertas
            </h2>

            {coveredFreguesias.length > 0 ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                  {coveredFreguesias.map(f => (
                    <Link
                      key={f.slug}
                      to={`/freguesia/${f.slug}`}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '16px 20px',
                        background: SAND, borderRadius: '4px',
                        textDecoration: 'none',
                        color: INK,
                        fontSize: '16px',
                      }}
                    >
                      <span className="font-display" style={{ fontWeight: 400 }}>{f.name}</span>
                      <span style={{ color: CLAY, fontSize: '14px' }}>→</span>
                    </Link>
                  ))}
                </div>
                <p style={{ fontSize: '14px', color: STONE, marginTop: '20px', lineHeight: 1.5 }}>
                  Ainda so cobrimos {coveredFreguesias.length} {coveredFreguesias.length === 1 ? 'freguesia' : 'freguesias'} deste concelho. Estamos a caminhar pelas outras.
                </p>
              </>
            ) : (
              <p style={{ fontSize: '16px', color: STONE, lineHeight: 1.5, marginTop: '16px' }}>
                Ainda nao temos cobertura editorial de nenhuma freguesia de {concelho.name}. Estamos a caminhar por elas.
              </p>
            )}
          </section>

          {/* CTA */}
          <Link
            to="/areas"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: CLAY,
              color: 'white',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Ver os imoveis em {concelho.name}
          </Link>

          {/* ── Artigo do guia (conteudo dos ficheiros MD) ────────── */}
          {seoData && (
            <section style={{ marginTop: '64px' }}>
              <hr style={{ border: 'none', borderTop: `1px solid ${HAIRLINE}`, marginBottom: '40px' }} />

              {/* Data de atualizacao visivel */}
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '12px',
                  color: STONE,
                  marginBottom: '32px',
                  letterSpacing: '0.3px',
                }}
              >
                <time dateTime={seoData.lastUpdated}>
                  Atualizado a {formatDate(seoData.lastUpdated)}
                </time>
              </p>

              {/* Corpo do artigo */}
              <div
                className="concelho-article"
                dangerouslySetInnerHTML={{ __html: seoData.bodyHtml }}
              />
            </section>
          )}
        </article>

        {/* PDM */}
        <section className="habitta-px py-16 md:py-20" style={{ background: SAND }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <PdmSection concelhoSlug={slug!} />
          </div>
        </section>

        {/* Projetos urbanos */}
        <section className="habitta-px py-16 md:py-20" style={{ background: BONE }}>
          <UrbanProjectsSection concelhoSlug={slug!} concelhoName={concelho.name} />
        </section>

        {/* ── Concelhos proximos ─────────────────────────────────── */}
        {nearby.length > 0 && (
          <section
            className="habitta-px py-16 md:py-20"
            style={{ background: SAND }}
            aria-label="Concelhos proximos"
          >
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <p style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '2.5px',
                color: CLAY,
                margin: '0 0 20px',
              }}>
                CONCELHOS PROXIMOS
              </p>
              <h2
                className="font-display"
                style={{ fontSize: '26px', fontWeight: 400, color: INK, marginBottom: '24px' }}
              >
                Outros concelhos da {concelho.margem === 'norte' ? 'Margem Norte' : 'Margem Sul'}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {nearby.map(c => (
                  <li key={c.slug}>
                    <Link
                      to={`/concelho/${c.slug}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: BONE,
                        borderRadius: '4px',
                        textDecoration: 'none',
                        color: INK,
                        fontSize: '16px',
                      }}
                    >
                      <div>
                        <span className="font-display" style={{ fontWeight: 400, display: 'block' }}>{c.name}</span>
                        <span style={{ fontSize: '13px', color: STONE, fontStyle: 'italic' }}>{c.oneLine}</span>
                      </div>
                      <span style={{ color: CLAY, fontSize: '14px', flexShrink: 0, marginLeft: '12px' }}>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
