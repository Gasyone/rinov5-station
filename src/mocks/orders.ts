export interface PaymentRecord {
  id: string
  sequenceNo?: number
  amount: number
  paymentType?: string
  paymentMethod?: string
  bankAccount?: string
  paidAt?: string
  note?: string
  code?: string
  method?: string
  time?: string
  staff?: string
  reconciliationStatus?: 'reconciled' | 'unreconciled' | string
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
  packageCategory?: 'combo' | 'tutor' | 'single_course' | 'book_service'
  categoryName?: string
  isRenewal?: boolean
  isCompleted?: boolean
  voucherCode?: string
  voucherDiscount?: number
  bonusText?: string
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
  status: "completed" | "processing" | "pending" | "cancelled" | "refunded"
  branch: string
  saleBy: string
  createdAt: string
  notes?: string
  customerName?: string
  customerPhone?: string
  recipientName?: string
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
  canConvertProduct?: boolean
  remainingSessions?: number
  isExpired?: boolean
}

const makeOrderId = (i: number) => `ORD-${String(2026000 + i).padStart(7, "0")}`

export const mockOrders: Order[] = [
  {
    id: "o-od790741",
    orderNo: "OD790741",
    studentId: "s-phamnguyenkhoi",
    studentName: "Phạm nguyên khôi",
    customerName: "0983055652",
    customerPhone: "0983055652",
    shippingAddress: "Bắc Giang, Xã Nghĩa Hưng, Huyện Lạng Giang, Bắc Giang",
    paymentMethodTag: "T5-Thành công",
    paymentOption: "NHIỀU LẦN",
    hasDepositStudyNow: true,
    hasDepositPre: false,
    canConvertProduct: false, // Sản phẩm hết buổi -> Không còn nhãn chuyển đổi sản phẩm
    remainingSessions: 0,
    isExpired: true,
    items: [
      {
        productId: "p-cambridge-96",
        productName: "[Gia sư] Tiếng anh 1:4 _ 96 buổi _ GV VN",
        categoryName: "Sản phẩm gia sư",
        programName: "Tiếng Anh Cambridge",
        teacherType: "Việt Nam",
        packageType: "1:4 - 90 buổi",
        isRenewal: false,
        isCompleted: true,
        quantity: 1,
        unitPrice: 7980000,
        discount: 0,
        subtotal: 7980000,
        studentName: "Phạm nguyên khôi",
      },
    ],
    totalAmount: 7980000,
    discountAmount: 0,
    finalAmount: 7980000,
    paidAmount: 7980000,
    paidCount: 2,
    remainingAmount: 0,
    receipts: [
      {
        id: "rc-790741-1",
        code: "TNX00000271527",
        amount: 2980000,
        method: "COD",
        timestamp: "09:56 - 03/08/2026",
        status: "THÀNH CÔNG",
      },
      {
        id: "rc-790741-2",
        code: "TNX00000256886",
        amount: 5000000,
        method: "BANK",
        timestamp: "11:54 - 30/05/2026",
        status: "THÀNH CÔNG",
      },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Bắc Giang",
    saleBy: "Nguyễn Văn Sale",
    createdAt: "2026-08-03T09:56:57Z",
  },
  {
    id: "o-od803291",
    orderNo: "OD803291",
    studentId: "s-phamnguyenkhoi",
    studentName: "Phạm nguyên khôi",
    customerName: "0983055652",
    customerPhone: "0983055652",
    recipientName: "Trần Thu Hà",
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
    paidAmount: 990000,
    remainingAmount: 2000000,
    receipts: [
      {
        id: "rc-803291-2",
        code: "TNX00000275812",
        amount: 890000,
        method: "BANK",
        timestamp: "10:20 - 18/08/2026",
        status: "THÀNH CÔNG",
      },
      {
        id: "rc-803291-1",
        code: "TNX00000273948",
        amount: 100000,
        method: "BANK",
        timestamp: "15:37 - 14/08/2026",
        status: "THÀNH CÔNG",
      },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "partial",
    status: "processing",
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
        timestamp: "21:15 - 08/01/2026",
        status: "THÀNH CÔNG",
      },
      {
        id: "rc-772048-2",
        code: "TNX00000234935",
        amount: 2900000,
        method: "COD",
        timestamp: "20:21 - 08/01/2026",
        status: "HỦY",
      },
      {
        id: "rc-772048-3",
        code: "TNX00000234934",
        amount: 2900000,
        method: "COD",
        timestamp: "20:21 - 08/01/2026",
        status: "HỦY",
      },
      {
        id: "rc-772048-4",
        code: "TNX00000231062",
        amount: 2900000,
        method: "BANK",
        timestamp: "09:41 - 10/12/2025",
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
        paidAt: "19:50 - 17/03/2026",
        note: "Trạng thái thanh toán: THÀNH CÔNG",
      },
    ],
    receiptNumber: "TNX00000244278",
    receiptTime: "19:50 - 17/03/2026",
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
    customerName: "Nguyễn Văn Hùng",
    customerPhone: "0983112233",
    recipientName: "Nguyễn Văn Hùng",
    shippingAddress: "Số 12 Chùa Láng, Đống Đa, Hà Nội",
    items: [{ productId: "p1", productName: "Khóa học IELTS A1", quantity: 1, unitPrice: 3500000, subtotal: 3500000, packageCategory: 'single_course' }],
    totalAmount: 3500000,
    discountAmount: 500000,
    finalAmount: 3000000,
    paidAmount: 3000000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p1-1', sequenceNo: 1, amount: 3000000, paymentType: 'Thu đủ học phí', paymentMethod: 'Chuyển khoản QR', bankAccount: 'MBBank - 090327988899', paidAt: '10:00 - 09/08/2026', note: 'Thanh toán 100% học phí IELTS A1' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Nguyễn Tuân",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-08-09T10:00:00Z",
  },
  {
    id: "o2",
    orderNo: makeOrderId(2),
    studentId: "s2",
    studentName: "Trần Bình",
    customerName: "Trần Minh Đức",
    customerPhone: "0912445566",
    recipientName: "Trần Minh Đức",
    shippingAddress: "Tòa S1.02 Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội",
    items: [{ productId: "p2", productName: "Khóa học TOEIC B2", quantity: 1, unitPrice: 3000000, subtotal: 3000000, packageCategory: 'single_course' }],
    totalAmount: 3000000,
    discountAmount: 0,
    finalAmount: 3000000,
    paidAmount: 3000000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p2-1', sequenceNo: 1, amount: 3000000, paymentType: 'Thu đủ học phí', paymentMethod: 'Tiền mặt', paidAt: '14:00 - 14/08/2026', note: 'Nộp tiền mặt tại quầy tân thư' },
    ],
    paymentMethod: "cash",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Smart City",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-08-11T14:00:00Z",
  },
  {
    id: "o3",
    orderNo: makeOrderId(3),
    studentId: "s3",
    studentName: "Lê Chi",
    customerName: "Lê Thu Hương",
    customerPhone: "0987665544",
    recipientName: "Lê Thu Hương",
    shippingAddress: "Số 88 Nguyễn Tuân, Thanh Xuân Trung, Thanh Xuân, Hà Nội",
    items: [{ productId: "p3", productName: "Khóa học Tiếng Anh A1", quantity: 1, unitPrice: 2000000, subtotal: 2000000, packageCategory: 'single_course' }],
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
    createdAt: "2026-08-15T09:30:00Z",
  },
  {
    id: "o4",
    orderNo: makeOrderId(4),
    studentId: "s4",
    studentName: "Phạm Dũng",
    customerName: "Phạm Văn Nam",
    customerPhone: "0903889900",
    recipientName: "Phạm Văn Nam",
    shippingAddress: "Số 25 Linh Đàm, Hoàng Liệt, Hoàng Mai, Hà Nội",
    items: [{ productId: "p1", productName: "Khóa học IELTS B1", quantity: 1, unitPrice: 3500000, subtotal: 3500000, packageCategory: 'single_course' }],
    totalAmount: 3500000,
    discountAmount: 700000,
    finalAmount: 2800000,
    paidAmount: 2800000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p4-1', sequenceNo: 1, amount: 2800000, paymentType: 'Thu đủ học phí', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Techcombank', paidAt: '16:00 - 19/08/2026', note: 'Chuyển khoản học phí trọn gói' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Linh Đàm",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-08-19T16:00:00Z",
  },
  {
    id: "o5",
    orderNo: makeOrderId(5),
    studentId: "s5",
    studentName: "Trần Tuấn Khang",
    customerName: "Trần Thị Thảo",
    customerPhone: "0984556677",
    recipientName: "Trần Thị Thảo",
    shippingAddress: "Tòa Sapphire 1 Vinhomes Smart City, Nam Từ Liêm, Hà Nội",
    items: [{ productId: "p1", productName: "Khóa học Tiếng Nhật N5", quantity: 1, unitPrice: 4000000, subtotal: 4000000, packageCategory: 'single_course' }],
    totalAmount: 4000000,
    discountAmount: 0,
    finalAmount: 4000000,
    paidAmount: 3000000,
    paidCount: 2,
    remainingAmount: 1000000,
    paymentHistory: [
      { id: 'p5-2', sequenceNo: 2, amount: 1000000, paymentType: 'Thanh toán đợt 2', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Techcombank - 1902888899', paidAt: '14:30 - 28/07/2026', note: 'Đóng thêm đợt 2 học phí 1tr' },
      { id: 'p5-1', sequenceNo: 1, amount: 2000000, paymentType: 'Cọc 50%', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Techcombank - 1902888899', paidAt: '11:00 - 14/07/2026', note: 'Đặt cọc 50% gói Tiếng Nhật N5' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "partial",
    status: "processing",
    branch: "RinoEdu Smart City",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-07-14T11:00:00Z",
    notes: "Trả trước 50%",
  },
  {
    id: "o6",
    orderNo: makeOrderId(6),
    studentId: "s8",
    studentName: "Trương Bảo An",
    customerName: "Trương Văn Hải",
    customerPhone: "0978112244",
    recipientName: "Trương Văn Hải",
    shippingAddress: "Số 102 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội",
    items: [
      { productId: "p3", productName: "Khóa học Tiếng Anh B1", quantity: 1, unitPrice: 2000000, subtotal: 2000000, packageCategory: 'single_course' },
      { productId: "p4", productName: "Sách tiếng Anh", quantity: 2, unitPrice: 150000, subtotal: 300000, packageCategory: 'book_service' },
    ],
    totalAmount: 2300000,
    discountAmount: 100000,
    finalAmount: 2200000,
    paidAmount: 2200000,
    paidCount: 2,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p6-2', sequenceNo: 2, amount: 1000000, paymentType: 'Thanh toán nốt đợt 2', paymentMethod: 'Tiền mặt', paidAt: '10:00 - 27/07/2026', note: 'Nộp nốt 1,0tr tại quầy' },
      { id: 'p6-1', sequenceNo: 1, amount: 1200000, paymentType: 'Cọc giữ chỗ đợt 1', paymentMethod: 'Tiền mặt', paidAt: '09:00 - 20/07/2026', note: 'Thu cọc giữ suất 1,2tr' },
    ],
    paymentMethod: "cash",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Smart City",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-07-27T10:00:00Z",
  },
  {
    id: "o7",
    orderNo: makeOrderId(7),
    studentId: "s6",
    studentName: "Đặng Hồng Phúc",
    customerName: "Đặng Quốc Bảo",
    customerPhone: "0915334455",
    recipientName: "Đặng Quốc Bảo",
    shippingAddress: "Số 56 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    items: [{ productId: "p1", productName: "Khóa học IELTS C1", quantity: 1, unitPrice: 4500000, subtotal: 4500000, packageCategory: 'single_course' }],
    totalAmount: 4500000,
    discountAmount: 400000,
    finalAmount: 4100000,
    paidAmount: 4100000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p7-1', sequenceNo: 1, amount: 4100000, paymentType: 'Thu đủ học phí', paymentMethod: 'Cà thẻ tín dụng POS', paidAt: '14:30 - 25/06/2026', note: 'Cà thẻ POS Techcombank' },
    ],
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Nguyễn Tuân",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-06-25T14:30:00Z",
  },
  {
    id: "o8",
    orderNo: makeOrderId(8),
    studentId: "s7",
    studentName: "Nguyễn Hoàng Dũng",
    customerName: "Nguyễn Thu Trang",
    customerPhone: "0988776655",
    recipientName: "Nguyễn Thu Trang",
    shippingAddress: "Số 15 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội",
    items: [{ productId: "p2", productName: "Khóa học TOEIC A2", quantity: 1, unitPrice: 2500000, subtotal: 2500000, packageCategory: 'single_course' }],
    totalAmount: 2500000,
    discountAmount: 250000,
    finalAmount: 2250000,
    paidAmount: 2250000,
    paidCount: 1,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p8-1', sequenceNo: 1, amount: 2250000, paymentType: 'Thu đủ học phí', paymentMethod: 'Ví MoMo', paidAt: '08:30 - 10/06/2026', note: 'Thanh toán qua ví MoMo' },
    ],
    paymentMethod: "momo",
    paymentStatus: "paid",
    status: "refunded",
    branch: "RinoEdu Linh Đàm",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-06-10T08:30:00Z",
    notes: "Hoàn tiền do chuyển chi nhánh",
  },
  {
    id: "o-combo-1",
    orderNo: "OD812903",
    studentId: "s9",
    studentName: "Đỗ Mai Phương",
    customerName: "Đỗ Văn Thành",
    customerPhone: "0912384729",
    shippingAddress: "Số 45 Lê Văn Lương, Cầu Giấy, Hà Nội",
    paymentMethodTag: "T5-Thành công",
    paymentOption: "MỘT LẦN",
    items: [
      {
        productId: "p-combo-ielts",
        productName: "Gói Combo IELTS Intensive (A1 + B1 + Học liệu)",
        categoryName: "Gói combo liên kết",
        packageCategory: "combo",
        packageType: "Combo 2 khóa",
        isRenewal: false,
        isCompleted: true,
        quantity: 1,
        unitPrice: 6500000,
        discount: 500000,
        subtotal: 6000000,
        studentName: "Đỗ Mai Phương",
      },
    ],
    totalAmount: 6500000,
    discountAmount: 500000,
    finalAmount: 6000000,
    paidAmount: 6000000,
    paidCount: 1,
    remainingAmount: 0,
    receipts: [
      {
        id: "rc-812903-1",
        code: "TNX00000289123",
        amount: 6000000,
        method: "BANK",
        timestamp: "10:15 - 18/08/2026",
        status: "THÀNH CÔNG",
      },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Nguyễn Tuân",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-08-18T10:15:00Z",
  },
  {
    id: "o-combo-2",
    orderNo: "OD815442",
    studentId: "s10",
    studentName: "Trần Bảo Minh Quân",
    customerName: "Trần Văn Toàn",
    customerPhone: "0904837261",
    recipientName: "Trần Văn Toàn",
    shippingAddress: "Tòa S2.05 VinHomes Smart City, Nam Từ Liêm, Hà Nội",
    paymentMethodTag: "T4-Thanh toán 1 phần",
    paymentOption: "NHIỀU LẦN",
    items: [
      {
        productId: "p-combo-tutor-math-en",
        productName: "Gói Combo Gia sư Song ngữ (Toán Einstein + Tiếng Anh Cambridge 72 buổi)",
        categoryName: "Gói combo gia sư",
        packageCategory: "combo",
        packageType: "Combo Gia sư 1:4 (72 buổi)",
        isRenewal: false,
        isCompleted: false,
        quantity: 1,
        unitPrice: 12000000,
        discount: 1000000,
        subtotal: 11000000,
        studentName: "Trần Bảo Minh Quân",
      },
    ],
    totalAmount: 12000000,
    discountAmount: 1000000,
    finalAmount: 11000000,
    paidAmount: 7000000,
    paidCount: 3,
    remainingAmount: 4000000,
    paymentHistory: [
      { id: 'p-cb2-3', sequenceNo: 3, amount: 2000000, paymentType: 'Thanh toán đợt 3', paymentMethod: 'Chuyển khoản NH', bankAccount: 'MBBank', paidAt: '25/08 09:30', note: 'Đóng học phí đợt 3: 2tr' },
      { id: 'p-cb2-2', sequenceNo: 2, amount: 3000000, paymentType: 'Thanh toán đợt 2', paymentMethod: 'Chuyển khoản NH', bankAccount: 'MBBank', paidAt: '20/08 14:22', note: 'Đóng học phí đợt 2: 3tr' },
      { id: 'p-cb2-1', sequenceNo: 1, amount: 2000000, paymentType: 'Cọc giữ chỗ đợt 1', paymentMethod: 'Chuyển khoản NH', bankAccount: 'MBBank', paidAt: '10/08 11:00', note: 'Cọc đăng ký combo song ngữ' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "partial",
    status: "processing",
    branch: "RinoEdu Smart City",
    saleBy: "Nguyễn Văn Sale",
    createdAt: "2026-08-20T14:22:00Z",
  },
  {
    id: "o-combo-3",
    orderNo: "OD820119",
    studentId: "s11",
    studentName: "Hoàng Minh Tuấn",
    customerName: "Hoàng Đức Thịnh",
    customerPhone: "0977223344",
    recipientName: "Hoàng Đức Thịnh",
    shippingAddress: "Số 99 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội",
    paymentMethodTag: "T5-Thành công",
    paymentOption: "NHIỀU LẦN",
    items: [
      {
        productId: "p-combo-ielts-master",
        productName: "Gói Combo IELTS Master 96 buổi + Luyện đề",
        categoryName: "Gói combo liên kết",
        packageCategory: "combo",
        packageType: "Combo 96 buổi",
        isRenewal: false,
        isCompleted: true,
        quantity: 1,
        unitPrice: 13000000,
        discount: 1000000,
        subtotal: 12000000,
        studentName: "Hoàng Minh Tuấn",
      },
    ],
    totalAmount: 13000000,
    discountAmount: 1000000,
    finalAmount: 12000000,
    paidAmount: 12000000,
    paidCount: 4,
    remainingAmount: 0,
    paymentHistory: [
      { id: 'p-cb3-4', sequenceNo: 4, amount: 3000000, paymentType: 'Thanh toán đợt 4 (Hoàn tất)', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Vietcombank', paidAt: '16:45 - 24/08/2026', note: 'Thanh toán đợt cuối hoàn tất' },
      { id: 'p-cb3-3', sequenceNo: 3, amount: 3000000, paymentType: 'Thanh toán đợt 3', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Vietcombank', paidAt: '10:15 - 18/08/2026', note: 'Thanh toán đợt 3' },
      { id: 'p-cb3-2', sequenceNo: 2, amount: 3000000, paymentType: 'Thanh toán đợt 2', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Vietcombank', paidAt: '15:00 - 12/08/2026', note: 'Thanh toán đợt 2' },
      { id: 'p-cb3-1', sequenceNo: 1, amount: 3000000, paymentType: 'Cọc giữ chỗ đợt 1', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Vietcombank', paidAt: '09:30 - 05/08/2026', note: 'Đăng ký giữ chỗ đợt 1' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "paid",
    status: "completed",
    branch: "RinoEdu Nguyễn Tuân",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-08-05T09:30:00Z",
  },
  {
    id: "o-combo-4",
    orderNo: "OD823450",
    studentId: "s12",
    studentName: "Phan Gia Linh",
    customerName: "Phan Đình Trọng",
    customerPhone: "0934112288",
    recipientName: "Phan Đình Trọng",
    shippingAddress: "Số 32 Huỳnh Thúc Kháng, Láng Hạ, Đống Đa, Hà Nội",
    paymentMethodTag: "T4-Thanh toán 1 phần",
    paymentOption: "NHIỀU LẦN",
    items: [
      {
        productId: "p-math-tutor-60",
        productName: "[Gia sư] Toán tư duy nâng cao 1:2 _ 60 buổi",
        categoryName: "Sản phẩm gia sư",
        packageCategory: "tutor",
        packageType: "1:2 - 60 buổi",
        isRenewal: true,
        isCompleted: false,
        quantity: 1,
        unitPrice: 7000000,
        discount: 0,
        subtotal: 7000000,
        studentName: "Phan Gia Linh",
      },
    ],
    totalAmount: 7000000,
    discountAmount: 0,
    finalAmount: 7000000,
    paidAmount: 5000000,
    paidCount: 2,
    remainingAmount: 2000000,
    paymentHistory: [
      { id: 'p-cb4-2', sequenceNo: 2, amount: 2000000, paymentType: 'Thanh toán đợt 2', paymentMethod: 'Tiền mặt', paidAt: '17:00 - 22/08/2026', note: 'Nộp đợt 2 tại chi nhánh' },
      { id: 'p-cb4-1', sequenceNo: 1, amount: 3000000, paymentType: 'Cọc giữ chỗ đợt 1', paymentMethod: 'Chuyển khoản NH', bankAccount: 'Techcombank', paidAt: '10:00 - 15/08/2026', note: 'Cọc đợt 1' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "partial",
    status: "processing",
    branch: "RinoEdu Nguyễn Tuân",
    saleBy: "Nguyễn Văn Sale",
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "o-combo-5",
    orderNo: "OD826780",
    studentId: "s13",
    studentName: "Vũ Bảo Ngọc",
    customerName: "Vũ Hải Đăng",
    customerPhone: "0966554433",
    recipientName: "Vũ Hải Đăng",
    shippingAddress: "Tòa Park 6 Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội",
    paymentMethodTag: "T4-Thanh toán 1 phần",
    paymentOption: "NHIỀU LẦN",
    items: [
      {
        productId: "p-toeic-combo-48",
        productName: "Combo Luyện thi TOEIC 650+ (48 buổi + Mock Test)",
        categoryName: "Gói combo liên kết",
        packageCategory: "combo",
        packageType: "Combo 48 buổi",
        isRenewal: false,
        isCompleted: false,
        quantity: 1,
        unitPrice: 5000000,
        discount: 500000,
        subtotal: 4500000,
        studentName: "Vũ Bảo Ngọc",
      },
    ],
    totalAmount: 5000000,
    discountAmount: 500000,
    finalAmount: 4500000,
    paidAmount: 2500000,
    paidCount: 2,
    remainingAmount: 2000000,
    paymentHistory: [
      { id: 'p-cb5-2', sequenceNo: 2, amount: 1500000, paymentType: 'Thanh toán đợt 2', paymentMethod: 'Chuyển khoản QR', bankAccount: 'MBBank', paidAt: '14:00 - 23/08/2026', note: 'Thanh toán đợt 2 qua QR' },
      { id: 'p-cb5-1', sequenceNo: 1, amount: 1000000, paymentType: 'Cọc giữ chỗ đợt 1', paymentMethod: 'Tiền mặt', paidAt: '11:30 - 16/08/2026', note: 'Đặt cọc 1tr tại quầy' },
    ],
    paymentMethod: "bank_transfer",
    paymentStatus: "partial",
    status: "processing",
    branch: "RinoEdu Linh Đàm",
    saleBy: "Trần Thị Sale",
    createdAt: "2026-08-16T11:30:00Z",
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
