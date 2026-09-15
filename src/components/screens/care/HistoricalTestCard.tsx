'use client'

import React from 'react'
import { Calendar, MapPin, ExternalLink, Tablet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CrmLeadAssessmentSchedulePopover } from '@/components/screens/crm-leads/detail/CrmLeadAssessmentSchedulePopover'
import type { HistoricalTestData } from './historicalLearningHelpers'
import type { BookingTest } from '@/mocks/bookingTests'

interface HistoricalTestCardProps {
  testData: HistoricalTestData
  isEnglish?: boolean
  studentName?: string
  onOpenTestDetail?: (booking?: BookingTest) => void
}

export function HistoricalTestCard({
  testData,
  isEnglish = true,
  studentName = 'Học viên',
  onOpenTestDetail,
}: HistoricalTestCardProps) {
  const popoverStudent = {
    id: testData.id,
    name: studentName,
    age: '8 tuổi',
    branch: testData.branch,
    studentPhone: testData.bookingRaw?.phone || '0945456789',
    parentName: testData.bookingRaw?.familyName || `Gia đình ${studentName}`,
    currentProgram: testData.program,
    targetGoal: testData.targetLevel,
    avatar: testData.bookingRaw?.avatar,
    notes: testData.strengths,
    status: 'active',
  }

  const popoverSubject = {
    subjectId: isEnglish ? 'eng' : 'math',
    subjectName: isEnglish ? 'Tiếng Anh' : 'Toán tư duy',
    statusLabel: testData.statusLabel,
    testDate: testData.testDate,
    testTime: testData.testTime,
    testBranch: testData.branch,
    testProgram: testData.program,
    testTargetLevel: testData.targetLevel,
    testLevel: testData.achievedLevel,
    testScore: testData.totalScore,
    testTeacher: testData.teacherName,
    detailReportLink: testData.reportLink,
    ipadTestLink: testData.onlineTestLink,
    testStrengths: testData.strengths,
    testImprovements: testData.improvements,
  }

  return (
    <div className="p-3.5 rounded-xl bg-card border border-sky-200/80 dark:border-sky-900/60 space-y-3 shadow-2xs">
      {/* Header: Lịch đánh giá 1 dòng duy nhất (cơ sở đứng trước trạng thái) */}
      <div className="pb-2.5 border-b border-border/60">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          {/* Trái: Lịch đánh giá: [Ngày giờ test có link mở Popover] */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground font-normal">Lịch đánh giá:</span>
            <CrmLeadAssessmentSchedulePopover
              student={popoverStudent as unknown as import('@/components/screens/crm-leads/detail/CrmLeadChildCard').ChildPersonaItem}
              currentSubject={popoverSubject as unknown as import('@/components/screens/crm-leads/detail/CrmLeadChildCard').StudentSubjectItem}
              isMathSubject={!isEnglish}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 hover:underline cursor-pointer transition-colors"
                title="Nhấp để xem chi tiết lịch đánh giá"
              >
                <Calendar className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                <span>{testData.testDate} • {testData.testTime}</span>
                <ExternalLink className="h-2.5 w-2.5 text-sky-600/80 shrink-0 ml-0.5" />
              </button>
            </CrmLeadAssessmentSchedulePopover>
          </div>

          {/* Phải: Cơ sở (trước) + Trạng thái (sau) */}
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="flex items-center gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="font-semibold text-foreground">
                {testData.branch}
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800">
              {testData.statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Khối Trình độ, Trình độ đạt được & Link kết quả */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Cột: Trình độ */}
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Trình độ
          </span>
          <div
            className="h-6 flex items-center font-semibold text-foreground text-xs truncate"
            title={testData.targetLevel}
          >
            <span className="truncate">{testData.targetLevel}</span>
          </div>
        </div>

        {/* Cột: Trình độ đạt được */}
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Trình độ đạt được
          </span>
          <div className="h-6 flex items-center font-bold text-foreground text-xs">
            <span>{testData.achievedLevel}</span>
          </div>
        </div>

        {/* Cột: Link kết quả (2 link: Phiếu kết quả & Bài làm online) */}
        <div className="space-y-0.5">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Link kết quả
          </span>
          <div className="h-6 flex items-center gap-2 text-xs flex-wrap">
            <button
              type="button"
              onClick={() => onOpenTestDetail?.(testData.bookingRaw)}
              className="text-[11px] text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              title="Xem phiếu kết quả đánh giá chi tiết"
            >
              <span>Phiếu kết quả</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </button>
            <span className="text-muted-foreground/40 text-[10px]">|</span>
            <a
              href={testData.onlineTestLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-sky-600 hover:text-sky-800 dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              title="Xem bài làm trực tuyến từ iPad"
            >
              <Tablet className="h-3 w-3 shrink-0" />
              <span>Bài làm online</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 5 Kỹ năng Đánh giá năng lực */}
      <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground">
            {isEnglish
              ? 'Năng lực 5 kỹ năng (Placement Test Tiếng Anh)'
              : 'Năng lực 5 kỹ năng (Đánh giá Năng lực Toán & Logic)'}
          </span>
          <span className="text-xs font-bold text-foreground">
            Tổng điểm: <span className="text-rose-600 dark:text-rose-400 font-extrabold">{testData.totalScore}</span>
          </span>
        </div>

        {/* 5 thanh kỹ năng */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
          {testData.skills.map((skill) => (
            <div key={skill.label} className="p-1.5 rounded-md bg-card border border-border/60 space-y-1">
              <span className="text-muted-foreground text-[10px] block truncate">{skill.label}</span>
              <div className={cn('font-bold', skill.textClass)}>{skill.score}%</div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn('h-1.5 rounded-full', skill.barClass)}
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Điểm mạnh & Điểm cần cải thiện */}
        <div className="pt-1.5 space-y-1 text-xs border-t border-border/50">
          <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
            <strong className="font-bold">Điểm mạnh:</strong> {testData.strengths}
          </p>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
            <strong className="font-bold">Cần cải thiện:</strong> {testData.improvements}
          </p>
        </div>
      </div>
    </div>
  )
}
