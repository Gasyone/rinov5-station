export type ReceiptType =
  | 'tuition_full'
  | 'deposit'
  | 'installment'
  | 'event_fee'
  | 'other'

export type PaymentMethod =
  | 'qr_transfer'
  | 'cash'
  | 'pos_card'
  | 'bank_transfer'

export type ReceiptStatus =
  | 'completed'
  | 'pending_verification'
  | 'cancelled'
  | 'refunded'

export interface PaymentReceipt {
  id: string
  code: string // Mã phiếu thu (e.g. PT-2026-0801)
  orderCode: string // Mã đơn hàng liên quan (e.g. OD-DRAFT-9230)
  studentName: string // Tên học viên
  parentName: string // Người nộp tiền (Phụ huynh)
  phone: string // Số điện thoại liên hệ
  receiptType: ReceiptType // Loại khoản thu (cọc, học phí, trả góp...)
  amount: number // Số tiền thu (VND)
  paymentMethod: PaymentMethod // Hình thức thanh toán (QR, tiền mặt, POS)
  bankAccount?: string // Tài khoản thụ hưởng (nếu ck/QR)
  status: ReceiptStatus // Trạng thái phiếu thu
  createdBy: string // Nhân viên lập phiếu
  branch: string // Chi nhánh trung tâm
  createdAt: string // Ngày giờ lập phiếu (e.g. 12/08 14:30)
  notes?: string // Ghi chú phiếu thu
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
  dueDate: string
  branch: string
  notes?: string
}

export const RECEIPT_TYPE_MAP: Record<ReceiptType, { label: string; class: string }> = {
  tuition_full: { label: 'Thu đủ học phí', class: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  deposit: { label: 'Cọc giữ chỗ', class: 'bg-amber-50 text-amber-800 border-amber-200' },
  installment: { label: 'Thanh toán kỳ trả góp', class: 'bg-sky-50 text-sky-800 border-sky-200' },
  event_fee: { label: 'Phí sự kiện/Thi thử', class: 'bg-purple-50 text-purple-800 border-purple-200' },
  other: { label: 'Khoản thu khác', class: 'bg-slate-50 text-slate-800 border-slate-200' },
}

export const PAYMENT_METHOD_MAP: Record<PaymentMethod, string> = {
  qr_transfer: 'Chuyển khoản QR',
  cash: 'Tiền mặt',
  pos_card: 'Cà thẻ POS',
  bank_transfer: 'Chuyển khoản Ngân hàng',
}

export const RECEIPT_STATUS_MAP: Record<ReceiptStatus, { label: string; class: string }> = {
  completed: { label: 'Đã thu tiền', class: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300' },
  pending_verification: { label: 'Chờ đối soát', class: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300' },
  cancelled: { label: 'Đã hủy phiếu', class: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300' },
  refunded: { label: 'Đã hoàn tiền', class: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300' },
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
    dueDate: '22/08/2026',
    branch: 'Chi nhánh Quận 7',
    notes: 'Thu học phí còn nợ đợt 2',
  },
]

export const mockPaymentReceipts: PaymentReceipt[] = [
  {
    id: 'rcpt-001',
    code: 'PT-2026-0801',
    orderCode: 'OD-DRAFT-9230',
    studentName: 'Bé An',
    parentName: 'Nguyễn Thu Hà',
    phone: '0912345678',
    receiptType: 'deposit',
    amount: 5000000,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '12/08 14:30',
    notes: 'Thu cọc 50% gói học SuperKids 12T cho bé An',
  },
  {
    id: 'rcpt-002',
    code: 'PT-2026-0802',
    orderCode: 'OD-DRAFT-9231',
    studentName: 'Bé Bình',
    parentName: 'Nguyễn Thu Hà',
    phone: '0912345678',
    receiptType: 'deposit',
    amount: 5000000,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '12/08 11:15',
    notes: 'Thu cọc giữ chỗ lớp Flyers Intensive',
  },
  {
    id: 'rcpt-003',
    code: 'PT-2026-0803',
    orderCode: 'OD-DRAFT-9234',
    studentName: 'Bé Bảo',
    parentName: 'Hoàng Quốc Việt',
    phone: '0908889999',
    receiptType: 'tuition_full',
    amount: 35000000,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 1902888899',
    status: 'completed',
    createdBy: 'Phạm Thị Lan (Kế toán)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '11/08 16:45',
    notes: 'Thu 100% học phí trọn gói 1 năm IELTS Junior',
  },
  {
    id: 'rcpt-004',
    code: 'PT-2026-0804',
    orderCode: 'OD-DRAFT-9232',
    studentName: 'Bé Đức',
    parentName: 'Phạm Thị Bích',
    phone: '0933112233',
    receiptType: 'tuition_full',
    amount: 28000000,
    paymentMethod: 'cash',
    status: 'pending_verification',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '12/08 09:30',
    notes: 'Phụ huynh nộp tiền mặt tại quầy tân thư',
  },
  {
    id: 'rcpt-005',
    code: 'PT-2026-0805',
    orderCode: 'OD-DRAFT-9235',
    studentName: 'Bé Quốc',
    parentName: 'Ngô Tấn Tài',
    phone: '0911223344',
    receiptType: 'deposit',
    amount: 2000000,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '11/08 15:20',
    notes: 'Cọc giữ ưu đãi 2.000.000đ cho gói SuperKids 6T',
  },
  {
    id: 'rcpt-006',
    code: 'PT-2026-0806',
    orderCode: 'OD-DRAFT-9236',
    studentName: 'Bé Hà',
    parentName: 'Bùi Phương Thảo',
    phone: '0955443322',
    receiptType: 'deposit',
    amount: 3000000,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'pending_verification',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '12/08 13:00',
    notes: 'Phụ huynh chuyển khoản giữ chỗ 24h',
  },
  {
    id: 'rcpt-007',
    code: 'PT-2026-0807',
    orderCode: 'OD-DRAFT-9241',
    studentName: 'Bé Huy',
    parentName: 'Ngô Hoàng Việt',
    phone: '0938887766',
    receiptType: 'tuition_full',
    amount: 17000000,
    paymentMethod: 'pos_card',
    status: 'completed',
    createdBy: 'Lê Hoàng Nam (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '10/08 10:10',
    notes: 'Cà thẻ POS thành công học phí lớp Kindy 1N',
  },
  {
    id: 'rcpt-008',
    code: 'PT-2026-0808',
    orderCode: 'OD-DRAFT-9242',
    studentName: 'Bé Tâm',
    parentName: 'Cao Thị Dung',
    phone: '0979998877',
    receiptType: 'deposit',
    amount: 10000000,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 1902888899',
    status: 'completed',
    createdBy: 'Nguyễn Văn Hùng (Sales Manager)',
    branch: 'Chi nhánh Quận 7',
    createdAt: '09/08 14:00',
    notes: 'Thu cọc 10 triệu lớp IELTS Special',
  },
  {
    id: 'rcpt-009',
    code: 'PT-2026-0809',
    orderCode: 'OD-DRAFT-9239',
    studentName: 'Bé Phúc',
    parentName: 'Nguyễn Thanh Tùng',
    phone: '0978889900',
    receiptType: 'installment',
    amount: 6000000,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Thảo Điền',
    createdAt: '08/08 16:00',
    notes: 'Thu kỳ 1/3 gói trả góp Kindy Mẫu giáo 1N',
  },
  {
    id: 'rcpt-010',
    code: 'PT-2026-0810',
    orderCode: 'OD-DRAFT-9240',
    studentName: 'Bé Mai',
    parentName: 'Trịnh Kim Chi',
    phone: '0903332211',
    receiptType: 'deposit',
    amount: 9500000,
    paymentMethod: 'cash',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 7',
    createdAt: '07/08 09:45',
    notes: 'Thu cọc 50% tiền mặt giữ suất ưu đãi khai giảng',
  },
  {
    id: 'rcpt-011',
    code: 'PT-2026-0811',
    orderCode: 'OD-DRAFT-9238',
    studentName: 'Bé Trang',
    parentName: 'Đỗ Thị Hương',
    phone: '0934445566',
    receiptType: 'deposit',
    amount: 8250000,
    paymentMethod: 'qr_transfer',
    bankAccount: 'MBBank - 090327988899',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '06/08 11:30',
    notes: 'Cọc 50% học phí gói SuperKids 1N',
  },
  {
    id: 'rcpt-012',
    code: 'PT-2026-0812',
    orderCode: 'OD-DRAFT-9233',
    studentName: 'Bé Linh',
    parentName: 'Phạm Thị Bích',
    phone: '0933112233',
    receiptType: 'event_fee',
    amount: 300000,
    paymentMethod: 'cash',
    status: 'completed',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '05/08 15:00',
    notes: 'Phí đăng ký thi thử & bộ quà tặng trải nghiệm',
  },
  {
    id: 'rcpt-013',
    code: 'PT-2026-0813',
    orderCode: 'OD-DRAFT-9245',
    studentName: 'Bé Nam',
    parentName: 'Vũ Thị Thanh',
    phone: '0966554433',
    receiptType: 'other',
    amount: 500000,
    paymentMethod: 'cash',
    status: 'refunded',
    createdBy: 'Phạm Thị Lan (Kế toán)',
    branch: 'Chi nhánh Quận 1',
    createdAt: '04/08 10:00',
    notes: 'Hoàn phí giữ chỗ do lớp hủy ca',
  },
  {
    id: 'rcpt-014',
    code: 'PT-2026-0814',
    orderCode: 'OD-DRAFT-9246',
    studentName: 'Bé Vy',
    parentName: 'Đặng Thanh Thủy',
    phone: '0977665544',
    receiptType: 'deposit',
    amount: 1000000,
    paymentMethod: 'qr_transfer',
    status: 'cancelled',
    createdBy: 'Trần Thị Mai (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '03/08 14:15',
    notes: 'Hủy phiếu do giao dịch QR lỗi không trùng khớp',
  },
  {
    id: 'rcpt-015',
    code: 'PT-2026-0815',
    orderCode: 'OD-DRAFT-9247',
    studentName: 'Bé Hùng',
    parentName: 'Phạm Hoàng Long',
    phone: '0919998888',
    receiptType: 'tuition_full',
    amount: 24000000,
    paymentMethod: 'bank_transfer',
    bankAccount: 'Techcombank - 1902888899',
    status: 'completed',
    createdBy: 'Lê Hoàng Nam (Sales)',
    branch: 'Chi nhánh Cầu Giấy',
    createdAt: '02/08 16:30',
    notes: 'Thu trọn gói khóa giao tiếp 12 tháng',
  },
]
