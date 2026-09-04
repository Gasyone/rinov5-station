'use client'

import { useMemo, useState } from 'react'
import {
  Banknote,
  CheckCircle,
  ChevronDown,
  ReceiptText,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToolbarSelect } from '@/components/controls'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Order } from '@/mocks/orders'
import {
  calculateOrderMetrics,
  filterOrdersByTimeRange,
  formatCompactCurrency,
} from './ordersHelpers'
import {
  TIME_RANGE_OPTIONS,
  type TimeRangeFilter,
} from './ordersTypes'

interface OrdersSmartcardPopoverProps {
  orders: Order[]
  timeRange?: TimeRangeFilter
  onTimeRangeChange?: (range: TimeRangeFilter) => void
  className?: string
}

export function OrdersSmartcardPopover({
  orders,
  timeRange: propTimeRange,
  onTimeRangeChange,
  className,
}: OrdersSmartcardPopoverProps) {
  const [open, setOpen] = useState(false)
  const [localTimeRange, setLocalTimeRange] = useState<TimeRangeFilter>('this_month')
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01')
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-25')

  const timeRange = propTimeRange ?? localTimeRange

  const handleTimeRangeChange = (val: string) => {
    const nextRange = val as TimeRangeFilter
    setLocalTimeRange(nextRange)
    onTimeRangeChange?.(nextRange)
  }

  const timeFilteredOrders = useMemo(
    () =>
      filterOrdersByTimeRange(orders, timeRange, {
        startDate: customStartDate,
        endDate: customEndDate,
      }),
    [orders, timeRange, customStartDate, customEndDate]
  )

  const metrics = useMemo(
    () => calculateOrderMetrics(timeFilteredOrders),
    [timeFilteredOrders]
  )

  const activeTimeOption = TIME_RANGE_OPTIONS.find((o) => o.value === timeRange)
  const timeLabel =
    timeRange === 'custom'
      ? `${customStartDate.slice(5)} → ${customEndDate.slice(5)}`
      : (activeTimeOption?.label ?? 'Tháng hiện tại')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={`Xem thống kê tài chính đơn hàng (${timeLabel})`}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/95 px-2.5 py-1.5 text-xs shadow-2xs backdrop-blur-xs transition-all hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer select-none',
            open && 'border-primary/50 bg-muted/80 ring-1 ring-primary/20',
            className
          )}
        >
          {/* Main icon badge */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>

          {/* Metric 1: Total Orders */}
          <div className="flex items-center gap-1">
            <ReceiptText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{metrics.total}</span>
            <span className="text-xs text-muted-foreground">đơn</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 2: Collected Revenue */}
          <div className="flex items-center gap-1">
            <Banknote className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-foreground">
              {formatCompactCurrency(metrics.revenue)}
            </span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 3: Outstanding Debt (luôn cố định 3 chỉ số) */}
          <div className="flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span
              className={cn(
                'font-medium',
                metrics.outstanding > 0
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-muted-foreground'
              )}
            >
              {formatCompactCurrency(metrics.outstanding)}
            </span>
            <span className="text-xs text-muted-foreground">nợ</span>
          </div>

          {/* Dropdown Chevron indicator */}
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ml-0.5',
              open && 'rotate-180 text-foreground'
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-[360px] sm:w-[420px] p-3.5 shadow-lg border-border/80"
      >
        <div className="flex flex-col gap-2.5">
          {/* Header: Title + Collection badge on left, Time selector on right */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-foreground truncate">Chỉ số tài chính</h4>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Thu {metrics.collectionRate}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {metrics.total} đơn khớp bộ lọc
                </p>
              </div>
            </div>

            {/* Time Selector Dropdown in Header */}
            <div className="shrink-0">
              <ToolbarSelect
                value={timeRange}
                options={TIME_RANGE_OPTIONS}
                onValueChange={handleTimeRangeChange}
                ariaLabel="Chọn khoảng thời gian thống kê"
                className="h-7 min-w-36 max-w-44 text-xs bg-transparent hover:bg-muted/50 font-medium border-border/50 shadow-none"
              />
            </div>
          </div>

          {/* Custom Date Range Picker: Flat & Borderless (bỏ nền, bỏ viền thô) */}
          {timeRange === 'custom' && (
            <div className="flex items-center justify-between gap-2 px-1 py-1 text-xs animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-xs font-medium text-muted-foreground shrink-0">Từ ngày:</span>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="h-6.5 text-xs bg-transparent border-0 border-b border-border/70 rounded-none px-1 py-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
              <span className="text-muted-foreground/40 text-xs px-0.5">→</span>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-xs font-medium text-muted-foreground shrink-0">Đến ngày:</span>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="h-6.5 text-xs bg-transparent border-0 border-b border-border/70 rounded-none px-1 py-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
            </div>
          )}

          {/* 4 Colorful & Compact Smartcards Grid (thu gọn chiều cao, có màu sắc riêng) */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Tổng số đơn (Indigo) */}
            <div className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tổng số đơn
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {metrics.total} đơn
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <ReceiptText className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 2. Doanh thu đã thu (Emerald / Green) */}
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Doanh thu đã thu
                </p>
                <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {metrics.revenue.toLocaleString('vi-VN')} đ
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Banknote className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 3. Học phí còn nợ (Amber / Warning) */}
            <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Học phí còn nợ
                </p>
                <p className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                  {metrics.outstanding.toLocaleString('vi-VN')} đ
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Wallet className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 4. Đơn hoàn tất (Blue / Sky) */}
            <div className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Đơn hoàn tất
                </p>
                <p className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300 mt-0.5">
                  {metrics.completed} đơn
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Detailed Breakdown: Progress & Payment status distribution */}
          <div className="rounded-lg bg-muted/30 p-2 border border-border/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Tiến độ thu học phí ({timeLabel})</span>
              <span className="font-semibold text-foreground">{metrics.collectionRate}%</span>
            </div>

            {/* Mini Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, metrics.collectionRate)}%` }}
              />
            </div>

            {/* Status distribution pills */}
            <div className="grid grid-cols-3 gap-1 pt-0.5 text-xs text-center">
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Đã thu đủ</span>
                <span className="font-bold text-foreground">{metrics.paidCount}</span>
              </div>
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Thu 1 phần</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {metrics.partialCount}
                </span>
              </div>
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Chưa thu</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {metrics.unpaidCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
