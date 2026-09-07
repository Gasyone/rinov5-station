import type {
  DeliveryMethod,
  FulfillmentProductCategory,
  FulfillmentStatus,
  OrderFulfillmentRecord,
} from '@/mocks/orderFulfillments'
import type { StatusSemantic } from '@/lib/statusColors'
export type { OrderFulfillmentRecord }

export type FilterStatus = 'all' | FulfillmentStatus
export type FilterDeliveryMethod = 'all' | DeliveryMethod

export type QuickFilterId = 'all' | 'pickup' | 'shipping' | 'missing_pod' | 'today'

export interface QuickFilterDef {
  id: QuickFilterId
  label: string
  semantic: StatusSemantic
}

export const FULFILLMENT_QUICK_FILTERS: QuickFilterDef[] = [
  { id: 'pickup', label: 'Tại quầy', semantic: 'success' },
  { id: 'shipping', label: 'Giao ship', semantic: 'info' },
  { id: 'missing_pod', label: 'Thiếu POD', semantic: 'warning' },
  { id: 'today', label: 'Hôm nay', semantic: 'purple' },
]

export interface OrderFulfillmentFilterState {
  search: string
  branch: string
  status: FilterStatus
  deliveryMethod: FilterDeliveryMethod
  quickFilter: QuickFilterId
}

export interface AdvancedFulfillmentFilterState {
  branches: string[]
  statuses: FulfillmentStatus[]
  deliveryMethods: DeliveryMethod[]
  carriers: string[]
  categories: FulfillmentProductCategory[]
}

export interface FulfillmentStatusTileConfig {
  key: FilterStatus
  label: string
  countKey: 'total' | 'pending_handover' | 'shipping' | 'handed_over' | 'returned'
  dotColor: string
}

export const FULFILLMENT_STATUS_TILES: FulfillmentStatusTileConfig[] = [
  { key: 'all', label: 'Tất cả', countKey: 'total', dotColor: 'bg-zinc-500' },
  { key: 'pending_handover', label: 'Chờ bàn giao', countKey: 'pending_handover', dotColor: 'bg-amber-500' },
  { key: 'shipping', label: 'Đang giao', countKey: 'shipping', dotColor: 'bg-sky-500' },
  { key: 'handed_over', label: 'Đã bàn giao', countKey: 'handed_over', dotColor: 'bg-emerald-500' },
  { key: 'returned', label: 'Trả lại', countKey: 'returned', dotColor: 'bg-rose-500' },
]

export type TimeRangeFilter = 'today' | 'last_7_days' | 'this_month' | 'custom'

export const TIME_RANGE_OPTIONS: { value: TimeRangeFilter; label: string }[] = [
  { value: 'this_month', label: 'Tháng này (T08/2026)' },
  { value: 'last_7_days', label: '7 ngày qua' },
  { value: 'today', label: 'Hôm nay (30/08)' },
  { value: 'custom', label: 'Tùy chọn khoảng ngày' },
]

export interface FulfillmentMetrics {
  total: number
  handedOverCount: number
  handoverRate: number
  shippingCount: number
  shippingRate: number
  pendingCount: number
  pendingRate: number
  returnedCount: number
  slaRate: number
  under24hCount: number
  between24And48hCount: number
  overdueCount: number
}

