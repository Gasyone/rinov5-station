'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  ReceiptText,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DateRangePicker } from '@/components/controls'
import { cn } from '@/lib/utils'
import type { PaymentReceipt } from '@/mocks/paymentReceipts'
import {
  calculateReceiptMetrics,
  filterReceiptsByTimeRange,
  formatCompactCurrency,
} from './paymentReceiptsHelpers'
import {
  RECEIPT_DATE_PRESETS,
  type ReceiptTimeRangeFilter,
} from './paymentReceiptsTypes'

interface PaymentReceiptsSmartcardPopoverProps {
  receipts: PaymentReceipt[]
  timeRange?: ReceiptTimeRangeFilter
  onTimeRangeChange?: (range: ReceiptTimeRangeFilter) => void
  customStartDate?: string
  customEndDate?: string
  onCustomDateChange?: (start: string, end: string) => void
  className?: string
}

export function PaymentReceiptsSmartcardPopover({
  receipts,
  timeRange: propTimeRange,
  onTimeRangeChange,
  customStartDate: propStartDate,
  customEndDate: propEndDate,
  onCustomDateChange,
  className,
}: PaymentReceiptsSmartcardPopoverProps) {
  const [open, setOpen] = useState(false)
  const [localTimeRange, setLocalTimeRange] = useState<ReceiptTimeRangeFilter>('this_month')
  const [localStartDate, setLocalStartDate] = useState<string>('2026-08-01')
  const [localEndDate, setLocalEndDate] = useState<string>('2026-08-25')

  const timeRange = propTimeRange ?? localTimeRange
  const customStartDate = propStartDate ?? localStartDate
  const customEndDate = propEndDate ?? localEndDate

  const timeFilteredReceipts = useMemo(
    () =>
      filterReceiptsByTimeRange(receipts, timeRange, {
        startDate: customStartDate,
        endDate: customEndDate,
      }),
    [receipts, timeRange, customStartDate, customEndDate]
  )

  const metrics = useMemo(
    () => calculateReceiptMetrics(timeFilteredReceipts),
    [timeFilteredReceipts]
  )

  const activePreset = RECEIPT_DATE_PRESETS.find((p) => p.id === timeRange)
  const timeLabel =
    timeRange === 'custom' && customStartDate
      ? customEndDate
        ? `${customStartDate.slice(5)} → ${customEndDate.slice(5)}`
        : `Từ ${customStartDate.slice(5)}`
      : (activePreset?.label ?? 'Tháng hiện tại')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={`Xem thống kê dòng tiền phiếu thanh toán (${timeLabel})`}
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

          {/* Metric 1: Total Receipts */}
          <div className="flex items-center gap-1">
            <ReceiptText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{metrics.total}</span>
            <span className="text-xs text-muted-foreground">phiếu</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 2: Thực thu */}
          <div className="flex items-center gap-1">
            <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              +{formatCompactCurrency(metrics.totalReceipts)}
            </span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 3: Thực chi / hoàn */}
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
            <span
              className={cn(
                'font-medium',
                metrics.totalVouchers > 0
                  ? 'text-rose-700 dark:text-rose-400'
                  : 'text-muted-foreground'
              )}
            >
              -{formatCompactCurrency(metrics.totalVouchers)}
            </span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 4: Thu ròng (Net) */}
          <div className="flex items-center gap-1">
            <Wallet className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-primary">
              {formatCompactCurrency(metrics.netCash)}
            </span>
            <span className="text-xs text-muted-foreground">ròng</span>
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
          {/* Header: Title + Success rate badge on left, Time selector on right */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-foreground truncate">Chỉ số dòng tiền</h4>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Thành công {metrics.successRate}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {metrics.total} phiếu giao dịch khớp bộ lọc
                </p>
              </div>
            </div>

            {/* Time Selector via DateRangePicker Modal in Header */}
            <div className="shrink-0">
              <DateRangePicker
                startDate={customStartDate}
                endDate={customEndDate}
                preset={timeRange}
                presets={RECEIPT_DATE_PRESETS}
                placeholder="Chọn thời gian"
                align="end"
                triggerClassName="h-7 text-xs bg-transparent hover:bg-muted/50 font-medium border-border/50 shadow-none px-2"
                onApply={({ startDate, endDate, preset }) => {
                  const nextPreset = (preset as ReceiptTimeRangeFilter) || 'custom'
                  setLocalTimeRange(nextPreset)
                  setLocalStartDate(startDate)
                  setLocalEndDate(endDate)
                  onTimeRangeChange?.(nextPreset)
                  onCustomDateChange?.(startDate, endDate)
                }}
                onClear={() => {
                  setLocalTimeRange('all')
                  setLocalStartDate('')
                  setLocalEndDate('')
                  onTimeRangeChange?.('all')
                  onCustomDateChange?.('', '')
                }}
              />
            </div>
          </div>

          {/* 4 Colorful & Compact Smartcards Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Tổng số phiếu (Indigo) */}
            <div className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tổng giao dịch
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {metrics.total} phiếu
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {metrics.receiptCount} thu • {metrics.voucherCount} chi
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <ReceiptText className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 2. Thực thu (Emerald / Green) */}
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Tổng thực thu
                </p>
                <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                  +{metrics.totalReceipts.toLocaleString('vi-VN')} đ
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Phiếu thu thành công
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <ArrowDownLeft className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 3. Thực chi / hoàn tiền (Rose / Warning) */}
            <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Tổng chi & hoàn
                </p>
                <p className="text-sm sm:text-base font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                  -{metrics.totalVouchers.toLocaleString('vi-VN')} đ
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Phiếu chi & hoàn tiền
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 4. Dòng tiền ròng (Blue / Sky) */}
            <div className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Dòng tiền ròng
                </p>
                <p className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300 mt-0.5">
                  {(metrics.netCash >= 0 ? '+' : '') + metrics.netCash.toLocaleString('vi-VN')} đ
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Thực thu trừ thực chi
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <Wallet className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Detailed Breakdown: Distribution by Method & Status */}
          <div className="rounded-lg bg-muted/30 p-2 border border-border/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Trạng thái phiếu giao dịch ({timeLabel})</span>
              <span className="font-semibold text-foreground">{metrics.successRate}% thành công</span>
            </div>

            {/* Status distribution pills */}
            <div className="grid grid-cols-3 gap-1 pt-0.5 text-xs text-center">
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Thành công</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {metrics.completedCount}
                </span>
              </div>
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Chờ xử lý</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {metrics.pendingCount}
                </span>
              </div>
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Đã hủy</span>
                <span className="font-bold text-muted-foreground">
                  {metrics.cancelledCount}
                </span>
              </div>
            </div>

            {/* Payment Method distribution */}
            <div className="pt-1 border-t border-border/30">
              <span className="text-xs text-muted-foreground block mb-1">
                Kênh thanh toán:
              </span>
              <div className="grid grid-cols-4 gap-1 text-xs text-center">
                <div className="rounded bg-background px-1 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block truncate">QR</span>
                  <span className="font-semibold text-foreground">{metrics.qrCount}</span>
                </div>
                <div className="rounded bg-background px-1 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block truncate">Bank</span>
                  <span className="font-semibold text-foreground">{metrics.bankTransferCount}</span>
                </div>
                <div className="rounded bg-background px-1 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block truncate">POS</span>
                  <span className="font-semibold text-foreground">{metrics.posCount}</span>
                </div>
                <div className="rounded bg-background px-1 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block truncate">Tiền mặt</span>
                  <span className="font-semibold text-foreground">{metrics.cashCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
