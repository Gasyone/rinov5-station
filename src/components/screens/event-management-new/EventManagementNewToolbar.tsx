'use client'

import { 
  ExpandableSearch, 
  BranchSelect, 
  ToolbarSelect,
  FilterIconButton 
} from '@/components/controls'
import { Button } from '@/components/ui/button'
import { EventFilters } from './eventManagementNewTypes'
import { Plus } from 'lucide-react'

interface EventManagementNewToolbarProps {
  filters: EventFilters
  onFiltersChange: (filters: EventFilters) => void
  onAddEvent: () => void
  branchOptions: string[]
  onOpenAdvancedFilters: () => void
  activeFiltersCount: number
}

const TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả loại' },
  { value: 'seminar', label: 'Hội thảo' },
  { value: 'open_day', label: 'Ngày hội mở' },
  { value: 'trial', label: 'Trải nghiệm học thử' },
  { value: 'other', label: 'Khác' }
]

export function EventManagementNewToolbar({
  filters,
  onFiltersChange,
  onAddEvent,
  branchOptions,
  onOpenAdvancedFilters,
  activeFiltersCount
}: EventManagementNewToolbarProps) {

  const handleSearchChange = (val: string) => {
    onFiltersChange({ ...filters, search: val })
  }

  const handleBranchChange = (val: string) => {
    onFiltersChange({ ...filters, branch: val })
  }

  const handleTypeChange = (val: string) => {
    onFiltersChange({ ...filters, status: val })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between py-2 bg-transparent">
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row flex-1 items-center gap-2 w-full">
        {/* Expandable Search */}
        <ExpandableSearch
          value={filters.search}
          onValueChange={handleSearchChange}
          placeholder="Tìm tên, mã hoặc vị trí..."
          inputClassName="sm:w-64"
        />

        {/* Branch Select */}
        <BranchSelect
          value={filters.branch}
          branches={branchOptions}
          onValueChange={handleBranchChange}
          allValue="all"
          className="h-9 min-w-40 text-xs"
        />

        {/* Status Select inside toolbar */}
        <ToolbarSelect
          value={filters.status}
          options={TYPE_FILTER_OPTIONS}
          onValueChange={handleTypeChange}
          className="h-9 min-w-40 text-xs"
        />

        {/* Advanced Filter Sheet button */}
        <FilterIconButton
          count={activeFiltersCount}
          onClick={onOpenAdvancedFilters}
        />
      </div>

      {/* Primary Action Button */}
      <Button 
        size="sm" 
        className="w-full sm:w-auto gap-1.5 shadow-xs" 
        onClick={onAddEvent}
      >
        <Plus className="h-4 w-4" /> Tạo sự kiện
      </Button>

    </div>
  )
}
