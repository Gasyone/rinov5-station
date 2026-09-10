'use client'

import {
  Maximize2,
  Minimize2,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ExpandableSearch,
  ToolbarSelect,
} from '@/components/controls'
import {
  ORG_UNIT_TYPES,
  type OrgFilterState,
} from './orgStructureTypes'

interface OrgStructureToolbarProps {
  filters: OrgFilterState
  onFilterChange: (updates: Partial<OrgFilterState>) => void
  isAllExpanded: boolean
  onToggleExpandAll: () => void
  onCreateClick: () => void
}

export function OrgStructureToolbar({
  filters,
  onFilterChange,
  isAllExpanded,
  onToggleExpandAll,
  onCreateClick,
}: OrgStructureToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Type Filter & Expand/Collapse Toggle */}
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <ToolbarSelect
          value={filters.type}
          options={ORG_UNIT_TYPES}
          onValueChange={(val) => onFilterChange({ type: val })}
          ariaLabel="Loại hình đơn vị"
          className="w-[160px]"
        />

        {/* Single Expand / Collapse Toggle (1 mode at a time) */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleExpandAll}
          className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          title={isAllExpanded ? 'Thu gọn tất cả' : 'Mở rộng tất cả'}
        >
          {isAllExpanded ? (
            <>
              <Minimize2 className="h-3.5 w-3.5" />
              <span>Thu gọn</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Mở rộng</span>
            </>
          )}
        </Button>
      </div>

      {/* Primary Actions: Search next to Create New */}
      <div className="flex items-center gap-2">
        <ExpandableSearch
          value={filters.search}
          onValueChange={(val) => onFilterChange({ search: val })}
          placeholder="Tìm đơn vị, chức danh, người phụ trách..."
        />

        <Button
          type="button"
          onClick={onCreateClick}
          size="sm"
          className="h-9 gap-1.5 px-3 text-xs font-medium shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo đơn vị mới</span>
        </Button>
      </div>
    </div>
  )
}
