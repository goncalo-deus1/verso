type Props = {
  /** String com newlines (como vem de ConcelhoContent.sources) ou array já dividido. */
  sources: string | string[]
}

export default function ConcelhoSources({ sources }: Props) {
  const items = (Array.isArray(sources) ? sources : sources.split('\n')).filter(s => s.trim())
  if (items.length === 0) return null

  return (
    <section>
      <p
        className="font-mono"
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: 'var(--azeitona-medio)',
          margin: '0 0 16px',
        }}
      >
        Fontes
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((source, i) => (
          <li
            key={i}
            style={{
              fontSize: '13px',
              color: 'var(--azeitona-medio)',
              lineHeight: 1.6,
              paddingBottom: '8px',
              marginBottom: '8px',
              borderBottom: i < items.length - 1 ? '1px solid var(--traco)' : 'none',
            }}
          >
            {source}
          </li>
        ))}
      </ul>
    </section>
  )
}
