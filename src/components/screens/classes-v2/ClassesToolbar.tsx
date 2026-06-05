'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BranchSelect, ExpandableSearch, FilterIconButton } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_STATUS_LABELS, CLASS_CATEGORIES } from '@/mocks/classRecords'
import { STATUS_SEMANTIC_MAP, countClassesByStatus } from './classesHelpers'
import type { ClassStatusFilter } from './classesHelpers'

interface ClassesToolbarProps {
  activeStatus: ClassStatusFilter
  activeBranch: string
  searchTerm: string
  branchOptions: string[]
  baseForStatus: ClassRecord[]
  activeFilterCount: number
  isTeacherRole: boolean
  selectedIds: Set<string>
  onStatusChange: (status: ClassStatusFilter) => void
  onBranchChange: (branch: string) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreateClass: () => void
  onBulkDelete: () => void
}

export function ClassesToolbar({
  activeStatus,
  activeBranch,
  searchTerm,
  branchOptions,
  baseForStatus,
  activeFilterCount,
  isTeacherRole,
  selectedIds,
  onStatusChange,
  onBranchChange,
  onSearchChange,
  onOpenFilters,
  onCreateClass,
  onBulkDelete,
}: ClassesToolbarProps) {
  const tiles: StatusTile<ClassStatusFilter>[] = [
    { id: 'all', label: 'Tất cả', count: countClassesByStatus(baseForStatus, 'all'), semantic: 'neutral' },
    ...CLASS_CATEGORIES.map((s) => ({
      id: s,
      label: CLASS_STATUS_LABELS[s],
      count: countClassesByStatus(baseForStatus, s),
      status: s,
      semantic: STATUS_SEMANTIC_MAP[s],
    })),
  ]

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 bg-background px-4 py-3 lg:px-6">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-2 mr-2 animate-in fade-in slide-in-from-right-4">
            <span className="text-sm font-medium text-muted-foreground mr-1">
              Đã chọn {selectedIds.size}
            </span>
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Xóa
            </Button>
          </div>
        ) : null}

        <BranchSelect
          value={activeBranch}
          branches={branchOptions}
          onValueChange={onBranchChange}
          className="h-9 min-w-40 text-sm"
        />
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          label="Tìm lớp học"
          placeholder="Tìm tên lớp, mã lớp, giáo viên..."
          inputClassName="sm:w-56"
        />
        <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        {!isTeacherRole ? (
          <Button size="sm" onClick={onCreateClass}>
            <Plus className="h-4 w-4 mr-1.5" />
            Tạo lớp
          </Button>
        ) : null}
      </div>
    </div>
  )
}
