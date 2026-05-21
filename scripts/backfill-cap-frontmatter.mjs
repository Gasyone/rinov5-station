#!/usr/bin/env node
/**
 * backfill-cap-frontmatter.mjs
 *
 * Bổ sung frontmatter `id:` và `parent_br:` cho các file CAP-* trong docs/business-functions/.
 * - `id` được suy từ tên file (CAP-CARE-student-care.md → CAP-CARE).
 * - `parent_br` được suy từ bảng mapping cứng dưới đây.
 *   - CAP có BR thật → gán BR-id thật.
 *   - CAP chưa có BR → gán "TBD-NEEDS-BR" để hiển thị gap rõ ràng.
 *
 * Idempotent: chạy lại không thay đổi nếu đã đúng.
 * KHÔNG ghi đè nếu giá trị hiện tại khác kỳ vọng — chỉ cảnh báo.
 *
 * Chạy:
 *   node scripts/backfill-cap-frontmatter.mjs           # dry-run
 *   node scripts/backfill-cap-frontmatter.mjs --apply
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

// ─── Mapping CAP → BR ────────────────────────────────────────────────
//
// Chỉ thêm BR thật ở đây sau khi BR đã được tạo trong docs/00-business/BR/
// và đã được Stakeholder ký. Trước khi có BR thật → giữ "TBD-NEEDS-BR".
//
// Lý do "TBD-NEEDS-BR": làm hiển thị gap, không che giấu. Trace check sẽ
// flag thành "info" thay vì "error".

const CAP_BR_MAP = {
  // CAP có BR thật:
  'CAP-CARE': 'BR-001', // Tăng tỷ lệ tái phí (BR-001)
  'CAP-OPS':  'BR-002', // Vận hành lớp không gián đoạn (BR-002)
  'CAP-MDM':  'BR-003', // Một học viên = Một bản ghi (BR-003)
  'CAP-ADM':  'BR-004', // Chuyển đổi Lead thành HV (BR-004)

  // CAP chưa có BR — cần Stakeholder workshop để tạo:
  'CAP-ACD':  'TBD-NEEDS-BR',
  'CAP-COM':  'TBD-NEEDS-BR',
  'CAP-FCM':  'TBD-NEEDS-BR',
  'CAP-FIN':  'TBD-NEEDS-BR',
  'CAP-HR':   'TBD-NEEDS-BR',
  'CAP-RPT':  'TBD-NEEDS-BR',
  'CAP-SYS':  'TBD-NEEDS-BR',
}

// ─── Helpers (style nhất quán với backfill-us-frontmatter.mjs) ───────

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function getFrontmatterBlock(content) {
  const m = content.match(FM_RE)
  return m ? { full: m[0], body: m[1] } : null
}

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

function setField(body, key, value, { quote = false } = {}) {
  const out = quote ? `"${value}"` : value
  const re = new RegExp(`^${key}\\s*:\\s*.*$`, 'm')
  if (re.test(body)) return body.replace(re, `${key}: ${out}`)
  return body.replace(/\s*$/, '') + '\n' + `${key}: ${out}` + '\n'
}

function extractCapId(fileName) {
  // CAP-CARE-student-care.md → CAP-CARE
  const m = fileName.match(/^(CAP-[A-Z]+)/)
  return m ? m[1] : null
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const files = (await readdir(DIR))
    .filter((f) => f.startsWith('CAP-') && f.endsWith('.md') && f !== 'CAP-MAP.md')

  const stats = {
    total: files.length,
    skipped: 0,
    addedId: 0,
    addedParentBr: 0,
    addedBoth: 0,
    mismatch: 0,
    noFrontmatter: 0,
  }
  const reports = { changes: [], mismatch: [], noFm: [] }

  for (const fileName of files) {
    const capId = extractCapId(fileName)
    if (!capId) continue
    const expectedBr = CAP_BR_MAP[capId]
    if (!expectedBr) {
      console.warn(`⚠ Không có entry cho ${capId} trong CAP_BR_MAP — bỏ qua`)
      continue
    }

    const fullPath = path.join(DIR, fileName)
    const content = await readFile(fullPath, 'utf8')
    const fm = getFrontmatterBlock(content)

    if (!fm) {
      stats.noFrontmatter++
      reports.noFm.push({ fileName })
      continue
    }

    const currentId = getField(fm.body, 'id')
    const currentBr = getField(fm.body, 'parent_br')

    // Kiểm tra mismatch (đã có giá trị nhưng khác kỳ vọng)
    if (currentId && currentId !== capId) {
      stats.mismatch++
      reports.mismatch.push({ fileName, field: 'id', current: currentId, expected: capId })
      continue
    }
    if (currentBr && currentBr !== expectedBr && !currentBr.startsWith('TBD-')) {
      // Nếu currentBr là 1 BR thật mà script muốn thay bằng TBD-NEEDS-BR → KHÔNG đổi
      // Trường hợp đó nghĩa là người ta đã gán BR thật, nên giữ nguyên
      if (expectedBr === 'TBD-NEEDS-BR') {
        if (VERBOSE) console.log(`   keep   ${capId} đã có parent_br=${currentBr} (giữ nguyên)`)
        stats.skipped++
        continue
      }
      stats.mismatch++
      reports.mismatch.push({ fileName, field: 'parent_br', current: currentBr, expected: expectedBr })
      continue
    }

    const needId = !currentId
    const needBr = !currentBr

    if (!needId && !needBr) {
      stats.skipped++
      if (VERBOSE) console.log(`   skip   ${capId} đã đầy đủ`)
      continue
    }

    let body = fm.body
    if (needId) body = setField(body, 'id', capId, { quote: true })
    if (needBr) body = setField(body, 'parent_br', expectedBr, { quote: true })

    if (needId && needBr) stats.addedBoth++
    else if (needId) stats.addedId++
    else if (needBr) stats.addedParentBr++

    reports.changes.push({
      fileName, capId,
      addedId: needId, addedBr: needBr, br: expectedBr,
    })

    if (APPLY) {
      const next = content.replace(fm.full, `---\n${body.replace(/^\s+|\s+$/g, '')}\n---\n`)
      await writeFile(fullPath, next, 'utf8')
    }
  }

  // ─── Report ────────────────────────────────────────────────────────
  const ln = (s = '') => process.stdout.write(s + '\n')
  ln('============================================================')
  ln('  Backfill CAP frontmatter — ' + (APPLY ? 'APPLY' : 'DRY-RUN'))
  ln('============================================================')
  ln('')
  ln(`Tổng file CAP:                ${stats.total}`)
  ln(`Bỏ qua (đã đầy đủ):           ${stats.skipped}`)
  ln(`Thêm cả id + parent_br:       ${stats.addedBoth}`)
  ln(`Chỉ thêm id:                  ${stats.addedId}`)
  ln(`Chỉ thêm parent_br:           ${stats.addedParentBr}`)
  ln(`Không có frontmatter:         ${stats.noFrontmatter}`)
  ln(`Mismatch (KHÔNG ghi đè):      ${stats.mismatch}`)
  ln('')

  if (reports.changes.length) {
    ln(`--- Thay đổi (${reports.changes.length}) ---`)
    for (const r of reports.changes) {
      const tag = r.addedId && r.addedBr ? '+id +br' : r.addedId ? '+id   ' : '   +br'
      const brColor = r.br.startsWith('TBD-') ? `${r.br} (gap)` : r.br
      ln(`  ${tag}  ${r.capId.padEnd(10)} parent_br=${brColor}    ${r.fileName}`)
    }
    ln('')
  }
  if (reports.mismatch.length) {
    ln(`--- Mismatch (${reports.mismatch.length}) — không ghi đè ---`)
    for (const r of reports.mismatch) {
      ln(`  ⚠ ${r.fileName}    ${r.field} hiện=${r.current}, kỳ vọng=${r.expected}`)
    }
    ln('')
  }
  if (reports.noFm.length) {
    ln(`--- Không có frontmatter ---`)
    for (const r of reports.noFm) ln(`  ! ${r.fileName}`)
    ln('')
  }

  if (!APPLY) {
    ln('Đây là dry-run. Chạy lại với --apply để ghi.')
  } else {
    ln('Hoàn tất. Hãy chạy `node scripts/check-traceability.mjs` để xác nhận.')
  }
}

main().catch((err) => {
  console.error('Lỗi:', err)
  process.exit(2)
})
