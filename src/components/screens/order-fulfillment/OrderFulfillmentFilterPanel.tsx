'use client'

import React from 'react'
import {
  FilterAsidePanel,
  FilterCheckboxOption,
  FilterCollapsibleSection,
} from '@/components/filters'
import {
  DELIVERY_METHOD_MAP,
  FULFILLMENT_STATUS_MAP,
  PRODUCT_CATEGORY_MAP,
  SOURCE_TYPE_MAP,
  type DeliveryMethod,
  type FulfillmentProductCategory,
  type FulfillmentSourceType,
  type FulfillmentStatus,
} from '@/mocks/orderFulfillments'
import { SYSTEM_BRANCHES } from '@/components/controls'
import type { AdvancedFulfillmentFilterState } from './orderFulfillmentTypes'

interface OrderFulfillmentFilterPanelProps {
  filters: AdvancedFulfillmentFilterState
  availableCarriers: string[]
  onClose: () => void
  onToggle: <K extends keyof AdvancedFulfillmentFilterState>(
    key: K,
    value: AdvancedFulfillmentFilterState[K][number]
  ) => void
  onClearAll: () => void
  onClearSection?: (key: keyof AdvancedFulfillmentFilterState) => void
}

const SOURCE_TYPE_OPTIONS: Array<{ value: FulfillmentSourceType; label: string }> = [
  { value: 'order', label: SOURCE_TYPE_MAP.order },
  { value: 'care_gift', label: SOURCE_TYPE_MAP.care_gift },
  { value: 'reward', label: SOURCE_TYPE_MAP.reward },
  { value: 'event', label: SOURCE_TYPE_MAP.event },
  { value: 'direct_issue', label: SOURCE_TYPE_MAP.direct_issue },
]

const DELIVERY_METHOD_OPTIONS: Array<{ value: DeliveryMethod; label: string }> = [
  { value: 'pickup', label: DELIVERY_METHOD_MAP.pickup },
  { value: 'shipping', label: DELIVERY_METHOD_MAP.shipping },
]

const FULFILLMENT_STATUS_OPTIONS: Array<{ value: FulfillmentStatus; label: string }> = [
  { value: 'pending_handover', label: FULFILLMENT_STATUS_MAP.pending_handover },
  { value: 'shipping', label: FULFILLMENT_STATUS_MAP.shipping },
  { value: 'handed_over', label: FULFILLMENT_STATUS_MAP.handed_over },
  { value: 'returned', label: FULFILLMENT_STATUS_MAP.returned },
]

const PRODUCT_CATEGORY_OPTIONS: Array<{ value: FulfillmentProductCategory; label: string }> = [
  { value: 'textbook', label: PRODUCT_CATEGORY_MAP.textbook },
  { value: 'learning_material', label: PRODUCT_CATEGORY_MAP.learning_material },
  { value: 'gift', label: PRODUCT_CATEGORY_MAP.gift },
  { value: 'uniform', label: PRODUCT_CATEGORY_MAP.uniform },
  { value: 'kit', label: PRODUCT_CATEGORY_MAP.kit },
]

export function OrderFulfillmentFilterPanel({
  filters,
  availableCarriers,
  onClose,
  onToggle,
  onClearAll,
  onClearSection,
}: OrderFulfillmentFilterPanelProps) {
  const activeCount =
    filters.branches.length +
    filters.sourceTypes.length +
    filters.deliveryMethods.length +
    filters.statuses.length +
    filters.carriers.length +
    filters.categories.length

  return (
    <FilterAsidePanel
      title="Bộ lọc nâng cao"
      activeCount={activeCount}
      onReset={onClearAll}
      resetLabel="Đặt lại"
      onClose={onClose}
      ariaLabel="Panel bộ lọc nâng cao"
      width="w-[300px]"
    >
      {/* 1. Nhóm Cơ sở */}
      <FilterCollapsibleSection
        title="Cơ sở"
        defaultOpen={true}
        badgeCount={filters.branches.length}
        onClear={onClearSection ? () => onClearSection('branches') : undefined}
      >
        <div className="space-y-1">
          {SYSTEM_BRANCHES.map((branch) => (
            <FilterCheckboxOption
              key={branch}
              value={branch}
              label={branch}
              checked={filters.branches.includes(branch)}
              onToggle={(val) => onToggle('branches', val)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 2. Nhóm Căn cứ / Nguồn bàn giao */}
      <FilterCollapsibleSection
        title="Căn cứ / Nguồn bàn giao"
        defaultOpen={true}
        badgeCount={filters.sourceTypes.length}
        onClear={onClearSection ? () => onClearSection('sourceTypes') : undefined}
      >
        <div className="space-y-1">
          {SOURCE_TYPE_OPTIONS.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={filters.sourceTypes.includes(opt.value)}
              onToggle={(val) => onToggle('sourceTypes', val as FulfillmentSourceType)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 3. Nhóm Hình thức nhận hàng */}
      <FilterCollapsibleSection
        title="Hình thức nhận hàng"
        defaultOpen={true}
        badgeCount={filters.deliveryMethods.length}
        onClear={onClearSection ? () => onClearSection('deliveryMethods') : undefined}
      >
        <div className="space-y-1">
          {DELIVERY_METHOD_OPTIONS.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={filters.deliveryMethods.includes(opt.value)}
              onToggle={(val) => onToggle('deliveryMethods', val as DeliveryMethod)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 4. Nhóm Trạng thái bàn giao */}
      <FilterCollapsibleSection
        title="Trạng thái bàn giao"
        defaultOpen={true}
        badgeCount={filters.statuses.length}
        onClear={onClearSection ? () => onClearSection('statuses') : undefined}
      >
        <div className="space-y-1">
          {FULFILLMENT_STATUS_OPTIONS.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={filters.statuses.includes(opt.value)}
              onToggle={(val) => onToggle('statuses', val as FulfillmentStatus)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>

      {/* 5. Nhóm Đơn vị vận chuyển */}
      <FilterCollapsibleSection
        title="Đơn vị vận chuyển"
        defaultOpen={filters.carriers.length > 0}
        badgeCount={filters.carriers.length}
        onClear={onClearSection ? () => onClearSection('carriers') : undefined}
      >
        <div className="space-y-1">
          {availableCarriers.length > 0 ? (
            availableCarriers.map((carrier) => (
              <FilterCheckboxOption
                key={carrier}
                value={carrier}
                label={carrier}
                checked={filters.carriers.includes(carrier)}
                onToggle={(val) => onToggle('carriers', val)}
              />
            ))
          ) : (
            <p className="text-[11px] text-muted-foreground px-2 py-1">Chưa có đơn vị vận chuyển</p>
          )}
        </div>
      </FilterCollapsibleSection>

      {/* 6. Nhóm Phân loại sản phẩm */}
      <FilterCollapsibleSection
        title="Phân loại sản phẩm"
        defaultOpen={filters.categories.length > 0}
        badgeCount={filters.categories.length}
        onClear={onClearSection ? () => onClearSection('categories') : undefined}
      >
        <div className="space-y-1">
          {PRODUCT_CATEGORY_OPTIONS.map((opt) => (
            <FilterCheckboxOption
              key={opt.value}
              value={opt.value}
              label={opt.label}
              checked={filters.categories.includes(opt.value)}
              onToggle={(val) => onToggle('categories', val as FulfillmentProductCategory)}
            />
          ))}
        </div>
      </FilterCollapsibleSection>
    </FilterAsidePanel>
  )
}
