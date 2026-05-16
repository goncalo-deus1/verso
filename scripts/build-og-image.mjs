/**
 * build-og-image.mjs — parameterized og:image PNG generator.
 *
 * Output: 1200x630 PNG, brand bone background, charcoal text, coral
 * accent on the wordmark "tt" and on a divider rule.
 *
 * Format decision: PNG, not SVG.
 *   • Twitter/X documentation requires JPG/PNG/WEBP/GIF for og:image.
 *   • Facebook/LinkedIn unscrape SVG og:images intermittently.
 *   • Slack and Discord rasterize SVGs inconsistently across versions.
 *   PNG is the safe option that every major scraper handles cleanly.
 *
 * Font: Georgia (system serif), not Fraunces.
 *   • librsvg (sharp's SVG renderer) only loads fonts available to fontconfig,
 *     not arbitrary woff2 from Google Fonts. Embedding a base64 woff2 into
 *     the SVG works but inflates render time 10x and adds a 100 KB+ inline
 *     blob per render. Georgia is a close metric match for Fraunces and
 *     is universally available on render hosts (including Vercel's build
 *     containers and macOS).
 *   • The wordmark and freguesia name still read as habitta — bone bg,
 *     coral italic "tt", coral rule. The body of the visual identity
 *     survives the font swap; only fine letterform details differ.
 *
 * Standalone test:
 *   node scripts/build-og-image.mjs --test
 *
 * Writes a single sample to og-test-output.png at the repo root.
 */

import { writeFileSync, mkdirSync } from 'fs'
import { dirname, join }            from 'path'
import { fileURLToPath }            from 'url'
import sharp                        from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = join(__dirname, '..')

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const BONE     = '#F2EDE4'
const CHARCOAL = '#2C2C2A'
const CLAY     = '#C2553A'

// ─── XML escaping ─────────────────────────────────────────────────────────────
function xmlEscape(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// ─── SVG builder ──────────────────────────────────────────────────────────────
export function buildFreguesiaOgSvg({ freguesia, concelho }) {
  const name = xmlEscape(freguesia)
  const sub  = xmlEscape(`${concelho} · AML`)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BONE}"/>

  <!-- top wordmark -->
  <g font-family="Georgia, 'Times New Roman', serif" fill="${CHARCOAL}" font-weight="300">
    <text x="80" y="120" font-size="42" letter-spacing="-1">
      habi<tspan font-style="italic" fill="${CLAY}" font-weight="500">tt</tspan>a
    </text>
  </g>

  <!-- coral rule -->
  <line x1="80" y1="170" x2="200" y2="170" stroke="${CLAY}" stroke-width="3"/>

  <!-- freguesia name -->
  <text x="80" y="430"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="140" font-weight="300" letter-spacing="-3"
        fill="${CHARCOAL}">${name}</text>

  <!-- subtitle: concelho · AML -->
  <text x="80" y="500"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="32" font-weight="300" font-style="italic"
        fill="${CHARCOAL}" fill-opacity="0.75">${sub}</text>

  <!-- tagline strip, bottom-right, mono-ish -->
  <text x="1120" y="580"
        font-family="ui-monospace, 'Courier New', monospace"
        font-size="14" letter-spacing="2"
        text-anchor="end"
        fill="${CHARCOAL}" fill-opacity="0.55">A ZONA CERTA ANTES DA CASA CERTA</text>
</svg>`
}

// ─── PNG renderer ─────────────────────────────────────────────────────────────
export async function buildFreguesiaOgImage({ freguesia, concelho, outPath }) {
  const svg = buildFreguesiaOgSvg({ freguesia, concelho })
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, png)
  return outPath
}

// ─── CLI ──────────────────────────────────────────────────────────────────────
if (process.argv.includes('--test')) {
  const out = join(ROOT, 'og-test-output.png')
  await buildFreguesiaOgImage({
    freguesia: 'Exemplo',
    concelho:  'Lisboa',
    outPath:   out,
  })
  console.log(`[og] wrote test render → ${out}`)
}
