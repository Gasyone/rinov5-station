'use client'

import { useMemo } from 'react'
import { Clock } from 'lucide-react'
import { parseScheduleString } from './operationsAlertHelpers'

interface ScheduleSummaryBadgeProps {
  scheduleStr: string
}

export function ScheduleSummaryBadge({ scheduleStr }: ScheduleSummaryBadgeProps) {
  const slots = useMemo(() => parseScheduleString(scheduleStr), [scheduleStr])

  if (slots.length === 0) {
    return <span className="text-muted-foreground italic text-[10px]">—</span>
  }

  const getDayLabel = (day: string) => {
    switch (day.toUpperCase()) {
      case 'T2':
        return 'Thứ 2'
      case 'T3':
        return 'Thứ 3'
      case 'T4':
        return 'Thứ 4'
      case 'T5':
        return 'Thứ 5'
      case 'T6':
        return 'Thứ 6'
      case 'T7':
        return 'Thứ 7'
      case 'CN':
        return 'Chủ Nhật'
      default:
        return day
    }
  }

  return (
    <div className="flex flex-col gap-1 select-none">
      {slots.map((slot, index) => (
        <div key={index} className="flex items-center gap-1.5 text-[10px]">
          <span className="inline-flex items-center justify-center bg-primary/10 text-primary font-bold text-[9px] px-1 py-0.5 rounded-sm min-w-10 text-center uppercase tracking-wide">
            {getDayLabel(slot.day)}
          </span>
          <span className="font-mono text-muted-foreground font-semibold flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5 text-zinc-400 shrink-0" />
            {slot.time}
          </span>
        </div>
      ))}
    </div>
  )
}
