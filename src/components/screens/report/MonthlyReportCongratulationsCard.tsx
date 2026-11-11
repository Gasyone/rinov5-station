'use client'

import React from 'react'
import { CourseDisplayOption } from './MonthlyReportLandingScreen'

interface MonthlyReportCongratulationsCardProps {
  studentName: string
  currentCourse: CourseDisplayOption
}

export function MonthlyReportCongratulationsCard({
  studentName,
  currentCourse,
}: MonthlyReportCongratulationsCardProps) {
  return (
    <div className="rounded-xl sm:rounded-2xl border border-amber-300 bg-white p-4 sm:p-5 box-shadow-report">
      <p className="text-sm sm:text-[15px] leading-relaxed text-slate-900 font-normal">
        <span>RinoEdu chúc mừng con </span>
        <strong className="font-bold text-slate-900">{studentName}</strong>
        <span> đã hoàn thành tốt kỳ học vừa qua tại môn </span>
        <strong className="font-bold text-slate-900">{currentCourse.subject}</strong>
        <span> ({currentCourse.roadmap})! Dưới đây là phần đánh giá năng lực chi tiết và định hướng rèn luyện của kỳ học này.</span>
      </p>
    </div>
  )
}
