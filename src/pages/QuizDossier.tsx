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
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { useAuth } from '../context/AuthContext'
import { concelhosAML } from '../data/concelhosAML'
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
import { getUserQuiz, upsertUserQuiz } from '../lib/supabase/userQuiz'
import { UrbanProjectsSection } from '../components/concelho/UrbanProjectsSection'
import type { UserQuiz }   from '../lib/supabase/userQuiz'
import type { QuizResult } from '../lib/quiz/scoring'
import type { QuizAnswers } from '../lib/quiz/questions'

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
          A carregar…
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

// ─── Inner display component (result guaranteed non-null) ─────────────────────

function DossierContent({
  result,
  isAnonymous,
}: {
  result:      QuizResult
  isAnonymous: boolean
}) {
  const { setQuizResult } = useQuiz()
  const navigate = useNavigate()
  const { best, alternatives } = result

  const [prefs, setPrefs] = useState<SliderPrefs>(() => initPrefs(best.vector))

  const handlePrefChange = useCallback((key: SliderKey, val: number) => {
    setPrefs(prev => ({ ...prev, [key]: val }))
  }, [])

  const sliderRanking = useMemo(() => computeRanking(prefs), [prefs])
  const sliderTop     = sliderRanking[0]
  const isQuizTop     = sliderTop?.slug === best.concelhoSlug

  const displayData = useMemo(() => {
    if (isQuizTop) {
      return {
        nome:               best.zone.name,
        score:              best.score,
        leituraCurta:       best.justification,
        slug:               best.slug,
        concelhoSlug:       best.concelhoSlug,
        zoneKind:           (best.zone.kind ?? 'concelho') as 'freguesia' | 'concelho',
        vector:             best.vector,
        tradeoff:           best.tradeoff,
        tradeoffConfidence: best.tradeoffConfidence,
      }
    }
    const concelho = concelhosAML.find(c => c.slug === sliderTop?.slug)
    return {
      nome:               sliderTop?.name ?? best.zone.name,
      score:              sliderTop?.score ?? best.score,
      leituraCurta:       concelho?.oneLine ?? best.justification,
      slug:               sliderTop?.slug ?? best.slug,
      concelhoSlug:       sliderTop?.slug ?? best.concelhoSlug,
      zoneKind:           'concelho' as const,
      vector:             concelho?.profile ?? best.vector,
      tradeoff:           undefined,
      tradeoffConfidence: 'none' as const,
    }
  }, [isQuizTop, sliderTop, best])

  function handleRestart() {
    setQuizResult(null)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-verso-paper">

      {/* § 00 — A resposta (nome + summary always visible; score/map/CTAs gated) */}
      <ZonaHero
        nome={displayData.nome}
        score={displayData.score}
        leituraCurta={displayData.leituraCurta}
        tradeoff={displayData.tradeoff}
        tradeoffConfidence={displayData.tradeoffConfidence}
        slug={displayData.slug}
        concelhoSlug={displayData.concelhoSlug}
        zoneKind={displayData.zoneKind}
        isGated={isAnonymous}
      />

      {/* §§ 01–05 — fully blurred for anonymous users */}
      <GatedBlur active={isAnonymous}>
        {/* § 01 — Porque esta zona */}
        <PorqueEstaZona
          nome={best.zone.name}
          contributions={best.contributions}
          descricao={best.justification}
          tradeoff={displayData.tradeoff}
          tradeoffConfidence={displayData.tradeoffConfidence}
        />

        {/* § 02 — A prova: mapa interactivo */}
        <MapaInterativo
          prefs={prefs}
          onPrefsChange={handlePrefChange}
          quizBestConcelhoSlug={best.concelhoSlug}
          quizBestScore={best.score}
          zonaNome={displayData.nome}
        />

        {/* § 03 — Alternativas */}
        <AlternativasGrid alternatives={alternatives} />

        {/* § 03b — Projetos urbanos previstos */}
        {(() => {
          const concelhoName =
            concelhosAML.find(c => c.slug === best.concelhoSlug)?.name ??
            best.zone.name
          const freguesiaSlug =
            best.zone.kind === 'freguesia' ? best.slug : null
          return (
            <section className="habitta-px py-16 md:py-20" style={{ background: 'var(--linho)' }}>
              <UrbanProjectsSection
                concelhoSlug={best.concelhoSlug}
                concelhoName={concelhoName}
                freguesiaSlug={freguesiaSlug}
                eyebrowOverride="O que vem aí na tua zona"
                titleOverride={`O que se prepara em ${concelhoName}`}
                subtitleOverride="Investimentos públicos e projetos urbanos que poderão alterar a vida nesta zona ao longo dos próximos anos. Inclui obras em curso e já concluídas."
              />
            </section>
          )
        })()}

        {/* § 04 — Metodologia */}
        <Metodologia onRestart={handleRestart} />

        {/* § 05 — Próximos passos */}
        <CtaFinal
          nome={best.zone.name}
          slug={best.slug}
          zoneKind={(best.zone.kind ?? 'concelho') as 'freguesia' | 'concelho'}
          onRestart={handleRestart}
          showRefazer={!isAnonymous}
        />
      </GatedBlur>
    </div>
  )
}

// ─── Outer component: auth + Supabase layer ───────────────────────────────────

export default function QuizDossier() {
  const { quizResult, quizAnswers, setQuizResult, setQuizAnswers } = useQuiz()
  const { user, loading: authLoading } = useAuth()

  const [savedQuiz,      setSavedQuiz]      = useState<UserQuiz | null>(null)
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  // 'none' = no conflict; 'waiting' = modal is open
  const [conflictState,  setConflictState]  = useState<'none' | 'waiting'>('none')

  // ─── Supabase: fetch + sync / migrate (Steps 6 + 8) ─────────────────────────
  useEffect(() => {
    if (!user) return

    let cancelled = false
    setSupabaseLoading(true)

    getUserQuiz(user.id)
      .then(saved => {
        if (cancelled) return
        setSavedQuiz(saved)
        setSupabaseLoading(false)

        if (!saved) {
          // No Supabase row — migrate localStorage quiz if present (Step 8)
          if (quizAnswers && quizResult) {
            upsertUserQuiz(user.id, quizAnswers, quizResult).catch(console.error)
          }
        } else if (quizAnswers && !answersEqual(quizAnswers, saved.answers)) {
          // Row exists and differs from localStorage — show conflict modal (Step 6)
          setConflictState('waiting')
        }
        // If equal or no local answers → no-op
      })
      .catch(() => { if (!cancelled) setSupabaseLoading(false) })

    return () => { cancelled = true }
  }, [user?.id]) // re-runs only when user identity changes (login / logout)

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

  const isAnonymous = !authLoading && !user

  // Show skeleton only when: auth still loading, OR authenticated + fetching Supabase + nothing in context
  const isLoading = authLoading || (!!user && supabaseLoading && !effectiveResult)

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
      <DossierContent
        result={effectiveResult}
        isAnonymous={isAnonymous}
      />
    </>
  )
}
