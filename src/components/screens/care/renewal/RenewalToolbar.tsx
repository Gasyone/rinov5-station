'use client'

import {
  ExpandableSearch,
  FilterIconButton,
  ToolbarSelect,
  BranchSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { cn } from '@/lib/utils'
import { STUDENT_STATUS_CONFIG } from '@/components/screens/students/studentTypes'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { RenewalSmartcardPopover } from './RenewalSmartcardPopover'

interface RenewalToolbarProps {
  alerts: StudentCareAlert[]
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilterCount: number
  onOpenFilter: () => void
  selectedBranch: string
  onBranchChange: (branch: string) => void
  branchOptions: string[]
  selectedSubject: string
  onSubjectChange: (subject: string) => void
  selectedStudentStatus: string
  onStudentStatusChange: (status: string) => void
  careProgressTab: string
  onCareProgressTabChange: (tab: string) => void
  careProgressTiles: StatusTile<string>[]
  selectedExpiryPeriod: string
  onExpiryPeriodChange: (period: string) => void
}

export function RenewalToolbar({
  alerts,
  searchQuery,
  onSearchChange,
  activeFilterCount,
  onOpenFilter,
  selectedBranch,
  onBranchChange,
  branchOptions,
  selectedSubject,
  onSubjectChange,
  selectedStudentStatus,
  onStudentStatusChange,
  careProgressTab,
  onCareProgressTabChange,
  careProgressTiles,
  selectedExpiryPeriod,
  onExpiryPeriodChange,
}: RenewalToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-1.5 bg-background px-2.5 pt-2 pb-1 lg:px-3">
      {/* Row 1: Branch, Subject, Student Status, Search + Filter + Smartcard Popover */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          {/* Branch Selector */}
          <BranchSelect
            value={selectedBranch}
            onValueChange={onBranchChange}
            branches={branchOptions}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 text-xs min-w-[130px] sm:min-w-[135px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden 2xl:block shrink-0" />

          {/* Subject Selector */}
          <ToolbarSelect
            value={selectedSubject}
            options={[
              { value: 'all', label: 'Tất cả các môn', selectedLabel: 'Tất cả các môn' },
              { value: 'Tiếng Anh', label: 'Tiếng Anh' },
              { value: 'Toán tư duy', label: 'Toán tư duy' },
            ]}
            onValueChange={onSubjectChange}
            className="h-8 text-xs min-w-[115px] sm:min-w-[120px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden 2xl:block shrink-0" />

          {/* Student Status Selector */}
          <ToolbarSelect
            value={selectedStudentStatus}
            options={[
              { value: 'all', label: 'Chọn Trạng thái học viên', selectedLabel: 'Chọn Trạng thái HV' },
              ...STUDENT_STATUS_CONFIG.map((s) => ({
                value: s.id,
                label: s.label,
              })),
            ]}
            onValueChange={onStudentStatusChange}
            className="h-8 text-xs min-w-[145px] sm:min-w-[150px]"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Tìm kiếm..."
            inputClassName="sm:w-60 text-xs h-8"
          />
          <FilterIconButton
            count={activeFilterCount > 0 ? activeFilterCount : undefined}
            onClick={onOpenFilter}
          />

          {/* Smartcard Popover Chỉ số tài chính tái phí */}
          <RenewalSmartcardPopover alerts={alerts} />
        </div>
      </div>

      {/* Row 2: Care Progress Pill Tabs + Expiry Period Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0 pt-0.5">
        <div className="min-w-0">
          <StatusTiles
            tiles={careProgressTiles}
            activeId={careProgressTab}
            onSelect={(id) =>
              onCareProgressTabChange(careProgressTab === id && id !== 'all' ? 'all' : id)
            }
            noOverflowCollapse={true}
            compact={true}
            showDot={false}
            hideDot={true}
            coloredCount={true}
            fontNormal={true}
          />
        </div>

        <div className="flex items-center gap-1.5 select-none shrink-0">
          <span className="text-xs font-normal text-muted-foreground shrink-0 mr-0.5">
            Hạn học phí:
          </span>
          <div className="flex items-center gap-1 min-w-0">
            <button
              type="button"
              onClick={() => onExpiryPeriodChange('all')}
              className={cn(
                "inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0",
                selectedExpiryPeriod === 'all'
                  ? "border-primary/50 bg-primary/10 text-primary font-normal"
                  : "border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <span>Tất cả</span>
            </button>
            <button
              type="button"
              onClick={() => onExpiryPeriodChange('1')}
              className={cn(
                "inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0",
                selectedExpiryPeriod === '1'
                  ? "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-normal"
                  : "border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <span>Hạn T1 (≤ 1T)</span>
            </button>
            <button
              type="button"
              onClick={() => onExpiryPeriodChange('2')}
              className={cn(
                "inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0",
                selectedExpiryPeriod === '2'
                  ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-normal"
                  : "border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <span>Hạn T2 (1-2T)</span>
            </button>
            <button
              type="button"
              onClick={() => onExpiryPeriodChange('3')}
              className={cn(
                "inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0",
                selectedExpiryPeriod === '3'
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-normal"
                  : "border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <span>Hạn T3 (2-3T)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
