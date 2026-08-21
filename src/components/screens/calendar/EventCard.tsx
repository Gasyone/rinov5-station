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
}

export function EventCard({
  session,
  onClick,
  activeBranch,
  isOverlapped,
  hideTeacher = false,
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

  // 2. Resolve Subject and Level/Program (Môn - Trình độ)
  const subjectLabel = booking
    ? (booking.subject === 'english' ? 'Tiếng Anh' : 'Toán tư duy')
    : (session.subject || 'Tiếng Anh')
  const programLevel = booking
    ? (booking.program || 'Cambridge Starters')
    : (session.subject === 'Toán tư duy' ? 'Toán tư duy Archimedes' : 'Cambridge Starters')
  const subjectAndLevel = `${subjectLabel} - ${programLevel}`
  
  // 3. Resolve Facility and Teacher (Cơ sở - giáo viên)
  const teacherName = booking
    ? (booking.teacher || 'Chưa gán')
    : (session.subject === 'Toán tư duy' ? 'Thầy Hùng' : 'Robert L.')

  // Clean branch name (remove room)
  const branchName = session.branch || booking?.school || activeBranch || (session.location ? session.location.split(' - ')[0] : 'RinoEdu')

  // 4. Resolve Status (Trạng thái)
  const bookingStatusMap: Record<string, string> = {
    booked_assessment: 'đã đặt lịch test',
    unassigned_teacher: 'chưa gán GV',
    checkin: 'đã check-in',
    interviewed: 'đã phỏng vấn',
    tested: 'đã làm bài',
    completed: 'hoàn tất',
    failed: 'không đạt',
    cancelled: 'đã hủy',
    ipad_test_booked: 'đã book test',
    ipad_test_started: 'đang test',
    rescheduled: 'đổi ngày',
    scheduled: 'đã lên lịch',
  }

  const rawStatus = booking?.status || session.status || 'scheduled'
  const statusSemantic = resolveStatusSemantic(rawStatus)
  const statusColors = getStatusColors(statusSemantic)

  const statusText = booking 
    ? (bookingStatusMap[booking.status] || booking.status.toLowerCase()) 
    : (session.status === 'completed' ? 'hoàn tất' : session.status === 'cancelled' ? 'đã hủy' : session.status === 'rescheduled' ? 'đổi ngày' : 'đã lên lịch')
  const statusLabel = `trạng thái: ${statusText}`

  return (
    <SessionHoverCard session={session}>
      <div
        {...props}
        onClick={onClick}
        className={cn(
          "group flex min-h-[76px] flex-col overflow-hidden rounded-md text-left shadow-xs transition cursor-pointer border p-2.5 hover:shadow-md hover:ring-1 hover:ring-primary/40", 
          isOverlapped && "min-h-[64px]",
          bgClass,
          className
        )}
      >
        {/* Row 1: Hv: Tên học viên (trái) & Nhãn "TN" (phải) */}
        <div className="mb-1 flex items-center justify-between gap-1.5 min-w-0">
          <h4
            className={cn(
              'text-[11px] font-bold leading-tight truncate min-w-0 flex-1',
              isCancelled && 'line-through text-muted-foreground'
            )}
            title={`Hv: ${cleanStudentName}`}
          >
            <span>Hv: {cleanStudentName}</span>
          </h4>
          <span
            className={cn(
              "inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-bold border shrink-0 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800"
            )}
          >
            TN
          </span>
        </div>

        {/* Row 2: Môn - Trình độ */}
        <div className="text-[9.5px] text-muted-foreground font-medium truncate leading-tight" title={subjectAndLevel}>
          {subjectAndLevel}
        </div>

        {/* Row 3: Tên Cơ sở (trái) - Tên Giáo viên + Avatar (phải, nếu có) */}
        <div className="mt-0.5 flex items-center justify-between gap-1.5 min-w-0">
          <span className="text-[9px] text-muted-foreground font-medium truncate flex-1 min-w-0" title={branchName}>
            {branchName}
          </span>
          {!hideTeacher && teacherName && (
            <div className="flex items-center gap-1 shrink-0 max-w-[50%] min-w-0" title={`Giáo viên: ${teacherName}`}>
              <AppAvatar name={teacherName} size="xs" className="h-3.5 w-3.5 text-[7px] border-none shrink-0" />
              <span className="text-[9px] text-muted-foreground font-medium truncate">{teacherName}</span>
            </div>
          )}
        </div>

        {/* Row 4: Trạng thái */}
        <div className="mt-1 text-[8.5px] leading-tight">
          <span className={cn("font-medium lowercase truncate block", statusColors.text)}>
            {statusLabel}
          </span>
        </div>
      </div>
    </SessionHoverCard>
  )
}
