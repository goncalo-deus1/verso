/**
 * vite.ssr.config.ts — dedicated config for the SSR/prerender build.
 *
 * Why a separate config:
 *   • The main config has plugins (Tailwind, MDX) that aren't needed
 *     here and pull in browser-only code paths.
 *   • Keeps the SSR bundle small and predictable.
 *
 * Output: dist-ssr/render.mjs — ESM, externalises node_modules.
 * Consumed by scripts/generate-static-shells.mjs via dynamic import.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    ssr: true,
    outDir: 'dist-ssr',
    emptyOutDir: true,
    target: 'node20',
    minify: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/server/render.tsx'),
      output: {
        format: 'esm',
        entryFileNames: 'render.mjs',
      },
    },
  },
})
