import type {
  CampaignApplyType,
  CampaignDiscountType,
  CampaignItem,
  CampaignProductForm,
  CampaignSkuItem,
  CampaignStatus,
  CostAllocation,
} from '@/mocks/campaigns'

export type CampaignStatusTab = 'all' | 'hoat_dong' | 'ket_thuc' | 'ngung_hoat_dong'

export interface CampaignFilterState {
  applyTypes: CampaignApplyType[]
  campaignTypes: CampaignDiscountType[]
  limitRules: ('dong_thoi' | 'duy_nhat')[]
}

export interface CampaignStatusTabConfig {
  id: CampaignStatusTab
  label: string
  status?: string
}

export const CAMPAIGN_STATUS_TABS: CampaignStatusTabConfig[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'hoat_dong', label: 'Hoạt động', status: 'hoat_dong' },
  { id: 'ket_thuc', label: 'Kết thúc', status: 'ket_thuc' },
  { id: 'ngung_hoat_dong', label: 'Ngừng hoạt động', status: 'ngung_hoat_dong' },
]

export const CAMPAIGN_STATUS_LABELS: Record<CampaignStatus, string> = {
  hoat_dong: 'Hoạt động',
  ket_thuc: 'Kết thúc',
  ngung_hoat_dong: 'Ngừng hoạt động',
}

export const CAMPAIGN_APPLY_TYPE_LABELS: Record<CampaignApplyType, string> = {
  ma_rieng: 'Mã riêng',
  ma_chung: 'Mã chung',
  khong_can_ma: 'Không cần mã',
}

export const CAMPAIGN_DISCOUNT_TYPE_LABELS: Record<CampaignDiscountType, string> = {
  giam_truc_tiep: 'Giảm giá trực tiếp',
  giam_theo_phantram: 'Giảm giá theo %',
}

export const CAMPAIGN_PRODUCT_FORM_LABELS: Record<CampaignProductForm, string> = {
  all: 'MUA MỚI VÀ GIA HẠN',
  new_only: 'CHỈ MUA MỚI',
  renewal_only: 'CHỈ GIA HẠN',
}

export type {
  CampaignApplyType,
  CampaignDiscountType,
  CampaignItem,
  CampaignProductForm,
  CampaignSkuItem,
  CampaignStatus,
  CostAllocation,
}
