'use client'

import { getStatusColors } from '@/lib/statusColors'
import type { BookingTestResult } from '@/mocks/bookingTests'
import { cn } from '@/lib/utils'

function ScoreChip({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-md border px-1.5 text-xs font-medium',
        className
      )}
    >
      {label}: {value}
    </span>
  )
}

export function SpeakingScore({
  result,
  compact = false,
}: {
  result?: BookingTestResult
  compact?: boolean
}) {
  const warningChip = getStatusColors('warning').badge
  const infoChip = getStatusColors('info').badge

  return (
    <div className="min-w-0">
      {!compact ? (
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Điểm Speaking
        </p>
      ) : null}
      <div className={cn('flex flex-wrap items-center gap-1', compact ? '' : 'mt-1')}>
        <ScoreChip label="GV" value={result?.speaking || 'chưa có'} className={warningChip} />
        <ScoreChip label="AI" value={result?.speakingAi || '0/0'} className={infoChip} />
        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border px-1.5 text-xs font-medium">
          {result?.speakingScore || '0'}
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
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Điểm LWR
        </p>
      ) : null}
      <p
        className={cn(
          'truncate font-semibold',
          compact ? 'text-xs' : 'mt-1 text-sm'
        )}
        title={`${level} - ${rawScore} - ${convertedScore}`}
      >
        {level} - {rawScore} - {convertedScore}
      </p>
    </div>
  )
}
