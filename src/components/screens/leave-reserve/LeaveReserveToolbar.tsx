'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BranchSelect, ExpandableSearch, ToolbarSelect } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { mockLeaveReserveRequests, getLeaveReserveRequests } from '@/mocks/leaveReserve'

interface LeaveReserveToolbarProps {
  activeStatus: 'all' | 'pending' | 'approved' | 'rejected'
  onStatusChange: (status: 'all' | 'pending' | 'approved' | 'rejected') => void
  searchQuery: string
  onSearchChange: (q: string) => void
  branchFilter: string
  onBranchChange: (branch: string) => void
  typeFilter: string
  onTypeChange: (type: string) => void
  onCreateRequest: () => void
}

export function LeaveReserveToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  typeFilter,
  onTypeChange,
  onCreateRequest,
}: LeaveReserveToolbarProps) {
  const branches = useMemo(
    () => [...new Set(mockLeaveReserveRequests.map((r) => r.branch))].filter(Boolean),
    []
  )

  const allRequests = useMemo(() => getLeaveReserveRequests({}), [])
  
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0 }
    for (const r of allRequests) {
      counts[r.status] = (counts[r.status] ?? 0) + 1
    }
    return counts
  }, [allRequests])

  const tiles: StatusTile<'all' | 'pending' | 'approved' | 'rejected'>[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: allRequests.length, semantic: 'neutral' },
      { id: 'pending', label: 'Chờ duyệt', count: statusCounts.pending, status: 'pending' },
      { id: 'approved', label: 'Đã duyệt', count: statusCounts.approved, status: 'approved' },
      { id: 'rejected', label: 'Từ chối', count: statusCounts.rejected, status: 'rejected' },
    ],
    [allRequests.length, statusCounts]
  )

  const typeOptions = [
    { value: '', label: 'Tất cả loại đơn' },
    { value: 'leave', label: 'Nghỉ phép' },
    { value: 'reserve', label: 'Bảo lưu' },
    { value: 'suspend', label: 'Nghỉ học tạm thời' },
  ]

  return (
    <div className="flex flex-col gap-2 px-4 py-3 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <BranchSelect
            value={branchFilter}
            branches={branches}
            onValueChange={onBranchChange}
            allLabel="Tất cả chi nhánh"
            ariaLabel="Chi nhánh"
          />
          <ToolbarSelect
            value={typeFilter}
            onValueChange={onTypeChange}
            options={typeOptions}
            ariaLabel="Loại đơn"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Tìm tên học viên, mã học viên..."
            inputClassName="sm:w-64"
          />
          <Button size="sm" onClick={onCreateRequest}>
            <Plus className="h-4 w-4" />
            Tạo đơn yêu cầu
          </Button>
        </div>
      </div>

      <StatusTiles
        tiles={tiles}
        activeId={activeStatus}
        onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
      />
    </div>
  )
}
