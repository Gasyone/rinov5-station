'use client'

import React from 'react'
import { Plus, RotateCw, ListFilter } from 'lucide-react'
import {
  FilterIconButton,
  IconActionButton,
  ExpandableSearch,
  SegmentedControl,
  BranchSelect,
  ToolbarSelect,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import {
  BRANCH_OPTIONS,
  CATEGORY_SELECT_OPTIONS,
  STATUS_TILE_CONFIG,
  TYPE_SEGMENT_OPTIONS,
  type TicketStatusFilter,
} from './supportTicketsTypes'

export interface SupportTicketsToolbarProps {
  activeBranch: string
  activeCategory: string
  activeStatus: TicketStatusFilter
  activeType: string
  statusTileTotals: Record<string, number>
  searchTerm: string
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onCategoryChange: (category: string) => void
  onStatusChange: (status: TicketStatusFilter) => void
  onTypeChange: (type: string) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onResetFilters: () => void
  onCreate: () => void
}

export function SupportTicketsToolbar({
  activeBranch,
  activeCategory,
  activeStatus,
  activeType,
  statusTileTotals = {},
  searchTerm,
  activeFilterCount,
  onBranchChange,
  onCategoryChange,
  onStatusChange,
  onTypeChange,
  onSearchChange,
  onOpenFilters,
  onResetFilters,
  onCreate,
}: SupportTicketsToolbarProps) {
  const tiles: StatusTile<TicketStatusFilter>[] = STATUS_TILE_CONFIG.map((cfg) => ({
    id: cfg.id,
    label: cfg.label,
    count: statusTileTotals[cfg.id] ?? 0,
    semantic: cfg.semantic,
  }))

  return (
    <div className="flex shrink-0 flex-col gap-1 bg-background px-2.5 pt-1.5 pb-1 lg:px-3">
      {/* Row 1: Branch, Category, Search, Filter Icon, Refresh, Create Button */}
      <div className="flex flex-wrap items-center justify-between gap-1 sm:gap-1.5 min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
          {/* 1. Branch Selector */}
          <BranchSelect
            value={activeBranch}
            branches={BRANCH_OPTIONS}
            onValueChange={onBranchChange}
            allLabel="Tất cả cơ sở"
            placeholder="Chọn cơ sở"
            ariaLabel="Cơ sở"
            className="h-8 text-xs min-w-[125px] sm:min-w-[130px]"
          />

          <div className="h-3.5 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block shrink-0" />

          {/* 2. Category Selector */}
          <ToolbarSelect
            value={activeCategory}
            options={CATEGORY_SELECT_OPTIONS}
            onValueChange={onCategoryChange}
            className="h-8 text-xs min-w-[135px] sm:min-w-[150px]"
            ariaLabel="Lọc theo phân loại yêu cầu"
            placeholder="Phân loại yêu cầu"
          />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            placeholder="Tìm mã ticket, học viên, tiêu đề..."
            inputClassName="w-32 sm:w-36 lg:w-44 xl:w-52 2xl:w-60 text-xs h-8"
          />

          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />

          <IconActionButton
            icon={RotateCw}
            label="Làm mới bộ lọc"
            onClick={onResetFilters}
            className="h-8 w-8 text-muted-foreground hover:text-foreground border border-border/60 hover:border-border"
          />

          <Button
            size="sm"
            onClick={onCreate}
            className="h-8 px-2.5 font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tạo ticket mới</span>
          </Button>
        </div>
      </div>

      {/* Row 2: Status Tiles (Left) + Quick Type Segment (Right Edge) */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0 pt-0">
        {/* Bên trái: Status Tiles */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <StatusTiles
            tiles={tiles}
            activeId={activeStatus}
            onSelect={onStatusChange}
            compact={true}
            noOverflowCollapse={true}
            coloredCount={true}
            fontNormal={true}
          />
        </div>

        {/* Cạnh phải: Lọc nhanh theo Loại ticket */}
        <div className="flex items-center gap-1.5 select-none shrink-0 min-w-0">
          <span
            title="Lọc nhanh theo loại ticket"
            aria-label="Lọc nhanh theo loại ticket"
            className="inline-flex items-center text-muted-foreground shrink-0 mr-0.5 select-none"
          >
            <ListFilter className="h-3.5 w-3.5" />
          </span>
          <SegmentedControl
            options={TYPE_SEGMENT_OPTIONS}
            value={activeType}
            onValueChange={onTypeChange}
          />
        </div>
      </div>
    </div>
  )
}
