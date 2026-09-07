'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  DELIVERY_METHOD_MAP,
  FULFILLMENT_STATUS_MAP,
  PRODUCT_CATEGORY_MAP,
  getInitialOrderFulfillments,
  type DeliveryMethod,
  type FulfillmentProductCategory,
  type FulfillmentStatus,
  type OrderFulfillmentRecord,
} from '@/mocks/orderFulfillments'
import {
  FilterGroupSheetPanel,
  createFilterGroup,
  type FilterGroupConfig,
  getSchoolFilterGroup,
} from '@/components/filters'
import {
  calculateFulfillmentCounts,
  filterOrderFulfillments,
} from './orderFulfillmentHelpers'
import type {
  AdvancedFulfillmentFilterState,
  FilterDeliveryMethod,
  FilterStatus,
  OrderFulfillmentFilterState,
  QuickFilterId,
} from './orderFulfillmentTypes'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { OrderFulfillmentToolbar } from './OrderFulfillmentToolbar'
import { OrderFulfillmentStatusTiles } from './OrderFulfillmentStatusTiles'
import { OrderFulfillmentTable } from './OrderFulfillmentTable'
import { OrderFulfillmentActionDialog } from './OrderFulfillmentActionDialog'
import { OrderFulfillmentDetailDialog } from './OrderFulfillmentDetailDialog'

export function OrderFulfillmentScreen() {
  const [records, setRecords] = useState<OrderFulfillmentRecord[]>(() =>
    getInitialOrderFulfillments()
  )

  const [filters, setFilters] = useState<OrderFulfillmentFilterState>({
    search: '',
    branch: 'all',
    status: 'all',
    deliveryMethod: 'all',
    quickFilter: 'all',
  })

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFulfillmentFilterState>({
    branches: [],
    statuses: [],
    deliveryMethods: [],
    carriers: [],
    categories: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)

  // Dialogs state
  const [selectedRecord, setSelectedRecord] = useState<OrderFulfillmentRecord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [actionRecord, setActionRecord] = useState<OrderFulfillmentRecord | null>(null)
  const [isActionOpen, setIsActionOpen] = useState(false)

  // Filtered records
  const filteredRecords = useMemo(() => {
    return filterOrderFulfillments(records, filters, advancedFilters)
  }, [records, filters, advancedFilters])

  // Counts for status tiles
  const counts = useMemo(() => {
    return calculateFulfillmentCounts(
      records,
      {
        branch: filters.branch,
        deliveryMethod: filters.deliveryMethod,
        quickFilter: filters.quickFilter,
        search: filters.search,
      },
      advancedFilters
    )
  }, [records, filters.branch, filters.deliveryMethod, filters.quickFilter, filters.search, advancedFilters])

  // Carriers list from records
  const availableCarriers = useMemo(() => {
    const set = new Set<string>()
    records.forEach((r) => {
      if (r.carrier) set.add(r.carrier)
    })
    return Array.from(set)
  }, [records])

  const activeFilterCount =
    advancedFilters.branches.length +
    advancedFilters.statuses.length +
    advancedFilters.deliveryMethods.length +
    advancedFilters.carriers.length +
    advancedFilters.categories.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      getSchoolFilterGroup(
        'branches',
        advancedFilters.branches,
        (branch) => records.filter((r) => r.branch === branch).length,
        SYSTEM_BRANCHES
      ),
      createFilterGroup({
        id: 'deliveryMethods',
        title: 'Hình thức nhận hàng',
        options: ['pickup', 'shipping'] as DeliveryMethod[],
        selectedValues: advancedFilters.deliveryMethods,
        getOptionLabel: (method) => DELIVERY_METHOD_MAP[method as DeliveryMethod] || method,
        getOptionCount: (method) =>
          records.filter((r) => r.deliveryMethod === method).length,
      }),
      createFilterGroup({
        id: 'statuses',
        title: 'Trạng thái bàn giao',
        options: [
          'pending_handover',
          'shipping',
          'handed_over',
          'returned',
        ] as FulfillmentStatus[],
        selectedValues: advancedFilters.statuses,
        getOptionLabel: (status) =>
          FULFILLMENT_STATUS_MAP[status as FulfillmentStatus] || status,
        getOptionCount: (status) => records.filter((r) => r.status === status).length,
      }),
      createFilterGroup({
        id: 'carriers',
        title: 'Đơn vị vận chuyển',
        options: availableCarriers,
        selectedValues: advancedFilters.carriers,
        getOptionLabel: (carrier) => carrier,
        getOptionCount: (carrier) =>
          records.filter((r) => r.carrier === carrier).length,
      }),
      createFilterGroup({
        id: 'categories',
        title: 'Phân loại sản phẩm',
        options: [
          'textbook',
          'kit',
          'uniform',
          'learning_material',
          'gift',
        ] as FulfillmentProductCategory[],
        selectedValues: advancedFilters.categories,
        getOptionLabel: (cat) =>
          PRODUCT_CATEGORY_MAP[cat as FulfillmentProductCategory] || cat,
        getOptionCount: (cat) =>
          records.filter((r) => r.products.some((p) => p.category === cat)).length,
      }),
    ],
    [availableCarriers, records, advancedFilters]
  )

  const toggleAdvancedFilter = <K extends keyof AdvancedFulfillmentFilterState>(
    key: K,
    value: AdvancedFulfillmentFilterState[K][number]
  ) => {
    setCurrentPage(1)
    setAdvancedFilters((current) => {
      const arr = current[key] as string[]
      const exists = arr.includes(value as string)
      const next = exists ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...current, [key]: next } as AdvancedFulfillmentFilterState
    })
  }

  const handleBranchChange = (branch: string) => {
    setFilters((prev) => ({ ...prev, branch }))
    setCurrentPage(1)
  }

  const handleQuickFilterChange = (quickFilter: QuickFilterId) => {
    setFilters((prev) => ({ ...prev, quickFilter }))
    setCurrentPage(1)
  }

  const handleStatusChange = (status: FilterStatus) => {
    setFilters((prev) => ({ ...prev, status }))
    setCurrentPage(1)
  }

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }))
    setCurrentPage(1)
  }

  const handleViewDetail = (record: OrderFulfillmentRecord) => {
    setSelectedRecord(record)
    setIsDetailOpen(true)
  }

  const handleOpenAction = (record: OrderFulfillmentRecord) => {
    setActionRecord(record)
    setIsActionOpen(true)
  }

  const handleActionSuccess = (updatedRecord: OrderFulfillmentRecord) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r))
    )
    toast.success(`Đã cập nhật thành công phiếu bàn giao / vận đơn ${updatedRecord.id}!`)
  }

  return (
    <div className="flex flex-col h-full w-full px-4 py-3 lg:px-6 space-y-2">
      {/* 1. TOOLBAR BỘ LỌC */}
      <OrderFulfillmentToolbar
        records={records}
        branches={SYSTEM_BRANCHES}
        activeBranch={filters.branch}
        searchTerm={filters.search}
        activeFilterCount={activeFilterCount}
        onBranchChange={handleBranchChange}
        onSearchChange={handleSearchChange}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      {/* 2. THẺ ĐẾM TRẠNG THÁI STATUS TILES & CỤM TAB LỌC NHANH */}
      <OrderFulfillmentStatusTiles
        counts={counts}
        activeStatus={filters.status}
        activeQuickFilter={filters.quickFilter}
        onStatusChange={handleStatusChange}
        onQuickFilterChange={handleQuickFilterChange}
      />

      {/* 3. BẢNG DỮ LIỆU CHÍNH */}
      <div className="flex-1 min-h-0">
        <OrderFulfillmentTable
          records={filteredRecords}
          totalItems={filteredRecords.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          onViewDetail={handleViewDetail}
          onAction={handleOpenAction}
        />
      </div>

      {/* 4. MODAL XÁC NHẬN BÀN GIAO / CẬP NHẬT VẬN ĐƠN */}
      <OrderFulfillmentActionDialog
        record={actionRecord}
        open={isActionOpen}
        onOpenChange={setIsActionOpen}
        onSuccess={handleActionSuccess}
      />

      {/* 5. MODAL XEM CHI TIẾT PHIẾU */}
      <OrderFulfillmentDetailDialog
        record={selectedRecord}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onOpenAction={handleOpenAction}
      />

      {/* 6. MODAL / DRAWER BỘ LỌC NÂNG CAO */}
      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc nâng cao"
        description="Kết hợp lọc theo cơ sở, hình thức nhận, trạng thái, hãng vận chuyển và loại sản phẩm."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') toggleAdvancedFilter('branches', value)
          if (sectionId === 'deliveryMethods')
            toggleAdvancedFilter('deliveryMethods', value as DeliveryMethod)
          if (sectionId === 'statuses')
            toggleAdvancedFilter('statuses', value as FulfillmentStatus)
          if (sectionId === 'carriers')
            toggleAdvancedFilter('carriers', value)
          if (sectionId === 'categories')
            toggleAdvancedFilter('categories', value as FulfillmentProductCategory)
        }}
        onClearAll={() => {
          setAdvancedFilters({
            branches: [],
            statuses: [],
            deliveryMethods: [],
            carriers: [],
            categories: [],
          })
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
