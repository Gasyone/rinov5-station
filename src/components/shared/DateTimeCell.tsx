'use client'

import { Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DateTimeCellProps {
  /** Giá trị ngày giờ (chuỗi ISO hoặc đối tượng Date) */
  value?: string | Date | null
  /** Hiển thị giờ kèm theo ngày (mặc định tự động nhận diện nếu chuỗi chứa ký tự giờ/T hoặc khoảng trắng) */
  showTime?: boolean
  /** Hiển thị Thứ trong tuần (tiếng Việt) */
  showWeekday?: boolean
  /** Chế độ hiển thị: single (1 dòng), double (2 dòng: giờ trên, ngày dưới) */
  layout?: 'single' | 'double'
  className?: string
}

const WEEKDAY_LABELS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
]

/**
 * Component định dạng hiển thị ngày giờ trong các ô của bảng.
 * Tự động tính toán Thứ trong tuần tiếng Việt và hiển thị gọn gàng theo dạng 1 dòng hoặc 2 dòng.
 *
 * @see docs/DESIGN_SYSTEM.md §3.3 Typography & §4.2 List Page Pattern
 */
export function DateTimeCell({
  value,
  showTime,
  showWeekday = false,
  layout = 'single',
  className,
}: DateTimeCellProps) {
  if (!value) {
    return <span className="text-sm text-muted-foreground italic">-</span>
  }

  const date = typeof value === 'string' ? new Date(value) : value

  if (Number.isNaN(date.getTime())) {
    return <span className="text-sm text-muted-foreground truncate">{String(value)}</span>
  }

  // Lấy Thứ trong tuần tiếng Việt
  const weekdayStr = showWeekday ? WEEKDAY_LABELS[date.getDay()] : ''

  // Định dạng ngày: dd/MM/yyyy
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const dateStr = `${day}/${month}/${year}`

  // Xác định xem có cần hiển thị giờ không
  const shouldShowTime =
    showTime !== undefined
      ? showTime
      : typeof value === 'string'
      ? value.includes('T') || value.includes(':') || value.includes(' ')
      : true

  // Định dạng giờ: HH:mm
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const timeStr = shouldShowTime ? `${hours}:${minutes}` : ''

  // 1. Chế độ hiển thị 2 dòng (Double Layout - Tốt cho bảng nhiều cột hẹp)
  if (layout === 'double') {
    return (
      <div className={cn('flex flex-col gap-0.5 min-w-0 text-left', className)}>
        {shouldShowTime ? (
          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
            <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {timeStr}
          </div>
        ) : null}
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          {!shouldShowTime && <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
          <span className="truncate">
            {showWeekday ? `${weekdayStr}, ` : ''}
            {dateStr}
          </span>
        </div>
      </div>
    )
  }

  // 2. Chế độ hiển thị 1 dòng (Single Layout - Gọn gàng)
  return (
    <div className={cn('flex items-center gap-1.5 text-sm text-foreground', className)}>
      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <span className="truncate">
        {shouldShowTime ? `${timeStr} · ` : ''}
        {showWeekday ? `${weekdayStr}, ` : ''}
        {dateStr}
      </span>
    </div>
  )
}
