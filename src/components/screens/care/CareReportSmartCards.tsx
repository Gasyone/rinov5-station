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
  onOpenEvaluation?: () => void
}

export function CareReportSmartCards({
  pkg,
  onOpenAttendance,
  onOpenHomework,
  onOpenTests,
}: CareReportSmartCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 py-0.5 select-none">
      {/* Card 1: Chuyên cần — Click to open modal */}
      <div
        onClick={onOpenAttendance}
        className={cn(
          "rounded-xl px-2.5 py-2 border flex flex-col justify-between gap-1 min-w-0 text-left bg-card dark:bg-zinc-900 border-border/70 shadow-3xs cursor-pointer hover:bg-muted/30 transition-all select-none"
        )}
      >
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
          Chuyên cần
        </span>
        <div className="flex items-baseline justify-between gap-1 min-w-0">
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 leading-none shrink-0">
            {pkg.attendanceRatio}
          </span>
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400 truncate leading-tight ml-auto text-right">
            Muộn: 1 buổi
          </span>
        </div>
      </div>

      {/* Card 2: BTVN — Click to open modal */}
      <div
        onClick={onOpenHomework}
        className={cn(
          "rounded-xl px-2.5 py-2 border flex flex-col justify-between gap-1 min-w-0 text-left bg-card dark:bg-zinc-900 border-border/70 shadow-3xs cursor-pointer hover:bg-muted/30 transition-all select-none"
        )}
      >
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
          BTVN
        </span>
        <div className="flex items-baseline justify-between gap-1 min-w-0">
          <span className="text-sm font-bold text-sky-600 dark:text-sky-400 leading-none shrink-0">
            {Math.round(7 * (pkg.homeworkCompletion / 100))}/7
          </span>
          <span className="text-xs text-muted-foreground truncate leading-tight ml-auto text-right">
            Điểm TB: 7.5
          </span>
        </div>
      </div>

      {/* Card 3: Kiểm tra — Click to open modal */}
      <div
        onClick={onOpenTests}
        className={cn(
          "rounded-xl px-2.5 py-2 border flex flex-col justify-between gap-1 min-w-0 text-left bg-card dark:bg-zinc-900 border-border/70 shadow-3xs cursor-pointer hover:bg-muted/30 transition-all select-none"
        )}
      >
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
          Kiểm tra
        </span>
        <div className="flex items-baseline justify-between gap-1 min-w-0">
          <span className="text-sm font-bold text-amber-600 dark:text-amber-400 leading-none shrink-0">
            {pkg.lastTestScore.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground truncate leading-tight ml-auto text-right">
            Trước: {pkg.priorTestScore ? pkg.priorTestScore.toFixed(1) : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
