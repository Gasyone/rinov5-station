export type ClassCategory = 'active' | 'completed' | 'cancelled' | 'upcoming' | 'on_hold'
export const CLASS_CATEGORIES: ClassCategory[] = ['active', 'completed', 'cancelled', 'upcoming', 'on_hold']

export const CLASS_LEVELS = ['IELTS', 'TOEIC', 'Beginner', 'English', 'Japanese', 'Movers', 'Flyers', 'KET Prep', 'PET Prep']

export interface ClassRecord {
  id: string
  code: string
  name: string
  level: string
  branch: string
  teacher: string
  teacherPhone: string
  room: string
  schedule: string
  startDate: string
  endDate: string
  maxStudents: number
  enrolledStudents: number
  status: ClassCategory
  tuitionFee: number
  notes?: string
}

export function nextClassId(classes: ClassRecord[]): string {
  const max = classes.reduce((m, c) => {
    const n = parseInt(c.id.replace('cls-', ''), 10)
    return n > m ? n : m
  }, 0)
  return `cls-${String(max + 1).padStart(3, '0')}`
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export function getUniqueValues(items: ClassRecord[], key: keyof Pick<ClassRecord, 'branch' | 'level' | 'teacher'>): string[] {
  return [...new Set(items.map((c) => c[key]).filter(Boolean))].sort()
}
