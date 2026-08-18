'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  formatMinute,
  layoutDayItems,
  parseScheduleTime,
  toScheduleDateKey,
} from './scheduleHelpers'
import type { ScheduleGridItem, ScheduleTimeGridProps } from './scheduleTypes'

// Re-export helpers and types for backward compatibility
export {
  formatMinute,
  getScheduleMonday,
  getScheduleWeekDays,
  parseScheduleTime,
  toScheduleDateKey,
} from './scheduleHelpers'
export type {
  ScheduleGridItem,
  ScheduleItemRenderContext,
  ScheduleTimeGridProps,
} from './scheduleTypes'

export function ScheduleTimeGrid<T extends ScheduleGridItem>({
  items,
  days,
  today,
  renderItem,
  hourStart,
  hourEnd,
  rowClassName,
  fixedWidthItems,
  autoTimeRange = true,
  showCurrentTimeIndicator = true,
  autoScrollToCurrentTime = true,
}: ScheduleTimeGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentTimeRef = useRef<HTMLDivElement>(null)

  // Real-time clock for current time line (refreshes every 30s)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  // Dynamic hour range calculation: cuts empty hours before first session and after last session
  const { computedStart, computedEnd } = useMemo(() => {
    if (hourStart !== undefined && hourEnd !== undefined && !autoTimeRange) {
      return { computedStart: hourStart, computedEnd: hourEnd }
    }

    const visibleDayKeys = new Set(days.map((d) => toScheduleDateKey(d)))
    const visibleItems = items.filter((item) => visibleDayKeys.has(item.date))

    const isTodayInDays = days.some(
      (day) =>
        day.getDate() === today.getDate() &&
        day.getMonth() === today.getMonth() &&
        day.getFullYear() === today.getFullYear()
    )

    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    if (visibleItems.length > 0) {
      const starts = visibleItems.map((i) => i.startMin)
      const ends = visibleItems.map((i) => {
        const parsed = parseScheduleTime(i.endTimeLabel)
        return parsed > 0 ? parsed : i.startMin + 60
      })

      let minM = Math.min(...starts)
      let maxM = Math.max(...ends)

      if (isTodayInDays && showCurrentTimeIndicator) {
        minM = Math.min(minM, nowMinutes)
        maxM = Math.max(maxM, nowMinutes)
      }

      // Buffer 30-60 mins before min and after max
      let startH = Math.max(0, Math.floor(minM / 60))
      let endH = Math.min(23, Math.ceil(maxM / 60) + 1)

      if (hourStart !== undefined && !autoTimeRange) startH = hourStart
      if (hourEnd !== undefined && !autoTimeRange) endH = hourEnd

      // Minimum 4-hour window for good proportion
      if (endH - startH < 4) {
        endH = Math.min(23, startH + 4)
      }

      return { computedStart: startH, computedEnd: endH }
    }

    if (isTodayInDays && showCurrentTimeIndicator) {
      const curH = now.getHours()
      const startH = Math.max(0, curH - 1)
      const endH = Math.min(23, curH + 4)
      return { computedStart: startH, computedEnd: endH }
    }

    return {
      computedStart: hourStart ?? 8,
      computedEnd: hourEnd ?? 18,
    }
  }, [items, days, today, now, hourStart, hourEnd, autoTimeRange, showCurrentTimeIndicator])

  // Generate 30-minute slots
  const first = computedStart * 60
  const last = computedEnd * 60
  const slots: number[] = []
  for (let minute = first; minute <= last; minute += 30) {
    slots.push(minute)
  }

  const totalSlots = slots.length
  const rowHeight = 76 // pixels
  const gridTemplateColumns = `4rem repeat(${days.length}, minmax(8.5rem, 1fr))`

  // Check if today is shown in days
  const isTodayInDays = days.some(
    (day) =>
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
  )

  const currentMinute = now.getHours() * 60 + now.getMinutes()
  const isCurrentTimeInRange = isTodayInDays && currentMinute >= first && currentMinute <= last
  const currentTop = isCurrentTimeInRange ? ((currentMinute - first) * (rowHeight / 30)) : null

  // Function to smooth scroll to current time
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

  // Auto focus / scroll to current time line on mount & date change
  useEffect(() => {
    if (autoScrollToCurrentTime && isCurrentTimeInRange) {
      const timer = setTimeout(() => {
        scrollToCurrentTime('smooth')
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [days, computedStart, computedEnd, autoScrollToCurrentTime, isCurrentTimeInRange])

  return (
    <div ref={containerRef} className="relative min-h-0 flex-1 overflow-auto">
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-20 grid min-w-max border-b border-border/40 bg-background/95 backdrop-blur-sm"
        style={{ gridTemplateColumns }}
      >
        <div className="border-r border-border/40 flex items-center justify-center">
          {isTodayInDays && showCurrentTimeIndicator && (
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">
              Bây giờ
            </span>
          )}
        </div>
        {days.map((day) => {
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
          const dayKey = toScheduleDateKey(day)
          const dayItems = items.filter((item) => item.date === dayKey)
          const hasScheduleType = dayItems.some((item) => 'scheduleType' in item)
          let countLabel = ''
          if (hasScheduleType) {
            const classCount = dayItems.filter((item) => (item as { scheduleType?: string }).scheduleType === 'class').length
            const eventCount = dayItems.filter((item) => (item as { scheduleType?: string }).scheduleType === 'event').length
            if (classCount > 0 && eventCount > 0) {
              countLabel = `${classCount} lớp, ${eventCount} sk`
            } else if (classCount > 0) {
              countLabel = `${classCount} lớp`
            } else if (eventCount > 0) {
              countLabel = `${eventCount} sự kiện`
            } else {
              countLabel = '0 lịch'
            }
          } else {
            countLabel = dayItems.length > 0 ? `${dayItems.length} lớp` : '0 lịch'
          }

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex min-w-0 flex-col items-center border-r border-border/40 py-2.5 last:border-r-0 transition-colors",
                isToday && "bg-primary/5"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'text-[11px] font-semibold uppercase tracking-wider',
                    isToday ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
                </span>
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold',
                    isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                  )}
                >
                  {day.getDate()}
                </span>
              </div>
              <span className="text-[9.5px] mt-1 text-muted-foreground font-semibold">
                {countLabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Grid Container */}
      <div
        className="relative min-w-max"
        style={{ height: `${totalSlots * rowHeight}px` }}
      >
        {/* Background Grid Rows (Horizontal Lines) */}
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns,
            gridTemplateRows: `repeat(${totalSlots}, ${rowHeight}px)`,
          }}
        >
          {slots.map((minute, rowIndex) => (
            <div
              key={minute}
              className="col-span-full border-b border-border/10 last:border-b-0"
              style={{
                gridColumn: '1 / -1',
                gridRow: `${rowIndex + 1}`,
                height: `${rowHeight}px`,
              }}
            />
          ))}
        </div>

        {/* Time Labels & Day Columns Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none border-r border-border/40" />
        
        {/* Current Time Line Indicator across the whole grid */}
        {showCurrentTimeIndicator && isCurrentTimeInRange && currentTop !== null && (
          <div
            className="absolute left-16 right-0 z-30 pointer-events-none flex items-center"
            style={{ top: `${currentTop}px` }}
          >
            <div className="-ml-1.5 h-3 w-3 rounded-full bg-red-600 ring-4 ring-red-500/20" />
            <div className="h-[2px] flex-1 bg-red-500 shadow-xs" />
          </div>
        )}

        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns,
            gridTemplateRows: `repeat(${totalSlots}, ${rowHeight}px)`,
          }}
        >
          {/* Time Labels */}
          {slots.map((minute, rowIndex) => (
            <div
              key={minute}
              className={cn(
                'relative pr-3 pt-2 text-right text-xs font-medium text-muted-foreground/70 select-none border-b border-border/5',
                rowClassName
              )}
              style={{
                gridColumn: '1',
                gridRow: `${rowIndex + 1}`,
                height: `${rowHeight}px`,
              }}
            >
              {formatMinute(minute)}
            </div>
          ))}

          {/* Current Time Badge in Time Column */}
          {showCurrentTimeIndicator && isCurrentTimeInRange && currentTop !== null && (
            <div
              ref={currentTimeRef}
              className="absolute right-1 z-40 -translate-y-1/2 flex items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[9.5px] font-bold text-white shadow-xs select-none"
              style={{ top: `${currentTop}px` }}
              title={`Giờ hiện tại: ${formatMinute(currentMinute)}`}
            >
              {formatMinute(currentMinute)}
            </div>
          )}

          {/* Day Columns */}
          {days.map((day, dayIndex) => {
            const dateKey = toScheduleDateKey(day)
            const dayItems = items.filter((item) => item.date === dateKey)
            const isToday =
              day.getDate() === today.getDate() &&
              day.getMonth() === today.getMonth() &&
              day.getFullYear() === today.getFullYear()

            // Calculate absolute layout positions for items on this day
            const laidOutItems = layoutDayItems(dayItems, computedStart, rowHeight, last)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative border-r border-border/30 last:border-r-0",
                  isToday && "bg-primary/[0.02]"
                )}
                style={{
                  gridColumn: `${dayIndex + 2}`,
                  gridRow: `1 / span ${totalSlots}`,
                  height: `${totalSlots * rowHeight}px`,
                }}
              >
                {laidOutItems.map(({ item, top, height, left, width }) => {
                  const overlapCount = Math.round(100 / width)
                  const overlapIndex = Math.round(left / width)
                  const styleLeft = fixedWidthItems ? `${overlapIndex * 288}px` : `${left}%`
                  const styleWidth = fixedWidthItems ? '280px' : `${width}%`
                  return (
                    <div
                      key={item.id}
                      className="absolute p-0.5"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: styleLeft,
                        width: styleWidth,
                        zIndex: 10,
                      }}
                    >
                      {renderItem(item, {
                        overlapCount,
                        overlapIndex,
                        isOverlapped: width < 99,
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Jump to Current Time Button */}
      {showCurrentTimeIndicator && isCurrentTimeInRange && (
        <button
          type="button"
          onClick={() => scrollToCurrentTime('smooth')}
          className="sticky bottom-4 ml-auto mr-4 z-40 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg transition hover:bg-red-700 hover:shadow-xl active:scale-95 cursor-pointer float-right"
          title="Cuộn nhanh tới mốc giờ hiện tại"
        >
          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span>Về giờ hiện tại ({formatMinute(currentMinute)})</span>
        </button>
      )}
    </div>
  )
}

