import type {
  PromotionFilterState,
  PromotionItem,
  PromotionStatusTab,
} from './promotionsTypes'
import { formatCurrency } from '@/lib/format'

export interface FilterOptions {
  search?: string
  tab?: PromotionStatusTab
  extra?: PromotionFilterState
}

export function filterPromotions(
  items: PromotionItem[],
  options: FilterOptions = {}
): PromotionItem[] {
  const { search = '', tab = 'all', extra } = options
  const normalizedSearch = search.trim().toLowerCase()

  return items.filter((item) => {
    // 1. Search term (Code, Name, Description, Branch, Notes)
    if (normalizedSearch) {
      const matchCode = item.code.toLowerCase().includes(normalizedSearch)
      const matchName = item.name.toLowerCase().includes(normalizedSearch)
      const matchDesc = item.description.toLowerCase().includes(normalizedSearch)
      const matchBranch = item.branch.toLowerCase().includes(normalizedSearch)
      const matchNotes = item.notes?.toLowerCase().includes(normalizedSearch) ?? false
      const matchCreatedBy = item.createdBy.toLowerCase().includes(normalizedSearch)

      if (!matchCode && !matchName && !matchDesc && !matchBranch && !matchNotes && !matchCreatedBy) {
        return false
      }
    }

    // 2. Tab Filter
    if (tab === 'active' && item.status !== 'active') return false
    if (tab === 'public' && item.type !== 'public') return false
    if (tab === 'private' && item.type !== 'private') return false
    if (tab === 'inactive_or_expired' && item.status === 'active') return false

    // 3. Extra filters (Sheet panel)
    if (extra) {
      if (extra.types.length > 0 && !extra.types.includes(item.type)) {
        return false
      }
      if (
        extra.discountTypes.length > 0 &&
        !extra.discountTypes.includes(item.discountType)
      ) {
        return false
      }
      if (extra.branches.length > 0 && !extra.branches.includes(item.branch)) {
        return false
      }
    }

    return true
  })
}

export function countPromotionsByTab(
  items: PromotionItem[],
  tabId: PromotionStatusTab,
  options: { search?: string; extra?: PromotionFilterState } = {}
): number {
  return filterPromotions(items, {
    search: options.search,
    extra: options.extra,
    tab: tabId,
  }).length
}

export function formatDiscountDisplay(item: PromotionItem): string {
  if (item.discountType === 'percentage') {
    return `${item.discountValue}%`
  }
  if (item.discountType === 'direct') {
    return formatCurrency(item.discountValue)
  }
  return 'Tặng quà / Học bổng'
}

export function getUsageSummary(item: PromotionItem): {
  total: number
  used: number
  remaining: number
  percent: number
  label: string
} {
  const isPublic = item.type === 'public'
  const total = isPublic ? item.usageLimit ?? 0 : item.quantity ?? 0
  const used = item.usedCount
  const remaining = Math.max(0, total - used)
  const percent = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0
  const label = isPublic ? 'lượt' : 'mã'

  return { total, used, remaining, percent, label }
}
