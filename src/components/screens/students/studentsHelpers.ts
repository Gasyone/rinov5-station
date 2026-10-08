import { mockStudents, type EnrolledClass, type Student } from '@/mocks/students'
import type { StudentFilterState, StudentStatusFilter } from './studentsTypes'
import type { StudentLifecycleStatusId, StudentQuickFilterId } from './studentTypes'

export function getStudentLifecycleStatus(student: Student): StudentLifecycleStatusId {
  if (student.status === 'reserve') return 'reserve'
  if (student.status === 'session_ended') return 'session_ended'
  if (
    student.status === 'wait_for_assignment' ||
    student.status === 'enroll_later' ||
    student.status === 'pending_payment' ||
    student.status === 'awaiting_opening'
  ) {
    return 'wait_for_assignment'
  }
  if (student.status === 'trial') {
    const hasClass = Boolean(
      student.enrolledClass ||
      (student.enrolledClasses && student.enrolledClasses.length > 0)
    )
    return hasClass ? 'active' : 'wait_for_assignment'
  }
  return 'active'
}

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
  studentStatuses: (value: string) => number
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

export function getStudentAge(studentOrDob?: Student | string | null): number {
  if (!studentOrDob) return 0
  const dob = typeof studentOrDob === 'object' ? studentOrDob.dob : studentOrDob
  if (!dob) return 0

  const birthDate = new Date(dob)
  if (isNaN(birthDate.getTime())) return 0
  const today = new Date()
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
    studentStatuses: (status) => countStudents(students, (student) => student.status === status),
  }
}

export function filterStudents(
  students: Student[],
  filters: {
    search: string
    branch: string
    subject?: string
    status: StudentLifecycleStatusId | StudentStatusFilter
    quickFilter?: StudentQuickFilterId
    extra: StudentFilterState
  }
): Student[] {
  const query = filters.search.trim().toLowerCase()

  return students.filter((student) => {
    // 0. Primary Subject (Toolbar dropdown)
    if (filters.subject && filters.subject !== 'all' && student.subject !== filters.subject) return false

    // 1. Primary Campus (Toolbar dropdown)
    if (filters.branch !== 'all' && student.branch !== filters.branch) return false

    // 2. Tab Status (Header tabs - Lifecycle Status)
    if (filters.status !== 'all') {
      const lifecycle = getStudentLifecycleStatus(student)
      if (lifecycle !== filters.status && student.status !== filters.status) return false
    }

    // 2.1. Quick Filter (Actionable Chips - không số đếm)
    if (filters.quickFilter && filters.quickFilter !== 'all') {
      const qf = filters.quickFilter
      if (qf === 'awaiting_opening') {
        if (student.status !== 'awaiting_opening') return false
      } else if (qf === 'pending_transfer') {
        const matches =
          student.status === 'pending_transfer' ||
          (student.enrolledClasses?.some((c) => c.status === 'pending_transfer') ?? false)
        if (!matches) return false
      } else if (qf === 'enroll_later') {
        if (student.status !== 'enroll_later') return false
      } else if (qf === 'draft_class') {
        if (student.status !== 'draft_class') return false
      } else if (qf === 'pending_payment') {
        if (student.status !== 'pending_payment') return false
      } else if (qf === 'trial') {
        if (student.status !== 'trial') return false
      } else if (qf === 'fee_transfer') {
        if (student.status !== 'fee_transfer') return false
      }
    }

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

    // Advanced Filter: Student Statuses (Học thử, Chờ khai giảng, v.v.)
    if (filters.extra.studentStatuses && filters.extra.studentStatuses.length > 0) {
      if (!filters.extra.studentStatuses.includes(student.status)) {
        return false
      }
    }

    // 13. Extra tab status check (compatibility)
    if (filters.extra.status !== 'all' && student.status !== filters.extra.status) return false

    // 10. Text Search
    if (query) {
      const haystack = [
        student.name,
        student.englishName ?? '',
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

export interface BirthdayInfo {
  isToday: boolean
  isThisMonth: boolean
  hasBirthday: boolean
  birthYear: number | string
  fullDob: string
  formattedDay: string
  label: string
  tooltip: string
}

export function getBirthdayInfo(dobString?: string): BirthdayInfo | null {
  if (!dobString) return null
  const parts = dobString.split('-')
  if (parts.length < 3) return null
  const birthYear = parseInt(parts[0], 10)
  const birthMonth = parseInt(parts[1], 10) - 1 // 0-indexed
  const birthDay = parseInt(parts[2], 10)

  if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) return null

  const today = new Date()
  const isToday = birthMonth === today.getMonth() && birthDay === today.getDate()
  const isThisMonth = birthMonth === today.getMonth()

  const dayStr = String(birthDay).padStart(2, '0')
  const monthStr = String(birthMonth + 1).padStart(2, '0')
  const fullDob = `${dayStr}/${monthStr}/${birthYear}`
  const formattedDay = `${dayStr}/${monthStr}`

  return {
    isToday,
    isThisMonth,
    hasBirthday: isToday || isThisMonth,
    birthYear,
    fullDob,
    formattedDay,
    label: isToday ? 'Sinh nhật hôm nay!' : `Sinh nhật ${formattedDay}`,
    tooltip: isToday
      ? `🎂 Hôm nay là sinh nhật em! (${fullDob})`
      : `🎂 Sinh nhật tháng này: ${fullDob}`,
  }
}

export function formatNextSessionShort(cls: EnrolledClass): string {
  const cleanDate = (dateStr: string): string => {
    if (!dateStr) return ''
    const ymdMatch = dateStr.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
    if (ymdMatch) {
      const month = parseInt(ymdMatch[2], 10)
      const day = parseInt(ymdMatch[3], 10)
      return `${day}/${month}`
    }
    const dmyMatch = dateStr.match(/(\d{1,2})[-/](\d{1,2})(?:[-/]\d{2,4})?/)
    if (dmyMatch) {
      const day = parseInt(dmyMatch[1], 10)
      const month = parseInt(dmyMatch[2], 10)
      return `${day}/${month}`
    }
    return dateStr.replace(/[-/]\d{4}/g, '').trim()
  }

  const cleanDow = (dowStr: string): string => {
    const dow = (dowStr || '').trim()
    return dow
      .replace(/^Thứ\s*(\d)/i, 'T$1')
      .replace(/^Thứ\s*Hai/i, 'T2')
      .replace(/^Thứ\s*Ba/i, 'T3')
      .replace(/^Thứ\s*Tư/i, 'T4')
      .replace(/^Thứ\s*Năm/i, 'T5')
      .replace(/^Thứ\s*Sáu/i, 'T6')
      .replace(/^Thứ\s*Bảy/i, 'T7')
      .replace(/^Chủ\s*Nhật/i, 'CN')
      .replace(/^Thứ\s*/i, 'T')
      .trim()
  }

  if (cls.scheduleSlots && cls.scheduleSlots.length > 0) {
    const slot = cls.scheduleSlots[0]
    const dow = cleanDow(slot.dayOfWeek || '')
    const date = cleanDate((slot.date || '').trim())
    if (dow && date) return `${dow} - ${date}`
    if (dow) return dow
    if (date) return date
  }

  if (cls.nextLessonDate && cls.nextLessonDate !== '-') {
    const raw = cls.nextLessonDate.replace(/\(.*\)/g, '').trim()
    const parts = raw.split(/[,–-]/)
    if (parts.length >= 2) {
      const dow = cleanDow(parts[0])
      const date = cleanDate(parts[1])
      if (dow && date) return `${dow} - ${date}`
    }
    const dowMatch = raw.match(/(Thứ\s*\d|Thứ\s*Hai|Thứ\s*Ba|Thứ\s*Tư|Thứ\s*Năm|Thứ\s*Sáu|Thứ\s*Bảy|Chủ\s*Nhật|T[2-7]|CN)/i)
    const dow = dowMatch ? cleanDow(dowMatch[1]) : ''
    const date = cleanDate(raw)
    if (dow && date) return `${dow} - ${date}`
    if (dow) return dow
    if (date) return date
  }

  return 'T4 - 4/6'
}

export function getPlacementAttempt(student: Student, cls: EnrolledClass): number {
  if (cls.placementAttempt && cls.placementAttempt > 0) return cls.placementAttempt
  if (student.placementAttempt && student.placementAttempt > 0) return student.placementAttempt
  if (student.notes?.includes('lần 2') || student.notes?.includes('ghép lại')) return 2
  if (student.notes?.includes('lần 3')) return 3
  if (cls.status === 'pending_transfer') return 2
  if (student.id === 's-baonam') return 2
  if (student.id === 's3' || student.id === 's-thanhhang') return 2
  if (student.id === 's14') return 3
  if (student.id === 's21') return 2
  return 1
}

export function getLessonName(student: Student, cls: EnrolledClass): string {
  if (cls.nextLessonName && cls.nextLessonName !== '-') return cls.nextLessonName
  const isMath = Boolean(
    student.subject === 'math' ||
    cls.programName?.toLowerCase().includes('toán') ||
    cls.className?.toLowerCase().includes('toán') ||
    cls.level?.toLowerCase().includes('toán')
  )
  if (isMath) {
    return 'Bài 01: Khảo sát & Khởi động chuyên đề'
  }
  return 'Lesson 01: Review & Speaking Exercises'
}


