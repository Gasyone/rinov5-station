'use client'

import { useMemo, useState } from 'react'
import {
  Award,
  CheckCircle,
  ChevronDown,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Users,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToolbarSelect } from '@/components/controls'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import {
  calculateCareOperationsMetrics,
  filterCareAlertsByTimeRange,
  CARE_TIME_RANGE_OPTIONS,
  type CareTimeRangeFilter,
} from './careOperationsMetricsHelpers'

interface OperationsAlertSmartcardPopoverProps {
  alerts: StudentCareAlert[]
  timeRange?: CareTimeRangeFilter
  onTimeRangeChange?: (range: CareTimeRangeFilter) => void
  className?: string
}

export function OperationsAlertSmartcardPopover({
  alerts,
  timeRange: propTimeRange,
  onTimeRangeChange,
  className,
}: OperationsAlertSmartcardPopoverProps) {
  const [open, setOpen] = useState(false)
  const [localTimeRange, setLocalTimeRange] = useState<CareTimeRangeFilter>('this_month')
  const [customStartDate, setCustomStartDate] = useState<string>('2026-08-01')
  const [customEndDate, setCustomEndDate] = useState<string>('2026-08-25')

  const timeRange = propTimeRange ?? localTimeRange

  const handleTimeRangeChange = (val: string) => {
    const nextRange = val as CareTimeRangeFilter
    setLocalTimeRange(nextRange)
    onTimeRangeChange?.(nextRange)
  }

  const timeFilteredAlerts = useMemo(
    () =>
      filterCareAlertsByTimeRange(alerts, timeRange, {
        startDate: customStartDate,
        endDate: customEndDate,
      }),
    [alerts, timeRange, customStartDate, customEndDate]
  )

  const metrics = useMemo(
    () => calculateCareOperationsMetrics(timeFilteredAlerts),
    [timeFilteredAlerts]
  )

  const activeTimeOption = CARE_TIME_RANGE_OPTIONS.find((o) => o.value === timeRange)
  const timeLabel =
    timeRange === 'custom'
      ? `${customStartDate.slice(5)} → ${customEndDate.slice(5)}`
      : (activeTimeOption?.label ?? 'Tháng hiện tại')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={`Xem chỉ số chăm sóc học viên (${timeLabel})`}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/95 px-2.5 py-1.5 text-xs shadow-2xs backdrop-blur-xs transition-all hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer select-none',
            open && 'border-primary/50 bg-muted/80 ring-1 ring-primary/20',
            className
          )}
        >
          {/* Main icon badge */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>

          {/* Metric 0: Tỷ lệ đúng hạn SLA */}
          <div className="flex items-center gap-1">
            <Award className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-primary">{metrics.inTimeRate}%</span>
            <span className="text-xs text-muted-foreground hidden lg:inline">SLA</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 1: Total Alerts */}
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">{metrics.total}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">ca</span>
          </div>

          <span className="text-muted-foreground/40 font-light">|</span>

          {/* Metric 2: Đã chăm sóc */}
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {metrics.cared}
            </span>
            <span className="text-xs text-muted-foreground hidden md:inline">đã CS</span>
          </div>

          {/* Metric 3: Quá hạn SLA (visible on md screens up if > 0) */}
          {metrics.overdue > 0 ? (
            <>
              <span className="text-muted-foreground/40 font-light hidden md:inline">|</span>
              <div className="hidden md:flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                <span className="font-medium text-rose-600 dark:text-rose-400">
                  {metrics.overdue}
                </span>
                <span className="text-xs text-muted-foreground">quá hạn</span>
              </div>
            </>
          ) : null}

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
        className="w-[370px] sm:w-[430px] p-3.5 shadow-lg border-border/80"
      >
        <div className="flex flex-col gap-2.5">
          {/* Header: Title on left, Time selector on right */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-foreground truncate">Chỉ số chăm sóc học viên</h4>
            </div>

            {/* Time Selector Dropdown in Header */}
            <div className="shrink-0">
              <ToolbarSelect
                value={timeRange}
                options={CARE_TIME_RANGE_OPTIONS}
                onValueChange={handleTimeRangeChange}
                ariaLabel="Chọn khoảng thời gian thống kê chăm sóc"
                className="h-7 min-w-36 max-w-44 text-xs bg-transparent hover:bg-muted/50 font-medium border-border/50 shadow-none"
              />
            </div>
          </div>

          {/* Custom Date Range Picker */}
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

          {/* Smartcard Tỷ lệ SLA chuẩn */}
          <div className="flex items-center justify-between rounded-lg border border-primary/25 bg-primary/[0.04] p-2.5 transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Award className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tỷ lệ xử lý đúng hạn SLA
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {metrics.inTimeCount}/{metrics.total} ca đạt chuẩn thời gian SLA
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right pl-2">
              <span className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                {metrics.inTimeRate}%
              </span>
            </div>
          </div>

          {/* 4 Colorful & Compact Smartcards Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* 1. Tổng ca cảnh báo (Indigo) */}
            <div className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tổng ca cảnh báo
                </p>
                <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                  {metrics.total} học viên
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 2. Đã chăm sóc (Emerald / Green) */}
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Đã hoàn tất CS
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300">
                    {metrics.cared} ca
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-1.5 py-0.2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    Đạt {metrics.completionRate}%
                  </span>
                </div>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 3. Quá hạn SLA (Rose / Red) */}
            <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Quá hạn SLA
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm sm:text-base font-bold text-rose-700 dark:text-rose-300">
                    {metrics.overdue} ca
                  </span>
                  {metrics.overdue > 0 && (
                    <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Cần xử lý
                    </span>
                  )}
                </div>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* 4. Chăm sóc đặc biệt (Blue / Amber) */}
            <div className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-2.5 transition-all">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Chăm sóc đặc biệt
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-300">
                    {metrics.csdbCount} ca
                  </span>
                  <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
                    CSĐB
                  </span>
                </div>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <Flame className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Detailed Breakdown: Progress & Status distribution */}
          <div className="rounded-lg bg-muted/30 p-2 border border-border/40 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Tiến độ xử lý tác nghiệp chăm sóc ({timeLabel})</span>
              <span className="font-semibold text-foreground">{metrics.completionRate}%</span>
            </div>

            {/* Mini Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, metrics.completionRate)}%` }}
              />
            </div>

            {/* Status distribution pills */}
            <div className="grid grid-cols-3 gap-1 pt-0.5 text-xs text-center">
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Đã chăm sóc</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{metrics.cared}</span>
              </div>
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Đang xử lý</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {metrics.inProgress}
                </span>
              </div>
              <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                <span className="text-muted-foreground block text-xs">Chưa chăm sóc</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {metrics.pending}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
