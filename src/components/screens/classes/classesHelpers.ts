import type { ClassRecord, ScheduleSlot } from '@/mocks/classRecords'
import type { StatusSemantic } from '@/lib/statusColors'
import { mockStudents } from '@/mocks/students'

export type ClassStatusFilter = 'all' | ClassRecord['status']

export interface ClassFilterState {
  branches: string[]
  levels: string[]
  teachers: string[]
  rooms: string[]
  weekdays: string[]
  times: string[]
  subjects: string[]
  programs: string[]
  statuses: string[]
  dateRanges: string[]
  studentSearch: string
}

export function countClassesByStatus(items: ClassRecord[], status: ClassStatusFilter): number {
  if (status === 'all') return items.length
  return items.filter((c) => c.status === status).length
}

export function filterClasses(
  items: ClassRecord[],
  filters: {
    search: string
    branch: string
    status: ClassStatusFilter
    extra: ClassFilterState
  }
): ClassRecord[] {
  const query = filters.search.trim().toLowerCase()
  
  // Helpers for mapping and schedule checks
  const getSubjectByLevel = (level: string): string => {
    const l = level.toLowerCase()
    if (l.includes('ielts') || l.includes('toeic') || l.includes('beginner') || l.includes('english') || l.includes('prep') || l.includes('movers') || l.includes('flyers')) {
      return 'english'
    }
    if (l.includes('japanese')) return 'japanese'
    if (l.includes('stem')) return 'stem'
    if (l.includes('math')) return 'math'
    return 'english'
  }

  const getProgramByLevel = (level: string): string => {
    const l = level.toLowerCase()
    if (l.includes('ielts')) return 'IELTS Foundation'
    if (l.includes('stem')) return 'STEM Robotics'
    if (l.includes('math')) return 'Toán tư duy'
    return 'Tiếng Anh'
  }

  const matchWeekday = (schedule: string, slots: ScheduleSlot[], targetWeekday: string): boolean => {
    const dayNum = targetWeekday.replace('Thứ ', '')
    const shortHand = dayNum === 'Chủ nhật' ? 'CN' : `T${dayNum}`
    
    if (schedule.includes(shortHand)) return true
    if (targetWeekday === 'Chủ nhật' && (schedule.toLowerCase().includes('cn') || schedule.toLowerCase().includes('chủ nhật'))) return true
    if (slots && slots.some(s => s.dayOfWeek && s.dayOfWeek.includes(dayNum))) return true
    return false
  }

  const matchShift = (schedule: string, slots: ScheduleSlot[], targetShift: string): boolean => {
    const times: string[] = []
    const matched = schedule.match(/\b\d{2}:\d{2}\b/g)
    if (matched) {
      matched.forEach(t => times.push(t))
    }
    if (slots) {
      slots.forEach(s => {
        if (s.startTime) times.push(s.startTime)
      })
    }
    if (times.length === 0) return false
    return times.some(time => {
      const hour = parseInt(time.split(':')[0], 10)
      const minute = parseInt(time.split(':')[1], 10)
      const totalMinutes = hour * 60 + minute
      if (targetShift === 'sang') return totalMinutes < 12 * 60
      if (targetShift === 'chieu') return totalMinutes >= 12 * 60 && totalMinutes <= 17 * 60 + 30
      if (targetShift === 'toi') return totalMinutes > 17 * 60 + 30
      return false
    })
  }

  const matchDateRange = (startDateStr: string, rangeValue: string): boolean => {
    const startDate = new Date(startDateStr)
    const year = startDate.getFullYear()
    const month = startDate.getMonth() + 1
    if (rangeValue === 'this_month') return year === 2026 && month === 6
    if (rangeValue === 'next_month') return year === 2026 && month === 7
    if (rangeValue === 'past') return startDate < new Date('2026-06-01')
    return false
  }

  return items.filter((c) => {
    if (filters.branch !== 'all' && c.branch !== filters.branch) return false
    if (filters.status !== 'all' && c.status !== filters.status) return false
    
    // Multi-select basic filters
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(c.branch)) return false
    if (filters.extra.levels.length > 0 && !filters.extra.levels.includes(c.level)) return false
    if (filters.extra.teachers.length > 0 && !filters.extra.teachers.includes(c.teacher)) return false
    if (filters.extra.rooms.length > 0 && !filters.extra.rooms.includes(c.room)) return false
    
    // Expanded academic filters
    if (filters.extra.subjects.length > 0 && !filters.extra.subjects.includes(getSubjectByLevel(c.level))) return false
    if (filters.extra.programs.length > 0 && !filters.extra.programs.includes(getProgramByLevel(c.level))) return false
    if (filters.extra.statuses.length > 0 && !filters.extra.statuses.includes(c.status)) return false

    // Weekdays and shifts
    if (filters.extra.weekdays.length > 0 && !filters.extra.weekdays.some(w => matchWeekday(c.schedule, c.scheduleSlots || [], w))) return false
    if (filters.extra.times.length > 0 && !filters.extra.times.some(t => matchShift(c.schedule, c.scheduleSlots || [], t))) return false
    
    // Start date ranges
    if (filters.extra.dateRanges.length > 0 && !filters.extra.dateRanges.some(r => matchDateRange(c.startDate, r))) return false
    
    // Student Search (free text check on mock students matching name, id or phone)
    if (filters.extra.studentSearch) {
      const sq = filters.extra.studentSearch.trim().toLowerCase()
      const matchingClassNames = new Set(
        mockStudents
          .filter((s) => 
            s.name.toLowerCase().includes(sq) || 
            s.id.toLowerCase().includes(sq) ||
            (s.phone && s.phone.includes(sq))
          )
          .map((s) => s.enrolledClass)
          .filter(Boolean) as string[]
      )
      if (!matchingClassNames.has(c.name)) return false
    }

    if (query) {
      const haystack = [c.name, c.code, c.teacher, c.room, c.schedule].join(' ').toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function nextClassId(items: ClassRecord[]): string {
  const max = items.reduce((acc, c) => {
    const numeric = Number.parseInt(c.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric)
  }, 0)
  return `cls-${String(max + 1).padStart(3, '0')}`
}

export function getOccupancyRatio(c: ClassRecord): number {
  if (c.maxStudents <= 0) return 0
  return Math.min(1, c.enrolledStudents / c.maxStudents)
}

export const STATUS_SEMANTIC_MAP: Record<ClassRecord['status'], StatusSemantic> = {
  nhap: 'neutral',
  mo_chieu_sinh: 'info',
  cho_khai_giang: 'purple',
  dang_hoc: 'success',
  tam_dung: 'warning',
  huy: 'completed',
}

export const CLASS_LEVEL_LABELS: Record<string, string> = {
  IELTS: 'IELTS',
  TOEIC: 'TOEIC',
  Beginner: 'Tiếng Anh cơ bản',
  English: 'Tiếng Anh tổng quát',
  Japanese: 'Tiếng Nhật',
  Movers: 'Movers (Cambridge)',
  Flyers: 'Flyers (Cambridge)',
  'KET Prep': 'KET (A2)',
  'PET Prep': 'PET (B1)',
}

export function getClassLevelLabel(level: string): string {
  return CLASS_LEVEL_LABELS[level] ?? level
}
