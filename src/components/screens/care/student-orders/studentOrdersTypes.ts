import { type Order } from '@/mocks/orders'

export interface SubAllocationItem {
  name: string
  convertedSessions?: number
  convertedAmount?: number
}

export interface TransactionAllocationGroup {
  groupName: string
  groupConvertedAmount?: number
  subItems?: SubAllocationItem[]
}

export interface OrderPaymentTransaction {
  id: string
  code: string
  amount: number
  method: string
  timestamp: string
  status: 'completed' | 'pending' | 'cancelled'
  saleBy?: string
  note?: string
  convertedSessions?: number
  convertedAmount?: number
  allocations?: TransactionAllocationGroup[]
}

export interface DetailedOrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  isPaidConfirmed?: boolean
  studentName?: string
  orderType?: string // e.g. "Mua mới", "Gia hạn", "--"
  durationText?: string // e.g. "90 buổi", "12 tháng"
  bonusText?: string // e.g. "Tặng thêm 6 buổi"
  giftText?: string // e.g. "1 x [IELTS] Khóa 5.0"
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
}

export interface FeeTransferRecord {
  id: string
  transferDate: string // e.g. "17-06-2026"
  ticketCode: string // e.g. "CP00011223"
  executorName: string // e.g. "Nguyễn Như Ngọc"
  oldPackage: {
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
  newPackage: {
    recipientStudentName: string
    uid: string
    sid: string
    transferType: string // e.g. "Chuyển phí - Thanh toán thêm"
    targetPackageName: string
    linkedOrderNo: string // e.g. "OD794023"
  }
}

export interface StudentOrdersTabProps {
  studentId: string
  studentName: string
}

export function getFeeTransfers(studentId: string, studentName?: string): FeeTransferRecord[] {
  const displayStudentName = studentName || 'Minh Anh'

  return [
    {
      id: `tf-1-${studentId}`,
      transferDate: '17-06-2026',
      ticketCode: 'CP00011223',
      executorName: 'Nguyễn Như Ngọc',
      oldPackage: {
        studentName: displayStudentName,
        uid: '2054696',
        sid: '170653',
        packageName: 'Tiếng Anh Cambridge-Việt Nam-1:4',
        pathwayLevel: '24',
        totalSessions: 192,
        mainSessions: 192,
        completedTotalSessions: 134,
        completedMainSessions: 134,
        transferredSessionsCount: 58,
      },
      newPackage: {
        recipientStudentName: displayStudentName,
        uid: '2054696',
        sid: '170653',
        transferType: 'Chuyển phí - Thanh toán thêm',
        targetPackageName: '1. [TUTOR][THCS] Skill Builder 2.0_1:7_72 buổi ( SL: 1 )',
        linkedOrderNo: 'OD794023',
      },
    },
  ]
}

export function getStudentOrders(studentId: string, studentName?: string): DetailedOrder[] {
  const displayStudentName = studentName || 'Hà Phương'

  return [
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
      totalPaidAmount: 0,
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
          bonusText: '--',
          giftText: '1 x [IELTS] Khóa 5.0',
        },
      ],
      payments: [
        {
          id: 'pay-800-1',
          code: 'TNX00000269843',
          amount: 5000000,
          method: 'COD',
          timestamp: '15:10:02 25/07/2026',
          status: 'pending',
          saleBy: 'Vũ Thị Lan 1',
          note: '[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi',
          convertedSessions: 22,
          convertedAmount: 4895000,
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
          bonusText: '--',
          giftText: '1 x [IELTS] Khóa 4.0',
        },
      ],
      payments: [
        {
          id: 'pay-777-1',
          code: 'TNX00000249821',
          amount: 7400000,
          method: 'BANK',
          timestamp: '11:20:15 05/02/2026',
          status: 'completed',
          saleBy: 'Vũ Thị Thảo Huyền 3',
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
          status: 'completed',
          saleBy: 'Ngô Mạnh Tuân 2',
          allocations: [
            {
              groupName: '[Station] Cambridge Global_ Gia sư 48 buổi + Station 96 buổi',
              groupConvertedAmount: 20500000,
              subItems: [
                { name: '[Station] Tiếng Anh OMO_1:10_96 buổi', convertedSessions: 88, convertedAmount: 20500000 },
                { name: '[Gia sư] Tiếng anh OMO 1:1 _ 48 buổi _ GV Phil', convertedSessions: 44, convertedAmount: 0 },
              ],
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
