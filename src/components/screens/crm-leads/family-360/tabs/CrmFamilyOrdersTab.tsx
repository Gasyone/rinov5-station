'use client'

import React from 'react'
import {
  ShoppingCart,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { EmptyState } from '@/components/shared'
import type { FamilyOrder } from '../crmFamily360Types'
import { formatCurrencyVnd } from '../crmFamily360Helpers'

interface CrmFamilyOrdersTabProps {
  orders: FamilyOrder[]
  onOpenCreateOrder?: () => void
  onViewOrderDetail?: (orderNo: string) => void
}

export function CrmFamilyOrdersTab({
  orders,
  onOpenCreateOrder,
  onViewOrderDetail,
}: CrmFamilyOrdersTabProps) {
  const totalValue = orders.reduce((acc, o) => acc + o.finalAmount, 0)
  const totalPaid = orders.reduce((acc, o) => acc + o.paidAmount, 0)
  const totalRemaining = orders.reduce((acc, o) => acc + o.remainingAmount, 0)

  return (
    <div className="space-y-3.5">
      {/* 1. Tóm tắt tài chính đơn hàng của gia đình */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-card border border-border/70 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Tổng giá trị đơn hàng gia đình ({orders.length} đơn)
          </span>
          <p className="text-base font-bold text-foreground">
            {formatCurrencyVnd(totalValue)}
          </p>
        </div>

        <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium block">
            Đã thanh toán thực tế
          </span>
          <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrencyVnd(totalPaid)}
          </p>
        </div>

        <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium block">
            Công nợ còn lại
          </span>
          <p className="text-base font-bold text-amber-700 dark:text-amber-400">
            {formatCurrencyVnd(totalRemaining)}
          </p>
        </div>
      </div>

      {/* 2. Danh sách Đơn hàng */}
      {orders.length === 0 ? (
        <EmptyState
          title="Chưa có đơn hàng"
          description="Gia đình chưa phát sinh đơn hàng nào trên hệ thống."
          action={
            onOpenCreateOrder
              ? {
                  label: 'Tạo đơn hàng mới',
                  onClick: onOpenCreateOrder,
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5 shadow-2xs hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-500/20">
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {order.orderNo}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs font-semibold text-foreground">
                    Học viên: {order.studentName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Badge className={getStatusBadgeClass(order.paymentStatus)}>
                    {order.paymentStatus === 'paid'
                      ? 'Đã thanh toán đủ'
                      : order.paymentStatus === 'partial'
                      ? 'Đã cọc một phần'
                      : 'Chưa thanh toán'}
                  </Badge>

                  {onViewOrderDetail && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewOrderDetail(order.orderNo)}
                      className="h-6 px-2 text-[11px] text-sky-600 hover:text-sky-700"
                    >
                      <span>Chi tiết</span>
                      <ExternalLink className="h-2.5 w-2.5 ml-1" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Gói khóa học</span>
                  <p className="font-semibold text-foreground truncate" title={order.packageName}>
                    {order.packageName}
                  </p>
                  <span className="text-[11px] text-muted-foreground">{order.courseDuration}</span>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Giá trị thanh toán</span>
                  <p className="font-bold text-foreground">
                    {formatCurrencyVnd(order.finalAmount)}
                  </p>
                  {order.discountAmount > 0 && (
                    <span className="text-[10px] text-emerald-600">
                      Giảm: -{formatCurrencyVnd(order.discountAmount)}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Tiến độ thanh toán</span>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Đã nộp: {formatCurrencyVnd(order.paidAmount)}
                  </p>
                  {order.remainingAmount > 0 ? (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      Còn thiếu: {formatCurrencyVnd(order.remainingAmount)}
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">Đã thanh toán đủ 100%</span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Người bán &amp; Ngày</span>
                  <p className="font-medium text-foreground truncate" title={order.saleBy}>
                    {order.saleBy}
                  </p>
                  <span className="text-[11px] text-muted-foreground">{order.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
