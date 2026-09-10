'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  getInitialOrderFulfillments,
  type OrderFulfillmentRecord,
} from '@/mocks/orderFulfillments'
import {
  calculateFulfillmentCounts,
  filterOrderFulfillments,
} from './orderFulfillmentHelpers'
import type {
  AdvancedFulfillmentFilterState,
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
import { OrderFulfillmentBulkActionDialog } from './OrderFulfillmentBulkActionDialog'
import { OrderFulfillmentCreateDialog } from './OrderFulfillmentCreateDialog'
import { OrderFulfillmentFilterPanel } from './OrderFulfillmentFilterPanel'

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
    sourceTypes: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)

  // Dialogs state
  const [selectedRecord, setSelectedRecord] = useState<OrderFulfillmentRecord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [actionRecord, setActionRecord] = useState<OrderFulfillmentRecord | null>(null)
  const [isActionOpen, setIsActionOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)

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
    advancedFilters.categories.length +
    advancedFilters.sourceTypes.length

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

  const handleOpenBulk = (ids: string[]) => {
    setBulkSelectedIds(ids)
    setIsBulkOpen(true)
  }

  const handleBulkConfirm = (data: {
    handoverBy: string
    notes: string
    podImage?: string
    handoverDate: string
  }) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (!bulkSelectedIds.includes(r.id)) return r
        return {
          ...r,
          status: 'handed_over',
          handoverBy: data.handoverBy,
          handoverDate: data.handoverDate,
          completedAt: data.handoverDate,
          notes: data.notes || r.notes,
          podImages: data.podImage ? [data.podImage] : r.podImages,
        }
      })
    )
    toast.success(`Đã bàn giao thành công ${bulkSelectedIds.length} phiếu!`)
    setBulkSelectedIds([])
  }

  const handleCreateSuccess = (newRecords: OrderFulfillmentRecord[]) => {
    setRecords((prev) => [...newRecords, ...prev])
    if (newRecords.length === 1) {
      toast.success(`Đã tạo phiếu bàn giao ${newRecords[0].id} thành công!`)
    } else {
      toast.success(`Đã tạo thành công ${newRecords.length} phiếu bàn giao quà tặng!`)
    }
  }

  return (
    <div className="flex flex-col h-full w-full px-4 py-3 lg:px-6 space-y-2">
      {/* 1. TOOLBAR BỘ LỌC */}
      <OrderFulfillmentToolbar
        branches={SYSTEM_BRANCHES}
        activeBranch={filters.branch}
        searchTerm={filters.search}
        activeFilterCount={activeFilterCount}
        onBranchChange={handleBranchChange}
        onSearchChange={handleSearchChange}
        onOpenFilters={() => setIsFilterOpen((prev) => !prev)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* 2. THẺ ĐẾM TRẠNG THÁI STATUS TILES & CỤM TAB LỌC NHANH */}
      <OrderFulfillmentStatusTiles
        counts={counts}
        activeStatus={filters.status}
        activeQuickFilter={filters.quickFilter}
        onStatusChange={handleStatusChange}
        onQuickFilterChange={handleQuickFilterChange}
      />

      {/* 3. BẢNG DỮ LIỆU CHÍNH & PANEL BỘ LỌC GHIM CẠNH PHẢI */}
      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <OrderFulfillmentTable
            records={filteredRecords}
            totalItems={filteredRecords.length}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            onViewDetail={handleViewDetail}
            onAction={handleOpenAction}
            onBulkHandover={handleOpenBulk}
          />
        </div>

        {/* Panel bộ lọc ghim ở cạnh phải (FilterAsidePanel) */}
        {isFilterOpen && (
          <OrderFulfillmentFilterPanel
            filters={advancedFilters}
            availableCarriers={availableCarriers}
            onClose={() => setIsFilterOpen(false)}
            onToggle={toggleAdvancedFilter}
            onClearAll={() => {
              setAdvancedFilters({
                branches: [],
                statuses: [],
                deliveryMethods: [],
                carriers: [],
                categories: [],
                sourceTypes: [],
              })
              setCurrentPage(1)
            }}
            onClearSection={(key) => {
              setAdvancedFilters((prev) => ({
                ...prev,
                [key]: [],
              }))
              setCurrentPage(1)
            }}
          />
        )}
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

      {/* 6. MODAL BÀN GIAO HÀNG LOẠT */}
      <OrderFulfillmentBulkActionDialog
        selectedRecords={records.filter((r) => bulkSelectedIds.includes(r.id))}
        open={isBulkOpen}
        onOpenChange={setIsBulkOpen}
        onConfirm={handleBulkConfirm}
      />

      {/* 7. MODAL TẠO PHIẾU BÀN GIAO QUÀ TẶNG / VẬT PHẨM */}
      <OrderFulfillmentCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={handleCreateSuccess}
      />
    </div>
  )
}
