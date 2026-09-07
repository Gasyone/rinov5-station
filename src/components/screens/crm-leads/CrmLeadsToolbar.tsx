'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Lead } from '@/mocks/crmLeads'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  ToolbarSelect,
} from '@/components/controls'
import {
  SOURCE_OPTIONS,
  ASSIGNMENT_OPTIONS,
  FOLLOW_UP_OPTIONS,
} from './crmLeadsTypes'
import { CrmLeadsSmartcardPopover } from './CrmLeadsSmartcardPopover'

interface CrmLeadsToolbarProps {
  leads: Lead[]
  viewScope: 'my' | 'all'
  branch?: string
  onBranchChange?: (val: string) => void
  source: string
  onSourceChange: (val: string) => void
  assignment: string
  onAssignmentChange: (val: string) => void
  followUp: string
  onFollowUpChange: (val: string) => void
  search: string
  onSearchChange: (val: string) => void
  activeFilterCount?: number
  onOpenFilters?: () => void
  onCreateClick?: () => void
}

export function CrmLeadsToolbar({
  leads,
  viewScope,
  branch = 'all',
  onBranchChange,
  source,
  onSourceChange,
  assignment,
  onAssignmentChange,
  followUp,
  onFollowUpChange,
  search,
  onSearchChange,
  activeFilterCount = 0,
  onOpenFilters,
  onCreateClick,
}: CrmLeadsToolbarProps) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      {/* Bộ lọc bên trái: Cơ sở, Nguồn Lead & Bộ lọc ngữ cảnh theo màn hình */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Chọn cơ sở */}
        {onBranchChange && (
          <BranchSelect
            value={branch}
            onValueChange={onBranchChange}
            className="h-8 min-w-36 text-xs"
          />
        )}

        {/* Nguồn Lead */}
        <ToolbarSelect
          value={source}
          onValueChange={onSourceChange}
          options={SOURCE_OPTIONS}
          className="h-8 min-w-36 text-xs"
        />

        {/* Quản lý Lead (all) -> Hiện lọc Phân bổ */}
        {viewScope === 'all' && (
          <ToolbarSelect
            value={assignment}
            onValueChange={onAssignmentChange}
            options={ASSIGNMENT_OPTIONS}
            className="h-8 min-w-36 text-xs"
          />
        )}

        {/* Lead của tôi (my) -> Hiện lọc Lịch chăm sóc/Nhắc việc cho Sale */}
        {viewScope === 'my' && (
          <ToolbarSelect
            value={followUp}
            onValueChange={onFollowUpChange}
            options={FOLLOW_UP_OPTIONS}
            className="h-8 min-w-36 text-xs"
          />
        )}
      </div>

      {/* Tìm kiếm, Filter nâng cao, Nút tạo mới & Smartcard Popover đặt cạnh nhau bên phải */}
      <div className="flex flex-wrap items-center gap-2">
        <ExpandableSearch
          value={search}
          onValueChange={onSearchChange}
          placeholder="Tìm theo Phụ huynh, SĐT, Tên con..."
          inputClassName="sm:w-56"
        />

        {onOpenFilters && (
          <FilterIconButton
            count={activeFilterCount}
            onClick={onOpenFilters}
            label="Bộ lọc nâng cao"
          />
        )}

        <Button
          size="sm"
          className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 cursor-pointer text-xs"
          onClick={onCreateClick}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          <span>Tạo mới Lead</span>
        </Button>

        {/* Smartcard Popover hiển thị chỉ số phễu & hiệu suất đặt ở ngoài cùng bên phải */}
        <CrmLeadsSmartcardPopover leads={leads} viewScope={viewScope} />
      </div>
    </div>
  )
}

