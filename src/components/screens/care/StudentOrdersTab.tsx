'use client'

import React, { useMemo, useState } from 'react'
import {
  Receipt,
  CheckCircle2,
  BookOpen,
  Clock,
  Gift,
  ChevronDown,
  ChevronUp,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Ticket,
} from 'lucide-react'
import { mockOrders, type Order } from '@/mocks/orders'
import { formatCurrency } from '@/lib/format'
import { EmptyState } from '@/components/shared'
import { OrderDetailDialog } from '@/components/screens/orders/OrderDetailDialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

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

interface StudentOrdersTabProps {
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

  // Return realistic mock orders matching the exact legacy system screenshots
  return [
    // 1. Order OD800436 with Gift "1 x [IELTS] Khóa 5.0" & Pending Payment
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
      status: 'pending',
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

    // 2. Order OD777752 with Gift "1 x [IELTS] Khóa 4.0" & Paid Confirmed
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

    // 3. Order OD765410 with Multi-Package Transaction Conversion Allocation
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

    // 4. Order OD794023 from Fee Transfer
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

export function StudentOrdersTab({ studentId, studentName }: StudentOrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [, setIsDetailOpen] = useState(false)
  const [expandedPayments, setExpandedPayments] = useState<Record<string, boolean>>({})

  const orders = useMemo(() => getStudentOrders(studentId, studentName), [studentId, studentName])
  const transfers = useMemo(() => getFeeTransfers(studentId, studentName), [studentId, studentName])

  const toggleExpandPayments = (orderId: string) => {
    setExpandedPayments((prev) => ({
      ...prev,
      [orderId]: !(prev[orderId] ?? true),
    }))
  }

  const totalSpent = useMemo(
    () => orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? (o.totalPaidAmount ?? o.finalAmount) : 0), 0),
    [orders]
  )

  const handleViewDetail = (order: DetailedOrder) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  const scrollToOrder = (orderNo: string) => {
    const el = document.getElementById(`order-card-${orderNo}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-sky-500', 'transition-all')
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-sky-500')
      }, 2500)
    } else {
      toast.info(`Thông tin đơn hàng ${orderNo}`)
    }
  }

  return (
    <div className="space-y-3.5 text-left select-none">

      {/* ── SECTION 1: LỊCH SỬ CHUYỂN PHÍ (FEE TRANSFERS) ── */}
      {transfers.length > 0 && (
        <div className="space-y-3">
          {transfers.map((tf) => (
            <div
              key={tf.id}
              className="bg-card dark:bg-zinc-900 border border-violet-200/80 dark:border-violet-900/60 rounded-2xl p-4 shadow-2xs space-y-3.5 text-left select-none"
            >
              {/* Transfer Card Header */}
              <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-border/40 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-violet-600 text-white shrink-0">
                    🔄 Chuyển phí
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">
                    Ngày chuyển: <strong className="text-foreground">{tf.transferDate}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <button
                    type="button"
                    onClick={() => toast.info(`Mã ticket chuyển phí: ${tf.ticketCode}`)}
                    className="inline-flex items-center gap-1 font-mono font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <Ticket className="h-3.5 w-3.5 text-violet-500" />
                    <span>Mã ticket: {tf.ticketCode}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                  <span className="text-muted-foreground font-normal">
                    Người thực hiện: <strong className="text-foreground font-medium">{tf.executorName}</strong>
                  </span>
                </div>
              </div>

              {/* 2-Column Transfer Flow Layout (GÓI CŨ ➔ GÓI MỚI) */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center text-xs">
                {/* Column 1: GÓI CŨ (GÓI NGUỒN) */}
                <div className="p-3 rounded-xl bg-muted/20 dark:bg-zinc-800/30 border border-border/50 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1 pb-1 border-b border-border/30">
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                      Gói Cũ (Gói Nguồn)
                    </span>
                  </div>

                  <p className="font-bold text-foreground text-xs leading-snug">
                    Học viên: <span className="text-foreground">{tf.oldPackage.studentName}</span>{' '}
                    <span className="text-muted-foreground font-mono font-normal">
                      (UID: {tf.oldPackage.uid} - SID: {tf.oldPackage.sid})
                    </span>
                  </p>

                  <p className="text-muted-foreground leading-snug font-normal">
                    Gói: <strong className="text-foreground font-semibold">{tf.oldPackage.packageName}</strong>
                  </p>

                  <div className="text-[11px] text-muted-foreground space-y-0.5 pt-0.5">
                    <p>Lộ trình: <strong className="text-foreground">{tf.oldPackage.pathwayLevel}</strong></p>
                    <p>
                      Tổng số buổi: <strong className="text-foreground">{tf.oldPackage.totalSessions}</strong> / Số buổi chính: <strong className="text-foreground">{tf.oldPackage.mainSessions}</strong>
                    </p>
                    <p>
                      Tổng đã học: <strong className="text-foreground">{tf.oldPackage.completedTotalSessions}</strong> / Buổi chính đã học: <strong className="text-foreground">{tf.oldPackage.completedMainSessions}</strong>
                    </p>
                  </div>

                  {/* Highlight metric: Số buổi được chuyển phí */}
                  <div className="pt-1.5 border-t border-border/30">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/70 text-xs font-bold">
                      Số buổi được chuyển phí: {tf.oldPackage.transferredSessionsCount} buổi
                    </span>
                  </div>
                </div>

                {/* Arrow Transfer Indicator Icon */}
                <div className="flex items-center justify-center my-1 md:my-0">
                  <div className="h-8 w-8 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/80 shadow-3xs shrink-0">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Column 2: GÓI MỚI (GÓI NHẬN PHÍ) */}
                <div className="p-3 rounded-xl bg-muted/20 dark:bg-zinc-800/30 border border-border/50 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1 pb-1 border-b border-border/30">
                    <span className="text-[10px] font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
                      Gói Mới (Gói Nhận Phí)
                    </span>
                  </div>

                  <p className="font-bold text-foreground text-xs leading-snug">
                    Học viên nhận phí:{' '}
                    <span className="text-foreground">{tf.newPackage.recipientStudentName}</span>{' '}
                    <span className="text-muted-foreground font-mono font-normal">
                      (UID: {tf.newPackage.uid} - SID: {tf.newPackage.sid})
                    </span>
                  </p>

                  <p className="text-muted-foreground leading-snug font-normal">
                    Loại chuyển:{' '}
                    <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60">
                      {tf.newPackage.transferType}
                    </span>
                  </p>

                  <p className="text-muted-foreground leading-snug font-normal pt-0.5">
                    Gói nhận phí:{' '}
                    <strong className="text-foreground font-semibold">
                      {tf.newPackage.targetPackageName}
                    </strong>
                  </p>

                  {/* Linked Order Button */}
                  <div className="pt-2 border-t border-border/30">
                    <button
                      type="button"
                      onClick={() => scrollToOrder(tf.newPackage.linkedOrderNo)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      <span>Đơn hàng thanh toán thêm:</span>
                      <span className="font-mono bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200/60">
                        {tf.newPackage.linkedOrderNo}
                      </span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── SECTION 2: DANH SÁCH ĐƠN HÀNG (REGULAR ORDERS) ── */}
      <div className="space-y-3.5">
        {orders.map((order) => {
            const isPaymentsExpanded = expandedPayments[order.id] ?? true
            const isCancelled = order.status === 'cancelled'

            return (
              <div
                key={order.id}
                id={`order-card-${order.orderNo}`}
                className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3 select-none text-left transition-all"
              >
                {/* Header Row: Mã đơn hàng - Giá tiền / Trạng thái | Sale Rep */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-border/40 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap font-mono">
                    <button
                      type="button"
                      onClick={() => handleViewDetail(order)}
                      className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
                      title="Nhấp xem chi tiết đơn hàng"
                    >
                      <span>{order.orderNo}</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                    <span className="text-muted-foreground">-</span>
                    <span className="font-bold text-foreground">
                      {formatCurrency(order.finalAmount)}
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className={cn(
                      "font-medium px-1.5 py-0.5 rounded text-[10.5px]",
                      isCancelled
                        ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    )}>
                      {order.paymentMethodTag || 'Đã nhận bank'}
                    </span>
                  </div>

                  <div className="text-[11px] text-muted-foreground shrink-0 font-normal">
                    Sale: <span className="text-foreground font-medium">{order.saleRep} ({order.saleDate})</span>
                  </div>
                </div>

                {/* Products List Breakdown */}
                <div className="space-y-2">
                  {order.detailedItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-muted/20 dark:bg-zinc-800/30 border border-border/40 space-y-2 text-xs"
                    >
                      {/* Item Main Row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="font-bold text-foreground truncate">
                            {item.productName}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs shrink-0">
                          <span className="font-mono text-muted-foreground font-medium">
                            {item.quantity}
                          </span>
                          <div className="flex items-center gap-1 font-mono font-bold text-foreground">
                            <span>{formatCurrency(item.unitPrice)}</span>
                            {item.isPaidConfirmed && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                            )}
                          </div>
                          <span className="font-medium text-foreground min-w-[90px] text-right truncate">
                            {item.studentName}
                          </span>
                          <span className="text-muted-foreground font-medium min-w-[60px] text-right">
                            {item.orderType || '--'}
                          </span>
                        </div>
                      </div>

                      {/* Item Sub-chips (Duration, Bonus, Gift) */}
                      {(item.durationText || item.bonusText || item.giftText) && (
                        <div className="flex items-center gap-2 flex-wrap pt-0.5 text-[10.5px]">
                          {item.durationText && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span>{item.durationText}</span>
                            </div>
                          )}

                          {item.bonusText && item.bonusText !== '--' && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground">
                              <Gift className="h-3 w-3 text-emerald-600" />
                              <span>{item.bonusText}</span>
                            </div>
                          )}

                          {/* Quà tặng đính kèm (Nổi bật với badge màu xanh lá nếu có quà) */}
                          {item.giftText && item.giftText !== '--' ? (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 font-semibold">
                              <Gift className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span>🎁 {item.giftText}</span>
                            </div>
                          ) : (
                            item.giftText === '--' && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground">
                                <Gift className="h-3 w-3 text-muted-foreground" />
                                <span>--</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* LỊCH SỬ THANH TOÁN (Collapsible Payments Section) */}
                <div className="pt-2 border-t border-border/40 space-y-2 text-xs">
                  {/* Payment Header Row: Left Toggle Button | Right Summary Paid */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => toggleExpandPayments(order.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-sky-600 transition-colors cursor-pointer"
                    >
                      <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        LỊCH SỬ THANH TOÁN
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        ({order.payments && order.payments.length > 0 ? `${order.payments.length} chuyển khoản` : 'Chưa có giao dịch'})
                      </span>
                      {isPaymentsExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                    </button>

                    <div className="flex items-center gap-3 text-xs shrink-0">
                      <span className="text-muted-foreground font-normal">
                        Tổng tiền đã thanh toán: <strong className="font-mono font-extrabold text-foreground">{formatCurrency(order.totalPaidAmount ?? 0)}</strong>
                      </span>
                      {order.saleRep && (
                        <span className="text-muted-foreground font-normal hidden sm:inline">
                          Sale: <strong className="font-medium text-foreground">{order.saleRep}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Payment Transactions Content */}
                  {isPaymentsExpanded && (
                    <div className="space-y-2 pt-1">
                      {order.payments && order.payments.length > 0 ? (
                        order.payments.map((pm) => (
                          <div
                            key={pm.id}
                            className="p-2.5 rounded-xl bg-muted/20 dark:bg-zinc-800/20 border border-border/30 text-xs font-mono space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2.5 flex-wrap">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={cn(
                                    'text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0',
                                    pm.status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60'
                                      : pm.status === 'pending'
                                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200/60'
                                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200'
                                  )}
                                >
                                  {pm.status === 'completed'
                                    ? 'Thành công'
                                    : pm.status === 'pending'
                                      ? 'Chờ xử lý'
                                      : 'Hủy'}
                                </span>
                                <span className="text-muted-foreground text-[11px] shrink-0">
                                  {pm.timestamp}
                                </span>
                                <span className="font-bold text-foreground truncate">
                                  {pm.code} - {formatCurrency(pm.amount)} / {pm.method}
                                </span>
                              </div>

                              {pm.saleBy && (
                                <span className="text-[11px] text-muted-foreground shrink-0 font-sans">
                                  Sale: <strong className="font-medium text-foreground">{pm.saleBy}</strong>
                                </span>
                              )}
                            </div>

                            {/* Single Product Note & Session Conversion */}
                            {pm.note && (
                              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/20 flex-wrap">
                                <span>{pm.note}</span>
                                <div className="flex items-center gap-3">
                                  {pm.convertedSessions !== undefined && (
                                    <span>Quy đổi: <strong className="text-foreground">{pm.convertedSessions} (buổi)</strong></span>
                                  )}
                                  {pm.convertedAmount !== undefined && (
                                    <span>Tiền quy đổi: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(pm.convertedAmount)}</strong></span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Multi-Package Allocation Breakdown Tree (Dành cho giao dịch phân bổ nhiều gói) */}
                            {pm.allocations && pm.allocations.length > 0 && (
                              <div className="space-y-1.5 pt-1.5 border-t border-border/30 text-[11px] font-sans">
                                {pm.allocations.map((alloc, aIdx) => (
                                  <div key={aIdx} className="space-y-1">
                                    <div className="flex items-center justify-between font-bold text-foreground">
                                      <span>{alloc.groupName}</span>
                                      <span className="font-mono text-muted-foreground font-normal">
                                        Tiền quy đổi: {formatCurrency(alloc.groupConvertedAmount ?? 0)}
                                      </span>
                                    </div>
                                    {alloc.subItems?.map((sub, sIdx) => (
                                      <div key={sIdx} className="flex items-center justify-between text-muted-foreground pl-3 text-[10.5px]">
                                        <span>• {sub.name}</span>
                                        <div className="flex items-center gap-3 font-mono">
                                          {sub.convertedSessions !== undefined && (
                                            <span>Quy đổi: <strong className="text-foreground font-semibold">{sub.convertedSessions} (buổi)</strong></span>
                                          )}
                                          {sub.convertedAmount !== undefined && (
                                            <span>Tiền quy đổi: <strong className="text-foreground font-bold">{formatCurrency(sub.convertedAmount)}</strong></span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-[11.5px] italic text-muted-foreground/80 py-1">
                          Hiện tại chưa có giao dịch thanh toán nào đã/đang được xử lý
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      {/* Order Detail Modal Dialog */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          onOpenChange={(open) => {
            if (!open) setSelectedOrder(null)
            setIsDetailOpen(open)
          }}
        />
      )}
    </div>
  )
}
