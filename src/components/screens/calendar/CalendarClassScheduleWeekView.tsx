import { useState, useMemo, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassSession } from './calendarClassScheduleTypes'
import { SessionCard } from './SessionCardV2'
import { getSessionPeriod, toDateKey } from './calendarClassScheduleHelpers'

interface CalendarClassScheduleWeekViewProps {
  weekDays: Date[]
  today: Date
  filteredSessions: ClassSession[]
  onSelectSession: (session: ClassSession) => void
}

export function CalendarClassScheduleWeekView({
  weekDays,
  today,
  filteredSessions,
  onSelectSession,
}: CalendarClassScheduleWeekViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
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

  const totalMorningCount = useMemo(() => morningSessionsByDay.reduce((acc, curr) => acc + curr.length, 0), [morningSessionsByDay])
  const totalAfternoonCount = useMemo(() => afternoonSessionsByDay.reduce((acc, curr) => acc + curr.length, 0), [afternoonSessionsByDay])
  const totalEveningCount = useMemo(() => eveningSessionsByDay.reduce((acc, curr) => acc + curr.length, 0), [eveningSessionsByDay])

  const hasAnySessions = filteredSessions.length > 0

  return (
    <div ref={containerRef} className="flex flex-1 flex-col overflow-hidden min-h-0">
      {!hasAnySessions ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <EmptyState
            title="Không có lịch học"
            description="Không tìm thấy lịch học nào trong tuần được chọn hoặc bộ lọc hiện tại."
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <WeekHeader days={weekDays} today={today} sessions={filteredSessions} />
          <div className="flex-1 overflow-y-auto min-h-0 bg-background/50 p-2 space-y-2">
            {/* Ca Sáng (Chỉ hiển thị khi có lớp ca sáng trong tuần) */}
            {totalMorningCount > 0 && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsMorningOpen(!isMorningOpen)}
                  className="group flex w-full items-center gap-1.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:opacity-85 transition cursor-pointer select-none"
                >
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5",
                      isMorningOpen && "rotate-90"
                    )}
                  />
                  <span className="shrink-0">
                    Ca Sáng (08:00 - 12:00) ({totalMorningCount} buổi)
                  </span>
                  <div className="h-[2px] flex-1 bg-amber-500/40 dark:bg-amber-400/35 group-hover:bg-amber-500/70 transition-colors rounded-full" />
                </button>

                {isMorningOpen && (
                  <div className="grid grid-cols-7 gap-1.5">
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
                            "space-y-1 min-w-0 p-0 transition-colors",
                            isToday && "bg-primary/[0.02] rounded-md"
                          )}
                        >
                          {daySessions.map((session) => (
                            <SessionCard key={session.id} session={session} onClick={() => onSelectSession(session)} />
                          ))}
                          {daySessions.length === 0 && (
                            <div className="text-xs text-muted-foreground/30 text-center py-1 select-none">
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

            {/* Ca Chiều (Chỉ hiển thị khi có lớp ca chiều trong tuần) */}
            {totalAfternoonCount > 0 && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsAfternoonOpen(!isAfternoonOpen)}
                  className="group flex w-full items-center gap-1.5 py-1 text-xs font-bold text-sky-700 dark:text-sky-400 hover:opacity-85 transition cursor-pointer select-none"
                >
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400 transition-transform duration-200 group-hover:translate-x-0.5",
                      isAfternoonOpen && "rotate-90"
                    )}
                  />
                  <span className="shrink-0">
                    Ca Chiều (12:00 - 18:00) ({totalAfternoonCount} buổi)
                  </span>
                  <div className="h-[2px] flex-1 bg-sky-500/40 dark:bg-sky-400/35 group-hover:bg-sky-500/70 transition-colors rounded-full" />
                </button>

                {isAfternoonOpen && (
                  <div className="grid grid-cols-7 gap-1.5">
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
                            "space-y-1 min-w-0 p-0 transition-colors",
                            isToday && "bg-primary/[0.02] rounded-md"
                          )}
                        >
                          {daySessions.map((session) => (
                            <SessionCard key={session.id} session={session} onClick={() => onSelectSession(session)} />
                          ))}
                          {daySessions.length === 0 && (
                            <div className="text-xs text-muted-foreground/30 text-center py-1 select-none">
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

            {/* Ca Tối (Chỉ hiển thị khi có lớp ca tối trong tuần) */}
            {totalEveningCount > 0 && (
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsEveningOpen(!isEveningOpen)}
                  className="group flex w-full items-center gap-1.5 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:opacity-85 transition cursor-pointer select-none"
                >
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400 transition-transform duration-200 group-hover:translate-x-0.5",
                      isEveningOpen && "rotate-90"
                    )}
                  />
                  <span className="shrink-0">
                    Ca Tối (18:00 - 22:00) ({totalEveningCount} buổi)
                  </span>
                  <div className="h-[2px] flex-1 bg-indigo-500/40 dark:bg-indigo-400/35 group-hover:bg-indigo-500/70 transition-colors rounded-full" />
                </button>

                {isEveningOpen && (
                  <div className="grid grid-cols-7 gap-1.5">
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
                            "space-y-1 min-w-0 p-0 transition-colors",
                            isToday && "bg-primary/[0.02] rounded-md"
                          )}
                        >
                          {daySessions.map((session) => (
                            <SessionCard key={session.id} session={session} onClick={() => onSelectSession(session)} />
                          ))}
                          {daySessions.length === 0 && (
                            <div className="text-xs text-muted-foreground/30 text-center py-1 select-none">
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
        </div>
      )}
    </div>
  )
}

function WeekHeader({
  days,
  today,
  sessions,
}: {
  days: Date[]
  today: Date
  sessions: ClassSession[]
}) {
  return (
    <div className="flex bg-muted/30 border-b border-border/40">
      <div className="grid flex-1 grid-cols-7">
        {days.map((day) => {
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
          const daySessions = sessions.filter((s) => s.date === toDateKey(day))
          const count = daySessions.length
          const weekdayStr = day.getDay() === 0 ? 'CN' : `T${day.getDay() + 1}`

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1 px-1 transition-colors border-r border-border/20 last:border-r-0 text-xs min-h-[28px] overflow-hidden whitespace-nowrap",
                isToday && "bg-primary/5"
              )}
            >
              <span className={cn(
                'flex h-4.5 w-4.5 items-center justify-center rounded-full text-[11px] font-bold shrink-0',
                isToday ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-foreground font-semibold'
              )}>
                {day.getDate()}
              </span>
              <span className={cn('text-[11px] font-medium', isToday ? 'text-primary font-bold' : 'text-muted-foreground')}>
                {weekdayStr}
              </span>
              <span className={cn(
                "text-[11px]",
                count > 0 ? (isToday ? "text-primary font-semibold" : "text-muted-foreground font-medium") : "text-muted-foreground/60"
              )}>
                ({count})
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}



