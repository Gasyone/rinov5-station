'use client'

import { Plus } from 'lucide-react'
import { FilterIconButton, ExpandableSearch, SegmentedControl, type SegmentedControlOption, BranchSelect } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { QC_CHECK_TYPE_LABELS } from '@/mocks/qcChecks'
import { BRANCH_OPTIONS as MOCK_BRANCHES } from './qcCheckTypes'
import type { StatusTileId } from './qcCheckTypes'

const STATUS_TILE_CONFIG: Array<{ id: StatusTileId; label: string; status: string }> = [
  { id: 'all', label: 'Tất cả', status: 'info' },
  { id: 'draft', label: 'Nháp', status: 'qc_draft' },
  { id: 'published', label: 'Đã phát hành', status: 'qc_published' },
  { id: 'correcting', label: 'Đang khắc phục', status: 'qc_correcting' },
  { id: 'closed', label: 'Đã đóng', status: 'qc_closed' },
  { id: 'completed_closed', label: 'Hoàn thành đóng lỗi', status: 'qc_completed_closed' },
  { id: 'cancelled', label: 'Đã hủy', status: 'qc_cancelled' },
  { id: 'not_met', label: 'Chưa đáp ứng', status: 'qc_not_met' },
]

const TYPE_OPTIONS: SegmentedControlOption<string>[] = [
  { value: 'all', label: 'Tất cả loại' },
  { value: 'daily', label: QC_CHECK_TYPE_LABELS['daily'] },
  { value: 'patrol', label: QC_CHECK_TYPE_LABELS['patrol'] },
  { value: 'monthly', label: QC_CHECK_TYPE_LABELS['monthly'] },
]

interface QcCheckToolbarProps {
  activeType: string
  activeBranch: string
  activeStatus: StatusTileId
  searchTerm: string
  activeFilterCount: number
  statusTileTotals: Record<string, number>
  onTypeChange: (type: string) => void
  onBranchChange: (branch: string) => void
  onStatusChange: (status: StatusTileId) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreate: () => void
}

export function QcCheckToolbar({
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
  onCreate,
}: QcCheckToolbarProps) {
  const tiles: StatusTile<StatusTileId>[] = STATUS_TILE_CONFIG.map((cfg) => ({
    id: cfg.id,
    label: cfg.label,
    count: statusTileTotals[cfg.id] ?? 0,
    status: cfg.status,
  }))

  return (
    <div className="bg-card/50 px-3 py-3 lg:px-3">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <SegmentedControl
            options={TYPE_OPTIONS}
            value={activeType}
            onValueChange={onTypeChange}
          />
          <BranchSelect
            value={activeBranch}
            branches={MOCK_BRANCHES}
            onValueChange={onBranchChange}
            className="w-[180px]"
          />
          <div className="flex-1" />
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            placeholder="Tìm theo mã, người kiểm tra, chi nhánh..."
            className="max-w-xs"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
          <Button size="sm" onClick={onCreate}>
            <Plus className="mr-1.5 h-4 w-4" />
            Tạo đợt QC
          </Button>
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
