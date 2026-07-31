'use client'

import type { ReactNode } from 'react'
import { Award, BookOpen, Clock, ExternalLink, Info, Link as LinkIcon, MapPin, UserCheck } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AppAvatar } from '@/components/shared'
import { getStatusColors, resolveStatusSemantic, type StatusSemantic } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { UnifiedSlot } from '@/components/screens/my-schedule/myScheduleTypes'
import { getAssociatedBookingTest } from '@/components/screens/my-schedule/myScheduleHelpers'
import type { GenericSessionData } from './SessionHoverCard'

interface BookingEventHoverCardProps {
  session: GenericSessionData
  children: ReactNode
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function BookingEventHoverCard({
  session,
  children,
  openDelay = 150,
  closeDelay = 100,
  side = 'right',
}: BookingEventHoverCardProps) {
  const isCancelled = session.status === 'cancelled'

  // Standardize values for Booking Event
  const title = session.title || session.className || 'Sự kiện trải nghiệm'
  const subject = session.subject
  const level = session.level
  const room = session.schoolRoom || session.roomName || session.location
  const branch = session.branch

  // Time & Duration
  const timeDisplay = session.timeSlot 
    ? session.timeSlot 
    : session.timeLabel && session.endTimeLabel 
    ? `${session.timeLabel} - ${session.endTimeLabel}` 
    : session.timeLabel || 'N/A'

  // Teaching Staff / Organizer
  const primaryTeacher = session.teacher || session.teacherName || session.organizer || session.personLabel

  // Booking test details
  const booking = session.type === 'placement_test' ? getAssociatedBookingTest(session as UnifiedSlot) : null
  let studentName = title
  let parentInfo = ''
  let testStatusText = ''
  let testStatusSemantic: StatusSemantic = 'neutral'

  if (booking) {
    studentName = booking.childName
    parentInfo = `PH: ${booking.familyName} (${booking.phone})`
    const bookingStatusMap: Record<string, string> = {
      booked_assessment: 'Đã đặt lịch test',
      ipad_test_booked: 'Đã đặt lịch test',
      unassigned_teacher: 'Chưa gán GV',
      checkin: 'Đã check-in',
      ipad_test_started: 'Đang test',
      testing: 'Đang test',
      interviewed: 'Đã phỏng vấn',
      tested: 'Đã làm bài',
      completed: 'Hoàn tất',
      failed: 'Không đạt',
      cancelled: 'Đã hủy',
    }
    testStatusText = bookingStatusMap[booking.status] || booking.status
    testStatusSemantic = resolveStatusSemantic(booking.status)
  }

  const displaySubject = subject || (booking ? (booking.subject === 'english' ? 'Tiếng Anh' : 'Toán tư duy') : 'Tiếng Anh')
  
  // Resolve Program (Chương trình)
  let displayProgram = booking?.program || 'Chương trình Station'
  if (displayProgram === 'Station Program') displayProgram = 'Chương trình Station'
  else if (!displayProgram.startsWith('Chương trình')) displayProgram = `Chương trình ${displayProgram}`

  // Resolve Registered Level / Bracket (Trình độ)
  const registeredLevel = level || (booking?.program && booking.program !== 'Station Program' ? booking.program : 'Pre-Starters (<=6)')

  // Resolve Assessment Level & Sub-level (Trình độ đánh giá)
  const assessedLevel = booking?.testResult?.level
  const assessedSubLevel = booking?.testResult?.subLevel || booking?.testResult?.lwrLevel
  const hasAssessmentResult = Boolean(assessedLevel && assessedLevel !== '' && assessedLevel !== '-')

  // Location formatting
  let locationDisplay = ''
  if (room && branch) {
    if (room.toLowerCase().includes(branch.toLowerCase()) || branch.toLowerCase().includes(room.toLowerCase())) {
      locationDisplay = room
    } else {
      locationDisplay = `${room} • ${branch}`
    }
  } else {
    locationDisplay = room || branch || ''
  }

  // Check if booking/session actually has a test result or result link
  const hasResult = Boolean(
    session.resultLink ||
    booking?.resultLink ||
    (booking?.testResult?.level && booking.testResult.level !== '') ||
    (booking?.testResult?.speaking && booking.testResult.speaking !== '-') ||
    (booking?.testResult?.lwr && booking.testResult.lwr !== '-') ||
    booking?.isTested
  )

  // Responsible Person for Booking/Event
  let displayResponsiblePerson = primaryTeacher || 'Robert L.'
  if (booking) {
    displayResponsiblePerson = booking.teacher || booking.ops || booking.createdBy || session.teacher || session.teacherName || 'Robert L.'
  }
  if (!displayResponsiblePerson || displayResponsiblePerson.includes('Phòng Tuyển sinh') || displayResponsiblePerson.startsWith('Phòng')) {
    if (booking?.teacher && !booking.teacher.startsWith('Phòng')) displayResponsiblePerson = booking.teacher
    else if (booking?.ops && !booking.ops.startsWith('Phòng')) displayResponsiblePerson = booking.ops
    else displayResponsiblePerson = 'Robert L.'
  }

  const testStatusColors = getStatusColors(testStatusSemantic)

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align="start"
        sideOffset={8}
        className="w-80 p-0 overflow-hidden rounded-lg shadow-xl border border-border/80 bg-popover z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Top Header Ribbon */}
        <div
          className={cn(
            'px-3.5 py-2.5 flex items-center justify-between border-b text-xs font-semibold',
            isCancelled
              ? 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
          )}
        >
          {/* Time & Slot */}
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{timeDisplay}</span>
          </div>

          {/* Type Badge */}
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
              {session.typeLabel || 'Trải nghiệm'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 space-y-2 text-xs">
          {/* Student Name & Progress Status */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-sm text-foreground leading-tight">
                {studentName}
              </h4>
              {testStatusText && (
                <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded border', testStatusColors.badge)}>
                  {testStatusText}
                </span>
              )}
            </div>
            {parentInfo && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {parentInfo}
              </p>
            )}
          </div>

          {/* Row 1: Subject & Selected Program */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="font-medium text-foreground/90">
              {displaySubject}
              {displayProgram && (
                <>
                  {' - '}
                  <span className="font-semibold text-foreground">{displayProgram}</span>
                </>
              )}
            </span>
          </div>

          {/* Row 2: Registered Level (with Clickable Test Link) */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-foreground/90">
              Trình độ:{' '}
              <a
                href={session.testLink || booking?.testLink || `/app/booking_test/results/${booking?.id || 'demo'}`}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                title="Nhấp để xem bài test / bài kiểm tra"
                className="font-bold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                {registeredLevel}
                <ExternalLink className="h-3 w-3 inline" />
              </a>
            </span>
          </div>

          {/* Location */}
          {locationDisplay && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
              <span className="font-medium text-foreground">{locationDisplay}</span>
            </div>
          )}

          {/* Staff Section: PHỤ TRÁCH */}
          <div className="border-t border-border/40 pt-2 space-y-1 text-[11px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              PHỤ TRÁCH:
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Phụ trách:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AppAvatar name={displayResponsiblePerson} size="xs" />
                <span className="font-semibold text-foreground">{displayResponsiblePerson}</span>
              </div>
            </div>
          </div>

          {/* Result & Assessment Level Section */}
          <div className="border-t border-border/40 pt-2 space-y-1.5 text-[11px]">
            {/* Result Link */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <LinkIcon className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                <span className="text-foreground/90 font-medium">Kết quả:</span>
              </div>
              {hasResult ? (
                <a
                  href={session.resultLink || booking?.resultLink || `/app/booking_test/results/${booking?.id || 'demo'}`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sky-700 dark:text-sky-300 underline hover:text-sky-800 dark:hover:text-sky-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3 inline" />
                  Kết quả đánh giá
                </a>
              ) : (
                <span className="italic text-muted-foreground font-normal">-</span>
              )}
            </div>

            {/* Assessment Level & Sub-level */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <Award className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
                <span className="text-foreground/90 font-medium">Trình độ đánh giá:</span>
              </div>
              {hasAssessmentResult ? (
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {assessedLevel}{assessedSubLevel ? ` • ${assessedSubLevel}` : ''}
                </span>
              ) : (
                <span className="italic text-muted-foreground font-normal">-</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="bg-muted/40 border-t border-border/60 px-3.5 py-1.5 text-[10px] text-muted-foreground flex items-center gap-1.5">
          <Info className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          <span>Nhấp vào thẻ để mở chi tiết & thao tác</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
