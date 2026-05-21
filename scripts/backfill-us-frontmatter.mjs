#!/usr/bin/env node
/**
 * backfill-us-frontmatter.mjs
 *
 * Bổ sung frontmatter `bf:` cho các file US- có sẵn trong docs/business-functions/.
 * - Đọc danh sách BF từ thư mục, build set hợp lệ.
 * - Suy `bf:` từ tên file US theo bảng mapping.
 * - Idempotent: file đã có `bf:` đúng → bỏ qua. File có `bf:` sai → cảnh báo, không ghi đè.
 * - File chưa có frontmatter → thêm block mới giữ nguyên nội dung.
 *
 * Cách chạy (Windows cmd):
 *   node scripts/backfill-us-frontmatter.mjs                  # dry-run, in danh sách thay đổi
 *   node scripts/backfill-us-frontmatter.mjs --apply          # ghi thật
 *   node scripts/backfill-us-frontmatter.mjs --apply --verbose
 *
 * Không có dependency. Yêu cầu Node >= 18.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIR = path.join(ROOT, 'docs', 'business-functions')

const args = new Set(process.argv.slice(2))
const APPLY = args.has('--apply')
const VERBOSE = args.has('--verbose')

// ─── Mapping table US → BF ────────────────────────────────────────────
//
// Quy tắc bậc 1: dựa trên prefix sau "US-".
// Quy tắc bậc 2 (đặc biệt): mã US gọn (BT, ENR02) cần map riêng.
// Tham chiếu: docs/business-functions/CATALOG.md.

/**
 * Trả về BF ID dự đoán cho 1 stem US, ví dụ:
 *   US-BT05            → BF-ENR-01   (Assessment Booking, theo CATALOG.md)
 *   US-ENR02-03        → BF-ENR-02
 *   US-CLS03-15        → BF-CLS-03
 *   US-CLS01-01        → BF-CLS-01
 *   US-OPS02-04        → BF-OPS-02
 *   US-OPS03-01        → BF-OPS-03
 *   US-SYS-04-02       → BF-SYS-04
 *   US-ORG-01-03       → BF-ORG-01
 *   US-HR-01-02        → BF-HR-01
 *   US-MDM-02-01       → BF-MDM-02
 *   US-ACD-07-01       → BF-ACD-07
 *   US-FIN-01-01       → BF-FIN-01
 */
function inferBfFromUsId(usId) {
  // 1. US-BT## → BF-ENR-01 (booking test thuộc Assessment Booking)
  if (/^US-BT\d{2}$/.test(usId)) return 'BF-ENR-01'

  // 2. US-{MOD}{NN}-{ZZ} dạng compact (CLS03-04, ENR02-01, OPS02-04, BT05)
  const compact = usId.match(/^US-([A-Z]+)(\d{2})(?:-(\d{2}))?$/)
  if (compact) {
    const [, mod, num] = compact
    return `BF-${mod}-${num}`
  }

  // 3. US-{MOD}-{NN}-{ZZ} dạng đầy đủ (SYS-04-02, ORG-01-03, HR-01-01, MDM-02-01, ACD-07-01, FIN-01-01)
  const full = usId.match(/^US-([A-Z]+)-(\d{2})(?:-(\d{2}))?$/)
  if (full) {
    const [, mod, num] = full
    return `BF-${mod}-${num}`
  }

  return null
}

/** Trích stem ID từ tên file: US-CLS01-01-quan-ly-...md → US-CLS01-01 */
function extractUsId(fileName) {
  const m = fileName.match(/^(US-[A-Z]+\d*(?:-\d{2}){0,2})/)
  return m ? m[1] : null
}

// ─── Frontmatter helpers ─────────────────────────────────────────────

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function hasFrontmatter(content) {
  return FM_RE.test(content)
}

function getFrontmatterBlock(content) {
  const m = content.match(FM_RE)
  return m ? { full: m[0], body: m[1] } : null
}

/** Đọc 1 field từ body frontmatter. Không hỗ trợ object lồng nhau. */
function getField(body, key) {
  const re = new RegExp(`^${key}\\s*:\\s*(.+?)\\s*$`, 'm')
  const m = body.match(re)
  if (!m) return null
  let v = m[1].trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1)
  }
  return v
}

/** Thêm hoặc cập nhật 1 field đơn vào body frontmatter, trả body mới. */
function setField(body, key, value) {
  const re = new RegExp(`^${key}\\s*:\\s*.*$`, 'm')
  if (re.test(body)) {
    return body.replace(re, `${key}: ${value}`)
  }
  // Append vào cuối, đảm bảo có newline phía trước
  return body.replace(/\s*$/, '') + '\n' + `${key}: ${value}` + '\n'
}

/** Tạo frontmatter mới cho file US chưa có. Tối thiểu, để dev/PM bổ sung tay sau. */
function buildFrontmatter({ usId, bfId, title }) {
  return `---
id: ${usId}
title: "${title}"
type: "User Story"
domain: "${bfId.split('-')[1] && 'CAP-' + bfId.split('-')[1]}"
bf: ${bfId}
status: "Draft"
tags: [user-story]
---
`
}

/** Trích tiêu đề từ heading H1 đầu tiên của file (sau frontmatter nếu có). */
function extractTitle(content) {
  const stripped = content.replace(FM_RE, '')
  const m = stripped.match(/^#\s+(.+)$/m)
  return m ? m[1].trim().replace(/^US-[A-Z0-9-]+:\s*/, '') : 'User Story'
}

// ─── Main ────────────────────────────────────────────────────────────

async function buildBfRegistry() {
  const files = await readdir(DIR)
  const bfs = new Set()
  for (const f of files) {
    const m = f.match(/^(BF-[A-Z]+-\d{2})/)
    if (m) bfs.add(m[1])
  }
  return bfs
}

function classifyAction(content, expectedBf) {
  if (!hasFrontmatter(content)) {
    return { kind: 'create-fm', current: null }
  }
  const fm = getFrontmatterBlock(content)
  const current = getField(fm.body, 'bf')
  if (!current) return { kind: 'add-bf', current: null }
  if (current === expectedBf) return { kind: 'skip', current }
  return { kind: 'mismatch', current }
}

function applyAction(content, action, expectedBf, usId) {
  if (action.kind === 'skip' || action.kind === 'mismatch') return content
  if (action.kind === 'add-bf') {
    const fm = getFrontmatterBlock(content)
    const newBody = setField(fm.body, 'bf', expectedBf)
    return content.replace(fm.full, `---\n${newBody.replace(/^\s+|\s+$/g, '')}\n---\n`)
  }
  if (action.kind === 'create-fm') {
    const title = extractTitle(content)
    const fm = buildFrontmatter({ usId, bfId: expectedBf, title })
    return fm + '\n' + content.replace(/^\uFEFF/, '')
  }
  return content
}

async function main() {
  const bfRegistry = await buildBfRegistry()
  const files = (await readdir(DIR)).filter((f) => f.startsWith('US-') && f.endsWith('.md'))

  const stats = {
    total: files.length,
    skipped: 0,
    addedField: 0,
    createdFm: 0,
    unmappable: 0,
    bfMissing: 0,
    mismatch: 0,
  }
  const reports = { addedField: [], createdFm: [], unmappable: [], bfMissing: [], mismatch: [] }

  for (const fileName of files) {
    const usId = extractUsId(fileName)
    if (!usId) {
      stats.unmappable++
      reports.unmappable.push({ fileName, reason: 'Không nhận dạng được US-id từ tên file' })
      continue
    }
    const expectedBf = inferBfFromUsId(usId)
    if (!expectedBf) {
      stats.unmappable++
      reports.unmappable.push({ fileName, usId, reason: 'Không có quy tắc map' })
      continue
    }
    if (!bfRegistry.has(expectedBf)) {
      stats.bfMissing++
      reports.bfMissing.push({ fileName, usId, expectedBf })
      continue
    }
    const fullPath = path.join(DIR, fileName)
    const content = await readFile(fullPath, 'utf8')
    const action = classifyAction(content, expectedBf)

    if (action.kind === 'skip') {
      stats.skipped++
      if (VERBOSE) console.log(`  skip   ${usId} (bf=${action.current})`)
      continue
    }
    if (action.kind === 'mismatch') {
      stats.mismatch++
      reports.mismatch.push({ fileName, usId, current: action.current, expected: expectedBf })
      continue
    }
    if (action.kind === 'add-bf') {
      stats.addedField++
      reports.addedField.push({ fileName, usId, expectedBf })
      if (APPLY) {
        const next = applyAction(content, action, expectedBf, usId)
        await writeFile(fullPath, next, 'utf8')
      }
      continue
    }
    if (action.kind === 'create-fm') {
      stats.createdFm++
      reports.createdFm.push({ fileName, usId, expectedBf })
      if (APPLY) {
        const next = applyAction(content, action, expectedBf, usId)
        await writeFile(fullPath, next, 'utf8')
      }
      continue
    }
  }

  // ─── Print report ──────────────────────────────────────────────────
  const ln = (s = '') => process.stdout.write(s + '\n')
  ln('============================================================')
  ln('  Backfill US frontmatter — ' + (APPLY ? 'APPLY' : 'DRY-RUN'))
  ln('============================================================')
  ln('')
  ln(`Tổng file US:           ${stats.total}`)
  ln(`Bỏ qua (đã đúng):       ${stats.skipped}`)
  ln(`Thêm field bf:          ${stats.addedField}`)
  ln(`Tạo frontmatter mới:    ${stats.createdFm}`)
  ln(`Không map được:         ${stats.unmappable}`)
  ln(`BF không tồn tại:       ${stats.bfMissing}`)
  ln(`Bf cũ ≠ kỳ vọng:        ${stats.mismatch}`)
  ln('')

  if (reports.addedField.length) {
    ln(`--- THÊM bf= cho ${reports.addedField.length} file ---`)
    for (const r of reports.addedField) ln(`  + ${r.usId.padEnd(18)} → ${r.expectedBf}    ${r.fileName}`)
    ln('')
  }
  if (reports.createdFm.length) {
    ln(`--- TẠO FRONTMATTER cho ${reports.createdFm.length} file ---`)
    for (const r of reports.createdFm) ln(`  ★ ${r.usId.padEnd(18)} → ${r.expectedBf}    ${r.fileName}`)
    ln('')
  }
  if (reports.unmappable.length) {
    ln(`--- KHÔNG MAP được ${reports.unmappable.length} file (kiểm tra tay) ---`)
    for (const r of reports.unmappable) ln(`  ? ${r.fileName}    ${r.reason}`)
    ln('')
  }
  if (reports.bfMissing.length) {
    ln(`--- BF KỲ VỌNG KHÔNG TỒN TẠI ${reports.bfMissing.length} file ---`)
    for (const r of reports.bfMissing) ln(`  ! ${r.usId.padEnd(18)} → ${r.expectedBf} (chưa có file)    ${r.fileName}`)
    ln('')
  }
  if (reports.mismatch.length) {
    ln(`--- BF CŨ KHÁC KỲ VỌNG ${reports.mismatch.length} file (KHÔNG ghi đè) ---`)
    for (const r of reports.mismatch) ln(`  ⚠ ${r.usId.padEnd(18)} có bf=${r.current}, kỳ vọng=${r.expected}    ${r.fileName}`)
    ln('')
  }

  if (!APPLY) {
    ln('Đây là dry-run. Chạy lại với --apply để ghi thay đổi.')
  } else {
    ln('Hoàn tất. Hãy chạy `node scripts/check-traceability.mjs` để xác nhận.')
  }
}

main().catch((err) => {
  console.error('Lỗi:')
  console.error(err)
  process.exit(2)
})
