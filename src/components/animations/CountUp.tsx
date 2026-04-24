/**
 * CountUp — zero-dependency animated number counter.
 * Uses IntersectionObserver instead of framer-motion's useInView,
 * and window.matchMedia instead of useReducedMotion.
 */

import { useEffect, useRef, useState } from 'react'

type Props = {
  to: number
  suffix?: string
  duration?: number
}

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CountUp({ to, suffix = '', duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(REDUCED ? to : 0)

  useEffect(() => {
    if (REDUCED) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        let frame: number
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setValue(Math.floor(eased * to))
          if (p < 1) {
            frame = requestAnimationFrame(tick)
          } else {
            setValue(to)
          }
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
      },
      { rootMargin: '-80px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  return <span ref={ref}>{value}{suffix}</span>
}
