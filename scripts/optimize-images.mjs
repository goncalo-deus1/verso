/**
 * optimize-images.mjs
 * Converts /public/concelhos/*.jpg → WebP at two sizes:
 *   - 800px wide (for ZonePanel hero, AreaRecommendations)
 *   - 480px wide (for homepage cards)
 * Originals are kept as fallback.
 */

import sharp from 'sharp'
import { readdirSync, statSync } from 'fs'
import { join, basename, extname } from 'path'

const SRC_DIR = new URL('../public/concelhos', import.meta.url).pathname

const files = readdirSync(SRC_DIR).filter(f =>
  ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase())
)

console.log(`Found ${files.length} images to convert.\n`)

let totalBefore = 0
let totalAfter  = 0

for (const file of files) {
  const src  = join(SRC_DIR, file)
  const name = basename(file, extname(file))

  const sizeBefore = statSync(src).size
  totalBefore += sizeBefore

  const out800  = join(SRC_DIR, `${name}.webp`)
  const out480  = join(SRC_DIR, `${name}-480.webp`)

  // 800px — used in panel header / detail contexts
  await sharp(src)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(out800)

  // 480px — used in homepage cards
  await sharp(src)
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(out480)

  const size800 = statSync(out800).size
  const size480 = statSync(out480).size
  totalAfter += size800

  const pct = (((sizeBefore - size800) / sizeBefore) * 100).toFixed(0)
  console.log(
    `  ${file.padEnd(32)} ${(sizeBefore/1024/1024).toFixed(1)} MB → ${(size800/1024).toFixed(0)} KB webp-800 / ${(size480/1024).toFixed(0)} KB webp-480   (${pct}% saved)`
  )
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)} MB → ${(totalAfter/1024).toFixed(0)} KB (${(totalAfter/1024/1024).toFixed(1)} MB)`)
