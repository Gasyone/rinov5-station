'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FieldLabel } from '@/components/shared'
import { SegmentedControl } from '@/components/controls'
import { cn } from '@/lib/utils'
import { TIME_GROUPS } from './bookingTestCreateTypes'

type PeriodType = 'morning' | 'afternoon' | 'evening' | 'all'

function getSessionForSlot(slot: string): PeriodType {
  if (TIME_GROUPS[0].slots.includes(slot)) return 'morning'
  if (TIME_GROUPS[1].slots.includes(slot)) return 'afternoon'
  if (TIME_GROUPS[2].slots.includes(slot)) return 'evening'
  return 'morning'
}

const PERIOD_OPTIONS: Array<{ value: PeriodType; label: string }> = [
  { value: 'morning', label: '☀️ Sáng (8)' },
  { value: 'afternoon', label: '🌤 Chiều (9)' },
  { value: 'evening', label: '🌙 Tối (8)' },
  { value: 'all', label: 'Tất cả (25)' },
]

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

  const [activePeriod, setActivePeriod] = useState<PeriodType>(() =>
    selectedSlot ? getSessionForSlot(selectedSlot) : 'morning'
  )

  useEffect(() => {
    if (selectedSlot && activePeriod !== 'all') {
      const slotPeriod = getSessionForSlot(selectedSlot)
      if (slotPeriod !== activePeriod) {
        setActivePeriod(slotPeriod)
      }
    }
  }, [selectedSlot])

  const displayedGroups = useMemo(() => {
    if (activePeriod === 'morning') {
      return TIME_GROUPS.filter((g) => g.title === 'Buổi sáng')
    }
    if (activePeriod === 'afternoon') {
      return TIME_GROUPS.filter((g) => g.title === 'Buổi chiều')
    }
    if (activePeriod === 'evening') {
      return TIME_GROUPS.filter((g) => g.title === 'Buổi tối')
    }
    return TIME_GROUPS
  }, [activePeriod])

  return (
    <div className="space-y-3">
      {/* SECTION 1: 4 NÚT CHỌN NGÀY (BỎ VIỀN VÀ NỀN) */}
      <div className="space-y-1">
        <FieldLabel label="Lựa chọn Ngày đánh giá & Ca test" required>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
            {dateOptions.first3.map((item) => {
              const isSelected = testDate === item.dateStr
              return (
                <button
                  key={item.dateStr}
                  type="button"
                  onClick={() => onTestDateChange(item.dateStr)}
                  className={cn(
                    'flex items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium transition-colors text-center truncate cursor-pointer h-8',
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
                    'flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors text-center truncate cursor-pointer h-8',
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
      <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1.5 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 shrink-0">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Khung giờ test</span>
            </span>

            {isTeacherFirst && selectedTeacher ? (
              <span className="text-[11px] text-muted-foreground font-normal truncate max-w-[160px] sm:max-w-none">
                Lịch: <span className="font-semibold text-primary">{selectedTeacher}</span>
                {selectedSlot && <span className="ml-1 text-foreground">({selectedSlot})</span>}
              </span>
            ) : selectedSlot ? (
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md shrink-0">
                Ca: {selectedSlot}
              </span>
            ) : null}
          </div>

          <SegmentedControl
            value={activePeriod}
            onValueChange={(val) => setActivePeriod(val as PeriodType)}
            options={PERIOD_OPTIONS}
            className="h-6.5 p-0.5 bg-muted/60 shrink-0"
            itemClassName="h-5.5 px-2 text-[11px] font-medium"
          />
        </div>

        <div className="space-y-2">
          {displayedGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {activePeriod === 'all' && (
                <div className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                  <span>{group.icon}</span>
                  <span>{group.title}</span>
                  <span className="text-[11px] text-muted-foreground font-normal">({group.slots.length} ca)</span>
                </div>
              )}

              {/* Lưới 4 cột rộng rãi cho các ca test */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
                        'flex items-center justify-between rounded-md border px-2 py-1 text-xs transition-all cursor-pointer h-8',
                        isSlotSelected
                          ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs ring-1 ring-primary/40'
                          : isTeacherFirst && hasTeacher
                          ? isTeacherAvailable
                            ? 'border-border/70 bg-background hover:bg-muted/50 text-foreground'
                            : 'border-border/50 bg-background/50 text-muted-foreground opacity-60 hover:opacity-90 border-dashed'
                          : generalAvailableCount > 0
                          ? 'border-border/70 bg-background hover:bg-muted/50 text-foreground'
                          : 'border-border/50 bg-background/50 text-muted-foreground opacity-60 hover:opacity-90'
                      )}
                    >
                      <span className="font-semibold text-xs tabular-nums shrink-0">
                        {slot}
                      </span>

                      {/* Nhãn trạng thái */}
                      <span
                        className={cn(
                          'text-[11px] font-medium shrink-0 ml-1 transition-colors truncate',
                          isSlotSelected
                            ? 'bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.2 rounded font-semibold'
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
