import type { CampaignItem, CampaignFilterState, CampaignStatusTab, CampaignApplyType, CampaignDiscountType } from './campaignsTypes'

export function filterCampaigns(
  items: CampaignItem[],
  options: {
    search?: string
    tab: CampaignStatusTab
    extra?: CampaignFilterState
  }
): CampaignItem[] {
  const { search, tab, extra } = options

  return items.filter((item) => {
    // 1. Status Tab filter
    if (tab !== 'all') {
      if (item.status !== tab) return false
    }

    // 2. Search query filter (Tên chiến dịch, Mã chiến dịch, Mã khuyến mại)
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase()
      const matchName = item.name.toLowerCase().includes(q)
      const matchCode = item.code.toLowerCase().includes(q)
      const matchPromo = item.promoCode.toLowerCase().includes(q)
      const matchDesc = item.description.toLowerCase().includes(q)

      if (!matchName && !matchCode && !matchPromo && !matchDesc) {
        return false
      }
    }

    // 3. Extra filters
    if (extra) {
      if (extra.applyTypes.length > 0 && !extra.applyTypes.includes(item.applyType)) {
        return false
      }
      if (extra.campaignTypes.length > 0 && !extra.campaignTypes.includes(item.campaignType)) {
        return false
      }
      if (extra.limitRules.length > 0 && !extra.limitRules.includes(item.limitRule)) {
        return false
      }
    }

    return true
  })
}

export function countCampaignsByTab(
  items: CampaignItem[],
  tab: CampaignStatusTab,
  options?: {
    search?: string
    extra?: CampaignFilterState
  }
): number {
  return filterCampaigns(items, {
    tab,
    search: options?.search,
    extra: options?.extra,
  }).length
}

export function formatCampaignDiscount(item: CampaignItem): string {
  if (item.campaignType === 'giam_theo_phantram') {
    return `${item.discountValue}%`
  }
  return `${item.discountValue.toLocaleString('vi-VN')} ₫`
}

export function formatCampaignDateTime(dateStr: string | null): string {
  if (!dateStr || dateStr === '-') return '-'
  return dateStr
}

export function getCampaignApplyTypes(items: CampaignItem[]): CampaignApplyType[] {
  const set = new Set<CampaignApplyType>()
  items.forEach((item) => set.add(item.applyType))
  return Array.from(set)
}

export function getCampaignDiscountTypes(items: CampaignItem[]): CampaignDiscountType[] {
  const set = new Set<CampaignDiscountType>()
  items.forEach((item) => set.add(item.campaignType))
  return Array.from(set)
}
