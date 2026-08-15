import { ChevronLeft, ChevronRight, Clock, LayoutList } from 'lucide-react'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SegmentedControl,
} from '@/components/controls'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { ScheduleLayoutType } from './myScheduleTypes'

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

interface MyScheduleToolbarProps {
  isMySchedule?: boolean
  onIsMyScheduleChange?: (val: boolean) => void
  viewMode: 'day' | 'week'
  layoutType: ScheduleLayoutType
  titleDate: string
  branches: string[]
  activeBranch: string
  search: string
  activeFilterCount: number
  onViewModeChange: (value: 'day' | 'week') => void
  onLayoutTypeChange: (value: ScheduleLayoutType) => void
  onBranchChange: (value: string) => void
  onSearchChange: (value: string) => void
  onToday: () => void
  onNavigate: (direction: number) => void
  onFilterOpen: () => void
}

export function MyScheduleToolbar({
  isMySchedule,
  onIsMyScheduleChange,
  viewMode,
  layoutType,
  titleDate,
  branches,
  activeBranch,
  search,
  activeFilterCount,
  onViewModeChange,
  onLayoutTypeChange,
  onBranchChange,
  onSearchChange,
  onToday,
  onNavigate,
  onFilterOpen,
}: MyScheduleToolbarProps) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3 md:flex-row md:items-center md:justify-between lg:px-3">
      <div className="flex flex-wrap items-center gap-2">
        {onIsMyScheduleChange && (
          <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/30 px-2 py-1">
            <Switch
              id="toggle-my-schedule-ms"
              checked={isMySchedule}
              onCheckedChange={onIsMyScheduleChange}
              size="sm"
            />
            <label
              htmlFor="toggle-my-schedule-ms"
              className="text-xs font-medium cursor-pointer select-none text-foreground whitespace-nowrap"
            >
              Lịch của tôi
            </label>
          </div>
        )}
        <BranchSelect
          value={activeBranch}
          branches={branches}
          onValueChange={onBranchChange}
          className="h-8 min-w-48"
        />
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
        {/* Toggle Kiểu View: Ma trận 2D / Lịch 1 chiều (Icon only) */}
        <div className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5">
          <button
            type="button"
            onClick={() => onLayoutTypeChange('matrix')}
            title="Ma trận giờ (2D)"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors cursor-pointer",
              layoutType === 'matrix'
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onLayoutTypeChange('schedule_1d')}
            title="Lịch 1 chiều (1D)"
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors cursor-pointer",
              layoutType === 'schedule_1d'
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>

        <SegmentedControl
          value={viewMode}
          options={VIEW_MODES.map((mode) => ({ value: mode.value as 'day' | 'week', label: mode.label }))}
          onValueChange={onViewModeChange}
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

