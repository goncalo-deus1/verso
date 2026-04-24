/**
 * FadeInSection — zero-dependency scroll-reveal using IntersectionObserver +
 * a CSS animation. Removes framer-motion from the critical rendering path.
 *
 * Respects prefers-reduced-motion: when set, the element is rendered visible
 * immediately with no animation.
 */

import { useRef, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number          // seconds
  className?: string
  style?: React.CSSProperties
}

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function FadeInSection({ children, delay = 0, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(REDUCED)

  useEffect(() => {
    if (REDUCED) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '-80px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: REDUCED
          ? 'none'
          : `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
