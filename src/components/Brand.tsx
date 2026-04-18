// ─── VERSO Brand Primitives ───────────────────────────────────────────────────
// All reusable visual patterns from the brandbook live here.

/** 01, 02… section counter in IBM Plex Mono + Terracotta */
export function SectionNum({ n }: { n: string }) {
  return (
    <p style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: '#C45D3E', letterSpacing: '2px', marginBottom: '12px' }}>
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
      color: light ? 'rgba(255,255,255,0.5)' : '#C45D3E',
      marginBottom: '12px',
    }}>
      {children}
    </p>
  )
}

/** Left-border callout with italic Fraunces quote */
export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderLeft: '3px solid #C45D3E', padding: '24px 32px', margin: '48px 0', background: '#FAF8F3' }}>
      <p style={{ fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic', fontSize: '20px', lineHeight: '1.6', color: '#2C2C2C' }}>
        {children}
      </p>
    </div>
  )
}

/** 48px × 2px terracotta horizontal rule */
export function Divider() {
  return <div style={{ width: '48px', height: '2px', background: '#C45D3E', margin: '48px 0' }} />
}

/** Ink-background uppercase trait pill */
export function Trait({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-block',
      background: '#0A0A0B', color: '#F7F5F0',
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
    <div style={{ background: '#FAF8F3', border: '1px solid #E8E4DC', padding: '36px', borderRadius: '2px', ...style }}>
      {children}
    </div>
  )
}

/** Dark (ink) card */
export function CardDark({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#0A0A0B', padding: '36px', borderRadius: '2px', ...style }}>
      {children}
    </div>
  )
}

/** Accent (terracotta) card */
export function CardAccent({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#C45D3E', padding: '36px', borderRadius: '2px', ...style }}>
      {children}
    </div>
  )
}
