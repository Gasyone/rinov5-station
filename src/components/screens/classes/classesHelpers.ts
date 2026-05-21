import { mockClasses, type Class } from '@/mocks/classes'
import type { ClassFilterState, ClassStatusFilter } from './classesTypes'

export function getInitialClasses(): Class[] {
  return [...mockClasses]
}

export function getClassBranches(items: Class[]) {
  return Array.from(new Set(items.map((c) => c.branch))).sort()
}

export function getClassLevels(items: Class[]) {
  return Array.from(new Set(items.map((c) => c.level))).sort()
}

export function getClassTeachers(items: Class[]) {
  return Array.from(new Set(items.map((c) => c.teacher))).sort()
}

export function countClassesByStatus(items: Class[], status: ClassStatusFilter): number {
  if (status === 'all') return items.length
  return items.filter((c) => c.status === status).length
}

export function filterClasses(
  items: Class[],
  filters: {
    search: string
    branch: string
    status: ClassStatusFilter
    extra: ClassFilterState
  }
): Class[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((c) => {
    if (filters.branch !== 'all' && c.branch !== filters.branch) return false
    if (filters.status !== 'all' && c.status !== filters.status) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(c.branch))
      return false
    if (filters.extra.levels.length > 0 && !filters.extra.levels.includes(c.level)) return false
    if (filters.extra.teachers.length > 0 && !filters.extra.teachers.includes(c.teacher))
      return false
    if (query) {
      const haystack = [c.name, c.teacher, c.room, c.schedule, c.id].join(' ').toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function nextClassId(items: Class[]): string {
  const max = items.reduce((acc, c) => {
    const numeric = Number.parseInt(c.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric)
  }, 0)
  return `c${max + 1}`
}

export function buildEmptyClass(): Omit<Class, 'id'> {
  return {
    name: '',
    level: '',
    branch: '',
    teacher: '',
    maxStudents: 20,
    enrolledStudents: 0,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    schedule: '',
    room: '',
    status: 'upcoming',
    tuitionFee: 0,
  }
}

export function getOccupancyRatio(c: Class): number {
  if (c.maxStudents <= 0) return 0
  return Math.min(1, c.enrolledStudents / c.maxStudents)
}
