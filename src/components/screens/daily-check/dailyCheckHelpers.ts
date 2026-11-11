import {
  DAILY_BRANCH_OPTIONS,
  DAILY_CATALOG_ITEMS,
  DAILY_CLOSING_TASKS,
  type DailyCheckSubmission,
  type DailyCatalogItem,
  type DailyClosingTask,
  type DailyCheckStatus,
  type DailyCheckShift,
  type DailyItemEvaluation,
  type DailyClosingTaskStatus,
  type DailyAreaResult,
  type DailyClosingResult,
} from '@/mocks/dailyCheck'
import type { DailySummaryStats, CalendarDayInfo } from './dailyCheckTypes'

export function computeDailySummaryStats(submissions: DailyCheckSubmission[]): DailySummaryStats {
  let perfect = 0
  let hasIssues = 0
  let missingOrLate = 0

  for (const s of submissions) {
    if (s.failedItemsCount === 0 && s.passRate === 100) {
      perfect++
    }
    if (s.failedItemsCount > 0) {
      hasIssues++
    }
    if (s.status === 'late' || s.status === 'missing') {
      missingOrLate++
    }
  }

  return {
    total: submissions.length,
    perfect,
    hasIssues,
    missingOrLate,
  }
}

export function getDailyStatusBadgeSemantic(status: DailyCheckStatus): string {
  switch (status) {
    case 'on_time':
      return 'daily_on_time'
    case 'late':
      return 'daily_late'
    case 'missing':
      return 'daily_missing'
    default:
      return 'neutral'
  }
}

export function getDailyShiftBadgeSemantic(shift: DailyCheckShift): string {
  return shift === 'dau_ca' ? 'daily_dau_ca' : 'daily_cuoi_ca'
}

export function getDailyItemEvaluationBadge(status: DailyItemEvaluation): string {
  return status === 'pass' ? 'daily_pass' : 'daily_fail'
}

export function getDailyClosingTaskBadge(status: DailyClosingTaskStatus): string {
  return status === 'done' ? 'daily_done' : 'daily_not_done'
}

export function groupCatalogByCategory(items: DailyCatalogItem[]): Record<string, DailyCatalogItem[]> {
  const grouped: Record<string, DailyCatalogItem[]> = {}
  for (const it of items) {
    if (!grouped[it.group]) {
      grouped[it.group] = []
    }
    grouped[it.group].push(it)
  }
  return grouped
}

export function groupClosingTasksByCategory(tasks: DailyClosingTask[]): Record<string, DailyClosingTask[]> {
  const grouped: Record<string, DailyClosingTask[]> = {}
  for (const t of tasks) {
    const grp = t.group || 'NHIỆM VỤ CHỐT CA'
    if (!grouped[grp]) {
      grouped[grp] = []
    }
    grouped[grp].push(t)
  }
  return grouped
}

export function extractFailedSummary(sub: DailyCheckSubmission): string[] {
  if (sub.shift === 'dau_ca') {
    return sub.daytimeItems
      .filter((i) => i.status === 'fail')
      .map((i) => i.name)
  }
  return sub.closingItems
    .filter((i) => i.status === 'not_done')
    .map((i) => i.name)
}

/**
 * Calendar helpers for Matrix views
 */

const DOW_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export function getWeekDates(refDateStr = '2026-10-29'): CalendarDayInfo[] {
  const [y, m, d] = refDateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  
  // In JS, 0 is Sunday, 1 is Monday ... 6 is Saturday
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)

  const result: CalendarDayInfo[] = []
  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday)
    cur.setDate(monday.getDate() + i)
    const curStr = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`
    result.push({
      dateStr: curStr,
      dayOfWeek: DOW_LABELS[i],
      dayOfMonth: cur.getDate(),
      isToday: curStr === '2026-10-29',
    })
  }
  return result
}

export function getMonthDates(year = 2026, month = 10): CalendarDayInfo[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const result: CalendarDayInfo[] = []
  for (let i = 1; i <= daysInMonth; i++) {
    const cur = new Date(year, month - 1, i)
    const curStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const jsDay = cur.getDay()
    const dowIdx = jsDay === 0 ? 6 : jsDay - 1
    result.push({
      dateStr: curStr,
      dayOfWeek: DOW_LABELS[dowIdx],
      dayOfMonth: i,
      isToday: curStr === '2026-10-29',
    })
  }
  return result
}

export function findSubmissionForBranchShiftDate(
  submissions: DailyCheckSubmission[],
  branch: string,
  shift: DailyCheckShift,
  dateStr: string
) {
  return submissions.find(
    (s) => s.branch === branch && s.shift === shift && s.date === dateStr
  )
}

/**
 * Realistic sample evidence photos for historical daily checks (T2, T3, T4...)
 */
export const HISTORICAL_SAMPLE_PHOTOS: Record<string, string[]> = {
  'Biển hiệu quảng cáo': [
    'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=800&q=80',
  ],
  'Thang máy': [
    'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?auto=format&fit=crop&w=800&q=80',
  ],
  'Cửa chính': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  ],
  'Tủ giày (số tủ giày, vị trí để giày)': [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
  ],
  'Khu vực nước uống (giá đựng cốc, cây nước, xô để nước thừa)': [
    'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80',
  ],
  'Hình ảnh thực tế': [
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  ],
  'Đèn quầy lễ tân': [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
  ],
  'Điều hòa khu vực chung': [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  ],
  'Khu làm việc và phía sau quầy': [
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  ],
  'iPad (khay sạc, vệ sinh iPad)': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  ],
  'Vệ sinh bàn ghế': [
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  ],
  'Gương, bồn rửa mặt': [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  ],
  'Đồng phục nhân sự': [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  ],
  'Điều hòa & Tivi': [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
  ],
  'Hệ thống iPad': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
  ],
  'Khóa cửa & Kéo rèm': [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  ],
}

export function getMockHistoricalPhotos(itemName: string, dateStr: string): string[] {
  if (dateStr >= '2026-10-29') return []
  if (HISTORICAL_SAMPLE_PHOTOS[itemName]) {
    return HISTORICAL_SAMPLE_PHOTOS[itemName]
  }
  return []
}

export interface BuildDynamicSubmissionsParams {
  baseSubmissions: DailyCheckSubmission[]
  manualEvals: Record<string, 'pass' | 'fail'>
  itemEvidence: Record<string, string[]>
  categoryEvidence: Record<string, string[]>
  skippedCategories: string[]
  skippedCriteria: { id: string; name: string; group: string }[]
  currentStaffName?: string
}

/**
 * Builds the unified, live submissions dataset synced directly from the Self-Evaluation (Tự đánh giá) tab.
 * This guarantees that changes made by evaluators (pass/fail toggles, photos, skipped items)
 * immediately reflect across the Overview (Tổng hợp) matrix, status tiles, and table view.
 */
export function buildDynamicSubmissions({
  baseSubmissions,
  manualEvals,
  itemEvidence,
  skippedCategories,
  skippedCriteria,
  currentStaffName = 'Nguyễn Thị Ngọc Ánh',
}: BuildDynamicSubmissionsParams): DailyCheckSubmission[] {
  const result: DailyCheckSubmission[] = []
  const skippedCritNames = new Set(skippedCriteria.map((c) => c.name))

  // 1. Current week dates
  const weekDays = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29']

  // 2. Generate synced submissions for each branch
  for (const branch of DAILY_BRANCH_OPTIONS) {
    for (const dateStr of weekDays) {
      const isToday = dateStr === '2026-10-29'

      // ─── A. ĐẦU CA (SÁNG) ───
      const activeMorningItems = DAILY_CATALOG_ITEMS.filter(
        (it) => !skippedCategories.includes(it.group) && !skippedCritNames.has(it.detail)
      )

      if (isToday) {
        // Today morning evaluation
        const evaluatedItems = activeMorningItems.filter((it) => {
          const key = `${branch}-dau_ca-${it.detail}`
          return manualEvals[key] !== undefined
        })

        // For branches with manual evaluations or other branches in demo
        if (branch === 'CS1 Linh Đàm') {
          if (evaluatedItems.length > 0) {
            const daytimeItems: DailyAreaResult[] = evaluatedItems.map((it) => {
              const key = `${branch}-dau_ca-${it.detail}`
              const status: DailyItemEvaluation = manualEvals[key]!
              const evidenceKey = `${branch}-dau_ca-2026-10-29-${it.detail}`
              const photos = itemEvidence[evidenceKey] || []
              return {
                key: it.stt,
                name: it.detail,
                status,
                photos,
                note: status === 'fail' ? 'Cần kiểm tra khắc phục tiêu chuẩn' : undefined,
              }
            })
            const failedItemsCount = daytimeItems.filter((i) => i.status === 'fail').length
            const passCount = daytimeItems.length - failedItemsCount
            const passRate = daytimeItems.length > 0 ? Math.round((passCount / daytimeItems.length) * 100) : 100

            result.push({
              id: `chk_${branch.replace(/\s+/g, '_')}_dau_ca_20261029`,
              timestamp: '2026-10-29 08:15:00',
              date: '2026-10-29',
              branch,
              staffName: currentStaffName,
              shift: 'dau_ca',
              status: failedItemsCount === 0 ? 'on_time' : 'late',
              daytimeItems,
              closingItems: [],
              passRate,
              failedItemsCount,
            })
          }
        } else {
          // Other branches: demo fallback
          const daytimeItems: DailyAreaResult[] = activeMorningItems.map((it) => {
            const key = `${branch}-dau_ca-${it.detail}`
            const manual = manualEvals[key]
            const status: DailyItemEvaluation = manual || 'pass'
            const evidenceKey = `${branch}-dau_ca-2026-10-29-${it.detail}`
            const photos = itemEvidence[evidenceKey] || []
            return {
              key: it.stt,
              name: it.detail,
              status,
              photos,
              note: status === 'fail' ? 'Cần kiểm tra khắc phục tiêu chuẩn' : undefined,
            }
          })
          const failedItemsCount = daytimeItems.filter((i) => i.status === 'fail').length
          const passCount = daytimeItems.length - failedItemsCount
          const passRate = daytimeItems.length > 0 ? Math.round((passCount / daytimeItems.length) * 100) : 100

          result.push({
            id: `chk_${branch.replace(/\s+/g, '_')}_dau_ca_20261029`,
            timestamp: '2026-10-29 08:15:00',
            date: '2026-10-29',
            branch,
            staffName: currentStaffName,
            shift: 'dau_ca',
            status: failedItemsCount === 0 ? 'on_time' : 'late',
            daytimeItems,
            closingItems: [],
            passRate,
            failedItemsCount,
          })
        }
      } else {
        // Past days (T2, T3, T4)
        const daytimeItems: DailyAreaResult[] = activeMorningItems.map((it) => {
          let status: DailyItemEvaluation = 'pass'
          let note: string | undefined = undefined
          let photos: string[] = getMockHistoricalPhotos(it.detail, dateStr)

          // Historical issue on T4 (2026-10-28) for CS1 Linh Đàm
          if (branch === 'CS1 Linh Đàm' && dateStr === '2026-10-28' && it.detail === 'Điều hòa khu vực chung') {
            status = 'fail'
            note = 'Dàn lạnh chảy nước tại sảnh chung, đã báo kỹ thuật xử lý.'
            photos = ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80']
          }

          // Historical issue on T3 (2026-10-27) for CS6 Tonkin
          if (branch === 'CS6 Tonkin' && dateStr === '2026-10-27' && it.detail === 'Thảm chân') {
            status = 'fail'
            note = 'Thảm chân bẩn chưa kịp giặt trước giờ đón khách.'
            photos = ['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80']
          }

          return {
            key: it.stt,
            name: it.detail,
            status,
            photos,
            note,
          }
        })

        const failedItemsCount = daytimeItems.filter((i) => i.status === 'fail').length
        const passCount = daytimeItems.length - failedItemsCount
        const passRate = daytimeItems.length > 0 ? Math.round((passCount / daytimeItems.length) * 100) : 100

        result.push({
          id: `chk_${branch.replace(/\s+/g, '_')}_dau_ca_${dateStr.replace(/-/g, '')}`,
          timestamp: `${dateStr} 08:15:00`,
          date: dateStr,
          branch,
          staffName: currentStaffName,
          shift: 'dau_ca',
          status: failedItemsCount === 0 ? 'on_time' : 'late',
          daytimeItems,
          closingItems: [],
          passRate,
          failedItemsCount,
        })
      }

      // ─── B. CUỐI CA (TỐI) ───
      const activeClosingTasks = DAILY_CLOSING_TASKS.filter(
        (t) => !skippedCategories.includes(t.group) && !skippedCritNames.has(t.name)
      )

      if (isToday) {
        // Today evening: only include evaluated tasks for this branch
        const branchEveningEvaluated = activeClosingTasks.filter((t) => {
          const key = `${branch}-cuoi_ca-${t.name}`
          return manualEvals[key] !== undefined
        })

        if (branch === 'CS1 Linh Đàm') {
          if (branchEveningEvaluated.length > 0) {
            const closingItems: DailyClosingResult[] = branchEveningEvaluated.map((t) => {
              const key = `${branch}-cuoi_ca-${t.name}`
              const isPass = manualEvals[key] === 'pass'
              return {
                id: t.id,
                name: t.name,
                status: isPass ? 'done' : 'not_done',
                note: !isPass ? 'Chưa hoàn tất công việc cuối ca' : undefined,
              }
            })
            const failedItemsCount = closingItems.filter((i) => i.status === 'not_done').length
            const passCount = closingItems.length - failedItemsCount
            const passRate = closingItems.length > 0 ? Math.round((passCount / closingItems.length) * 100) : 100

            result.push({
              id: `chk_${branch.replace(/\s+/g, '_')}_cuoi_ca_20261029`,
              timestamp: '2026-10-29 20:30:00',
              date: '2026-10-29',
              branch,
              staffName: currentStaffName,
              shift: 'cuoi_ca',
              status: failedItemsCount === 0 ? 'on_time' : 'late',
              daytimeItems: [],
              closingItems,
              passRate,
              failedItemsCount,
            })
          }
        } else {
          // Other branches
          const hasEvaluatedNight = Object.keys(manualEvals).some((k) => k.startsWith(`${branch}-cuoi_ca`))
          if (hasEvaluatedNight) {
            const closingItems: DailyClosingResult[] = activeClosingTasks.map((t) => {
              const key = `${branch}-cuoi_ca-${t.name}`
              const isPass = manualEvals[key] !== 'fail'
              return {
                id: t.id,
                name: t.name,
                status: isPass ? 'done' : 'not_done',
                note: !isPass ? 'Chưa hoàn tất công việc cuối ca' : undefined,
              }
            })
            const failedItemsCount = closingItems.filter((i) => i.status === 'not_done').length
            const passCount = closingItems.length - failedItemsCount
            const passRate = closingItems.length > 0 ? Math.round((passCount / closingItems.length) * 100) : 100

            result.push({
              id: `chk_${branch.replace(/\s+/g, '_')}_cuoi_ca_20261029`,
              timestamp: '2026-10-29 20:30:00',
              date: '2026-10-29',
              branch,
              staffName: currentStaffName,
              shift: 'cuoi_ca',
              status: failedItemsCount === 0 ? 'on_time' : 'late',
              daytimeItems: [],
              closingItems,
              passRate,
              failedItemsCount,
            })
          }
        }
      } else {
        // Past days (T2, T3, T4)
        const closingItems: DailyClosingResult[] = activeClosingTasks.map((t) => {
          let status: DailyClosingTaskStatus = 'done'
          let note: string | undefined = undefined

          // Historical issue on T3 (2026-10-27) for CS5 47 Nguyễn Tuân
          if (branch === 'CS5 47 Nguyễn Tuân' && dateStr === '2026-10-27' && t.name === 'Khóa cửa an toàn') {
            status = 'not_done'
            note = 'Chưa kiểm tra khóa chốt cửa sổ tầng 2'
          }

          return {
            id: t.id,
            name: t.name,
            status,
            note,
          }
        })

        const failedItemsCount = closingItems.filter((i) => i.status === 'not_done').length
        const passCount = closingItems.length - failedItemsCount
        const passRate = closingItems.length > 0 ? Math.round((passCount / closingItems.length) * 100) : 100

        result.push({
          id: `chk_${branch.replace(/\s+/g, '_')}_cuoi_ca_${dateStr.replace(/-/g, '')}`,
          timestamp: `${dateStr} 20:30:00`,
          date: dateStr,
          branch,
          staffName: currentStaffName,
          shift: 'cuoi_ca',
          status: failedItemsCount === 0 ? 'on_time' : 'late',
          daytimeItems: [],
          closingItems,
          passRate,
          failedItemsCount,
        })
      }
    }
  }

  // 3. Keep older historical submissions (before this week) for Monthly view & Table pagination
  const olderHistorical = baseSubmissions.filter((s) => s.date < '2026-10-26')
  return [...result, ...olderHistorical]
}
