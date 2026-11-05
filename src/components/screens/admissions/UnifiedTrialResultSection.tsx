'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
  Info,
  Plus,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { ClassCodeHoverCell } from '../care/ClassCodeHoverCell'
import type { UnifiedSessionItem } from './unifiedSessionTypes'
import type { TrialClass } from '@/mocks/trialClasses'

interface UnifiedTrialResultSectionProps {
  session: UnifiedSessionItem
  trial?: TrialClass
  isCheckedIn: boolean
  creatorName: string
  onCheckInTrial?: () => void
  onOpenAssign?: (mode: 'assign' | 'reschedule', trialId: string) => void
}

export function UnifiedTrialResultSection({
  session,
  trial,
  isCheckedIn,
  creatorName,
  onCheckInTrial,
  onOpenAssign,
}: UnifiedTrialResultSectionProps) {
  const session0 = trial?.sessions?.[0]
  const hasAssignedSessions = Boolean(
    (trial?.sessions && trial.sessions.length > 0 && session0?.classId) ||
    (session.trialSummary?.classId && session.trialSummary.classId !== 'CLS-NEW')
  )

  const assignedClassCode = session0?.classId || session.trialSummary?.classId || ''
  const assignedClassName = session0?.className || session.trialSummary?.className || trial?.program || 'Lớp học thử'
  const assignedSessionName = session0?.sessionName || session.trialSummary?.sessionName || 'Buổi 1'
  const assignedTrialDate = session0?.trialDate || session.dateLabel || ''

  const hasFeedback = Boolean(
    trial?.feedback?.comment ||
    trial?.feedback?.rating ||
    session.trialSummary?.feedbackComment ||
    session.trialSummary?.rating
  )
  const feedbackRating = trial?.feedback?.rating || session.trialSummary?.rating || 5
  const feedbackComment = trial?.feedback?.comment || session.trialSummary?.feedbackComment
  const recommendedLevel = trial?.feedback?.recommendedLevel

  // Mặc định mở nếu chưa có kết quả để dễ theo dõi/phân công, đóng nếu đã có kết quả
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(!hasFeedback)

  return (
    <div className="space-y-3">
      {/* ========================================================================= */}
      {/* PHẦN 1: KẾT QUẢ ĐÁNH GIÁ HỌC THỬ (ĐẦY ĐỦ 3 GIAI ĐOẠN)                     */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        {/* GIAI ĐOẠN 1: CHƯA GHÉP LỚP */}
        {!hasAssignedSessions && (
          <div className="flex flex-col items-center justify-center py-4 px-3 rounded-lg border border-dashed border-border/80 bg-muted/20 text-center gap-2">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-foreground">
                Chưa ghép lớp học thử
              </p>
              <p className="text-[11px] text-muted-foreground font-normal">
                Học viên chưa được xếp vào lớp và buổi học thử nào. Vui lòng ghép lớp phù hợp với trình độ.
              </p>
            </div>

            {trial && onOpenAssign && (
              <Button
                type="button"
                size="sm"
                onClick={() => onOpenAssign('assign', trial.id)}
                className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1.5 mt-1"
                title="Chọn lớp và buổi học thử cho học viên"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Ghép lớp học thử</span>
              </Button>
            )}
          </div>
        )}

        {/* GIAI ĐOẠN 2A: ĐÃ GHÉP LỚP NHƯNG CHƯA CHECK-IN & CHƯA CÓ KẾT QUẢ */}
        {hasAssignedSessions && !hasFeedback && !isCheckedIn && trial?.status !== 'cancelled' && (
          <div className="flex flex-col items-center justify-center py-4 px-3 rounded-lg border border-dashed border-border/80 bg-muted/20 text-center gap-2.5">
            <div className="space-y-0.5">
              <p className="text-xs font-normal text-muted-foreground">
                Đã ghép lớp • Chưa điểm danh học thử
              </p>
              <p className="text-[11px] text-muted-foreground/75 font-normal">
                Buổi học: <span className="font-medium text-foreground">{assignedSessionName}</span> vào lúc{' '}
                <span className="font-medium text-foreground">{assignedTrialDate}</span> ({session.school})
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-0.5">
              <Button
                type="button"
                size="sm"
                onClick={onCheckInTrial}
                className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1.5"
                title="Điểm danh (Check-in) cho học viên vào lớp học thử"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Check in</span>
              </Button>

              {trial && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.open(`/app/trial_class/feedback/${trial.id}`, '_blank')
                  }}
                  className="h-7 px-3 text-xs font-normal text-foreground hover:bg-muted cursor-pointer shadow-2xs gap-1.5"
                  title="Mở biểu mẫu ghi nhận xét & đánh giá buổi học thử"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Nhận xét</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* GIAI ĐOẠN 2B: ĐÃ ĐIỂM DANH (CHECK-IN) NHƯNG CHƯA CÓ KẾT QUẢ/NHẬN XÉT */}
        {hasAssignedSessions && !hasFeedback && isCheckedIn && trial?.status !== 'cancelled' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border border-border/70 bg-muted/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                <Check className="h-3 w-3 stroke-[2.5]" />
              </span>
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs font-normal text-foreground">
                  Đã điểm danh (Check-in) • Sẵn sàng nhận xét
                </p>
                <p className="text-[11px] text-muted-foreground font-normal truncate">
                  Học viên đã vào lớp. Bấm Nhận xét để ghi nhận đánh giá chuyên môn của giáo viên.
                </p>
              </div>
            </div>

            {trial && (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  window.open(`/app/trial_class/feedback/${trial.id}`, '_blank')
                }}
                className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1.5 shrink-0"
                title="Mở form nhận xét buổi học thử"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Nhận xét</span>
              </Button>
            )}
          </div>
        )}

        {/* GIAI ĐOẠN 3: ĐÃ CÓ KẾT QUẢ & NHẬN XÉT */}
        {hasFeedback && (
          <div className="space-y-2">
            {/* Đánh giá sao & Đề xuất trình độ */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md bg-muted/30 border border-border/50">
              <div className="flex items-center gap-1.5 text-amber-500 font-medium text-xs">
                <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                <span className="text-xs font-semibold">{feedbackRating}/5 sao</span>
              </div>

              {recommendedLevel && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">Đề xuất xếp lớp:</span>
                  <span className="font-semibold text-foreground px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    {recommendedLevel}
                  </span>
                </div>
              )}
            </div>

            {/* Nhận xét giáo viên */}
            {feedbackComment && (
              <div className="rounded-md border border-border/60 bg-background/80 p-2.5 text-xs">
                <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Nhận xét của giáo viên {trial?.owner ? `(${trial.owner})` : ''}:
                </span>
                <p className="italic text-foreground leading-relaxed">
                  &ldquo;{feedbackComment}&rdquo;
                </p>
              </div>
            )}

            {/* Link chi tiết */}
            {trial && (
              <div className="pt-0.5 flex items-center justify-end">
                <a
                  href={`/app/trial_class/feedback/${trial.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline font-normal inline-flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Xem trang nhận xét chi tiết</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PHẦN 2: LỚP GHÉP VÀ BUỔI HỌC THỬ (ĐỔI PHỤ TRÁCH THÀNH BUỔI GHÉP)         */}
      {/* ========================================================================= */}
      <div className="border-t border-border/50 bg-muted/30 dark:bg-muted/20 -mx-3.5 -mb-3.5 px-3.5 py-2 text-xs">
        {/* Header tóm tắt thanh ngang: Buổi ghép + Tên buổi + Đổi buổi + Lịch • Cơ sở */}
        <div
          className="flex items-center justify-between gap-2 cursor-pointer select-none group"
          onClick={() => setIsDetailsExpanded((prev) => !prev)}
          title={isDetailsExpanded ? 'Thu gọn chi tiết' : 'Mở rộng chi tiết'}
        >
          {/* ĐẦU DÒNG: BUỔI GHÉP, TÊN BUỔI, NÚT ĐỔI BUỔI, HOVER XEM THÔNG TIN BUỔI */}
          <div className="flex items-center gap-1.5 min-w-0" onClick={(e) => e.stopPropagation()}>
            <span className="text-muted-foreground shrink-0 font-normal">Buổi ghép:</span>
            {hasAssignedSessions ? (
              <div className="flex items-center gap-1 min-w-0">
                {/* Hover vào buổi để xem thông tin chi tiết buổi học */}
                <HoverCard openDelay={150} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline cursor-pointer truncate max-w-[180px] sm:max-w-[220px] text-left inline-flex items-center gap-1"
                      title="Rê chuột xem thông tin chi tiết buổi học thử"
                    >
                      <span className="truncate">{assignedSessionName}</span>
                      <Info className="h-3 w-3 opacity-60 shrink-0" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-3 text-xs space-y-2.5 z-50 shadow-md border bg-popover text-popover-foreground" align="start">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                      <BookOpen className="h-4 w-4 text-primary shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-xs truncate">
                          {assignedSessionName}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {session0?.sessionId || 'SESS-TRIAL'} &bull; {assignedClassName}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Lịch học:</span>
                        <span className="font-mono text-foreground">{assignedTrialDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Cơ sở / Phòng:</span>
                        <span className="text-foreground">{session.school} • {session.room || 'Phòng 201'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Giáo viên:</span>
                        <span className="font-medium text-foreground">{trial?.owner || session.teacherName || 'Ms. Sarah'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Trợ giảng (TG):</span>
                        <span className="text-foreground">{trial?.assistant || 'Trợ giảng'}</span>
                      </div>
                      {trial?.sessionContent?.topic && (
                        <div className="pt-1 border-t border-border/40 text-[11px]">
                          <span className="text-muted-foreground">Chủ đề bài học: </span>
                          <span className="text-foreground italic">{trial.sessionContent.topic}</span>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>

                {/* NÚT ĐỔI BUỔI */}
                {trial && onOpenAssign && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenAssign('reschedule', trial.id)
                    }}
                    className="text-primary hover:underline text-[11px] font-normal shrink-0 cursor-pointer ml-1"
                    title="Đổi buổi học thử sang lớp/ca khác"
                  >
                    [Đổi buổi]
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground italic text-xs">Chưa ghép buổi</span>
                {trial && onOpenAssign && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenAssign('assign', trial.id)
                    }}
                    className="h-5 px-1.5 text-[10.5px] font-normal text-primary border-primary/40 hover:bg-primary/10 cursor-pointer shadow-none bg-background ml-1"
                  >
                    + Ghép lớp
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* CUỐI DÒNG: LỊCH BOOKING • CƠ SỞ + ICON BUNG MỞ / THU GỌN */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0 group-hover:text-foreground">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-mono text-muted-foreground">
              {assignedTrialDate || session.dateLabel}
            </span>
            <span>&bull;</span>
            <span className="font-normal text-foreground/80 group-hover:text-foreground">
              {session.school}
            </span>
            {isDetailsExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
            )}
          </div>
        </div>

        {/* PHẦN THÔNG TIN BÊN DƯỚI: CHƯƠNG TRÌNH, MÃ LỚP, BUỔI HỌC */}
        {isDetailsExpanded && (
          <div className="pt-2 text-xs space-y-2 border-t border-border/40 mt-1.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-1.5 text-muted-foreground">
              {/* 1. Chương trình */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] text-muted-foreground">Chương trình:</span>
                <span className="font-medium text-foreground truncate" title={trial?.program || session.subjectLabel}>
                  {trial?.program || session.subjectLabel || 'Chương trình Station'}
                </span>
              </div>

              {/* 2. Mã lớp (Có thể hover mở Popover thông tin, tái sử dụng ClassCodeHoverCell) */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] text-muted-foreground">Mã lớp:</span>
                {assignedClassCode && assignedClassCode !== 'CLS-NEW' ? (
                  <div className="w-fit" onClick={(e) => e.stopPropagation()}>
                    <ClassCodeHoverCell
                      classCode={assignedClassCode}
                      subject={trial?.subject || 'Tiếng Anh'}
                      level={trial?.program || 'Cambridge Starter'}
                      teacherCode={trial?.owner || session.teacherName || 'GV'}
                      schedule={assignedTrialDate || session.dateLabel}
                      openInNewTab={true}
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground italic text-xs">Chưa có</span>
                )}
              </div>

              {/* 3. Buổi học (Có thể hover xem chi tiết buổi học) */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[11px] text-muted-foreground">Buổi học:</span>
                {hasAssignedSessions ? (
                  <HoverCard openDelay={150} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <span className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer truncate" title={assignedSessionName}>
                        {assignedSessionName}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72 p-2.5 text-xs z-50 bg-popover" align="start">
                      <p className="font-semibold text-foreground text-xs">{assignedSessionName}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{assignedTrialDate} &bull; {session.room || 'Phòng 201'}</p>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <span className="text-muted-foreground italic text-xs">Chưa có</span>
                )}
              </div>
            </div>

            {/* Ghi chú ca học thử */}
            {(trial?.notes || session.trialSummary?.feedbackComment) && (
              <div className="rounded bg-background/80 dark:bg-background/60 p-2 text-xs border border-border/40 text-foreground">
                <span className="font-medium text-muted-foreground mr-1.5">Ghi chú ca:</span>
                <span className="italic">{trial?.notes || session.trialSummary?.feedbackComment}</span>
              </div>
            )}

            {/* Dòng cuối: Người tạo và Mã ca • Ngày tạo */}
            <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Người tạo:</span>
                <span className="font-normal text-foreground">{creatorName}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
                <span className="font-normal text-foreground/80">#{session.id}</span>
                <span>&bull;</span>
                <span>
                  {trial?.auditLog?.[0]?.timestamp?.split(' ')[0] || session.rawDate?.split(' ')[0] || '2026-05-18'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
