import { ChevronLeft, ChevronRight, Rows3, Grid } from 'lucide-react'
import { BranchSelect, SubjectSelect, ExpandableSearch, FilterIconButton, IconActionButton, SegmentedControl, SYSTEM_BRANCHES } from '@/components/controls'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ViewMode, WeekLayoutMode } from './calendarClassScheduleTypes'
import { VIEW_MODES, getMonday } from './calendarClassScheduleHelpers'

interface CalendarClassScheduleToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  weekLayoutMode: WeekLayoutMode
  onWeekLayoutModeChange: (mode: WeekLayoutMode) => void
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
  viewMode,
  onViewModeChange,
  weekLayoutMode,
  onWeekLayoutModeChange,
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
      {/* Left side: Branch select & Subject select placed at far left */}
      <div className="flex flex-wrap items-center gap-2">
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

        {viewMode !== 'list' && (
          <>
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
          </>
        )}
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

        {viewMode === 'week' && (
          <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5 bg-muted/20">
            <IconActionButton
              icon={Rows3}
              label="Xem theo ca"
              onClick={() => onWeekLayoutModeChange('shifts')}
              className={cn("size-7", weekLayoutMode === 'shifts' && "bg-background shadow-xs text-foreground")}
            />
            <IconActionButton
              icon={Grid}
              label="Xem dòng thời gian"
              onClick={() => onWeekLayoutModeChange('timeline')}
              className={cn("size-7", weekLayoutMode === 'timeline' && "bg-background shadow-xs text-foreground")}
            />
          </div>
        )}

        <ExpandableSearch
          value={search}
          onValueChange={onSearchChange}
          label="Tìm lớp học"
          placeholder="Tìm lớp, giáo viên, môn..."
          inputClassName="sm:w-64"
        />

        <FilterIconButton count={activeFilterCount} label="Lọc lịch lớp học" onClick={onOpenFilter} />
      </div>
    </div>
  )
}
