import type { Student, EnrolledClass } from '@/mocks/students'
import type { StudentPackage, StudentGlobalLog, StudentNote, FamilyMember, StudentScheduleSession, StudentProgram, StudentAvailableSlot } from './studentDetailTypes'

export const isMath = (str: string) => {
  const s = (str || '').toLowerCase()
  return s.includes('toán') || s.includes('math') || s.includes('logic') || s.includes('archimedes')
}

export const isEnglish = (str: string) => {
  const s = (str || '').toLowerCase()
  return s.includes('tiếng anh') || s.includes('ielts') || s.includes('english') || s.includes('speaking') || s.includes('junior') || s.includes('toeic')
}

/**
 * Returns mock package registrations for a student
 */
export function getStudentPackages(student: Student): StudentPackage[] {
  // If special showcase student Bảo Hân, preserve her rich multi-package scenario
  if (student.id === 's-baohan') {
    return [
      {
        id: `PKG-${student.id}-1`,
        packageName: student.packageName || '[Gia sư][TH] Toán Tư Duy 1:6 (96 buổi + 8 buổi ôn tập)',
        totalSessions: 96,
        remainingSessions: 12,
        price: 14400000,
        purchaseDate: '2024-08-14',
        endDate: '2027-08-14',
        status: 'active',
        linkedClassCode: 'LD_TOAN_00032',
        linkedClassName: 'Toán Tư Duy 1:6 (96 buổi)',
        startSessionDate: '18/08 (Buổi 1: Nhập môn & Định hướng)',
        orderNo: 'OD800436',
        leaveQuota: 8,
        saleName: 'Trần Thị Mai',
        teacherType: 'VN',
      },
      {
        id: `PKG-${student.id}-math-unlinked`,
        packageName: 'Gói Bổ Trợ Hình Học Không Gian & Logic',
        totalSessions: 8,
        remainingSessions: 8,
        price: 1200000,
        purchaseDate: '2024-09-01',
        endDate: '2025-06-30',
        status: 'active',
        orderNo: 'OD794023',
        leaveQuota: 0,
        saleName: 'Trần Thị Mai',
        teacherType: 'VN',
      },
      {
        id: `PKG-${student.id}-math-adv`,
        packageName: 'Gói Nâng Cao Số Học & Giải Toán Bằng Sơ Đồ',
        totalSessions: 12,
        remainingSessions: 4,
        price: 1800000,
        purchaseDate: '2024-07-01',
        endDate: '2025-03-31',
        status: 'active',
        packageTag: 'received_transfer',
        orderNo: 'OD798202',
        leaveQuota: 1,
        saleName: 'Trần Thị Mai',
        teacherType: 'VN',
      },
      {
        id: `PKG-${student.id}-math-prev`,
        packageName: 'Gói Ôn Luyện Toán Tư Duy Nhập Môn K9',
        totalSessions: 24,
        remainingSessions: 0,
        price: 3600000,
        purchaseDate: '2023-09-01',
        endDate: '2024-03-31',
        status: 'cancelled',
        packageTag: 'cancelled',
        orderNo: 'OD780012',
        leaveQuota: 2,
        saleName: 'Trần Thị Mai',
        teacherType: 'VN',
      },
      {
        id: `PKG-${student.id}-math-transferred`,
        packageName: 'Gói Toán Tư Duy K8 (Chuyển sang cơ sở mới)',
        totalSessions: 16,
        remainingSessions: 6,
        price: 2400000,
        purchaseDate: '2023-06-01',
        endDate: '2024-01-31',
        status: 'transferred',
        packageTag: 'transferred',
        orderNo: 'OD760089',
        leaveQuota: 1,
        saleName: 'Trần Thị Mai',
        teacherType: 'VN',
      },
    ]
  }

  // FOR ALL OTHER STUDENTS:
  const list: StudentPackage[] = []

  let pkgStatus: StudentPackage['status'] = 'active'
  if (student.status === 'reserve') {
    pkgStatus = 'reserved'
  } else if (student.status === 'session_ended' || (student.remainingSessions !== undefined && student.remainingSessions === 0)) {
    pkgStatus = 'expired'
  } else if (student.status === 'pending_payment') {
    pkgStatus = 'pending'
  } else if (student.status === 'fee_transfer') {
    pkgStatus = 'transferred'
  } else if (student.status === 'pending_transfer') {
    pkgStatus = 'active'
  }

  const mainClass = student.enrolledClasses?.[0]
  const totalSessions = student.totalSessions ?? (mainClass?.totalSessions || 24)
  const remainingSessions = student.remainingSessions ?? (student.status === 'session_ended' ? 0 : totalSessions)

  // Primary package
  list.push({
    id: `PKG-${student.id}-1`,
    packageName: student.packageName || mainClass?.linkedPackageName || mainClass?.programName || 'Gói học tiêu chuẩn',
    totalSessions,
    remainingSessions,
    price: totalSessions * 150000,
    purchaseDate: student.enrollmentDate || '2025-01-15',
    endDate: mainClass?.endDate || new Date(new Date(student.enrollmentDate || '2025-01-15').getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: pkgStatus,
    linkedClassCode: mainClass?.classCode && !mainClass.classCode.startsWith('UNASSIGNED') ? mainClass.classCode : undefined,
    linkedClassName: mainClass?.className && mainClass.className !== 'Chưa xếp lớp' ? mainClass.className : undefined,
    startSessionDate: mainClass?.startSessionDate || (mainClass?.scheduleSlots?.[0] ? `${mainClass.scheduleSlots[0].date} (Buổi 1)` : undefined),
    orderNo: `OD${800000 + Math.abs(student.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31) % 90000}`,
    leaveQuota: totalSessions >= 96 ? 8 : totalSessions >= 48 ? 4 : 2,
    saleName: student.saleName || 'Trần Thị Mai',
  })

  // Secondary packages if student has multiple enrolled classes
  if (student.enrolledClasses && student.enrolledClasses.length > 1) {
    student.enrolledClasses.slice(1).forEach((cls, idx) => {
      const clsTotal = cls.totalSessions || 12
      const clsRemaining = cls.status === 'session_ended' ? 0 : 8
      let clsPkgStatus: StudentPackage['status'] = 'active'
      if (cls.status === 'reserve' || cls.status === 'paused') clsPkgStatus = 'reserved'
      else if (cls.status === 'session_ended') clsPkgStatus = 'expired'
      else if (cls.status === 'pending_transfer') clsPkgStatus = 'active'

      list.push({
        id: `PKG-${student.id}-${idx + 2}`,
        packageName: cls.linkedPackageName || cls.programName || `Gói Bổ Trợ ${cls.className}`,
        totalSessions: clsTotal,
        remainingSessions: clsRemaining,
        price: clsTotal * 150000,
        purchaseDate: cls.startDate || student.enrollmentDate,
        endDate: cls.endDate || '2026-12-31',
        status: clsPkgStatus,
        linkedClassCode: cls.classCode && !cls.classCode.startsWith('UNASSIGNED') ? cls.classCode : undefined,
        linkedClassName: cls.className,
        startSessionDate: cls.startSessionDate || (cls.scheduleSlots?.[0] ? `${cls.scheduleSlots[0].date} (Buổi 1)` : undefined),
        orderNo: `OD${810000 + idx * 100}`,
        leaveQuota: clsTotal >= 48 ? 4 : 2,
        saleName: student.saleName || 'Trần Thị Mai',
      })
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
 * Generates accurate data-driven programs for standard students based on their actual mock data.
 */
function getStandardStudentPrograms(
  student: Student,
  packagesList?: StudentPackage[],
  classesList?: EnrolledClass[]
): StudentProgram[] {
  const pkgs = packagesList || getStudentPackages(student)
  const clsList = classesList || student.enrolledClasses || []

  // If student has multiple enrolled classes (e.g. s1, s3):
  if (clsList.length > 1) {
    return clsList.map((cls, idx) => {
      const pkg = pkgs.find((p) => p.linkedClassCode === cls.classCode) || pkgs[idx] || pkgs[0]
      const clsTotal = cls.totalSessions || pkg?.totalSessions || 24
      const clsRemaining = cls.status === 'session_ended' ? 0 : (pkg?.remainingSessions ?? 12)
      const clsStudied = Math.max(0, clsTotal - clsRemaining)

      let progStatus: StudentProgram['programStatus'] = 'active'
      if (cls.status === 'reserve' || cls.status === 'paused' || student.status === 'reserve') progStatus = 'reserved'
      else if (cls.status === 'pending_transfer' || cls.status === 'dropped' || student.status === 'pending_transfer') progStatus = 'pending_transfer'
      else if (cls.status === 'session_ended' || student.status === 'session_ended') progStatus = 'session_ended'
      else if (cls.status === 'wait_for_assignment' || student.status === 'wait_for_assignment') progStatus = 'wait_for_assignment'
      else if (student.status === 'draft_class') progStatus = 'draft_class'
      else if (student.status === 'pending_payment') progStatus = 'pending_payment'
      else if (student.status === 'fee_transfer') progStatus = 'fee_transfer'
      else if (student.status === 'awaiting_opening') progStatus = 'awaiting_opening'
      else if (student.status === 'trial') progStatus = 'trial'
      else if (student.status === 'enroll_later') progStatus = 'enroll_later'

      const isEng = isEnglish(cls.className) || isEnglish(cls.programName || '') || isEnglish(pkg?.packageName || '')
      const isMathCls = isMath(cls.className) || isMath(cls.programName || '') || isMath(pkg?.packageName || '')

      return {
        id: `prog-${student.id}-${idx}`,
        name: cls.className || pkg?.packageName || `Lớp ${idx + 1}`,
        subject: isEng ? 'english' : isMathCls ? 'math' : (student.subject === 'stem' ? 'stem' : 'other'),
        level: cls.level || student.level,
        subLevel: cls.subLevel || student.subLevel,
        schoolClass: student.schoolClass,
        branch: cls.branch || student.branch,
        entryScore: '8.0 / 10',
        entryScoreEvaluation: 'Khá giỏi',
        assessmentNote: student.notes || 'Học viên có tinh thần học tập tốt, tiếp thu bài nhanh.',
        csmName: isEng ? 'Hoàng Yến (CSM Ngoại ngữ)' : 'Minh Phương (CSM Toán)',
        saleName: student.saleName || 'Trần Thị Mai',
        availableSlots: getStudentAvailableSlots(student),
        packages: pkg ? [pkg] : pkgs,
        totalSessions: clsTotal,
        studiedSessions: clsStudied,
        remainingSessions: clsRemaining,
        startDate: cls.startDate || pkg?.purchaseDate || student.enrollmentDate,
        endDate: cls.endDate || pkg?.endDate || '2026-12-31',
        currentClass: cls,
        pastClasses: [],
        programStatus: progStatus,
        reservedInfo: progStatus === 'reserved' ? {
          reservedSessions: clsRemaining,
          startDate: cls.startDate || '15/01/2026',
          endDate: cls.endDate || '15/04/2026',
          duration: '3 tháng',
          isHoldingClass: true,
          expiryDate: '15/10/2026',
          reason: 'Bảo lưu theo đơn xin nghỉ của phụ huynh',
        } : undefined,
      }
    })
  }

  // Single class or no class (the vast majority of students)
  const mainClass = clsList[0] || null
  const primaryPkg = pkgs[0] || {
    id: `PKG-${student.id}-1`,
    packageName: student.packageName || 'Gói học tiêu chuẩn',
    totalSessions: student.totalSessions || 24,
    remainingSessions: student.remainingSessions ?? 24,
    price: (student.totalSessions || 24) * 150000,
    purchaseDate: student.enrollmentDate,
    status: student.status === 'reserve' ? 'reserved' : student.status === 'session_ended' ? 'expired' : 'active',
  }

  const totalSessions = student.totalSessions ?? (mainClass?.totalSessions || primaryPkg.totalSessions || 24)
  const remainingSessions = student.remainingSessions ?? (student.status === 'session_ended' ? 0 : (primaryPkg.remainingSessions ?? totalSessions))
  const studiedSessions = Math.max(0, totalSessions - remainingSessions)

  let programStatus: StudentProgram['programStatus'] = 'wait_for_assignment'
  if (student.status === 'session_ended' || remainingSessions === 0) {
    programStatus = 'session_ended'
  } else if (student.status === 'reserve') {
    programStatus = 'reserved'
  } else if (student.status === 'pending_transfer') {
    programStatus = 'pending_transfer'
  } else if (student.status === 'fee_transfer') {
    programStatus = 'fee_transfer'
  } else if (student.status === 'draft_class') {
    programStatus = 'draft_class'
  } else if (student.status === 'pending_payment') {
    programStatus = 'pending_payment'
  } else if (student.status === 'enroll_later') {
    programStatus = 'enroll_later'
  } else if (student.status === 'awaiting_opening') {
    programStatus = 'awaiting_opening'
  } else if (student.status === 'trial') {
    programStatus = 'trial'
  } else if (student.status === 'wait_for_assignment' || !mainClass || mainClass.classCode.startsWith('UNASSIGNED')) {
    programStatus = 'wait_for_assignment'
  } else if (mainClass?.status === 'reserve' || mainClass?.status === 'paused') {
    programStatus = 'reserved'
  } else if (mainClass?.status === 'session_ended') {
    programStatus = 'session_ended'
  } else if (mainClass?.status === 'pending_transfer' || mainClass?.status === 'dropped') {
    programStatus = 'pending_transfer'
  } else if (mainClass && (student.status === 'active' || !student.status)) {
    programStatus = 'active'
  }

  const isEng = isEnglish(student.packageName || '') || isEnglish(student.level || '') || student.subject === 'english' || (mainClass && isEnglish(mainClass.className))
  const progSubject = isEng ? 'english' : 'math'

  // Name of program on the tab
  let progName = 'Chương trình chuẩn'
  if (student.status === 'fee_transfer') {
    progName = 'Tiếng Anh IELTS'
  } else if (mainClass && !mainClass.classCode.startsWith('UNASSIGNED') && mainClass.status !== 'session_ended') {
    progName = mainClass.className
  } else if (student.packageName) {
    const raw = student.packageName.replace(/^Gói\s+/i, '').replace(/\(.*?\)/g, '').trim()
    progName = raw.charAt(0).toUpperCase() + raw.slice(1)
  }

  const hasRealClass = Boolean(mainClass && !mainClass.classCode.startsWith('UNASSIGNED'))

  return [
    {
      id: `prog-${student.id}-main`,
      name: progName,
      subject: progSubject,
      level: mainClass?.level || student.level,
      subLevel: mainClass?.subLevel || student.subLevel,
      schoolClass: student.schoolClass,
      branch: mainClass?.branch || student.branch,
      entryScore: '8.5 / 10',
      entryScoreEvaluation: 'Khá giỏi',
      assessmentNote: student.notes || 'Học viên có tinh thần học tập tốt, tiếp thu bài nhanh.',
      csmName: isEng ? 'Hoàng Yến (CSM Ngoại ngữ)' : 'Minh Phương (CSM Toán)',
      saleName: student.saleName || 'Trần Thị Mai',
      availableSlots: getStudentAvailableSlots(student),
      packages: pkgs,
      totalSessions,
      studiedSessions,
      remainingSessions,
      startDate: primaryPkg.purchaseDate || student.enrollmentDate,
      endDate: primaryPkg.endDate || '2026-12-31',
      currentClass: (programStatus !== 'wait_for_assignment' && programStatus !== 'session_ended' && programStatus !== 'fee_transfer' && hasRealClass && mainClass?.status !== 'session_ended') ? mainClass : null,
      pastClasses: [
        ...(hasRealClass && (mainClass!.status === 'dropped' || mainClass!.status === 'session_ended' || programStatus === 'session_ended' || programStatus === 'fee_transfer') ? [mainClass!] : []),
        ...(student.enrolledClasses ? student.enrolledClasses.filter((c) => c.status === 'session_ended' && c.classCode !== mainClass?.classCode) : []),
      ],
      programStatus,
      droppedClassInfo: (programStatus === 'pending_transfer' || mainClass?.status === 'dropped') && mainClass ? {
        className: mainClass.className,
        classCode: mainClass.classCode,
        droppedDate: '01/06/2026',
        studiedBeforeDrop: mainClass.progress || `${studiedSessions} / ${totalSessions} buổi`,
        teacherName: mainClass.teacherName,
        room: mainClass.room,
        reason: 'Học viên chuyển lớp theo nguyện vọng đổi lịch học'
      } : undefined,
      transferInfo: (programStatus === 'pending_transfer') ? {
        sourceClass: mainClass?.classCode || 'Lớp cũ',
        targetClass: 'Chưa ghép lớp',
        transferredSessions: remainingSessions,
        transferDate: '01/06/2026',
        reason: 'Chuyển sang ca học mới phù hợp thời khóa biểu'
      } : undefined,
      reservedInfo: programStatus === 'reserved' ? {
        reservedSessions: remainingSessions,
        startDate: mainClass?.startDate || student.enrollmentDate || '15/01/2026',
        endDate: mainClass?.endDate || '15/04/2026',
        duration: '3 tháng',
        isHoldingClass: hasRealClass,
        expiryDate: '15/10/2026',
        reason: 'Bảo lưu theo đơn xin nghỉ của phụ huynh'
      } : undefined,
      renewalInfo: programStatus === 'session_ended' ? {
        status: 'pending',
        decisionDate: '15/06/2026',
        note: 'Học viên đã kết thúc số buổi học, đang chờ tư vấn tái phí.',
      } : undefined,
      feeTransferInfo: programStatus === 'fee_transfer' ? {
        ticketCode: 'CP00014156',
        transferDate: '15/01/2024',
        executorName: 'Trần Thảo Anh 20',
        transferredSessions: remainingSessions || 16,
        targetPackageName: 'Gói Tiếng Anh Giao Tiếp Cambridge (16 buổi)',
        recipientStudentName: student.name || 'Nguyễn Phương Vy',
        linkedOrderNo: 'OD803325',
        note: 'Đã hoàn tất thủ tục chuyển 16 buổi sang gói học mới.',
      } : undefined,
    }
  ]
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
  // If not showcase student Bảo Hân, build data-driven programs matching their actual table row
  if (student.id !== 's-baohan') {
    return getStandardStudentPrograms(student, packagesList, classesList)
  }

  const allPackages = packagesList || getStudentPackages(student)
  const allClasses = classesList || student.enrolledClasses || []

  // Split packages into Math, English, Other
  const mathPackages = allPackages.filter((p) => isMath(p.packageName) || isMath(p.linkedClassName || ''))
  const englishPackages = allPackages.filter((p) => isEnglish(p.packageName) || isEnglish(p.linkedClassName || ''))

  // Split classes
  const mathClasses = allClasses.filter((c) => isMath(c.className) || isMath(c.programName || '') || isMath(c.level || ''))
  const englishClasses = allClasses.filter((c) => isEnglish(c.className) || isEnglish(c.programName || '') || isEnglish(c.level || ''))

  const isStudentEnglish = Boolean(
    !isMath(student.packageName || '') &&
    (student.subject === 'english' ||
      isEnglish(student.packageName || '') ||
      isEnglish(student.level || '') ||
      englishClasses.length > 0)
  )

  const mathPrograms: StudentProgram[] = []
  const englishPrograms: StudentProgram[] = []

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
        orderNo: 'OD800436',
        leaveQuota: 8,
      }
    ]

    const totalSessions = student.totalSessions || 96
    const remainingSessions = student.remainingSessions ?? 12
    const studiedSessions = Math.max(0, totalSessions - remainingSessions)

    // Determine current class vs past classes
    const activeCls = mathClasses.find((c) => c.status === 'active') || null
    const droppedCls = mathClasses.find((c) => c.status === 'dropped' || c.status === 'pending_transfer') || null
    const pausedCls = mathClasses.find((c) => c.status === 'paused' || c.status === 'reserve') || null

    let programStatus: StudentProgram['programStatus'] = 'wait_for_assignment'
    if (student.status === 'reserve' || pausedCls) {
      programStatus = 'reserved'
    } else if (student.status === 'pending_transfer' || droppedCls) {
      programStatus = 'pending_transfer'
    } else if (student.status === 'fee_transfer') {
      programStatus = 'fee_transfer'
    } else if (student.status === 'draft_class') {
      programStatus = 'draft_class'
    } else if (student.status === 'pending_payment') {
      programStatus = 'pending_payment'
    } else if (student.status === 'enroll_later') {
      programStatus = 'enroll_later'
    } else if (student.status === 'awaiting_opening') {
      programStatus = 'awaiting_opening'
    } else if (student.status === 'trial') {
      programStatus = 'trial'
    } else if (student.status === 'session_ended' || remainingSessions === 0) {
      programStatus = 'session_ended'
    } else if (student.status === 'wait_for_assignment') {
      programStatus = 'wait_for_assignment'
    } else if (activeCls && (student.status === 'active' || !student.status)) {
      programStatus = 'active'
    } else {
      programStatus = 'wait_for_assignment'
    }

    // Past classes: classes that are dropped or session_ended, or mock historical classes if none
    const actualPast = mathClasses.filter((c) => c.status === 'dropped' || c.status === 'session_ended')
    const mockPast: EnrolledClass[] = actualPast.length >= 2 ? actualPast : [
      ...actualPast,
      {
        classCode: 'LD_TOAN_00018',
        className: 'Toán Tư Duy Nền Tảng K10',
        type: 'tutor',
        scheduleSlots: [
          { dayOfWeek: 'Thứ 2', date: '15/01', startTime: '17:30', endTime: '19:00' },
          { dayOfWeek: 'Thứ 5', date: '18/01', startTime: '17:30', endTime: '19:00' }
        ],
        teacherName: 'GV_HuiLT20', assistantName: 'Nguyễn Thu Trang', status: 'session_ended', progress: '24 / 24 buổi (Hoàn thành)',
        branch: student.branch || 'RinoEdu Nguyễn Tuân', room: 'B201', level: 'Toán 1:6', subLevel: 'A',
        startDate: '2024-01-15', endDate: '2024-04-15', startSessionDate: 'Buổi 01 (15/01/2024)',
        totalSessions: 24, usedSessions: 24, attendanceRate: '95.8%', presentSessions: 23, excusedAbsences: 1, unexcusedAbsences: 0,
        homeworkRate: '92%', homeworkScore: 8.5, finalScore: 8.8, finalOutcome: 'Đạt chuẩn đầu ra Archimedes 5 - A',
        teacherFinalFeedback: 'Học viên có tư duy logic sắc bén, chủ động tương tác và hoàn thành tốt tất cả các bài toán dự án.',
        linkedPackageName: 'Gói Toán tư duy Standard (6 tháng)', finishReason: 'Hoàn thành khóa học',
      },
      {
        classCode: 'LD_TOAN_00009',
        className: 'Toán Tư Duy Khởi Động K9',
        type: 'tutor',
        scheduleSlots: [
          { dayOfWeek: 'Thứ 3', date: '05/09', startTime: '17:30', endTime: '19:00' },
          { dayOfWeek: 'Thứ 6', date: '08/09', startTime: '17:30', endTime: '19:00' }
        ],
        teacherName: 'GV_ThaoNT', assistantName: 'Lê Mai Anh', status: 'session_ended', progress: '24 / 24 buổi (Hoàn thành)',
        branch: student.branch || 'RinoEdu Nguyễn Tuân', room: 'A102', level: 'Toán 1:6', subLevel: 'B',
        startDate: '2023-09-05', endDate: '2023-12-15', startSessionDate: 'Buổi 01 (05/09/2023)',
        totalSessions: 24, usedSessions: 24, attendanceRate: '100%', presentSessions: 24, excusedAbsences: 0, unexcusedAbsences: 0,
        homeworkRate: '88%', homeworkScore: 8.0, finalScore: 8.4, finalOutcome: 'Đạt chuẩn đầu ra Archimedes 4 - B+',
        teacherFinalFeedback: 'Nắm vững các phép tính phân số và hình học trực quan, tiếp thu bài nhanh.',
        linkedPackageName: 'Gói Toán tư duy Standard (6 tháng)', finishReason: 'Hoàn thành khóa học',
      },
      {
        classCode: 'LD_TOAN_00003',
        className: 'Toán Nhập Môn Mầm Non K8',
        type: 'offline',
        scheduleSlots: [
          { dayOfWeek: 'Thứ 7', date: '10/06', startTime: '09:00', endTime: '10:30' },
          { dayOfWeek: 'Chủ Nhật', date: '11/06', startTime: '09:00', endTime: '10:30' }
        ],
        teacherName: 'GV_HuongTM', assistantName: 'Phạm Quỳnh Nga', status: 'session_ended', progress: '16 / 16 buổi (Hoàn thành)',
        branch: student.branch || 'RinoEdu Linh Đàm', room: 'A101', level: 'Toán Mầm Non', subLevel: 'K8',
        startDate: '2023-06-10', endDate: '2023-08-20', startSessionDate: 'Buổi 01 (10/06/2023)',
        totalSessions: 16, usedSessions: 16, attendanceRate: '93.7%', presentSessions: 15, excusedAbsences: 1, unexcusedAbsences: 0,
        homeworkRate: '95%', homeworkScore: 9.0, finalScore: 9.2, finalOutcome: 'Đạt chuẩn hoàn thành khóa học',
        teacherFinalFeedback: 'Bé làm quen tốt với các khối hình và số đếm, tự tin phát biểu trên lớp.',
        linkedPackageName: 'Gói Ôn Luyện Toán Tư Duy Nhập Môn K9', finishReason: 'Hoàn thành khóa học',
      }
    ]

    mathPrograms.push({
      id: 'track-math-1-6',
      name: '[MATH_TUTOR] Toán Tư Duy 1:6',
      subject: 'math',
      level: activeCls?.level || (student.level?.toLowerCase().includes('ielts') ? 'Toán Tiền Tiểu Học' : student.level) || 'Toán Tiền Tiểu Học',
      subLevel: activeCls?.subLevel || (student.subLevel?.toLowerCase().includes('ielts') ? 'Kindi 3 (Pre-K)' : student.subLevel) || 'Kindi 3 (Pre-K)',
      schoolClass: student.schoolClass || 'Lớp 6',
      branch: activeCls?.branch || student.branch || 'RinoEdu Linh Đàm',
      entryScore: '8.5 / 10',
      entryScoreEvaluation: 'Khá giỏi (Tư duy Logic tốt)',
      assessmentNote: 'Tập trung tốt, phản xạ toán học và tư duy hình học không gian nhạy bén.',
      csmName: 'Minh Phương (CSM Toán)',
      saleName: student.saleName || 'Trần Thị Mai (Sales)',
      availableSlots: [
        { id: `slot-${student.id}-m1`, dayOfWeek: 'Thứ 3 & Thứ 6', timeRange: '17:30 - 19:00', isPreferred: true, note: `Ưu tiên cơ sở ${student.branch || 'Linh Đàm'}` },
        { id: `slot-${student.id}-m2`, dayOfWeek: 'Thứ 7', timeRange: '09:00 - 10:30', isPreferred: false, note: 'Lịch bổ trợ cuối tuần' },
      ],
      packages: pkgs,
      totalSessions,
      studiedSessions,
      remainingSessions,
      startDate: pkgs[0]?.purchaseDate || student.enrollmentDate,
      endDate: pkgs[pkgs.length - 1]?.endDate || '2027-08-14',
      currentClass: (activeCls || pausedCls) ? {
        ...(activeCls || pausedCls)!,
        assistantName: (activeCls || pausedCls)!.assistantName || 'Nguyễn Thu Trang',
        startSessionDate: (activeCls || pausedCls)!.startSessionDate || 'Buổi 01 (14/08/2024)',
      } : null,
      pastClasses: mockPast,
      programStatus,
      droppedClassInfo: droppedCls ? {
        className: droppedCls.className, classCode: droppedCls.classCode, droppedDate: '01/06/2026',
        studiedBeforeDrop: droppedCls.progress || '84 / 96 buổi', teacherName: droppedCls.teacherName, room: droppedCls.room,
        reason: 'Học viên xin rút khỏi lớp theo nguyện vọng đổi lịch học'
      } : undefined,
      transferInfo: droppedCls ? {
        sourceClass: droppedCls.classCode, targetClass: 'Chưa ghép lớp', transferredSessions: remainingSessions,
        transferDate: '01/06/2026', reason: 'Chuyển ca học mới phù hợp lịch sinh hoạt gia đình'
      } : undefined,
      reservedInfo: (programStatus === 'reserved' || pausedCls) ? {
        reservedSessions: remainingSessions, startDate: '15/06/2026', endDate: '15/09/2026', duration: '3 tháng',
        isHoldingClass: Boolean(pausedCls || (activeCls && student.status === 'reserve') || (student.enrolledClasses && student.enrolledClasses.length > 0)),
        expiryDate: '15/10/2026', reason: 'Bảo lưu theo đơn xin nghỉ của phụ huynh'
      } : undefined,
    })

    // Program 2: [MATH_ARCH] Toán Nền Tảng K10 (Lớp LD_TOAN_00088)
    mathPrograms.push({
      id: 'track-math-arch',
      name: '[MATH_ARCH] Toán Nền Tảng K10',
      subject: 'math',
      level: 'Toán Nền Tảng K10',
      subLevel: 'A+',
      schoolClass: student.schoolClass || 'Lớp 6',
      branch: student.branch || 'RinoEdu Linh Đàm',
      entryScore: '8.0 / 10',
      entryScoreEvaluation: 'Tư duy logic tốt, đạt chuẩn lớp Archimedes',
      assessmentNote: 'Cần rèn luyện thêm các dạng bài hình học không gian.',
      csmName: 'Minh Phương (CSM Toán)',
      saleName: student.saleName || 'Trần Thị Mai (Sales)',
      availableSlots: [
        { id: `slot-${student.id}-m3`, dayOfWeek: 'Thứ 4 & Chủ Nhật', timeRange: '18:00 - 19:30', isPreferred: true, note: 'Lớp Archimedes' },
      ],
      packages: [
        {
          id: `PKG-${student.id}-math-arch`,
          packageName: 'Gói Toán Nền Tảng Archimedes K10 (48 buổi)',
          totalSessions: 48,
          remainingSessions: 32,
          price: 7200000,
          purchaseDate: '2024-09-01',
          endDate: '2025-06-30',
          status: 'active' as const,
          linkedClassCode: 'LD_TOAN_00088',
          linkedClassName: 'Toán Nền Tảng Archimedes K10',
          orderNo: 'OD812044',
          leaveQuota: 4,
          saleName: 'Trần Thị Mai',
        },
        {
          id: `PKG-${student.id}-math-arch-old1`,
          packageName: 'Gói Toán Archimedes Khởi Động K9 (24 buổi)',
          totalSessions: 24,
          remainingSessions: 0,
          price: 3600000,
          purchaseDate: '2023-09-01',
          endDate: '2024-03-31',
          status: 'expired' as const,
          orderNo: 'OD800210',
          leaveQuota: 2,
          saleName: 'Trần Thị Mai',
        },
        {
          id: `PKG-${student.id}-math-arch-old2`,
          packageName: 'Gói Ôn Luyện Chuyên Đề Số Học Archimedes (16 buổi)',
          totalSessions: 16,
          remainingSessions: 0,
          price: 2400000,
          purchaseDate: '2024-04-01',
          endDate: '2024-08-30',
          status: 'transferred' as const,
          packageTag: 'transferred' as const,
          orderNo: 'OD790155',
          leaveQuota: 1,
          saleName: 'Trần Thị Mai',
        },
      ],
      totalSessions: 48,
      studiedSessions: 16,
      remainingSessions: 32,
      startDate: '2024-09-01',
      endDate: '2025-06-30',
      currentClass: {
        classCode: 'LD_TOAN_00088',
        className: 'Toán Nền Tảng Archimedes K10',
        type: 'offline',
        scheduleSlots: [
          { dayOfWeek: 'Thứ 4', date: '04/09', startTime: '18:00', endTime: '19:30' },
          { dayOfWeek: 'Chủ Nhật', date: '08/09', startTime: '09:00', endTime: '10:30' },
        ],
        teacherName: 'Thầy Nguyễn Văn Nam',
        assistantName: 'Lê Thu Thảo',
        status: 'active',
        progress: '16 / 48 buổi',
        branch: student.branch || 'RinoEdu Linh Đàm',
        room: 'A203',
        level: 'Toán Nền Tảng K10',
        subLevel: 'A+',
        startDate: '2024-09-01',
        startSessionDate: 'Buổi 01 (04/09/2024)',
      },
      pastClasses: [],
      programStatus: 'active',
    })

    // 4 Gói cũ / hết hạn (cho Popover Khác)
    mathPrograms.push(
      {
        id: 'track-math-pre',
        name: '[MATH_PRE] Toán Einstein 0 Foundation',
        subject: 'math',
        level: 'Toán Einstein 0',
        subLevel: 'Foundation',
        schoolClass: student.schoolClass || 'Lớp 6',
        branch: student.branch || 'RinoEdu Linh Đàm',
        totalSessions: 24,
        studiedSessions: 24,
        remainingSessions: 0,
        startDate: '2023-01-10',
        endDate: '2023-07-10',
        packages: [
          {
            id: `PKG-${student.id}-old-1`,
            packageName: 'Gói Toán Einstein 0 Foundation (24 buổi)',
            totalSessions: 24,
            remainingSessions: 0,
            price: 3600000,
            purchaseDate: '2023-01-10',
            endDate: '2023-07-10',
            status: 'expired',
            orderNo: 'OD751020',
            leaveQuota: 2,
          },
        ],
        currentClass: null,
        pastClasses: [
          {
            classCode: 'LD_TOAN_00002',
            className: 'Toán Einstein 0 K1',
            type: 'offline',
            scheduleSlots: [],
            teacherName: 'Cô Thu Trang',
            status: 'session_ended',
            progress: '24 / 24 buổi (Hết buổi)',
            branch: student.branch || 'RinoEdu Linh Đàm',
            room: 'A101',
            level: 'Toán Einstein 0',
            startDate: '2023-01-15',
            endDate: '2023-07-15',
          },
        ],
        programStatus: 'session_ended',
        renewalInfo: {
          status: 'failed',
          outcomeType: 'not_purchased',
          failureReason: 'Phụ huynh không mua tiếp do bận lịch học thêm ở trường và chuyển lịch học chính khóa.',
          decisionDate: '15/07/2023',
          note: 'Học viên dừng học sau khi hết buổi.',
        },
      },
      {
        id: 'track-ie-super',
        name: '[IE_SUPER] Tiếng Anh SuperKids Level 2',
        subject: 'english',
        level: 'SuperKids Level 2',
        subLevel: 'Level 2',
        schoolClass: student.schoolClass || 'Lớp 6',
        branch: student.branch || 'RinoEdu Linh Đàm',
        totalSessions: 24,
        studiedSessions: 24,
        remainingSessions: 0,
        startDate: '2023-03-01',
        endDate: '2023-09-01',
        packages: [
          {
            id: `PKG-${student.id}-old-2`,
            packageName: 'Gói Tiếng Anh SuperKids Level 2 (24 buổi)',
            totalSessions: 24,
            remainingSessions: 0,
            price: 4800000,
            purchaseDate: '2023-03-01',
            endDate: '2023-09-01',
            status: 'expired',
            orderNo: 'OD761040',
            leaveQuota: 2,
          },
        ],
        currentClass: null,
        pastClasses: [
          {
            classCode: 'LD_ENG_00002',
            className: 'SuperKids Level 2 - K3',
            type: 'offline',
            scheduleSlots: [],
            teacherName: 'David Smith',
            status: 'session_ended',
            progress: '24 / 24 buổi (Hết buổi)',
            branch: student.branch || 'RinoEdu Linh Đàm',
            room: 'B102',
            level: 'SuperKids Level 2',
            startDate: '2023-03-05',
            endDate: '2023-09-05',
          },
        ],
        programStatus: 'session_ended',
        renewalInfo: {
          status: 'success',
          outcomeType: 'purchased_other',
          newPackageName: '[MATH_TUTOR] Toán Tư Duy 1:6 (96 buổi)',
          newProgramName: 'Toán Tư Duy',
          linkedOrderNo: 'OD751020',
          decisionDate: '20/07/2023',
          note: 'Mua sang gói Toán Tư Duy 1:6 sau khi kết thúc khóa tiếng Anh.',
        },
      },
      {
        id: 'track-math-kindy',
        name: '[MATH_KINDY] Toán Mầm Non Archimedes',
        subject: 'math',
        level: 'Toán Mầm Non Archimedes',
        subLevel: 'Kindy',
        schoolClass: student.schoolClass || 'Lớp 6',
        branch: student.branch || 'RinoEdu Linh Đàm',
        totalSessions: 16,
        studiedSessions: 16,
        remainingSessions: 0,
        startDate: '2022-09-01',
        endDate: '2023-03-01',
        packages: [
          {
            id: `PKG-${student.id}-old-3`,
            packageName: 'Gói Toán Mầm Non Archimedes (16 buổi)',
            totalSessions: 16,
            remainingSessions: 0,
            price: 2400000,
            purchaseDate: '2022-09-01',
            endDate: '2023-03-01',
            status: 'expired',
            orderNo: 'OD720011',
            leaveQuota: 1,
          },
        ],
        currentClass: null,
        pastClasses: [
          {
            classCode: 'LD_TOAN_00001',
            className: 'Toán Khám Phá Khối Hình K7',
            type: 'offline',
            scheduleSlots: [],
            teacherName: 'GV_HuongTM',
            status: 'session_ended',
            progress: '16 / 16 buổi (Hết buổi)',
            branch: student.branch || 'RinoEdu Linh Đàm',
            room: 'A101',
            level: 'Toán Mầm Non',
            startDate: '2022-09-10',
            endDate: '2023-03-01',
          },
        ],
        programStatus: 'session_ended',
        renewalInfo: {
          status: 'failed',
          outcomeType: 'not_purchased',
          failureReason: 'Gia đình chuyển nơi cư trú sang quận khác, không tiện di chuyển đến cơ sở.',
          decisionDate: '18/08/2023',
          note: 'Không mua tiếp do chuyển nhà.',
        },
      },
      {
        id: 'track-stem-robot',
        name: '[STEM_ROBOT] Lập Trình Robot & AI K1',
        subject: 'stem',
        level: 'STEM Robot & AI Level 1',
        subLevel: 'Level 1',
        schoolClass: student.schoolClass || 'Lớp 6',
        branch: student.branch || 'RinoEdu Linh Đàm',
        totalSessions: 12,
        studiedSessions: 12,
        remainingSessions: 0,
        startDate: '2023-06-01',
        endDate: '2023-09-01',
        packages: [
          {
            id: `PKG-${student.id}-old-4`,
            packageName: 'Gói Lập Trình Robot & AI K1 (12 buổi)',
            totalSessions: 12,
            remainingSessions: 0,
            price: 3000000,
            purchaseDate: '2023-06-01',
            endDate: '2023-09-01',
            status: 'expired',
            orderNo: 'OD774411',
            leaveQuota: 1,
          },
        ],
        currentClass: null,
        pastClasses: [
          {
            classCode: 'LD_STEM_00001',
            className: 'STEM Robot K1',
            type: 'offline',
            scheduleSlots: [],
            teacherName: 'Thầy Quốc Bảo',
            status: 'session_ended',
            progress: '12 / 12 buổi (Hết buổi)',
            branch: student.branch || 'RinoEdu Linh Đàm',
            room: 'Lab 1',
            level: 'STEM K1',
            startDate: '2023-06-05',
            endDate: '2023-09-01',
          },
        ],
        programStatus: 'session_ended',
        renewalInfo: {
          status: 'success',
          outcomeType: 'purchased_other',
          newPackageName: 'Gói Tiếng Anh SuperKids Level 2 (24 buổi)',
          newProgramName: 'Tiếng Anh',
          linkedOrderNo: 'OD761040',
          decisionDate: '25/08/2023',
          note: 'Học viên hoàn thành trải nghiệm STEM và đăng ký tiếp gói tiếng Anh.',
        },
      }
    )
  }

  // 2. English Program
  if (
    student.subject === 'english' ||
    englishClasses.length > 0 ||
    (mathPrograms.length === 0 && englishPackages.length > 0) ||
    isStudentEnglish
  ) {
    const pkgs = englishPackages.length > 0 ? englishPackages : [
      {
        id: `PKG-${student.id}-eng-unlinked`,
        packageName: student.packageName || 'Gói Tiếng Anh Level 4 (12 tháng)',
        totalSessions: student.totalSessions || 72,
        remainingSessions: student.remainingSessions ?? 28,
        price: (student.totalSessions || 72) * 200000,
        purchaseDate: student.enrollmentDate,
        endDate: '2026-12-20',
        status: 'active' as const,
        linkedClassCode: englishClasses[0]?.classCode || 'LD_TA_00019',
        linkedClassName: englishClasses[0]?.className || 'Lớp Tiếng Anh Standard B1',
        orderNo: 'OD812099',
        leaveQuota: 6,
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

    const totalSessions = student.totalSessions || pkgs.reduce((acc, p) => acc + p.totalSessions, 0)
    const remainingSessions = student.remainingSessions ?? pkgs.reduce((acc, p) => acc + p.remainingSessions, 0)
    const studiedSessions = Math.max(0, totalSessions - remainingSessions)

    const activeCls = englishClasses.find((c) => c.status === 'active') || null
    const droppedCls = englishClasses.find((c) => c.status === 'dropped' || c.status === 'pending_transfer') || null
    const pausedCls = englishClasses.find((c) => c.status === 'paused' || c.status === 'reserve') || null

    let programStatus: StudentProgram['programStatus'] = 'wait_for_assignment'
    if (student.status === 'reserve' || pausedCls) {
      programStatus = 'reserved'
    } else if (student.status === 'pending_transfer' || droppedCls) {
      programStatus = 'pending_transfer'
    } else if (student.status === 'fee_transfer') {
      programStatus = 'fee_transfer'
    } else if (student.status === 'draft_class') {
      programStatus = 'draft_class'
    } else if (student.status === 'pending_payment') {
      programStatus = 'pending_payment'
    } else if (student.status === 'enroll_later') {
      programStatus = 'enroll_later'
    } else if (student.status === 'awaiting_opening') {
      programStatus = 'awaiting_opening'
    } else if (student.status === 'trial') {
      programStatus = 'trial'
    } else if (student.status === 'session_ended' || remainingSessions === 0) {
      programStatus = 'session_ended'
    } else if (student.status === 'wait_for_assignment') {
      programStatus = 'wait_for_assignment'
    } else if (activeCls && (student.status === 'active' || !student.status)) {
      programStatus = 'active'
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
        totalSessions: 20, usedSessions: 12, attendanceRate: '91.7%', presentSessions: 11, excusedAbsences: 1, unexcusedAbsences: 0,
        homeworkRate: '90%', homeworkScore: 8.2, finalScore: 8.0, finalOutcome: 'Hoàn thành 12/20 buổi (Kết chuyển 8 buổi)',
        teacherFinalFeedback: 'Học viên tiến bộ tốt kỹ năng Nghe - Nói, phản xạ từ vựng tự nhiên, hoàn thành mục tiêu giai đoạn.',
        linkedPackageName: 'Gói IELTS Intensive 5.0 (Cũ)', finishReason: 'Chuyển lớp sang gói IELTS VIP',
      }
    ]

    englishPrograms.push({
      id: 'track-eng-1-6',
      name: 'Tiếng Anh - Lớp nhóm 1:6',
      subject: 'english',
      level: student.level || 'IELTS Junior',
      subLevel: student.subLevel || 'Band 5.0 – 5.5 (Pre-Intermediate)',
      schoolClass: student.schoolClass,
      branch: (activeCls || pausedCls)?.branch || student.branch || 'RinoEdu Nguyễn Tuân',
      entryScore: '6.0 / 9.0 (IELTS Mock)',
      entryScoreEvaluation: 'Đạt chuẩn đầu vào Lớp Foundation',
      assessmentNote: 'Kỹ năng Nghe và Phát âm chuẩn. Cần rèn luyện thêm Ngữ pháp viết Task 1.',
      csmName: 'Hoàng Yến (CSM Ngoại ngữ)',
      saleName: student.saleName || 'Đặng Quốc Anh (Sales Tiếng Anh)',
      availableSlots: [
        { id: `slot-${student.id}-e1`, dayOfWeek: 'Thứ 4 & Thứ 7', timeRange: '18:00 - 19:30', isPreferred: true, note: `Cơ sở ${student.branch || 'Nguyễn Tuân'}` },
        { id: `slot-${student.id}-e2`, dayOfWeek: 'Chủ Nhật', timeRange: '14:30 - 16:00', isPreferred: false, note: 'Lớp Speaking' },
      ],
      packages: pkgs,
      totalSessions,
      studiedSessions,
      remainingSessions,
      startDate: pkgs[0]?.purchaseDate || '2025-11-01',
      endDate: pkgs[pkgs.length - 1]?.endDate || '2026-10-30',
      currentClass: (activeCls || pausedCls) ? {
        ...(activeCls || pausedCls)!,
        assistantName: (activeCls || pausedCls)!.assistantName || 'Lê Thu Thảo',
        startSessionDate: (activeCls || pausedCls)!.startSessionDate || 'Buổi 01 (20/02/2026)',
      } : null,
      pastClasses: mockPast,
      programStatus,
      droppedClassInfo: droppedCls ? {
        className: droppedCls.className, classCode: droppedCls.classCode, droppedDate: '15/04/2026',
        studiedBeforeDrop: droppedCls.progress || '12 / 20 buổi', teacherName: droppedCls.teacherName, room: droppedCls.room,
        reason: 'Học viên chuyển gói học'
      } : undefined,
      transferInfo: droppedCls ? {
        sourceClass: droppedCls.classCode, targetClass: 'Chưa ghép lớp', transferredSessions: remainingSessions,
        transferDate: '15/04/2026', reason: 'Chuyển sang gói học IELTS VIP mới'
      } : undefined,
      reservedInfo: (programStatus === 'reserved' || pausedCls) ? {
        reservedSessions: remainingSessions, startDate: '01/06/2026', endDate: '31/07/2026', duration: '2 tháng',
        isHoldingClass: Boolean(pausedCls || (activeCls && student.status === 'reserve') || (student.enrolledClasses && student.enrolledClasses.length > 0)),
        expiryDate: '15/11/2026', reason: 'Bảo lưu theo nguyện vọng phụ huynh'
      } : undefined,
    })

    // 3. Parallel Track: English 1:1 Tutor Track (Minh chứng học song song 2 lộ trình)
    englishPrograms.push({
      id: 'track-eng-tutor',
      name: 'Tiếng Anh - Gia sư 1:1',
      subject: 'english',
      level: 'IELTS VIP 1:1',
      subLevel: '1 kèm 1 Cấp tốc',
      schoolClass: student.schoolClass,
      branch: student.branch || 'RinoEdu Nguyễn Tuân',
      entryScore: '6.5 / 9.0 (IELTS Mock)',
      entryScoreEvaluation: 'Mục tiêu nâng band cấp tốc trong 3 tháng',
      assessmentNote: 'Cần giáo viên 1:1 tập trung sửa phát âm và chấm bài viết Task 2 hàng tuần.',
      csmName: 'Hoàng Yến (CSM Ngoại ngữ)',
      saleName: student.saleName || 'Đặng Quốc Anh (Sales Tiếng Anh)',
      availableSlots: [
        { id: `slot-${student.id}-et1`, dayOfWeek: 'Chủ Nhật', timeRange: '08:30 - 10:00', isPreferred: true, note: 'Lịch học gia sư 1:1 cuối tuần' },
      ],
      packages: [
        {
          id: `PKG-${student.id}-eng-tutor-vip`, packageName: 'Gói Tiếng Anh Gia Sư 1:1 VIP (24 buổi)',
          totalSessions: 24, remainingSessions: 24, price: 9600000,
          purchaseDate: '2026-08-01', endDate: '2027-02-01', status: 'active' as const, orderNo: 'OD992015', leaveQuota: 3,
        }
      ],
      totalSessions: 24,
      studiedSessions: 0, remainingSessions: 24, startDate: '2026-08-01', endDate: '2027-02-01',
      currentClass: null, pastClasses: [], programStatus: 'wait_for_assignment',
    })
  }

  // Combine programs: If student is primarily English, put English first; otherwise Math first
  const programs = isStudentEnglish
    ? [...englishPrograms, ...mathPrograms]
    : [...mathPrograms, ...englishPrograms]

  // Fallback if no programs detected
  if (programs.length === 0) {
    const totalSessions = student.totalSessions || 24
    const remainingSessions = student.remainingSessions ?? 24
    const studiedSessions = Math.max(0, totalSessions - remainingSessions)

    let fallbackStatus: StudentProgram['programStatus'] = 'wait_for_assignment'
    if (student.status === 'reserve') fallbackStatus = 'reserved'
    else if (student.status === 'pending_transfer') fallbackStatus = 'pending_transfer'
    else if (student.status === 'fee_transfer') fallbackStatus = 'fee_transfer'
    else if (student.status === 'draft_class') fallbackStatus = 'draft_class'
    else if (student.status === 'pending_payment') fallbackStatus = 'pending_payment'
    else if (student.status === 'enroll_later') fallbackStatus = 'enroll_later'
    else if (student.status === 'awaiting_opening') fallbackStatus = 'awaiting_opening'
    else if (student.status === 'trial') fallbackStatus = 'trial'
    else if (student.status === 'session_ended' || remainingSessions === 0) fallbackStatus = 'session_ended'
    else if (allClasses[0]) fallbackStatus = 'active'

    programs.push({
      id: 'prog-standard',
      name: 'Chương trình Chuẩn',
      subject: (student.subject as 'math' | 'english' | 'stem' | 'other') || 'other',
      level: student.level || 'Chuẩn',
      subLevel: student.subLevel || 'A',
      packages: allPackages,
      totalSessions,
      studiedSessions,
      remainingSessions,
      startDate: student.enrollmentDate,
      endDate: '2026-12-31',
      currentClass: allClasses[0] || null,
      pastClasses: [],
      programStatus: fallbackStatus,
      reservedInfo: fallbackStatus === 'reserved' ? {
        reservedSessions: remainingSessions,
        startDate: '15/06/2026',
        endDate: '15/09/2026',
        duration: '3 tháng',
        isHoldingClass: Boolean(allClasses[0]),
        expiryDate: '15/10/2026',
        reason: 'Bảo lưu theo đơn xin nghỉ của phụ huynh'
      } : undefined,
    })
  }

  return programs
}

/**
 * Returns available schedule slots for a student (Khung giờ rảnh của học viên)
 */
export function getStudentAvailableSlots(student?: Student | null): StudentAvailableSlot[] {
  if (student?.id === 's2') {
    return [
      { id: 'slot-1', dayOfWeek: 'Thứ 2 & Thứ 4', timeRange: '18:00 - 19:30', note: 'Ưu tiên cơ sở Linh Đàm' },
      { id: 'slot-2', dayOfWeek: 'Thứ 7', timeRange: '09:00 - 10:30', note: 'Học buổi sáng' },
    ]
  }

  return [
    { id: 'slot-1', dayOfWeek: 'Thứ 3 & Thứ 6', timeRange: '17:30 - 19:00', note: 'Ưu tiên cơ sở Nguyễn Tuân' },
    { id: 'slot-2', dayOfWeek: 'Thứ 7', timeRange: '09:00 - 10:30', note: 'Khung giờ rảnh cố định' },
    { id: 'slot-3', dayOfWeek: 'Chủ Nhật', timeRange: 'Cả ngày (08:30 - 17:00)', note: 'Linh hoạt mọi khung giờ' },
  ]
}
