'use client'

import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  SubjectSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { MakeupClassRequest } from '@/mocks/makeupClasses'
import { MAKEUP_LIFECYCLE_CONFIG, MAKEUP_RESULT_FILTERS } from './makeupClassConstants'
import { countStatus } from './makeupClassHelpers'
import type { MakeupStatusTileId, MakeupResultFilterId } from './makeupClassTypes'

const RESULT_SEMANTIC_MAP: Record<string, 'completed' | 'error' | 'neutral'> = {
  completed: 'completed',
  da_vang: 'error',
  het_han: 'neutral',
}

interface MakeupClassToolbarProps {
  activeBranch: string
  activeSubject: string
  activeStatus: MakeupStatusTileId
  activeResultFilter: MakeupResultFilterId
  searchTerm: string
  branchOptions: string[]
  baseForStatus: MakeupClassRequest[]
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onSubjectChange: (subject: string) => void
  onStatusChange: (status: MakeupStatusTileId) => void
  onResultFilterChange: (filter: MakeupResultFilterId) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
}

export function MakeupClassToolbar({
  activeBranch,
  activeSubject,
  activeStatus,
  activeResultFilter,
  searchTerm,
  branchOptions,
  baseForStatus,
  activeFilterCount,
  onBranchChange,
  onSubjectChange,
  onStatusChange,
  onResultFilterChange,
  onSearchChange,
  onOpenFilters,
}: MakeupClassToolbarProps) {
  const tiles: StatusTile<MakeupStatusTileId>[] = [
    {
      id: 'all',
      label: 'Tất cả',
      count: countStatus(baseForStatus, 'all'),
      semantic: 'neutral',
    },
    ...MAKEUP_LIFECYCLE_CONFIG.map((status) => ({
      id: status.id as MakeupStatusTileId,
      label: status.label,
      count: countStatus(baseForStatus, status.id),
      status: status.status,
    })),
  ]

  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-border/40 bg-background px-3 py-3 lg:px-3">
      {/* Row 1: Toolbar Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: Subject + Branch Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <SubjectSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            className="h-9 min-w-36 text-sm"
          />
          <BranchSelect
            value={activeBranch}
            branches={branchOptions}
            onValueChange={onBranchChange}
            className="h-9 min-w-40 text-sm"
          />
        </div>

        {/* Right side: Search, Filters */}
        <div className="flex items-center justify-end gap-2 self-stretch sm:self-auto">
          <div className="flex-1 sm:flex-initial">
            <ExpandableSearch
              value={searchTerm}
              onValueChange={onSearchChange}
              label="Tìm phiếu bù"
              placeholder="Tìm mã, tên HV, SĐT, lớp..."
              inputClassName="w-full sm:w-80"
            />
          </div>
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        </div>
      </div>

      {/* Row 2: Status Tiles (left) & Result Quick Filters (right) */}
      <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
        <div className="overflow-x-auto min-w-0 flex-1">
          <StatusTiles
            tiles={tiles}
            activeId={activeStatus}
            onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
          />
        </div>

        {/* Quick Result Filters (Right Aligned) */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs">
          <span className="text-[11px] font-semibold text-muted-foreground mr-0.5">
            Kết quả:
          </span>
          {MAKEUP_RESULT_FILTERS.map((def) => {
            const isActive = activeResultFilter === def.id
            const semantic = RESULT_SEMANTIC_MAP[def.id] ?? 'neutral'
            return (
              <button
                key={def.id}
                type="button"
                onClick={() => onResultFilterChange(activeResultFilter === def.id ? 'all' : def.id)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer border',
                  isActive
                    ? getStatusColors(semantic).badge
                    : 'border-border/60 bg-background text-muted-foreground hover:bg-muted hover:text-foreground shadow-2xs'
                )}
              >
                <span>{def.label}</span>
                <span className={cn(
                  'rounded-full px-1.5 py-0 text-[10px]',
                  isActive ? 'opacity-80' : 'bg-muted text-muted-foreground'
                )}>
                  {countStatus(baseForStatus, def.id)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
