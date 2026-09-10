'use client'

import React, { useState } from 'react'
import { Calendar, Check, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  FilterAsidePanel,
  FilterCheckboxOption,
  FilterCollapsibleSection,
  FilterRadioOption,
} from '@/components/filters'
import { DateRangePicker, formatDateToDisplay } from '@/components/controls'
import type { Order } from '@/mocks/orders'
import {
  getOrderBranches,
  getOrderPaymentMethods,
  getOrderPaymentStatuses,
  getOrderSalesStaff,
  getOrderStatusLabel,
} from './ordersHelpers'
import {
  FULFILLMENT_TYPE_OPTIONS,
  ORDER_AMOUNT_RANGE_OPTIONS,
  ORDER_NATURE_OPTIONS,
  PACKAGE_TYPE_OPTIONS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  TIME_RANGE_OPTIONS,
  type OrderAmountRange,
  type OrderFilterState,
  type OrderNatureFilter,
  type PackageTypeFilter,
  type TimeRangeFilter,
} from './ordersTypes'

interface OrdersFilterPanelProps {
  orders: Order[]
  filters: OrderFilterState
  onClose: () => void
  onToggle: <K extends keyof OrderFilterState>(key: K, value: any) => void
  onFilterChange: (updates: Partial<OrderFilterState>) => void
  onClearAll: () => void
  onClearSection?: (key: keyof OrderFilterState) => void
}

export function OrdersFilterPanel({
  orders,
  filters,
  onClose,
  onToggle,
  onFilterChange,
  onClearAll,
  onClearSection,
}: OrdersFilterPanelProps) {
  const [salesSearch, setSalesSearch] = useState('')

  const activeCount =
    filters.branches.length +
    filters.paymentMethods.length +
    filters.paymentStatuses.length +
    filters.orderStatuses.length +
    (filters.packageCategories?.length || 0) +
    (filters.salesStaff?.length || 0) +
    (filters.fulfillmentStatuses?.length || 0) +
    (filters.fulfillmentTypes?.length || 0) +
    (filters.timeRange && filters.timeRange !== 'all' ? 1 : 0) +
    (filters.amountRange && filters.amountRange !== 'all' ? 1 : 0) +
    (filters.orderNature && filters.orderNature !== 'all' ? 1 : 0)

  const allSalesStaff = getOrderSalesStaff(orders)
  const filteredSalesStaff = allSalesStaff.filter((staff) =>
    staff.toLowerCase().includes(salesSearch.toLowerCase().trim())
  )

  const branchOptions = getOrderBranches(orders).map((branch) => ({
    value: branch,
    label: branch,
  }))

  const orderStatusOptions = (
    ['pending', 'cancelled', 'completed'] as Array<Order['status']>
  ).map((status) => ({
    value: status,
    label: getOrderStatusLabel(status),
  }))

  const paymentMethodOptions = getOrderPaymentMethods(orders).map((method) => ({
    value: method,
    label: PAYMENT_METHOD_LABELS[method] || method,
  }))

  const paymentStatusOptions = getOrderPaymentStatuses(orders).map((status) => ({
    value: status,
    label: PAYMENT_STATUS_LABELS[status] || status,
  }))

  const packageTypeOptions = PACKAGE_TYPE_OPTIONS.filter((opt) => opt.value !== 'all').map(
    (opt) => ({
      value: opt.value,
      label: opt.label,
    })
  )

  const fulfillmentStatusOptions = [
    {
      value: 'delivered',
      label: 'Đã bàn giao đủ',
    },
    {
      value: 'processing',
      label: 'Đang chuyển giao',
    },
    {
      value: 'pending',
      label: 'Chờ xử lý',
    },
  ]

  return (
    <FilterAsidePanel
      title="Bộ lọc đơn hàng"
      activeCount={activeCount}
      onReset={onClearAll}
      resetLabel="Đặt lại"
      onClose={onClose}
      ariaLabel="Panel bộ lọc đơn hàng"
    >
      {/* 1. Nhóm Khoảng thời gian tạo đơn */}
      <FilterCollapsibleSection
        title="Khoảng thời gian tạo đơn"
        defaultOpen={Boolean(filters.timeRange && filters.timeRange !== 'all')}
        badgeCount={filters.timeRange && filters.timeRange !== 'all' ? 1 : 0}
        onClear={
          filters.timeRange && filters.timeRange !== 'all'
            ? () => onFilterChange({ timeRange: 'all', customStartDate: '', customEndDate: '' })
            : undefined
        }
      >
        <div className="space-y-1 pt-0.5">
          {TIME_RANGE_OPTIONS.map((opt) => {
            if (opt.value === 'custom') {
              const isCustomActive = filters.timeRange === 'custom'
              return (
                <DateRangePicker
                  key="custom"
                  startDate={filters.customStartDate}
                  endDate={filters.customEndDate}
                  preset={filters.timeRange}
                  align="end"
                  trigger={
                    <button
                      type="button"
                      className={cn(
                        'w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer select-none',
                        isCustomActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted/70 text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">
                          {isCustomActive && filters.customStartDate
                            ? `${formatDateToDisplay(filters.customStartDate)} – ${formatDateToDisplay(filters.customEndDate)}`
                            : 'Tùy chọn khoảng ngày...'}
                        </span>
                      </div>
                      {isCustomActive && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </button>
                  }
                  onApply={({ startDate, endDate, preset }) => {
                    onFilterChange({
                      timeRange: (preset as TimeRangeFilter) || 'custom',
                      customStartDate: startDate,
                      customEndDate: endDate,
                    })
                  }}
                  onClear={() => {
                    onFilterChange({
                      timeRange: 'all',
                      customStartDate: '',
                      customEndDate: '',
                    })
                  }}
                />
              )
            }

            const isSelected = (filters.timeRange || 'all') === opt.value
            return (
              <FilterRadioOption
                key={opt.value}
                value={opt.value}
                label={opt.label}
                selected={isSelected}
                onSelect={(val) =>
                  onFilterChange({
                    timeRange: isSelected && val !== 'all' ? 'all' : (val as TimeRangeFilter),
                    customStartDate: '',
                    customEndDate: '',
                  })
                }
              />
            )
          })}
        </div>
      </FilterCollapsibleSection>

      {/* 2. Nhóm Cơ sở */}
      <FilterCollapsibleSection
        title="Cơ sở"
        defaultOpen={true}
        badgeCount={filters.branches.length}
        onClear={onClearSection ? () => onClearSection('branches') : undefined}
      >
        <div className="space-y-1">
          {branchOptions.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={filters.branches.includes(opt.value)}
              onToggle={(val) => onToggle('branches', val)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 3. Nhóm Trạng thái đơn hàng */}
      <FilterCollapsibleSection
        title="Trạng thái đơn hàng"
        defaultOpen={true}
        badgeCount={filters.orderStatuses.length}
        onClear={onClearSection ? () => onClearSection('orderStatuses') : undefined}
      >
        <div className="space-y-1">
          {orderStatusOptions.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={filters.orderStatuses.includes(opt.value as Order['status'])}
              onToggle={(val) => onToggle('orderStatuses', val)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 4. Nhóm Khoảng giá trị đơn hàng */}
      <FilterCollapsibleSection
        title="Khoảng giá trị đơn hàng"
        defaultOpen={Boolean(filters.amountRange && filters.amountRange !== 'all')}
        badgeCount={filters.amountRange && filters.amountRange !== 'all' ? 1 : 0}
        onClear={
          filters.amountRange && filters.amountRange !== 'all'
            ? () => onFilterChange({ amountRange: 'all' })
            : undefined
        }
      >
        <div className="space-y-1 pt-0.5">
          {ORDER_AMOUNT_RANGE_OPTIONS.map((opt) => {
            const isSelected = (filters.amountRange || 'all') === opt.value
            return (
              <FilterRadioOption
                key={opt.value}
                value={opt.value}
                label={opt.label}
                selected={isSelected}
                onSelect={(val) =>
                  onFilterChange({
                    amountRange: isSelected && val !== 'all' ? 'all' : (val as OrderAmountRange),
                  })
                }
              />
            )
          })}
        </div>
      </FilterCollapsibleSection>

      {/* 5. Nhóm Phương thức thanh toán */}
      <FilterCollapsibleSection
        title="Phương thức thanh toán"
        defaultOpen={true}
        badgeCount={filters.paymentMethods.length}
        onClear={onClearSection ? () => onClearSection('paymentMethods') : undefined}
      >
        <div className="space-y-1">
          {paymentMethodOptions.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={filters.paymentMethods.includes(opt.value as Order['paymentMethod'])}
              onToggle={(val) => onToggle('paymentMethods', val)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 6. Nhóm Trạng thái thanh toán */}
      <FilterCollapsibleSection
        title="Trạng thái thanh toán"
        defaultOpen={true}
        badgeCount={filters.paymentStatuses.length}
        onClear={onClearSection ? () => onClearSection('paymentStatuses') : undefined}
      >
        <div className="space-y-1">
          {paymentStatusOptions.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={filters.paymentStatuses.includes(opt.value as Order['paymentStatus'])}
              onToggle={(val) => onToggle('paymentStatuses', val)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 7. Nhóm Tính chất đơn hàng (Đơn mới vs Tái phí/Gia hạn) */}
      <FilterCollapsibleSection
        title="Tính chất đơn hàng"
        defaultOpen={Boolean(filters.orderNature && filters.orderNature !== 'all')}
        badgeCount={filters.orderNature && filters.orderNature !== 'all' ? 1 : 0}
        onClear={
          filters.orderNature && filters.orderNature !== 'all'
            ? () => onFilterChange({ orderNature: 'all' })
            : undefined
        }
      >
        <div className="space-y-1 pt-0.5">
          {ORDER_NATURE_OPTIONS.map((opt) => {
            const isSelected = (filters.orderNature || 'all') === opt.value
            return (
              <FilterRadioOption
                key={opt.value}
                value={opt.value}
                label={opt.label}
                selected={isSelected}
                onSelect={(val) =>
                  onFilterChange({
                    orderNature: isSelected && val !== 'all' ? 'all' : (val as OrderNatureFilter),
                  })
                }
              />
            )
          })}
        </div>
      </FilterCollapsibleSection>

      {/* 8. Nhóm Loại gói sản phẩm */}
      <FilterCollapsibleSection
        title="Loại gói sản phẩm"
        defaultOpen={(filters.packageCategories?.length || 0) > 0}
        badgeCount={filters.packageCategories?.length || 0}
        onClear={onClearSection ? () => onClearSection('packageCategories') : undefined}
      >
        <div className="space-y-1">
          {packageTypeOptions.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={(filters.packageCategories || []).includes(opt.value)}
              onToggle={(val) => onToggle('packageCategories', val)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 9. Nhóm Hình thức cung ứng / Sản phẩm */}
      <FilterCollapsibleSection
        title="Hình thức cung ứng SP/DV"
        defaultOpen={(filters.fulfillmentTypes?.length || 0) > 0}
        badgeCount={filters.fulfillmentTypes?.length || 0}
        onClear={onClearSection ? () => onClearSection('fulfillmentTypes') : undefined}
      >
        <div className="space-y-1">
          {FULFILLMENT_TYPE_OPTIONS.map((opt) => {
            const isChecked = (filters.fulfillmentTypes || []).includes(opt.value)
            return (
              <FilterCheckboxOption
                key={opt.value}
                value={opt.value}
                label={opt.label}
                checked={isChecked}
                onToggle={(val) => onToggle('fulfillmentTypes', val)}
              />
            )
          })}
        </div>
      </FilterCollapsibleSection>

      {/* 10. Nhóm Tiến độ chuyển giao SP/DV */}
      <FilterCollapsibleSection
        title="Tiến độ chuyển giao SP/DV"
        defaultOpen={(filters.fulfillmentStatuses?.length || 0) > 0}
        badgeCount={filters.fulfillmentStatuses?.length || 0}
        onClear={onClearSection ? () => onClearSection('fulfillmentStatuses') : undefined}
      >
        <div className="space-y-1">
          {fulfillmentStatusOptions.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={(filters.fulfillmentStatuses || []).includes(opt.value)}
              onToggle={(val) => onToggle('fulfillmentStatuses', val)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 11. Nhóm Nhân viên sale phụ trách */}
      <FilterCollapsibleSection
        title="Nhân viên sale phụ trách"
        defaultOpen={(filters.salesStaff?.length || 0) > 0}
        badgeCount={filters.salesStaff?.length || 0}
        onClear={onClearSection ? () => onClearSection('salesStaff') : undefined}
      >
        <div className="space-y-1.5">
          {allSalesStaff.length > 5 && (
            <div className="relative mb-1.5">
              <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm tên nhân viên..."
                value={salesSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalesSearch(e.target.value)}
                className="h-7 text-xs pl-7 pr-2"
              />
            </div>
          )}
          <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
            {filteredSalesStaff.map((staff) => (
              <FilterCheckboxOption
                key={staff}
                value={staff}
                label={staff}
                checked={(filters.salesStaff || []).includes(staff)}
                onToggle={(val) => onToggle('salesStaff', val)}
              />
            ))}
          </div>
        </div>
      </FilterCollapsibleSection>
    </FilterAsidePanel>
  )
}
