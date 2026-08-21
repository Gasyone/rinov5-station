import type { ClassRecord } from '@/mocks/classRecords'

export const WEEKDAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'] as const
export type WeekdayName = typeof WEEKDAYS[number]

export const WEEKDAY_SHORT_LABELS: Record<WeekdayName, string> = {
  'Thứ 2': 'Thứ 2 (T2)',
  'Thứ 3': 'Thứ 3 (T3)',
  'Thứ 4': 'Thứ 4 (T4)',
  'Thứ 5': 'Thứ 5 (T5)',
  'Thứ 6': 'Thứ 6 (T6)',
  'Thứ 7': 'Thứ 7 (T7)',
  'Chủ nhật': 'Chủ nhật (CN)',
}

export interface TimetableSlot {
  slotId: string
  classId: string
  cls: ClassRecord
  dayOfWeek: WeekdayName
  dayIndex: number // 0 to 6
  startTime: string
  endTime: string
  timeLabel: string
  period: 'morning' | 'afternoon' | 'evening'
  room: string
  teacher: string
  siblingDays: WeekdayName[] // All days this class is scheduled on
  patternLabel: string // e.g. "T2 - T4 - T6" or "T3 - T5"
  availableSlots: number
  capacityPercent: number
  isAvailable: boolean
}

export function parsePeriod(startTime: string): 'morning' | 'afternoon' | 'evening' {
  if (!startTime) return 'evening'
  const hour = parseInt(startTime.split(':')[0], 10)
  if (isNaN(hour)) return 'evening'
  if (hour < 12) return 'morning'
  if (hour < 17 || (hour === 17 && parseInt(startTime.split(':')[1] || '0', 10) < 30)) return 'afternoon'
  return 'evening'
}

export function parseSchedulePattern(scheduleStr: string): { days: WeekdayName[]; startTime: string; endTime: string } {
  const result: { days: WeekdayName[]; startTime: string; endTime: string } = {
    days: [],
    startTime: '18:00',
    endTime: '19:30',
  }

  if (!scheduleStr) return result

  // Extract times (e.g. 18:00–19:30 or 18:00 - 19:30)
  const timeMatch = scheduleStr.match(/(\d{1,2}:\d{2})\s*[–\-]\s*(\d{1,2}:\d{2})/)
  if (timeMatch) {
    result.startTime = timeMatch[1].padStart(5, '0')
    result.endTime = timeMatch[2].padStart(5, '0')
  }

  const s = scheduleStr.toLowerCase()

  // Match days
  if (s.includes('t2/4/6') || s.includes('t2-4-6') || s.includes('t2/t4/t6')) {
    result.days = ['Thứ 2', 'Thứ 4', 'Thứ 6']
  } else if (s.includes('t3/5/7') || s.includes('t3-5-7')) {
    result.days = ['Thứ 3', 'Thứ 5', 'Thứ 7']
  } else if (s.includes('t3/5') || s.includes('t3-5') || s.includes('t3/t5')) {
    result.days = ['Thứ 3', 'Thứ 5']
  } else if (s.includes('t2/4') || s.includes('t2-4') || s.includes('t2/t4')) {
    result.days = ['Thứ 2', 'Thứ 4']
  } else if (s.includes('t2/5') || s.includes('t2-5') || s.includes('t2/t5')) {
    result.days = ['Thứ 2', 'Thứ 5']
  } else if (s.includes('t3/6') || s.includes('t3-6') || s.includes('t3/t6')) {
    result.days = ['Thứ 3', 'Thứ 6']
  } else if (s.includes('t4/7') || s.includes('t4-7') || s.includes('t4/t7')) {
    result.days = ['Thứ 4', 'Thứ 7']
  } else if (s.includes('t5/7') || s.includes('t5-7') || s.includes('t5/t7')) {
    result.days = ['Thứ 5', 'Thứ 7']
  } else if (s.includes('t6/cn') || s.includes('t6-cn') || s.includes('t6/tcn')) {
    result.days = ['Thứ 6', 'Chủ nhật']
  } else if (s.includes('t7/cn') || s.includes('t7-cn') || s.includes('t7/tcn')) {
    result.days = ['Thứ 7', 'Chủ nhật']
  } else if (s.includes('t2/6') || s.includes('t2-6')) {
    result.days = ['Thứ 2', 'Thứ 6']
  } else {
    // Individual checks
    if (s.includes('t2') || s.includes('thứ 2') || s.includes('thứ hai')) result.days.push('Thứ 2')
    if (s.includes('t3') || s.includes('thứ 3') || s.includes('thứ ba')) result.days.push('Thứ 3')
    if (s.includes('t4') || s.includes('thứ 4') || s.includes('thứ tư')) result.days.push('Thứ 4')
    if (s.includes('t5') || s.includes('thứ 5') || s.includes('thứ năm')) result.days.push('Thứ 5')
    if (s.includes('t6') || s.includes('thứ 6') || s.includes('thứ sáu')) result.days.push('Thứ 6')
    if (s.includes('t7') || s.includes('thứ 7') || s.includes('thứ bảy')) result.days.push('Thứ 7')
    if (s.includes('cn') || s.includes('chủ nhật')) result.days.push('Chủ nhật')
  }

  return result
}

export function formatDayShort(day: WeekdayName): string {
  if (day === 'Chủ nhật') return 'CN'
  return day.replace('Thứ ', 'T')
}

export function formatPatternLabel(days: WeekdayName[]): string {
  if (!days || days.length === 0) return ''
  return days.map(formatDayShort).join(' - ')
}

export function normalizeWeekdayName(dayStr: string): WeekdayName | null {
  if (!dayStr) return null
  const s = dayStr.trim().toLowerCase()
  if (s.includes('2') || s.includes('hai')) return 'Thứ 2'
  if (s.includes('3') || s.includes('ba')) return 'Thứ 3'
  if (s.includes('4') || s.includes('tư') || s.includes('tu')) return 'Thứ 4'
  if (s.includes('5') || s.includes('năm') || s.includes('nam')) return 'Thứ 5'
  if (s.includes('6') || s.includes('sáu') || s.includes('sau')) return 'Thứ 6'
  if (s.includes('7') || s.includes('bảy') || s.includes('bay')) return 'Thứ 7'
  if (s.includes('chủ nhật') || s.includes('cn')) return 'Chủ nhật'
  return null
}

/**
 * Extract all recurring weekly slots from a list of class records
 */
export function extractTimetableSlots(classes: ClassRecord[]): TimetableSlot[] {
  const slots: TimetableSlot[] = []

  classes.forEach((cls) => {
    // 1. Check if cls has explicit scheduleSlots
    if (cls.scheduleSlots && cls.scheduleSlots.length > 0) {
      // Find all unique days in scheduleSlots
      const rawDays = cls.scheduleSlots
        .map((s) => normalizeWeekdayName(s.dayOfWeek))
        .filter(Boolean) as WeekdayName[]
      const siblingDays = Array.from(new Set(rawDays))
      const patternLabel = formatPatternLabel(siblingDays)

      const availableSlots = Math.max(0, cls.maxStudents - cls.enrolledStudents)
      const capacityPercent = cls.maxStudents > 0 ? Math.round((cls.enrolledStudents / cls.maxStudents) * 100) : 0

      cls.scheduleSlots.forEach((s, idx) => {
        const normDay = normalizeWeekdayName(s.dayOfWeek)
        if (!normDay) return

        const startTime = s.startTime || '18:00'
        const endTime = s.endTime || '19:30'
        const period = parsePeriod(startTime)

        slots.push({
          slotId: `${cls.id}-${normDay}-${idx}`,
          classId: cls.id,
          cls,
          dayOfWeek: normDay,
          dayIndex: WEEKDAYS.indexOf(normDay),
          startTime,
          endTime,
          timeLabel: `${startTime} - ${endTime}`,
          period,
          room: s.room || cls.room || 'Chưa xếp',
          teacher: s.teacherName || cls.teacher || 'Chưa gán',
          siblingDays,
          patternLabel,
          availableSlots,
          capacityPercent,
          isAvailable: availableSlots > 0,
        })
      })
    } else {
      // 2. Parse from cls.schedule string
      const parsed = parseSchedulePattern(cls.schedule)
      const siblingDays = parsed.days.length > 0 ? parsed.days : (['Thứ 2'] as WeekdayName[])
      const patternLabel = formatPatternLabel(siblingDays)
      const availableSlots = Math.max(0, cls.maxStudents - cls.enrolledStudents)
      const capacityPercent = cls.maxStudents > 0 ? Math.round((cls.enrolledStudents / cls.maxStudents) * 100) : 0

      siblingDays.forEach((day, idx) => {
        const period = parsePeriod(parsed.startTime)
        slots.push({
          slotId: `${cls.id}-${day}-${idx}`,
          classId: cls.id,
          cls,
          dayOfWeek: day,
          dayIndex: WEEKDAYS.indexOf(day),
          startTime: parsed.startTime,
          endTime: parsed.endTime,
          timeLabel: `${parsed.startTime} - ${parsed.endTime}`,
          period,
          room: cls.room || 'Chưa xếp',
          teacher: cls.teacher || 'Chưa gán',
          siblingDays,
          patternLabel,
          availableSlots,
          capacityPercent,
          isAvailable: availableSlots > 0,
        })
      })
    }
  })

  // Sort slots by start time
  return slots.sort((a, b) => a.startTime.localeCompare(b.startTime))
}
