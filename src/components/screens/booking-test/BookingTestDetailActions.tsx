'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared'
import type { BookingTest } from '@/mocks/bookingTests'
import {
  applyBookingCheckIn,
  isTerminalBookingStatus,
  shouldShowCheckInAction,
} from './bookingTestHelpers'

interface BookingTestDetailActionsProps {
  booking: BookingTest
  onOpenChange: (open: boolean) => void
  onUpdateBooking: (bookingId: string, updater: (booking: BookingTest) => BookingTest) => void
  onOpenAssessment: (bookingId: string) => void
}

export function BookingTestDetailActions({
  booking,
  onOpenChange,
  onUpdateBooking,
  onOpenAssessment,
}: BookingTestDetailActionsProps) {
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const canCheckIn = shouldShowCheckInAction(booking)
  const canCancel = !isTerminalBookingStatus(booking.status)
  const isAssessing = booking.status === 'checkin'

  return (
    <>
      <div className="flex w-full items-center justify-between gap-2">
        {/* Left side: Quiet text action */}
        <div>
          {canCancel && (
            <Button
              variant="ghost"
              className="text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setConfirmCancelOpen(true)}
            >
              Hủy lịch test
            </Button>
          )}
          {!canCancel && isAssessing && (
            <Button
              variant="ghost"
              className="text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() =>
                onUpdateBooking(booking.id, (current) => ({ ...current, status: 'failed' }))
              }
            >
              Không đạt
            </Button>
          )}
        </div>

        {/* Right side: Close & Primary Action */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>

          {canCheckIn && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                onUpdateBooking(booking.id, (current) => applyBookingCheckIn(current))
              }
            >
              Check-in học viên
            </Button>
          )}

          {isAssessing && booking.subject === 'english' && booking.teacher?.trim() && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => onOpenAssessment(booking.id)}
            >
              Mở đánh giá
            </Button>
          )}

          {isAssessing && (!booking.teacher?.trim() || booking.subject !== 'english') && (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() =>
                onUpdateBooking(booking.id, (current) => ({ ...current, status: 'completed' }))
              }
            >
              Hoàn tất
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmCancelOpen}
        onOpenChange={setConfirmCancelOpen}
        title="Hủy lịch test?"
        description="Lịch test này sẽ chuyển sang trạng thái Đã hủy và không còn được xem là lịch đánh giá đang hoạt động."
        confirmLabel="Hủy lịch test"
        variant="destructive"
        onConfirm={() =>
          onUpdateBooking(booking.id, (current) => ({ ...current, status: 'cancelled' }))
        }
      />
    </>
  )
}
