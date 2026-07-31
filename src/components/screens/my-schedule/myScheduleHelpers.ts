import type { ClassSession, EventSession } from '@/mocks/calendarSchedule'
import {
  parseScheduleTime,
} from '@/components/screens/schedule/ScheduleTimeGrid'
import type { MyScheduleFilters, UnifiedSlot } from './myScheduleTypes'
import { mockBookingTests } from '@/mocks/bookingTests'

export const getAssociatedBookingTest = (slot: UnifiedSlot) => {
  if (slot.id === 'EVT-CUSTOM-001') return mockBookingTests.find(b => b.id === 'E0007')
  if (slot.id === 'EVT-CUSTOM-002') return mockBookingTests.find(b => b.id === 'E0001')
  if (slot.id === 'EVT-CUSTOM-003') return mockBookingTests.find(b => b.id === 'E0006')
  
  const bookingId = slot.id.replace('EVT-', '')
  const directMatch = mockBookingTests.find(b => b.id === bookingId || b.id === slot.id)
  if (directMatch) return directMatch

  if (slot.title) {
    const cleanTitle = slot.title.toLowerCase().trim()
    const nameMatch = mockBookingTests.find(b => 
      b.childName.toLowerCase().trim() === cleanTitle ||
      cleanTitle.includes(b.childName.toLowerCase().trim()) ||
      b.childName.toLowerCase().trim().includes(cleanTitle)
    )
    if (nameMatch) return nameMatch
  }

  return null
}

export function buildUnifiedSlots(
  classSessions: ClassSession[],
  eventSessions: EventSession[]
): UnifiedSlot[] {
  return [
    ...classSessions.map((session) => ({
      id: session.id,
      scheduleType: 'class' as const,
      title: session.title,
      subtitle: session.className,
      date: session.date,
      timeLabel: session.timeLabel,
      endTimeLabel: session.endTimeLabel,
      branch: session.branch,
      personLabel: session.teacher,
      type: session.type,
      typeLabel: session.typeLabel,
      totalStudents: session.totalStudents,
      trialStudents: session.trialStudents,
      attendedStudents: session.attendedStudents,
      isRecurring: session.isRecurring,
      substituteTeacher: session.substituteTeacher,
      assistantTeacher: session.assistantTeacher,
      assistantSubstitute: session.assistantSubstitute,
      status: session.status,
      dateBucket: session.dateBucket,
      startMin: parseScheduleTime(session.timeLabel),
      isOpeningDay: session.isOpeningDay,
      classCode: session.classCode,
      level: session.level,
      note: session.lessonSubtitle,
      schoolRoom: session.schoolRoom,
      subject: session.subject,
    })),
    ...eventSessions.map((session) => ({
      id: session.id,
      scheduleType: 'event' as const,
      title: session.title,
      subtitle: session.location,
      date: session.date,
      timeLabel: session.timeLabel,
      endTimeLabel: session.endTimeLabel,
      branch: session.branch,
      personLabel: session.organizer,
      type: session.type,
      typeLabel: session.typeLabel,
      isRecurring: session.isRecurring,
      status: session.status,
      dateBucket: session.dateBucket,
      startMin: parseScheduleTime(session.timeLabel),
      note: session.note,
      subject: session.subject,
    })),
  ]
}

export function filterMyScheduleSlots(
  slots: UnifiedSlot[],
  filters: MyScheduleFilters
): UnifiedSlot[] {
  const filtered = slots
    .filter((slot) => {
      if (filters.activeBranch && filters.activeBranch !== 'all' && slot.branch !== filters.activeBranch) {
        return false
      }

      if (filters.bucketFilters.length > 0) {
        const getSessionPeriod = (timeLabel: string): 'morning' | 'afternoon' | 'evening' => {
          if (!timeLabel) return 'morning'
          const hour = parseInt(timeLabel.split(':')[0], 10)
          if (isNaN(hour)) return 'morning'
          if (hour < 12) return 'morning'
          if (hour < 18) return 'afternoon'
          return 'evening'
        }
        const period = getSessionPeriod(slot.timeLabel)
        if (!filters.bucketFilters.includes(period)) return false
      }

      if (filters.sourceFilters.length > 0 && !filters.sourceFilters.includes(slot.scheduleType)) return false

      if (filters.statusFilters.length > 0) {
        const hasMatch = filters.statusFilters.some((status) => {
          if (status === 'confirmed') {
            return slot.status === 'confirmed' || slot.status === 'scheduled'
          }
          if (status === 'cancelled') {
            return slot.status === 'cancelled' || slot.status === undefined
          }
          return slot.status === status
        })
        if (!hasMatch) return false
      }

      if (filters.typeFilters.length > 0) {
        const hasMatch = filters.typeFilters.some((type) => {
          if (type === 'class_session') {
            return slot.type === 'class_session' || slot.type === 'supplementary' || slot.type === 'planned'
          }
          return slot.type === type
        })
        if (!hasMatch) return false
      }

      // 1. Lọc theo Môn học & Chương trình (Unified)
      if (filters.subjectFilters.length > 0) {
        if (slot.scheduleType === 'class') {
          if (!filters.subjectFilters.includes(slot.subject || '')) return false
        } else if (slot.scheduleType === 'event') {
          const booking = getAssociatedBookingTest(slot)
          const matches = (
            filters.subjectFilters.includes(slot.subject || '') || 
            (booking && filters.subjectFilters.includes(booking.program))
          )
          if (!matches) return false
        }
      }

      // 2. Lọc theo Phòng học & Vị trí (Unified)
      if (filters.roomFilters.length > 0) {
        if (slot.scheduleType === 'class') {
          if (!filters.roomFilters.includes(slot.schoolRoom || '')) return false
        } else if (slot.scheduleType === 'event') {
          const booking = getAssociatedBookingTest(slot)
          const matches = (
            (booking && filters.roomFilters.includes(booking.room)) || 
            (booking && booking.classroom && filters.roomFilters.includes(booking.classroom))
          )
          if (!matches) return false
        }
      }

      // 3. Lọc theo Điều kiện đặc biệt (Unified)
      if (filters.conditionFilters.length > 0) {
        const matches = filters.conditionFilters.some((cond) => {
          if (cond === 'trial') return slot.scheduleType === 'class' && (slot.trialStudents || 0) > 0
          if (cond === 'substitute') return slot.scheduleType === 'class' && Boolean(slot.substituteTeacher)
          if (cond === 'opening') return slot.scheduleType === 'class' && Boolean(slot.isOpeningDay)
          if (cond === 'attended') return slot.scheduleType === 'class' && slot.attendedStudents !== undefined
          if (cond === 'capacity') return slot.scheduleType === 'class' && (slot.totalStudents || 0) >= 15
          return false
        })
        if (!matches) return false
      }

      if (filters.search) {
        const query = filters.search.toLowerCase()
        return (
          slot.title.toLowerCase().includes(query) ||
          slot.subtitle.toLowerCase().includes(query) ||
          slot.personLabel.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => a.startMin - b.startMin || a.date.localeCompare(b.date))

  // Enforce max 2 concurrent overlapping slots per time interval per day
  const result: UnifiedSlot[] = []
  const slotsByDate: Record<string, UnifiedSlot[]> = {}

  for (const slot of filtered) {
    const dateKey = slot.date
    const existing = slotsByDate[dateKey] || []
    const start = slot.startMin
    const end = parseScheduleTime(slot.endTimeLabel) || (start + 60)

    let exceedsMaxOverlap = false
    for (let m = start; m < end; m += 5) {
      let count = 0
      for (const ex of existing) {
        const exStart = ex.startMin
        const exEnd = parseScheduleTime(ex.endTimeLabel) || (exStart + 60)
        if (m >= exStart && m < exEnd) {
          count++
        }
      }
      if (count >= 2) {
        exceedsMaxOverlap = true
        break
      }
    }

    if (!exceedsMaxOverlap) {
      existing.push(slot)
      slotsByDate[dateKey] = existing
      result.push(slot)
    }
  }

  return result
}

export function getMyScheduleStatusLabel(status?: string): string {
  if (status === 'confirmed' || status === 'scheduled') return 'Đã booking'
  if (status === 'completed') return 'Hoàn thành'
  if (status === 'rescheduled') return 'Đổi ngày'
  return 'Đã hủy'
}
