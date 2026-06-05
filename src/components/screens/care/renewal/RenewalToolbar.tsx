'use client'

import { RefreshCw, Plus } from 'lucide-react'
import { BranchSelect, ExpandableSearch, ToolbarSelect, SegmentedControl } from '@/components/controls'
import { Button } from '@/components/ui/button'
import { RenewalStageFilter } from './renewalTypes'

interface RenewalToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  branchFilter: string
  branchOptions: string[]
  onBranchChange: (branch: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  classFilter: string
  onClassChange: (c: string) => void
  stageFilter: RenewalStageFilter
  onStageChange: (stage: RenewalStageFilter) => void
  onSyncData: () => void
  isSyncing: boolean
  classList: string[]
  counts: {
    past: number
    present: number
    future: number
  }
  onAddClick?: () => void
}

export function RenewalToolbar({
  searchQuery,
  onSearchChange,
  branchFilter,
  branchOptions,
  onBranchChange,
  statusFilter,
  onStatusChange,
  classFilter,
  onClassChange,
  stageFilter,
  onStageChange,
  onSyncData,
  isSyncing,
  classList,
  counts,
  onAddClick
}: RenewalToolbarProps) {
  return (
    <div className="flex flex-col gap-2 bg-background px-3 py-2 lg:px-4">
      {/* Top Row: Class Status Segmented Control */}
      <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
        <SegmentedControl
          value={stageFilter}
          options={[
            { value: 'T-1', label: `T-1 [${counts.past}]` },
            { value: 'T', label: `T [${counts.present}]` },
            { value: 'T+1', label: `T+1 & T+2 [${counts.future}]` }
          ]}
          onValueChange={(val) => onStageChange(val as RenewalStageFilter)}
        />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Chiến dịch Tái phí Học phí
        </span>
      </div>

      {/* Bottom Row: Advanced Dropdowns & Search */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-h-0">
        {/* Left Side: Advanced Filters */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <BranchSelect
            value={branchFilter}
            branches={branchOptions}
            onValueChange={onBranchChange}
            className="h-8 min-w-36 text-xs"
          />

          {/* Status Filter */}
          <ToolbarSelect
            value={statusFilter}
            onValueChange={onStatusChange}
            options={[
              { value: 'all', label: 'Mọi kết quả tái phí' },
              { value: 'Đang chăm sóc', label: 'Đang chăm sóc' },
              { value: 'Thành công', label: 'Thành công' },
              { value: 'Thất bại', label: 'Thất bại' }
            ]}
            ariaLabel="Trạng thái tái phí"
            className="h-8 text-xs min-w-36"
          />

          {/* Class Filter */}
          <ToolbarSelect
            value={classFilter}
            onValueChange={onClassChange}
            options={[
              { value: 'all', label: 'Mọi lớp học' },
              ...classList.map((cls) => ({ value: cls, label: cls }))
            ]}
            ariaLabel="Lớp học"
            className="h-8 text-xs min-w-36"
          />
        </div>

        {/* Right Side: Search & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ExpandableSearch
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Tìm kiếm..."
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onSyncData}
            disabled={isSyncing}
            className="h-8 px-3 text-xs font-medium cursor-pointer"
            title="Đồng bộ chỉ số và tự động đánh giá quét trạng thái"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Cập nhật dữ liệu
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={onAddClick}
            className="h-8 px-3 text-xs font-semibold bg-primary text-white hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Thêm học viên
          </Button>
        </div>
      </div>
    </div>
  )
}

