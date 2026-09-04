'use client'

import {
  ExpandableSearch,
  FilterIconButton,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { Product } from '@/mocks/products'
import { PRODUCT_STATUS_TABS, type ProductFilterState, type ProductStatusFilter } from './productsTypes'
import { countProductsByStatus } from './productsHelpers'

interface ProductsToolbarProps {
  products: Product[]
  activeStatus: ProductStatusFilter
  searchTerm: string
  filters: ProductFilterState
  activeFilterCount: number
  onStatusChange: (status: ProductStatusFilter) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
}

export function ProductsToolbar({
  products,
  activeStatus,
  searchTerm,
  filters,
  activeFilterCount,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
}: ProductsToolbarProps) {
  const tiles: StatusTile<ProductStatusFilter>[] = PRODUCT_STATUS_TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    count: countProductsByStatus(products, tab.id, {
      search: searchTerm,
      extra: filters,
    }),
    status: tab.status,
    semantic: tab.id === 'all' ? 'neutral' : undefined,
  }))

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-3 py-2.5 border-b border-border/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm kiếm sản phẩm"
            placeholder="Tìm kiếm tên sản phẩm, mã SKU, tag..."
            inputClassName="sm:w-72"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        </div>
      </div>
    </div>
  )
}

