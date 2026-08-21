'use client'

import { useMemo, useState } from 'react'
import { ChevronRight, Clock, Sun, Sunset, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MyScheduleCard } from './MyScheduleCard'
import type { UnifiedSlot } from './myScheduleTypes'
import { parseScheduleTime } from '@/components/screens/schedule/ScheduleTimeGrid'

interface MySchedule1DViewProps {
  slots: UnifiedSlot[]
  days: Date[]
  today: Date
  viewMode: 'day' | 'week'
  activeBranch: string
  hideBranch?: boolean
  onSlotClick: (slot: UnifiedSlot) => void
}

const getSlotPeriod = (timeLabel: string): 'morning' | 'afternoon' | 'evening' => {
  if (!timeLabel) return 'morning'
  const hour = parseInt(timeLabel.split(':')[0], 10)
  if (isNaN(hour)) return 'morning'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

const toDateKey = (date: Date): string => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function MySchedule1DView({
  slots,
  days,
  today,
  viewMode,
  activeBranch,
  hideBranch,
  onSlotClick,
}: MySchedule1DViewProps) {
  const [isMorningOpen, setIsMorningOpen] = useState(true)
  const [isAfternoonOpen, setIsAfternoonOpen] = useState(true)
  const [isEveningOpen, setIsEveningOpen] = useState(true)

  // Single CSS Grid container fitting 100% width across 7 equal columns
  const gridTemplateColumns = `repeat(${days.length}, minmax(0, 1fr))`

  // Sort slots chronologically
  const sortedSlots = useMemo(() => {
    return [...slots].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return (parseScheduleTime(a.timeLabel) || 0) - (parseScheduleTime(b.timeLabel) || 0)
    })
  }, [slots])

  // Group slots by day
  const slotsByDay = useMemo(() => {
    const map = new Map<string, UnifiedSlot[]>()
    days.forEach((day) => {
      map.set(toDateKey(day), [])
    })
    sortedSlots.forEach((slot) => {
      const list = map.get(slot.date)
      if (list) {
        list.push(slot)
      }
    })
    return map
  }, [days, sortedSlots])

  // Count by period across current view days
  const morningCount = useMemo(() => {
    return sortedSlots.filter(
      (s) => days.some((d) => toDateKey(d) === s.date) && getSlotPeriod(s.timeLabel) === 'morning'
    ).length
  }, [sortedSlots, days])

  const afternoonCount = useMemo(() => {
    return sortedSlots.filter(
      (s) => days.some((d) => toDateKey(d) === s.date) && getSlotPeriod(s.timeLabel) === 'afternoon'
    ).length
  }, [sortedSlots, days])

  const eveningCount = useMemo(() => {
    return sortedSlots.filter(
      (s) => days.some((d) => toDateKey(d) === s.date) && getSlotPeriod(s.timeLabel) === 'evening'
    ).length
  }, [sortedSlots, days])

  if (viewMode === 'day') {
    const singleDay = days[0]
    const dayKey = singleDay ? toDateKey(singleDay) : ''
    const daySlots = dayKey ? slotsByDay.get(dayKey) || [] : []

    const morningSlots = daySlots.filter((s) => getSlotPeriod(s.timeLabel) === 'morning')
    const afternoonSlots = daySlots.filter((s) => getSlotPeriod(s.timeLabel) === 'afternoon')
    const eveningSlots = daySlots.filter((s) => getSlotPeriod(s.timeLabel) === 'evening')

    return (
      <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-background/50 space-y-4">
        {daySlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="h-10 w-10 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">Không có lịch làm việc / giảng dạy trong ngày này.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Ca Sáng */}
            {morningSlots.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Sun className="h-4 w-4" />
                  <span>Ca Sáng (08:00 - 12:00) ({morningSlots.length} lịch)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {morningSlots.map((slot) => (
                    <MyScheduleCard
                      key={slot.id}
                      slot={slot}
                      showTime
                      activeBranch={activeBranch}
                      hideBranch={hideBranch}
                      onClick={() => onSlotClick(slot)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ca Chiều */}
            {afternoonSlots.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-xs font-bold text-sky-600 dark:text-sky-400">
                  <Sunset className="h-4 w-4" />
                  <span>Ca Chiều (12:00 - 18:00) ({afternoonSlots.length} lịch)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {afternoonSlots.map((slot) => (
                    <MyScheduleCard
                      key={slot.id}
                      slot={slot}
                      showTime
                      activeBranch={activeBranch}
                      hideBranch={hideBranch}
                      onClick={() => onSlotClick(slot)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Ca Tối */}
            {eveningSlots.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Moon className="h-4 w-4" />
                  <span>Ca Tối (18:00 - 22:00) ({eveningSlots.length} lịch)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {eveningSlots.map((slot) => (
                    <MyScheduleCard
                      key={slot.id}
                      slot={slot}
                      showTime
                      activeBranch={activeBranch}
                      hideBranch={hideBranch}
                      onClick={() => onSlotClick(slot)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Week Mode 1D Schedule Layout: Unified CSS Grid Container fitting 100% width
  return (
    <div className="flex-1 overflow-auto min-h-0 bg-background/50">
      <div
        className="grid w-full min-w-[800px] border-b border-border/40"
        style={{ gridTemplateColumns }}
      >

        {/* Sticky Week Header Row */}
        {days.map((day) => {
          const isToday = day.getTime() === today.getTime()
          const dayKey = toDateKey(day)
          const dayItems = slots.filter((item) => item.date === dayKey)
          const classCount = dayItems.filter((item) => item.scheduleType === 'class').length
          const eventCount = dayItems.filter((item) => item.scheduleType === 'event').length
          let countLabel = ''
          if (classCount > 0 && eventCount > 0) {
            countLabel = `${classCount} lớp, ${eventCount} sk`
          } else if (classCount > 0) {
            countLabel = `${classCount} lớp`
          } else if (eventCount > 0) {
            countLabel = `${eventCount} sự kiện`
          } else {
            countLabel = '0 lịch'
          }

          return (
            <div
              key={day.toISOString()}
              className="sticky top-0 z-20 flex min-w-0 flex-col items-center border-r border-b border-border/40 bg-background/95 backdrop-blur-sm py-2.5 last:border-r-0 select-none"
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

        {/* Ca Sáng Collapsible Bar (Spans All Columns) */}
        <div style={{ gridColumn: '1 / -1' }} className="border-b border-border/40">
          <button
            type="button"
            onClick={() => setIsMorningOpen(!isMorningOpen)}
            className="flex w-full items-center justify-between bg-amber-500/10 border-b border-amber-500/20 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Ca Sáng (08:00 - 12:00) ({morningCount} lịch)</span>
            </div>
            <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isMorningOpen && "rotate-90")} />
          </button>
        </div>

        {/* Ca Sáng Day Cells */}
        {isMorningOpen &&
          days.map((day) => {
            const dayKey = toDateKey(day)
            const daySlots = (slotsByDay.get(dayKey) || []).filter(
              (s) => getSlotPeriod(s.timeLabel) === 'morning'
            )

            return (
              <div
                key={`morning-${day.toISOString()}`}
                className="p-2 space-y-2 min-w-0 border-r border-b border-border/40 last:border-r-0 bg-muted/5"
              >
                {daySlots.map((slot) => (
                  <MyScheduleCard
                    key={slot.id}
                    slot={slot}
                    showTime
                    activeBranch={activeBranch}
                    hideBranch={hideBranch}
                    onClick={() => onSlotClick(slot)}
                  />
                ))}
                {daySlots.length === 0 && (
                  <div className="h-12 flex items-center justify-center text-[10px] text-muted-foreground/30 italic select-none">
                    —
                  </div>
                )}
              </div>
            )
          })}

        {/* Ca Chiều Collapsible Bar (Spans All Columns) */}
        <div style={{ gridColumn: '1 / -1' }} className="border-b border-border/40">
          <button
            type="button"
            onClick={() => setIsAfternoonOpen(!isAfternoonOpen)}
            className="flex w-full items-center justify-between bg-sky-500/10 border-b border-sky-500/20 px-3 py-2 text-xs font-bold text-sky-700 dark:text-sky-400 hover:bg-sky-500/20 transition cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Sunset className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
              <span>Ca Chiều (12:00 - 18:00) ({afternoonCount} lịch)</span>
            </div>
            <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isAfternoonOpen && "rotate-90")} />
          </button>
        </div>

        {/* Ca Chiều Day Cells */}
        {isAfternoonOpen &&
          days.map((day) => {
            const dayKey = toDateKey(day)
            const daySlots = (slotsByDay.get(dayKey) || []).filter(
              (s) => getSlotPeriod(s.timeLabel) === 'afternoon'
            )

            return (
              <div
                key={`afternoon-${day.toISOString()}`}
                className="p-2 space-y-2 min-w-0 border-r border-b border-border/40 last:border-r-0 bg-muted/5"
              >
                {daySlots.map((slot) => (
                  <MyScheduleCard
                    key={slot.id}
                    slot={slot}
                    showTime
                    activeBranch={activeBranch}
                    hideBranch={hideBranch}
                    onClick={() => onSlotClick(slot)}
                  />
                ))}
                {daySlots.length === 0 && (
                  <div className="h-12 flex items-center justify-center text-[10px] text-muted-foreground/30 italic select-none">
                    —
                  </div>
                )}
              </div>
            )
          })}

        {/* Ca Tối Collapsible Bar (Spans All Columns) */}
        <div style={{ gridColumn: '1 / -1' }} className="border-b border-border/40">
          <button
            type="button"
            onClick={() => setIsEveningOpen(!isEveningOpen)}
            className="flex w-full items-center justify-between bg-indigo-500/10 border-b border-indigo-500/20 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>Ca Tối (18:00 - 22:00) ({eveningCount} lịch)</span>
            </div>
            <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isEveningOpen && "rotate-90")} />
          </button>
        </div>

        {/* Ca Tối Day Cells */}
        {isEveningOpen &&
          days.map((day) => {
            const dayKey = toDateKey(day)
            const daySlots = (slotsByDay.get(dayKey) || []).filter(
              (s) => getSlotPeriod(s.timeLabel) === 'evening'
            )

            return (
              <div
                key={`evening-${day.toISOString()}`}
                className="p-2 space-y-2 min-w-0 border-r border-b border-border/40 last:border-r-0 bg-muted/5"
              >
                {daySlots.map((slot) => (
                  <MyScheduleCard
                    key={slot.id}
                    slot={slot}
                    showTime
                    activeBranch={activeBranch}
                    hideBranch={hideBranch}
                    onClick={() => onSlotClick(slot)}
                  />
                ))}
                {daySlots.length === 0 && (
                  <div className="h-12 flex items-center justify-center text-[10px] text-muted-foreground/30 italic select-none">
                    —
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
