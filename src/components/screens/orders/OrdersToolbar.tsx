'use client'

import { BranchSelect, ExpandableSearch, FilterIconButton } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { Order } from '@/mocks/orders'
import { ORDER_STATUS_TABS, type OrderStatusFilter } from './ordersTypes'
import { countOrdersByStatus } from './ordersHelpers'

interface OrdersToolbarProps {
  orders: Order[]
  branches: string[]
  activeBranch: string
  activeStatus: OrderStatusFilter
  searchTerm: string
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onStatusChange: (status: OrderStatusFilter) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
}

export function OrdersToolbar({
  orders,
  branches,
  activeBranch,
  activeStatus,
  searchTerm,
  activeFilterCount,
  onBranchChange,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
}: OrdersToolbarProps) {
  const tiles: StatusTile<OrderStatusFilter>[] = ORDER_STATUS_TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    count: countOrdersByStatus(orders, tab.id),
    status: tab.status,
    semantic: tab.id === 'all' ? 'neutral' : undefined,
  }))

  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-2.5 py-1">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <BranchSelect
          value={activeBranch}
          branches={branches}
          allLabel="Tất cả cơ sở"
          ariaLabel="Cơ sở"
          onValueChange={onBranchChange}
          className="h-8 min-w-36 text-xs"
        />
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          label="Tìm kiếm đơn hàng"
          placeholder="Tìm mã đơn, tên học viên..."
          inputClassName="sm:w-64"
        />
        <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
      </div>
    </div>
  )
}
