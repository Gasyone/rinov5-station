'use client'

import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getStatusColors, resolveStatusSemantic } from '@/lib/statusColors'
import type { StatusTileId } from './bookingTestTypes'

export interface ConditionFilterItem {
  id: StatusTileId
  label: string
  count: number
  status: string
}

interface BookingTestConditionFiltersProps {
  items: ConditionFilterItem[]
  activeId: StatusTileId
  onSelect: (id: StatusTileId) => void
  className?: string
}

export function BookingTestConditionFilters({
  items,
  activeId,
  onSelect,
  className,
}: BookingTestConditionFiltersProps) {
  return (
    <div className={cn('flex items-center gap-1.5 min-w-0', className)}>
      <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground shrink-0 pr-0.5">
        <SlidersHorizontal className="h-3.5 w-3.5 text-amber-500" />
        <span className="hidden sm:inline">Lọc nhanh:</span>
      </div>

      <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto custom-scrollbar">
        {items.map((item) => {
          const isActive = item.id === activeId
          const colors = getStatusColors(resolveStatusSemantic(item.status))

          return (
            <Button
              key={item.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelect(item.id)}
              className={cn(
                'h-7 rounded-md px-2.5 text-xs font-medium transition-all gap-1.5 shrink-0 border-dashed',
                isActive
                  ? 'border-solid border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/20'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              )}
            >
              <span className={cn('h-1.5 w-1.5 rounded-full', colors.dot)} />
              <span>{item.label}</span>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-bold font-mono',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {item.count}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
