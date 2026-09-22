export type Family360TabKey =
  | 'parents'
  | 'children'
  | 'leads'
  | 'orders'
  | 'payments'
  | 'deliveries'

export interface FamilyParentContact {
  id: string
  name: string
  role: string // Mẹ, Bố, Bà ngoại, Ông nội, Người giám hộ...
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

export interface FamilyChildItem {
  id: string
  name: string
  currentSchool: string
  birthYear: string
  age: string
  academicPerformance: string
  phone: string
  course: string
  vuihocAccount: string
  customerType: string // Tự học, Gia sư, Station...
  industryGroup: string // Tiểu học, THCS, THPT...
  selectedSources: string[]
  selectedStaff: string[]
  marketingStaff: string
  selectedProductGroups: string[]
  customerCode: string
  isCurrent?: boolean
  totalOrdersCount?: number
  totalOrdersAmount?: string
}

export interface FamilyLeadOccurrence {
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
  childName?: string
  leadCode?: string
}

export interface FamilyOrder {
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

export interface FamilyPayment {
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

export interface FamilyDelivery {
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
