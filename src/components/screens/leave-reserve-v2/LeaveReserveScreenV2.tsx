'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { getLeaveReserveRequests, updateLeaveReserveStatus, createLeaveReserveRequest, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import { LeaveReserveToolbar } from './LeaveReserveToolbar'
import { LeaveReserveTable } from './LeaveReserveTable'
import { LeaveReserveCreateDialog } from './LeaveReserveCreateDialog'
import { TYPE_LABELS, type LeaveReserveFilterState } from './leaveReserveTypes'

export function LeaveReserveScreenV2() {
  const [activeStatus, setActiveStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [filters, setFilters] = useState<LeaveReserveFilterState>({
    types: [],
    dateRanges: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  // Force re-fetch mock data when state updates locally
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const allRequests = useMemo(() => getLeaveReserveRequests({}), [])

  const filtered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    updateTrigger; // dependency to trigger recalculation
    return getLeaveReserveRequests({
      search: searchQuery,
      branch: branchFilter === 'all' || !branchFilter ? undefined : branchFilter,
      status: activeStatus === 'all' ? undefined : activeStatus,
      types: filters.types.length > 0 ? filters.types : undefined,
      dateRanges: filters.dateRanges.length > 0 ? filters.dateRanges : undefined,
    })
  }, [searchQuery, branchFilter, activeStatus, filters, updateTrigger])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filtered, currentPage, pageSize])

  const activeFilterCount = filters.types.length + filters.dateRanges.length

  const types = useMemo(() => [...new Set(allRequests.map((r) => r.type))].filter(Boolean), [allRequests])

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'types',
        title: 'Loại đơn',
        options: types,
        selectedValues: filters.types,
        getOptionLabel: (type) => TYPE_LABELS[type as LeaveReserveRequest['type']],
        getOptionCount: (type) => allRequests.filter((r) => r.type === type).length,
      }),
      createFilterGroup({
        id: 'dateRanges',
        options: [
          { value: 'this-week', label: 'Tuần này' },
          { value: 'this-month', label: 'Tháng này' },
          { value: 'last-month', label: 'Tháng trước' },
        ],
        selectedValues: filters.dateRanges,
      }),
    ],
    [types, allRequests, filters]
  )

  const toggleArray = <K extends keyof LeaveReserveFilterState>(key: K, value: LeaveReserveFilterState[K][number]) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      const exists = arr.includes(value as string)
      return {
        ...current,
        [key]: exists ? arr.filter((v) => v !== value) : [...arr, value],
      } as LeaveReserveFilterState
    })
  }

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    const success = updateLeaveReserveStatus(id, action, 'Trần Văn A (Quản lý)')
    if (success) {
      setUpdateTrigger((prev) => prev + 1)
      toast.success(action === 'approved' ? 'Đã phê duyệt đơn yêu cầu thành công' : 'Đã từ chối đơn yêu cầu thành công')
    } else {
      toast.error('Có lỗi xảy ra khi cập nhật đơn yêu cầu')
    }
  }

  const handleCreateRequest = (newReq: Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>) => {
    createLeaveReserveRequest(newReq)
    setUpdateTrigger((prev) => prev + 1)
    toast.success('Đã gửi đơn yêu cầu mới thành công')
  }

  const handlePageChange = (p: number) => {
    setPage(p)
    setSelectedIds(new Set())
  }

  const handlePageSizeChange = (ps: number) => {
    setPageSize(ps)
    setPage(1)
    setSelectedIds(new Set())
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <LeaveReserveToolbar
        activeStatus={activeStatus}
        onStatusChange={(s) => { setActiveStatus(s); setPage(1); setSelectedIds(new Set()) }}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1); setSelectedIds(new Set()) }}
        branchFilter={branchFilter}
        onBranchChange={(b) => { setBranchFilter(b); setPage(1); setSelectedIds(new Set()) }}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreateRequest={() => setCreateOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          }
        >
          <LeaveReserveTable
            requests={paged}
            selectedIds={selectedIds}
            onToggleAll={(checked, ids) => setSelectedIds(checked ? new Set(ids) : new Set())}
            onToggleOne={(id, checked) => {
              setSelectedIds((cur) => {
                const next = new Set(cur)
                if (checked) next.add(id)
                else next.delete(id)
                return next
              })
            }}
            onAction={handleAction}
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc đơn yêu cầu"
        description="Lọc theo loại đơn và khoảng thời gian."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'types') toggleArray('types', value as LeaveReserveRequest['type'])
          if (sectionId === 'dateRanges') toggleArray('dateRanges', value as LeaveReserveFilterState['dateRanges'][number])
        }}
        onClearAll={() => {
          setFilters({ types: [], dateRanges: [] })
          setPage(1)
        }}
      />

      <LeaveReserveCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateRequest}
      />
    </div>
  )
}
