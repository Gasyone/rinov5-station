'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Clock, Calendar } from 'lucide-react'
import type { ScheduleSlot } from '@/mocks/classRecords'
import { Button } from '@/components/ui/button'

interface ScheduleSummaryProps {
  schedule: string
  scheduleSlots?: ScheduleSlot[]
}

const DAY_ORDER = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN']
const DAY_SHORT: Record<string, string> = {
  'Thứ 2': 'T2',
  'Thứ 3': 'T3',
  'Thứ 4': 'T4',
  'Thứ 5': 'T5',
  'Thứ 6': 'T6',
  'Thứ 7': 'T7',
  'CN': 'CN',
}

export function ScheduleSummary({ schedule, scheduleSlots }: ScheduleSummaryProps) {
  const [showModal, setShowModal] = useState(false)

  if (!scheduleSlots || scheduleSlots.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const sorted = [...scheduleSlots].sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  )

  const compact = (
    <div className="flex flex-wrap gap-1">
      {sorted.slice(0, 3).map((s, i) => (
        <Badge key={i} variant="outline" className="text-[10px] font-normal px-1.5 py-0 leading-tight">
          {DAY_SHORT[s.dayOfWeek]} {s.startTime}
        </Badge>
      ))}
      {sorted.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-5 w-5 p-0 text-xs text-muted-foreground hover:text-foreground"
          onClick={(e) => { e.stopPropagation(); setShowModal(true) }}
        >
          +{sorted.length - 3}
        </Button>
      )}
    </div>
  )

  return (
    <>
      {compact}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Lịch học trong tuần
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mt-2">
            {sorted.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm">
                <Badge variant="secondary" className="w-10 justify-center font-semibold text-xs">
                  {DAY_SHORT[s.dayOfWeek]}
                </Badge>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{s.startTime} – {s.endTime}</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
