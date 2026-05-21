import { mockStudents, type Student } from '@/mocks/students'
import type { StudentFilterState, StudentStatusFilter } from './studentsTypes'

export function getStudentBranches(students: Student[]) {
  return Array.from(new Set(students.map((s) => s.branch))).sort()
}

export function getStudentLevels(students: Student[]) {
  return Array.from(new Set(students.map((s) => s.level))).sort()
}

export function filterStudents(
  students: Student[],
  filters: {
    search: string
    branch: string
    status: StudentStatusFilter
    extra: StudentFilterState
  }
): Student[] {
  const query = filters.search.trim().toLowerCase()

  return students.filter((student) => {
    if (filters.branch !== 'all' && student.branch !== filters.branch) return false
    if (filters.status !== 'all' && student.status !== filters.status) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(student.branch))
      return false
    if (filters.extra.levels.length > 0 && !filters.extra.levels.includes(student.level))
      return false
    if (filters.extra.status !== 'all' && student.status !== filters.extra.status) return false
    if (query) {
      const haystack = [
        student.name,
        student.email,
        student.phone ?? '',
        student.parentName ?? '',
        student.parentPhone ?? '',
        student.enrolledClass ?? '',
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function countStudentsByStatus(
  students: Student[],
  status: StudentStatusFilter
): number {
  if (status === 'all') return students.length
  return students.filter((s) => s.status === status).length
}

export function nextStudentId(students: Student[]): string {
  const max = students.reduce((acc, s) => {
    const numeric = Number.parseInt(s.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric)
  }, 0)
  return `s${max + 1}`
}

export function buildEmptyStudent(): Omit<Student, 'id'> {
  return {
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    status: 'pending',
    enrolledClass: '',
    branch: '',
    level: '',
    parentName: '',
    parentPhone: '',
    enrollmentDate: new Date().toISOString().slice(0, 10),
  }
}

export function getInitialStudents(): Student[] {
  return [...mockStudents]
}
