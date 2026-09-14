'use client'

import React, { useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SessionHistory } from './studentCareReportHelpers'
import { PersonnelHoverCard, AppAvatar } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import {
  type UnifiedSessionItem,
  getCareSessions,
  getDayOfWeekName,
  getShortDayOfWeek,
  formatDateNoYear,
  getCareSessionNotices,
} from './careSessionTimelineHelpers'
import type { StudentCareAlert } from '@/mocks/careAlerts'

interface CareSessionTimelineListProps {
  regularSessions?: SessionHistory[]
  testSessions?: SessionHistory[]
  pkgIsEnglish: boolean
  smartCards?: React.ReactNode
  studentId?: string
  studentName?: string
  studentAlert?: StudentCareAlert | null
}

export function CareSessionTimelineList({
  pkgIsEnglish,
  smartCards,
  studentId,
  studentAlert,
}: CareSessionTimelineListProps) {
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [showAllTests, setShowAllTests] = useState(false)

  // Unified sessions list - Ordered DESCENDING by session number
  const allSessions = useMemo(() => getCareSessions(pkgIsEnglish), [pkgIsEnglish])

  // Cảnh báo & Lưu ý phát sinh (Chuyên cần, CSĐB, Chưa nhận xét, Chưa điểm danh, BTVN)
  const notices = useMemo(() => {
    return getCareSessionNotices(allSessions, studentAlert, studentId)
  }, [allSessions, studentAlert, studentId])

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

    // 1. Vắng không phép (Nổi bật nhất - Badge Đỏ chỉ để nhãn)
    if (
      session.attendance === 'absent_unexcused' ||
      /không phép/i.test(session.attendanceText || '')
    ) {
      return (
        <span
          className={cn(
            'text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
            getStatusBadgeClass('absent_unexcused')
          )}
          title="Vắng không phép"
        >
          Vắng không phép
        </span>
      )
    }

    // 2. Vắng có phép (Badge Cam/Vàng chỉ để nhãn)
    if (
      session.attendance === 'absent_excused' ||
      session.attendance === 'excused' ||
      /có phép|nghỉ phép/i.test(session.attendanceText || '')
    ) {
      return (
        <span
          className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
            getStatusBadgeClass('absent_excused')
          )}
          title="Vắng có phép (Phụ huynh đã xin phép)"
        >
          Vắng có phép
        </span>
      )
    }

    // 3. Vắng mặt chung
    if (session.attendance === 'absent' || /vắng/i.test(session.attendanceText || '')) {
      return (
        <span
          className={cn(
            'text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
            getStatusBadgeClass('absent')
          )}
        >
          {session.attendanceText || 'Vắng mặt'}
        </span>
      )
    }

    // 4. Đến muộn (Badge Vàng hổ phách cảnh báo - xóa 10m/15m chỉ để nhãn Đến muộn)
    if (session.attendance === 'late' || /muộn/i.test(session.attendanceText || '')) {
      return (
        <span
          className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
            getStatusBadgeClass('late')
          )}
        >
          Đến muộn
        </span>
      )
    }

    // 5. Đã đến (Badge xanh lục trang nhã)
    return (
      <span
        className={cn(
          'text-[11px] font-medium px-2 py-0.5 rounded-full border leading-none shrink-0',
          getStatusBadgeClass('present')
        )}
      >
        Đã đến
      </span>
    )
  }

  const renderSessionCard = (session: UnifiedSessionItem) => {
    const isUpcoming = session.type === 'upcoming'
    const isTest = session.type === 'test'
    const isExpanded = isSessionExpanded(session.id)

    const shortDay = getShortDayOfWeek(session.date)
    const shortDate = formatDateNoYear(session.date)

    return (
      <div
        key={session.id}
        className={cn(
          'p-1.5 sm:p-2 rounded-xl border transition-all text-xs space-y-1 bg-card border-border/40 hover:border-border/70',
          isUpcoming && 'bg-muted/10 border-border/40'
        )}
      >
        {/* Row 1 duy nhất: [Thứ, Ngày/Tháng] + Tên buổi học (nếu dài để ...) | GV (trợ giảng popover nếu có) • Điểm danh rõ ràng • BTVN • Điểm thi */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Cụm trái: [Thứ, Ngày/Tháng] + Tên buổi học (truncate ...) + Badge Kiểm tra */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {/* Thứ viết tắt & Ngày (không có năm) đưa ra trước Tên buổi học */}
            <span className="font-semibold text-xs shrink-0 text-sky-600 dark:text-sky-400">
              {shortDay}, {shortDate}
            </span>

            <h4
              className="font-normal text-foreground text-xs truncate leading-snug min-w-0"
              title={session.topic}
            >
              {session.topic}
            </h4>

            {isTest && (
              <Badge variant="secondary" className="text-xs font-bold px-1.5 py-0 bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border border-violet-200 dark:border-violet-800 shrink-0">
                Kiểm tra
              </Badge>
            )}
          </div>

          {/* Cụm phải ở cuối dòng: GV (+1 popover trợ giảng nếu có) trước BTVN, Điểm danh rõ ràng, BTVN, Điểm kiểm tra */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground whitespace-nowrap ml-auto">
            {/* GV */}
            <span className="text-muted-foreground">GV:</span>
            <PersonnelHoverCard
              person={{
                id: 'EMP-HTM',
                name: session.teacher || 'Hoàng Thị Mai',
                role: 'Giáo viên chính',
                phone: '0901234567',
                email: 'hongthmai@rinoedu.com',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangThiMai',
              }}
              align="start"
            >
              <span className="font-normal text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer transition-colors">
                {session.teacher || 'Hoàng Thị Mai'}
              </span>
            </PersonnelHoverCard>

            {/* Trợ giảng: Chỉ hiển thị khi buổi đó CÓ trợ giảng, không sinh dòng, chỉ mở Popover */}
            {session.assistant && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-0.5 text-xs font-semibold px-1 py-0.5 rounded border border-sky-200 hover:bg-sky-100 bg-sky-50/80 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900 transition-colors cursor-pointer select-none ml-0.5"
                    title={`Trợ giảng: ${session.assistant.name}`}
                  >
                    <span>+1</span>
                    <ChevronDown className="h-3 w-3 stroke-[2.5]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  side="bottom"
                  className="w-64 p-3 space-y-2.5 text-xs z-50 shadow-md border bg-popover text-popover-foreground rounded-xl"
                >
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="font-bold text-foreground text-xs">Trợ giảng buổi học</span>
                    <span className="text-[10.5px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200/60">
                      Trợ giảng
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <AppAvatar
                      src={session.assistant.avatar}
                      name={session.assistant.name}
                      size="sm"
                      className="h-9 w-9 border border-primary/10 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="font-bold text-xs text-foreground truncate">{session.assistant.name}</p>
                      <p className="text-[10.5px] text-muted-foreground truncate">{session.assistant.role}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-border/40 text-xs">
                    {session.assistant.phone && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Số điện thoại:</span>
                        <span className="font-mono font-bold text-foreground">{session.assistant.phone}</span>
                      </div>
                    )}
                    {session.assistant.email && (
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Email:</span>
                        <span className="font-medium text-foreground truncate max-w-[140px]" title={session.assistant.email}>
                          {session.assistant.email}
                        </span>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <span className="text-border/60">•</span>

            {/* Status Điểm danh (Rõ ràng: Vắng không phép, Vắng có phép, Đến muộn, Đã đến) */}
            {renderAttendanceBadge(session)}

            <span className="text-border/60">•</span>

            {/* BTVN */}
            <span>
              BTVN:{' '}
              {session.homeworkSubmitted ? (
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      `Chi tiết bài tập ${session.homeworkCode}: Đã làm (${session.homeworkScore})`
                    )
                  }
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  {session.homeworkCode} ({session.homeworkScore})
                </button>
              ) : (
                <span className="text-muted-foreground/70 font-normal">
                  {session.homeworkCode} (Chưa làm)
                </span>
              )}
            </span>

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
        {session.comment && session.comment.trim() ? (
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
          /* Buổi học chưa có nhận xét (Do giáo viên chưa nhập) - Thêm dòng cảnh báo */
          !isUpcoming && (
            <div className="pt-1.5 border-t border-border/30">
              <div className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold text-xs">Chưa có nhận xét học viên</span>
                  <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 italic hidden sm:inline">
                    (Do giáo viên chưa nhập)
                  </span>
                </div>
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.5 rounded-full border shadow-3xs leading-none shrink-0',
                    getStatusBadgeClass('warning')
                  )}
                >
                  Chờ cập nhật
                </span>
              </div>
            </div>
          )
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Lưu ý phát sinh (Chuyên cần, CSĐB, Chưa nhận xét, Chưa điểm danh, BTVN) - Đặt bên ngoài, phía trên Nhật ký */}
      {notices.length > 0 && (
        <div className="rounded-xl border border-amber-300/80 dark:border-amber-800/70 bg-amber-50/75 dark:bg-amber-950/40 px-3 py-2 text-xs text-left animate-in fade-in-50 duration-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 text-amber-950 dark:text-amber-100 text-xs leading-relaxed">
              <span className="font-bold text-amber-800 dark:text-amber-300 mr-1.5">
                Lưu ý:
              </span>
              {notices.map((notice, idx) => (
                <span key={notice.id} className="inline">
                  {notice.text}
                  {idx < notices.length - 1 ? ' ' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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

        {/* Smart Cards inside Nhật ký Buổi học (trên các buổi học) */}
        {smartCards && <div className="mb-2">{smartCards}</div>}

        {/* Single Line Upcoming Session Banner (1 buổi tiếp theo) */}
        {upcomingSessions.length > 0 && (() => {
          const nextSession = [...allSessions.filter((s) => s.type === 'upcoming')].sort(
            (a, b) => a.sessionNumber - b.sessionNumber
          )[0] || upcomingSessions[0]

          const sessionTime = nextSession.time || '17:30 - 19:00'
          const dayOfWeek = getDayOfWeekName(nextSession.date)
          const shortDate = formatDateNoYear(nextSession.date)

          return (
            <div className="pt-0.5 pb-1">
              <Popover>
                <PopoverTrigger asChild>
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
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="top"
                  className="w-80 p-3.5 space-y-3 text-xs z-50 shadow-lg border bg-popover text-popover-foreground rounded-2xl animate-in fade-in zoom-in-95 duration-150 text-left"
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="font-bold text-foreground text-xs uppercase tracking-wide">
                      Thông tin buổi học tiếp theo
                    </span>
                    <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950 px-1.5 py-0.5 rounded border border-sky-200/60">
                      Sắp tới
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="font-bold text-sm text-foreground leading-snug">{nextSession.topic}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {pkgIsEnglish ? 'IELTS Junior 1A • CLS-IELTS-001' : 'Toán Tư Duy STEM Rino • LD_TOAN_00010'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Thời gian:</span>
                        <span className="font-semibold text-foreground">{dayOfWeek}, {shortDate}</span>
                        <span className="text-muted-foreground block text-[11px] font-mono">{sessionTime}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Phòng học:</span>
                        <span className="font-semibold text-foreground">{nextSession.room || 'P.102 (Tầng 1)'}</span>
                        <span className="text-muted-foreground block text-[11px] truncate">RinoEdu Nguyễn Tuân</span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-border/40 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Giáo viên:</span>
                        <span className="font-semibold text-foreground">{nextSession.teacher || 'Sarah Smith'}</span>
                      </div>
                      {nextSession.assistant && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Trợ giảng:</span>
                          <span className="font-semibold text-foreground">{nextSession.assistant.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )
        })()}

        {/* Completed Regular Lessons */}
        {regularCompletedSessions.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-normal text-muted-foreground">
              <span>Các buổi học chính ({regularCompletedSessions.length})</span>
            </div>
            <div className="space-y-2">
              {regularCompletedSessions.map(renderSessionCard)}
            </div>
          </div>
        )}

        {/* Expand More Button */}
        {allSessions.length > 7 && (
          <div className="pt-1.5 text-center">
            <button
              type="button"
              onClick={() => setShowAllHistory(!showAllHistory)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-border/40 transition-all cursor-pointer"
            >
              <span>
                {showAllHistory
                  ? 'Thu gọn lịch sử'
                  : `Xem thêm lịch sử (${allSessions.length - 7} buổi cũ hơn)`}
              </span>
              {showAllHistory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
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
            <span className="text-xs text-muted-foreground font-normal">
              Hiển thị {testCompletedSessions.length}/{allTestSessions.length} bài kiểm tra
            </span>
          </div>

          <div className="space-y-2 pt-0.5">
            {testCompletedSessions.map(renderSessionCard)}
          </div>

          {/* Button xem thêm lịch sử (x bài cũ hơn) */}
          {allTestSessions.length > 1 && (
            <div className="pt-1.5 text-center">
              <button
                type="button"
                onClick={() => setShowAllTests(!showAllTests)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-border/40 transition-all cursor-pointer"
              >
                <span>
                  {showAllTests
                    ? 'Thu gọn lịch sử'
                    : `Xem thêm lịch sử (${allTestSessions.length - 1} bài cũ hơn)`}
                </span>
                {showAllTests ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
