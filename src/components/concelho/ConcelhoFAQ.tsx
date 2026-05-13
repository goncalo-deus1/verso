import ReactMarkdown from 'react-markdown'
import type { ConcelhoFAQ } from '../../lib/concelhoContent'

type Props = {
  faqs: ConcelhoFAQ[]
}

export default function ConcelhoFAQ({ faqs }: Props) {
  if (faqs.length === 0) return null

  return (
    <section>
      {/* Eyebrow */}
      <p
        className="font-mono"
        style={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: 'var(--telha)',
          margin: '0 0 12px',
        }}
      >
        FAQ
      </p>

      {/* Título da secção */}
      <h2
        className="font-display"
        style={{
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 400,
          color: 'var(--azeitona)',
          lineHeight: 1.15,
          margin: '0 0 40px',
        }}
      >
        Perguntas frequentes
      </h2>

      {/* Lista de perguntas — sempre expandidas */}
      <dl>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              borderTop: '1px solid var(--traco)',
              paddingTop: '28px',
              marginTop: i === 0 ? 0 : '28px',
            }}
          >
            <dt>
              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(17px, 2.5vw, 20px)',
                  fontWeight: 400,
                  color: 'var(--azeitona)',
                  lineHeight: 1.3,
                  margin: '0 0 12px',
                }}
              >
                {faq.question}
              </h3>
            </dt>
            <dd style={{ margin: 0 }}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'var(--azeitona)',
                        lineHeight: 1.7,
                        margin: '0 0 12px',
                      }}
                    >
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ fontWeight: 600 }}>{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      style={{ color: 'var(--telha)' }}
                      className="hover:underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {faq.answer}
              </ReactMarkdown>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
