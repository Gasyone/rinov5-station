'use client'

import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface BadgeItem {
  label: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

interface BadgeGroupCellProps {
  /** Danh sách các nhãn tag dưới dạng chuỗi hoặc đối tượng tùy biến */
  items: Array<string | BadgeItem>
  /** Số lượng nhãn hiển thị tối đa (mặc định là 2) */
  maxVisible?: number
  className?: string
}

/**
 * Component hiển thị nhóm các thẻ Badge/Tag trong bảng.
 * Giúp hiển thị ngắn gọn danh sách các nhãn (ví dụ: Sở thích, chương trình học, môn học...)
 * và tự động thu gọn phần còn lại dưới dạng +N kèm Tooltip chi tiết khi hover.
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern & §6.1 Badge
 */
export function BadgeGroupCell({
  items,
  maxVisible = 2,
  className,
}: BadgeGroupCellProps) {
  if (!items || items.length === 0) {
    return <span className="text-sm text-muted-foreground italic">—</span>
  }

  // Chuẩn hóa danh sách nhãn
  const normalizedItems: BadgeItem[] = items.map((item) => {
    if (typeof item === 'string') {
      return { label: item, variant: 'outline' }
    }
    return item
  })

  const visibleItems = normalizedItems.slice(0, maxVisible)
  const remainingCount = normalizedItems.length - maxVisible

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('flex flex-wrap items-center gap-1 min-w-0 text-left', className)}>
        {visibleItems.map((item, index) => (
          <Badge
            key={index}
            variant={item.variant ?? 'outline'}
            className={cn('rounded-md text-[10px] font-semibold whitespace-nowrap shrink-0', item.className)}
          >
            {item.label}
          </Badge>
        ))}

        {remainingCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="rounded-md text-[10px] font-semibold cursor-help shrink-0 hover:bg-muted"
              >
                +{remainingCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="p-2.5 max-w-56 rounded-lg shadow-lg border bg-popover text-popover-foreground">
              <p className="text-xs font-semibold text-muted-foreground mb-1.5">Danh sách các nhãn:</p>
              <div className="flex flex-wrap gap-1">
                {normalizedItems.map((item, index) => (
                  <Badge
                    key={index}
                    variant={item.variant ?? 'outline'}
                    className={cn('rounded-md text-[10px] font-semibold whitespace-nowrap', item.className)}
                  >
                    {item.label}
                  </Badge>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
