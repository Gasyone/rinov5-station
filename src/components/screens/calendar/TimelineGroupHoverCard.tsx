'use client'

import type { ReactNode } from 'react'
import { Clock, Layers, MapPin, ArrowLeftRight } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import type { ClassSession } from './calendarClassScheduleTypes'
import { ClassSessionHoverCard } from './ClassSessionHoverCard'
import { parseScheduleTime as parseTime } from '@/components/screens/schedule/ScheduleTimeGrid'

interface TimelineGroupHoverCardProps {
  sessions: ClassSession[]
  children: ReactNode
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
  onSelectSession?: (session: ClassSession) => void
}

export function TimelineGroupHoverCard({
  sessions,
  children,
  openDelay = 150,
  closeDelay = 100,
  side = 'right',
  onSelectSession,
}: TimelineGroupHoverCardProps) {
  if (!sessions || sessions.length === 0) return <>{children}</>

  const minStartTime = sessions[0]?.timeLabel || ''
  const maxEndTime = sessions.reduce((latest, current) => {
    if (!latest) return current.endTimeLabel
    return parseTime(current.endTimeLabel) > parseTime(latest) ? current.endTimeLabel : latest
  }, sessions[0]?.endTimeLabel || '')

  const totalStudents = sessions.reduce((sum, s) => sum + (s.totalStudents || 0), 0)

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align="start"
        sideOffset={8}
        className="w-92 p-0 overflow-hidden rounded-lg shadow-xl border border-border/80 bg-popover z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Header */}
        <div className="bg-indigo-50/90 dark:bg-indigo-950/50 border-b border-indigo-200/60 dark:border-indigo-900/60 px-3.5 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200">
            <Clock className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>{minStartTime} - {maxEndTime}</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-200/80 dark:bg-indigo-900/80 border border-indigo-300 dark:border-indigo-700 px-2 py-0.5 text-[10px] font-bold text-indigo-900 dark:text-indigo-200">
            <Layers className="h-3 w-3" />
            {sessions.length} lớp học • {totalStudents} HS
          </span>
        </div>

        {/* Classes List */}
        <div className="p-2.5 space-y-2 max-h-[360px] overflow-y-auto">
          {sessions.map((session, index) => {
            const hasSub = Boolean(session.substituteTeacher)
            const activeTeacher = session.substituteTeacher || session.teacher

            return (
              <ClassSessionHoverCard
                key={session.id || index}
                session={session}
                side="left"
                openDelay={120}
              >
                <div
                  onClick={() => onSelectSession?.(session)}
                  className="group/item relative flex flex-col gap-1 rounded-md border border-border/60 bg-card p-2 text-left shadow-2xs hover:border-primary/50 hover:bg-accent/40 transition cursor-pointer"
                >
                  {/* Title and Sĩ số */}
                  <div className="flex items-start justify-between gap-1.5">
                    <div>
                      <h5 className="text-[11px] font-bold text-foreground group-hover/item:text-primary transition-colors leading-tight">
                        {session.className || `${session.subject} (${session.level})`}
                      </h5>
                      <span className="text-[10px] text-muted-foreground">
                        {session.subject} • Level {session.level}
                      </span>
                    </div>
                    <span className="inline-flex items-center rounded px-1.5 py-0.2 text-[9px] font-bold bg-muted text-foreground/80 border border-border shrink-0">
                      {session.totalStudents} HS
                    </span>
                  </div>

                  {/* Info row: Giờ riêng của từng lớp & Phòng học */}
                  <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground pt-0.5 border-t border-border/30">
                    <div className="flex items-center gap-1 font-semibold text-primary/90 dark:text-primary">
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>{session.timeLabel} - {session.endTimeLabel}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate text-foreground/70">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{session.schoolRoom}</span>
                    </div>
                  </div>

                  {/* Teacher info */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    {hasSub ? (
                      <div className="flex items-center gap-1 text-sky-700 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded px-1.5 py-0.2">
                        <ArrowLeftRight className="h-2.5 w-2.5 text-sky-600" />
                        <span>GV: {session.substituteTeacher}</span>
                        <span className="text-[9px] font-normal text-muted-foreground">(thay {session.teacher})</span>
                      </div>
                    ) : (
                      <span className="text-foreground/80 font-medium">
                        GV: <span className="font-semibold">{activeTeacher}</span>
                      </span>
                    )}
                  </div>
                </div>
              </ClassSessionHoverCard>
            )
          })}
        </div>

        {/* Footer info */}
        <div className="bg-muted/40 border-t border-border/40 px-3 py-1.5 text-[9.5px] text-muted-foreground text-center">
          Hover vào lớp để xem profile chi tiết • Nhấp để mở thao tác
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
