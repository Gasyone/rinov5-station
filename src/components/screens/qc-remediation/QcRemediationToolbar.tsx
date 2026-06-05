'use client'

import { SegmentedControl, type SegmentedControlOption, BranchSelect, ExpandableSearch, FilterIconButton } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { ErrorStatusFilter } from './qcRemediationTypes'
import { REPAIR_STATUS_TILES, BRANCH_OPTIONS } from './qcRemediationTypes'

const ERROR_TYPE_OPTIONS: SegmentedControlOption<string>[] = [
  { value: 'all', label: 'Tất cả loại' },
  { value: 'personnel', label: 'Giáo viên' },
  { value: 'facility', label: 'Cơ sở vật chất' },
]

interface QcRemediationToolbarProps {
  activeType: string
  activeBranch: string
  activeStatus: ErrorStatusFilter
  searchTerm: string
  activeFilterCount: number
  statusTileTotals: Record<string, number>
  onTypeChange: (type: string) => void
  onBranchChange: (branch: string) => void
  onStatusChange: (status: ErrorStatusFilter) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
}

export function QcRemediationToolbar({
  activeType,
  activeBranch,
  activeStatus,
  searchTerm,
  activeFilterCount,
  statusTileTotals,
  onTypeChange,
  onBranchChange,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
}: QcRemediationToolbarProps) {
  const tiles: StatusTile<ErrorStatusFilter>[] = REPAIR_STATUS_TILES.map((cfg) => ({
    id: cfg.id,
    label: cfg.label,
    count: statusTileTotals[cfg.id] ?? 0,
  }))

  return (
    <div className="bg-background px-4 py-3 lg:px-6 border-b-0">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SegmentedControl
            options={ERROR_TYPE_OPTIONS}
            value={activeType}
            onValueChange={onTypeChange}
          />
          <BranchSelect
            value={activeBranch}
            branches={BRANCH_OPTIONS}
            onValueChange={onBranchChange}
            className="w-[180px]"
          />
          <div className="flex-1" />
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            placeholder="Tìm theo mã lỗi, sự kiện, mô tả, người phụ trách..."
            inputClassName="max-w-xs"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        </div>
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={onStatusChange}
        />
      </div>
    </div>
  )
}
