'use client'

import { Plus, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { ToolbarSelect, ExpandableSearch, IconActionButton } from '@/components/controls'
import type { SupportTicketFilterState, TicketStatusFilter } from './supportTicketsTypes'
import { CATEGORY_LABELS, PRIORITY_LABELS, TYPE_LABELS } from './supportTicketsTypes'

interface SupportTicketsToolbarProps {
  filters: SupportTicketFilterState
  statusTiles: Array<{ id: TicketStatusFilter; label: string; count: number }>
  onFilterChange: <K extends keyof SupportTicketFilterState>(key: K, value: SupportTicketFilterState[K]) => void
  onResetFilters: () => void
  onCreateTicket: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Tất cả phân loại' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
]

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'Tất cả mức ưu tiên' },
  ...Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label })),
]

const TYPE_OPTIONS = [
  { value: 'all', label: 'Tất cả loại ticket' },
  ...Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label })),
]

export function SupportTicketsToolbar({
  filters,
  statusTiles,
  onFilterChange,
  onResetFilters,
  onCreateTicket,
}: SupportTicketsToolbarProps) {
  const tiles: StatusTile<TicketStatusFilter>[] = statusTiles.map((tile) => ({
    id: tile.id,
    label: tile.label,
    count: tile.count,
    status: tile.id === 'all' ? undefined : tile.id,
  }))

  return (
    <div className="flex flex-col gap-3">
      {/* Top action row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
          <ExpandableSearch
            placeholder="Tìm theo mã, học viên, tiêu đề, nội dung..."
            value={filters.search}
            onValueChange={(val: string) => onFilterChange('search', val)}
            className="w-full sm:w-64"
          />

          <ToolbarSelect
            value={filters.type}
            onValueChange={(val) => onFilterChange('type', val)}
            options={TYPE_OPTIONS}
            ariaLabel="Lọc theo loại ticket"
            className="w-[160px]"
          />

          <ToolbarSelect
            value={filters.category}
            onValueChange={(val) => onFilterChange('category', val)}
            options={CATEGORY_OPTIONS}
            ariaLabel="Lọc theo phân loại"
            className="w-[170px]"
          />

          <ToolbarSelect
            value={filters.priority}
            onValueChange={(val) => onFilterChange('priority', val)}
            options={PRIORITY_OPTIONS}
            ariaLabel="Lọc theo độ ưu tiên"
            className="w-[160px]"
          />

          <IconActionButton
            icon={RotateCw}
            label="Làm mới bộ lọc"
            onClick={onResetFilters}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onCreateTicket}
            className="h-8 gap-1.5 px-3 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Tạo Ticket mới
          </Button>
        </div>
      </div>

      {/* Status tiles bar */}
      <StatusTiles
        tiles={tiles}
        activeId={filters.status}
        onSelect={(id) => onFilterChange('status', id)}
        compact
      />
    </div>
  )
}
