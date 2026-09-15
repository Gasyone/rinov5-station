'use client'

import React from 'react'
import { MessageSquareText, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MonthlyReportStatsCardsProps {
  currentMonth?: string
  attendanceRatio?: string
  lateCount?: number
  homeworkRatio?: string
  homeworkAvg?: string
  testScore?: number | null
  priorTestScore?: number | null
  onScrollToEvaluation?: () => void
  onOpenEvaluation?: () => void
  className?: string
}

export function MonthlyReportStatsCards({
  currentMonth = 'Tháng 4',
  attendanceRatio = '5/7',
  lateCount = 1,
  homeworkRatio = '7/7',
  homeworkAvg = '7.5',
  testScore = 8.0,
  priorTestScore = 5.5,
  onScrollToEvaluation,
  onOpenEvaluation,
  className,
}: MonthlyReportStatsCardsProps) {
  const handleEvaluationClick = () => {
    if (onScrollToEvaluation) onScrollToEvaluation()
    else if (onOpenEvaluation) onOpenEvaluation()
  }

  return (
    <div className={cn('select-none', className)}>
      {/* 3 Smart Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* 1. CHUYÊN CẦN */}
        <div
          className="rounded-2xl px-3 py-2.5 border flex flex-col justify-between gap-1 min-w-0 text-left bg-card dark:bg-zinc-900 border-border/80 shadow-3xs"
          title="Thông tin chuyên cần"
        >
          <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
            CHUYÊN CẦN
          </span>
          <div className="flex items-baseline justify-between gap-1 min-w-0">
            <span className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 leading-none shrink-0">
              {attendanceRatio}
            </span>
            <span className="text-xs font-normal text-amber-600 dark:text-amber-400 truncate leading-tight ml-auto text-right">
              Muộn: {lateCount}
            </span>
          </div>
        </div>

        {/* 2. BTVN */}
        <div
          className="rounded-2xl px-3 py-2.5 border flex flex-col justify-between gap-1 min-w-0 text-left bg-card dark:bg-zinc-900 border-border/80 shadow-3xs"
          title="Thông tin bài tập về nhà"
        >
          <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
            BTVN
          </span>
          <div className="flex items-baseline justify-between gap-1 min-w-0">
            <span className="text-sm sm:text-base font-bold text-sky-600 dark:text-sky-400 leading-none shrink-0">
              {homeworkRatio}
            </span>
            <span className="text-xs text-muted-foreground truncate leading-tight ml-auto text-right">
              Trung bình: {homeworkAvg}
            </span>
          </div>
        </div>

        {/* 3. KIỂM TRA */}
        <div
          className="rounded-2xl px-3 py-2.5 border flex flex-col justify-between gap-1 min-w-0 text-left bg-card dark:bg-zinc-900 border-border/80 shadow-3xs"
          title="Điểm kiểm tra"
        >
          {/* Cạnh phải dòng Kiểm tra là Nhận xét */}
          <div className="flex items-center justify-between gap-1 min-w-0">
            <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
              KIỂM TRA
            </span>
            {(onScrollToEvaluation || onOpenEvaluation) && (
              <button
                type="button"
                onClick={handleEvaluationClick}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer transition-colors"
                title="Xem nhận xét đánh giá"
              >
                <MessageSquareText className="h-3 w-3" />
                <span>Nhận xét</span>
              </button>
            )}
          </div>
          <div className="flex items-baseline justify-between gap-1 min-w-0">
            <span className="text-sm sm:text-base font-bold text-amber-600 dark:text-amber-400 leading-none shrink-0">
              {testScore !== null && testScore !== undefined ? testScore.toFixed(1) : '—'}
            </span>
            <span className="text-xs text-muted-foreground truncate leading-tight ml-auto text-right">
              {priorTestScore !== null && priorTestScore !== undefined
                ? `Trước: ${priorTestScore.toFixed(1)}`
                : 'Trước: —'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
