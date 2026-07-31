import { mockBookingTests } from './bookingTests'

export interface ClassSession {
  id: string; classCode: string; className: string; subject: string; teacher: string;
  branch: string; schoolRoom: string; level: string; date: string; dateDisplay: string;
  dateBucket: 'past' | 'today' | 'upcoming'; timeLabel: string; endTimeLabel: string;
  statusLabel: string; type: 'class_session' | 'supplementary' | 'workshop' | 'planned';
  typeLabel: string; title: string; lessonSubtitle: string;
  totalStudents: number; officialStudents: number; trialStudents: number;
  attendedStudents?: number; isRecurring?: boolean;
  substituteTeacher?: string;
  assistantTeacher?: string;
  assistantSubstitute?: string;
  status?: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'rescheduled';
  isOpeningDay?: boolean;
  ratingAverage?: number;
  ratingCount?: number;
  homeworkSubmitted?: number;
}

export interface EventSession {
  id: string; title: string; description: string; date: string; dateDisplay: string;
  dateBucket: 'past' | 'today' | 'upcoming'; timeLabel: string; endTimeLabel: string;
  branch: string; organizer: string;
  type: 'event' | 'placement_test' | 'workshop' | 'consultation';
  typeLabel: string; status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  statusLabel: string; participants: number; maxParticipants: number; location: string; note: string;
  isRecurring?: boolean;
  subject?: string;
}

// NOTE: Tailwind class strings for these `type` values live in
// `src/lib/statusColors.ts` (entries: class_session, supplementary, workshop,
// planned, event, placement_test). Screens resolve colors via
// `getStatusBadgeClass(slot.type)` — do NOT re-introduce a color map here.

const BRANCHES = ['RinoEdu Linh Đàm', 'RinoEdu Nguyễn Tuân', 'RinoEdu Smart City']
const PICK = <T,>(a: T[], s: number) => a[Math.abs(s) % a.length]
const PAD = (n: number) => String(n).padStart(2, '0')
const HASH = (v: string) => v.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0)
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }
const toDateKey = (d: Date) => `${d.getFullYear()}-${PAD(d.getMonth() + 1)}-${PAD(d.getDate())}`

const CLASSES = [
  { id: 'SA1_TA_001', name: 'Tiếng Anh SA1 Level 2', subject: 'Tiếng Anh', schedule: 'T2,T5', time: '17:45-19:15' },
  { id: 'AK_TA_012', name: 'Tiếng Anh AK Kindie 1', subject: 'Tiếng Anh', schedule: 'T2,T4', time: '17:30-19:30' },
  { id: 'SA1_KD_000', name: 'Kindie SA1 Pre-K', subject: 'Tiếng Anh', schedule: 'T3,T6', time: '17:45-19:15' },
  { id: 'AK_TOAN_017', name: 'Toán tư duy AK Columbus 4', subject: 'Toán tư duy', schedule: 'T3,T7', time: '19:40-21:10' },
  { id: 'AK_TOAN_016', name: 'Toán tư duy AK Archimedes 7', subject: 'Toán tư duy', schedule: 'T6', time: '19:15-21:15' },
  { id: 'SA1_TA_T03', name: 'Tiếng Anh Trial Level 2', subject: 'Tiếng Anh', schedule: 'T4', time: '15:30-17:30' },
  { id: 'SA2_TA_014', name: 'Tiếng Anh SA2 Level 3', subject: 'Tiếng Anh', schedule: 'T3,T6', time: '17:45-19:15' },
  { id: 'AK_TOAN_021', name: 'Toán tư duy AK Archimedes 5', subject: 'Toán tư duy', schedule: 'T6', time: '19:15-21:15' },
  { id: 'STEM_ROBO_003', name: 'STEM Robotics S1', subject: 'STEM Robotics', schedule: 'T4', time: '15:30-17:30' },
]

const LESSONS: Record<string, { title: string; subtitle: string }[]> = {
  'Tiếng Anh': [
    { title: 'Khởi động Station: Màu sắc và hình khối', subtitle: 'Làm quen mẫu câu hỏi đáp' },
    { title: 'Story time: My Family Adventure', subtitle: 'Đọc tranh theo nhóm' },
    { title: 'Phonics lab: Nguyên âm ngắn', subtitle: 'Luyện âm ngắn qua trò chơi' },
  ],
  'Toán tư duy': [
    { title: 'Level 307 - Bài 2: Trò chơi cờ bàn', subtitle: 'Khám phá luật chơi' },
    { title: 'C2 - Bài 2: Toto và 100 hạt sỏi', subtitle: 'Ôn đếm theo nhóm' },
  ],
  'STEM Robotics': [
    { title: 'Robot line follower: Cân chỉnh cảm biến', subtitle: 'Lắp ráp và thử đường chạy' },
    { title: 'STEM Coding: Vòng lặp và điều kiện', subtitle: 'Lập trình nhiệm vụ theo nhóm' },
  ],
}

const EVENT_NAMES = [
  'Hội thảo IELTS 7.0+', 'Hội thảo Kỹ năng mềm', 'Open Day - Trải nghiệm lớp học',
  'Test đầu vào miễn phí', 'Festival Tiếng Anh', 'Lễ tổng kết khóa học',
]
const EVENT_TYPES = ['event', 'event', 'placement_test', 'event', 'event', 'placement_test'] as const

const WEEKDAY_MAP: Record<string, number> = { CN: 0, T2: 1, T3: 2, T4: 3, T5: 4, T6: 5, T7: 6 }
const parseWeekdays = (s: string) => s.split(',').map(t => WEEKDAY_MAP[t.trim().toUpperCase()]).filter(Boolean)

export function getMockClassSessions(): ClassSession[] {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const generated = CLASSES.flatMap(cls => {
    const days = parseWeekdays(cls.schedule)
    const lesson = PICK(LESSONS[cls.subject] || LESSONS['Tiếng Anh'], HASH(cls.id))
    const type = HASH(cls.id) % 4 === 0 ? 'supplementary' : 'class_session'
    return Array.from({ length: 28 }, (_, i) => {
      const d = addDays(today, i - 14)
      if (!days.includes(d.getDay())) return null
      const seed = HASH(cls.id + i)
      const isToday = d.getTime() === today.getTime()
      const bucket = (isToday ? 'today' : d < today ? 'past' : 'upcoming') as 'past' | 'today' | 'upcoming'
      let sts = bucket === 'today' ? 'confirmed' : bucket === 'past' ? 'completed' : seed % 3 === 0 ? 'pending' : 'confirmed'
      
      // Inject some cancelled statuses
      if (seed % 11 === 0 && bucket === 'upcoming') sts = 'cancelled'
      if (seed % 15 === 0 && bucket === 'past') sts = 'cancelled'
      
      const [sh, sm] = cls.time.split('-')[0].split(':').map(Number)
      const [eh, em] = cls.time.split('-')[1].split(':').map(Number)
      
      const totalStudents = 12 + (seed % 8)
      const isTrialClass = cls.name.toLowerCase().includes('trial') || cls.name.toLowerCase().includes('học thử')
      const trialStudents = isTrialClass 
        ? 2 + (seed % 2) 
        : (seed % 3 === 0 ? 0 : seed % 3)
      const attendedStudents = bucket === 'past' && sts !== 'cancelled' ? totalStudents - (seed % 3) : undefined
      const statusLabelMap: Record<string, string> = {
        confirmed: 'Đã xác nhận',
        pending: 'Chờ xác nhận',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy',
        rescheduled: 'Đổi ngày',
      }
      
      const teacher = PICK(['Thu Hà', 'Mỹ Linh', 'Coenrad Redman'], seed)
      const substituteTeacher = (seed % 7 === 0 && sts !== 'cancelled') ? PICK(['Hương Ly', 'Thanh Bình', 'David John'], seed) : undefined
      const assistantTeacher = PICK(['Hoàng Nam', 'Lan Anh', 'Minh Trang', 'Đức Anh'], seed + 3)
      const assistantSubstitute = (seed % 9 === 0 && sts !== 'cancelled') ? PICK(['Phương Thảo', 'Gia Huy'], seed + 5) : undefined

      // Guaranteed opening day and substitute teacher in active week
      const getMon = (input: Date) => {
        const date = new Date(input)
        const day = date.getDay()
        date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
        date.setHours(0, 0, 0, 0)
        return date
      }
      const curMonday = getMon(today)
      const wedKey = toDateKey(addDays(curMonday, 2))
      const thuKey = toDateKey(addDays(curMonday, 3))

      const isOpening = (toDateKey(d) === wedKey && cls.id === 'AK_TA_012') || (cls.id === 'SA1_TA_001' && d.getDay() === days[0] && i > 14 && i <= 21)
      const subTeacher = (toDateKey(d) === thuKey && cls.id === 'SA1_TA_001')
        ? 'Thanh Bình'
        : substituteTeacher

      const ratingCount = bucket === 'upcoming' || sts === 'cancelled' ? 0 : Math.max(0, totalStudents - (seed % 4))
      const ratingAverage = ratingCount > 0 ? Number((4.5 + ((seed % 6) * 0.1)).toFixed(1)) : undefined
      const homeworkSubmitted = bucket === 'upcoming' || sts === 'cancelled' ? 0 : Math.max(0, totalStudents - (seed % 5))

      return {
        id: `CLS-${cls.id}-${toDateKey(d)}`, classCode: cls.id, className: cls.name,
        subject: cls.subject, teacher,
        branch: PICK(BRANCHES, seed), schoolRoom: PICK(['Phòng 1', 'Phòng 2', 'Phòng 3'], seed),
        level: PICK(['Kindie 1', 'Level 2', 'Columbus 4'], seed),
        date: toDateKey(d), dateDisplay: `${PAD(d.getDate())}/${PAD(d.getMonth() + 1)}/${d.getFullYear()}`,
        dateBucket: bucket, timeLabel: `${PAD(sh)}:${PAD(sm)}`, endTimeLabel: `${PAD(eh)}:${PAD(em)}`,
        scheduleLabel: cls.schedule, status: sts as ClassSession['status'], statusLabel: statusLabelMap[sts],
        type, typeLabel: type === 'class_session' ? 'Chính thức' : 'Bổ trợ',
        title: lesson.title, lessonSubtitle: lesson.subtitle,
        totalStudents, officialStudents: 8 + (seed % 5), trialStudents,
        attendedStudents, isRecurring: true, substituteTeacher: subTeacher,
        assistantTeacher, assistantSubstitute,
        isOpeningDay: isOpening || undefined,
        ratingAverage,
        ratingCount,
        homeworkSubmitted,
      }
    }).filter(Boolean) as ClassSession[]
  })

  return generated.sort((a, b) => `${a.date}T${a.timeLabel}`.localeCompare(`${b.date}T${b.timeLabel}`))
}

export function getMockEventSessions(): EventSession[] {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  
  // 1. Generate standard events (filtering out default 'placement_test' to let them be driven by booking tests)
  const standardEvents = EVENT_NAMES.map((name, idx) => {
    const offset = (idx % 5) - 2 + Math.floor(idx / 5) * 3
    const d = addDays(today, offset)
    const seed = HASH(name)
    const isToday = d.getTime() === today.getTime()
    const bucket = (isToday ? 'today' : d < today ? 'past' : 'upcoming') as 'past' | 'today' | 'upcoming'
    const type = EVENT_TYPES[idx % EVENT_TYPES.length]
    
    let sts: 'scheduled' | 'completed' | 'cancelled' = 'scheduled'
    if (bucket === 'past') {
      sts = idx % 5 === 0 ? 'cancelled' : 'completed'
    } else {
      sts = idx % 6 === 0 ? 'cancelled' : 'scheduled'
    }

    const maxP = 30 + (seed % 40)
    const participants = sts === 'completed' ? Math.min(maxP, 15 + (seed % 30)) : sts === 'cancelled' ? 0 : Math.min(maxP, 5 + (seed % 20))
    
    const sh = 9 + (idx % 4), eh = 11 + (idx % 4)
    let subject = 'Tiếng Anh'
    if (name.includes('Toán') || name.includes('Archimedes') || name.includes('Columbus')) {
      subject = 'Toán tư duy'
    } else if (name.includes('STEM') || name.includes('Robo')) {
      subject = 'STEM Robotics'
    } else if (name.includes('Kỹ năng')) {
      subject = 'Kỹ năng sống'
    }
    return {
      id: `EVT-${String(idx + 1).padStart(3, '0')}`, title: name,
      description: `Sự kiện dành cho phụ huynh và học viên`,
      date: toDateKey(d), dateDisplay: `${PAD(d.getDate())}/${PAD(d.getMonth() + 1)}/${d.getFullYear()}`,
      dateBucket: bucket, timeLabel: `${PAD(sh)}:00`, endTimeLabel: `${PAD(eh)}:30`,
      branch: PICK(BRANCHES, idx), organizer: PICK(['Phòng Đào tạo', 'Phòng Tuyển sinh', 'Phòng Marketing'], idx),
      type, typeLabel: type === 'event' ? 'Sự kiện' : 'Trải nghiệm',
      status: sts, statusLabel: sts === 'scheduled' ? 'Đã lên lịch' : sts === 'completed' ? 'Hoàn thành' : 'Hủy',
      participants, maxParticipants: maxP,
      location: `${PICK(BRANCHES, idx)} - Hội trường`,
      note: bucket === 'upcoming' ? `Đã mở đăng ký, hiện có ${participants}/${maxP} người.` : bucket === 'today' ? 'Sắp diễn ra.' : `Đã diễn ra với ${participants} người.`,
      isRecurring: idx % 3 === 0,
      subject,
    }
  }).filter(evt => evt.type !== 'placement_test')

  // 2. Map all 20 booking tests into EventSession items
  const bookingEvents: EventSession[] = mockBookingTests.map((booking) => {
    // booking.testTime is in "YYYY-MM-DD HH:mm" format
    const [dateStr, timeStr] = booking.testTime.split(' ')
    const [h, m] = timeStr.split(':').map(Number)
    
    // Snap/calculate start time to 30-minute boundary (e.g. 10:15 -> 10:00, 10:45 -> 10:30)
    const slotM = m < 30 ? 0 : 30
    const startTimeStr = `${String(h).padStart(2, '0')}:${String(slotM).padStart(2, '0')}`

    // End time is exactly 30 minutes later
    const endMinutes = h * 60 + slotM + 30
    const endH = Math.floor(endMinutes / 60)
    const endM = endMinutes % 60
    const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`

    const sessionDate = new Date(dateStr)
    sessionDate.setHours(0, 0, 0, 0)
    
    const isToday = sessionDate.getTime() === today.getTime()
    const bucket = (isToday ? 'today' : sessionDate < today ? 'past' : 'upcoming') as 'past' | 'today' | 'upcoming'

    let status: EventSession['status'] = 'scheduled'
    if (booking.status === 'completed' || booking.status === 'failed') {
      status = 'completed'
    } else if (booking.status === 'cancelled') {
      status = 'cancelled'
    } else {
      status = 'scheduled'
    }
    const statusLabel = status === 'scheduled' ? 'Đã lên lịch' : status === 'completed' ? 'Hoàn thành' : 'Hủy'

    const dateDisplayParts = dateStr.split('-')
    const dateDisplay = `${dateDisplayParts[2]}/${dateDisplayParts[1]}/${dateDisplayParts[0]}`

    const subjectLabel = booking.subject === 'english' ? 'Tiếng Anh' : 'Toán tư duy'

    return {
      id: `EVT-${booking.id}`,
      title: `Lịch trải nghiệm ${subjectLabel} - ${booking.childName}`,
      description: `Buổi đánh giá năng lực đầu vào và học thử dành cho ${booking.childName}.`,
      date: dateStr,
      dateDisplay,
      dateBucket: bucket,
      timeLabel: startTimeStr,
      endTimeLabel: endTimeStr,
      branch: booking.school,
      organizer: 'Phòng Tuyển sinh',
      type: 'placement_test' as const,
      typeLabel: 'Trải nghiệm',
      status,
      statusLabel,
      participants: status === 'completed' ? 1 : 0,
      maxParticipants: 1,
      location: `${booking.school} - ${booking.room}`,
      note: booking.msg || 'Chờ học viên.',
      isRecurring: false,
      subject: subjectLabel
    }
  })

  // Thêm dữ liệu mẫu cho lịch trải nghiệm hủy lịch và lịch trải nghiệm đã qua
  const customEvents: EventSession[] = [
    {
      id: 'EVT-CUSTOM-001',
      title: 'Lịch trải nghiệm học thử Tiếng Anh - Nguyễn Minh Anh',
      description: 'Lớp học trải nghiệm Tiếng Anh giao tiếp cùng giáo viên bản ngữ.',
      date: toDateKey(addDays(today, 1)), // Ngày mai
      dateDisplay: `${PAD(addDays(today, 1).getDate())}/${PAD(addDays(today, 1).getMonth() + 1)}/${addDays(today, 1).getFullYear()}`,
      dateBucket: 'upcoming',
      timeLabel: '14:30',
      endTimeLabel: '15:00',
      branch: 'RinoEdu Linh Đàm',
      organizer: 'Phòng Đào tạo',
      type: 'placement_test',
      typeLabel: 'Trải nghiệm',
      status: 'cancelled',
      statusLabel: 'Hủy',
      participants: 0,
      maxParticipants: 1,
      location: 'RinoEdu Linh Đàm - Phòng 101',
      note: 'Phụ huynh xin hủy lịch do học sinh bị ốm. Hẹn xếp lịch lại sau.',
      isRecurring: false,
      subject: 'Tiếng Anh',
    },
    {
      id: 'EVT-CUSTOM-002',
      title: 'Đánh giá năng lực & Trải nghiệm lớp học - Trần Đức Nam',
      description: 'Bài kiểm tra năng lực đầu vào và học thử lớp Toán tư duy.',
      date: toDateKey(addDays(today, -1)), // Ngày hôm qua
      dateDisplay: `${PAD(addDays(today, -1).getDate())}/${PAD(addDays(today, -1).getMonth() + 1)}/${addDays(today, -1).getFullYear()}`,
      dateBucket: 'past',
      timeLabel: '09:00',
      endTimeLabel: '09:30',
      branch: 'RinoEdu Nguyễn Tuân',
      organizer: 'Phòng Tuyển sinh',
      type: 'placement_test',
      typeLabel: 'Trải nghiệm',
      status: 'completed',
      statusLabel: 'Hoàn thành',
      participants: 1,
      maxParticipants: 1,
      location: 'RinoEdu Nguyễn Tuân - Phòng 204',
      note: 'Đã hoàn thành trải nghiệm. Đánh giá tốt, phụ huynh chuẩn bị làm thủ tục nhập học.',
      isRecurring: false,
      subject: 'Tiếng Anh',
    },
    {
      id: 'EVT-CUSTOM-003',
      title: 'Trải nghiệm Toán tư duy Archimedes - Phạm Gia Bảo',
      description: 'Lớp học thử Toán tư duy khơi dậy tiềm năng toán học.',
      date: toDateKey(addDays(today, -2)), // 2 ngày trước
      dateDisplay: `${PAD(addDays(today, -2).getDate())}/${PAD(addDays(today, -2).getMonth() + 1)}/${addDays(today, -2).getFullYear()}`,
      dateBucket: 'past',
      timeLabel: '18:00',
      endTimeLabel: '18:30',
      branch: 'RinoEdu Smart City',
      organizer: 'Phòng Marketing',
      type: 'placement_test',
      typeLabel: 'Trải nghiệm',
      status: 'cancelled',
      statusLabel: 'Hủy',
      participants: 0,
      maxParticipants: 1,
      location: 'RinoEdu Smart City - Phòng Trải nghiệm',
      note: 'Học viên không đến trải nghiệm và không liên lạc được.',
      isRecurring: false,
      subject: 'Toán tư duy',
    }
  ]

  return [...standardEvents, ...bookingEvents, ...customEvents].sort((a, b) => `${a.date}T${a.timeLabel}`.localeCompare(`${b.date}T${b.timeLabel}`))
}
