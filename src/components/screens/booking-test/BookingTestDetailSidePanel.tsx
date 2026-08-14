'use client'

import type { BookingTest } from '@/mocks/bookingTests'

interface BookingTestDetailSidePanelProps {
  booking: BookingTest
}

export function BookingTestDetailSidePanel({ booking }: BookingTestDetailSidePanelProps) {
  const historyItems = (booking.notes && booking.notes.length > 0)
    ? booking.notes
    : booking.msg
    ? [{ text: booking.msg, author: booking.createdBy || 'Hệ thống', timestamp: '2026-08-05 09:30' }]
    : []

  if (historyItems.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic py-2">
        Chưa có lịch sử thao tác.
      </p>
    )
  }

  return (
    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
      {historyItems.map((item, idx) => (
        <div key={idx} className="relative pl-3 border-l-2 border-primary/30 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="font-semibold text-foreground">{item.author}</span>
            <span className="text-[11px] font-mono">{item.timestamp}</span>
          </div>
          <p className="font-normal text-foreground mt-1 leading-relaxed">{item.text}</p>
        </div>
      ))}
    </div>
  )
}
