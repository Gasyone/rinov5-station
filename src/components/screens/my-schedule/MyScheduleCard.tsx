'use client'

import { cn } from '@/lib/utils'
import type { UnifiedSlot } from './myScheduleTypes'
import { SessionCard } from '@/components/screens/calendar/SessionCardV2'
import { EventCard } from '@/components/screens/calendar/EventCard'
import type { ClassSession, EventSession } from '@/mocks/calendarSchedule'

interface MyScheduleCardProps {
  slot: UnifiedSlot
  compact?: boolean
  isOverlapped?: boolean
  showTime?: boolean
  onClick?: () => void
  activeBranch?: string
  hideBranch?: boolean
}

export function MyScheduleCard({
  slot,
  compact,
  isOverlapped,
  onClick,
  activeBranch = 'all',
  hideBranch,
}: MyScheduleCardProps) {
  const shouldHideBranch = hideBranch !== undefined ? hideBranch : activeBranch !== 'all'
  const isPlacementTest = slot.type === 'placement_test' || slot.scheduleType === 'event'

  if (isPlacementTest) {
    const mappedSession: EventSession = {
      id: slot.id,
      title: slot.title,
      description: slot.note || '',
      date: slot.date,
      dateDisplay: '',
      dateBucket: slot.dateBucket,
      timeLabel: slot.timeLabel,
      endTimeLabel: slot.endTimeLabel,
      branch: slot.branch,
      organizer: slot.personLabel,
      type: 'placement_test',
      typeLabel: slot.typeLabel || 'Trải nghiệm',
      status: (slot.status || 'scheduled') as EventSession['status'],
      statusLabel: '',
      participants: 0,
      maxParticipants: 0,
      location: slot.subtitle || slot.branch || '',
      note: slot.note || '',
      subject: slot.subject,
    }

    return (
      <EventCard
        session={mappedSession}
        onClick={onClick || (() => {})}
        activeBranch={activeBranch}
        isOverlapped={isOverlapped}
        hideTeacher={true}
        hideBranch={shouldHideBranch}
      />
    )
  }

  // Tái sử dụng trực tiếp SessionCard từ màn Lịch học trung tâm (CalendarClassScheduleScreen)
  const classSession: ClassSession = slot.rawClassSession || {
    id: slot.id,
    classCode: slot.classCode || '',
    className: slot.className || slot.subtitle,
    kctName: slot.kctName,
    subject: slot.subject || '',
    teacher: slot.teacher || slot.personLabel || '',
    substituteTeacher: slot.substituteTeacher,
    assistantTeacher: slot.assistantTeacher,
    assistantSubstitute: slot.assistantSubstitute,
    branch: slot.branch,
    schoolRoom: slot.schoolRoom || '',
    level: slot.level || '',
    date: slot.date,
    dateDisplay: slot.date,
    dateBucket: slot.dateBucket,
    timeLabel: slot.timeLabel,
    endTimeLabel: slot.endTimeLabel,
    statusLabel: slot.status || '',
    type: (slot.type as ClassSession['type']) || 'class_session',
    typeLabel: slot.typeLabel || 'Chính thức',
    title: slot.title,
    lessonSubtitle: slot.note || slot.lessonSubtitle || '',
    lessonNumber: slot.lessonNumber,
    lessonContent: typeof slot.lessonContent === 'object' ? slot.lessonContent : undefined,
    totalStudents: slot.totalStudents || 0,
    officialStudents: slot.officialStudents ?? ((slot.totalStudents || 0) - (slot.trialStudents || 0)),
    trialStudents: slot.trialStudents || 0,
    attendedStudents: slot.attendedStudents,
    isOpeningDay: slot.isOpeningDay,
    status: slot.status as ClassSession['status'],
    projectUrl: slot.projectUrl,
  }

  return (
    <SessionCard
      session={classSession}
      onClick={onClick || (() => {})}
      hideBranch={shouldHideBranch}
      className={cn(compact && 'h-full')}
    />
  )
}
