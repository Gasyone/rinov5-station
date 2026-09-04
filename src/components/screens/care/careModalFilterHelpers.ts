import { type SessionHistory } from './studentCareReportHelpers'
import { type SimulatedPackage } from './studentCareDetailTypes'

export type TimeRangeKey = 
  | 'last_30_days'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'this_year'
  | 'custom'
  | 'all'

export interface TimeRangeOption {
  key: TimeRangeKey
  label: string
  shortLabel?: string
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { key: 'last_30_days', label: '30 ngày gần nhất', shortLabel: '30 ngày' },
  { key: 'this_month', label: 'Tháng này (T08/2026)', shortLabel: 'Tháng này' },
  { key: 'last_month', label: 'Tháng trước (T07/2026)', shortLabel: 'Tháng trước' },
  { key: 'this_quarter', label: 'Quý này (Q3/2026)', shortLabel: 'Quý này' },
  { key: 'this_year', label: 'Năm nay (2026)', shortLabel: 'Năm nay' },
  { key: 'custom', label: 'Tùy chọn khoảng ngày...', shortLabel: 'Tùy chọn' },
  { key: 'all', label: 'Tất cả thời gian', shortLabel: 'Tất cả' },
]

export interface MultiClassSession extends SessionHistory {
  classCode?: string
  className?: string
  packageId?: string
  isCurrentClass?: boolean
  teacherName?: string
  room?: string
}

export interface ClassPackageSummary {
  packageId: string
  classCode: string
  className: string
  isCurrentClass: boolean
  teacherName?: string
  room?: string
  sessionCount: number
}

export interface ClassGroupedSessions {
  classInfo: ClassPackageSummary
  sessions: MultiClassSession[]
}

// Reference anchor date: 2026-08-25
const REFERENCE_DATE = new Date('2026-08-25T23:59:59')

export function getTimeRangeDateBounds(
  timeRange: TimeRangeKey,
  customStart?: string,
  customEnd?: string
): { startDate: string | null; endDate: string | null } {
  const ref = REFERENCE_DATE
  const pad = (n: number) => String(n).padStart(2, '0')

  switch (timeRange) {
    case 'last_30_days': {
      const start = new Date(ref)
      start.setDate(start.getDate() - 30)
      return {
        startDate: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
        endDate: `${ref.getFullYear()}-${pad(ref.getMonth() + 1)}-${pad(ref.getDate())}`
      }
    }
    case 'this_month': {
      return {
        startDate: `2026-08-01`,
        endDate: `2026-08-31`
      }
    }
    case 'last_month': {
      return {
        startDate: `2026-07-01`,
        endDate: `2026-07-31`
      }
    }
    case 'this_quarter': {
      // Q3: July 1 - September 30
      return {
        startDate: `2026-07-01`,
        endDate: `2026-09-30`
      }
    }
    case 'this_year': {
      return {
        startDate: `2026-01-01`,
        endDate: `2026-12-31`
      }
    }
    case 'custom': {
      return {
        startDate: customStart || null,
        endDate: customEnd || null
      }
    }
    case 'all':
    default:
      return { startDate: null, endDate: null }
  }
}

export function filterSessionsByTimeRange<T extends { date: string }>(
  sessions: T[],
  timeRange: TimeRangeKey,
  customStart?: string,
  customEnd?: string
): T[] {
  if (timeRange === 'all') return sessions

  const { startDate, endDate } = getTimeRangeDateBounds(timeRange, customStart, customEnd)

  return sessions.filter((s) => {
    if (!s.date) return true
    const sessionDate = s.date.trim()
    if (startDate && sessionDate < startDate) return false
    if (endDate && sessionDate > endDate) return false
    return true
  })
}

export function buildMultiClassSessions(
  classDataForPackages: Array<{
    pkg: SimulatedPackage
    isEnglish: boolean
    regularSessions: SessionHistory[]
    testSessions: SessionHistory[]
  }>,
  activePackageId: string
): {
  allAttendanceSessions: MultiClassSession[]
  allHomeworkSessions: MultiClassSession[]
  allTestSessions: MultiClassSession[]
  allEvaluationSessions: MultiClassSession[]
  classList: ClassPackageSummary[]
} {
  const allAtt: MultiClassSession[] = []
  const allHw: MultiClassSession[] = []
  const allTests: MultiClassSession[] = []
  const allEvals: MultiClassSession[] = []
  const classList: ClassPackageSummary[] = []

  classDataForPackages.forEach(({ pkg, regularSessions, testSessions }) => {
    const isCurrent = pkg.id === activePackageId
    const teacherName = pkg.teacherCode ? (pkg.teacherCode.includes('GV_') ? pkg.teacherCode.replace('GV_', 'GV ') : pkg.teacherCode) : 'GV Nguyễn Huy Hoàng'
    const room = 'P.102'

    // Combine sessions for this package
    const combined = [...regularSessions, ...testSessions]

    classList.push({
      packageId: pkg.id,
      classCode: pkg.classCode,
      className: pkg.className,
      isCurrentClass: isCurrent,
      teacherName,
      room,
      sessionCount: combined.length
    })

    // Attendance sessions
    combined.forEach((s) => {
      allAtt.push({
        ...s,
        packageId: pkg.id,
        classCode: pkg.classCode,
        className: pkg.className,
        isCurrentClass: isCurrent,
        teacherName,
        room
      })
    })

    // Homework sessions (lessons)
    regularSessions.forEach((s) => {
      allHw.push({
        ...s,
        packageId: pkg.id,
        classCode: pkg.classCode,
        className: pkg.className,
        isCurrentClass: isCurrent,
        teacherName,
        room
      })
    })

    // Test sessions
    testSessions.forEach((s) => {
      allTests.push({
        ...s,
        packageId: pkg.id,
        classCode: pkg.classCode,
        className: pkg.className,
        isCurrentClass: isCurrent,
        teacherName,
        room
      })
    })

    // Evaluation sessions
    combined.forEach((s) => {
      allEvals.push({
        ...s,
        packageId: pkg.id,
        classCode: pkg.classCode,
        className: pkg.className,
        isCurrentClass: isCurrent,
        teacherName,
        room
      })
    })
  })

  // Sort sessions chronologically
  const sortByDateAsc = (a: MultiClassSession, b: MultiClassSession) => {
    if (a.date === b.date) return a.sessionNumber - b.sessionNumber
    return a.date.localeCompare(b.date)
  }

  return {
    allAttendanceSessions: allAtt.sort(sortByDateAsc),
    allHomeworkSessions: allHw.sort(sortByDateAsc),
    allTestSessions: allTests.sort(sortByDateAsc),
    allEvaluationSessions: allEvals.sort(sortByDateAsc),
    classList
  }
}

export function groupFilteredSessionsByClass(
  filteredSessions: MultiClassSession[],
  classList: ClassPackageSummary[],
  currentPackageId?: string
): {
  currentClass: ClassPackageSummary | null
  currentSessions: MultiClassSession[]
  historicalClasses: ClassGroupedSessions[]
} {
  // Find current class info
  const currentClass = classList.find((c) => (currentPackageId ? c.packageId === currentPackageId : c.isCurrentClass)) || classList[0] || null

  const currentPkgId = currentClass?.packageId

  const currentSessions = filteredSessions.filter((s) => (currentPkgId ? s.packageId === currentPkgId : s.isCurrentClass))

  const otherClassList = classList.filter((c) => c.packageId !== currentPkgId)

  const historicalClasses: ClassGroupedSessions[] = otherClassList.map((c) => {
    const sessions = filteredSessions.filter((s) => s.packageId === c.packageId)
    return {
      classInfo: c,
      sessions
    }
  })

  return {
    currentClass,
    currentSessions,
    historicalClasses
  }
}
