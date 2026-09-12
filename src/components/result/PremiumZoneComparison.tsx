import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Scale, Trophy } from 'lucide-react'
import { ATTRIBUTES, getAttributeLabel, type Attribute, type ZoneProfile } from '../../data/attributes'
import { concelhosAML, type ConcelhoAML } from '../../data/concelhosAML'
import { getZoneConcelhoId } from '../../data/zones'
import { pickJustification, pickTradeoff, type ScoredZone } from '../../lib/quiz/scoring'
import { useLang } from '../../context/LanguageContext'

const HAIRLINE = 'rgba(30, 31, 24, 0.125)'

type ComparisonPoint = {
  attr: Attribute
  delta: number
  text: string
}

function profileScore(profile: ZoneProfile, target: ZoneProfile): number {
  const distance = Math.sqrt(
    ATTRIBUTES.reduce((sum, attr) => {
      const diff = profile[attr] - target[attr]
      return sum + diff * diff
    }, 0) / ATTRIBUTES.length,
  )
  return Math.max(0, Math.round(100 * (1 - distance / 100)))
}

function priceRange(zone: Pick<ConcelhoAML, 'budgetFitT2'>): string {
  if (!zone.budgetFitT2) return 'A confirmar'
  return `${zone.budgetFitT2.min.toLocaleString('pt-PT')}€ a ${zone.budgetFitT2.max.toLocaleString('pt-PT')}€`
}

function strongerPoints(
  candidate: { name: string; profile: ZoneProfile },
  other: { profile: ZoneProfile },
  userProfile: ZoneProfile,
  lang: 'pt' | 'en',
): ComparisonPoint[] {
  return ATTRIBUTES
    .map(attr => {
      const candidateFit = 100 - Math.abs(userProfile[attr] - candidate.profile[attr])
      const otherFit = 100 - Math.abs(userProfile[attr] - other.profile[attr])
      const delta = Math.round(candidateFit - otherFit)
      const label = getAttributeLabel(attr, lang)
      return {
        attr,
        delta,
        text: lang === 'en'
          ? `${candidate.name} is stronger on ${label.toLowerCase()} for this profile.`
          : `${candidate.name} encaixa melhor em ${label.toLowerCase()} para este perfil.`,
      }
    })
    .filter(point => point.delta >= 8)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3)
}

function weakerPoints(
  candidate: { name: string; profile: ZoneProfile },
  other: { name: string; profile: ZoneProfile },
  userProfile: ZoneProfile,
  lang: 'pt' | 'en',
): ComparisonPoint[] {
  return ATTRIBUTES
    .map(attr => {
      const candidateFit = 100 - Math.abs(userProfile[attr] - candidate.profile[attr])
      const otherFit = 100 - Math.abs(userProfile[attr] - other.profile[attr])
      const delta = Math.round(otherFit - candidateFit)
      const label = getAttributeLabel(attr, lang)
      return {
        attr,
        delta,
        text: lang === 'en'
          ? `${other.name} protects ${label.toLowerCase()} better.`
          : `${other.name} protege melhor ${label.toLowerCase()}.`,
      }
    })
    .filter(point => point.delta >= 8)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 3)
}

function decide(scoreA: number, scoreB: number, aName: string, bName: string, lang: 'pt' | 'en') {
  const diff = scoreA - scoreB
  if (Math.abs(diff) <= 3) {
    return {
      winner: lang === 'en' ? 'Tie' : 'Empate técnico',
      text: lang === 'en'
        ? `Both options are close for this profile. Decide by street, commute and property quality.`
        : `As duas opções estão muito próximas para este perfil. Decide por rua, deslocação real e qualidade do imóvel.`,
    }
  }

  const winner = diff > 0 ? aName : bName
  return {
    winner,
    text: lang === 'en'
      ? `${winner} is the cleaner decision for this profile, unless a specific property changes the equation.`
      : `${winner} é a decisão mais limpa para este perfil, a não ser que um imóvel específico mude a equação.`,
  }
}

function PointList({
  title,
  items,
  fallback,
  tone,
}: {
  title: string
  items: ComparisonPoint[]
  fallback: string
  tone: 'good' | 'watch'
}) {
  const Icon = tone === 'good' ? CheckCircle2 : AlertTriangle
  const color = tone === 'good' ? '#6B7A5A' : '#C2553A'

  return (
    <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Icon size={16} color={color} />
        <h3
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#1E1F18',
          }}
        >
          {title}
        </h3>
      </div>
      {items.length > 0 ? (
        <ul style={{ display: 'grid', gap: 12 }}>
          {items.map(item => (
            <li key={item.attr} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12, alignItems: 'start' }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  border: `1px solid ${HAIRLINE}`,
                  color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 9,
                }}
              >
                +{item.delta}
              </span>
              <span style={{ color: '#3A3B2E', fontSize: 14, lineHeight: 1.6 }}>{item.text}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#3A3B2E', fontSize: 14, lineHeight: 1.6 }}>{fallback}</p>
      )}
    </div>
  )
}

type Props = {
  best: ScoredZone
  userProfile: ZoneProfile
}

export function PremiumZoneComparison({ best, userProfile }: Props) {
  const { lang } = useLang()
  const bestConcelhoSlug = getZoneConcelhoId(best.zone)
  const bestConcelho = concelhosAML.find(c => c.slug === bestConcelhoSlug) ?? concelhosAML[0]

  const defaultTarget = useMemo(() => {
    if (bestConcelhoSlug === 'lisboa' && concelhosAML.some(c => c.slug === 'oeiras')) return 'oeiras'
    return concelhosAML.find(c => c.slug !== bestConcelhoSlug)?.slug ?? bestConcelhoSlug
  }, [bestConcelhoSlug])

  const [targetSlug, setTargetSlug] = useState(defaultTarget)
  const target = concelhosAML.find(c => c.slug === targetSlug) ?? concelhosAML.find(c => c.slug !== bestConcelhoSlug) ?? bestConcelho

  const bestScore = bestConcelho.slug === bestConcelhoSlug ? best.score : profileScore(userProfile, bestConcelho.profile)
  const targetScore = profileScore(userProfile, target.profile)
  const decision = decide(bestScore, targetScore, bestConcelho.name, target.name, lang)
  const bestPros = strongerPoints(bestConcelho, target, userProfile, lang)
  const targetPros = strongerPoints(target, bestConcelho, userProfile, lang)
  const bestCons = weakerPoints(bestConcelho, target, userProfile, lang)
  const targetCons = weakerPoints(target, bestConcelho, userProfile, lang)

  return (
    <section className="habitta-px py-16 md:py-20" style={{ background: '#F2EDE4', borderBottom: `1px solid ${HAIRLINE}` }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div className="grid lg:grid-cols-[260px_1fr] gap-10 lg:gap-16 items-start" style={{ marginBottom: 40 }}>
          <div
            style={{
              borderTop: `1px solid ${HAIRLINE}`,
              paddingTop: 16,
              color: '#C2553A',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            {lang === 'en' ? 'Premium comparison' : 'Comparação premium'}
          </div>

          <div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
              <Scale size={24} color="#C2553A" />
              <select
                value={targetSlug}
                onChange={event => setTargetSlug(event.target.value)}
                aria-label={lang === 'en' ? 'Area to compare' : 'Zona a comparar'}
                style={{
                  minWidth: 220,
                  border: `1px solid ${HAIRLINE}`,
                  background: '#E8E0D0',
                  color: '#1E1F18',
                  padding: '10px 12px',
                  borderRadius: 4,
                  fontSize: 14,
                }}
              >
                {concelhosAML
                  .filter(c => c.slug !== bestConcelhoSlug)
                  .map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            <h2
              className="font-display"
              style={{
                color: '#1E1F18',
                fontSize: 'clamp(36px, 5vw, 64px)',
                lineHeight: 1,
                letterSpacing: '-0.025em',
                fontWeight: 400,
                maxWidth: 760,
              }}
            >
              {bestConcelho.name} vs. <em style={{ color: '#C2553A', fontStyle: 'italic' }}>{target.name}</em>
            </h2>
            <p style={{ marginTop: 18, color: '#3A3B2E', fontSize: 16, lineHeight: 1.7, maxWidth: 680 }}>
              {lang === 'en'
                ? 'A direct read of what each municipality gives you, what it asks in return, and which choice is stronger for the quiz profile.'
                : 'Uma leitura direta do que cada concelho te dá, do que pede em troca, e qual é a decisão mais forte para o perfil do quiz.'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
          {[bestConcelho, target].map((zone, index) => {
            const isBest = index === 0
            const score = isBest ? bestScore : targetScore
            const pros = isBest ? bestPros : targetPros
            const cons = isBest ? bestCons : targetCons
            return (
              <article
                key={zone.slug}
                style={{
                  background: isBest ? '#1E1F18' : '#E8E0D0',
                  color: isBest ? '#F2EDE4' : '#1E1F18',
                  border: `1px solid ${isBest ? '#1E1F18' : HAIRLINE}`,
                  padding: 28,
                  display: 'grid',
                  gap: 24,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start' }}>
                  <div>
                    <p
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 10,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: isBest ? '#C2553A' : '#3A3B2E',
                        marginBottom: 10,
                      }}
                    >
                      {isBest ? (lang === 'en' ? 'Quiz result' : 'Resultado do quiz') : (lang === 'en' ? 'Compared option' : 'Opção comparada')}
                    </p>
                    <h3 className="font-display" style={{ fontSize: 38, lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 400 }}>
                      {zone.name}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-display" style={{ fontSize: 48, lineHeight: 1, color: isBest ? '#F2EDE4' : '#C2553A' }}>
                      {score}
                    </div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, opacity: 0.65 }}>/100</div>
                  </div>
                </div>

                <p style={{ color: isBest ? 'rgba(242, 237, 228, 0.72)' : '#3A3B2E', fontSize: 14, lineHeight: 1.65 }}>
                  {isBest ? pickJustification(best, lang) : zone.oneLine}
                </p>

                <div className="grid sm:grid-cols-2 gap-3" style={{ color: isBest ? '#F2EDE4' : '#1E1F18' }}>
                  <div style={{ borderTop: `1px solid ${isBest ? 'rgba(242, 237, 228, 0.16)' : HAIRLINE}`, paddingTop: 14 }}>
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>
                      T2
                    </p>
                    <p style={{ fontSize: 14 }}>{priceRange(zone)}</p>
                  </div>
                  <div style={{ borderTop: `1px solid ${isBest ? 'rgba(242, 237, 228, 0.16)' : HAIRLINE}`, paddingTop: 14 }}>
                    <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>
                      {lang === 'en' ? 'Transport' : 'Transporte'}
                    </p>
                    <p style={{ fontSize: 14 }}>{zone.transport}</p>
                  </div>
                </div>

                <div style={{ background: isBest ? '#F2EDE4' : '#F8F4EC', color: '#1E1F18', padding: 22, display: 'grid', gap: 22 }}>
                  <PointList
                    title={lang === 'en' ? 'Pros for your profile' : 'Prós para o teu perfil'}
                    items={pros}
                    fallback={lang === 'en' ? 'No clear advantage here versus the other option.' : 'Não há vantagem clara aqui face à outra opção.'}
                    tone="good"
                  />
                  <PointList
                    title={lang === 'en' ? 'Watch-outs' : 'Contras a ponderar'}
                    items={cons}
                    fallback={lang === 'en' ? 'No major penalty appears in the profile comparison.' : 'Não aparece uma penalização forte na comparação de perfil.'}
                    tone="watch"
                  />
                </div>
              </article>
            )
          })}
        </div>

        <div
          style={{
            marginTop: 16,
            background: '#1E1F18',
            color: '#F2EDE4',
            border: '1px solid rgba(242, 237, 228, 0.14)',
            padding: 28,
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 18,
            alignItems: 'start',
          }}
        >
          <Trophy size={22} color="#C2553A" />
          <div>
            <p
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#C2553A',
                marginBottom: 8,
              }}
            >
              {lang === 'en' ? 'Best decision' : 'Melhor decisão'}
            </p>
            <h3 className="font-display" style={{ fontSize: 34, lineHeight: 1.05, fontWeight: 400, marginBottom: 10 }}>
              {decision.winner}
            </h3>
            <p style={{ color: 'rgba(242, 237, 228, 0.72)', fontSize: 15, lineHeight: 1.7, maxWidth: 720 }}>
              {decision.text}
            </p>
            {pickTradeoff(best, lang) && (
              <p style={{ color: 'rgba(242, 237, 228, 0.56)', fontSize: 13, lineHeight: 1.6, marginTop: 14, maxWidth: 760 }}>
                {lang === 'en' ? 'Main trade-off from the quiz: ' : 'Trade-off principal do quiz: '}
                {pickTradeoff(best, lang)}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
