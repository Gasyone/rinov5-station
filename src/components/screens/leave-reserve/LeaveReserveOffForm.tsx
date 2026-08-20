'use client'

import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Info, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { FieldLabel } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { SessionScheduleItem } from './leaveReserveHelpers'

interface LeaveReserveOffFormProps {
  startDate: string
  onDateChange: (date: string) => void
  availableSessions: SessionScheduleItem[]
  selectedSessionIds: Set<string>
  onToggleSession: (id: string) => void
  onToggleSelectAllSessions: () => void
  quotaRemaining?: number
}

export function LeaveReserveOffForm({
  startDate,
  onDateChange,
  availableSessions,
  selectedSessionIds,
  onToggleSession,
  onToggleSelectAllSessions,
  quotaRemaining = 10,
}: LeaveReserveOffFormProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  // 1. 3 Ngày đầu tiên (Hôm nay, Ngày mai, Ngày kia) + Date formatting like booking test
  const dateOptions = useMemo(() => {
    const today = new Date()
    const formatDateStr = (d: Date) => {
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
    const formatDisplay = (d: Date, prefix: string) => {
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${prefix} (${dd}/${mm})`
    }

    const d0 = new Date(today)
    const d1 = new Date(today); d1.setDate(today.getDate() + 1)
    const d2 = new Date(today); d2.setDate(today.getDate() + 2)

    return {
      first3: [
        { dateStr: formatDateStr(d0), label: formatDisplay(d0, 'Hôm nay') },
        { dateStr: formatDateStr(d1), label: formatDisplay(d1, 'Ngày mai') },
        { dateStr: formatDateStr(d2), label: formatDisplay(d2, 'Ngày kia') },
      ],
    }
  }, [])

  const isFirst3Selected = useMemo(() => {
    return dateOptions.first3.some((item) => item.dateStr === startDate)
  }, [dateOptions.first3, startDate])

  const calendarSelectedDate = useMemo(() => {
    if (!startDate) return undefined
    const parts = startDate.split('-')
    if (parts.length === 3) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    }
    return undefined
  }, [startDate])

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const yyyy = date.getFullYear()
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const dd = String(date.getDate()).padStart(2, '0')
      onDateChange(`${yyyy}-${mm}-${dd}`)
      setDatePickerOpen(false)
    }
  }

  // Format date readable
  const dateObj = startDate ? new Date(startDate) : new Date()
  const daysOfWeek = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  const dayName = daysOfWeek[dateObj.getDay()] || 'Hôm nay'

  return (
    <div className="space-y-3 rounded-xl border border-amber-200/80 bg-amber-50/20 dark:bg-amber-950/10 p-3.5">
      {/* 4-Button Date Selector (Like Booking Ca Test) */}
      <FieldLabel label="Lựa chọn Ngày xin nghỉ phép" required>
        <div className="grid grid-cols-4 gap-2 pt-0.5">
          {dateOptions.first3.map((item) => {
            const isSelected = startDate === item.dateStr
            return (
              <button
                key={item.dateStr}
                type="button"
                onClick={() => onDateChange(item.dateStr)}
                className={cn(
                  'flex items-center justify-center rounded-lg border px-2 py-2 text-xs font-medium transition-colors text-center truncate cursor-pointer',
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-semibold'
                    : 'bg-background hover:bg-muted text-foreground border-border/80'
                )}
              >
                {item.label}
              </button>
            )
          })}

          {/* Nút 4: Ngày khác */}
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors text-center truncate cursor-pointer',
                  !isFirst3Selected && startDate
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs font-semibold'
                    : 'bg-background hover:bg-muted text-foreground border-border/80'
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {!isFirst3Selected && startDate
                    ? (() => {
                        const parts = startDate.split('-')
                        return parts.length === 3 ? `${parts[2]}/${parts[1]}` : startDate
                      })()
                    : 'Ngày khác'}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0 z-50">
              <Calendar
                mode="single"
                selected={calendarSelectedDate}
                onSelect={handleCalendarSelect}
              />
            </PopoverContent>
          </Popover>
        </div>
      </FieldLabel>

      {/* Multi-session Checklist in that Day */}
      <div className="pt-2 border-t border-amber-200/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            Các ca học trong ngày ({dayName} - {availableSessions.length} ca học):
          </span>
          {availableSessions.length > 0 && (
            <button
              type="button"
              onClick={onToggleSelectAllSessions}
              className="text-[11px] font-medium text-amber-700 hover:text-amber-900 dark:text-amber-300 underline cursor-pointer"
            >
              {selectedSessionIds.size === availableSessions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả ca'}
            </button>
          )}
        </div>

        {availableSessions.length === 0 ? (
          <div className="text-center py-4 bg-background/80 rounded-lg border border-dashed text-muted-foreground text-xs">
            Học viên không có lịch học nào trong ngày đã chọn.
          </div>
        ) : (
          <div className="space-y-2">
            {availableSessions.map((session) => {
              const isChecked = selectedSessionIds.has(session.id)
              return (
                <label
                  key={session.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer text-xs',
                    isChecked
                      ? 'bg-amber-100/70 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 shadow-2xs'
                      : 'bg-background hover:bg-muted/40 border-border/70 opacity-75'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggleSession(session.id)}
                      className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 h-4 w-4"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground truncate">
                          {session.sessionTitle}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-mono">
                          {session.classCode}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground flex-wrap">
                        <span className="text-foreground font-medium">Lớp: {session.className}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium text-amber-900 dark:text-amber-300">
                          <Clock className="h-3 w-3 text-amber-600 shrink-0" />
                          {session.time}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {session.room}
                        </span>
                        <span>•</span>
                        <span>GV: {session.teacherName}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 border ml-2',
                      isChecked
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-muted text-muted-foreground border-border/60'
                    )}
                  >
                    {isChecked ? 'Xin nghỉ ca này' : 'Đi học'}
                  </span>
                </label>
              )
            })}
          </div>
        )}

        {/* Quota Indicator */}
        <div className="flex items-center justify-between text-xs bg-background/90 rounded-lg border p-2 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-amber-600" />
            <span>Hạn mức vắng phép năm học:</span>
          </div>
          <span className="font-semibold text-foreground">
            Đã chọn nghỉ <strong className="text-amber-700 dark:text-amber-400">{selectedSessionIds.size} buổi</strong>{' '}
            <span className="text-emerald-600 font-normal">(Quota còn lại: {quotaRemaining}/12)</span>
          </span>
        </div>
      </div>
    </div>
  )
}
