import type { Order } from '@/mocks/orders'

export type OrderStatusFilter = 'all' | Order['status']
export type PackageTypeFilter = 'all' | 'combo' | 'tutor' | 'single_course' | 'book_service'
export type PaymentConditionFilter = 'all' | 'deposit' | 'partial' | 'one_time' | 'receivable' | 'refunded'
export type TimeRangeFilter = 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'custom' | 'all'

export interface PackageTypeOption {
  value: PackageTypeFilter
  label: string
}

export interface PaymentConditionOption {
  value: PaymentConditionFilter
  label: string
}

export const PAYMENT_CONDITION_OPTIONS: PaymentConditionOption[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'deposit', label: 'Cọc' },
  { value: 'partial', label: '1 phần' },
  { value: 'one_time', label: '1 lần' },
  { value: 'receivable', label: 'Cần thu' },
  { value: 'refunded', label: 'Hoàn tiền' },
]

export interface TimeRangeOption {
  value: TimeRangeFilter
  label: string
}

export const PACKAGE_TYPE_OPTIONS: PackageTypeOption[] = [
  { value: 'all', label: 'Tất cả loại gói' },
  { value: 'combo', label: 'Gói combo' },
  { value: 'tutor', label: 'Gói gia sư' },
  { value: 'single_course', label: 'Khóa học lẻ' },
  { value: 'book_service', label: 'Giáo trình & Khác' },
]

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: 'this_month', label: 'Tháng này (T08/2026)' },
  { value: 'last_month', label: 'Tháng trước (T07/2026)' },
  { value: 'this_quarter', label: 'Quý này (Q3/2026)' },
  { value: 'this_year', label: 'Năm nay (2026)' },
  { value: 'custom', label: 'Tùy chọn khoảng ngày...' },
  { value: 'all', label: 'Tất cả thời gian' },
]

export type OrderAmountRange = 'all' | 'under_5m' | '5m_to_10m' | '10m_to_20m' | 'above_20m'
export type OrderNatureFilter = 'all' | 'new_student' | 'renewal'
export type FulfillmentTypeFilter = 'all' | 'service' | 'physical'

export const ORDER_AMOUNT_RANGE_OPTIONS: { value: OrderAmountRange; label: string }[] = [
  { value: 'all', label: 'Tất cả mức tiền' },
  { value: 'under_5m', label: 'Dưới 5 triệu' },
  { value: '5m_to_10m', label: '5 triệu - 10 triệu' },
  { value: '10m_to_20m', label: '10 triệu - 20 triệu' },
  { value: 'above_20m', label: 'Trên 20 triệu' },
]

export const ORDER_NATURE_OPTIONS: { value: OrderNatureFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả đơn hàng' },
  { value: 'new_student', label: 'Đơn tuyển sinh mới' },
  { value: 'renewal', label: 'Đơn tái phí / Gia hạn' },
]

export const FULFILLMENT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'service', label: 'Dịch vụ đào tạo (Buổi học)' },
  { value: 'physical', label: 'Hàng hóa vật lý (Sách / Giáo trình)' },
]

export interface OrderMetrics {
  total: number
  revenue: number
  outstanding: number
  completed: number
  collectionRate: number
  paidCount: number
  partialCount: number
  unpaidCount: number
}

export interface OrderFilterState {
  branches: string[]
  paymentMethods: Array<Order['paymentMethod']>
  paymentStatuses: Array<Order['paymentStatus']>
  orderStatuses: Array<Order['status']>
  packageCategories?: string[]
  salesStaff?: string[]
  fulfillmentStatuses?: string[]
  timeRange?: TimeRangeFilter
  customStartDate?: string
  customEndDate?: string
  amountRange?: OrderAmountRange
  orderNature?: OrderNatureFilter
  fulfillmentTypes?: string[]
}

export const ORDER_STATUS_TABS: Array<{
  id: OrderStatusFilter
  label: string
  status?: Order['status']
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending', label: 'Đã lên đơn', status: 'pending' },
  { id: 'cancelled', label: 'Đã hủy', status: 'cancelled' },
  { id: 'completed', label: 'Đã thành công', status: 'completed' },
]

export const PAYMENT_METHOD_LABELS: Record<Order['paymentMethod'], string> = {
  cash: 'Tiền mặt',
  bank_transfer: 'Chuyển khoản NH',
  credit_card: 'Cà thẻ tín dụng',
  momo: 'Ví MoMo',
}

export const PAYMENT_STATUS_LABELS: Record<Order['paymentStatus'], string> = {
  paid: 'Đã thu đủ',
  unpaid: 'Chưa thu tiền',
  partial: 'Thu 1 phần',
}

export interface NormalizedPaymentItem {
  id: string
  code: string
  sequenceNo: number
  amount: number
  paymentMethod: string
  bankAccount?: string
  paidAt: string
  status: string
  reconciliationStatus: 'reconciled' | 'pending' | 'cancelled'
  reconciliationLabel: string
  paymentType: string
  createdBy: string
  note?: string
}

export interface OrderSessionConversion {
  totalSessions: number
  convertedSessions: number
  remainingSessions: number
  isApplicable: boolean
}

