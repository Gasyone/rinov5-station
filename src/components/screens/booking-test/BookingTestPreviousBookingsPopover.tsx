'use client'

import { useState } from 'react'
import { History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { StatusBadge } from '@/components/shared'
import type { BookingTest } from '@/mocks/bookingTests'
import { formatTestTimeWithDay, getStatusLabel } from './bookingTestHelpers'

interface BookingTestPreviousBookingsPopoverProps {
  booking: BookingTest
  previousBookings: BookingTest[]
  onSwitchBooking: (booking: BookingTest) => void
}

export function BookingTestPreviousBookingsPopover({
  booking,
  previousBookings,
  onSwitchBooking,
}: BookingTestPreviousBookingsPopoverProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (prev: BookingTest) => {
    setOpen(false)
    onSwitchBooking(prev)
  }

  if (previousBookings.length === 0) {
    return (
      <Badge variant="outline" className="text-xs font-medium h-5 px-1.5 text-muted-foreground">
        Lần 1
      </Badge>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 text-xs font-normal gap-1 text-primary hover:text-primary/80 shrink-0 cursor-pointer"
          title="Xem lịch sử các lần test trước đó"
        >
          <History className="h-3.5 w-3.5 text-primary" />
          <span>{previousBookings.length} lần test khác</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-84 p-3 shadow-lg bg-popover z-50">
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-foreground">
              Lịch sử test ({previousBookings.length + 1} lần)
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {booking.childName}
          </span>
        </div>
        {previousBookings.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-1">
            Đây là lần đăng ký test đầu tiên của học viên này.
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {/* Phiếu hiện tại */}
            <div className="rounded border border-primary/40 bg-primary/5 p-2 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-primary font-mono">#{booking.id}</span>
                  <span className="text-xs font-medium text-primary bg-primary/15 px-1 rounded">
                    Đang xem
                  </span>
                </div>
                <StatusBadge status={booking.status} label={getStatusLabel(booking.status)} />
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>{formatTestTimeWithDay(booking.testTime)}</span>
                <span className="font-medium text-foreground">{booking.program}</span>
              </div>
            </div>

            {/* Các phiếu khác có thể nhấp để chuyển xem */}
            {previousBookings.map((prev) => (
              <button
                key={prev.id}
                type="button"
                onClick={() => handleSelect(prev)}
                className="w-full text-left rounded border border-border/70 bg-card hover:bg-accent/60 hover:border-primary/50 p-2 text-xs space-y-1 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground font-mono group-hover:text-primary transition-colors">
                      #{prev.id}
                    </span>
                    <span className="text-xs text-muted-foreground group-hover:text-primary group-hover:underline">
                      Chuyển xem ↗
                    </span>
                  </div>
                  <StatusBadge status={prev.status} label={getStatusLabel(prev.status)} />
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>{formatTestTimeWithDay(prev.testTime)}</span>
                  <span className="font-medium text-foreground/80">{prev.program}</span>
                </div>
                {prev.testResult?.level && (
                  <p className="text-xs text-primary font-medium border-t border-border/40 pt-0.5">
                    Kết quả: {prev.testResult.level} {prev.testResult.subLevel ? `- ${prev.testResult.subLevel}` : ''}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
