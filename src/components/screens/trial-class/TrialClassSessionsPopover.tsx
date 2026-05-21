'use client'

import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { TrialSessionSelection } from './trialClassTypes'
import { formatTrialDate } from './trialClassHelpers'

interface TrialClassSessionsPopoverProps {
  sessions: TrialSessionSelection[]
}

export function TrialClassSessionsPopover({ sessions }: TrialClassSessionsPopoverProps) {
  if (sessions.length <= 1) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          title="Xem các buổi học khác"
          aria-label="Xem các buổi học khác"
          onClick={(event) => event.stopPropagation()}
        >
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-72 p-3"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Danh sách buổi học ({sessions.length})
        </p>
        <div className="max-h-[250px] space-y-2 overflow-y-auto pr-1">
          {sessions.map((session, idx) => (
            <div
              key={`${session.classId}-${session.sessionId}-${idx}`}
              className="flex items-start justify-between gap-2 rounded-md p-2 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{session.className}</p>
                <p className="text-xs text-muted-foreground">{session.sessionName}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium">{formatTrialDate(session.trialDate)}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{session.sessionId}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
