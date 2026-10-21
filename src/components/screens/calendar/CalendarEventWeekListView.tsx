'use client'

import { useState, useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { EventSession } from '@/mocks/calendarSchedule'
import { EventCard } from './EventCard'
import { getSessionPeriod, toDateKey } from './calendarEventScheduleHelpers'

interface CalendarEventWeekListViewProps {
  weekDays: Date[]
  today: Date
  filteredSessions: EventSession[]
  activeBranch: string
  branchesCount: number
  onSelectEvent: (session: EventSession) => void
}

export function CalendarEventWeekListView({
  weekDays,
  today,
  filteredSessions,
  activeBranch,
  branchesCount,
  onSelectEvent,
}: CalendarEventWeekListViewProps) {
  const [isMorningOpen, setIsMorningOpen] = useState(true)
  const [isAfternoonOpen, setIsAfternoonOpen] = useState(true)
  const [isEveningOpen, setIsEveningOpen] = useState(true)

  const morningSessionsByDay = useMemo(() => {
    return weekDays.map((day) =>
      filteredSessions.filter((s) => s.date === toDateKey(day) && getSessionPeriod(s.timeLabel) === 'morning')
    )
  }, [weekDays, filteredSessions])

  const afternoonSessionsByDay = useMemo(() => {
    return weekDays.map((day) =>
      filteredSessions.filter((s) => s.date === toDateKey(day) && getSessionPeriod(s.timeLabel) === 'afternoon')
    )
  }, [weekDays, filteredSessions])

  const eveningSessionsByDay = useMemo(() => {
    return weekDays.map((day) =>
      filteredSessions.filter((s) => s.date === toDateKey(day) && getSessionPeriod(s.timeLabel) === 'evening')
    )
  }, [weekDays, filteredSessions])

  const totalMorningCount = useMemo(
    () => morningSessionsByDay.reduce((acc, curr) => acc + curr.length, 0),
    [morningSessionsByDay]
  )
  const totalAfternoonCount = useMemo(
    () => afternoonSessionsByDay.reduce((acc, curr) => acc + curr.length, 0),
    [afternoonSessionsByDay]
  )
  const totalEveningCount = useMemo(
    () => eveningSessionsByDay.reduce((acc, curr) => acc + curr.length, 0),
    [eveningSessionsByDay]
  )

  const hasAnySessions = filteredSessions.length > 0

  if (!hasAnySessions) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyState
          title="Không có lịch test"
          description="Không tìm thấy lịch test nào trong tuần được chọn hoặc bộ lọc hiện tại."
        />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 bg-background/50 p-3 space-y-3">
      {/* Ca Sáng */}
      {totalMorningCount > 0 && (
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setIsMorningOpen(!isMorningOpen)}
            className="group flex w-full items-center gap-2 py-1 text-sm font-bold text-amber-700 dark:text-amber-400 hover:opacity-85 transition cursor-pointer select-none"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5",
                isMorningOpen && "rotate-90"
              )}
            />
            <span className="shrink-0">
              Ca Sáng (08:00 - 12:00) ({totalMorningCount} sự kiện)
            </span>
            <div className="h-[2px] flex-1 bg-amber-500/40 dark:bg-amber-400/35 group-hover:bg-amber-500/70 transition-colors rounded-full" />
          </button>

          {isMorningOpen && (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const daySessions = morningSessionsByDay[idx]
                const isToday =
                  day.getDate() === today.getDate() &&
                  day.getMonth() === today.getMonth() &&
                  day.getFullYear() === today.getFullYear()
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "space-y-1.5 min-w-0 p-0 transition-colors",
                      isToday && "bg-primary/[0.02] rounded-md"
                    )}
                  >
                    {daySessions.map((session) => (
                      <EventCard
                        key={session.id}
                        session={session}
                        onClick={() => onSelectEvent(session)}
                        activeBranch={activeBranch}
                        branchesCount={branchesCount}
                        showTime
                      />
                    ))}
                    {daySessions.length === 0 && (
                      <div className="text-xs text-muted-foreground/30 text-center py-2 select-none">
                        —
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Ca Chiều */}
      {totalAfternoonCount > 0 && (
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setIsAfternoonOpen(!isAfternoonOpen)}
            className="group flex w-full items-center gap-2 py-1 text-sm font-bold text-sky-700 dark:text-sky-400 hover:opacity-85 transition cursor-pointer select-none"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400 transition-transform duration-200 group-hover:translate-x-0.5",
                isAfternoonOpen && "rotate-90"
              )}
            />
            <span className="shrink-0">
              Ca Chiều (12:00 - 18:00) ({totalAfternoonCount} sự kiện)
            </span>
            <div className="h-[2px] flex-1 bg-sky-500/40 dark:bg-sky-400/35 group-hover:bg-sky-500/70 transition-colors rounded-full" />
          </button>

          {isAfternoonOpen && (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const daySessions = afternoonSessionsByDay[idx]
                const isToday =
                  day.getDate() === today.getDate() &&
                  day.getMonth() === today.getMonth() &&
                  day.getFullYear() === today.getFullYear()
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "space-y-1.5 min-w-0 p-0 transition-colors",
                      isToday && "bg-primary/[0.02] rounded-md"
                    )}
                  >
                    {daySessions.map((session) => (
                      <EventCard
                        key={session.id}
                        session={session}
                        onClick={() => onSelectEvent(session)}
                        activeBranch={activeBranch}
                        branchesCount={branchesCount}
                        showTime
                      />
                    ))}
                    {daySessions.length === 0 && (
                      <div className="text-xs text-muted-foreground/30 text-center py-2 select-none">
                        —
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Ca Tối */}
      {totalEveningCount > 0 && (
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => setIsEveningOpen(!isEveningOpen)}
            className="group flex w-full items-center gap-2 py-1 text-sm font-bold text-indigo-700 dark:text-indigo-400 hover:opacity-85 transition cursor-pointer select-none"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 transition-transform duration-200 group-hover:translate-x-0.5",
                isEveningOpen && "rotate-90"
              )}
            />
            <span className="shrink-0">
              Ca Tối (18:00 - 22:00) ({totalEveningCount} sự kiện)
            </span>
            <div className="h-[2px] flex-1 bg-indigo-500/40 dark:bg-indigo-400/35 group-hover:bg-indigo-500/70 transition-colors rounded-full" />
          </button>

          {isEveningOpen && (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const daySessions = eveningSessionsByDay[idx]
                const isToday =
                  day.getDate() === today.getDate() &&
                  day.getMonth() === today.getMonth() &&
                  day.getFullYear() === today.getFullYear()
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "space-y-1.5 min-w-0 p-0 transition-colors",
                      isToday && "bg-primary/[0.02] rounded-md"
                    )}
                  >
                    {daySessions.map((session) => (
                      <EventCard
                        key={session.id}
                        session={session}
                        onClick={() => onSelectEvent(session)}
                        activeBranch={activeBranch}
                        branchesCount={branchesCount}
                        showTime
                      />
                    ))}
                    {daySessions.length === 0 && (
                      <div className="text-xs text-muted-foreground/30 text-center py-2 select-none">
                        —
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
