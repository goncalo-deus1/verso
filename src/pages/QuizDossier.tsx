/**
 * QuizDossier.tsx — Resultado do quiz habitta
 *
 * Route: /quiz/dossier
 * Ordem das secções:
 *   § 00 — ZonaHero         (a resposta, above the fold)
 *   § 01 — PorqueEstaZona   (argumento editorial + top-4 variáveis + trade-off)
 *   § 02 — MapaInterativo   (prova: mapa + sliders)
 *   § 03 — AlternativasGrid (3 alternativas)
 *   § 04 — Metodologia      (tabela de variáveis)
 *   § 05 — CtaFinal         (próximos passos)
 *
 * Auth gating:
 *   Anonymous  → zone name + editorial summary visible; everything else blurred + login CTA
 *   Authenticated + no Supabase row → auto-migrate localStorage quiz to Supabase
 *   Authenticated + Supabase row differs from localStorage → QuizConflictModal
 *   Authenticated + Supabase row matches localStorage → normal render, no-op
 *
 * localStorage migration (Step 8) happens here on first authenticated mount.
 */

import { useState, useMemo, useCallback, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { useT } from '../i18n/translations'
import { concelhosAML } from '../data/concelhosAML'
import { getZoneConcelhoId, pickOneLine } from '../data/zones'
import {
  MapaInterativo,
  computeRanking,
  type SliderKey,
  type SliderPrefs,
} from '../components/result/MapaInterativo'
import { ZonaHero }        from '../components/result/ZonaHero'
import { PorqueEstaZona }  from '../components/result/PorqueEstaZona'
import { AlternativasGrid } from '../components/result/AlternativasGrid'
import { Metodologia }     from '../components/result/Metodologia'
import { CtaFinal }        from '../components/result/CtaFinal'
import { QuizConflictModal } from '../components/result/QuizConflictModal'
import { PremiumZoneComparison } from '../components/result/PremiumZoneComparison'
import { getUserQuiz, upsertUserQuiz } from '../lib/supabase/userQuiz'
import { UrbanProjectsSection } from '../components/concelho/UrbanProjectsSection'
import FeedbackModal, { hasFeedbackDone } from '../components/FeedbackModal'
import { getPostsByLocale } from '../lib/blog'
import { BlogPostCard }    from '../components/blog/BlogPostCard'
import type { UserQuiz }   from '../lib/supabase/userQuiz'
import type { QuizResult } from '../lib/quiz/scoring'
import { pickJustification, pickTradeoff } from '../lib/quiz/scoring'
import type { QuizAnswers } from '../lib/quiz/questions'
import { buildProfile } from '../lib/quiz/profileBuilder'
import { hasActivePaidPlan } from '../lib/supabase/entitlements'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initPrefs(vector: Record<string, number>): SliderPrefs {
  return {
    centralidade:   Math.round(vector.centralidade   ?? 50),
    tranquilidade:  Math.round(vector.tranquilidade  ?? 50),
    familiar:       Math.round(vector.familiar       ?? 50),
    acessibilidade: Math.round(vector.acessibilidade ?? 50),
    espaco:         Math.round(vector.espaco         ?? 50),
    mar:            Math.round(vector.mar            ?? 50),
  }
}

/** Canonical equality: sorts top-level keys, preserves q8_priority array order. */
function answersEqual(a: QuizAnswers, b: QuizAnswers): boolean {
  const canon = (obj: QuizAnswers) =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(obj)
          .filter(([, v]) => v !== undefined)
          .sort(([k1], [k2]) => k1.localeCompare(k2)),
      ),
    )
  return canon(a) === canon(b)
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DossierSkeleton() {
  const { lang } = useLang()
  const tr = useT(lang)
  return (
    <div className="min-h-screen bg-verso-paper flex items-center justify-center">
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '24px', height: '24px',
          border: '2px solid rgba(30, 31, 24, 0.125)',
          borderTopColor: '#C2553A', borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ fontSize: '13px', fontFamily: '"JetBrains Mono", monospace', color: '#3A3B2E', letterSpacing: '0.05em' }}>
          {tr('dossier.loading')}
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}

// ─── Gated blur wrapper ───────────────────────────────────────────────────────

function GatedBlur({ children, active }: { children: React.ReactNode; active: boolean }) {
  if (!active) return <>{children}</>
  return (
    <div style={{ filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' }} aria-hidden>
      {children}
    </div>
  )
}

function FreeTopThreeSection({ zones }: { zones: QuizResult['alternatives'] }) {
  const { lang } = useLang()
  const tr = useT(lang)

  return (
    <section
      className="habitta-px py-16 md:py-20"
      style={{ background: '#F2EDE4', borderBottom: '1px solid rgba(30, 31, 24, 0.125)' }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-12 items-start" style={{ marginBottom: '36px' }}>
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C2553A',
              borderTop: '1px solid rgba(30, 31, 24, 0.125)',
              paddingTop: '14px',
            }}
          >
            {tr('dossier.free.eyebrow')}
          </p>
          <div>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(34px, 4.8vw, 58px)',
                lineHeight: 1,
                letterSpacing: '-0.025em',
                color: '#1E1F18',
                fontWeight: 400,
                maxWidth: '720px',
              }}
            >
              {tr('dossier.free.title')}
            </h2>
            <p style={{ marginTop: '18px', color: '#3A3B2E', fontSize: '16px', lineHeight: 1.7, maxWidth: '620px' }}>
              {tr('dossier.free.body')}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3" style={{ gap: '12px' }}>
          {zones.map((zone, index) => (
            <Link
              key={zone.slug}
              to={`/aml/${getZoneConcelhoId(zone.zone)}`}
              style={{
                textDecoration: 'none',
                background: index === 0 ? '#1E1F18' : '#E8E0D0',
                color: index === 0 ? '#F2EDE4' : '#1E1F18',
                border: '1px solid rgba(30, 31, 24, 0.125)',
                padding: '28px',
                minHeight: '260px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'baseline', marginBottom: '26px' }}>
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: index === 0 ? '#C2553A' : '#3A3B2E',
                      opacity: index === 0 ? 1 : 0.65,
                    }}
                  >
                    {tr('dossier.free.rank').replace('{n}', String(index + 1))}
                  </span>
                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '13px',
                      color: index === 0 ? '#F2EDE4' : '#C2553A',
                    }}
                  >
                    {zone.score} / 100
                  </span>
                </div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(28px, 3vw, 38px)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    fontWeight: 400,
                    marginBottom: '18px',
                  }}
                >
                  {zone.zone.name}
                </h3>
                <p style={{ color: index === 0 ? 'rgba(242, 237, 228, 0.72)' : '#3A3B2E', fontSize: '14px', lineHeight: 1.65 }}>
                  {pickJustification(zone, lang)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function DecisionPaywall() {
  const { lang } = useLang()
  const tr = useT(lang)
  const items = [
    tr('dossier.paywall.item.compare'),
    tr('dossier.paywall.item.risks'),
    tr('dossier.paywall.item.budget'),
    tr('dossier.paywall.item.avoid'),
    tr('dossier.paywall.item.pdf'),
  ]

  return (
    <section
      className="habitta-px py-16 md:py-20"
      style={{
        background: '#1E1F18',
        color: '#F2EDE4',
        borderBottom: '1px solid rgba(242, 237, 228, 0.12)',
      }}
    >
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center" style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div>
          <p
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C2553A',
              marginBottom: '18px',
            }}
          >
            {tr('dossier.paywall.eyebrow')}
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(34px, 4.8vw, 58px)',
              lineHeight: 1,
              letterSpacing: '-0.025em',
              fontWeight: 400,
              maxWidth: '620px',
            }}
          >
            {tr('dossier.paywall.title')}
          </h2>
          <p style={{ marginTop: '20px', color: 'rgba(242, 237, 228, 0.62)', fontSize: '16px', lineHeight: 1.7, maxWidth: '540px' }}>
            {tr('dossier.paywall.body')}
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '30px' }}>
            <Link
              to="/entrar?redirect=/quiz/dossier&mode=register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '11px 24px',
                background: '#C2553A',
                color: '#F2EDE4',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {tr('dossier.paywall.primary')}
            </Link>
            <Link
              to="/entrar?redirect=/quiz/dossier"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '11px 24px',
                background: 'transparent',
                color: '#F2EDE4',
                border: '1px solid rgba(242, 237, 228, 0.28)',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              {tr('dossier.paywall.secondary')}
            </Link>
          </div>
        </div>

        <div
          style={{
            border: '1px solid rgba(242, 237, 228, 0.14)',
            background: 'rgba(242, 237, 228, 0.04)',
            padding: '28px',
          }}
        >
          {items.map((item, index) => (
            <div
              key={item}
              style={{
                display: 'grid',
                gridTemplateColumns: '38px 1fr',
                gap: '16px',
                alignItems: 'start',
                padding: '18px 0',
                borderTop: index === 0 ? 'none' : '1px solid rgba(242, 237, 228, 0.12)',
              }}
            >
              <span
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '999px',
                  border: '1px solid rgba(242, 237, 228, 0.22)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                  color: '#C2553A',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p style={{ color: 'rgba(242, 237, 228, 0.78)', fontSize: '15px', lineHeight: 1.6 }}>
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Inner display component (result guaranteed non-null) ─────────────────────

function DossierContent({
  result,
  answers,
  premiumLocked,
}: {
  result:      QuizResult
  answers:     QuizAnswers | null
  premiumLocked: boolean
}) {
  const { setQuizResult } = useQuiz()
  const { lang } = useLang()
  const tr = useT(lang)
  const navigate = useNavigate()
  const { best, alternatives } = result
  const freeTopThree = useMemo(() => [best, ...alternatives].slice(0, 3), [best, alternatives])
  const userProfile = useMemo(() => answers ? buildProfile(answers) : best.vector, [answers, best.vector])

  const [prefs, setPrefs] = useState<SliderPrefs>(() => initPrefs(best.vector))

  const handlePrefChange = useCallback((key: SliderKey, val: number) => {
    setPrefs(prev => ({ ...prev, [key]: val }))
  }, [])

  // Always derive fresh — never trust best.concelhoSlug (can be stale from old Supabase results)
  const bestConcelhoSlug = getZoneConcelhoId(best.zone)

  const sliderRanking = useMemo(() => computeRanking(prefs), [prefs])
  const sliderTop     = sliderRanking[0]
  const isQuizTop     = sliderTop?.slug === bestConcelhoSlug

  const displayData = useMemo(() => {
    if (isQuizTop) {
      return {
        nome:               best.zone.name,
        score:              best.score,
        leituraCurta:       pickJustification(best, lang),
        slug:               best.slug,
        concelhoSlug:       bestConcelhoSlug,
        zoneKind:           (best.zone.kind ?? 'concelho') as 'freguesia' | 'concelho',
        vector:             best.vector,
        tradeoff:           pickTradeoff(best, lang),
        tradeoffConfidence: best.tradeoffConfidence,
      }
    }
    const concelho = concelhosAML.find(c => c.slug === sliderTop?.slug)
    return {
      nome:               sliderTop?.name ?? best.zone.name,
      score:              sliderTop?.score ?? best.score,
      leituraCurta:       (concelho ? pickOneLine(concelho, lang) : '') || pickJustification(best, lang),
      slug:               sliderTop?.slug ?? best.slug,
      concelhoSlug:       sliderTop?.slug ?? bestConcelhoSlug,
      zoneKind:           'concelho' as const,
      vector:             concelho?.profile ?? best.vector,
      tradeoff:           undefined,
      tradeoffConfidence: 'none' as const,
    }
  }, [isQuizTop, sliderTop, best, bestConcelhoSlug, lang])

  function handleRestart() {
    setQuizResult(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-verso-paper">

      {/* § 00 — A resposta */}
      <ZonaHero
        nome={displayData.nome}
        score={displayData.score}
        leituraCurta={displayData.leituraCurta}
        tradeoff={displayData.tradeoff}
        tradeoffConfidence={displayData.tradeoffConfidence}
        slug={displayData.slug}
        concelhoSlug={displayData.concelhoSlug}
        zoneKind={displayData.zoneKind}
      />

      {/* § 01 — Resultado gratuito generoso */}
      <FreeTopThreeSection zones={freeTopThree} />

      {premiumLocked && <DecisionPaywall />}

      {/* §§ 02–06 — decision layer, gated after the free value */}
      <GatedBlur active={premiumLocked}>
        {/* § 02 — Porque esta zona */}
        <PorqueEstaZona
          nome={best.zone.name}
          contributions={best.contributions}
          descricao={pickJustification(best, lang)}
          tradeoff={displayData.tradeoff}
          tradeoffConfidence={displayData.tradeoffConfidence}
        />

        {/* § 03 — A prova: mapa interactivo */}
        <MapaInterativo
          prefs={prefs}
          onPrefsChange={handlePrefChange}
          quizBestConcelhoSlug={displayData.concelhoSlug}
          quizBestScore={best.score}
          zonaNome={displayData.nome}
        />

        {/* § 04 — Alternativas */}
        <AlternativasGrid alternatives={alternatives} />

        {/* § 05 — Comparação premium */}
        <PremiumZoneComparison best={best} userProfile={userProfile} />

        {/* § 06 — Projetos urbanos previstos */}
        {(() => {
          // Derive concelhoSlug fresh from the zone object — ignores stale stored value
          const concelhoSlug = getZoneConcelhoId(best.zone)
          const concelhoName =
            concelhosAML.find(c => c.slug === concelhoSlug)?.name ??
            best.zone.name
          const freguesiaSlug =
            best.zone.kind === 'freguesia' ? best.slug : null
          return (
            <section className="habitta-px py-16 md:py-20" style={{ background: 'var(--linho)' }}>
              <UrbanProjectsSection
                concelhoSlug={concelhoSlug}
                concelhoName={concelhoName}
                freguesiaSlug={freguesiaSlug}
                eyebrowOverride={tr('dossier.whatsComing')}
                titleOverride={tr('dossier.prepIn').replace('{name}', concelhoName)}
                subtitleOverride={tr('dossier.urbanSub')}
              />
            </section>
          )
        })()}

        {/* § 07 — Metodologia */}
        <Metodologia onRestart={handleRestart} />

        {/* § 08 — Próximos passos */}
        <CtaFinal
          nome={best.zone.name}
          slug={best.slug}
          zoneKind={(best.zone.kind ?? 'concelho') as 'freguesia' | 'concelho'}
          onRestart={handleRestart}
          showRefazer={!premiumLocked}
        />
      </GatedBlur>

      {/* § 06 — Para ler a seguir (sempre visível) */}
      {(() => {
        // Mostra posts no idioma activo (fallback para PT seria possível se
        // não houvesse posts em EN, mas o blog está em ambas as línguas).
        const recentPosts = getPostsByLocale(lang).slice(0, 2)
        if (recentPosts.length === 0) return null
        return (
          <section
            style={{
              background: 'var(--verso-bone, #F2EDE4)',
              padding: '72px 24px 80px',
            }}
          >
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <p
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '2.5px',
                  color: '#C2553A',
                  marginBottom: '20px',
                  textAlign: 'center',
                }}
              >
                {tr('dossier.readNext')}
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px',
                }}
              >
                {recentPosts.map(post => (
                  <BlogPostCard key={post.meta.slug} post={post} />
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Link
                  to="/blog"
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    color: '#1E1F18',
                    textDecoration: 'none',
                    opacity: 0.5,
                  }}
                >
                  {tr('dossier.viewAllPosts')}
                </Link>
              </div>
            </div>
          </section>
        )
      })()}
    </div>
  )
}

// ─── Outer component: auth + Supabase layer ───────────────────────────────────

export default function QuizDossier() {
  const { quizResult, quizAnswers, setQuizResult, setQuizAnswers } = useQuiz()
  const { user, loading: authLoading } = useAuth()
  const userId = user?.id

  const [savedQuiz,      setSavedQuiz]      = useState<UserQuiz | null>(null)
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [hasPaidPlan,     setHasPaidPlan]     = useState(false)
  const [planLoading,     setPlanLoading]     = useState(false)
  const [conflictState,  setConflictState]  = useState<'none' | 'waiting'>('none')
  const [feedbackOpen,   setFeedbackOpen]   = useState(false)

  // Show feedback popup after 4 s if never submitted
  useEffect(() => {
    if (hasFeedbackDone()) return
    const t = setTimeout(() => setFeedbackOpen(true), 4000)
    return () => clearTimeout(t)
  }, [])

  // ─── Supabase: fetch + sync / migrate (Steps 6 + 8) ─────────────────────────
  useEffect(() => {
    if (!userId) return

    let cancelled = false
    setSupabaseLoading(true)

    getUserQuiz(userId)
      .then(saved => {
        if (cancelled) return
        setSavedQuiz(saved)
        setSupabaseLoading(false)

        if (!saved) {
          // No Supabase row — migrate localStorage quiz if present (Step 8)
          if (quizAnswers && quizResult) {
            upsertUserQuiz(userId, quizAnswers, quizResult).catch(console.error)
          }
        } else if (quizAnswers && !answersEqual(quizAnswers, saved.answers)) {
          // Row exists and differs from localStorage — show conflict modal (Step 6)
          setConflictState('waiting')
        }
        // If equal or no local answers → no-op
      })
      .catch(() => { if (!cancelled) setSupabaseLoading(false) })

    return () => { cancelled = true }
  }, [userId, quizAnswers, quizResult])

  // ─── Supabase: paid plan entitlement ──────────────────────────────────────
  useEffect(() => {
    if (!userId) {
      setHasPaidPlan(false)
      setPlanLoading(false)
      return
    }

    let cancelled = false
    setPlanLoading(true)

    hasActivePaidPlan()
      .then(active => {
        if (cancelled) return
        setHasPaidPlan(active)
        setPlanLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setHasPaidPlan(false)
        setPlanLoading(false)
      })

    return () => { cancelled = true }
  }, [userId])

  // ─── Conflict modal handlers ──────────────────────────────────────────────

  function handleKeepSaved() {
    if (!savedQuiz) return
    // Overwrite localStorage with the saved Supabase version
    setQuizResult(savedQuiz.result)
    setQuizAnswers(savedQuiz.answers)
    setConflictState('none')
  }

  async function handleReplaceWithNew() {
    if (!user || !quizAnswers || !quizResult) return
    await upsertUserQuiz(user.id, quizAnswers, quizResult).catch(console.error)
    setSavedQuiz(null) // clear local reference; context already has the new result
    setConflictState('none')
  }

  // ─── Derive effective result ──────────────────────────────────────────────

  // After "Keep saved": quizResult in context is updated to savedQuiz.result.
  // After "Replace":    quizResult in context already holds the new result.
  // During conflict:    show the current context result (new quiz) behind the modal.
  const effectiveResult: QuizResult | null = quizResult ?? savedQuiz?.result ?? null
  const effectiveAnswers: QuizAnswers | null = quizAnswers ?? savedQuiz?.answers ?? null

  const premiumLocked = !user || !hasPaidPlan

  // Show skeleton only when: auth still loading, OR authenticated + fetching Supabase + nothing in context
  const isLoading = authLoading || (!!user && (planLoading || supabaseLoading) && !effectiveResult)

  // ─── Guards (after all hooks) ─────────────────────────────────────────────

  if (isLoading) return <DossierSkeleton />

  if (!effectiveResult) return <Navigate to="/" replace />

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {conflictState === 'waiting' && (
        <QuizConflictModal
          variant="conflict"
          onPrimary={handleReplaceWithNew}
          onSecondary={handleKeepSaved}
        />
      )}
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        source="quiz"
      />
      <DossierContent
        result={effectiveResult}
        answers={effectiveAnswers}
        premiumLocked={premiumLocked}
      />
    </>
  )
}
