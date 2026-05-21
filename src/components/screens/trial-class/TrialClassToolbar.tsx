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
    ...remainingStatuses.map((status) => ({
      id: status.id as StatusTileId,
      label: status.label,
      count: countStatus(baseForStatus, status.id),
      status: status.status,
    })),
  ]

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-4 py-3 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <BranchSelect
            value={activeBranch}
            branches={branchOptions}
            allLabel="Tất cả cơ sở"
            ariaLabel="Cơ sở"
            onValueChange={onBranchChange}
            className="h-9 min-w-52 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm Booking"
            placeholder="Tìm mã, tên HV, SĐT..."
            inputClassName="sm:w-80"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
          <Button size="sm" onClick={onCreate}>
            <Plus className="h-4 w-4" />
            Tạo Booking
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
