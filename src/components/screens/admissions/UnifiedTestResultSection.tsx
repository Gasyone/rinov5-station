'use client'

import React, { useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InlineSelect } from '@/components/controls'
import { cn } from '@/lib/utils'
import { getStatusColors } from '@/lib/statusColors'
import { PROGRAM_LEVELS, SUB_LEVELS } from '@/mocks/bookingTests'
import type { BookingTest } from '@/mocks/bookingTests'
import type { UnifiedSessionItem } from './unifiedSessionTypes'

interface UnifiedTestResultSectionProps {
  session: UnifiedSessionItem
  booking?: BookingTest
  hasTestScore: boolean
  isCheckedIn: boolean
  terminalStatus: { status: string; label: string } | null
  canEditPlacement?: boolean
  creatorName: string
  onCheckIn: (e?: React.MouseEvent) => void
  onDirectAssessment: (e?: React.MouseEvent) => void
  onOpenAssessment?: (bookingId: string) => void
  onOpenTeacherPicker?: () => void
  onUpdateBookingLevel?: (level: string, subLevel?: string) => void
}

export function UnifiedTestResultSection({
  session,
  booking,
  hasTestScore,
  isCheckedIn,
  terminalStatus,
  canEditPlacement = false,
  creatorName,
  onCheckIn,
  onDirectAssessment,
  onOpenAssessment,
  onOpenTeacherPicker,
  onUpdateBookingLevel,
}: UnifiedTestResultSectionProps) {
  const hasTeacher = Boolean(
    session.teacherName &&
    session.teacherName !== 'Chưa gán GV' &&
    session.teacherName !== 'Chưa gán' &&
    session.teacherName.trim() !== ''
  )

  const warningText = getStatusColors('warning').text
  const infoText = getStatusColors('info').text
  const successText = getStatusColors('success').text
  const scoreValue = booking?.testResult?.speakingScore || '0'
  const isPositiveScore = Number(scoreValue) > 0

  const hasLwrScore = Boolean(
    (booking?.testResult?.lwrLevel && booking.testResult.lwrLevel !== '-' && booking.testResult.lwrLevel !== '') ||
    (booking?.testResult?.lwr && booking.testResult.lwr !== '-' && booking.testResult.lwr !== '') ||
    (booking?.testResult?.lwrScore && booking.testResult.lwrScore !== '0' && booking.testResult.lwrScore !== '')
  )

  const lwrDisplay = hasLwrScore
    ? `${booking?.testResult?.lwrLevel && booking.testResult.lwrLevel !== '-' ? booking.testResult.lwrLevel : 'LWR'} - ${booking?.testResult?.lwr || '-'} - ${booking?.testResult?.lwrScore || '0'}`
    : (booking?.status === 'ipad_test_started' ? 'Đang làm bài...' : 'Chưa có')

  const [isBookingDetailsExpanded, setIsBookingDetailsExpanded] = useState(!hasTestScore)

  return (
    <>
      {/* 2. BODY BÊN TRONG: KẾT QUẢ ĐÁNH GIÁ TRÌNH ĐỘ */}
      <div className="p-3.5 space-y-3">
        <div className="space-y-2">
          {/* TRƯỜNG HỢP 1: CHƯA ĐIỂM DANH (CHƯA CHECK-IN) & CHƯA CÓ ĐIỂM */}
          {!hasTestScore && !isCheckedIn && terminalStatus?.status !== 'cancelled' && (
            <div className="flex flex-col items-center justify-center py-4 px-3 rounded-lg border border-dashed border-border/80 bg-muted/20 text-center gap-2.5">
              <div className="space-y-0.5">
                <p className="text-xs font-normal text-muted-foreground">
                  Học viên chưa điểm danh ca kiểm tra này
                </p>
                <p className="text-[11px] text-muted-foreground/75 font-normal">
                  Điểm danh khi học viên đến cơ sở, hoặc bấm nhận xét để đánh giá trực tiếp
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-0.5">
                <Button
                  type="button"
                  size="sm"
                  onClick={onCheckIn}
                  className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1.5"
                  title="Điểm danh (Check-in) cho học viên vào ca test"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Check in</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onDirectAssessment}
                  className="h-7 px-3 text-xs font-normal text-foreground hover:bg-muted cursor-pointer shadow-2xs gap-1.5"
                  title="Tự động Check-in và mở ngay hộp thoại đánh giá nhận xét"
                >
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Nhận xét</span>
                </Button>
              </div>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: ĐÃ ĐIỂM DANH (CHECK-IN) NHƯNG CHƯA CÓ ĐIỂM */}
          {!hasTestScore && isCheckedIn && terminalStatus?.status !== 'cancelled' && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border border-border/70 bg-muted/30">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                  <Check className="h-3 w-3 stroke-[2.5]" />
                </span>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-normal text-foreground">
                    Đã điểm danh (Check-in) • Sẵn sàng đánh giá
                  </p>
                  <p className="text-[11px] text-muted-foreground font-normal truncate">
                    Học viên đã có mặt tại cơ sở. Bấm Nhận xét để tiến hành kiểm tra & ghi điểm.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={() => booking && onOpenAssessment?.(booking.id)}
                className="h-7 px-3 text-xs font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-2xs gap-1.5 shrink-0"
                title="Mở form đánh giá và ghi nhận xét"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Nhận xét</span>
              </Button>
            </div>
          )}

          {/* TRƯỜNG HỢP CA BỊ HỦY CHƯA CÓ ĐIỂM */}
          {!hasTestScore && terminalStatus?.status === 'cancelled' && (
            <div className="py-3 px-3 rounded-lg border border-border/60 bg-muted/20 text-center text-xs text-muted-foreground font-normal">
              Ca kiểm tra này đã bị hủy.
            </div>
          )}

          {/* TRƯỜNG HỢP 3: CÓ ĐIỂM */}
          {hasTestScore && (
            <div className="space-y-2">
              {/* Trình độ đầu vào & Nhánh */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] font-normal">Trình độ đầu vào:</span>
                  <InlineSelect
                    value={booking?.testResult?.level ?? (booking?.expectedLevel || '')}
                    disabled={!canEditPlacement || terminalStatus?.status === 'cancelled'}
                    ariaLabel="Trình độ đầu vào"
                    options={[
                      { value: '', label: 'Chưa đặt' },
                      ...PROGRAM_LEVELS.map((level) => ({ value: level, label: level })),
                    ]}
                    onValueChange={(val) => onUpdateBookingLevel?.(val, booking?.testResult?.subLevel)}
                    className="h-7 text-xs border-solid shadow-2xs font-medium text-sky-700 dark:text-sky-300"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-muted-foreground text-[11px] font-normal">Nhánh trình độ:</span>
                  <InlineSelect
                    value={booking?.testResult?.subLevel ?? ''}
                    disabled={!canEditPlacement || terminalStatus?.status === 'cancelled'}
                    ariaLabel="Nhánh trình độ"
                    options={[
                      { value: '', label: '-' },
                      ...SUB_LEVELS.map((sub) => ({ value: sub, label: sub })),
                    ]}
                    onValueChange={(sub) => onUpdateBookingLevel?.(booking?.testResult?.level || '', sub)}
                    className="h-7 text-xs border-solid shadow-2xs font-normal"
                  />
                </div>
              </div>

              {/* Điểm số Speaking & LWR */}
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                {/* CỘT ĐIỂM SPEAKING */}
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[11px] font-normal text-muted-foreground block">
                    Điểm speaking
                  </span>
                  <div className="flex items-center justify-between gap-1.5 mt-0.5">
                    <div className="flex flex-wrap items-baseline gap-1.5 min-w-0">
                      <span className={cn('text-xs font-normal', warningText)}>
                        GV: {booking?.testResult?.speaking || 'chưa có'}
                      </span>
                      <span className={cn('text-xs font-normal', infoText)}>
                        AI: {booking?.testResult?.speakingAi || '0/0'}
                      </span>
                      <span className={cn('text-sm font-semibold', isPositiveScore ? successText : 'text-muted-foreground')}>
                        {scoreValue}
                      </span>
                    </div>

                    {booking && (
                      <button
                        type="button"
                        onClick={() => onOpenAssessment?.(booking.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-normal cursor-pointer shrink-0"
                        title="Mở modal nhận xét & đánh giá"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Nhận xét</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* CỘT ĐIỂM LWR */}
                <div className="min-w-0 space-y-0.5">
                  <span className="text-[11px] font-normal text-muted-foreground block">
                    Điểm LWR
                  </span>
                  <div className="flex items-center justify-between gap-1.5 mt-0.5">
                    <p
                      className="text-xs sm:text-[13px] font-normal text-foreground truncate min-w-0"
                      title={lwrDisplay}
                    >
                      {lwrDisplay}
                    </p>

                    {(booking?.testLink || booking?.resultLink) && (
                      <a
                        href={booking.testLink || booking.resultLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-normal shrink-0"
                        title="Xem kết quả bài làm từ iPad"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Kết quả</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. KHỐI THÔNG TIN CA ĐẶT LỊCH TEST */}
      <div className="border-t border-border/50 bg-muted/30 dark:bg-muted/20 px-3.5 py-2 text-xs">
        <div
          className="flex items-center justify-between gap-2 cursor-pointer select-none group"
          onClick={() => setIsBookingDetailsExpanded((prev) => !prev)}
          title={isBookingDetailsExpanded ? 'Thu gọn chi tiết ca' : 'Mở rộng chi tiết ca'}
        >
          {/* ĐẦU DÒNG: NGƯỜI PHỤ TRÁCH */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-muted-foreground">Phụ trách:</span>
            {hasTeacher ? (
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">{session.teacherName}</span>
                {onOpenTeacherPicker && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenTeacherPicker()
                    }}
                    className="text-primary hover:underline text-[11px] font-normal ml-0.5 cursor-pointer"
                    title="Đổi giáo viên phụ trách"
                  >
                    [Đổi]
                  </button>
                )}
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenTeacherPicker?.()
                }}
                className="h-5 px-1.5 text-[10.5px] font-normal text-primary border-primary/40 hover:bg-primary/10 cursor-pointer shadow-none bg-background"
              >
                + Gán phụ trách
              </Button>
            )}
          </div>

          {/* CUỐI DÒNG: LỊCH BOOKING • CƠ SỞ */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0 group-hover:text-foreground">
            <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-mono text-muted-foreground">
              {session.dateLabel}
            </span>
            <span>&bull;</span>
            <span className="font-normal text-foreground/80 group-hover:text-foreground">
              {session.school}
            </span>
            {isBookingDetailsExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
            )}
          </div>
        </div>

        {/* PHẦN MỞ RỘNG BÊN DƯỚI */}
        {isBookingDetailsExpanded && (
          <div className="pt-2 text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-muted-foreground">
              <div className="flex items-center justify-between gap-2">
                <span>Chương trình / Lớp:</span>
                <span className="font-normal text-foreground truncate max-w-[160px]">
                  {booking?.program || 'Station Program'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span>Trình độ dự kiến:</span>
                <span className="font-medium text-foreground">
                  {booking?.expectedLevel || session.testScoreSummary?.level || 'Kindie 3'}
                </span>
              </div>
            </div>

            {booking?.msg && (
              <div className="rounded bg-background/80 dark:bg-background/60 p-2 text-xs border border-border/40 text-foreground">
                <span className="font-medium text-muted-foreground mr-1.5">Ghi chú ca:</span>
                <span className="italic">{booking.msg}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] pt-1 text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Người tạo:</span>
                <span className="font-normal text-foreground">{creatorName}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
                <span className="font-normal text-foreground/80">#{session.id}</span>
                <span>&bull;</span>
                <span>
                  {booking?.testTime?.split(' ')[0] || session.rawDate?.split(' ')[0] || '2026-08-05'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
