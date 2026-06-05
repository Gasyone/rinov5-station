'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { TrialClass } from '@/mocks/trialClasses'
import { STATUS_CONFIG, VIRTUAL_TILE_ID } from './trialClassConstants'
import { countStatus } from './trialClassHelpers'
import type { StatusTileId } from './trialClassTypes'

interface TrialClassToolbarProps {
  activeBranch: string
  activeStatus: StatusTileId
  searchTerm: string
  branchOptions: string[]
  baseForStatus: TrialClass[]
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onStatusChange: (status: StatusTileId) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreate: () => void
}

export function TrialClassToolbar({
  activeBranch,
  activeStatus,
  searchTerm,
  branchOptions,
  baseForStatus,
  activeFilterCount,
  onBranchChange,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
  onCreate,
}: TrialClassToolbarProps) {
  const [bookedStatus, ...remainingStatuses] = STATUS_CONFIG
  const tiles: StatusTile<StatusTileId>[] = [
    {
      id: 'all',
      label: 'Tất cả',
      count: countStatus(baseForStatus, 'all'),
      semantic: 'neutral',
    },
    ...(bookedStatus ? [{
      id: bookedStatus.id as StatusTileId,
      label: bookedStatus.label,
      count: countStatus(baseForStatus, bookedStatus.id),
      status: bookedStatus.status,
    }] : []),
    {
      id: VIRTUAL_TILE_ID as StatusTileId,
      label: 'Chưa gán lớp',
      count: countStatus(baseForStatus, VIRTUAL_TILE_ID),
      semantic: 'warning',
    },
    ...remainingStatuses.filter((status) => status.id !== 'no_show').map((status) => ({
      id: status.id as StatusTileId,
      label: status.label,
      count: countStatus(baseForStatus, status.id),
      status: status.status,
    })),
  ]

  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-border/40 bg-background px-4 py-3 lg:px-6">
      {/* Row 1: Toolbar Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: Branch Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <BranchSelect
            value={activeBranch}
            branches={branchOptions}
            onValueChange={onBranchChange}
            className="h-9 min-w-40 text-sm"
          />
        </div>

        {/* Right side: Search, Filters & Action Button */}
        <div className="flex items-center justify-end gap-2 self-stretch sm:self-auto">
          <div className="flex-1 sm:flex-initial">
            <ExpandableSearch
              value={searchTerm}
              onValueChange={onSearchChange}
              label="Tìm Booking"
              placeholder="Tìm mã, tên HV, SĐT..."
              inputClassName="w-full sm:w-80"
            />
          </div>
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
          <Button size="sm" onClick={onCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            Tạo Booking
          </Button>
        </div>
      </div>

      {/* Row 2: Status Tiles */}
      <div className="w-full overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
        />
      </div>
    </div>
  )
}
