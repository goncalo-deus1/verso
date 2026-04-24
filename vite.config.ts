import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Raise the warning threshold — 500 KB is a reasonable ceiling for a SPA
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── React core (highest priority — must be checked first) ──────────
          // Explicitly cover every sub-path so Rolldown never accidentally
          // re-exports React from inside another vendor chunk (e.g. framer-motion).
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/scheduler/') ||
            id.includes('/node_modules/react-router') ||
            id.includes('/node_modules/react-is/')
          ) return 'vendor-react'

          // ── Animation — only pages that animate will load this ─────────────
          // framer-motion must NOT contain React; checking react/ first (above)
          // ensures Rolldown sources React from vendor-react, not here.
          if (id.includes('/node_modules/framer-motion/')) return 'vendor-motion'

          // ── Supabase — large auth/realtime SDK ────────────────────────────
          if (id.includes('/node_modules/@supabase/')) return 'vendor-supabase'

          // ── Anthropic SDK — only used by AI copilot flows ─────────────────
          if (id.includes('/node_modules/@anthropic-ai/')) return 'vendor-anthropic'

          // ── Icons — small but worth isolating for long-term caching ────────
          if (id.includes('/node_modules/lucide-react/')) return 'vendor-ui'
        },
      },
    },
  },
})
