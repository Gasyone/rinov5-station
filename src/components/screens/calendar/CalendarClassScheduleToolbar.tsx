import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BranchSelect, SubjectSelect, ExpandableSearch, FilterIconButton, IconActionButton, SegmentedControl, SYSTEM_BRANCHES } from '@/components/controls'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { ViewMode } from './calendarClassScheduleTypes'
import { VIEW_MODES, getMonday } from './calendarClassScheduleHelpers'

interface CalendarClassScheduleToolbarProps {
  isMySchedule?: boolean
  onIsMyScheduleChange?: (val: boolean) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  selectedDate: Date
  onSelectedDateChange: (date: Date) => void
  onNavigate: (dir: number) => void
  calendarTitle: string
  activeBranch: string
  onActiveBranchChange: (branch: string) => void
  activeSubject: string
  onActiveSubjectChange: (subject: string) => void
  subjects: string[]
  search: string
  onSearchChange: (search: string) => void
  activeFilterCount: number
  onOpenFilter: () => void
}

export function CalendarClassScheduleToolbar({
  isMySchedule = false,
  onIsMyScheduleChange,
  viewMode,
  onViewModeChange,
  selectedDate,
  onSelectedDateChange,
  onNavigate,
  calendarTitle,
  activeBranch,
  onActiveBranchChange,
  activeSubject,
  onActiveSubjectChange,
  subjects,
  search,
  onSearchChange,
  activeFilterCount,
  onOpenFilter,
}: CalendarClassScheduleToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 border-b border-border/40 bg-card px-3 py-2.5 md:flex-row md:items-center md:justify-between lg:px-4">
      {/* Left side: Switch "Lịch của tôi" & Branch select & Subject select placed at far left */}
      <div className="flex flex-wrap items-center gap-2">
        {onIsMyScheduleChange && (
          <div className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/30 px-2 py-1">
            <Switch
              id="toggle-my-schedule-cs"
              checked={isMySchedule}
              onCheckedChange={onIsMyScheduleChange}
              size="sm"
            />
            <label
              htmlFor="toggle-my-schedule-cs"
              className="text-xs font-medium cursor-pointer select-none text-foreground whitespace-nowrap"
            >
              Lịch của tôi
            </label>
          </div>
        )}

        <BranchSelect
          value={activeBranch}
          branches={SYSTEM_BRANCHES}
          onValueChange={onActiveBranchChange}
          className="h-8 min-w-44"
        />

        <SubjectSelect
          value={activeSubject}
          subjects={subjects}
          onValueChange={onActiveSubjectChange}
          allLabel="Tất cả môn"
          className="h-8 min-w-36"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onSelectedDateChange(viewMode === 'day' ? new Date() : getMonday(new Date()))}
        >
          Hôm nay
        </Button>
        <div className="flex items-center gap-0.5">
          <IconActionButton icon={ChevronLeft} label="Trước" onClick={() => onNavigate(-1)} className="size-7" />
          <IconActionButton icon={ChevronRight} label="Sau" onClick={() => onNavigate(1)} className="size-7" />
        </div>
        <h2 className="text-sm font-semibold">{calendarTitle}</h2>
      </div>

      {/* Right side: View modes, search, filter */}
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          value={viewMode}
          options={VIEW_MODES.map((mode) => ({ value: mode.value, label: mode.label }))}
          onValueChange={(value) => {
            onViewModeChange(value as ViewMode)
            if (value === 'week') {
              onSelectedDateChange(getMonday(selectedDate))
            }
          }}
        />

        <ExpandableSearch
          value={search}
          onValueChange={onSearchChange}
          label="Tìm lớp học"
          placeholder="Tìm lớp, giáo viên, môn..."
          inputClassName="sm:w-64"
        />

        <FilterIconButton count={activeFilterCount} label="Lọc lịch học trung tâm" onClick={onOpenFilter} />
      </div>
    </div>
  )
}
