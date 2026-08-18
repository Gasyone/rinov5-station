import { type Order } from '@/mocks/orders'

export interface SubAllocationItem {
  name: string
  convertedSessions?: number
  convertedAmount?: number
}

export interface RemainingConversionInfo {
  sessions?: number
  amount?: number
  missingAmount?: number
}

export interface TransactionAllocationGroup {
  groupName: string
  groupConvertedAmount?: number
  subItems?: SubAllocationItem[]
  remainingConversion?: RemainingConversionInfo
  showCompletePaymentLink?: boolean
}

export interface OrderPaymentTransaction {
  id: string
  code: string
  amount: number
  method: string
  timestamp: string
  status: 'completed' | 'pending' | 'cancelled'
  statusLabel?: string
  paymentType?: 'deposit' | 'final' | 'full'
  paymentTypeLabel?: string
  depositAmount?: number
  finalPaymentAmount?: number
  isLocked?: boolean
  saleBy?: string
  note?: string
  convertedSessions?: number
  convertedAmount?: number
  allocations?: TransactionAllocationGroup[]
  remainingConversion?: RemainingConversionInfo
  showCompletePaymentLink?: boolean
}

export interface DetailedOrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  isPaidConfirmed?: boolean
  studentName?: string
  categoryName?: string
  programName?: string
  teacherType?: string
  packageType?: string
  isRenewal?: boolean
  isCompleted?: boolean
  orderType?: string // e.g. "Mua mới", "Gia hạn", "--"
  durationText?: string // e.g. "46 buổi", "96 buổi", "12 tháng"
  expiryDate?: string // Deprecated, replaced by bonusText
  bonusText?: string // e.g. "Tặng thêm 2 buổi", "Tăng thêm 6 buổi", "--"
  giftText?: string // e.g. "1 x [IELTS] Khóa 5.0", "--"
}

export interface OrderFeeTransferSummary {
  ticketCode: string
  transferDate: string
  executorName: string
  // Old package info
  oldPackageName: string
  oldPathwayLevel?: string
  oldTotalSessions?: number
  oldMainSessions?: number
  oldCompletedTotalSessions?: number
  oldCompletedMainSessions?: number
  transferredSessionsCount: number
  // New package info
  newProgramName?: string // e.g. "Chương trình Toán tư duy Tutor-Việt Nam-1:6"
  newPackageName: string // e.g. "1. [Gia sư][TH] Toán Tư Duy 1:6 (1 buổi)"
  newPathwayLevel?: string
  transferType: string
  convertedSessionsLabel: string
  linkedOrderNo?: string
}

export interface DetailedOrder extends Order {
  paymentMethodTag?: string // e.g. "T5-Đã nhận bank", "T2-Hủy", "COD / T5-Đã nhận COD", "T3-COD"
  saleRep?: string // e.g. "Vũ Thị Lan 1"
  saleDate?: string // e.g. "25-07-2026"
  totalPaidAmount?: number
  detailedItems?: DetailedOrderItem[]
  payments?: OrderPaymentTransaction[]
  sourceOrderNo?: string
  sourcePackageName?: string
  linkedDraftOrderNo?: string
  isOtherChild?: boolean
  feeTransferSummary?: OrderFeeTransferSummary
  canCreateCompletionOrder?: boolean
  canConvertProduct?: boolean
  remainingSessions?: number
  isExpired?: boolean
}

export type TransferCategory = 'fee_transfer' | 'product_conversion'

export interface FeeTransferRecord {
  id: string
  transferDate: string // e.g. "17-06-2026"
  category?: TransferCategory // 'fee_transfer' | 'product_conversion'
  categoryLabel?: string // e.g. "Chuyển đổi sản phẩm" | "Chuyển phí"
  ticketCode: string // e.g. "CP00011223" or "03650"
  executorName: string // e.g. "Nguyễn Như Ngọc" or "Lê Đức Anh 4"
  oldPackage?: {
    studentName: string
    uid: string
    sid: string
    packageName: string
    pathwayLevel: string
    totalSessions: number
    mainSessions: number
    completedTotalSessions: number
    completedMainSessions: number
    transferredSessionsCount: number
  }
  newPackage?: {
    recipientStudentName: string
    uid: string
    sid: string
    packageName?: string
    pathwayLevel?: string
    transferType: string // e.g. "Chuyển phí - Ngang tiền" | "Chuyển phí - Thanh toán thêm"
    targetPackageName: string
    convertedSessionsLabel?: string // e.g. "2 BUỔI"
    linkedOrderNo?: string // e.g. "OD794023"
  }
  productConversion?: {
    remainingDepositText?: string // e.g. "Số tiền cọc còn lại chưa quy đổi: 0 đ"
    transferredProducts: Array<{
      name: string // e.g. "[IE_TUTOR] Ielts Foundation PLUS 4.0_36 buổi"
      sessions: number // e.g. 2
      amountText: string // e.g. "438.888 đ"
    }>
    originalOrderNo?: string // e.g. "OD798202"
    newPackage: {
      receiptCode: string // e.g. "PR0000000671"
      amountText: string // e.g. "438.888 đ"
      sessions?: number
    }
  }
}

export interface StudentOrdersTabProps {
  studentId: string
  studentName: string
}

// Re-export mock data helpers for backward compatibility
export { getFeeTransfers, getStudentOrders } from './mockData/studentOrdersMock'
