export type TransactionType = 'receipt' | 'payment_voucher'

export type ReceiptType =
  | 'tuition_full'
  | 'deposit'
  | 'installment'
  | 'event_fee'
  | 'refund'
  | 'other'

export type PaymentMethod =
  | 'qr_transfer'
  | 'cash'
  | 'pos_card'
  | 'bank_transfer'

export type ReceiptStatus =
  | 'completed'
  | 'pending'
  | 'cancelled'

export interface ReceiptOrderItem {
  orderCode: string
  studentName: string
  packageName?: string
  packageType?: string
  durationText?: string
  convertedSessions?: string
  bonusText?: string
  branch?: string
  quantity?: number
  allocatedAmount: number
  orderTotalAmount: number
  orderRemainingAmount: number
}

export interface PaymentReceiptRecipientInfo {
  name: string
  phone: string
  province?: string
  district?: string
  ward?: string
  address?: string
}

export interface PaymentReceiptClassPlacement {
  classCode?: string
  className?: string
  schedule?: string
  teacherName?: string
  roomOrFormat?: string
  placementStatus?: 'assigned' | 'pending' | 'waitlist'
  startDate?: string
}

export interface PaymentReceipt {
  id: string
  code: string // Mã giao dịch chuẩn TNX (e.g. TNX00000273948)
  transactionType: TransactionType // 'receipt' (Thu) | 'payment_voucher' (Chi/Hoàn)
  orderCode: string // Mã đơn hàng liên quan (e.g. OD-DRAFT-9230 hoặc nhiều đơn)
  studentName: string // Tên học viên
  parentName: string // Khách hàng (Người nộp/nhận tiền)
  phone: string // Số điện thoại liên hệ
  receiptType: ReceiptType // Loại giao dịch (cọc, học phí, trả góp, hoàn tiền...)
  amount: number // Số tiền giao dịch (VND)
  orderTotalAmount: number // Tổng giá trị đơn hàng (VND)
  orderRemainingAmount: number // Số tiền còn nợ / Còn lại của đơn hàng (VND)
  items?: ReceiptOrderItem[] // Chi tiết phân bổ nhiều đơn hàng trong 1 phiếu thu
  paymentMethod: PaymentMethod // Hình thức thanh toán (QR, tiền mặt, POS, chuyển khoản)
  bankAccount?: string // Tài khoản thụ hưởng / Quầy giao dịch
  status: ReceiptStatus // Trạng thái giao dịch
  isReconciled: boolean // true: Đã đối soát, false: Chưa đối soát
  createdBy: string // Nhân viên lập phiếu
  branch: string // Chi nhánh trung tâm
  createdAt: string // Ngày giờ lập phiếu (e.g. 12/08/2026 14:30)
  updatedAt?: string // Ngày cập nhật cuối cùng
  recipientInfo?: PaymentReceiptRecipientInfo // Thông tin nhận hàng
  placementInfo?: PaymentReceiptClassPlacement // Thông tin lớp ghép (class_placement)
  totalConvertedAmount?: number // Tổng tiền quy đổi
  shippingNote?: string // Note cho vận đơn
  operationNote?: string // Note cho vận hành
  notes?: string // Ghi chú phiếu
}

export interface ReceivableItem {
  id: string
  orderCode: string
  studentName: string
  parentName: string
  phone: string
  packageName: string
  receiptType: ReceiptType
  amount: number
  orderTotalAmount: number
  dueDate: string
  branch: string
  notes?: string
}

export const TRANSACTION_TYPE_MAP: Record<TransactionType, string> = {
  receipt: 'Phiếu thu',
  payment_voucher: 'Phiếu chi',
}

export const RECEIPT_TYPE_MAP: Record<ReceiptType, string> = {
  deposit: 'Cọc giữ chỗ',
  tuition_full: 'Thu đủ học phí',
  installment: 'Thanh toán kỳ trả góp',
  event_fee: 'Phí sự kiện / Khác',
  refund: 'Hoàn tiền / Trả lại',
  other: 'Khoản thu khác',
}

export const PAYMENT_METHOD_MAP: Record<PaymentMethod, string> = {
  qr_transfer: 'Chuyển khoản QR',
  cash: 'Tiền mặt',
  pos_card: 'Cà thẻ POS',
  bank_transfer: 'Chuyển khoản Ngân hàng',
}

export const RECEIPT_STATUS_MAP: Record<ReceiptStatus, string> = {
  completed: 'Thành công',
  pending: 'Chờ thanh toán',
  cancelled: 'Đã hủy',
}

export const mockReceivables: ReceivableItem[] = [
  {
    id: 'rec-001',
    orderCode: 'OD-DRAFT-9230',
    studentName: 'Bé An',
    parentName: 'Nguyễn Thu Hà',
    phone: '0912345678',
    packageName: 'Gói SuperKids 12T',
    receiptType: 'deposit',
    amount: 9000000,
    orderTotalAmount: 18000000,
    dueDate: '15/08/2026',
    branch: 'Chi nhánh Quận 1',
    notes: 'Cần thu cọc 50% còn lại trước ngày vào lớp',
  },
  {
    id: 'rec-002',
    orderCode: 'OD-DRAFT-9232',
    studentName: 'Bé Đức',
    parentName: 'Phạm Thị Bích',
    phone: '0933112233',
    packageName: 'Gói Movers Bán Trú 1N',
    receiptType: 'tuition_full',
    amount: 28000000,
    orderTotalAmount: 28000000,
    dueDate: '14/08/2026',
    branch: 'Chi nhánh Cầu Giấy',
    notes: 'Hẹn nộp 100% tiền mặt tại trung tâm',
  },
  {
    id: 'rec-003',
    orderCode: 'OD-DRAFT-9235',
    studentName: 'Bé Quốc',
    parentName: 'Ngô Tấn Tài',
    phone: '0911223344',
    packageName: 'Gói SuperKids 6T',
    receiptType: 'deposit',
    amount: 2000000,
    orderTotalAmount: 12000000,
    dueDate: '18/08/2026',
    branch: 'Chi nhánh Quận 1',
    notes: 'Cọc giữ ưu đãi 2 triệu cho lớp học thử',
  },
  {
    id: 'rec-004',
    orderCode: 'OD-DRAFT-9236',
    studentName: 'Bé Hà',
    parentName: 'Bùi Phương Thảo',
    phone: '0955443322',
    packageName: 'Gói Kindy Mẫu giáo 12T',
    receiptType: 'tuition_full',
    amount: 17000000,
    orderTotalAmount: 20000000,
    dueDate: '13/08/2026',
    branch: 'Chi nhánh Quận 1',
    notes: 'Khoản cần thu còn lại sau khi giữ chỗ 24h',
  },
  {
    id: 'rec-005',
    orderCode: 'OD-DRAFT-9239',
    studentName: 'Bé Phúc',
    parentName: 'Nguyễn Thanh Tùng',
    phone: '0978889900',
    packageName: 'Gói Kindy 1N (Trả góp kỳ 2)',
    receiptType: 'installment',
    amount: 6000000,
    orderTotalAmount: 18000000,
    dueDate: '25/08/2026',
    branch: 'Chi nhánh Thảo Điền',
    notes: 'Thu kỳ trả góp thứ 2/3',
  },
  {
    id: 'rec-006',
    orderCode: 'OD-DRAFT-9240',
    studentName: 'Bé Mai',
    parentName: 'Trịnh Kim Chi',
    phone: '0903332211',
    packageName: 'Gói SuperKids Trọn Khóa (Đợt 2)',
    receiptType: 'tuition_full',
    amount: 9500000,
    orderTotalAmount: 19000000,
    dueDate: '20/08/2026',
    branch: 'Chi nhánh Quận 7',
    notes: 'Thu 50% còn lại trước ngày khai giảng',
  },
  {
    id: 'rec-007',
    orderCode: 'OD-DRAFT-9242',
    studentName: 'Bé Tâm',
    parentName: 'Cao Thị Dung',
    phone: '0979998877',
    packageName: 'Gói IELTS Special 1N (Đợt 2)',
    receiptType: 'tuition_full',
    amount: 28000000,
    orderTotalAmount: 38000000,
    dueDate: '22/08/2026',
    branch: 'Chi nhánh Quận 7',
    notes: 'Thu học phí còn nợ đợt 2',
  },
]

export const mockPaymentReceipts: PaymentReceipt[] = [
  {
    id: 'rcpt-tnx-275878',
    code: 'TNX00000275878',
    transactionType: 'receipt',
    orderCode: '',
    studentName: 'Thu Nguyễn',
    parentName: 'Thu Nguyễn',
    phone: '0333912012',
    receiptType: 'other',
    amount: 495000,
    orderTotalAmount: 495000,
    orderRemainingAmount: 0,
    isReconciled: true,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 190382910022',
    status: 'completed',
    createdBy: 'Hoàng Thị Trang 3',
    branch: 'Chi nhánh Quận 1',
    createdAt: '16:16:47 - 25/08/2026',
    updatedAt: '16:28:00 - 25/08/2026',
    items: [],
    operationNote: '',
    notes: 'Thu phí giáo trình / học liệu không kèm mã đơn',
  },
  {
    id: 'rcpt-tnx-276009',
    code: 'TNX00000276009',
    transactionType: 'receipt',
    orderCode: 'OD-2026-8821',
    studentName: 'Bé Nguyễn Minh Anh',
    parentName: 'Nguyễn Thị Lý',
    phone: '0356105256',
    receiptType: 'tuition_full',
    amount: 1450000,
    orderTotalAmount: 1458000,
    orderRemainingAmount: 0,
    isReconciled: false,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 190382910022',
    status: 'pending',
    createdBy: 'Hoàng Thị Lý 1',
    branch: 'Chi nhánh Quận 1',
    createdAt: '14:33:03 - 26/08/2026',
    updatedAt: '14:46:00 - 26/08/2026',
    items: [
      {
        orderCode: 'OD-2026-8821',
        studentName: 'Bé Nguyễn Minh Anh',
        packageName: '[Gia sư][TH] Toán Tư Duy 1:6 (48 buổi + 4 buổi ôn tập)',
        durationText: '48 (Buổi)',
        convertedSessions: '24 (Buổi)',
        allocatedAmount: 1458000,
        orderTotalAmount: 1458000,
        orderRemainingAmount: 0,
      },
    ],
    totalConvertedAmount: 1458000,
    operationNote: 'Thu học phí gói Toán Tư Duy 1:6 có quy đổi số buổi học',
    notes: 'Thu học phí gói Toán Tư Duy 1:6 có quy đổi số buổi học',
  },
  {
    id: 'rcpt-tnx-275899',
    code: 'TNX00000275899',
    transactionType: 'receipt',
    orderCode: 'OD804102',
    studentName: 'Bé Phạm Khánh Linh',
    parentName: 'Phạm Văn Long',
    phone: '0988112233',
    receiptType: 'tuition_full',
    amount: 1200000,
    orderTotalAmount: 1200000,
    orderRemainingAmount: 0,
    isReconciled: false,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 190382910022',
    status: 'cancelled',
    createdBy: 'Hoàng Thị Trang 3',
    branch: 'Chi nhánh Quận 1',
    createdAt: '09:15:00 - 24/08/2026',
    updatedAt: '09:30:10 - 24/08/2026',
    items: [
      {
        orderCode: 'OD804102',
        studentName: 'Bé Phạm Khánh Linh',
        packageName: '[Gia sư][TH] Toán Tư Duy 1:6 (24 buổi)',
        durationText: '24 (Buổi)',
        convertedSessions: '24 (Buổi)',
        allocatedAmount: 1200000,
        orderTotalAmount: 1200000,
        orderRemainingAmount: 0,
      },
    ],
    totalConvertedAmount: 1200000,
    operationNote: 'Hủy phiếu thu do phụ huynh chuyển khoản thừa số tiền, đã lập phiếu thay thế',
    notes: 'Hủy phiếu thu do phụ huynh chuyển khoản thừa số tiền',
  },
  {
    id: 'rcpt-tnx-275812',
    code: 'TNX00000275812',
    transactionType: 'receipt',
    orderCode: 'OD803291',
    studentName: 'Bé Nguyễn Minh Đức',
    parentName: '0983055652',
    phone: '0983055652',
    receiptType: 'tuition_full',
    amount: 890000,
    orderTotalAmount: 890000,
    orderRemainingAmount: 0,
    isReconciled: true,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 190382910022',
    status: 'completed',
    createdBy: 'Nguyễn Văn Sale',
    branch: 'Chi nhánh Quận 1',
    createdAt: '10:20 - 18/08/2026',
    updatedAt: '10:20 - 18/08/2026',
    recipientInfo: {
      name: '0983055652',
      phone: '0983055652',
      province: 'Nghệ An',
      district: 'Huyện Quỳnh Lưu',
      ward: 'Xã Quỳnh Diễn',
      address: 'Xóm 2 - Quỳnh diễn - Quỳnh Lưu - Nghệ An',
    },
    placementInfo: {
      classCode: 'CLS-2026-T402',
      className: '[GS-TOAN-48] Toán Tư Duy 1:6 (Nhóm B)',
      schedule: 'Thứ 2 - Thứ 6 (19:30 - 21:00)',
      teacherName: 'Cô Lê Hoàng Mai',
      roomOrFormat: 'Trực tuyến 1:6 (Zoom Room 05)',
      placementStatus: 'assigned',
      startDate: '22/08/2026',
    },
    items: [
      {
        orderCode: 'OD803291',
        studentName: 'Bé Nguyễn Minh Đức',
        packageName: '[Gia sư][TH] Toán Tư Duy 1:6 (48 buổi + 4 buổi ôn tập)',
        durationText: '48 (Buổi)',
        convertedSessions: '24 (Buổi)',
        allocatedAmount: 890000,
        orderTotalAmount: 890000,
        orderRemainingAmount: 0,
      },
    ],
    totalConvertedAmount: 890000,
    shippingNote: '',
    operationNote: 'Phiếu thu thanh toán cho đơn hàng OD803291',
    notes: 'Phiếu thu thanh toán cho đơn hàng OD803291',
  },
  {
    id: 'rcpt-001',
    code: 'TNX00000273948',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9230, OD-DRAFT-9231',
    studentName: 'Bé An, Bé Bình',
    parentName: 'Nguyễn Thu Hà',
    phone: '0912345678',
    receiptType: 'tuition_full',
    amount: 33000000,
    orderTotalAmount: 33000000,
    orderRemainingAmount: 0,
    isReconciled: true,
    items: [
      {
        orderCode: 'OD-DRAFT-9230',
        studentName: 'Bé An',
        packageName: 'Gói SuperKids 12T',
        durationText: '30 buổi',
        convertedSessions: '30 buổi',
        allocatedAmount: 18000000,
        orderTotalAmount: 18000000,
        orderRemainingAmount: 0,
      },
      {
        orderCode: 'OD-DRAFT-9231',
        studentName: 'Bé Bình',
        packageName: 'Gói Flyers Intensive',
        durationText: '30 buổi',
        convertedSessions: '30 buổi',
        allocatedAmount: 15000000,
        orderTotalAmount: 15000000,
        orderRemainingAmount: 0,
      },
    ],
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '14/08/2026 15:37:57',
    notes: 'Phụ huynh nộp gộp học phí trọn gói 1 năm cho cả 2 bé An và Bình',
  },
  {
    id: 'rcpt-002',
    code: 'TNX00000273949',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9231',
    studentName: 'Bé Bình',
    parentName: 'Nguyễn Thu Hà',
    phone: '0912345678',
    receiptType: 'deposit',
    amount: 5000000,
    orderTotalAmount: 15000000,
    orderRemainingAmount: 10000000,
    isReconciled: true,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '13/08/2026 11:15:20',
    notes: 'Thu cọc giữ chỗ lớp Flyers Intensive',
  },
  {
    id: 'rcpt-003',
    code: 'TNX00000273950',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9234',
    studentName: 'Bé Bảo',
    parentName: 'Hoàng Quốc Việt',
    phone: '0908889999',
    receiptType: 'tuition_full',
    amount: 35000000,
    orderTotalAmount: 35000000,
    orderRemainingAmount: 0,
    isReconciled: true,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 1902888899',
    status: 'completed',
    createdBy: 'Phạm Thị Lan (Kế toán)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '12/08/2026 16:45:00',
    notes: 'Thu 100% học phí trọn gói 1 năm IELTS Junior',
  },
  {
    id: 'rcpt-004',
    code: 'TNX00000273951',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9232',
    studentName: 'Bé Đức',
    parentName: 'Phạm Thị Bích',
    phone: '0933112233',
    receiptType: 'tuition_full',
    amount: 28000000,
    orderTotalAmount: 28000000,
    orderRemainingAmount: 0,
    isReconciled: false,
    paymentMethod: 'cash',
    bankAccount: 'Tiền mặt tại quầy',
    status: 'pending',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '12/08/2026 09:30:15',
    notes: 'Phụ huynh nộp tiền mặt tại quầy tân thư - Chờ thủ quỹ xác nhận',
  },
  {
    id: 'rcpt-005',
    code: 'TNX00000273952',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9235',
    studentName: 'Bé Quốc',
    parentName: 'Ngô Tấn Tài',
    phone: '0911223344',
    receiptType: 'deposit',
    amount: 2000000,
    orderTotalAmount: 12000000,
    orderRemainingAmount: 10000000,
    isReconciled: true,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '11/08/2026 15:20:44',
    notes: 'Cọc giữ ưu đãi 2.000.000đ cho gói SuperKids 6T',
  },
  {
    id: 'rcpt-006',
    code: 'TNX00000273953',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9236',
    studentName: 'Bé Hà',
    parentName: 'Bùi Phương Thảo',
    phone: '0955443322',
    receiptType: 'deposit',
    amount: 3000000,
    orderTotalAmount: 20000000,
    orderRemainingAmount: 17000000,
    isReconciled: false,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'pending',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '12/08/2026 13:00:10',
    notes: 'Phụ huynh chuyển khoản giữ chỗ 24h - Chờ đối soát giao dịch ngân hàng',
  },
  {
    id: 'rcpt-007',
    code: 'TNX00000273954',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9241',
    studentName: 'Bé Huy',
    parentName: 'Ngô Hoàng Việt',
    phone: '0938887766',
    receiptType: 'tuition_full',
    amount: 17000000,
    orderTotalAmount: 17000000,
    orderRemainingAmount: 0,
    isReconciled: true,
    paymentMethod: 'pos_card',
    bankAccount: 'POS Vietcombank - 0451000',
    status: 'completed',
    createdBy: 'Lê Hoàng Nam (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '10/08/2026 10:10:00',
    notes: 'Cà thẻ POS thành công học phí lớp Kindy 1N',
  },
  {
    id: 'rcpt-008',
    code: 'TNX00000273955',
    transactionType: 'payment_voucher',
    orderCode: 'OD-DRAFT-9245',
    studentName: 'Bé Nam',
    parentName: 'Vũ Thị Thanh',
    phone: '0966554433',
    receiptType: 'refund',
    amount: 1500000,
    orderTotalAmount: 12000000,
    orderRemainingAmount: 0,
    isReconciled: true,
    paymentMethod: 'bank_transfer',
    bankAccount: 'VietinBank - 1020088899',
    status: 'completed',
    createdBy: 'Phạm Thị Lan (Kế toán)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '09/08/2026 14:20:00',
    notes: 'Hoàn phí cọc giữ chỗ do trung tâm dời lịch khai giảng - Đã chuyển khoản thành công',
  },
  {
    id: 'rcpt-009',
    code: 'TNX00000273956',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9242',
    studentName: 'Bé Tâm',
    parentName: 'Cao Thị Dung',
    phone: '0979998877',
    receiptType: 'deposit',
    amount: 10000000,
    orderTotalAmount: 38000000,
    orderRemainingAmount: 28000000,
    isReconciled: true,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 1902888899',
    status: 'completed',
    createdBy: 'Nguyễn Văn Hùng (Sales Manager)',
    branch: 'Chi nhánh Quận 7',
    createdAt: '09/08/2026 14:00:18',
    notes: 'Thu cọc 10 triệu lớp IELTS Special',
  },
  {
    id: 'rcpt-010',
    code: 'TNX00000273957',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9239',
    studentName: 'Bé Phúc',
    parentName: 'Nguyễn Thanh Tùng',
    phone: '0978889900',
    receiptType: 'installment',
    amount: 6000000,
    orderTotalAmount: 18000000,
    orderRemainingAmount: 12000000,
    isReconciled: false,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'pending',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Thảo Điền',
    createdAt: '08/08/2026 16:00:00',
    notes: 'Thu kỳ 1/3 gói trả góp Kindy Mẫu giáo 1N - Chờ xác nhận',
  },
  {
    id: 'rcpt-011',
    code: 'TNX00000273958',
    transactionType: 'payment_voucher',
    orderCode: 'OD-DRAFT-9248',
    studentName: 'Bé Minh',
    parentName: 'Trương Ngọc Ánh',
    phone: '0909887766',
    receiptType: 'refund',
    amount: 3000000,
    orderTotalAmount: 16000000,
    orderRemainingAmount: 0,
    isReconciled: true,
    paymentMethod: 'cash',
    bankAccount: 'Tiền mặt tại quầy',
    status: 'completed',
    createdBy: 'Phạm Thị Lan (Kế toán)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '07/08/2026 15:10:00',
    notes: 'Chi hoàn học phí do phụ huynh chuyển công tác sang tỉnh khác - Đã chi tiền mặt',
  },
  {
    id: 'rcpt-012',
    code: 'TNX00000273959',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9240',
    studentName: 'Bé Mai',
    parentName: 'Trịnh Kim Chi',
    phone: '0903332211',
    receiptType: 'deposit',
    amount: 9500000,
    orderTotalAmount: 19000000,
    orderRemainingAmount: 9500000,
    isReconciled: false,
    paymentMethod: 'cash',
    bankAccount: 'Tiền mặt tại quầy',
    status: 'pending',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 7',
    createdAt: '07/08/2026 09:45:12',
    notes: 'Thu cọc 50% tiền mặt giữ suất ưu đãi khai giảng',
  },
  {
    id: 'rcpt-013',
    code: 'TNX00000273960',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9238',
    studentName: 'Bé Trang',
    parentName: 'Đỗ Thị Hương',
    phone: '0934445566',
    receiptType: 'deposit',
    amount: 8250000,
    orderTotalAmount: 16500000,
    orderRemainingAmount: 8250000,
    isReconciled: true,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '06/08/2026 11:30:00',
    notes: 'Cọc 50% học phí gói SuperKids 1N',
  },
  {
    id: 'rcpt-014',
    code: 'TNX00000273961',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9233',
    studentName: 'Bé Linh',
    parentName: 'Phạm Thị Bích',
    phone: '0933112233',
    receiptType: 'event_fee',
    amount: 300000,
    orderTotalAmount: 300000,
    orderRemainingAmount: 0,
    isReconciled: true,
    paymentMethod: 'cash',
    bankAccount: 'Tiền mặt tại quầy',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '05/08/2026 15:00:00',
    notes: 'Phí đăng ký thi thử & bộ quà tặng trải nghiệm',
  },
  {
    id: 'rcpt-015',
    code: 'TNX00000273962',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9246',
    studentName: 'Bé Vy',
    parentName: 'Đặng Thanh Thủy',
    phone: '0977665544',
    receiptType: 'deposit',
    amount: 1000000,
    orderTotalAmount: 15000000,
    orderRemainingAmount: 15000000,
    isReconciled: false,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'cancelled',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '03/08/2026 14:15:00',
    notes: 'Hủy phiếu do giao dịch QR lỗi không trùng khớp số tiền',
  },
  {
    id: 'rcpt-016',
    code: 'TNX00000273963',
    transactionType: 'receipt',
    orderCode: 'OD-DRAFT-9247',
    studentName: 'Bé Hùng',
    parentName: 'Phạm Hoàng Long',
    phone: '0919998888',
    receiptType: 'tuition_full',
    amount: 24000000,
    orderTotalAmount: 24000000,
    orderRemainingAmount: 0,
    isReconciled: true,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 1902888899',
    status: 'completed',
    createdBy: 'Lê Hoàng Nam (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '02/08/2026 16:30:00',
    notes: 'Thu trọn gói khóa giao tiếp 12 tháng',
  },
]

