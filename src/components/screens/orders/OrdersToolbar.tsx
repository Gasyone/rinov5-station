'use client'

import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  SegmentedControl,
  ToolbarSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { Order } from '@/mocks/orders'
import { cn } from '@/lib/utils'
import {
  ORDER_STATUS_TABS,
  PACKAGE_TYPE_OPTIONS,
  PAYMENT_CONDITION_OPTIONS,
  type OrderMetrics,
  type OrderStatusFilter,
  type PackageTypeFilter,
  type PaymentConditionFilter,
} from './ordersTypes'
import {
  countOrdersByPaymentCondition,
  countOrdersByStatus,
} from './ordersHelpers'
import { OrdersSmartcardPopover } from './OrdersSmartcardPopover'

interface OrdersToolbarProps {
  orders: Order[]
  branches: string[]
  activeBranch: string
  activePackageType: PackageTypeFilter
  activeStatus: OrderStatusFilter
  activePaymentCondition: PaymentConditionFilter
  searchTerm: string
  activeFilterCount: number
  metrics?: OrderMetrics
  onBranchChange: (branch: string) => void
  onPackageTypeChange: (pkg: PackageTypeFilter) => void
  onStatusChange: (status: OrderStatusFilter) => void
  onPaymentConditionChange: (condition: PaymentConditionFilter) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
}

export function OrdersToolbar({
  orders,
  branches,
  activeBranch,
  activePackageType,
  activeStatus,
  activePaymentCondition,
  searchTerm,
  activeFilterCount,
  onBranchChange,
  onPackageTypeChange,
  onStatusChange,
  onPaymentConditionChange,
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
    <div className="flex shrink-0 flex-col gap-2 bg-background py-1">
      {/* Hàng trên: Lọc theo gói sản phẩm, Cơ sở của gói (trái) và Tìm kiếm, Bộ lọc nâng cao, Smartcard Popover (phải) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Selection cơ sở của gói */}
          <BranchSelect
            value={activeBranch}
            branches={branches}
            allLabel="Tất cả cơ sở"
            ariaLabel="Cơ sở của gói"
            onValueChange={onBranchChange}
            className="h-8 min-w-36 text-xs"
          />

          {/* Lọc theo gói sản phẩm, gói combo... */}
          <ToolbarSelect
            value={activePackageType}
            options={PACKAGE_TYPE_OPTIONS}
            onValueChange={(val) => onPackageTypeChange(val as PackageTypeFilter)}
            ariaLabel="Lọc theo gói sản phẩm"
            className="h-8 min-w-36 text-xs"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm kiếm đơn hàng"
            placeholder="Tìm mã đơn, học viên, gói..."
            inputClassName="sm:w-56"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />

          {/* Smartcard góc trên bên phải (icon + thông số, click mở rộng Popover với bộ chọn thời gian xem) */}
          <OrdersSmartcardPopover orders={orders} />
        </div>
      </div>

      {/* Hàng dưới: Thẻ trạng thái đơn hàng (Trái) & Nhóm lọc nhanh thu phí/cọc/đủ (Phải) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-0.5">
        <div className="overflow-x-auto min-w-0 flex-1">
          <StatusTiles
            tiles={tiles}
            activeId={activeStatus}
            noOverflowCollapse={true}
            onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
          />
        </div>

        {/* Nhóm lọc điều kiện thu phí kèm thống kê số lượng */}
        <div className="flex shrink-0 items-center">
          <SegmentedControl
            value={activePaymentCondition}
            options={PAYMENT_CONDITION_OPTIONS.map((opt) => {
              const count = countOrdersByPaymentCondition(orders, opt.value)
              const isSelected = activePaymentCondition === opt.value
              return {
                value: opt.value,
                label: (
                  <span className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap">
                    <span>{opt.label}</span>
                    <span
                      className={cn(
                        'px-1.5 py-0.2 rounded-full text-xs font-mono leading-none transition-colors',
                        isSelected
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : 'bg-muted/90 text-muted-foreground'
                      )}
                    >
                      {count}
                    </span>
                  </span>
                ),
              }
            })}
            onValueChange={onPaymentConditionChange}
            className="bg-muted/50 p-0.5 border border-border/40"
            itemClassName="h-7 px-2.5 text-xs"
          />
        </div>
      </div>
    </div>
  )
}
