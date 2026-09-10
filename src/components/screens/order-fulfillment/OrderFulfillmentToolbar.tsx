'use client'

import { Gift } from 'lucide-react'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
} from '@/components/controls'
import { Button } from '@/components/ui/button'

interface OrderFulfillmentToolbarProps {
  branches: string[]
  activeBranch: string
  searchTerm: string
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onOpenCreate: () => void
}

export function OrderFulfillmentToolbar({
  branches,
  activeBranch,
  searchTerm,
  activeFilterCount,
  onBranchChange,
  onSearchChange,
  onOpenFilters,
  onOpenCreate,
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

      {/* Tìm kiếm, Lọc nâng cao, Nút tạo phiếu & Smartcard Popover bên phải */}
      <div className="flex items-center gap-2">
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          placeholder="Tìm theo mã đơn, DLV, căn cứ, SĐT, học viên..."
        />
        <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        <Button
          size="sm"
          className="h-8 text-xs font-medium gap-1.5 cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xs"
          onClick={onOpenCreate}
        >
          <Gift className="h-3.5 w-3.5" />
          <span>+ Xuất quà / Bàn giao</span>
        </Button>
      </div>
    </div>
  )
}

