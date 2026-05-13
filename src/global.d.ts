/// <reference types="vite/client" />

declare global {
  interface Window {
    // Google Analytics 4
    gtag?: (...args: unknown[]) => void
    // Meta Pixel
    fbq?: (...args: unknown[]) => void
  }
}

export {}
