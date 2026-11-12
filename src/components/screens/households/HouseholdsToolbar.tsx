'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import type { Household } from '@/mocks/households'
import {
  HOUSEHOLD_TIER_TABS,
  type HouseholdTierFilter,
} from './householdsTypes'
import { countHouseholdsByTier } from './householdsHelpers'

interface HouseholdsToolbarProps {
  households: Household[]
  branches: string[]
  activeBranch: string
  activeTier: HouseholdTierFilter
  searchTerm: string
  activeFilterCount: number
  onBranchChange: (branch: string) => void
  onTierChange: (tier: HouseholdTierFilter) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreate: () => void
}

export function HouseholdsToolbar({
  households,
  branches,
  activeBranch,
  activeTier,
  searchTerm,
  activeFilterCount,
  onBranchChange,
  onTierChange,
  onSearchChange,
  onOpenFilters,
  onCreate,
}: HouseholdsToolbarProps) {
  const tiles: StatusTile<HouseholdTierFilter>[] = HOUSEHOLD_TIER_TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    count: countHouseholdsByTier(households, tab.id),
    semantic:
      tab.id === 'VIP'
        ? 'success'
        : tab.id === 'Gold'
        ? 'info'
        : tab.id === 'Standard'
        ? 'neutral'
        : 'neutral',
  }))

  return (
    <div className="flex shrink-0 items-center justify-between gap-3 bg-background px-3 py-2.5 border-b border-border/60">
      <div className="flex-1 overflow-x-auto min-w-0">
        <StatusTiles
          tiles={tiles}
          activeId={activeTier}
          compact={true}
          fontNormal={true}
          onSelect={(id) => onTierChange(activeTier === id && id !== 'all' ? 'all' : id)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <BranchSelect
          value={activeBranch}
          branches={branches}
          allLabel="Tất cả cơ sở"
          placeholder="Chọn cơ sở"
          ariaLabel="Cơ sở"
          onValueChange={onBranchChange}
          className="h-8 min-w-36 text-xs"
        />
        <ExpandableSearch
          value={searchTerm}
          onValueChange={onSearchChange}
          label="Tìm hộ gia đình"
          placeholder="Tìm mã FAM, tên bố mẹ, con, SĐT..."
          inputClassName="sm:w-64 text-xs h-8"
        />
        <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />
        <Button size="sm" onClick={onCreate} className="h-8 gap-1 px-2.5 text-xs font-medium cursor-pointer">
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm gia đình</span>
        </Button>
      </div>
    </div>
  )
}
