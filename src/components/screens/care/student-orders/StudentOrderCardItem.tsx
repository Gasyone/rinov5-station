'use client'

import React from 'react'
import {
  ExternalLink,
  FileEdit,
  Gift,
  ChevronUp,
  ChevronDown,
  Pencil,
  Share2,
  Clock,
  Hourglass,
  Lock,
  ArrowRightLeft,
  Info,
  Ticket,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { DetailedOrder } from './studentOrdersTypes'

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
  showOtherChildren,
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
              <span className="font-semibold text-amber-800 dark:text-amber-400">🔗 Đơn nháp tái phí từ gói:</span>
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
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100/90 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200">
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
                title="Chỉnh sửa đơn nháp"
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
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground pb-0.5 font-sans">
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
              title={isDraft ? 'Chỉnh sửa đơn hàng nháp' : 'Nhấp xem chi tiết đơn hàng'}
            >
              {order.orderNo || order.id}
            </button>
            {isDraft && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-sans font-medium border border-amber-200/60">
                Nháp
              </span>
            )}

            {/* Hiển thị thêm tên con sau Mã đơn hàng khi tích xem đơn con khác */}
            {showOtherChildren && order.studentName && (
              <>
                <span className="text-muted-foreground">-</span>
                <span className="font-semibold text-foreground font-sans">
                  {order.studentName}
                </span>
              </>
            )}

            <span className="text-muted-foreground">/</span>
            {isDraft ? (
              <span className="font-medium px-1.5 py-0.2 rounded text-[10.5px] bg-amber-100/80 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300 inline-flex items-center gap-1 font-sans">
                <FileEdit className="h-3 w-3" /> Đơn hàng nháp
              </span>
            ) : (
              <span
                className={cn(
                  'font-medium text-[11px] font-sans',
                  isCancelled
                    ? 'text-zinc-500'
                    : 'text-foreground'
                )}
              >
                {order.paymentMethodTag || 'T5-Đã nhận bank'}
              </span>
            )}
            {order.feeTransferSummary && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium px-2 py-0.5 rounded-md text-[10.5px] font-sans inline-flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 cursor-pointer shadow-2xs transition-all"
                  >
                    <ArrowRightLeft className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    <span>Nhận chuyển phí: <strong>{order.feeTransferSummary.ticketCode}</strong></span>
                    <Info className="h-2.5 w-2.5 opacity-70" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[720px] sm:w-[760px] md:w-[820px] max-w-[95vw] p-5 text-xs space-y-3.5 text-left shadow-2xl border-purple-200 dark:border-purple-800 z-50 rounded-2xl"
                  align="start"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Popover Header */}
                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-border/30 flex-wrap gap-3">
                    <div className="text-muted-foreground font-normal">
                      Ngày chuyển: <strong className="font-bold text-foreground">{order.feeTransferSummary.transferDate}</strong>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => toast.info(`Mã ticket chuyển phí: ${order.feeTransferSummary?.ticketCode}`)}
                        className="inline-flex items-center gap-1 font-mono font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                      >
                        <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Mã ticket: <span className="underline">{order.feeTransferSummary.ticketCode}</span></span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-muted-foreground font-normal">
                      Người thực hiện: <strong className="font-bold text-foreground">{order.feeTransferSummary.executorName}</strong>
                    </div>
                  </div>

                  {/* 2-Column Side-by-Side Content Area (GÓI CŨ & GÓI MỚI in 1 Row) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 relative gap-8 pt-1">
                    {/* Left Column: GÓI CŨ */}
                    <div className="space-y-2 pr-0 sm:pr-3">
                      <h4 className="font-bold text-xs tracking-wider text-muted-foreground uppercase">
                        GÓI CŨ
                      </h4>
                      <div className="space-y-1.5 text-muted-foreground text-xs leading-relaxed">
                        <p>
                          Gói : <span className="font-medium text-foreground">{order.feeTransferSummary.oldPackageName}</span>
                        </p>
                        <p>
                          Lộ trình : <span className="font-semibold text-foreground">{order.feeTransferSummary.oldPathwayLevel || '150'}</span>
                        </p>
                        <p>
                          Tổng số buổi : <span className="font-semibold text-foreground">{order.feeTransferSummary.oldTotalSessions ?? 48}</span> / Số buổi chính : <span className="font-semibold text-foreground">{order.feeTransferSummary.oldMainSessions ?? 48}</span>
                        </p>
                        <p>
                          Tổng số buổi đã học : <span className="font-semibold text-foreground">{order.feeTransferSummary.oldCompletedTotalSessions ?? 40}</span> / Số buổi chính đã học : <span className="font-semibold text-foreground">{order.feeTransferSummary.oldCompletedMainSessions ?? 40}</span>
                        </p>
                        <p className="pt-0.5">
                          Số buổi được chuyển phí : <span className="font-semibold text-foreground">{order.feeTransferSummary.transferredSessionsCount} buổi</span>
                        </p>
                      </div>
                    </div>

                    {/* Center Arrow & Dashed Divider */}
                    <div className="hidden sm:flex flex-col items-center absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none">
                      <div className="h-6 w-6 rounded-full bg-violet-600 dark:bg-violet-500 text-white flex items-center justify-center shadow-xs shrink-0 z-10 mt-1">
                        <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                      <div className="flex-1 w-px border-r border-dashed border-violet-400/80 dark:border-violet-600/80 mt-1" />
                    </div>

                    {/* Right Column: GÓI MỚI */}
                    <div className="space-y-2 pl-0 sm:pl-3">
                      <h4 className="font-bold text-xs tracking-wider text-muted-foreground uppercase">
                        GÓI MỚI
                      </h4>
                      <div className="space-y-1.5 text-muted-foreground text-xs leading-relaxed">
                        {order.feeTransferSummary.newProgramName && (
                          <p>
                            Gói : <span className="font-semibold text-foreground">{order.feeTransferSummary.newProgramName}</span>
                          </p>
                        )}
                        <p>
                          Lộ trình : <span className="font-semibold text-foreground">{order.feeTransferSummary.newPathwayLevel || '130'}</span>
                        </p>
                        <p>
                          Loại chuyển : <span className="font-medium text-foreground">{order.feeTransferSummary.transferType}</span>
                        </p>
                        <p>
                          Gói nhận phí : <span className="font-medium text-foreground">{order.feeTransferSummary.newPackageName}</span>
                        </p>
                        {order.feeTransferSummary.linkedOrderNo && (
                          <p className="flex items-center gap-1.5 flex-wrap">
                            <span>Đơn hàng thanh toán thêm:</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onScrollToOrder(order.feeTransferSummary!.linkedOrderNo!)
                              }}
                              className="inline-flex items-center gap-0.5 font-mono font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                            >
                              <span>{order.feeTransferSummary.linkedOrderNo}</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </p>
                        )}
                        <div className="pt-2 flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[10.5px] uppercase tracking-wider text-purple-700 dark:text-purple-300">
                            SỐ LƯỢNG BUỔI TỐI ĐA SAU QUY ĐỔI :
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md border border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold font-mono text-xs shadow-2xs">
                            {order.feeTransferSummary.convertedSessionsLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground shrink-0 font-normal font-sans">
            Người lên đơn: <span className="text-foreground font-medium">{order.saleRep || order.saleBy || 'Lê Phương Thảo'} {order.saleDate ? `(${order.saleDate})` : ''}</span>
          </div>
        </div>
      </div>

      {/* Products List Breakdown */}
      <div className="space-y-2 py-1">
        {order.detailedItems?.map((item, idx) => {
          return (
            <div
              key={idx}
              className="space-y-0.5 text-xs"
            >
              {/* Product Info Line */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Left: Book Icon + Product Name + Order Type Tag */}
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

                {/* Right: SL: 1 | TT: xxx đ sát cạnh phải */}
                <div className="flex items-center gap-3 text-xs shrink-0 font-sans ml-auto">
                  <span className="text-muted-foreground">
                    SL: <strong className="font-bold font-mono text-foreground">{item.quantity}</strong>
                  </span>
                  <span className="text-muted-foreground">
                    TT: <strong className="font-bold font-mono text-foreground">{formatCurrency(item.subtotal || item.unitPrice * item.quantity)}</strong>
                  </span>
                </div>
              </div>

              {/* Sub-line: Duration (Clock), Bonus Extra Sessions (Hourglass), Gift (Gift icon - only when exists) */}
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground pl-6 flex-wrap">
                {/* Duration / Sessions */}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                  <span>{item.durationText && item.durationText !== '--' ? item.durationText : '48 buổi'}</span>
                </div>

                {/* Bonus Extra Sessions (Hourglass) */}
                <div className="flex items-center gap-1">
                  <Hourglass className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                  <span>{item.bonusText && item.bonusText !== '--' ? item.bonusText : '--'}</span>
                </div>

                {/* Gift (Gift icon) - Only display when gift is present */}
                {item.giftText && item.giftText !== '--' && item.giftText.trim() !== '' && (
                  <div className="flex items-center gap-1">
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
            <button
              type="button"
              onClick={() => onToggleExpandPayments(order.id)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-sky-600 transition-colors cursor-pointer"
            >
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                LỊCH SỬ THANH TOÁN
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">
                ({order.payments && order.payments.length > 0 ? `${order.payments.length} chuyển khoản` : 'Chưa có giao dịch'})
              </span>
              {isPaymentsExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>

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
                    className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] px-2 py-0.5 rounded-md cursor-pointer transition-all shadow-2xs shrink-0"
                    title="Ghi nhận số tiền thanh toán thêm từ khách hàng"
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
                  const isDeposit = pm.paymentType === 'deposit' || pm.paymentTypeLabel === 'Cọc'
                  const isFinal = pm.paymentType === 'final' || pm.paymentTypeLabel === 'Hoàn tất'

                  if (isDeposit || isFinal) {
                    return (
                      <div
                        key={pm.id}
                        className="py-1 text-xs flex items-start gap-3 justify-between flex-wrap"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <span
                            className={cn(
                              'w-15 text-center py-0.5 text-[11px] font-medium rounded-md text-white shadow-2xs shrink-0 mt-0.5',
                              isDeposit ? 'bg-emerald-700 dark:bg-emerald-800' : 'bg-purple-800 dark:bg-purple-900'
                            )}
                          >
                            {isDeposit ? 'Cọc' : 'Hoàn tất'}
                          </span>

                          <div className="space-y-0.5 min-w-0 flex-1 text-left">
                            <div className="flex items-center gap-1 font-semibold text-foreground truncate">
                              <span>
                                <span className="font-mono">{pm.code}</span> - <span className="font-mono">{formatCurrency(pm.amount)}</span> / <span className="font-sans font-medium">{pm.method}</span> / <span className="font-sans font-medium">{pm.statusLabel || 'T5-Đã nhận bank'}</span>
                              </span>
                              {pm.isLocked && (
                                <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                            </div>

                            <div className="text-[11.5px] font-medium">
                              {isDeposit && pm.depositAmount && (
                                <span className="text-emerald-700 dark:text-emerald-400">
                                  Tiền cọc : <span className="font-mono">{formatCurrency(pm.depositAmount)}</span>
                                </span>
                              )}
                              {isFinal && pm.finalPaymentAmount && (
                                <span className="text-purple-700 dark:text-purple-400">
                                  Tiền hoàn tất : <span className="font-mono">{formatCurrency(pm.finalPaymentAmount)}</span>
                                </span>
                              )}
                            </div>

                            {/* Button Tạo đơn hoàn tất if deposit and remaining amount > 0 */}
                            {isDeposit && (order.totalPaidAmount ?? 0) < order.finalAmount && (
                              <div className="pt-2 text-left">
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
                        </div>

                        <div className="text-right text-[11px] shrink-0 font-sans space-y-0.5">
                          {pm.saleBy && (
                            <div className="text-muted-foreground">
                              Người lên đơn: <span className="font-medium text-foreground">{pm.saleBy}</span>
                            </div>
                          )}
                          <div className="font-mono text-muted-foreground text-[10.5px]">{pm.timestamp}</div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={pm.id}
                      className="py-1 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2.5 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              'text-[10px] font-medium px-2 py-0.5 rounded-md border shrink-0',
                              pm.statusLabel === 'Chờ xử lý'
                                ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white border-blue-600 shadow-2xs font-semibold'
                                : pm.status === 'completed' || pm.statusLabel === 'Thành công'
                                  ? 'bg-emerald-600 text-white dark:bg-emerald-700 dark:text-white border-emerald-600 shadow-2xs font-semibold'
                                  : pm.status === 'pending' || pm.statusLabel === 'Chờ thanh toán'
                                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/70'
                                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200'
                            )}
                          >
                            {pm.statusLabel ||
                              (pm.status === 'completed'
                                ? 'Thành công'
                                : pm.status === 'pending'
                                  ? 'Chờ thanh toán'
                                  : 'Hủy')}
                          </span>
                          <span className="font-mono text-muted-foreground text-[11px] shrink-0">
                            {pm.timestamp}
                          </span>
                          <span className="font-semibold text-foreground truncate">
                            <span className="font-mono">{pm.code}</span> - <span className="font-mono">{formatCurrency(pm.amount)}</span> / <span className="font-sans font-medium">{pm.method}</span>
                          </span>
                        </div>

                        {pm.saleBy && (
                          <span className="text-[11px] text-muted-foreground shrink-0 font-sans">
                            Người lên đơn: <span className="font-medium text-foreground">{pm.saleBy}</span>
                          </span>
                        )}
                      </div>

                      {/* Single Product Note & Session Conversion */}
                      {pm.note && (
                        <div className="space-y-1 pt-0.5">
                          <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                            <span className="font-sans font-normal text-[12.5px] text-foreground leading-snug">
                              {pm.note}
                            </span>
                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                              {pm.convertedSessions !== undefined && (
                                <span>Quy đổi: <span className="text-foreground font-medium font-mono">{pm.convertedSessions} (buổi)</span></span>
                              )}
                              {pm.convertedAmount !== undefined && (
                                <span>Tiền quy đổi: <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">{formatCurrency(pm.convertedAmount)}</span></span>
                              )}
                            </div>
                          </div>

                          {pm.remainingConversion && (
                            <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 text-[11px] font-medium pt-0.5">
                              <span className="font-semibold">Quy đổi còn lại</span>
                              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                {pm.remainingConversion.sessions !== undefined && (
                                  <span>{pm.remainingConversion.sessions} buổi</span>
                                )}
                                {pm.remainingConversion.amount !== undefined && (
                                  <>
                                    <span className="text-purple-400 dark:text-purple-600 font-sans">•</span>
                                    <span>{formatCurrency(pm.remainingConversion.amount)}</span>
                                  </>
                                )}
                                {pm.remainingConversion.missingAmount !== undefined && (
                                  <>
                                    <span className="text-purple-400 dark:text-purple-600 font-sans">•</span>
                                    <span className="font-semibold">Còn thiếu: {formatCurrency(pm.remainingConversion.missingAmount)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Multi-Package Allocation Breakdown Tree */}
                      {pm.allocations && pm.allocations.length > 0 && (
                        <div className="space-y-1.5 pt-1 text-[11px] font-sans">
                          {pm.allocations.map((alloc, aIdx) => (
                            <div key={aIdx} className="space-y-1">
                              <div className="flex items-center justify-between font-normal text-xs text-foreground">
                                <span className="font-sans text-[12.5px] text-foreground leading-snug">{alloc.groupName}</span>
                                <span className="font-mono text-muted-foreground font-normal text-[11px]">
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

                              {/* Remaining Conversion Summary Row */}
                              {alloc.remainingConversion && (
                                <div className="flex items-center justify-between text-purple-700 dark:text-purple-400 text-[11px] font-medium pt-1 pl-1">
                                  <span className="font-semibold">Quy đổi còn lại</span>
                                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                    {alloc.remainingConversion.sessions !== undefined && (
                                      <span>{alloc.remainingConversion.sessions} buổi</span>
                                    )}
                                    {alloc.remainingConversion.amount !== undefined && (
                                      <>
                                        <span className="text-purple-400 dark:text-purple-600 font-sans">•</span>
                                        <span>{formatCurrency(alloc.remainingConversion.amount)}</span>
                                      </>
                                    )}
                                    {alloc.remainingConversion.missingAmount !== undefined && (
                                      <>
                                        <span className="text-purple-400 dark:text-purple-600 font-sans">•</span>
                                        <span className="font-semibold">Còn thiếu: {formatCurrency(alloc.remainingConversion.missingAmount)}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
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

