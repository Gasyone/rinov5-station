'use client'

import type { ReactNode } from 'react'
import {
  Award,
  BookOpen,
  Clock,
  ExternalLink,
  Info,
  Link as LinkIcon,
  MapPin,
  UserCheck,
} from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AppAvatar, StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { BookingTest } from '@/mocks/bookingTests'
import {
  formatDateTime,
  getParentDisplayName,
  getStatusLabel,
  getSubjectLabel,
  maskPhone,
} from './bookingTestHelpers'
import {
  getBookingResultHref,
  hasBookingAssessmentResult,
} from './bookingTestAssessmentStorage'

interface BookingTestScheduleHoverCardProps {
  booking: BookingTest
  children: ReactNode
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export function BookingTestScheduleHoverCard({
  booking,
  children,
  openDelay = 150,
  closeDelay = 100,
  side = 'right',
  align = 'start',
}: BookingTestScheduleHoverCardProps) {
  const isCancelled = booking.status === 'cancelled'
  const studentName = booking.childName
  const parentDisplayName = getParentDisplayName(booking)
  const parentInfo = parentDisplayName
    ? `PH: ${parentDisplayName} (${maskPhone(booking.phone)})`
    : `PH: ${maskPhone(booking.phone)}`
  const displaySubject = getSubjectLabel(booking.subject)
  const displayProgram = booking.program || 'Chương trình Station'
  const registeredLevel = booking.expectedLevel?.trim() || booking.program || 'Chưa đặt'
  const locationDisplay = booking.room ? `${booking.room} • ${booking.school}` : booking.school
  const primaryTeacher = booking.teacher?.trim() || booking.ops || 'Chưa phân công'
  const hasResult = hasBookingAssessmentResult(booking)
  const resultHref = booking.resultLink?.startsWith('/app/')
    ? booking.resultLink
    : getBookingResultHref(booking.id)
  const testHref = booking.testLink?.startsWith('/app/')
    ? booking.testLink
    : resultHref
  const assessedLevel = booking.testResult?.level
  const assessedSubLevel = booking.testResult?.subLevel
  const hasAssessedLevel = Boolean(assessedLevel && assessedLevel !== '' && assessedLevel !== '-')

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        sideOffset={8}
        className="w-80 p-0 overflow-hidden rounded-lg shadow-xl border border-border/80 bg-popover z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Dải đầu thẻ: Thời gian & Nhãn sự kiện */}
        <div
          className={cn(
            'px-3.5 py-2.5 flex items-center justify-between border-b text-xs font-semibold',
            isCancelled
              ? 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
          )}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDateTime(booking.testTime)}</span>
          </div>

          <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            {booking.eventType === 'test' ? 'Đánh giá năng lực' : 'Trải nghiệm'}
          </span>
        </div>

        {/* Nội dung hồ sơ lịch test */}
        <div className="p-3.5 space-y-2.5 text-xs">
          {/* Học viên & Trạng thái */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-sm text-foreground leading-tight">
                {studentName}
              </h4>
              <StatusBadge status={booking.status} label={getStatusLabel(booking.status)} />
            </div>
            {parentInfo && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {parentInfo}
              </p>
            )}
          </div>

          {/* Môn học & Chương trình */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="font-medium text-foreground/90">
              {displaySubject}
              {' - '}
              <span className="font-semibold text-foreground">{displayProgram}</span>
            </span>
          </div>

          {/* Trình độ dự kiến / đăng ký */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-foreground/90">
              Trình độ dự kiến:{' '}
              <a
                href={testHref}
                onClick={(e) => e.stopPropagation()}
                target="_blank"
                rel="noopener noreferrer"
                title="Nhấp để xem bài test / bài kiểm tra"
                className="font-bold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                {registeredLevel}
                <ExternalLink className="h-3 w-3 inline" />
              </a>
            </span>
          </div>

          {/* Địa điểm & Người phụ trách */}
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
                <AppAvatar name={primaryTeacher} size="xs" />
                <span className="font-semibold text-foreground">{primaryTeacher}</span>
              </div>
            </div>
          </div>

          {/* Kết quả & Trình độ đánh giá */}
          <div className="border-t border-border/40 pt-2 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <LinkIcon className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                <span className="text-foreground/90 font-medium">Kết quả:</span>
              </div>
              {hasResult ? (
                <a
                  href={resultHref}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sky-700 dark:text-sky-300 underline hover:text-sky-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3 inline" />
                  Kết quả đánh giá
                </a>
              ) : (
                <span className="italic text-muted-foreground font-normal">-</span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <Award className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
                <span className="text-foreground/90 font-medium">Trình độ đánh giá:</span>
              </div>
              {hasAssessedLevel ? (
                <span className="font-bold text-purple-700 dark:text-purple-300">
                  {assessedLevel}{assessedSubLevel ? ` • ${assessedSubLevel}` : ''}
                </span>
              ) : (
                <span className="italic text-muted-foreground font-normal">-</span>
              )}
            </div>
          </div>
        </div>

        {/* Thanh chỉ dẫn chân thẻ */}
        <div className="bg-muted/40 border-t border-border/60 px-3.5 py-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
          <Info className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          <span>Nhấp vào lịch để xem chi tiết & thao tác</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
