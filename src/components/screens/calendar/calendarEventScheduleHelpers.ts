import type { EventSession } from '@/mocks/calendarSchedule'

export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0
  const parts = timeStr.split(':')
  const h = parseInt(parts[0], 10) || 0
  const m = parseInt(parts[1], 10) || 0
  return h * 60 + m
}

export const formatMinutesToTime = (minutes: number): string => {
  const bounded = Math.max(0, Math.min(24 * 60 - 1, minutes))
  const h = Math.floor(bounded / 60)
  const m = bounded % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export const get30MinSlot = (timeLabel: string): string => {
  if (!timeLabel) return '08:00'
  const [hStr, mStr] = timeLabel.split(':')
  const hour = parseInt(hStr, 10)
  const minute = parseInt(mStr, 10)
  if (isNaN(hour) || isNaN(minute)) return '08:00'
  const slotMinute = minute < 30 ? 0 : 30
  return `${String(hour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}`
}

export const getSessionPeriod = (timeLabel: string): 'morning' | 'afternoon' | 'evening' => {
  if (!timeLabel) return 'morning'
  const hour = parseInt(timeLabel.split(':')[0], 10)
  if (isNaN(hour)) return 'morning'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

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

/**
 * Computes a dynamic list of 30-minute time slots (e.g. ['16:00', '16:30', ...])
 * Trims empty hours before the earliest event and after the latest event,
 * while ensuring the current time (if today is visible) and comfortable buffers are included.
 */
export function computeEventScheduleSlots(
  sessions: EventSession[],
  days: Date[],
  today: Date,
  now: Date
): string[] {
  const dayKeys = new Set(days.map((d) => toDateKey(d)))
  const visibleSessions = sessions.filter((session) => dayKeys.has(session.date))

  const isTodayInDays = days.some(
    (day) =>
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
  )

  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  if (visibleSessions.length > 0) {
    const starts = visibleSessions.map((s) => parseTimeToMinutes(s.timeLabel))
    const ends = visibleSessions.map((s) => {
      const parsedEnd = parseTimeToMinutes(s.endTimeLabel)
      return parsedEnd > 0 ? parsedEnd : parseTimeToMinutes(s.timeLabel) + 30
    })

    let minMinutes = Math.min(...starts)
    let maxMinutes = Math.max(...ends)

    if (isTodayInDays) {
      minMinutes = Math.min(minMinutes, nowMinutes)
      maxMinutes = Math.max(maxMinutes, nowMinutes)
    }

    // Buffer 30 minutes before min and after max
    const paddedStart = Math.max(0, minMinutes - 30)
    const paddedEnd = Math.min(23 * 60 + 30, maxMinutes + 30)

    // Snap to 30-minute boundary
    let startSlotMinute = Math.floor(paddedStart / 30) * 30
    let endSlotMinute = Math.ceil(paddedEnd / 30) * 30

    // Ensure minimum 4 hours (240 minutes) window for balanced appearance
    if (endSlotMinute - startSlotMinute < 240) {
      const diff = 240 - (endSlotMinute - startSlotMinute)
      // Extend end if possible, otherwise extend start
      if (endSlotMinute + diff <= 23 * 60 + 30) {
        endSlotMinute += diff
      } else {
        startSlotMinute = Math.max(0, endSlotMinute - 240)
      }
    }

    const slots: string[] = []
    for (let m = startSlotMinute; m <= endSlotMinute; m += 30) {
      slots.push(formatMinutesToTime(m))
    }
    return slots
  }

  // If no sessions in the period:
  if (isTodayInDays) {
    const curH = now.getHours()
    const startSlotMinute = Math.max(0, (curH - 1) * 60)
    const endSlotMinute = Math.min(23 * 60 + 30, (curH + 4) * 60)
    const slots: string[] = []
    for (let m = startSlotMinute; m <= endSlotMinute; m += 30) {
      slots.push(formatMinutesToTime(m))
    }
    return slots
  }

  // Default fallback when viewing a blank week in future/past without sessions
  const slots: string[] = []
  for (let m = 8 * 60; m <= 18 * 60; m += 30) {
    slots.push(formatMinutesToTime(m))
  }
  return slots
}
