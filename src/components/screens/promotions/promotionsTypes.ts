import type { PromotionDiscountType, PromotionItem, PromotionStatus, PromotionType } from '@/mocks/promotions'

export type PromotionStatusTab = 'all' | 'active' | 'public' | 'private' | 'inactive_or_expired'

export interface PromotionFilterState {
  types: PromotionType[]
  discountTypes: PromotionDiscountType[]
  branches: string[]
}

export interface PromotionStatusTabConfig {
  id: PromotionStatusTab
  label: string
  status?: string
}

export const PROMOTION_STATUS_TABS: PromotionStatusTabConfig[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Đang áp dụng', status: 'active' },
  { id: 'public', label: 'Mã chung', status: 'ma_chung' },
  { id: 'private', label: 'Mã riêng', status: 'ma_rieng' },
  { id: 'inactive_or_expired', label: 'Tạm dừng / Hết hạn', status: 'tam_dung' },
]

export const PROMOTION_TYPE_LABELS: Record<PromotionType, string> = {
  public: 'Mã chung',
  private: 'Mã riêng',
}

export const PROMOTION_DISCOUNT_TYPE_LABELS: Record<PromotionDiscountType, string> = {
  direct: 'Giảm tiền trực tiếp',
  percentage: 'Giảm theo %',
  buy_x_get_y: 'Mua X tặng Y',
}

export const PROMOTION_STATUS_LABELS: Record<PromotionStatus, string> = {
  active: 'Đang áp dụng',
  inactive: 'Tạm dừng',
  expired: 'Hết hạn',
}

export type { PromotionDiscountType, PromotionItem, PromotionStatus, PromotionType }
