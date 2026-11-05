'use client'

import React from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStatusColors } from '@/lib/statusColors'
import type { BookingTestResult } from '@/mocks/bookingTests'
import { cn } from '@/lib/utils'

export function SpeakingScore({
  result,
  compact = false,
  onOpenAssessment,
}: {
  result?: BookingTestResult
  compact?: boolean
  onOpenAssessment?: () => void
}) {
  const teacherSpeaking = result?.speaking?.trim()
  const hasTeacherSpeaking = Boolean(
    teacherSpeaking &&
    teacherSpeaking !== '-' &&
    teacherSpeaking !== 'chưa có' &&
    teacherSpeaking !== ''
  )

  const hasAiScore = Boolean(
    result?.speakingAi &&
    result.speakingAi !== '0/0' &&
    result.speakingAi !== '-' &&
    result.speakingAi.trim() !== ''
  )

  const warningText = getStatusColors('warning').text
  const infoText = getStatusColors('info').text
  const scoreValue = result?.speakingScore || '0'
  const isPositiveScore = Number(scoreValue) > 0
  const scoreText = isPositiveScore
    ? getStatusColors('success').text
    : 'text-muted-foreground'

  // Khi ở ngoài danh sách (compact) và chưa có giáo viên đánh giá: hiển thị Button icon + Đánh giá
  if (compact && !hasTeacherSpeaking && onOpenAssessment) {
    return (
      <div className="flex items-center gap-1.5 min-w-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onOpenAssessment()
          }}
          className="h-5 px-1.5 text-[11px] font-normal border-primary/40 text-primary hover:bg-primary/10 hover:text-primary gap-1 shadow-none cursor-pointer rounded shrink-0"
          title="Mở form đánh giá cho học viên"
        >
          <FileText className="h-3 w-3" />
          <span>Đánh giá</span>
        </Button>
        {hasAiScore && (
          <span className={cn('text-[11px] font-normal text-sky-600 dark:text-sky-400 truncate')}>
            AI: {result?.speakingAi}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="min-w-0">
      {!compact ? (
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Điểm Speaking
        </p>
      ) : null}
      <div className={cn('flex flex-wrap items-center gap-1.5', compact ? '' : 'mt-1')}>
        <span className={cn('text-xs font-normal', warningText)}>
          GV: {result?.speaking || 'chưa có'}
        </span>
        <span className={cn('text-xs font-normal', infoText)}>
          AI: {result?.speakingAi || '0/0'}
        </span>
        <span className={cn('text-xs font-normal', scoreText)}>
          {scoreValue}
        </span>
      </div>
    </div>
  )
}

export function LwrScore({
  result,
  compact = false,
}: {
  result?: BookingTestResult
  compact?: boolean
}) {
  const level = result?.lwrLevel || result?.path || '-'
  const rawScore = result?.lwr || '-'
  const convertedScore = result?.lwrScore || '0'

  return (
    <div className="min-w-0">
      {!compact ? (
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Điểm LWR
        </p>
      ) : null}
      <p
        className={cn(
          'truncate',
          compact ? 'text-xs text-muted-foreground font-normal leading-tight' : 'mt-1 text-sm font-semibold'
        )}
        title={`${level} - ${rawScore} - ${convertedScore}`}
      >
        {level} - {rawScore} - {convertedScore}
      </p>
    </div>
  )
}
