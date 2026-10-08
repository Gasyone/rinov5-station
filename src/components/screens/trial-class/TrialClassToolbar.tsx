'use client'

import Link from 'next/link'
import { Plus, ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  SubjectSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { TrialClass } from '@/mocks/trialClasses'
import { TRIAL_LIFECYCLE_CONFIG, TRIAL_RESULT_FILTERS } from './trialClassConstants'
import { countStatus } from './trialClassHelpers'
import type { StatusTileId, TrialResultFilterId } from './trialClassTypes'

interface TrialClassToolbarProps {
  activeBranch: string
  activeSubject: string
  activeStatus: StatusTileId
  activeResultFilter: TrialResultFilterId
  searchTerm: string
  branchOptions: string[]
  baseForStatus: TrialClass[]
  activeFilterCount: number
  onCreateTrial?: () => void
  onBranchChange: (branch: string) => void
  onSubjectChange: (subject: string) => void
  onStatusChange: (status: StatusTileId) => void
  onResultFilterChange: (filter: TrialResultFilterId) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
}

export function TrialClassToolbar({
  activeBranch,
  activeSubject,
  activeStatus,
  activeResultFilter,
  searchTerm,
  branchOptions,
  baseForStatus,
  activeFilterCount,
  onCreateTrial,
  onBranchChange,
  onSubjectChange,
  onStatusChange,
  onResultFilterChange,
  onSearchChange,
  onOpenFilters,
}: TrialClassToolbarProps) {
  const tiles: StatusTile<StatusTileId>[] = [
    {
      id: 'all',
      label: 'Tất cả',
      count: countStatus(baseForStatus, 'all'),
      semantic: 'neutral',
    },
    ...TRIAL_LIFECYCLE_CONFIG.map((status) => ({
      id: status.id as StatusTileId,
      label: status.label,
      count: countStatus(baseForStatus, status.id),
      status: status.status,
    })),
  ]

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-2 py-2.5 lg:px-3">
      {/* Row 1: Toolbar Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Left side: Branch Selector & Subject Selector */}
        <div className="flex items-center gap-2">
          <BranchSelect
            value={activeBranch}
            branches={branchOptions}
            onValueChange={onBranchChange}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 min-w-38 text-xs"
          />
          <SubjectSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            allLabel="Tất cả các môn"
            placeholder="Chọn môn học"
            className="h-8 min-w-32 text-xs"
          />
        </div>

        {/* Right side: Search, Filters, Create Button */}
        <div className="flex items-center gap-2">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm Booking"
            placeholder="Tìm mã, tên HV, SĐT..."
            inputClassName="sm:w-60 text-xs h-8"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
          {onCreateTrial ? (
            <Button size="sm" onClick={onCreateTrial} className="h-8 gap-1.5 shadow-xs text-xs font-medium cursor-pointer">
              <Plus className="h-3.5 w-3.5" />
              Tạo học thử
            </Button>
          ) : (
            <Button asChild size="sm" className="h-8 gap-1.5 shadow-xs text-xs font-medium cursor-pointer">
              <Link href="/booking-trial">
                <Plus className="h-3.5 w-3.5" />
                Tạo học thử
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Row 2: Status Tiles (left) & Quick Result Filters (right) */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeStatus}
          onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
          noOverflowCollapse
          compact
          showDot={false}
          hideDot={true}
          coloredCount={true}
        />

        {/* Quick Result Filters (Right Aligned) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            title="Lọc nhanh"
            aria-label="Lọc nhanh"
            className="inline-flex items-center text-muted-foreground shrink-0 mr-0.5 select-none"
          >
            <ListFilter className="h-3.5 w-3.5" />
          </span>
          <div className="flex items-center gap-1 min-w-0">
            {TRIAL_RESULT_FILTERS.map((def) => {
              const isActive = activeResultFilter === def.id
              return (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => onResultFilterChange(activeResultFilter === def.id ? 'all' : def.id)}
                  className={cn(
                    'inline-flex items-center h-6 rounded-md px-2 text-xs font-medium transition-colors cursor-pointer border select-none shrink-0',
                    isActive
                      ? 'border-primary/40 bg-primary/10 text-primary font-medium'
                      : 'border-border/70 bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                >
                  {def.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
