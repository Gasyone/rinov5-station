'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExpandableSearch, ToolbarSelect } from '@/components/controls'
import { BRANCH_REGIONS, BRANCH_TYPES, type BranchFilterState } from './branchesTypes'

interface BranchesToolbarProps {
  filters: BranchFilterState
  onFilterChange: (updates: Partial<BranchFilterState>) => void
  onCreateClick: () => void
}

export function BranchesToolbar({
  filters,
  onFilterChange,
  onCreateClick,
}: BranchesToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5">
      {/* Filters row on the left */}
      <div className="flex flex-wrap items-center gap-2">
        <ToolbarSelect
          value={filters.region}
          options={BRANCH_REGIONS}
          onValueChange={(val) => onFilterChange({ region: val })}
          ariaLabel="Khu vực"
          className="h-8 w-[170px] text-xs"
        />

        <ToolbarSelect
          value={filters.type}
          options={BRANCH_TYPES}
          onValueChange={(val) => onFilterChange({ type: val })}
          ariaLabel="Loại hình cơ sở"
          className="h-8 w-[160px] text-xs"
        />
      </div>

      {/* Action buttons on the right: Search icon + Thêm mới */}
      <div className="flex shrink-0 items-center gap-2">
        <ExpandableSearch
          value={filters.search}
          onValueChange={(val) => onFilterChange({ search: val })}
          label="Tìm kiếm cơ sở"
          placeholder="Tìm theo tên, mã, địa chỉ, quản lý..."
          inputClassName="sm:w-64"
        />

        <Button
          type="button"
          onClick={onCreateClick}
          size="sm"
          className="h-8 gap-1.5 px-3 text-xs font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm cơ sở mới</span>
        </Button>
      </div>
    </div>
  )
}
