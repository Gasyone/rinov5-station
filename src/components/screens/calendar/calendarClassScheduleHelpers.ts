import type { ClassSession } from '@/mocks/calendarSchedule'
import type { FilterState, ViewMode } from './calendarClassScheduleTypes'

export const VIEW_MODES: { value: ViewMode; label: string }[] = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

export const PERIOD_OPTIONS = [
  { value: 'morning', label: 'Sáng' },
  { value: 'afternoon', label: 'Chiều' },
  { value: 'evening', label: 'Tối' },
]

export const getSessionPeriod = (timeLabel: string): 'morning' | 'afternoon' | 'evening' => {
  if (!timeLabel) return 'morning'
  const hour = parseInt(timeLabel.split(':')[0], 10)
  if (isNaN(hour)) return 'morning'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

/**
 * Chỉ hiển thị giờ bắt đầu phía trước cho mọi khung giờ.
 * Ví dụ: '08:00 - 09:30' -> '08:00', '18:00 - 21:00' -> '18:00'
 */
export function formatShiftLabel(shift: string): string {
  const parts = shift.split(' - ')
  if (parts.length === 2) {
    return parts[0]
  }
  return shift
}

export const formatLabel = (date: Date, opts: Intl.DateTimeFormatOptions) => date.toLocaleDateString('vi-VN', opts)

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const getMonday = (input: Date) => {
  const date = new Date(input)
  const day = date.getDay()
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  date.setHours(0, 0, 0, 0)
  return date
}

export const getWeekDays = (from: Date) =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from)
    date.setDate(date.getDate() + index)
    date.setHours(0, 0, 0, 0)
    return date
  })

export function countActiveFilters(filters: FilterState): number {
  const branchRoomCount = Object.values(filters.branchRoomFilters || {}).reduce(
    (acc, curr) => acc + curr.length,
    0
  )

  const subjectLevelCount = filters.subjectLevelFilters
    ? Object.values(filters.subjectLevelFilters).reduce((acc, lvls) => acc + (lvls.length > 0 ? lvls.length : 1), 0)
    : (filters.levelFilters?.length || 0) + (filters.subjectFilters?.length || 0)

  return (
    branchRoomCount +
    subjectLevelCount +
    (filters.sessionTypeFilters?.length || 0) +
    (filters.statusFilters?.length || 0) +
    (filters.conditionFilters?.length || 0) +
    (filters.teacherFilters?.length || 0) +
    (filters.periodFilters?.length || 0) +
    (filters.roomFilters?.length || 0) +
    (filters.trialFilters?.length || 0) +
    (filters.attendanceFilters?.length || 0) +
    (filters.capacityFilters?.length || 0)
  )
}

export function filterSessions(
  allSessions: ClassSession[],
  search: string,
  activeBranch: string,
  filters: FilterState
): ClassSession[] {
  const {
    branchFilters,
    levelFilters,
    sessionTypeFilters,
    statusFilters,
    subjectFilters,
    teacherFilters,
    periodFilters,
    conditionFilters,
    roomFilters,
    trialFilters,
    attendanceFilters,
    capacityFilters,
    branchRoomFilters,
    subjectLevelFilters,
  } = filters

  return allSessions.filter((session) => {
    if (activeBranch && activeBranch !== 'all' && session.branch !== activeBranch) return false

    // Hierarchical branch & room filtering
    if (branchRoomFilters) {
      const activeBranches = Object.keys(branchRoomFilters).filter(
        (b) => (branchRoomFilters[b] || []).length > 0
      )
      if (activeBranches.length > 0) {
        if (!activeBranches.includes(session.branch)) return false
        const allowedRooms = branchRoomFilters[session.branch] || []
        if (allowedRooms.length > 0 && !allowedRooms.includes(session.schoolRoom)) return false
      }
    } else {
      if (branchFilters.length > 0 && !branchFilters.includes(session.branch)) return false
      if (roomFilters.length > 0 && !roomFilters.includes(session.schoolRoom)) return false
    }

    // Hierarchical subject & level filtering
    if (subjectLevelFilters && Object.keys(subjectLevelFilters).length > 0) {
      const activeSubjects = Object.keys(subjectLevelFilters).filter(
        (s) => (subjectLevelFilters[s] || []).length > 0
      )
      if (activeSubjects.length > 0) {
        if (!activeSubjects.includes(session.subject)) return false
        const allowedLevels = subjectLevelFilters[session.subject] || []
        if (allowedLevels.length > 0 && session.level && !allowedLevels.includes(session.level)) return false
      }
    } else {
      if (levelFilters.length > 0 && !levelFilters.includes(session.level)) return false
      if (subjectFilters.length > 0 && !subjectFilters.includes(session.subject)) return false
    }

    if (sessionTypeFilters && sessionTypeFilters.length > 0 && !sessionTypeFilters.includes(session.type)) return false
    if (statusFilters && statusFilters.length > 0 && !statusFilters.includes(session.status ?? 'confirmed')) return false
    if (
      teacherFilters.length > 0 &&
      !teacherFilters.some((t) => session.teacher === t || session.substituteTeacher === t)
    ) {
      return false
    }
    if (periodFilters.length > 0 && !periodFilters.includes(getSessionPeriod(session.timeLabel))) return false

    if (conditionFilters.length > 0) {
      const matches = conditionFilters.some((cond) => {
        if (cond === 'substitute') return Boolean(session.substituteTeacher)
        if (cond === 'opening') return Boolean(session.isOpeningDay)
        if (cond === 'has_assistant') return Boolean(session.assistantTeacher)
        if (cond === 'cancelled') return session.status === 'cancelled'
        return false
      })
      if (!matches) return false
    }

    if (trialFilters.length > 0) {
      const matches = trialFilters.some((trial) => {
        if (trial === 'has_trial') return session.trialStudents > 0
        if (trial === 'has_makeup') return Boolean(session.makeUpStudents && session.makeUpStudents > 0)
        if (trial === 'has_new') return session.trialStudents > 0 || Boolean(session.makeUpStudents && session.makeUpStudents > 0)
        if (trial === 'no_trial') return session.trialStudents === 0
        return false
      })
      if (!matches) return false
    }

    if (attendanceFilters.length > 0) {
      const matches = attendanceFilters.some((att) => {
        if (att === 'attended') return session.attendedStudents !== undefined
        if (att === 'unattended') return session.attendedStudents === undefined
        if (att === 'has_absent') return session.attendedStudents !== undefined && session.attendedStudents < session.totalStudents
        return false
      })
      if (!matches) return false
    }

    if (capacityFilters.length > 0) {
      const matches = capacityFilters.some((cap) => {
        if (cap === 'under_15') return session.totalStudents < 15
        if (cap === 'over_15') return session.totalStudents >= 15
        return false
      })
      if (!matches) return false
    }

    if (!search) return true

    const query = search.toLowerCase()
    return (
      session.className.toLowerCase().includes(query) ||
      session.teacher.toLowerCase().includes(query) ||
      Boolean(session.substituteTeacher && session.substituteTeacher.toLowerCase().includes(query)) ||
      session.title.toLowerCase().includes(query) ||
      session.classCode.toLowerCase().includes(query)
    )
  })
}
