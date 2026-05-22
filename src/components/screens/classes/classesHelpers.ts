import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_CATEGORIES, CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import type { StatusSemantic } from '@/lib/statusColors'

export type ClassStatusFilter = 'all' | ClassRecord['status']

export interface ClassFilterState {
  branches: string[]
  levels: string[]
  teachers: string[]
  rooms: string[]
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
  return items.filter((c) => {
    if (filters.branch !== 'all' && c.branch !== filters.branch) return false
    if (filters.status !== 'all' && c.status !== filters.status) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(c.branch)) return false
    if (filters.extra.levels.length > 0 && !filters.extra.levels.includes(c.level)) return false
    if (filters.extra.teachers.length > 0 && !filters.extra.teachers.includes(c.teacher)) return false
    if (filters.extra.rooms.length > 0 && !filters.extra.rooms.includes(c.room)) return false
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
  dang_hoc: 'success',
  dong_lop: 'info',
  huy: 'error',
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
