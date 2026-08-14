'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ExpandableSearch,
  SegmentedControl,
  ToolbarSelect,
} from '@/components/controls'
import {
  SOURCE_OPTIONS,
  ASSIGNMENT_OPTIONS,
  VIEW_SCOPE_OPTIONS,
  FOLLOW_UP_OPTIONS,
} from './crmLeadsTypes'

interface CrmLeadsToolbarProps {
  viewScope: 'my' | 'all'
  onViewScopeChange: (scope: 'my' | 'all') => void
  source: string
  onSourceChange: (val: string) => void
  assignment: string
  onAssignmentChange: (val: string) => void
  followUp: string
  onFollowUpChange: (val: string) => void
  search: string
  onSearchChange: (val: string) => void
  onCreateClick?: () => void
}

export function CrmLeadsToolbar({
  viewScope,
  onViewScopeChange,
  source,
  onSourceChange,
  assignment,
  onAssignmentChange,
  followUp,
  onFollowUpChange,
  search,
  onSearchChange,
  onCreateClick,
}: CrmLeadsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Bộ lọc bên trái: Tab Phạm vi (Của tôi / Tất cả) & các bộ lọc tương ứng */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tab Chuyển Phạm Vi Góc Nhìn */}
        <SegmentedControl
          value={viewScope}
          onValueChange={(val) => onViewScopeChange(val as 'my' | 'all')}
          options={VIEW_SCOPE_OPTIONS}
        />

        {/* Nguồn Lead */}
        <ToolbarSelect
          value={source}
          onValueChange={onSourceChange}
          options={SOURCE_OPTIONS}
        />

        {/* Tab Tất cả -> Hiện lọc Phân bổ cho Quản lý */}
        {viewScope === 'all' && (
          <ToolbarSelect
            value={assignment}
            onValueChange={onAssignmentChange}
            options={ASSIGNMENT_OPTIONS}
          />
        )}

        {/* Tab Của tôi -> Hiện lọc Lịch chăm sóc/Nhắc việc cho Sale */}
        {viewScope === 'my' && (
          <ToolbarSelect
            value={followUp}
            onValueChange={onFollowUpChange}
            options={FOLLOW_UP_OPTIONS}
          />
        )}
      </div>

      {/* Tìm kiếm & Nút tạo mới đặt cạnh nhau bên phải */}
      <div className="flex flex-wrap items-center gap-2">
        <ExpandableSearch
          value={search}
          onValueChange={onSearchChange}
          placeholder="Tìm theo Phụ huynh, SĐT, Tên con..."
        />
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          onClick={onCreateClick}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          <span>Tạo mới Lead</span>
        </Button>
      </div>
    </div>
  )
}
