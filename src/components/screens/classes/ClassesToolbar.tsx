'use client'

import { useState } from 'react'
import { Plus, AlertCircle, ChevronDown, Table2, CalendarRange } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { BranchSelect, ExpandableSearch, FilterIconButton, SubjectSelect, SegmentedControl } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { getStatusColors, type StatusSemantic } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { ClassRecord, ClassCategory } from '@/mocks/classRecords'
import { CLASS_STATUS_LABELS, CLASS_CATEGORIES } from '@/mocks/classRecords'
import { STATUS_SEMANTIC_MAP, countClassesByStatus } from './classesHelpers'
import type { ClassStatusFilter } from './classesHelpers'

export type ClassViewMode = 'list' | 'timetable' | 'grid' | 'stats'
export type ClassProblemFilter = 'all' | 'special_care' | 'low_acs' | 'low_attendance' | 'low_homework' | 'unassigned_teacher'

/** Quick filter chip definitions for toggling visibility */
const QUICK_FILTER_DEFS: { id: Exclude<ClassProblemFilter, 'all'>; label: string }[] = [
  { id: 'special_care', label: 'Có CSĐB' },
  { id: 'unassigned_teacher', label: 'Chưa gán GV' },
  { id: 'low_acs', label: 'ACS thấp' },
  { id: 'low_attendance', label: 'Chuyên cần thấp' },
  { id: 'low_homework', label: 'BTVN thấp' },
]

interface ClassesToolbarProps {
  activeStatus: ClassStatusFilter
  activeProblemFilter?: ClassProblemFilter
  activeBranch: string
  activeSubject: string
  activeGrade: string
  viewMode: ClassViewMode
  searchTerm: string
  branchOptions: string[]
  baseForStatus: ClassRecord[]
  activeFilterCount: number
  isTeacherRole: boolean
  showCreateButton?: boolean
  specialCareCount?: number
  lowAcsCount?: number
  lowAttendanceCount?: number
  lowHomeworkCount?: number
  unassignedTeacherCount?: number
  onStatusChange: (status: ClassStatusFilter) => void
  onProblemFilterChange?: (filter: ClassProblemFilter) => void
  onBranchChange: (branch: string) => void
  onSubjectChange: (subject: string) => void
  onGradeChange: (grade: string) => void
  onViewModeChange: (mode: ClassViewMode) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreateClass: () => void
}

export function ClassesToolbar({
  activeStatus,
  activeProblemFilter = 'all',
  activeBranch,
  activeSubject,
  activeGrade,
  viewMode = 'list',
  searchTerm,
  branchOptions,
  baseForStatus,
  activeFilterCount,
  isTeacherRole,
  showCreateButton = true,
  specialCareCount = 0,
  lowAcsCount = 0,
  lowAttendanceCount = 0,
  lowHomeworkCount = 0,
  unassignedTeacherCount = 0,
  onStatusChange,
  onProblemFilterChange,
  onBranchChange,
  onSubjectChange,
  onGradeChange,
  onViewModeChange,
  onSearchChange,
  onOpenFilters,
  onCreateClass,
}: ClassesToolbarProps) {
  // Hidden status tabs — 'mo_chieu_sinh' not used, 'huy' (Đã kết thúc) hidden from quick tabs (accessible via advanced filter)
  const HIDDEN_STATUS_TABS: ClassCategory[] = ['mo_chieu_sinh', 'huy']

  // Visible quick filter chips — toggled via the dropdown chevron
  const [visibleFilters, setVisibleFilters] = useState<Set<string>>(
    () => new Set(QUICK_FILTER_DEFS.map((d) => d.id))
  )

  const toggleFilterVisibility = (id: string) => {
    setVisibleFilters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        // If the currently active filter is being hidden, reset to 'all'
        if (onProblemFilterChange && activeProblemFilter === id) {
          onProblemFilterChange('all')
        }
      } else {
        next.add(id)
      }
      return next
    })
  }

  const tiles: StatusTile<ClassStatusFilter>[] = [
    { id: 'all', label: 'Tất cả', count: countClassesByStatus(baseForStatus, 'all'), semantic: 'neutral' },
    ...CLASS_CATEGORIES.filter((s) => !HIDDEN_STATUS_TABS.includes(s)).map((s) => ({
      id: s,
      label: CLASS_STATUS_LABELS[s],
      count: countClassesByStatus(baseForStatus, s),
      status: s,
      semantic: STATUS_SEMANTIC_MAP[s],
    })),
  ]

  // Count map for quick filter chips
  const countMap: Record<string, number> = {
    special_care: specialCareCount,
    unassigned_teacher: unassignedTeacherCount,
    low_acs: lowAcsCount,
    low_attendance: lowAttendanceCount,
    low_homework: lowHomeworkCount,
  }

  // Semantic color map for active state
  const semanticMap: Record<string, StatusSemantic> = {
    special_care: 'error',
    unassigned_teacher: 'warning',
    low_acs: 'error',
    low_attendance: 'warning',
    low_homework: 'info',
  }

  // Active badge bg color map
  const activeBadgeBg: Record<string, string> = {
    special_care: 'bg-rose-600 text-white font-bold',
    unassigned_teacher: 'bg-amber-600 text-white font-bold',
    low_acs: 'bg-rose-600 text-white font-bold',
    low_attendance: 'bg-amber-600 text-white font-bold',
    low_homework: 'bg-sky-600 text-white font-bold',
  }

  return (
    <div className="flex shrink-0 flex-col gap-3 bg-background px-3 py-3 lg:px-3 border-b">
      {/* Top Row: SubjectSelect, BranchSelect, View Switcher (left) and search, filter, create buttons (right) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
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

          {/* 2 kiểu view theo yêu cầu: Danh sách bảng và Ma trận tuần định danh */}
          {onViewModeChange && (
            <div className="flex items-center rounded-md border border-border/80 p-0.5 bg-muted/30">
              <button
                type="button"
                onClick={() => onViewModeChange('list')}
                title="Xem dạng danh sách bảng"
                className={cn(
                  'flex items-center justify-center h-8 px-2.5 rounded text-xs font-medium transition-all cursor-pointer gap-1.5',
                  viewMode === 'list'
                    ? 'bg-background text-foreground shadow-xs font-bold border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Table2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Danh sách</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('timetable')}
                title="Xem ma trận tuần định danh (Lịch tuần chuẩn highlight theo thứ)"
                className={cn(
                  'flex items-center justify-center h-8 px-2.5 rounded text-xs font-medium transition-all cursor-pointer gap-1.5',
                  viewMode === 'timetable'
                    ? 'bg-background text-foreground shadow-xs font-bold border border-border/60'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <CalendarRange className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Tuần chuẩn</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm lớp học"
            placeholder="Tìm tên lớp, mã lớp, giáo viên..."
            inputClassName="sm:w-56"
          />
          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />

          {showCreateButton ? (
            <Button size="sm" onClick={onCreateClass} className="shrink-0 font-semibold shadow-2xs">
              <Plus className="h-4 w-4 mr-1.5" />
              Tạo lớp
            </Button>
          ) : null}
        </div>
      </div>

      {/* Grade Selector Row: visible only when math subject is active */}
      {activeSubject === 'math' && (
        <div className="flex items-center gap-2 border-t border-dashed border-border/80 pt-2 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Khối lớp:</span>
          <SegmentedControl
            value={activeGrade}
            options={[
              { value: 'all', label: 'Tất cả lớp' },
              { value: 'lớp 1', label: 'Lớp 1' },
              { value: 'lớp 2', label: 'Lớp 2' },
              { value: 'lớp 3', label: 'Lớp 3' },
              { value: 'lớp 4', label: 'Lớp 4' },
              { value: 'lớp 5', label: 'Lớp 5' },
            ]}
            onValueChange={onGradeChange}
          />
        </div>
      )}

      {/* Bottom Row: Status Tiles (left) & Quick Problem Filters (right) */}
      <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
        <div className="overflow-x-auto min-w-0 flex-1">
          <StatusTiles
            tiles={tiles}
            activeId={activeStatus}
            onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
          />
        </div>

        {/* Quick Problem Filters (Right Aligned - No Outer Background) */}
        {onProblemFilterChange && (
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-[11px] font-semibold text-muted-foreground mr-0.5 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              Lọc nhanh:
            </span>

            {/* Dropdown chevron to toggle quick filter chip visibility */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Chọn bộ lọc nhanh hiển thị"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-48 p-2 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide px-1 pb-1">Hiển thị bộ lọc</p>
                {QUICK_FILTER_DEFS.map((def) => (
                  <label
                    key={def.id}
                    className="flex items-center gap-2 px-1 py-1 rounded hover:bg-muted cursor-pointer text-xs"
                  >
                    <Checkbox
                      checked={visibleFilters.has(def.id)}
                      onCheckedChange={() => toggleFilterVisibility(def.id)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="font-medium text-foreground">{def.label}</span>
                  </label>
                ))}
              </PopoverContent>
            </Popover>

            {/* Render only visible quick filter chips */}
            {QUICK_FILTER_DEFS.filter((d) => visibleFilters.has(d.id)).map((def) => (
              <button
                key={def.id}
                type="button"
                onClick={() => onProblemFilterChange(activeProblemFilter === def.id ? 'all' : def.id)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition-all cursor-pointer border',
                  activeProblemFilter === def.id
                    ? getStatusColors(semanticMap[def.id]).badge
                    : 'border-border/60 bg-background text-muted-foreground hover:bg-muted hover:text-foreground shadow-2xs'
                )}
              >
                <span>{def.label}</span>
                <span className={cn('rounded-full px-1.5 py-0 text-[10px]', activeProblemFilter === def.id ? activeBadgeBg[def.id] : 'bg-muted text-muted-foreground')}>
                  {countMap[def.id]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
