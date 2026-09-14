'use client'

import { useMemo, useState } from 'react'
import {
  DataTableFrame,
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import {
  FilterGroupAsidePanel,
  createFilterGroup,
  type FilterGroupConfig,
} from '@/components/filters'
import {
  getInitialPromotions,
  getPromotionBranches,
  getPromotionDiscountTypes,
  getPromotionTypes,
} from '@/mocks/promotions'
import type { PromotionDiscountType, PromotionItem, PromotionType } from '@/mocks/promotions'
import { filterPromotions } from './promotionsHelpers'
import {
  PROMOTION_DISCOUNT_TYPE_LABELS,
  PROMOTION_TYPE_LABELS,
  type PromotionFilterState,
  type PromotionStatusTab,
} from './promotionsTypes'
import { PromotionsToolbar } from './PromotionsToolbar'
import { PromotionsTable } from './PromotionsTable'
import { PromotionsDetailDialog } from './PromotionsDetailDialog'
import { PromotionsFormDialog } from './PromotionsFormDialog'

export function PromotionsScreen() {
  const [promotions, setPromotions] = useState<PromotionItem[]>(() => getInitialPromotions())
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<PromotionStatusTab>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<PromotionFilterState>({
    types: [],
    discountTypes: [],
    branches: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionItem | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const availableBranches = useMemo(() => getPromotionBranches(promotions), [promotions])
  const availableTypes = useMemo(() => getPromotionTypes(promotions), [promotions])
  const availableDiscountTypes = useMemo(() => getPromotionDiscountTypes(promotions), [promotions])

  const filtered = useMemo(
    () =>
      filterPromotions(promotions, {
        search: searchTerm,
        tab: activeTab,
        extra: filters,
      }),
    [promotions, searchTerm, activeTab, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount =
    filters.types.length + filters.discountTypes.length + filters.branches.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'types',
        title: 'Phân loại mã',
        options: availableTypes,
        selectedValues: filters.types,
        getOptionLabel: (type) => PROMOTION_TYPE_LABELS[type as PromotionType] ?? type,
        getOptionCount: (type) => promotions.filter((p) => p.type === type).length,
      }),
      createFilterGroup({
        id: 'discountTypes',
        title: 'Hình thức giảm giá',
        options: availableDiscountTypes,
        selectedValues: filters.discountTypes,
        getOptionLabel: (dt) => PROMOTION_DISCOUNT_TYPE_LABELS[dt as PromotionDiscountType] ?? dt,
        getOptionCount: (dt) => promotions.filter((p) => p.discountType === dt).length,
      }),
      createFilterGroup({
        id: 'branches',
        title: 'Cơ sở áp dụng',
        options: availableBranches,
        selectedValues: filters.branches,
        getOptionCount: (branch) => promotions.filter((p) => p.branch === branch).length,
      }),
    ],
    [availableBranches, availableTypes, availableDiscountTypes, promotions, filters]
  )

  const toggleArray = <K extends keyof PromotionFilterState>(
    key: K,
    value: PromotionFilterState[K][number]
  ) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      return {
        ...current,
        [key]: arr.includes(value as string)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      } as PromotionFilterState
    })
  }

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paged.map((p) => p.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleCreateSubmit = (newPromoData: Partial<PromotionItem>) => {
    const newPromo: PromotionItem = {
      id: `promo-${Date.now()}`,
      code: newPromoData.code || 'VOUCHER',
      name: newPromoData.name || 'Mã ưu đãi mới',
      description: newPromoData.description || '',
      type: newPromoData.type || 'public',
      discountType: newPromoData.discountType || 'direct',
      discountValue: newPromoData.discountValue || 0,
      usageLimit: newPromoData.usageLimit ?? null,
      quantity: newPromoData.quantity ?? null,
      usedCount: 0,
      status: 'active',
      minOrderValue: newPromoData.minOrderValue || 0,
      branch: newPromoData.branch || 'Toàn hệ thống',
      applicableCategoryText: newPromoData.applicableCategoryText || 'Tất cả sản phẩm',
      applicableProducts: newPromoData.applicableProducts || [],
      validFrom: newPromoData.validFrom || new Date().toISOString().slice(0, 10),
      validTo: newPromoData.validTo || 'Không giới hạn',
      createdBy: newPromoData.createdBy || 'Quản trị viên',
      createdAt: new Date().toISOString().slice(0, 10),
      notes: newPromoData.notes,
    }

    setPromotions((prev) => [newPromo, ...prev])
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Toolbar với StatusTiles, Tìm kiếm & Nút Tạo mới */}
      <PromotionsToolbar
        promotions={promotions}
        activeTab={activeTab}
        searchTerm={searchTerm}
        filters={filters}
        activeFilterCount={activeFilterCount}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setPage(1)
        }}
        onSearchChange={(v) => {
          setSearchTerm(v)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      {/* Main Table container + Aside Filter */}
      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden px-3 pb-3 lg:px-3 lg:pb-3">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <DataTableFrame
            footer={
              <DataTablePagination
                page={currentPage}
                total={filtered.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            }
          >
            <PromotionsTable
              items={paged}
              selectedIds={selectedIds}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelectRow={handleToggleSelectRow}
              onRowClick={(item) => setSelectedPromotion(item)}
              onView={(item) => setSelectedPromotion(item)}
            />
          </DataTableFrame>
        </div>

        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc mã khuyến mãi"
            description="Lọc danh sách theo loại mã, hình thức giảm và cơ sở áp dụng."
            groups={filterGroups}
            onToggle={(sectionId, value) => {
              if (sectionId === 'types') toggleArray('types', value as PromotionType)
              if (sectionId === 'discountTypes')
                toggleArray('discountTypes', value as PromotionDiscountType)
              if (sectionId === 'branches') toggleArray('branches', value)
            }}
            onClearAll={() => {
              setFilters({ types: [], discountTypes: [], branches: [] })
              setPage(1)
            }}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </div>

      {/* Dialog xem chi tiết mã khuyến mãi */}
      <PromotionsDetailDialog
        open={Boolean(selectedPromotion)}
        promotion={selectedPromotion}
        onOpenChange={(open) => {
          if (!open) setSelectedPromotion(null)
        }}
      />

      {/* Dialog tạo mới mã khuyến mãi */}
      <PromotionsFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateSubmit}
      />
    </div>
  )
}
