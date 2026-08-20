import type { LeaveReserveRequest } from '@/mocks/leaveReserve'
import type { Student, EnrolledClass } from '@/mocks/students'

export const SUBJECT_OPTIONS = [
  { value: 'all', label: 'Tất cả môn' },
  { value: 'english', label: 'Tiếng Anh' },
  { value: 'math', label: 'Toán học' },
  { value: 'stem', label: 'STEM' },
  { value: 'japanese', label: 'Tiếng Nhật' },
]

export interface SessionScheduleItem {
  id: string
  classCode: string
  className: string
  sessionTitle: string
  sessionCode?: string
  dayOfWeek: string
  date: string
  time: string
  room?: string
  branch?: string
  teacherName?: string
  type?: string
}

export function formatDateISO(d: Date): string {
  return d.toISOString().split('T')[0]
}

export function addDays(d: Date, days: number): Date {
  const result = new Date(d)
  result.setDate(result.getDate() + days)
  return result
}

export function addMonths(d: Date, months: number): Date {
  const result = new Date(d)
  result.setMonth(result.getMonth() + months)
  return result
}

export function maskPhone(phone?: string): string {
  if (!phone) return '---'
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 10) {
    return digits.slice(0, 3) + '****' + digits.slice(-3)
  }
  return phone
}

export function getSubjectMaxHoldSessions(subjectOrClassName?: string): { maxSessions: number; subjectName: string } {
  const str = (subjectOrClassName || '').toLowerCase()
  if (str.includes('toán') || str.includes('math')) {
    return { maxSessions: 4, subjectName: 'Toán học' }
  }
  return { maxSessions: 8, subjectName: 'Tiếng Anh' }
}

export function isEligibleForReserve(student?: Student): { eligible: boolean; reason?: string; remaining: number } {
  if (!student) return { eligible: false, reason: 'Chưa chọn học viên', remaining: 0 }
  const remaining = student.remainingSessions ?? 20
  const isScholarship = (student.packageName || '').toLowerCase().includes('học bổng 100%')

  if (isScholarship) {
    return {
      eligible: false,
      reason: 'Học viên đang học gói học bổng 100% không áp dụng bảo lưu theo quy định.',
      remaining,
    }
  }

  if (remaining < 16) {
    return {
      eligible: false,
      reason: `Học viên chỉ còn ${remaining} buổi học (yêu cầu tối thiểu 16 buổi để được bảo lưu).`,
      remaining,
    }
  }

  return { eligible: true, remaining }
}

export function getPastAllowedDate(baseDate: Date = new Date()): string {
  // Go back 3 days (representing max 1 previous session)
  const d = new Date(baseDate)
  d.setDate(d.getDate() - 3)
  return formatDateISO(d)
}

export function generateStudentSessions(
  student: Student,
  targetDate: string,
  selectedClassCode: string
): SessionScheduleItem[] {
  const classes: EnrolledClass[] =
    student.enrolledClasses && student.enrolledClasses.length > 0
      ? student.enrolledClasses
      : [
          {
            classCode: 'CLS-GEN-01',
            className: student.enrolledClass || 'Lớp cơ bản A1',
            type: 'offline',
            scheduleSlots: [
              { dayOfWeek: 'Thứ 2', date: '01/01', startTime: '18:00', endTime: '19:30' },
              { dayOfWeek: 'Thứ 4', date: '03/01', startTime: '18:00', endTime: '19:30' },
            ],
            teacherName: 'Giáo viên phụ trách',
            status: 'active',
            progress: '10/24',
            branch: student.branch,
            room: 'Phòng 201',
          },
        ]

  const filteredClasses =
    selectedClassCode === 'all'
      ? classes
      : classes.filter((c) => c.classCode === selectedClassCode)

  const items: SessionScheduleItem[] = []
  const dateObj = new Date(targetDate || new Date())
  const dayIndex = dateObj.getDay()
  const daysMap = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  const currentDayOfWeek = daysMap[dayIndex]

  filteredClasses.forEach((cls, cIdx) => {
    const slots =
      cls.scheduleSlots && cls.scheduleSlots.length > 0
        ? cls.scheduleSlots
        : [{ dayOfWeek: currentDayOfWeek, date: targetDate, startTime: '18:00', endTime: '19:30' }]

    slots.forEach((slot, sIdx) => {
      // Determine realistic session topic
      let sessionTitle = cls.nextLessonName || ''
      const lowerName = cls.className.toLowerCase()
      if (!sessionTitle) {
        if (lowerName.includes('toán') || lowerName.includes('math')) {
          sessionTitle = `Buổi ${12 + sIdx * 2}: Ôn tập phép nhân & chia phân số (Bài ${sIdx + 1})`
        } else if (lowerName.includes('anh') || lowerName.includes('ielts') || lowerName.includes('toeic')) {
          sessionTitle = `Buổi ${8 + sIdx * 2}: Unit ${3 + sIdx} - Daily Routines & Presentation`
        } else if (lowerName.includes('stem')) {
          sessionTitle = `Buổi ${6 + sIdx * 2}: Lập trình Robot di chuyển theo quỹ đạo`
        } else {
          sessionTitle = `Buổi ${10 + sIdx * 2}: Chuyên đề nâng cao & Luyện đề thực hành`
        }
      }

      items.push({
        id: `${cls.classCode}-slot-${sIdx}-${cIdx}`,
        classCode: cls.classCode,
        className: cls.className,
        sessionTitle,
        sessionCode: `SES-${String(10 + sIdx * 2).padStart(3, '0')}`,
        dayOfWeek: slot.dayOfWeek || currentDayOfWeek,
        date: targetDate,
        time: `${slot.startTime} - ${slot.endTime}`,
        room: cls.room || 'Phòng A101',
        branch: cls.branch || student.branch,
        teacherName: cls.teacherName || 'GV Phụ trách',
        type: cls.type,
      })
    })
  })

  return items
}

export function getRequestSubject(r: LeaveReserveRequest): string {
  const name = (r.className || '').toLowerCase()
  const pkg = (r.productPackage || '').toLowerCase()
  const code = (r.classCode || '').toLowerCase()
  if (
    name.includes('ielts') ||
    name.includes('toeic') ||
    name.includes('tiếng anh') ||
    name.includes('eng') ||
    pkg.includes('giao tiếp')
  ) {
    return 'english'
  }
  if (name.includes('stem') || pkg.includes('stem') || code.includes('stem')) {
    return 'stem'
  }
  if (name.includes('toán') || name.includes('math') || pkg.includes('toán')) {
    return 'math'
  }
  if (name.includes('nhật') || name.includes('jpn') || pkg.includes('nhật')) {
    return 'japanese'
  }
  return 'other'
}
