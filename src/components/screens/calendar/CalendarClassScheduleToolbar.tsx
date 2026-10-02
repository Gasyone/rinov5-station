import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BranchSelect, SubjectSelect, ExpandableSearch, FilterIconButton, IconActionButton, SegmentedControl, SYSTEM_BRANCHES } from '@/components/controls'
import { Button } from '@/components/ui/button'
import type { ViewMode } from './calendarClassScheduleTypes'
import { VIEW_MODES, getMonday } from './calendarClassScheduleHelpers'

interface CalendarClassScheduleToolbarProps {
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
      {/* Left side: Branch select & Subject select placed at far left */}
      <div className="flex flex-wrap items-center gap-2">
        <BranchSelect
          value={activeBranch}
          branches={SYSTEM_BRANCHES}
          onValueChange={onActiveBranchChange}
          includeAll={false}
          className="h-8 min-w-44"
        />

        <SubjectSelect
          value={activeSubject}
          subjects={subjects}
          onValueChange={onActiveSubjectChange}
          allLabel="Tất cả môn"
          className="h-8 min-w-36"
        />

        <div className="flex items-center gap-1">
          <IconActionButton icon={ChevronLeft} label="Trước" onClick={() => onNavigate(-1)} className="size-7" />
          <h2 className="text-sm font-semibold px-1 select-none whitespace-nowrap">{calendarTitle}</h2>
          <IconActionButton icon={ChevronRight} label="Sau" onClick={() => onNavigate(1)} className="size-7" />
        </div>
      </div>

      {/* Right side: View modes, search, filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 px-2.5 text-xs font-medium cursor-pointer"
          onClick={() => onSelectedDateChange(viewMode === 'day' ? new Date() : getMonday(new Date()))}
        >
          Hôm nay
        </Button>

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
