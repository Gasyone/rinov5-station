'use client'

import React, { useState } from 'react'
import { Calendar, MapPin, Sparkles, Star, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { HistoricalTrialData } from './historicalLearningHelpers'

interface HistoricalTrialCardProps {
  trialData: HistoricalTrialData
  onOpenTrialDetail?: () => void
}

export function HistoricalTrialCard({
  trialData,
  onOpenTrialDetail,
}: HistoricalTrialCardProps) {
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false)

  return (
    <div className="p-3.5 rounded-xl bg-card border border-emerald-200/80 dark:border-emerald-900/60 space-y-3 shadow-2xs">
      {/* HEADER: LỊCH HỌC THỬ 1 DÒNG DUY NHẤT */}
      <div className="pb-2.5 border-b border-border/60">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
          {/* Trái: Lịch học thử [Ngày giờ] */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground font-normal">Lịch học thử:</span>
            <button
              type="button"
              onClick={onOpenTrialDetail}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:underline cursor-pointer transition-colors"
              title="Bấm để xem chi tiết phiếu học thử"
            >
              <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>{trialData.trialDate}</span>
              <ExternalLink className="h-2.5 w-2.5 text-emerald-600/80 shrink-0 ml-0.5" />
            </button>
          </div>

          {/* Phải: Cơ sở (trước) + Trạng thái (sau) */}
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="flex items-center gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="font-semibold text-foreground">{trialData.branch}</span>
            </div>
            <StatusBadge status={trialData.status} label={trialData.statusLabel} />
          </div>
        </div>
      </div>

      {/* PHẦN NHẬN XÉT CỦA GIÁO VIÊN */}
      <div className="space-y-2.5">
        {/* Tiêu đề mục nhận xét & Nút Thu gọn / Mở rộng */}
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
                  i < trialData.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {trialData.ratingLabel}
          </div>
        </div>

        {/* Nội dung nhận xét: Thu gọn / Mở rộng */}
        {!isFeedbackExpanded ? (
          <div className="pt-0.5">
            <p className="text-xs text-foreground/85 leading-relaxed italic line-clamp-3 pl-2 border-l-2 border-emerald-400">
              &ldquo;{trialData.quote}&rdquo;
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
                {trialData.feedbackSections.whatLearned.map((item, idx) => (
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
                {trialData.feedbackSections.highlights.map((item, idx) => (
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
                {trialData.feedbackSections.improvements.map((item, idx) => (
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
                {trialData.feedbackSections.reminders.map((item, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {item.startsWith('- ') ? item : `- ${item}`}
                  </div>
                ))}
              </div>
            </div>

            {/* Tên giáo viên */}
            <div className="text-xs text-foreground/90 pt-1">
              Giáo viên: {trialData.teacherName}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
