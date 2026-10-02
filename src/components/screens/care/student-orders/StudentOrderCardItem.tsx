'use client'

import React from 'react'
import {
  ExternalLink,
  Gift,
  ChevronUp,
  ChevronDown,
  Pencil,
  Share2,
  Clock,
  Hourglass,
  Lock,
  BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { DetailedOrder, DetailedOrderItem } from './studentOrdersTypes'
import { OrderFeeTransferSummaryPopover } from './OrderFeeTransferSummaryPopover'

interface StudentOrderCardItemProps {
  order: DetailedOrder
  isDraft: boolean
  isCurrent: boolean
  isPaymentsExpanded: boolean
  showOtherChildren?: boolean
  draftOrders?: DetailedOrder[]
  onToggleExpandPayments: (orderId: string) => void
  onViewDetail: (order: DetailedOrder) => void
  onCreateDraftFromPackage?: (order: DetailedOrder) => void
  onCreateCompletionOrder?: (order: DetailedOrder) => void
  onAddPayment?: (order: DetailedOrder) => void
  onDeleteDraft?: (orderId: string) => void
  onScrollToOrder: (orderNo: string) => void
}

export function StudentOrderCardItem({
  order,
  isDraft,
  isPaymentsExpanded,
  onToggleExpandPayments,
  onViewDetail,
  onCreateCompletionOrder,
  onAddPayment,
  onScrollToOrder,
}: StudentOrderCardItemProps) {
  const isCancelled = order.status === 'cancelled'
  const isDepositOrder =
    order.orderNo?.startsWith('DH') ||
    Boolean(order.canCreateCompletionOrder) ||
    order.paymentMethodTag?.toLowerCase().includes('đơn có cọc') ||
    order.paymentMethodTag?.toLowerCase().includes('cọc') ||
    Boolean(order.hasDepositPre) ||
    Boolean(order.hasDepositStudyNow) ||
    order.payments?.some((p) => p.paymentType === 'deposit' || p.paymentTypeLabel === 'Cọc')

  // Quy đổi buổi chỉ áp dụng cho đơn cọc học luôn (đơn thường hoặc combo) hoặc đơn nhận chuyển phí
  const showConversion = Boolean(order.hasDepositStudyNow || order.feeTransferSummary)

  const hasRemainingConversion = (rem?: { sessions?: number; amount?: number; missingAmount?: number }) => {
    if (!rem) return false
    // Đã thanh toán đủ thì không còn dòng Quy đổi còn lại
    const isOrderFullyPaid =
      (order.totalPaidAmount ?? 0) >= order.finalAmount && order.finalAmount > 0
    if (isOrderFullyPaid) return false

    return (rem.sessions ?? 0) > 0 || (rem.amount ?? 0) > 0 || (rem.missingAmount ?? 0) > 0
  }

  return (
    <div
      id={`order-card-${order.orderNo || order.id}`}
      className={cn(
        'bg-card dark:bg-zinc-900 border rounded-2xl p-2.5 shadow-2xs space-y-2 text-left transition-all group overflow-hidden',
        isDraft
          ? 'border-amber-200/80 dark:border-amber-900/60 bg-amber-50/15 dark:bg-amber-950/10'
          : 'border-border/80'
      )}
    >
      {/* Unified Top Header Area (Combined Draft Link & Order Header with 1 background color) */}
      <div
        className={cn(
          '-mx-2.5 -mt-2.5 px-3 py-2 border-b text-xs space-y-1.5 rounded-t-2xl',
          isDraft
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/50'
            : 'bg-muted/40 dark:bg-zinc-800/40 border-border/20'
        )}
      >
        {/* Line 1 (for Draft Orders): Link to source package & Delete icon */}
        {isDraft && (
          <div className="flex items-center justify-between gap-2 text-xs pb-1.5 border-b border-amber-200/50 dark:border-amber-900/40 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-amber-800 dark:text-amber-400">🔗 Đơn tái phí từ gói:</span>
              <button
                type="button"
                onClick={() => onScrollToOrder(order.sourceOrderNo || 'OD800436')}
                className="font-bold font-mono text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{order.sourcePackageName || '[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi'}</span>
                <span className="text-muted-foreground font-normal">({order.sourceOrderNo || 'OD800436'})</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100/90 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200">
                Đang chờ duyệt & thanh toán
              </span>

              {/* Edit Icon Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetail(order)
                }}
                className="p-1 rounded text-zinc-500 hover:text-amber-700 hover:bg-amber-100/80 dark:hover:bg-amber-950/60 dark:hover:text-amber-300 transition-all cursor-pointer"
                title="Chỉnh sửa đơn hàng"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              {/* Share / Copy Landing Page Link Icon Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
                  const quoteUrl = `${origin}/quote/${order.orderNo || order.id}`
                  navigator.clipboard.writeText(quoteUrl)
                  toast.success('Đã sao chép link báo giá gửi phụ huynh!', {
                    description: quoteUrl,
                    action: {
                      label: 'Xem Landing Page ↗',
                      onClick: () => window.open(quoteUrl, '_blank'),
                    },
                  })
                }}
                className="p-1 rounded text-zinc-500 hover:text-sky-600 hover:bg-sky-100/80 dark:hover:bg-sky-950/60 dark:hover:text-sky-300 transition-all cursor-pointer"
                title="Chia sẻ link báo giá (Landing Page)"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Parent Order Notice (if this is a completion order linked to deposit) */}
        {order.sourceOrderNo && !isDraft && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground pb-0.5 font-sans">
            <span>Đơn hoàn tất từ đơn cọc:</span>
            <button
              type="button"
              onClick={() => onScrollToOrder(order.sourceOrderNo!)}
              className="font-mono font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>{order.sourceOrderNo}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Line 2: Order Summary Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          {/* Left Side: Order Code Link + (Student Name when viewing other children) + Status Tag + Fee Transfer Summary */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onViewDetail(order)}
              className="font-mono text-sm font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
              title="Nhấp xem chi tiết đơn hàng"
            >
              <span>{order.orderNo || order.id}</span>
              <ExternalLink className="h-3 w-3 text-sky-500/70" />
            </button>

            <span className="text-muted-foreground">/</span>
            <span
              className={cn(
                'font-medium text-xs font-sans',
                isCancelled
                  ? 'text-zinc-500'
                  : 'text-foreground'
              )}
            >
              {order.paymentMethodTag || 'T5-Đã nhận bank'}
            </span>
            {order.feeTransferSummary && (
              <OrderFeeTransferSummaryPopover
                summary={order.feeTransferSummary}
                onScrollToOrder={onScrollToOrder}
              />
            )}
          </div>

          <div className="text-xs text-muted-foreground shrink-0 font-normal font-sans">
            Người lên đơn: <span className="text-foreground font-medium">{order.saleRep || order.saleBy || 'Lê Phương Thảo'} {order.saleDate ? `(${order.saleDate})` : ''}</span>
          </div>
        </div>
      </div>

      {/* Products List Breakdown */}
      <div className="space-y-2 py-1">
        {(order.detailedItems && order.detailedItems.length > 0
          ? order.detailedItems
          : order.items && order.items.length > 0
            ? order.items.map(
                (it): DetailedOrderItem => ({
                  productId: it.productId,
                  productName: it.productName,
                  quantity: it.quantity,
                  unitPrice: it.unitPrice,
                  subtotal: it.subtotal,
                  studentName: order.studentName,
                  orderType: '--',
                  durationText: '48 buổi',
                  bonusText: '--',
                  giftText: '--',
                  isCombo: false,
                  comboItems: [],
                })
              )
            : []
        ).map((item: DetailedOrderItem, idx) => {
          const itemStudentName = item.studentName || order.studentName
          const isComboProduct = Boolean(
            item.isCombo || (item.comboItems && item.comboItems.length > 0)
          )

          // GÓI COMBO: Header hiển thị Tên gói + Tên con + SL + TT, phía dưới thụt vào n dòng sản phẩm con
          if (isComboProduct && item.comboItems && item.comboItems.length > 0) {
            return (
              <div
                key={idx}
                className="space-y-2 text-xs"
              >
                {/* Combo Header Row: [Book Icon] [Mua mới/Gia hạn] [Tên Gói Combo] --- [Tên con] SL: 1 TT: 45.528.750 đ */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Left: Green Book Icon + Tên gói Combo + Nhãn Mua mới/Gia hạn (sau tên gói SP) */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-semibold text-[13px] text-foreground leading-snug truncate">
                      {item.productName}
                    </span>
                    {item.orderType && item.orderType !== '--' && (
                      <span className="text-[10.5px] font-medium px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/40 shrink-0 font-sans">
                        {item.orderType}
                      </span>
                    )}
                  </div>

                  {/* Right: Tên con (ở phía trước số lượng) + SL + TT (bỏ tích xanh) */}
                  <div className="flex items-center gap-3 text-xs shrink-0 font-sans ml-auto">
                    {itemStudentName && (
                      <span className="font-semibold text-foreground">
                        <span className="text-muted-foreground font-normal">HV: </span>
                        {itemStudentName}
                      </span>
                    )}

                    <span className="text-muted-foreground">
                      SL: <strong className="font-bold font-mono text-foreground">{item.quantity}</strong>
                    </span>

                    <span className="text-muted-foreground">
                      TT: <strong className="font-bold font-mono text-foreground">{formatCurrency(item.subtotal || item.unitPrice * item.quantity)}</strong>
                    </span>
                  </div>
                </div>

                {/* Danh sách n dòng sản phẩm con của gói Combo (Thụt lề) */}
                <div className="space-y-1.5 pl-5 pt-0.5">
                  {item.comboItems.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center justify-between gap-3 text-xs text-muted-foreground flex-nowrap py-0.5"
                    >
                      {/* Left: Dấu chấm tròn • + Tên sản phẩm con */}
                      <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                        <span className="text-foreground font-semibold">•</span>
                        <span className="text-foreground/90 font-normal leading-snug truncate">
                          {sub.name}
                        </span>
                      </div>

                      {/* Right: Thời lượng (Đồng hồ) + Số buổi tặng thêm (Đồng hồ cát) - căn trái chuẩn cột, không căn phải */}
                      <div className="flex items-center gap-6 sm:gap-8 text-xs font-sans shrink-0 ml-auto whitespace-nowrap">
                        <div className="flex items-center gap-1.5 w-[80px] shrink-0 justify-start text-left">
                          <Clock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                          <span>{sub.durationText || '--'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 w-[170px] shrink-0 justify-start text-left">
                          <Hourglass className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                          <span>{sub.bonusText || '--'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hộp quà tặng kèm */}
                <div className="mx-0 mt-1 px-3 py-1.5 rounded-lg border border-border/40 bg-muted/20 dark:bg-zinc-800/30 flex items-center gap-2 text-xs text-muted-foreground">
                  <Gift className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                  <span>{item.giftText && item.giftText.trim() !== '' ? item.giftText : '--'}</span>
                </div>
              </div>
            )
          }

          // GÓI ĐƠN THƯỜNG (Single Item)
          return (
            <div
              key={idx}
              className="space-y-1 text-xs"
            >
              {/* Product Info Line */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Left: Book Icon + Product Name + Nhãn Mua mới/Gia hạn (sau tên SP) */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-normal text-[13px] text-foreground leading-snug truncate">
                    {item.productName}
                  </span>
                  {item.orderType && item.orderType !== '--' && (
                    <span className="text-[10.5px] font-medium px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/40 shrink-0 font-sans">
                      {item.orderType}
                    </span>
                  )}
                </div>

                {/* Right: Tên con (ở phía trước số lượng) + SL + TT (sát cạnh phải) */}
                <div className="flex items-center gap-3 text-xs shrink-0 font-sans ml-auto">
                  {itemStudentName && (
                    <span className="font-semibold text-foreground">
                      <span className="text-muted-foreground font-normal">HV: </span>
                      {itemStudentName}
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    SL: <strong className="font-bold font-mono text-foreground">{item.quantity}</strong>
                  </span>
                  <span className="text-muted-foreground">
                    TT: <strong className="font-bold font-mono text-foreground">{formatCurrency(item.subtotal || item.unitPrice * item.quantity)}</strong>
                  </span>
                </div>
              </div>

              {/* Sub-line: Duration (Clock), Bonus Extra Sessions (Hourglass), Gift */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pl-6 flex-wrap">
                {/* Duration / Sessions */}
                <div className="flex items-center gap-1 font-sans whitespace-nowrap">
                  <Clock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                  <span>{item.durationText && item.durationText !== '--' ? item.durationText : '48 buổi'}</span>
                </div>

                {/* Bonus Extra Sessions (Hourglass) */}
                <div className="flex items-center gap-1 font-sans whitespace-nowrap">
                  <Hourglass className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                  <span>{item.bonusText && item.bonusText !== '--' ? item.bonusText : '--'}</span>
                </div>

                {/* Gift (Gift icon) - Only display when gift is present */}
                {item.giftText && item.giftText !== '--' && item.giftText.trim() !== '' && (
                  <div className="flex items-center gap-1 font-sans">
                    <Gift className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                    <span>{item.giftText}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* LỊCH SỬ THANH TOÁN (Collapsible Payments Section - Only for Paid/Purchased Orders) */}
      {!isDraft && (
        <div className="pt-2 border-t border-border/40 space-y-2 text-xs">
          {/* Payment Header Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onToggleExpandPayments(order.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-sky-600 transition-colors cursor-pointer"
              >
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                  LỊCH SỬ THANH TOÁN
                </span>
                <span className="text-[10.5px] text-muted-foreground font-normal font-mono">
                  ({order.payments?.length ?? 0})
                </span>
                {isPaymentsExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>

              {/* Nhãn cọc phía sau title Lịch sử thanh toán: hiển thị text màu xanh thôi, không viền, không nền */}
              {(isDepositOrder || order.hasDepositStudyNow || order.hasDepositPre) && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs font-sans">
                  {order.hasDepositStudyNow ? 'Cọc học luôn' : 'Cọc'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-xs shrink-0 flex-wrap">
              <span className="text-muted-foreground font-normal">
                Tổng tiền đã thanh toán:{' '}
                <span
                  className={cn(
                    'font-mono font-bold',
                    (order.totalPaidAmount ?? 0) >= order.finalAmount && order.finalAmount > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-orange-600 dark:text-orange-500'
                  )}
                >
                  {formatCurrency(order.totalPaidAmount ?? 0)}
                  <span className="text-muted-foreground font-sans font-normal"> / </span>
                  {formatCurrency(order.finalAmount)}
                </span>
              </span>

              {/* + Thanh toán thêm Button (Chỉ dành cho đơn thông thường đã thanh toán 1 phần nhưng chưa hết, KHÔNG DÀNH CHO ĐƠN CỌC) */}
              {(order.totalPaidAmount ?? 0) > 0 &&
                (order.totalPaidAmount ?? 0) < order.finalAmount &&
                !isDepositOrder && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onAddPayment) {
                        onAddPayment(order)
                      } else {
                        onViewDetail(order)
                      }
                    }}
                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-2 py-0.5 rounded-md cursor-pointer transition-all shadow-2xs shrink-0"
                    title="Ghi nhận số tiền thanh toán thêm"
                  >
                    <span>+ Thanh toán thêm</span>
                  </button>
                )}
            </div>
          </div>

          {/* Collapsible Payment Transactions Content (Flat, no borders/backgrounds) */}
          {isPaymentsExpanded && (
            <div className="space-y-2 pt-1">
              {order.payments && order.payments.length > 0 ? (
                order.payments.map((pm) => {
                  const isDeposit = pm.paymentType === 'deposit' || pm.paymentTypeLabel === 'Cọc' || isDepositOrder

                  return (
                    <div
                      key={pm.id}
                      className="py-1 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2.5 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              'text-xs font-semibold px-2 py-0.5 rounded-md border shrink-0 shadow-2xs',
                              pm.statusLabel === 'Chờ xử lý'
                                ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white border-blue-600'
                                : pm.status === 'pending' || pm.statusLabel === 'Chờ thanh toán'
                                  ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/70 shadow-none'
                                  : pm.status === 'cancelled' || pm.statusLabel === 'Hủy'
                                    ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 shadow-none'
                                    : 'bg-emerald-600 text-white dark:bg-emerald-700 dark:text-white border-emerald-600'
                            )}
                          >
                            {pm.statusLabel === 'Chờ xử lý'
                              ? 'Chờ xử lý'
                              : pm.status === 'pending' || pm.statusLabel === 'Chờ thanh toán'
                                ? 'Chờ thanh toán'
                                : pm.status === 'cancelled' || pm.statusLabel === 'Hủy'
                                  ? 'Hủy'
                                  : 'Thành công'}
                          </span>

                          {pm.timestamp && (
                            <span className="font-mono text-muted-foreground text-xs shrink-0">
                              {pm.timestamp}
                            </span>
                          )}

                          <span className="font-semibold text-foreground truncate">
                            <span className="font-mono">{pm.code}</span> - <span className="font-mono">{formatCurrency(pm.amount)}</span> / <span className="font-sans font-medium">{pm.method}</span>
                          </span>

                          {pm.isLocked && (
                            <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          )}
                        </div>

                        {pm.saleBy && (
                          <span className="text-xs text-muted-foreground shrink-0 font-sans">
                            Người lên đơn: <span className="font-medium text-foreground">{pm.saleBy}</span>
                          </span>
                        )}
                      </div>

                      {/* Single Product Note & Session Conversion (Chỉ hiển thị khi đơn cọc học luôn hoặc đơn nhận chuyển phí) */}
                      {showConversion && (pm.note || pm.convertedSessions !== undefined || pm.convertedAmount !== undefined) && (
                        <div className="space-y-1 pt-0.5">
                          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                            <span className="font-sans font-normal text-[12.5px] text-foreground leading-snug">
                              {pm.note || order.detailedItems?.[0]?.productName || order.items?.[0]?.productName}
                            </span>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {pm.convertedSessions !== undefined && (
                                <span>Quy đổi: <span className="text-foreground font-medium font-mono">{pm.convertedSessions} (buổi)</span></span>
                              )}
                              {pm.convertedAmount !== undefined && (
                                <span>Tiền quy đổi: <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">{formatCurrency(pm.convertedAmount)}</span></span>
                              )}
                            </div>
                          </div>

                          {/* Quy đổi còn lại: chỉ hiển thị khi còn buổi hoặc còn thiếu tiền (> 0) */}
                          {hasRemainingConversion(pm.remainingConversion) && (
                            <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 text-xs font-medium pt-0.5">
                              <span className="font-semibold">Quy đổi còn lại</span>
                              <div className="flex items-center gap-1.5 font-mono text-xs">
                                {Boolean(pm.remainingConversion?.sessions) && (
                                  <span>{pm.remainingConversion!.sessions} buổi</span>
                                )}
                                {(pm.remainingConversion?.missingAmount ?? pm.remainingConversion?.amount) ? (
                                  <>
                                    {Boolean(pm.remainingConversion?.sessions) && (
                                      <span className="text-purple-400 dark:text-purple-600 font-sans">•</span>
                                    )}
                                    <span className="font-semibold">
                                      Còn thiếu: {formatCurrency(pm.remainingConversion!.missingAmount ?? pm.remainingConversion!.amount ?? 0)}
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Multi-Package Allocation Breakdown Tree (Chỉ hiển thị khi đơn cọc học luôn hoặc đơn nhận chuyển phí) */}
                      {showConversion && pm.allocations && pm.allocations.length > 0 && (
                        <div className="space-y-1.5 pt-1 text-xs font-sans">
                          {pm.allocations.map((alloc, aIdx) => (
                            <div key={aIdx} className="space-y-1">
                              <div className="flex items-center justify-between font-normal text-xs text-foreground">
                                <span className="font-sans text-[12.5px] text-foreground leading-snug">{alloc.groupName}</span>
                                <span className="font-mono text-muted-foreground font-normal text-xs">
                                  Tiền quy đổi: {formatCurrency(alloc.groupConvertedAmount ?? 0)}
                                </span>
                              </div>
                              {alloc.subItems?.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center justify-between text-muted-foreground pl-3 text-[10.5px]">
                                  <span className="font-sans text-foreground/90">• {sub.name}</span>
                                  <div className="flex items-center gap-3 font-mono">
                                    {sub.convertedSessions !== undefined && (
                                      <span>Quy đổi: <span className="text-foreground font-medium">{sub.convertedSessions} (buổi)</span></span>
                                    )}
                                    {sub.convertedAmount !== undefined && (
                                      <span>Tiền quy đổi: <span className="text-foreground font-semibold">{formatCurrency(sub.convertedAmount)}</span></span>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {/* Remaining Conversion Summary Row: ẩn nếu bằng 0 */}
                              {hasRemainingConversion(alloc.remainingConversion) && (
                                <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 text-xs font-medium pt-1 pl-1">
                                  <span className="font-semibold">Quy đổi còn lại</span>
                                  <div className="flex items-center gap-1.5 font-mono text-xs">
                                    {(alloc.remainingConversion?.missingAmount ?? alloc.remainingConversion?.amount) ? (
                                      <span className="font-semibold">
                                        Còn thiếu: {formatCurrency(alloc.remainingConversion!.missingAmount ?? alloc.remainingConversion!.amount ?? 0)}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Button Tạo đơn hoàn tất if deposit and remaining amount > 0 (Đưa xuống dưới cùng) */}
                      {isDeposit && (order.totalPaidAmount ?? 0) < order.finalAmount && (
                        <div className="pt-1.5 text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (onCreateCompletionOrder) {
                                onCreateCompletionOrder(order)
                              } else {
                                toast.info(`Tạo đơn hoàn tất cho đơn cọc ${order.orderNo}`)
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>Tạo đơn hoàn tất</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <p className="text-[11.5px] italic text-muted-foreground/80 py-1">
                  Hiện tại chưa có giao dịch thanh toán nào đã/đang được xử lý
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Button if payments section is collapsed */}
      {(order.canCreateCompletionOrder ||
        (order.paymentMethodTag?.includes('Đơn có cọc') && (order.totalPaidAmount ?? 0) < order.finalAmount)) &&
        !isPaymentsExpanded &&
        !isDraft && (
          <div className="pt-1.5 text-left border-t border-border/30">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onCreateCompletionOrder) {
                  onCreateCompletionOrder(order)
                } else {
                  toast.success(`Đã mở giao diện tạo đơn hoàn tất từ đơn cọc ${order.orderNo}`)
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Tạo đơn hoàn tất</span>
            </button>
          </div>
        )}
    </div>
  )
}

