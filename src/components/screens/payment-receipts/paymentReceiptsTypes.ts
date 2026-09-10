import { ReceiptStatus, ReceiptType, PaymentMethod, TransactionType } from '@/mocks/paymentReceipts'

export type FilterStatus = 'all' | ReceiptStatus
export type FilterReceiptType = 'all' | ReceiptType
export type FilterPaymentMethod = 'all' | PaymentMethod
export type FilterTransactionType = 'all' | TransactionType
export type QuickConditionFilter = 'all' | 'cash' | 'transfer' | 'deposit' | 'refund' | 'debt'

export type FilterDebtStatus = 'all' | 'has_debt' | 'settled'
export type FilterAmountRange = 'all' | 'under_1m' | '1m_to_5m' | '5m_to_20m' | 'over_20m'
export type ReceiptTimeRangeFilter =
  | 'all'
  | 'this_month'
  | 'last_month'
  | 'this_week'
  | 'today'
  | 'custom'
  | '7days'
  | '30days'
  | 'this_quarter'

export interface PaymentReceiptsFilterState {
  search: string
  branch: string
  status: FilterStatus
  transactionType: FilterTransactionType
  receiptType: FilterReceiptType
  receiptTypes?: ReceiptType[]
  paymentMethod: FilterPaymentMethod
  paymentMethods?: PaymentMethod[]
  quickCondition: QuickConditionFilter
  timeRange: ReceiptTimeRangeFilter
  customStartDate?: string
  customEndDate?: string
  createdBy: string
  createdBys?: string[]
  bankAccount: string
  bankAccounts?: string[]
  debtStatus: FilterDebtStatus
  amountRange: FilterAmountRange
}

export type ReceiptSortField = 'createdAt' | 'amount'
export type ReceiptSortDirection = 'asc' | 'desc'

export const STATUS_TILES: { id: FilterStatus; label: string; countKey: string }[] = [
  { id: 'all', label: 'Tất cả phiếu', countKey: 'all' },
  { id: 'pending', label: 'Chờ xử lý', countKey: 'pending' },
  { id: 'completed', label: 'Thành công', countKey: 'completed' },
  { id: 'cancelled', label: 'Đã hủy', countKey: 'cancelled' },
]

export interface ReceiptMetrics {
  total: number
  totalReceipts: number
  totalVouchers: number
  netCash: number
  receiptCount: number
  voucherCount: number
  completedCount: number
  pendingCount: number
  cancelledCount: number
  successRate: number
  qrCount: number
  cashCount: number
  posCount: number
  bankTransferCount: number
}

export const RECEIPT_TIME_RANGE_OPTIONS: { value: ReceiptTimeRangeFilter; label: string }[] = [
  { value: 'this_month', label: 'Tháng này (T08/2026)' },
  { value: 'last_month', label: 'Tháng trước (T07/2026)' },
  { value: 'this_quarter', label: 'Quý này (Q3/2026)' },
  { value: '7days', label: '7 ngày qua' },
  { value: 'all', label: 'Tất cả thời gian' },
  { value: 'custom', label: 'Tùy chọn khoảng ngày...' },
]

export const RECEIPT_DATE_PRESETS = [
  { id: 'all', label: 'Tất cả' },
  { id: '7days', label: '7 ngày qua', startDate: '2026-08-19', endDate: '2026-08-25' },
  { id: '30days', label: '30 ngày qua', startDate: '2026-07-27', endDate: '2026-08-25' },
  { id: 'this_month', label: 'Tháng 8/2026', startDate: '2026-08-01', endDate: '2026-08-31' },
  { id: 'last_month', label: 'Tháng trước (T07)', startDate: '2026-07-01', endDate: '2026-07-31' },
  { id: 'this_quarter', label: 'Quý này (Q3/2026)', startDate: '2026-07-01', endDate: '2026-09-30' },
]

export const DEBT_STATUS_OPTIONS: { value: FilterDebtStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả công nợ' },
  { value: 'has_debt', label: 'Đơn còn nợ (cần thu tiếp)' },
  { value: 'settled', label: 'Đơn đã thu đủ 100%' },
]

export const AMOUNT_RANGE_OPTIONS: { value: FilterAmountRange; label: string }[] = [
  { value: 'all', label: 'Tất cả số tiền' },
  { value: 'under_1m', label: 'Dưới 1 triệu' },
  { value: '1m_to_5m', label: 'Từ 1 - 5 triệu' },
  { value: '5m_to_20m', label: 'Từ 5 - 20 triệu' },
  { value: 'over_20m', label: 'Trên 20 triệu' },
]

