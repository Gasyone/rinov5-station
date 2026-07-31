import { ChevronLeft, ChevronRight, Building2, UserCheck } from 'lucide-react'
import { BranchSelect, ExpandableSearch, IconActionButton, SubjectSelect } from '@/components/controls'
import { Button } from '@/components/ui/button'
import type { ViewTabMode } from './calendarClassV2Types'
import { cn } from '@/lib/utils'

const SYSTEM_SUBJECTS = ['Tiếng Anh', 'Toán học', 'STEM Robotics']

const VIEW_TAB_OPTIONS = [
  { value: 'room_matrix' as const, label: 'Phòng học', icon: Building2 },
  { value: 'teacher_workload' as const, label: 'Giáo viên', icon: UserCheck },
]

interface CalendarClassV2ToolbarProps {
  branch: string
  onBranchChange: (val: string) => void
  subject: string
  onSubjectChange: (val: string) => void
  search: string
  onSearchChange: (val: string) => void
  viewTab: ViewTabMode
  onViewTabChange: (tab: ViewTabMode) => void
  calendarTitle: string
  onNavigate: (dir: number) => void
  onToday: () => void
}

export function CalendarClassV2Toolbar({
  branch,
  onBranchChange,
  subject,
  onSubjectChange,
  search,
  onSearchChange,
  viewTab,
  onViewTabChange,
  calendarTitle,
  onNavigate,
  onToday,
}: CalendarClassV2ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-border/60">
      {/* Left side: Branch, Subject, Date Navigation, Search */}
      <div className="flex flex-wrap items-center gap-2">
        <BranchSelect value={branch} onValueChange={onBranchChange} />

        {/* Subject Filter */}
        <SubjectSelect
          value={subject}
          onValueChange={onSubjectChange}
          subjects={SYSTEM_SUBJECTS}
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
          placeholder="Tìm tên lớp, mã lớp, giáo viên, phòng..."
        />
      </div>

      {/* Right side: View Mode Tabs (Far Right, Transparent Background) */}
      <div className="flex items-center gap-1 flex-wrap justify-end">
        {VIEW_TAB_OPTIONS.map((tab) => {
          const Icon = tab.icon
          const isActive = viewTab === tab.value
          return (
            <Button
              key={tab.value}
              type="button"
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onViewTabChange(tab.value)}
              className={cn(
                'h-8 text-xs font-semibold px-3 gap-1.5 transition-colors',
                isActive
                  ? 'bg-background text-foreground shadow-xs border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
