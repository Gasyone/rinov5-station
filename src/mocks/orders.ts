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

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  discount?: number
  studentName?: string
  programName?: string
  teacherType?: string
  packageType?: string
  categoryName?: string
  isRenewal?: boolean
  isCompleted?: boolean
  voucherCode?: string
  voucherDiscount?: number
}

export interface OrderReceiptItem {
  id: string
  code: string
  amount: number
  method: string
  timestamp: string
  status: string
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
  customerName?: string
  customerPhone?: string
  shippingAddress?: string
  paymentMethodTag?: string
  receiptNumber?: string
  receiptTime?: string
  receiptAmount?: number
  receiptMethod?: string
  receiptStatus?: string
  paymentOption?: string
  receipts?: OrderReceiptItem[]
  hasDepositStudyNow?: boolean
  hasDepositPre?: boolean
}

const makeOrderId = (i: number) => `ORD-${String(2026000 + i).padStart(7, "0")}`

export const mockOrders: Order[] = [
  {
    id: "o-od803291",
    orderNo: "OD803291",
    studentId: "s-phamnguyenkhoi",
    studentName: "Phạm nguyên khôi",
    customerName: "0983055652",
    customerPhone: "0983055652",
    shippingAddress: "Bắc Giang, Xã Nghĩa Hưng, Huyện Lạng Giang, Bắc Giang",
    paymentMethodTag: "T4-Thanh toán 1 phần",
    paymentOption: "NHIỀU LẦN",
    hasDepositStudyNow: true,
    hasDepositPre: false,
    items: [
      {
        productId: "p-cambridge-30",
        productName: "[Gia sư] Tiếng anh 1:4 _ 30 buổi _ GV VN",
        categoryName: "Sản phẩm gia sư",
        programName: "Tiếng Anh Cambridge",
        teacherType: "Việt Nam",
        packageType: "1:4 - 30 buổi",
        isRenewal: true,
        isCompleted: false,
        quantity: 1,
        unitPrice: 2990000,
        discount: 0,
        subtotal: 2990000,
        studentName: "Phạm nguyên khôi",
      },
    ],
    totalAmount: 2990000,
    discountAmount: 0,
    finalAmount: 2990000,
    paidAmount: 100000,
    remainingAmount: 2890000,
    receipts: [
      {
        id: "rc-803291-1",
        code: "TNX00000273948",
        amount: 100000,
        method: "BANK",
        timestamp: "15:37:57 - 14/08/2026",
        status: "THÀNH CÔNG",
      },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "partial",
    status: "pending",
    branch: "RinoEdu Bắc Giang",
    saleBy: "Nguyễn Văn Sale",
    createdAt: "2026-08-14T15:37:57Z",
  },
  {
    id: "o-od772048",
    orderNo: "OD772048",
    studentId: "s-buihuean",
    studentName: "Bùi Huệ Ân",
    customerName: "Nguyễn Thị Du",
    customerPhone: "0865981348",
    shippingAddress: "Ấp Đầu Lòng, Thị trấn Lai Uyên, Huyện Bàu Bàng, Bình Dương",
    paymentMethodTag: "T5-Thành công",
    paymentOption: "NHIỀU LẦN",
    hasDepositStudyNow: true,
    hasDepositPre: false,
    items: [
      {
        productId: "p-einstein-48",
        productName: "[Gia sư][TH] Toán Tư Duy 1:6 Einstein (48 buổi...)",
        categoryName: "Sản phẩm gia sư",
        programName: "Chương trình Toán tư duy Tutor",
        teacherType: "Việt Nam",
        packageType: "1:6 - 48 buổi",
        isRenewal: false,
        isCompleted: true,
        quantity: 1,
        unitPrice: 5800000,
        discount: 0,
        subtotal: 5800000,
        studentName: "Bùi Huệ Ân",
      },
    ],
    totalAmount: 5800000,
    discountAmount: 0,
    finalAmount: 5800000,
    paidAmount: 5800000,
    paidCount: 2,
    remainingAmount: 0,
    receipts: [
      {
        id: "rc-772048-1",
        code: "TNX00000234942",
        amount: 2900000,
        method: "COD",
        timestamp: "21:15:11 - 08/01/2026",
        status: "THÀNH CÔNG",
      },
      {
        id: "rc-772048-2",
        code: "TNX00000234935",
        amount: 2900000,
        method: "COD",
        timestamp: "20:21:53 - 08/01/2026",
        status: "HỦY",
      },
      {
        id: "rc-772048-3",
        code: "TNX00000234934",
        amount: 2900000,
        method: "COD",
        timestamp: "20:21:53 - 08/01/2026",
        status: "HỦY",
      },
      {
        id: "rc-772048-4",
        code: "TNX00000231062",
        amount: 2900000,
        method: "BANK",
        timestamp: "09:41:20 - 10/12/2025",
        status: "THÀNH CÔNG",
      },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Bình Dương",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-01-08T21:15:11Z",
  },
  {
    id: "o-od781205",
    orderNo: "OD781205",
    studentId: "s-tuongvy",
    studentName: "Nhữ Thị Tường Vy",
    customerName: "Nhữ Đình Sơn",
    customerPhone: "0982700818",
    shippingAddress: "thôn An Đồng, xã Thượng Hồng, Phường Đa Phúc, Quận Dương Kinh, Hải Phòng",
    paymentMethodTag: "T5-Đã nhận COD",
    paymentOption: "MỘT LẦN",
    items: [
      {
        productId: "p-booster-48",
        productName: "[IE_TUTOR][THCS] Skill booster_1:6_48 buổi",
        categoryName: "Sản phẩm gia sư",
        programName: "Tiếng Anh IELTS",
        teacherType: "Việt Nam",
        packageType: "1:6 - 48 buổi",
        isRenewal: true,
        isCompleted: true,
        quantity: 1,
        unitPrice: 5550000,
        discount: 200000,
        subtotal: 5350000,
        studentName: "Nhữ Thị Tường Vy",
        voucherCode: "IELGH24091",
        voucherDiscount: 200000,
      },
    ],
    totalAmount: 5550000,
    discountAmount: 200000,
    finalAmount: 5350000,
    paidAmount: 5350000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      {
        id: "p-rc-1",
        sequenceNo: 1,
        amount: 5350000,
        paymentType: "Phiếu thu",
        paymentMethod: "COD",
        paidAt: "19:50:40 - 17/03/2026",
        note: "Trạng thái thanh toán: THÀNH CÔNG",
      },
    ],
    receiptNumber: "TNX00000244278",
    receiptTime: "19:50:40 - 17/03/2026",
    receiptAmount: 5350000,
    receiptMethod: "COD",
    receiptStatus: "THÀNH CÔNG",
    paymentMethod: "cash",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Hải Phòng",
    saleBy: "Vũ Thị Thảo Huyền 3",
    createdAt: "2026-03-17T19:50:40Z",
  },
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
