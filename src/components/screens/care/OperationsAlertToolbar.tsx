'use client'

import { ExpandableSearch, FilterIconButton, ToolbarSelect, BranchSelect } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Download, Table2, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CompactExportPopover } from './CompactExportPopover'

interface OperationsAlertToolbarProps {
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
  alertsCount?: number
  exportFields: { id: string; label: string; defaultChecked?: boolean }[]
  onConfirmExport: (
    selectedIds: string[],
    filters: { month: string; startDate: string; endDate: string }
  ) => void
  viewMode: 'table' | 'dashboard'
  onViewModeChange: (mode: 'table' | 'dashboard') => void
  csdbCounts?: {
    weakAcademic: number
    homework: number
    lowAttendance: number
  }
  csdbFilter: string
  onCsdbFilterChange: (val: string) => void
}

export function OperationsAlertToolbar({
  searchQuery,
  onSearchChange,
  activeFilterCount,
  onOpenFilter,
  careViewMode = 'total',
  onCareViewModeChange,
  selectedBranch,
  onBranchChange,
  branchOptions,
  selectedSubject,
  onSubjectChange,
  selectedStudentStatus = 'all',
  onStudentStatusChange,
  careStatusFilter,
  onCareStatusFilterChange,
  careStatusCounts,
  dueDateFilter,
  onDueDateFilterChange,
  dueDateCounts,
  alertsCount,
  exportFields,
  onConfirmExport,
  viewMode,
  onViewModeChange,
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

  return (
    <div className="flex flex-col gap-0 bg-background px-1.5 py-1.5 lg:px-1.5">
      {/* Row 1: Branch, Subject, CSDB Filter, Search + Filter */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1.5">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Branch Selector */}
          <BranchSelect
            value={selectedBranch}
            onValueChange={onBranchChange}
            branches={branchOptions}
            allLabel="Tất cả Cơ sở"
            placeholder="Chọn Cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 text-xs min-w-[160px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* Subject Selector */}
          <ToolbarSelect
            value={selectedSubject}
            options={[
              { value: 'all', label: 'Tất cả môn học' },
              { value: 'Tiếng Anh', label: 'Tiếng Anh' },
              { value: 'Toán tư duy', label: 'Toán tư duy' }
            ]}
            onValueChange={onSubjectChange}
            className="h-8 text-xs min-w-[140px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* CSDB filter droplist (Cùng hàng với môn học, ở phía sau Tất cả môn học) */}
          <ToolbarSelect
            value={csdbFilter}
            options={[
              { value: 'all', label: 'Tất cả CSĐB', selectedLabel: 'Tất cả CSĐB' },
              { value: 'weakAcademic', label: `Học lực (${csdbCounts?.weakAcademic ?? 0})` },
              { value: 'homework', label: `BTVN (${csdbCounts?.homework ?? 0})` },
              { value: 'lowAttendance', label: `Chuyên cần (${csdbCounts?.lowAttendance ?? 0})` },
            ]}
            onValueChange={onCsdbFilterChange}
            className="h-8 text-xs font-bold min-w-[155px]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Switch View Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="xs"
              variant="ghost"
              className={cn(
                "h-8 text-xs font-bold flex items-center gap-1.5 cursor-pointer px-2.5 rounded-md transition-colors",
                viewMode === 'table' 
                  ? "text-sky-600 hover:text-sky-700 hover:bg-sky-50/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-zinc-100"
              )}
              onClick={() => onViewModeChange('table')}
              type="button"
            >
              <Table2 className="h-3.5 w-3.5" />
              Bảng
            </Button>
            <Button
              size="xs"
              variant="ghost"
              className={cn(
                "h-8 text-xs font-bold flex items-center gap-1.5 cursor-pointer px-2.5 rounded-md transition-colors",
                viewMode === 'dashboard' 
                  ? "text-sky-600 hover:text-sky-700 hover:bg-sky-50/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-zinc-100"
              )}
              onClick={() => onViewModeChange('dashboard')}
              type="button"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Dashboard
            </Button>
          </div>

          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Tìm kiếm..."
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
                size="xs"
                className="h-8 text-xs flex items-center gap-1.5 bg-background hover:bg-muted border border-border shadow-none cursor-pointer"
                title="Xuất danh sách sang Excel"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline font-semibold">Xuất dữ liệu</span>
              </Button>
            }
          />
        </div>
      </div>

      {/* Row 2: Care Status Pills (Left) + Due Date Filter Chips (Right) */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-t border-border/40 dark:border-zinc-800 pt-2 pb-1">
        {/* Left: Trạng thái chăm sóc (Hiển thị đầy đủ tất cả nhãn, không thu gọn) */}
        <div className="min-w-0 flex-1">
          <StatusTiles
            tiles={statusPillTiles}
            activeId={careStatusFilter}
            onSelect={(id) => onCareStatusFilterChange(id)}
            noOverflowCollapse={true}
          />
        </div>

        {/* Right side: Hạn chăm sóc (Chips Bar) */}
        <div className="flex items-center gap-3 select-none shrink-0 pb-0.5">
          {/* Hạn chăm sóc (Chips Bar) */}
          <div className="flex items-center gap-1 bg-muted/50 dark:bg-muted/30 p-0.5 rounded-md border border-border/50">
            <button
              type="button"
              onClick={() => onDueDateFilterChange('all')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1",
                dueDateFilter === 'all'
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Tất cả</span>
            </button>

            <button
              type="button"
              onClick={() => onDueDateFilterChange('overdue')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                dueDateFilter === 'overdue'
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 shadow-xs"
                  : "text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>Quá hạn</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold">
                {dueDateCounts?.overdue ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onDueDateFilterChange('today')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                dueDateFilter === 'today'
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 shadow-xs"
                  : "text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Đến hạn</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
                {dueDateCounts?.today ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onDueDateFilterChange('rescheduled')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                dueDateFilter === 'rescheduled'
                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800 shadow-xs"
                  : "text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
              <span>Hẹn gọi lại</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
                {dueDateCounts?.rescheduled ?? 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
