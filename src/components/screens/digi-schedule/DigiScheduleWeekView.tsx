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
  const timeSlots = DIGI_TIMELINE_SLOTS
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
        <div className="min-h-0 flex-1 overflow-auto flex flex-col">
          <table className="w-full h-full min-h-full min-w-[900px] border-collapse text-left table-fixed">
            {/* Colgroup: cột giờ nhỏ gọn, 7 cột ngày đều nhau */}
            <colgroup>
              <col className="w-16" />
              {weekDays.map((day) => (
                <col key={day.toISOString()} />
              ))}
            </colgroup>

            {/* Header: Cột Giờ + 7 Cột Ngày */}
            <thead className="sticky top-0 z-10 bg-card border-b border-border/60 shadow-2xs">
              <tr>
                {/* 1. Cột Khung Giờ */}
                <th className="p-2 text-center text-[10px] font-bold text-muted-foreground border-r border-border/40 bg-muted/40">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3 text-primary" />
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
                        'p-2.5 text-center border-r border-border/30 last:border-r-0',
                        isToday && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className={cn(
                            'text-[11px] font-bold uppercase tracking-wider',
                            isToday ? 'text-primary' : 'text-muted-foreground'
                          )}
                        >
                          {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
                        </span>
                        <span
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                            isToday
                              ? 'bg-primary text-primary-foreground shadow-xs'
                              : 'text-foreground'
                          )}
                        >
                          {day.getDate()}
                        </span>
                      </div>
                      <span className="text-[10px] mt-0.5 text-muted-foreground font-semibold block">
                        {count} ca
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>

            {/* Body: Các dòng Khung giờ từ 18h - 21h (30p 1 khung) */}
            <tbody className="divide-y divide-border/30 h-full">
              {timeSlots.map((shift) => (
                <tr key={shift} className="hover:bg-muted/5 transition-colors">
                  {/* Cột hiển thị giờ bên trái — gọn, không nền/viền */}
                  <td className="p-2 border-r border-border/40 align-top text-center whitespace-nowrap pt-3">
                    <span className="text-[11px] font-bold text-muted-foreground">
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
                          'p-2 border-r border-border/30 last:border-r-0 align-top min-h-[90px] transition-colors',
                          isToday && 'bg-primary/[0.02]'
                        )}
                      >
                        {dayShiftSessions.length > 0 ? (
                          <div className="flex flex-col gap-2 w-full">
                            {dayShiftSessions.map((session) => (
                              <SessionCard
                                key={session.id}
                                session={session}
                                onClick={() => onSelectSession(session)}
                                hideBranch={hideBranch}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="h-12 flex items-center justify-center text-[10px] text-muted-foreground/30 italic select-none">
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
