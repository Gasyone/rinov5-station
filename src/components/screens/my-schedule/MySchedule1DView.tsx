'use client'

import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import { MyScheduleCard } from './MyScheduleCard'
import type { UnifiedSlot } from './myScheduleTypes'

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
  if (viewMode === 'day') {
    return (
      <MyScheduleDayListView
        slots={slots}
        selectedDate={days[0] || new Date()}
        activeBranch={activeBranch}
        hideBranch={hideBranch}
        onSlotClick={onSlotClick}
      />
    )
  }

  return (
    <MyScheduleWeekListView
      slots={slots}
      days={days}
      today={today}
      activeBranch={activeBranch}
      hideBranch={hideBranch}
      onSlotClick={onSlotClick}
    />
  )
}

function MyScheduleDayListView({
  slots,
  selectedDate,
  activeBranch,
  hideBranch,
  onSlotClick,
}: {
  slots: UnifiedSlot[]
  selectedDate: Date
  activeBranch: string
  hideBranch?: boolean
  onSlotClick: (slot: UnifiedSlot) => void
}) {
  const [collapsedDayPeriods, setCollapsedDayPeriods] = useState<Record<string, boolean>>({})

  const toggleDayPeriod = (id: string) => {
    setCollapsedDayPeriods((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const dayKey = toDateKey(selectedDate)
  const daySlots = useMemo(() => {
    return slots
      .filter((s) => s.date === dayKey)
      .sort((a, b) => a.timeLabel.localeCompare(b.timeLabel))
  }, [slots, dayKey])

  const morningSlots = useMemo(() => {
    return daySlots.filter((s) => getSlotPeriod(s.timeLabel) === 'morning')
  }, [daySlots])

  const afternoonSlots = useMemo(() => {
    return daySlots.filter((s) => getSlotPeriod(s.timeLabel) === 'afternoon')
  }, [daySlots])

  const eveningSlots = useMemo(() => {
    return daySlots.filter((s) => getSlotPeriod(s.timeLabel) === 'evening')
  }, [daySlots])

  const periods = useMemo(
    () => [
      {
        id: 'morning',
        label: 'Ca Sáng (08:00 - 12:00)',
        slots: morningSlots,
        textColor: 'text-amber-700 dark:text-amber-400',
        iconColor: 'text-amber-600 dark:text-amber-400',
        lineColor: 'bg-amber-500/40 dark:bg-amber-400/35 group-hover:bg-amber-500/70',
      },
      {
        id: 'afternoon',
        label: 'Ca Chiều (12:00 - 18:00)',
        slots: afternoonSlots,
        textColor: 'text-sky-700 dark:text-sky-400',
        iconColor: 'text-sky-600 dark:text-sky-400',
        lineColor: 'bg-sky-500/40 dark:bg-sky-400/35 group-hover:bg-sky-500/70',
      },
      {
        id: 'evening',
        label: 'Ca Tối (18:00 - 22:00)',
        slots: eveningSlots,
        textColor: 'text-indigo-700 dark:text-indigo-400',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        lineColor: 'bg-indigo-500/40 dark:bg-indigo-400/35 group-hover:bg-indigo-500/70',
      },
    ],
    [morningSlots, afternoonSlots, eveningSlots]
  )

  if (daySlots.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <EmptyState
          title="Không có lịch làm việc"
          description={`Không có lịch làm việc hoặc giảng dạy nào trong ngày ${selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}.`}
        />
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto min-h-0 bg-background/50 p-2.5 space-y-3">
      <div className="space-y-2">
        {periods.map((p) => {
          if (p.slots.length === 0) return null
          const isOpen = !collapsedDayPeriods[p.id]

          return (
            <div key={p.id} className="space-y-1.5">
              <button
                type="button"
                onClick={() => toggleDayPeriod(p.id)}
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
                  {p.label} ({p.slots.length} lịch)
                </span>
                <div className={cn("h-[2px] flex-1 transition-colors rounded-full", p.lineColor)} />
              </button>

              {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {p.slots.map((slot) => (
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
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MyScheduleWeekListView({
  slots,
  days,
  today,
  activeBranch,
  hideBranch,
  onSlotClick,
}: {
  slots: UnifiedSlot[]
  days: Date[]
  today: Date
  activeBranch: string
  hideBranch?: boolean
  onSlotClick: (slot: UnifiedSlot) => void
}) {
  const [isMorningOpen, setIsMorningOpen] = useState(true)
  const [isAfternoonOpen, setIsAfternoonOpen] = useState(true)
  const [isEveningOpen, setIsEveningOpen] = useState(true)

  const morningSlotsByDay = useMemo(() => {
    return days.map((day) =>
      slots.filter((s) => s.date === toDateKey(day) && getSlotPeriod(s.timeLabel) === 'morning')
    )
  }, [days, slots])

  const afternoonSlotsByDay = useMemo(() => {
    return days.map((day) =>
      slots.filter((s) => s.date === toDateKey(day) && getSlotPeriod(s.timeLabel) === 'afternoon')
    )
  }, [days, slots])

  const eveningSlotsByDay = useMemo(() => {
    return days.map((day) =>
      slots.filter((s) => s.date === toDateKey(day) && getSlotPeriod(s.timeLabel) === 'evening')
    )
  }, [days, slots])

  const totalMorningCount = useMemo(
    () => morningSlotsByDay.reduce((acc, curr) => acc + curr.length, 0),
    [morningSlotsByDay]
  )
  const totalAfternoonCount = useMemo(
    () => afternoonSlotsByDay.reduce((acc, curr) => acc + curr.length, 0),
    [afternoonSlotsByDay]
  )
  const totalEveningCount = useMemo(
    () => eveningSlotsByDay.reduce((acc, curr) => acc + curr.length, 0),
    [eveningSlotsByDay]
  )

  const hasAnySlots = slots.length > 0

  if (!hasAnySlots) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <EmptyState
          title="Không có lịch làm việc"
          description="Không tìm thấy lịch làm việc hoặc giảng dạy nào trong tuần được chọn hoặc bộ lọc hiện tại."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden min-h-0">
      <WeekHeader days={days} today={today} slots={slots} />
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
                Ca Sáng (08:00 - 12:00) ({totalMorningCount} lịch)
              </span>
              <div className="h-[2px] flex-1 bg-amber-500/40 dark:bg-amber-400/35 group-hover:bg-amber-500/70 transition-colors rounded-full" />
            </button>

            {isMorningOpen && (
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const daySlots = morningSlotsByDay[idx]
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
                Ca Chiều (12:00 - 18:00) ({totalAfternoonCount} lịch)
              </span>
              <div className="h-[2px] flex-1 bg-sky-500/40 dark:bg-sky-400/35 group-hover:bg-sky-500/70 transition-colors rounded-full" />
            </button>

            {isAfternoonOpen && (
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const daySlots = afternoonSlotsByDay[idx]
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
                Ca Tối (18:00 - 22:00) ({totalEveningCount} lịch)
              </span>
              <div className="h-[2px] flex-1 bg-indigo-500/40 dark:bg-indigo-400/35 group-hover:bg-indigo-500/70 transition-colors rounded-full" />
            </button>

            {isEveningOpen && (
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  const daySlots = eveningSlotsByDay[idx]
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
    </div>
  )
}

function WeekHeader({
  days,
  today,
  slots,
}: {
  days: Date[]
  today: Date
  slots: UnifiedSlot[]
}) {
  return (
    <div className="flex bg-muted/30 border-b border-border/40">
      <div className="grid flex-1 grid-cols-7">
        {days.map((day) => {
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
          const daySlots = slots.filter((s) => s.date === toDateKey(day))
          const count = daySlots.length
          const weekdayStr = day.getDay() === 0 ? 'CN' : `T${day.getDay() + 1}`

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex items-center justify-center gap-1.5 py-1.5 px-1 transition-colors border-r border-border/20 last:border-r-0 text-xs min-h-[34px] overflow-hidden whitespace-nowrap select-none",
                isToday && "bg-primary/5"
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold shrink-0',
                  isToday ? 'bg-primary text-primary-foreground shadow-2xs' : 'text-foreground font-semibold'
                )}
              >
                {day.getDate()}
              </span>
              <span
                className={cn(
                  'text-xs font-semibold',
                  isToday ? 'text-primary font-bold' : 'text-muted-foreground'
                )}
              >
                {weekdayStr}
              </span>
              <span
                className={cn(
                  "text-xs",
                  count > 0 ? (isToday ? "text-primary font-semibold" : "text-muted-foreground font-medium") : "text-muted-foreground/60"
                )}
              >
                ({count})
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
