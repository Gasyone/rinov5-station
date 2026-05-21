#!/usr/bin/env node
/**
 * check-traceability.mjs
 *
 * Kiểm tra ràng buộc Traceability của hệ tài liệu Rinov5.
 * - Đọc tất cả file .md trong docs/.
 * - Parse frontmatter YAML (đơn giản, không cần dependency).
 * - Build graph BR ↔ SR ↔ Persona ↔ CAP ↔ BF ↔ US.
 * - Báo cáo các "Reverse Validation findings".
 *
 * Cách chạy (Windows cmd):
 *   node scripts/check-traceability.mjs
 *   node scripts/check-traceability.mjs --json     (xuất JSON cho tool khác đọc)
 *   node scripts/check-traceability.mjs --strict   (exit code 1 nếu có findings)
 *
 * Không có dependency ngoài. Yêu cầu Node ≥ 18.
 */

import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// ─── Config ──────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS_DIR = path.join(ROOT, 'docs')

const args = new Set(process.argv.slice(2))
const OPT_JSON = args.has('--json')
const OPT_STRICT = args.has('--strict')

// Bỏ qua các nhánh không cần kiểm tra (template là khung trống).
const IGNORE_DIRS = new Set(['templates', 'node_modules', '.git'])

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Liệt kê đệ quy file .md trong docs/, bỏ qua thư mục trong IGNORE_DIRS.
 */
async function listMarkdown(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await listMarkdown(full, acc)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      acc.push(full)
    }
  }
  return acc
}

/**
 * Parse YAML frontmatter rất đơn giản (không hỗ trợ object lồng nhau).
 * Đủ cho schema phẳng của Rinov5: id, title, type, domain, status,
 * persona, parent_br, bf, sr, tags, priority, ...
 */
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const body = m[1]
  const out = {}
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const idx = line.indexOf(':')
    if (idx < 0) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (!value) {
      out[key] = ''
      continue
    }
    // List inline: [a, "b", c]
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim()
      out[key] = inner === ''
        ? []
        : inner.split(',').map((s) => stripQuotes(s.trim()))
      continue
    }
    out[key] = stripQuotes(value)
  }
  return out
}

function stripQuotes(s) {
  if (s.length >= 2 && (s.startsWith('"') && s.endsWith('"'))) return s.slice(1, -1)
  if (s.length >= 2 && (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1)
  return s
}

/**
 * Đoán "type" của file dựa trên tên nếu frontmatter thiếu.
 * Cho phép script vẫn hoạt động với các US legacy chưa có frontmatter.
 */
function inferType(fileName) {
  if (fileName.startsWith('US-')) return 'User Story'
  if (fileName.startsWith('BF-')) return 'Business Function'
  if (fileName.startsWith('CAP-')) return 'Capability'
  if (fileName.startsWith('BR-')) return 'Business Requirement'
  if (fileName.startsWith('SR-')) return 'Stakeholder Requirement'
  if (fileName.startsWith('PERSONA-')) return 'Persona'
  if (fileName.startsWith('FLOW-')) return 'Flow'
  return null
}

function inferIdFromFile(fileName) {
  // VD: US-CLS01-01-quan-ly-... → US-CLS01-01
  const m = fileName.match(/^([A-Z]+(?:-[A-Z0-9]+)*-\d+(?:-\d+)?)/)
  return m ? m[1] : null
}

/**
 * Tìm tất cả mã định danh được nhắc tới trong nội dung file (không phải link tới file ngoài).
 * Dùng để dò "outlinks logic" khi tài liệu không dùng wikilink chuẩn.
 */
function extractMentionedIds(content) {
  const ids = new Set()
  const patterns = [
    /\bBR-\d{3}\b/g,
    /\bSR-[A-Z_]+-\d{3}\b/g,
    /\bPERSONA-[A-Z_]+\b/g,
    /\bCAP-[A-Z]+\b/g,
    /\bBF-[A-Z]+-\d{2}\b/g,
    /\bUS-[A-Z0-9]+(?:-\d{2}){0,2}\b/g,
  ]
  for (const re of patterns) {
    for (const m of content.matchAll(re)) ids.add(m[0])
  }
  return ids
}

// ─── Build Graph ─────────────────────────────────────────────────────

async function buildGraph() {
  const files = await listMarkdown(DOCS_DIR)
  const nodes = new Map() // id → { id, type, file, fm, mentions }

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8')
    const fm = parseFrontmatter(content)
    const baseName = path.basename(filePath, '.md')
    const type = fm.type || inferType(baseName)
    const id = fm.id || inferIdFromFile(baseName)
    if (!id) continue
    const mentions = extractMentionedIds(content)
    // Tránh tự tham chiếu
    mentions.delete(id)
    nodes.set(id, {
      id,
      type,
      file: path.relative(ROOT, filePath).replace(/\\/g, '/'),
      fm,
      mentions: [...mentions],
    })
  }
  return nodes
}

// ─── Validation Rules ────────────────────────────────────────────────

function runValidations(nodes) {
  const findings = []
  const all = [...nodes.values()]

  const has = (id) => nodes.has(id)
  const inboundFrom = (targetId, ofType) => all.filter((n) => n.type === ofType && n.mentions.includes(targetId))

  // [V1] BR phải có ít nhất 1 OKR/KPI hoặc CAP map.
  for (const n of all.filter((x) => x.type === 'Business Requirement')) {
    const refsCap = n.mentions.some((m) => m.startsWith('CAP-'))
    if (!refsCap) {
      findings.push({
        rule: 'V1', severity: 'warn',
        target: n.id, file: n.file,
        message: 'BR không tham chiếu tới CAP nào — gap nghiệp vụ tiềm năng.',
      })
    }
    const sr = inboundFrom(n.id, 'Stakeholder Requirement')
    if (sr.length === 0) {
      findings.push({
        rule: 'V1b', severity: 'warn',
        target: n.id, file: n.file,
        message: 'BR chưa có SR phái sinh — chưa nhóm Persona nào cụ thể hóa nhu cầu này.',
      })
    }
  }

  // [V5] CAP nên có parent_br trace ngược lên Tier 0 (BR).
  // Ngoại lệ: parent_br = "TBD-NEEDS-BR" → là gap có chủ ý, severity=info.
  for (const n of all.filter((x) => x.type === 'Capability')) {
    const parentBr = n.fm.parent_br
    if (!parentBr) {
      findings.push({
        rule: 'V5', severity: 'warn',
        target: n.id, file: n.file,
        message: 'CAP thiếu frontmatter `parent_br` — không trace lên BR.',
      })
    } else if (parentBr.startsWith('TBD-')) {
      findings.push({
        rule: 'V5b', severity: 'info',
        target: n.id, file: n.file,
        message: `CAP gắn placeholder ${parentBr} — gap nghiệp vụ đã ghi nhận, cần workshop tạo BR thật.`,
      })
    } else if (!has(parentBr)) {
      findings.push({
        rule: 'V5c', severity: 'error',
        target: n.id, file: n.file,
        message: `CAP trace tới BR không tồn tại: ${parentBr}`,
      })
    }
  }

  // [V2] SR phải có parent_br và persona.
  for (const n of all.filter((x) => x.type === 'Stakeholder Requirement')) {
    const parentBr = n.fm.parent_br
    if (!parentBr) {
      findings.push({
        rule: 'V2', severity: 'error',
        target: n.id, file: n.file,
        message: 'SR thiếu frontmatter `parent_br` — không trace ngược lên BR được.',
      })
    } else if (!has(parentBr)) {
      findings.push({
        rule: 'V2b', severity: 'error',
        target: n.id, file: n.file,
        message: `SR trace tới BR không tồn tại: ${parentBr}`,
      })
    }
    const persona = n.fm.persona
    if (!persona) {
      findings.push({
        rule: 'V2c', severity: 'error',
        target: n.id, file: n.file,
        message: 'SR thiếu frontmatter `persona` — không gắn với nhóm người dùng cụ thể.',
      })
    } else if (!has(persona)) {
      findings.push({
        rule: 'V2d', severity: 'error',
        target: n.id, file: n.file,
        message: `SR trace tới Persona không tồn tại: ${persona}`,
      })
    }
    const us = inboundFrom(n.id, 'User Story')
    if (us.length === 0) {
      findings.push({
        rule: 'V2e', severity: 'info',
        target: n.id, file: n.file,
        message: 'SR chưa có US phái sinh — chưa được lập kế hoạch triển khai.',
      })
    }
  }

  // [V3] Persona phải xuất hiện trong ít nhất 1 SR.
  for (const n of all.filter((x) => x.type === 'Persona')) {
    const sr = all.filter((s) => s.type === 'Stakeholder Requirement' && s.fm.persona === n.id)
    if (sr.length === 0) {
      findings.push({
        rule: 'V3', severity: 'warn',
        target: n.id, file: n.file,
        message: 'Persona chưa được tham chiếu bởi SR nào — có thể là persona giả tưởng.',
      })
    }
  }

  // [V4] US nên có frontmatter sr (hoặc bf) để trace ngược.
  for (const n of all.filter((x) => x.type === 'User Story')) {
    const sr = n.fm.sr
    const bf = n.fm.bf
    if (!sr && !bf) {
      findings.push({
        rule: 'V4', severity: 'warn',
        target: n.id, file: n.file,
        message: 'US thiếu frontmatter `sr` và `bf` — không trace ngược về Tier 0/3.',
      })
      continue
    }
    if (sr && !has(sr)) {
      findings.push({
        rule: 'V4b', severity: 'error',
        target: n.id, file: n.file,
        message: `US trace tới SR không tồn tại: ${sr}`,
      })
    }
    if (bf && !has(bf)) {
      findings.push({
        rule: 'V4c', severity: 'warn',
        target: n.id, file: n.file,
        message: `US trace tới BF không tồn tại: ${bf}`,
      })
    }
  }

  return findings
}

// ─── Reporters ───────────────────────────────────────────────────────

function summarize(nodes, findings) {
  const byType = {}
  for (const n of nodes.values()) byType[n.type || 'Unknown'] = (byType[n.type || 'Unknown'] || 0) + 1
  const bySeverity = { error: 0, warn: 0, info: 0 }
  for (const f of findings) bySeverity[f.severity] = (bySeverity[f.severity] || 0) + 1
  return { byType, bySeverity }
}

function printText(nodes, findings, summary) {
  const ln = (s = '') => process.stdout.write(s + '\n')
  ln('============================================================')
  ln('  Rinov5 Traceability Check')
  ln('============================================================')
  ln('')
  ln('Số tài liệu theo loại:')
  for (const [type, count] of Object.entries(summary.byType).sort()) {
    ln(`  - ${type.padEnd(28)} ${count}`)
  }
  ln('')
  ln(`Tổng số findings: ${findings.length}  (errors=${summary.bySeverity.error}, warnings=${summary.bySeverity.warn}, info=${summary.bySeverity.info})`)
  ln('')
  if (findings.length === 0) {
    ln('Không phát hiện vấn đề. Mọi tài liệu đã trace ngược đầy đủ.')
    return
  }
  const groups = { error: [], warn: [], info: [] }
  for (const f of findings) groups[f.severity].push(f)
  for (const sev of ['error', 'warn', 'info']) {
    if (groups[sev].length === 0) continue
    ln(`--- ${sev.toUpperCase()} (${groups[sev].length}) ---`)
    for (const f of groups[sev]) {
      ln(`  [${f.rule}] ${f.target}`)
      ln(`         ${f.message}`)
      ln(`         file: ${f.file}`)
    }
    ln('')
  }
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  const nodes = await buildGraph()
  const findings = runValidations(nodes)
  const summary = summarize(nodes, findings)

  if (OPT_JSON) {
    const out = {
      summary,
      findings,
      nodes: [...nodes.values()].map((n) => ({
        id: n.id, type: n.type, file: n.file,
        mentions: n.mentions,
      })),
    }
    process.stdout.write(JSON.stringify(out, null, 2) + '\n')
  } else {
    printText(nodes, findings, summary)
  }

  if (OPT_STRICT && summary.bySeverity.error > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Lỗi khi chạy traceability check:')
  console.error(err)
  process.exit(2)
})
