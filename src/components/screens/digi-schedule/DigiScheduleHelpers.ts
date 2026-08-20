import type {
  DigiStudentBooking,
  DigiScheduleFilterState,
  ClassSession,
} from './DigiScheduleTypes'

export const DIGI_TIMELINE_SLOTS = [
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
] as const

export const DIGI_ASSISTANTS = [
  'Nguyễn Thu Hà',
  'Trần Minh Châu',
  'Lê Hoàng Nam',
  'Phạm Minh Trang',
  'Vũ Hải Đăng',
]

export const getMonday = (input: Date): Date => {
  const date = new Date(input)
  const day = date.getDay()
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  date.setHours(0, 0, 0, 0)
  return date
}

export const getWeekDays = (from: Date): Date[] =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from)
    date.setDate(date.getDate() + index)
    date.setHours(0, 0, 0, 0)
    return date
  })

export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const formatLabel = (date: Date, options?: Intl.DateTimeFormatOptions): string =>
  date.toLocaleDateString('vi-VN', options)

export function formatShiftLabel(shift: string): string {
  const parts = shift.split(' - ')
  if (parts.length === 2) {
    return parts[0]
  }
  return shift
}

/**
 * Generates Digi calendar sessions between 18:00 and 21:00 (30m slots)
 */
export function getDigiCalendarSessions(
  bookings: DigiStudentBooking[],
  weekStartDate: Date
): ClassSession[] {
  const weekDays = getWeekDays(weekStartDate)
  const todayKey = toDateKey(new Date())
  const sessions: ClassSession[] = []

  // Preset recurring template slots from 18:00 - 21:00 across the week
  const slotTemplates = [
    {
      timeLabel: '18:00',
      endTimeLabel: '19:30',
      branch: 'RinoEdu Linh Đàm',
      room: 'Phòng tự học Digi',
      assistant: 'Nguyễn Thu Hà',
      capacity: 10,
      days: [0, 1, 2, 3, 4, 5], // Mon -> Sat
    },
    {
      timeLabel: '18:00',
      endTimeLabel: '19:30',
      branch: 'RinoEdu Nguyễn Tuân',
      room: 'Phòng Lab Digi',
      assistant: 'Trần Minh Châu',
      capacity: 15,
      days: [0, 2, 4], // Mon, Wed, Fri
    },
    {
      timeLabel: '18:30',
      endTimeLabel: '20:00',
      branch: 'RinoEdu Smart City',
      room: 'Phòng Digi',
      assistant: 'Lê Hoàng Nam',
      capacity: 10,
      days: [1, 3, 5], // Tue, Thu, Sat
    },
    {
      timeLabel: '19:00',
      endTimeLabel: '20:30',
      branch: 'RinoEdu Linh Đàm',
      room: 'Phòng tự học Digi',
      assistant: 'Trần Minh Châu',
      capacity: 12,
      days: [0, 1, 2, 3, 4, 5], // Mon -> Sat
    },
    {
      timeLabel: '19:30',
      endTimeLabel: '21:00',
      branch: 'RinoEdu Linh Đàm',
      room: 'Phòng tự học Digi',
      assistant: 'Nguyễn Thu Hà',
      capacity: 10,
      days: [0, 1, 2, 3, 4, 5], // Mon -> Sat
    },
    {
      timeLabel: '19:30',
      endTimeLabel: '21:00',
      branch: 'RinoEdu Nguyễn Tuân',
      room: 'Phòng Lab Digi',
      assistant: 'Trần Minh Châu',
      capacity: 15,
      days: [0, 2, 4], // Mon, Wed, Fri
    },
  ]

  weekDays.forEach((day, dayIndex) => {
    const dKey = toDateKey(day)
    const isPast = dKey < todayKey
    const isToday = dKey === todayKey

    slotTemplates.forEach((tmpl, tmplIndex) => {
      if (!tmpl.days.includes(dayIndex)) return

      // Find bookings for this day, branch & room
      const dayBookings = bookings.filter(
        (b) =>
          b.date === dKey &&
          (b.branch === tmpl.branch || tmpl.branch === 'RinoEdu Linh Đàm') &&
          (b.roomName === tmpl.room || b.roomName.includes('Digi'))
      )

      let studentCount = dayBookings.length > 0 ? dayBookings.length : (dayIndex % 3 === 0 ? 4 : dayIndex % 2 === 0 ? 6 : 3)
      if (tmplIndex === 0 && dayIndex === 2) {
        studentCount = tmpl.capacity // Full 10/10 chỗ on Wed
      } else if (tmplIndex === 3 && dayIndex === 3) {
        studentCount = tmpl.capacity // Full 12/12 chỗ on Thu
      }

      const attendedCount = isPast
        ? studentCount
        : isToday
        ? dayBookings.filter((b) => b.status === 'dang_hoc' || b.status === 'completed').length || 4
        : 0

      const bookingIds = dayBookings.map((b) => b.id)

      let status: 'confirmed' | 'pending' | 'completed' = 'pending'
      let statusLabel = 'Đã lên lịch'

      if (isPast) {
        status = 'completed'
        statusLabel = 'Đã hoàn thành'
      } else if (isToday) {
        status = 'confirmed'
        statusLabel = 'Đang diễn ra'
      }

      sessions.push({
        id: `DIGI-${dKey}-${tmplIndex}`,
        classCode: `DIGI_LAB_0${tmplIndex + 1}`,
        className: 'Ca tự học Digi',
        subject: 'Tự học số',
        teacher: 'Trợ giảng phụ trách',
        assistantTeacher: tmpl.assistant,
        branch: tmpl.branch,
        schoolRoom: tmpl.room,
        level: 'Digi Self-Paced',
        date: dKey,
        dateDisplay: formatLabel(day, { day: '2-digit', month: '2-digit', year: 'numeric' }),
        dateBucket: isPast ? 'past' : isToday ? 'today' : 'upcoming',
        timeLabel: tmpl.timeLabel,
        endTimeLabel: tmpl.endTimeLabel,
        status,
        statusLabel,
        type: 'digi_session',
        typeLabel: 'Ca tự học Digi',
        title: 'Ca tự học Digi tại trạm',
        lessonSubtitle: `${tmpl.room} • ${studentCount} học viên (${tmpl.capacity} máy)`,
        totalStudents: studentCount,
        officialStudents: studentCount,
        trialStudents: 0,
        attendedStudents: attendedCount,
        isRecurring: true,
        roomCapacity: tmpl.capacity,
        digiBookingIds: bookingIds.length > 0 ? bookingIds : ['DG-2608-001', 'DG-2608-002', 'DG-2608-003', 'DG-2608-004'],
      })
    })
  })

  return sessions.sort((a, b) => `${a.date}T${a.timeLabel}`.localeCompare(`${b.date}T${b.timeLabel}`))
}

/**
 * Filter Digi calendar sessions
 */
export function filterDigiSessions(
  sessions: ClassSession[],
  search: string,
  activeBranch: string,
  filters: DigiScheduleFilterState
): ClassSession[] {
  return sessions.filter((session) => {
    // 1. Branch filter: Combine top activeBranch and filter drawer branches
    if (activeBranch !== 'all' && session.branch !== activeBranch) return false
    if (filters.branches.length > 0 && !filters.branches.includes(session.branch)) return false

    // 2. Status & Assistant filters
    if (filters.statuses.length > 0 && !filters.statuses.includes(session.status || '')) return false
    if (
      filters.assistants.length > 0 &&
      !filters.assistants.includes(session.assistantTeacher || '')
    ) {
      return false
    }

    // 3. Search query
    if (!search.trim()) return true

    const query = search.toLowerCase().trim()
    return (
      session.title.toLowerCase().includes(query) ||
      session.className.toLowerCase().includes(query) ||
      session.classCode.toLowerCase().includes(query) ||
      session.branch.toLowerCase().includes(query) ||
      session.schoolRoom.toLowerCase().includes(query) ||
      (session.assistantTeacher && session.assistantTeacher.toLowerCase().includes(query))
    )
  })
}
