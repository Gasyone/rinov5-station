'use client'

import type { ScheduleSlot } from '@/mocks/classRecords'

interface ScheduleSummaryProps {
  scheduleSlots?: ScheduleSlot[]
  className?: string
  displayMode?: 'date' | 'dayOfWeek'
}

export function ScheduleSummary({ scheduleSlots, displayMode = 'dayOfWeek' }: ScheduleSummaryProps) {
  if (!scheduleSlots || scheduleSlots.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  return (
    <div className="space-y-1">
      {scheduleSlots.map((s, i) => (
        <div key={i} className="flex items-center gap-1.5 text-xs leading-tight whitespace-nowrap">
          <span className="font-normal text-foreground">
            {displayMode === 'dayOfWeek' ? `${s.dayOfWeek}:` : s.date}
          </span>
          <span className="text-muted-foreground">{s.startTime}–{s.endTime}</span>
        </div>
      ))}
    </div>
  )
}
