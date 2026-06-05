import type { Student } from '@/mocks/students'
import { mockBookingTests, type BookingTest } from '@/mocks/bookingTests'
import { MOCK_TRIAL_CLASSES, type TrialClass } from '@/mocks/trialClasses'

export interface StudentPackageV2 {
  id: string
  packageName: string
  totalSessions: number
  remainingSessions: number
  price: number
  purchaseDate: string
  status: 'active' | 'expired' | 'pending'
  linkedClassCode?: string
  linkedClassName?: string
}

export interface StudentGlobalLogV2 {
  id: string
  timestamp: string
  action: string
  operator: string
}

export interface FamilyMemberV2 {
  id: string
  name: string
  phone: string
  email?: string
  relationship: string
}

/**
 * Returns package registrations for a student
 */
export function getStudentPackagesV2(student: Student): StudentPackageV2[] {
  const list: StudentPackageV2[] = []

  if (student.packageName) {
    list.push({
      id: `PKG-${student.id}-1`,
      packageName: student.packageName,
      totalSessions: student.totalSessions ?? 24,
      remainingSessions: student.remainingSessions ?? 24,
      price: (student.totalSessions ?? 24) * 150000,
      purchaseDate: student.enrollmentDate,
      status: student.remainingSessions && student.remainingSessions > 0 ? 'active' : 'expired',
      linkedClassCode: student.enrolledClasses?.[0]?.classCode,
      linkedClassName: student.enrolledClasses?.[0]?.className,
    })
  }

  if (student.enrolledClasses && student.enrolledClasses.length > 1) {
    student.enrolledClasses.slice(1).forEach((cls, idx) => {
      list.push({
        id: `PKG-${student.id}-${idx + 2}`,
        packageName: cls.programName || `Gói Bổ Trợ Kỹ Năng ${cls.className}`,
        totalSessions: 12,
        remainingSessions: 8,
        price: 1200000,
        purchaseDate: new Date(new Date(student.enrollmentDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        linkedClassCode: cls.classCode,
        linkedClassName: cls.className,
      })
    })
  }

  list.push({
    id: `PKG-${student.id}-unlinked`,
    packageName: 'Gói Tiếng Anh Giao Tiếp Bổ Trợ',
    totalSessions: 16,
    remainingSessions: 16,
    price: 2400000,
    purchaseDate: student.enrollmentDate,
    status: 'active',
  })

  return list
}

/**
 * Generates global audit logs for the student
 */
export function getStudentGlobalLogsV2(student: Student): StudentGlobalLogV2[] {
  const logs: StudentGlobalLogV2[] = []

  const dateOffset = (days: number) => {
    const d = new Date(student.enrollmentDate)
    d.setDate(d.getDate() + days)
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
  }

  logs.push({
    id: `log-${student.id}-1`,
    timestamp: dateOffset(0),
    action: `Đăng ký hồ sơ học viên mới thành công tại ${student.branch}.`,
    operator: student.saleName || 'Sales Admin',
  })

  logs.push({
    id: `log-${student.id}-2`,
    timestamp: dateOffset(1),
    action: `Xác nhận thanh toán hợp đồng gói học "${student.packageName || 'Gói học bổ trợ'}" thành công.`,
    operator: 'Kế toán Thu Phương',
  })

  if (student.enrolledClasses && student.enrolledClasses.length > 0) {
    student.enrolledClasses.forEach((cls, idx) => {
      logs.push({
        id: `log-${student.id}-class-${idx}`,
        timestamp: dateOffset(3 + idx * 2),
        action: `Gắn lớp học thành công: Học viên được phân bổ vào lớp "${cls.className}" (${cls.classCode}).`,
        operator: 'Giáo vụ Lan',
      })
    })
  } else {
    logs.push({
      id: `log-${student.id}-wait`,
      timestamp: dateOffset(2),
      action: `Chuyển trạng thái học viên sang: Chờ xếp lớp. Đưa thông tin vào danh sách chờ ghép lớp.`,
      operator: 'Hệ thống',
    })
  }

  return logs.reverse()
}

/**
 * Generates family members for a student
 */
export function getStudentFamilyMembersV2(student: Student): FamilyMemberV2[] {
  const members: FamilyMemberV2[] = []
  
  if (student.parentName && student.parentPhone) {
    const isFather = student.parentName.includes('Văn') || 
                     student.parentName.includes('Nam') || 
                     student.parentName.includes('H') || 
                     student.parentName.includes('C') || 
                     student.parentName.includes('L') ||
                     student.parentName.endsWith('A')
                     
    members.push({
      id: `FAM-${student.id.toUpperCase()}-01`,
      name: student.parentName,
      phone: student.parentPhone,
      email: isFather ? `bo.${student.id}@rinoedu.vn` : `me.${student.id}@rinoedu.vn`,
      relationship: isFather ? 'Bố' : 'Mẹ'
    })
    
    const isSecondFather = !isFather
    let secondName = ''
    if (isSecondFather) {
      secondName = student.parentName
        .replace(/Thị|Lan|Mai|Hoa|B/g, 'Văn')
        .replace('K', 'Hùng')
        .replace('G', 'Dũng')
        .replace('H', 'Khánh')
      if (secondName === student.parentName) {
        secondName = 'Nguyễn Văn Nam'
      }
    } else {
      secondName = student.parentName
        .replace(/Văn|Nam|H|C|L/g, 'Thị')
        .replace('A', 'Lan')
        .replace('D', 'Phương')
      if (secondName === student.parentName) {
        secondName = 'Trần Thị Lan'
      }
    }

    const lastDigit = Number(student.parentPhone.slice(-1))
    const secondPhone = student.parentPhone.slice(0, -1) + (lastDigit === 9 ? '8' : String(lastDigit + 1))

    members.push({
      id: `FAM-${student.id.toUpperCase()}-02`,
      name: secondName,
      phone: secondPhone,
      email: isSecondFather ? `bo.phu.${student.id}@rinoedu.vn` : `me.phu.${student.id}@rinoedu.vn`,
      relationship: isSecondFather ? 'Bố' : 'Mẹ'
    })
  } else {
    members.push({
      id: `FAM-${student.id.toUpperCase()}-01`,
      name: 'Vũ Nam',
      phone: '0901234294',
      email: `bo.${student.id}@rinoedu.vn`,
      relationship: 'Bố'
    })
    members.push({
      id: `FAM-${student.id.toUpperCase()}-02`,
      name: 'Nguyễn Lan',
      phone: '0901234295',
      email: `me.${student.id}@rinoedu.vn`,
      relationship: 'Mẹ'
    })
  }

  return members
}

/**
 * Searches for placement test results from mock booking tests based on student name or phone
 */
export function getPlacementTestResultV2(student: Student): BookingTest | null {
  // Try to find a completed placement test with matching childName or phone
  const match = mockBookingTests.find(
    (t) =>
      t.status === 'completed' &&
      (t.childName.toLowerCase().replace(/\s/g, '') === student.name.toLowerCase().replace(/\s/g, '') ||
        t.phone === student.parentPhone ||
        t.phone === student.phone)
  )
  return match || null
}

/**
 * Searches for trial class feedback from mock trial classes based on student name
 */
export function getTrialClassFeedbackV2(student: Student): TrialClass | null {
  const match = MOCK_TRIAL_CLASSES.find(
    (t) =>
      t.status === 'completed' &&
      t.studentName.toLowerCase().replace(/\s/g, '') === student.name.toLowerCase().replace(/\s/g, '')
  )
  return match || null
}

/**
 * Dynamically scans student records, placement tests, and trial classes to get all relevant subjects
 */
export function getStudentSubjectsV2(
  student: Student,
  placementTest: BookingTest | null,
  trialClass: TrialClass | null
): string[] {
  const list = new Set<string>()
  
  if (student.subject) {
    list.add(student.subject)
  }
  
  if (student.enrolledClasses) {
    student.enrolledClasses.forEach((cls) => {
      const name = (cls.className || '').toLowerCase()
      const program = (cls.programName || '').toLowerCase()
      if (
        name.includes('ielts') ||
        name.includes('starter') ||
        name.includes('english') ||
        name.includes('phonic') ||
        name.includes('comm') ||
        name.includes('flyer') ||
        program.includes('english') ||
        program.includes('ielts') ||
        program.includes('starter') ||
        program.includes('mover') ||
        program.includes('phonics')
      ) {
        list.add('english')
      }
      if (
        name.includes('math') ||
        name.includes('toán') ||
        name.includes('olympiad') ||
        program.includes('math') ||
        program.includes('toán') ||
        program.includes('olympiad')
      ) {
        list.add('math')
      }
      if (
        name.includes('robot') ||
        name.includes('code') ||
        name.includes('stem') ||
        program.includes('robot') ||
        program.includes('coding') ||
        program.includes('stem')
      ) {
        list.add('stem')
      }
    })
  }

  if (student.enrolledClass) {
    const name = student.enrolledClass.toLowerCase()
    if (
      name.includes('ielts') ||
      name.includes('starter') ||
      name.includes('english') ||
      name.includes('phonic') ||
      name.includes('comm')
    ) {
      list.add('english')
    }
    if (name.includes('math') || name.includes('toán') || name.includes('olympiad')) {
      list.add('math')
    }
    if (name.includes('robot') || name.includes('code') || name.includes('stem')) {
      list.add('stem')
    }
  }
  
  if (placementTest?.subject) {
    list.add(placementTest.subject)
  }
  
  if (trialClass?.subject) {
    const subject = trialClass.subject.toLowerCase()
    if (subject.includes('anh') || subject.includes('english')) {
      list.add('english')
    } else if (subject.includes('toán') || subject.includes('math')) {
      list.add('math')
    } else if (subject.includes('stem') || subject.includes('robot') || subject.includes('coding')) {
      list.add('stem')
    }
  }
  
  if (list.size === 0) {
    list.add('english')
  }
  
  return Array.from(list)
}

export interface StudentScheduleSessionV2 {
  id: string
  className: string
  classCode: string
  sessionNumber: number
  date: string
  startTime: string
  endTime: string
  topic: string
  description?: string
  room: string
  teacherName: string
  substituteTeacherName?: string
  status: 'completed' | 'ongoing' | 'upcoming' | 'rescheduled' | 'cancelled' | 'absent'
  materials?: Array<{ name: string; url: string }>
}

export function getStudentScheduleSessionsV2(student: Student): StudentScheduleSessionV2[] {
  const sessions: StudentScheduleSessionV2[] = []
  if (!student.enrolledClasses || student.enrolledClasses.length === 0) {
    return []
  }

  const topicsPool = [
    'Orientation & Diagnostic Test',
    'Essential Listening & Vocabulary',
    'Speaking Foundation & Pronunciation',
    'Grammar Structures in Writing/Speaking',
    'Reading Strategies & Skimming/Scanning',
    'Active Speaking & Reflex Practice',
    'Listening Strategies - Part 2 & 3',
    'Mid-term Assessment & Review',
    'Advanced Reading & Summary Skills',
    'Writing Task 2 Outline & Body',
    'Full Practice Mock Test under Pressure',
    'Course Graduation & Feedback Review'
  ]

  student.enrolledClasses.forEach((cls) => {
    const baseDate = new Date(cls.startDate || '2025-01-15')
    const totalSessions = 12

    for (let i = 0; i < totalSessions; i++) {
      const sessionNum = i + 1
      const sessionDate = new Date(baseDate)
      sessionDate.setDate(baseDate.getDate() + i * 2) // mock every 2 days
      const dateStr = `${sessionDate.getDate().toString().padStart(2, '0')}/${(sessionDate.getMonth() + 1).toString().padStart(2, '0')}/${sessionDate.getFullYear()}`

      let status: StudentScheduleSessionV2['status'] = 'upcoming'
      if (sessionNum <= 3) {
        status = 'completed'
      } else if (sessionNum === 4) {
        status = sessions.some((s) => s.status === 'ongoing') ? 'upcoming' : 'ongoing'
      } else if (sessionNum === 5) {
        status = 'rescheduled'
      } else if (sessionNum === 6) {
        status = 'cancelled'
      } else if (sessionNum === 7) {
        status = 'absent'
      }

      sessions.push({
        id: `session-v2-${cls.classCode}-${sessionNum}`,
        className: cls.className,
        classCode: cls.classCode,
        sessionNumber: sessionNum,
        date: dateStr,
        startTime: '18:00',
        endTime: '19:30',
        topic: topicsPool[i % topicsPool.length],
        description: `Nội dung chi tiết buổi học số ${sessionNum} của lớp ${cls.className}.`,
        room: cls.room || 'P201',
        teacherName: cls.teacherName || 'Phạm Văn Giảng Dạy',
        substituteTeacherName: sessionNum === 5 ? 'Cô Mai' : undefined,
        status,
        materials: sessionNum === 6 ? [] : [
          { name: `Slide bài giảng Buổi ${sessionNum}`, url: '#' },
          { name: `Bài tập về nhà Buổi ${sessionNum}`, url: '#' }
        ]
      })
    }
  })

  // Sort sessions by date (earlier dates first)
  return sessions.sort((a, b) => {
    const parseDate = (dStr: string) => {
      const [d, m, y] = dStr.split('/').map(Number)
      return new Date(y, m - 1, d).getTime()
    }
    return parseDate(a.date) - parseDate(b.date)
  })
}
