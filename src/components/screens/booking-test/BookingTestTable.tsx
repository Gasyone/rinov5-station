'use client'

import { CalendarDays } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { cn } from '@/lib/utils'
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
  className?: string
  pagination?: {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
}

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
  className,
  pagination,
}: BookingTestTableProps) {
  const pageIds = bookings.map((booking) => booking.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
        title="Không tìm thấy dữ liệu"
        description="Điều chỉnh tìm kiếm hoặc bộ lọc để hiển thị kết quả."
        className="py-10 border border-border rounded-lg bg-card"
      />
    )
  }

  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      <DataTableFrame className="flex-1 min-h-0">
        <table className="w-full min-w-max text-xs text-left border-separate border-spacing-0">
          <thead className="sticky top-0 z-40 bg-muted">
            <tr className="bg-muted hover:bg-muted [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80 [&>th]:whitespace-nowrap">
              <th className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 text-center px-1 bg-muted">
                <Checkbox
                  checked={isPageSelected}
                  onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="sticky top-0 left-8 z-50 w-[220px] min-w-[200px] xl:w-[240px] 2xl:w-[260px] px-2.5 bg-muted text-left border-none">
                Học viên
              </th>
              <th className="sticky top-0 z-40 bg-muted w-[150px] min-w-[140px] xl:w-[165px] 2xl:w-[180px] px-2.5 text-left">
                Liên hệ
              </th>
              <th className="sticky top-0 z-40 bg-muted w-[175px] min-w-[160px] xl:w-[190px] 2xl:w-[210px] px-2.5 text-left">
                Lịch test
              </th>
              <th className="sticky top-0 z-40 bg-muted w-[195px] min-w-[180px] xl:w-[210px] 2xl:w-[230px] px-2.5 text-left">
                Speaking & LWR
              </th>
              <th className="sticky top-0 z-40 bg-muted w-[125px] min-w-[115px] xl:w-[135px] 2xl:w-[145px] px-2 text-left">
                Kết quả
              </th>
              <th className="sticky top-0 z-40 bg-muted w-[130px] min-w-[120px] xl:w-[140px] 2xl:w-[155px] px-2.5 text-left">
                Trạng thái
              </th>
              <th className="sticky top-0 z-40 bg-muted w-[170px] min-w-[155px] xl:w-[190px] 2xl:w-[210px] px-2.5 text-left">
                Phụ trách
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
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
            ))}
          </tbody>
        </table>
      </DataTableFrame>

      {pagination ? (
        <div className="shrink-0 pt-1 pb-0">
          <DataTablePagination
            page={pagination.page}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            selectedCount={selectedIds.size}
            onClearSelection={() => onToggleAll(false, pageIds)}
            size="sm"
            className="!bg-transparent border-0 border-none shadow-none px-0 py-0"
          />
        </div>
      ) : null}
    </div>
  )
}
