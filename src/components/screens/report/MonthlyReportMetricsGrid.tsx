'use client'

import React from 'react'
import { UserCheck, BookOpen, Award, ExternalLink } from 'lucide-react'

export interface StudentMetricsData {
  attendanceRatio: string
  lateCount: number
  homeworkRatio: string
  homeworkAvg: string
  testScore: number
  priorTestScore: number
}

interface MonthlyReportMetricsGridProps {
  metrics: StudentMetricsData
  onScrollToEvaluation?: () => void
}

export function MonthlyReportMetricsGrid({
  metrics,
  onScrollToEvaluation,
}: MonthlyReportMetricsGridProps) {
  const handleScrollToEvaluation = () => {
    if (onScrollToEvaluation) {
      onScrollToEvaluation()
    } else {
      const el = document.getElementById('landing-section-a')
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
      {/* Card 1: Chuyên cần */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report p-3 sm:p-3.5 border border-emerald-100 flex flex-col justify-between gap-2 transition-all hover:border-emerald-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-lg sm:text-xl font-bold text-emerald-700 leading-none">
                {metrics.attendanceRatio}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1">buổi</span>
            </div>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            Muộn: {metrics.lateCount}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-800 text-[12px]">
            Chuyên cần
          </span>
        </div>
      </div>

      {/* Card 2: BTVN */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report p-3 sm:p-3.5 border border-sky-100 flex flex-col justify-between gap-2 transition-all hover:border-sky-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sky-600 shrink-0" />
            <div>
              <span className="text-lg sm:text-xl font-bold text-sky-700 leading-none">
                {metrics.homeworkRatio}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1">bài</span>
            </div>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-sky-50 text-sky-700">
            Điểm TB: {metrics.homeworkAvg}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-sky-800 text-[12px]">
            Bài tập về nhà
          </span>
        </div>
      </div>

      {/* Card 3: Điểm kiểm tra */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report p-3 sm:p-3.5 border border-purple-100 flex flex-col justify-between gap-2 transition-all hover:border-purple-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600 shrink-0" />
            <div>
              <span className="text-lg sm:text-xl font-bold text-purple-700 leading-none">
                {metrics.testScore}
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1">/ 10</span>
            </div>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
            Kỳ trước: {metrics.priorTestScore}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-purple-800 text-[12px]">
            Điểm kiểm tra
          </span>
          <button
            type="button"
            onClick={handleScrollToEvaluation}
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer transition-colors"
            title="Xem chi tiết nhận xét đánh giá"
          >
            <span>Nhận xét</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
