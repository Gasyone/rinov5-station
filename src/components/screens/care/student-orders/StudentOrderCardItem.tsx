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
        'bg-card dark:bg-zinc-900 border rounded-2xl p-2.5 shadow-2xs space-y-2 select-none text-left transition-all group overflow-hidden',
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
            <span className="text-muted-foreground">-</span>
            <span className="font-bold text-foreground">{formatCurrency(order.finalAmount)}</span>
            <span className="text-muted-foreground">/</span>
            {isDraft ? (
              <span className="font-medium px-1.5 py-0.2 rounded text-[10.5px] bg-amber-100/80 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300 inline-flex items-center gap-1">
                <FileEdit className="h-3 w-3" /> Đơn hàng nháp
              </span>
            ) : (
              <span
                className={cn(
                  'font-medium px-1.5 py-0.5 rounded text-[10.5px]',
                  isCancelled
                    ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                )}
              >
                {order.paymentMethodTag || 'Đã nhận bank'}
              </span>
            )}
          </div>

            <div className="text-[11px] text-muted-foreground shrink-0 font-normal">
              Sale: <span className="text-foreground font-medium">{order.saleRep} ({order.saleDate})</span>
            </div>
          </div>
        </div>

      {/* Products List Breakdown */}
      <div className="space-y-1.5">
        {order.detailedItems?.map((item, idx) => (
          <div
            key={idx}
            className="p-2 rounded-xl bg-muted/20 dark:bg-zinc-800/30 border border-border/40 space-y-1.5 text-xs"
          >
            {/* Product Item Line 1: Check Icon + Title + Student Tag */}
            <div className="flex items-[flex-start] justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 min-w-0 font-semibold text-foreground">
                <span className="font-bold text-foreground text-xs leading-snug">
                  {idx + 1}. {item.productName}
                </span>
                <span className="text-muted-foreground font-normal shrink-0">
                  ( SL: {item.quantity} )
                </span>
              </div>

              {item.studentName && (
                <div className="text-[11px] text-muted-foreground shrink-0 font-normal">
                  Học viên: <span className="font-medium text-foreground">{item.studentName}</span>
                </div>
              )}
            </div>

            {/* Product Item Line 2: Attributes Badges */}
            <div className="flex items-center gap-3 text-[11px] flex-wrap pt-0.5">
              {item.orderType && item.orderType !== '--' && (
                <div className="text-muted-foreground font-normal">
                  Loại đơn: <strong className="font-medium text-foreground">{item.orderType}</strong>
                </div>
              )}

              {item.durationText && item.durationText !== '--' && (
                <div className="text-muted-foreground font-normal">
                  Thời lượng: <strong className="font-medium text-foreground">{item.durationText}</strong>
                </div>
              )}

              {item.bonusText && item.bonusText !== '--' && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-background border border-border/60 text-muted-foreground">
                  <Gift className="h-3 w-3 text-emerald-600" />
                  <span>{item.bonusText}</span>
                </div>
              )}

              {/* Quà tặng đính kèm */}
              {item.giftText && item.giftText !== '--' ? (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 font-semibold">
                  <Gift className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{item.giftText}</span>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* LỊCH SỬ THANH TOÁN (Collapsible Payments Section - Only for Paid/Purchased Orders) */}
      {!isDraft && (
        <div className="pt-2 border-t border-border/40 space-y-2 text-xs">
          {/* Payment Header Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onToggleExpandPayments(order.id)}
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

            <div className="flex items-center gap-2.5 text-xs shrink-0 flex-wrap">
              <span className="text-muted-foreground font-normal">
                Tổng tiền đã thanh toán: <strong className="font-mono font-extrabold text-foreground">{formatCurrency(order.totalPaidAmount ?? 0)}</strong>
              </span>

              {/* + Thanh toán thêm Button (Chỉ dành cho đơn đã thanh toán 1 phần nhưng chưa hết) */}
              {(order.totalPaidAmount ?? 0) > 0 && (order.totalPaidAmount ?? 0) < order.finalAmount && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetail(order)
                  }}
                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-md cursor-pointer transition-all shadow-2xs shrink-0"
                  title="Ghi nhận số tiền thanh toán thêm từ khách hàng"
                >
                  <span>+ Thanh toán thêm</span>
                </button>
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

                    {/* Multi-Package Allocation Breakdown Tree */}
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
      )}
    </div>
  )
}

