'use client'

import type { ReactNode } from 'react'
import { Award, BookOpen, Clock, ExternalLink, Info, Link as LinkIcon, MapPin, UserCheck } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AppAvatar } from '@/components/shared'
import { getStatusColors, resolveStatusSemantic, type StatusSemantic } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { UnifiedSlot } from '@/components/screens/my-schedule/myScheduleTypes'
import { getAssociatedBookingTest } from '@/components/screens/my-schedule/myScheduleHelpers'
import type { BookingTest } from '@/mocks/bookingTests'
import type { GenericSessionData } from './SessionHoverCard'

export interface BookingEventHoverCardProps {
  session?: GenericSessionData
  booking?: BookingTest
  children: ReactNode
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
}

function maskPhone(phone?: string): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\s+/g, '')
  if (cleaned.length < 7) return phone
  return `${cleaned.slice(0, 3)}****${cleaned.slice(-3)}`
}

export function BookingEventHoverCard({
  session,
  booking: explicitBooking,
  children,
  openDelay = 150,
  closeDelay = 100,
  side = 'right',
  align = 'start',
  className,
}: BookingEventHoverCardProps) {
  // Booking test details: prioritize explicit booking prop, fallback to associated booking from session
  const booking =
    explicitBooking ||
    (session?.type === 'placement_test' ? getAssociatedBookingTest(session as UnifiedSlot) : null)

  const isCancelled = booking ? booking.status === 'cancelled' : session?.status === 'cancelled'

  // Standardize values for Booking Event
  const title = session?.title || session?.className || 'Sự kiện trải nghiệm'
  const subject = session?.subject
  const level = session?.level
  const room = session?.schoolRoom || session?.roomName || session?.location || booking?.room
  const branch = session?.branch || booking?.school

  // Time & Duration (strictly format time range without date or order id)
  let timeDisplay = 'N/A'
  if (session?.timeSlot) {
    timeDisplay = session.timeSlot
  } else if (session?.timeLabel && session?.endTimeLabel) {
    timeDisplay = `${session.timeLabel} - ${session.endTimeLabel}`
  } else if (session?.timeLabel) {
    timeDisplay = session.timeLabel
  } else if (booking?.testTime) {
    const parts = booking.testTime.trim().split(' ')
    const timeStr = parts.length > 1 ? parts[1] : parts[0]
    if (timeStr && timeStr.includes(':')) {
      const [hStr, mStr] = timeStr.split(':')
      const h = Number(hStr)
      const m = Number(mStr)
      if (!isNaN(h) && !isNaN(m)) {
        const slotM = m < 30 ? 0 : 30
        const startH = String(h).padStart(2, '0')
        const startM = String(slotM).padStart(2, '0')
        const endMinutes = h * 60 + slotM + 30
        const endH = String(Math.floor(endMinutes / 60)).padStart(2, '0')
        const endM = String(endMinutes % 60).padStart(2, '0')
        timeDisplay = `${startH}:${startM} - ${endH}:${endM}`
      } else {
        timeDisplay = timeStr
      }
    } else {
      timeDisplay = booking.testTime
    }
  }

  // Teaching Staff / Organizer
  const primaryTeacher = session?.teacher || session?.teacherName || session?.organizer || session?.personLabel

  let studentName = title
  let parentInfo = ''
  let testStatusText = ''
  let testStatusSemantic: StatusSemantic = 'neutral'

  if (booking) {
    studentName = booking.childName
    const parentDisplayName =
      booking.parentName ||
      (booking.parentRole ? `${booking.familyName} (${booking.parentRole})` : booking.familyName) ||
      booking.familyMembers?.[0]?.name ||
      ''
    const phoneStr = booking.phone
      ? (booking.phone.includes('*') ? booking.phone : maskPhone(booking.phone))
      : ''
    if (parentDisplayName && phoneStr) {
      parentInfo = `PH: ${parentDisplayName} (${phoneStr})`
    } else if (parentDisplayName) {
      parentInfo = `PH: ${parentDisplayName}`
    } else if (phoneStr) {
      parentInfo = `PH: ${phoneStr}`
    }

    const bookingStatusMap: Record<string, string> = {
      booked_assessment: 'Đã đặt lịch',
      ipad_test_booked: 'Đã đặt lịch',
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
  } else {
    // Graceful fallback for sessions created from Lead or other sources
    if (session?.subtitle?.startsWith('PH:')) {
      parentInfo = session.subtitle
    } else if (session?.note?.startsWith('PH:')) {
      parentInfo = session.note
    }
    const statusVal = session?.status || 'completed'
    const fallbackStatusMap: Record<string, string> = {
      completed: 'Hoàn tất',
      scheduled: 'Đã đặt lịch',
      testing: 'Đang test',
      checkin: 'Đã check-in',
      failed: 'Không đạt',
      cancelled: 'Đã hủy',
    }
    testStatusText = fallbackStatusMap[statusVal] || statusVal
    testStatusSemantic = resolveStatusSemantic(statusVal)
  }

  const displaySubject = subject || (booking ? (booking.subject === 'math' ? 'Toán tư duy' : 'Tiếng Anh') : 'Tiếng Anh')

  // Resolve Program (Chương trình)
  let displayProgram = booking?.program || session?.kctName || 'Chương trình Station'
  if (displayProgram === 'Station Program') displayProgram = 'Chương trình Station'
  else if (!displayProgram.startsWith('Chương trình')) displayProgram = `Chương trình ${displayProgram}`

  // Resolve Registered Level / Bracket (Trình độ)
  const registeredLevel = level || booking?.expectedLevel?.trim() || (booking?.program && booking.program !== 'Station Program' ? booking.program : 'Pre-Starters (<=6)')

  // Resolve Assessment Level & Sub-level (Trình độ đánh giá)
  const assessedLevel = booking?.testResult?.level || session?.lessonSubtitle || (session?.status === 'completed' ? level : undefined)
  const assessedSubLevel = booking?.testResult?.subLevel || booking?.testResult?.lwrLevel
  const hasAssessmentResult = Boolean(assessedLevel && assessedLevel !== '' && assessedLevel !== '-' && assessedLevel !== 'Chưa đặt')

  // Location formatting
  let locationDisplay = ''
  if (room && branch) {
    if (room.toLowerCase().includes(branch.toLowerCase()) || branch.toLowerCase().includes(room.toLowerCase())) {
      locationDisplay = room
    } else {
      locationDisplay = `${branch} - ${room}`
    }
  } else {
    locationDisplay = room || branch || ''
  }

  // Check if booking/session actually has a test result or result link
  const hasResult = Boolean(
    session?.resultLink ||
    booking?.resultLink ||
    (booking?.testResult?.level && booking.testResult.level !== '' && booking.testResult.level !== 'Chưa đặt') ||
    (booking?.testResult?.speaking && booking.testResult.speaking !== '-') ||
    (booking?.testResult?.lwr && booking.testResult.lwr !== '-') ||
    booking?.isTested ||
    session?.status === 'completed'
  )

  // Responsible Person for Booking/Event
  let displayResponsiblePerson = primaryTeacher || 'Robert L.'
  if (booking) {
    displayResponsiblePerson = booking.teacher || booking.ops || booking.createdBy || session?.teacher || session?.teacherName || 'Robert L.'
  }
  if (!displayResponsiblePerson || displayResponsiblePerson.includes('Phòng Tuyển sinh') || displayResponsiblePerson.startsWith('Phòng')) {
    if (booking?.teacher && !booking.teacher.startsWith('Phòng')) displayResponsiblePerson = booking.teacher
    else if (booking?.ops && !booking.ops.startsWith('Phòng')) displayResponsiblePerson = booking.ops
    else displayResponsiblePerson = primaryTeacher || 'Sarah J.'
  }

  const testStatusColors = getStatusColors(testStatusSemantic)

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        sideOffset={8}
        className={cn(
          'w-80 p-0 overflow-hidden rounded-lg shadow-xl border border-border/80 bg-popover z-[100] animate-in fade-in-0 zoom-in-95',
          className
        )}
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
            <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
              {session?.typeLabel || 'Trải nghiệm'}
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
                <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded border', testStatusColors.badge)}>
                  {testStatusText}
                </span>
              )}
            </div>
            {parentInfo && (
              <p className="text-xs text-muted-foreground mt-0.5">
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
                href={session?.testLink || booking?.testLink || `/app/booking_test/results/${booking?.id || 'demo'}`}
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

          {/* Staff & Location Section */}
          <div className="border-t border-border/40 pt-2 space-y-1.5 text-xs">
            {locationDisplay && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                <span className="font-medium text-foreground">{locationDisplay}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-0.5">
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
          <div className="border-t border-border/40 pt-2 space-y-1.5 text-xs">
            {/* Result Link */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <LinkIcon className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                <span className="text-foreground/90 font-medium">Kết quả:</span>
              </div>
              {hasResult ? (
                <a
                  href={session?.resultLink || booking?.resultLink || `/app/booking_test/results/${booking?.id || 'demo'}`}
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
        <div className="bg-muted/40 border-t border-border/60 px-3.5 py-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
          <Info className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          <span>Nhấp vào thẻ để mở chi tiết & thao tác</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
