export type DeliveryMethod = 'pickup' | 'shipping'

export type FulfillmentStatus = 'pending_handover' | 'shipping' | 'handed_over' | 'returned'

export type FulfillmentProductCategory =
  | 'textbook'
  | 'learning_material'
  | 'gift'
  | 'uniform'
  | 'kit'

export interface FulfillmentProduct {
  id: string
  name: string
  category: FulfillmentProductCategory
  quantity: number
  unit: string
}

export type PaymentStatus = 'paid' | 'partially_paid' | 'unpaid'

export interface FulfillmentAttachment {
  id: string
  name: string
  url?: string
  type: 'image' | 'document'
  size?: string
  uploadedAt?: string
}

export interface OrderFulfillmentRecord {
  id: string
  orderNo: string
  coursePackageName?: string
  paymentStatus?: PaymentStatus
  customerName: string
  customerPhone: string
  studentName: string
  branch: string
  deliveryMethod: DeliveryMethod
  shippingAddress?: string
  recipientName?: string
  recipientPhone?: string
  recipientRole?: string
  status: FulfillmentStatus
  products: FulfillmentProduct[]
  carrier?: string
  trackingCode?: string
  trackingUrl?: string
  shipperName?: string
  shipperPhone?: string
  completedAt?: string
  slaHours?: number
  handoverDate?: string
  handoverBy?: string
  notes?: string
  podImages?: string[]
  attachments?: FulfillmentAttachment[]
  createdAt: string
}

export const PAYMENT_STATUS_MAP: Record<PaymentStatus, string> = {
  paid: 'Đã thu 100%',
  partially_paid: 'Cọc 50%',
  unpaid: 'Chưa thu',
}

export const FULFILLMENT_STATUS_MAP: Record<FulfillmentStatus, string> = {
  pending_handover: 'Chờ bàn giao',
  shipping: 'Đang giao',
  handed_over: 'Đã bàn giao',
  returned: 'Trả lại',
}

export const DELIVERY_METHOD_MAP: Record<DeliveryMethod, string> = {
  pickup: 'Nhận tại cơ sở',
  shipping: 'Giao tận nơi',
}

export const PRODUCT_CATEGORY_MAP: Record<FulfillmentProductCategory, string> = {
  textbook: 'Giáo trình',
  learning_material: 'Học liệu',
  gift: 'Quà tặng',
  uniform: 'Đồng phục',
  kit: 'Bộ kit',
}

export const mockOrderFulfillments: OrderFulfillmentRecord[] = [
  {
    id: 'DLV-2026-001',
    orderNo: 'OD832001',
    coursePackageName: 'IELTS Foundation 4.0 (Gói 6T)',
    paymentStatus: 'paid',
    customerName: 'Nguyễn Thị Hoa',
    customerPhone: '0983055652',
    studentName: 'Nguyễn Hoàng Long',
    branch: 'RinoEdu Nguyễn Tuân',
    deliveryMethod: 'pickup',
    recipientName: 'Nguyễn Thị Hoa',
    recipientPhone: '0983055652',
    recipientRole: 'Mẹ học viên',
    status: 'handed_over',
    products: [
      { id: 'prd-01', name: 'Giáo trình IELTS Foundation 4.0 (Bộ 2 tập)', category: 'textbook', quantity: 1, unit: 'Bộ' },
      { id: 'prd-02', name: 'Balo RinoEdu Standard 2026', category: 'gift', quantity: 1, unit: 'Cái' },
    ],
    handoverDate: '15:20 - 26/08/2026',
    completedAt: '15:20 - 26/08/2026',
    slaHours: 18,
    handoverBy: 'Thu Hà (Lễ tân)',
    podImages: ['https://images.unsplash.com/photo-1554415707-9e4466b88738?w=500&auto=format&fit=crop&q=80'],
    attachments: [
      { id: 'att-01', name: 'Bien_ban_ban_giao_DLV001.pdf', type: 'document', size: '240 KB', uploadedAt: '15:20 - 26/08/2026' }
    ],
    notes: 'Phụ huynh đến quầy nhận trực tiếp trước buổi học đầu tiên',
    createdAt: '10:00 - 25/08/2026',
  },
  {
    id: 'DLV-2026-002',
    orderNo: 'OD804102',
    coursePackageName: 'Toán Tư Duy 1:6 (Kèm cặp cá nhân)',
    paymentStatus: 'paid',
    customerName: 'Phạm Văn Long',
    customerPhone: '0988112233',
    studentName: 'Bé Phạm Khánh Linh',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'shipping',
    shippingAddress: 'Tòa Landmark 2, 208 Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM',
    recipientName: 'Anh Long',
    recipientPhone: '0988112233',
    recipientRole: 'Bố học viên',
    status: 'shipping',
    products: [
      { id: 'prd-03', name: 'Bộ Kit Toán Tư Duy Cấp 1 (Bộ ghép khối 3D)', category: 'kit', quantity: 1, unit: 'Bộ' },
      { id: 'prd-04', name: 'Sách bài tập Toán Tư Duy 1:6', category: 'textbook', quantity: 1, unit: 'Cuốn' },
    ],
    carrier: 'GHTK',
    trackingCode: 'GHTK-HCM-9823192',
    trackingUrl: 'https://ghtk.vn',
    shipperName: 'Nguyễn Văn Hùng (GHTK)',
    shipperPhone: '0901238899',
    slaHours: 22,
    notes: 'Giao giờ hành chính, gọi trước khi giao 15 phút',
    createdAt: '14:30 - 26/08/2026',
  },
  {
    id: 'DLV-2026-003',
    orderNo: 'OD-2026-8821',
    coursePackageName: 'Tiếng Anh Starters Toàn Diện',
    paymentStatus: 'paid',
    customerName: 'Nguyễn Thị Lý',
    customerPhone: '0356105256',
    studentName: 'Bé Nguyễn Minh Anh',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'pickup',
    recipientName: 'Chị Lý',
    recipientPhone: '0356105256',
    recipientRole: 'Phụ huynh',
    status: 'pending_handover',
    products: [
      { id: 'prd-05', name: 'Bộ Flashcard Từ vựng Tiếng Anh Starters 200 thẻ', category: 'learning_material', quantity: 1, unit: 'Hộp' },
      { id: 'prd-06', name: 'Áo đồng phục RinoEdu Size S', category: 'uniform', quantity: 1, unit: 'Áo' },
    ],
    slaHours: 12,
    handoverBy: 'Thanh Nga (CSM)',
    notes: 'Hẹn lấy quà tặng và đồng phục vào ca học chiều thứ 7',
    createdAt: '11:15 - 27/08/2026',
  },
  {
    id: 'DLV-2026-004',
    orderNo: 'OD-DRAFT-9230',
    coursePackageName: 'SuperKids 12T (Combo 1 năm)',
    paymentStatus: 'partially_paid',
    customerName: 'Nguyễn Thu Hà',
    customerPhone: '0912345678',
    studentName: 'Bé An',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'pickup',
    recipientName: 'Nguyễn Thu Hà',
    recipientPhone: '0912345678',
    recipientRole: 'Mẹ học viên',
    status: 'pending_handover',
    products: [
      { id: 'prd-07', name: 'Bộ Giáo trình SuperKids 12T (Student Book + Workbook)', category: 'textbook', quantity: 1, unit: 'Bộ' },
    ],
    slaHours: 36,
    handoverBy: 'Thu Hà (Lễ tân)',
    notes: 'Chờ phụ huynh hoàn tất đóng tiền cọc đợt 2 trước khi lấy sách',
    createdAt: '09:00 - 28/08/2026',
  },
  {
    id: 'DLV-2026-005',
    orderNo: 'OD-DRAFT-9232',
    coursePackageName: 'Movers Bán Trú 1N',
    paymentStatus: 'paid',
    customerName: 'Phạm Thị Bích',
    customerPhone: '0933112233',
    studentName: 'Bé Đức',
    branch: 'RinoEdu Nguyễn Tuân',
    deliveryMethod: 'shipping',
    shippingAddress: 'Số 25 Linh Đàm, Hoàng Liệt, Hoàng Mai, Hà Nội',
    recipientName: 'Chị Bích',
    recipientPhone: '0933112233',
    recipientRole: 'Phụ huynh',
    status: 'handed_over',
    products: [
      { id: 'prd-08', name: 'Giáo trình Movers Bán Trú 1N', category: 'textbook', quantity: 1, unit: 'Bộ' },
      { id: 'prd-09', name: 'Bộ Hộp Bút & Dụng cụ học tập RinoEdu', category: 'gift', quantity: 1, unit: 'Set' },
    ],
    carrier: 'Viettel Post',
    trackingCode: 'VTP-HN-88120019',
    trackingUrl: 'https://viettelpost.vn',
    shipperName: 'Phạm Đức Thắng (VTP)',
    shipperPhone: '0981223344',
    handoverDate: '10:00 - 28/08/2026',
    completedAt: '10:00 - 28/08/2026',
    slaHours: 19,
    handoverBy: 'Bưu tá Viettel Post',
    podImages: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80'],
    attachments: [
      { id: 'att-02', name: 'Phieu_giao_hang_VTP.pdf', type: 'document', size: '310 KB', uploadedAt: '10:00 - 28/08/2026' }
    ],
    notes: 'Đã phát thành công và ký nhận',
    createdAt: '15:20 - 27/08/2026',
  },
  {
    id: 'DLV-2026-006',
    orderNo: 'OD-DRAFT-9235',
    coursePackageName: 'SuperKids 6T Bổ trợ',
    paymentStatus: 'paid',
    customerName: 'Đỗ Thị Lan Hương',
    customerPhone: '0918889922',
    studentName: 'Bé Quốc',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'pickup',
    recipientName: 'Anh Tài',
    recipientPhone: '0911223344',
    recipientRole: 'Bố học viên',
    status: 'pending_handover',
    products: [
      { id: 'prd-10', name: 'Tài liệu bổ trợ SuperKids 6T', category: 'textbook', quantity: 1, unit: 'Cuốn' },
    ],
    slaHours: 40,
    handoverBy: 'Minh Thư (Lễ tân)',
    notes: 'Sách đã về quầy lễ tân cơ sở, chờ phụ huynh tới nhận',
    createdAt: '08:45 - 29/08/2026',
  },
  {
    id: 'DLV-2026-007',
    orderNo: 'OD-DRAFT-9236',
    coursePackageName: 'Kindy Mẫu giáo 12T',
    paymentStatus: 'paid',
    customerName: 'Bùi Phương Thảo',
    customerPhone: '0955443322',
    studentName: 'Bé Hà',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'shipping',
    shippingAddress: 'Số 88 Nguyễn Tuân, Thanh Xuân Trung, Hà Nội',
    recipientName: 'Chị Thảo',
    recipientPhone: '0955443322',
    recipientRole: 'Mẹ học viên',
    status: 'shipping',
    products: [
      { id: 'prd-11', name: 'Sách tranh Song ngữ Kindy Mẫu giáo 12T', category: 'textbook', quantity: 2, unit: 'Cuốn' },
      { id: 'prd-12', name: 'Gấu bông Linh vật Rino Star', category: 'gift', quantity: 1, unit: 'Con' },
    ],
    carrier: 'Shopee Xpress',
    trackingCode: 'SPX-VN-3399120',
    trackingUrl: 'https://spx.vn',
    shipperName: 'Trần Văn Nam (SPX)',
    shipperPhone: '0933445566',
    slaHours: 20,
    notes: 'Đang luân chuyển qua bưu cục phát',
    createdAt: '16:00 - 28/08/2026',
  },
  {
    id: 'DLV-2026-008',
    orderNo: 'OD-DRAFT-9239',
    coursePackageName: 'Kindy 1N (Kỳ 2)',
    paymentStatus: 'paid',
    customerName: 'Nguyễn Thanh Tùng',
    customerPhone: '0978889900',
    studentName: 'Bé Phúc',
    branch: 'RinoEdu Smart City',
    deliveryMethod: 'pickup',
    recipientName: 'Anh Tùng',
    recipientPhone: '0978889900',
    recipientRole: 'Bố học viên',
    status: 'handed_over',
    products: [
      { id: 'prd-13', name: 'Giáo trình Kindy 1N (Tập 2)', category: 'textbook', quantity: 1, unit: 'Cuốn' },
    ],
    handoverDate: '11:00 - 29/08/2026',
    completedAt: '11:00 - 29/08/2026',
    slaHours: 21,
    handoverBy: 'Lan Anh (Lễ tân)',
    notes: 'Bàn giao khi phụ huynh nộp phí kỳ 2',
    createdAt: '14:10 - 28/08/2026',
  },
  {
    id: 'DLV-2026-009',
    orderNo: 'OD-DRAFT-9241',
    coursePackageName: 'Kindy Mẫu giáo tập 1',
    paymentStatus: 'unpaid',
    customerName: 'Trần Minh Đức',
    customerPhone: '0903334455',
    studentName: 'Bé Trang',
    branch: 'RinoEdu Nguyễn Tuân',
    deliveryMethod: 'pickup',
    recipientName: 'Anh Đức',
    recipientPhone: '0903334455',
    recipientRole: 'Phụ huynh',
    status: 'pending_handover',
    products: [
      { id: 'prd-14', name: 'Bộ bút chì màu & Vở vẽ tư duy', category: 'learning_material', quantity: 1, unit: 'Hộp' },
      { id: 'prd-15', name: 'Sách Kindy Mẫu giáo tập 1', category: 'textbook', quantity: 1, unit: 'Cuốn' },
    ],
    slaHours: 14,
    handoverBy: 'Bảo Ngọc (Lễ tân)',
    notes: 'Học sinh mới đăng ký, chờ lớp khai giảng để phát tại bàn',
    createdAt: '10:30 - 30/08/2026',
  },
  {
    id: 'DLV-2026-010',
    orderNo: 'OD-DRAFT-9242',
    coursePackageName: 'IELTS Special 2026',
    paymentStatus: 'paid',
    customerName: 'Lê Hoàng Nam',
    customerPhone: '0944556677',
    studentName: 'Bé Nam',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'shipping',
    shippingAddress: 'Căn hộ B12-04 Sunrise City, Quận 7, TP.HCM',
    recipientName: 'Anh Nam',
    recipientPhone: '0944556677',
    recipientRole: 'Bố học viên',
    status: 'returned',
    products: [
      { id: 'prd-16', name: 'Bộ đề luyện thi IELTS Special 2026', category: 'textbook', quantity: 1, unit: 'Bộ' },
    ],
    carrier: 'GHTK',
    trackingCode: 'GHTK-HCM-1122334',
    trackingUrl: 'https://ghtk.vn',
    shipperName: 'Lê Văn Tài (GHTK)',
    shipperPhone: '0912998877',
    slaHours: 52,
    notes: 'Không liên lạc được người nhận sau 3 lần gọi, bưu tá lưu kho chờ xác nhận lại SĐT',
    createdAt: '09:15 - 29/08/2026',
  },
  {
    id: 'DLV-2026-011',
    orderNo: 'OD-DRAFT-9245',
    coursePackageName: 'IELTS Junior 1N',
    paymentStatus: 'partially_paid',
    customerName: 'Hoàng Mai Phương',
    customerPhone: '0966778899',
    studentName: 'Bé Tuấn',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'pickup',
    recipientName: 'Chị Phương',
    recipientPhone: '0966778899',
    recipientRole: 'Mẹ học viên',
    status: 'pending_handover',
    products: [
      { id: 'prd-17', name: 'Bình nước giữ nhiệt RinoEdu Eco', category: 'gift', quantity: 1, unit: 'Cái' },
      { id: 'prd-18', name: 'Giáo trình IELTS Junior 1N', category: 'textbook', quantity: 1, unit: 'Bộ' },
    ],
    slaHours: 16,
    handoverBy: 'Thu Hà (Lễ tân)',
    notes: 'Đã chuẩn bị sẵn tại tủ lưu kho cơ sở',
    createdAt: '15:40 - 30/08/2026',
  },
  {
    id: 'DLV-2026-012',
    orderNo: 'OD-DRAFT-9248',
    coursePackageName: 'STEM Robotics Jr & Tiếng Anh',
    paymentStatus: 'paid',
    customerName: 'Vũ Quốc Huy',
    customerPhone: '0977889911',
    studentName: 'Bé Huy',
    branch: 'RinoEdu Smart City',
    deliveryMethod: 'shipping',
    shippingAddress: 'Biệt thự 45 Thảo Điền, Thành phố Thủ Đức, TP.HCM',
    recipientName: 'Anh Huy',
    recipientPhone: '0977889911',
    recipientRole: 'Bố học viên',
    status: 'handed_over',
    products: [
      { id: 'prd-19', name: 'Bộ học liệu tương tác STEM Robotics Jr', category: 'kit', quantity: 1, unit: 'Bộ' },
      { id: 'prd-20', name: 'Áo thun polo RinoEdu Leader', category: 'uniform', quantity: 1, unit: 'Áo' },
    ],
    carrier: 'Ahamove',
    trackingCode: 'AHA-HCM-554411',
    trackingUrl: 'https://ahamove.com',
    shipperName: 'Trần Bác Nam (Ahamove)',
    shipperPhone: '0909112233',
    handoverDate: '16:00 - 30/08/2026',
    completedAt: '16:00 - 30/08/2026',
    slaHours: 3,
    handoverBy: 'Tài xế Ahamove',
    notes: 'Giao siêu tốc 2h theo yêu cầu phụ huynh',
    createdAt: '13:00 - 30/08/2026',
  },
]

export function getInitialOrderFulfillments(): OrderFulfillmentRecord[] {
  return mockOrderFulfillments
}
