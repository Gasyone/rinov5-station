#!/usr/bin/env node
/**
 * audit-navigation.mjs
 *
 * Đối soát navigation.ts ↔ screens.ts ↔ US docs ↔ screen code.
 * Sinh báo cáo: menuId nào có US, có screen code, có metadata — và cái nào thiếu.
 *
 * Chạy:
 *   node scripts/audit-navigation.mjs              # text report
 *   node scripts/audit-navigation.mjs --json       # JSON cho tool khác
 *   node scripts/audit-navigation.mjs --markdown   # Markdown table (paste vào docs)
 *
 * Không có dependency. Node >= 18.
 */

import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { existsSync } from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const args = new Set(process.argv.slice(2))
const OPT_JSON = args.has('--json')
const OPT_MD = args.has('--markdown')

// ─── 1. Parse navigation.ts ──────────────────────────────────────────

async function parseNavigation() {
  const navPath = path.join(ROOT, 'src', 'config', 'navigation.ts')
  const content = await readFile(navPath, 'utf8')
  
  const items = []
  // Match: { id: 'xxx', label: 'yyy', href: '/app/zzz' ... }
  const re = /\{\s*id:\s*'([^']+)',\s*label:\s*'([^']+)',\s*href:\s*'([^']+)'[^}]*\}/g
  let m
  while ((m = re.exec(content)) !== null) {
    const [, id, label, href] = m
    const hidden = /hiddenInSidebar:\s*true/.test(m[0])
    items.push({ id, label, href, hidden })
  }
  
  // Also extract group info
  const groups = []
  const groupRe = /\{\s*id:\s*'([^']+)',\s*label:\s*'([^']+)'[^}]*items:\s*\[/g
  while ((m = groupRe.exec(content)) !== null) {
    groups.push({ id: m[1], label: m[2] })
  }
  
  return { items, groups }
}

// ─── 2. Parse screens.ts ─────────────────────────────────────────────

async function parseScreens() {
  const screensPath = path.join(ROOT, 'src', 'config', 'screens.ts')
  const content = await readFile(screensPath, 'utf8')
  
  const screens = new Set()
  const re = /^\s*(\w+):\s*\{/gm
  let m
  while ((m = re.exec(content)) !== null) {
    screens.add(m[1])
  }
  return screens
}

// ─── 3. Find screen code ─────────────────────────────────────────────

async function findScreenCode() {
  const screensDir = path.join(ROOT, 'src', 'components', 'screens')
  const codeMap = new Map() // menuId → folder/file
  
  if (!existsSync(screensDir)) return codeMap
  
  const entries = await readdir(screensDir, { withFileTypes: true })
  
  // Map folder names to potential menuIds
  // booking-test → booking_test, trial-class → trial_class, etc.
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const kebab = entry.name
      const snake = kebab.replace(/-/g, '_')
      codeMap.set(snake, `screens/${kebab}/`)
    } else if (entry.isFile() && entry.name.endsWith('Screen.tsx')) {
      // CalendarClassScheduleScreen.tsx → calendar_class_schedule
      const name = entry.name.replace('Screen.tsx', '').replace('.stories.tsx', '')
      const snake = name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')
      codeMap.set(snake, `screens/${entry.name}`)
    }
  }
  
  // Manual overrides for known mappings
  const overrides = {
    'booking_test': 'screens/booking-test/',
    'trial_class': 'screens/trial-class/',
    'work_registration': 'screens/work-registration/',
    'hr_employees': 'screens/employees/',
    'calendar_class_schedule': 'screens/CalendarClassScheduleScreen.tsx',
    'calendar_event_schedule': 'screens/CalendarEventScheduleScreen.tsx',
    'my_schedule': 'screens/MyScheduleScreen.tsx',
    'dashboard': 'screens/DashboardScreen.tsx',
    'students': 'screens/students/',
    'classes': 'screens/classes/',
    'orders': 'screens/orders/',
    'products': 'screens/products/',
    'users': 'screens/users/',
    'contact_directory': 'screens/contacts/',
  }
  for (const [k, v] of Object.entries(overrides)) {
    codeMap.set(k, v)
  }
  
  return codeMap
}

// ─── 4. Find US docs mentioning menuId ───────────────────────────────

async function findUSForMenuIds(menuIds) {
  const docsDir = path.join(ROOT, 'docs', 'business-functions')
  const files = (await readdir(docsDir)).filter(f => f.startsWith('US-') && f.endsWith('.md'))
  
  // Build map: menuId → [US files that mention it]
  const usMap = new Map()
  for (const id of menuIds) usMap.set(id, [])
  
  for (const f of files) {
    const content = await readFile(path.join(docsDir, f), 'utf8')
    for (const id of menuIds) {
      if (content.includes(id) || content.includes(`/app/${id}`)) {
        usMap.get(id).push(f.replace('.md', ''))
      }
    }
  }
  
  // Also check BF files for menu_id references
  const bfFiles = (await readdir(docsDir)).filter(f => f.startsWith('BF-') && f.endsWith('.md'))
  for (const f of bfFiles) {
    const content = await readFile(path.join(docsDir, f), 'utf8')
    for (const id of menuIds) {
      if (content.includes(`\`${id}\``) || content.includes(`"${id}"`)) {
        const existing = usMap.get(id)
        const bfRef = `(BF) ${f.replace('.md', '')}`
        if (!existing.includes(bfRef)) existing.push(bfRef)
      }
    }
  }
  
  return usMap
}

// ─── 5. Build report ─────────────────────────────────────────────────

async function main() {
  const { items } = await parseNavigation()
  const screensConfig = await parseScreens()
  const codeMap = await findScreenCode()
  
  const menuIds = items.map(i => i.id)
  const usMap = await findUSForMenuIds(menuIds)
  
  const rows = items.map(item => {
    const hasScreenConfig = screensConfig.has(item.id)
    const hasCode = codeMap.has(item.id)
    const usRefs = usMap.get(item.id) || []
    const hasUS = usRefs.length > 0
    
    let status
    if (hasUS && hasCode) status = '🟢 FULL'
    else if (hasUS && !hasCode) status = '🟡 DOC-ONLY'
    else if (!hasUS && hasCode) status = '🟠 CODE-ONLY'
    else status = '🔴 EMPTY'
    
    return {
      menuId: item.id,
      label: item.label,
      hidden: item.hidden,
      hasScreenConfig,
      hasCode,
      codePath: codeMap.get(item.id) || null,
      hasUS,
      usCount: usRefs.length,
      usRefs: usRefs.slice(0, 3), // max 3 for display
      status,
    }
  })
  
  // Stats
  const stats = {
    total: rows.length,
    full: rows.filter(r => r.status === '🟢 FULL').length,
    docOnly: rows.filter(r => r.status === '🟡 DOC-ONLY').length,
    codeOnly: rows.filter(r => r.status === '🟠 CODE-ONLY').length,
    empty: rows.filter(r => r.status === '🔴 EMPTY').length,
    hidden: rows.filter(r => r.hidden).length,
    hasConfig: rows.filter(r => r.hasScreenConfig).length,
  }
  
  if (OPT_JSON) {
    process.stdout.write(JSON.stringify({ stats, rows }, null, 2) + '\n')
    return
  }
  
  if (OPT_MD) {
    printMarkdown(stats, rows)
    return
  }
  
  printText(stats, rows)
}

function printText(stats, rows) {
  const ln = (s = '') => process.stdout.write(s + '\n')
  ln('============================================================')
  ln('  Navigation ↔ Docs ↔ Code Audit')
  ln('============================================================')
  ln('')
  ln(`Total menuIds:     ${stats.total}`)
  ln(`  🟢 FULL (US+Code):  ${stats.full}`)
  ln(`  🟡 DOC-ONLY:        ${stats.docOnly}`)
  ln(`  🟠 CODE-ONLY:       ${stats.codeOnly}`)
  ln(`  🔴 EMPTY:           ${stats.empty}`)
  ln(`  Hidden in sidebar:  ${stats.hidden}`)
  ln(`  In screens.ts:      ${stats.hasConfig}`)
  ln('')
  
  for (const status of ['🔴 EMPTY', '🟠 CODE-ONLY', '🟡 DOC-ONLY', '🟢 FULL']) {
    const group = rows.filter(r => r.status === status)
    if (group.length === 0) continue
    ln(`--- ${status} (${group.length}) ---`)
    for (const r of group) {
      const hide = r.hidden ? ' [hidden]' : ''
      const code = r.codePath ? ` code=${r.codePath}` : ''
      const us = r.usCount > 0 ? ` US=${r.usCount}` : ''
      ln(`  ${r.menuId.padEnd(28)} ${r.label.padEnd(24)}${hide}${code}${us}`)
    }
    ln('')
  }
}

function printMarkdown(stats, rows) {
  const ln = (s = '') => process.stdout.write(s + '\n')
  ln('# Audit: Navigation ↔ Docs ↔ Code')
  ln('')
  ln(`| Metric | Count |`)
  ln(`|--------|-------|`)
  ln(`| Total menuIds | ${stats.total} |`)
  ln(`| 🟢 FULL (US + Code) | ${stats.full} |`)
  ln(`| 🟡 DOC-ONLY (US, no code) | ${stats.docOnly} |`)
  ln(`| 🟠 CODE-ONLY (code, no US) | ${stats.codeOnly} |`)
  ln(`| 🔴 EMPTY (neither) | ${stats.empty} |`)
  ln('')
  ln('| menuId | Label | Status | Code | US | Hidden |')
  ln('|--------|-------|--------|------|-----|--------|')
  for (const r of rows) {
    const hide = r.hidden ? '✓' : ''
    const code = r.codePath || '—'
    const us = r.usCount > 0 ? `${r.usCount}` : '—'
    ln(`| \`${r.menuId}\` | ${r.label} | ${r.status} | ${code} | ${us} | ${hide} |`)
  }
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(2)
})
