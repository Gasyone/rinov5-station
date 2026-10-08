'use client'

import type { ScheduleSlot } from '@/mocks/classRecords'

interface ScheduleSummaryProps {
  scheduleSlots?: ScheduleSlot[]
  className?: string
  displayMode?: 'date' | 'dayOfWeek'
  hideTime?: boolean
}

/** Converts 'Thứ 2' -> 'T2', 'Chủ nhật' -> 'CN' */
function toShortDay(day: string): string {
  const match = day.match(/Thứ\s*(\d)/i)
  if (match) return `T${match[1]}`
  if (/chủ\s*nhật/i.test(day)) return 'CN'
  return day
}

export function ScheduleSummary({
  scheduleSlots,
  displayMode = 'dayOfWeek',
  hideTime = false,
}: ScheduleSummaryProps) {
  if (!scheduleSlots || scheduleSlots.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  // Check if all slots share the exact same start and end time
  const firstTime = `${scheduleSlots[0].startTime}–${scheduleSlots[0].endTime}`
  const allSameTime = scheduleSlots.every(
    (s) => `${s.startTime}–${s.endTime}` === firstTime
  )

  if (allSameTime && displayMode === 'dayOfWeek') {
    const days = scheduleSlots.map((s) => toShortDay(s.dayOfWeek)).join(', ')
    return (
      <div className="space-y-0.5 leading-tight">
        <div className="font-normal text-xs text-foreground truncate" title={scheduleSlots.map((s) => s.dayOfWeek).join(', ')}>
          {days}
        </div>
        {!hideTime && <div className="text-xs text-muted-foreground">{firstTime}</div>}
      </div>
    )
  }

  // If different times or date mode, group by time range
  const timeMap = new Map<string, string[]>()
  for (const s of scheduleSlots) {
    const timeKey = `${s.startTime}–${s.endTime}`
    const label = displayMode === 'dayOfWeek' ? toShortDay(s.dayOfWeek) : s.date
    if (!timeMap.has(timeKey)) {
      timeMap.set(timeKey, [])
    }
    timeMap.get(timeKey)!.push(label)
  }

  return (
    <div className="space-y-0.5 leading-tight">
      {Array.from(timeMap.entries()).map(([time, days], idx) => (
        <div key={idx} className="text-xs truncate">
          <span className="font-normal text-foreground">{days.join(', ')}</span>{' '}
          {!hideTime && <span className="text-xs text-muted-foreground">({time})</span>}
        </div>
      ))}
    </div>
  )
}
