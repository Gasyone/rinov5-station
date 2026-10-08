'use client'

import { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { TrialClass, TrialClassTeacherFeedback } from '@/mocks/trialClasses'
import { cn } from '@/lib/utils'
import { DetailCard } from './TrialClassDetailCard'

interface TrialClassDetailFeedbackSectionProps {
  trial: TrialClass
  feedback?: TrialClassTeacherFeedback
  activeSessionsCount: number
}

export function TrialClassDetailFeedbackSection({
  trial,
  feedback,
  activeSessionsCount,
}: TrialClassDetailFeedbackSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Trạng thái điểm danh trên header
  const attendanceBadge = useMemo(() => {
    if (trial.status === 'no_show') {
      return (
        <Badge
          variant="secondary"
          className={cn(getStatusBadgeClass('absent'), 'text-xs h-5 px-1.5 font-medium')}
        >
          Vắng mặt
        </Badge>
      )
    }
    if (trial.status === 'completed' || Boolean(feedback)) {
      return (
        <Badge
          variant="secondary"
          className={cn(getStatusBadgeClass('present'), 'text-xs h-5 px-1.5 font-medium')}
        >
          Có mặt
        </Badge>
      )
    }
    if (trial.status === 'confirmed') {
      return (
        <Badge
          variant="outline"
          className="text-xs text-muted-foreground h-5 px-1.5 font-medium"
        >
          Chưa điểm danh
        </Badge>
      )
    }
    return null
  }, [trial.status, feedback])

  return (
    <DetailCard
      title="Kết quả học thử & Đánh giá"
      titleClassName="font-normal text-muted-foreground"
      badge={
        feedback ? (
          <Badge
            variant="secondary"
            className={cn(getStatusBadgeClass('completed'), 'text-xs h-5 px-1.5 font-medium')}
          >
            Đã có nhận xét
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-muted-foreground h-5 px-1.5">
            {trial.status === 'pending_approval'
              ? 'Chưa có nhận xét'
              : trial.status === 'confirmed'
              ? 'Chưa diễn ra'
              : trial.status === 'completed'
              ? 'Chờ nhận xét'
              : 'Không có nhận xét'}
          </Badge>
        )
      }
      actions={attendanceBadge}
    >
      {feedback ? (
        <div className="space-y-2 text-xs">
          {/* Đánh giá chung & Giáo viên */}
          <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Đánh giá:</span>
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < (feedback.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {feedback.ratingText || 'Excellent'}
              </span>
            </div>
            <span
              className="text-xs text-muted-foreground truncate max-w-[170px]"
              title={feedback.teacherName || trial.owner || 'Hoàng Thị Ngọc Anh'}
            >
              GV: <strong className="font-semibold text-foreground">{feedback.teacherName || trial.owner || 'Hoàng Thị Ngọc Anh'}</strong>
            </span>
          </div>

          {/* Nội dung nhận xét: Thu gọn (tối đa 3 dòng) / Mở rộng */}
          {isExpanded ? (
            <div className="space-y-2 text-xs">
              {/* Con đã học */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>🎯</span> Con đã học:
                </span>
                <ul className="text-xs text-muted-foreground pl-4 space-y-0.5 list-disc leading-relaxed">
                  {(feedback.learnedTopics?.length
                    ? feedback.learnedTopics
                    : [
                        'Tìm hiểu hình ngũ giác, lục giác và thực hành tạo các hình này.',
                        'Chơi trò tạo nhiều hình dạng khác nhau từ bảng chun hình học để củng cố nội dung về hình.',
                      ]
                  ).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Điểm sáng */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>📝</span> Điểm sáng:
                </span>
                <ul className="text-xs text-muted-foreground pl-4 space-y-0.5 list-disc leading-relaxed">
                  {(feedback.strengths?.length
                    ? feedback.strengths
                    : [
                        'Con vui vẻ hợp tác, tập trung chủ động suy nghĩ và lên bảng trình bày suy nghĩ của mình.',
                        'Con quan sát, nhận biết và vẽ được các hình học cơ bản như tam giác, tứ giác.',
                      ]
                  ).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Cần cải thiện */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>🌱</span> Cần cải thiện:
                </span>
                <ul className="text-xs text-muted-foreground pl-4 space-y-0.5 list-disc leading-relaxed">
                  {(feedback.weaknesses?.length
                    ? feedback.weaknesses
                    : [
                        'Con cần rèn luyện thêm để ghi nhớ tên gọi các hình như tam giác, tứ giác, lục giác, tránh nhầm lẫn.',
                      ]
                  ).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Nhắc nhở */}
              {feedback.reminders && feedback.reminders.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <span>🔔</span> Nhắc nhở:
                  </span>
                  <ul className="text-xs text-muted-foreground pl-4 space-y-0.5 list-disc leading-relaxed">
                    {feedback.reminders.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5 text-xs">
              {/* Dòng 1: Con đã học */}
              <div className="flex items-start gap-1.5 min-w-0">
                <span className="shrink-0 text-xs select-none">🎯</span>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-foreground mr-1 text-xs">Con đã học:</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {feedback.learnedTopics?.[0] || 'Tìm hiểu hình ngũ giác, lục giác và thực hành tạo các hình này.'}
                  </span>
                </div>
              </div>

              {/* Dòng 2: Điểm sáng */}
              <div className="flex items-start gap-1.5 min-w-0">
                <span className="shrink-0 text-xs select-none">📝</span>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-foreground mr-1 text-xs">Điểm sáng:</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {feedback.strengths?.[0] || 'Con vui vẻ hợp tác, tập trung chủ động suy nghĩ và lên bảng trình bày suy nghĩ của mình.'}
                  </span>
                </div>
              </div>

              {/* Dòng 3: Cần cải thiện */}
              <div className="flex items-start gap-1.5 min-w-0">
                <span className="shrink-0 text-xs select-none">🌱</span>
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-foreground mr-1 text-xs">Cần cải thiện:</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {feedback.weaknesses?.[0] || 'Con cần rèn luyện thêm để ghi nhớ tên gọi các hình như tam giác, tứ giác, lục giác, tránh nhầm lẫn.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer: Link mở tab mới & Nút thu gọn / mở rộng */}
          <div className="pt-1.5 border-t border-border/40 flex items-center justify-between gap-2">
            <a
              href={feedback.resultLink || `/trial-report/${trial.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Xem báo cáo học thử chi tiết
            </a>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <span>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-5 px-3 text-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground/60 mb-1.5">
            <FileText className="h-4 w-4" />
          </div>
          <p className="text-xs font-semibold text-foreground">Chưa có kết quả nhận xét</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[320px]">
            {trial.status === 'pending_approval'
              ? 'Phiếu đang chờ xác nhận ghép lớp. Giáo viên sẽ đánh giá sau khi hoàn thành buổi học thử.'
              : trial.status === 'rejected'
              ? 'Phiếu đã bị từ chối ghép lớp.'
              : trial.status === 'no_show'
              ? 'Học viên không đến buổi học thử.'
              : trial.status === 'cancelled'
              ? 'Phiếu học thử đã bị hủy.'
              : trial.status === 'confirmed'
              ? 'Buổi học thử chưa diễn ra. Giáo viên sẽ đánh giá sau khi học viên hoàn thành buổi học.'
              : activeSessionsCount > 0
              ? 'Học viên đã được ghép lớp. Giáo viên sẽ đánh giá sau khi hoàn thành buổi học thử.'
              : 'Học viên chưa được xếp lịch học thử. Vui lòng chọn lớp học ghép để xếp lịch.'}
          </p>
          {trial.program && (
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span>Chương trình dự kiến:</span>
              <strong className="text-foreground font-medium">{trial.program}</strong>
            </div>
          )}
        </div>
      )}
    </DetailCard>
  )
}
