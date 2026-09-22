export type CustomerProfileTabKey =
  | 'general'
  | 'parents'
  | 'leads'
  | 'orders'
  | 'payments'
  | 'deliveries'

export interface CustomerProfileParent {
  id: string
  name: string
  role: string
  phone: string
  email?: string
  isPrimary: boolean
  secondaryPhone?: string
  occupation?: string
  financialSegment?: string
  budgetPerMonth?: string
  decisionMakerRole?: string
  preferredChannel?: string
  bestTimeToCall?: string
  zaloStatus?: string
  zaloPhone?: string
  facebook?: string
  instagram?: string
  address?: string
  nearestBranch?: string
  nearestBranches?: { name: string; distance: string }[]
  parentExpectation?: string
  parentPainPoint?: string
  parentPersonalityNote?: string
  notes?: string
}

export interface CustomerProfileLeadOccurrence {
  id: string
  cycleNumber: number
  title: string
  status: string
  statusLabel: string
  channel: string
  assignedSales: string
  branch: string
  productInterest: string
  startDate: string
  endDate?: string
  outcomeNote?: string
  isCurrent?: boolean
  leadCode?: string
}

export interface CustomerProfileOrder {
  id: string
  orderNo: string
  studentName: string
  packageName: string
  courseDuration?: string
  totalAmount: number
  discountAmount: number
  finalAmount: number
  paidAmount: number
  remainingAmount: number
  paymentStatus: 'paid' | 'partial' | 'unpaid'
  paymentMethodTag: string
  orderStatus: 'completed' | 'processing' | 'pending' | 'cancelled' | 'refunded'
  saleBy: string
  createdAt: string
  branch: string
}

export interface CustomerProfilePayment {
  id: string
  code: string // Mã TNX...
  orderNo: string
  studentName: string
  parentName: string
  amount: number
  paymentMethod: 'qr_transfer' | 'cash' | 'pos_card' | 'bank_transfer'
  paymentMethodLabel: string
  receiptTypeLabel: string
  status: 'completed' | 'pending' | 'cancelled'
  isReconciled: boolean
  createdAt: string
  createdBy: string
  bankAccount?: string
  notes?: string
}

export interface CustomerProfileDelivery {
  id: string
  trackingCode: string
  sourceTypeLabel: string
  orderNo?: string
  studentName: string
  recipientName: string
  recipientPhone: string
  shippingAddress: string
  deliveryMethod: 'pickup' | 'shipping'
  carrier?: string
  products: Array<{
    name: string
    category: string
    quantity: number
    unit: string
  }>
  status: 'pending_handover' | 'shipping' | 'handed_over' | 'returned'
  createdAt: string
  completedAt?: string
  notes?: string
  podImageUrl?: string
}
