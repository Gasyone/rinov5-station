import { ReceiptStatus, ReceiptType, PaymentMethod, TransactionType } from '@/mocks/paymentReceipts'

export type FilterStatus = 'all' | ReceiptStatus
export type FilterReceiptType = 'all' | ReceiptType
export type FilterPaymentMethod = 'all' | PaymentMethod
export type FilterTransactionType = 'all' | TransactionType
export type QuickConditionFilter = 'all' | 'reconciled' | 'fully_paid' | 'deposit'

export interface PaymentReceiptsFilterState {
  search: string
  branch: string
  status: FilterStatus
  transactionType: FilterTransactionType
  receiptType: FilterReceiptType
  paymentMethod: FilterPaymentMethod
  quickCondition: QuickConditionFilter
}

export const STATUS_TILES: { id: FilterStatus; label: string; countKey: string }[] = [
  { id: 'all', label: 'Tất cả phiếu', countKey: 'all' },
  { id: 'pending', label: 'Chờ thanh toán', countKey: 'pending' },
  { id: 'completed', label: 'Thành công', countKey: 'completed' },
  { id: 'cancelled', label: 'Đã hủy', countKey: 'cancelled' },
]

