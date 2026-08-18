'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toWorkDateKey } from '@/mocks/workRegistrations'
import { WEEKDAYS } from '@/mocks/shiftRoster'

const ALL_TIMES = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00',
]

const PRESETS = [
  { id: 'all',       label: '⏱ Cả ngày', start: '07:00', end: '23:00' },
  { id: 'morning',   label: '☀️ Sáng',    start: '08:00', end: '11:30' },
  { id: 'afternoon', label: '🌤 Chiều',   start: '13:30', end: '17:30' },
  { id: 'evening',   label: '🌙 Tối',     start: '18:00', end: '21:30' },
] as const

interface WorkRegistrationTimeRangePickerProps {
  days: Date[]
  disabled?: boolean
  /** When true, renders controls directly without a wrapping card container */
  inline?: boolean
  onAddRange: (dates: string[], startTime: string, endTime: string) => void
}

export function WorkRegistrationTimeRangePicker({
  days,
  disabled = false,
  inline = false,
  onAddRange,
}: WorkRegistrationTimeRangePickerProps) {
  const [selectedDayIndexes, setSelectedDayIndexes] = useState<number[]>(
    () => days.map((_, i) => i) // mặc định chọn cả tuần
  )
  const [activePresetId, setActivePresetId] = useState<string>('all')
  const [startTime, setStartTime] = useState('07:00')
  const [endTime, setEndTime] = useState('23:00')

  const allSelected = selectedDayIndexes.length === days.length

  // Tính toán khoảng giờ khả dụng dựa trên preset đang chọn
  const activePreset = PRESETS.find((p) => p.id === activePresetId) || PRESETS[0]
  const availableStartTimes = useMemo(
    () => ALL_TIMES.filter((t) => t >= activePreset.start && t < activePreset.end),
    [activePreset]
  )
  const availableEndTimes = useMemo(
    () => ALL_TIMES.filter((t) => t > startTime && t <= activePreset.end),
    [activePreset, startTime]
  )

  const handleToggleDay = (idx: number) => {
    setSelectedDayIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedDayIndexes([0])
    } else {
      setSelectedDayIndexes(days.map((_, i) => i))
    }
  }

  const handleApplyPreset = (preset: typeof PRESETS[number]) => {
    setActivePresetId(preset.id)
    setStartTime(preset.start)
    setEndTime(preset.end)
  }

  const handleStartChange = (value: string) => {
    setStartTime(value)
    // Nếu endTime <= startTime mới → đặt lại endTime
    if (endTime <= value) {
      const nextEnd = ALL_TIMES.find((t) => t > value && t <= activePreset.end)
      if (nextEnd) setEndTime(nextEnd)
    }
  }

  const handleAdd = () => {
    if (selectedDayIndexes.length === 0 || disabled) return
    const dates = selectedDayIndexes
      .map((idx) => (days[idx] ? toWorkDateKey(days[idx]) : ''))
      .filter(Boolean)
    onAddRange(dates, startTime, endTime)
  }

  const wrapperClass = inline
    ? 'flex flex-wrap items-center gap-3 flex-1 min-w-0'
    : 'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-2xs'

  return (
    <div className={wrapperClass}>
      <div className="flex flex-wrap items-center gap-3 min-w-0 flex-1">
        {/* CHỌN NGÀY / THỨ (MULTI-SELECT) */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-foreground shrink-0">Chọn ngày:</span>
          <div className="flex items-center gap-1 flex-wrap">
            {WEEKDAYS.map((day, idx) => {
              const isSelected = selectedDayIndexes.includes(idx)
              return (
                <button
                  key={day.index}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleToggleDay(idx)}
                  className={cn(
                    'h-7 px-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer select-none',
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-2xs'
                      : 'bg-muted/50 hover:bg-muted text-foreground border border-border/50'
                  )}
                >
                  {day.short}
                </button>
              )
            })}
            <button
              type="button"
              disabled={disabled}
              onClick={handleToggleAll}
              className={cn(
                'h-7 px-2 rounded-md text-[11px] font-medium transition-all cursor-pointer select-none ml-0.5',
                allSelected
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-transparent text-muted-foreground hover:bg-muted/50'
              )}
            >
              {allSelected ? 'Bỏ chọn' : 'Cả tuần'}
            </button>
          </div>
        </div>

        {/* PHÍM TẮT CA MẪU (PRESETS) — luôn hiển thị */}
        <div className="flex items-center gap-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => handleApplyPreset(preset)}
              className={cn(
                'h-7 px-2.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer border',
                activePresetId === preset.id
                  ? 'border-primary/50 bg-primary/10 text-primary font-semibold'
                  : 'border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* CHỌN GIỜ BẮT ĐẦU & KẾT THÚC (giới hạn theo preset) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-foreground shrink-0">Từ:</span>
            <select
              disabled={disabled}
              value={startTime}
              onChange={(e) => handleStartChange(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary outline-none cursor-pointer"
            >
              {availableStartTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-foreground shrink-0">Đến:</span>
            <select
              disabled={disabled}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-semibold text-foreground focus:ring-1 focus:ring-primary outline-none cursor-pointer"
            >
              {availableEndTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* NÚT THÊM KHUNG GIỜ */}
      <Button
        type="button"
        size="sm"
        disabled={disabled || selectedDayIndexes.length === 0}
        onClick={handleAdd}
        className="h-8 shrink-0 cursor-pointer font-semibold gap-1 px-3 shadow-2xs"
      >
        <Plus className="h-4 w-4" />
        Thêm khung giờ
      </Button>
    </div>
  )
}
