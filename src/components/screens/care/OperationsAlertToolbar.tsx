'use client'

import { RefreshCw } from 'lucide-react'
import { BranchSelect, ExpandableSearch, ToolbarSelect, SegmentedControl } from '@/components/controls'
import { Button } from '@/components/ui/button'

interface OperationsAlertToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  branchFilter: string
  branchOptions: string[]
  onBranchChange: (branch: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  alertFilter: string
  onAlertChange: (alert: string) => void
  callFilter: string
  onCallChange: (call: string) => void
  classFilter: string
  onClassChange: (c: string) => void
  onSyncData: () => void
  isSyncing: boolean
  classList: string[]
  classStatusTab: string
  onClassStatusTabChange: (status: string) => void
}

export function OperationsAlertToolbar({
  searchQuery,
  onSearchChange,
  branchFilter,
  branchOptions,
  onBranchChange,
  statusFilter,
  onStatusChange,
  alertFilter,
  onAlertChange,
  callFilter,
  onCallChange,
  classFilter,
  onClassChange,
  onSyncData,
  isSyncing,
  classList,
  classStatusTab,
  onClassStatusTabChange
}: OperationsAlertToolbarProps) {
  return (
    <div className="flex flex-col gap-3 bg-background px-4 py-3 lg:px-6">
      {/* Top Row: Class Status Segmented Control */}
      <div className="flex items-center justify-between pb-1.5 flex-wrap gap-2">
        <SegmentedControl
          value={classStatusTab}
          options={[
            { value: 'all', label: 'Tất cả trạng thái lớp' },
            { value: 'Đang học', label: 'Lớp đang học' },
            { value: 'Chờ chuyển lớp', label: 'Lớp chờ chuyển' },
            { value: 'Hết buổi', label: 'Lớp hết buổi' }
          ]}
          onValueChange={onClassStatusTabChange}
        />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Trạng thái Vận hành Lớp học
        </span>
      </div>

      {/* Bottom Row: Advanced Dropdowns & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 min-h-0">
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
              { value: 'all', label: 'Mọi trạng thái học' },
              { value: 'Đang học', label: 'Đang học' },
              { value: 'Chờ chuyển lớp', label: 'Chờ chuyển lớp' },
              { value: 'Hết buổi', label: 'Hết buổi' }
            ]}
            ariaLabel="Trạng thái học"
            className="h-8 text-xs min-w-36"
          />

          {/* Alert Filter */}
          <ToolbarSelect
            value={alertFilter}
            onValueChange={onAlertChange}
            options={[
              { value: 'all', label: 'Mọi cảnh báo' },
              { value: 'C90B', label: 'Cảnh báo C90B' },
              { value: 'Học lực yếu', label: 'Học lực yếu' },
              { value: 'Chuyên cần thấp', label: 'Chuyên cần thấp' }
            ]}
            ariaLabel="Cảnh báo CSKH"
            className="h-8 text-xs min-w-36"
          />

          {/* Call Confirmation Filter */}
          <ToolbarSelect
            value={callFilter}
            onValueChange={onCallChange}
            options={[
              { value: 'all', label: 'Trạng thái CSKH' },
              { value: 'Đã gọi', label: 'Đã gọi' },
              { value: 'KNM', label: 'Không nghe máy (KNM)' },
              { value: 'Đã nhắn Zalo', label: 'Đã nhắn Zalo' },
              { value: 'Chưa gọi', label: 'Chưa gọi / Liên hệ' }
            ]}
            ariaLabel="Trạng thái CSKH"
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

        {/* Right Side: Search & Sync Data Button */}
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
            className="h-8 px-3 text-xs font-medium"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Cập nhật dữ liệu
          </Button>
        </div>
      </div>
    </div>
  )
}
