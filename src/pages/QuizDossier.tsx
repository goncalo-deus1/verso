/**
 * QuizDossier.tsx — Resultado do quiz Habitta
 *
 * Route: /quiz/dossier
 * Ordem das secções (answer-first):
 *   § 00 — ZonaHero         (a resposta, above the fold)
 *   § 01 — PorqueEstaZona   (argumento editorial + top-4 variáveis + trade-off)
 *   § 02 — MapaInterativo   (prova: mapa + sliders)
 *   § 03 — AlternativasGrid (3 alternativas)
 *   § 04 — Metodologia      (tabela de variáveis)
 *   § 05 — CtaFinal         (próximos passos)
 *
 * Estado dos sliders é owned aqui para que ZonaHero reaja em tempo real.
 */

import { useState, useMemo, useCallback } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { concelhosAML } from '../data/concelhosAML'
import {
  MapaInterativo,
  computeRanking,
  type SliderKey,
  type SliderPrefs,
} from '../components/result/MapaInterativo'
import { ZonaHero } from '../components/result/ZonaHero'
import { PorqueEstaZona } from '../components/result/PorqueEstaZona'
import { AlternativasGrid } from '../components/result/AlternativasGrid'
import { Metodologia } from '../components/result/Metodologia'
import { CtaFinal } from '../components/result/CtaFinal'

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

// ─── Componente ───────────────────────────────────────────────────────────────

export default function QuizDossier() {
  const { quizResult, setQuizResult } = useQuiz()
  const navigate = useNavigate()

  if (!quizResult) {
    return <Navigate to="/" replace />
  }

  const { best, alternatives, lowScoreWarning: _warn } = quizResult

  // Sliders: inicializados a partir do vector da melhor zona
  const [prefs, setPrefs] = useState<SliderPrefs>(() => initPrefs(best.vector))

  const handlePrefChange = useCallback((key: SliderKey, val: number) => {
    setPrefs(prev => ({ ...prev, [key]: val }))
  }, [])

  // Ranking reactivo aos sliders
  const sliderRanking = useMemo(() => computeRanking(prefs), [prefs])
  const sliderTop = sliderRanking[0]

  // Zona de exibição: se o topo do slider = zona do quiz, usa dados editoriais do quiz
  const isQuizTop = sliderTop?.slug === best.concelhoSlug

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
        descricao:          best.justification,
        tradeoff:           best.tradeoff,
        tradeoffConfidence: best.tradeoffConfidence,
      }
    }
    // Slider top é diferente da zona do quiz — usa dados do concelhosAML
    const concelho = concelhosAML.find(c => c.slug === sliderTop?.slug)
    return {
      nome:               sliderTop?.name ?? best.zone.name,
      score:              sliderTop?.score ?? best.score,
      leituraCurta:       concelho?.oneLine ?? best.justification,
      slug:               sliderTop?.slug ?? best.slug,
      concelhoSlug:       sliderTop?.slug ?? best.concelhoSlug,
      zoneKind:           'concelho' as const,
      vector:             concelho?.profile ?? best.vector,
      descricao:          concelho?.shortDescription ?? best.justification,
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

      {/* § 01 — Porque esta zona */}
      <PorqueEstaZona
        nome={displayData.nome}
        vector={displayData.vector}
        descricao={displayData.descricao}
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

      {/* § 04 — Metodologia */}
      <Metodologia onRestart={handleRestart} />

      {/* § 05 — Próximos passos */}
      <CtaFinal
        nome={best.zone.name}
        slug={best.slug}
        zoneKind={(best.zone.kind ?? 'concelho') as 'freguesia' | 'concelho'}
        onRestart={handleRestart}
      />
    </div>
  )
}
