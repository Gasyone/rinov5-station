'use client'

import { cn } from '@/lib/utils'
import {
  formatMinute,
  layoutDayItems,
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
  hourStart = 7,
  hourEnd = 22,
  rowClassName,
  fixedWidthItems,
}: ScheduleTimeGridProps<T>) {
  // Generate the fixed 30-minute slots
  const first = hourStart * 60
  const last = hourEnd * 60
  const slots: number[] = []
  for (let minute = first; minute <= last; minute += 30) {
    slots.push(minute)
  }

  const totalSlots = slots.length
  const rowHeight = 76 // pixels
  const gridTemplateColumns = `4rem repeat(${days.length}, minmax(8.5rem, 1fr))`

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-20 grid min-w-max border-b border-border/40 bg-background/95 backdrop-blur-sm"
        style={{ gridTemplateColumns }}
      >
        <div className="border-r border-border/40" />
        {days.map((day) => {
          const isToday = day.getTime() === today.getTime()
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
              className="flex min-w-0 flex-col items-center border-r border-border/40 py-2.5 last:border-r-0"
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
                'pr-3 pt-2 text-right text-xs font-medium text-muted-foreground/70 select-none border-b border-border/5',
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

          {/* Day Columns */}
          {days.map((day, dayIndex) => {
            const dateKey = toScheduleDateKey(day)
            const dayItems = items.filter((item) => item.date === dateKey)

            // Calculate absolute layout positions for items on this day
            const laidOutItems = layoutDayItems(dayItems, hourStart, rowHeight, last)

            return (
              <div
                key={day.toISOString()}
                className="relative border-r border-border/30 last:border-r-0"
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
    </div>
  )
}
