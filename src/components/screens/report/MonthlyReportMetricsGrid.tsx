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
      {/* Card 1: Chuyên cần (Mobile: chip đẩy xuống dòng riêng; Desktop: 2 dòng gọn gàng) */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report p-2.5 sm:px-3 sm:py-2.5 border border-emerald-100 flex flex-col justify-between gap-1 sm:gap-1.5 transition-all hover:border-emerald-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-1.5">
          {/* Dòng 1: Chỉ số chính */}
          <div className="flex items-center gap-1.5 shrink-0">
            <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
            <div className="leading-tight flex items-baseline shrink-0 whitespace-nowrap">
              <span className="text-[15px] sm:text-base md:text-lg font-bold text-emerald-700 leading-none">
                {metrics.attendanceRatio}
              </span>
              <span className="text-[11.5px] sm:text-xs text-slate-500 font-medium ml-0.5">buổi</span>
            </div>
          </div>
          {/* Chip chỉ số phụ: Mobile đẩy xuống dòng riêng, Desktop nằm cùng hàng bên phải */}
          <span className="w-fit text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0 whitespace-nowrap">
            Muộn: {metrics.lateCount}
          </span>
        </div>
        {/* Nhãn tên thẻ */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-emerald-800 text-[13px] sm:text-[14px] truncate">
            Chuyên cần
          </span>
        </div>
      </div>

      {/* Card 2: BTVN (Mobile: chip đẩy xuống dòng riêng; Desktop: 2 dòng gọn gàng) */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report p-2.5 sm:px-3 sm:py-2.5 border border-sky-100 flex flex-col justify-between gap-1 sm:gap-1.5 transition-all hover:border-sky-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-1.5">
          {/* Dòng 1: Chỉ số chính */}
          <div className="flex items-center gap-1.5 shrink-0">
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600 shrink-0" />
            <div className="leading-tight flex items-baseline shrink-0 whitespace-nowrap">
              <span className="text-[15px] sm:text-base md:text-lg font-bold text-sky-700 leading-none">
                {metrics.homeworkRatio}
              </span>
              <span className="text-[11.5px] sm:text-xs text-slate-500 font-medium ml-0.5">bài</span>
            </div>
          </div>
          {/* Chip chỉ số phụ: Mobile đẩy xuống dòng riêng, Desktop nằm cùng hàng bên phải */}
          <span className="w-fit text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-sky-50 text-sky-700 shrink-0 whitespace-nowrap">
            ĐTB: {metrics.homeworkAvg}
          </span>
        </div>
        {/* Nhãn tên thẻ */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sky-800 text-[13px] sm:text-[14px] truncate">
            Bài tập về nhà
          </span>
        </div>
      </div>

      {/* Card 3: Điểm kiểm tra (Mobile: chip đẩy xuống dòng riêng; Desktop: 2 dòng gọn gàng) */}
      <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report p-2.5 sm:px-3 sm:py-2.5 border border-purple-100 flex flex-col justify-between gap-1 sm:gap-1.5 transition-all hover:border-purple-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-1.5">
          {/* Dòng 1: Chỉ số chính */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 shrink-0" />
            <div className="leading-tight flex items-baseline shrink-0 whitespace-nowrap">
              <span className="text-[15px] sm:text-base md:text-lg font-bold text-purple-700 leading-none">
                {metrics.testScore}
              </span>
              <span className="text-[11.5px] sm:text-xs text-slate-500 font-medium ml-0.5">/10</span>
            </div>
          </div>
          {/* Chip chỉ số phụ: Mobile đẩy xuống dòng riêng, Desktop nằm cùng hàng bên phải */}
          <span className="w-fit text-[11px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded bg-purple-50 text-purple-700 shrink-0 whitespace-nowrap">
            Trước: {metrics.priorTestScore}
          </span>
        </div>
        {/* Nhãn tên thẻ */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-purple-800 text-[13px] sm:text-[14px] truncate">
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
