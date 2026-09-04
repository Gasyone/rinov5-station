'use client'

import { Clock } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { ClassSession } from './DigiScheduleTypes'
import { SessionCard } from '../calendar/SessionCardV2'
import { toDateKey, DIGI_TIMELINE_SLOTS } from './DigiScheduleHelpers'

interface DigiScheduleWeekViewProps {
  weekDays: Date[]
  today: Date
  filteredSessions: ClassSession[]
  onSelectSession: (session: ClassSession) => void
  hideBranch?: boolean
}

export function DigiScheduleWeekView({
  weekDays,
  today,
  filteredSessions,
  onSelectSession,
  hideBranch = false,
}: DigiScheduleWeekViewProps) {
  const timeSlots = DIGI_TIMELINE_SLOTS // ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30']
  const hasAnySessions = filteredSessions.length > 0

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      {!hasAnySessions ? (
        <div className="flex flex-1 items-center justify-center p-8">
          <EmptyState
            title="Không tìm thấy ca học Digi nào trong tuần này"
            description="Thử chọn chi nhánh khác hoặc xóa các bộ lọc đang áp dụng."
          />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto flex flex-col h-full">
          <table className="w-full h-full min-w-[900px] border-collapse text-left table-fixed">
            {/* Colgroup: cột giờ nhỏ gọn (w-16), 7 cột ngày đều nhau */}
            <colgroup>
              <col className="w-16" />
              {weekDays.map((day) => (
                <col key={day.toISOString()} />
              ))}
            </colgroup>

            {/* Header: Cột Giờ + 7 Cột Ngày */}
            <thead className="sticky top-0 z-10 bg-card border-b border-border/60 shadow-2xs">
              <tr className="h-12">
                {/* 1. Cột Khung Giờ */}
                <th className="p-2 text-center text-xs font-bold text-muted-foreground border-r border-border/40 bg-muted/40 w-16">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Giờ</span>
                  </div>
                </th>

                {/* 2. 7 Cột Thứ 2 -> Chủ Nhật */}
                {weekDays.map((day) => {
                  const isToday =
                    day.getDate() === today.getDate() &&
                    day.getMonth() === today.getMonth() &&
                    day.getFullYear() === today.getFullYear()
                  const daySessions = filteredSessions.filter((s) => s.date === toDateKey(day))
                  const count = daySessions.length

                  return (
                    <th
                      key={day.toISOString()}
                      className={cn(
                        'p-2 text-center border-r border-border/30 last:border-r-0',
                        isToday && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className={cn(
                            'text-xs font-bold uppercase tracking-wider',
                            isToday ? 'text-primary' : 'text-muted-foreground'
                          )}
                        >
                          {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
                        </span>
                        <span
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
                            isToday
                              ? 'bg-primary text-primary-foreground shadow-xs'
                              : 'text-foreground'
                          )}
                        >
                          {day.getDate()}
                        </span>
                      </div>
                      <span className="text-xs mt-0.5 text-muted-foreground font-semibold block">
                        {count} ca
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>

            {/* Body: 6 dòng 30 phút chia đều 100% chiều cao màn hình */}
            <tbody className="divide-y divide-border/30 h-full">
              {timeSlots.map((shift) => (
                <tr key={shift} className="hover:bg-muted/5 transition-colors h-[calc(100%/6)]">
                  {/* Cột hiển thị giờ bên trái */}
                  <td className="p-2 border-r border-border/40 text-center whitespace-nowrap align-middle bg-muted/5">
                    <span className="text-xs font-bold text-muted-foreground">
                      {shift}
                    </span>
                  </td>

                  {/* 7 Cột ngày */}
                  {weekDays.map((day) => {
                    const isToday =
                      day.getDate() === today.getDate() &&
                      day.getMonth() === today.getMonth() &&
                      day.getFullYear() === today.getFullYear()
                    const dayShiftSessions = filteredSessions.filter(
                      (s) =>
                        s.date === toDateKey(day) &&
                        s.timeLabel === shift
                    )

                    return (
                      <td
                        key={day.toISOString()}
                        className={cn(
                          'p-1.5 border-r border-border/30 last:border-r-0 align-middle transition-colors h-full',
                          isToday && 'bg-primary/[0.02]'
                        )}
                      >
                        {dayShiftSessions.length > 0 ? (
                          <div className="flex flex-col gap-1 w-full h-full justify-center">
                            {dayShiftSessions.map((session) => (
                              <SessionCard
                                key={session.id}
                                session={session}
                                onClick={() => onSelectSession(session)}
                                hideBranch={hideBranch}
                                className="h-full w-full"
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="h-full min-h-[48px] flex items-center justify-center text-xs text-muted-foreground/20 select-none">
                            —
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
      )}
    </div>
  )
}
