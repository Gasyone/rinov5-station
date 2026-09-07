'use client'

import { useState } from 'react'
import {
  BookOpen,
  ChevronDown,
  Clock,
  Gift,
  Hourglass,
  MapPin,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Order, OrderItem } from '@/mocks/orders'

interface OrderProductsPopoverProps {
  order: Order
  className?: string
}

function getItemDuration(item: OrderItem): string {
  // Check productName first for actual session/duration count (e.g. "96 buổi", "36 buổi", "1 tháng")
  const match = item.productName.match(/(\d+\s*(?:buổi|tháng))/i)
  if (match) return match[1]

  const itemAny = item as typeof item & { durationText?: string }
  if (itemAny.durationText && itemAny.durationText !== '--') {
    return itemAny.durationText.replace(/^\d+:\d+\s*[-_]\s*/i, '').trim()
  }

  if (item.packageType) {
    return item.packageType.replace(/^\d+:\d+\s*[-_]\s*/i, '').trim()
  }

  return '48 buổi'
}

function getItemBonus(item: OrderItem): string {
  const itemAny = item as typeof item & { bonusText?: string }
  if (itemAny.bonusText && itemAny.bonusText !== '--') return itemAny.bonusText
  if (item.productName.toLowerCase().includes('plus')) return 'Tặng thêm 2 buổi'
  return '--'
}

function getItemGift(item: OrderItem): string | null {
  const itemAny = item as typeof item & { giftText?: string }
  if (itemAny.giftText && itemAny.giftText !== '--' && itemAny.giftText.trim() !== '') {
    return itemAny.giftText
  }
  if (item.productName.toLowerCase().includes('foundation')) {
    return '1 x [IELTS] Khóa 4.0'
  }
  if (item.productName.toLowerCase().includes('ielts')) {
    return '1 x [IELTS] Khóa 4.0'
  }
  return null
}

function getItemOrderType(item: OrderItem, order: Order): string {
  const itemAny = item as typeof item & { orderType?: string }
  if (itemAny.orderType && itemAny.orderType !== '--') return itemAny.orderType
  if (item.isRenewal || order.items.some((i) => i.isRenewal)) return 'Gia Hạn'
  return 'Mua mới'
}

export function OrderProductsPopover({ order, className }: OrderProductsPopoverProps) {
  const [open, setOpen] = useState(false)
  const hasMultipleProducts = order.items.length > 1
  const distinctStudents = Array.from(
    new Set(order.items.map((i) => i.studentName || order.studentName).filter(Boolean))
  )
  const studentsText = distinctStudents.join(', ')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'min-w-0 text-xs cursor-pointer group/pkg hover:bg-muted/40 p-1 -m-1 rounded-md transition-colors select-none',
            className
          )}
          title="Nhấp xem chi tiết danh sách gói sản phẩm"
        >
          {/* Dòng 1: Icon mở rộng nếu nhiều sản phẩm + Tên sản phẩm đầu tiên */}
          <div className="flex items-center gap-1 min-w-0">
            {hasMultipleProducts && (
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 text-muted-foreground/80 shrink-0 transition-transform duration-200',
                  open && 'rotate-180'
                )}
              />
            )}
            <p className="truncate font-medium text-foreground group-hover/pkg:text-primary group-hover/pkg:underline">
              {order.items[0]?.productName ?? '—'}
            </p>
          </div>

          {/* Dòng 2: Cơ sở • Học viên: <Tên học viên> */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5 min-w-0 flex-wrap">
            <span className="truncate max-w-[95px] shrink-0" title={order.branch}>
              {order.branch}
            </span>
            <span className="text-muted-foreground/40 shrink-0">•</span>
            <span className="truncate max-w-[155px]" title={`Học viên: ${studentsText}`}>
              Học viên: <span className="font-medium text-foreground">{studentsText}</span>
            </span>
            {distinctStudents.length > 1 && (
              <span className="text-[10px] font-medium px-1 py-0 rounded bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 shrink-0">
                {distinctStudents.length} con
              </span>
            )}
            {hasMultipleProducts && (
              <span className="text-xs text-muted-foreground shrink-0 font-mono">
                (+{order.items.length - 1})
              </span>
            )}
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[420px] sm:w-[480px] max-w-[95vw] p-3 text-xs shadow-xl border bg-background z-50 rounded-xl space-y-2.5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title Danh sách sản phẩm */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <span className="font-bold text-xs text-foreground">
            Danh sách sản phẩm ({order.items.length})
          </span>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
            {order.orderNo}
          </span>
        </div>

        {/* Danh sách gói sản phẩm theo thiết kế chuẩn gọn gàng */}
        <div className="space-y-2.5 py-0.5 max-h-72 overflow-y-auto pr-0.5">
          {order.items.map((item, idx) => {
            const duration = getItemDuration(item)
            const bonus = getItemBonus(item)
            const gift = getItemGift(item)
            const orderType = getItemOrderType(item, order)
            const subtotal = item.subtotal || item.unitPrice * item.quantity
            const itemBranch = (item as typeof item & { branch?: string }).branch || order.branch
            const itemStudent = item.studentName || order.studentName

            return (
              <div key={`${item.productId}-${idx}`} className="space-y-1 text-xs">
                {/* Dòng 1: Book Icon + Product Name + Tag (Gia Hạn/Mua mới) + SL/TT */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <BookOpen className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium text-xs text-foreground leading-snug truncate" title={item.productName}>
                      {item.productName}
                    </span>
                    {orderType && (
                      <span className="text-xs font-medium px-1.5 py-0.2 rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shrink-0 font-sans">
                        {orderType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs shrink-0 font-sans ml-auto">
                    <span className="text-muted-foreground text-xs">
                      SL: <strong className="font-semibold font-mono text-foreground">{item.quantity}</strong>
                    </span>
                    <span className="text-muted-foreground text-xs">
                      TT:{' '}
                      <strong className="font-semibold font-mono text-foreground">
                        {formatCurrency(subtotal)}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Dòng 2: Duration, Bonus, Gift */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground pl-5.5 flex-wrap">
                  {/* Duration / Sessions */}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                    <span>{duration}</span>
                  </div>

                  {/* Bonus Extra Sessions */}
                  <div className="flex items-center gap-1">
                    <Hourglass className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                    <span>{bonus}</span>
                  </div>

                  {/* Gift */}
                  {gift && (
                    <div className="flex items-center gap-1">
                      <Gift className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                      <span>{gift}</span>
                    </div>
                  )}
                </div>

                {/* Dòng 3: Tên cơ sở (trái) và Đối tượng thụ hưởng là con (phải) */}
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pl-5.5 pt-0.5">
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                    <span className="truncate">
                      Cơ sở: <span className="font-medium text-foreground">{itemBranch}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs shrink-0">
                    <span>
                      Học viên:{' '}
                      <span className="font-medium text-foreground">{itemStudent}</span>
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
