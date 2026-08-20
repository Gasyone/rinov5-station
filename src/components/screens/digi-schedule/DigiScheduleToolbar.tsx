'use client'

import { ChevronLeft, ChevronRight, UserPlus } from 'lucide-react'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SYSTEM_BRANCHES,
} from '@/components/controls'
import { Button } from '@/components/ui/button'
import { getMonday } from './DigiScheduleHelpers'

interface DigiScheduleToolbarProps {
  onSelectedDateChange: (date: Date) => void
  onNavigate: (dir: number) => void
  calendarTitle: string
  activeBranch: string
  onActiveBranchChange: (branch: string) => void
  search: string
  onSearchChange: (search: string) => void
  activeFilterCount: number
  onOpenFilter: () => void
  onAddStudent?: () => void
}

export function DigiScheduleToolbar({
  onSelectedDateChange,
  onNavigate,
  calendarTitle,
  activeBranch,
  onActiveBranchChange,
  search,
  onSearchChange,
  activeFilterCount,
  onOpenFilter,
  onAddStudent,
}: DigiScheduleToolbarProps) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/40 bg-card px-4 py-2.5 lg:px-6">
      {/* Left side: Branch select + Date navigation on 1 clean row */}
      <div className="flex items-center gap-2.5">
        <BranchSelect
          value={activeBranch}
          branches={SYSTEM_BRANCHES}
          onValueChange={onActiveBranchChange}
          className="h-8 min-w-44"
        />

        <div className="h-4 w-px bg-border/60 mx-0.5" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onSelectedDateChange(getMonday(new Date()))}
          className="h-8 text-xs font-semibold"
        >
          Hôm nay
        </Button>

        <div className="flex items-center gap-0.5">
          <IconActionButton icon={ChevronLeft} label="Tuần trước" onClick={() => onNavigate(-1)} className="size-7" />
          <IconActionButton icon={ChevronRight} label="Tuần sau" onClick={() => onNavigate(1)} className="size-7" />
        </div>

        <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-foreground whitespace-nowrap pl-1">
          {calendarTitle}
        </h2>
      </div>

      {/* Right side: Add student + Search + Filter on the same row */}
      <div className="flex items-center gap-2">
        {onAddStudent && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddStudent}
            className="h-8 px-3 text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Thêm lịch học viên
          </Button>
        )}

        <ExpandableSearch
          value={search}
          onValueChange={onSearchChange}
          label="Tìm kiếm ca học Digi"
          placeholder="Tìm học viên, phòng, trợ giảng, mã ca..."
          inputClassName="sm:w-64"
        />

        <FilterIconButton
          count={activeFilterCount}
          label="Lọc ca học Digi"
          onClick={onOpenFilter}
        />
      </div>
    </div>
  )
}
