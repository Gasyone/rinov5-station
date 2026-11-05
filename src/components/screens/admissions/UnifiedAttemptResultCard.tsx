'use client'

import React, { useState, useMemo } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import { isTerminalBookingStatus } from '../booking-test/bookingTestHelpers'
import { UnifiedTestResultSection } from './UnifiedTestResultSection'
import { UnifiedTrialResultSection } from './UnifiedTrialResultSection'
import type { UnifiedSessionItem } from './unifiedSessionTypes'

interface UnifiedAttemptResultCardProps {
  session: UnifiedSessionItem
  attemptNumber: number
  isFocused?: boolean
  canEditPlacement?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  onOpenAssessment?: (bookingId: string) => void
  onOpenTeacherPicker?: () => void
  onOpenAssign?: (mode: 'assign' | 'reschedule', trialId: string) => void
  onUpdateBookingLevel?: (level: string, subLevel?: string) => void
  onSelectAsFocus?: () => void
  onCancelBooking?: (bookingId: string) => void
  onCheckInBooking?: (bookingId: string) => void
  onCompleteBooking?: (bookingId: string) => void
  onApproveTrial?: (trialId: string) => void
  onRejectTrial?: (trialId: string) => void
  onCancelTrial?: (trialId: string) => void
  onCheckInTrial?: (trialId: string) => void
}

export function UnifiedAttemptResultCard({
  session,
  attemptNumber,
  isFocused = false,
  canEditPlacement = false,
  collapsible = false,
  defaultCollapsed = false,
  onOpenAssessment,
  onOpenTeacherPicker,
  onOpenAssign,
  onUpdateBookingLevel,
  onCancelBooking,
  onCheckInBooking,
  onCompleteBooking,
  onApproveTrial,
  onRejectTrial,
  onCancelTrial,
  onCheckInTrial,
}: UnifiedAttemptResultCardProps) {
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const [confirmTrialAction, setConfirmTrialAction] = useState<{
    type: 'cancel' | 'reject'
    title: string
    description: string
  } | null>(null)
  const [isCardExpanded, setIsCardExpanded] = useState(!defaultCollapsed)
  const isTest = session.type === 'test'
  const booking = session.sourceBooking
  const trial = session.sourceTrial
  const creatorName =
    session.creatorName ||
    booking?.createdBy ||
    booking?.ops ||
    trial?.creator ||
    'Nguyen Thi Ha'

  // Trạng thái điểm danh & hoàn tất lạc quan (optimistic) để giao diện phản hồi tức thì
  const [localCheckedIn, setLocalCheckedIn] = useState(false)
  const [localCompleted, setLocalCompleted] = useState(false)
  const [prevBookingId, setPrevBookingId] = useState(booking?.id)
  if (booking?.id !== prevBookingId) {
    setPrevBookingId(booking?.id)
    setLocalCheckedIn(false)
    setLocalCompleted(false)
  }

  // Quyền hành động trên ca test
  const canCancel = isTest && booking ? !isTerminalBookingStatus(booking.status) : false

  const scoreValue = booking?.testResult?.speakingScore || '0'
  const isPositiveScore = Number(scoreValue) > 0

  const hasLwrScore = Boolean(
    (booking?.testResult?.lwrLevel && booking.testResult.lwrLevel !== '-' && booking.testResult.lwrLevel !== '') ||
    (booking?.testResult?.lwr && booking.testResult.lwr !== '-' && booking.testResult.lwr !== '') ||
    (booking?.testResult?.lwrScore && booking.testResult.lwrScore !== '0' && booking.testResult.lwrScore !== '')
  )

  const hasSpeakingScore = Boolean(
    isPositiveScore ||
    (booking?.testResult?.speaking &&
      booking.testResult.speaking !== '-' &&
      booking.testResult.speaking !== 'chưa có' &&
      booking.testResult.speaking.trim() !== '')
  )

  const hasPlacementLevel = Boolean(
    booking?.testResult?.level &&
    booking.testResult.level !== 'Chưa đặt' &&
    booking.testResult.level.trim() !== ''
  )

  // Ca kiểm tra có điểm khi đã có điểm Speaking, LWR, trình độ xếp lớp hoặc đã thi xong
  const hasTestScore = isTest
    ? Boolean(
        hasSpeakingScore ||
        hasLwrScore ||
        hasPlacementLevel ||
        booking?.isTested ||
        booking?.status === 'completed' ||
        booking?.status === 'failed'
      )
    : Boolean(trial?.feedback || session.trialSummary?.rating)

  const isNoShow = isTest
    ? (booking?.attendance === 'declined' || booking?.status === 'cancelled')
    : (trial?.status === 'no_show')

  const isCheckedIn = isTest
    ? Boolean(
        localCheckedIn ||
        booking?.attendance === 'confirmed' ||
        (booking?.status && ['checkin', 'ipad_test_started', 'assessing', 'completed', 'tested'].includes(booking.status))
      )
    : (trial?.status === 'completed' || trial?.status === 'confirmed')

  // Thao tác Check-in tại chỗ
  const handleCheckIn = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!booking) return
    setLocalCheckedIn(true)
    onCheckInBooking?.(booking.id)
  }

  // Thao tác Nhận xét khi chưa điểm danh: Vừa check-in vừa mở modal nhận xét
  const handleDirectAssessment = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!booking) return
    setLocalCheckedIn(true)
    onCheckInBooking?.(booking.id)
    onOpenAssessment?.(booking.id)
  }

  // Kiểm tra ca học thử đã được ghép lớp và buổi hay chưa
  const session0 = trial?.sessions?.[0]
  const hasAssignedSessions = Boolean(
    (trial?.sessions && trial.sessions.length > 0 && session0?.classId) ||
    (session.trialSummary?.classId && session.trialSummary.classId !== 'CLS-NEW')
  )

  // Xác định trạng thái cuối (terminal status) chuẩn cho section (Hoàn tất, Đã hủy, Không đạt, Không đến, Từ chối)
  const terminalStatus = useMemo<{ status: string; label: string } | null>(() => {
    if (isTest) {
      if (localCompleted || booking?.status === 'completed' || session.status === 'completed') {
        return { status: 'completed', label: 'Hoàn tất' }
      }
      if (booking?.status === 'cancelled' || session.status === 'cancelled') {
        return { status: 'cancelled', label: 'Đã hủy' }
      }
      if (booking?.status === 'failed' || session.status === 'failed') {
        return { status: 'failed', label: 'Không đạt' }
      }
      if (booking?.attendance === 'declined') {
        return { status: 'failed', label: 'Không đến' }
      }
      return null
    }

    if (trial?.status === 'completed' || session.status === 'completed') {
      return { status: 'completed', label: 'Hoàn tất' }
    }
    if (trial?.status === 'cancelled' || session.status === 'cancelled') {
      return { status: 'cancelled', label: 'Đã hủy' }
    }
    if (trial?.status === 'no_show' || session.status === 'no_show') {
      return { status: 'failed', label: 'Không đến' }
    }
    if (trial?.status === 'rejected' || session.status === 'rejected') {
      return { status: 'rejected', label: 'Từ chối' }
    }
    return null
  }, [isTest, localCompleted, booking?.status, booking?.attendance, trial?.status, session.status])

  // Điều kiện hiển thị nút Hoàn tất: khi đã có đầy đủ kết quả nhưng chưa chuyển trạng thái cuối
  const canComplete = isTest && booking ? (hasTestScore && !terminalStatus) : false

  // Thao tác Hoàn tất ca kiểm tra
  const handleComplete = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!booking) return
    setLocalCompleted(true)
    onCompleteBooking?.(booking.id)
  }

  return (
    <div className="rounded-lg border border-border/70 bg-card overflow-hidden text-xs shadow-2xs">
      {/* 1. HEADER CỦA LẦN: Thanh ngang phẳng, gọn gàng */}
      <div
        className={cn(
          "flex items-center justify-between px-3.5 py-1.5 bg-muted/40 text-xs select-none",
          isCardExpanded ? "border-b border-border/50" : "",
          collapsible && "cursor-pointer hover:bg-muted/60 transition-colors"
        )}
        onClick={() => {
          if (collapsible) {
            setIsCardExpanded((prev) => !prev)
          }
        }}
      >
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="font-normal text-muted-foreground text-[11px] px-1.5 py-0.2 bg-background font-mono">
            Lần {attemptNumber}
          </Badge>
          <span className="font-normal text-muted-foreground text-xs">
            {isTest ? 'Kiểm tra' : 'Học thử'}
          </span>

          {/* ICON ĐIỂM DANH: ĐƯA CHECK TÍCH VÀO NGAY SAU TÊN KIỂM TRA (ĐÃ BỎ CHỮ ĐẦU VÀO) */}
          {!isNoShow && isCheckedIn && (
            <span
              className="inline-flex items-center justify-center h-4.5 w-4.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0 shadow-3xs"
              title="Đã check-in"
            >
              <Check className="h-2.5 w-2.5 stroke-[2.5]" />
            </span>
          )}

          {isNoShow && (
            <span
              className="inline-flex items-center justify-center h-4.5 w-4.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shrink-0 shadow-3xs"
              title="Không đến"
            >
              <X className="h-2.5 w-2.5 stroke-[2.5]" />
            </span>
          )}

          {isFocused && (
            <span className="text-[10px] bg-primary/10 text-primary font-normal px-1.5 py-0.2 rounded ml-0.5">
              Đang xem
            </span>
          )}

          {/* TÓM TẮT TRÌNH ĐỘ KHI THU GỌN */}
          {collapsible && !isCardExpanded && (
            <span className="text-[11px] text-muted-foreground ml-1 truncate max-w-[200px]">
              &bull; {booking?.testResult?.level || session.testScoreSummary?.level || (isTest ? 'Chưa đặt' : 'Đã học thử')}
              {isPositiveScore ? ` (${scoreValue}đ)` : ''}
            </span>
          )}
        </div>

        {/* NÚT THAO TÁC HOẶC TRẠNG THÁI CUỐI BÊN PHẢI */}
        <div className="flex items-center gap-1.5">
          {terminalStatus && (
            <StatusBadge
              status={terminalStatus.status}
              label={terminalStatus.label}
              className="text-[10px] py-0 px-1.5 h-4.5 font-normal"
            />
          )}

          {/* ACTION BUTTONS DÀNH CHO CA KIỂM TRA (TEST) */}
          {isTest && !terminalStatus && canComplete && (
            <Button
              type="button"
              size="sm"
              onClick={handleComplete}
              className="h-5 px-2 text-[10.5px] font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-none gap-1"
              title="Xác nhận hoàn tất ca kiểm tra"
            >
              <Check className="h-3 w-3" />
              <span>Hoàn tất</span>
            </Button>
          )}

          {isTest && !terminalStatus && booking && canCancel && isCardExpanded && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setConfirmCancelOpen(true)
              }}
              className="h-5 px-1.5 text-[10.5px] font-normal text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shadow-none"
              title="Hủy ca kiểm tra này"
            >
              Hủy lịch
            </Button>
          )}

          {/* ACTION BUTTONS DÀNH CHO SECTION HỌC THỬ (THEO TRẠNG THÁI CỦA HỌC THỬ) */}
          {!isTest && trial && isCardExpanded && (
            <>
              {/* 1. Trạng thái Chờ duyệt (pending_approval) */}
              {trial.status === 'pending_approval' && (
                hasAssignedSessions ? (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onApproveTrial?.(trial.id)
                      }}
                      className="h-5 px-2 text-[10.5px] font-normal bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-none gap-1"
                      title="Xác nhận ghép lớp học thử"
                    >
                      <Check className="h-3 w-3" />
                      <span>Xác nhận ghép</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setConfirmTrialAction({
                          type: 'reject',
                          title: 'Từ chối ghép lớp',
                          description: 'Bạn có chắc chắn muốn từ chối ghép lớp học thử này?',
                        })
                      }}
                      className="h-5 px-1.5 text-[10.5px] font-normal text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shadow-none gap-0.5"
                      title="Từ chối ghép lớp học thử"
                    >
                      <X className="h-3 w-3" />
                      <span>Từ chối</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenAssign?.('assign', trial.id)
                    }}
                    className="h-5 px-2 text-[10.5px] font-normal bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-none gap-1"
                    title="Ghép lớp học thử cho học viên"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Ghép lớp</span>
                  </Button>
                )
              )}

              {/* 2. Trạng thái Đã xác nhận / Cần đổi ca (confirmed, reschedule) */}
              {(trial.status === 'confirmed' || trial.status === 'reschedule') && (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenAssign?.('reschedule', trial.id)
                    }}
                    className="h-5 px-2 text-[10.5px] font-normal text-primary border-primary/40 hover:bg-primary/10 cursor-pointer shadow-none"
                    title="Đổi buổi học thử sang lớp hoặc ca khác"
                  >
                    Đổi buổi
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setConfirmTrialAction({
                        type: 'cancel',
                        title: 'Hủy lịch học thử',
                        description: 'Bạn có chắc chắn muốn hủy ca học thử này?',
                      })
                    }}
                    className="h-5 px-1.5 text-[10.5px] font-normal text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer shadow-none"
                    title="Hủy lịch học thử này"
                  >
                    Hủy lịch
                  </Button>
                </div>
              )}

              {/* 3. Trạng thái Từ chối (rejected): cho phép ghép lại */}
              {trial.status === 'rejected' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenAssign?.('assign', trial.id)
                  }}
                  className="h-5 px-2 text-[10.5px] font-normal text-primary border-primary/40 hover:bg-primary/10 cursor-pointer shadow-none gap-1"
                  title="Ghép lại lớp học thử"
                >
                  <Plus className="h-3 w-3" />
                  <span>Ghép lại lớp</span>
                </Button>
              )}

              {/* 4. Trạng thái Không đến (no_show): cho phép ghép lại */}
              {trial.status === 'no_show' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenAssign?.('assign', trial.id)
                  }}
                  className="h-5 px-2 text-[10.5px] font-normal text-primary border-primary/40 hover:bg-primary/10 cursor-pointer shadow-none"
                  title="Ghép lại buổi học thử"
                >
                  Ghép lại
                </Button>
              )}
            </>
          )}

          {collapsible && (
            <span className="text-muted-foreground hover:text-foreground ml-0.5">
              {isCardExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </span>
          )}
        </div>
      </div>

      {isCardExpanded && (
        <>
          {isTest ? (
            <UnifiedTestResultSection
              session={session}
              booking={booking}
              hasTestScore={hasTestScore}
              isCheckedIn={isCheckedIn}
              terminalStatus={terminalStatus}
              canEditPlacement={canEditPlacement}
              creatorName={creatorName}
              onCheckIn={handleCheckIn}
              onDirectAssessment={handleDirectAssessment}
              onOpenAssessment={onOpenAssessment}
              onOpenTeacherPicker={onOpenTeacherPicker}
              onUpdateBookingLevel={onUpdateBookingLevel}
            />
          ) : (
            /* 2 & 3. SECTION HỌC THỬ (BAO GỒM 3 GIAI ĐOẠN KẾT QUẢ VÀ LỚP GHÉP / BUỔI HỌC) */
            <div className="p-3.5">
              <UnifiedTrialResultSection
                session={session}
                trial={trial}
                isCheckedIn={isCheckedIn}
                creatorName={creatorName}
                onCheckInTrial={() => {
                  setLocalCheckedIn(true)
                  if (trial) {
                    onCheckInTrial?.(trial.id)
                  }
                }}
                onOpenAssign={onOpenAssign}
              />
            </div>
          )}
        </>
      )}

      {/* Hộp thoại xác nhận hủy lịch ca này */}
      {isTest && booking && (
        <ConfirmDialog
          open={confirmCancelOpen}
          onOpenChange={setConfirmCancelOpen}
          title={`Hủy ca kiểm tra #${booking.id}?`}
          description="Ca kiểm tra này sẽ chuyển sang trạng thái Đã hủy và không còn được xem là lịch đánh giá đang hoạt động."
          confirmLabel="Hủy ca test"
          variant="destructive"
          onConfirm={() => onCancelBooking?.(booking.id)}
        />
      )}

      {/* Hộp thoại xác nhận thao tác của ca học thử (Hủy lịch / Từ chối) */}
      {!isTest && confirmTrialAction && (
        <ConfirmDialog
          open={Boolean(confirmTrialAction)}
          onOpenChange={(open) => {
            if (!open) setConfirmTrialAction(null)
          }}
          title={confirmTrialAction.title}
          description={confirmTrialAction.description}
          confirmLabel={confirmTrialAction.type === 'cancel' ? 'Hủy lịch' : 'Từ chối'}
          onConfirm={() => {
            if (!trial) return
            if (confirmTrialAction.type === 'cancel') {
              onCancelTrial?.(trial.id)
            } else if (confirmTrialAction.type === 'reject') {
              onRejectTrial?.(trial.id)
            }
            setConfirmTrialAction(null)
          }}
          variant="destructive"
        />
      )}
    </div>
  )
}
