export interface ClassSession {
  id: string; classCode: string; className: string; subject: string; teacher: string;
  branch: string; schoolRoom: string; level: string; date: string; dateDisplay: string;
  dateBucket: 'past' | 'today' | 'upcoming'; timeLabel: string; endTimeLabel: string;
  scheduleLabel: string; status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  statusLabel: string; type: 'class_session' | 'supplementary' | 'workshop' | 'planned';
  typeLabel: string; title: string; lessonSubtitle: string;
  totalStudents: number; officialStudents: number; trialStudents: number
}

export interface EventSession {
  id: string; title: string; description: string; date: string; dateDisplay: string;
  dateBucket: 'past' | 'today' | 'upcoming'; timeLabel: string; endTimeLabel: string;
  branch: string; organizer: string;
  type: 'event' | 'placement_test' | 'workshop' | 'consultation';
  typeLabel: string; status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  statusLabel: string; participants: number; maxParticipants: number; location: string; note: string
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
  return CLASSES.flatMap(cls => {
    const days = parseWeekdays(cls.schedule)
    const lesson = PICK(LESSONS[cls.subject] || LESSONS['Tiếng Anh'], HASH(cls.id))
    const type = HASH(cls.id) % 4 === 0 ? 'supplementary' : 'class_session'
    return Array.from({ length: 28 }, (_, i) => {
      const d = addDays(today, i - 14)
      if (!days.includes(d.getDay())) return null
      const seed = HASH(cls.id + i)
      const isToday = d.getTime() === today.getTime()
      const bucket = (isToday ? 'today' : d < today ? 'past' : 'upcoming') as 'past' | 'today' | 'upcoming'
      const sts = bucket === 'today' ? 'confirmed' : bucket === 'past' ? 'completed' : seed % 3 === 0 ? 'pending' : 'confirmed'
      const [sh, sm] = cls.time.split('-')[0].split(':').map(Number)
      const [eh, em] = cls.time.split('-')[1].split(':').map(Number)
      return {
        id: `CLS-${cls.id}-${toDateKey(d)}`, classCode: cls.id, className: cls.name,
        subject: cls.subject, teacher: PICK(['Thu Hà', 'Mỹ Linh', 'Coenrad Redman'], seed),
        branch: PICK(BRANCHES, seed), schoolRoom: PICK(['Phòng 1', 'Phòng 2', 'Phòng 3'], seed),
        level: PICK(['Kindie 1', 'Level 2', 'Columbus 4'], seed),
        date: toDateKey(d), dateDisplay: `${PAD(d.getDate())}/${PAD(d.getMonth() + 1)}/${d.getFullYear()}`,
        dateBucket: bucket, timeLabel: `${PAD(sh)}:${PAD(sm)}`, endTimeLabel: `${PAD(eh)}:${PAD(em)}`,
        scheduleLabel: cls.schedule, status: sts, statusLabel: sts === 'confirmed' ? 'Đã xác nhận' : sts === 'pending' ? 'Chờ xác nhận' : 'Hoàn thành',
        type, typeLabel: type === 'class_session' ? 'Chính thức' : 'Bổ trợ',
        title: lesson.title, lessonSubtitle: lesson.subtitle,
        totalStudents: 12 + (seed % 8), officialStudents: 8 + (seed % 5), trialStudents: 2 + (seed % 3),
      }
    }).filter(Boolean) as ClassSession[]
  }).sort((a, b) => `${a.date}T${a.timeLabel}`.localeCompare(`${b.date}T${b.timeLabel}`))
}

export function getMockEventSessions(): EventSession[] {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return EVENT_NAMES.map((name, idx) => {
    const offset = (idx % 5) - 2 + Math.floor(idx / 5) * 3
    const d = addDays(today, offset)
    const seed = HASH(name)
    const isToday = d.getTime() === today.getTime()
    const bucket = (isToday ? 'today' : d < today ? 'past' : 'upcoming') as 'past' | 'today' | 'upcoming'
    const type = EVENT_TYPES[idx % EVENT_TYPES.length]
    const sts = (bucket === 'today' ? 'confirmed' : bucket === 'past' ? 'completed' : idx % 4 === 0 ? 'pending' : 'confirmed') as 'confirmed' | 'pending' | 'cancelled' | 'completed'
    const maxP = 30 + (seed % 40)
    const participants = bucket === 'past' ? Math.min(maxP, 15 + (seed % 30)) : bucket === 'today' ? maxP - 2 : Math.min(maxP, 5 + (seed % 20))
    const sh = 9 + (idx % 4), eh = 11 + (idx % 4)
    return {
      id: `EVT-${String(idx + 1).padStart(3, '0')}`, title: name,
      description: `Sự kiện dành cho phụ huynh và học viên`,
      date: toDateKey(d), dateDisplay: `${PAD(d.getDate())}/${PAD(d.getMonth() + 1)}/${d.getFullYear()}`,
      dateBucket: bucket, timeLabel: `${PAD(sh)}:00`, endTimeLabel: `${PAD(eh)}:30`,
      branch: PICK(BRANCHES, idx), organizer: PICK(['Phòng Đào tạo', 'Phòng Tuyển sinh', 'Phòng Marketing'], idx),
      type, typeLabel: type === 'event' ? 'Sự kiện' : 'Test',
      status: sts, statusLabel: sts === 'confirmed' ? 'Đã xác nhận' : sts === 'pending' ? 'Chờ xác nhận' : 'Hoàn thành',
      participants, maxParticipants: maxP,
      location: `${PICK(BRANCHES, idx)} - Hội trường`,
      note: bucket === 'upcoming' ? `Đã mở đăng ký, hiện có ${participants}/${maxP} người.` : bucket === 'today' ? 'Sắp diễn ra.' : `Đã diễn ra với ${participants} người.`,
    }
  }).sort((a, b) => `${a.date}T${a.timeLabel}`.localeCompare(`${b.date}T${b.timeLabel}`))
}

