'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SegmentedControl,
} from '@/components/controls'
import { Button } from '@/components/ui/button'

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

interface MyScheduleToolbarProps {
  viewMode: 'day' | 'week'
  titleDate: string
  branches: string[]
  activeBranch: string
  search: string
  activeFilterCount: number
  onViewModeChange: (value: 'day' | 'week') => void
  onBranchChange: (value: string) => void
  onSearchChange: (value: string) => void
  onToday: () => void
  onNavigate: (direction: number) => void
  onFilterOpen: () => void
}

export function MyScheduleToolbar({
  viewMode,
  titleDate,
  branches,
  activeBranch,
  search,
  activeFilterCount,
  onViewModeChange,
  onBranchChange,
  onSearchChange,
  onToday,
  onNavigate,
  onFilterOpen,
}: MyScheduleToolbarProps) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between lg:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onToday}>
          Hôm nay
        </Button>
        <div className="flex items-center gap-0.5">
          <IconActionButton icon={ChevronLeft} label="Trước" onClick={() => onNavigate(-1)} className="size-7" />
          <IconActionButton icon={ChevronRight} label="Sau" onClick={() => onNavigate(1)} className="size-7" />
        </div>
        <h2 className="text-sm font-semibold">{titleDate}</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          value={viewMode}
          options={VIEW_MODES.map((mode) => ({ value: mode.value as 'day' | 'week', label: mode.label }))}
          onValueChange={onViewModeChange}
        />
        <BranchSelect
          value={activeBranch}
          branches={branches}
          onValueChange={onBranchChange}
          className="h-8 min-w-48"
        />
        <ExpandableSearch
          value={search}
          onValueChange={onSearchChange}
          label="Tìm lịch của tôi"
          placeholder="Tìm lịch..."
          inputClassName="sm:w-72"
        />
        <FilterIconButton count={activeFilterCount} label="Lọc lịch của tôi" onClick={onFilterOpen} />
      </div>
    </div>
  )
}
