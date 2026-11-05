'use client'

import React from 'react'
import { Plus, ListFilter, SlidersHorizontal, Network } from 'lucide-react'
import {
  FilterIconButton,
  IconActionButton,
  ExpandableSearch,
  SegmentedControl,
  type SegmentedControlOption,
  BranchSelect,
  ToolbarSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import {
  BRANCH_OPTIONS,
  SUBJECT_OPTIONS,
  CRITERIA_TILE_CONFIG,
  type IncidentStatusFilter,
  type IncidentDeadlineFilter,
} from './qcCheckTypes'

const TARGET_GROUP_OPTIONS: SegmentedControlOption<string>[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'teacher', label: '👨‍🏫 Giáo viên' },
  { value: 'facility', label: '🏢 CSVC' },
  { value: 'operations', label: '🎧 Vận hành (CS)' },
]

export interface QcCheckToolbarProps {
  activeBranch: string
  activeSubject: string
  activeCriteria: string
  onBranchChange: (branch: string) => void
  onSubjectChange: (subject: string) => void
  onCriteriaChange: (criteria: string) => void
  criteriaTileTotals: Record<string, number>
  activeTargetGroup: string
  onTargetGroupChange: (group: string) => void
  searchTerm: string
  onSearchChange: (value: string) => void
  activeFilterCount: number
  onOpenFilters: () => void
  onOpenSlaConfig?: () => void
  onOpenBusinessModel?: () => void
  onCreate: () => void

  // Optional / backwards compatibility props
  activeDeadline?: IncidentDeadlineFilter
  onDeadlineChange?: (deadline: IncidentDeadlineFilter) => void
  selectedAssignee?: string
  onAssigneeChange?: (assignee: string) => void
  assigneeOptions?: Array<{ value: string; label: React.ReactNode; selectedLabel?: React.ReactNode }>
  myIncidentsCount?: number
  currentStaffName?: string
  activeStatus?: IncidentStatusFilter
  onStatusChange?: (status: IncidentStatusFilter) => void
  statusTileTotals?: Record<string, number>
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
  activeBranch,
  activeSubject,
  activeCriteria,
  onBranchChange,
  onSubjectChange,
  onCriteriaChange,
  criteriaTileTotals = {},
  activeTargetGroup,
  onTargetGroupChange,
  searchTerm,
  onSearchChange,
  activeFilterCount,
  onOpenFilters,
  onOpenSlaConfig,
  onOpenBusinessModel,
  onCreate,
}: QcCheckToolbarProps) {
  const tiles: StatusTile<string>[] = CRITERIA_TILE_CONFIG.map((cfg) => ({
    id: cfg.id,
    label: cfg.label,
    count: criteriaTileTotals[cfg.id] ?? 0,
    semantic: cfg.semantic,
  }))

  return (
    <div className="flex shrink-0 flex-col gap-1 bg-background px-2.5 pt-1.5 pb-1 lg:px-3">
      {/* Row 1: Branch, Subject (Môn), Search, Filter Icon, Business Model, SLA Config, Create Button */}
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
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            placeholder="Tìm mã lỗi, lớp, giáo viên, phòng, nội dung..."
            inputClassName="w-32 sm:w-36 lg:w-44 xl:w-52 2xl:w-60 text-xs h-8"
          />

          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />

          {onOpenBusinessModel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenBusinessModel}
              className="h-8 px-2.5 text-xs gap-1.5 font-medium border-border/80 text-foreground hover:bg-muted/60 transition-colors cursor-pointer shadow-2xs"
              title="Xem sơ đồ mô hình nghiệp vụ và quy trình vận hành QC Check"
            >
              <Network className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Mô hình nghiệp vụ</span>
              <span className="sm:hidden">Mô hình</span>
            </Button>
          )}

          {onOpenSlaConfig && (
            <IconActionButton
              icon={SlidersHorizontal}
              label="Thiết lập tiêu chí & SLA"
              onClick={onOpenSlaConfig}
              className="h-8 w-8 text-muted-foreground hover:text-foreground border border-border/60 hover:border-border"
            />
          )}

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

      {/* Row 2: Criteria Filter Tiles (Left) + Target Group Selector (Right Edge) */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0 pt-0">
        {/* Bên trái: Tab lọc theo Loại lỗi */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <StatusTiles
            tiles={tiles}
            activeId={activeCriteria}
            onSelect={onCriteriaChange}
            compact={true}
            noOverflowCollapse={true}
            coloredCount={true}
            fontNormal={true}
          />
        </div>

        {/* Cạnh phải: Lọc theo Đối tượng đánh giá */}
        <div className="flex items-center gap-1.5 select-none shrink-0 min-w-0">
          <span
            title="Lọc nhanh theo đối tượng"
            aria-label="Lọc nhanh theo đối tượng"
            className="inline-flex items-center text-muted-foreground shrink-0 mr-0.5 select-none"
          >
            <ListFilter className="h-3.5 w-3.5" />
          </span>
          <SegmentedControl
            options={TARGET_GROUP_OPTIONS}
            value={activeTargetGroup}
            onValueChange={onTargetGroupChange}
          />
        </div>
      </div>
    </div>
  )
}
