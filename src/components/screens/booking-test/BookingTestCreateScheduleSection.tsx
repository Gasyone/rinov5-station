'use client'

import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FieldLabel } from '@/components/shared'
import { cn } from '@/lib/utils'
import { TIME_GROUPS } from './bookingTestCreateTypes'

interface DateOptionItem {
  dateStr: string
  label: string
}

interface BookingTestCreateScheduleSectionProps {
  mode?: 'slot_first' | 'teacher_first'
  testDate: string
  onTestDateChange: (dateStr: string) => void
  selectedSlot: string
  onSlotChange: (slot: string) => void
  dateOptions: {
    first3: DateOptionItem[]
    minCustomDateStr: string
  }
  dailySlotsSummary: Array<{
    slot: string
    availableCount: number
  }>
  selectedTeacher?: string
  teacherSlotConflicts?: Record<string, string>
}

export function BookingTestCreateScheduleSection({
  mode = 'slot_first',
  testDate,
  onTestDateChange,
  selectedSlot,
  onSlotChange,
  dateOptions,
  dailySlotsSummary,
  selectedTeacher = '',
  teacherSlotConflicts = {},
}: BookingTestCreateScheduleSectionProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const isTeacherFirst = mode === 'teacher_first'

  const isFirst3Selected = dateOptions.first3.some((d) => d.dateStr === testDate)

  const calendarSelectedDate = useMemo(() => {
    if (!testDate) return undefined
    const [yyyy, mm, dd] = testDate.split('-').map(Number)
    if (yyyy && mm && dd) {
      return new Date(yyyy, mm - 1, dd)
    }
    return undefined
  }, [testDate])

  const minDateObj = useMemo(() => {
    const [yyyy, mm, dd] = dateOptions.minCustomDateStr.split('-').map(Number)
    const d = new Date(yyyy, mm - 1, dd)
    d.setHours(0, 0, 0, 0)
    return d
  }, [dateOptions.minCustomDateStr])

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    onTestDateChange(`${yyyy}-${mm}-${dd}`)
    setDatePickerOpen(false)
  }

  return (
    <div className="space-y-3">
      {/* SECTION 1: 4 NÚT CHỌN NGÀY */}
      <div className="rounded-xl border bg-card p-3 shadow-2xs">
        <FieldLabel label="Lựa chọn Ngày đánh giá & Ca test" required>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {dateOptions.first3.map((item) => {
              const isSelected = testDate === item.dateStr
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => onTestDateChange(item.dateStr)}
                  className={cn(
                    'flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition-colors text-center truncate cursor-pointer',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                      : 'bg-background hover:bg-muted text-foreground'
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
                    'flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors text-center truncate cursor-pointer',
                    !isFirst3Selected
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                      : 'bg-background hover:bg-muted text-foreground'
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {!isFirst3Selected && testDate
                      ? (() => {
                          const parts = testDate.split('-')
                          return parts.length === 3 ? `${parts[2]}/${parts[1]}` : testDate
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
                  disabled={(date) => date < minDateObj}
                />
              </PopoverContent>
            </Popover>
          </div>
        </FieldLabel>
      </div>

      {/* SECTION 2: KHUNG GIỜ TEST (30 PHÚT/CA) */}
      <div className="rounded-xl border bg-card p-3.5 shadow-2xs space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between pb-1 border-b">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Khung giờ test (30 phút/ca)</span>
          </div>

          <span className="text-xs text-muted-foreground font-normal">
            {isTeacherFirst && selectedTeacher ? (
              <span>
                Lịch của: <span className="font-semibold text-primary">{selectedTeacher}</span>
                {selectedSlot && <span className="ml-1 text-foreground">({selectedSlot})</span>}
              </span>
            ) : (
              <span className="text-primary font-bold text-xs">Ca đang chọn: {selectedSlot}</span>
            )}
          </span>
        </div>

        <div className="space-y-3">
          {TIME_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <span>{group.icon}</span>
                <span>{group.title}</span>
                <span className="text-xs text-muted-foreground font-normal">({group.slots.length} ca)</span>
              </div>

              {/* Lưới 4 cột rộng rãi cho các ca test */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {group.slots.map((slot) => {
                  const isSlotSelected = selectedSlot === slot
                  const slotSummary = dailySlotsSummary.find((s) => s.slot === slot)
                  const generalAvailableCount = slotSummary ? slotSummary.availableCount : 0

                  // Nếu đang ở chế độ Teacher-First và có chọn Teacher
                  const hasTeacher = Boolean(selectedTeacher && selectedTeacher !== '')
                  const isTeacherBusy = hasTeacher && Boolean(teacherSlotConflicts[slot])
                  const teacherConflictDetail = hasTeacher ? teacherSlotConflicts[slot] : undefined
                  const isTeacherAvailable = hasTeacher && !isTeacherBusy

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSlotChange(slot)}
                      title={teacherConflictDetail ? `⚠️ ${teacherConflictDetail}` : undefined}
                      className={cn(
                        'flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs transition-all cursor-pointer h-9',
                        isSlotSelected
                          ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs ring-1 ring-primary/40'
                          : isTeacherFirst && hasTeacher
                          ? isTeacherAvailable
                            ? 'border-border bg-muted/20 hover:bg-muted text-foreground'
                            : 'border-border/60 bg-muted/10 text-muted-foreground opacity-60 hover:opacity-90 border-dashed'
                          : generalAvailableCount > 0
                          ? 'border-border bg-muted/20 hover:bg-muted text-foreground'
                          : 'border-border/60 bg-muted/10 text-muted-foreground opacity-60 hover:opacity-90'
                      )}
                    >
                      <span className="flex items-center gap-1.5 min-w-0">
                        <Clock className="h-3.5 w-3.5 opacity-70 shrink-0" />
                        <span className="truncate">{slot}</span>
                      </span>

                      {/* Nhãn trạng thái (chỉ hiển thị text màu xanh/đỏ, không có nền) */}
                      <span
                        className={cn(
                          'text-[10.5px] font-medium shrink-0 ml-1 transition-colors',
                          isSlotSelected
                            ? 'bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.5 rounded'
                            : isTeacherFirst && hasTeacher
                            ? isTeacherAvailable
                              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                              : 'text-rose-600 dark:text-rose-400 font-medium'
                            : generalAvailableCount > 0
                            ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                            : 'text-muted-foreground font-normal'
                        )}
                      >
                        {isSlotSelected
                          ? 'Đã chọn'
                          : isTeacherFirst && hasTeacher
                          ? isTeacherAvailable
                            ? 'Khả dụng'
                            : 'Bận'
                          : generalAvailableCount > 0
                          ? `${generalAvailableCount} rảnh`
                          : 'Hết chỗ'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
