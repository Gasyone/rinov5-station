'use client'

import { StatusTiles, type StatusTile } from '@/components/shared'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import {
  FULFILLMENT_QUICK_FILTERS,
  type FilterStatus,
  type QuickFilterId,
} from './orderFulfillmentTypes'

interface OrderFulfillmentStatusTilesProps {
  counts: {
    total: number
    pending_handover: number
    shipping: number
    handed_over: number
    returned: number
  }
  activeStatus: FilterStatus
  activeQuickFilter: QuickFilterId
  onStatusChange: (status: FilterStatus) => void
  onQuickFilterChange: (quickFilter: QuickFilterId) => void
}

export function OrderFulfillmentStatusTiles({
  counts,
  activeStatus,
  activeQuickFilter,
  onStatusChange,
  onQuickFilterChange,
}: OrderFulfillmentStatusTilesProps) {
  const tiles: StatusTile<FilterStatus>[] = [
    {
      id: 'all',
      label: 'Tất cả',
      count: counts.total,
      semantic: 'neutral',
    },
    {
      id: 'pending_handover',
      label: 'Chờ bàn giao',
      count: counts.pending_handover,
      status: 'pending_handover',
    },
    {
      id: 'shipping',
      label: 'Đang giao',
      count: counts.shipping,
      status: 'shipping',
    },
    {
      id: 'handed_over',
      label: 'Đã bàn giao',
      count: counts.handed_over,
      status: 'handed_over',
    },
    {
      id: 'returned',
      label: 'Trả lại',
      count: counts.returned,
      status: 'returned',
    },
  ]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 min-w-0 py-1">
      {/* Status Tiles bên trái */}
      <div className="overflow-x-auto min-w-0 flex-1">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={onStatusChange}
          noOverflowCollapse={true}
        />
      </div>

      {/* Cụm Tab Lọc Nhanh bên phải (thẳng hàng dưới Badger thống kê) - Giống màn trial_class */}
      <div className="flex items-center gap-1.5 shrink-0 text-xs">
        <span className="text-xs font-semibold text-muted-foreground mr-0.5">
          Lọc nhanh:
        </span>
        {FULFILLMENT_QUICK_FILTERS.map((def) => {
          const isActive = activeQuickFilter === def.id
          const colors = getStatusColors(def.semantic)
          return (
            <button
              key={def.id}
              type="button"
              onClick={() => onQuickFilterChange(activeQuickFilter === def.id ? 'all' : def.id)}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all cursor-pointer border',
                isActive
                  ? colors.badge
                  : 'border-border bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-border/80 shadow-2xs'
              )}
            >
              <span>{def.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
