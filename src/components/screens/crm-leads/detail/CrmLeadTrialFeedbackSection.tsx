'use client'

import React, { useState, useMemo } from 'react'
import {
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import { getTrialClasses, type TrialClass } from '@/mocks/trialClasses'
import { getTrialStatusLabel, formatSessionDateTimeRange } from '@/components/screens/trial-class/trialClassHelpers'
import { TrialClassDetailDialog } from '@/components/screens/trial-class/TrialClassDetailDialog'
import type { StudentSubjectItem } from './CrmLeadChildCard'

export interface CrmLeadTrialFeedbackSectionProps {
  currentSubject: StudentSubjectItem
  studentNotes?: string
  studentName?: string
}

export function CrmLeadTrialFeedbackSection({
  currentSubject,
  studentNotes,
  studentName,
}: CrmLeadTrialFeedbackSectionProps) {
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Tìm kiếm phiếu học thử tương ứng trong mockTrialClasses
  const matchingTrial = useMemo<TrialClass | null>(() => {
    const allTrials = getTrialClasses()
    if (currentSubject.trialTicketId) {
      const byId = allTrials.find((t) => t.id === currentSubject.trialTicketId)
      if (byId) return byId
    }
    if (currentSubject.trialReportLink) {
      const match = currentSubject.trialReportLink.match(/TR-[\w-]+/)
      if (match) {
        const byMatch = allTrials.find((t) => t.id === match[0])
        if (byMatch) return byMatch
      }
    }
    if (studentName) {
      const byName = allTrials.find(
        (t) => t.studentName.trim().toLowerCase() === studentName.trim().toLowerCase()
      )
      if (byName) return byName
    }
    return allTrials.find((t) => t.id === 'TR-2605-001') ?? null
  }, [currentSubject.trialTicketId, currentSubject.trialReportLink, studentName])

  // Trích xuất các thông tin lịch lớp học thử theo chuẩn /app/trial_class
  const ticketStatus = (matchingTrial?.status || currentSubject.trialStatus || 'pending_approval') as import('@/mocks/trialClasses').TrialClassStatus
  const ticketStatusLabel = currentSubject.trialStatusLabel || (matchingTrial ? getTrialStatusLabel(matchingTrial.status) : 'Chờ xác nhận')
  
  const className = currentSubject.trialClassName || matchingTrial?.sessions?.[0]?.className || 'Cambridge Starter A1'
  const dateTime = currentSubject.trialDate
    ? `${currentSubject.trialDate}${currentSubject.trialTime ? ` · ${currentSubject.trialTime}` : ''}`
    : matchingTrial?.sessions?.[0]?.trialDate
      ? formatSessionDateTimeRange(matchingTrial.sessions[0].trialDate)
      : 'T4 20/05 · 18:00 - 19:30'

  const branch = currentSubject.trialBranch || matchingTrial?.school || matchingTrial?.branch || 'RinoEdu Nguyễn Tuân'
  const teacher = currentSubject.trialTeacher || 'Bùi Phương Anh'

  return (
    <>
      <div className="p-3 rounded-lg bg-card border border-emerald-200/80 dark:border-emerald-900/60 space-y-3 shadow-2xs">
        {/* ============================================================ */}
        {/* HEADER: THÔNG TIN LỊCH HỌC THỬ TINH GỌN (CHỈ LẤY THÔNG TIN CHÍNH) */}
        {/* ============================================================ */}
        <div className="space-y-2 pb-2.5 border-b border-border/60">
          {/* Dòng 1: Lịch học thử: [Ngày giờ] | [Trạng thái] */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-muted-foreground font-normal">Lịch học thử:</span>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:underline cursor-pointer transition-colors"
                title="Bấm để xem chi tiết phiếu học thử"
              >
                <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>{dateTime}</span>
                <ExternalLink className="h-2.5 w-2.5 text-emerald-600/80 shrink-0 ml-0.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={ticketStatus} label={ticketStatusLabel} />
            </div>
          </div>

          {/* Dòng 2: Thông tin chính: Tên lớp (trái) | Tên cơ sở (cạnh phải) */}
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
              <span className="font-semibold text-foreground">{className}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="font-semibold text-foreground">{branch}</span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PHẦN NHẬN XÉT CỦA GIÁO VIÊN                                  */}
        {/* ============================================================ */}
        <div className="space-y-2.5">
          {/* Tiêu đề mục nhận xét & Nút Thu gọn / Mở rộng ở cạnh phải cùng dòng */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Nhận xét của giáo viên</span>
            </div>

            <button
              type="button"
              onClick={() => setIsFeedbackExpanded(!isFeedbackExpanded)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title={isFeedbackExpanded ? 'Thu gọn nhận xét' : 'Mở rộng nhận xét'}
            >
              <span>{isFeedbackExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              {isFeedbackExpanded ? (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Khối Đánh giá: Sao vàng & Nhãn đánh giá */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-foreground">Đánh giá</div>
            <div className="flex items-center gap-1 py-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4.5 w-4.5',
                    i < (currentSubject.trialRating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {currentSubject.trialRatingLabel || 'Excellent'}
            </div>
          </div>

          {/* Nội dung nhận xét: Thu gọn / Mở rộng */}
          {!isFeedbackExpanded ? (
            <div className="pt-0.5">
              <p className="text-xs text-foreground/85 leading-relaxed italic line-clamp-3 pl-2 border-l-2 border-emerald-400">
                &ldquo;{currentSubject.teacherFeedback || studentNotes || 'Con rất tốt trong phần Từ vựng (4/5) và Phát âm (4/5) - cô khen con vì đã nhớ bài rất nhanh! Phần Ngữ pháp và Nói cần luyện tập thêm để phản xạ tự nhiên hơn.'}&rdquo;
              </p>
            </div>
          ) : (
            <div className="space-y-3.5 pt-1">
              {/* Mục 1: Bài học hôm nay có gì */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-foreground">
                  🎯 Bài học hôm nay có gì:
                </div>
                <div className="space-y-0.5 text-foreground/90 text-xs pl-0.5">
                  {(currentSubject.trialFeedbackSections?.whatLearned || [
                    'Con đã học về các từ vựng: hen, horse 🐔 🐴',
                    'Luyện tập cấu trúc câu: "What is that? It\'s a hen."',
                    'Học âm Ff với các từ: fish, fork 🐟 🍴',
                  ]).map((item, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {item.startsWith('- ') ? item : `- ${item}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mục 2: Thành tích nổi bật */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-foreground">
                  🏅 Thành tích nổi bật:
                </div>
                <div className="space-y-0.5 text-foreground/90 text-xs pl-0.5">
                  {(currentSubject.trialFeedbackSections?.highlights || [
                    'Con rất tốt trong phần Từ vựng (4/5) và Phát âm (4/5) – cô khen con vì đã nhớ bài rất nhanh! 🌟',
                  ]).map((item, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {item.startsWith('- ') ? item : `- ${item}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mục 3: Mục tiêu cải thiện */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-foreground">
                  🌱 Mục tiêu cải thiện:
                </div>
                <div className="space-y-0.5 text-foreground/90 text-xs pl-0.5">
                  {(currentSubject.trialFeedbackSections?.improvements || [
                    'Phần Ngữ pháp (2/5) và Nói (2/5) con cần luyện tập thêm để phản xạ tự nhiên hơn nhé.',
                    'Con hãy cố gắng đặt câu đầy đủ và luyện nói nhiều hơn để cải thiện khả năng giao tiếp nha! 🗣️',
                  ]).map((item, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {item.startsWith('- ') ? item : `- ${item}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mục 4: Nhắc nhở nhỏ xíu */}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-foreground">
                  🔔 Nhắc nhở nhỏ xíu:
                </div>
                <div className="space-y-0.5 text-foreground/90 text-xs pl-0.5">
                  <div className="leading-relaxed">
                    - {currentSubject.trialFeedbackSections?.reminders?.[0]?.startsWith('- ')
                        ? currentSubject.trialFeedbackSections?.reminders?.[0]?.slice(2)
                        : (currentSubject.trialFeedbackSections?.reminders?.[0] || 'Con hãy ôn lại các từ vựng và cấu trúc đã học để ghi nhớ lâu hơn nhé!')}
                  </div>
                </div>
              </div>

              {/* Tên giáo viên */}
              <div className="text-xs text-foreground/90 pt-1">
                Giáo viên: {teacher}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL CHI TIẾT PHIẾU HỌC THỬ KHI BẤM "CHI TIẾT PHIẾU" HOẶC MÃ PHIẾU */}
      {matchingTrial && (
        <TrialClassDetailDialog
          trial={isDetailModalOpen ? matchingTrial : null}
          onOpenChange={(open) => {
            if (!open) setIsDetailModalOpen(false)
          }}
        />
      )}
    </>
  )
}
