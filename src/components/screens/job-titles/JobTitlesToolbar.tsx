'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusTiles, StatusTile } from '@/components/shared'
import { ToolbarSelect, ExpandableSearch } from '@/components/controls'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  JobTitlesFilterState,
  JOB_TITLE_DEPARTMENTS,
  CAPACITY_FILTER_OPTIONS,
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
  return (
    <div className="flex flex-col gap-2 py-0.5 shrink-0">
      {/* ROW 1: SELECTS ON LEFT, SEARCH & ACTION ON RIGHT */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Lọc theo Khối / Phòng ban */}
          <ToolbarSelect
            value={filters.department || 'all'}
            options={JOB_TITLE_DEPARTMENTS}
            onValueChange={(val) => onFilterChange({ ...filters, department: val })}
            className="h-8 text-xs min-w-[160px]"
          />

          <div className="h-4 w-px bg-border hidden sm:block shrink-0" />

          {/* Lọc theo Tình trạng định mức */}
          <ToolbarSelect
            value={filters.capacity || 'all'}
            options={CAPACITY_FILTER_OPTIONS}
            onValueChange={(val) =>
              onFilterChange({
                ...filters,
                capacity: val as 'all' | 'filled' | 'under_capacity',
              })
            }
            className="h-8 text-xs min-w-[140px]"
          />
        </div>

        {/* SEARCH & CREATE BUTTON */}
        <div className="flex items-center gap-2 shrink-0">
          <ExpandableSearch
            value={filters.search}
            onValueChange={(val) => onFilterChange({ ...filters, search: val })}
            placeholder="Tìm theo Mã hoặc Tên chức danh..."
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

      {/* ROW 2: STATUS TILES & STATUS RADIO */}
      <div className="flex items-center justify-between gap-3 flex-wrap py-0.5">
        <StatusTiles
          tiles={statusTiles}
          activeId={activeTileId}
          onSelect={onTileSelect}
          className="py-0 flex-1 min-w-0"
        />

        <div className="flex items-center gap-3 text-xs shrink-0 pl-3 border-l border-border py-0.5">
          <span className="text-muted-foreground font-medium text-xs hidden sm:inline">
            Trạng thái:
          </span>
          <RadioGroup
            value={filters.status}
            onValueChange={(val) =>
              onFilterChange({
                ...filters,
                status: val as 'all' | 'active' | 'inactive',
              })
            }
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value="all" id="status-jt-all" className="cursor-pointer" />
              <label
                htmlFor="status-jt-all"
                className="text-xs font-medium text-foreground cursor-pointer select-none"
              >
                Tất cả
              </label>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value="active" id="status-jt-active" className="cursor-pointer" />
              <label
                htmlFor="status-jt-active"
                className="text-xs font-medium text-foreground cursor-pointer select-none"
              >
                Áp dụng
              </label>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <RadioGroupItem value="inactive" id="status-jt-inactive" className="cursor-pointer" />
              <label
                htmlFor="status-jt-inactive"
                className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
              >
                Tạm ngưng
              </label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
