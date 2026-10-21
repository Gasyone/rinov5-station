'use client'

import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { EventSession } from '@/mocks/calendarSchedule'
import { EventCard } from './EventCard'
import { getSessionPeriod, toDateKey } from './calendarEventScheduleHelpers'

interface CalendarEventDayListViewProps {
  selectedDate: Date
  today: Date
  filteredSessions: EventSession[]
  activeBranch: string
  branchesCount: number
  onSelectEvent: (session: EventSession) => void
}

export function CalendarEventDayListView({
  selectedDate,
  filteredSessions,
  activeBranch,
  branchesCount,
  onSelectEvent,
}: CalendarEventDayListViewProps) {
  const [collapsedPeriods, setCollapsedPeriods] = useState<Record<string, boolean>>({})

  const togglePeriod = (id: string) => {
    setCollapsedPeriods((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const dayKey = toDateKey(selectedDate)
  const daySessions = useMemo(() => {
    return filteredSessions
      .filter((session) => session.date === dayKey)
      .sort((a, b) => a.timeLabel.localeCompare(b.timeLabel))
  }, [filteredSessions, dayKey])

  const morningSessions = useMemo(() => {
    return daySessions.filter((s) => getSessionPeriod(s.timeLabel) === 'morning')
  }, [daySessions])

  const afternoonSessions = useMemo(() => {
    return daySessions.filter((s) => getSessionPeriod(s.timeLabel) === 'afternoon')
  }, [daySessions])

  const eveningSessions = useMemo(() => {
    return daySessions.filter((s) => getSessionPeriod(s.timeLabel) === 'evening')
  }, [daySessions])

  const periods = useMemo(
    () => [
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
    ],
    [morningSessions, afternoonSessions, eveningSessions]
  )

  if (daySessions.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <EmptyState
          title="Không có lịch test"
          description={`Không có lịch test nào diễn ra trong ngày ${selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}.`}
        />
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto min-h-0 bg-background/50 p-2.5 space-y-3">
      <div className="space-y-2">
        {periods.map((p) => {
          if (p.sessions.length === 0) return null
          const isOpen = !collapsedPeriods[p.id]

          return (
            <div key={p.id} className="space-y-1.5">
              <button
                type="button"
                onClick={() => togglePeriod(p.id)}
                className={cn(
                  "group flex w-full items-center gap-2 py-1 text-sm font-bold hover:opacity-85 transition cursor-pointer select-none",
                  p.textColor
                )}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5",
                    p.iconColor,
                    isOpen && "rotate-90"
                  )}
                />
                <span className="shrink-0">
                  {p.label} ({p.sessions.length} sự kiện)
                </span>
                <div className={cn("h-[2px] flex-1 transition-colors rounded-full", p.lineColor)} />
              </button>

              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {p.sessions.map((session) => (
                    <EventCard
                      key={session.id}
                      session={session}
                      onClick={() => onSelectEvent(session)}
                      activeBranch={activeBranch}
                      branchesCount={branchesCount}
                      showTime
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
