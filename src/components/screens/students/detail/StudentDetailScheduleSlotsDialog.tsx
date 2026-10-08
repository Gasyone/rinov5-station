'use client'

import { useState } from 'react'
import { Plus, X, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { TimeRangePicker } from './TimeRangePicker'
import type { StudentAvailableSlot } from './studentDetailTypes'

interface StudentDetailScheduleSlotsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialSlots?: StudentAvailableSlot[]
  onSave: (slots: StudentAvailableSlot[]) => void
}

const DAYS_OF_WEEK = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật',
]

interface SlotTime {
  start: string
  end: string
}

interface DayScheduleItem {
  day: string
  enabled: boolean
  slots: SlotTime[]
}

function parseTimeRange(timeRange: string): SlotTime {
  const match = timeRange.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/)
  if (match) {
    const pad = (s: string) => (s.length === 4 ? `0${s}` : s)
    return { start: pad(match[1]), end: pad(match[2]) }
  }
  const parts = timeRange.split(/[-–]/).map((s) => s.trim())
  return {
    start: parts[0] || '17:30',
    end: parts[1] || '19:00',
  }
}

function matchDay(slotDay: string, targetDay: string): boolean {
  const s = slotDay.toLowerCase()
  const t = targetDay.toLowerCase()
  if (s.includes(t)) return true
  if (targetDay === 'Thứ 2' && (s.includes('t2') || s.includes('thứ 2') || s.includes('thứ hai'))) return true
  if (targetDay === 'Thứ 3' && (s.includes('t3') || s.includes('thứ 3') || s.includes('thứ ba'))) return true
  if (targetDay === 'Thứ 4' && (s.includes('t4') || s.includes('thứ 4') || s.includes('thứ tư'))) return true
  if (targetDay === 'Thứ 5' && (s.includes('t5') || s.includes('thứ 5') || s.includes('thứ năm'))) return true
  if (targetDay === 'Thứ 6' && (s.includes('t6') || s.includes('thứ 6') || s.includes('thứ sáu'))) return true
  if (targetDay === 'Thứ 7' && (s.includes('t7') || s.includes('thứ 7') || s.includes('thứ bảy'))) return true
  if (targetDay === 'Chủ nhật' && (s.includes('cn') || s.includes('chủ nhật') || s.includes('chu nhat'))) return true
  return false
}

function parseSlotsToDays(slots: StudentAvailableSlot[]): DayScheduleItem[] {
  return DAYS_OF_WEEK.map((day) => {
    const isWeekend = day === 'Thứ 7' || day === 'Chủ nhật'
    const defaultTime: SlotTime = isWeekend
      ? { start: '09:00', end: '10:30' }
      : { start: '17:30', end: '19:00' }

    const matchedSlots = slots.filter((s) => matchDay(s.dayOfWeek, day))
    if (matchedSlots.length > 0) {
      const parsedSlots = matchedSlots
        .map((s) => parseTimeRange(s.timeRange))
        .filter((st) => Boolean(st.start && st.end))

      return {
        day,
        enabled: true,
        slots: parsedSlots.length > 0 ? parsedSlots : [defaultTime],
      }
    }

    return {
      day,
      enabled: false,
      slots: [defaultTime],
    }
  })
}

export function StudentDetailScheduleSlotsDialog({
  open,
  onOpenChange,
  initialSlots = [],
  onSave,
}: StudentDetailScheduleSlotsDialogProps) {
  const [prevOpen, setPrevOpen] = useState(open)
  const [prevInitialSlots, setPrevInitialSlots] = useState(initialSlots)
  const [daySchedules, setDaySchedules] = useState<DayScheduleItem[]>(() =>
    parseSlotsToDays(initialSlots)
  )

  if (open !== prevOpen || initialSlots !== prevInitialSlots) {
    setPrevOpen(open)
    setPrevInitialSlots(initialSlots)
    if (open) {
      setDaySchedules(parseSlotsToDays(initialSlots))
    }
  }

  const handleToggleDay = (day: string, enabled: boolean) => {
    setDaySchedules((prev) =>
      prev.map((d) => (d.day === day ? { ...d, enabled } : d))
    )
  }

  const handleUpdateSlotRange = (
    day: string,
    slotIdx: number,
    start: string,
    end: string
  ) => {
    setDaySchedules((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d
        const newSlots = [...d.slots]
        newSlots[slotIdx] = { ...newSlots[slotIdx], start, end }
        return { ...d, slots: newSlots }
      })
    )
  }

  const handleAddTime = (day: string) => {
    setDaySchedules((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d
        const isWeekend = day === 'Thứ 7' || day === 'Chủ nhật'
        let nextStart = isWeekend ? '09:00' : '17:30'
        let nextEnd = isWeekend ? '10:30' : '19:00'

        if (d.slots.length > 0) {
          const lastSlot = d.slots[d.slots.length - 1]
          if (lastSlot.end === '19:00') {
            nextStart = '19:30'
            nextEnd = '21:00'
          } else if (lastSlot.end === '10:30') {
            nextStart = '14:30'
            nextEnd = '16:00'
          } else {
            nextStart = lastSlot.end
            nextEnd = '21:00'
          }
        }
        return { ...d, slots: [...d.slots, { start: nextStart, end: nextEnd }] }
      })
    )
  }

  const handleRemoveTime = (day: string, slotIdx: number) => {
    setDaySchedules((prev) =>
      prev.map((d) => {
        if (d.day !== day) return d
        const newSlots = d.slots.filter((_, idx) => idx !== slotIdx)
        return {
          ...d,
          slots:
            newSlots.length > 0
              ? newSlots
              : [{ start: '17:30', end: '19:00' }],
        }
      })
    )
  }

  const handleSave = () => {
    const resultSlots: StudentAvailableSlot[] = []

    daySchedules.forEach((d) => {
      if (d.enabled) {
        d.slots.forEach((s, idx) => {
          if (s.start && s.end) {
            resultSlots.push({
              id: `slot-${d.day}-${idx + 1}-${Date.now()}`,
              dayOfWeek: d.day,
              timeRange: `${s.start} - ${s.end}`,
            })
          }
        })
      }
    })

    onSave(resultSlots)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-3.5 sm:p-4 rounded-xl border bg-background shadow-xl">
        <DialogHeader className="pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-primary/10 text-primary shrink-0">
              <Clock className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0 text-left">
              <DialogTitle className="text-xs sm:text-[13px] font-bold text-foreground leading-tight">
                Chỉnh sửa khung giờ học viên rảnh
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                Tích chọn các thứ và chọn giờ bắt đầu - kết thúc cho từng ca học rảnh.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Bảng danh sách 7 ngày trong tuần - tinh gọn, padding nhỏ */}
        <div className="divide-y divide-border/40 py-0.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
          {daySchedules.map((d) => (
            <div
              key={d.day}
              className={cn(
                "py-1.5 px-0.5 transition-colors flex items-center gap-2 text-xs",
                d.enabled ? "opacity-100" : "opacity-60"
              )}
            >
              {/* Checkbox + Tên thứ */}
              <div className="flex items-center gap-1.5 w-20 shrink-0">
                <Checkbox
                  id={`day-check-${d.day}`}
                  checked={d.enabled}
                  onCheckedChange={(checked) => handleToggleDay(d.day, checked === true)}
                  className="cursor-pointer h-3.5 w-3.5"
                />
                <label
                  htmlFor={`day-check-${d.day}`}
                  className={cn(
                    "text-xs font-semibold cursor-pointer select-none",
                    d.enabled ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {d.day}
                </label>
              </div>

              {/* Các khung giờ của thứ này */}
              {d.enabled ? (
                <div className="flex-1 flex flex-wrap items-center gap-1.5">
                  {d.slots.map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className="flex items-center gap-0.5 bg-muted/40 hover:bg-muted/70 rounded-md px-1 py-0.5 border border-border/40"
                    >
                      {/* Chọn cả ca học bắt đầu - kết thúc gộp làm 1 */}
                      <TimeRangePicker
                        startTime={slot.start}
                        endTime={slot.end}
                        onChange={(start, end) =>
                          handleUpdateSlotRange(d.day, sIdx, start, end)
                        }
                      />

                      {d.slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTime(d.day, sIdx)}
                          className="text-muted-foreground hover:text-destructive p-0.5 rounded cursor-pointer transition-colors"
                          title="Xóa ca này"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Nút thêm giờ mới cho thứ này */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddTime(d.day)}
                    className="h-6 px-1.5 text-[10.5px] font-medium text-primary hover:text-primary hover:bg-primary/10 rounded-md gap-0.5 cursor-pointer border border-dashed border-primary/30"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    <span>Thêm giờ</span>
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => handleToggleDay(d.day, true)}
                  className="flex-1 text-[10.5px] text-muted-foreground/50 italic cursor-pointer select-none hover:text-muted-foreground"
                >
                  (Bấm tích chọn để mở lịch thứ này)
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-xs">
          <span className="text-[11px] text-muted-foreground">
            Đã chọn:{' '}
            <strong className="text-foreground font-semibold">
              {daySchedules.filter((d) => d.enabled).length} ngày
            </strong>{' '}
            trong tuần
          </span>
          <div className="flex gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-7 px-2.5 text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="h-7 px-3 bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-3xs"
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
