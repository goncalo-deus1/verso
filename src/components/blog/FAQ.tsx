import { useState } from 'react'
import type { BlogPostFAQ } from '../../lib/blog'
import { useBlogPostMeta } from '../../lib/blogContext'

const CLAY = '#C2553A'
const INK  = '#1E1F18'

interface FAQProps {
  items?: BlogPostFAQ[]
  title?: string
}

/**
 * FAQ — secção de perguntas frequentes com accordions simples.
 * Exposto via MDXProvider — não precisa de import em cada .mdx.
 *
 * Usage in MDX:
 * <FAQ items={meta.faqs} />
 */
export function FAQ({ items: itemsProp, title = 'Perguntas frequentes' }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null)
  const meta = useBlogPostMeta()
  // Fall back to post frontmatter faqs when no explicit items prop
  const items = itemsProp ?? meta?.faqs ?? []

  if (items.length === 0) return null

  return (
    <section style={{ margin: '64px 0 40px' }} aria-labelledby="faq-heading">
      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          color: CLAY,
          marginBottom: '8px',
        }}
      >
        FAQ
      </p>
      <h2
        id="faq-heading"
        className="font-display"
        style={{
          fontSize: 'clamp(22px, 3vw, 30px)',
          letterSpacing: '-0.6px',
          color: INK,
          marginBottom: '32px',
          fontWeight: 400,
        }}
      >
        {title}
      </h2>
      <div>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              borderTop: '1px solid rgba(30,31,24,0.1)',
              ...(i === items.length - 1 ? { borderBottom: '1px solid rgba(30,31,24,0.1)' } : {}),
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '20px 0',
                textAlign: 'left',
              }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: '17px',
                  color: open === i ? CLAY : INK,
                  lineHeight: '1.4',
                  letterSpacing: '-0.2px',
                  fontWeight: 400,
                  transition: 'color 150ms',
                }}
              >
                {item.question}
              </span>
              <span
                style={{
                  color: CLAY,
                  fontSize: '20px',
                  lineHeight: 1,
                  flexShrink: 0,
                  marginTop: '2px',
                  transition: 'transform 200ms',
                  display: 'inline-block',
                  transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
                aria-hidden
              >
                +
              </span>
            </button>
            {open === i && (
              <p
                style={{
                  fontSize: '16px',
                  color: '#3A3B2E',
                  lineHeight: '1.75',
                  paddingBottom: '20px',
                  marginTop: '-4px',
                }}
              >
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
