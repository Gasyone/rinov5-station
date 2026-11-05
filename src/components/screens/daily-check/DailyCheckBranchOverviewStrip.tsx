'use client'

import React, { useState, useMemo } from 'react'
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DAILY_BRANCH_OPTIONS,
  type DailyCheckSubmission,
} from '@/mocks/dailyCheck'
import { getWeekDates } from './dailyCheckHelpers'

export interface DailyCheckBranchOverviewStripProps {
  submissions: DailyCheckSubmission[]
  selectedBranch: string
  onSelectBranch: (branch: string) => void
  currentDateStr?: string
  branches?: string[]
}

export function DailyCheckBranchOverviewStrip({
  submissions,
  selectedBranch,
  onSelectBranch,
  currentDateStr = '2026-10-29',
  branches = DAILY_BRANCH_OPTIONS,
}: DailyCheckBranchOverviewStripProps) {
  // Trạng thái Thu gọn / Mở rộng (Mặc định mở để người dùng xem, có thể bấm thu gọn chỉ còn 1 dòng)
  const [isExpanded, setIsExpanded] = useState(true)

  // 7 ngày trong tuần kiểm tra hiện tại (Tuần 26/10 - 01/11/2026)
  const weekDays = useMemo(() => {
    return getWeekDates(currentDateStr)
  }, [currentDateStr])

  // Helper trích xuất kết quả ca sáng & ca tối của 1 cơ sở tại 1 ngày cụ thể
  const getBranchDayShiftScore = (branch: string, dateStr: string) => {
    const isFuture = dateStr > currentDateStr
    const isToday = dateStr === currentDateStr

    if (isFuture) {
      return { isFuture: true }
    }

    const daySub = submissions.find(
      (s) => s.branch === branch && s.shift === 'dau_ca' && s.date === dateStr
    )
    const nightSub = submissions.find(
      (s) => s.branch === branch && s.shift === 'cuoi_ca' && s.date === dateStr
    )

    // Điểm ca sáng
    let dayPassed = 36
    let dayTotal = 36
    let dayHasFail = false
    let dayStatus: 'done' | 'fail' | 'pending' = 'done'

    if (daySub) {
      dayPassed = daySub.daytimeItems.filter((i) => i.status === 'pass').length
      dayTotal = daySub.daytimeItems.length || 36
      dayHasFail = daySub.failedItemsCount > 0
      dayStatus = dayHasFail ? 'fail' : 'done'
    } else {
      // Mock dữ liệu thực tế cho các cơ sở mở rộng
      if (branch.includes('CS6') && dateStr === '2026-10-28') {
        dayPassed = 35
        dayHasFail = true
        dayStatus = 'fail'
      } else if (branch.includes('CS10') && isToday) {
        dayStatus = 'pending'
      } else {
        dayStatus = 'done'
      }
    }

    // Điểm ca tối
    let nightPassed = 9
    let nightTotal = 9
    let nightHasFail = false
    let nightStatus: 'done' | 'fail' | 'pending' = 'done'

    if (isToday) {
      nightStatus = 'pending' // Chưa đến giờ ca tối hôm nay
    } else if (nightSub) {
      nightPassed = nightSub.closingItems.filter((i) => i.status === 'done').length
      nightTotal = nightSub.closingItems.length || 9
      nightHasFail = nightSub.failedItemsCount > 0
      nightStatus = nightHasFail ? 'fail' : 'done'
    } else {
      if (branch.includes('CS5') && dateStr === '2026-10-27') {
        nightPassed = 8
        nightHasFail = true
        nightStatus = 'fail'
      } else {
        nightStatus = 'done'
      }
    }

    return {
      isFuture: false,
      dayPassed,
      dayTotal,
      dayHasFail,
      dayStatus,
      nightPassed,
      nightTotal,
      nightHasFail,
      nightStatus,
    }
  }

  // Thống kê tổng quan hôm nay cho toàn bộ danh sách cơ sở
  const summaryStats = useMemo(() => {
    let perfect = 0
    let hasIssue = 0
    let pending = 0

    branches.forEach((b) => {
      const score = getBranchDayShiftScore(b, currentDateStr)
      if (score.dayHasFail || score.nightHasFail) {
        hasIssue++
      } else if (score.dayStatus === 'pending') {
        pending++
      } else {
        perfect++
      }
    })

    return {
      total: branches.length,
      perfect,
      hasIssue,
      pending,
    }
  }, [branches, currentDateStr])

  return (
    <div className="shrink-0 border border-border/80 rounded-lg bg-card shadow-2xs overflow-hidden transition-all text-left">
      {/* ─── HÀNG HEADER TỔNG QUAN (LUÔN HIỂN THỊ, CLICK ĐỂ THU GỌN / MỞ RỘNG) ─── */}
      <div className="px-3 py-1.5 flex items-center justify-between bg-muted/30 border-b border-border/50 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>Giám sát {branches.length} Cơ sở theo Lịch tuần (26/10 - 01/11/2026)</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground ml-1">
            <span>•</span>
            <span className="text-foreground font-medium">
              Đang xem:{' '}
              <span className="text-primary font-semibold underline underline-offset-2">
                {selectedBranch}
              </span>
            </span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="h-3 w-3" />
              {summaryStats.perfect}/{summaryStats.total} chuẩn 5★
            </span>
            {summaryStats.hasIssue > 0 && (
              <>
                <span>•</span>
                <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-0.5">
                  <AlertTriangle className="h-3 w-3" />
                  {summaryStats.hasIssue} cơ sở có hạng mục chưa đạt
                </span>
              </>
            )}
          </div>
        </div>

        {/* Cạnh phải: Nút Thu gọn / Mở rộng */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground py-0.5 px-2 rounded hover:bg-muted/60 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium border border-border/60 bg-background"
            title={isExpanded ? 'Thu gọn bảng giám sát tuần' : 'Mở rộng xem ma trận tuần của các cơ sở'}
          >
            <span>{isExpanded ? 'Thu gọn' : `Mở rộng (${branches.length} cơ sở)`}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* ─── BẢNG MA TRẬN: MỖI CƠ SỞ 1 DÒNG DUY NHẤT, HIỂN THỊ ĐỦ LỊCH TUẦN ─── */}
      {isExpanded && (
        <div className="max-h-[220px] overflow-auto border-t border-border/60">
          <table className="min-w-[980px] w-full text-left text-xs border-collapse">
            {/* Header Ngày (Cố định sticky top khi cuộn dọc danh sách 30 cơ sở) */}
            <thead className="sticky top-0 bg-muted/95 backdrop-blur-xs z-20 border-b border-border/70 shadow-2xs">
              <tr className="text-[11px] text-muted-foreground font-medium">
                {/* Cột 1: Cơ sở (Cố định cả top lẫn left) */}
                <th className="p-1.5 px-3 text-left sticky left-0 z-30 bg-muted/95 backdrop-blur-xs w-[210px] min-w-[210px] border-r border-border/60 shadow-[inset_-1px_0_0_var(--border)]">
                  Cơ sở / Điểm trường
                </th>

                {/* 7 Cột Ngày trong Tuần */}
                {weekDays.map((d) => (
                  <th
                    key={d.dateStr}
                    className={cn(
                      'p-1.5 px-2 text-center border-r border-border/40 last:border-r-0 whitespace-nowrap min-w-[110px]',
                      d.isToday && 'bg-primary/10 text-primary font-semibold'
                    )}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{d.dayOfWeek}</span>
                      <span className="font-normal opacity-75">
                        ({d.dayOfMonth}/{d.dateStr.split('-')[1]})
                      </span>
                      {d.isToday && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Thân bảng: Mỗi cơ sở là 1 dòng duy nhất (height ~32px) */}
            <tbody className="divide-y divide-border/40 text-[11px]">
              {branches.map((branch) => {
                const isSelected = branch === selectedBranch
                const todayScore = getBranchDayShiftScore(branch, currentDateStr)

                return (
                  <tr
                    key={branch}
                    onClick={() => onSelectBranch(branch)}
                    className={cn(
                      'transition-colors cursor-pointer group h-8',
                      isSelected
                        ? 'bg-primary/10 hover:bg-primary/15 font-medium'
                        : 'hover:bg-muted/40 bg-card'
                    )}
                    title={`Nhấp để xem chi tiết bảng tiêu chuẩn của ${branch}`}
                  >
                    {/* Cột 1: Tên cơ sở (Sticky Left khi cuộn ngang) */}
                    <td
                      className={cn(
                        'p-1 px-3 sticky left-0 z-10 border-r border-border/60 transition-colors shadow-[inset_-1px_0_0_var(--border)] truncate',
                        isSelected
                          ? 'bg-primary/15 text-primary font-semibold'
                          : 'bg-card group-hover:bg-muted/40 text-foreground'
                      )}
                    >
                      <div className="flex items-center justify-between gap-1.5 w-full">
                        <div className="flex items-center gap-1.5 truncate">
                          {/* Đốm màu trạng thái hôm nay */}
                          {todayScore.dayHasFail || todayScore.nightHasFail ? (
                            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" title="Có hạng mục chưa đạt" />
                          ) : todayScore.dayStatus === 'pending' ? (
                            <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" title="Chờ nộp ca" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Đạt tiêu chuẩn 5 sao" />
                          )}

                          <span className="truncate">{branch}</span>
                        </div>

                        {isSelected && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-primary text-primary-foreground font-medium shrink-0 leading-none">
                            Đang xem
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 7 Cột Ngày: Hiển thị gọn ca Sáng & Tối trên cùng 1 dòng */}
                    {weekDays.map((d) => {
                      const score = getBranchDayShiftScore(branch, d.dateStr)

                      if (score.isFuture) {
                        return (
                          <td
                            key={d.dateStr}
                            className="p-1 px-2 text-center text-muted-foreground/30 border-r border-border/40 last:border-r-0 font-light"
                          >
                            —
                          </td>
                        )
                      }

                      return (
                        <td
                          key={d.dateStr}
                          className={cn(
                            'p-1 px-1.5 text-center border-r border-border/40 last:border-r-0 align-middle',
                            d.isToday && (isSelected ? 'bg-primary/10' : 'bg-primary/5')
                          )}
                        >
                          <div className="flex items-center justify-center gap-1 text-[10px]">
                            {/* Ca sáng */}
                            <span
                              className={cn(
                                'px-1 py-0.5 rounded flex items-center gap-0.5 font-normal',
                                score.dayHasFail
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold'
                                  : score.dayStatus === 'pending'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              )}
                              title={`Ca Sáng: ${score.dayPassed}/${score.dayTotal} Đạt`}
                            >
                              <Sun className="h-2.5 w-2.5 shrink-0 text-amber-500" />
                              <span>{score.dayStatus === 'pending' ? 'Chờ' : `${score.dayPassed}`}</span>
                            </span>

                            {/* Ca tối */}
                            <span
                              className={cn(
                                'px-1 py-0.5 rounded flex items-center gap-0.5 font-normal',
                                score.nightHasFail
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold'
                                  : score.nightStatus === 'pending'
                                  ? 'bg-muted text-muted-foreground/60'
                                  : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300'
                              )}
                              title={`Ca Tối: ${score.nightStatus === 'pending' ? 'Chưa đến ca' : `${score.nightPassed}/${score.nightTotal} Đã xong`}`}
                            >
                              <Moon className="h-2.5 w-2.5 shrink-0 text-indigo-400" />
                              <span>{score.nightStatus === 'pending' ? '—' : `${score.nightPassed}`}</span>
                            </span>
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
      )}
    </div>
  )
}
