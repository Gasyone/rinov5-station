'use client'

import React from 'react'
import {
  ExternalLink,
  FileEdit,
  Gift,
  ChevronUp,
  ChevronDown,
  Trash2,
  Pencil,
  Share2,
  Clock,
  Hourglass,
  Lock,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { DetailedOrder } from './studentOrdersTypes'

interface StudentOrderCardItemProps {
  order: DetailedOrder
  isDraft: boolean
  isCurrent: boolean
  isPaymentsExpanded: boolean
  draftOrders?: DetailedOrder[]
  onToggleExpandPayments: (orderId: string) => void
  onViewDetail: (order: DetailedOrder) => void
  onCreateDraftFromPackage: (order: DetailedOrder) => void
  onDeleteDraft?: (orderId: string) => void
  onScrollToOrder: (orderNo: string) => void
}

export function StudentOrderCardItem({
  order,
  isDraft,
  isCurrent,
  isPaymentsExpanded,
  draftOrders,
  onToggleExpandPayments,
  onViewDetail,
  onCreateDraftFromPackage,
  onDeleteDraft,
  onScrollToOrder,
}: StudentOrderCardItemProps) {
  const isCancelled = order.status === 'cancelled'

  const existingDraft =
    isCurrent && draftOrders && draftOrders.length > 0
      ? draftOrders.find(
          (d) =>
            d.sourceOrderNo === order.orderNo ||
            d.sourceOrderNo === order.id ||
            (order.linkedDraftOrderNo && (d.id === order.linkedDraftOrderNo || d.orderNo === order.linkedDraftOrderNo))
        )
      : null

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

        {/* Line 2: Order Summary Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 flex-wrap font-mono">
            <button
              type="button"
              onClick={() => onViewDetail(order)}
              className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
              title={isDraft ? 'Chỉnh sửa đơn hàng nháp' : 'Nhấp xem chi tiết đơn hàng'}
            >
              <span>{order.orderNo || order.id}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
            {order.studentName && (
              <>
                <span className="text-muted-foreground">-</span>
                <span className="font-sans font-medium text-slate-700 dark:text-zinc-200">
                  HV: <strong className="font-bold text-foreground">{order.studentName}</strong>
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
                  'font-medium px-1.5 py-0.5 rounded text-[10.5px] font-sans',
                  isCancelled
                    ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                )}
              >
                {order.paymentMethodTag || 'Đã nhận bank'}
              </span>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground shrink-0 font-normal font-sans">
            Sale: <span className="text-foreground font-medium">{order.saleRep} ({order.saleDate})</span>
          </div>
        </div>
      </div>

      {/* Products List Breakdown */}
      <div className="space-y-2.5 py-1">
        {order.detailedItems?.map((item, idx) => {
          const hasGift =
            Boolean(item.giftText && item.giftText !== '--' && !item.giftText.toLowerCase().includes('không có quà')) ||
            Boolean(item.bonusText && item.bonusText !== '--' && !item.bonusText.toLowerCase().includes('không có quà'))

          const giftDisplay =
            item.giftText && item.giftText !== '--' && !item.giftText.toLowerCase().includes('không có quà')
              ? item.giftText.startsWith('Tặng')
                ? item.giftText
                : `Tặng ${item.giftText}`
              : item.bonusText && item.bonusText !== '--' && !item.bonusText.toLowerCase().includes('không có quà')
                ? item.bonusText
                : null

          return (
            <div
              key={idx}
              className="text-xs flex items-start justify-between gap-3 flex-wrap"
            >
              {/* Left Column: Number + (Title & Subtitle directly aligned) */}
              <div className="flex items-start gap-1.5 flex-1 min-w-0">
                <span className="font-semibold text-[13px] text-foreground leading-snug shrink-0">
                  {idx + 1}.
                </span>

                <div className="space-y-0.5 min-w-0 flex-1">
                  {/* Line 1: Title + OrderType Badge */}
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <span className="font-semibold text-[13px] text-foreground leading-snug">
                      {item.productName}
                    </span>
                    {item.orderType && item.orderType !== '--' && (
                      <span className="px-1.5 py-0.2 text-[10.5px] font-medium rounded-md border border-border/50 bg-muted/40 text-muted-foreground shrink-0">
                        {item.orderType}
                      </span>
                    )}
                  </div>

                  {/* Subtitle Line: Duration + Expiry Date + Optional Gift (Aligned directly with product name) */}
                  <div className="flex items-center gap-2.5 text-[11.5px] text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                      <span>{item.durationText && item.durationText !== '--' ? item.durationText : '48 buổi'}</span>
                    </div>

                    <span className="text-border/70">•</span>

                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      <Hourglass className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                      <span>{item.expiryDate || '--'}</span>
                    </div>

                    {hasGift && giftDisplay && (
                      <>
                        <span className="text-border/70">•</span>
                        <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                          <Gift className="h-3 w-3 shrink-0" />
                          <span className="font-medium">Quà tặng: {giftDisplay}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: SL + TT */}
              <div className="flex items-center gap-3 text-xs shrink-0 font-mono pt-0.5">
                <span className="text-muted-foreground font-sans text-xs">
                  SL: <span className="font-normal text-foreground">{item.quantity}</span>
                </span>
                <span className="text-muted-foreground font-sans text-xs">
                  TT:{' '}
                  <span className="font-normal text-foreground font-mono">
                    {formatCurrency(item.subtotal || item.unitPrice * item.quantity)}
                  </span>
                </span>
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
                  {formatCurrency(order.totalPaidAmount ?? 0)} / {formatCurrency(order.finalAmount)}
                </span>
              </span>

              {/* + Thanh toán thêm Button (Chỉ dành cho đơn đã thanh toán 1 phần nhưng chưa hết) */}
              {(order.totalPaidAmount ?? 0) > 0 && (order.totalPaidAmount ?? 0) < order.finalAmount && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetail(order)
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
                        className="py-1 text-xs font-mono flex items-start gap-3 justify-between flex-wrap"
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
                                {pm.code} - {formatCurrency(pm.amount)} / {pm.method} / {pm.statusLabel || 'T5-Đã nhận bank'}
                              </span>
                              {pm.isLocked && (
                                <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              )}
                            </div>

                            <div className="text-[11.5px] font-medium">
                              {isDeposit && pm.depositAmount && (
                                <span className="text-emerald-700 dark:text-emerald-400">
                                  Tiền cọc : {formatCurrency(pm.depositAmount)}
                                </span>
                              )}
                              {isFinal && pm.finalPaymentAmount && (
                                <span className="text-purple-700 dark:text-purple-400">
                                  Tiền hoàn tất : {formatCurrency(pm.finalPaymentAmount)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-[11px] shrink-0 font-sans space-y-0.5">
                          {pm.saleBy && (
                            <div className="text-muted-foreground">
                              Sale: <span className="font-medium text-foreground">{pm.saleBy}</span>
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
                      className="py-1 text-xs font-mono space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2.5 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              'text-[10px] font-medium px-2 py-0.5 rounded-md border shrink-0',
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
                          <span className="font-semibold text-foreground truncate">
                            {pm.code} - {formatCurrency(pm.amount)} / {pm.method}
                          </span>
                        </div>

                        {pm.saleBy && (
                          <span className="text-[11px] text-muted-foreground shrink-0 font-sans">
                            Sale: <span className="font-medium text-foreground">{pm.saleBy}</span>
                          </span>
                        )}
                      </div>

                      {/* Single Product Note & Session Conversion */}
                      {pm.note && (
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5 flex-wrap">
                          <span>{pm.note}</span>
                          <div className="flex items-center gap-3">
                            {pm.convertedSessions !== undefined && (
                              <span>Quy đổi: <span className="text-foreground font-medium">{pm.convertedSessions} (buổi)</span></span>
                            )}
                            {pm.convertedAmount !== undefined && (
                              <span>Tiền quy đổi: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(pm.convertedAmount)}</span></span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Multi-Package Allocation Breakdown Tree */}
                      {pm.allocations && pm.allocations.length > 0 && (
                        <div className="space-y-1.5 pt-1 text-[11px] font-sans">
                          {pm.allocations.map((alloc, aIdx) => (
                            <div key={aIdx} className="space-y-1">
                              <div className="flex items-center justify-between font-semibold text-foreground">
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
                                      <span>Quy đổi: <span className="text-foreground font-medium">{sub.convertedSessions} (buổi)</span></span>
                                    )}
                                    {sub.convertedAmount !== undefined && (
                                      <span>Tiền quy đổi: <span className="text-foreground font-semibold">{formatCurrency(sub.convertedAmount)}</span></span>
                                    )}
                                  </div>
                                </div>
                              ))}
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
    </div>
  )
}

