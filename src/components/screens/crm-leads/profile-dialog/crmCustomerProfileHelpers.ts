import type { Lead } from '@/mocks/crmLeads'
import { mockOrders } from '@/mocks/orders'
import { mockPaymentReceipts } from '@/mocks/paymentReceipts'
import { mockOrderFulfillments } from '@/mocks/orderFulfillments'
import { STATUS_LABEL_MAP } from '../crmLeadsTypes'
import type { ParentItem } from '../crmCustomerCreateTypes'
import type {
  CustomerProfileParent,
  CustomerProfileLeadOccurrence,
  CustomerProfileOrder,
  CustomerProfilePayment,
  CustomerProfileDelivery,
} from './crmCustomerProfileTypes'

export function extractCustomerParents(
  initialLead: Lead | null,
  currentParents: ParentItem[]
): CustomerProfileParent[] {
  if (!initialLead && currentParents.length === 0) {
    return [
      {
        id: 'parent-default',
        name: 'Phụ huynh đại diện',
        role: 'Mẹ',
        phone: '',
        email: '',
        isPrimary: true,
        preferredChannel: 'Zalo',
        zaloStatus: 'Đã kết bạn Zalo',
      },
    ]
  }

  // Phụ huynh chính
  const mainParentName = currentParents[0]?.name || initialLead?.parentName || 'Nguyễn Thu Hà'
  const mainParentRole = currentParents[0]?.role || initialLead?.parentRole || 'Mẹ'
  const mainParentPhone = currentParents[0]?.phone || initialLead?.phone || '0912345678'
  const mainParentEmail = currentParents[0]?.email || initialLead?.email || 'thu.ha@gmail.com'

  const mainParent: CustomerProfileParent = {
    id: currentParents[0]?.id || `parent-${initialLead?.id || 'main'}`,
    name: mainParentName,
    role: mainParentRole,
    phone: mainParentPhone,
    email: mainParentEmail,
    isPrimary: true,
    occupation: initialLead?.parentOccupation || 'Kế toán trưởng - FPT Software',
    financialSegment: initialLead?.financialSegment || 'Khá giả (Thu nhập > 40 triệu/tháng)',
    budgetPerMonth: initialLead?.budgetPerMonth || '3.000.000đ - 5.000.000đ/tháng',
    decisionMakerRole:
      initialLead?.decisionMakerRole || 'Mẹ toàn quyền quyết định tài chính & chương trình',
    preferredChannel: initialLead?.preferredContactMethod || 'Zalo',
    bestTimeToCall:
      initialLead?.bestTimeToCall || '12h00 - 13h30 hoặc sau 18h30 (Không nghe số lạ buổi sáng)',
    zaloStatus: 'Đã kết bạn Zalo',
    zaloPhone: mainParentPhone,
    facebook: 'facebook.com/thuha.nguyen.edu',
    address: initialLead?.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
    nearestBranch: initialLead?.branch || 'RinoEdu Linh Đàm',
    nearestBranches: [
      { name: 'RinoEdu Linh Đàm', distance: '1.2 km' },
      { name: 'RinoEdu Nguyễn Tuân', distance: '3.5 km' },
      { name: 'RinoEdu Smart City', distance: '5.2 km' },
    ],
    parentExpectation:
      initialLead?.parentExpectation ||
      'Con tự tin phản xạ giao tiếp tự nhiên, phát âm chuẩn quốc tế và lấy chứng chỉ Starters/Movers.',
    parentPainPoint:
      'Trước đây học trung tâm cũ sĩ số đông (18-20 bé), giáo viên ít tương tác nên con bị nhút nhát và sợ nói.',
    parentPersonalityNote:
      'Kỹ tính, chu đáo; thích xem số liệu minh bạch, báo cáo tiến độ học tập hàng tuần; thích trao đổi qua Zalo có hình ảnh lớp.',
    notes: initialLead?.lastNote || '',
  }

  const result: CustomerProfileParent[] = [mainParent]

  // Các phụ huynh khác từ initialLead.otherParents hoặc currentParents
  if (initialLead?.otherParents && initialLead.otherParents.length > 0) {
    initialLead.otherParents.forEach((op, idx) => {
      result.push({
        id: `parent-other-${idx}-${initialLead.id}`,
        name: op.name,
        role: op.role || (idx === 0 ? 'Bố' : 'Bà ngoại'),
        phone: op.phone,
        email: op.email || '',
        isPrimary: false,
        occupation: op.occupation || (idx === 0 ? 'Kỹ sư CNTT - VinTech' : 'Cán bộ hưu trí'),
        financialSegment: op.financialSegment || 'Thu nhập ổn định',
        budgetPerMonth: op.budgetPerMonth || 'Đồng thuận cùng mẹ',
        decisionMakerRole: op.decisionMakerRole || 'Tham khảo & hỗ trợ đưa đón con',
        preferredChannel: op.preferredChannel || 'Gọi điện',
        bestTimeToCall: op.bestTimeToCall || 'Sau 19h00 các ngày trong tuần',
        zaloStatus: idx === 0 ? 'Đã kết nối' : 'Chưa dùng Zalo',
        address: op.address || initialLead.address,
        parentExpectation: op.parentExpectation || 'Phát triển kỹ năng mềm và sự tự tin cho con.',
        parentPainPoint: op.parentPainPoint || '',
        parentPersonalityNote: op.parentPersonalityNote || 'Điềm đạm, lắng nghe ý kiến của mẹ.',
      })
    })
  } else if (currentParents.length > 1) {
    currentParents.slice(1).forEach((cp, idx) => {
      result.push({
        id: cp.id,
        name: cp.name || (idx === 0 ? 'Trần Văn Sơn' : 'Hoàng Thị Lan'),
        role: cp.role || (idx === 0 ? 'Bố' : 'Bà ngoại'),
        phone: cp.phone || (idx === 0 ? '0987654321' : '0903112233'),
        email: cp.email || '',
        isPrimary: false,
        occupation: idx === 0 ? 'Kỹ sư CNTT - VinTech' : 'Cán bộ hưu trí',
        financialSegment: 'Thu nhập ổn định',
        budgetPerMonth: 'Đồng thuận cùng mẹ',
        decisionMakerRole: 'Tham khảo & hỗ trợ đưa đón con',
        preferredChannel: idx === 0 ? 'Gọi điện' : 'Gọi điện trực tiếp',
        bestTimeToCall: 'Sau 18h30 các ngày trong tuần',
        zaloStatus: idx === 0 ? 'Đã kết bạn' : 'Chưa có Zalo',
        address: initialLead?.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
        parentExpectation: 'Con hòa đồng, chủ động học hỏi và tự giác.',
        parentPainPoint: 'Lo lắng việc học thêm quá tải sau giờ chính khóa.',
        parentPersonalityNote: 'Ủng hộ định hướng giáo dục chất lượng cao.',
      })
    })
  } else {
    // Thêm sẵn 2 phụ huynh mẫu (Bố & Bà ngoại) để thể hiện đúng thiết kế Ảnh 2
    result.push({
      id: 'parent-father-sample',
      name: 'Trần Văn Sơn',
      role: 'Bố',
      phone: '0987654321',
      email: 'son.tran@gmail.com',
      isPrimary: false,
      occupation: 'Kỹ sư CNTT cấp cao - VinTech',
      financialSegment: 'Khá giả (Thu nhập > 40 triệu/tháng)',
      budgetPerMonth: 'Đồng thuận ngân sách với mẹ',
      decisionMakerRole: 'Hỗ trợ ra quyết định công nghệ và đưa đón bé',
      preferredChannel: 'Gọi điện',
      bestTimeToCall: 'Sau 19h00 các ngày trong tuần',
      zaloStatus: 'Đã kết bạn Zalo',
      address: initialLead?.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
      parentExpectation: 'Con có tư duy logic tốt và tiếng Anh chuẩn để hội nhập.',
      parentPainPoint: 'Trung tâm cũ giáo trình cũ kỹ, thiếu ứng dụng thực hành.',
      parentPersonalityNote: 'Thích phân tích chương trình học và lộ trình đầu ra rõ ràng.',
    })
    result.push({
      id: 'parent-grandma-sample',
      name: 'Hoàng Thị Lan',
      role: 'Bà ngoại',
      phone: '0903112233',
      email: '',
      isPrimary: false,
      occupation: 'Cán bộ giáo dục hưu trí',
      financialSegment: 'Lương hưu ổn định',
      budgetPerMonth: 'Bố mẹ bé chi trả',
      decisionMakerRole: 'Người trực tiếp đưa đón bé đi học hàng ngày',
      preferredChannel: 'Gọi điện thoại trực tiếp',
      bestTimeToCall: '9h00 - 11h00 hoặc 15h00 - 17h00',
      zaloStatus: 'Chưa dùng Zalo',
      address: initialLead?.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
      parentExpectation: 'Môi trường học sạch sẽ, an toàn, thầy cô thân thiện, yêu trẻ.',
      parentPainPoint: 'Lo cháu bị mệt nếu lớp học quá căng thẳng.',
      parentPersonalityNote: 'Ân cần, cẩn thận, cần trao đổi lịch học rõ ràng trước các buổi đón.',
    })
  }

  return result
}

export function extractCustomerLeadOccurrences(
  initialLead: Lead | null
): CustomerProfileLeadOccurrence[] {
  if (!initialLead) {
    return [
      {
        id: 'lead-new',
        cycleNumber: 1,
        title: 'Đợt 1 (Đợt tiếp nhận hiện tại)',
        status: 'moi_tiep_nhan',
        statusLabel: 'Mới tiếp nhận',
        channel: 'Web Rinoedu',
        assignedSales: 'Trần Thị Mai (Sales)',
        branch: 'RinoEdu Linh Đàm',
        productInterest: 'Tiếng Anh Thiếu Nhi',
        startDate: new Date().toLocaleDateString('vi-VN'),
        outcomeNote: 'Khách hàng mới đăng ký tư vấn qua website.',
        isCurrent: true,
        leadCode: 'LD-10291-A',
      },
    ]
  }

  const result: CustomerProfileLeadOccurrence[] = []

  // Đợt hiện tại
  result.push({
    id: `cycle-current-${initialLead.id}`,
    cycleNumber: (initialLead.salesCycles?.length || 0) + 1,
    title: `Đợt ${(initialLead.salesCycles?.length || 0) + 1} (Đang chăm sóc tiếp cận)`,
    status: initialLead.status,
    statusLabel: STATUS_LABEL_MAP[initialLead.status] || initialLead.status,
    channel: initialLead.source || 'Facebook',
    assignedSales: initialLead.assignedTo || 'Trần Thị Mai (Sales)',
    branch: initialLead.branch || 'RinoEdu Linh Đàm',
    productInterest: initialLead.targetSubject || 'Anh văn Nhi đồng (SuperKids)',
    startDate: initialLead.createdAt || '10/08/2026',
    outcomeNote: initialLead.lastNote || 'Đang tư vấn lộ trình và hẹn lịch trải nghiệm.',
    isCurrent: true,
    leadCode: initialLead.code,
  })

  // Các đợt trước đây từ salesCycles
  if (initialLead.salesCycles && initialLead.salesCycles.length > 0) {
    initialLead.salesCycles.forEach((c) => {
      result.push({
        id: c.cycleId,
        cycleNumber: c.cycleNumber,
        title: c.title.replace(/chu kỳ/gi, 'Đợt'),
        status: c.status,
        statusLabel: c.status === 'converted' ? 'Đã chuyển đổi' : c.status === 'dropped' ? 'Báo rớt' : 'Hoàn thành',
        channel: initialLead.source || 'Facebook',
        assignedSales: c.assignedSales || 'Lê Hoàng Nam (Sales)',
        branch: initialLead.branch || 'RinoEdu Linh Đàm',
        productInterest: initialLead.targetSubject || 'Anh văn Nhi đồng',
        startDate: c.startDate || '05/10/2025',
        endDate: c.endDate || '20/01/2026',
        outcomeNote: c.outcomeNote || 'Cựu học viên hoàn thành khóa trước.',
        isCurrent: false,
        leadCode: initialLead.code,
      })
    })
  } else if (initialLead.isReturningLead) {
    // Đợt lịch sử mẫu nếu là Lead quay lại
    result.push({
      id: `cycle-old-1-${initialLead.id}`,
      cycleNumber: 1,
      title: 'Đợt 1 (Đợt tiếp cận năm học 2025)',
      status: 'converted',
      statusLabel: 'Đã chuyển đổi (Thành công)',
      channel: 'Sự kiện trải nghiệm hè',
      assignedSales: 'Lê Hoàng Nam (Sales)',
      branch: initialLead.branch || 'RinoEdu Linh Đàm',
      productInterest: 'Anh văn Mẫu giáo (Kindy)',
      startDate: '05/06/2025',
      endDate: '25/01/2026',
      outcomeNote: 'Đã hoàn thành khóa Kindy 6 tháng với kết quả xuất sắc.',
      isCurrent: false,
      leadCode: initialLead.code,
    })
  }

  return result
}

export function extractCustomerOrders(initialLead: Lead | null): CustomerProfileOrder[] {
  if (!initialLead) {
    return []
  }

  // Tìm trong mockOrders theo studentName hoặc code
  const found = mockOrders.filter(
    (o) =>
      o.studentName === initialLead.studentName ||
      o.customerPhone === initialLead.phone ||
      o.orderNo === initialLead.orderCode
  )

  if (found.length > 0) {
    return found.map((o) => ({
      id: o.id,
      orderNo: o.orderNo,
      studentName: o.studentName,
      packageName: o.items?.[0]?.productName || initialLead.expectedPackage || 'Khóa học Tiếng Anh Tiêu Chuẩn',
      courseDuration: (o.items?.[0] as { durationText?: string } | undefined)?.durationText || '48 buổi (6 tháng)',
      totalAmount: o.totalAmount,
      discountAmount: o.discountAmount,
      finalAmount: o.finalAmount,
      paidAmount: o.paidAmount || (o.paymentStatus === 'paid' ? o.finalAmount : Math.round(o.finalAmount * 0.5)),
      remainingAmount:
        o.remainingAmount !== undefined
          ? o.remainingAmount
          : o.paymentStatus === 'paid'
          ? 0
          : Math.round(o.finalAmount * 0.5),
      paymentStatus: o.paymentStatus || 'paid',
      paymentMethodTag: o.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'Tiền mặt',
      orderStatus: (o.status as CustomerProfileOrder['orderStatus']) || 'completed',
      saleBy: o.saleBy || initialLead.assignedTo || 'Trần Thị Mai (Sales)',
      createdAt: o.createdAt || initialLead.createdAt || '12/08/2026',
      branch: o.branch || initialLead.branch || 'RinoEdu Linh Đàm',
    }))
  }

  // Fallback: Tạo đơn hàng thực tế từ thông tin của Lead
  const total = 15000000
  const isPaid = initialLead.orderStatus === 'paid' || initialLead.status === 'chuyen_doi'
  const isPartial = initialLead.orderStatus === 'partial' || Boolean(initialLead.paymentTerm?.includes('cọc'))

  return [
    {
      id: `ord-${initialLead.id}`,
      orderNo: initialLead.orderCode || 'OD832001',
      studentName: initialLead.studentName,
      packageName: initialLead.expectedPackage || 'Khóa Anh văn Nhi đồng (SuperKids) - 48 buổi',
      courseDuration: '48 buổi (6 tháng)',
      totalAmount: total,
      discountAmount: 1000000,
      finalAmount: 14000000,
      paidAmount: isPaid ? 14000000 : isPartial ? 5000000 : 0,
      remainingAmount: isPaid ? 0 : isPartial ? 9000000 : 14000000,
      paymentStatus: isPaid ? 'paid' : isPartial ? 'partial' : 'unpaid',
      paymentMethodTag: 'Chuyển khoản QR',
      orderStatus: isPaid ? 'completed' : 'processing',
      saleBy: initialLead.assignedTo || 'Trần Thị Mai (Sales)',
      createdAt: initialLead.orderDate || initialLead.createdAt || '10/08/2026',
      branch: initialLead.branch || 'RinoEdu Linh Đàm',
    },
  ]
}

export function extractCustomerPayments(
  initialLead: Lead | null,
  orders: CustomerProfileOrder[]
): CustomerProfilePayment[] {
  if (!initialLead) return []

  const foundReceipts = mockPaymentReceipts.filter(
    (r) =>
      r.studentName === initialLead.studentName ||
      r.phone === initialLead.phone ||
      orders.some((o) => o.orderNo === r.orderCode)
  )

  if (foundReceipts.length > 0) {
    return foundReceipts.map((r) => ({
      id: r.id,
      code: r.code,
      orderNo: r.orderCode,
      studentName: r.studentName,
      parentName: r.parentName || initialLead.parentName,
      amount: r.amount,
      paymentMethod: r.paymentMethod,
      paymentMethodLabel:
        r.paymentMethod === 'qr_transfer'
          ? 'VietQR'
          : r.paymentMethod === 'cash'
          ? 'Tiền mặt'
          : r.paymentMethod === 'pos_card'
          ? 'Cà thẻ POS'
          : 'Chuyển khoản',
      receiptTypeLabel:
        r.receiptType === 'deposit'
          ? 'Cọc giữ chỗ'
          : r.receiptType === 'installment'
          ? 'Đợt thanh toán bổ sung'
          : 'Thu học phí trọn gói',
      status: r.status,
      isReconciled: r.isReconciled,
      createdAt: r.createdAt,
      createdBy: r.createdBy,
      bankAccount: r.bankAccount,
    }))
  }

  // Fallback: Tạo 2 phiếu thu thực tế dựa trên đơn hàng của Lead
  const order = orders[0]
  if (!order) return []

  const payments: CustomerProfilePayment[] = []

  if (order.paidAmount > 0) {
    // Đợt 1: Cọc
    const depositAmount = order.paidAmount >= 14000000 ? 5000000 : order.paidAmount
    payments.push({
      id: `pay-1-${initialLead.id}`,
      code: 'TNX00000273948',
      orderNo: order.orderNo,
      studentName: initialLead.studentName,
      parentName: initialLead.parentName,
      amount: depositAmount,
      paymentMethod: 'qr_transfer',
      paymentMethodLabel: 'VietQR',
      receiptTypeLabel: 'Cọc giữ chỗ học phí',
      status: 'completed',
      isReconciled: true,
      createdAt: `${initialLead.createdAt || '10/08/2026'} 09:30`,
      createdBy: initialLead.assignedTo || 'Trần Thị Mai (Sales)',
      bankAccount: 'Techcombank - 1903482910291 (RinoEdu Chi nhánh Linh Đàm)',
      notes: 'Thanh toán cọc giữ chỗ ưu đãi sớm khóa SuperKids',
    })

    // Đợt 2: Thu nốt nếu đã thanh toán hết
    if (order.paidAmount > 5000000) {
      payments.push({
        id: `pay-2-${initialLead.id}`,
        code: 'TNX00000274115',
        orderNo: order.orderNo,
        studentName: initialLead.studentName,
        parentName: initialLead.parentName,
        amount: order.paidAmount - depositAmount,
        paymentMethod: 'bank_transfer',
        paymentMethodLabel: 'Chuyển khoản ngân hàng',
        receiptTypeLabel: 'Thu nốt phần học phí còn lại',
        status: 'completed',
        isReconciled: true,
        createdAt: `${initialLead.createdAt || '10/08/2026'} 15:45`,
        createdBy: 'Nguyễn Thị Bích (Kế toán)',
        bankAccount: 'Vietcombank - 0011002938192 (RinoEdu)',
        notes: 'Hoàn tất 100% học phí trước ngày khai giảng',
      })
    }
  }

  return payments
}

export function extractCustomerDeliveries(
  initialLead: Lead | null,
  orders: CustomerProfileOrder[]
): CustomerProfileDelivery[] {
  if (!initialLead) return []

  const found = mockOrderFulfillments.filter(
    (f) =>
      f.studentName === initialLead.studentName ||
      f.customerPhone === initialLead.phone ||
      orders.some((o) => o.orderNo === f.orderNo)
  )

  if (found.length > 0) {
    return found.map((f) => ({
      id: f.id,
      trackingCode: f.trackingCode || `GHN-${f.id.slice(-6).toUpperCase()}`,
      sourceTypeLabel: f.sourceType === 'order' ? 'Đơn hàng' : 'Quà tặng CSKH',
      orderNo: f.orderNo,
      studentName: f.studentName,
      recipientName: f.recipientName || initialLead.parentName,
      recipientPhone: f.recipientPhone || initialLead.phone,
      shippingAddress: f.shippingAddress || initialLead.address,
      deliveryMethod: f.deliveryMethod,
      carrier: f.carrier || 'Giao Hàng Nhanh (GHN)',
      products: f.products.map((p) => ({
        name: p.name,
        category: p.category,
        quantity: p.quantity,
        unit: p.unit,
      })),
      status: f.status,
      createdAt: f.createdAt,
      completedAt: f.completedAt,
      notes: f.notes,
      podImageUrl: f.podImages?.[0],
    }))
  }

  // Fallback: 1 vận đơn bàn giao giáo trình & balo
  const order = orders[0]
  return [
    {
      id: `ful-${initialLead.id}`,
      trackingCode: 'GHN-8923019',
      sourceTypeLabel: 'Kèm Đơn hàng',
      orderNo: order?.orderNo || 'OD832001',
      studentName: initialLead.studentName,
      recipientName: initialLead.parentName,
      recipientPhone: initialLead.phone,
      shippingAddress: initialLead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
      deliveryMethod: 'shipping',
      carrier: 'Giao Hàng Nhanh (GHN Express)',
      products: [
        {
          name: 'Bộ giáo trình SuperKids Level 1 (Student Book + Workbook)',
          category: 'Giáo trình',
          quantity: 1,
          unit: 'Bộ',
        },
        {
          name: 'Balo học sinh phản quang RinoEdu Star',
          category: 'Quà tặng khai giảng',
          quantity: 1,
          unit: 'Chiếc',
        },
        {
          name: 'Áo đồng phục Polo RinoEdu (Size 6)',
          category: 'Đồng phục',
          quantity: 1,
          unit: 'Áo',
        },
      ],
      status: 'handed_over',
      createdAt: '12/08/2026 10:15',
      completedAt: '13/08/2026 14:20',
      notes: 'Đã giao thành công tận tay phụ huynh, kiểm tra đủ sách và quà.',
      podImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop',
    },
  ]
}

export function formatCurrencyVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}
