'use client'

import { useState, useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassRecord } from '@/mocks/classRecords'
import {
  WEEKDAYS,
  WEEKDAY_SHORT_LABELS,
  extractTimetableSlots,
} from './classesTimetableHelpers'
import { ClassesTimetableCard } from './ClassesTimetableCard'

interface ClassesTimetableViewProps {
  classes: ClassRecord[]
  onView: (classId: string) => void
  onAddStudent?: (classId: string) => void
}

export function ClassesTimetableView({
  classes,
  onView,
  onAddStudent,
}: ClassesTimetableViewProps) {
  // Accordion state
  const [isMorningOpen, setIsMorningOpen] = useState(true)
  const [isAfternoonOpen, setIsAfternoonOpen] = useState(true)
  const [isEveningOpen, setIsEveningOpen] = useState(true)

  // Cross-day highlight state
  const [hoveredClassId, setHoveredClassId] = useState<string | null>(null)
  const [pinnedClassId, setPinnedClassId] = useState<string | null>(null)

  const activeHighlightId = pinnedClassId || hoveredClassId

  // Extract all recurring slots
  const allSlots = useMemo(() => extractTimetableSlots(classes), [classes])

  // Group slots by Day and Period
  const morningSlotsByDay = useMemo(() => {
    return WEEKDAYS.map((day) => allSlots.filter((s) => s.dayOfWeek === day && s.period === 'morning'))
  }, [allSlots])

  const afternoonSlotsByDay = useMemo(() => {
    return WEEKDAYS.map((day) => allSlots.filter((s) => s.dayOfWeek === day && s.period === 'afternoon'))
  }, [allSlots])

  const eveningSlotsByDay = useMemo(() => {
    return WEEKDAYS.map((day) => allSlots.filter((s) => s.dayOfWeek === day && s.period === 'evening'))
  }, [allSlots])

  const totalMorningCount = useMemo(() => morningSlotsByDay.reduce((acc, curr) => acc + curr.length, 0), [morningSlotsByDay])
  const totalAfternoonCount = useMemo(() => afternoonSlotsByDay.reduce((acc, curr) => acc + curr.length, 0), [afternoonSlotsByDay])
  const totalEveningCount = useMemo(() => eveningSlotsByDay.reduce((acc, curr) => acc + curr.length, 0), [eveningSlotsByDay])

  const handleCardClick = (classId: string) => {
    if (pinnedClassId === classId) {
      setPinnedClassId(null)
    } else {
      setPinnedClassId(classId)
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background overflow-hidden">
      {allSlots.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <EmptyState
            title="Không có lớp học nào"
            description="Không tìm thấy lịch học nào phù hợp với bộ lọc hiện tại."
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          {/* Fixed 7-Day Header */}
          <div className="shrink-0 bg-card border-b border-border/60">
            <div className="grid grid-cols-7 divide-x divide-border/40 text-center">
              {WEEKDAYS.map((day) => {
                const daySlotsCount = allSlots.filter((s) => s.dayOfWeek === day).length
                const dayAvailableSlots = allSlots
                  .filter((s) => s.dayOfWeek === day && s.isAvailable)
                  .reduce((sum, s) => sum + s.availableSlots, 0)

                return (
                  <div key={day} className="py-2.5 px-1 bg-muted/20">
                    <h3 className="font-bold text-xs text-foreground uppercase tracking-wide">
                      {WEEKDAY_SHORT_LABELS[day]}
                    </h3>
                    <div className="mt-0.5 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                      <span>{daySlotsCount} lớp</span>
                      {dayAvailableSlots > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          ({dayAvailableSlots} slot)
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Scrollable Body with Flat Shifts */}
          <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-4">
            {/* ── Ca Sáng (08:00 - 12:00) ── */}
            {totalMorningCount > 0 && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsMorningOpen(!isMorningOpen)}
                  className="flex w-full items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>Ca Sáng (08:00 - 12:00) ({totalMorningCount} buổi lớp)</span>
                  </div>
                  <ChevronRight
                    className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isMorningOpen && 'rotate-90')}
                  />
                </button>

                {isMorningOpen && (
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKDAYS.map((day, idx) => {
                      const daySlots = morningSlotsByDay[idx]
                      return (
                        <div
                          key={`morning-${day}`}
                          className="space-y-1.5 min-w-0"
                        >
                          {daySlots.map((slot) => (
                            <ClassesTimetableCard
                              key={slot.slotId}
                              slot={slot}
                              isHighlighted={activeHighlightId === slot.classId}
                              isDimmed={Boolean(activeHighlightId && activeHighlightId !== slot.classId)}
                              isPinned={pinnedClassId === slot.classId}
                              onMouseEnter={() => setHoveredClassId(slot.classId)}
                              onMouseLeave={() => setHoveredClassId(null)}
                              onClick={() => handleCardClick(slot.classId)}
                              onView={onView}
                              onAddStudent={onAddStudent}
                            />
                          ))}
                          {daySlots.length === 0 && (
                            <div className="text-[11px] text-muted-foreground/30 text-center py-2 select-none font-mono">
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

            {/* ── Ca Chiều (12:00 - 17:30) ── */}
            {totalAfternoonCount > 0 && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsAfternoonOpen(!isAfternoonOpen)}
                  className="flex w-full items-center justify-between rounded-lg bg-sky-500/10 border border-sky-500/25 px-3 py-2 text-xs font-bold text-sky-700 dark:text-sky-400 hover:bg-sky-500/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-500 shrink-0" />
                    <span>Ca Chiều (12:00 - 17:30) ({totalAfternoonCount} buổi lớp)</span>
                  </div>
                  <ChevronRight
                    className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isAfternoonOpen && 'rotate-90')}
                  />
                </button>

                {isAfternoonOpen && (
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKDAYS.map((day, idx) => {
                      const daySlots = afternoonSlotsByDay[idx]
                      return (
                        <div
                          key={`afternoon-${day}`}
                          className="space-y-1.5 min-w-0"
                        >
                          {daySlots.map((slot) => (
                            <ClassesTimetableCard
                              key={slot.slotId}
                              slot={slot}
                              isHighlighted={activeHighlightId === slot.classId}
                              isDimmed={Boolean(activeHighlightId && activeHighlightId !== slot.classId)}
                              isPinned={pinnedClassId === slot.classId}
                              onMouseEnter={() => setHoveredClassId(slot.classId)}
                              onMouseLeave={() => setHoveredClassId(null)}
                              onClick={() => handleCardClick(slot.classId)}
                              onView={onView}
                              onAddStudent={onAddStudent}
                            />
                          ))}
                          {daySlots.length === 0 && (
                            <div className="text-[11px] text-muted-foreground/30 text-center py-2 select-none font-mono">
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

            {/* ── Ca Tối (17:30 - 21:30) ── */}
            {totalEveningCount > 0 && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsEveningOpen(!isEveningOpen)}
                  className="flex w-full items-center justify-between rounded-lg bg-indigo-500/10 border border-indigo-500/25 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>Ca Tối (17:30 - 21:30) ({totalEveningCount} buổi lớp)</span>
                  </div>
                  <ChevronRight
                    className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isEveningOpen && 'rotate-90')}
                  />
                </button>

                {isEveningOpen && (
                  <div className="grid grid-cols-7 gap-2">
                    {WEEKDAYS.map((day, idx) => {
                      const daySlots = eveningSlotsByDay[idx]
                      return (
                        <div
                          key={`evening-${day}`}
                          className="space-y-1.5 min-w-0"
                        >
                          {daySlots.map((slot) => (
                            <ClassesTimetableCard
                              key={slot.slotId}
                              slot={slot}
                              isHighlighted={activeHighlightId === slot.classId}
                              isDimmed={Boolean(activeHighlightId && activeHighlightId !== slot.classId)}
                              isPinned={pinnedClassId === slot.classId}
                              onMouseEnter={() => setHoveredClassId(slot.classId)}
                              onMouseLeave={() => setHoveredClassId(null)}
                              onClick={() => handleCardClick(slot.classId)}
                              onView={onView}
                              onAddStudent={onAddStudent}
                            />
                          ))}
                          {daySlots.length === 0 && (
                            <div className="text-[11px] text-muted-foreground/30 text-center py-2 select-none font-mono">
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
