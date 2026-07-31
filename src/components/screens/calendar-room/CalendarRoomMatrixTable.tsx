import { AlertTriangle, Users, PlusCircle, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SessionHoverCard } from '@/components/screens/calendar/SessionHoverCard'
import type { RoomRecord, RoomSessionSlot } from './calendarRoomTypes'
import { DAY_NAMES, formatLabel } from './calendarRoomHelpers'
import { cn } from '@/lib/utils'

interface CalendarRoomMatrixTableProps {
  rooms: RoomRecord[]
  viewMode: 'day' | 'week'
  weekDays?: Date[]
  onSlotClick: (room: RoomRecord, timeSlotOrDay: string) => void
  onSessionClick: (session: RoomSessionSlot) => void
}

const DAY_TIME_SLOTS = [
  { label: 'Ca Sáng (08:00 - 11:30)', time: '09:00 - 11:30' },
  { label: 'Ca Chiều (14:00 - 17:30)', time: '14:00 - 17:00' },
  { label: 'Ca Tối 1 (18:00 - 19:30)', time: '18:00 - 19:30' },
  { label: 'Ca Tối 2 (19:45 - 21:15)', time: '19:45 - 21:15' },
]

export function CalendarRoomMatrixTable({
  rooms,
  viewMode,
  weekDays = [],
  onSlotClick,
  onSessionClick,
}: CalendarRoomMatrixTableProps) {
  const safeWeekDays = Array.isArray(weekDays) ? weekDays : []

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
        <div className="text-muted-foreground font-medium mb-1">Không tìm thấy phòng học phù hợp</div>
        <div className="text-xs text-muted-foreground">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</div>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border/80 overflow-auto max-h-[calc(100vh-210px)] bg-card shadow-xs">
      <table className="w-full text-left text-sm border-collapse min-w-[900px]">
        <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-xs">
          <tr className="border-b border-border text-xs font-semibold text-muted-foreground">
            <th className="p-3 w-[220px] bg-muted/90">Phòng học & Sức chứa</th>
            {viewMode === 'day'
              ? DAY_TIME_SLOTS.map((slot) => (
                  <th key={slot.label} className="p-3 text-center min-w-[180px]">
                    {slot.label}
                  </th>
                ))
              : safeWeekDays.map((date, idx) => (
                  <th key={date.toISOString()} className="p-3 text-center min-w-[150px]">
                    <div>{DAY_NAMES[idx] || `Thứ ${idx + 2}`}</div>
                    <div className="text-[10px] text-muted-foreground/80 font-normal">
                      {formatLabel(date, { day: '2-digit', month: '2-digit' })}
                    </div>
                  </th>
                ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-muted/20 transition-colors">
              {/* Room Info Column */}
              <td className="p-3 align-top border-r border-border/40 bg-card/60 sticky left-0 z-0">
                <div className="font-semibold text-foreground">{room.roomName}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>Sức chứa: {room.capacity} chỗ</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {room.typeLabel}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground/80 mt-1 line-clamp-1">
                  {room.facilities.join(' • ')}
                </div>
              </td>

              {/* Day View Columns */}
              {viewMode === 'day' &&
                DAY_TIME_SLOTS.map((slot) => {
                  const matchedSessions = room.sessions.filter(
                    (s) =>
                      s.timeSlot === slot.time || (slot.time.includes('18:00') && s.timeSlot.includes('18:00'))
                  )
                  const isConflict = matchedSessions.length > 1
                  const hasSession = matchedSessions.length > 0

                  return (
                    <td
                      key={slot.label}
                      className={cn(
                        'p-2 align-top border-r border-border/40 text-center transition-colors',
                        isConflict && 'bg-rose-500/10 border-rose-500/30',
                        !hasSession && 'hover:bg-accent/40 cursor-pointer'
                      )}
                      onClick={() => !hasSession && onSlotClick(room, slot.time)}
                    >
                      {isConflict ? (
                        <div className="p-2 rounded border border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300 text-left">
                          <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            <span>CẢNH BÁO TRÙNG!</span>
                          </div>
                          {matchedSessions.map((s) => (
                            <div
                              key={s.id}
                              className="text-[11px] mt-1 p-1 bg-background/80 rounded border cursor-pointer hover:underline"
                              onClick={(e) => {
                                e.stopPropagation()
                                onSessionClick(s)
                              }}
                            >
                              <div className="font-semibold">{s.className}</div>
                              <div className="text-[10px] text-muted-foreground">GV: {s.teacherName}</div>
                            </div>
                          ))}
                        </div>
                      ) : hasSession ? (
                        <SessionHoverCard session={matchedSessions[0]}>
                          <div
                            className="p-2.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-left cursor-pointer hover:border-emerald-500/60 transition-all hover:shadow-md hover:ring-1 hover:ring-primary/40"
                            onClick={() => onSessionClick(matchedSessions[0])}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-xs text-foreground truncate">
                                {matchedSessions[0].className}
                              </span>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              GV: {matchedSessions[0].teacherName}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1.5 pt-1 border-t border-emerald-500/20">
                              <span>Mã: {matchedSessions[0].classCode}</span>
                              <span>{matchedSessions[0].studentCount}/{room.capacity} HV</span>
                            </div>
                          </div>
                        </SessionHoverCard>
                      ) : (
                        <div className="h-full min-h-[70px] flex flex-col items-center justify-center text-muted-foreground/60 hover:text-foreground text-xs gap-1 group">
                          <PlusCircle className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                          <span className="text-[11px]">Phòng trống</span>
                        </div>
                      )}
                    </td>
                  )
                })}

              {/* Week View Columns */}
              {viewMode === 'week' &&
                safeWeekDays.map((date, idx) => {
                  const dayName = DAY_NAMES[idx]
                  const daySessions = room.sessions.filter((s) => s.dayOfWeek === dayName)
                  const hasSession = daySessions.length > 0
                  const isConflict = daySessions.some((s) => s.status === 'conflict')

                  return (
                    <td
                      key={date.toISOString()}
                      className={cn(
                        'p-2 align-top border-r border-border/40 text-center transition-colors',
                        isConflict && 'bg-rose-500/10 border-rose-500/30',
                        !hasSession && 'hover:bg-accent/40 cursor-pointer'
                      )}
                      onClick={() => !hasSession && onSlotClick(room, dayName || '')}
                    >
                      {hasSession ? (
                        <div className="space-y-1.5">
                          {daySessions.map((s) => (
                            <SessionHoverCard key={s.id} session={s}>
                              <div
                                className={cn(
                                  'p-2 rounded border text-left cursor-pointer transition-all text-xs hover:shadow-md hover:ring-1 hover:ring-primary/40',
                                  s.status === 'conflict'
                                    ? 'border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300'
                                    : 'border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/60'
                                )}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSessionClick(s)
                                }}
                              >
                                <div className="font-bold truncate">{s.className}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                  {s.timeSlot} • GV: {s.teacherName}
                                </div>
                              </div>
                            </SessionHoverCard>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full min-h-[70px] flex flex-col items-center justify-center text-muted-foreground/60 hover:text-foreground text-xs gap-1 group">
                          <PlusCircle className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                          <span className="text-[11px]">Trống</span>
                        </div>
                      )}
                    </td>
                  )
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
