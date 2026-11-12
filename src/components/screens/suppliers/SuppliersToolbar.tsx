'use client'

import { Plus, Building2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ExpandableSearch,
  SegmentedControl,
  ToolbarSelect,
} from '@/components/controls'
import type { Supplier } from '@/mocks/suppliers'
import {
  SUPPLIER_TYPE_TABS,
  type SupplierTypeFilter,
} from './suppliersTypes'
import { countSuppliersByType } from './suppliersHelpers'

interface SuppliersToolbarProps {
  suppliers: Supplier[]
  activeType: SupplierTypeFilter
  activeCategory: string
  categories: string[]
  searchTerm: string
  onTypeChange: (type: SupplierTypeFilter) => void
  onCategoryChange: (category: string) => void
  onSearchChange: (value: string) => void
  onCreate: () => void
}

export function SuppliersToolbar({
  suppliers,
  activeType,
  activeCategory,
  categories,
  searchTerm,
  onTypeChange,
  onCategoryChange,
  onSearchChange,
  onCreate,
}: SuppliersToolbarProps) {
  const typeOptions = SUPPLIER_TYPE_TABS.map((tab) => ({
    value: tab.id,
    label: `${tab.label} (${countSuppliersByType(suppliers, tab.id)})`,
  }))

  const categoryOptions = [
    { value: 'all', label: 'Tất cả lĩnh vực cung cấp' },
    ...categories.map((cat) => ({
      value: cat,
      label: cat,
    })),
  ]

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 bg-background px-3 py-2.5 border-b border-border/60">
      {/* Phân loại Cá nhân / Tổ chức & Lọc Lĩnh vực */}
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          options={typeOptions}
          value={activeType}
          onValueChange={(val) => onTypeChange(val as SupplierTypeFilter)}
        />

        <ToolbarSelect
          options={categoryOptions}
          value={activeCategory}
          onValueChange={onCategoryChange}
          placeholder="Lĩnh vực cung cấp"
          className="min-w-48"
        />
      </div>

      {/* Tìm kiếm và Nút thêm mới */}
      <div className="flex items-center gap-2">
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          label="Tìm kiếm nhà cung cấp"
          placeholder="Tìm đối tượng, MST, người liên hệ, SĐT..."
          inputClassName="sm:w-64 text-xs h-8"
        />

        <Button
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs font-medium shadow-xs cursor-pointer"
          onClick={onCreate}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm đối tượng</span>
        </Button>
      </div>
    </div>
  )
}
