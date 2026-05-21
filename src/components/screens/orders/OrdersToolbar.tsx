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
    <div className="flex shrink-0 flex-col gap-2 bg-background px-4 py-3 lg:px-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <BranchSelect
          value={activeBranch}
          branches={branches}
          allLabel="All branches"
          ariaLabel="Branch"
          onValueChange={onBranchChange}
          className="h-9 min-w-52 text-sm"
        />
        <div className="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Search orders"
            placeholder="Search order #, student..."
            inputClassName="sm:w-72"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        </div>
      </div>

      <StatusTiles
        tiles={tiles}
        activeId={activeStatus}
        onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
      />
    </div>
  )
}
