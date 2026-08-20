'use client'

import React, { useState } from 'react'
import { Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { toWorkDateKey } from '@/mocks/workRegistrations'
import { WEEKDAYS } from '@/mocks/shiftRoster'
import { formatMinutes } from './workRegistrationHelpers'

const MORNING_TIMES = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00']
const AFTERNOON_TIMES = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
const EVENING_TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00']

export interface TimeRangeItem {
  startTime: string
  endTime: string
}

interface WorkRegistrationTimeRangePickerProps {
  days: Date[]
  disabled?: boolean
  className?: string
  headerPrefix?: React.ReactNode
  headerSuffix?: React.ReactNode
  totalMinutes?: number
  canMutate?: boolean
  primaryActionLabel?: string
  onClear?: () => void
  onClearLabel?: string
  onSubmit?: () => void
  onAddRange: (
    dates: string[],
    startTime: string,
    endTime: string,
    multipleRanges?: TimeRangeItem[]
  ) => void
}

export function WorkRegistrationTimeRangePicker({
  days,
  disabled = false,
  className,
  headerPrefix,
  headerSuffix,
  totalMinutes,
  canMutate,
  primaryActionLabel,
  onClear,
  onClearLabel,
  onSubmit,
  onAddRange,
}: WorkRegistrationTimeRangePickerProps) {
  // Dòng 1: Chọn ngày trong tuần (mặc định không tự động chọn, để user tự chọn)
  const [selectedDayIndexes, setSelectedDayIndexes] = useState<number[]>([])

  // Dòng 2: Cấu hình 3 ca (Sáng: 08:00-12:00, Chiều: 13:00-17:30, Tối: 17:30-22:00, mặc định không tự động chọn)
  const [morningEnabled, setMorningEnabled] = useState(false)
  const [morningStart, setMorningStart] = useState('08:00')
  const [morningEnd, setMorningEnd] = useState('12:00')

  const [afternoonEnabled, setAfternoonEnabled] = useState(false)
  const [afternoonStart, setAfternoonStart] = useState('13:00')
  const [afternoonEnd, setAfternoonEnd] = useState('17:30')

  const [eveningEnabled, setEveningEnabled] = useState(false)
  const [eveningStart, setEveningStart] = useState('17:30')
  const [eveningEnd, setEveningEnd] = useState('22:00')

  const allSelected = selectedDayIndexes.length === days.length && days.length > 0

  const handleToggleDay = (idx: number) => {
    setSelectedDayIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedDayIndexes([])
    } else {
      setSelectedDayIndexes(days.map((_, i) => i))
    }
  }

  const handleMorningStartChange = (val: string) => {
    setMorningStart(val)
    if (morningEnd <= val) {
      const next = MORNING_TIMES.find((t) => t > val)
      if (next) setMorningEnd(next)
    }
  }

  const handleAfternoonStartChange = (val: string) => {
    setAfternoonStart(val)
    if (afternoonEnd <= val) {
      const next = AFTERNOON_TIMES.find((t) => t > val)
      if (next) setAfternoonEnd(next)
    }
  }

  const handleEveningStartChange = (val: string) => {
    setEveningStart(val)
    if (eveningEnd <= val) {
      const next = EVENING_TIMES.find((t) => t > val)
      if (next) setEveningEnd(next)
    }
  }

  const handleAdd = () => {
    if (selectedDayIndexes.length === 0 || disabled) return

    const dates = selectedDayIndexes
      .map((idx) => (days[idx] ? toWorkDateKey(days[idx]) : ''))
      .filter(Boolean)

    const ranges: TimeRangeItem[] = []
    if (morningEnabled) {
      ranges.push({ startTime: morningStart, endTime: morningEnd })
    }
    if (afternoonEnabled) {
      ranges.push({ startTime: afternoonStart, endTime: afternoonEnd })
    }
    if (eveningEnabled) {
      ranges.push({ startTime: eveningStart, endTime: eveningEnd })
    }

    if (ranges.length === 0) return

    onAddRange(dates, ranges[0].startTime, ranges[0].endTime, ranges)
  }

  const hasAnyShiftSelected = morningEnabled || afternoonEnabled || eveningEnabled
  const isAddDisabled = disabled || selectedDayIndexes.length === 0 || !hasAnyShiftSelected

  return (
    <div className={cn('flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4', className)}>
      {/* CỘT TRÁI: ĐĂNG KÝ CHO ... (NẾU CÓ) */}
      {headerPrefix && (
        <div className="shrink-0 flex flex-col justify-center sm:pr-4 sm:border-r border-border/60 pb-2 sm:pb-0 border-b sm:border-b-0">
          {headerPrefix}
        </div>
      )}

      {/* CỘT PHẢI / CHÍNH: 2 DÒNG (DÒNG 1: CHỌN NGÀY, DÒNG 2: THỜI GIAN THEO CA CÙNG CỘT) */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* DÒNG 1: CHỌN NGÀY VÀ TỔNG KHUNG GIỜ Ở TRÊN */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
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

          <div className="flex items-center gap-2 ml-auto shrink-0 flex-wrap">
            {typeof totalMinutes === 'number' ? (
              <Badge variant="outline" className="h-7 gap-1.5 px-2.5 text-xs font-medium border-border/60 bg-muted/30">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Tổng khung giờ: <strong className="font-semibold text-foreground">{formatMinutes(totalMinutes)}</strong></span>
              </Badge>
            ) : null}

            {headerSuffix}
          </div>
        </div>

        {/* DÒNG 2: 3 CA (SÁNG, CHIỀU, TỐI) + THÊM KHUNG GIỜ SÁT CA TỐI + NÚT CẬP NHẬT CẠNH PHẢI */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1.5 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-4 min-w-0">
            {/* CA SÁNG (08:00 - 12:00) */}
            <div
              className={cn(
                'flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all',
                morningEnabled
                  ? 'bg-amber-500/10 border-amber-400/50 text-amber-950 dark:text-amber-200'
                  : 'bg-muted/30 border-border/40 text-muted-foreground'
              )}
            >
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <Checkbox
                  checked={morningEnabled}
                  onCheckedChange={(checked) => setMorningEnabled(Boolean(checked))}
                  disabled={disabled}
                  className={cn(
                    morningEnabled &&
                      'border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-bold transition-colors flex items-center gap-1',
                    morningEnabled ? 'text-amber-800 dark:text-amber-300' : 'text-muted-foreground'
                  )}
                >
                  <span>☀️</span> Sáng
                </span>
              </label>

              <div
                className={cn(
                  'flex items-center gap-1 text-xs transition-opacity',
                  morningEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
                )}
              >
                <span
                  className={cn(
                    'text-[11px]',
                    morningEnabled
                      ? 'text-amber-800/80 dark:text-amber-300/80 font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  Từ:
                </span>
                <select
                  disabled={disabled || !morningEnabled}
                  value={morningStart}
                  onChange={(e) => handleMorningStartChange(e.target.value)}
                  className={cn(
                    'h-7 rounded-md border px-1.5 text-xs font-semibold outline-none cursor-pointer',
                    morningEnabled
                      ? 'border-amber-300 dark:border-amber-700/60 bg-background text-amber-950 dark:text-amber-100 hover:bg-amber-50/50 dark:hover:bg-amber-950/40'
                      : 'border-input bg-background text-foreground'
                  )}
                >
                  {MORNING_TIMES.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <span
                  className={cn(
                    'text-[11px]',
                    morningEnabled
                      ? 'text-amber-800/80 dark:text-amber-300/80 font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  Đến:
                </span>
                <select
                  disabled={disabled || !morningEnabled}
                  value={morningEnd}
                  onChange={(e) => setMorningEnd(e.target.value)}
                  className={cn(
                    'h-7 rounded-md border px-1.5 text-xs font-semibold outline-none cursor-pointer',
                    morningEnabled
                      ? 'border-amber-300 dark:border-amber-700/60 bg-background text-amber-950 dark:text-amber-100 hover:bg-amber-50/50 dark:hover:bg-amber-950/40'
                      : 'border-input bg-background text-foreground'
                  )}
                >
                  {MORNING_TIMES.filter((t) => t > morningStart).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CA CHIỀU (13:00 - 17:30) */}
            <div
              className={cn(
                'flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all',
                afternoonEnabled
                  ? 'bg-sky-500/10 border-sky-400/50 text-sky-950 dark:text-sky-200'
                  : 'bg-muted/30 border-border/40 text-muted-foreground'
              )}
            >
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <Checkbox
                  checked={afternoonEnabled}
                  onCheckedChange={(checked) => setAfternoonEnabled(Boolean(checked))}
                  disabled={disabled}
                  className={cn(
                    afternoonEnabled &&
                      'border-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:text-white'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-bold transition-colors flex items-center gap-1',
                    afternoonEnabled ? 'text-sky-800 dark:text-sky-300' : 'text-muted-foreground'
                  )}
                >
                  <span>🌤</span> Chiều
                </span>
              </label>

              <div
                className={cn(
                  'flex items-center gap-1 text-xs transition-opacity',
                  afternoonEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
                )}
              >
                <span
                  className={cn(
                    'text-[11px]',
                    afternoonEnabled
                      ? 'text-sky-800/80 dark:text-sky-300/80 font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  Từ:
                </span>
                <select
                  disabled={disabled || !afternoonEnabled}
                  value={afternoonStart}
                  onChange={(e) => handleAfternoonStartChange(e.target.value)}
                  className={cn(
                    'h-7 rounded-md border px-1.5 text-xs font-semibold outline-none cursor-pointer',
                    afternoonEnabled
                      ? 'border-sky-300 dark:border-sky-700/60 bg-background text-sky-950 dark:text-sky-100 hover:bg-sky-50/50 dark:hover:bg-sky-950/40'
                      : 'border-input bg-background text-foreground'
                  )}
                >
                  {AFTERNOON_TIMES.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <span
                  className={cn(
                    'text-[11px]',
                    afternoonEnabled
                      ? 'text-sky-800/80 dark:text-sky-300/80 font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  Đến:
                </span>
                <select
                  disabled={disabled || !afternoonEnabled}
                  value={afternoonEnd}
                  onChange={(e) => setAfternoonEnd(e.target.value)}
                  className={cn(
                    'h-7 rounded-md border px-1.5 text-xs font-semibold outline-none cursor-pointer',
                    afternoonEnabled
                      ? 'border-sky-300 dark:border-sky-700/60 bg-background text-sky-950 dark:text-sky-100 hover:bg-sky-50/50 dark:hover:bg-sky-950/40'
                      : 'border-input bg-background text-foreground'
                  )}
                >
                  {AFTERNOON_TIMES.filter((t) => t > afternoonStart).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CA TỐI (17:30 - 22:00) */}
            <div
              className={cn(
                'flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all',
                eveningEnabled
                  ? 'bg-purple-500/10 border-purple-400/50 text-purple-950 dark:text-purple-200'
                  : 'bg-muted/30 border-border/40 text-muted-foreground'
              )}
            >
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <Checkbox
                  checked={eveningEnabled}
                  onCheckedChange={(checked) => setEveningEnabled(Boolean(checked))}
                  disabled={disabled}
                  className={cn(
                    eveningEnabled &&
                      'border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white'
                  )}
                />
                <span
                  className={cn(
                    'text-xs font-bold transition-colors flex items-center gap-1',
                    eveningEnabled ? 'text-purple-800 dark:text-purple-300' : 'text-muted-foreground'
                  )}
                >
                  <span>🌙</span> Tối
                </span>
              </label>

              <div
                className={cn(
                  'flex items-center gap-1 text-xs transition-opacity',
                  eveningEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
                )}
              >
                <span
                  className={cn(
                    'text-[11px]',
                    eveningEnabled
                      ? 'text-purple-800/80 dark:text-purple-300/80 font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  Từ:
                </span>
                <select
                  disabled={disabled || !eveningEnabled}
                  value={eveningStart}
                  onChange={(e) => handleEveningStartChange(e.target.value)}
                  className={cn(
                    'h-7 rounded-md border px-1.5 text-xs font-semibold outline-none cursor-pointer',
                    eveningEnabled
                      ? 'border-purple-300 dark:border-purple-700/60 bg-background text-purple-950 dark:text-purple-100 hover:bg-purple-50/50 dark:hover:bg-purple-950/40'
                      : 'border-input bg-background text-foreground'
                  )}
                >
                  {EVENING_TIMES.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <span
                  className={cn(
                    'text-[11px]',
                    eveningEnabled
                      ? 'text-purple-800/80 dark:text-purple-300/80 font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  Đến:
                </span>
                <select
                  disabled={disabled || !eveningEnabled}
                  value={eveningEnd}
                  onChange={(e) => setEveningEnd(e.target.value)}
                  className={cn(
                    'h-7 rounded-md border px-1.5 text-xs font-semibold outline-none cursor-pointer',
                    eveningEnabled
                      ? 'border-purple-300 dark:border-purple-700/60 bg-background text-purple-950 dark:text-purple-100 hover:bg-purple-50/50 dark:hover:bg-purple-950/40'
                      : 'border-input bg-background text-foreground'
                  )}
                >
                  {EVENING_TIMES.filter((t) => t > eveningStart).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* NÚT THÊM KHUNG GIỜ (NỀN XANH NHẠT, HOVER/CLICK HIGHLIGHT, SÁT CHỌN GIỜ CA TỐI) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isAddDisabled}
              onClick={handleAdd}
              className="h-7.5 shrink-0 cursor-pointer font-semibold gap-1.5 px-3 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border-primary/30 hover:border-primary/50 active:scale-[0.98] transition-all shadow-2xs"
            >
              <Plus className="h-4 w-4" />
              Thêm khung giờ
            </Button>
          </div>

          {/* NÚT HÀNH ĐỘNG: XÓA TUẦN (NẾU CÓ) + CẬP NHẬT ĐĂNG KÝ (DÒNG DƯỚI, CẠNH PHẢI) */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {onClear ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || (typeof canMutate === 'boolean' && !canMutate) || totalMinutes === 0}
                onClick={onClear}
                className="h-7.5 px-3 text-xs font-medium cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                {onClearLabel || 'Xóa tuần'}
              </Button>
            ) : null}

            {onSubmit ? (
              <Button
                type="button"
                size="sm"
                disabled={disabled || (typeof canMutate === 'boolean' && !canMutate) || totalMinutes === 0}
                onClick={onSubmit}
                className="h-7.5 px-3.5 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                {primaryActionLabel || 'Cập nhật đăng ký'}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
