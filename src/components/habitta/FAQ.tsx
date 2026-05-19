import { faqPageJsonLd } from '../../lib/jsonLd'
import { useLangSafe } from '../../context/LanguageContext'
import { useT } from '../../i18n/translations'

export interface FAQItem {
  q: string
  a: string
}

interface FAQProps {
  items: FAQItem[]
  /** If omitted, falls back to the localised default ("Perguntas frequentes" / "Frequently asked questions"). */
  title?: string
  /**
   * If false, this FAQ block won't emit its own FAQPage JSON-LD.
   * Use when JSON-LD is emitted at the page level instead.
   */
  emitJsonLd?: boolean
}

/**
 * FAQ — Q-as-H3, A-as-paragraph, with FAQPage JSON-LD.
 * Uses native <details>/<summary> so it works without JS (critical
 * for AI crawler / prerendered output).
 */
export function FAQ({ items, title, emitJsonLd = true }: FAQProps) {
  const { lang } = useLangSafe()
  const tr = useT(lang)
  const resolvedTitle = title ?? tr('habitta.faq.defaultTitle')
  if (!items || items.length === 0) return null

  const ld = faqPageJsonLd(items)

  return (
    <section
      aria-labelledby="habitta-faq-heading"
      style={{ margin: 'var(--space-6) 0 var(--space-5)' }}
    >
      <h2
        id="habitta-faq-heading"
        style={{
          fontFamily: 'var(--font-display-stack)',
          fontSize: 'clamp(28px, 3.4vw, 40px)',
          letterSpacing: '-0.6px',
          color: 'var(--charcoal)',
          fontWeight: 400,
          margin: '0 0 var(--space-4)',
        }}
      >
        {resolvedTitle}
      </h2>
      <div style={{ borderTop: '1px solid rgba(44, 44, 42, 0.15)' }}>
        {items.map((item, i) => (
          <details
            key={i}
            style={{
              borderBottom: '1px solid rgba(44, 44, 42, 0.15)',
              padding: 'var(--space-2) 0',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                listStyle: 'none',
                padding: 'var(--space-2) 0',
              }}
            >
              <h3
                style={{
                  display: 'inline',
                  fontFamily: 'var(--font-display-stack)',
                  fontSize: 'clamp(17px, 1.6vw, 20px)',
                  letterSpacing: '-0.2px',
                  color: 'var(--charcoal)',
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                {item.q}
              </h3>
            </summary>
            <p
              style={{
                fontFamily: 'var(--font-body-stack)',
                fontSize: '17px',
                lineHeight: 'var(--leading-body)',
                color: 'var(--charcoal)',
                margin: 'var(--space-2) 0 var(--space-2)',
                maxWidth: '38em',
              }}
            >
              {item.a}
            </p>
          </details>
        ))}
      </div>
      {emitJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ) : null}
    </section>
  )
}
