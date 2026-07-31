'use client'

import type { ReactNode } from 'react'
import { ClassSessionHoverCard } from './ClassSessionHoverCard'
import { BookingEventHoverCard } from './BookingEventHoverCard'

export interface GenericSessionData {
  id?: string
  title?: string
  className?: string
  classCode?: string
  subject?: string
  level?: string
  teacher?: string
  teacherName?: string
  organizer?: string
  substituteTeacher?: string
  assistantTeacher?: string
  taName?: string
  taSubstituteName?: string
  assistantSubstitute?: string
  branch?: string
  schoolRoom?: string
  roomName?: string
  location?: string
  subtitle?: string
  timeLabel?: string
  endTimeLabel?: string
  timeSlot?: string
  date?: string
  dateBucket?: string
  status?: string
  type?: string
  typeLabel?: string
  totalStudents?: number
  officialStudents?: number
  trialStudents?: number
  attendedStudents?: number
  studentCount?: number
  capacity?: number
  isOpeningDay?: boolean
  note?: string
  lessonSubtitle?: string
  scheduleType?: string
  personLabel?: string
  testLink?: string
  feedbackLink?: string
  resultLink?: string
}

interface SessionHoverCardProps {
  session: GenericSessionData
  children: ReactNode
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function SessionHoverCard({
  session,
  children,
  openDelay = 150,
  closeDelay = 100,
  side = 'right',
}: SessionHoverCardProps) {
  const isClass = session.scheduleType === 'class' || Boolean(session.classCode) || Boolean(session.className)

  if (isClass) {
    return (
      <ClassSessionHoverCard
        session={session}
        openDelay={openDelay}
        closeDelay={closeDelay}
        side={side}
      >
        {children}
      </ClassSessionHoverCard>
    )
  }

  return (
    <BookingEventHoverCard
      session={session}
      openDelay={openDelay}
      closeDelay={closeDelay}
      side={side}
    >
      {children}
    </BookingEventHoverCard>
  )
}
