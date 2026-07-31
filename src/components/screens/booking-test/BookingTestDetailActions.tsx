'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { BookingTest } from '@/mocks/bookingTests'
import {
  applyBookingCheckIn,
  isTerminalBookingStatus,
  shouldShowCheckInAction,
} from './bookingTestHelpers'

interface BookingTestDetailActionsProps {
  booking: BookingTest
  onUpdateBooking: (bookingId: string, updater: (booking: BookingTest) => BookingTest) => void
  onOpenAssessment: (bookingId: string) => void
}

export function BookingTestDetailActions({
  booking,
  onUpdateBooking,
  onOpenAssessment,
}: BookingTestDetailActionsProps) {
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const canCheckIn = shouldShowCheckInAction(booking)
  const canCancel = !isTerminalBookingStatus(booking.status)
  const isAssessing = booking.status === 'checkin'

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Chỉ hiện nút check-in khi chưa check-in */}
        {canCheckIn && (
          <Button
            variant="outline"
            className={getStatusBadgeClass('checkin')}
            onClick={() =>
              onUpdateBooking(booking.id, (current) => applyBookingCheckIn(current))
            }
          >
            <UserCheck className="h-4 w-4" />
            Check-in học viên
          </Button>
        )}

        {canCancel && (
          <Button
            variant="destructive"
            onClick={() => setConfirmCancelOpen(true)}
          >
            <XCircle className="h-4 w-4" />
            Hủy lịch
          </Button>
        )}

        {isAssessing && (
          <>
            <Button
              variant="outline"
              onClick={() =>
                onUpdateBooking(booking.id, (current) => ({ ...current, status: 'failed' }))
              }
            >
              <XCircle className="h-4 w-4" />
              Không đạt
            </Button>
            <Button
              onClick={() =>
                onUpdateBooking(booking.id, (current) => ({ ...current, status: 'completed' }))
              }
            >
              <CheckCircle className="h-4 w-4" />
              Hoàn tất
            </Button>
          </>
        )}
        {booking.subject === 'english' && booking.teacher?.trim() && isAssessing && (
          <Button
            onClick={() => onOpenAssessment(booking.id)}
          >
            Mở đánh giá
          </Button>
        )}
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
