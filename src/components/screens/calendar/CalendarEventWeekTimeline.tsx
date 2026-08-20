'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { EventSession } from '@/mocks/calendarSchedule'
import { EventCard } from './EventCard'
import {
  formatMinutesToTime,
  get30MinSlot,
  parseTimeToMinutes,
  toDateKey,
} from './calendarEventScheduleHelpers'

interface CalendarEventWeekTimelineProps {
  days: Date[]
  today: Date
  now: Date
  sessions: EventSession[]
  timelineSlots: string[]
  activeBranch: string
  onSelectEvent: (session: EventSession) => void
}

export function CalendarEventWeekTimeline({
  days,
  today,
  now,
  sessions,
  timelineSlots,
  activeBranch,
  onSelectEvent,
}: CalendarEventWeekTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentTimeTop, setCurrentTimeTop] = useState<number | null>(null)

  const isTodayInDays = days.some(
    (day) =>
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
  )

  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const currentSlot = get30MinSlot(formatMinutesToTime(nowMinutes))

  // Calculate current time line vertical pixel offset
  useLayoutEffect(() => {
    if (!isTodayInDays || !containerRef.current) {
      setCurrentTimeTop(null)
      return
    }

    const container = containerRef.current
    const slotEl = container.querySelector(`[data-time-slot="${currentSlot}"]`) as HTMLElement | null

    if (slotEl) {
      const slotStartMinutes = parseTimeToMinutes(currentSlot)
      const minutesIntoSlot = Math.max(0, Math.min(30, nowMinutes - slotStartMinutes))
      const fraction = minutesIntoSlot / 30
      const top = slotEl.offsetTop + fraction * slotEl.offsetHeight
      setCurrentTimeTop(top)
    } else {
      if (timelineSlots.length > 0) {
        const firstMinutes = parseTimeToMinutes(timelineSlots[0])
        const lastMinutes = parseTimeToMinutes(timelineSlots[timelineSlots.length - 1]) + 30
        if (nowMinutes < firstMinutes) {
          setCurrentTimeTop(0)
        } else if (nowMinutes > lastMinutes) {
          setCurrentTimeTop(container.scrollHeight)
        } else {
          setCurrentTimeTop(null)
        }
      } else {
        setCurrentTimeTop(null)
      }
    }
  }, [now, nowMinutes, currentSlot, timelineSlots, isTodayInDays, sessions])

  const scrollToCurrentTime = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (containerRef.current && currentTimeTop !== null) {
      const container = containerRef.current
      const targetScroll = Math.max(0, currentTimeTop - container.clientHeight / 3)
      container.scrollTo({ top: targetScroll, behavior })
    }
  }, [currentTimeTop])

  const hasCurrentTime = currentTimeTop !== null

  // Auto-scroll on mount & when days / range changes
  useEffect(() => {
    if (isTodayInDays && hasCurrentTime) {
      const timer = setTimeout(() => {
        scrollToCurrentTime('smooth')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [days, hasCurrentTime, isTodayInDays, scrollToCurrentTime])

  return (
    <div ref={containerRef} className="relative min-h-0 flex-1 overflow-y-auto">
      {/* Current Time Line Indicator across the whole grid */}
      {isTodayInDays && currentTimeTop !== null && (
        <div
          className="absolute left-16 right-0 z-30 pointer-events-none flex items-center"
          style={{ top: `${currentTimeTop}px` }}
        >
          <div className="-ml-1.5 h-3 w-3 rounded-full bg-red-600 ring-4 ring-red-500/20 shadow-xs" />
          <div className="h-[2px] flex-1 bg-red-500 shadow-xs" />
        </div>
      )}

      {/* Current Time Badge in Time Column */}
      {isTodayInDays && currentTimeTop !== null && (
        <div
          className="absolute right-[calc(100%-4rem+4px)] z-40 -translate-y-1/2 flex items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs select-none pointer-events-none"
          style={{ top: `${currentTimeTop}px` }}
          title={`Giờ hiện tại: ${formatMinutesToTime(nowMinutes)}`}
        >
          {formatMinutesToTime(nowMinutes)}
        </div>
      )}

      <div className="relative">
        {timelineSlots.map((slot) => {
          return (
            <div
              key={slot}
              data-time-slot={slot}
              className="flex min-h-[56px] border-b border-border/30"
            >
              {/* Hour label */}
              <div className="flex w-16 shrink-0 items-start justify-end pr-3 pt-2 border-r border-border/40 bg-muted/5">
                <span className="text-[11px] font-medium text-muted-foreground select-none">
                  {slot}
                </span>
              </div>

              {/* 7 Columns for this hour */}
              <div className="grid flex-1 grid-cols-7">
                {days.map((day, index) => {
                  const dayHourSessions = sessions.filter(
                    (s) => s.date === toDateKey(day) && get30MinSlot(s.timeLabel) === slot
                  )
                  const isToday =
                    day.getDate() === today.getDate() &&
                    day.getMonth() === today.getMonth() &&
                    day.getFullYear() === today.getFullYear()

                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        'p-1.5 flex flex-col gap-1.5 min-w-0 h-full justify-start transition-colors',
                        index < 6 && 'border-r border-border/30',
                        isToday && 'bg-primary/[0.02]'
                      )}
                    >
                      {dayHourSessions.map((session) => (
                        <EventCard
                          key={session.id}
                          session={session}
                          onClick={() => onSelectEvent(session)}
                          activeBranch={activeBranch}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Jump to Current Time Button */}
      {isTodayInDays && currentTimeTop !== null && (
        <button
          type="button"
          onClick={() => scrollToCurrentTime('smooth')}
          className="sticky bottom-3 ml-auto mr-3 z-40 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl active:scale-95 cursor-pointer float-right"
          title="Cuộn nhanh tới mốc giờ hiện tại"
        >
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span>Về giờ hiện tại ({formatMinutesToTime(nowMinutes)})</span>
        </button>
      )}
    </div>
  )
}
