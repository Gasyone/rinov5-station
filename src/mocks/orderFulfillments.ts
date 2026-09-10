export type DeliveryMethod = 'pickup' | 'shipping'

export type FulfillmentStatus = 'pending_handover' | 'shipping' | 'handed_over' | 'returned'

export type FulfillmentSourceType =
  | 'order'
  | 'care_gift'
  | 'reward'
  | 'event'
  | 'direct_issue'

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
  sourceType: FulfillmentSourceType
  sourceTitle?: string
  sourceCode?: string
  stockExportCode?: string
  orderNo?: string
  coursePackageName?: string
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
  isClassDelivery?: boolean
  recipientCount?: number
  targetClass?: string
  recipientStudents?: Array<{ id?: string; name: string; phone?: string; parentName?: string }>
}

export const SOURCE_TYPE_MAP: Record<FulfillmentSourceType, string> = {
  order: 'Đơn hàng',
  care_gift: 'Quà tặng CSKH',
  reward: 'Khen thưởng & Đổi quà',
  event: 'Sự kiện & Workshop',
  direct_issue: 'Xuất tại quầy',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-042',
    orderNo: 'OD832001',
    coursePackageName: 'IELTS Foundation 4.0 (Gói 6T)',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-043',
    orderNo: 'OD804102',
    coursePackageName: 'Toán Tư Duy 1:6 (Kèm cặp cá nhân)',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-044',
    orderNo: 'OD-2026-8821',
    coursePackageName: 'Tiếng Anh Starters Toàn Diện',
    customerName: 'Ban đại diện PH Lớp Starters A1',
    customerPhone: '0356105256',
    studentName: 'Cả lớp Starters A1 (18 học viên)',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'pickup',
    recipientName: 'Cô Thanh Nga',
    recipientPhone: '0356105256',
    recipientRole: 'GVCN Lớp Starters A1',
    status: 'pending_handover',
    isClassDelivery: true,
    recipientCount: 18,
    targetClass: 'Lớp Starters A1',
    recipientStudents: [
      { name: 'Bé Nguyễn Minh Anh', parentName: 'Chị Lý', phone: '0356105256' },
      { name: 'Bé Hoàng Bách', parentName: 'Anh Tuấn', phone: '0912347788' },
      { name: 'Bé Gia Hưng', parentName: 'Chị Vy', phone: '0938123456' },
      { name: 'Bé Trí Dũng', parentName: 'Chị Oanh', phone: '0977665544' },
      { name: 'Bé Tuấn Minh', parentName: 'Chị Chi', phone: '0988554433' },
      { name: 'Bé Võ Minh Châu', parentName: 'Anh Châu', phone: '0944118822' },
      { name: 'Bé Phạm Khánh Linh', parentName: 'Anh Long', phone: '0988112233' },
      { name: 'Bé Nguyễn Hoàng Long', parentName: 'Chị Hoa', phone: '0983055652' },
    ],
    products: [
      { id: 'prd-05', name: 'Bộ Flashcard Từ vựng Tiếng Anh Starters 200 thẻ', category: 'learning_material', quantity: 18, unit: 'Hộp' },
      { id: 'prd-06', name: 'Áo đồng phục RinoEdu Size S', category: 'uniform', quantity: 18, unit: 'Áo' },
    ],
    slaHours: 12,
    handoverBy: 'Thanh Nga (CSM)',
    notes: 'Phát trực tiếp tại lớp cho toàn bộ 18 học viên vào ca học chiều thứ 7',
    createdAt: '11:15 - 27/08/2026',
  },
  {
    id: 'DLV-2026-004',
    sourceType: 'order',
    stockExportCode: 'PXK-2026-045',
    orderNo: 'OD-9230',
    coursePackageName: 'SuperKids 12T (Combo 1 năm)',
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
    notes: 'Chờ phụ huynh xác nhận thời gian đến nhận sách',
    createdAt: '09:00 - 28/08/2026',
  },
  {
    id: 'DLV-2026-005',
    sourceType: 'order',
    stockExportCode: 'PXK-2026-046',
    orderNo: 'OD-9232',
    coursePackageName: 'Movers Bán Trú 1N',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-047',
    orderNo: 'OD-9235',
    coursePackageName: 'SuperKids 6T Bổ trợ',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-048',
    orderNo: 'OD-9236',
    coursePackageName: 'Kindy Mẫu giáo 12T',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-049',
    orderNo: 'OD-9239',
    coursePackageName: 'Kindy 1N (Kỳ 2)',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-050',
    orderNo: 'OD-9241',
    coursePackageName: 'Kindy Mẫu giáo tập 1',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-051',
    orderNo: 'OD-9242',
    coursePackageName: 'IELTS Special 2026',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-052',
    orderNo: 'OD-9245',
    coursePackageName: 'IELTS Junior 1N',
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
    sourceType: 'order',
    stockExportCode: 'PXK-2026-053',
    orderNo: 'OD-9248',
    coursePackageName: 'STEM Robotics Jr & Tiếng Anh',
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
  // ─── CÁC BẢN GHI BÀN GIAO QUÀ TẶNG KHÔNG CÓ ĐƠN HÀNG ─────────────────────────
  {
    id: 'DLV-2026-013',
    sourceType: 'care_gift',
    sourceCode: 'CSKH-2026-015',
    sourceTitle: 'Quà sinh nhật học viên T08',
    stockExportCode: 'PXK-2026-088',
    customerName: 'Trịnh Thúy Vy',
    customerPhone: '0938123456',
    studentName: 'Bé Gia Hưng',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'pickup',
    recipientName: 'Chị Vy',
    recipientPhone: '0938123456',
    recipientRole: 'Mẹ học viên',
    status: 'pending_handover',
    products: [
      { id: 'prd-21', name: 'Gấu bông RinoEdu & Thiệp mừng sinh nhật', category: 'gift', quantity: 1, unit: 'Bộ' },
      { id: 'prd-22', name: 'Bình nước giữ nhiệt RinoEdu Eco', category: 'gift', quantity: 1, unit: 'Cái' },
    ],
    slaHours: 12,
    handoverBy: 'Hồng Hạnh (CSM)',
    notes: 'Quà sinh nhật học viên tròn 8 tuổi từ phòng CSKH',
    createdAt: '09:00 - 30/08/2026',
  },
  {
    id: 'DLV-2026-014',
    sourceType: 'reward',
    sourceCode: 'REW-2026-104',
    sourceTitle: 'Đổi 50 sao học tập xuất sắc T08',
    stockExportCode: 'PXK-2026-091',
    customerName: 'Hoàng Quốc Tuấn',
    customerPhone: '0912347788',
    studentName: 'Bé Hoàng Bách',
    branch: 'RinoEdu Nguyễn Tuân',
    deliveryMethod: 'pickup',
    recipientName: 'Bé Hoàng Bách',
    recipientPhone: '0912347788',
    recipientRole: 'Học viên',
    status: 'pending_handover',
    products: [
      { id: 'prd-23', name: 'Balo RinoEdu Standard 2026', category: 'gift', quantity: 1, unit: 'Cái' },
    ],
    slaHours: 8,
    handoverBy: 'Bảo Ngọc (Lễ tân)',
    notes: 'Học sinh tích lũy đủ 50 sao thi đua đổi quà tại quầy cơ sở',
    createdAt: '11:20 - 30/08/2026',
  },
  {
    id: 'DLV-2026-015',
    sourceType: 'event',
    sourceCode: 'EVT-2026-008',
    sourceTitle: 'Workshop STEM Robot Day 2026',
    stockExportCode: 'PXK-2026-092',
    customerName: 'Nguyễn Thị Oanh',
    customerPhone: '0977665544',
    studentName: 'Bé Trí Dũng',
    branch: 'RinoEdu Smart City',
    deliveryMethod: 'pickup',
    recipientName: 'Nguyễn Thị Oanh',
    recipientPhone: '0977665544',
    recipientRole: 'Phụ huynh',
    status: 'handed_over',
    products: [
      { id: 'prd-24', name: 'Bộ lắp ráp xe năng lượng mặt trời mini', category: 'kit', quantity: 1, unit: 'Bộ' },
      { id: 'prd-25', name: 'Áo thun sự kiện Open Day', category: 'uniform', quantity: 1, unit: 'Áo' },
    ],
    handoverDate: '16:30 - 29/08/2026',
    completedAt: '16:30 - 29/08/2026',
    slaHours: 4,
    handoverBy: 'Minh Thư (Lễ tân)',
    podImages: ['https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=80'],
    notes: 'Trao quà lưu niệm bốc thăm trúng thưởng trong ngày hội trải nghiệm',
    createdAt: '14:00 - 29/08/2026',
  },
  {
    id: 'DLV-2026-016',
    sourceType: 'care_gift',
    sourceCode: 'CSKH-2026-022',
    sourceTitle: 'Tri ân phụ huynh gắn bó 2 năm',
    stockExportCode: 'PXK-2026-093',
    customerName: 'Đặng Mai Chi',
    customerPhone: '0988554433',
    studentName: 'Bé Đặng Tuấn Minh',
    branch: 'RinoEdu Linh Đàm',
    deliveryMethod: 'shipping',
    shippingAddress: 'Tòa VP3 Bán đảo Linh Đàm, Hoàng Liệt, Hà Nội',
    recipientName: 'Chị Chi',
    recipientPhone: '0988554433',
    recipientRole: 'Mẹ học viên',
    status: 'shipping',
    products: [
      { id: 'prd-26', name: 'Set quà tặng Trà hoa cao cấp RinoEdu', category: 'gift', quantity: 1, unit: 'Hộp' },
    ],
    carrier: 'Viettel Post',
    trackingCode: 'VTP-HN-998822',
    trackingUrl: 'https://viettelpost.vn',
    shipperName: 'Phạm Đức Thắng (VTP)',
    shipperPhone: '0981223344',
    slaHours: 15,
    notes: 'Quà tri ân gia đình học viên tái tục năm thứ 2',
    createdAt: '14:00 - 30/08/2026',
  },
  {
    id: 'DLV-2026-017',
    sourceType: 'direct_issue',
    sourceCode: 'REQ-2026-091',
    sourceTitle: 'Khen thưởng học sinh giỏi tháng 8',
    stockExportCode: 'PXK-2026-094',
    customerName: 'Võ Minh Châu',
    customerPhone: '0944118822',
    studentName: 'Bé Võ Minh Châu',
    branch: 'RinoEdu Nguyễn Tuân',
    deliveryMethod: 'pickup',
    recipientName: 'Bé Minh Châu',
    recipientPhone: '0944118822',
    recipientRole: 'Học viên',
    status: 'pending_handover',
    products: [
      { id: 'prd-27', name: 'Bộ sách Khám phá Thế giới Khoa học 3 tập', category: 'textbook', quantity: 1, unit: 'Bộ' },
      { id: 'prd-28', name: 'Huy hiệu Chiến binh RinoEdu', category: 'gift', quantity: 1, unit: 'Cái' },
    ],
    slaHours: 10,
    handoverBy: 'Thu Hà (Lễ tân)',
    notes: 'Giáo viên chủ nhiệm đề xuất khen thưởng thủ khoa tháng',
    createdAt: '08:30 - 30/08/2026',
  },
  {
    id: 'DLV-2026-018',
    sourceType: 'direct_issue',
    sourceCode: 'REQ-2026-095',
    sourceTitle: 'Phát giáo trình đầu khóa cho lớp',
    stockExportCode: 'PXK-2026-095',
    customerName: 'Thầy David Smith',
    customerPhone: '0912889900',
    studentName: 'Cả lớp IELTS Foundation (24 học viên)',
    branch: 'RinoEdu Nguyễn Tuân',
    deliveryMethod: 'pickup',
    recipientName: 'Thầy David Smith',
    recipientPhone: '0912889900',
    recipientRole: 'Giáo viên phụ trách',
    status: 'handed_over',
    isClassDelivery: true,
    recipientCount: 24,
    targetClass: 'Lớp IELTS Foundation 4.0',
    recipientStudents: [
      { name: 'Nguyễn Văn An', phone: '0988111222' },
      { name: 'Trần Thị Bình', phone: '0977222333' },
      { name: 'Lê Hoàng Cường', phone: '0966333444' },
      { name: 'Phạm Đức Dũng', phone: '0955444555' },
      { name: 'Đỗ Thảo Giang', phone: '0944555666' },
      { name: 'Vũ Quốc Huy', phone: '0933666777' },
    ],
    products: [
      { id: 'prd-29', name: 'Giáo trình IELTS Foundation 4.0 (Bộ 2 tập)', category: 'textbook', quantity: 24, unit: 'Bộ' },
    ],
    handoverDate: '09:00 - 30/08/2026',
    completedAt: '09:00 - 30/08/2026',
    slaHours: 6,
    handoverBy: 'Thu Hà (Lễ tân)',
    podImages: ['https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&auto=format&fit=crop&q=80'],
    notes: 'Giáo viên đã nhận đủ 24 bộ sách và phát trực tiếp tại phòng học 302',
    createdAt: '08:00 - 30/08/2026',
  },
]

export function getInitialOrderFulfillments(): OrderFulfillmentRecord[] {
  return mockOrderFulfillments
}

export function addOrderFulfillment(record: OrderFulfillmentRecord) {
  mockOrderFulfillments.unshift(record)
}

