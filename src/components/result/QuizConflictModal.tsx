/**
 * QuizConflictModal.tsx
 *
 * Shown when an authenticated user lands on the dossier with a new quiz result
 * that differs from the quiz already saved in Supabase.
 *
 * variant="conflict"   → "Já tens um quiz guardado. Substituir ou manter?"
 * variant="refazer"    → "Vais substituir o teu quiz anterior. Tens a certeza?"
 */

const INK    = '#1E1F18'
const BONE   = '#F2EDE4'
const CLAY   = '#C2553A'
const STONE  = '#3A3B2E'
const HAIR   = 'rgba(30, 31, 24, 0.125)'

type Props = {
  variant:   'conflict' | 'refazer'
  onPrimary: () => void   // "Substituir" / "Substituir"
  onSecondary: () => void // "Manter o anterior" / "Cancelar"
}

export function QuizConflictModal({ variant, onPrimary, onSecondary }: Props) {
  const isConflict = variant === 'conflict'

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(30, 31, 24, 0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: BONE, maxWidth: '440px', width: '100%',
          padding: '36px', boxShadow: '0 24px 64px rgba(30,31,24,0.25)',
        }}
      >
        {/* Eyebrow */}
        <p style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: CLAY, marginBottom: '16px',
        }}>
          {isConflict ? 'Quiz anterior detectado' : 'Confirmar substituição'}
        </p>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-display, serif)', fontWeight: 400,
          fontSize: '22px', letterSpacing: '-0.5px', lineHeight: 1.2,
          color: INK, marginBottom: '12px',
        }}>
          {isConflict
            ? 'Já tens um quiz guardado.'
            : 'Vais substituir o teu quiz anterior.'}
        </h2>

        {/* Body */}
        <p style={{ fontSize: '14px', color: STONE, lineHeight: 1.65, marginBottom: '28px' }}>
          {isConflict
            ? 'Queres substituir o anterior pelo novo, ou manter o que já tinhas?'
            : 'Tens a certeza? O quiz anterior será apagado permanentemente.'}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Primary — Substituir */}
          <button
            onClick={onPrimary}
            style={{
              flex: 1, minWidth: '120px',
              padding: '12px 18px', fontSize: '13px', fontWeight: 600,
              background: CLAY, color: BONE,
              border: `1px solid ${CLAY}`, cursor: 'pointer',
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: '0.05em', transition: 'opacity 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Substituir
          </button>

          {/* Secondary */}
          <button
            onClick={onSecondary}
            style={{
              flex: 1, minWidth: '120px',
              padding: '12px 18px', fontSize: '13px', fontWeight: 500,
              background: 'transparent', color: STONE,
              border: `1px solid ${HAIR}`, cursor: 'pointer',
              fontFamily: '"JetBrains Mono", monospace',
              letterSpacing: '0.05em', transition: 'border-color 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = STONE)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = HAIR)}
          >
            {isConflict ? 'Manter o anterior' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  )
}
