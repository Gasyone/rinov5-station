import { AlertTriangle, CheckCircle2, PlusCircle, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SessionHoverCard } from '@/components/screens/calendar/SessionHoverCard'
import type { ClassSessionV2, RoomRowRecord } from './calendarClassV2Types'
import { DAY_NAMES, formatLabel } from './calendarClassV2Helpers'
import { cn } from '@/lib/utils'

interface CalendarClassV2RoomMatrixProps {
  rooms: RoomRowRecord[]
  weekDays: Date[]
  onSlotClick: (room: RoomRowRecord, dayName: string) => void
  onSessionClick: (session: ClassSessionV2) => void
}

export function CalendarClassV2RoomMatrix({
  rooms,
  weekDays = [],
  onSlotClick,
  onSessionClick,
}: CalendarClassV2RoomMatrixProps) {
  const safeWeekDays = Array.isArray(weekDays) ? weekDays : []

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
        <div className="text-muted-foreground font-medium mb-1">Không tìm thấy phòng học phù hợp</div>
        <div className="text-xs text-muted-foreground">Thử điều chỉnh bộ lọc hoặc chọn chi nhánh khác.</div>
      </div>
    )
  }

  return (
    <div className="h-full flex-1 min-h-0 rounded-md border border-border/80 overflow-auto bg-card shadow-xs">
      <table className="w-full table-fixed text-left text-sm border-collapse min-w-[1100px]">
        <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-xs">
          <tr className="border-b border-border text-xs font-semibold text-muted-foreground">
            <th className="p-3 w-[200px] shrink-0 bg-muted/90">Phòng học & Sức chứa</th>
            {safeWeekDays.map((date, idx) => (
              <th key={date.toISOString()} className="p-3 text-center w-[calc((100%-200px)/7)]">
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
              {/* Room Info Header Cell */}
              <td className="p-3 align-top w-[200px] border-r border-border/40 bg-card/60 sticky left-0 z-0">
                <div className="font-semibold text-foreground truncate">{room.roomName}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>Sức chứa: {room.capacity} chỗ</span>
                </div>
                <Badge variant="outline" className="text-[10px] mt-1 px-1.5 py-0">
                  {room.typeLabel}
                </Badge>
              </td>

              {/* 7 Days Columns */}
              {safeWeekDays.map((date, idx) => {
                const dayName = DAY_NAMES[idx]
                const daySessions = room.sessions.filter((s) => s.dayOfWeek === dayName)
                const hasSession = daySessions.length > 0

                return (
                  <td
                    key={date.toISOString()}
                    className={cn(
                      'p-2 align-top w-[calc((100%-200px)/7)] border-r border-border/40 text-center transition-colors',
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
                                'p-1.5 rounded border text-left cursor-pointer transition-all hover:shadow-xs hover:ring-1 hover:ring-primary/40',
                                s.status === 'conflict'
                                  ? 'border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300'
                                  : s.status === 'opening'
                                    ? 'border-red-500/30 bg-red-500/10 hover:border-red-500/60'
                                    : s.status === 'substitute'
                                      ? 'border-sky-500/30 bg-sky-500/10 hover:border-sky-500/60'
                                      : 'border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/60'
                              )}
                              onClick={(e) => {
                                e.stopPropagation()
                                onSessionClick(s)
                              }}
                            >
                              {/* Dòng 1: Tên lớp + Icon trạng thái */}
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs text-foreground truncate">
                                  {s.className}
                                </span>
                                {s.status === 'conflict' ? (
                                  <AlertTriangle className="h-3 w-3 text-rose-600 dark:text-rose-400 shrink-0" />
                                ) : (
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                )}
                              </div>
                              {/* Dòng 2: Khung giờ, Giáo viên & Sĩ số */}
                              <div className="flex items-center justify-between gap-1 text-[10px] text-muted-foreground mt-0.5">
                                <span className="truncate">
                                  {s.timeSlot} • GV: {s.substituteTeacher ? `${s.substituteTeacher} (Dạy thay)` : s.teacherName}
                                </span>
                                <span className="shrink-0 font-medium">{s.attendedStudents}/{s.totalStudents} HS</span>
                              </div>
                            </div>
                          </SessionHoverCard>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full min-h-[70px] flex flex-col items-center justify-center text-muted-foreground/60 hover:text-foreground text-xs gap-1 group">
                        <PlusCircle className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[11px]">Phòng trống</span>
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
