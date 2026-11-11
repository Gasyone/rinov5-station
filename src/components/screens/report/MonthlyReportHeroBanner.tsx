'use client'

import React from 'react'
import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { normalizeAwardBadge } from '../classes/detail/monthlyReportHelpers'
import { CourseDisplayOption } from './MonthlyReportLandingScreen'

interface MonthlyReportHeroBannerProps {
  studentName: string
  awardBadge?: string
  dateStr: string
  currentCourse: CourseDisplayOption
  teacherName?: string
}

export function MonthlyReportHeroBanner({
  studentName,
  awardBadge,
  dateStr,
  currentCourse,
  teacherName,
}: MonthlyReportHeroBannerProps) {
  return (
    <div
      className="report-results-page font-sans w-full relative px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-14 sm:pb-16 text-white"
      style={{
        background: 'linear-gradient(122deg, #ea2d2d 49.71%, #f98a3a 110.68%)',
      }}
    >
      {/* ── Logo RinoEdu đặt ở sát cạnh trái màn hình theo đúng chuẩn nhận diện ── */}
      <div className="flex items-center justify-start sm:absolute sm:top-5 sm:left-6 lg:left-8 mb-3 sm:mb-0 z-20">
        <Image
          src="/rinoedu-landing-logo.png"
          alt="Rino Edu"
          width={120}
          height={30}
          className="h-6 sm:h-7 lg:h-8 w-auto object-contain brightness-0 invert"
          priority
        />
      </div>

      {/* ── Nội dung chính căn giữa màn hình với độ tương phản cao, rõ nét ── */}
      <div className="max-w-3xl mx-auto text-center space-y-2 relative">
        <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
          Báo cáo học tập định kỳ
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
          {studentName}
        </h1>

        {/* Trình độ Pill & Award Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-slate-900 text-xs sm:text-sm font-bold shadow-sm">
            <Image
              src="/target-demo.svg"
              alt="Trình độ"
              width={18}
              height={18}
              className="w-4 h-4 object-contain"
            />
            <span>
              Trình độ:{' '}
              <strong className="text-slate-900 font-extrabold">{currentCourse.subject}</strong> •{' '}
              {currentCourse.roadmap} ({currentCourse.level})
            </span>
          </div>

          {awardBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm rounded-full shadow-sm border border-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-900 shrink-0" />
              <span>{normalizeAwardBadge(awardBadge)}</span>
            </div>
          )}
        </div>

        {/* Thông tin Kỳ báo cáo & Giáo viên rõ ràng, độ tương phản sắc nét */}
        <p className="text-xs sm:text-sm text-white font-medium pt-1">
          Kỳ báo cáo:{' '}
          <span className="font-bold text-white">
            {dateStr}
          </span>
          <span className="mx-2 opacity-60">•</span>
          Giáo viên phụ trách:{' '}
          <span className="font-bold text-white">
            {teacherName || currentCourse.teacherName || 'Ms.Chloe'}
          </span>
        </p>
      </div>
    </div>
  )
}
