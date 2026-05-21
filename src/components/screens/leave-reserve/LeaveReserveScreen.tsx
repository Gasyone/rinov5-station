'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTableFrame, DataTablePagination, DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { getLeaveReserveRequests, updateLeaveReserveStatus, createLeaveReserveRequest, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import { LeaveReserveToolbar } from './LeaveReserveToolbar'
import { LeaveReserveTable } from './LeaveReserveTable'
import { LeaveReserveCreateDialog } from './LeaveReserveCreateDialog'

export function LeaveReserveScreen() {
  const [activeStatus, setActiveStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  // Force re-fetch mock data when state updates locally
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const filtered = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    updateTrigger; // dependency to trigger recalculation
    return getLeaveReserveRequests({
      search: searchQuery,
      branch: branchFilter || undefined,
      status: activeStatus === 'all' ? undefined : activeStatus,
      type: typeFilter || undefined,
    })
  }, [searchQuery, branchFilter, activeStatus, typeFilter, updateTrigger])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    return filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filtered, currentPage, pageSize])

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
        typeFilter={typeFilter}
        onTypeChange={(t) => { setTypeFilter(t); setPage(1); setSelectedIds(new Set()) }}
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

      <LeaveReserveCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateRequest}
      />
    </div>
  )
}
