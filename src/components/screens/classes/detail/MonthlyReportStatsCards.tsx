'use client'

import React from 'react'
import { UserCheck, BookOpen, Award, ExternalLink } from 'lucide-react'
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
  onOpenTestRemark?: () => void
  testRemarkUrl?: string
  showEvaluationLink?: boolean
  className?: string
}

export function MonthlyReportStatsCards({
  currentMonth = 'Tháng 4',
  attendanceRatio = '6/7',
  lateCount = 0,
  homeworkRatio = '6/7',
  homeworkAvg = '7.5',
  testScore = 8.5,
  priorTestScore = 8.0,
  onScrollToEvaluation,
  onOpenEvaluation,
  onOpenTestRemark,
  testRemarkUrl,
  showEvaluationLink = true,
  className,
}: MonthlyReportStatsCardsProps) {
  const handleTestRemarkClick = () => {
    if (onOpenTestRemark) {
      onOpenTestRemark()
    } else if (testRemarkUrl) {
      window.open(testRemarkUrl, '_blank')
    } else if (onScrollToEvaluation) {
      onScrollToEvaluation()
    } else if (onOpenEvaluation) {
      onOpenEvaluation()
    } else {
      const el = document.getElementById('landing-section-a') || document.getElementById('monthly-report-evaluation-section')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className={cn('select-none', className)}>
      {/* 3 Smart Cards: Phong cách tối giản, nền trung tính, giảm in đậm */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {/* 1. Chuyên cần */}
        <div
          className="rounded-lg px-2.5 py-1.5 border border-border/60 bg-muted/25 dark:bg-muted/10 flex flex-col justify-between gap-0.5 min-w-0 text-left select-none shadow-3xs"
          title={`Thông tin chuyên cần ${currentMonth}`}
        >
          <div className="flex items-center justify-between gap-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-normal text-emerald-700 dark:text-emerald-400 leading-none">
                {attendanceRatio}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-normal truncate leading-tight ml-auto text-right">
              Muộn: {lateCount}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-normal truncate">
            Chuyên cần
          </span>
        </div>

        {/* 2. BTVN */}
        <div
          className="rounded-lg px-2.5 py-1.5 border border-border/60 bg-muted/25 dark:bg-muted/10 flex flex-col justify-between gap-0.5 min-w-0 text-left select-none shadow-3xs"
          title="Thông tin bài tập về nhà"
        >
          <div className="flex items-center justify-between gap-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <BookOpen className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span className="text-xs sm:text-sm font-normal text-sky-700 dark:text-sky-400 leading-none">
                {homeworkRatio}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-normal truncate leading-tight ml-auto text-right">
              Trung bình: {homeworkAvg}
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-normal truncate">
            BTVN
          </span>
        </div>

        {/* 3. Điểm kiểm tra */}
        <div
          className="rounded-lg px-2.5 py-1.5 border border-border/60 bg-muted/25 dark:bg-muted/10 flex flex-col justify-between gap-0.5 min-w-0 text-left select-none shadow-3xs"
          title="Điểm kiểm tra"
        >
          <div className="flex items-center justify-between gap-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Award className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
              <span className="text-xs sm:text-sm font-normal text-violet-700 dark:text-violet-400 leading-none">
                {testScore !== null && testScore !== undefined ? (typeof testScore === 'number' ? testScore.toFixed(1) : testScore) : '—'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-normal truncate leading-tight ml-auto text-right">
              Trước:{' '}
              {priorTestScore !== null && priorTestScore !== undefined
                ? (typeof priorTestScore === 'number' ? priorTestScore.toFixed(1) : priorTestScore)
                : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-1 min-w-0">
            <span className="text-xs text-muted-foreground font-normal truncate">
              Điểm kiểm tra
            </span>
            {showEvaluationLink && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleTestRemarkClick()
                }}
                className="inline-flex items-center gap-0.5 text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors ml-auto shrink-0 font-normal"
                title="Mở nhận xét bài kiểm tra gần nhất trong tab mới"
              >
                <span>Nhận xét</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
