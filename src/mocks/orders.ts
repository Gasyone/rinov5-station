export interface PaymentRecord {
  id: string
  sequenceNo: number
  amount: number
  paymentType: string
  paymentMethod: string
  bankAccount?: string
  paidAt: string
  note?: string
}

export interface Order {
  id: string
  orderNo: string
  studentId: string
  studentName: string
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  finalAmount: number
  paidAmount?: number
  paidCount?: number
  remainingAmount?: number
  paymentHistory?: PaymentRecord[]
  paymentMethod: "cash" | "bank_transfer" | "credit_card" | "momo"
  paymentStatus: "paid" | "unpaid" | "partial"
  status: "completed" | "pending" | "cancelled" | "refunded"
  branch: string
  saleBy: string
  createdAt: string
  notes?: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

const makeOrderId = (i: number) => `ORD-${String(2026000 + i).padStart(7, "0")}`

export const mockOrders: Order[] = [
  {
    id: "o1",
    orderNo: makeOrderId(1),
    studentId: "s1",
    studentName: "Nguyễn An",
    items: [{ productId: "p1", productName: "Khóa học IELTS A1", quantity: 1, unitPrice: 3500000, subtotal: 3500000 }],
    totalAmount: 3500000,
    discountAmount: 500000,
    finalAmount: 3000000,
    paidAmount: 3000000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p1-1', sequenceNo: 1, amount: 3000000, paymentType: 'Thu đủ học phí', paymentMethod: 'Chuyển khoản QR', bankAccount: 'MBBank - 090327988899', paidAt: '09/01 10:00', note: 'Thanh toán 100% học phí IELTS A1' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Nguyễn Tuân",
    saleBy: "Trần Thị Sale",
    createdAt: "2025-01-09T10:00:00Z",
  },
  {
    id: "o2",
    orderNo: makeOrderId(2),
    studentId: "s2",
    studentName: "Trần Bình",
    items: [{ productId: "p2", productName: "Khóa học TOEIC B2", quantity: 1, unitPrice: 3000000, subtotal: 3000000 }],
    totalAmount: 3000000,
    discountAmount: 0,
    finalAmount: 3000000,
    paidAmount: 3000000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p2-1', sequenceNo: 1, amount: 3000000, paymentType: 'Thu đủ học phí', paymentMethod: 'Tiền mặt', paidAt: '14/02 14:00', note: 'Nộp tiền mặt tại quầy tân thư' },
    ],
    paymentMethod: "cash",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Smart City",
    saleBy: "Trần Thị Sale",
    createdAt: "2025-02-14T14:00:00Z",
  },
  {
    id: "o3",
    orderNo: makeOrderId(3),
    studentId: "s3",
    studentName: "Lê Chi",
    items: [{ productId: "p3", productName: "Khóa học Tiếng Anh A1", quantity: 1, unitPrice: 2000000, subtotal: 2000000 }],
    totalAmount: 2000000,
    discountAmount: 0,
    finalAmount: 2000000,
    paidAmount: 0,
    paidCount: 0,
    remainingAmount: 2000000,
    paymentHistory: [],
    paymentMethod: "cash",
    paymentStatus: "unpaid",
    status: "pending",
    branch: "RinoEdu Nguyễn Tuân",
    saleBy: "Trần Thị Sale",
    createdAt: "2025-03-01T09:30:00Z",
  },
  {
    id: "o4",
    orderNo: makeOrderId(4),
    studentId: "s4",
    studentName: "Phạm Dũng",
    items: [{ productId: "p1", productName: "Khóa học IELTS B1", quantity: 1, unitPrice: 3500000, subtotal: 3500000 }],
    totalAmount: 3500000,
    discountAmount: 700000,
    finalAmount: 2800000,
    paidAmount: 2800000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p4-1', sequenceNo: 1, amount: 2800000, paymentType: 'Thu đủ học phí', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Techcombank', paidAt: '19/04 16:00', note: 'Chuyển khoản học phí trọn gói' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Linh Đàm",
    saleBy: "Trần Thị Sale",
    createdAt: "2025-04-19T16:00:00Z",
  },
  {
    id: "o5",
    orderNo: makeOrderId(5),
    studentId: "s5",
    studentName: "Trần Tuấn Khang",
    items: [{ productId: "p1", productName: "Khóa học Tiếng Nhật N5", quantity: 1, unitPrice: 4000000, subtotal: 4000000 }],
    totalAmount: 4000000,
    discountAmount: 0,
    finalAmount: 4000000,
    paidAmount: 2000000,
    paidCount: 1,
    remainingAmount: 2000000,
    paymentHistory: [
      { id: 'p5-1', sequenceNo: 1, amount: 2000000, paymentType: 'Cọc 50%', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Techcombank - 1902888899', paidAt: '14/05 11:00', note: 'Đặt cọc 50% gói Tiếng Nhật N5' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "partial",
    status: "pending",
    branch: "RinoEdu Smart City",
    saleBy: "Trần Thị Sale",
    createdAt: "2025-05-14T11:00:00Z",
    notes: "Trả trước 50%",
  },
  {
    id: "o6",
    orderNo: makeOrderId(6),
    studentId: "s8",
    studentName: "Trương Bảo An",
    items: [
      { productId: "p3", productName: "Khóa học Tiếng Anh B1", quantity: 1, unitPrice: 2000000, subtotal: 2000000 },
      { productId: "p4", productName: "Sách tiếng Anh", quantity: 2, unitPrice: 150000, subtotal: 300000 },
    ],
    totalAmount: 2300000,
    discountAmount: 100000,
    finalAmount: 2200000,
    paidAmount: 2200000,
    paidCount: 2,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p6-1', sequenceNo: 1, amount: 1200000, paymentType: 'Cọc giữ chỗ đợt 1', paymentMethod: 'Tiền mặt', paidAt: '20/02 09:00', note: 'Thu cọc giữ suất 1,2tr' },
      { id: 'p6-2', sequenceNo: 2, amount: 1000000, paymentType: 'Thanh toán nốt đợt 2', paymentMethod: 'Tiền mặt', paidAt: '27/02 10:00', note: 'Nộp nốt 1,0tr tại quầy' },
    ],
    paymentMethod: "cash",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Smart City",
    saleBy: "Trần Thị Sale",
    createdAt: "2025-02-27T10:00:00Z",
  },
  {
    id: "o7",
    orderNo: makeOrderId(7),
    studentId: "s6",
    studentName: "Đặng Hồng Phúc",
    items: [{ productId: "p1", productName: "Khóa học IELTS C1", quantity: 1, unitPrice: 4500000, subtotal: 4500000 }],
    totalAmount: 4500000,
    discountAmount: 400000,
    finalAmount: 4100000,
    paidAmount: 4100000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p7-1', sequenceNo: 1, amount: 4100000, paymentType: 'Thu đủ học phí', paymentMethod: 'Cà thẻ tín dụng POS', paidAt: '25/08 14:30', note: 'Cà thẻ POS Techcombank' },
    ],
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Nguyễn Tuân",
    saleBy: "Trần Thị Sale",
    createdAt: "2024-08-25T14:30:00Z",
  },
  {
    id: "o8",
    orderNo: makeOrderId(8),
    studentId: "s7",
    studentName: "Nguyễn Hoàng Dũng",
    items: [{ productId: "p2", productName: "Khóa học TOEIC A2", quantity: 1, unitPrice: 2500000, subtotal: 2500000 }],
    totalAmount: 2500000,
    discountAmount: 250000,
    finalAmount: 2250000,
    paidAmount: 2250000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p8-1', sequenceNo: 1, amount: 2250000, paymentType: 'Thu đủ học phí', paymentMethod: 'Ví MoMo', paidAt: '10/11 08:30', note: 'Thanh toán qua ví MoMo' },
    ],
    paymentMethod: "momo",
    paymentStatus: "paid",
    status: "refunded",
    branch: "RinoEdu Linh Đàm",
    saleBy: "Trần Thị Sale",
    createdAt: "2024-11-10T08:30:00Z",
    notes: "Hoàn tiền do chuyển chi nhánh",
  },
]

export function getOrders(filters?: { search?: string; branch?: string; status?: string; paymentStatus?: string }): Order[] {
  return mockOrders.filter((o) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (!o.orderNo.toLowerCase().includes(q) && !o.studentName.toLowerCase().includes(q)) return false
    }
    if (filters?.branch && o.branch !== filters.branch) return false
    if (filters?.status && o.status !== filters.status) return false
    if (filters?.paymentStatus && o.paymentStatus !== filters.paymentStatus) return false
    return true
  })
}
