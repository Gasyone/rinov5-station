'use client'

import { Clock, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EventSession } from '@/mocks/calendarSchedule'
import { mockBookingTests } from '@/mocks/bookingTests'
import { getStatusColors, resolveStatusSemantic } from '@/lib/statusColors'

export const getAssociatedBookingTest = (session: EventSession) => {
  if (session.type !== 'placement_test') return null
  const bookingId = session.id.replace('EVT-', '')
  return mockBookingTests.find(b => b.id === bookingId) || null
}

interface EventCardProps {
  session: EventSession
  onClick: () => void
  activeBranch?: string
}

export function EventCard({
  session,
  onClick,
  activeBranch = 'all',
}: EventCardProps) {
  const isCancelled = session.status === 'cancelled'

  let bgClass = 'bg-card hover:bg-accent/60'
  if (isCancelled) {
    bgClass = 'bg-zinc-50 dark:bg-zinc-900/50 opacity-75 hover:bg-zinc-100'
  } else if (session.dateBucket === 'past') {
    bgClass = 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50'
  } else if (session.dateBucket === 'upcoming') {
    bgClass = 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-950/50'
  }

  const booking = getAssociatedBookingTest(session)
  
  // Extract student name and event subject/description
  let studentName = session.title
  let subjectAndLevel = session.subject || 'Trải nghiệm'
  
  if (booking) {
    studentName = booking.childName
    subjectAndLevel = `${booking.subject === 'english' ? 'Tiếng Anh' : 'Toán tư duy'} - ${booking.program}`
  } else if (session.title.includes(' - ')) {
    const parts = session.title.split(' - ')
    subjectAndLevel = parts[0]
    studentName = parts[1]
  }

  const teacherName = booking ? (booking.teacher || 'Chưa gán') : session.organizer
  const location = activeBranch === 'all'
    ? session.location
    : session.location.replace(`${session.branch} - `, '')

  const bookingStatusMap: Record<string, string> = {
    booked_assessment: 'đã đặt lịch test',
    unassigned_teacher: 'chưa gán gv',
    checkin: 'đã check-in',
    interviewed: 'đã phỏng vấn',
    tested: 'đã làm bài',
    completed: 'hoàn tất',
    failed: 'không đạt',
    cancelled: 'đã hủy',
    ipad_test_booked: 'đã book test',
    ipad_test_started: 'đang test',
  }
  const statusLabel = booking 
    ? `Trạng thái: ${bookingStatusMap[booking.status] || booking.status.toLowerCase()}` 
    : 'Trạng thái: chưa xác định'
  const statusColors = getStatusColors(booking ? resolveStatusSemantic(booking.status) : 'neutral')

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex min-h-[76px] flex-col overflow-hidden rounded-md text-left shadow-sm transition cursor-pointer border border-border/50 p-2.5", 
        bgClass
      )}
    >
      {/* Row 1: Time and Badge */}
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className={cn("flex items-center gap-1 text-[10px] font-bold text-primary", isCancelled && "text-muted-foreground")}>
          <Clock className="h-3 w-3 shrink-0" />
          {session.timeLabel} - {session.endTimeLabel}
        </div>
        {session.typeLabel && (
          <span className={cn(
            "inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-bold border shrink-0 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800"
          )}>
            {session.typeLabel}
          </span>
        )}
      </div>

      {/* Row 2: Student Name - Teacher Name */}
      <div className="flex items-center gap-1.5 min-w-0 w-full mt-0.5">
        <h4 className={cn('text-[10px] font-bold leading-tight truncate shrink-0 max-w-[55%]', isCancelled && 'line-through text-muted-foreground')}>
          {studentName}
        </h4>
        <span className="text-muted-foreground text-[10px] shrink-0">-</span>
        <div className="flex items-center text-[9px] text-foreground font-medium min-w-0 flex-1">
          <span className="truncate">{teacherName}</span>
        </div>
      </div>

      {/* Row 3: Subject - Level */}
      <div className="mt-0.5 text-[9px] text-muted-foreground font-medium truncate">
        {subjectAndLevel}
      </div>

      {/* Row 4: School/Branch (hidden if activeBranch !== 'all') */}
      {activeBranch === 'all' && (
        <div className="mt-0.5 flex items-center gap-1 text-[9px] text-muted-foreground min-w-0">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{location}</span>
        </div>
      )}

      {/* Row 5: Status */}
      <div className="mt-1 text-[8.5px]">
        <span className={cn("font-medium lowercase truncate block", statusColors.text)}>
          {statusLabel}
        </span>
      </div>
    </div>
  )
}
