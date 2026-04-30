import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ConcelhoSection } from '../../lib/concelhoContent'

type Props = {
  sections: ConcelhoSection[]
}

// Componentes de markdown estilizados — evita @tailwindcss/typography
const mdComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h2: ({ children }) => (
    <h2
      className="font-display"
      style={{
        fontSize: 'clamp(22px, 3.5vw, 30px)',
        fontWeight: 400,
        color: 'var(--azeitona)',
        lineHeight: 1.2,
        margin: '48px 0 16px',
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="font-display"
      style={{
        fontSize: 'clamp(18px, 2.5vw, 22px)',
        fontWeight: 400,
        color: 'var(--azeitona)',
        lineHeight: 1.3,
        margin: '32px 0 12px',
      }}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p
      style={{
        fontSize: '17px',
        color: 'var(--azeitona)',
        lineHeight: 1.75,
        margin: '0 0 20px',
      }}
    >
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong style={{ fontWeight: 600, color: 'var(--azeitona)' }}>
      {children}
    </strong>
  ),
  em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
  ul: ({ children }) => (
    <ul
      style={{
        listStyle: 'disc',
        paddingLeft: '24px',
        margin: '0 0 20px',
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        listStyle: 'decimal',
        paddingLeft: '24px',
        margin: '0 0 20px',
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li
      style={{
        fontSize: '17px',
        color: 'var(--azeitona)',
        lineHeight: 1.7,
        marginBottom: '8px',
      }}
    >
      {children}
    </li>
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
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: '3px solid var(--telha)',
        paddingLeft: '20px',
        margin: '20px 0',
        color: 'var(--azeitona-medio)',
        fontStyle: 'italic',
      }}
    >
      {children}
    </blockquote>
  ),
}

export default function ConcelhoEditorial({ sections }: Props) {
  if (sections.length === 0) return null

  return (
    <article>
      {sections.map((section, i) => (
        <section key={i}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {`## ${section.heading}\n\n${section.body}`}
          </ReactMarkdown>
        </section>
      ))}
    </article>
  )
}
