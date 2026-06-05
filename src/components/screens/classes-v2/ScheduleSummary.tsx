'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Clock, Calendar } from 'lucide-react'
import type { ScheduleSlot } from '@/mocks/classRecords'

interface ScheduleSummaryProps {
  scheduleSlots?: ScheduleSlot[]
  className?: string
}

export function ScheduleSummary({ scheduleSlots, className }: ScheduleSummaryProps) {
  const [open, setOpen] = useState(false)

  if (!scheduleSlots || scheduleSlots.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  // Show max 2 lines, expand icon from 3+
  const visible = scheduleSlots.slice(0, 2)
  const hasMore = scheduleSlots.length > 2

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="space-y-0.5">
        {visible.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs leading-tight whitespace-nowrap">
            <span className="font-semibold text-foreground uppercase">{s.date}</span>
            <span className="text-muted-foreground">{s.startTime}–{s.endTime}</span>
            {i === 0 && hasMore && (
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Calendar className="h-3.5 w-3.5" />
                </Button>
              </PopoverTrigger>
            )}
          </div>
        ))}
      </div>

      <PopoverContent className="w-80 p-0" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b bg-muted/30">
          <h4 className="text-[11px] font-bold text-muted-foreground uppercase">
            Danh sách buổi học ({scheduleSlots.length})
          </h4>
        </div>
        <div className="p-2 space-y-1 max-h-[300px] overflow-y-auto">
          {scheduleSlots.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg p-2 hover:bg-muted/50 text-sm">
              <div className="min-w-0 flex-1 pr-4">
                <div className="font-semibold text-foreground truncate">{className || s.dayOfWeek}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{s.dayOfWeek} • SESS-{(9901 + i).toString()}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-foreground">{s.date} {s.startTime}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-end gap-1">
                  <Clock className="h-3 w-3" />
                  {s.endTime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
