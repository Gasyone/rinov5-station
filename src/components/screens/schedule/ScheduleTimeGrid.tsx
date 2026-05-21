'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface ScheduleGridItem {
  id: string
  date: string
  timeLabel: string
  endTimeLabel: string
  startMin: number
}

interface ScheduleTimeGridProps<T extends ScheduleGridItem> {
  items: T[]
  days: Date[]
  today: Date
  renderItem: (item: T) => ReactNode
  hourStart?: number
  hourEnd?: number
  rowClassName?: string
}

const pad = (value: number) => String(value).padStart(2, '0')

export const toScheduleDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const getScheduleMonday = (input: Date) => {
  const date = new Date(input)
  const day = date.getDay()
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  date.setHours(0, 0, 0, 0)
  return date
}

export const getScheduleWeekDays = (from: Date) =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from)
    date.setDate(date.getDate() + index)
    date.setHours(0, 0, 0, 0)
    return date
  })

export const parseScheduleTime = (time: string) => {
  const [hour = 0, minute = 0] = time.split(':').map(Number)
  return hour * 60 + minute
}

const formatMinute = (minute: number) =>
  `${pad(Math.floor(minute / 60))}:${pad(minute % 60)}`

const buildSlots = <T extends ScheduleGridItem>(
  items: T[],
  hourStart: number,
  hourEnd: number
) => {
  const first = hourStart * 60
  const last = hourEnd * 60
  const slots = new Set<number>()

  for (let minute = first; minute <= last; minute += 30) {
    slots.add(minute)
  }

  items.forEach((item) => {
    if (item.startMin >= first && item.startMin <= last) {
      slots.add(item.startMin)
    }
  })

  return Array.from(slots).sort((a, b) => a - b)
}

export function ScheduleTimeGrid<T extends ScheduleGridItem>({
  items,
  days,
  today,
  renderItem,
  hourStart = 7,
  hourEnd = 22,
  rowClassName,
}: ScheduleTimeGridProps<T>) {
  const slots = buildSlots(items, hourStart, hourEnd)
  const gridTemplateColumns = `4rem repeat(${days.length}, minmax(8.5rem, 1fr))`

  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <div
        className="sticky top-0 z-20 grid min-w-max border-b border-border/40 bg-background/95 backdrop-blur-sm"
        style={{ gridTemplateColumns }}
      >
        <div className="border-r border-border/40" />
        {days.map((day) => {
          const isToday = day.getTime() === today.getTime()
          return (
            <div
              key={day.toISOString()}
              className="flex min-w-0 flex-col items-center border-r border-border/40 py-2 last:border-r-0"
            >
              <span
                className={cn(
                  'text-[11px] font-medium',
                  isToday ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
              </span>
              <div
                className={cn(
                  'mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                  isToday ? 'bg-primary text-primary-foreground' : ''
                )}
              >
                {day.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      <div className="min-w-max divide-y divide-border/10">
        {slots.map((minute) => (
          <div
            key={minute}
            className={cn('grid min-h-[76px]', rowClassName)}
            style={{ gridTemplateColumns }}
          >
            <div className="border-r border-border/40 pr-3 pt-2 text-right text-xs font-medium text-muted-foreground/70">
              {formatMinute(minute)}
            </div>
            {days.map((day) => {
              const dateKey = toScheduleDateKey(day)
              const cellItems = items.filter(
                (item) => item.date === dateKey && item.startMin === minute
              )

              return (
                <div
                  key={`${day.toISOString()}-${minute}`}
                  className="min-w-0 border-r border-border/30 px-1.5 py-1.5 last:border-r-0"
                >
                  <div className="space-y-1.5">
                    {cellItems.map((item) => (
                      <div key={item.id}>{renderItem(item)}</div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
