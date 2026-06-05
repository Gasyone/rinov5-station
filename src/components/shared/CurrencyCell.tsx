'use client'

import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'

interface CurrencyCellProps {
  /** Số tiền cần định dạng (VND) */
  amount?: number | null
  /** Tự động đổi màu dựa trên giá trị: xanh lục nếu dương (>0), đỏ nếu âm (<0) */
  highlight?: boolean
  /** Canh lề chữ: mặc định là 'right' cho định dạng kế toán chuẩn */
  align?: 'left' | 'right' | 'center'
  className?: string
}

/**
 * Component hiển thị số tiền/tiền tệ chuẩn hóa trong bảng dữ liệu.
 * Đảm bảo sử dụng font chữ đơn cách (font-mono), căn lề phải mặc định và định dạng VND.
 *
 * @see docs/DESIGN_SYSTEM.md §3.3 Typography & §4.2 List Page Pattern
 */
export function CurrencyCell({
  amount,
  highlight = false,
  align = 'right',
  className,
}: CurrencyCellProps) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return (
      <div
        className={cn(
          'text-sm font-mono text-muted-foreground',
          align === 'right' && 'text-right',
          align === 'center' && 'text-center',
          align === 'left' && 'text-left',
          className
        )}
      >
        -
      </div>
    )
  }

  // Lớp CSS canh lề
  const alignClass = cn(
    align === 'right' && 'text-right',
    align === 'center' && 'text-center',
    align === 'left' && 'text-left'
  )

  // Lớp màu sắc khi có highlight
  let colorClass = 'text-foreground'
  if (highlight) {
    if (amount > 0) {
      colorClass = 'text-emerald-600 dark:text-emerald-400 font-semibold'
    } else if (amount < 0) {
      colorClass = 'text-destructive font-semibold'
    }
  }

  return (
    <div className={cn('text-sm font-mono', alignClass, colorClass, className)}>
      {formatCurrency(amount)}
    </div>
  )
}
