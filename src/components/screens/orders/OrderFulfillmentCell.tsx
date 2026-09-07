'use client'

import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Clock,
  GraduationCap,
  Minus,
  Package,
  PackageCheck,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Order } from '@/mocks/orders'
import {
  getOrderFulfillmentSummary,
  type ItemFulfillmentDetail,
  type OrderFulfillmentSummary,
} from './orderFulfillmentHelpers'

interface OrderFulfillmentCellProps {
  order: Order
  className?: string
}

function StatusIcon({
  semantic,
  primaryStatus,
  className,
}: {
  semantic: OrderFulfillmentSummary['semantic']
  primaryStatus: OrderFulfillmentSummary['primaryStatus']
  className?: string
}) {
  if (primaryStatus === 'handed_over') {
    return <PackageCheck className={cn('h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0', className)} />
  }
  if (primaryStatus === 'pending_handover') {
    return <Package className={cn('h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0', className)} />
  }

  if (semantic === 'success') {
    return <Check className={cn('h-3.5 w-3.5 stroke-[2.5] text-emerald-600 dark:text-emerald-400 shrink-0', className)} />
  }
  if (semantic === 'warning') {
    return <Clock className={cn('h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0', className)} />
  }
  return <Minus className={cn('h-3.5 w-3.5 text-muted-foreground shrink-0', className)} />
}

function ItemDetailRow({ item }: { item: ItemFulfillmentDetail }) {
  const isService = item.type === 'service'

  return (
    <div className="flex flex-col gap-1 p-2 rounded-lg bg-muted/40 border border-border/50 text-xs">
      {/* Dòng 1: Icon loại SP/DV + Tên món + Badge trạng thái */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 min-w-0 flex-1">
          {isService ? (
            <GraduationCap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          ) : (
            <Package className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          )}
          <span className="font-medium text-xs text-foreground leading-snug truncate" title={item.productName}>
            {item.productName}
          </span>
        </div>

        {/* Trạng thái món */}
        <Badge
          variant="outline"
          className={cn(
            'text-[10px] py-0 px-1.5 font-medium rounded shrink-0',
            item.semantic === 'success' && 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
            item.semantic === 'warning' && 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
            item.semantic === 'neutral' && 'bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400'
          )}
        >
          {item.statusLabel}
        </Badge>
      </div>

      {/* Dòng 2: Học viên thụ hưởng + Số buổi / ghi chú */}
      <div className="flex items-center justify-between gap-2 text-muted-foreground pt-0.5 border-t border-border/30">
        <div className="flex items-center gap-1 min-w-0">
          <User className="h-3 w-3 text-muted-foreground/70 shrink-0" />
          <span className="truncate">
            Học viên: <strong className="font-semibold text-foreground">{item.studentName}</strong>
          </span>
        </div>

        {isService && item.sessionsTotal ? (
          <span className="font-mono text-xs text-foreground font-medium shrink-0">
            {item.status === 'activated'
              ? `Nhận: ${item.sessionsGranted ?? item.sessionsTotal} buổi`
              : item.status === 'pending_activation'
              ? `Chờ cấp: ${item.sessionsTotal} buổi`
              : `Dự kiến: ${item.sessionsTotal} buổi`}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground font-normal shrink-0">
            {item.status === 'handed_over' ? 'Đã giao phụ huynh' : 'Chờ lấy tại cơ sở'}
          </span>
        )}
      </div>
    </div>
  )
}

export function OrderFulfillmentCell({ order, className }: OrderFulfillmentCellProps) {
  const [open, setOpen] = useState(false)
  const summary = getOrderFulfillmentSummary(order)

  const isInteractive = summary.details.length > 1 || summary.primaryStatus === 'pending_activation'

  return (
    <div className={cn('flex flex-col gap-0.5 text-xs min-w-0', className)}>
      {/* Dòng 1: Trạng thái kích hoạt / Bàn giao + Icon + (Nút mở chi tiết nếu có nhiều món) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge
          variant="outline"
          className={cn(
            'text-[11px] px-1.5 py-0 h-5 font-semibold rounded inline-flex items-center gap-1',
            summary.semantic === 'success' &&
              'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
            summary.semantic === 'warning' &&
              'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
            summary.semantic === 'neutral' &&
              'bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400',
            summary.semantic === 'info' &&
              'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300'
          )}
          title={
            summary.primaryStatus === 'pending_activation'
              ? 'Hệ thống đang tự động kích hoạt tài khoản học viên và số buổi sau thanh toán'
              : summary.badgeLabel
          }
        >
          <StatusIcon semantic={summary.semantic} primaryStatus={summary.primaryStatus} />
          <span>{summary.badgeLabel}</span>
        </Badge>

        {/* Nút popover chi tiết nếu đơn có nhiều món hoặc chờ kích hoạt */}
        {isInteractive && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 px-1 py-0 text-xs font-normal text-muted-foreground hover:text-foreground hover:bg-muted border-0 shadow-none gap-0.5 cursor-pointer"
                title="Xem chi tiết kích hoạt học viên & bàn giao sản phẩm"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-mono text-xs">({summary.details.length})</span>
                <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', open && 'rotate-180')} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="start"
              sideOffset={6}
              className="w-[380px] sm:w-[420px] max-w-[95vw] p-3 text-xs shadow-xl border bg-background z-50 rounded-xl space-y-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header popover: Bỏ icon AI, bỏ badge trạng thái, chỉ hiển thị thống kê SP / DV */}
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="font-bold text-xs text-foreground">
                  Chuyển giao SP/DV ({summary.details.length})
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {[
                    summary.serviceCount > 0 ? `${summary.serviceCount} dịch vụ` : '',
                    summary.physicalCount > 0 ? `${summary.physicalCount} sản phẩm` : '',
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </span>
              </div>

              {/* Danh sách từng món và từng học viên */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-0.5">
                {summary.details.map((detail, idx) => (
                  <ItemDetailRow key={`${detail.productId}-${idx}`} item={detail} />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Dòng 2: Số buổi học viên nhận / SP bàn giao */}
      <div
        className="text-xs text-muted-foreground truncate max-w-[175px]"
        title={summary.line2Text}
      >
        {summary.primaryStatus === 'pending_activation' ? (
          <span className="text-amber-700 dark:text-amber-300 font-medium">
            {summary.line2Text}
          </span>
        ) : summary.semantic === 'success' ? (
          <span className="text-foreground/90 font-mono font-medium">
            {summary.line2Text}
          </span>
        ) : (
          <span>{summary.line2Text}</span>
        )}
      </div>
    </div>
  )
}
