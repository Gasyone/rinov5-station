import type { Student, EnrolledClass } from '@/mocks/students'
import type { StudentPackage, StudentGlobalLog, StudentNote, FamilyMember, StudentScheduleSession, StudentProgram } from './studentDetailTypes'

/**
 * Returns mock package registrations for a student
 */
export function getStudentPackages(student: Student): StudentPackage[] {
  const list: StudentPackage[] = []

  // Main package from student data
  if (student.packageName) {
    const mainClass = student.enrolledClasses?.[0]
    list.push({
      id: `PKG-${student.id}-1`,
      packageName: student.packageName,
      totalSessions: student.totalSessions ?? 24,
      remainingSessions: student.remainingSessions ?? 24,
      price: (student.totalSessions ?? 24) * 150000,
      purchaseDate: student.enrollmentDate,
      endDate: new Date(new Date(student.enrollmentDate).getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: student.remainingSessions && student.remainingSessions > 0 ? 'active' : 'expired',
      linkedClassCode: mainClass?.classCode,
      linkedClassName: mainClass?.className,
      startSessionDate: mainClass?.scheduleSlots?.[0]
        ? `${mainClass.scheduleSlots[0].date} (Buổi 1: Nhập môn & Định hướng)`
        : '02/06 (Buổi 1: Nhập môn & Định hướng)',
    })
  }

  // Add a secondary package if the student has multiple classes
  if (student.enrolledClasses && student.enrolledClasses.length > 1) {
    student.enrolledClasses.slice(1).forEach((cls, idx) => {
      const pDate = new Date(new Date(student.enrollmentDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const eDate = new Date(new Date(pDate).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      list.push({
        id: `PKG-${student.id}-${idx + 2}`,
        packageName: cls.programName || `Gói Bổ Trợ Kỹ Năng ${cls.className}`,
        totalSessions: 12,
        remainingSessions: 8,
        price: 1200000,
        purchaseDate: pDate,
        endDate: eDate,
        status: 'active',
        linkedClassCode: cls.classCode,
        linkedClassName: cls.className,
        startSessionDate: cls.scheduleSlots?.[0]
          ? `${cls.scheduleSlots[0].date} (Buổi 1: Nhập môn & Định hướng)`
          : '02/06 (Buổi 1: Nhập môn & Định hướng)',
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
    endDate: new Date(new Date(student.enrollmentDate).getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
  })

  // Add a transferred-fee package for demo
  const pTransDate = new Date(new Date(student.enrollmentDate).getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  list.push({
    id: `PKG-${student.id}-transferred`,
    packageName: 'Gói IELTS Intensive 5.0 (Cũ)',
    totalSessions: 20,
    remainingSessions: 8,
    price: 1800000,
    purchaseDate: pTransDate,
    endDate: new Date(new Date(pTransDate).getTime() + 150 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'transferred',
    linkedClassCode: 'CLS-OLD-01',
    linkedClassName: 'IELTS Intensive 5.0 - K12',
    startSessionDate: '15/11/2024 (Buổi 1: Cam kết đầu ra & Chẩn đoán)',
  })

  // Add a cancelled package for demo
  const pCancelDate = new Date(new Date(student.enrollmentDate).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  list.push({
    id: `PKG-${student.id}-cancelled`,
    packageName: 'Gói Speaking Club Tháng 3',
    totalSessions: 8,
    remainingSessions: 6,
    price: 800000,
    purchaseDate: pCancelDate,
    endDate: new Date(new Date(pCancelDate).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'cancelled',
  })

  // Add an expired package for demo
  list.push({
    id: `PKG-${student.id}-expired`,
    packageName: 'Gói Tiếng Anh Trẻ Em Standard (Hết hạn)',
    totalSessions: 24,
    remainingSessions: 0,
    price: 3600000,
    purchaseDate: new Date(new Date(student.enrollmentDate).getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(new Date(student.enrollmentDate).getTime() - 185 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'expired',
  })

  // Add a suspended/reserved package for demo
  list.push({
    id: `PKG-${student.id}-suspended`,
    packageName: 'Gói Luyện Thi IELTS Target 6.5 (Bảo lưu)',
    totalSessions: 48,
    remainingSessions: 32,
    price: 7200000,
    purchaseDate: new Date(new Date(student.enrollmentDate).getTime() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(new Date(student.enrollmentDate).getTime() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'suspended',
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
      endDate: new Date(new Date(student.enrollmentDate).getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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

/**
 * Returns initials of a full name (e.g. 'Phạm Văn Giảng' -> 'VG')
 */
export function getInitials(name: string): string {
  if (!name || name === '—') return ''
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(-2)
    .join('')
    .toUpperCase()
}

/**
 * Converts a HH:MM time string to minutes from start of day
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0
  const parts = timeStr.split(':')
  if (parts.length < 2) return 0
  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  if (isNaN(hours) || isNaN(minutes)) return 0
  return hours * 60 + minutes
}

/**
 * Checks if two schedule slots overlap in time on the same day
 */
export function checkSlotsOverlap(
  slotA: { dayOfWeek: string; startTime: string; endTime: string },
  slotB: { dayOfWeek: string; startTime: string; endTime: string }
): boolean {
  const dayA = slotA.dayOfWeek.trim().toLowerCase()
  const dayB = slotB.dayOfWeek.trim().toLowerCase()
  if (dayA !== dayB) return false

  const startA = timeToMinutes(slotA.startTime)
  const endA = timeToMinutes(slotA.endTime)
  const startB = timeToMinutes(slotB.startTime)
  const endB = timeToMinutes(slotB.endTime)

  if (startA === 0 && endA === 0) return false
  if (startB === 0 && endB === 0) return false

  return Math.max(startA, startB) < Math.min(endA, endB)
}

/**
 * Groups packages & classes into Programs by Subject (e.g. Toán Tư Duy, Tiếng Anh).
 * Calculates cumulative sessions, dates, current class, past classes, and program status.
 */
export function getStudentPrograms(
  student: Student,
  packagesList?: StudentPackage[],
  classesList?: EnrolledClass[]
): StudentProgram[] {
  const allPackages = packagesList || getStudentPackages(student)
  const allClasses = classesList || student.enrolledClasses || []

  // Helper to categorize by subject
  const isMath = (str: string) => {
    const s = (str || '').toLowerCase()
    return s.includes('toán') || s.includes('math') || s.includes('logic') || s.includes('archimedes')
  }

  const isEnglish = (str: string) => {
    const s = (str || '').toLowerCase()
    return s.includes('tiếng anh') || s.includes('ielts') || s.includes('english') || s.includes('speaking') || s.includes('junior')
  }

  // Split packages into Math, English, Other
  const mathPackages = allPackages.filter((p) => isMath(p.packageName) || isMath(p.linkedClassName || ''))
  const englishPackages = allPackages.filter((p) => isEnglish(p.packageName) || isEnglish(p.linkedClassName || ''))

  // Split classes
  const mathClasses = allClasses.filter((c) => isMath(c.className) || isMath(c.programName || '') || isMath(c.level || ''))
  const englishClasses = allClasses.filter((c) => isEnglish(c.className) || isEnglish(c.programName || '') || isEnglish(c.level || ''))

  const programs: StudentProgram[] = []

  // 1. Math Program
  if (mathPackages.length > 0 || mathClasses.length > 0 || student.subject === 'math' || isMath(student.level || '')) {
    const pkgs = mathPackages.length > 0 ? mathPackages : [
      {
        id: `PKG-${student.id}-math-default`,
        packageName: 'Gói Toán tư duy Standard (6 tháng)',
        totalSessions: student.totalSessions || 96,
        remainingSessions: student.remainingSessions || 12,
        price: 14400000,
        purchaseDate: student.enrollmentDate,
        endDate: '2027-08-14',
        status: 'active' as const,
        linkedClassCode: mathClasses[0]?.classCode || 'LD_TOAN_00032',
        linkedClassName: mathClasses[0]?.className || 'Toán Tư Duy 1:6 (96 buổi)',
      }
    ]

    const totalSessions = pkgs.reduce((acc, p) => acc + p.totalSessions, 0)
    const remainingSessions = pkgs.reduce((acc, p) => acc + p.remainingSessions, 0)
    const studiedSessions = Math.max(0, totalSessions - remainingSessions)

    // Determine current class vs past classes
    const activeCls = mathClasses.find((c) => c.status === 'active' || c.status === 'wait_for_assignment' || c.status === 'pending_transfer') || null
    const droppedCls = mathClasses.find((c) => c.status === 'dropped') || null
    const pausedCls = mathClasses.find((c) => c.status === 'paused') || null

    let programStatus: StudentProgram['programStatus'] = 'wait_for_assignment'
    if (student.status === 'reserve' || pausedCls) {
      programStatus = 'reserved'
    } else if (activeCls) {
      programStatus = 'active'
    } else if (droppedCls) {
      programStatus = 'dropped'
    }

    // Past classes: classes that are dropped or session_ended, or mock historical classes if none
    const actualPast = mathClasses.filter((c) => c.status === 'dropped' || c.status === 'session_ended')
    const mockPast: EnrolledClass[] = actualPast.length > 0 ? actualPast : [
      {
        classCode: 'LD_TOAN_00018',
        className: 'Toán Tư Duy Nền Tảng K10',
        type: 'tutor',
        scheduleSlots: [
          { dayOfWeek: 'Thứ 2', date: '15/01', startTime: '17:30', endTime: '19:00' },
          { dayOfWeek: 'Thứ 5', date: '18/01', startTime: '17:30', endTime: '19:00' }
        ],
        teacherName: 'GV_HuiLT20',
        status: 'session_ended',
        progress: '24 / 24 buổi (Hoàn thành)',
        branch: student.branch || 'RinoEdu Nguyễn Tuân',
        room: 'B201',
        level: 'Toán 1:6',
        subLevel: 'A',
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        startSessionDate: 'Buổi 01 - 15/01/2024 (T2 17:30 - 19:00)',
        totalSessions: 24,
        usedSessions: 24,
        attendanceRate: '95.8%',
        presentSessions: 23,
        excusedAbsences: 1,
        unexcusedAbsences: 0,
        homeworkRate: '92%',
        homeworkScore: 8.5,
        finalScore: 8.8,
        finalOutcome: 'Đạt chuẩn đầu ra Archimedes 5 - A',
        teacherFinalFeedback: 'Học viên có tư duy logic sắc bén, chủ động tương tác và hoàn thành tốt tất cả các bài toán dự án.',
        linkedPackageName: 'Gói Toán tư duy Standard (6 tháng)',
        finishReason: 'Hoàn thành khóa học',
      }
    ]

    programs.push({
      id: 'prog-math',
      name: 'Toán Tư Duy',
      subject: 'math',
      level: activeCls?.level || student.level || 'Toán 1:6',
      subLevel: activeCls?.subLevel || student.subLevel || 'Archimedes 5 - A',
      packages: pkgs,
      totalSessions,
      studiedSessions,
      remainingSessions,
      startDate: pkgs[0]?.purchaseDate || student.enrollmentDate,
      endDate: pkgs[pkgs.length - 1]?.endDate || '2027-08-14',
      currentClass: activeCls || pausedCls,
      pastClasses: mockPast,
      programStatus,
      droppedClassInfo: droppedCls ? {
        className: droppedCls.className,
        classCode: droppedCls.classCode,
        droppedDate: '01/06/2026',
        studiedBeforeDrop: droppedCls.progress || '84 / 96 buổi',
        teacherName: droppedCls.teacherName,
        room: droppedCls.room,
        reason: 'Học viên xin rút khỏi lớp theo nguyện vọng đổi lịch học'
      } : undefined,
      transferInfo: droppedCls ? {
        sourceClass: droppedCls.classCode,
        targetClass: 'Chưa ghép lớp',
        transferredSessions: remainingSessions,
        transferDate: '01/06/2026',
        reason: 'Chuyển ca học mới phù hợp lịch sinh hoạt gia đình'
      } : undefined,
      reservedInfo: (programStatus === 'reserved' || pausedCls) ? {
        reservedSessions: remainingSessions,
        startDate: '15/06/2026',
        endDate: '15/09/2026',
        duration: '3 tháng',
        isHoldingClass: Boolean(pausedCls),
        expiryDate: '15/10/2026',
        reason: 'Bảo lưu theo đơn xin nghỉ của phụ huynh do bận thi học kỳ'
      } : undefined,
    })
  }

  // 2. English Program
  if (englishPackages.length > 0 || englishClasses.length > 0 || student.subject === 'english' || programs.length === 1) {
    const pkgs = englishPackages.length > 0 ? englishPackages : [
      {
        id: `PKG-${student.id}-eng-unlinked`,
        packageName: 'Gói Tiếng Anh Giao Tiếp Bổ Trợ',
        totalSessions: 16,
        remainingSessions: 16,
        price: 2400000,
        purchaseDate: student.enrollmentDate,
        endDate: '2026-10-30',
        status: 'active' as const,
      },
      {
        id: `PKG-${student.id}-eng-transferred`,
        packageName: 'Gói IELTS Intensive 5.0 (Cũ)',
        totalSessions: 20,
        remainingSessions: 8,
        price: 1800000,
        purchaseDate: '2025-11-01',
        endDate: '2026-04-01',
        status: 'transferred' as const,
        linkedClassCode: 'CLS-OLD-01',
        linkedClassName: 'IELTS Intensive 5.0 - K12',
      }
    ]

    const totalSessions = pkgs.reduce((acc, p) => acc + p.totalSessions, 0)
    const remainingSessions = pkgs.reduce((acc, p) => acc + p.remainingSessions, 0)
    const studiedSessions = Math.max(0, totalSessions - remainingSessions)

    const activeCls = englishClasses.find((c) => c.status === 'active' || c.status === 'wait_for_assignment' || c.status === 'pending_transfer') || null
    const droppedCls = englishClasses.find((c) => c.status === 'dropped') || null
    const pausedCls = englishClasses.find((c) => c.status === 'paused') || null

    let programStatus: StudentProgram['programStatus'] = 'wait_for_assignment'
    if (activeCls) {
      programStatus = 'active'
    } else if (pausedCls) {
      programStatus = 'reserved'
    } else if (droppedCls) {
      programStatus = 'dropped'
    } else {
      programStatus = 'wait_for_assignment'
    }

    const actualPast = englishClasses.filter((c) => c.status === 'dropped' || c.status === 'session_ended')
    const mockPast: EnrolledClass[] = actualPast.length > 0 ? actualPast : [
      {
        classCode: 'CLS-OLD-01',
        className: 'IELTS Intensive 5.0 - K12',
        type: 'offline',
        scheduleSlots: [
          { dayOfWeek: 'Thứ 3', date: '15/11', startTime: '18:00', endTime: '19:30' },
          { dayOfWeek: 'Thứ 6', date: '18/11', startTime: '18:00', endTime: '19:30' }
        ],
        teacherName: 'Thầy David Smith',
        status: 'session_ended',
        progress: '12 / 20 buổi (Đã chuyển phí)',
        branch: student.branch || 'RinoEdu Nguyễn Tuân',
        room: 'A201',
        level: 'IELTS (5.0–5.5)',
        subLevel: 'A2',
        startDate: '2025-11-15',
        endDate: '2026-03-30',
        startSessionDate: 'Buổi 01 - 15/11/2025 (T3 18:00 - 19:30)',
        totalSessions: 20,
        usedSessions: 12,
        attendanceRate: '91.7%',
        presentSessions: 11,
        excusedAbsences: 1,
        unexcusedAbsences: 0,
        homeworkRate: '90%',
        homeworkScore: 8.2,
        finalScore: 8.0,
        finalOutcome: 'Hoàn thành 12/20 buổi (Kết chuyển 8 buổi)',
        teacherFinalFeedback: 'Học viên tiến bộ tốt kỹ năng Nghe - Nói, phản xạ từ vựng tự nhiên, hoàn thành mục tiêu giai đoạn.',
        linkedPackageName: 'Gói IELTS Intensive 5.0 (Cũ)',
        finishReason: 'Chuyển lớp sang gói IELTS VIP',
      }
    ]

    programs.push({
      id: 'prog-english',
      name: 'Tiếng Anh',
      subject: 'english',
      level: 'IELTS (5.0–5.5)',
      subLevel: 'IELTS Junior (A2)',
      packages: pkgs,
      totalSessions,
      studiedSessions,
      remainingSessions,
      startDate: pkgs[0]?.purchaseDate || '2025-11-01',
      endDate: pkgs[pkgs.length - 1]?.endDate || '2026-10-30',
      currentClass: activeCls,
      pastClasses: mockPast,
      programStatus,
      droppedClassInfo: droppedCls ? {
        className: droppedCls.className,
        classCode: droppedCls.classCode,
        droppedDate: '15/04/2026',
        studiedBeforeDrop: droppedCls.progress || '12 / 20 buổi',
        teacherName: droppedCls.teacherName,
        room: droppedCls.room,
        reason: 'Học viên chuyển gói học'
      } : undefined,
      transferInfo: droppedCls ? {
        sourceClass: droppedCls.classCode,
        targetClass: 'Chưa ghép lớp',
        transferredSessions: remainingSessions,
        transferDate: '15/04/2026',
        reason: 'Chuyển sang gói học IELTS VIP mới'
      } : undefined,
      reservedInfo: programStatus === 'reserved' ? {
        reservedSessions: remainingSessions,
        startDate: '01/06/2026',
        endDate: '31/07/2026',
        duration: '2 tháng',
        isHoldingClass: false,
        expiryDate: '15/11/2026',
        reason: 'Bảo lưu theo nguyện vọng phụ huynh'
      } : undefined,
    })
  }

  // Fallback if no programs detected
  if (programs.length === 0) {
    programs.push({
      id: 'prog-standard',
      name: 'Chương trình Chuẩn',
      subject: 'other',
      level: student.level || 'Chuẩn',
      subLevel: student.subLevel || 'A',
      packages: allPackages,
      totalSessions: student.totalSessions || 24,
      studiedSessions: (student.totalSessions || 24) - (student.remainingSessions || 24),
      remainingSessions: student.remainingSessions || 24,
      startDate: student.enrollmentDate,
      endDate: '2026-12-31',
      currentClass: allClasses[0] || null,
      pastClasses: [],
      programStatus: allClasses[0] ? 'active' : 'wait_for_assignment'
    })
  }

  return programs
}
