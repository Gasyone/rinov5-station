'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusTiles, StatusTile } from '@/components/shared'
import { ToolbarSelect, ExpandableSearch } from '@/components/controls'
import {
  JobTitlesFilterState,
  getJobTitleDepartmentFilterOptions,
} from './jobTitlesTypes'

interface JobTitlesToolbarProps {
  filters: JobTitlesFilterState
  onFilterChange: (filters: JobTitlesFilterState) => void
  statusTiles: StatusTile<string>[]
  activeTileId: string
  onTileSelect: (tileId: string) => void
  onOpenCreateDialog: () => void
}

export const JobTitlesToolbar: React.FC<JobTitlesToolbarProps> = ({
  filters,
  onFilterChange,
  statusTiles,
  activeTileId,
  onTileSelect,
  onOpenCreateDialog,
}) => {
  const departmentOptions = React.useMemo(() => getJobTitleDepartmentFilterOptions(), [])

  return (
    <div className="flex flex-col gap-2 py-0.5 shrink-0">
      {/* ROW 1: SELECT ON LEFT, SEARCH & ACTION ON RIGHT */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Lọc theo Khối / Phòng ban */}
          <ToolbarSelect
            value={filters.department || 'all'}
            options={departmentOptions}
            onValueChange={(val) => onFilterChange({ ...filters, department: val })}
            className="h-8 text-xs min-w-[170px]"
          />
        </div>

        {/* SEARCH & CREATE BUTTON */}
        <div className="flex items-center gap-2 shrink-0">
          <ExpandableSearch
            value={filters.search}
            onValueChange={(val) => onFilterChange({ ...filters, search: val })}
            placeholder="Tìm theo Tên hoặc Mã chức danh..."
          />

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onOpenCreateDialog}
            className="h-8 text-xs font-medium gap-1.5 cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Thêm chức danh</span>
          </Button>
        </div>
      </div>

      {/* ROW 2: STATUS TILES */}
      <div className="flex items-center justify-between gap-3 flex-wrap py-0.5">
        <StatusTiles
          tiles={statusTiles}
          activeId={activeTileId}
          onSelect={onTileSelect}
          className="py-0 flex-1 min-w-0"
        />
      </div>
    </div>
  )
}
