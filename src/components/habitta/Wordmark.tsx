interface WordmarkProps {
  /** Font size in px. Defaults to inheriting from parent. */
  size?: number | string
  /** Base color. Defaults to charcoal. The "tt" stays coral italic. */
  color?: string
}

/**
 * Wordmark — habi<em>tt</em>a, lowercase, with coral italic "tt".
 * Always lowercase regardless of context. The accent color is fixed
 * to brand clay — only the surrounding letters take `color`.
 *
 * For the navbar variant of the existing wordmark, see ../Wordmark.tsx.
 * This component is the prop-driven version used by editorial pages.
 */
export function Wordmark({ size, color = 'var(--charcoal)' }: WordmarkProps) {
  return (
    <span
      className="wordmark"
      style={{
        fontFamily: 'var(--font-display-stack)',
        fontWeight: 300,
        letterSpacing: '-0.03em',
        fontSize: typeof size === 'number' ? `${size}px` : size,
        color,
        display: 'inline-flex',
        alignItems: 'baseline',
      }}
    >
      habi
      <em
        style={{
          fontStyle: 'italic',
          color: 'var(--clay)',
          fontWeight: 500,
        }}
      >
        tt
      </em>
      a
    </span>
  )
}
