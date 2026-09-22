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
        <span className="flex items-center justify-between w-full gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>Quá hạn</span>
          </span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold">
            {dueDateCounts?.overdue ?? 0}
          </span>
        </span>
      ),
      textValue: `Quá hạn (${dueDateCounts?.overdue ?? 0})`,
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
          <span>Quá hạn</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold">
            {dueDateCounts?.overdue ?? 0}
          </span>
        </span>
      ),
    },
    {
      value: 'today',
      label: (
        <span className="flex items-center justify-between w-full gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Đến hạn</span>
          </span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
            {dueDateCounts?.today ?? 0}
          </span>
        </span>
      ),
      textValue: `Đến hạn (${dueDateCounts?.today ?? 0})`,
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>Đến hạn</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
            {dueDateCounts?.today ?? 0}
          </span>
        </span>
      ),
    },
    {
      value: 'rescheduled',
      label: (
        <span className="flex items-center justify-between w-full gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
            <span>Hẹn gọi lại</span>
          </span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
            {dueDateCounts?.rescheduled ?? 0}
          </span>
        </span>
      ),
      textValue: `Hẹn gọi lại (${dueDateCounts?.rescheduled ?? 0})`,
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
          <span>Hẹn gọi lại</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
            {dueDateCounts?.rescheduled ?? 0}
          </span>
        </span>
      ),
    },
  ]

  const packageStatusOptions: ToolbarSelectOption[] = [
    {
      value: 'all',
      label: (
        <span className="flex items-center justify-between w-full gap-3">
          <span>Tất cả trạng thái gói</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
            {packageStatusCounts?.all ?? 0}
          </span>
        </span>
      ),
      textValue: 'Tất cả trạng thái gói',
      selectedLabel: 'Tất cả gói / lớp',
    },
    {
      value: 'active',
      label: (
        <span className="flex items-center justify-between w-full gap-3">
          <span>Đang học</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
            {packageStatusCounts?.active ?? 0}
          </span>
        </span>
      ),
      textValue: `Đang học (${packageStatusCounts?.active ?? 0})`,
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span>Đang học</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
            {packageStatusCounts?.active ?? 0}
          </span>
        </span>
      ),
    },
    {
      value: 'pending_transfer',
      label: (
        <span className="flex items-center justify-between w-full gap-3">
          <span>Chờ chuyển lớp</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
            {packageStatusCounts?.pending_transfer ?? 0}
          </span>
        </span>
      ),
      textValue: `Chờ chuyển lớp (${packageStatusCounts?.pending_transfer ?? 0})`,
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span>Chờ chuyển lớp</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
            {packageStatusCounts?.pending_transfer ?? 0}
          </span>
        </span>
      ),
    },
    {
      value: 'wait_for_assignment',
      label: (
        <span className="flex items-center justify-between w-full gap-3">
          <span>Chờ xếp lớp</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold">
            {packageStatusCounts?.wait_for_assignment ?? 0}
          </span>
        </span>
      ),
      textValue: `Chờ xếp lớp (${packageStatusCounts?.wait_for_assignment ?? 0})`,
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span>Chờ xếp lớp</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold">
            {packageStatusCounts?.wait_for_assignment ?? 0}
          </span>
        </span>
      ),
    },
    {
      value: 'reserve',
      label: (
        <span className="flex items-center justify-between w-full gap-3">
          <span>Bảo lưu</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
            {packageStatusCounts?.reserve ?? 0}
          </span>
        </span>
      ),
      textValue: `Bảo lưu (${packageStatusCounts?.reserve ?? 0})`,
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span>Bảo lưu</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
            {packageStatusCounts?.reserve ?? 0}
          </span>
        </span>
      ),
    },
    {
      value: 'session_ended',
      label: (
        <span className="flex items-center justify-between w-full gap-3">
          <span>Hết buổi</span>
          <span className="px-1.5 py-0.2 rounded-full text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
            {packageStatusCounts?.session_ended ?? 0}
          </span>
        </span>
      ),
      textValue: `Hết buổi (${packageStatusCounts?.session_ended ?? 0})`,
      selectedLabel: (
        <span className="flex items-center gap-1.5">
          <span>Hết buổi</span>
          <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
            {packageStatusCounts?.session_ended ?? 0}
          </span>
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-0 bg-background px-1.5 py-1.5 lg:px-1.5">
      {/* Row 1: 4 Selections (Branch, Subject, CSDB, Due Date), Search + Filter + Export + Smartcard Popover */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 1. Branch Selector */}
          <BranchSelect
            value={selectedBranch}
            onValueChange={onBranchChange}
            branches={branchOptions}
            allLabel="Tất cả Cơ sở"
            placeholder="Chọn Cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 text-xs min-w-[145px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* 2. Subject Selector */}
          <ToolbarSelect
            value={selectedSubject}
            options={[
              { value: 'all', label: 'Tất cả môn học' },
              { value: 'Tiếng Anh', label: 'Tiếng Anh' },
              { value: 'Toán tư duy', label: 'Toán tư duy' }
            ]}
            onValueChange={onSubjectChange}
            className="h-8 text-xs min-w-[130px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* 3. CSDB filter droplist */}
          <ToolbarSelect
            value={csdbFilter}
            options={[
              { value: 'all', label: 'Tất cả CSĐB', selectedLabel: 'Tất cả CSĐB' },
              { value: 'weakAcademic', label: `Học lực (${csdbCounts?.weakAcademic ?? 0})` },
              { value: 'homework', label: `BTVN (${csdbCounts?.homework ?? 0})` },
              { value: 'lowAttendance', label: `Chuyên cần (${csdbCounts?.lowAttendance ?? 0})` },
            ]}
            onValueChange={onCsdbFilterChange}
            className="h-8 text-xs font-bold min-w-[145px]"
          />

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* 4. Hạn xử lý / Hạn chăm sóc Selector (được đưa lên cùng 3 selection ở trên) */}
          <ToolbarSelect
            value={dueDateFilter}
            options={dueDateOptions}
            onValueChange={(val) => onDueDateFilterChange(val as 'all' | 'overdue' | 'today' | 'rescheduled')}
            className="h-8 text-xs min-w-[150px]"
            ariaLabel="Lọc theo hạn xử lý"
            placeholder="Hạn xử lý"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
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

          {/* Smart Card Popover Chỉ số Chăm sóc Học viên */}
          <OperationsAlertSmartcardPopover alerts={alerts} />
        </div>
      </div>

      {/* Row 2: Care Status Pills (Left) + Package/Placement Status Filter (Right, responsive collapse) */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-t border-border/40 dark:border-zinc-800 pt-2 pb-1">
        {/* Left: Trạng thái chăm sóc (Hiển thị đầy đủ tất cả nhãn, không thu gọn, xóa dot, đưa màu vào nền thống kê) */}
        <div className="min-w-0 flex-1">
          <StatusTiles
            tiles={statusPillTiles}
            activeId={careStatusFilter}
            onSelect={(id) => onCareStatusFilterChange(id)}
            noOverflowCollapse={true}
            showDot={false}
            hideDot={true}
            coloredCount={true}
          />
        </div>

        {/* Right side: Trạng thái gói học viên (cột Lớp học) - Tự động gom lại nếu màn hình nhỏ */}
        <div className="flex items-center gap-2 select-none shrink-0 pb-0.5">
          {/* Màn hình lớn (>= xl): Hiển thị trải phẳng dạng Chip Group nổi bật, xóa dot, giữ màu nền thống kê */}
          <div className="hidden xl:flex items-center gap-1 bg-muted/50 dark:bg-muted/30 p-0.5 rounded-md border border-border/50">
            <button
              type="button"
              onClick={() => onPackageStatusFilterChange('all')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                packageStatusFilter === 'all'
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>Tất cả gói</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                {packageStatusCounts?.all ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onPackageStatusFilterChange('active')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                packageStatusFilter === 'active'
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 shadow-xs"
                  : "text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
              )}
            >
              <span>Đang học</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
                {packageStatusCounts?.active ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onPackageStatusFilterChange('pending_transfer')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                packageStatusFilter === 'pending_transfer'
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800 shadow-xs"
                  : "text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400"
              )}
            >
              <span>Chờ chuyển lớp</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
                {packageStatusCounts?.pending_transfer ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onPackageStatusFilterChange('wait_for_assignment')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                packageStatusFilter === 'wait_for_assignment'
                  ? "bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800 shadow-xs"
                  : "text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400"
              )}
            >
              <span>Chờ xếp lớp</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-bold">
                {packageStatusCounts?.wait_for_assignment ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onPackageStatusFilterChange('reserve')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                packageStatusFilter === 'reserve'
                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800 shadow-xs"
                  : "text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400"
              )}
            >
              <span>Bảo lưu</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold">
                {packageStatusCounts?.reserve ?? 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onPackageStatusFilterChange('session_ended')}
              className={cn(
                "h-7 px-2.5 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5",
                packageStatusFilter === 'session_ended'
                  ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-bold border border-zinc-300 dark:border-zinc-700 shadow-xs"
                  : "text-muted-foreground hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              <span>Hết buổi</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                {packageStatusCounts?.session_ended ?? 0}
              </span>
            </button>
          </div>

          {/* Màn hình nhỏ (< xl): Tự động gom lại thành Selection gọn gàng */}
          <div className="flex xl:hidden items-center">
            <ToolbarSelect
              value={packageStatusFilter}
              options={packageStatusOptions}
              onValueChange={(val) => onPackageStatusFilterChange(val)}
              className="h-8 text-xs min-w-[160px]"
              ariaLabel="Lọc theo trạng thái gói học viên"
              placeholder="Trạng thái gói"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
