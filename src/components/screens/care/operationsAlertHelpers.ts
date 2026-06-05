import { StudentCareAlert } from '@/mocks/careAlerts'

/**
 * Calculates the percentage of remaining sessions
 */
export function calculateRemainingSessionsRatio(remaining: number, total: number): number {
  if (!total) return 0
  return Math.round((remaining / total) * 100)
}

/**
 * Gets attendance rate percentage from a ratio string like '6/6'
 */
export function parseAttendanceRate(ratio: string): number {
  if (!ratio || ratio === '0/0') return 0
  const [present, total] = ratio.split('/').map(Number)
  if (!total) return 0
  return Math.round((present / total) * 100)
}

/**
 * Compares two scores to determine the trend direction
 */
export function getTrendDirection(current: number, prior: number): 'up' | 'down' | 'flat' {
  if (current > prior) return 'up'
  if (current < prior) return 'down'
  return 'flat'
}

/**
 * Filters the raw student care alerts array based on UI parameters
 */
export function filterAlertData(
  data: StudentCareAlert[],
  filters: {
    search?: string
    status?: string
    careAlert?: string
    classCode?: string
    callConfirmation?: string
  }
): StudentCareAlert[] {
  return data.filter((item) => {
    // 1. Status Filter
    if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
      return false
    }

    // 2. Alert Type Filter
    if (filters.careAlert && filters.careAlert !== 'all' && item.careAlert !== filters.careAlert) {
      return false
    }

    // 3. Class Code Filter
    if (filters.classCode && filters.classCode !== 'all' && item.classCode !== filters.classCode) {
      return false
    }

    // 4. Call Confirmation Filter
    if (filters.callConfirmation && filters.callConfirmation !== 'all' && item.callConfirmation !== filters.callConfirmation) {
      return false
    }

    // 5. General Search
    if (filters.search) {
      const q = filters.search.toLowerCase().trim()
      const matches =
        item.studentName.toLowerCase().includes(q) ||
        item.studentId.includes(q) ||
        item.classCode.toLowerCase().includes(q) ||
        item.teacherCode.toLowerCase().includes(q) ||
        (item.customerCode && item.customerCode.toLowerCase().includes(q))
      if (!matches) return false
    }

    return true
  })
}

export interface ParsedScheduleSlot {
  day: string
  time: string
}

/**
 * Parses a raw schedule string like "T2 - 19:25-20:55, T5 - 19:25-20:55" into structured slots
 */
export function parseScheduleString(scheduleStr: string): ParsedScheduleSlot[] {
  if (!scheduleStr) return []
  return scheduleStr.split(',').map((slot) => {
    const parts = slot.split('-')
    if (parts.length >= 2) {
      const day = parts[0].trim()
      const time = parts.slice(1).join('-').trim()
      return { day, time }
    }
    return { day: slot.trim(), time: '' }
  })
}
