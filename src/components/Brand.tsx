// ─── Habitta Brand Primitives ───────────────────────────────────────────────────
// All reusable visual patterns from the brandbook live here.

/** 01, 02… section counter in IBM Plex Mono + Terracotta */
export function SectionNum({ n }: { n: string }) {
  return (
    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#C2553A', letterSpacing: '2px', marginBottom: '12px' }}>
      {n}
    </p>
  )
}

/** UPPERCASE label in IBM Plex Mono + Terracotta */
export function BlockLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p style={{
      fontFamily: 'IBM Plex Mono', fontSize: '10px', fontWeight: 600,
      textTransform: 'uppercase', letterSpacing: '2.5px',
      color: light ? 'rgba(255,255,255,0.5)' : '#C2553A',
      marginBottom: '12px',
    }}>
      {children}
    </p>
  )
}

/** Left-border callout with italic Georgia quote */
export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderLeft: '3px solid #C2553A', padding: '24px 32px', margin: '48px 0', background: '#F2EDE4' }}>
      <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '20px', lineHeight: '1.6', color: '#1E1F18' }}>
        {children}
      </p>
    </div>
  )
}

/** 48px × 2px terracotta horizontal rule */
export function Divider() {
  return <div style={{ width: '48px', height: '2px', background: '#C2553A', margin: '48px 0' }} />
}

/** Ink-background uppercase trait pill */
export function Trait({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-block',
      background: '#1E1F18', color: '#F2EDE4',
      padding: '10px 24px', fontSize: '13px', fontWeight: 500,
      letterSpacing: '1px', textTransform: 'uppercase',
    }}>
      {children}
    </span>
  )
}

/** Standard cream card */
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#F2EDE4', border: '1px solid rgba(30, 31, 24, 0.125)', padding: '36px', borderRadius: '2px', ...style }}>
      {children}
    </div>
  )
}

/** Dark (ink) card */
export function CardDark({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#1E1F18', padding: '36px', borderRadius: '2px', ...style }}>
      {children}
    </div>
  )
}

/** Accent (terracotta) card */
export function CardAccent({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#C2553A', padding: '36px', borderRadius: '2px', ...style }}>
      {children}
    </div>
  )
}
