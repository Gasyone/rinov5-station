'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { type SessionHistory } from './StudentCareReportTab'

interface CareReportSmartCardsProps {
  pkg: SimulatedPackage
  regularSessions: SessionHistory[]
  testSessions: SessionHistory[]
  pkgIsEnglish: boolean
  avgRating: number
  generalComment: string
  onOpenAttendance: () => void
  onOpenHomework: () => void
  onOpenTests: () => void
  onOpenEvaluation: () => void
}

export function CareReportSmartCards({
  pkg,
  onOpenAttendance,
  onOpenHomework,
  onOpenTests,
  onOpenEvaluation
}: CareReportSmartCardsProps) {
  const completedSessions = Math.max(0, pkg.totalSessions - pkg.remainingSessions)
  const remainingPercent = pkg.totalSessions > 0 ? Math.round((pkg.remainingSessions / pkg.totalSessions) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 py-1 select-none">
      {/* Card 1: Chuyên cần — Click to open modal */}
      <div
        onClick={onOpenAttendance}
        className={cn(
          "rounded-xl px-3.5 py-2.5 border flex items-center justify-between gap-3 min-w-0 text-left bg-card dark:bg-zinc-900 border border-border/80 shadow-3xs cursor-pointer hover:bg-muted/30 transition-all select-none"
        )}
      >
        <div className="min-w-0 flex flex-col justify-center">
          <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Chuyên cần
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed truncate">
            Muộn: 1 buổi
          </span>
        </div>
        <div className="flex flex-col items-end justify-center shrink-0 pl-2">
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 leading-none">{pkg.attendanceRatio}</span>
          <span className="text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400/80 mt-1 leading-none">57%</span>
        </div>
      </div>

      {/* Card 2: BTVN — Click to open modal */}
      <div
        onClick={onOpenHomework}
        className={cn(
          "rounded-xl px-3.5 py-2.5 border flex items-center justify-between gap-3 min-w-0 text-left bg-card dark:bg-zinc-900 border border-border/80 shadow-3xs cursor-pointer hover:bg-muted/30 transition-all select-none"
        )}
      >
        <div className="min-w-0 flex flex-col justify-center">
          <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            BTVN
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed truncate">
            Điểm TB: 7.5 &bull; Thiếu: 3 bài
          </span>
        </div>
        <div className="flex flex-col items-end justify-center shrink-0 pl-2">
          <span className="text-base font-bold text-sky-600 dark:text-sky-400 leading-none">
            {Math.round(7 * (pkg.homeworkCompletion / 100))}/7
          </span>
          <span className="text-[10px] font-medium text-sky-600/80 dark:text-sky-400/80 mt-1 leading-none">{pkg.homeworkCompletion}%</span>
        </div>
      </div>

      {/* Card 3: Kiểm tra — Click to open modal */}
      <div
        onClick={onOpenTests}
        className={cn(
          "rounded-xl px-3.5 py-2.5 border flex items-center justify-between gap-3 min-w-0 text-left bg-card dark:bg-zinc-900 border border-border/80 shadow-3xs cursor-pointer hover:bg-muted/30 transition-all select-none"
        )}
      >
        <div className="min-w-0 flex flex-col justify-center">
          <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Kiểm tra
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed truncate">
            Tiến bộ: {pkg.priorTestScore ? (pkg.lastTestScore >= pkg.priorTestScore ? '▲' : '▼') + Math.abs(pkg.lastTestScore - pkg.priorTestScore).toFixed(1) : '0.0'}
          </span>
        </div>
        <div className="flex flex-col items-end justify-center shrink-0 pl-2">
          <span className="text-base font-bold text-amber-600 dark:text-amber-400 leading-none">{pkg.lastTestScore.toFixed(1)}</span>
          <span className="text-[10px] font-medium text-muted-foreground mt-1 leading-none">
            Trước: {pkg.priorTestScore ? pkg.priorTestScore.toFixed(1) : '—'}
          </span>
        </div>
      </div>

      {/* Card 4: Buổi học — Click to open modal */}
      <div
        onClick={onOpenEvaluation}
        className={cn("rounded-xl px-3.5 py-2.5 border flex items-center justify-between gap-3 min-w-0 text-left bg-card dark:bg-zinc-900 border border-border/80 shadow-3xs cursor-pointer hover:bg-muted/30 transition-all select-none")}
      >
        <div className="min-w-0 flex flex-col justify-center">
          <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
            Buổi học
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed truncate block">
            Đã học {completedSessions} buổi
          </span>
        </div>
        <div className="flex flex-col items-end justify-center shrink-0 pl-2">
          <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 leading-none">{pkg.remainingSessions}/{pkg.totalSessions}</span>
          <span className="text-[10px] font-medium text-indigo-600/80 dark:text-indigo-400/80 mt-1 leading-none">Còn {remainingPercent}%</span>
        </div>
      </div>
    </div>
  )
}
