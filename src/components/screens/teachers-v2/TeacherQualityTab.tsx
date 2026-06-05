'use client'

import { useMemo } from 'react'
import { Star } from 'lucide-react'
import { Panel, EmptyState } from '@/components/shared'
import { getTeacherQualityReviews } from '@/mocks/teacherDetail'
import { getQualityCategoryLabel } from './teacherDetailHelpers'

interface TeacherQualityTabProps {
  teacherId: string
}

export function TeacherQualityTab({ teacherId }: TeacherQualityTabProps) {
  const reviews = useMemo(() => getTeacherQualityReviews(teacherId), [teacherId])

  if (reviews.length === 0) {
    return <EmptyState title="Chưa có đánh giá" description="Giáo viên này chưa có đánh giá chất lượng nào." />
  }

  const avgScore = reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-4">
        <Star className="h-5 w-5 text-amber-500" />
        <div>
          <div className="text-2xl font-semibold">{avgScore.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">Điểm trung bình ({reviews.length} đánh giá)</div>
        </div>
      </div>

      <Panel title="Lịch sử đánh giá">
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{getQualityCategoryLabel(review.category)}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {review.score}/5.0
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{review.feedback}</div>
              {review.improvementSuggestions && (
                <div className="mt-1 rounded border-l-2 border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
                  Gợi ý: {review.improvementSuggestions}
                </div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">Người đánh giá: {review.reviewer}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
