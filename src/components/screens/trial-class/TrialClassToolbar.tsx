'use client'

import Link from 'next/link'
import { Plus, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  ToolbarSelect,
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
  selectedAssignee?: 'all' | 'my'
  onAssigneeChange?: (val: 'all' | 'my') => void
  myTrialsCount?: number
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
  selectedAssignee = 'all',
  onAssigneeChange,
  myTrialsCount,
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
    <div className="flex shrink-0 flex-col gap-1.5 bg-background px-2.5 pt-2 pb-1 lg:px-3">
      {/* Row 1: Selectors (Branch, Subject), Search + Filter + Create Action */}
      <div className="flex items-center justify-between flex-wrap gap-1.5 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          {/* 1. Branch Selector */}
          <BranchSelect
            value={activeBranch}
            branches={branchOptions}
            onValueChange={onBranchChange}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 text-xs min-w-[125px] sm:min-w-[130px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden 2xl:block shrink-0" />

          {/* 2. Subject Selector */}
          <ToolbarSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            options={[
              { value: 'all', label: 'Tất cả các môn', selectedLabel: 'Tất cả các môn' },
              { value: 'Tiếng Anh', label: 'Tiếng Anh' },
              { value: 'STEM', label: 'STEM' },
              { value: 'Toán tư duy', label: 'Toán tư duy' },
            ]}
            className="h-8 text-xs min-w-[110px] sm:min-w-[115px]"
            ariaLabel="Chọn môn học"
            placeholder="Môn học"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            placeholder="Tìm kiếm..."
            inputClassName="w-32 sm:w-36 lg:w-44 xl:w-52 2xl:w-60 text-xs h-8"
          />
          <FilterIconButton
            count={activeFilterCount > 0 ? activeFilterCount : undefined}
            onClick={onOpenFilters}
          />
          {onCreateTrial ? (
            <Button
              size="sm"
              onClick={onCreateTrial}
              className="h-8 text-xs flex items-center gap-1.5 shadow-xs font-medium cursor-pointer px-2 sm:px-2.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">Tạo học thử</span>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="h-8 text-xs flex items-center gap-1.5 shadow-xs font-medium cursor-pointer px-2 sm:px-2.5"
            >
              <Link href="/booking-trial">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden xl:inline">Tạo học thử</span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Row 2: "Lịch của tôi" + StatusTiles (Left) + Quick Result Filters (Right) */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pt-0.5">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          {onAssigneeChange && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (selectedAssignee === 'my') {
                    onAssigneeChange('all')
                  } else {
                    onAssigneeChange('my')
                  }
                }}
                className={cn(
                  'h-7 px-2.5 rounded-full text-xs font-normal border inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0',
                  selectedAssignee === 'my'
                    ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs'
                    : 'bg-background border-border text-foreground/80 hover:bg-accent hover:text-foreground'
                )}
                title="Lọc nhanh các lịch học thử do bạn phụ trách"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Lịch của tôi</span>
                {myTrialsCount !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded-full text-xs leading-none',
                      selectedAssignee === 'my'
                        ? 'bg-primary-foreground text-primary font-semibold'
                        : 'bg-muted text-muted-foreground font-normal'
                    )}
                  >
                    {myTrialsCount}
                  </span>
                )}
              </button>

              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            </>
          )}

          <StatusTiles
            tiles={tiles}
            activeId={activeStatus}
            onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
            noOverflowCollapse={true}
            compact={true}
            showDot={false}
            hideDot={true}
            coloredCount={true}
            fontNormal={true}
          />
        </div>

        {/* Quick Result Filters (Right Aligned) */}
        <div className="flex items-center gap-1.5 select-none shrink-0 min-w-0">
          <span className="text-xs font-normal text-muted-foreground shrink-0 mr-0.5">
            Kết quả:
          </span>
          <div className="flex items-center gap-1 min-w-0 overflow-x-auto custom-scrollbar">
            {TRIAL_RESULT_FILTERS.map((def) => {
              const isActive = activeResultFilter === def.id
              return (
                <button
                  key={def.id}
                  type="button"
                  onClick={() => onResultFilterChange(activeResultFilter === def.id ? 'all' : def.id)}
                  className={cn(
                    'inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0 gap-1',
                    isActive
                      ? 'border-primary/50 bg-primary/10 text-primary font-normal border-solid'
                      : 'border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  )}
                >
                  <span>{def.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
