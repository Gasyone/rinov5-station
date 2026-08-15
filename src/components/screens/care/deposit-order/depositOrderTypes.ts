export type DepositOrderMode = 'deposit' | 'completion'

export type DepositType = 'pre_deposit' | 'study_now' // Đặt cọc trước tiền | Đặt cọc học luôn

export interface DepositProductItem {
  id: string
  orderType: 'Mua mới' | 'Gia hạn'
  program: string
  teacherType: 'Việt Nam' | 'Bản ngữ' | 'Philippines'
  packageType: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  studentName: string
}

export interface DepositCustomerInfo {
  recipientName: string
  phone: string
  email: string
  province: string
  district: string
  ward: string
  detailAddress: string
}

export interface DepositOrderData {
  orderNo: string
  receiptNo: string
  statusTag: string
  mode: DepositOrderMode
  depositType: DepositType
  products: DepositProductItem[]
  totalAmount: number
  depositAmount: number
  remainingAmount: number
  trialPackageName: string
  convertedSessions: number
  remainingSessions: number
  studentName: string
  paymentMethod: string
  orderNote: string
  classPlacementNote: string
  customer: DepositCustomerInfo
}
