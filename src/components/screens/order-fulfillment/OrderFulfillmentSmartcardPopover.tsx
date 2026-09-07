'use client'

import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Package,
  TrendingUp,
  Truck,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToolbarSelect } from '@/components/controls'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { OrderFulfillmentRecord } from '@/mocks/orderFulfillments'
import {
  calculateFulfillmentMetrics,
  filterFulfillmentsByTimeRange,
} from './orderFulfillmentHelpers'
import {
  TIME_RANGE_OPTIONS,
  type TimeRangeFilter,
} from './orderFulfillmentTypes'

interface OrderFulfillmentSmartcardPopoverProps {
  records: OrderFulfillmentRecord[]
  className?: string
}

export function OrderFulfillmentSmartcardPopover({
  records,
  className,
}: OrderFulfillmentSmartcardPopoverProps) {
  // State hoàn toàn nội bộ và độc lập để tối ưu hiệu suất, không re-render màn hình cha
  const [open, setOpen] = useState(false)
  const [localTimeRange, setLocalTimeRange] = useState<TimeRangeFilter>('this_month')
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01')
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-30')

  const timeFilteredRecords = useMemo(
    () =>
      filterFulfillmentsByTimeRange(records, localTimeRange, {
        startDate: customStartDate,
        endDate: customEndDate,
      }),
    [records, localTimeRange, customStartDate, customEndDate]
  )

  const metrics = useMemo(
    () => calculateFulfillmentMetrics(timeFilteredRecords),
    [timeFilteredRecords]
  )

  const activeTimeOption = TIME_RANGE_OPTIONS.find((o) => o.value === localTimeRange)
  const timeLabel =
    localTimeRange === 'custom'
      ? `${customStartDate.slice(5)} → ${customEndDate.slice(5)}`
      : (activeTimeOption?.label ?? 'Tháng hiện tại')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={`Xem thống kê bàn giao & giao hàng (${timeLabel})`}
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

          {/* Metric 1: Tổng số phiếu */}
          <div className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{metrics.total}</span>
            <span className="text-xs text-muted-foreground">phiếu</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 2: Tỷ lệ đã giao */}
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-foreground">
              {metrics.handoverRate}%
            </span>
            <span className="text-xs text-muted-foreground">đã giao</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 3: Tỷ lệ chờ */}
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span
              className={cn(
                'font-medium',
                metrics.pendingCount > 0
                  ? 'text-amber-700 dark:text-amber-300'
                  : 'text-muted-foreground'
              )}
            >
              {metrics.pendingRate}%
            </span>
            <span className="text-xs text-muted-foreground">chờ</span>
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
        className="w-[360px] sm:w-[430px] p-3.5 shadow-lg border-border/80"
      >
        <div className="flex flex-col gap-2.5">
          {/* Header: Title + Handover badge on left, Time selector on right */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-foreground truncate">Chỉ số bàn giao & giao hàng</h4>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    Hoàn tất {metrics.handoverRate}%
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {metrics.total} phiếu khớp bộ lọc
                </p>
              </div>
            </div>

            {/* Time Selector Dropdown in Header */}
            <div className="shrink-0">
              <ToolbarSelect
                value={localTimeRange}
                options={TIME_RANGE_OPTIONS}
                onValueChange={(val) => setLocalTimeRange(val as TimeRangeFilter)}
                ariaLabel="Chọn khoảng thời gian thống kê"
                className="h-7 min-w-36 max-w-44 text-xs bg-transparent hover:bg-muted/50 font-medium border-border/50 shadow-none"
              />
            </div>
          </div>

          {/* Custom Date Range Picker */}
          {localTimeRange === 'custom' && (
            <div className="flex items-center justify-between gap-2 px-1 py-1 text-xs animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium text-muted-foreground shrink-0">Từ ngày:</span>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="h-6.5 text-xs bg-transparent border-0 border-b border-border/70 rounded-none px-1 py-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
              <span className="text-muted-foreground/40 text-xs px-0.5">→</span>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium text-muted-foreground shrink-0">Đến ngày:</span>
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="h-6.5 text-xs bg-transparent border-0 border-b border-border/70 rounded-none px-1 py-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
            </div>
          )}

          {/* 4 Colorful & Compact Smartcards Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Tổng phiếu bàn giao (Indigo) */}
            <div className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Tổng phiếu bàn giao
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {metrics.total} phiếu
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <Package className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 2. Đã bàn giao thành công (Emerald) */}
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Đã bàn giao
                </p>
                <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {metrics.handedOverCount} ({metrics.handoverRate}%)
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 3. Đang vận chuyển (Blue / Sky) */}
            <div className="flex items-center justify-between rounded-lg border border-sky-500/20 bg-sky-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  Đang vận chuyển
                </p>
                <p className="text-sm sm:text-base font-bold text-sky-700 dark:text-sky-300 mt-0.5">
                  {metrics.shippingCount} ({metrics.shippingRate}%)
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-500/15 text-sky-600 dark:text-sky-400">
                <Truck className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 4. Chờ bàn giao tồn đọng (Amber / Warning) */}
            <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Chờ bàn giao tồn
                </p>
                <p className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                  {metrics.pendingCount} phiếu
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* SLA & Tiến độ xử lý */}
          <div className="rounded-lg bg-muted/30 p-2 border border-border/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>Tiến độ bàn giao đúng hạn (SLA &lt; 24h)</span>
              <span className="font-semibold text-foreground">{metrics.slaRate}%</span>
            </div>

            {/* Mini Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, metrics.slaRate)}%` }}
              />
            </div>

            {/* SLA distribution pills */}
            <div className="grid grid-cols-3 gap-1 pt-0.5 text-xs text-center">
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-[10px]">Dưới 24h</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{metrics.under24hCount}</span>
              </div>
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-[10px]">24h - 48h</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {metrics.between24And48hCount}
                </span>
              </div>
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-[10px]">Quá hạn / Tồn</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {metrics.overdueCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
