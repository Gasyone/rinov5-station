'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import {
  PROGRAM_LEVELS,
  SUB_LEVELS,
  type BookingTest,
} from '@/mocks/bookingTests'
import { canSelectPlacementLevel } from './bookingTestHelpers'

interface BookingTestLevelPopoverProps {
  booking: BookingTest
  onUpdateBooking: (id: string, updater: (booking: BookingTest) => BookingTest) => void
}

export function BookingTestLevelPopover({
  booking,
  onUpdateBooking,
}: BookingTestLevelPopoverProps) {
  const [open, setOpen] = useState(false)
  const canEdit = canSelectPlacementLevel(booking)

  const level = booking.testResult?.level ?? ''
  const subLevel = booking.testResult?.subLevel ?? ''

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="group/level flex cursor-pointer items-center justify-between gap-1.5 rounded-md p-1 -m-1 transition-colors hover:bg-muted/60"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-normal text-foreground">
              {level || <span className="font-normal italic text-muted-foreground">Chưa đặt</span>}
            </p>
            <p className="font-mono text-[11px] text-muted-foreground">
              {subLevel || '-'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            className="h-6 w-6 opacity-0 group-hover/level:opacity-100 group-hover:opacity-100 transition-opacity"
            title="Sửa trình độ"
            aria-label={`Sửa trình độ cho ${booking.childName}`}
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-64 space-y-3 p-3.5 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground">
            Cập nhật trình độ
          </p>
          {!canEdit && (
            <span className="text-[10px] font-medium text-amber-600">Chưa thể sửa</span>
          )}
        </div>

        <div className="space-y-3">
          <FieldLabel label="Trình độ đầu vào">
            <InlineSelect
              value={level}
              disabled={!canEdit}
              ariaLabel={`Trình độ đầu vào của ${booking.childName}`}
              className="w-full justify-between border"
              options={[
                { value: '', label: 'Chưa đặt' },
                ...PROGRAM_LEVELS.map((lvl) => ({ value: lvl, label: lvl })),
              ]}
              onValueChange={(value) => {
                onUpdateBooking(booking.id, (current) => ({
                  ...current,
                  testResult: { ...current.testResult, level: value },
                }))
              }}
            />
          </FieldLabel>

          <FieldLabel label="Nhánh trình độ">
            <InlineSelect
              value={subLevel}
              disabled={!canEdit}
              ariaLabel={`Nhánh trình độ đầu vào của ${booking.childName}`}
              className="w-full justify-between border"
              options={[
                { value: '', label: '-' },
                ...SUB_LEVELS.map((sub) => ({ value: sub, label: sub })),
              ]}
              onValueChange={(value) => {
                onUpdateBooking(booking.id, (current) => ({
                  ...current,
                  testResult: { ...current.testResult, subLevel: value },
                }))
              }}
            />
          </FieldLabel>
        </div>
      </PopoverContent>
    </Popover>
  )
}
