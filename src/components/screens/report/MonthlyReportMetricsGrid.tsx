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
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
      {/* Card 1: Chuyên cần (Gọn gàng đúng 2 dòng, typography chuẩn mobile) */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report px-2.5 py-2 sm:p-3 sm:py-2.5 border border-emerald-100 flex flex-col justify-between gap-1 transition-all hover:border-emerald-300">
        {/* Dòng 1: Chỉ số chính + Chip chỉ số phụ */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <UserCheck className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-emerald-600 shrink-0" />
            <div className="leading-tight flex items-baseline">
              <span className="text-sm sm:text-base md:text-lg font-bold text-emerald-700 leading-none">
                {metrics.attendanceRatio}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium ml-0.5">buổi</span>
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
            Muộn: {metrics.lateCount}
          </span>
        </div>
        {/* Dòng 2: Nhãn tên thẻ */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-emerald-800 text-xs sm:text-[13px] truncate">
            Chuyên cần
          </span>
        </div>
      </div>

      {/* Card 2: BTVN (Gọn gàng đúng 2 dòng, typography chuẩn mobile) */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report px-2.5 py-2 sm:p-3 sm:py-2.5 border border-sky-100 flex flex-col justify-between gap-1 transition-all hover:border-sky-300">
        {/* Dòng 1: Chỉ số chính + Chip chỉ số phụ */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <BookOpen className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-sky-600 shrink-0" />
            <div className="leading-tight flex items-baseline">
              <span className="text-sm sm:text-base md:text-lg font-bold text-sky-700 leading-none">
                {metrics.homeworkRatio}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium ml-0.5">bài</span>
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 shrink-0">
            ĐTB: {metrics.homeworkAvg}
          </span>
        </div>
        {/* Dòng 2: Nhãn tên thẻ */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sky-800 text-xs sm:text-[13px] truncate">
            Bài tập về nhà
          </span>
        </div>
      </div>

      {/* Card 3: Điểm kiểm tra (Gọn gàng đúng 2 dòng, typography chuẩn mobile) */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report px-2.5 py-2 sm:p-3 sm:py-2.5 border border-purple-100 flex flex-col justify-between gap-1 transition-all hover:border-purple-300">
        {/* Dòng 1: Chỉ số chính + Chip chỉ số phụ */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
            <Award className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-purple-600 shrink-0" />
            <div className="leading-tight flex items-baseline">
              <span className="text-sm sm:text-base md:text-lg font-bold text-purple-700 leading-none">
                {metrics.testScore}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium ml-0.5">/10</span>
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 shrink-0">
            Trước: {metrics.priorTestScore}
          </span>
        </div>
        {/* Dòng 2: Nhãn tên thẻ */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-purple-800 text-xs sm:text-[13px] truncate">
            Điểm thi
          </span>
          <button
            type="button"
            onClick={handleScrollToEvaluation}
            className="hidden sm:inline-flex items-center gap-0.5 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer transition-colors"
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
