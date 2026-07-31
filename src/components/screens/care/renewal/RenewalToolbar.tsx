'use client'

import { ExpandableSearch, FilterIconButton, ToolbarSelect, BranchSelect } from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Download, Table2, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CompactExportPopover } from '../CompactExportPopover'

interface RenewalToolbarProps {
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
  selectedMonth: string
  onMonthChange: (month: string) => void
  alertsCount?: number
  exportFields: { id: string; label: string; defaultChecked?: boolean }[]
  onConfirmExport: (
    selectedIds: string[],
    filters: { month: string; startDate: string; endDate: string }
  ) => void
  viewMode: 'table' | 'dashboard'
  onViewModeChange: (mode: 'table' | 'dashboard') => void
}

export function RenewalToolbar({
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
  selectedMonth,
  onMonthChange,
  alertsCount,
  exportFields,
  onConfirmExport,
  viewMode,
  onViewModeChange,
}: RenewalToolbarProps) {
  return (
    <div className="flex flex-col gap-0 bg-background px-3 py-3 lg:px-3">
      {/* Row 1: Branch, Subject, Student Status, Search + Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2.5">
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

          {/* Student Status Selector */}
          <ToolbarSelect
            value={selectedStudentStatus}
            options={[
              { value: 'all', label: 'Chọn Trạng thái học viên', selectedLabel: 'Chọn Trạng thái HV' },
              { value: 'Chưa gọi', label: 'Chưa liên hệ' },
              { value: 'Đã gọi', label: 'Đã gọi điện' },
              { value: 'KNM', label: 'Không nghe máy' },
              { value: 'Đã nhắn Zalo', label: 'Đã nhắn Zalo' },
              { value: 'Đã nhắn Facebook', label: 'Đã nhắn Facebook' },
              { value: 'Đã gặp trực tiếp', label: 'Đã gặp trực tiếp' }
            ]}
            onValueChange={onStudentStatusChange}
            className="h-8 text-xs min-w-[180px]"
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
            title="Cấu hình xuất dữ liệu Tái phí"
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

      {/* Row 2: Care Progress Pill Tabs + Month Filter Radio Buttons */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto min-w-0 border-t border-border/40 dark:border-zinc-800 pt-2">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <StatusTiles
            tiles={careProgressTiles}
            activeId={careProgressTab}
            onSelect={(id) => onCareProgressTabChange(careProgressTab === id && id !== 'all' ? 'all' : id)}
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0 pl-2 border-l border-border/40 dark:border-zinc-800">
          <RadioGroup
            value={selectedMonth}
            onValueChange={onMonthChange}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-1 cursor-pointer">
              <RadioGroupItem value="all" id="month-all" className="cursor-pointer" />
              <Label htmlFor="month-all" className="text-xs cursor-pointer font-medium whitespace-nowrap text-muted-foreground hover:text-foreground">
                Tất cả
              </Label>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <RadioGroupItem 
                value="1" 
                id="month-1" 
                className="cursor-pointer border-red-500 text-red-600 focus-visible:ring-red-400 data-[state=checked]:border-red-600" 
              />
              <Label htmlFor="month-1" className="text-xs cursor-pointer font-bold whitespace-nowrap text-red-600 dark:text-red-400">
                Tháng T1
              </Label>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <RadioGroupItem 
                value="2" 
                id="month-2" 
                className="cursor-pointer border-amber-500 text-amber-600 focus-visible:ring-amber-400 data-[state=checked]:border-amber-600" 
              />
              <Label htmlFor="month-2" className="text-xs cursor-pointer font-bold whitespace-nowrap text-amber-600 dark:text-amber-400">
                Tháng T2
              </Label>
            </div>
            <div className="flex items-center gap-1 cursor-pointer">
              <RadioGroupItem 
                value="3" 
                id="month-3" 
                className="cursor-pointer border-emerald-500 text-emerald-600 focus-visible:ring-emerald-400 data-[state=checked]:border-emerald-600" 
              />
              <Label htmlFor="month-3" className="text-xs cursor-pointer font-bold whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                Tháng T3
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}


