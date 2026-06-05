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
    // 1. Primary Campus (Toolbar dropdown)
    if (filters.branch !== 'all' && student.branch !== filters.branch) return false

    // 2. Tab Status (Header tabs)
    if (filters.status !== 'all' && student.status !== filters.status) return false

    // 3. Advanced Filter: Campuses
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(student.branch))
      return false

    // 4. Advanced Filter: Levels
    if (filters.extra.levels.length > 0 && !filters.extra.levels.includes(student.level))
      return false

    // 5. Advanced Filter: Genders
    if (filters.extra.genders.length > 0 && !filters.extra.genders.includes(student.gender))
      return false

    // 6. Advanced Filter: Class Types (Offline / Online Tutor)
    if (filters.extra.classTypes.length > 0) {
      const hasClassType = student.enrolledClasses?.some((c) =>
        filters.extra.classTypes.includes(c.type)
      )
      if (!hasClassType) return false
    }

    // 7. Advanced Filter: Teachers
    if (filters.extra.teachers.length > 0) {
      const hasTeacher = student.enrolledClasses?.some((c) =>
        filters.extra.teachers.includes(c.teacherName)
      )
      if (!hasTeacher) return false
    }

    // 8. Advanced Filter: Remaining Sessions Range
    if (filters.extra.remainingSessionsRange.length > 0) {
      const rem = student.remainingSessions ?? 0
      const matchesEmpty = filters.extra.remainingSessionsRange.includes('empty') && rem === 0
      const matchesLow = filters.extra.remainingSessionsRange.includes('low') && rem > 0 && rem < 5
      const matchesNormal = filters.extra.remainingSessionsRange.includes('normal') && rem >= 5

      if (!matchesEmpty && !matchesLow && !matchesNormal) return false
    }

    // 9. Advanced Filter: Subjects
    if (filters.extra.subjects.length > 0 && (!student.subject || !filters.extra.subjects.includes(student.subject)))
      return false

    // 10. Advanced Filter: Programs
    if (filters.extra.programs.length > 0) {
      const hasProgram = student.enrolledClasses?.some((c) =>
        c.programName && filters.extra.programs.includes(c.programName)
      )
      if (!hasProgram) return false
    }

    // 11. Advanced Filter: Classes
    if (filters.extra.classes.length > 0) {
      const hasClass = student.enrolledClasses?.some((c) =>
        filters.extra.classes.includes(c.className) || filters.extra.classes.includes(c.classCode)
      )
      if (!hasClass) return false
    }

    // 12. Advanced Filter: Sales
    if (filters.extra.sales.length > 0 && (!student.saleName || !filters.extra.sales.includes(student.saleName)))
      return false

    // 13. Extra tab status check (compatibility)
    if (filters.extra.status !== 'all' && student.status !== filters.extra.status) return false

    // 10. Text Search
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
