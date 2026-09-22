import type { Lead } from '@/mocks/crmLeads'
import { mockOrders } from '@/mocks/orders'
import { mockPaymentReceipts } from '@/mocks/paymentReceipts'
import { mockOrderFulfillments } from '@/mocks/orderFulfillments'
import { STATUS_LABEL_MAP } from '../crmLeadsTypes'
import type {
  FamilyParentContact,
  FamilyChildItem,
  FamilyLeadOccurrence,
  FamilyOrder,
  FamilyPayment,
  FamilyDelivery,
} from './crmFamily360Types'

export function extractFamilyParents(lead: Lead | null): FamilyParentContact[] {
  if (!lead) {
    return [
      {
        id: 'parent-default',
        name: 'Nguyễn Thu Hà',
        role: 'Mẹ',
        phone: '0912345678',
        email: 'thu.ha@gmail.com',
        isPrimary: true,
        occupation: 'Kế toán trưởng - FPT Software',
        financialSegment: 'Khá giả (Thu nhập > 40 triệu/tháng)',
        budgetPerMonth: '3.000.000đ - 5.000.000đ/tháng',
        decisionMakerRole: 'Mẹ toàn quyền quyết định tài chính & chương trình',
        preferredChannel: 'Zalo',
        bestTimeToCall: '12h00 - 13h30 hoặc sau 18h30 (Không nghe số lạ buổi sáng)',
        zaloStatus: 'Đã kết bạn Zalo',
        address: 'Phường Bến Nghé, Quận 1, TP.HCM',
        nearestBranch: 'RinoEdu Linh Đàm',
        nearestBranches: [
          { name: 'RinoEdu Linh Đàm', distance: '1.2 km' },
          { name: 'RinoEdu Nguyễn Tuân', distance: '3.5 km' },
          { name: 'RinoEdu Smart City', distance: '5.2 km' },
        ],
        parentExpectation:
          'Con tự tin phản xạ giao tiếp tự nhiên, phát âm chuẩn quốc tế và lấy chứng chỉ Starters/Movers',
        parentPainPoint:
          'Trước đây học trung tâm cũ sĩ số đông (18-20 bé), giáo viên ít tương tác nên con bị nhút nhát và sợ nói',
        parentPersonalityNote:
          'Kỹ tính, chu đáo; thích xem số liệu minh bạch, báo cáo tiến độ học tập hàng tuần; thích trao đổi qua Zalo có hình ảnh lớp',
      },
      {
        id: 'parent-father',
        name: 'Trần Văn Sơn',
        role: 'Bố',
        phone: '0987654321',
        email: 'son.tran@gmail.com',
        isPrimary: false,
        occupation: 'Kỹ sư CNTT cấp cao - VinTech',
        financialSegment: 'Khá giả (Thu nhập > 40 triệu/tháng)',
        budgetPerMonth: 'Đồng thuận ngân sách với mẹ',
        decisionMakerRole: 'Hỗ trợ đưa đón và đồng thuận định hướng giáo dục',
        preferredChannel: 'Gọi điện',
        bestTimeToCall: 'Sau 19h00 các ngày trong tuần',
        zaloStatus: 'Đã kết bạn Zalo',
        address: 'Phường Bến Nghé, Quận 1, TP.HCM',
        parentExpectation: 'Con có tư duy logic tốt và tiếng Anh chuẩn để hội nhập.',
        parentPainPoint: 'Trung tâm cũ giáo trình cũ kỹ, thiếu ứng dụng thực hành.',
        parentPersonalityNote: 'Thích phân tích chương trình học và lộ trình đầu ra rõ ràng.',
      },
      {
        id: 'parent-grandma',
        name: 'Hoàng Thị Lan',
        role: 'Bà ngoại',
        phone: '0903112233',
        email: '',
        isPrimary: false,
        occupation: 'Cán bộ giáo dục hưu trí',
        financialSegment: 'Lương hưu ổn định',
        budgetPerMonth: 'Bố mẹ bé chi trả',
        decisionMakerRole: 'Người trực tiếp hỗ trợ đưa đón bé đi học hàng ngày',
        preferredChannel: 'Gọi điện thoại trực tiếp',
        bestTimeToCall: '9h00 - 11h00 hoặc 15h00 - 17h00',
        zaloStatus: 'Chưa dùng Zalo',
        address: 'Phường Bến Nghé, Quận 1, TP.HCM',
        parentExpectation: 'Môi trường học sạch sẽ, an toàn, thầy cô thân thiện, yêu trẻ.',
        parentPainPoint: 'Lo cháu bị mệt nếu lớp học quá căng thẳng.',
        parentPersonalityNote: 'Ân cần, cẩn thận, cần trao đổi lịch học rõ ràng trước các buổi đón.',
      },
    ]
  }

  // Phụ huynh chính
  const mainParent: FamilyParentContact = {
    id: `parent-main-${lead.id}`,
    name: lead.parentName || 'Nguyễn Thu Hà',
    role: lead.parentRole || 'Mẹ',
    phone: lead.phone || '0912345678',
    email: lead.email || 'thu.ha@gmail.com',
    isPrimary: true,
    occupation: lead.parentOccupation || 'Kế toán trưởng - FPT Software',
    financialSegment: lead.financialSegment || 'Khá giả (Thu nhập > 40 triệu/tháng)',
    budgetPerMonth: lead.budgetPerMonth || '3.000.000đ - 5.000.000đ/tháng',
    decisionMakerRole:
      lead.decisionMakerRole || 'Mẹ toàn quyền quyết định tài chính & chương trình',
    preferredChannel: lead.preferredContactMethod || 'Zalo',
    bestTimeToCall:
      lead.bestTimeToCall || '12h00 - 13h30 hoặc sau 18h30 (Không nghe số lạ buổi sáng)',
    zaloStatus: 'Đã kết bạn Zalo',
    zaloPhone: lead.phone,
    facebook: 'facebook.com/thuha.nguyen.edu',
    address: lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
    nearestBranch: lead.branch || 'RinoEdu Linh Đàm',
    nearestBranches: [
      { name: 'RinoEdu Linh Đàm', distance: '1.2 km' },
      { name: 'RinoEdu Nguyễn Tuân', distance: '3.5 km' },
      { name: 'RinoEdu Smart City', distance: '5.2 km' },
    ],
    parentExpectation:
      lead.parentExpectation ||
      'Con tự tin phản xạ giao tiếp tự nhiên, phát âm chuẩn quốc tế và lấy chứng chỉ Starters/Movers',
    parentPainPoint:
      'Trước đây học trung tâm cũ sĩ số đông (18-20 bé), giáo viên ít tương tác nên con bị nhút nhát và sợ nói',
    parentPersonalityNote:
      'Kỹ tính, chu đáo; thích xem số liệu minh bạch, báo cáo tiến độ học tập hàng tuần; thích trao đổi qua Zalo có hình ảnh lớp',
    notes: lead.lastNote || '',
  }

  const result: FamilyParentContact[] = [mainParent]

  if (lead.otherParents && lead.otherParents.length > 0) {
    lead.otherParents.forEach((op, idx) => {
      result.push({
        id: `parent-other-${idx}-${lead.id}`,
        name: op.name,
        role: op.role || (idx === 0 ? 'Bố' : 'Bà ngoại'),
        phone: op.phone,
        email: op.email || '',
        isPrimary: false,
        occupation: op.occupation || (idx === 0 ? 'Kỹ sư CNTT cấp cao - VinTech' : 'Cán bộ giáo dục hưu trí'),
        financialSegment: op.financialSegment || 'Thu nhập ổn định',
        budgetPerMonth: op.budgetPerMonth || 'Đồng thuận cùng mẹ',
        decisionMakerRole: op.decisionMakerRole || 'Hỗ trợ đưa đón và đồng thuận định hướng giáo dục',
        preferredChannel: op.preferredChannel || 'Gọi điện',
        bestTimeToCall: op.bestTimeToCall || 'Sau 19h00 các ngày trong tuần',
        zaloStatus: idx === 0 ? 'Đã kết bạn Zalo' : 'Chưa dùng Zalo',
        address: op.address || lead.address,
        parentExpectation: op.parentExpectation || 'Phát triển kỹ năng mềm và sự tự tin cho con.',
        parentPainPoint: op.parentPainPoint || '',
        parentPersonalityNote: op.parentPersonalityNote || 'Điềm đạm, chu đáo.',
      })
    })
  } else {
    // Sẵn sàng 2 phụ huynh mẫu Bố và Bà ngoại (như Ảnh 2) để hiển thị đầy đủ hồ sơ gia đình
    result.push({
      id: `parent-father-${lead.id}`,
      name: 'Trần Văn Sơn',
      role: 'Bố',
      phone: '0987654321',
      email: 'son.tran@gmail.com',
      isPrimary: false,
      occupation: 'Kỹ sư CNTT cấp cao - VinTech',
      financialSegment: 'Khá giả (Thu nhập > 40 triệu/tháng)',
      budgetPerMonth: 'Đồng thuận ngân sách với mẹ',
      decisionMakerRole: 'Hỗ trợ đưa đón và đồng thuận định hướng giáo dục',
      preferredChannel: 'Gọi điện',
      bestTimeToCall: 'Sau 19h00 các ngày trong tuần',
      zaloStatus: 'Đã kết bạn Zalo',
      address: lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
      parentExpectation: 'Con có tư duy logic tốt và tiếng Anh chuẩn để hội nhập.',
      parentPainPoint: 'Trung tâm cũ giáo trình cũ kỹ, thiếu ứng dụng thực hành.',
      parentPersonalityNote: 'Thích phân tích chương trình học và lộ trình đầu ra rõ ràng.',
    })
    result.push({
      id: `parent-grandma-${lead.id}`,
      name: 'Hoàng Thị Lan',
      role: 'Bà ngoại',
      phone: '0903112233',
      email: '',
      isPrimary: false,
      occupation: 'Cán bộ giáo dục hưu trí',
      financialSegment: 'Lương hưu ổn định',
      budgetPerMonth: 'Bố mẹ bé chi trả',
      decisionMakerRole: 'Người trực tiếp hỗ trợ đưa đón bé đi học hàng ngày',
      preferredChannel: 'Gọi điện thoại trực tiếp',
      bestTimeToCall: '9h00 - 11h00 hoặc 15h00 - 17h00',
      zaloStatus: 'Chưa dùng Zalo',
      address: lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
      parentExpectation: 'Môi trường học sạch sẽ, an toàn, thầy cô thân thiện, yêu trẻ.',
      parentPainPoint: 'Lo cháu bị mệt nếu lớp học quá căng thẳng.',
      parentPersonalityNote: 'Ân cần, cẩn thận, cần trao đổi lịch học rõ ràng trước các buổi đón.',
    })
  }

  return result
}

export function extractFamilyChildren(lead: Lead | null): FamilyChildItem[] {
  if (!lead) {
    return [
      {
        id: 'child-1',
        name: 'Bé An',
        currentSchool: 'Tiểu học Lê Quý Đôn',
        birthYear: '2018',
        age: '8',
        academicPerformance: 'Khá / Phản xạ tốt',
        phone: '09xxxxxxxx',
        course: 'Tiếng Anh Thiếu Nhi (SuperKids)',
        vuihocAccount: 'vh_an_2018',
        customerType: 'Tự học',
        industryGroup: 'Tiểu học',
        selectedSources: ['Web Rinoedu'],
        selectedStaff: ['Trần Thị Mai'],
        marketingStaff: 'Nguyễn Thị Lan (Marketing)',
        selectedProductGroups: ['Tiếng Anh Thiếu Nhi'],
        customerCode: 'KH-839201',
        isCurrent: true,
        totalOrdersCount: 1,
        totalOrdersAmount: '14.000.000đ',
      },
      {
        id: 'child-2',
        name: 'Bé Bình',
        currentSchool: 'Mầm non Sao Mai',
        birthYear: '2021',
        age: '5',
        academicPerformance: 'Nhanh nhẹn, hiếu động',
        phone: '',
        course: 'Anh văn Mẫu giáo (Kindy)',
        vuihocAccount: 'vh_binh_2021',
        customerType: 'Station',
        industryGroup: 'Tiểu học',
        selectedSources: ['Giới thiệu từ mẹ'],
        selectedStaff: ['Trần Thị Mai'],
        marketingStaff: 'Nguyễn Thị Lan (Marketing)',
        selectedProductGroups: ['Station MKT'],
        customerCode: 'KH-839202',
        isCurrent: false,
        totalOrdersCount: 0,
        totalOrdersAmount: '0đ',
      },
    ]
  }

  const mainChild: FamilyChildItem = {
    id: `child-main-${lead.id}`,
    name: lead.studentName || 'Bé An',
    currentSchool: lead.schoolName || 'Tiểu học Lê Quý Đôn',
    birthYear: lead.birthYear ? String(lead.birthYear) : '2018',
    age: lead.studentAge ? String(lead.studentAge) : '8',
    academicPerformance: lead.academicAbility || 'Khá / Phản xạ tốt',
    phone: lead.studentPhone || '',
    course: lead.targetSubject || 'Tiếng Anh Thiếu Nhi',
    vuihocAccount: lead.vuihocAccount || 'vh_an_2018',
    customerType: lead.trainingType || 'Tự học',
    industryGroup: lead.industryGroup || 'Tiểu học',
    selectedSources: [lead.source || 'Web Rinoedu'],
    selectedStaff: [lead.assignedTo || 'Trần Thị Mai'],
    marketingStaff: lead.marketingStaff || 'Nguyễn Thị Lan (Marketing)',
    selectedProductGroups: [lead.productGroup || 'Tiếng Anh Thiếu Nhi'],
    customerCode: lead.code,
    isCurrent: true,
    totalOrdersCount: lead.ordersCount || 1,
    totalOrdersAmount: lead.totalSpend || '14.000.000đ',
  }

  const result: FamilyChildItem[] = [mainChild]

  // Bé thứ 2 (Bé Bình - như trong Ảnh 2 con khác)
  const siblingName = lead.familySiblings?.[0] || 'Bé Bình'
  result.push({
    id: `child-sibling-${lead.id}`,
    name: siblingName,
    currentSchool: 'Mầm non Sao Mai',
    birthYear: '2021',
    age: '5',
    academicPerformance: 'Nhanh nhẹn, hiếu động',
    phone: '',
    course: 'Anh văn Mẫu giáo (Kindy)',
    vuihocAccount: `vh_${siblingName.toLowerCase().replace(/\s+/g, '')}_2021`,
    customerType: 'Station',
    industryGroup: 'Tiểu học',
    selectedSources: ['Gia đình có con đang học'],
    selectedStaff: [lead.assignedTo || 'Trần Thị Mai'],
    marketingStaff: 'Nguyễn Thị Lan (Marketing)',
    selectedProductGroups: ['Tiếng Anh Thiếu Nhi'],
    customerCode: `${lead.code}-2`,
    isCurrent: false,
    totalOrdersCount: 0,
    totalOrdersAmount: '0đ',
  })

  return result
}

export function extractFamilyLeadOccurrences(lead: Lead | null): FamilyLeadOccurrence[] {
  if (!lead) {
    return [
      {
        id: 'lead-cycle-1',
        cycleNumber: 1,
        title: 'Đợt 1 (Tiếp nhận hiện tại - Bé An)',
        status: 'dang_tu_van',
        statusLabel: 'Đang tư vấn',
        channel: 'Web Rinoedu',
        assignedSales: 'Trần Thị Mai (Sales)',
        branch: 'RinoEdu Linh Đàm',
        productInterest: 'Tiếng Anh Thiếu Nhi (SuperKids)',
        startDate: '10/08/2026',
        outcomeNote: 'Mẹ quan tâm lộ trình Starters, đã đặt lịch test xếp lớp.',
        isCurrent: true,
        childName: 'Bé An',
        leadCode: 'LD-10291-A',
      },
      {
        id: 'lead-cycle-2',
        cycleNumber: 2,
        title: 'Đợt 2 (Khảo sát hè 2025 - Bé Bình)',
        status: 'converted',
        statusLabel: 'Đã chuyển đổi',
        channel: 'Sự kiện trải nghiệm hè',
        assignedSales: 'Lê Hoàng Nam (Sales)',
        branch: 'RinoEdu Linh Đàm',
        productInterest: 'Anh văn Mẫu giáo (Kindy)',
        startDate: '05/06/2025',
        endDate: '15/01/2026',
        outcomeNote: 'Bé Bình đã hoàn thành khóa Kindy hè vui vẻ.',
        isCurrent: false,
        childName: 'Bé Bình',
        leadCode: 'LD-8392-B',
      },
    ]
  }

  const result: FamilyLeadOccurrence[] = []

  // Đợt hiện tại của bé chủ thể
  result.push({
    id: `cycle-curr-${lead.id}`,
    cycleNumber: (lead.salesCycles?.length || 0) + 1,
    title: `Đợt ${(lead.salesCycles?.length || 0) + 1} (Đang tiếp cận - ${lead.studentName})`,
    status: lead.status,
    statusLabel: STATUS_LABEL_MAP[lead.status] || lead.status,
    channel: lead.source || 'Facebook',
    assignedSales: lead.assignedTo || 'Trần Thị Mai (Sales)',
    branch: lead.branch || 'RinoEdu Linh Đàm',
    productInterest: lead.targetSubject || 'Anh văn Nhi đồng (SuperKids)',
    startDate: lead.createdAt || '10/08/2026',
    outcomeNote: lead.lastNote || 'Đang tư vấn lộ trình và hẹn lịch trải nghiệm.',
    isCurrent: true,
    childName: lead.studentName,
    leadCode: lead.code,
  })

  // Đợt trước từ salesCycles
  if (lead.salesCycles && lead.salesCycles.length > 0) {
    lead.salesCycles.forEach((c) => {
      result.push({
        id: c.cycleId,
        cycleNumber: c.cycleNumber,
        title: `${c.title.replace(/chu kỳ/gi, 'Đợt')} (${lead.studentName})`,
        status: c.status,
        statusLabel: c.status === 'converted' ? 'Đã chuyển đổi' : c.status === 'dropped' ? 'Báo rớt' : 'Hoàn thành',
        channel: lead.source || 'Facebook',
        assignedSales: c.assignedSales || 'Lê Hoàng Nam (Sales)',
        branch: lead.branch || 'RinoEdu Linh Đàm',
        productInterest: lead.targetSubject || 'Anh văn Nhi đồng',
        startDate: c.startDate || '05/10/2025',
        endDate: c.endDate || '20/01/2026',
        outcomeNote: c.outcomeNote || 'Cựu học viên hoàn thành khóa trước.',
        isCurrent: false,
        childName: lead.studentName,
        leadCode: lead.code,
      })
    })
  } else {
    // Thêm 1 đợt tiếp cận lịch sử của con thứ 2
    result.push({
      id: `cycle-sibling-sample-${lead.id}`,
      cycleNumber: 1,
      title: 'Đợt 1 (Khảo sát hè 2025 - Bé Bình)',
      status: 'converted',
      statusLabel: 'Đã chuyển đổi',
      channel: 'Sự kiện trải nghiệm hè',
      assignedSales: 'Lê Hoàng Nam (Sales)',
      branch: lead.branch || 'RinoEdu Linh Đàm',
      productInterest: 'Anh văn Mẫu giáo (Kindy)',
      startDate: '05/06/2025',
      endDate: '15/01/2026',
      outcomeNote: 'Bé đã học xong chương trình Mầm non hè 2025.',
      isCurrent: false,
      childName: 'Bé Bình',
      leadCode: `${lead.code}-OLD`,
    })
  }

  return result
}

export function extractFamilyOrders(lead: Lead | null): FamilyOrder[] {
  if (!lead) return []

  const found = mockOrders.filter(
    (o) =>
      o.studentName === lead.studentName ||
      o.customerPhone === lead.phone ||
      o.orderNo === lead.orderCode
  )

  if (found.length > 0) {
    return found.map((o) => ({
      id: o.id,
      orderNo: o.orderNo,
      studentName: o.studentName,
      packageName: o.items?.[0]?.productName || lead.expectedPackage || 'Khóa học Tiếng Anh Tiêu Chuẩn',
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
      orderStatus: o.status || 'completed',
      saleBy: o.saleBy || lead.assignedTo || 'Trần Thị Mai (Sales)',
      createdAt: o.createdAt || lead.createdAt || '12/08/2026',
      branch: o.branch || lead.branch || 'RinoEdu Linh Đàm',
    }))
  }

  const isPaid = lead.orderStatus === 'paid' || lead.status === 'chuyen_doi'
  const isPartial = lead.orderStatus === 'partial' || Boolean(lead.paymentTerm?.includes('cọc'))

  return [
    {
      id: `ord-${lead.id}`,
      orderNo: lead.orderCode || 'OD832001',
      studentName: lead.studentName,
      packageName: lead.expectedPackage || 'Khóa Anh văn Nhi đồng (SuperKids) - 48 buổi',
      courseDuration: '48 buổi (6 tháng)',
      totalAmount: 15000000,
      discountAmount: 1000000,
      finalAmount: 14000000,
      paidAmount: isPaid ? 14000000 : isPartial ? 5000000 : 0,
      remainingAmount: isPaid ? 0 : isPartial ? 9000000 : 14000000,
      paymentStatus: isPaid ? 'paid' : isPartial ? 'partial' : 'unpaid',
      paymentMethodTag: 'Chuyển khoản QR',
      orderStatus: isPaid ? 'completed' : 'processing',
      saleBy: lead.assignedTo || 'Trần Thị Mai (Sales)',
      createdAt: lead.orderDate || lead.createdAt || '10/08/2026',
      branch: lead.branch || 'RinoEdu Linh Đàm',
    },
  ]
}

export function extractFamilyPayments(
  lead: Lead | null,
  orders: FamilyOrder[]
): FamilyPayment[] {
  if (!lead) return []

  const foundReceipts = mockPaymentReceipts.filter(
    (r) =>
      r.studentName === lead.studentName ||
      r.phone === lead.phone ||
      orders.some((o) => o.orderNo === r.orderCode)
  )

  if (foundReceipts.length > 0) {
    return foundReceipts.map((r) => ({
      id: r.id,
      code: r.code,
      orderNo: r.orderCode,
      studentName: r.studentName,
      parentName: r.parentName || lead.parentName,
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

  const order = orders[0]
  if (!order) return []

  const payments: FamilyPayment[] = []
  if (order.paidAmount > 0) {
    const depositAmount = order.paidAmount >= 14000000 ? 5000000 : order.paidAmount
    payments.push({
      id: `pay-1-${lead.id}`,
      code: 'TNX00000273948',
      orderNo: order.orderNo,
      studentName: lead.studentName,
      parentName: lead.parentName,
      amount: depositAmount,
      paymentMethod: 'qr_transfer',
      paymentMethodLabel: 'VietQR',
      receiptTypeLabel: 'Cọc giữ chỗ học phí',
      status: 'completed',
      isReconciled: true,
      createdAt: `${lead.createdAt || '10/08/2026'} 09:30`,
      createdBy: lead.assignedTo || 'Trần Thị Mai (Sales)',
      bankAccount: 'Techcombank - 1903482910291 (RinoEdu Chi nhánh Linh Đàm)',
      notes: 'Thanh toán cọc giữ chỗ ưu đãi sớm khóa SuperKids',
    })

    if (order.paidAmount > 5000000) {
      payments.push({
        id: `pay-2-${lead.id}`,
        code: 'TNX00000274115',
        orderNo: order.orderNo,
        studentName: lead.studentName,
        parentName: lead.parentName,
        amount: order.paidAmount - depositAmount,
        paymentMethod: 'bank_transfer',
        paymentMethodLabel: 'Chuyển khoản ngân hàng',
        receiptTypeLabel: 'Thu nốt phần học phí còn lại',
        status: 'completed',
        isReconciled: true,
        createdAt: `${lead.createdAt || '10/08/2026'} 15:45`,
        createdBy: 'Nguyễn Thị Bích (Kế toán)',
        bankAccount: 'Vietcombank - 0011002938192 (RinoEdu)',
        notes: 'Hoàn tất 100% học phí trước ngày khai giảng',
      })
    }
  }

  return payments
}

export function extractFamilyDeliveries(
  lead: Lead | null,
  orders: FamilyOrder[]
): FamilyDelivery[] {
  if (!lead) return []

  const found = mockOrderFulfillments.filter(
    (f) =>
      f.studentName === lead.studentName ||
      f.customerPhone === lead.phone ||
      orders.some((o) => o.orderNo === f.orderNo)
  )

  if (found.length > 0) {
    return found.map((f) => ({
      id: f.id,
      trackingCode: f.trackingCode || `GHN-${f.id.slice(-6).toUpperCase()}`,
      sourceTypeLabel: f.sourceType === 'order' ? 'Đơn hàng' : 'Quà tặng CSKH',
      orderNo: f.orderNo,
      studentName: f.studentName,
      recipientName: f.recipientName || lead.parentName,
      recipientPhone: f.recipientPhone || lead.phone,
      shippingAddress: f.shippingAddress || lead.address,
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

  const order = orders[0]
  return [
    {
      id: `ful-${lead.id}`,
      trackingCode: 'GHN-8923019',
      sourceTypeLabel: 'Kèm Đơn hàng',
      orderNo: order?.orderNo || 'OD832001',
      studentName: lead.studentName,
      recipientName: lead.parentName,
      recipientPhone: lead.phone,
      shippingAddress: lead.address || 'Phường Bến Nghé, Quận 1, TP.HCM',
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
