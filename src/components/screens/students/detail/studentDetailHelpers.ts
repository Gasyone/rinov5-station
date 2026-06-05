import type { Student } from '@/mocks/students'
import type { StudentPackage, StudentGlobalLog, StudentNote, FamilyMember, StudentScheduleSession } from './studentDetailTypes'

/**
 * Returns mock package registrations for a student
 */
export function getStudentPackages(student: Student): StudentPackage[] {
  const list: StudentPackage[] = []

  // Main package from student data
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

  // Add a secondary package if the student has multiple classes
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

  // Add a package with no linked class for demo
  list.push({
    id: `PKG-${student.id}-unlinked`,
    packageName: 'Gói Tiếng Anh Giao Tiếp Bổ Trợ',
    totalSessions: 16,
    remainingSessions: 16,
    price: 2400000,
    purchaseDate: student.enrollmentDate,
    status: 'active',
  })

  // Fallback if no package is recorded
  if (list.length === 0) {
    list.push({
      id: `PKG-${student.id}-fallback`,
      packageName: 'Gói Tiêu Chuẩn RinoEdu',
      totalSessions: 24,
      remainingSessions: 24,
      price: 3600000,
      purchaseDate: student.enrollmentDate,
      status: 'active',
    })
  }

  return list
}

/**
 * Generates mock global audit logs for the student
 */
export function getStudentGlobalLogs(student: Student): StudentGlobalLog[] {
  const logs: StudentGlobalLog[] = []

  const dateOffset = (days: number) => {
    const d = new Date(student.enrollmentDate)
    d.setDate(d.getDate() + days)
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
  }

  // Log 1: Registration
  logs.push({
    id: `log-${student.id}-1`,
    timestamp: dateOffset(0),
    action: `Đăng ký hồ sơ học viên mới thành công tại ${student.branch}.`,
    operator: student.saleName || 'Sales Admin',
  })

  // Log 2: Payment
  logs.push({
    id: `log-${student.id}-2`,
    timestamp: dateOffset(1),
    action: `Xác nhận thanh toán hợp đồng gói học "${student.packageName || 'Gói học bổ trợ'}" thành công.`,
    operator: 'Kế toán Thu Phương',
  })

  // Log 3: Class Assignment or Placement Waitlist
  if (student.enrolledClasses && student.enrolledClasses.length > 0) {
    student.enrolledClasses.forEach((cls, idx) => {
      logs.push({
        id: `log-${student.id}-class-${idx}`,
        timestamp: dateOffset(3 + idx * 2),
        action: `Gắn lớp học thành công: Học viên được phân bổ vào lớp "${cls.className}" (${cls.classCode}).`,
        operator: 'Giáo vụ Lan',
      })
    })
    
    // Log 4: Attendance update
    logs.push({
      id: `log-${student.id}-attendance`,
      timestamp: dateOffset(8),
      action: `Cập nhật chuyên cần: Hệ thống tự động ghi nhận điểm danh buổi học thứ nhất.`,
      operator: 'Giáo viên phụ trách',
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
 * Returns mock interaction notes for the student
 */
export function getStudentNotes(student: Student): StudentNote[] {
  return [
    {
      id: `note-${student.id}-1`,
      text: `Mẹ phản hồi học viên rất hào hứng sau buổi học đầu tiên, mong muốn giáo viên quan tâm phần phát âm hơn.`,
      author: 'CSM Minh Phương',
      timestamp: '10:00 01/06/2026',
    },
    {
      id: `note-${student.id}-2`,
      text: `Sales note: Học viên nhút nhát, cần xếp lớp sỹ số nhỏ để tương tác được nhiều. Phụ huynh đồng ý cam kết đầu ra.`,
      author: student.saleName || 'Sale Consultant',
      timestamp: '15:30 15/05/2026',
    },
  ]
}

/**
 * Generates family members for a student.
 */
export function getStudentFamilyMembers(student: Student): FamilyMember[] {
  const members: FamilyMember[] = []
  
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
    
    // Generate a secondary parent to showcase multi-member layout
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
 * Generates mock chronological sessions for a student's enrolled classes
 */
export function getStudentScheduleSessions(student: Student): StudentScheduleSession[] {
  const sessions: StudentScheduleSession[] = []
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

      let status: StudentScheduleSession['status'] = 'upcoming'
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
        id: `session-${cls.classCode}-${sessionNum}`,
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


