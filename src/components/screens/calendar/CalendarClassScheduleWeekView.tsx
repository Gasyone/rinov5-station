import { useState, useMemo, useEffect, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassSession, WeekLayoutMode } from './calendarClassScheduleTypes'
import { SessionCard } from './SessionCardV2'
import { SessionHoverCard } from './SessionHoverCard'
import { getSessionPeriod, toDateKey } from './calendarClassScheduleHelpers'
import { formatMinute, parseScheduleTime as parseTime } from '@/components/screens/schedule/ScheduleTimeGrid'

interface CalendarClassScheduleWeekViewProps {
  weekDays: Date[]
  today: Date
  filteredSessions: ClassSession[]
  weekLayoutMode: WeekLayoutMode
  onSelectSession: (session: ClassSession) => void
}

export function CalendarClassScheduleWeekView({
  weekDays,
  today,
  filteredSessions,
  weekLayoutMode,
  onSelectSession,
}: CalendarClassScheduleWeekViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMorningOpen, setIsMorningOpen] = useState(true)
  const [isAfternoonOpen, setIsAfternoonOpen] = useState(true)
  const [isEveningOpen, setIsEveningOpen] = useState(true)
  const [activeCellModal, setActiveCellModal] = useState<{ day: Date; shift: string } | null>(null)

  // Real-time clock for current time display
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 30000)
    return () => clearInterval(timer)
  }, [])

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

  const weekShifts = useMemo(() => {
    const shifts = filteredSessions.map((s) => `${s.timeLabel} - ${s.endTimeLabel}`)
    const unique = Array.from(new Set(shifts))
    return unique.sort((a, b) => {
      const timeA = a.split(' - ')[0]
      const timeB = b.split(' - ')[0]
      return parseTime(timeA) - parseTime(timeB)
    })
  }, [filteredSessions])

  const morningShifts = useMemo(() => {
    return weekShifts.filter((shift) => getSessionPeriod(shift.split(' - ')[0]) === 'morning')
  }, [weekShifts])

  const afternoonShifts = useMemo(() => {
    return weekShifts.filter((shift) => getSessionPeriod(shift.split(' - ')[0]) === 'afternoon')
  }, [weekShifts])

  const eveningShifts = useMemo(() => {
    return weekShifts.filter((shift) => getSessionPeriod(shift.split(' - ')[0]) === 'evening')
  }, [weekShifts])

  const morningSessionsCount = useMemo(() => {
    return filteredSessions.filter((s) => getSessionPeriod(s.timeLabel) === 'morning').length
  }, [filteredSessions])

  const afternoonSessionsCount = useMemo(() => {
    return filteredSessions.filter((s) => getSessionPeriod(s.timeLabel) === 'afternoon').length
  }, [filteredSessions])

  const eveningSessionsCount = useMemo(() => {
    return filteredSessions.filter((s) => getSessionPeriod(s.timeLabel) === 'evening').length
  }, [filteredSessions])

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
      ) : weekLayoutMode === 'timeline' ? (
        <div className="flex-1 overflow-auto min-h-0 border border-border/40 rounded-lg m-3 bg-card shadow-2xs">
          <table className="w-full min-w-[1200px] border-collapse text-left table-fixed">
            <thead>
              <tr className="bg-muted/40 border-b border-border/40">
                <th className="p-3 text-xs font-semibold text-muted-foreground w-28 border-r border-border/40 text-center">
                  Ca học
                </th>
                {weekDays.map((day) => {
                  const isToday =
                    day.getDate() === today.getDate() &&
                    day.getMonth() === today.getMonth() &&
                    day.getFullYear() === today.getFullYear()
                  return (
                    <th
                      key={day.toISOString()}
                      className={cn(
                        "p-3 border-r border-border/40 last:border-r-0 text-center w-[calc(100%/7)] transition-colors",
                        isToday && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isToday ? 'text-primary' : 'text-muted-foreground')}>
                          {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
                        </span>
                        <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold', isToday ? 'bg-primary text-primary-foreground' : 'text-foreground')}>
                          {day.getDate()}
                        </span>
                      </div>
                      {isToday && (
                        <div className="mt-1 flex items-center justify-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[9px] font-bold text-red-500">
                            {formatMinute(now.getHours() * 60 + now.getMinutes())}
                          </span>
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {/* Ca Sáng (Chỉ hiển thị khi có ca sáng) */}
              {morningShifts.length > 0 && (
                <>
                  <tr className="bg-amber-500/5 border-b border-border/40 hover:bg-amber-500/10 transition cursor-pointer select-none">
                    <td colSpan={8} className="p-2.5 font-bold text-xs text-amber-700 dark:text-amber-400 align-middle" onClick={() => setIsMorningOpen(!isMorningOpen)}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                          <span>Ca Sáng ({morningSessionsCount} lớp, {morningShifts.length} ca học)</span>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isMorningOpen && "rotate-90")} />
                      </div>
                    </td>
                  </tr>
                  {isMorningOpen && morningShifts.map((shift) => (
                    <tr key={shift} className="border-b border-border/40 last:border-b-0 hover:bg-muted/5">
                      <td className="p-3 border-r border-border/40 align-middle text-center bg-muted/15 font-bold text-xs text-foreground/80 whitespace-nowrap">
                        <span className="text-[11px] font-bold text-foreground">{shift}</span>
                      </td>
                      {weekDays.map((day) => {
                        const isToday =
                          day.getDate() === today.getDate() &&
                          day.getMonth() === today.getMonth() &&
                          day.getFullYear() === today.getFullYear()
                        const dayShiftSessions = filteredSessions.filter(
                          (s) => s.date === toDateKey(day) && `${s.timeLabel} - ${s.endTimeLabel}` === shift
                        )
                        const visibleSessions = dayShiftSessions.slice(0, 4)
                        const hasMore = dayShiftSessions.length > 4
                        const remainingCount = dayShiftSessions.length - 4

                        return (
                          <td
                            key={day.toISOString()}
                            className={cn(
                              "p-2 border-r border-border/40 last:border-r-0 align-top w-[calc(100%/7)] transition-colors",
                              isToday && "bg-primary/[0.02]"
                            )}
                          >
                            {dayShiftSessions.length > 0 ? (
                              <div className="flex flex-col gap-1.5 justify-center w-full">
                                <div className="flex flex-col gap-1.5 w-full">
                                  {visibleSessions.map((session) => (
                                    <div key={session.id} className="w-full">
                                      <CompactWeekSessionCard
                                        session={session}
                                        onClick={() => onSelectSession(session)}
                                      />
                                    </div>
                                  ))}
                                  {hasMore && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveCellModal({ day, shift })
                                      }}
                                      className="flex h-8 w-full items-center justify-center rounded-md border border-dashed border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition font-bold text-[10px] cursor-pointer"
                                      title="Xem thêm"
                                    >
                                      Xem thêm +{remainingCount} lớp
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="h-10 flex items-center justify-center text-[10px] text-muted-foreground/30 italic select-none">
                                —
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </>
              )}

              {/* Ca Chiều (Chỉ hiển thị khi có ca chiều) */}
              {afternoonShifts.length > 0 && (
                <>
                  <tr className="bg-sky-500/5 border-b border-border/40 hover:bg-sky-500/10 transition cursor-pointer select-none">
                    <td colSpan={8} className="p-2.5 font-bold text-xs text-sky-700 dark:text-sky-400 align-middle" onClick={() => setIsAfternoonOpen(!isAfternoonOpen)}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0" />
                          <span>Ca Chiều ({afternoonSessionsCount} lớp, {afternoonShifts.length} ca học)</span>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isAfternoonOpen && "rotate-90")} />
                      </div>
                    </td>
                  </tr>
                  {isAfternoonOpen && afternoonShifts.map((shift) => (
                    <tr key={shift} className="border-b border-border/40 last:border-b-0 hover:bg-muted/5">
                      <td className="p-3 border-r border-border/40 align-middle text-center bg-muted/15 font-bold text-xs text-foreground/80 whitespace-nowrap">
                        <span className="text-[11px] font-bold text-foreground">{shift}</span>
                      </td>
                      {weekDays.map((day) => {
                        const isToday =
                          day.getDate() === today.getDate() &&
                          day.getMonth() === today.getMonth() &&
                          day.getFullYear() === today.getFullYear()
                        const dayShiftSessions = filteredSessions.filter(
                          (s) => s.date === toDateKey(day) && `${s.timeLabel} - ${s.endTimeLabel}` === shift
                        )
                        const visibleSessions = dayShiftSessions.slice(0, 4)
                        const hasMore = dayShiftSessions.length > 4
                        const remainingCount = dayShiftSessions.length - 4

                        return (
                          <td
                            key={day.toISOString()}
                            className={cn(
                              "p-2 border-r border-border/40 last:border-r-0 align-top w-[calc(100%/7)] transition-colors",
                              isToday && "bg-primary/[0.02]"
                            )}
                          >
                            {dayShiftSessions.length > 0 ? (
                              <div className="flex flex-col gap-1.5 justify-center w-full">
                                <div className="flex flex-col gap-1.5 w-full">
                                  {visibleSessions.map((session) => (
                                    <div key={session.id} className="w-full">
                                      <CompactWeekSessionCard
                                        session={session}
                                        onClick={() => onSelectSession(session)}
                                      />
                                    </div>
                                  ))}
                                  {hasMore && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveCellModal({ day, shift })
                                      }}
                                      className="flex h-8 w-full items-center justify-center rounded-md border border-dashed border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition font-bold text-[10px] cursor-pointer"
                                      title="Xem thêm"
                                    >
                                      Xem thêm +{remainingCount} lớp
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="h-10 flex items-center justify-center text-[10px] text-muted-foreground/30 italic select-none">
                                —
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </>
              )}

              {/* Ca Tối (Chỉ hiển thị khi có ca tối) */}
              {eveningShifts.length > 0 && (
                <>
                  <tr className="bg-indigo-500/5 border-b border-border/40 hover:bg-indigo-500/10 transition cursor-pointer select-none">
                    <td colSpan={8} className="p-2.5 font-bold text-xs text-indigo-700 dark:text-indigo-400 align-middle" onClick={() => setIsEveningOpen(!isEveningOpen)}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                          <span>Ca Tối ({eveningSessionsCount} lớp, {eveningShifts.length} ca học)</span>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isEveningOpen && "rotate-90")} />
                      </div>
                    </td>
                  </tr>
                  {isEveningOpen && eveningShifts.map((shift) => (
                    <tr key={shift} className="border-b border-border/40 last:border-b-0 hover:bg-muted/5">
                      <td className="p-3 border-r border-border/40 align-middle text-center bg-muted/15 font-bold text-xs text-foreground/80 whitespace-nowrap">
                        <span className="text-[11px] font-bold text-foreground">{shift}</span>
                      </td>
                      {weekDays.map((day) => {
                        const isToday =
                          day.getDate() === today.getDate() &&
                          day.getMonth() === today.getMonth() &&
                          day.getFullYear() === today.getFullYear()
                        const dayShiftSessions = filteredSessions.filter(
                          (s) => s.date === toDateKey(day) && `${s.timeLabel} - ${s.endTimeLabel}` === shift
                        )
                        const visibleSessions = dayShiftSessions.slice(0, 4)
                        const hasMore = dayShiftSessions.length > 4
                        const remainingCount = dayShiftSessions.length - 4

                        return (
                          <td
                            key={day.toISOString()}
                            className={cn(
                              "p-2 border-r border-border/40 last:border-r-0 align-top w-[calc(100%/7)] transition-colors",
                              isToday && "bg-primary/[0.02]"
                            )}
                          >
                            {dayShiftSessions.length > 0 ? (
                              <div className="flex flex-col gap-1.5 justify-center w-full">
                                <div className="flex flex-col gap-1.5 w-full">
                                  {visibleSessions.map((session) => (
                                    <div key={session.id} className="w-full">
                                      <CompactWeekSessionCard
                                        session={session}
                                        onClick={() => onSelectSession(session)}
                                      />
                                    </div>
                                  ))}
                                  {hasMore && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setActiveCellModal({ day, shift })
                                      }}
                                      className="flex h-8 w-full items-center justify-center rounded-md border border-dashed border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition font-bold text-[10px] cursor-pointer"
                                      title="Xem thêm"
                                    >
                                      Xem thêm +{remainingCount} lớp
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="h-10 flex items-center justify-center text-[10px] text-muted-foreground/30 italic select-none">
                                —
                              </div>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>

          <Dialog open={activeCellModal !== null} onOpenChange={(open) => { if (!open) setActiveCellModal(null) }}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold flex items-center gap-2">
                  <span>Danh sách lớp học</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-primary text-xs font-semibold">
                    {activeCellModal && activeCellModal.day.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className={cn(
                    "inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-bold border",
                    activeCellModal && getSessionPeriod(activeCellModal.shift.split(' - ')[0]) === 'morning'
                      ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                      : activeCellModal && getSessionPeriod(activeCellModal.shift.split(' - ')[0]) === 'afternoon'
                      ? "bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800"
                      : "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                  )}>
                    {activeCellModal && (
                      getSessionPeriod(activeCellModal.shift.split(' - ')[0]) === 'morning' ? 'Ca Sáng' : getSessionPeriod(activeCellModal.shift.split(' - ')[0]) === 'afternoon' ? 'Ca Chiều' : 'Ca Tối'
                    )} ({activeCellModal?.shift})
                  </span>
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1">
                {activeCellModal &&
                  filteredSessions
                    .filter(
                      (s) =>
                        s.date === toDateKey(activeCellModal.day) &&
                        `${s.timeLabel} - ${s.endTimeLabel}` === activeCellModal.shift
                    )
                    .map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onClick={() => {
                          setActiveCellModal(null)
                          onSelectSession(session)
                        }}
                      />
                    ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <WeekHeader days={weekDays} today={today} sessions={filteredSessions} now={now} />
          <div className="flex-1 overflow-y-auto min-h-0 bg-background/50 p-3 space-y-4">
            {/* Ca Sáng (Chỉ hiển thị khi có lớp ca sáng trong tuần) */}
            {totalMorningCount > 0 && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsMorningOpen(!isMorningOpen)}
                  className="flex w-full items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Ca Sáng ({totalMorningCount} lớp)</span>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isMorningOpen && "rotate-90")} />
                </button>

                {isMorningOpen && (
                  <div className="grid grid-cols-7 gap-2 border border-border/40 rounded-lg p-2 bg-muted/10">
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
                            "space-y-2 min-w-0 p-1 rounded-md transition-colors",
                            isToday && "bg-primary/[0.03]"
                          )}
                        >
                          {daySessions.map((session) => (
                            <SessionCard key={session.id} session={session} onClick={() => onSelectSession(session)} />
                          ))}
                          {daySessions.length === 0 && (
                            <div className="text-[10px] text-muted-foreground/30 text-center py-2.5 bg-muted/10 border border-dashed border-border/20 rounded-md select-none">
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
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsAfternoonOpen(!isAfternoonOpen)}
                  className="flex w-full items-center justify-between rounded-lg bg-sky-500/10 border border-sky-500/20 px-3 py-2 text-xs font-bold text-sky-700 dark:text-sky-400 hover:bg-sky-500/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-500 shrink-0" />
                    <span>Ca Chiều ({totalAfternoonCount} lớp)</span>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isAfternoonOpen && "rotate-90")} />
                </button>

                {isAfternoonOpen && (
                  <div className="grid grid-cols-7 gap-2 border border-border/40 rounded-lg p-2 bg-muted/10">
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
                            "space-y-2 min-w-0 p-1 rounded-md transition-colors",
                            isToday && "bg-primary/[0.03]"
                          )}
                        >
                          {daySessions.map((session) => (
                            <SessionCard key={session.id} session={session} onClick={() => onSelectSession(session)} />
                          ))}
                          {daySessions.length === 0 && (
                            <div className="text-[10px] text-muted-foreground/30 text-center py-2.5 bg-muted/10 border border-dashed border-border/20 rounded-md select-none">
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
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsEveningOpen(!isEveningOpen)}
                  className="flex w-full items-center justify-between rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>Ca Tối ({totalEveningCount} lớp)</span>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isEveningOpen && "rotate-90")} />
                </button>

                {isEveningOpen && (
                  <div className="grid grid-cols-7 gap-2 border border-border/40 rounded-lg p-2 bg-muted/10">
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
                            "space-y-2 min-w-0 p-1 rounded-md transition-colors",
                            isToday && "bg-primary/[0.03]"
                          )}
                        >
                          {daySessions.map((session) => (
                            <SessionCard key={session.id} session={session} onClick={() => onSelectSession(session)} />
                          ))}
                          {daySessions.length === 0 && (
                            <div className="text-[10px] text-muted-foreground/30 text-center py-2.5 bg-muted/10 border border-dashed border-border/20 rounded-md select-none">
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
  now,
}: {
  days: Date[]
  today: Date
  sessions: ClassSession[]
  now: Date
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
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex flex-col items-center justify-center py-2.5 transition-colors border-r border-border/20 last:border-r-0",
                isToday && "bg-primary/5"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isToday ? 'text-primary' : 'text-muted-foreground')}>
                  {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
                </span>
                <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold', isToday ? 'bg-primary text-primary-foreground' : 'text-foreground')}>
                  {day.getDate()}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9.5px] text-muted-foreground font-semibold">
                  {count} lớp
                </span>
                {isToday && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-1.5 py-0.2 text-[8px] font-bold text-red-600 dark:text-red-400">
                    <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                    {formatMinute(now.getHours() * 60 + now.getMinutes())}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CompactWeekSessionCard({ session, onClick }: { session: ClassSession; onClick: () => void }) {
  const activeTeacher = session.substituteTeacher || session.teacher
  const isCancelled = session.status === 'cancelled'

  let bgClass = 'bg-card hover:bg-accent/60'
  if (isCancelled) {
    bgClass = 'bg-zinc-50/40 dark:bg-zinc-900/20 opacity-50 border border-zinc-200/40 dark:border-zinc-800/40 cursor-not-allowed select-none pointer-events-none'
  } else if (session.isOpeningDay) {
    bgClass = 'bg-red-50/80 hover:bg-red-100/80 dark:bg-red-950/30 dark:hover:bg-red-950/50 border border-red-300 dark:border-red-800 shadow-xs'
  } else if (session.substituteTeacher) {
    bgClass = 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 shadow-2xs'
  } else if (session.dateBucket === 'past') {
    bgClass = 'bg-zinc-100/90 hover:bg-zinc-200/90 dark:bg-zinc-800/50 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60'
  } else if (session.dateBucket === 'today') {
    bgClass = 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs'
  } else if (session.dateBucket === 'upcoming') {
    bgClass = 'bg-card hover:bg-accent/60 border border-border dark:border-zinc-800/60 shadow-2xs'
  }

  return (
    <SessionHoverCard session={session}>
      <div
        onClick={onClick}
        className={cn(
          "group relative flex flex-col justify-center overflow-hidden rounded-md text-left shadow-2xs transition cursor-pointer p-1.5 h-full border text-[10px] leading-tight",
          bgClass
        )}
      >
        {session.isOpeningDay && (
          <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
        )}
        <div className={cn("truncate font-bold text-foreground flex items-center gap-1", session.isOpeningDay && "pl-1")}>
          <span className="truncate">{session.classCode} - {session.subject}</span>
          <span className="text-muted-foreground font-normal">({session.level})</span>
        </div>
        <div className={cn("mt-0.5 truncate text-[9.5px] text-muted-foreground flex items-center justify-between", session.isOpeningDay && "pl-1")}>
          <span>{session.totalStudents} HS</span>
          <span className="font-semibold text-foreground/80 truncate max-w-[60%]">{activeTeacher}</span>
        </div>
      </div>
    </SessionHoverCard>
  )
}
