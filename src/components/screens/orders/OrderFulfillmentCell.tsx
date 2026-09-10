'use client'

import { cn } from '@/lib/utils'
import type { Order } from '@/mocks/orders'
import { getOrderFulfillmentSummary } from './orderFulfillmentHelpers'

interface OrderFulfillmentCellProps {
  order: Order
  className?: string
  onQuickFulfill?: (order: Order) => void
}

export function OrderFulfillmentCell({
  order,
  className,
  onQuickFulfill,
}: OrderFulfillmentCellProps) {
  const summary = getOrderFulfillmentSummary(order)
  const cancellable = order.status !== 'cancelled' && order.status !== 'refunded'

  if (order.status === 'cancelled' || order.status === 'refunded') {
    return (
      <div className={cn('flex flex-col gap-0.5 text-xs', className)}>
        <span className="text-muted-foreground">
          {order.status === 'cancelled' ? 'Đơn đã hủy' : 'Đã hoàn tiền'}
        </span>
      </div>
    )
  }

  // Tính phần còn lại nếu đang xử lý / đã giao 1 phần
  const remainingService = summary.totalSessions - summary.grantedSessions
  const remainingPhysical = summary.details.filter(
    (d) => d.type === 'physical' && d.status !== 'handed_over'
  ).length
  const remainingParts = [
    remainingService > 0 ? `${remainingService} buổi` : '',
    remainingPhysical > 0 ? `${remainingPhysical} SP` : '',
  ].filter(Boolean)
  const remainingText = remainingParts.length > 0 ? remainingParts.join(' • ') : 'chưa hoàn tất'

  return (
    <div className={cn('flex flex-col gap-0.5 text-xs min-w-0', className)}>
      {summary.status === 'delivered' ? (
        /* Đã giao đủ: chỉ hiển thị trạng thái giao */
        <span className="font-normal text-xs text-emerald-600 dark:text-emerald-400">
          Đã bàn giao
        </span>
      ) : summary.status === 'processing' ? (
        <>
          {/* Dòng 1: Trạng thái giao */}
          <span className="font-normal text-xs text-amber-600 dark:text-amber-400">
            Đã giao 1 phần
          </span>

          {/* Dòng 2: Còn lại & textlink Bàn giao */}
          <div className="whitespace-nowrap inline-flex items-center gap-1 text-xs">
            <span className="text-muted-foreground font-normal">
              Còn: {remainingText}
            </span>
            {cancellable && onQuickFulfill && (
              <>
                <span className="text-muted-foreground/40 font-normal">•</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickFulfill(order)
                  }}
                  className="text-primary hover:underline text-xs font-normal cursor-pointer transition-colors"
                  title="Mở modal giao hàng / Bàn giao SP/DV"
                >
                  Bàn giao
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Dòng 1: Trạng thái chưa giao & textlink Giao */}
          <div className="whitespace-nowrap inline-flex items-center gap-1 text-xs">
            <span className="text-muted-foreground font-normal">Chưa giao</span>
            {cancellable && onQuickFulfill && (
              <>
                <span className="text-muted-foreground/40 font-normal">•</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickFulfill(order)
                  }}
                  className="text-primary hover:underline text-xs font-normal cursor-pointer transition-colors"
                  title="Mở modal giao hàng / Bàn giao SP/DV"
                >
                  Giao
                </button>
              </>
            )}
          </div>

          {/* Dòng 2: Hiển thị còn lại nếu có nhiều */}
          {summary.line1Text && summary.line1Text !== '—' && (
            <div className="text-[11px] text-muted-foreground/80 font-normal truncate" title={summary.line1Text}>
              Còn: {summary.line1Text}
            </div>
          )}
        </>
      )}
    </div>
  )
}

