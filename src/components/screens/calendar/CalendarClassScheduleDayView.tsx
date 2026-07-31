import { useMemo } from 'react'
import { ScheduleTimeGrid, parseScheduleTime } from '@/components/screens/schedule/ScheduleTimeGrid'
import type { ClassSession } from './calendarClassScheduleTypes'
import { SessionCard } from './SessionCardV2'
import { toDateKey } from './calendarClassScheduleHelpers'

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
  const sessionsWithStartMin = useMemo(() => {
    return filteredSessions.map((session) => ({
      ...session,
      startMin: parseScheduleTime(session.timeLabel),
    }))
  }, [filteredSessions])

  const dayHourStart = useMemo(() => {
    const dayKey = toDateKey(selectedDate)
    const daySessions = sessionsWithStartMin.filter((s) => s.date === dayKey)
    if (daySessions.length === 0) return 7
    const minStart = Math.min(...daySessions.map((s) => s.startMin))
    const startHour = Math.floor(minStart / 60)
    return Math.max(7, startHour - 1)
  }, [sessionsWithStartMin, selectedDate])

  return (
    <ScheduleTimeGrid
      items={sessionsWithStartMin}
      days={[selectedDate]}
      today={today}
      hourStart={dayHourStart}
      overlapLayout="columns"
      fixedWidthItems
      renderItem={(session) => (
        <SessionCard
          session={session}
          onClick={() => onSelectSession(session)}
        />
      )}
    />
  )
}
