import type { DetailedOrder, DetailedOrderItem, OrderPaymentTransaction } from '@/components/screens/care/student-orders/studentOrdersTypes'
import type { Lead } from '@/mocks/crmLeads'

export function parseVndAmount(value?: string | number): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  const clean = value.replace(/[^\d]/g, '')
  return clean ? parseInt(clean, 10) : 0
}

export function mapLeadToDetailedOrders(lead: Lead, allLeads: Lead[] = []): DetailedOrder[] {
  const result: DetailedOrder[] = []

  // 1. Current Order (Gói hiện tại)
  if (lead.orderCode) {
    const totalAmount = parseVndAmount(lead.expectedAmount) || 14500000
    let totalPaidAmount = 0
    if (lead.orderStatus === 'paid') {
      totalPaidAmount = totalAmount
    } else if (lead.paymentTerm?.includes('5 triệu')) {
      totalPaidAmount = 5000000
    } else if (lead.paymentTerm?.includes('2.5 triệu')) {
      totalPaidAmount = 2500000
    } else if (lead.paymentTerm?.includes('Cọc 50%')) {
      totalPaidAmount = Math.round(totalAmount * 0.5)
    } else if (lead.orderStatus === 'partial') {
      totalPaidAmount = 5000000
    } else {
      totalPaidAmount = 0
    }

    const detailedItems: DetailedOrderItem[] =
      lead.packages && lead.packages.length > 0
        ? lead.packages.map((pkg, idx) => ({
            productId: pkg.id || `p-${idx + 1}`,
            productName: pkg.name,
            quantity: 1,
            unitPrice: parseVndAmount(pkg.amount) || Math.round(totalAmount / (lead.packages?.length || 1)),
            subtotal: parseVndAmount(pkg.amount) || Math.round(totalAmount / (lead.packages?.length || 1)),
            studentName: lead.studentName,
            orderType: 'Mua mới',
            durationText: pkg.duration || '48 buổi',
            categoryName: 'Sản phẩm gia sư',
            programName: pkg.subject || lead.targetSubject,
            teacherType: 'Việt Nam',
            packageType: 'Tiêu chuẩn',
            bonusText: idx === 0 ? 'Tặng kèm 1 buổi trải nghiệm CLB' : undefined,
            isRenewal: false,
            isCompleted: false,
          }))
        : [
            {
              productId: `p-${lead.orderCode}`,
              productName: lead.expectedPackage || lead.targetSubject || 'Khóa học tiếng Anh',
              quantity: 1,
              unitPrice: totalAmount,
              subtotal: totalAmount,
              studentName: lead.studentName,
              orderType: 'Mua mới',
              durationText: '48 buổi',
              categoryName: 'Sản phẩm gia sư',
              programName: lead.targetSubject,
              teacherType: 'Việt Nam',
              isRenewal: false,
              isCompleted: false,
            },
          ]

    const payments: OrderPaymentTransaction[] = []
    if (totalPaidAmount > 0) {
      payments.push({
        id: `pay-${lead.orderCode}-1`,
        code: `TNX00000${lead.orderCode.replace(/\D/g, '') || '9230'}1`,
        amount: totalPaidAmount,
        method: 'BANK',
        timestamp: `${lead.orderDate || lead.createdAt} 14:30`,
        status: 'completed',
        statusLabel: 'T5-Đã nhận bank',
        paymentType: totalPaidAmount >= totalAmount ? 'full' : 'deposit',
        paymentTypeLabel:
          lead.paymentTerm || (totalPaidAmount >= totalAmount ? 'Thanh toán 100%' : 'Đã cọc giữ chỗ'),
        saleBy: lead.assignedTo || 'Trần Thị Mai (Sales)',
        note: 'Thanh toán chuyển khoản ngân hàng',
      })
    }

    result.push({
      id: `ord-${lead.orderCode}`,
      orderNo: lead.orderCode,
      studentId: lead.code || lead.id,
      studentName: lead.studentName,
      customerName: `${lead.parentName} (${lead.phone})`,
      customerPhone: lead.phone,
      shippingAddress: lead.address,
      totalAmount,
      discountAmount: 0,
      finalAmount: totalAmount,
      totalPaidAmount,
      paymentMethod: 'bank_transfer',
      paymentMethodTag:
        lead.paymentTerm || (totalPaidAmount >= totalAmount ? 'T5-Đã nhận bank' : 'Đơn có cọc'),
      paymentStatus: totalPaidAmount >= totalAmount ? 'paid' : totalPaidAmount > 0 ? 'partial' : 'unpaid',
      status: totalPaidAmount >= totalAmount ? 'completed' : 'processing',
      branch: lead.branch,
      saleBy: lead.assignedTo,
      saleRep: lead.assignedTo,
      saleDate: lead.orderDate || lead.createdAt,
      createdAt: lead.orderDate
        ? `${lead.orderDate.split('/').reverse().join('-')}T09:00:00Z`
        : new Date().toISOString(),
      items: detailedItems.map((d) => ({
        productId: d.productId,
        productName: d.productName,
        quantity: d.quantity,
        unitPrice: d.unitPrice,
        subtotal: d.subtotal,
      })),
      detailedItems,
      payments,
      isCurrentPackage: true,
      canCreateCompletionOrder: totalPaidAmount > 0 && totalPaidAmount < totalAmount,
      remainingSessions: 48,
    })
  }

  // 2. Draft Orders (Đơn hàng nháp)
  if (lead.id === 'lead-001') {
    result.push({
      id: 'OD-DRAFT-9232',
      orderNo: 'OD-DRAFT-9232',
      studentId: lead.code || lead.id,
      studentName: lead.studentName,
      customerName: `${lead.parentName} (${lead.phone})`,
      customerPhone: lead.phone,
      totalAmount: 6000000,
      discountAmount: 0,
      finalAmount: 6000000,
      totalPaidAmount: 0,
      paymentMethod: 'cash',
      paymentStatus: 'unpaid',
      status: 'pending',
      branch: lead.branch,
      saleBy: lead.assignedTo,
      saleRep: lead.assignedTo,
      saleDate: lead.createdAt,
      createdAt: new Date().toISOString(),
      paymentMethodTag: 'COD / Đơn nháp',
      items: [
        {
          productId: 'p-draft-1',
          productName: 'Gói Nâng cao Kỹ năng Cambridge Starters Plus',
          quantity: 1,
          unitPrice: 6000000,
          subtotal: 6000000,
        },
      ],
      detailedItems: [
        {
          productId: 'p-draft-1',
          productName: 'Gói Nâng cao Kỹ năng Cambridge Starters Plus',
          quantity: 1,
          unitPrice: 6000000,
          subtotal: 6000000,
          studentName: lead.studentName,
          orderType: 'Mua mới',
          durationText: '30 buổi',
          categoryName: 'Sản phẩm trung tâm',
          programName: lead.targetSubject,
        },
      ],
      payments: [],
      isCurrentPackage: false,
    })
  }

  // 3. Historical / Previous Orders (Gói đã mua & Chu kỳ trước)
  if (lead.previousOrders && lead.previousOrders.length > 0) {
    for (const prev of lead.previousOrders) {
      const amount = parseVndAmount(prev.amount) || 2500000
      result.push({
        id: `ord-${prev.orderCode}`,
        orderNo: prev.orderCode,
        studentId: lead.code || lead.id,
        studentName: lead.studentName,
        customerName: `${lead.parentName} (${lead.phone})`,
        customerPhone: lead.phone,
        totalAmount: amount,
        discountAmount: 0,
        finalAmount: amount,
        totalPaidAmount: prev.status === 'paid' ? amount : 0,
        paymentMethod: 'bank_transfer',
        paymentMethodTag: 'T5-Đã nhận bank',
        paymentStatus: prev.status === 'paid' ? 'paid' : 'partial',
        status: 'completed',
        branch: lead.branch,
        saleBy: 'Lê Hoàng Nam (Sales)',
        saleRep: 'Lê Hoàng Nam (Sales)',
        saleDate: prev.orderDate,
        createdAt: prev.orderDate,
        isCurrentPackage: false,
        isExpired: true,
        items: [
          {
            productId: `pkg-${prev.orderCode}`,
            productName: prev.packageName,
            quantity: 1,
            unitPrice: amount,
            subtotal: amount,
          },
        ],
        detailedItems: [
          {
            productId: `pkg-${prev.orderCode}`,
            productName: prev.packageName,
            quantity: 1,
            unitPrice: amount,
            subtotal: amount,
            studentName: lead.studentName,
            orderType: 'Mua mới',
            durationText: 'Chu kỳ trước',
            categoryName: 'Sản phẩm trung tâm',
            programName: lead.targetSubject,
            isCompleted: true,
          },
        ],
        payments: [
          {
            id: `pay-${prev.orderCode}`,
            code: `TNX00000${prev.orderCode.replace(/\D/g, '') || '78201'}`,
            amount,
            method: 'BANK',
            timestamp: `${prev.orderDate} 11:20`,
            status: 'completed',
            statusLabel: 'T5-Đã nhận bank',
            paymentType: 'full',
            paymentTypeLabel: prev.paymentTerm || 'Đã cọc 2.5 triệu',
            saleBy: 'Lê Hoàng Nam (Sales)',
            note: 'Nộp cọc giữ chỗ chu kỳ 1',
          },
        ],
      })
    }
  }

  // 4. Sibling Orders (Xem đơn các con khác)
  const siblingLeads = allLeads.filter(
    (l) => l.id !== lead.id && l.parentId === lead.parentId && Boolean(l.orderCode)
  )

  for (const sibling of siblingLeads) {
    const siblingTotal = parseVndAmount(sibling.expectedAmount) || 22000000
    const siblingPaid = sibling.paymentTerm?.includes('5 triệu') ? 5000000 : 0
    result.push({
      id: `ord-sibling-${sibling.orderCode}`,
      orderNo: sibling.orderCode || 'OD-SIBLING',
      studentId: sibling.code || sibling.id,
      studentName: `${sibling.studentName} (${sibling.studentAge}t)`,
      customerName: `${sibling.parentName} (${sibling.phone})`,
      customerPhone: sibling.phone,
      totalAmount: siblingTotal,
      discountAmount: 0,
      finalAmount: siblingTotal,
      totalPaidAmount: siblingPaid,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: sibling.paymentTerm || 'Đơn có cọc',
      paymentStatus: 'partial',
      status: 'processing',
      branch: sibling.branch,
      saleBy: sibling.assignedTo,
      saleRep: sibling.assignedTo,
      saleDate: sibling.orderDate || sibling.createdAt,
      createdAt: sibling.orderDate || sibling.createdAt,
      isOtherChild: true,
      isCurrentPackage: true,
      items: [
        {
          productId: `pkg-sib-${sibling.orderCode}`,
          productName: sibling.expectedPackage || sibling.targetSubject || 'Gói học anh chị em',
          quantity: 1,
          unitPrice: siblingTotal,
          subtotal: siblingTotal,
        },
      ],
      detailedItems: [
        {
          productId: `pkg-sib-${sibling.orderCode}`,
          productName: sibling.expectedPackage || sibling.targetSubject || 'Gói học anh chị em',
          quantity: 1,
          unitPrice: siblingTotal,
          subtotal: siblingTotal,
          studentName: `${sibling.studentName} (${sibling.studentAge}t)`,
          orderType: 'Mua mới',
          durationText: '48 buổi',
          categoryName: 'Sản phẩm gia sư',
          programName: sibling.targetSubject,
        },
      ],
      payments: [
        {
          id: `pay-sib-${sibling.orderCode}`,
          code: `TNX00000${sibling.orderCode?.replace(/\D/g, '') || '9231'}1`,
          amount: siblingPaid,
          method: 'BANK',
          timestamp: `${sibling.orderDate || sibling.createdAt} 15:40`,
          status: 'completed',
          statusLabel: 'T5-Đã nhận bank',
          paymentType: 'deposit',
          paymentTypeLabel: sibling.paymentTerm || 'Đã cọc 5 triệu',
          saleBy: sibling.assignedTo,
        },
      ],
    })
  }

  return result
}
