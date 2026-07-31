'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { getLeaveReserveRequests, updateLeaveReserveStatus, createLeaveReserveRequest, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import { LeaveReserveToolbar } from './LeaveReserveToolbar'
import { LeaveReserveTable } from './LeaveReserveTable'
import { LeaveReserveCreateDialog } from './LeaveReserveCreateDialog'
import { LeaveReserveDetailDialog } from './LeaveReserveDetailDialog'
import { TYPE_LABELS, type LeaveReserveFilterState } from './leaveReserveTypes'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { getRequestSubject } from './leaveReserveHelpers'

export function LeaveReserveScreen() {
  const [activeStatus, setActiveStatus] = useState<'all' | 'pending' | 'approved' | 'not_approved' | 'cancel'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [activeSubject, setActiveSubject] = useState('all')
  const [filters, setFilters] = useState<LeaveReserveFilterState>({
    types: [],
    dateRanges: [],
    schools: [],
    packages: [],
    staff: [],
    classes: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [selectedDetailRequest, setSelectedDetailRequest] = useState<LeaveReserveRequest | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Force re-fetch mock data when state updates locally
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const allRequests = useMemo(() => getLeaveReserveRequests({}), [])

  const filtered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    updateTrigger; // dependency to trigger recalculation
    let reqs = getLeaveReserveRequests({
      search: searchQuery,
      branch: branchFilter === 'all' || !branchFilter ? undefined : branchFilter,
      status: activeStatus === 'all' ? undefined : activeStatus,
      types: filters.types.length > 0 ? filters.types : undefined,
      dateRanges: filters.dateRanges.length > 0 ? filters.dateRanges : undefined,
    })

    if (activeSubject !== 'all') {
      reqs = reqs.filter((r) => getRequestSubject(r) === activeSubject)
    }
    if (filters.schools.length > 0) {
      reqs = reqs.filter((r) => filters.schools.includes(r.branch))
    }
    if (filters.packages.length > 0) {
      reqs = reqs.filter((r) => filters.packages.includes(r.productPackage))
    }
    if (filters.staff.length > 0) {
      reqs = reqs.filter((r) => {
        const names = [
          r.requestedBy,
          r.approvedBy ? r.approvedBy.replace(' (Quản lý)', '') : null
        ].filter(Boolean)
        return names.some((n) => filters.staff.includes(n!))
      })
    }
    if (filters.classes.length > 0) {
      reqs = reqs.filter((r) => filters.classes.includes(r.className))
    }
    return reqs
  }, [searchQuery, branchFilter, activeSubject, activeStatus, filters, updateTrigger])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filtered, currentPage, pageSize])

  const activeFilterCount =
    filters.types.length +
    filters.dateRanges.length +
    filters.schools.length +
    filters.packages.length +
    filters.staff.length +
    filters.classes.length

  const types = useMemo(() => [...new Set(allRequests.map((r) => r.type))].filter(Boolean), [allRequests])
  const schools = SYSTEM_BRANCHES
  const packages = useMemo(() => [...new Set(allRequests.map((r) => r.productPackage))].filter(Boolean), [allRequests])
  const staff = useMemo(() => {
    const list = new Set<string>()
    for (const r of allRequests) {
      if (r.requestedBy) list.add(r.requestedBy)
      if (r.approvedBy) list.add(r.approvedBy.replace(' (Quản lý)', ''))
    }
    return [...list].filter(Boolean)
  }, [allRequests])
  const classes = useMemo(() => [...new Set(allRequests.map((r) => r.className))].filter(Boolean), [allRequests])

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
        id: 'schools',
        title: 'Trường học',
        options: schools,
        selectedValues: filters.schools,
        getOptionCount: (school) => allRequests.filter((r) => r.branch === school).length,
      }),
      createFilterGroup({
        id: 'classes',
        title: 'Lớp học',
        options: classes,
        selectedValues: filters.classes,
        getOptionCount: (cls) => allRequests.filter((r) => r.className === cls).length,
      }),
      createFilterGroup({
        id: 'packages',
        title: 'Gói sản phẩm',
        options: packages,
        selectedValues: filters.packages,
        getOptionCount: (pkg) => allRequests.filter((r) => r.productPackage === pkg).length,
      }),
      createFilterGroup({
        id: 'staff',
        title: 'Nhân sự phụ trách',
        options: staff,
        selectedValues: filters.staff,
        getOptionCount: (name) =>
          allRequests.filter(
            (r) =>
              r.requestedBy === name ||
              (r.approvedBy && r.approvedBy.replace(' (Quản lý)', '') === name)
          ).length,
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
    [types, schools, classes, packages, staff, allRequests, filters]
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

  const handleAction = (id: string, action: 'approved' | 'not_approved' | 'cancel', reason?: string) => {
    const success = updateLeaveReserveStatus(id, action, 'Trần Văn A (Quản lý)', reason)
    if (success) {
      setUpdateTrigger((prev) => prev + 1)
      toast.success(
        action === 'approved'
          ? 'Đã phê duyệt đơn yêu cầu thành công'
          : action === 'not_approved'
          ? 'Đã từ chối đơn yêu cầu thành công'
          : 'Đã hủy duyệt đơn yêu cầu thành công'
      )
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
        activeSubject={activeSubject}
        onSubjectChange={(s) => { setActiveSubject(s); setPage(1); setSelectedIds(new Set()) }}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setIsFilterOpen(true)}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-2 lg:px-3 lg:pb-3">
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
            onRowClick={(req) => {
              setSelectedDetailRequest(req)
              setIsDetailOpen(true)
            }}
          />
        </DataTableFrame>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc đơn yêu cầu"
        description="Lọc theo loại đơn, trường học và khoảng thời gian."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'types') toggleArray('types', value as LeaveReserveRequest['type'])
          if (sectionId === 'schools') toggleArray('schools', value as string)
          if (sectionId === 'classes') toggleArray('classes', value as string)
          if (sectionId === 'packages') toggleArray('packages', value as string)
          if (sectionId === 'staff') toggleArray('staff', value as string)
          if (sectionId === 'dateRanges') toggleArray('dateRanges', value as LeaveReserveFilterState['dateRanges'][number])
        }}
        onClearAll={() => {
          setFilters({ types: [], dateRanges: [], schools: [], packages: [], staff: [], classes: [] })
          setPage(1)
        }}
      />

      <LeaveReserveCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateRequest}
      />

      <LeaveReserveDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        request={selectedDetailRequest}
        onAction={handleAction}
      />
    </div>
  )
}
