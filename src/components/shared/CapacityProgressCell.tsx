'use client'

import { cn } from '@/lib/utils'

interface CapacityProgressCellProps {
  /** Số học viên đã ghi danh hiện tại */
  enrolled: number
  /** Sĩ số tối đa của lớp học */
  max: number
  /** Hiển thị phần trăm lấp đầy kế bên */
  showPercentage?: boolean
  /** Hiển thị thanh tiến độ mini bên dưới */
  showProgress?: boolean
  /** Ngưỡng cảnh báo màu vàng (phần trăm từ 0-100, mặc định là 70%) */
  warningThreshold?: number
  /** Ngưỡng nghiêm trọng màu đỏ (phần trăm từ 0-100, mặc định là 90%) */
  dangerThreshold?: number
  className?: string
}

/**
 * Component hiển thị sĩ số, công suất lấp đầy và thanh tiến độ mini trong bảng lớp học.
 * Tự động đổi màu văn bản và thanh tiến độ theo các ngưỡng cấu hình (Bình thường -> Cảnh báo -> Đầy/Quá tải).
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern
 */
export function CapacityProgressCell({
  enrolled,
  max,
  showPercentage = true,
  showProgress = true,
  warningThreshold = 70,
  dangerThreshold = 90,
  className,
}: CapacityProgressCellProps) {
  const safeMax = max <= 0 ? 1 : max
  const percentage = Math.round((enrolled / safeMax) * 100)

  // Xác định màu sắc dựa trên phần trăm lấp đầy
  let textColorClass = 'text-muted-foreground'
  let progressBgClass = 'bg-primary'

  if (percentage >= dangerThreshold) {
    textColorClass = 'text-destructive font-semibold'
    progressBgClass = 'bg-destructive'
  } else if (percentage >= warningThreshold) {
    textColorClass = 'text-amber-600 dark:text-amber-400 font-semibold'
    progressBgClass = 'bg-amber-500'
  } else {
    textColorClass = 'text-foreground font-semibold'
    progressBgClass = 'bg-primary'
  }

  return (
    <div className={cn('flex flex-col gap-1 min-w-28 text-left', className)}>
      <div className="text-sm">
        <span className={textColorClass}>
          {enrolled}/{max}
        </span>
        {showPercentage && max > 0 && (
          <span className="ml-1 text-xs text-muted-foreground">({percentage}%)</span>
        )}
      </div>

      {/* Thanh tiến độ mini */}
      {showProgress && max > 0 && (
        <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden shrink-0">
          <div
            className={cn('h-full rounded-full transition-all duration-300', progressBgClass)}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
