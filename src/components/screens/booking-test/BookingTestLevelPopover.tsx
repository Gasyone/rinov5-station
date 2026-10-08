'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { cn } from '@/lib/utils'
import {
  PROGRAM_LEVELS,
  SUB_LEVELS,
  type BookingTest,
} from '@/mocks/bookingTests'
import { canSelectPlacementLevel } from './bookingTestHelpers'
import {
  getBookingResultHref,
  hasBookingAssessmentResult,
} from './bookingTestAssessmentStorage'

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
  const hasResult = hasBookingAssessmentResult(booking)
  const hasLink = hasResult || Boolean(level) || Boolean(booking.resultLink)

  const levelDisplay = useMemo(() => {
    if (level && subLevel && subLevel !== '-') {
      return `${level} - ${subLevel}`
    }
    if (level) {
      return level
    }
    if (subLevel && subLevel !== '-') {
      return subLevel
    }
    return 'Chưa đặt'
  }, [level, subLevel])

  const resultHref =
    booking.resultLink?.startsWith('http://') ||
    booking.resultLink?.startsWith('https://') ||
    booking.resultLink?.startsWith('/app/')
      ? booking.resultLink
      : getBookingResultHref(booking.id)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className="group/level flex items-center justify-between gap-1.5 rounded-md p-1 -m-1 transition-colors hover:bg-muted/60"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          {/* Dòng 1: Trình độ - Trình độ phụ */}
          <p
            className={cn(
              "truncate text-xs leading-tight cursor-pointer",
              level ? "font-normal text-foreground" : "font-normal italic text-muted-foreground"
            )}
            title={levelDisplay}
          >
            {levelDisplay}
          </p>

          {/* Dòng 2: Nhận xét, link */}
          {hasLink ? (
            <Link
              href={resultHref}
              target="_blank"
              rel="noreferrer"
              title="Mở nhận xét"
              aria-label={`Mở nhận xét của ${booking.childName}`}
              className="inline-flex max-w-full items-center gap-1 text-xs font-normal text-primary hover:underline leading-tight"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">Nhận xét</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </Link>
          ) : (
            <p className="font-mono text-xs text-muted-foreground leading-tight">-</p>
          )}
        </div>

        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon-xs"
            className="h-6 w-6 opacity-0 group-hover/level:opacity-100 group-hover:opacity-100 transition-opacity shrink-0"
            title="Sửa trình độ"
            aria-label={`Sửa trình độ cho ${booking.childName}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
          </Button>
        </PopoverTrigger>
      </div>

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
            <span className="text-xs font-medium text-amber-600">Chưa thể sửa</span>
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
