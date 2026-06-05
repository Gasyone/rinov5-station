'use client'

import { Plus } from 'lucide-react'
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
  onStatusChange: (status: ClassStatusFilter) => void
  onBranchChange: (branch: string) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreateClass: () => void
}

export function ClassesToolbar({
  activeStatus,
  activeBranch,
  searchTerm,
  branchOptions,
  baseForStatus,
  activeFilterCount,
  isTeacherRole,
  onStatusChange,
  onBranchChange,
  onSearchChange,
  onOpenFilters,
  onCreateClass,
}: ClassesToolbarProps) {
  const tiles: StatusTile<ClassStatusFilter>[] = [
    { id: 'all', label: 'Tất cả', count: countClassesByStatus(baseForStatus, 'all'), semantic: 'neutral' },
    ...CLASS_CATEGORIES.filter((s) => s !== 'mo_chieu_sinh').map((s) => ({
      id: s,
      label: CLASS_STATUS_LABELS[s],
      count: countClassesByStatus(baseForStatus, s),
      status: s,
      semantic: STATUS_SEMANTIC_MAP[s],
    })),
  ]

  return (
    <div className="flex shrink-0 flex-col gap-3 bg-background px-4 py-3 lg:px-6 border-b">
      {/* Top Row: BranchSelect (far left) and search, filter, create buttons (right) */}
      <div className="flex items-center justify-between gap-4">
        <BranchSelect
          value={activeBranch}
          branches={branchOptions}
          onValueChange={onBranchChange}
          className="h-9 min-w-40 text-sm"
        />

        <div className="flex items-center gap-2">
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

      {/* Bottom Row: Status Tiles */}
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
