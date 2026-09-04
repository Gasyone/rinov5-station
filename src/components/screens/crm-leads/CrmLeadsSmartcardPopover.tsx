'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  Clock,
  GraduationCap,
  PhoneCall,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ToolbarSelect } from '@/components/controls'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Lead } from '@/mocks/crmLeads'
import {
  calculateLeadAllMetrics,
  calculateLeadMyMetrics,
  filterLeadsByTimeRange,
} from './crmLeadsMetrics'
import {
  TIME_RANGE_OPTIONS,
  type TimeRangeFilter,
} from './crmLeadsTypes'

interface CrmLeadsSmartcardPopoverProps {
  leads: Lead[]
  viewScope: 'my' | 'all'
  timeRange?: TimeRangeFilter
  onTimeRangeChange?: (range: TimeRangeFilter) => void
  className?: string
}

export function CrmLeadsSmartcardPopover({
  leads,
  viewScope,
  timeRange: propTimeRange,
  onTimeRangeChange,
  className,
}: CrmLeadsSmartcardPopoverProps) {
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

  const timeFilteredLeads = useMemo(
    () =>
      filterLeadsByTimeRange(leads, timeRange, {
        startDate: customStartDate,
        endDate: customEndDate,
      }),
    [leads, timeRange, customStartDate, customEndDate]
  )

  const allMetrics = useMemo(
    () => calculateLeadAllMetrics(timeFilteredLeads),
    [timeFilteredLeads]
  )

  const myMetrics = useMemo(
    () => calculateLeadMyMetrics(timeFilteredLeads),
    [timeFilteredLeads]
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
          title={
            viewScope === 'all'
              ? `Xem thống kê phễu Lead toàn trung tâm (${timeLabel})`
              : `Xem hiệu suất tác nghiệp cá nhân (${timeLabel})`
          }
          className={cn(
            'inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/95 px-2.5 py-1.5 text-xs shadow-2xs backdrop-blur-xs transition-all hover:bg-muted/70 hover:border-primary/40 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer select-none',
            open && 'border-primary/50 bg-muted/80 ring-1 ring-primary/20',
            className
          )}
        >
          {/* Main Icon Badge */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
            {viewScope === 'all' ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <UserCheck className="h-3.5 w-3.5" />
            )}
          </div>

          {viewScope === 'all' ? (
            <>
              {/* Metric 1: Total Leads */}
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">{allMetrics.totalLeads}</span>
                <span className="text-xs text-muted-foreground">lead</span>
              </div>

              <span className="text-muted-foreground/40 font-light">|</span>

              {/* Metric 2: Assigned Rate */}
              <div className="flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                <span className="font-semibold text-sky-700 dark:text-sky-300">
                  {allMetrics.assignedRate}%
                </span>
                <span className="text-xs text-muted-foreground">đã giao</span>
              </div>

              <span className="text-muted-foreground/40 font-light">|</span>

              {/* Metric 3: Conversion Rate */}
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {allMetrics.conversionRate}%
                </span>
                <span className="text-xs text-muted-foreground">chốt</span>
              </div>
            </>
          ) : (
            <>
              {/* Metric 1: My Leads */}
              <div className="flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold text-foreground">{myMetrics.totalLeads}</span>
                <span className="text-xs text-muted-foreground">lead</span>
              </div>

              <span className="text-muted-foreground/40 font-light">|</span>

              {/* Metric 2: Today Tasks */}
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-amber-700 dark:text-amber-300">
                  {myMetrics.todayTasksCount}
                </span>
                <span className="text-xs text-muted-foreground">hôm nay</span>
              </div>

              <span className="text-muted-foreground/40 font-light">|</span>

              {/* Metric 3: Overdue */}
              <div className="flex items-center gap-1">
                <AlertTriangle
                  className={cn(
                    'h-3.5 w-3.5',
                    myMetrics.overdueCount > 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-muted-foreground'
                  )}
                />
                <span
                  className={cn(
                    'font-medium',
                    myMetrics.overdueCount > 0
                      ? 'text-rose-700 dark:text-rose-300'
                      : 'text-muted-foreground'
                  )}
                >
                  {myMetrics.overdueCount}
                </span>
                <span className="text-xs text-muted-foreground">quá hạn</span>
              </div>
            </>
          )}

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
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                {viewScope === 'all' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {viewScope === 'all' ? 'Chỉ số phễu Lead' : 'Hiệu suất tác nghiệp'}
                  </h4>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {viewScope === 'all'
                      ? `Chốt ${allMetrics.conversionRate}%`
                      : `Đạt ${myMetrics.kpiProgressRate}% KPI`}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {viewScope === 'all'
                    ? `${allMetrics.totalLeads} lead khớp bộ lọc`
                    : `${myMetrics.totalLeads} lead đang phụ trách`}
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

          {/* Custom Date Range Picker: Flat & Borderless */}
          {timeRange === 'custom' && (
            <div className="flex items-center justify-between gap-2 px-1 py-1 text-xs animate-in fade-in-50 duration-200">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                  Từ ngày:
                </span>
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="h-6.5 text-xs bg-transparent border-0 border-b border-border/70 rounded-none px-1 py-0 shadow-none focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
              <span className="text-muted-foreground/40 text-xs px-0.5">→</span>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                  Đến ngày:
                </span>
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
          {viewScope === 'all' ? (
            <div className="grid grid-cols-2 gap-2">
              {/* 1. Tổng Lead tiếp nhận (Indigo) */}
              <div className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/[0.04] p-2.5 transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tổng Lead tiếp nhận
                  </p>
                  <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                    {allMetrics.totalLeads} lead
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <Users className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* 2. Tỷ lệ phân bổ Sale (Blue) */}
              <div className="flex items-center justify-between rounded-lg border border-sky-500/20 bg-sky-500/[0.04] p-2.5 transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                    Đã phân bổ Sale
                  </p>
                  <p className="text-sm sm:text-base font-bold text-sky-700 dark:text-sky-300 mt-0.5">
                    {allMetrics.assignedCount} ({allMetrics.assignedRate}%)
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-500/15 text-sky-600 dark:text-sky-400">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* 3. Hoàn thành Test / Học thử (Purple) */}
              <div className="flex items-center justify-between rounded-lg border border-purple-500/20 bg-purple-500/[0.04] p-2.5 transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                    Đã trải nghiệm
                  </p>
                  <p className="text-sm sm:text-base font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                    {allMetrics.experienceCount} ({allMetrics.experienceShowUpRate}%)
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* 4. Chuyển đổi thành công (Emerald) */}
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Đã chuyển đổi
                  </p>
                  <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {allMetrics.convertedCount} học viên
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {/* 1. Lead đang phụ trách (Indigo) */}
              <div className="flex items-center justify-between rounded-lg border border-indigo-500/20 bg-indigo-500/[0.04] p-2.5 transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Lead phụ trách
                  </p>
                  <p className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                    {myMetrics.totalLeads} lead
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* 2. Nhiệm vụ hôm nay (Amber) */}
              <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-2.5 transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Cần gọi hôm nay
                  </p>
                  <p className="text-sm sm:text-base font-bold text-amber-700 dark:text-amber-300 mt-0.5">
                    {myMetrics.todayTasksCount} lead
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <PhoneCall className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* 3. Cảnh báo quá hạn (Rose) */}
              <div className="flex items-center justify-between rounded-lg border border-rose-500/20 bg-rose-500/[0.04] p-2.5 transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    Quá hạn chăm sóc
                  </p>
                  <p className="text-sm sm:text-base font-bold text-rose-700 dark:text-rose-300 mt-0.5">
                    {myMetrics.overdueCount} lead
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* 4. Đã chốt thành công (Emerald) */}
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 transition-all">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Đã chốt thành công
                  </p>
                  <p className="text-sm sm:text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                    {myMetrics.convertedCount} học viên
                  </p>
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* Detailed Breakdown: Progress & SLA / Funnel distribution */}
          {viewScope === 'all' ? (
            <div className="rounded-lg bg-muted/30 p-2 border border-border/40 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Tiến độ tiếp cận ban đầu (SLA &lt; 15p)</span>
                <span className="font-semibold text-foreground">{allMetrics.slaRate}%</span>
              </div>

              {/* Mini Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, allMetrics.slaRate)}%` }}
                />
              </div>

              {/* Status distribution pills */}
              <div className="grid grid-cols-3 gap-1 pt-0.5 text-xs text-center">
                <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block text-xs">Dưới 15 phút</span>
                  <span className="font-bold text-foreground">{allMetrics.slaUnder15m}</span>
                </div>
                <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block text-xs">15p - 2 giờ</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {allMetrics.sla15mTo2h}
                  </span>
                </div>
                <div className="rounded bg-background px-1.5 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block text-xs">Chưa phân bổ</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {allMetrics.unassignedCount}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/30 p-2 border border-border/40 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>
                  Tiến độ KPI tháng ({myMetrics.convertedCount}/{myMetrics.targetCount} học viên)
                </span>
                <span className="font-semibold text-foreground">{myMetrics.kpiProgressRate}%</span>
              </div>

              {/* Mini Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, myMetrics.kpiProgressRate)}%` }}
                />
              </div>

              {/* Funnel distribution pills */}
              <div className="grid grid-cols-4 gap-1 pt-0.5 text-xs text-center">
                <div className="rounded bg-background px-1 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block text-xs">Chưa gọi</span>
                  <span className="font-bold text-foreground">{myMetrics.newCount}</span>
                </div>
                <div className="rounded bg-background px-1 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block text-xs">Đang CS</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">
                    {myMetrics.inProgressCount}
                  </span>
                </div>
                <div className="rounded bg-background px-1 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block text-xs">Trải nghiệm</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {myMetrics.experienceCount}
                  </span>
                </div>
                <div className="rounded bg-background px-1 py-0.5 border border-border/40">
                  <span className="text-muted-foreground block text-xs">Tiềm năng</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {myMetrics.closingCount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
