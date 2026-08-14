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
    className: 'sticky left-12 z-30 w-[280px] min-w-[280px] max-w-[280px] overflow-hidden bg-muted',
    sticky: true,
  },
  { label: 'Liên hệ', className: 'min-w-40' },
  { label: 'Nội dung Trải nghiệm', className: 'min-w-48' },
  { label: 'Giáo viên & Cơ sở', className: 'min-w-52' },
  { label: 'Speaking', className: 'min-w-48' },
  { label: 'LWR', className: 'min-w-48' },
  { label: 'Trạng thái', className: 'min-w-44' },
  { label: 'Trình độ', className: 'min-w-36' },
  { label: 'Kết quả', className: 'min-w-28' },
  { label: 'Ghi chú', className: 'min-w-48' },
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
      className="min-w-[1550px]"
    >
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow className="border-b-0 bg-muted hover:bg-muted">
          <TableHead className="sticky left-0 z-40 w-12 min-w-12 max-w-12 overflow-hidden bg-muted text-center">
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
          bookings.map((booking) => (
            <BookingTestTableRow
              key={booking.id}
              booking={booking}
              bookings={bookings}
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
