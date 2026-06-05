import { RenewalCareRecord, getCareStage } from '@/mocks/renewalCare'
import { RenewalFilterState } from './renewalTypes'

/**
 * Parses attendance ratio string (e.g., '6/6', '4/7') to a percentage number (0-100)
 */
export function parseAttendanceRate(ratioStr: string): number {
  if (!ratioStr || ratioStr === '0/0') return 0
  const parts = ratioStr.split('/')
  if (parts.length !== 2) return 0
  const attended = parseInt(parts[0], 10)
  const total = parseInt(parts[1], 10)
  if (isNaN(attended) || isNaN(total) || total === 0) return 0
  return Math.round((attended / total) * 100)
}

/**
 * Helper to filter renewal records based on filter state
 */
/**
 * Get teacher initials from a name like "Nguyen Van A" → "NV"
 */
export function getInitial(name: string): string {
  if (!name) return ''
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

export function filterRenewalData(
  records: RenewalCareRecord[],
  filters: RenewalFilterState
): RenewalCareRecord[] {
  return records.filter((item) => {
    // 1. Stage filter (T-1, T, T+1, T+2)
    const stage = getCareStage(item.expirationDate)
    
    // Custom mapping for T+1 & T+2 in one tab if they are grouped
    if (filters.stage === 'T+1') {
      // Group T+1 and T+2 in the Future tab
      if (stage !== 'T+1' && stage !== 'T+2') return false
    } else {
      if (stage !== filters.stage) return false
    }

    // 2. Status filter
    if (filters.renewalStatus !== 'all' && item.renewalStatus !== filters.renewalStatus) return false

    // 3. Class filter
    if (filters.classCode !== 'all' && item.classCode !== filters.classCode) return false

    // 4. Search text
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const match =
        item.studentName.toLowerCase().includes(q) ||
        item.studentId.includes(q) ||
        item.classCode.toLowerCase().includes(q) ||
        item.teacherCode.toLowerCase().includes(q) ||
        (item.customerCode && item.customerCode.includes(q))
      if (!match) return false
    }

    return true
  })
}
