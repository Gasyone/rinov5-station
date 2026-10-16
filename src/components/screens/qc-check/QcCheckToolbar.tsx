'use client'

import React from 'react'
import { Plus, UserCheck, ArrowUpDown } from 'lucide-react'
import {
  FilterIconButton,
  ExpandableSearch,
  SegmentedControl,
  type SegmentedControlOption,
  BranchSelect,
  ToolbarSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  BRANCH_OPTIONS,
  SUBJECT_OPTIONS,
  CRITERIA_FILTER_OPTIONS,
  DEADLINE_FILTER_OPTIONS,
  STATUS_TILE_CONFIG,
  type IncidentStatusFilter,
  type IncidentDeadlineFilter,
} from './qcCheckTypes'
import { SORT_OPTIONS, type QcSortMode } from './qcCheckHelpers'

const TARGET_GROUP_OPTIONS: SegmentedControlOption<string>[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'teacher', label: '👨‍🏫 Giáo viên' },
  { value: 'facility', label: '🏢 CSVC' },
  { value: 'operations', label: '🎧 Vận hành (CS)' },
]

export interface QcCheckToolbarProps {
  sortMode?: QcSortMode
  onSortModeChange?: (mode: QcSortMode) => void
  activeBranch: string
  activeSubject: string
  activeCriteria: string
  activeDeadline: IncidentDeadlineFilter
  onDeadlineChange: (deadline: IncidentDeadlineFilter) => void
  selectedAssignee: string
  onAssigneeChange: (assignee: string) => void
  assigneeOptions: Array<{ value: string; label: React.ReactNode; selectedLabel?: React.ReactNode }>
  myIncidentsCount: number
  currentStaffName: string
  activeTargetGroup: string
  activeStatus: IncidentStatusFilter
  searchTerm: string
  activeFilterCount: number
  statusTileTotals: Record<string, number>
  onBranchChange: (branch: string) => void
  onSubjectChange: (subject: string) => void
  onCriteriaChange: (criteria: string) => void
  onTargetGroupChange: (group: string) => void
  onStatusChange: (status: IncidentStatusFilter) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreate: () => void

  // Backwards compatibility props
  activeSource?: string
  onSourceChange?: (source: string) => void
  viewMode?: string
  onViewModeChange?: (mode: string) => void
  activeType?: string
  onTypeChange?: (type: string) => void
  activeRemediationStatus?: string
  onRemediationStatusChange?: (status: string) => void
  remediationStatusTotals?: Record<string, number>
}

export function QcCheckToolbar({
  sortMode = 'severity_deadline',
  onSortModeChange,
  activeBranch,
  activeSubject,
  activeCriteria,
  activeDeadline,
  onDeadlineChange,
  selectedAssignee,
  onAssigneeChange,
  assigneeOptions,
  myIncidentsCount,
  currentStaffName,
  activeTargetGroup,
  activeStatus,
  searchTerm,
  activeFilterCount,
  statusTileTotals,
  onBranchChange,
  onSubjectChange,
  onCriteriaChange,
  onTargetGroupChange,
  onStatusChange,
  onSearchChange,
  onOpenFilters,
  onCreate,
}: QcCheckToolbarProps) {
  const tiles: StatusTile<IncidentStatusFilter>[] = STATUS_TILE_CONFIG.map((cfg) => ({
    id: cfg.id,
    label: cfg.label,
    count: statusTileTotals[cfg.id] ?? 0,
    status: cfg.status,
  }))

  return (
    <div className="flex shrink-0 flex-col gap-1 bg-background px-2.5 pt-1.5 pb-1 lg:px-3">
      {/* Row 1: Branch, Subject (Môn), Criteria (Loại lỗi), Deadline (Thời hạn), Personnel (Nhân sự), Search, Filter Icon, Create Button */}
      <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-1.5 min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
          {/* 1. Branch Selector */}
          <BranchSelect
            value={activeBranch}
            branches={BRANCH_OPTIONS}
            onValueChange={onBranchChange}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 text-xs min-w-[125px] sm:min-w-[130px]"
          />

          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* 2. Subject Selector (Lọc theo môn sau cơ sở) */}
          <ToolbarSelect
            value={activeSubject}
            options={SUBJECT_OPTIONS}
            onValueChange={onSubjectChange}
            className="h-8 text-xs min-w-[115px] sm:min-w-[125px]"
            ariaLabel="Lọc theo môn học"
            placeholder="Môn học"
          />

          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* 3. Error Type / Criteria Selector (Lọc theo loại lỗi) */}
          <ToolbarSelect
            value={activeCriteria}
            options={CRITERIA_FILTER_OPTIONS}
            onValueChange={onCriteriaChange}
            className="h-8 text-xs min-w-[130px] sm:min-w-[140px]"
            ariaLabel="Lọc theo loại lỗi"
            placeholder="Loại lỗi"
          />

          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* 4. Deadline Selector (Lọc theo thời hạn: Đến hạn, Chưa đến hạn, Quá hạn) */}
          <ToolbarSelect
            value={activeDeadline}
            options={DEADLINE_FILTER_OPTIONS}
            onValueChange={(val) => onDeadlineChange(val as IncidentDeadlineFilter)}
            className="h-8 text-xs min-w-[120px] sm:min-w-[130px]"
            ariaLabel="Lọc theo thời hạn"
            placeholder="Thời hạn"
          />

          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* 5. Personnel Selector (Lọc theo nhân sự) */}
          <ToolbarSelect
            value={selectedAssignee}
            options={assigneeOptions}
            onValueChange={onAssigneeChange}
            className="h-8 text-xs min-w-[135px] sm:min-w-[145px]"
            ariaLabel="Lọc theo nhân sự"
            placeholder="Nhân sự"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            placeholder="Tìm mã lỗi, lớp, giáo viên, phòng, nội dung..."
            inputClassName="w-32 sm:w-36 lg:w-44 xl:w-52 2xl:w-60 text-xs h-8"
          />

          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />

          <Button
            size="sm"
            onClick={onCreate}
            className="h-8 px-2.5 font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Ghi nhận sự cố</span>
          </Button>
        </div>
      </div>

      {/* Row 2: "Lỗi của tôi" + Status Tiles (Left) + Target Group Selector (Right Edge) */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0 pt-0">
        {/* Bên trái: Nút "Lỗi của tôi" + Tab lọc trạng thái sự cố */}
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          {/* Quick Toggle: Lỗi của tôi */}
          <button
            type="button"
            onClick={() => {
              if (selectedAssignee === 'my') {
                onAssigneeChange('all')
              } else {
                onAssigneeChange('my')
              }
            }}
            className={cn(
              'h-7 px-2.5 rounded-full text-xs font-normal border inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none shrink-0',
              selectedAssignee === 'my'
                ? 'bg-primary text-primary-foreground border-primary font-medium shadow-xs'
                : 'bg-background border-border text-foreground/80 hover:bg-accent hover:text-foreground'
            )}
            title={`Lọc nhanh các lỗi do ${currentStaffName} phụ trách`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Lỗi của tôi</span>
            <span
              className={cn(
                'px-1.5 py-0.5 rounded-full text-xs leading-none',
                selectedAssignee === 'my'
                  ? 'bg-primary-foreground text-primary font-semibold'
                  : 'bg-muted text-muted-foreground font-normal'
              )}
            >
              {myIncidentsCount}
            </span>
          </button>

          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />

          {/* Tab trạng thái sự cố */}
          <StatusTiles
            tiles={tiles}
            activeId={activeStatus}
            onSelect={onStatusChange}
            compact={true}
            noOverflowCollapse={true}
            coloredCount={true}
            fontNormal={true}
          />
        </div>

        {/* Cạnh phải: Bộ sắp xếp 2 cấp + Lọc theo Đối tượng đánh giá */}
        <div className="flex items-center gap-2 select-none shrink-0 min-w-0">
          {onSortModeChange && (
            <div className="flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <ToolbarSelect
                value={sortMode}
                options={SORT_OPTIONS}
                onValueChange={(val) => onSortModeChange(val as QcSortMode)}
                className="h-7 text-xs min-w-[155px] bg-background"
                ariaLabel="Sắp xếp danh sách sự cố"
                placeholder="Sắp xếp"
              />
            </div>
          )}

          {onSortModeChange && <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />}

          {/* Lọc theo Đối tượng đánh giá */}
          <div className="flex items-center gap-1.5 select-none shrink-0 min-w-0">
            <span className="text-xs font-normal text-muted-foreground shrink-0 mr-0.5">
              Đối tượng:
            </span>
            <SegmentedControl
              options={TARGET_GROUP_OPTIONS}
              value={activeTargetGroup}
              onValueChange={onTargetGroupChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
