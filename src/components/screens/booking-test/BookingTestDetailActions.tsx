'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared'
import type { BookingTest } from '@/mocks/bookingTests'

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

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {!['completed', 'cancelled', 'failed'].includes(booking.status) && (
          <Button
            variant="destructive"
            onClick={() => setConfirmCancelOpen(true)}
          >
            <XCircle className="h-4 w-4" />
            Hủy lịch test
          </Button>
        )}
        {booking.status === 'booked_assessment' && (
          <Button
            variant="outline"
            onClick={() =>
              onUpdateBooking(booking.id, (current) => ({
                ...current,
                status: 'started_assessment',
              }))
            }
          >
            Bắt đầu đánh giá
          </Button>
        )}
        {booking.status === 'started_assessment' && (
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
        <Button
          disabled={booking.subject !== 'english'}
          onClick={() => onOpenAssessment(booking.id)}
        >
          Mở đánh giá
        </Button>
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
