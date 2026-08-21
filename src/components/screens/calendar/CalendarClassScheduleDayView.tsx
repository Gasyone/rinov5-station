import { useState, useEffect, useRef, useMemo } from 'react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassSession } from './calendarClassScheduleTypes'
import { SessionCard } from './SessionCardV2'
import { getSessionPeriod, toDateKey } from './calendarClassScheduleHelpers'
import { formatMinute } from '@/components/screens/schedule/ScheduleTimeGrid'

interface CalendarClassScheduleDayViewProps {
  selectedDate: Date
  today: Date
  filteredSessions: ClassSession[]
  onSelectSession: (session: ClassSession) => void
}

export function CalendarClassScheduleDayView({
  selectedDate,
  today,
  filteredSessions,
  onSelectSession,
}: CalendarClassScheduleDayViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Real-time clock for current time indicator (updates every 30s)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  const isToday =
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear()

  const currentMinute = now.getHours() * 60 + now.getMinutes()

  // Filter sessions for the selected day only and sort chronologically
  const dayKey = toDateKey(selectedDate)
  const daySessions = useMemo(() => {
    return filteredSessions
      .filter((session) => session.date === dayKey)
      .sort((a, b) => a.timeLabel.localeCompare(b.timeLabel))
  }, [filteredSessions, dayKey])

  // Group sessions strictly by period (Ca Sáng, Ca Chiều, Ca Tối)
  const morningSessions = useMemo(() => {
    return daySessions.filter((s) => getSessionPeriod(s.timeLabel) === 'morning')
  }, [daySessions])

  const afternoonSessions = useMemo(() => {
    return daySessions.filter((s) => getSessionPeriod(s.timeLabel) === 'afternoon')
  }, [daySessions])

  const eveningSessions = useMemo(() => {
    return daySessions.filter((s) => getSessionPeriod(s.timeLabel) === 'evening')
  }, [daySessions])

  const periods = useMemo(() => [
    {
      id: 'morning',
      label: 'Ca Sáng (08:00 - 12:00)',
      sessions: morningSessions,
      colorClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/60',
      dotClass: 'bg-amber-500',
    },
    {
      id: 'afternoon',
      label: 'Ca Chiều (12:00 - 18:00)',
      sessions: afternoonSessions,
      colorClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200/60 dark:border-sky-900/60',
      dotClass: 'bg-sky-500',
    },
    {
      id: 'evening',
      label: 'Ca Tối (18:00 - 22:00)',
      sessions: eveningSessions,
      colorClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/60',
      dotClass: 'bg-indigo-500',
    },
  ], [morningSessions, afternoonSessions, eveningSessions])

  if (daySessions.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <EmptyState
          title="Không có lịch học"
          description={`Không có lớp học nào diễn ra trong ngày ${selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}.`}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative flex flex-1 flex-col overflow-y-auto min-h-0 bg-background/50 p-4 space-y-6">
      {/* Date Header Info Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm",
            isToday ? "bg-primary text-primary-foreground shadow-xs" : "bg-muted text-foreground"
          )}>
            {selectedDate.getDate()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              {isToday && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  Hôm nay: {formatMinute(currentMinute)}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng cộng {daySessions.length} lớp học trong ngày
            </p>
          </div>
        </div>
      </div>

      {/* Sections for Ca Sáng, Ca Chiều, Ca Tối */}
      <div className="space-y-6">
        {periods.map((p) => {
          if (p.sessions.length === 0) return null

          return (
            <div key={p.id} className="space-y-3">
              {/* Line Header ca */}
              <div className={cn("flex items-center justify-between px-3.5 py-2 rounded-md font-bold text-xs border select-none", p.colorClass)}>
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full shrink-0", p.dotClass)} />
                  <span>{p.label} ({p.sessions.length} lớp)</span>
                </div>
              </div>

              {/* Flat Grid of Session Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {p.sessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => onSelectSession(session)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

