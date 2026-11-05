'use client'

import React from 'react'
import { LayoutGrid, List } from 'lucide-react'
import {
  SegmentedControl,
  InlineSelect,
} from '@/components/controls'
import type {
  DailyCheckShift,
  DailyCheckStatus,
} from '@/mocks/dailyCheck'
import type {
  DailyCheckFilterState,
  DailyViewMode,
  DailyTileId,
  DailySummaryStats,
} from './dailyCheckTypes'
import { DailyCheckStatusTiles } from './DailyCheckStatusTiles'

export interface DailyCheckToolbarProps {
  filters: DailyCheckFilterState
  onFilterChange: (filters: DailyCheckFilterState) => void
  onOpenSubmitDialog?: () => void
  onOpenCatalogDialog?: () => void
  activeTile: DailyTileId
  onSelectTile: (tileId: DailyTileId) => void
  stats: DailySummaryStats
}

const VIEW_MODE_OPTIONS: { value: DailyViewMode; label: React.ReactNode }[] = [
  {
    value: 'matrix_week',
    label: (
      <span className="flex items-center gap-1.5">
        <LayoutGrid className="h-3.5 w-3.5" />
        <span>Ma trận Tuần</span>
      </span>
    ),
  },
  {
    value: 'table',
    label: (
      <span className="flex items-center gap-1.5">
        <List className="h-3.5 w-3.5" />
        <span>Dạng Bảng</span>
      </span>
    ),
  },
]

const SHIFT_OPTIONS = [
  { value: 'all', label: 'Tất cả ca' },
  { value: 'dau_ca', label: 'Đầu ca (Sáng)' },
  { value: 'cuoi_ca', label: 'Cuối ca (Tối)' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'on_time', label: 'Đúng hạn' },
  { value: 'late', label: 'Nộp muộn' },
  { value: 'missing', label: 'Chưa nộp' },
]

export function DailyCheckToolbar({
  filters,
  onFilterChange,
  activeTile,
  onSelectTile,
  stats,
}: DailyCheckToolbarProps) {
  return (
    <div className="flex flex-col gap-2 text-left">
      {/* ─── HÀNG DUY NHẤT: Tab lọc trạng thái (cạnh trái) + Kiểu view & Tìm kiếm (cạnh phải) ─── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Cạnh trái: Tab lọc trạng thái */}
        <div className="flex items-center gap-2 flex-wrap">
          <DailyCheckStatusTiles
            stats={stats}
            activeTile={activeTile}
            onSelectTile={onSelectTile}
          />

          {filters.viewMode === 'table' && (
            <div className="flex items-center gap-1.5 ml-1">
              <div className="w-[130px]">
                <InlineSelect
                  value={filters.shift}
                  options={SHIFT_OPTIONS}
                  onValueChange={(v) => onFilterChange({ ...filters, shift: v as 'all' | DailyCheckShift })}
                  ariaLabel="Chọn ca"
                  className="h-8 text-xs"
                />
              </div>

              <div className="w-[140px]">
                <InlineSelect
                  value={filters.status}
                  options={STATUS_OPTIONS}
                  onValueChange={(v) => onFilterChange({ ...filters, status: v as 'all' | DailyCheckStatus })}
                  ariaLabel="Chọn trạng thái"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Cạnh phải: Kiểu view cùng hàng với tab lọc */}
        <div className="flex items-center gap-2">
          <SegmentedControl
            value={filters.viewMode}
            options={VIEW_MODE_OPTIONS}
            onValueChange={(val: DailyViewMode) => onFilterChange({ ...filters, viewMode: val })}
          />
        </div>
      </div>
    </div>
  )
}
