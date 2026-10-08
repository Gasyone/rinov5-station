'use client'

import { useMemo, useState } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { TIME_GROUPS, getSlotTimeRange } from './bookingTestCreateTypes'

type PeriodType = 'morning' | 'afternoon' | 'evening' | 'all'

function getSessionForSlot(slot: string): PeriodType {
  if (TIME_GROUPS[0].slots.includes(slot)) return 'morning'
  if (TIME_GROUPS[1].slots.includes(slot)) return 'afternoon'
  if (TIME_GROUPS[2].slots.includes(slot)) return 'evening'
  return 'morning'
}

const PERIOD_OPTIONS: Array<{ value: PeriodType; label: string }> = [
  { value: 'morning', label: '☀️ Sáng' },
  { value: 'afternoon', label: '🌤 Chiều' },
  { value: 'evening', label: '🌙 Tối' },
  { value: 'all', label: 'Tất cả' },
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
    first4: DateOptionItem[]
    minCustomDateStr: string
  }
  dailySlotsSummary: Array<{
    slot: string
    availableCount: number
  }>
  selectedTeacher?: string
  teacherSlotConflicts?: Record<string, string>
  school?: string
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
  school = '',
}: BookingTestCreateScheduleSectionProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const isTeacherFirst = mode === 'teacher_first'
  const hasFacilityAndDate = Boolean(school && testDate)

  const isFirst4Selected = dateOptions.first4.some((d) => d.dateStr === testDate)

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
  const [prevSelectedSlot, setPrevSelectedSlot] = useState(selectedSlot)

  if (selectedSlot !== prevSelectedSlot) {
    setPrevSelectedSlot(selectedSlot)
    if (activePeriod !== 'all') {
      const slotPeriod = getSessionForSlot(selectedSlot)
      if (slotPeriod !== activePeriod) {
        setActivePeriod(slotPeriod)
      }
    }
  }

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
    /* DUY NHẤT 1 SECTION GỘP CHỌN NGÀY VÀ KHUNG GIỜ TEST */
    <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2.5">
      {/* PHẦN 1: 5 NÚT CHỌN NGÀY ĐẦU ĐỦ (KHÔNG CÒN TEXT NGÀY VÀ TAG NAY/MAI) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {dateOptions.first4.map((item) => {
          const isSelected = testDate === item.dateStr
          return (
            <button
              key={item.dateStr}
              type="button"
              onClick={() => onTestDateChange(item.dateStr)}
              className={cn(
                'flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium transition-colors text-center truncate cursor-pointer h-8',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                  : 'bg-background hover:bg-muted text-foreground'
              )}
            >
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}

        {/* Nút 5: Ngày khác */}
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors text-center truncate cursor-pointer h-8',
                testDate && !isFirst4Selected
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                  : 'bg-background hover:bg-muted text-foreground'
              )}
            >
              <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {testDate && !isFirst4Selected
                  ? (() => {
                      const parts = testDate.split('-').map(Number)
                      if (parts.length === 3) {
                        const d = new Date(parts[0], parts[1] - 1, parts[2])
                        const day = d.getDay()
                        const dayShort = day === 0 ? 'CN' : `T${day + 1}`
                        const dd = String(parts[2]).padStart(2, '0')
                        const mm = String(parts[1]).padStart(2, '0')
                        return `${dayShort}, ${dd}/${mm}`
                      }
                      return testDate
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

      {/* DẢI PHÂN CÁCH NHẸ GIỮA CHỌN NGÀY VÀ BẢNG KHUNG GIỜ */}
      <div className="border-t border-border/60" />

      {/* PHẦN 2: THANH PHÂN ĐOẠN BUỔI Ở TRÊN + LƯỚI KHUNG GIỜ TEST Ở DƯỚI (PHƯƠNG ÁN 2) */}
      <div className="space-y-2.5">
        {/* Thanh Tabs Buổi (Nền xám nhạt trung tính, không dùng màu xanh để tránh lẫn với giờ được chọn) */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex rounded-lg bg-muted/70 p-0.5 border border-border/60">
            {PERIOD_OPTIONS.map((opt) => {
              const isSelected = activePeriod === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setActivePeriod(opt.value)}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1',
                    isSelected
                      ? 'bg-background text-foreground font-bold shadow-xs border border-border/50'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span>{opt.label}</span>
                </button>
              )
            })}
          </div>

          {/* Thông tin ngữ cảnh */}
          {!hasFacilityAndDate ? (
            <span className="text-xs text-muted-foreground/80 font-normal hidden sm:inline">
              {!school && !testDate
                ? '(Chọn cơ sở và ngày để xem số lượng giáo viên rảnh)'
                : !school
                ? '(Chọn cơ sở để xem số lượng giáo viên rảnh)'
                : '(Chọn ngày để xem số lượng giáo viên rảnh)'}
            </span>
          ) : isTeacherFirst && selectedTeacher ? (
            <span className="text-xs text-muted-foreground font-normal truncate max-w-[200px] sm:max-w-none">
              Lịch trực: <span className="font-semibold text-primary">{selectedTeacher}</span>
            </span>
          ) : (
            <span className="text-xs text-muted-foreground font-normal hidden sm:inline">
              Ca test 30 phút • Chọn giờ bắt đầu
            </span>
          )}
        </div>

        {/* Lưới các khung giờ test (Chỉ hiển thị giờ bắt đầu) */}
        <div className="space-y-2">
          {displayedGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {activePeriod === 'all' && (
                <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 pb-0.5">
                  <span>{group.icon}</span>
                  <span>{group.title}</span>
                </div>
              )}

              {/* Lưới 4 cột rộng rãi cho các ca test */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {group.slots.map((slot) => {
                  const isSlotSelected = selectedSlot === slot
                  const slotSummary = dailySlotsSummary.find((s) => s.slot === slot)
                  const generalAvailableCount = slotSummary ? slotSummary.availableCount : 0

                  const hasTeacher = Boolean(selectedTeacher && selectedTeacher !== '')
                  const isTeacherBusy = hasTeacher && Boolean(teacherSlotConflicts[slot])
                  const teacherConflictDetail = hasTeacher ? teacherSlotConflicts[slot] : undefined
                  const isTeacherAvailable = hasTeacher && !isTeacherBusy

                  const isFull = hasFacilityAndDate && generalAvailableCount === 0 && !hasTeacher
                  const fullRange = getSlotTimeRange(slot, 30)

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSlotChange(slot)}
                      title={
                        teacherConflictDetail
                          ? `⚠️ ${teacherConflictDetail}`
                          : isFull
                          ? `⚠️ Ca ${fullRange} đã hết giáo viên trực rảnh (0 rảnh)`
                          : `Ca ${fullRange}`
                      }
                      className={cn(
                        'flex items-center justify-between rounded-md border px-2.5 py-1 text-xs transition-all cursor-pointer h-8.5 min-w-0',
                        isSlotSelected
                          ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs ring-2 ring-primary/20'
                          : !hasFacilityAndDate
                          ? 'border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 text-foreground'
                          : isTeacherFirst && hasTeacher
                          ? isTeacherAvailable
                            ? 'border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 text-foreground'
                            : 'border-border/50 bg-background/50 text-muted-foreground opacity-60 hover:opacity-90 border-dashed'
                          : generalAvailableCount > 0
                          ? 'border-border/70 bg-background hover:border-primary/50 hover:bg-muted/40 text-foreground'
                          : 'border-rose-200/70 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-muted-foreground opacity-80 border-dashed hover:opacity-100 hover:border-rose-400'
                      )}
                    >
                      {/* CHỈ HIỂN THỊ GIỜ BẮT ĐẦU */}
                      <span
                        className={cn(
                          'font-bold text-xs tabular-nums shrink-0',
                          !isSlotSelected && isFull ? 'text-muted-foreground' : ''
                        )}
                      >
                        {slot}
                      </span>

                      {/* Nhãn trạng thái */}
                      {(isSlotSelected || hasFacilityAndDate) && (
                        <span
                          className={cn(
                            'text-[10.5px] font-medium shrink-0 ml-1 transition-colors truncate',
                            isSlotSelected
                              ? 'bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.2 rounded font-semibold'
                              : isTeacherFirst && hasTeacher
                              ? isTeacherAvailable
                                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                : 'text-rose-600 dark:text-rose-400 font-medium'
                              : generalAvailableCount > 0
                              ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                              : 'text-rose-600 dark:text-rose-400 font-semibold bg-rose-100/70 dark:bg-rose-900/40 px-1 py-0.2 rounded'
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
                      )}
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
