import type { ClassSession, EventSession } from '@/mocks/calendarSchedule'
import {
  parseScheduleTime,
} from '@/components/screens/schedule/ScheduleTimeGrid'
import type { MyScheduleFilters, UnifiedSlot } from './myScheduleTypes'
import { mockBookingTests } from '@/mocks/bookingTests'

const getAssociatedBookingTest = (slot: UnifiedSlot) => {
  if (slot.id === 'EVT-CUSTOM-001') return mockBookingTests.find(b => b.id === 'E0007') // Gia Bao
  if (slot.id === 'EVT-CUSTOM-002') return mockBookingTests.find(b => b.id === 'E0001') // Vu Phuc An
  if (slot.id === 'EVT-CUSTOM-003') return mockBookingTests.find(b => b.id === 'E0006') // Minh Khoa
  
  const seed = slot.title.charCodeAt(0) + slot.title.length
  const bookingIdx = seed % mockBookingTests.length
  return mockBookingTests[bookingIdx]
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
  return slots
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
}

export function getMyScheduleStatusLabel(status?: string): string {
  if (status === 'confirmed' || status === 'scheduled') return 'Đã booking'
  if (status === 'completed') return 'Hoàn thành'
  if (status === 'rescheduled') return 'Đổi ngày'
  return 'Đã hủy'
}
