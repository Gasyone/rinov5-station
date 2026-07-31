'use client'

import { useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BranchSelect, ExpandableSearch, FilterIconButton } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { mockTeachers, getTeacherStatusCounts, getTeacherBranches } from '@/mocks/teacherRecords'
import { TEACHER_STATUS_CONFIG, type TeacherStatusId } from './teacherTypes'

interface TeachersToolbarProps {
  activeStatus: TeacherStatusId
  onStatusChange: (status: TeacherStatusId) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  branchFilter: string
  onBranchChange: (branch: string) => void
  onFilterOpen: () => void
  onCreate: () => void
}

export function TeachersToolbar({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  branchFilter,
  onBranchChange,
  onFilterOpen,
  onCreate,
}: TeachersToolbarProps) {
  const branches = useMemo(() => getTeacherBranches(mockTeachers), [])
  const statusCounts = useMemo(() => getTeacherStatusCounts(mockTeachers), [])

  const tiles: StatusTile<TeacherStatusId>[] = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: mockTeachers.length, semantic: 'neutral' },
      ...TEACHER_STATUS_CONFIG.map((cfg) => ({
        id: cfg.id,
        label: cfg.label,
        count: statusCounts[cfg.statusKey] ?? 0,
        status: cfg.statusKey,
      })),
    ],
    [statusCounts],
  )

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 bg-background px-3 py-3 lg:px-3">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <BranchSelect
          value={branchFilter}
          branches={branches}
          onValueChange={onBranchChange}
          allLabel="Tất cả chi nhánh"
          ariaLabel="Chi nhánh"
        />
        <ExpandableSearch
          value={searchQuery}
          onValueChange={onSearchChange}
          placeholder="Tìm giáo viên, mã GV, SĐT..."
          inputClassName="sm:w-64"
        />
        <FilterIconButton onClick={onFilterOpen} />
        <Button size="sm" onClick={onCreate}>
          <Plus className="h-4 w-4 mr-1.5" />
          Thêm giáo viên
        </Button>
      </div>
    </div>
  )
}
