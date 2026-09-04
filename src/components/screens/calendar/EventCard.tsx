'use client'

import { AppAvatar } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { EventSession } from '@/mocks/calendarSchedule'
import { mockBookingTests } from '@/mocks/bookingTests'
import { SessionHoverCard } from './SessionHoverCard'
import { getStatusColors, resolveStatusSemantic } from '@/lib/statusColors'

export const getAssociatedBookingTest = (session: { id: string; title: string; type?: string }) => {
  if (session.type && session.type !== 'placement_test') return null
  if (session.id === 'EVT-CUSTOM-001') return mockBookingTests.find(b => b.id === 'E0007') || null
  if (session.id === 'EVT-CUSTOM-002') return mockBookingTests.find(b => b.id === 'E0001') || null
  if (session.id === 'EVT-CUSTOM-003') return mockBookingTests.find(b => b.id === 'E0006') || null
  
  const bookingId = session.id.replace('EVT-', '')
  const directMatch = mockBookingTests.find(b => b.id === bookingId || b.id === session.id)
  if (directMatch) return directMatch

  if (session.title) {
    const cleanTitle = session.title.toLowerCase().trim()
    const nameMatch = mockBookingTests.find(b => 
      b.childName.toLowerCase().trim() === cleanTitle ||
      cleanTitle.includes(b.childName.toLowerCase().trim()) ||
      b.childName.toLowerCase().trim().includes(cleanTitle)
    )
    if (nameMatch) return nameMatch
  }

  return null
}

interface EventCardProps {
  session: EventSession
  onClick: () => void
  activeBranch?: string
  isOverlapped?: boolean
  hideTeacher?: boolean
  hideBranch?: boolean
  branchesCount?: number
  showTime?: boolean
}

export function EventCard({
  session,
  onClick,
  activeBranch,
  isOverlapped,
  hideTeacher = false,
  hideBranch,
  branchesCount,
  showTime = false,
  className,
  ...props
}: EventCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const isCancelled = session.status === 'cancelled'

  let bgClass = 'bg-orange-50/90 hover:bg-orange-100/90 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 border-amber-200/60 dark:border-amber-900/40'
  if (isCancelled) {
    bgClass = 'bg-zinc-50 dark:bg-zinc-900/50 opacity-75 hover:bg-zinc-100 border-zinc-200 dark:border-zinc-800'
  } else if (session.dateBucket === 'past') {
    bgClass = 'bg-orange-50/90 hover:bg-orange-100/90 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 border-amber-200/60 dark:border-amber-900/40'
  } else if (session.dateBucket === 'upcoming') {
    bgClass = 'bg-orange-50/90 hover:bg-orange-100/90 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 border-amber-200/60 dark:border-amber-900/40'
  }

  const booking = getAssociatedBookingTest(session)
  
  // 1. Resolve Student Name
  let studentName = session.title
  if (booking) {
    studentName = booking.childName
  } else if (session.title.includes(' - ')) {
    const parts = session.title.split(' - ')
    studentName = parts[parts.length - 1]
  }
  const cleanStudentName = studentName.replace(/^(Hv:\s*|Học viên:\s*)/i, '').trim()

  // 2. Resolve Subject & Program (Môn học, Chương trình)
  const subjectLabel = booking
    ? (booking.subject === 'english' ? 'Tiếng Anh' : booking.subject === 'math' ? 'Toán tư duy' : session.subject || 'Tiếng Anh')
    : (session.subject || 'Tiếng Anh')
  const programName = booking?.program || (session.subject === 'Toán tư duy' ? 'Toán tư duy Archimedes' : 'Station Program')

  // 3. Resolve Facility & Teacher (Cơ sở, Giáo viên)
  const branchName = session.branch || booking?.school || (activeBranch && activeBranch !== 'all' ? activeBranch : '') || (session.location ? session.location.split(' - ')[0] : 'RinoEdu')
  const teacherName = booking
    ? (booking.teacher || 'Chưa gán')
    : (session.subject === 'Toán tư duy' ? 'Thầy Hùng' : 'Robert L.')

  // 4. Resolve Level (Trình độ ban đầu -> chuyển sang Trình độ đánh giá nếu đã có kết quả đánh giá)
  const hasAssessmentResult = Boolean(
    booking &&
    (booking.status === 'completed' || booking.status === 'failed' || booking.isTested || (booking.testResult?.speaking && booking.testResult.speaking !== '-')) &&
    booking.testResult?.level &&
    booking.testResult.level !== '-' &&
    booking.testResult.level !== ''
  )

  const displayLevel = hasAssessmentResult
    ? (booking?.testResult?.level || 'Level 1A')
    : (booking?.program && booking.program !== 'Station Program'
        ? (booking.testResult?.lwrLevel && booking.testResult.lwrLevel !== '-' && booking.testResult.lwrLevel !== 'Pre-Starters'
            ? booking.testResult.lwrLevel
            : booking.program)
        : (booking?.testResult?.lwrLevel && booking.testResult.lwrLevel !== '-'
            ? (booking.testResult.lwrLevel === 'Pre-Starters' ? 'Pre-Starters (<=6)' : booking.testResult.lwrLevel)
            : 'Pre-Starters (<=6)'))

  // 5. Resolve Status (Trạng thái)
  const bookingStatusMap: Record<string, string> = {
    booked_assessment: 'Đã đặt lịch test',
    unassigned_teacher: 'Chưa gán GV',
    checkin: 'Đã check-in',
    interviewed: 'Đã phỏng vấn',
    tested: 'Đã làm bài',
    completed: 'Hoàn tất',
    failed: 'Không đạt',
    cancelled: 'Đã hủy',
    ipad_test_booked: 'Đã book test',
    ipad_test_started: 'Đang test',
    rescheduled: 'Đổi ngày',
    scheduled: 'Đã lên lịch',
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
  }

  const rawStatus = booking?.status || session.status || 'scheduled'
  const statusSemantic = resolveStatusSemantic(rawStatus)
  const statusColors = getStatusColors(statusSemantic)

  const statusText = booking 
    ? (bookingStatusMap[booking.status] || booking.status) 
    : (session.status === 'completed' ? 'Hoàn tất' : session.status === 'cancelled' ? 'Đã hủy' : session.status === 'rescheduled' ? 'Đổi ngày' : 'Đã lên lịch')

  return (
    <SessionHoverCard session={session}>
      <div
        {...props}
        onClick={onClick}
        className={cn(
          "group flex min-h-[82px] flex-col overflow-hidden rounded-md text-left shadow-xs transition cursor-pointer border p-2 hover:shadow-md hover:ring-1 hover:ring-primary/40", 
          isOverlapped && "min-h-[70px]",
          bgClass,
          className
        )}
      >
        {/* Row 1: Giờ (không đậm) - Hv (không đậm): [Tên học viên] (in đậm) (trái) & Nhãn "TN" (phải) */}
        <div className="mb-1 flex items-center justify-between gap-1.5 min-w-0">
          <div
            className={cn(
              'text-xs leading-tight truncate min-w-0 flex-1 flex items-center gap-1',
              isCancelled && 'line-through text-muted-foreground'
            )}
            title={`${session.timeLabel ? `${session.timeLabel} - ` : ''}Hv: ${cleanStudentName}`}
          >
            {session.timeLabel && (
              <span className="text-primary dark:text-primary/90 font-normal shrink-0 tabular-nums">
                {session.timeLabel} -
              </span>
            )}
            <span className="font-normal text-muted-foreground shrink-0">Hv:</span>
            <span className="font-bold text-foreground truncate">{cleanStudentName}</span>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-bold border shrink-0 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800"
            )}
          >
            TN
          </span>
        </div>

        {/* Row 2: Cơ sở (trái) & Tên giáo viên (phải) */}
        <div className="mt-0.5 flex items-center justify-between gap-1.5 min-w-0">
          <span
            className="text-xs text-muted-foreground font-medium truncate flex-1 min-w-0"
            title={branchName}
          >
            {branchName}
          </span>
          {!hideTeacher && teacherName && (
            <div className="flex items-center gap-1 shrink-0 max-w-[45%] min-w-0" title={`Giáo viên: ${teacherName}`}>
              <AppAvatar name={teacherName} size="xs" className="h-3.5 w-3.5 text-xs border-none shrink-0" />
              <span className="text-xs text-muted-foreground font-medium truncate">{teacherName}</span>
            </div>
          )}
        </div>

        {/* Row 3: Môn học (trái) & Chương trình (phải), tách riêng */}
        <div className="mt-0.5 flex items-center justify-between gap-1.5 min-w-0 text-xs text-muted-foreground font-medium">
          <span className="truncate flex-1 min-w-0" title={subjectLabel}>
            {subjectLabel}
          </span>
          <span className="truncate shrink-0 max-w-[50%] text-right font-medium" title={programName}>
            {programName}
          </span>
        </div>

        {/* Row 4: Trạng thái (bỏ nền) (trái) & Trình độ ban đầu/đánh giá (phải) */}
        <div className="mt-1 flex items-center justify-between gap-1.5 min-w-0 text-[8.5px] leading-tight">
          <div className="flex items-center gap-1 truncate flex-1 min-w-0">
            <span className="text-muted-foreground font-normal shrink-0">Trạng thái:</span>
            <span className={cn("font-medium truncate", statusColors.text)}>
              {statusText}
            </span>
          </div>
          {displayLevel && (
            <span
              className={cn(
                "font-medium shrink-0 max-w-[45%] text-right truncate",
                hasAssessmentResult ? "text-foreground font-semibold" : "text-muted-foreground"
              )}
              title={hasAssessmentResult ? `Trình độ đánh giá: ${displayLevel}` : `Trình độ ban đầu: ${displayLevel}`}
            >
              {displayLevel}
            </span>
          )}
        </div>
      </div>
    </SessionHoverCard>
  )
}
