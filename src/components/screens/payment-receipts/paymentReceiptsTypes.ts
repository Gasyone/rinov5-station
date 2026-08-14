import { ReceiptStatus, ReceiptType, PaymentMethod } from '@/mocks/paymentReceipts'

export type FilterStatus = 'all' | ReceiptStatus
export type FilterReceiptType = 'all' | ReceiptType
export type FilterPaymentMethod = 'all' | PaymentMethod

export interface PaymentReceiptsFilterState {
  search: string
  branch: string
  status: FilterStatus
  receiptType: FilterReceiptType
  paymentMethod: FilterPaymentMethod
}

export const STATUS_TILES: { id: FilterStatus; label: string; countKey: string }[] = [
  { id: 'all', label: 'Tất cả phiếu thu', countKey: 'all' },
  { id: 'completed', label: 'Đã thu tiền', countKey: 'completed' },
  { id: 'pending_verification', label: 'Chờ đối soát', countKey: 'pending_verification' },
  { id: 'refunded', label: 'Đã hoàn tiền', countKey: 'refunded' },
  { id: 'cancelled', label: 'Đã hủy phiếu', countKey: 'cancelled' },
]
