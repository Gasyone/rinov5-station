'use client'

import { ExpandableSearch, FilterIconButton, ToolbarSelect, BranchSelect, type ToolbarSelectOption } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { CompactExportPopover } from './CompactExportPopover'
import { OperationsAlertSmartcardPopover } from './OperationsAlertSmartcardPopover'

interface OperationsAlertToolbarProps {
  alerts: StudentCareAlert[]
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilterCount: number
  onOpenFilter: () => void
  careViewMode?: 'service' | 'academic' | 'total'
  onCareViewModeChange?: (mode: 'service' | 'academic' | 'total') => void
  selectedBranch: string
  onBranchChange: (branch: string) => void
  branchOptions: string[]
  selectedSubject: string
  onSubjectChange: (subject: string) => void
  selectedStudentStatus?: string
  onStudentStatusChange?: (status: string) => void
  careStatusFilter: 'all' | 'pending' | 'in_progress' | 'cared'
  onCareStatusFilterChange: (status: 'all' | 'pending' | 'in_progress' | 'cared') => void
  careStatusCounts?: { all: number; pending: number; in_progress: number; cared: number }
  dueDateFilter: 'all' | 'overdue' | 'today' | 'rescheduled'
  onDueDateFilterChange: (due: 'all' | 'overdue' | 'today' | 'rescheduled') => void
  dueDateCounts?: { all: number; overdue: number; today: number; rescheduled: number }
  packageStatusFilter: string
  onPackageStatusFilterChange: (status: string) => void
  packageStatusCounts?: {
    all: number
    active: number
    pending_transfer: number
    wait_for_assignment: number
    reserve: number
    session_ended: number
  }
  alertsCount?: number
  exportFields: { id: string; label: string; defaultChecked?: boolean }[]
  onConfirmExport: (
    selectedIds: string[],
    filters: { month: string; startDate: string; endDate: string }
  ) => void
  csdbCounts?: {
    weakAcademic: number
    homework: number
    lowAttendance: number
  }
  csdbFilter: string
  onCsdbFilterChange: (val: string) => void
}

const PACKAGE_STATUS_FILTER_ITEMS: Array<{
  id: 'all' | 'active' | 'pending_transfer' | 'wait_for_assignment' | 'reserve' | 'session_ended'
  label: string
  activeClass: string
  hoverClass: string
}> = [
  {
    id: 'all',
    label: 'Tất cả',
    activeClass: 'border-primary/50 bg-primary/10 text-primary font-normal border-solid',
    hoverClass: 'hover:text-foreground',
  },
  {
    id: 'active',
    label: 'Đang học',
    activeClass: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-normal border-solid',
    hoverClass: 'hover:text-foreground hover:border-emerald-500/40',
  },
  {
    id: 'pending_transfer',
    label: 'Chờ chuyển lớp',
    activeClass: 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-normal border-solid',
    hoverClass: 'hover:text-foreground hover:border-amber-500/40',
  },
  {
    id: 'wait_for_assignment',
    label: 'Chờ xếp lớp',
    activeClass: 'border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-normal border-solid',
    hoverClass: 'hover:text-foreground hover:border-sky-500/40',
  },
  {
    id: 'reserve',
    label: 'Bảo lưu',
    activeClass: 'border-purple-500/50 bg-purple-500/10 text-purple-700 dark:text-purple-300 font-normal border-solid',
    hoverClass: 'hover:text-foreground hover:border-purple-500/40',
  },
  {
    id: 'session_ended',
    label: 'Hết buổi',
    activeClass: 'border-zinc-500/50 bg-zinc-500/10 text-foreground font-normal border-solid',
    hoverClass: 'hover:text-foreground hover:border-zinc-500/40',
  },
]

export function OperationsAlertToolbar({
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
  careStatusFilter,
  onCareStatusFilterChange,
  careStatusCounts,
  dueDateFilter,
  onDueDateFilterChange,
  dueDateCounts,
  packageStatusFilter,
  onPackageStatusFilterChange,
  packageStatusCounts,
  alertsCount,
  exportFields,
  onConfirmExport,
  csdbCounts,
  csdbFilter,
  onCsdbFilterChange,
}: OperationsAlertToolbarProps) {

  const statusPillTiles: StatusTile<'all' | 'pending' | 'in_progress' | 'cared'>[] = [
    { id: 'all', label: 'Tất cả', count: careStatusCounts?.all ?? 0, semantic: 'neutral' },
    { id: 'pending', label: 'Chưa chăm sóc', count: careStatusCounts?.pending ?? 0, semantic: 'info' },
    { id: 'in_progress', label: 'Đang xử lý', count: careStatusCounts?.in_progress ?? 0, semantic: 'warning' },
    { id: 'cared', label: 'Đã chăm sóc', count: careStatusCounts?.cared ?? 0, semantic: 'success' },
  ]

  const dueDateOptions: ToolbarSelectOption[] = [
    {
      value: 'all',
      label: 'Tất cả hạn xử lý',
      textValue: 'Tất cả hạn xử lý',
      selectedLabel: 'Tất cả hạn xử lý',
    },
    {
      value: 'overdue',
      label: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>Quá hạn</span>
        </span>
      ),
      textValue: 'Quá hạn',
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>Quá hạn</span>
        </span>
      ),
    },
    {
      value: 'today',
      label: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>Đến hạn</span>
        </span>
      ),
      textValue: 'Đến hạn',
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>Đến hạn</span>
        </span>
      ),
    },
    {
      value: 'rescheduled',
      label: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
          <span>Hẹn gọi lại</span>
        </span>
      ),
      textValue: 'Hẹn gọi lại',
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
          <span>Hẹn gọi lại</span>
        </span>
      ),
    },
  ]

  return (
    <div className="flex shrink-0 flex-col gap-1.5 bg-background px-2.5 pt-2 pb-1 lg:px-3">
      {/* Row 1: 4 Selections (Branch, Subject, CSDB, Due Date), Search + Filter + Export + Smartcard Popover */}
      <div className="flex items-center justify-between flex-wrap gap-1.5 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          {/* 1. Branch Selector */}
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

          {/* 2. Subject Selector */}
          <ToolbarSelect
            value={selectedSubject}
            options={[
              { value: 'all', label: 'Tất cả các môn', selectedLabel: 'Tất cả các môn' },
              { value: 'Tiếng Anh', label: 'Tiếng Anh' },
              { value: 'Toán tư duy', label: 'Toán tư duy' }
            ]}
            onValueChange={onSubjectChange}
            className="h-8 text-xs min-w-[115px] sm:min-w-[120px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden 2xl:block shrink-0" />

          {/* 3. Loại thẻ CS filter droplist */}
          <ToolbarSelect
            value={csdbFilter}
            options={[
              { value: 'all', label: 'Tất cả Loại thẻ CS', selectedLabel: 'Tất cả Loại thẻ CS' },
              { value: 'weakAcademic', label: 'Học lực' },
              { value: 'homework', label: 'BTVN' },
              { value: 'lowAttendance', label: 'Chuyên cần' },
            ]}
            onValueChange={onCsdbFilterChange}
            className="h-8 text-xs min-w-[125px] sm:min-w-[130px]"
            ariaLabel="Lọc theo Loại thẻ CS"
            placeholder="Loại thẻ CS"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden 2xl:block shrink-0" />

          {/* 4. Hạn xử lý / Hạn chăm sóc Selector */}
          <ToolbarSelect
            value={dueDateFilter}
            options={dueDateOptions}
            onValueChange={(val) => onDueDateFilterChange(val as 'all' | 'overdue' | 'today' | 'rescheduled')}
            className="h-8 text-xs min-w-[125px] sm:min-w-[130px]"
            ariaLabel="Lọc theo hạn xử lý"
            placeholder="Hạn xử lý"
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
          
          <CompactExportPopover
            title="Cấu hình xuất dữ liệu Chăm sóc"
            fields={exportFields}
            onConfirm={onConfirmExport}
            recordCount={alertsCount || 0}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex items-center gap-1.5 bg-background hover:bg-muted border border-border shadow-xs cursor-pointer font-medium px-2.5"
                title="Xuất danh sách sang Excel"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Xuất dữ liệu</span>
              </Button>
            }
          />

          {/* Smart Card Popover Chỉ số Chăm sóc Học viên */}
          <OperationsAlertSmartcardPopover alerts={alerts} />
        </div>
      </div>

      {/* Row 2: Care Status Pills (Left) + Package/Placement Status Filter (Right, responsive collapse) */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 pt-0.5">
        {/* Left: Trạng thái chăm sóc (compact, không thu gọn, xóa dot, đưa màu vào nền thống kê, chữ thường không in đậm) */}
        <div className="min-w-0">
          <StatusTiles
            tiles={statusPillTiles}
            activeId={careStatusFilter}
            onSelect={(id) => onCareStatusFilterChange(id)}
            noOverflowCollapse={true}
            compact={true}
            showDot={false}
            hideDot={true}
            coloredCount={true}
            fontNormal={true}
          />
        </div>

        {/* Right side: Lọc nhanh theo gói học viên (Gói:) chuẩn hóa theo BookingTestConditionFilters (chữ thường không in đậm) */}
        <div className="flex items-center gap-1.5 select-none shrink-0 min-w-0">
          <span className="text-xs font-normal text-muted-foreground shrink-0 mr-0.5">
            Gói:
          </span>

          <div className="flex items-center gap-1 min-w-0 overflow-x-auto custom-scrollbar">
            {PACKAGE_STATUS_FILTER_ITEMS.map((item) => {
              const isActive = packageStatusFilter === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onPackageStatusFilterChange(
                      isActive && item.id !== 'all' ? 'all' : item.id
                    )
                  }
                  className={cn(
                    'inline-flex items-center h-6 rounded-md px-2 text-xs font-normal transition-colors cursor-pointer border select-none shrink-0 gap-1',
                    isActive
                      ? item.activeClass
                      : cn(
                          'border-border/70 border-dashed bg-background text-muted-foreground hover:bg-muted/60',
                          item.hoverClass
                        )
                  )}
                >
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
