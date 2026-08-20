'use client'

import { useMemo } from 'react'
import { Plus, ChevronDown, CalendarOff, PauseCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BranchSelect, ExpandableSearch, FilterIconButton, SubjectSelect } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { getLeaveReserveRequests } from '@/mocks/leaveReserve'
import { SUBJECT_OPTIONS, getRequestSubject } from './leaveReserveHelpers'

interface LeaveReserveToolbarProps {
  activeStatus: 'all' | 'pending' | 'approved' | 'not_approved' | 'cancel'
  onStatusChange: (status: 'all' | 'pending' | 'approved' | 'not_approved' | 'cancel') => void
  searchQuery: string
  onSearchChange: (q: string) => void
  branchFilter: string
  onBranchChange: (branch: string) => void
  activeSubject: string
  onSubjectChange: (subject: string) => void
  activeFilterCount: number
  onOpenFilters: () => void
  onCreateClick: (type?: 'off' | 'reservation') => void
}

export function LeaveReserveToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  activeSubject,
  onSubjectChange,
  activeFilterCount,
  onOpenFilters,
  onCreateClick,
}: LeaveReserveToolbarProps) {

  const allRequests = useMemo(() => getLeaveReserveRequests({}), [])
  
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, approved: 0, not_approved: 0, cancel: 0 }
    for (const r of allRequests) {
      if (branchFilter !== 'all' && r.branch !== branchFilter) continue
      if (activeSubject !== 'all' && getRequestSubject(r) !== activeSubject) continue
      counts[r.status] = (counts[r.status] ?? 0) + 1
    }
    return counts
  }, [allRequests, branchFilter, activeSubject])

  const filteredAllCount = useMemo(() => {
    let count = 0
    for (const r of allRequests) {
      if (branchFilter !== 'all' && r.branch !== branchFilter) continue
      if (activeSubject !== 'all' && getRequestSubject(r) !== activeSubject) continue
      count++
    }
    return count
  }, [allRequests, branchFilter, activeSubject])

  const tiles: StatusTile<'all' | 'pending' | 'approved' | 'not_approved' | 'cancel'>[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: filteredAllCount, semantic: 'neutral' },
      { id: 'pending', label: 'Chờ duyệt', count: statusCounts.pending, status: 'pending' },
      { id: 'approved', label: 'Đã duyệt', count: statusCounts.approved, status: 'approved' },
      { id: 'not_approved', label: 'Không duyệt', count: statusCounts.not_approved, status: 'not_approved' },
      { id: 'cancel', label: 'Hủy duyệt', count: statusCounts.cancel, status: 'cancel' },
    ],
    [filteredAllCount, statusCounts]
  )

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-3 py-3 lg:px-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SubjectSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            options={SUBJECT_OPTIONS}
            className="h-9 min-w-36 text-sm"
          />
          <BranchSelect
            value={branchFilter}
            onValueChange={onBranchChange}
            allLabel="Tất cả trường"
            ariaLabel="Trường"
            className="h-9 min-w-40 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Tìm tên, mã học viên, mã phiếu..."
            inputClassName="sm:w-64"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-9 gap-1 font-semibold shadow-2xs shrink-0 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>Tạo đơn</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1">
              <DropdownMenuItem
                onClick={() => onCreateClick('off')}
                className="cursor-pointer py-2 px-2.5 focus:bg-accent"
              >
                <CalendarOff className="mr-2.5 h-4 w-4 text-amber-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-foreground">Tạo đơn nghỉ phép</span>
                  <span className="text-[10px] text-muted-foreground">Vắng buổi / nghỉ ngắn hạn</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onCreateClick('reservation')}
                className="cursor-pointer py-2 px-2.5 focus:bg-accent"
              >
                <PauseCircle className="mr-2.5 h-4 w-4 text-sky-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-foreground">Tạo đơn bảo lưu</span>
                  <span className="text-[10px] text-muted-foreground">Tạm dừng học tập dài hạn</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>
    </div>
  )
}
