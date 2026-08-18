import { useState, useEffect, useRef, useMemo } from 'react'
import { Clock, Users } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassSession } from './calendarClassScheduleTypes'
import { SessionCard } from './SessionCardV2'
import { getSessionPeriod, toDateKey } from './calendarClassScheduleHelpers'
import { formatMinute, parseScheduleTime } from '@/components/screens/schedule/ScheduleTimeGrid'

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
  const currentTimeRef = useRef<HTMLDivElement>(null)

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

  // Filter sessions for the selected day only
  const dayKey = toDateKey(selectedDate)
  const daySessions = useMemo(() => {
    return filteredSessions.filter((session) => session.date === dayKey)
  }, [filteredSessions, dayKey])

  // Extract and sort unique shifts that actually have classes (cuts all empty time slots)
  const dayShifts = useMemo(() => {
    const shifts = daySessions.map((s) => `${s.timeLabel} - ${s.endTimeLabel}`)
    const unique = Array.from(new Set(shifts))
    return unique.sort((a, b) => {
      const timeA = a.split(' - ')[0]
      const timeB = b.split(' - ')[0]
      return parseScheduleTime(timeA) - parseScheduleTime(timeB)
    })
  }, [daySessions])

  // Auto-scroll to current time line
  const scrollToCurrentTime = (behavior: ScrollBehavior = 'smooth') => {
    if (containerRef.current && currentTimeRef.current) {
      const container = containerRef.current
      const element = currentTimeRef.current
      const elementTop = element.offsetTop
      const targetScroll = Math.max(0, elementTop - container.clientHeight / 3)
      container.scrollTo({
        top: targetScroll,
        behavior,
      })
    }
  }

  useEffect(() => {
    if (isToday) {
      const timer = setTimeout(() => {
        scrollToCurrentTime('smooth')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [selectedDate, isToday, dayShifts])

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
              Tổng cộng {daySessions.length} lớp học trên {dayShifts.length} khung giờ hoạt động (đã ẩn các khung giờ trống)
            </p>
          </div>
        </div>
      </div>

      {/* Chronological List of Shifts and Current Time Line */}
      <div className="space-y-6">
        {dayShifts.map((shift, idx) => {
          const shiftSessions = daySessions.filter(
            (s) => `${s.timeLabel} - ${s.endTimeLabel}` === shift
          )
          const [startStr, endStr] = shift.split(' - ')
          const startMin = parseScheduleTime(startStr)
          const endMin = parseScheduleTime(endStr)

          const isCurrentShift = isToday && currentMinute >= startMin && currentMinute <= endMin
          const isPassedShift = isToday && currentMinute > endMin

          // Check if current time line should appear BEFORE this shift
          const showCurrentTimeBefore = isToday && (
            (idx === 0 && currentMinute < startMin) ||
            (idx > 0 && currentMinute >= parseScheduleTime(dayShifts[idx - 1].split(' - ')[1]) && currentMinute < startMin)
          )

          const period = getSessionPeriod(startStr)
          const periodLabel = period === 'morning' ? 'Ca Sáng' : period === 'afternoon' ? 'Ca Chiều' : 'Ca Tối'
          const periodBadgeClass =
            period === 'morning'
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
              : period === 'afternoon'
              ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20'
              : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20'

          return (
            <div key={shift} className="space-y-3">
              {/* Current Time Line if before this shift */}
              {showCurrentTimeBefore && (
                <div ref={currentTimeRef} className="my-4 flex items-center gap-3 select-none">
                  <div className="flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    <span>Giờ hiện tại: {formatMinute(currentMinute)}</span>
                  </div>
                  <div className="h-[2px] flex-1 bg-red-500 shadow-xs" />
                </div>
              )}

              {/* Shift Card Container */}
              <div
                className={cn(
                  "rounded-xl border p-4 transition-all duration-200 shadow-2xs",
                  isCurrentShift
                    ? "border-red-500/50 bg-red-500/[0.03] ring-2 ring-red-500/20 shadow-md"
                    : isPassedShift
                    ? "border-border/40 bg-muted/10 opacity-80"
                    : "border-border/60 bg-card hover:border-border"
                )}
              >
                {/* Shift Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                      <Clock className="size-4 text-primary" />
                      <span>{shift}</span>
                    </div>

                    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold", periodBadgeClass)}>
                      {periodLabel}
                    </span>

                    {isCurrentShift && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        Đang diễn ra
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Users className="size-3.5" />
                    <span>{shiftSessions.length} lớp học</span>
                  </div>
                </div>

                {/* Inside Active Shift: Current Time Live Indicator */}
                {isCurrentShift && (
                  <div ref={currentTimeRef} className="mb-3 flex items-center gap-2 py-1 select-none">
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      Thời điểm hiện tại ({formatMinute(currentMinute)}) nằm trong ca học này
                    </span>
                    <div className="h-[1.5px] flex-1 bg-red-500/60" />
                  </div>
                )}

                {/* Grid of Session Cards for this shift */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {shiftSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onClick={() => onSelectSession(session)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )
        })}

        {/* Current Time Line if AFTER all shifts today */}
        {isToday && currentMinute > parseScheduleTime(dayShifts[dayShifts.length - 1].split(' - ')[1]) && (
          <div ref={currentTimeRef} className="my-6 flex items-center gap-3 select-none">
            <div className="flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>Giờ hiện tại: {formatMinute(currentMinute)} (Đã kết thúc các ca học trong ngày)</span>
            </div>
            <div className="h-[2px] flex-1 bg-red-500 shadow-xs" />
          </div>
        )}
      </div>

      {/* Floating Quick Jump Button if today is viewed */}
      {isToday && (
        <button
          type="button"
          onClick={() => scrollToCurrentTime('smooth')}
          className="sticky bottom-4 ml-auto mr-2 z-30 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl active:scale-95 cursor-pointer float-right"
          title="Cuộn tới vị trí giờ hiện tại"
        >
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span>Về giờ hiện tại ({formatMinute(currentMinute)})</span>
        </button>
      )}
    </div>
  )
}

