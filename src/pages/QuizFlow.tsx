/**
 * QuizFlow.tsx — Quiz VERSO
 *
 * 7 estados internos (sem mudança de rota durante o quiz):
 * welcome → q1 → q2 → q3 → q4 → q5 → loading → result
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { scoreAnswers, type QuizAnswers, type Recommendation } from '../lib/quiz/scoring'
import { freguesias } from '../data/freguesias'
import { concelhos } from '../data/concelhos'

// ─── Tipos internos ───────────────────────────────────────────────────────────

type Screen = 'welcome' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'loading' | 'result'

type PartialAnswers = Partial<QuizAnswers>

// ─── Dados das perguntas ─────────────────────────────────────────────────────

const Q1_OPTIONS = [
  { value: 'quiet',         label: 'Calma o suficiente para ouvir os elétricos' },
  { value: 'gentle-bustle', label: 'Com algum movimento — fila na pastelaria, entrada de escola' },
  { value: 'full-engine',   label: 'Em pleno motor — cafés, trânsito, gente já atrasada' },
] as const

const Q2_OPTIONS = [
  { value: 'walking',  label: 'À distância de uma caminhada — quero viver lá dentro' },
  { value: 'one-ride', label: 'A uma viagem de metro, elétrico ou comboio — perto que chegue, longe que chegue' },
  { value: 'further',  label: 'Mais afastado — troco o trajeto por espaço e verde' },
] as const

const Q3_OPTIONS = [
  { value: 'market',       label: 'Mercado, depois um almoço longo lá fora' },
  { value: 'coast',        label: 'Linha de costa, um mergulho, em casa às seis' },
  { value: 'culture',      label: 'Museus, livrarias, um copo de vinho' },
  { value: 'hosting',      label: 'A receber amigos — a minha casa é o ponto' },
  { value: 'weekend-away', label: 'Fora da cidade às dez, de volta no domingo à noite' },
] as const

const Q4_OPTIONS = [
  { value: 'smaller-for-street',       label: 'Menos metros quadrados por uma rua melhor' },
  { value: 'longer-commute-for-space', label: 'Mais tempo de trajeto por mais luz e ar' },
  { value: 'pay-more-for-walkable',    label: 'Renda mais alta por estar a pé de tudo' },
  { value: 'quieter-for-family',       label: 'Uma cena mais calma por uma casa que caiba à família toda' },
] as const

const Q5_OPTIONS = [
  { value: 'first-home',    label: 'Sozinho ou a dois, primeira casa a sério' },
  { value: 'family',        label: 'Família com filhos em casa' },
  { value: 'downsizing',    label: 'Filhos crescidos, a repensar o espaço' },
  { value: 'relocating',    label: 'A mudar-me para a cidade' },
  { value: 'prefer-not-say', label: 'Prefiro não dizer' },
] as const

// ─── Estilos base ─────────────────────────────────────────────────────────────

const INK      = '#0E1116'
const BONE     = '#F5F1EA'
const CLAY     = '#B8624A'
const MOSS     = '#3E5A48'
const SAND     = '#E6DDCD'
const STONE    = '#6B6B68'
const HAIRLINE = '#D9D2C3'

// ─── Componente de opção ──────────────────────────────────────────────────────

function Option({
  label,
  selected,
  onSelect,
  focusRef,
}: {
  label: string
  selected: boolean
  onSelect: () => void
  focusRef?: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <button
      ref={focusRef}
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '20px 24px',
        background: BONE,
        border: selected ? `1px solid ${INK}` : `1px solid ${HAIRLINE}`,
        borderLeft: selected ? `4px solid ${CLAY}` : `4px solid transparent`,
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '17px',
        lineHeight: '1.5',
        color: INK,
        transition: 'border-color 150ms ease',
        outline: 'none',
      }}
      onMouseEnter={e => {
        if (!selected) e.currentTarget.style.borderColor = CLAY
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = HAIRLINE
          e.currentTarget.style.borderLeftColor = 'transparent'
        }
      }}
      onFocus={e => {
        e.currentTarget.style.outline = `2px solid ${CLAY}`
        e.currentTarget.style.outlineOffset = '2px'
      }}
      onBlur={e => {
        e.currentTarget.style.outline = 'none'
      }}
    >
      {label}
    </button>
  )
}

// ─── Componente de progresso ──────────────────────────────────────────────────

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <p style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2.5px',
      color: CLAY,
      margin: '0 0 32px',
    }}>
      {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </p>
  )
}

// ─── Ecrã de boas-vindas ──────────────────────────────────────────────────────

function WelcomeScreen({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  return (
    <div style={{ maxWidth: '560px' }}>
      <h1
        className="font-display"
        style={{ fontSize: 'clamp(40px, 8vw, 72px)', lineHeight: 1.05, color: INK, marginBottom: '24px', fontWeight: 400 }}
      >
        Começa com o sítio.
      </h1>
      <p style={{ fontSize: '20px', fontStyle: 'italic', color: MOSS, lineHeight: 1.6, marginBottom: '48px' }}>
        Cinco perguntas. Dois minutos. Depois mostramos-te onde procurar.
      </p>
      <button
        onClick={onStart}
        style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: CLAY,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.3px',
          marginBottom: '20px',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        Começar
      </button>
      <div>
        <button
          onClick={onSkip}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: STONE, fontSize: '14px', textDecoration: 'underline', padding: 0,
          }}
        >
          Já sei onde quero viver — saltar
        </button>
      </div>
    </div>
  )
}

// ─── Ecrã de resultado ────────────────────────────────────────────────────────

function ResultCard({ rec }: { rec: Recommendation }) {
  const href = rec.kind === 'freguesia' ? `/freguesia/${rec.slug}` : `/concelho/${rec.slug}`
  return (
    <div style={{
      background: SAND,
      borderRadius: '4px',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {rec.concelhoName && (
        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2.5px', color: CLAY, margin: 0 }}>
          {rec.kind === 'freguesia' ? `Freguesia · ${rec.concelhoName.toUpperCase()}` : `CONCELHO`}
        </p>
      )}
      {!rec.concelhoName && (
        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2.5px', color: CLAY, margin: 0 }}>
          CONCELHO
        </p>
      )}
      <h2 className="font-display" style={{ fontSize: '28px', fontWeight: 400, color: INK, margin: 0, lineHeight: 1.1 }}>
        {rec.name}
      </h2>
      <p style={{ fontSize: '15px', color: STONE, margin: 0, lineHeight: 1.5 }}>
        {rec.oneLine}
      </p>
      <p style={{ fontSize: '15px', fontStyle: 'italic', color: MOSS, margin: 0, lineHeight: 1.5 }}>
        Porque disseste… {rec.matchReason}
      </p>
      <Link
        to={href}
        style={{
          color: CLAY, fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          marginTop: '4px', letterSpacing: '0.2px',
        }}
      >
        Conhecer esta zona →
      </Link>
    </div>
  )
}

function ResultScreen({
  recommendations,
  onRestart,
}: {
  recommendations: Recommendation[]
  onRestart: () => void
}) {
  return (
    <div style={{ maxWidth: '680px', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
        {recommendations.map(rec => <ResultCard key={rec.slug} rec={rec} />)}
      </div>

      {/* Pull quote */}
      <blockquote style={{
        borderLeft: `3px solid ${CLAY}`,
        paddingLeft: '20px',
        margin: '0 0 40px',
        fontStyle: 'italic',
        color: MOSS,
        fontSize: '17px',
        lineHeight: 1.6,
      }}>
        Isto é um começo, não um veredicto. Caminha por algumas destas ruas e diz-nos o que te soube a casa.
      </blockquote>

      {/* Acções */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
        <Link
          to="/imoveis"
          style={{
            display: 'inline-block', padding: '14px 32px',
            background: CLAY, color: 'white', borderRadius: '4px',
            fontSize: '15px', fontWeight: 600, textDecoration: 'none',
          }}
        >
          Ver os imóveis nestas zonas
        </Link>
        <button
          onClick={onRestart}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: STONE, fontSize: '14px', textDecoration: 'underline', padding: 0,
          }}
        >
          Fazer o quiz outra vez
        </button>
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function QuizFlow() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [answers, setAnswers] = useState<PartialAnswers>({})
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const firstOptionRef = useRef<HTMLButtonElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Foco no primeiro elemento ao mudar de ecrã
  useEffect(() => {
    if (firstOptionRef.current) firstOptionRef.current.focus()
  }, [screen])

  const goTo = useCallback((next: Screen) => setScreen(next), [])

  const submit = useCallback((finalAnswers: PartialAnswers) => {
    const complete = finalAnswers as QuizAnswers
    setScreen('loading')
    setTimeout(() => {
      const recs = scoreAnswers(complete, freguesias, concelhos)
      setRecommendations(recs)
      setScreen('result')
    }, 1200)
  }, [])

  const restart = useCallback(() => {
    setAnswers({})
    setRecommendations([])
    setScreen('welcome')
  }, [])

  // Navegação de teclado global enquanto no quiz
  useEffect(() => {
    const screens: Screen[] = ['q1', 'q2', 'q3', 'q4', 'q5']
    if (!screens.includes(screen)) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        const prev: Record<Screen, Screen> = {
          q1: 'welcome', q2: 'q1', q3: 'q2', q4: 'q3', q5: 'q4',
          welcome: 'welcome', loading: 'loading', result: 'result',
        }
        setScreen(prev[screen])
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [screen])

  const setAnswer = <K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const toggleQ3 = (val: QuizAnswers['q3_saturday'][number]) => {
    const current = (answers.q3_saturday ?? []) as QuizAnswers['q3_saturday']
    if (current.includes(val)) {
      setAnswers(prev => ({ ...prev, q3_saturday: current.filter(v => v !== val) as QuizAnswers['q3_saturday'] }))
    } else if (current.length < 2) {
      setAnswers(prev => ({ ...prev, q3_saturday: [...current, val] as QuizAnswers['q3_saturday'] }))
    }
  }

  // ── Renders ────────────────────────────────────────────────────────────────

  const wrapper = (children: React.ReactNode) => (
    <div
      ref={containerRef}
      style={{ minHeight: '100vh', background: BONE, display: 'flex', flexDirection: 'column' }}
    >
      {/* Marca */}
      <div style={{ padding: '32px 48px 0', maxWidth: '760px', margin: '0 auto', width: '100%' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-display" style={{ fontSize: '20px', color: INK, letterSpacing: '-0.5px' }}>VERSO</span>
        </Link>
      </div>

      {/* Conteúdo */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '48px 48px 80px',
        maxWidth: '760px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {children}
      </div>
    </div>
  )

  // Ecrã de boas-vindas
  if (screen === 'welcome') {
    return wrapper(
      <WelcomeScreen
        onStart={() => goTo('q1')}
        onSkip={() => window.location.href = '/imoveis'}
      />
    )
  }

  // Ecrã de carregamento
  if (screen === 'loading') {
    return wrapper(
      <div style={{ maxWidth: '480px' }}>
        <p style={{ fontSize: '24px', fontStyle: 'italic', color: MOSS, lineHeight: 1.5 }}>
          A ler as tuas respostas…
        </p>
      </div>
    )
  }

  // Ecrã de resultado
  if (screen === 'result') {
    return wrapper(
      <ResultScreen recommendations={recommendations} onRestart={restart} />
    )
  }

  // ── Perguntas ──────────────────────────────────────────────────────────────

  function questionScreen(
    step: number,
    question: string,
    options: readonly { value: string; label: string }[],
    selectedValue: string | undefined,
    onSelect: (v: string) => void,
    canNext: boolean,
    onNext: () => void,
    onPrev: () => void,
    isMulti = false,
    selectedValues?: string[],
    isSkippable = false,
    onSkip?: () => void,
    announcement?: string
  ) {
    return wrapper(
      <div>
        <Progress current={step} total={5} />

        <h2
          className="font-display"
          style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, color: INK, lineHeight: 1.15, marginBottom: '40px' }}
        >
          {question}
        </h2>

        <div
          role="group"
          aria-label={`Pergunta ${step} de 5`}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}
        >
          <div aria-live="polite" className="sr-only">
            {announcement}
          </div>

          {options.map((opt, idx) => {
            const isSelected = isMulti
              ? (selectedValues ?? []).includes(opt.value)
              : opt.value === selectedValue
            return (
              <Option
                key={opt.value}
                label={opt.label}
                selected={isSelected}
                onSelect={() => onSelect(opt.value)}
                focusRef={idx === 0 ? firstOptionRef : undefined}
              />
            )
          })}
        </div>

        {/* Navegação */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={onPrev}
            style={{
              background: 'none', border: `1px solid ${HAIRLINE}`, borderRadius: '4px',
              padding: '12px 24px', cursor: 'pointer', color: STONE, fontSize: '14px',
            }}
          >
            Voltar
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            style={{
              background: canNext ? CLAY : HAIRLINE,
              border: 'none', borderRadius: '4px',
              padding: '12px 32px', cursor: canNext ? 'pointer' : 'not-allowed',
              color: 'white', fontSize: '15px', fontWeight: 600,
              opacity: canNext ? 1 : 0.5,
              transition: 'background 150ms ease, opacity 150ms ease',
            }}
          >
            Seguinte
          </button>
          {isSkippable && onSkip && (
            <button
              onClick={onSkip}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: STONE, fontSize: '14px', textDecoration: 'underline', padding: 0, marginLeft: '8px' }}
            >
              saltar
            </button>
          )}
        </div>
      </div>
    )
  }

  if (screen === 'q1') {
    return questionScreen(
      1,
      'Como queres que a tua rua soe numa manhã de terça-feira?',
      Q1_OPTIONS,
      answers.q1_pace,
      (v) => setAnswer('q1_pace', v as QuizAnswers['q1_pace']),
      !!answers.q1_pace,
      () => goTo('q2'),
      () => goTo('welcome'),
    )
  }

  if (screen === 'q2') {
    return questionScreen(
      2,
      'A que distância da tua porta deve ficar o resto da tua vida?',
      Q2_OPTIONS,
      answers.q2_distance,
      (v) => setAnswer('q2_distance', v as QuizAnswers['q2_distance']),
      !!answers.q2_distance,
      () => goTo('q3'),
      () => goTo('q1'),
    )
  }

  if (screen === 'q3') {
    const q3Selected = answers.q3_saturday ?? []
    return questionScreen(
      3,
      'Escolhe o sábado que mais soa ao teu. (até dois)',
      Q3_OPTIONS,
      undefined,
      (v) => toggleQ3(v as QuizAnswers['q3_saturday'][number]),
      q3Selected.length >= 1,
      () => goTo('q4'),
      () => goTo('q2'),
      true,
      q3Selected as string[],
      false, undefined,
      q3Selected.length > 0 ? `${q3Selected.length} seleccionado(s)` : undefined,
    )
  }

  if (screen === 'q4') {
    return questionScreen(
      4,
      'Cada bairro é uma troca. Qual estás disposto a fazer?',
      Q4_OPTIONS,
      answers.q4_trade,
      (v) => setAnswer('q4_trade', v as QuizAnswers['q4_trade']),
      !!answers.q4_trade,
      () => goTo('q5'),
      () => goTo('q3'),
    )
  }

  if (screen === 'q5') {
    return questionScreen(
      5,
      'Uma última coisa, e só se quiseres partilhar.',
      Q5_OPTIONS,
      answers.q5_stage,
      (v) => setAnswer('q5_stage', v as QuizAnswers['q5_stage']),
      true, // sempre pode avançar (skippable)
      () => submit({ ...answers }),
      () => goTo('q4'),
      false, undefined,
      true,
      () => submit({ ...answers }),
    )
  }

  return null
}
