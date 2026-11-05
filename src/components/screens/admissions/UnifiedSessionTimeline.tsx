'use client'

import React, { useState } from 'react'
import {
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  History,
  MapPin,
  Star,
  Users,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { UnifiedSessionItem, UnifiedSubject } from './unifiedSessionTypes'

interface UnifiedSessionTimelineProps {
  sessions: UnifiedSessionItem[]
  currentSessionId: string
  activeSubject: 'all' | UnifiedSubject
  onSelectSession?: (session: UnifiedSessionItem) => void
}

export function UnifiedSessionTimeline({
  sessions,
  currentSessionId,
  activeSubject,
  onSelectSession,
}: UnifiedSessionTimelineProps) {
  // Lọc theo môn học nếu người dùng chọn
  const filteredSessions = sessions.filter((s) => {
    if (activeSubject === 'all') return true
    return s.subject === activeSubject
  })

  // Loại bỏ buổi hiện tại khỏi danh sách lịch sử để tránh trùng lặp
  const historySessions = filteredSessions.filter((s) => s.id !== currentSessionId)

  if (historySessions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/80 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
        <History className="h-4 w-4 mx-auto mb-1 text-muted-foreground/60" />
        <p className="font-medium text-foreground">Chưa có lịch sử buổi trước</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {activeSubject !== 'all'
            ? 'Không có buổi nào khác thuộc môn học đã chọn.'
            : 'Đây là buổi hẹn đầu tiên của học viên tại trung tâm.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <History className="h-3.5 w-3.5 text-primary" />
          <span>Lịch sử các buổi trước ({historySessions.length})</span>
        </div>
        <span className="text-[11px] text-muted-foreground italic">
          (Bao gồm Kiểm tra & Học thử)
        </span>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-0.5">
        {historySessions.map((item) => {
          const isTest = item.type === 'test'

          return (
            <div
              key={item.id}
              onClick={() => onSelectSession?.(item)}
              className={cn(
                'group relative rounded-lg border p-2.5 text-xs transition-all cursor-pointer',
                isTest
                  ? 'border-sky-200/80 dark:border-sky-900/60 bg-sky-50/30 dark:bg-sky-950/20 hover:bg-sky-50/70 hover:border-sky-300'
                  : 'border-purple-200/80 dark:border-purple-900/60 bg-purple-50/30 dark:bg-purple-950/20 hover:bg-purple-50/70 hover:border-purple-300'
              )}
            >
              {/* Dòng đầu: Loại buổi, Ngày giờ, Trạng thái */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {isTest ? (
                    <Badge
                      variant="outline"
                      className="bg-sky-100/80 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 border-sky-300 text-[10px] font-semibold h-4.5 px-1.5 shrink-0"
                    >
                      <FileText className="h-2.5 w-2.5 mr-0.5" />
                      Kiểm tra
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-purple-100/80 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-300 text-[10px] font-semibold h-4.5 px-1.5 shrink-0"
                    >
                      <GraduationCap className="h-2.5 w-2.5 mr-0.5" />
                      Học thử
                    </Badge>
                  )}

                  <span className="font-mono text-muted-foreground text-[11px] shrink-0">
                    #{item.id}
                  </span>

                  <Badge variant="secondary" className="text-[10px] font-normal h-4 px-1">
                    {item.subjectLabel}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Badge variant="outline" className="text-[10px] font-medium h-4.5 px-1.5 bg-background">
                    {item.statusLabel}
                  </Badge>
                </div>
              </div>

              {/* Dòng 2: Thời gian & Giáo viên & Địa điểm */}
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-muted-foreground text-[11px]">
                <div className="flex items-center gap-1 min-w-0">
                  <Clock className="h-3 w-3 text-sky-600 shrink-0" />
                  <span className="font-medium text-foreground">{item.dateLabel}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-muted-foreground">GV:</span>
                  <span className="font-semibold text-foreground">{item.teacherName}</span>
                </div>
              </div>

              {/* Dòng 3: Tóm tắt kết quả (Nổi bật cho Quản lý) */}
              <div className="mt-1.5 pt-1.5 border-t border-border/40 flex items-center justify-between gap-2 text-xs">
                {isTest ? (
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-muted-foreground text-[11px]">Kết quả:</span>
                    {item.testScoreSummary?.level ? (
                      <span className="font-bold text-sky-700 dark:text-sky-300">
                        {item.testScoreSummary.level}
                        {item.testScoreSummary.subLevel ? ` (${item.testScoreSummary.subLevel})` : ''}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-[11px]">Chưa có kết quả</span>
                    )}

                    {item.testScoreSummary?.speakingScore && (
                      <span className="text-[11px] text-muted-foreground">
                        Speaking: <strong className="text-foreground">{item.testScoreSummary.speakingScore}</strong>
                      </span>
                    )}
                    {item.testScoreSummary?.lwrScore && (
                      <span className="text-[11px] text-muted-foreground">
                        LWR: <strong className="text-foreground">{item.testScoreSummary.lwrScore}</strong>
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-muted-foreground text-[11px]">Lớp:</span>
                    <span className="font-semibold text-foreground truncate max-w-[150px]">
                      {item.trialSummary?.className}
                    </span>

                    {item.trialSummary?.rating ? (
                      <span className="inline-flex items-center text-amber-500 font-bold text-[11px] gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        {item.trialSummary.rating}/5 sao
                      </span>
                    ) : null}

                    {item.trialSummary?.feedbackComment && (
                      <span className="text-[11px] text-muted-foreground truncate max-w-[180px] italic">
                        &ldquo;{item.trialSummary.feedbackComment}&rdquo;
                      </span>
                    )}
                  </div>
                )}

                <div className="shrink-0 flex items-center gap-0.5 text-primary text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Xem chi tiết</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
