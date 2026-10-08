'use client'

import { useState } from 'react'
import { Plus, ChevronDown, ListFilter } from 'lucide-react'
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
  viewMode?: ClassViewMode
  searchTerm: string
  branchOptions: string[]
  baseForStatus: ClassRecord[]
  activeFilterCount: number
  isTeacherRole: boolean
  showCreateButton?: boolean
  onStatusChange: (status: ClassStatusFilter) => void
  onProblemFilterChange?: (filter: ClassProblemFilter) => void
  onBranchChange: (branch: string) => void
  onSubjectChange: (subject: string) => void
  onGradeChange: (grade: string) => void
  onViewModeChange?: (mode: ClassViewMode) => void
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
  showCreateButton = true,
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

  // Semantic color map for active state
  const semanticMap: Record<string, StatusSemantic> = {
    special_care: 'error',
    unassigned_teacher: 'warning',
    low_acs: 'error',
    low_attendance: 'warning',
    low_homework: 'info',
  }

  return (
    <div className="flex shrink-0 flex-col gap-1.5 bg-background px-2.5 pt-2 pb-1 lg:px-3">
      {/* Top Row: SubjectSelect, BranchSelect, View Switcher (left) and search, filter, create buttons (right) */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <BranchSelect
            value={activeBranch}
            branches={branchOptions}
            onValueChange={onBranchChange}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 min-w-[130px] sm:min-w-[135px] text-xs"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          <SubjectSelect
            value={activeSubject}
            onValueChange={onSubjectChange}
            allLabel="Tất cả các môn"
            placeholder="Chọn môn học"
            className="h-8 min-w-[125px] sm:min-w-[130px] text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm lớp học"
            placeholder="Tìm tên lớp, mã lớp, giáo viên..."
            inputClassName="sm:w-60 text-xs h-8"
          />
          <FilterIconButton count={activeFilterCount > 0 ? activeFilterCount : undefined} onClick={onOpenFilters} />

          {showCreateButton ? (
            <Button size="sm" onClick={onCreateClass} className="h-8 px-2.5 font-medium text-xs flex items-center gap-1.5 shadow-2xs">
              <Plus className="h-3.5 w-3.5 mr-0.5" />
              Tạo lớp
            </Button>
          ) : null}
        </div>
      </div>

      {/* Grade Selector Row: visible only when math subject is active */}
      {activeSubject === 'math' && (
        <div className="flex items-center gap-2 border-t border-dashed border-border/80 pt-1 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Khối lớp:</span>
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
            itemClassName="h-6 px-2 text-xs"
          />
        </div>
      )}

      {/* Bottom Row: Status Tiles (left) & Quick Problem Filters (right) */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pt-0.5">
        <div className="overflow-x-auto min-w-0 flex-1">
          <StatusTiles
            tiles={tiles}
            activeId={activeStatus}
            compact={true}
            noOverflowCollapse={true}
            showDot={false}
            hideDot={true}
            coloredCount={true}
            fontNormal={true}
            onSelect={(id) => onStatusChange(activeStatus === id && id !== 'all' ? 'all' : id)}
          />
        </div>

        {/* Quick Problem Filters (Right Aligned - Compact Chips) */}
        {onProblemFilterChange && (
          <div className="flex items-center gap-1.5 select-none shrink-0 min-w-0">
            <span
              title="Lọc nhanh"
              aria-label="Lọc nhanh"
              className="inline-flex items-center text-muted-foreground shrink-0 mr-0.5 select-none"
            >
              <ListFilter className="h-3.5 w-3.5" />
            </span>

            <div className="flex items-center gap-1 min-w-0">
              {/* Dropdown chevron to toggle quick filter chip visibility */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    title="Chọn bộ lọc nhanh hiển thị"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-2 space-y-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-1 pb-1">Hiển thị bộ lọc</p>
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
                      <span className="font-normal text-foreground">{def.label}</span>
                    </label>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Render only visible quick filter chips */}
              {QUICK_FILTER_DEFS.filter((d) => visibleFilters.has(d.id)).map((def) => {
                const isActive = activeProblemFilter === def.id
                return (
                  <button
                    key={def.id}
                    type="button"
                    onClick={() => onProblemFilterChange(isActive ? 'all' : def.id)}
                    className={cn(
                      'inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0 gap-1',
                      isActive
                        ? getStatusColors(semanticMap[def.id]).badge
                        : 'border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60'
                    )}
                  >
                    <span>{def.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
