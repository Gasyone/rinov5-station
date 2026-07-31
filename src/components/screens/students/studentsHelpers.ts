import { mockStudents, type EnrolledClass, type Student } from '@/mocks/students'
import type { StudentFilterState, StudentStatusFilter } from './studentsTypes'

export function getStudentBranches(students: Student[]) {
  return Array.from(new Set(students.map((s) => s.branch))).sort()
}

export function getStudentLevels(students: Student[]) {
  return Array.from(new Set(students.map((s) => s.level))).sort()
}

export interface StudentFilterOptionCounters {
  branches: (value: string) => number
  levels: (value: string) => number
  genders: (value: string) => number
  classTypes: (value: string) => number
  teachers: (value: string) => number
  remainingSessionsRange: (value: string) => number
  subjects: (value: string) => number
  programs: (value: string) => number
  classes: (value: string) => number
  sales: (value: string) => number
  packages: (value: string) => number
  dateRanges: (value: string) => number
  ageRanges: (value: string) => number
}

function countStudents(students: Student[], predicate: (student: Student) => boolean) {
  return students.filter(predicate).length
}

function hasEnrolledClass(
  student: Student,
  predicate: (enrolledClass: EnrolledClass) => boolean
) {
  return student.enrolledClasses?.some(predicate) ?? false
}

function matchesRemainingSessionsRange(student: Student, range: string) {
  const remainingSessions = student.remainingSessions ?? 0
  if (range === 'empty') return remainingSessions === 0
  if (range === 'low') return remainingSessions > 0 && remainingSessions < 5
  if (range === 'normal') return remainingSessions >= 5
  return false
}

function matchesEnrollmentDateRange(student: Student, range: string) {
  const enrollDate = new Date(student.enrollmentDate)
  const year = enrollDate.getFullYear()
  const month = enrollDate.getMonth() + 1

  if (range === 'this_month') return year === 2026 && month === 6
  if (range === 'last_month') return year === 2026 && month === 5
  if (range === 'past') return enrollDate < new Date('2026-05-01')
  return false
}

function getStudentAge(student: Student) {
  if (!student.dob) return 0

  const birthDate = new Date(student.dob)
  const today = new Date('2026-06-16')
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDelta = today.getMonth() - birthDate.getMonth()

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return Math.max(0, age)
}

function matchesAgeRange(student: Student, range: string) {
  const age = getStudentAge(student)
  if (range === 'pre_starters') return age <= 6
  if (range === 'starters') return age > 6 && age <= 8
  if (range === 'mover') return age > 8 && age <= 10
  if (range === 'flyers') return age > 10
  return false
}

export function createStudentFilterOptionCounters(
  students: Student[]
): StudentFilterOptionCounters {
  return {
    branches: (branch) => countStudents(students, (student) => student.branch === branch),
    levels: (level) => countStudents(students, (student) => student.level === level),
    genders: (gender) => countStudents(students, (student) => student.gender === gender),
    classTypes: (classType) =>
      countStudents(students, (student) =>
        hasEnrolledClass(student, (enrolledClass) => enrolledClass.type === classType)
      ),
    teachers: (teacher) =>
      countStudents(students, (student) =>
        hasEnrolledClass(student, (enrolledClass) => enrolledClass.teacherName === teacher)
      ),
    remainingSessionsRange: (range) =>
      countStudents(students, (student) => matchesRemainingSessionsRange(student, range)),
    subjects: (subject) => countStudents(students, (student) => student.subject === subject),
    programs: (program) =>
      countStudents(students, (student) =>
        hasEnrolledClass(
          student,
          (enrolledClass) => enrolledClass.programName === program
        )
      ),
    classes: (classNameOrCode) =>
      countStudents(students, (student) =>
        hasEnrolledClass(
          student,
          (enrolledClass) =>
            enrolledClass.className === classNameOrCode ||
            enrolledClass.classCode === classNameOrCode
        )
      ),
    sales: (sale) => countStudents(students, (student) => student.saleName === sale),
    packages: (packageName) =>
      countStudents(students, (student) => student.packageName === packageName),
    dateRanges: (range) =>
      countStudents(students, (student) => matchesEnrollmentDateRange(student, range)),
    ageRanges: (range) => countStudents(students, (student) => matchesAgeRange(student, range)),
  }
}

export function filterStudents(
  students: Student[],
  filters: {
    search: string
    branch: string
    subject?: string
    status: StudentStatusFilter
    extra: StudentFilterState
  }
): Student[] {
  const query = filters.search.trim().toLowerCase()

  return students.filter((student) => {
    // 0. Primary Subject (Toolbar dropdown)
    if (filters.subject && filters.subject !== 'all' && student.subject !== filters.subject) return false

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
      const matches = filters.extra.remainingSessionsRange.some((range) =>
        matchesRemainingSessionsRange(student, range)
      )
      if (!matches) return false
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

    // Advanced Filter: Packages
    if (filters.extra.packages && filters.extra.packages.length > 0 && (!student.packageName || !filters.extra.packages.includes(student.packageName)))
      return false

    // Advanced Filter: Date Ranges (Enrollment Date)
    if (filters.extra.dateRanges && filters.extra.dateRanges.length > 0) {
      const matches = filters.extra.dateRanges.some((range) => {
        return matchesEnrollmentDateRange(student, range)
      })
      if (!matches) return false
    }

    if (filters.extra.startDate && student.enrollmentDate < filters.extra.startDate) {
      return false
    }

    if (filters.extra.endDate && student.enrollmentDate > filters.extra.endDate) {
      return false
    }

    // Advanced Filter: Age Ranges
    if (filters.extra.ageRanges && filters.extra.ageRanges.length > 0) {
      const matches = filters.extra.ageRanges.some((range) => {
        return matchesAgeRange(student, range)
      })
      if (!matches) return false
    }

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
