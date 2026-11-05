'use client'

import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DAILY_BRANCH_OPTIONS, type DailyCheckSubmission, type DailyCheckShift } from '@/mocks/dailyCheck'
import type { CalendarDayInfo, DailyViewMode, DailyTileId } from './dailyCheckTypes'
import {
  getWeekDates,
  getMonthDates,
  findSubmissionForBranchShiftDate,
} from './dailyCheckHelpers'

export interface DailyCheckMatrixViewProps {
  submissions: DailyCheckSubmission[]
  viewMode: DailyViewMode
  selectedBranch?: string
  activeTile?: DailyTileId
  onClearTile?: () => void
  onViewDetail: (sub: DailyCheckSubmission) => void
  onOpenSubmitForShift: (branch: string, date: string, shift: 'dau_ca' | 'cuoi_ca') => void
  onSwitchToExecution?: (branch: string, shift: DailyCheckShift) => void
}

export function DailyCheckMatrixView({
  submissions,
  viewMode,
  selectedBranch = 'all',
  activeTile = 'all',
  onClearTile,
  onViewDetail,
  onOpenSubmitForShift,
  onSwitchToExecution,
}: DailyCheckMatrixViewProps) {
  // Current calendar navigation reference date
  const [refDateStr, setRefDateStr] = useState('2026-10-29') // Defaults to current mock week

  const isWeekMode = viewMode === 'matrix_week'

  // Calculate day columns
  const days: CalendarDayInfo[] = React.useMemo(() => {
    if (isWeekMode) {
      return getWeekDates(refDateStr)
    }
    return getMonthDates(2026, 10)
  }, [isWeekMode, refDateStr])

  // Filter branches if branch selector is applied
  const displayedBranches = React.useMemo(() => {
    if (selectedBranch !== 'all') {
      return DAILY_BRANCH_OPTIONS.filter((b) => b === selectedBranch)
    }
    return DAILY_BRANCH_OPTIONS
  }, [selectedBranch])

  const handlePrevWeek = () => {
    const [y, m, d] = refDateStr.split('-').map(Number)
    const prev = new Date(y, m - 1, d - 7)
    setRefDateStr(
      `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}`
    )
  }

  const handleNextWeek = () => {
    const [y, m, d] = refDateStr.split('-').map(Number)
    const next = new Date(y, m - 1, d + 7)
    setRefDateStr(
      `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`
    )
  }

  const handleCurrentWeek = () => {
    setRefDateStr('2026-10-29')
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-card rounded-xl border border-border/80 shadow-2xs overflow-hidden text-left">
      {/* Matrix Controls & Navigation Bar */}
      <div className="flex items-center justify-between gap-3 p-3 border-b border-border/60 bg-muted/20 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevWeek}
              className="h-7 w-7 cursor-pointer"
              title="Tuần trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCurrentWeek}
              className="h-7 text-xs font-semibold cursor-pointer"
            >
              Tuần hiện tại (26/10 - 01/11/2026)
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextWeek}
              className="h-7 w-7 cursor-pointer"
              title="Tuần sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Huy hiệu chỉ báo bộ lọc trạng thái đang áp dụng */}
          {activeTile === 'has_issues' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-700 dark:text-rose-300 font-medium">
              <span>Đang lọc: Ca có lỗi / Chưa xong</span>
              {onClearTile && (
                <button
                  type="button"
                  onClick={onClearTile}
                  className="ml-1 hover:text-foreground cursor-pointer text-[10px] font-bold"
                  title="Bỏ lọc"
                >
                  ✕
                </button>
              )}
            </div>
          )}
          {activeTile === 'perfect' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
              <span>Đang lọc: Ca đạt chuẩn 100%</span>
              {onClearTile && (
                <button
                  type="button"
                  onClick={onClearTile}
                  className="ml-1 hover:text-foreground cursor-pointer text-[10px] font-bold"
                  title="Bỏ lọc"
                >
                  ✕
                </button>
              )}
            </div>
          )}
          {activeTile === 'missing_late' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
              <span>Đang lọc: Ca chậm trễ / Chưa nộp</span>
              {onClearTile && (
                <button
                  type="button"
                  onClick={onClearTile}
                  className="ml-1 hover:text-foreground cursor-pointer text-[10px] font-bold"
                  title="Bỏ lọc"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Đạt 100%</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
            <span>Có lỗi / Chưa xong</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
            <span>Nộp muộn</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full border border-dashed border-rose-400 bg-rose-50 dark:bg-rose-950/60 shrink-0" />
            <span>Chưa nộp / Quên ca</span>
          </span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-30 bg-muted/80 backdrop-blur-md border-b border-border/80">
            <tr>
              <th className="sticky left-0 z-40 bg-muted min-w-[170px] w-[170px] p-2.5 text-xs font-semibold text-foreground border-r border-border/60">
                Cơ sở / Điểm trường
              </th>
              {days.map((day) => (
                <th
                  key={day.dateStr}
                  className={cn(
                    'p-2 text-center text-xs font-medium border-r border-border/40 whitespace-nowrap',
                    isWeekMode ? 'min-w-[150px]' : 'min-w-[75px]',
                    day.isToday && 'bg-primary/10 text-primary font-bold'
                  )}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {day.dayOfWeek}
                    </span>
                    <span className={cn('text-xs', day.isToday ? 'text-primary font-bold' : 'text-foreground')}>
                      {isWeekMode ? day.dateStr.slice(5).replace('-', '/') : day.dayOfMonth}
                    </span>
                    {day.isToday && (
                      <span className="text-[9px] px-1 bg-primary text-primary-foreground rounded-full leading-tight font-semibold">
                        Hôm nay
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs">
            {displayedBranches.map((branch, bIdx) => {
              // Kiểm tra xem cơ sở này có ca nào khớp với bộ lọc không
              const branchMatches = activeTile === 'all' || days.some((day) => {
                const m = findSubmissionForBranchShiftDate(submissions, branch, 'dau_ca', day.dateStr)
                const n = findSubmissionForBranchShiftDate(submissions, branch, 'cuoi_ca', day.dateStr)
                if (activeTile === 'has_issues') {
                  return (m && m.failedItemsCount > 0) || (n && n.failedItemsCount > 0)
                }
                if (activeTile === 'perfect') {
                  return (m && m.failedItemsCount === 0 && m.passRate === 100) || (n && n.failedItemsCount === 0 && n.passRate === 100)
                }
                if (activeTile === 'missing_late') {
                  return (m && (m.status === 'late' || m.status === 'missing')) || (n && (n.status === 'late' || n.status === 'missing'))
                }
                return true
              })

              let branchIssueCount = 0
              days.forEach((day) => {
                const m = findSubmissionForBranchShiftDate(submissions, branch, 'dau_ca', day.dateStr)
                const n = findSubmissionForBranchShiftDate(submissions, branch, 'cuoi_ca', day.dateStr)
                if (m && m.failedItemsCount > 0) branchIssueCount += m.failedItemsCount
                if (n && n.failedItemsCount > 0) branchIssueCount += n.failedItemsCount
              })

              return (
                <tr
                  key={branch}
                  className={cn(
                    bIdx % 2 === 1 ? 'bg-muted/10' : 'bg-background',
                    !branchMatches && 'opacity-25 hover:opacity-100 transition-opacity',
                    branchMatches && activeTile === 'has_issues' && branchIssueCount > 0 && 'bg-rose-50/25 dark:bg-rose-950/20'
                  )}
                >
                  {/* Sticky Branch Name Column: Bấm để mở bảng tự đánh giá cơ sở này */}
                  <td className="sticky left-0 z-20 bg-card p-2.5 font-semibold text-xs text-foreground border-r border-border/60 shadow-xs">
                    <button
                      type="button"
                      onClick={() => onSwitchToExecution?.(branch, 'dau_ca')}
                      className="text-left group/btn cursor-pointer flex flex-col gap-0.5 hover:text-primary transition-colors"
                      title={`Bấm để chuyển sang bảng Tự đánh giá của ${branch}`}
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="group-hover/btn:underline">{branch}</span>
                        {activeTile === 'has_issues' && branchIssueCount > 0 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800">
                            {branchIssueCount} lỗi
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-normal">2 ca/ngày • Bấm xem ma trận</span>
                    </button>
                  </td>

                  {/* Day Cells */}
                  {days.map((day) => {
                    const morningSub = findSubmissionForBranchShiftDate(submissions, branch, 'dau_ca', day.dateStr)
                    const nightSub = findSubmissionForBranchShiftDate(submissions, branch, 'cuoi_ca', day.dateStr)
                    const isFutureDate = day.dateStr > '2026-10-29'
                    const isTodayNight = day.dateStr === '2026-10-29'

                    // Lọc trạng thái theo activeTile cho ca sáng
                    let isMorningMatch = true
                    if (activeTile !== 'all') {
                      if (!morningSub) {
                        isMorningMatch = activeTile === 'missing_late' && !isFutureDate
                      } else if (activeTile === 'perfect') {
                        isMorningMatch = morningSub.failedItemsCount === 0 && morningSub.passRate === 100
                      } else if (activeTile === 'has_issues') {
                        isMorningMatch = morningSub.failedItemsCount > 0
                      } else if (activeTile === 'missing_late') {
                        isMorningMatch = morningSub.status === 'late' || morningSub.status === 'missing'
                      }
                    }

                    // Lọc trạng thái theo activeTile cho ca tối
                    let isNightMatch = true
                    if (activeTile !== 'all') {
                      if (!nightSub) {
                        isNightMatch = activeTile === 'missing_late' && !isFutureDate && !isTodayNight
                      } else if (activeTile === 'perfect') {
                        isNightMatch = nightSub.failedItemsCount === 0 && nightSub.passRate === 100
                      } else if (activeTile === 'has_issues') {
                        isNightMatch = nightSub.failedItemsCount > 0
                      } else if (activeTile === 'missing_late') {
                        isNightMatch = nightSub.status === 'late' || nightSub.status === 'missing'
                      }
                    }

                    // Tính điểm thật từ dữ liệu nộp
                    const morningTotal = morningSub?.daytimeItems?.length || 36
                    const morningPass = morningSub?.daytimeItems?.length
                      ? morningSub.daytimeItems.filter((i) => i.status === 'pass').length
                      : morningSub ? Math.max(0, morningTotal - morningSub.failedItemsCount) : 0

                    const nightTotal = nightSub?.closingItems?.length || 9
                    const nightPass = nightSub?.closingItems?.length
                      ? nightSub.closingItems.filter((i) => i.status === 'done').length
                      : nightSub ? Math.max(0, nightTotal - nightSub.failedItemsCount) : 0

                    return (
                      <td
                        key={day.dateStr}
                        className={cn(
                          'p-1.5 border-r border-border/30 align-top transition-colors',
                          day.isToday && 'bg-primary/5',
                          isWeekMode ? 'min-w-[150px]' : 'min-w-[75px]'
                        )}
                      >
                        {/* Cell Content: Morning & Night Shift Chips */}
                        <div className="flex flex-col gap-1.5">
                          {/* 1. SÁNG (ĐẦU CA) */}
                          {morningSub ? (
                            <button
                              type="button"
                              onClick={() => onViewDetail(morningSub)}
                              className={cn(
                                'w-full text-left p-1.5 rounded-md border flex items-center justify-between gap-1 transition-all cursor-pointer hover:shadow-xs',
                                morningSub.failedItemsCount === 0
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                                !isMorningMatch && activeTile !== 'all' && 'opacity-15 grayscale hover:opacity-80 hover:grayscale-0',
                                isMorningMatch && activeTile !== 'all' && (activeTile === 'has_issues' ? 'ring-2 ring-rose-500 shadow-sm scale-102 font-bold' : 'ring-2 ring-primary/80 shadow-xs scale-102 font-bold')
                              )}
                              title={`Đầu ca ${day.dateStr}: ${morningSub.failedItemsCount === 0 ? `Đạt chuẩn ${morningPass}/${morningTotal}` : `Có ${morningSub.failedItemsCount} lỗi (${morningPass}/${morningTotal})`}`}
                            >
                              <div className="flex items-center gap-1 min-w-0">
                                {morningSub.failedItemsCount === 0 ? (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-rose-600 shrink-0" />
                                )}
                                <span className="text-[11px] font-semibold truncate">
                                  {isWeekMode ? 'Sáng: ' : 'S: '}
                                  {morningPass}/{morningTotal}
                                </span>
                              </div>
                              {morningSub.status === 'late' && (
                                <span title="Nộp muộn" className="inline-flex">
                                  <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                                </span>
                              )}
                            </button>
                          ) : isFutureDate ? (
                            <div className="text-center py-1 text-[10px] text-muted-foreground/40 font-light">
                              -
                            </div>
                          ) : day.dateStr === '2026-10-29' ? (
                            <button
                              type="button"
                              onClick={() => onSwitchToExecution ? onSwitchToExecution(branch, 'dau_ca') : onOpenSubmitForShift(branch, day.dateStr, 'dau_ca')}
                              className={cn(
                                'w-full p-1 rounded border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-[10px] flex items-center justify-center gap-1 cursor-pointer hover:bg-amber-100/60 transition-colors',
                                !isMorningMatch && activeTile !== 'all' && 'opacity-15'
                              )}
                              title="Chưa hoàn tất đánh giá ca sáng hôm nay - Bấm để tự đánh giá"
                            >
                              <Clock className="h-2.5 w-2.5" />
                              <span>{isWeekMode ? 'Sáng: Chưa đánh giá' : 'S: Chờ'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onOpenSubmitForShift(branch, day.dateStr, 'dau_ca')}
                              className={cn(
                                'w-full p-1 rounded border border-dashed border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-[10px] flex items-center justify-center gap-1 cursor-pointer hover:bg-rose-100/60',
                                !isMorningMatch && activeTile !== 'all' && 'opacity-15'
                              )}
                              title="Chưa nộp ca sáng - Bấm để nộp"
                            >
                              <AlertTriangle className="h-2.5 w-2.5" />
                              <span>{isWeekMode ? 'Sáng: Chưa nộp' : 'Sáng: Thiếu'}</span>
                            </button>
                          )}

                          {/* 2. TỐI (CUỐI CA) */}
                          {nightSub ? (
                            <button
                              type="button"
                              onClick={() => onViewDetail(nightSub)}
                              className={cn(
                                'w-full text-left p-1.5 rounded-md border flex items-center justify-between gap-1 transition-all cursor-pointer hover:shadow-xs',
                                nightSub.failedItemsCount === 0
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                                !isNightMatch && activeTile !== 'all' && 'opacity-15 grayscale hover:opacity-80 hover:grayscale-0',
                                isNightMatch && activeTile !== 'all' && (activeTile === 'has_issues' ? 'ring-2 ring-rose-500 shadow-sm scale-102 font-bold' : 'ring-2 ring-primary/80 shadow-xs scale-102 font-bold')
                              )}
                              title={`Cuối ca ${day.dateStr}: ${nightSub.failedItemsCount === 0 ? `Hoàn tất ${nightPass}/${nightTotal}` : `Có ${nightSub.failedItemsCount} việc chưa xong`}`}
                            >
                              <div className="flex items-center gap-1 min-w-0">
                                {nightSub.failedItemsCount === 0 ? (
                                  <CheckCircle2 className="h-3 w-3 text-indigo-600 shrink-0" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-rose-600 shrink-0" />
                                )}
                                <span className="text-[11px] font-semibold truncate">
                                  {isWeekMode ? 'Tối: ' : 'T: '}
                                  {nightPass}/{nightTotal}
                                </span>
                              </div>
                              {nightSub.status === 'late' && (
                                <span title="Nộp muộn" className="inline-flex">
                                  <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                                </span>
                              )}
                            </button>
                          ) : isTodayNight ? (
                            <button
                              type="button"
                              onClick={() => onSwitchToExecution ? onSwitchToExecution(branch, 'cuoi_ca') : onOpenSubmitForShift(branch, day.dateStr, 'cuoi_ca')}
                              className={cn(
                                'w-full text-center py-1 rounded bg-muted/40 hover:bg-muted/70 text-[10px] text-muted-foreground font-medium cursor-pointer transition-colors',
                                !isNightMatch && activeTile !== 'all' && 'opacity-15'
                              )}
                              title="Chưa đến ca tối - Bấm để vào tự đánh giá ca tối"
                            >
                              {isWeekMode ? 'Tối: Chưa đến ca' : 'T: Chờ ca'}
                            </button>
                          ) : isFutureDate ? (
                            <div className="text-center py-1 text-[10px] text-muted-foreground/40 font-light">
                              -
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onOpenSubmitForShift(branch, day.dateStr, 'cuoi_ca')}
                              className={cn(
                                'w-full p-1 rounded border border-dashed border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 text-[10px] flex items-center justify-center gap-1 cursor-pointer hover:bg-rose-100/60',
                                !isNightMatch && activeTile !== 'all' && 'opacity-15'
                              )}
                              title="Chưa nộp ca tối - Bấm để nộp"
                            >
                              <AlertTriangle className="h-2.5 w-2.5" />
                              <span>{isWeekMode ? 'Tối: Chưa nộp' : 'Tối: Thiếu'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
