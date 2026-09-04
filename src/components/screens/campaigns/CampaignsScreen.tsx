'use client'

import { useMemo, useState } from 'react'
import {
  DataTableFrame,
  DataTablePagination,
  DEFAULT_PAGE_SIZE,
} from '@/components/data-table'
import {
  FilterGroupSheetPanel,
  createFilterGroup,
  type FilterGroupConfig,
} from '@/components/filters'
import {
  getInitialCampaigns,
} from '@/mocks/campaigns'
import type {
  CampaignApplyType,
  CampaignDiscountType,
  CampaignItem,
} from '@/mocks/campaigns'
import {
  filterCampaigns,
  getCampaignApplyTypes,
  getCampaignDiscountTypes,
} from './campaignsHelpers'
import {
  CAMPAIGN_APPLY_TYPE_LABELS,
  CAMPAIGN_DISCOUNT_TYPE_LABELS,
  type CampaignFilterState,
  type CampaignStatusTab,
} from './campaignsTypes'
import { CampaignsToolbar } from './CampaignsToolbar'
import { CampaignsTable } from './CampaignsTable'
import { CampaignDetailDialog } from './CampaignDetailDialog'
import { CampaignFormDialog } from './CampaignFormDialog'

export function CampaignsScreen() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(() => getInitialCampaigns())
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<CampaignStatusTab>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<CampaignFilterState>({
    applyTypes: [],
    campaignTypes: [],
    limitRules: [],
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  // Dialog states
  const [viewingCampaign, setViewingCampaign] = useState<CampaignItem | null>(null)
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const availableApplyTypes = useMemo(() => getCampaignApplyTypes(campaigns), [campaigns])
  const availableDiscountTypes = useMemo(() => getCampaignDiscountTypes(campaigns), [campaigns])

  const filtered = useMemo(
    () =>
      filterCampaigns(campaigns, {
        search: searchTerm,
        tab: activeTab,
        extra: filters,
      }),
    [campaigns, searchTerm, activeTab, filters]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const activeFilterCount =
    filters.applyTypes.length + filters.campaignTypes.length + filters.limitRules.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'applyTypes',
        title: 'Hình thức áp dụng',
        options: availableApplyTypes,
        selectedValues: filters.applyTypes,
        getOptionLabel: (t) => CAMPAIGN_APPLY_TYPE_LABELS[t as CampaignApplyType] ?? t,
        getOptionCount: (t) => campaigns.filter((c) => c.applyType === t).length,
      }),
      createFilterGroup({
        id: 'campaignTypes',
        title: 'Loại chiến dịch',
        options: availableDiscountTypes,
        selectedValues: filters.campaignTypes,
        getOptionLabel: (dt) => CAMPAIGN_DISCOUNT_TYPE_LABELS[dt as CampaignDiscountType] ?? dt,
        getOptionCount: (dt) => campaigns.filter((c) => c.campaignType === dt).length,
      }),
      createFilterGroup({
        id: 'limitRules',
        title: 'Quy tắc giới hạn đơn',
        options: ['dong_thoi', 'duy_nhat'],
        selectedValues: filters.limitRules,
        getOptionLabel: (r) => (r === 'dong_thoi' ? 'Áp dụng đồng thời' : 'Áp dụng duy nhất'),
        getOptionCount: (r) => campaigns.filter((c) => c.limitRule === r).length,
      }),
    ],
    [availableApplyTypes, availableDiscountTypes, campaigns, filters]
  )

  const toggleArray = <K extends keyof CampaignFilterState>(
    key: K,
    value: CampaignFilterState[K][number]
  ) => {
    setPage(1)
    setFilters((current) => {
      const arr = current[key] as string[]
      return {
        ...current,
        [key]: arr.includes(value as string)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      } as CampaignFilterState
    })
  }

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paged.map((c) => c.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleToggleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id))
    }
  }

  const handleSaveCampaign = (data: Partial<CampaignItem>) => {
    if (data.id) {
      // Update existing
      setCampaigns((prev) =>
        prev.map((c) => (c.id === data.id ? ({ ...c, ...data } as CampaignItem) : c))
      )
    } else {
      // Create new
      const newCamp: CampaignItem = {
        id: `camp-${Date.now()}`,
        code: data.code || `CP${Date.now()}`,
        name: data.name || 'Chiến dịch mới',
        description: data.description || '',
        status: data.status || 'hoat_dong',
        startDate: data.startDate || `${new Date().toISOString().slice(0, 10)} 00:00:00`,
        endDate: data.endDate || null,
        budget: data.budget || null,
        applyType: data.applyType || 'ma_rieng',
        promoCode: data.promoCode || 'PROMO',
        campaignType: data.campaignType || 'giam_truc_tiep',
        discountValue: data.discountValue || 0,
        maxUsagePerUser: data.maxUsagePerUser || 1,
        autoDisplay: Boolean(data.autoDisplay),
        limitRule: data.limitRule || 'dong_thoi',
        uniqueLimitGroup: data.uniqueLimitGroup,
        costAllocations: data.costAllocations || [{ id: 'c-1', source: 'STATION', percentage: 100 }],
        minOrderValue: data.minOrderValue || 0,
        applyScope: data.applyScope || 'sku',
        productForm: data.productForm || 'all',
        applicableSkus: data.applicableSkus || [],
        createdBy: 'Ban Quản trị (Admin)',
        createdAt: new Date().toISOString().slice(0, 10),
        usedCount: 0,
      }
      setCampaigns((prev) => [newCamp, ...prev])
    }
  }

  const handleDeactivate = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'ngung_hoat_dong' } : c))
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Toolbar với StatusTiles, Tìm kiếm & Nút Tạo mới */}
      <CampaignsToolbar
        campaigns={campaigns}
        activeTab={activeTab}
        searchTerm={searchTerm}
        filters={filters}
        activeFilterCount={activeFilterCount}
        onTabChange={(tab) => {
          setActiveTab(tab)
          setPage(1)
        }}
        onSearchChange={(v) => {
          setSearchTerm(v)
          setPage(1)
        }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      {/* Main Table container */}
      <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 lg:px-3 lg:pb-3">
        <DataTableFrame
          footer={
            <DataTablePagination
              page={currentPage}
              total={filtered.length}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          }
        >
          <CampaignsTable
            items={paged}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectRow={handleToggleSelectRow}
            onRowClick={(item) => setViewingCampaign(item)}
            onView={(item) => setViewingCampaign(item)}
            onEdit={(item) => setEditingCampaign(item)}
          />
        </DataTableFrame>
      </div>

      {/* Bộ lọc trượt (Filter Group Sheet Panel) */}
      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc chiến dịch"
        description="Lọc danh sách theo hình thức áp dụng, loại giảm giá và quy tắc kết hợp."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'applyTypes') toggleArray('applyTypes', value as CampaignApplyType)
          if (sectionId === 'campaignTypes')
            toggleArray('campaignTypes', value as CampaignDiscountType)
          if (sectionId === 'limitRules')
            toggleArray('limitRules', value as 'dong_thoi' | 'duy_nhat')
        }}
        onClearAll={() => {
          setFilters({ applyTypes: [], campaignTypes: [], limitRules: [] })
          setPage(1)
        }}
      />

      {/* Dialog xem chi tiết chiến dịch */}
      <CampaignDetailDialog
        open={Boolean(viewingCampaign)}
        campaign={viewingCampaign}
        onOpenChange={(open) => {
          if (!open) setViewingCampaign(null)
        }}
        onEdit={(camp) => {
          setViewingCampaign(null)
          setEditingCampaign(camp)
        }}
      />

      {/* Dialog Tạo mới / Chỉnh sửa chiến dịch */}
      <CampaignFormDialog
        open={isCreateOpen || Boolean(editingCampaign)}
        campaign={editingCampaign}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingCampaign(null)
          }
        }}
        onSubmit={handleSaveCampaign}
        onDeactivate={handleDeactivate}
      />
    </div>
  )
}
