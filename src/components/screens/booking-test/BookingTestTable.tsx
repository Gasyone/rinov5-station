'use client'

import { CalendarDays } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/shared'
import type { BookingTest } from '@/mocks/bookingTests'
import { BookingTestTableRow } from './BookingTestTableRow'

interface BookingTestTableProps {
  bookings: BookingTest[]
  selectedIds: Set<string>
  copiedKey: string
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (bookingId: string) => void
  onOpenAssessment: (bookingId: string) => void
  onUpdateBooking: (bookingId: string, updater: (booking: BookingTest) => BookingTest) => void
  onCopy: (text: string, key: string) => Promise<void>
  onCall: (phone?: string) => void
}

const COLUMN_DEFS: Array<{ label: string; className: string; sticky?: boolean }> = [
  {
    label: 'Học viên',
    className: 'sticky top-0 left-8 z-50 w-[240px] min-w-[240px] max-w-[240px] overflow-hidden bg-muted',
    sticky: true,
  },
  { label: 'Liên hệ', className: 'min-w-40 sticky top-0 z-30 bg-muted' },
  { label: 'Lịch test', className: 'min-w-44 sticky top-0 z-30 bg-muted' },
  { label: 'Speaking & LWR', className: 'min-w-52 sticky top-0 z-30 bg-muted' },
  { label: 'Kết quả', className: 'min-w-36 sticky top-0 z-30 bg-muted' },
  { label: 'Trạng thái', className: 'w-28 min-w-28 max-w-32 sticky top-0 z-30 bg-muted' },
  { label: 'Phụ trách', className: 'min-w-52 sticky top-0 z-30 bg-muted' },
]

export function BookingTestTable({
  bookings,
  selectedIds,
  copiedKey,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onOpenAssessment,
  onUpdateBooking,
  onCopy,
  onCall,
}: BookingTestTableProps) {
  const pageIds = bookings.map((booking) => booking.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table
      containerClassName="min-w-full overflow-visible align-top"
      className="min-w-[1350px]"
    >
      <TableHeader className="sticky top-0 z-40 bg-muted border-b border-border/80 shadow-2xs">
        <TableRow className="border-b-0 bg-muted hover:bg-muted [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground">
          <TableHead className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 overflow-hidden bg-muted text-center px-1">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          {COLUMN_DEFS.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {bookings.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={COLUMN_DEFS.length + 1} className="h-48 text-center">
              <EmptyState
                icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
                title="Không có lịch test phù hợp."
                description="Điều chỉnh tìm kiếm, môn học, trạng thái hoặc bộ lọc."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          bookings.map((booking, index) => (
            <BookingTestTableRow
              key={booking.id}
              booking={booking}
              bookings={bookings}
              index={index}
              isSelected={selectedIds.has(booking.id)}
              copiedKey={copiedKey}
              onToggle={onToggleOne}
              onRowClick={onRowClick}
              onOpenAssessment={onOpenAssessment}
              onUpdateBooking={onUpdateBooking}
              onCopy={onCopy}
              onCall={onCall}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
