'use client'

import { cn } from '@/lib/utils'
import {
  getStatusColors,
  resolveStatusSemantic,
  SEMANTIC_COUNT_BG,
} from '@/lib/statusColors'
import type { StatusTileId } from './bookingTestTypes'

export interface ConditionFilterItem {
  id: StatusTileId
  label: string
  count?: number
  status: string
}

interface BookingTestConditionFiltersProps {
  items: ConditionFilterItem[]
  activeId: StatusTileId
  onSelect: (id: StatusTileId) => void
  className?: string
  showDot?: boolean
  hideDot?: boolean
  coloredCount?: boolean
  showCount?: boolean
}

export function BookingTestConditionFilters({
  items,
  activeId,
  onSelect,
  className,
  showDot = false,
  hideDot = true,
  coloredCount = true,
  showCount = false,
}: BookingTestConditionFiltersProps) {
  const effectiveShowDot = hideDot ? false : showDot

  return (
    <div className={cn('flex items-center gap-1.5 select-none shrink-0 min-w-0', className)}>
      <span className="text-xs font-normal text-muted-foreground shrink-0 mr-0.5">
        Điều kiện:
      </span>

      <div className="flex items-center gap-1 min-w-0 overflow-x-auto custom-scrollbar">
        {items.map((item) => {
          const isActive = item.id === activeId
          const semantic = resolveStatusSemantic(item.status)
          const colors = getStatusColors(semantic)

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                'inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0 gap-1',
                isActive
                  ? 'border-primary/50 bg-primary/10 text-primary font-normal border-solid'
                  : 'border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              {effectiveShowDot && (
                <span className={cn('h-1.5 w-1.5 rounded-full', colors.dot)} />
              )}
              <span>{item.label}</span>
              {showCount && item.count !== undefined && (
                <span
                  className={cn(
                    'rounded px-1 py-0 text-xs font-normal font-mono transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : coloredCount
                        ? (SEMANTIC_COUNT_BG[semantic] || 'bg-muted text-muted-foreground')
                        : 'bg-muted text-muted-foreground'
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
