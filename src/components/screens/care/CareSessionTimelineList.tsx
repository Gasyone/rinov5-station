'use client'

import React, { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SessionHistory } from './studentCareReportHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import type { GenericSessionData } from '@/components/screens/calendar/SessionHoverCard'
import {
  type UnifiedSessionItem,
  getCareSessions,
  getDayOfWeekName,
  getShortDayOfWeek,
  formatDateNoYear,
  getCareSessionNotices,
} from './careSessionTimelineHelpers'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import type { StudentPlacementStatus } from './class-card/studentCareClassCardTypes'

export interface CareSessionTimelineListProps {
  regularSessions?: SessionHistory[]
  testSessions?: SessionHistory[]
  pkgIsEnglish: boolean
  smartCards?: React.ReactNode
  studentId?: string
  studentName?: string
  studentAlert?: StudentCareAlert | null
  onOpenLeave?: (date: string) => void
  placementStatus?: StudentPlacementStatus
  expectedStartDate?: string
}

export function CareSessionTimelineList({
  pkgIsEnglish,
  smartCards,
  studentId,
  studentAlert,
  onOpenLeave,
  placementStatus,
  expectedStartDate,
}: CareSessionTimelineListProps) {
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [showAllTests, setShowAllTests] = useState(false)

  // Unified sessions list - Ordered DESCENDING by session number
  const allSessions = useMemo(() => getCareSessions(pkgIsEnglish), [pkgIsEnglish])

  // Cảnh báo & Lưu ý phát sinh (Chuyên cần, CSĐB, Chưa nhận xét, Chưa điểm danh, BTVN)
  const notices = useMemo(() => {
    return getCareSessionNotices(allSessions, studentAlert)
  }, [allSessions, studentAlert])

  const visibleSessions = showAllHistory ? allSessions : allSessions.slice(0, 7)
  const upcomingSessions = visibleSessions.filter((s) => s.type === 'upcoming')
  const regularCompletedSessions = visibleSessions.filter((s) => s.type === 'lesson')
  const allTestSessions = allSessions.filter((s) => s.type === 'test')
  const testCompletedSessions = showAllTests ? allTestSessions : allTestSessions.slice(0, 1)

  // Buổi học đầu tiên hoàn thành (buổi trên cùng) mặc định mở rộng nhận xét học viên
  const firstCompletedId = regularCompletedSessions[0]?.id

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>(() => {
    const firstId = getCareSessions(pkgIsEnglish).filter((s) => s.type === 'lesson')[0]?.id || 'past-19'
    return { [firstId]: true }
  })

  const isSessionExpanded = (id: string) => {
    if (expandedComments[id] !== undefined) {
      return expandedComments[id]
    }
    return id === firstCompletedId || id === 'past-19'
  }

  const toggleExpand = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !isSessionExpanded(id),
    }))
  }

  const renderAttendanceBadge = (session: UnifiedSessionItem) => {
    if (session.type === 'upcoming') {
      return <span className="text-muted-foreground/70 text-xs">Chưa điểm danh</span>
    }

    // 0. Chưa điểm danh (buổi học đã diễn ra nhưng chưa ghi nhận điểm danh)
    if (session.attendance === 'unmarked' || session.attendanceText === 'Chưa điểm danh') {
      return (
        <span
          className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
            getStatusBadgeClass('pending')
          )}
          title="Chưa điểm danh"
        >
          Chưa điểm danh
        </span>
      )
    }

    // 1. Vắng (tách riêng với nghỉ phép - buổi vắng có phép hay không phép đều ghi nhận điểm danh là Vắng)
    if (
      session.attendance === 'absent' ||
      session.attendance === 'absent_unexcused' ||
      session.attendance === 'absent_excused' ||
      session.attendance === 'excused' ||
      /vắng/i.test(session.attendanceText || '')
    ) {
      return (
        <span
          className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
            getStatusBadgeClass('absent')
          )}
          title="Vắng mặt"
        >
          Vắng
        </span>
      )
    }

    // 2. Đến muộn
    if (
      session.attendance === 'late' ||
      /muộn/i.test(session.attendanceText || '')
    ) {
      return (
        <span
          className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
            getStatusBadgeClass('late')
          )}
          title="Đến muộn"
        >
          Đến muộn
        </span>
      )
    }

    // 3. Mặc định: Đã đến (Badge Xanh lá cây)
    return (
      <span
        className={cn(
          'text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
          getStatusBadgeClass('present')
        )}
        title="Đã đến"
      >
        Đã đến
      </span>
    )
  }

  // Render trạng thái Nghỉ phép (V) tách rời với điểm danh
  const renderLeaveBadge = (session: UnifiedSessionItem) => {
    const hasLeave = Boolean(
      session.isLeaveRequested ||
      session.attendance === 'absent_excused' ||
      session.attendance === 'excused' ||
      /có phép|nghỉ phép/i.test(session.attendanceText || '') ||
      session.leaveReason
    )

    if (!hasLeave) return null

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          if (onOpenLeave) {
            onOpenLeave(session.date)
          } else {
            toast.info(`Buổi học ngày ${session.date}: Học viên có đơn xin nghỉ phép đã được phê duyệt.`)
          }
        }}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 hover:underline cursor-pointer bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800/60 shadow-3xs transition-all shrink-0 select-none"
        title="Học viên có đơn xin nghỉ phép buổi học này. Bấm để xem chi tiết đơn nghỉ phép"
      >
        <span>Nghỉ phép (V)</span>
        <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-75" />
      </button>
    )
  }

  const buildGenericSessionData = (session: UnifiedSessionItem): GenericSessionData => {
    const isTest = session.type === 'test'
    const isUpcoming = session.type === 'upcoming'

    const classCode = pkgIsEnglish ? 'SA1_TA_T03' : 'LD_TOAN_00010'
    const className = pkgIsEnglish ? 'Tiếng Anh Trial Level 2' : 'Toán Tư Duy STEM Rino'
    const kctName = pkgIsEnglish ? 'Tiếng Anh Trial Level 2' : 'Toán Tư Duy STEM Rino'
    const subject = pkgIsEnglish ? 'Tiếng Anh' : 'Toán'
    const level = pkgIsEnglish ? 'Level 2' : 'Level 3'
    const schoolRoom = session.room || 'Phòng 1'
    const branch = 'RinoEdu Linh Đàm'

    const timeSlot = session.time || '15:30 - 17:30'
    const teacherName = session.teacher || (pkgIsEnglish ? 'Thu Hà' : 'Hoàng Thị Mai')
    const taName = session.assistant?.name || (pkgIsEnglish ? 'Đức Anh' : 'Trần Thảo')

    let lessonSubtitle = ''
    let lessonContent: GenericSessionData['lessonContent']

    if (isTest) {
      lessonSubtitle = 'Đánh giá năng lực từ vựng & ngữ pháp'
      lessonContent = {
        words: 'review vocabulary units 1-2',
        sentences: 'Unit Test 1: Listening & Speaking Assessment',
        phonics: 'Phonics test: Short vowels A, E, I, O, U',
      }
    } else if (session.comment) {
      lessonSubtitle = session.topic
      lessonContent = session.comment
    } else {
      lessonSubtitle = session.topic
      lessonContent = 'Luyện tập kỹ năng và hoàn thành bài tập trên lớp theo kế hoạch đào tạo.'
    }

    return {
      id: session.id,
      title: session.topic,
      classCode,
      className,
      kctName,
      subject,
      level,
      schoolRoom,
      branch,
      timeSlot,
      date: session.date,
      teacher: teacherName,
      teacherName,
      assistantTeacher: taName,
      taName,
      totalStudents: 16,
      trialStudents: 2,
      type: isTest ? 'test' : isUpcoming ? 'upcoming' : 'class_session',
      typeLabel: isTest ? 'Buổi kiểm tra' : isUpcoming ? 'Sắp tới' : 'Chính thức',
      lessonNumber: session.sessionNumber,
      lessonSubtitle,
      lessonContent,
      status: session.attendance === 'absent_unexcused' ? 'cancelled' : 'scheduled',
    }
  }

  const renderSessionCard = (session: UnifiedSessionItem) => {
    const isUpcoming = session.type === 'upcoming'
    const isTest = session.type === 'test'
    const isExpanded = isSessionExpanded(session.id)
    const hasLeave = Boolean(
      session.isLeaveRequested ||
      session.attendance === 'absent_excused' ||
      session.attendance === 'excused' ||
      /có phép|nghỉ phép/i.test(session.attendanceText || '') ||
      session.leaveReason
    )
    const isAbsent = Boolean(
      session.attendance === 'absent' ||
      session.attendance === 'absent_unexcused' ||
      /vắng/i.test(session.attendanceText || '')
    )
    const isAbsentOrLeave = hasLeave || isAbsent

    const shortDay = getShortDayOfWeek(session.date)
    const shortDate = formatDateNoYear(session.date)
    const hoverSessionData = buildGenericSessionData(session)

    return (
      <div
        key={session.id}
        className={cn(
          'p-1.5 sm:p-2 rounded-xl border transition-all text-xs space-y-1 bg-card border-border/40 hover:border-border/70',
          isUpcoming && 'bg-muted/10 border-border/40'
        )}
      >
        {/* Row 1: [Thứ, Ngày/Tháng] + Tên buổi học (Hover / Click mở ClassSessionHoverCard) | Điểm danh • BTVN • Điểm thi */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Cụm trái: ClassSessionHoverCard kích hoạt khi hover/bấm [Thứ, Ngày/Tháng] + Tên buổi học */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <ClassSessionHoverCard session={hoverSessionData} side="bottom">
              <div
                role="button"
                tabIndex={0}
                className="flex items-center gap-1.5 min-w-0 max-w-full text-left cursor-pointer group focus:outline-hidden hover:opacity-85 transition-opacity"
                title="Bấm hoặc rê chuột để xem chi tiết buổi học"
              >
                {/* Thứ viết tắt & Ngày (không có năm) đưa ra trước Tên buổi học */}
                <span
                  className={cn(
                    'text-xs shrink-0 transition-colors group-hover:text-primary',
                    session.type === 'lesson'
                      ? 'font-bold text-foreground'
                      : 'font-semibold text-sky-600 dark:text-sky-400'
                  )}
                >
                  {shortDay}, {shortDate}
                </span>

                <h4
                  className={cn(
                    'text-xs truncate leading-snug min-w-0 transition-colors group-hover:text-primary group-hover:underline',
                    session.type === 'lesson'
                      ? 'font-bold text-foreground'
                      : 'font-normal text-foreground'
                  )}
                  title={session.topic}
                >
                  {session.topic}
                </h4>
              </div>
            </ClassSessionHoverCard>
          </div>

          {/* Cụm phải ở cuối dòng: Điểm danh • Nghỉ phép (V) • BTVN • Điểm kiểm tra */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground whitespace-nowrap ml-auto">
            {/* Status Điểm danh (Tách rời: Đã đến, Đến muộn, Vắng, Chưa điểm danh) */}
            {renderAttendanceBadge(session)}

            {/* Trạng thái Nghỉ phép (V) tách riêng - Hiển thị khi học viên có đơn xin nghỉ phép */}
            {renderLeaveBadge(session)}

            {/* BTVN: Để BT-01, BT-02 thôi, xóa nhãn BTVN, xóa điểm. Chưa làm text xám, đã làm text xanh mở tab mới */}
            {session.homeworkCode && (
              <>
                <span className="text-border/60">•</span>
                {session.homeworkSubmitted ? (
                  <a
                    href={`/app/classes?homework=${session.homeworkCode}&studentId=${studentId || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-sky-600 dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                    title={`Mở bài tập ${session.homeworkCode} trong tab mới`}
                  >
                    {session.homeworkCode}
                  </a>
                ) : (
                  <span
                    className="text-muted-foreground/70 font-normal"
                    title={`Bài tập ${session.homeworkCode} (Chưa làm)`}
                  >
                    {session.homeworkCode}
                  </span>
                )}
              </>
            )}

            {/* Điểm bài kiểm tra nếu có */}
            {isTest && session.score && (
              <>
                <span className="text-border/60">•</span>
                <span className="font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-1.5 py-0.5 rounded border border-violet-200/80 text-xs">
                  {session.score}/10
                </span>
              </>
            )}
          </div>
        </div>

        {/* Nhận xét của học viên: Mặc định buổi đầu tiên mở rộng, các buổi khác thu gọn 3 dòng kèm nút xem thêm */}
        {isAbsentOrLeave ? (
          /* Học viên nghỉ / nghỉ phép: Hiển thị text ngắn gọn, không hiển thị cảnh báo nhận xét */
          <div className="pt-1.5 border-t border-border/30">
            <p className="text-xs text-muted-foreground italic">
              {hasLeave
                ? (session.leaveReason
                    ? `Học viên nghỉ có phép (${session.leaveReason.replace(/^Phụ huynh xin nghỉ phép do /, '').replace(/\.$/, '')}).`
                    : 'Học viên nghỉ học có phép.')
                : 'Học viên nghỉ học không phép.'}
            </p>
          </div>
        ) : session.comment && session.comment.trim() ? (
          <div className="pt-1.5 border-t border-border/30">
            <div className="relative">
              <p
                className={cn(
                  'text-xs text-foreground/90 font-normal leading-relaxed whitespace-pre-line cursor-pointer',
                  !isExpanded && 'line-clamp-3 pr-20'
                )}
                onClick={() => toggleExpand(session.id)}
              >
                {session.comment}
              </p>
              {session.comment.length > 60 && (
                <button
                  type="button"
                  onClick={() => toggleExpand(session.id)}
                  className="absolute bottom-0 right-0 text-[10.5px] italic text-sky-600 dark:text-sky-400 hover:underline cursor-pointer bg-card dark:bg-zinc-900 pl-1 leading-relaxed inline-flex items-center gap-0.5"
                >
                  <span>{isExpanded ? '... Thu gọn' : '... xem thêm'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Buổi học chưa có nhận xét: Chỉ cảnh báo nhận xét, KHÔNG xét giờ */
          !isUpcoming && (
            <div className="pt-2 border-t border-border/30">
              <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-50/85 dark:bg-amber-950/35 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs text-center flex-wrap shadow-3xs">
                <div className="flex items-center justify-center gap-1.5 shrink-0">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-xs text-amber-700 dark:text-amber-300">
                    Chưa có nhận xét từ giáo viên:
                  </span>
                </div>
                <span className="text-amber-800/90 dark:text-amber-300/90 font-medium">
                  Giáo viên chưa cập nhật đánh giá học viên cho ca học này.
                </span>
              </div>
            </div>
          )
        )}
      </div>
    )
  }

  if (
    placementStatus === 'pending_transfer' ||
    placementStatus === 'wait_for_assignment' ||
    placementStatus === 'pending_payment' ||
    placementStatus === 'enroll_later' ||
    placementStatus === 'fee_transfer' ||
    placementStatus === 'draft_class'
  ) {
    return null
  }

  if (placementStatus === 'awaiting_opening') {
    const openingDate = expectedStartDate || '21/11/2023'
    const openingDayOfWeek = getDayOfWeekName(openingDate)
    const openingShortDate = formatDateNoYear(openingDate)
    const openingTime = '17:45 - 19:15'
    const openingHoverSessionData = buildGenericSessionData({
      id: 'opening-session',
      sessionNumber: 1,
      date: openingDate,
      time: openingTime,
      topic: 'Khai giảng & Định hướng học tập',
      teacher: 'Thầy David Wilson',
      type: 'upcoming',
      attendance: 'unmarked',
      attendanceText: 'Chưa diễn ra',
    })

    return (
      <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 text-left select-none overflow-hidden animate-in fade-in-50 duration-200">
        {/* Streamlined Header with soft background tint */}
        <div className="-mx-4 -mt-4 py-2 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Nhật ký Buổi học
          </h3>
          <span className="text-xs text-muted-foreground font-normal">
            Dự kiến khai giảng: {openingDate}
          </span>
        </div>

        {/* Single Line Upcoming Session Banner (Giống thiết kế buổi sắp tới của lớp đã học, không có icon riêng hay nhãn buổi) */}
        <div className="pt-0.5 pb-1">
          <ClassSessionHoverCard session={openingHoverSessionData} side="bottom">
            <div
              role="button"
              tabIndex={0}
              className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 cursor-pointer hover:bg-sky-100/70 hover:border-sky-300 dark:hover:bg-sky-900/40 transition-all select-none group"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-semibold text-xs text-sky-700 dark:text-sky-400 shrink-0">
                  {openingDayOfWeek}, {openingShortDate} ({openingTime})
                </span>
                <span className="text-border">•</span>
                <span
                  className="font-normal text-foreground truncate text-xs group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors"
                  title="Khai giảng & Định hướng học tập"
                >
                  Khai giảng & Định hướng học tập
                </span>
              </div>
            </div>
          </ClassSessionHoverCard>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Card Section 1: Nhật ký Buổi học */}
      <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 text-left select-none overflow-hidden">
        {/* Streamlined Header with soft background tint */}
        <div className="-mx-4 -mt-4 py-2 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            Nhật ký Buổi học
          </h3>
          <span className="text-xs text-muted-foreground font-normal">
            30 ngày gần nhất
          </span>
        </div>

        {/* Thông báo nếu đang bảo lưu */}
        {placementStatus === 'reserve' && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Khóa học đang bảo lưu. Danh sách dưới đây lưu lại tiến trình các buổi học đã hoàn thành trước ngày bảo lưu.</span>
          </div>
        )}

        {/* Lưu ý phát sinh: Tạm ẩn khỏi thiết kế giao diện theo yêu cầu */}
        {false && notices.length > 0 && (
          <div className="space-y-1 pt-0.5 pb-1 select-none">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="flex items-center gap-1.5 text-xs py-0.5 leading-tight min-w-0"
                title={`${notice.issue} ${notice.action}`}
              >
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="min-w-0 flex-1 truncate">
                  <span className="text-amber-800 dark:text-amber-300 font-medium">
                    {notice.issue}
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {notice.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Smart Cards inside Nhật ký Buổi học (trên các buổi học) */}
        {smartCards && <div className="mb-2">{smartCards}</div>}

        {/* Single Line Upcoming Session Banner (1 buổi tiếp theo - Ẩn khi bảo lưu hoặc hết buổi) */}
        {placementStatus !== 'reserve' && placementStatus !== 'session_ended' && upcomingSessions.length > 0 && (() => {
          const nextSession = [...allSessions.filter((s) => s.type === 'upcoming')].sort(
            (a, b) => a.sessionNumber - b.sessionNumber
          )[0] || upcomingSessions[0]

          const sessionTime = nextSession.time || '17:30 - 19:00'
          const dayOfWeek = getDayOfWeekName(nextSession.date)
          const shortDate = formatDateNoYear(nextSession.date)
          const nextHoverSessionData = buildGenericSessionData(nextSession)

          return (
            <div className="pt-0.5 pb-1">
              <ClassSessionHoverCard session={nextHoverSessionData} side="bottom">
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50 cursor-pointer hover:bg-sky-100/70 hover:border-sky-300 dark:hover:bg-sky-900/40 transition-all select-none group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-semibold text-xs text-sky-700 dark:text-sky-400 shrink-0">
                      {dayOfWeek}, {shortDate} ({sessionTime})
                    </span>
                    <span className="text-border">•</span>
                    <span
                      className="font-normal text-foreground truncate text-xs group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors"
                      title={nextSession.topic}
                    >
                      {nextSession.topic}
                    </span>
                  </div>
                </div>
              </ClassSessionHoverCard>
            </div>
          )
        })()}

        {/* Completed Regular Lessons */}
        {regularCompletedSessions.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-bold text-foreground">
                {placementStatus === 'reserve' ? 'Lịch sử buổi học trước khi bảo lưu' : 'Lịch sử buổi học'} ({regularCompletedSessions.length})
              </span>
              {allSessions.length > 7 && (
                <button
                  type="button"
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span>
                    {showAllHistory
                      ? 'Thu gọn'
                      : `Xem thêm (${allSessions.length - 7} buổi cũ hơn)`}
                  </span>
                  {showAllHistory ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {regularCompletedSessions.map(renderSessionCard)}
            </div>
          </div>
        )}
      </div>

      {/* Card Section 2: Kiểm tra (Tách riêng giống Section Dự án, Header màu xám) */}
      {allTestSessions.length > 0 && (
        <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 text-left select-none overflow-hidden">
          {/* Header with soft background tint */}
          <div className="-mx-4 -mt-4 py-2 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-2.5">
            <h3 className="text-xs font-bold text-foreground tracking-tight">
              Kiểm tra
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-normal">
                Hiển thị {testCompletedSessions.length}/{allTestSessions.length} bài kiểm tra
              </span>
              {allTestSessions.length > 1 && (
                <>
                  <span className="text-border">•</span>
                  <button
                    type="button"
                    onClick={() => setShowAllTests(!showAllTests)}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <span>
                      {showAllTests
                        ? 'Thu gọn'
                        : `Xem thêm (${allTestSessions.length - 1} bài cũ hơn)`}
                    </span>
                    {showAllTests ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-0.5">
            {testCompletedSessions.map(renderSessionCard)}
          </div>
        </div>
      )}
    </div>
  )
}
