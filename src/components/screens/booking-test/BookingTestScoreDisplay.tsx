'use client'

import { getStatusColors } from '@/lib/statusColors'
import type { BookingTestResult } from '@/mocks/bookingTests'
import { cn } from '@/lib/utils'

export function SpeakingScore({
  result,
  compact = false,
}: {
  result?: BookingTestResult
  compact?: boolean
}) {
  const warningText = getStatusColors('warning').text
  const infoText = getStatusColors('info').text
  const scoreValue = result?.speakingScore || '0'
  const isPositiveScore = Number(scoreValue) > 0
  const scoreText = isPositiveScore
    ? getStatusColors('success').text
    : 'text-muted-foreground'

  return (
    <div className="min-w-0">
      {!compact ? (
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
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
