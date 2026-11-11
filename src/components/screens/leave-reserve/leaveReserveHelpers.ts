import type { LeaveReserveRequest } from '@/mocks/leaveReserve'
import type { Student, EnrolledClass } from '@/mocks/students'
import type { StudentClassSession, StudentEnrolledClassTree } from './leaveReserveTypes'

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

const VIETNAMESE_DAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const DAY_ALIAS_MAP: Record<string, number> = {
  'chủ nhật': 0, 'cn': 0,
  'thứ hai': 1, 'thứ 2': 1, 't2': 1,
  'thứ ba': 2, 'thứ 3': 2, 't3': 2,
  'thứ tư': 3, 'thứ 4': 3, 't4': 3,
  'thứ năm': 4, 'thứ 5': 4, 't5': 4,
  'thứ sáu': 5, 'thứ 6': 5, 't6': 5,
  'thứ bảy': 6, 'thứ 7': 6, 't7': 6,
}

export function getStudentLeaveQuotaStats(
  student?: Student,
  existingRequests: LeaveReserveRequest[] = [],
  targetClassCode?: string
) {
  if (!student) {
    return { pendingCount: 0, approvedCount: 0, totalQuota: 12, remainingQuota: 12 }
  }
  let studentRequests = existingRequests.filter(
    (r) => (r.studentId && r.studentId === student.id) || (r.studentName && r.studentName === student.name)
  )
  if (targetClassCode && targetClassCode !== 'all') {
    studentRequests = studentRequests.filter((r) => !r.classCode || r.classCode === targetClassCode)
  }
  const offRequests = studentRequests.filter((r) => r.type === 'off')
  const pendingCount = offRequests.filter((r) => r.status === 'pending').length
  const approvedCount = offRequests.filter((r) => r.status === 'approved').length
  const totalQuota = 12
  const remainingQuota = Math.max(0, totalQuota - approvedCount)

  return {
    pendingCount,
    approvedCount,
    totalQuota,
    remainingQuota,
  }
}

const LESSON_TOPICS_CATALOG = {
  math: [
    {
      topic: 'Chuyên đề 1: Tư duy logic & Quy luật hình khối',
      words: 'Pattern, Sequence, Geometry',
      sentences: 'Phát hiện quy luật dãy số và hình học trực quan.',
      phonics: 'Thực hành tư duy logic 5 cấp độ',
    },
    {
      topic: 'Chuyên đề 2: Tính nhanh & Ứng dụng thực tế',
      words: 'Mental Math, Addition, Subtraction',
      sentences: 'Áp dụng phương pháp tính nhanh qua sơ đồ tư duy.',
      phonics: 'Thử thách phản xạ toán học',
    },
    {
      topic: 'Chuyên đề 3: Bài toán lời văn & Phương pháp mô hình',
      words: 'Word Problems, Bar Model, Deduction',
      sentences: 'Phân tích dữ kiện bài toán có lời văn và mô hình hóa.',
      phonics: 'Rèn luyện khả năng lập luận đa chiều',
    },
    {
      topic: 'Chuyên đề 4: Số học tư duy & Đo lường thực tế',
      words: 'Measurement, Multiples, Prime Logic',
      sentences: 'Ứng dụng đo lường và tính chu vi, diện tích hình học.',
      phonics: 'Dự án toán học thực tiễn & thuyết trình giải pháp',
    },
  ],
  english: [
    {
      topic: 'Unit 1: Hello & Colors',
      words: 'Red, Blue, Green, Yellow, Orange',
      sentences: 'Hello, what is your name? - My name is...',
      phonics: 'Letter /a/ as in Apple, Ant',
    },
    {
      topic: 'Unit 2: Family & Feelings',
      words: 'Mom, Dad, Brother, Sister, Happy, Sad',
      sentences: 'This is my mom. I am happy.',
      phonics: 'Letter /b/ as in Ball, Boy',
    },
    {
      topic: 'Unit 3: School & Animals',
      words: 'Dog, Cat, Bird, Book, Pencil, Desk',
      sentences: 'I have a red book. Look at the cat.',
      phonics: 'Letter /c/ as in Cat, Cup',
    },
    {
      topic: 'Unit 4: Numbers & Shapes',
      words: 'One, Two, Three, Circle, Square',
      sentences: 'How many circles? - Three circles.',
      phonics: 'Letter /d/ as in Duck, Dog',
    },
  ],
}

export function generateStudentClassTree(
  student: Student,
  existingRequests: LeaveReserveRequest[] = [],
  sessionsPerClass = 4,
  targetClassCode?: string,
  targetClassName?: string
): StudentEnrolledClassTree[] {
  let classes: EnrolledClass[] =
    student.enrolledClasses && student.enrolledClasses.length > 0
      ? student.enrolledClasses
      : [
          {
            classCode: 'CLS-GEN-01',
            className: student.enrolledClass || 'Lớp cơ bản A1',
            type: 'offline',
            scheduleSlots: [
              { dayOfWeek: 'Thứ 4', date: '01/01', startTime: '18:00', endTime: '19:30' },
            ],
            teacherName: 'Giáo viên phụ trách',
            status: 'active',
            progress: '10/24',
            branch: student.branch,
            room: 'Phòng 201',
          },
        ]

  if (targetClassCode && targetClassCode !== 'all') {
    const found = classes.find((c) => c.classCode === targetClassCode)
    if (found) {
      classes = [found]
    } else {
      classes = [
        {
          classCode: targetClassCode,
          className: targetClassName || student.enrolledClass || 'Lớp học hiện tại',
          type: 'tutor',
          scheduleSlots: [
            { dayOfWeek: 'Thứ 3', date: '18/08', startTime: '17:30', endTime: '19:30' },
            { dayOfWeek: 'Thứ 6', date: '21/08', startTime: '17:30', endTime: '19:30' },
          ],
          teacherName: 'GV_HuiLT20',
          status: 'active',
          progress: '10/24',
          branch: student.branch,
          room: 'B202',
        },
      ]
    }
  }

  const studentRequests = existingRequests.filter(
    (r) => (r.studentId && r.studentId === student.id) || (r.studentName && r.studentName === student.name)
  )

  const tree: StudentEnrolledClassTree[] = []

  classes.forEach((cls) => {
    const isOmo = Boolean(
      cls.programName?.toLowerCase().includes('omo') ||
      cls.className.toLowerCase().includes('omo') ||
      student.notes?.toLowerCase().includes('omo')
    )

    const slots =
      cls.scheduleSlots && cls.scheduleSlots.length > 0
        ? cls.scheduleSlots
        : [{ dayOfWeek: 'Thứ 4', date: '11/11', startTime: '18:00', endTime: '19:30' }]

    const scheduleText = slots.map((s) => `${s.dayOfWeek} (${s.startTime} - ${s.endTime})`).join(', ')

    // Parse target days of week from schedule slots
    const targetDayIndices = slots.map((s) => {
      const clean = (s.dayOfWeek || '').toLowerCase().trim()
      return DAY_ALIAS_MAP[clean] !== undefined ? DAY_ALIAS_MAP[clean] : 3
    })

    const sessions: StudentClassSession[] = []
    const baseDate = new Date()
    let searchDate = new Date(baseDate)

    // Generate upcoming dates matching class schedule
    while (sessions.length < sessionsPerClass) {
      searchDate = addDays(searchDate, 1)
      const dayIdx = searchDate.getDay()
      const slotIndex = targetDayIndices.indexOf(dayIdx)

      if (slotIndex !== -1) {
        const slot = slots[slotIndex] || slots[0]
        const dateIso = formatDateISO(searchDate)
        const dayName = VIETNAMESE_DAYS[dayIdx]
        const dd = String(searchDate.getDate()).padStart(2, '0')
        const mm = String(searchDate.getMonth() + 1).padStart(2, '0')
        const yyyy = searchDate.getFullYear()
        const formattedDate = `${dayName}, ${dd}/${mm}/${yyyy}`

        const sessIdx = sessions.length + 1
        const lowerName = cls.className.toLowerCase()
        const isMath = lowerName.includes('toán') || lowerName.includes('math') || cls.classCode.toLowerCase().includes('toan')
        const catalog = isMath ? LESSON_TOPICS_CATALOG.math : LESSON_TOPICS_CATALOG.english
        const topicItem = catalog[(sessIdx - 1) % catalog.length]
        const topic = cls.nextLessonName || topicItem.topic

        // Program name for session label
        let progLabel = cls.programName || (isMath ? 'Toán tư duy' : 'Tiếng Anh SuperKids')
        if (progLabel.length > 25) {
          progLabel = isMath ? 'Toán tư duy 1:6' : 'Tiếng Anh SuperKids 1:6'
        }
        const sessionName = `Buổi ${sessIdx} (${progLabel.startsWith('Chương trình') ? progLabel : `Chương trình ${progLabel}`})`

        // Check if this date already has an active request for this class
        const matchedReq = studentRequests.find(
          (r) =>
            r.type === 'off' &&
            (!r.classCode || r.classCode === cls.classCode) &&
            (r.startDate === dateIso || (r.startDate <= dateIso && r.endDate >= dateIso))
        )

        sessions.push({
          id: `SESS-${cls.classCode}-${dateIso}`,
          classCode: cls.classCode,
          className: cls.className,
          sessionIndex: sessIdx,
          sessionName,
          date: dateIso,
          formattedDate,
          dayOfWeek: dayName,
          time: slot ? `${slot.startTime} - ${slot.endTime}` : '19:30 - 21:30',
          teacherName: cls.teacherName || (isMath ? 'GV_HuiLT20' : 'GV Sarah Smith'),
          room: cls.room || 'Phòng học chính',
          topic,
          lessonContent: {
            words: topicItem.words,
            sentences: topicItem.sentences,
            phonics: topicItem.phonics,
          },
          alreadyRequested: Boolean(matchedReq),
          existingRequestCode: matchedReq?.id,
          existingRequestStatus: matchedReq?.status,
        })
      }
    }

    const lowerName = cls.className.toLowerCase()
    const isMath = lowerName.includes('toán') || lowerName.includes('math') || cls.classCode.toLowerCase().includes('toan')

    tree.push({
      classCode: cls.classCode,
      className: cls.className,
      type: cls.level || (isMath ? 'Toán 1:6' : 'SuperKids 1:6'),
      scheduleText,
      teacherName: cls.teacherName || (isMath ? 'GV_HuiLT20' : 'GV Sarah Smith'),
      room: cls.room,
      progress: cls.progress || (isMath ? '84/96 buổi' : '24/48 buổi'),
      enrolledStudents: 10,
      maxStudents: 15,
      isOmo,
      packageName: cls.linkedPackageName || (isMath ? '[MATH_TUTOR] Toán Tư Duy Toán 1:6_96 buổi' : '[IE_MOVERS] Tiếng Anh SuperKids 1:6_48 buổi'),
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
      remainingSessions: cls.remainingSessions ?? (isMath ? 12 : 24),
      totalSessions: cls.totalSessions ?? (isMath ? 96 : 48),
      sessions,
    })
  })

  return tree
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
