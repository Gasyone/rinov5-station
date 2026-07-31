import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { BranchSelect, ExpandableSearch, IconActionButton, SegmentedControl } from '@/components/controls'
import { Button } from '@/components/ui/button'

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

interface CalendarRoomToolbarProps {
  branch: string
  onBranchChange: (val: string) => void
  search: string
  onSearchChange: (val: string) => void
  viewMode: 'day' | 'week'
  onViewModeChange: (val: 'day' | 'week') => void
  calendarTitle: string
  onNavigate: (dir: number) => void
  onToday: () => void
  onAssignClick: () => void
}

export function CalendarRoomToolbar({
  branch,
  onBranchChange,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  calendarTitle,
  onNavigate,
  onToday,
  onAssignClick,
}: CalendarRoomToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border/60">
      <div className="flex flex-wrap items-center gap-2">
        <BranchSelect value={branch} onValueChange={onBranchChange} />
        
        <SegmentedControl
          options={VIEW_MODES}
          value={viewMode}
          onValueChange={(val) => onViewModeChange(val as 'day' | 'week')}
        />

        {/* Date Timeline Navigation */}
        <div className="flex items-center gap-1 pl-1 border-l border-border/60">
          <Button type="button" variant="ghost" size="sm" onClick={onToday} className="text-xs h-8 px-2.5">
            Hôm nay
          </Button>
          <div className="flex items-center gap-0.5">
            <IconActionButton icon={ChevronLeft} label="Trước" onClick={() => onNavigate(-1)} className="h-7 w-7" />
            <IconActionButton icon={ChevronRight} label="Sau" onClick={() => onNavigate(1)} className="h-7 w-7" />
          </div>
          <span className="text-xs font-semibold text-foreground px-1">{calendarTitle}</span>
        </div>

        <ExpandableSearch
          value={search}
          onValueChange={onSearchChange}
          placeholder="Tìm tên phòng, mã lớp, giáo viên..."
        />
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onAssignClick} size="sm" className="gap-1.5 font-medium">
          <Plus className="h-4 w-4" />
          <span>Gán lớp vào phòng</span>
        </Button>
      </div>
    </div>
  )
}
