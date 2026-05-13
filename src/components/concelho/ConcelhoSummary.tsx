import ReactMarkdown from 'react-markdown'

type Props = {
  summary: string
  updatedAt?: string
}

export default function ConcelhoSummary({ summary, updatedAt }: Props) {
  return (
    <aside
      style={{
        borderLeft: '4px solid var(--telha)',
        background: 'var(--papel)',
        borderRadius: '4px',
        padding: '28px 32px',
      }}
    >
      <p
        className="font-mono"
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: 'var(--azeitona-medio)',
          margin: '0 0 12px',
        }}
      >
        Resumo rápido
      </p>

      <div
        style={{
          fontSize: '17px',
          color: 'var(--azeitona)',
          lineHeight: 1.7,
        }}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
            strong: ({ children }) => (
              <strong style={{ fontWeight: 600, color: 'var(--azeitona)' }}>
                {children}
              </strong>
            ),
          }}
        >
          {summary}
        </ReactMarkdown>
      </div>

      {updatedAt && (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--azeitona-medio)',
            fontStyle: 'italic',
            margin: '16px 0 0',
          }}
        >
          Atualizado a {updatedAt}
        </p>
      )}
    </aside>
  )
}
