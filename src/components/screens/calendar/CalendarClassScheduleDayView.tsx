import { useRef, useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassSession } from './calendarClassScheduleTypes'
import { SessionCard } from './SessionCardV2'
import { getSessionPeriod, toDateKey } from './calendarClassScheduleHelpers'

interface CalendarClassScheduleDayViewProps {
  selectedDate: Date
  today: Date
  filteredSessions: ClassSession[]
  onSelectSession: (session: ClassSession) => void
}

export function CalendarClassScheduleDayView({
  selectedDate,
  filteredSessions,
  onSelectSession,
}: CalendarClassScheduleDayViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [collapsedPeriods, setCollapsedPeriods] = useState<Record<string, boolean>>({})

  const togglePeriod = (id: string) => {
    setCollapsedPeriods((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

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
      textColor: 'text-amber-700 dark:text-amber-400',
      iconColor: 'text-amber-600 dark:text-amber-400',
      lineColor: 'bg-amber-500/40 dark:bg-amber-400/35 group-hover:bg-amber-500/70',
    },
    {
      id: 'afternoon',
      label: 'Ca Chiều (12:00 - 18:00)',
      sessions: afternoonSessions,
      textColor: 'text-sky-700 dark:text-sky-400',
      iconColor: 'text-sky-600 dark:text-sky-400',
      lineColor: 'bg-sky-500/40 dark:bg-sky-400/35 group-hover:bg-sky-500/70',
    },
    {
      id: 'evening',
      label: 'Ca Tối (18:00 - 22:00)',
      sessions: eveningSessions,
      textColor: 'text-indigo-700 dark:text-indigo-400',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      lineColor: 'bg-indigo-500/40 dark:bg-indigo-400/35 group-hover:bg-indigo-500/70',
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
    <div ref={containerRef} className="relative flex flex-1 flex-col overflow-y-auto min-h-0 bg-background/50 p-2.5 space-y-3">
      {/* Sections for Ca Sáng, Ca Chiều, Ca Tối */}
      <div className="space-y-2">
        {periods.map((p) => {
          if (p.sessions.length === 0) return null
          const isOpen = !collapsedPeriods[p.id]

          return (
            <div key={p.id} className="space-y-1.5">
              {/* Line Header ca */}
              <button
                type="button"
                onClick={() => togglePeriod(p.id)}
                className={cn(
                  "group flex w-full items-center gap-1.5 py-1 text-xs font-bold hover:opacity-85 transition cursor-pointer select-none",
                  p.textColor
                )}
              >
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5",
                    p.iconColor,
                    isOpen && "rotate-90"
                  )}
                />
                <span className="shrink-0">
                  {p.label} ({p.sessions.length} buổi)
                </span>
                <div className={cn("h-[2px] flex-1 transition-colors rounded-full", p.lineColor)} />
              </button>

              {/* Flat Grid of Session Cards */}
              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {p.sessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onClick={() => onSelectSession(session)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

