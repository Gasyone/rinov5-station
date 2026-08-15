import { type Order } from '@/mocks/orders'

export interface SubAllocationItem {
  name: string
  convertedSessions?: number
  convertedAmount?: number
}

export interface RemainingConversionInfo {
  sessions?: number
  amount?: number
  missingAmount?: number
}

export interface TransactionAllocationGroup {
  groupName: string
  groupConvertedAmount?: number
  subItems?: SubAllocationItem[]
  remainingConversion?: RemainingConversionInfo
  showCompletePaymentLink?: boolean
}

export interface OrderPaymentTransaction {
  id: string
  code: string
  amount: number
  method: string
  timestamp: string
  status: 'completed' | 'pending' | 'cancelled'
  statusLabel?: string
  paymentType?: 'deposit' | 'final' | 'full'
  paymentTypeLabel?: string
  depositAmount?: number
  finalPaymentAmount?: number
  isLocked?: boolean
  saleBy?: string
  note?: string
  convertedSessions?: number
  convertedAmount?: number
  allocations?: TransactionAllocationGroup[]
  remainingConversion?: RemainingConversionInfo
  showCompletePaymentLink?: boolean
}

export interface DetailedOrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  isPaidConfirmed?: boolean
  studentName?: string
  categoryName?: string
  programName?: string
  teacherType?: string
  packageType?: string
  isRenewal?: boolean
  isCompleted?: boolean
  orderType?: string // e.g. "Mua mới", "Gia hạn", "--"
  durationText?: string // e.g. "90 buổi", "12 tháng"
  expiryDate?: string // e.g. "25/07/2026", "--"
  bonusText?: string // e.g. "Tặng thêm 6 buổi"
  giftText?: string // e.g. "1 x [IELTS] Khóa 5.0"
}

export interface OrderFeeTransferSummary {
  ticketCode: string
  transferDate: string
  executorName: string
  // Old package info
  oldPackageName: string
  oldPathwayLevel?: string
  oldTotalSessions?: number
  oldMainSessions?: number
  oldCompletedTotalSessions?: number
  oldCompletedMainSessions?: number
  transferredSessionsCount: number
  // New package info
  newProgramName?: string // e.g. "Chương trình Toán tư duy Tutor-Việt Nam-1:6"
  newPackageName: string // e.g. "1. [Gia sư][TH] Toán Tư Duy 1:6 (1 buổi)"
  newPathwayLevel?: string
  transferType: string
  convertedSessionsLabel: string
  linkedOrderNo?: string
}

export interface DetailedOrder extends Order {
  paymentMethodTag?: string // e.g. "T5-Đã nhận bank", "T2-Hủy", "COD / T5-Đã nhận COD", "T3-COD"
  saleRep?: string // e.g. "Vũ Thị Lan 1"
  saleDate?: string // e.g. "25-07-2026"
  totalPaidAmount?: number
  detailedItems?: DetailedOrderItem[]
  payments?: OrderPaymentTransaction[]
  sourceOrderNo?: string
  sourcePackageName?: string
  linkedDraftOrderNo?: string
  isOtherChild?: boolean
  feeTransferSummary?: OrderFeeTransferSummary
  canCreateCompletionOrder?: boolean
}

export type TransferCategory = 'fee_transfer' | 'product_conversion'

export interface FeeTransferRecord {
  id: string
  transferDate: string // e.g. "17-06-2026"
  category?: TransferCategory // 'fee_transfer' | 'product_conversion'
  categoryLabel?: string // e.g. "Chuyển đổi sản phẩm" | "Chuyển phí"
  ticketCode: string // e.g. "CP00011223" or "03650"
  executorName: string // e.g. "Nguyễn Như Ngọc" or "Lê Đức Anh 4"
  oldPackage?: {
    studentName: string
    uid: string
    sid: string
    packageName: string
    pathwayLevel: string
    totalSessions: number
    mainSessions: number
    completedTotalSessions: number
    completedMainSessions: number
    transferredSessionsCount: number
  }
  newPackage?: {
    recipientStudentName: string
    uid: string
    sid: string
    packageName?: string
    pathwayLevel?: string
    transferType: string // e.g. "Chuyển phí - Ngang tiền" | "Chuyển phí - Thanh toán thêm"
    targetPackageName: string
    convertedSessionsLabel?: string // e.g. "2 BUỔI"
    linkedOrderNo?: string // e.g. "OD794023"
  }
  productConversion?: {
    remainingDepositText?: string // e.g. "Số tiền cọc còn lại chưa quy đổi: 0 đ"
    transferredProducts: Array<{
      name: string // e.g. "[IE_TUTOR] Ielts Foundation PLUS 4.0_36 buổi"
      sessions: number // e.g. 2
      amountText: string // e.g. "438.888 đ"
    }>
    originalOrderNo?: string // e.g. "OD798202"
    newPackage: {
      receiptCode: string // e.g. "PR0000000671"
      amountText: string // e.g. "438.888 đ"
      sessions?: number
    }
  }
}

export interface StudentOrdersTabProps {
  studentId: string
  studentName: string
}

export function getFeeTransfers(studentId: string, studentName?: string): FeeTransferRecord[] {
  const displayStudentName = studentName || 'Phạm Hoàng Bách'

  return [
    {
      id: `tf-pc-1-${studentId}`,
      transferDate: '15-08-2026',
      category: 'product_conversion',
      categoryLabel: 'Chuyển đổi sản phẩm',
      ticketCode: '03650',
      executorName: 'Lê Đức Anh 4',
      productConversion: {
        remainingDepositText: 'Số tiền cọc còn lại chưa quy đổi: 0 đ',
        transferredProducts: [
          {
            name: '[IE_TUTOR] Ielts Foundation PLUS 4.0_36 buổi',
            sessions: 2,
            amountText: '438.888 đ',
          },
        ],
        originalOrderNo: 'OD798202',
        newPackage: {
          receiptCode: 'PR0000000671',
          amountText: '438.888 đ',
        },
      },
    },
    {
      id: `tf-1-${studentId}`,
      transferDate: '14-08-2026',
      category: 'fee_transfer',
      categoryLabel: 'Chuyển phí',
      ticketCode: 'CP00014156',
      executorName: 'Trần Thảo Anh 20',
      oldPackage: {
        studentName: 'Nguyễn Ngọc Diệp',
        uid: '2135678',
        sid: '191637',
        packageName: 'Chương trình Toán tư duy Tutor-Việt Nam-1:4',
        pathwayLevel: '129',
        totalSessions: 24,
        mainSessions: 24,
        completedTotalSessions: 22,
        completedMainSessions: 22,
        transferredSessionsCount: 2,
      },
      newPackage: {
        recipientStudentName: 'Nguyễn Ngọc Diệp',
        uid: '2135678',
        sid: '191637',
        packageName: 'Chương trình Toán tư duy Tutor-Việt Nam-1:6',
        pathwayLevel: '130',
        transferType: 'Chuyển phí - Ngang tiền',
        targetPackageName: '1. [Gia sư][TH] Toán Tư Duy 1:6 (1 buổi)',
        convertedSessionsLabel: '2 BUỔI',
        linkedOrderNo: 'OD803325',
      },
    },
    {
      id: `tf-2-${studentId}`,
      transferDate: '10-08-2026',
      category: 'fee_transfer',
      categoryLabel: 'Chuyển phí',
      ticketCode: 'CP00013581',
      executorName: 'Lê Thị Trà Giang 1',
      oldPackage: {
        studentName: displayStudentName,
        uid: '1792543',
        sid: '161666',
        packageName: 'Tiếng Anh School Master-Việt Nam-1:1',
        pathwayLevel: '151',
        totalSessions: 48,
        mainSessions: 48,
        completedTotalSessions: 43,
        completedMainSessions: 43,
        transferredSessionsCount: 5,
      },
      newPackage: {
        recipientStudentName: displayStudentName,
        uid: '1792543',
        sid: '161666',
        packageName: 'Chương trình Tiếng Anh School Master-Việt Nam-1:1',
        pathwayLevel: '152',
        transferType: 'Chuyển phí - Ngang tiền',
        targetPackageName: '1. [Gia sư][THCS] Tiếng Anh School Master 1:1 (1 buổi)',
        convertedSessionsLabel: '2 BUỔI',
        linkedOrderNo: 'OD794023',
      },
    },
    {
      id: `tf-pc-2-${studentId}`,
      transferDate: '01-08-2026',
      category: 'product_conversion',
      categoryLabel: 'Chuyển đổi sản phẩm',
      ticketCode: '03429',
      executorName: 'Nguyễn Như Ngọc',
      productConversion: {
        remainingDepositText: 'Số tiền cọc còn lại chưa quy đổi: 0 đ',
        transferredProducts: [
          {
            name: '[STATION] Tiếng Anh Cambridge Primary Starters_48 buổi',
            sessions: 4,
            amountText: '1.250.000 đ',
          },
        ],
        originalOrderNo: 'OD785120',
        newPackage: {
          receiptCode: 'PR0000000492',
          amountText: '1.250.000 đ',
        },
      },
    },
    {
      id: `tf-3-${studentId}`,
      transferDate: '17-06-2026',
      category: 'fee_transfer',
      categoryLabel: 'Chuyển phí',
      ticketCode: 'CP00011223',
      executorName: 'Nguyễn Như Ngọc',
      oldPackage: {
        studentName: displayStudentName,
        uid: '1792543',
        sid: '161666',
        packageName: '[Station] Tiếng Anh OMO 1:10 ( 96 buổi )',
        pathwayLevel: 'Level 3',
        totalSessions: 96,
        mainSessions: 96,
        completedTotalSessions: 8,
        completedMainSessions: 8,
        transferredSessionsCount: 88,
      },
      newPackage: {
        recipientStudentName: displayStudentName,
        uid: '1792543',
        sid: '161666',
        packageName: 'Cambridge Global Station + Gia sư',
        pathwayLevel: 'Level 4',
        transferType: 'Chuyển phí - Ngang tiền',
        targetPackageName: '[Station] Cambridge Global_ Gia sư 48 buổi + Station 96 buổi',
        convertedSessionsLabel: '88 BUỔI',
        linkedOrderNo: 'OD765410',
      },
    },
  ]
}

export function getStudentOrders(studentId: string, studentName?: string): DetailedOrder[] {
  const displayStudentName = studentName || 'Hà Phương'

  return [
    {
      id: `ord-partial-payment-${studentId}-OD803291`,
      orderNo: 'OD803291',
      studentId,
      studentName: 'Phạm nguyên khôi',
      customerName: '0983055652',
      customerPhone: '0983055652',
      shippingAddress: 'Bắc Giang, Xã Nghĩa Hưng, Huyện Lạng Giang, Bắc Giang',
      totalAmount: 2990000,
      discountAmount: 0,
      finalAmount: 2990000,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: 'T4-Thanh toán 1 phần',
      paymentOption: 'NHIỀU LẦN',
      hasDepositStudyNow: true,
      hasDepositPre: false,
      paymentStatus: 'partial',
      status: 'pending',
      branch: 'RinoEdu Bắc Giang',
      saleBy: 'Nguyễn Văn Sale',
      saleRep: 'Nguyễn Văn Sale',
      saleDate: '14-08-2026',
      createdAt: '2026-08-14T15:37:57Z',
      totalPaidAmount: 100000,
      receipts: [
        {
          id: 'rc-803291-1',
          code: 'TNX00000273948',
          amount: 100000,
          method: 'BANK',
          timestamp: '15:37:57 - 14/08/2026',
          status: 'THÀNH CÔNG',
        },
      ],
      detailedItems: [
        {
          productId: 'p-cambridge-30',
          productName: '[Gia sư] Tiếng anh 1:4 _ 30 buổi _ GV VN',
          quantity: 1,
          unitPrice: 2990000,
          subtotal: 2990000,
          studentName: 'Phạm nguyên khôi',
          orderType: 'Gia hạn',
          durationText: '30 buổi',
          categoryName: 'Sản phẩm gia sư',
          programName: 'Tiếng Anh Cambridge',
          teacherType: 'Việt Nam',
          packageType: '1:4 - 30 buổi',
          isRenewal: true,
          isCompleted: false,
          expiryDate: '14/08/2027',
          bonusText: '--',
          giftText: '--',
        },
      ],
      payments: [
        {
          id: 'pay-803291-1',
          code: 'TNX00000273948',
          amount: 100000,
          method: 'BANK',
          statusLabel: 'T5-Đã nhận bank',
          timestamp: '14-08-2026',
          status: 'completed',
          saleBy: 'Nguyễn Văn Sale',
          paymentType: 'deposit',
          paymentTypeLabel: 'Thanh toán đợt 1',
        },
      ],
      items: [
        {
          productId: 'p-cambridge-30',
          productName: '[Gia sư] Tiếng anh 1:4 _ 30 buổi _ GV VN',
          quantity: 1,
          unitPrice: 2990000,
          subtotal: 2990000,
        },
      ],
    },
    {
      id: `ord-receipts-history-${studentId}-OD772048`,
      orderNo: 'OD772048',
      studentId,
      studentName: 'Bùi Huệ Ân',
      customerName: 'Nguyễn Thị Du',
      customerPhone: '0865981348',
      shippingAddress: 'Ấp Đầu Lòng, Thị trấn Lai Uyên, Huyện Bàu Bàng, Bình Dương',
      totalAmount: 5800000,
      discountAmount: 0,
      finalAmount: 5800000,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: 'T5-Thành công',
      paymentOption: 'NHIỀU LẦN',
      hasDepositStudyNow: true,
      hasDepositPre: false,
      paymentStatus: 'paid',
      status: 'completed',
      branch: 'RinoEdu Bình Dương',
      saleBy: 'Trần Thị Sale',
      saleRep: 'Trần Thị Sale',
      saleDate: '08-01-2026',
      createdAt: '2026-01-08T21:15:11Z',
      totalPaidAmount: 5800000,
      receipts: [
        {
          id: 'rc-772048-1',
          code: 'TNX00000234942',
          amount: 2900000,
          method: 'COD',
          timestamp: '21:15:11 - 08/01/2026',
          status: 'THÀNH CÔNG',
        },
        {
          id: 'rc-772048-2',
          code: 'TNX00000234935',
          amount: 2900000,
          method: 'COD',
          timestamp: '20:21:53 - 08/01/2026',
          status: 'HỦY',
        },
        {
          id: 'rc-772048-3',
          code: 'TNX00000234934',
          amount: 2900000,
          method: 'COD',
          timestamp: '20:21:53 - 08/01/2026',
          status: 'HỦY',
        },
        {
          id: 'rc-772048-4',
          code: 'TNX00000231062',
          amount: 2900000,
          method: 'BANK',
          timestamp: '09:41:20 - 10/12/2025',
          status: 'THÀNH CÔNG',
        },
      ],
      detailedItems: [
        {
          productId: 'p-einstein-48',
          productName: '[Gia sư][TH] Toán Tư Duy 1:6 Einstein (48 buổi...)',
          quantity: 1,
          unitPrice: 5800000,
          subtotal: 5800000,
          studentName: 'Bùi Huệ Ân',
          orderType: 'Mua mới',
          durationText: '48 buổi',
          categoryName: 'Sản phẩm gia sư',
          programName: 'Chương trình Toán tư duy Tutor',
          teacherType: 'Việt Nam',
          packageType: '1:6 - 48 buổi',
          isRenewal: false,
          isCompleted: true,
          expiryDate: '08/01/2027',
          bonusText: '--',
          giftText: '--',
        },
      ],
      payments: [
        {
          id: 'pay-772048-1',
          code: 'TNX00000234942',
          amount: 2900000,
          method: 'COD',
          statusLabel: 'T5-Đã nhận COD',
          timestamp: '08-01-2026',
          status: 'completed',
          saleBy: 'Trần Thị Sale',
          paymentType: 'final',
          paymentTypeLabel: 'Thu tiền lần 2',
        },
        {
          id: 'pay-772048-4',
          code: 'TNX00000231062',
          amount: 2900000,
          method: 'BANK',
          statusLabel: 'T5-Đã nhận bank',
          timestamp: '10-12-2025',
          status: 'completed',
          saleBy: 'Trần Thị Sale',
          paymentType: 'deposit',
          paymentTypeLabel: 'Cọc lần 1',
        },
      ],
      items: [
        {
          productId: 'p-einstein-48',
          productName: '[Gia sư][TH] Toán Tư Duy 1:6 Einstein (48 buổi...)',
          quantity: 1,
          unitPrice: 5800000,
          subtotal: 5800000,
        },
      ],
    },
    {
      id: `ord-deposit-unpaid-${studentId}-DH670616`,
      orderNo: 'DH670616',
      studentId,
      studentName: 'Trương ngọc ánh',
      totalAmount: 6800000,
      discountAmount: 0,
      finalAmount: 6800000,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: 'Đơn có cọc / Chưa thanh toán',
      paymentStatus: 'partial',
      status: 'pending',
      branch: 'RinoEdu Nguyễn Tuân',
      saleBy: 'Hà Thị Ánh 2',
      saleRep: 'Hà Thị Ánh 2',
      saleDate: '09-10-2024',
      createdAt: '2024-10-09T08:30:00Z',
      totalPaidAmount: 3400000,
      canCreateCompletionOrder: true,
      detailedItems: [
        {
          productId: 'p-670616',
          productName: '[IE_TUTOR][THCS] Skill Plus_1:6_72 buổi',
          quantity: 1,
          unitPrice: 6800000,
          subtotal: 6800000,
          studentName: 'Trương ngọc ánh',
          orderType: '--',
          durationText: '72 buổi',
          expiryDate: '09/10/2025',
          bonusText: '--',
          giftText: '--',
        },
      ],
      payments: [
        {
          id: 'pay-670616-dep',
          code: 'DH670616',
          amount: 3400000,
          method: 'BANK',
          statusLabel: 'C2-Hủy',
          timestamp: '09-10-2024',
          status: 'completed',
          saleBy: 'Hà Thị Ánh 2',
          paymentType: 'deposit',
          paymentTypeLabel: 'Cọc',
          depositAmount: 3400000,
          isLocked: true,
        },
      ],
      items: [
        {
          productId: 'p-670616',
          productName: '[IE_TUTOR][THCS] Skill Plus_1:6_72 buổi',
          quantity: 1,
          unitPrice: 6800000,
          subtotal: 6800000,
        },
      ],
    },
    {
      id: `ord-deposit-${studentId}-DH715978`,
      orderNo: 'DH715978',
      studentId: `sibling-1-${studentId}`,
      studentName: 'Trần Hoàng An Chi',
      isOtherChild: true,
      totalAmount: 14000000,
      discountAmount: 0,
      finalAmount: 14000000,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: 'Đơn có cọc / Đã hoàn thành phí',
      paymentStatus: 'paid',
      status: 'completed',
      branch: 'RinoEdu Nguyễn Tuân',
      saleBy: 'Phạm Thị Thu Uyên 1',
      saleRep: 'Phạm Thị Thu Uyên 1',
      saleDate: '06-01-2025',
      createdAt: '2025-01-06T09:15:00Z',
      totalPaidAmount: 14000000,
      detailedItems: [
        {
          productId: 'p-715978',
          productName: '[Station] Toán tư duy ( 48 buổi )',
          quantity: 1,
          unitPrice: 14000000,
          subtotal: 14000000,
          isPaidConfirmed: true,
          studentName: 'Trần Hoàng An Chi',
          orderType: 'Mua mới',
          durationText: '48 buổi',
          expiryDate: '06/01/2026',
          bonusText: '--',
          giftText: '--',
        },
      ],
      payments: [
        {
          id: 'pay-715978-dep',
          code: 'DH715978',
          amount: 1000000,
          method: 'BANK',
          statusLabel: 'T5-Đã nhận bank',
          timestamp: '06-01-2025',
          status: 'completed',
          saleBy: 'Phạm Thị Thu Uyên 1',
          paymentType: 'deposit',
          paymentTypeLabel: 'Cọc',
          depositAmount: 1000000,
          isLocked: true,
        },
        {
          id: 'pay-718437-fin',
          code: 'DH718437',
          amount: 13000000,
          method: 'BANK',
          statusLabel: 'T5-Đã nhận bank',
          timestamp: '10-01-2025',
          status: 'completed',
          saleBy: 'Phạm Thị Thu Uyên 1',
          paymentType: 'final',
          paymentTypeLabel: 'Hoàn tất',
          finalPaymentAmount: 13000000,
        },
      ],
      items: [
        { productId: 'p-715978', productName: '[Station] Toán tư duy ( 48 buổi )', quantity: 1, unitPrice: 14000000, subtotal: 14000000 },
      ],
    },

    {
      id: `ord-deposit-${studentId}-DH715977`,
      orderNo: 'DH715977',
      studentId: `sibling-2-${studentId}`,
      studentName: 'Trần Hoàng An Nguyên',
      isOtherChild: true,
      totalAmount: 14000000,
      discountAmount: 0,
      finalAmount: 14000000,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: 'Đơn có cọc / Đã hoàn thành phí',
      paymentStatus: 'paid',
      status: 'completed',
      branch: 'RinoEdu Nguyễn Tuân',
      saleBy: 'Phạm Thị Thu Uyên 1',
      saleRep: 'Phạm Thị Thu Uyên 1',
      saleDate: '06-01-2025',
      createdAt: '2025-01-06T09:30:00Z',
      totalPaidAmount: 14000000,
      detailedItems: [
        {
          productId: 'p-715977',
          productName: '[Station] Toán tư duy ( 48 buổi )',
          quantity: 1,
          unitPrice: 14000000,
          subtotal: 14000000,
          isPaidConfirmed: true,
          studentName: 'Trần Hoàng An Nguyên',
          orderType: 'Mua mới',
          durationText: '48 buổi',
          expiryDate: '06/01/2026',
          bonusText: '--',
          giftText: '--',
        },
      ],
      payments: [
        {
          id: 'pay-715977-dep',
          code: 'DH715977',
          amount: 1000000,
          method: 'BANK',
          statusLabel: 'T5-Đã nhận bank',
          timestamp: '06-01-2025',
          status: 'completed',
          saleBy: 'Phạm Thị Thu Uyên 1',
          paymentType: 'deposit',
          paymentTypeLabel: 'Cọc',
          depositAmount: 1000000,
          isLocked: true,
        },
        {
          id: 'pay-718438-fin',
          code: 'DH718438',
          amount: 13000000,
          method: 'BANK',
          statusLabel: 'T5-Đã nhận bank',
          timestamp: '10-01-2025',
          status: 'completed',
          saleBy: 'Phạm Thị Thu Uyên 1',
          paymentType: 'final',
          paymentTypeLabel: 'Hoàn tất',
          finalPaymentAmount: 13000000,
        },
      ],
      items: [
        { productId: 'p-715977', productName: '[Station] Toán tư duy ( 48 buổi )', quantity: 1, unitPrice: 14000000, subtotal: 14000000 },
      ],
    },

    {
      id: `ord-legacy-${studentId}-OD803325`,
      orderNo: 'OD803325',
      studentId,
      studentName: 'Lê Nguyễn Bảo Hân',
      totalAmount: 10700000,
      discountAmount: 0,
      finalAmount: 10700000,
      paymentMethod: 'cash',
      paymentMethodTag: 'T3-COD',
      paymentStatus: 'partial',
      status: 'completed',
      branch: 'RinoEdu Nguyễn Tuân',
      saleBy: 'Trần Thảo Anh 20',
      saleRep: 'Trần Thảo Anh 20',
      saleDate: '14-08-2026',
      createdAt: '2026-08-14T09:00:00Z',
      totalPaidAmount: 2800000,
      feeTransferSummary: {
        ticketCode: 'CP00014156',
        transferDate: '14-08-2026',
        executorName: 'Trần Thảo Anh 20',
        oldPackageName: 'Chương trình Toán tư duy Tutor-Việt Nam-1:4',
        oldPathwayLevel: '129',
        oldTotalSessions: 24,
        oldMainSessions: 24,
        oldCompletedTotalSessions: 22,
        oldCompletedMainSessions: 22,
        transferredSessionsCount: 2,
        newProgramName: 'Chương trình Toán tư duy Tutor-Việt Nam-1:6',
        newPackageName: '1. [Gia sư][TH] Toán Tư Duy 1:6 (1 buổi)',
        newPathwayLevel: '130',
        transferType: 'Chuyển phí - Ngang tiền',
        convertedSessionsLabel: '2 BUỔI',
        linkedOrderNo: 'OD803325',
      },
      detailedItems: [
        {
          productId: 'p-803325',
          productName: '[Gia sư][TH] Toán Tư Duy 1:6 (96 buổi + 8 buổi ôn tập)',
          quantity: 1,
          unitPrice: 10700000,
          subtotal: 10700000,
          isPaidConfirmed: false,
          studentName: 'Lê Nguyễn Bảo Hân',
          orderType: 'Gia Hạn',
          durationText: '96 buổi',
          expiryDate: '--',
          bonusText: '--',
          giftText: '1 x [Tặng kèm không bán] Toán Tư Duy 1:6 (7 buổi)',
        },
      ],
      payments: [
        {
          id: 'pay-803325-1',
          code: 'TNX00000274076',
          amount: 7900000,
          method: 'COD',
          timestamp: '09:23:52 15/08/2026',
          status: 'pending',
          statusLabel: 'Chờ xử lý',
          saleBy: 'Trần Thảo Anh 20',
          note: '[Gia sư][TH] Toán Tư Duy 1:6 (96 buổi + 8 buổi ôn tập)',
          convertedSessions: 75,
          convertedAmount: 7907000,
        },
        {
          id: 'pay-803325-2',
          code: 'TNX00000273993',
          amount: 2800000,
          method: 'Biên nhận',
          timestamp: '18:04:04 14/08/2026',
          status: 'completed',
          statusLabel: 'Thành công',
          saleBy: 'Bot Hệ Thống',
          note: '[Gia sư][TH] Toán Tư Duy 1:6 (96 buổi + 8 buổi ôn tập)',
          convertedSessions: 21,
          convertedAmount: 2793000,
        },
      ],
      items: [
        {
          productId: 'p-803325',
          productName: '[Gia sư][TH] Toán Tư Duy 1:6 (96 buổi + 8 buổi ôn tập)',
          quantity: 1,
          unitPrice: 10700000,
          subtotal: 10700000,
        },
      ],
    },

    {
      id: `ord-legacy-${studentId}-OD800436`,
      orderNo: 'OD800436',
      studentId,
      studentName: displayStudentName,
      totalAmount: 8400000,
      discountAmount: 0,
      finalAmount: 8400000,
      paymentMethod: 'cash',
      paymentMethodTag: 'T3-COD',
      paymentStatus: 'unpaid',
      status: 'completed',
      branch: 'RinoEdu Nguyễn Tuân',
      saleBy: 'Vũ Thị Lan 1',
      saleRep: 'Vũ Thị Lan 1',
      saleDate: '25-07-2026',
      createdAt: '2026-07-25T15:10:02Z',
      totalPaidAmount: 5000000,
      detailedItems: [
        {
          productId: 'p-800',
          productName: '[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi',
          quantity: 1,
          unitPrice: 8400000,
          subtotal: 8400000,
          isPaidConfirmed: false,
          studentName: displayStudentName,
          orderType: 'Gia Hạn',
          durationText: '40 buổi',
          expiryDate: '25/07/2026',
          bonusText: '--',
          giftText: '1 x [IELTS] Khóa 5.0',
        },
      ],
      payments: [
        {
          id: 'pay-800-1',
          code: 'TNX00000269843',
          amount: 5000000,
          method: 'BANK',
          timestamp: '15:10:02 25/07/2026',
          status: 'pending',
          statusLabel: 'Chờ thanh toán',
          saleBy: 'Vũ Thị Lan 1',
          allocations: [
            {
              groupName: '[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi',
              groupConvertedAmount: 4895000,
              subItems: [
                { name: '[IE] Tiếng Anh Intermediate 1:1_22 buổi', convertedSessions: 22, convertedAmount: 4895000 },
              ],
              remainingConversion: {
                sessions: 18,
                amount: 3505000,
                missingAmount: 3400000,
              },
              showCompletePaymentLink: true,
            },
          ],
        },
      ],
      items: [
        { productId: 'p-800', productName: '[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi', quantity: 1, unitPrice: 8400000, subtotal: 8400000 },
      ],
    },

    {
      id: `ord-legacy-${studentId}-OD777752`,
      orderNo: 'OD777752',
      studentId,
      studentName: displayStudentName,
      totalAmount: 7400000,
      discountAmount: 0,
      finalAmount: 7400000,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: 'T5-Thành công',
      paymentStatus: 'paid',
      status: 'completed',
      branch: 'RinoEdu Nguyễn Tuân',
      saleBy: 'Vũ Thị Thảo Huyền 3',
      saleRep: 'Vũ Thị Thảo Huyền 3',
      saleDate: '05-02-2026',
      createdAt: '2026-02-05T10:20:00Z',
      totalPaidAmount: 7400000,
      detailedItems: [
        {
          productId: 'p-777-1',
          productName: '[IE] Tự học Ielts 4.0 ( 1 tháng )',
          quantity: 1,
          unitPrice: 0,
          subtotal: 0,
          isPaidConfirmed: true,
          studentName: displayStudentName,
          orderType: 'Gia Hạn',
          durationText: '1 tháng',
          expiryDate: '05/03/2026',
          bonusText: '--',
          giftText: '--',
        },
        {
          productId: 'p-777-2',
          productName: '[IE_TUTOR] Ielts Foundation PLUS 4.0_36 buổi',
          quantity: 1,
          unitPrice: 7400000,
          subtotal: 7400000,
          isPaidConfirmed: true,
          studentName: displayStudentName,
          orderType: 'Gia Hạn',
          durationText: '36 buổi',
          expiryDate: '05/08/2026',
          bonusText: '--',
          giftText: '1 x [IELTS] Khóa 4.0',
        },
      ],
      payments: [
        {
          id: 'pay-777-1',
          code: 'TNX00000244795',
          amount: 7400000,
          method: 'BANK',
          timestamp: '10:20:00 05/02/2026',
          status: 'completed',
          saleBy: 'Vũ Thị Thảo Huyền 3',
          note: '[IE_TUTOR] Ielts Foundation PLUS 4.0_36 buổi',
        },
      ],
      items: [
        { productId: 'p-777-1', productName: '[IE] Tự học Ielts 4.0 ( 1 tháng )', quantity: 1, unitPrice: 0, subtotal: 0 },
        { productId: 'p-777-2', productName: '[IE_TUTOR] Ielts Foundation PLUS 4.0_36 buổi', quantity: 1, unitPrice: 7400000, subtotal: 7400000 },
      ],
    },

    {
      id: `ord-legacy-${studentId}-OD765410`,
      orderNo: 'OD765410',
      studentId,
      studentName: displayStudentName,
      totalAmount: 21900000,
      discountAmount: 0,
      finalAmount: 21900000,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: 'T5-Thành công',
      paymentStatus: 'paid',
      status: 'completed',
      branch: 'RinoEdu Nguyễn Tuân',
      saleBy: 'Ngô Mạnh Tuân 2',
      saleRep: 'Ngô Mạnh Tuân 2',
      saleDate: '14-11-2025',
      createdAt: '2025-11-14T23:37:16Z',
      totalPaidAmount: 21900000,
      feeTransferSummary: {
        ticketCode: 'CP00011223',
        transferDate: '17-06-2026',
        executorName: 'Nguyễn Như Ngọc',
        oldPackageName: '[Station] Tiếng Anh OMO 1:10 ( 96 buổi )',
        oldPathwayLevel: 'Level 3',
        oldTotalSessions: 96,
        oldMainSessions: 96,
        oldCompletedTotalSessions: 8,
        oldCompletedMainSessions: 8,
        transferredSessionsCount: 88,
        newPackageName: '[Station] Cambridge Global_ Gia sư 48 buổi + Station 96 buổi',
        newPathwayLevel: 'Level 4',
        transferType: 'Chuyển phí - Ngang tiền',
        convertedSessionsLabel: '88 BUỔI',
        linkedOrderNo: 'OD765410',
      },
      detailedItems: [
        {
          productId: 'p-765-1',
          productName: '[Station] Cambridge Global_ Gia sư 48 buổi + Station 96 buổi',
          quantity: 1,
          unitPrice: 20000000,
          subtotal: 20000000,
          isPaidConfirmed: true,
          studentName: displayStudentName,
          orderType: 'Mua mới',
          durationText: '144 buổi',
          expiryDate: '14/11/2026',
          bonusText: '--',
          giftText: '--',
        },
        {
          productId: 'p-765-2',
          productName: '[Station] Học bổng Cambridge Global _ Gia sư 4 buổi + Station 8 buổi',
          quantity: 1,
          unitPrice: 1900000,
          subtotal: 1900000,
          isPaidConfirmed: true,
          studentName: displayStudentName,
          orderType: 'Mua mới',
          durationText: '12 buổi',
          expiryDate: '14/02/2026',
          bonusText: '--',
          giftText: '--',
        },
      ],
      payments: [
        {
          id: 'pay-765-1',
          code: 'TNX00000227842',
          amount: 20000000,
          method: 'BANK',
          timestamp: '23:37:16 14/11/2025',
          status: 'pending',
          statusLabel: 'Chờ thanh toán',
          saleBy: 'Ngô Mạnh Tuân 2',
          allocations: [
            {
              groupName: '[Station] Cambridge Global_ Gia sư 48 buổi + Station 96 buổi',
              groupConvertedAmount: 20500000,
              subItems: [
                { name: '[Station] Tiếng Anh OMO_1:10_96 buổi', convertedSessions: 88, convertedAmount: 20500000 },
                { name: '[Gia sư] Tiếng anh OMO 1:1 _ 48 buổi _ GV Phil', convertedSessions: 44, convertedAmount: 0 },
              ],
              remainingConversion: {
                sessions: 24,
                amount: 5000000,
                missingAmount: 3400000,
              },
              showCompletePaymentLink: true,
            },
            {
              groupName: '[Station] Học bổng Cambridge Global _ Gia sư 4 buổi + Station 8 buổi',
              groupConvertedAmount: 0,
              subItems: [
                { name: '[Station] Tiếng Anh OMO_1:10_8 buổi', convertedSessions: 8, convertedAmount: 0 },
                { name: '[Gia sư] Tiếng anh OMO 1:1 _ 4 buổi _ GV Phil', convertedSessions: 4, convertedAmount: 0 },
              ],
            },
          ],
        },
        {
          id: 'pay-765-2',
          code: 'TNX00000227518',
          amount: 1900000,
          method: 'BANK',
          timestamp: '20:44:18 12/11/2025',
          status: 'completed',
          saleBy: 'Ngô Mạnh Tuân 2',
          allocations: [
            {
              groupName: '[Station] Cambridge Global_ Gia sư 48 buổi + Station 96 buổi',
              groupConvertedAmount: 1840000,
              subItems: [
                { name: '[Station] Tiếng Anh OMO_1:10_96 buổi', convertedSessions: 8, convertedAmount: 1400000 },
                { name: '[Gia sư] Tiếng anh OMO 1:1 _ 48 buổi _ GV Phil', convertedSessions: 4, convertedAmount: 440000 },
              ],
            },
            {
              groupName: '[Station] Học bổng Cambridge Global _ Gia sư 4 buổi + Station 8 buổi',
              groupConvertedAmount: 0,
              subItems: [
                { name: '[Station] Tiếng Anh OMO_1:10_8 buổi', convertedSessions: 0, convertedAmount: 0 },
                { name: '[Gia sư] Tiếng anh OMO 1:1 _ 4 buổi _ GV Phil', convertedSessions: 0, convertedAmount: 0 },
              ],
            },
          ],
        },
      ],
      items: [
        { productId: 'p-765-1', productName: '[Station] Cambridge Global_ Gia sư 48 buổi + Station 96 buổi', quantity: 1, unitPrice: 20000000, subtotal: 20000000 },
        { productId: 'p-765-2', productName: '[Station] Học bổng Cambridge Global _ Gia sư 4 buổi + Station 8 buổi', quantity: 1, unitPrice: 1900000, subtotal: 1900000 },
      ],
    },

    {
      id: `ord-legacy-${studentId}-OD794023`,
      orderNo: 'OD794023',
      studentId,
      studentName: 'Minh Anh',
      totalAmount: 7550000,
      discountAmount: 0,
      finalAmount: 7550000,
      paymentMethod: 'bank_transfer',
      paymentMethodTag: 'T5-Thành công',
      paymentStatus: 'paid',
      status: 'completed',
      branch: 'RinoEdu Nguyễn Tuân',
      saleBy: 'Nguyễn Như Ngọc',
      saleRep: 'Nguyễn Như Ngọc',
      saleDate: '17-06-2026',
      createdAt: '2026-06-17T16:00:45Z',
      totalPaidAmount: 7550000,
      feeTransferSummary: {
        ticketCode: 'CP00013581',
        transferDate: '10-08-2026',
        executorName: 'Lê Thị Trà Giang 1',
        oldPackageName: 'Tiếng Anh School Master-Việt Nam-1:1',
        oldPathwayLevel: '151',
        oldTotalSessions: 48,
        oldMainSessions: 48,
        oldCompletedTotalSessions: 43,
        oldCompletedMainSessions: 43,
        transferredSessionsCount: 5,
        newProgramName: 'Chương trình Tiếng Anh School Master-Việt Nam-1:1',
        newPackageName: '1. [Gia sư][THCS] Tiếng Anh School Master 1:1 (1 buổi)',
        newPathwayLevel: '152',
        transferType: 'Chuyển phí - Ngang tiền',
        convertedSessionsLabel: '2 BUỔI',
        linkedOrderNo: 'OD794023',
      },
      detailedItems: [
        {
          productId: 'p-794',
          productName: '[TUTOR][THCS] Skill Builder 2.0_1:7_72 buổi',
          quantity: 1,
          unitPrice: 7550000,
          subtotal: 7550000,
          isPaidConfirmed: true,
          studentName: 'Minh Anh',
          orderType: 'Gia Hạn',
          durationText: '72 buổi',
          expiryDate: '17/12/2026',
          bonusText: '--',
          giftText: '--',
        },
      ],
      payments: [
        {
          id: 'pay-794-1',
          code: 'TNX00000261267',
          amount: 3139583,
          method: 'COD',
          timestamp: '08:45:02 18/06/2026',
          status: 'completed',
          saleBy: 'Nguyễn Như Ngọc',
          note: '[TUTOR][THCS] Skill Builder 2.0_1:7_72 buổi',
          convertedSessions: 38,
          convertedAmount: 3229178,
        },
        {
          id: 'pay-794-2',
          code: 'TNX00000261151',
          amount: 4410417,
          method: 'BANK',
          timestamp: '16:00:45 17/06/2026',
          status: 'completed',
          saleBy: 'Đạt Hà Thắng',
        },
      ],
      items: [
        { productId: 'p-794', productName: '[TUTOR][THCS] Skill Builder 2.0_1:7_72 buổi', quantity: 1, unitPrice: 7550000, subtotal: 7550000 },
      ],
    },
  ]
}
