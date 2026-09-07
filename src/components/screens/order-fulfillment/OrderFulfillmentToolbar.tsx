'use client'

import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
} from '@/components/controls'
import type { OrderFulfillmentRecord } from '@/mocks/orderFulfillments'
import { OrderFulfillmentSmartcardPopover } from './OrderFulfillmentSmartcardPopover'

interface OrderFulfillmentToolbarProps {
  records: OrderFulfillmentRecord[]
  branches: string[]
  activeBranch: string
  searchTerm: string
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
}

export function OrderFulfillmentToolbar({
  records,
  branches,
  activeBranch,
  searchTerm,
  activeFilterCount,
  onBranchChange,
  onSearchChange,
  onOpenFilters,
}: OrderFulfillmentToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 bg-background py-1">
      {/* Bộ lọc bên trái: Cơ sở */}
      <div className="flex flex-wrap items-center gap-2">
        <BranchSelect
          value={activeBranch}
          branches={branches}
          onValueChange={onBranchChange}
          allLabel="Tất cả cơ sở"
          ariaLabel="Lọc theo cơ sở"
        />
      </div>

      {/* Tìm kiếm, Lọc nâng cao & Smartcard Popover bên phải */}
      <div className="flex items-center gap-2">
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          placeholder="Tìm theo mã đơn, DLV, khách hàng, SĐT, học viên..."
        />
        <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        <OrderFulfillmentSmartcardPopover records={records} />
      </div>
    </div>
  )
}

