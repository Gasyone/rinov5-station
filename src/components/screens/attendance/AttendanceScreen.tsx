'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { getAttendanceRecords } from '@/mocks/attendanceRecords'
import { AttendanceToolbar } from './AttendanceToolbar'
import { AttendanceTable } from './AttendanceTable'
import type { AttendanceStatusId } from './attendanceTypes'

export function AttendanceScreen() {
  const [activeStatus, setActiveStatus] = useState<AttendanceStatusId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  const filtered = useMemo(
    () =>
      getAttendanceRecords({
        search: searchQuery,
        branch: branchFilter === 'all' || !branchFilter ? undefined : branchFilter,
        status: activeStatus === 'all' ? undefined : activeStatus,
      }),
    [searchQuery, branchFilter, activeStatus],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <AttendanceToolbar
        activeStatus={activeStatus}
        onStatusChange={(s) => { setActiveStatus(s); setPage(1) }}
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(1) }}
        branchFilter={branchFilter}
        onBranchChange={(b) => { setBranchFilter(b); setPage(1) }}
        onFilterOpen={() => {}}
      />

      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-2 lg:px-6 lg:pb-6">
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
          <AttendanceTable
            records={paged}
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
            onView={() => toast.info('Xem chi tiết điểm danh')}
            onApprove={(id) => toast.success('Đã duyệt bản ghi')}
            onReject={(id) => toast.error('Đã từ chối bản ghi')}
          />
        </DataTableFrame>
      </div>
    </div>
  )
}
