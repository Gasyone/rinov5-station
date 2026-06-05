'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface SummaryItem {
  name: string
  quantity: number
  price?: number
}

interface ItemsSummaryCellProps {
  /** Danh sách các sản phẩm/mặt hàng */
  items: SummaryItem[]
  /** Chiều rộng tối đa (mặc định max-w-48) */
  maxWidthClass?: string
  className?: string
}

/**
 * Component hiển thị tóm tắt danh sách sản phẩm / đơn hàng trong bảng.
 * Hiển thị tên sản phẩm đầu tiên và đếm số lượng các sản phẩm khác, hover hiện Tooltip toàn bộ chi tiết.
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern
 */
export function ItemsSummaryCell({
  items,
  maxWidthClass = 'max-w-48',
  className,
}: ItemsSummaryCellProps) {
  if (!items || items.length === 0) {
    return <span className="text-sm text-muted-foreground italic">—</span>
  }

  const firstItem = items[0]
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const remainingQuantity = totalQuantity - firstItem.quantity

  const content = (
    <div className={cn('flex flex-col gap-0.5 min-w-0 text-left cursor-help', maxWidthClass, className)}>
      <p className="truncate text-sm font-medium text-foreground" title={firstItem.name}>
        {firstItem.name}
      </p>
      {remainingQuantity > 0 ? (
        <p className="text-xs text-muted-foreground">
          +{remainingQuantity} sản phẩm khác
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Số lượng: {firstItem.quantity}
        </p>
      )}
    </div>
  )

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block max-w-full">{content}</div>
        </TooltipTrigger>
        <TooltipContent className="p-3 w-60 rounded-lg shadow-lg border bg-popover text-popover-foreground">
          <p className="text-xs font-semibold text-muted-foreground mb-1.5">Chi tiết đơn hàng ({totalQuantity} món):</p>
          <ul className="space-y-1.5">
            {items.map((item, index) => (
              <li key={index} className="flex justify-between text-xs font-medium">
                <span className="truncate mr-2">• {item.name}</span>
                <span className="text-muted-foreground shrink-0">x{item.quantity}</span>
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
