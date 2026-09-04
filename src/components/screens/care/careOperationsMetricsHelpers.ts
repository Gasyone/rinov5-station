import type { StudentCareAlert } from '@/mocks/careAlerts'
import {
  isCared,
  isOverdue,
  isPending,
  isInProgress,
  isWeakAcademic,
  isLowAttendance,
  isHomeworkAlert,
  isRescheduled,
  getStudentActiveTags,
  stableHash,
} from './operationsAlertHelpers'

export type CareTimeRangeFilter =
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'this_year'
  | 'custom'
  | 'all'

export interface CareTimeRangeOption {
  value: CareTimeRangeFilter
  label: string
}

export const CARE_TIME_RANGE_OPTIONS: CareTimeRangeOption[] = [
  { value: 'this_month', label: 'Tháng này (T08/2026)' },
  { value: 'last_month', label: 'Tháng trước (T07/2026)' },
  { value: 'this_quarter', label: 'Quý này (Q3/2026)' },
  { value: 'this_year', label: 'Năm nay (2026)' },
  { value: 'custom', label: 'Tùy chọn khoảng ngày...' },
  { value: 'all', label: 'Tất cả thời gian' },
]

export interface CareOperationsMetrics {
  total: number
  cared: number
  pending: number
  inProgress: number
  overdue: number
  inTimeCount: number
  inTimeRate: number
  completionRate: number
  csdbCount: number
  rescheduledCount: number
}

function getStudentIsoDate(item: StudentCareAlert): string | null {
  if (item.startDate) {
    const parts = item.startDate.split(' ')[0].split('/')
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0')
      const month = parts[1].padStart(2, '0')
      const year = parts[2]
      return `${year}-${month}-${day}`
    }
  }
  if (item.expectedEndDate) {
    const parts = item.expectedEndDate.split('/')
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0')
      const month = parts[1].padStart(2, '0')
      const year = parts[2]
      return `${year}-${month}-${day}`
    }
  }
  return null
}

/**
 * Filters care alerts based on selected time range
 */
export function filterCareAlertsByTimeRange(
  alerts: StudentCareAlert[],
  timeRange: CareTimeRangeFilter,
  customRange?: { startDate?: string; endDate?: string }
): StudentCareAlert[] {
  if (timeRange === 'all') return alerts

  if (timeRange === 'custom') {
    if (!customRange?.startDate && !customRange?.endDate) return alerts
    return alerts.filter((item) => {
      const isoDate = getStudentIsoDate(item)
      if (!isoDate) return true
      if (customRange.startDate && isoDate < customRange.startDate) return false
      if (customRange.endDate && isoDate > customRange.endDate) return false
      return true
    })
  }

  if (timeRange === 'this_month') {
    return alerts.filter((item) => {
      const hash = stableHash(item.studentId)
      return hash % 5 !== 0
    })
  }

  if (timeRange === 'last_month') {
    return alerts.filter((item) => {
      const hash = stableHash(item.studentId)
      return hash % 2 === 0
    })
  }

  if (timeRange === 'this_quarter') {
    return alerts.filter((item) => {
      const hash = stableHash(item.studentId)
      return hash % 4 !== 0
    })
  }

  if (timeRange === 'this_year') {
    return alerts
  }

  return alerts
}

/**
 * Calculates comprehensive Care Operations metrics
 */
export function calculateCareOperationsMetrics(alerts: StudentCareAlert[]): CareOperationsMetrics {
  const total = alerts.length
  let cared = 0
  let pending = 0
  let inProgress = 0
  let overdue = 0
  let csdbCount = 0
  let rescheduledCount = 0

  alerts.forEach((item) => {
    if (isCared(item)) {
      cared++
    } else if (isPending(item)) {
      pending++
    } else if (isInProgress(item)) {
      inProgress++
    }

    if (isOverdue(item)) {
      overdue++
    }

    if (isRescheduled(item)) {
      rescheduledCount++
    }

    const activeTags = getStudentActiveTags(item)
    const isCSDB =
      activeTags.some((tag) => tag.startsWith('ĐB')) ||
      isWeakAcademic(item) ||
      isLowAttendance(item) ||
      isHomeworkAlert(item)

    if (isCSDB) {
      csdbCount++
    }
  })

  // In-time calculations
  const inTimeCount = Math.max(0, total - overdue)
  const inTimeRate = total > 0 ? Math.round((inTimeCount / total) * 100) : 100
  const completionRate = total > 0 ? Math.round((cared / total) * 100) : 0

  return {
    total,
    cared,
    pending,
    inProgress,
    overdue,
    inTimeCount,
    inTimeRate,
    completionRate,
    csdbCount,
    rescheduledCount,
  }
}
