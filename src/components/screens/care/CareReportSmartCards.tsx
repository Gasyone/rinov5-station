'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { type SessionHistory } from './StudentCareReportTab'

import { UserCheck, BookOpen, Award, ExternalLink } from 'lucide-react'

interface CareReportSmartCardsProps {
  pkg: SimulatedPackage
  regularSessions?: SessionHistory[]
  testSessions?: SessionHistory[]
  pkgIsEnglish?: boolean
  avgRating?: number
  generalComment?: string
  onOpenAttendance?: () => void
  onOpenHomework?: () => void
  onOpenTests?: () => void
  onOpenEvaluation?: () => void
}

export function CareReportSmartCards({
  pkg,
  regularSessions = [],
  onOpenTests,
  onOpenEvaluation,
}: CareReportSmartCardsProps) {
  // Định dạng chuyên cần luôn luôn là phân số x/x (VD: 6/7, 3/4, 0/0)
  const attendanceDisplay = React.useMemo(() => {
    const raw = pkg.attendanceRatio || ''
    if (raw.includes('/')) return raw
    if (raw.includes('%')) {
      const pct = parseFloat(raw) || 0
      const total = (regularSessions && regularSessions.length > 0) ? regularSessions.length : 7
      const attended = Math.round(total * (pct / 100))
      return `${attended}/${total}`
    }
    if (regularSessions && regularSessions.length > 0) {
      const attended = regularSessions.filter((s) => s.attendance === 'present' || s.attendance === 'late').length
      return `${attended}/${regularSessions.length}`
    }
    return '6/7'
  }, [pkg.attendanceRatio, regularSessions])

  return (
    <div className="grid grid-cols-3 gap-1.5 py-0.5 select-none">
      {/* Card 1: Chuyên cần — Màu Xanh lá (Emerald) + In đậm */}
      <div
        className={cn(
          "rounded-lg px-2.5 py-1.5 border flex flex-col justify-between gap-0.5 min-w-0 text-left bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-200/80 dark:border-emerald-800/60 select-none"
        )}
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 leading-none">
              {attendanceDisplay}
            </span>
          </div>
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 truncate leading-tight ml-auto text-right">
            Muộn: 1
          </span>
        </div>
        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 truncate">
          Chuyên cần
        </span>
      </div>

      {/* Card 2: BTVN — Màu Xanh dương (Sky) + In đậm */}
      <div
        className={cn(
          "rounded-lg px-2.5 py-1.5 border flex flex-col justify-between gap-0.5 min-w-0 text-left bg-sky-50/50 dark:bg-sky-950/25 border-sky-200/80 dark:border-sky-800/60 select-none"
        )}
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <BookOpen className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-sky-700 dark:text-sky-400 leading-none">
              {Math.round(7 * (pkg.homeworkCompletion / 100))}/7
            </span>
          </div>
          <span className="text-xs font-semibold text-sky-700/90 dark:text-sky-300/90 truncate leading-tight ml-auto text-right">
            Trung bình: 7.5
          </span>
        </div>
        <span className="text-xs font-semibold text-sky-800 dark:text-sky-300 truncate">
          BTVN
        </span>
      </div>

      {/* Card 3: Kiểm tra / Điểm — Màu Tím (Violet) + In đậm */}
      <div
        className={cn(
          "rounded-lg px-2.5 py-1.5 border flex flex-col justify-between gap-0.5 min-w-0 text-left bg-violet-50/50 dark:bg-violet-950/25 border-violet-200/80 dark:border-violet-800/60 select-none"
        )}
      >
        <div className="flex items-center justify-between gap-1 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <Award className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-violet-700 dark:text-violet-400 leading-none">
              {pkg.lastTestScore.toFixed(1)}
            </span>
          </div>
          <span className="text-xs font-semibold text-violet-700/80 dark:text-violet-300/80 truncate leading-tight ml-auto text-right">
            Trước: {pkg.priorTestScore ? pkg.priorTestScore.toFixed(1) : '—'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 min-w-0">
          <span className="text-xs font-semibold text-violet-800 dark:text-violet-300 truncate">
            Điểm kiểm tra
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (onOpenTests) {
                onOpenTests()
              } else if (onOpenEvaluation) {
                onOpenEvaluation()
              } else if (typeof window !== 'undefined') {
                window.open('/app/classes', '_blank')
              }
            }}
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer transition-colors ml-auto shrink-0"
            title="Mở nhận xét bài kiểm tra gần nhất trong tab mới"
          >
            <span>Nhận xét</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
