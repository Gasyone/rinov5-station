'use client'

import { Plus } from 'lucide-react'
import {
  ExpandableSearch,
  FilterIconButton,
} from '@/components/controls'
import { StatusTiles, type StatusTile } from '@/components/shared'
import { Button } from '@/components/ui/button'
import type { CampaignItem } from '@/mocks/campaigns'
import {
  CAMPAIGN_STATUS_TABS,
  type CampaignFilterState,
  type CampaignStatusTab,
} from './campaignsTypes'
import { countCampaignsByTab } from './campaignsHelpers'

interface CampaignsToolbarProps {
  campaigns: CampaignItem[]
  activeTab: CampaignStatusTab
  searchTerm: string
  filters: CampaignFilterState
  activeFilterCount: number
  onTabChange: (tab: CampaignStatusTab) => void
  onSearchChange: (value: string) => void
  onOpenFilters: () => void
  onCreateClick?: () => void
}

export function CampaignsToolbar({
  campaigns,
  activeTab,
  searchTerm,
  filters,
  activeFilterCount,
  onTabChange,
  onSearchChange,
  onOpenFilters,
  onCreateClick,
}: CampaignsToolbarProps) {
  const tiles: StatusTile<CampaignStatusTab>[] = CAMPAIGN_STATUS_TABS.map((tab) => ({
    id: tab.id,
    label: tab.label,
    count: countCampaignsByTab(campaigns, tab.id, {
      search: searchTerm,
      extra: filters,
    }),
    status: tab.status,
    semantic: tab.id === 'all' ? 'neutral' : undefined,
  }))

  return (
    <div className="flex shrink-0 flex-col gap-2 bg-background px-3 py-2.5 border-b border-border/40">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        {/* Status Tiles */}
        <StatusTiles
          tiles={tiles}
          activeId={activeTab}
          onSelect={(id) => onTabChange(activeTab === id && id !== 'all' ? 'all' : id)}
        />

        {/* Right Action & Search Controls */}
        <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto">
          <ExpandableSearch
            value={searchTerm}
            onValueChange={onSearchChange}
            label="Tìm kiếm chiến dịch"
            placeholder="Tìm theo tên chiến dịch, mã chiến dịch, mã KM..."
            inputClassName="sm:w-80"
          />

          <FilterIconButton count={activeFilterCount} onClick={onOpenFilters} />

          {onCreateClick && (
            <Button
              type="button"
              onClick={onCreateClick}
              className="h-8 gap-1.5 bg-primary text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm chiến dịch</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
