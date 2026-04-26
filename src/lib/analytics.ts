/**
 * analytics.ts — thin wrapper around gtag for custom event tracking.
 * Guards against gtag not being loaded (ad-blockers, SSR, etc.).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(name: string, params?: Record<string, string>): void {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
