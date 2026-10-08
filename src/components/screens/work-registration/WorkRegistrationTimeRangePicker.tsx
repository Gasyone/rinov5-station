'use client'

import React, { useState } from 'react'
import { Clock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  registeredMinutes?: number
  draftMinutes?: number
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
  registeredMinutes,
  draftMinutes = 0,
  canMutate,
  primaryActionLabel,
  onClear,
  onClearLabel,
  onSubmit,
  onAddRange,
}: WorkRegistrationTimeRangePickerProps) {
  // Dòng 1: Chọn ngày trong tuần (mỗi thứ là 1 ô tách biệt)
  const [selectedDayIndexes, setSelectedDayIndexes] = useState<number[]>([])

  // Dòng 2: 3 ca Sáng, Chiều, Tối chọn giờ trực tiếp
  const [morningStart, setMorningStart] = useState('08:00')
  const [morningEnd, setMorningEnd] = useState('12:00')

  const [afternoonStart, setAfternoonStart] = useState('')
  const [afternoonEnd, setAfternoonEnd] = useState('')

  const [eveningStart, setEveningStart] = useState('')
  const [eveningEnd, setEveningEnd] = useState('')

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
    if (!val) {
      setMorningEnd('')
      return
    }
    if (!morningEnd || morningEnd <= val) {
      setMorningEnd('12:00')
    }
  }

  const handleAfternoonStartChange = (val: string) => {
    setAfternoonStart(val)
    if (!val) {
      setAfternoonEnd('')
      return
    }
    if (!afternoonEnd || afternoonEnd <= val) {
      setAfternoonEnd('17:30')
    }
  }

  const handleEveningStartChange = (val: string) => {
    setEveningStart(val)
    if (!val) {
      setEveningEnd('')
      return
    }
    if (!eveningEnd || eveningEnd <= val) {
      setEveningEnd('22:00')
    }
  }

  const handleToggleMorning = () => {
    if (morningStart) {
      setMorningStart('')
      setMorningEnd('')
    } else {
      setMorningStart('08:00')
      setMorningEnd('12:00')
    }
  }

  const handleToggleAfternoon = () => {
    if (afternoonStart) {
      setAfternoonStart('')
      setAfternoonEnd('')
    } else {
      setAfternoonStart('13:00')
      setAfternoonEnd('17:30')
    }
  }

  const handleToggleEvening = () => {
    if (eveningStart) {
      setEveningStart('')
      setEveningEnd('')
    } else {
      setEveningStart('17:30')
      setEveningEnd('22:00')
    }
  }

  const resetSelection = () => {
    setSelectedDayIndexes([])
    setMorningStart('08:00')
    setMorningEnd('12:00')
    setAfternoonStart('')
    setAfternoonEnd('')
    setEveningStart('')
    setEveningEnd('')
  }

  const handleAdd = () => {
    if (selectedDayIndexes.length === 0 || disabled) return

    const dates = selectedDayIndexes
      .map((idx) => (days[idx] ? toWorkDateKey(days[idx]) : ''))
      .filter(Boolean)

    const ranges: TimeRangeItem[] = []
    if (morningStart && morningEnd && morningEnd > morningStart) {
      ranges.push({ startTime: morningStart, endTime: morningEnd })
    }
    if (afternoonStart && afternoonEnd && afternoonEnd > afternoonStart) {
      ranges.push({ startTime: afternoonStart, endTime: afternoonEnd })
    }
    if (eveningStart && eveningEnd && eveningEnd > eveningStart) {
      ranges.push({ startTime: eveningStart, endTime: eveningEnd })
    }

    if (ranges.length === 0) return

    onAddRange(dates, ranges[0].startTime, ranges[0].endTime, ranges)
    resetSelection()
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit()
      resetSelection()
    }
  }

  const hasAnyShiftSelected =
    Boolean(morningStart && morningEnd && morningEnd > morningStart) ||
    Boolean(afternoonStart && afternoonEnd && afternoonEnd > afternoonStart) ||
    Boolean(eveningStart && eveningEnd && eveningEnd > eveningStart)

  const isAddDisabled = disabled || selectedDayIndexes.length === 0 || !hasAnyShiftSelected

  return (
    <div className={cn('flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4', className)}>
      {/* CỘT TRÁI: ĐĂNG KÝ CHO ... (NẾU CÓ) */}
      {headerPrefix && (
        <div className="shrink-0 flex flex-col justify-center sm:pr-4 sm:border-r border-border/60 pb-2 sm:pb-0 border-b sm:border-b-0">
          {headerPrefix}
        </div>
      )}

      {/* CỘT PHẢI / CHÍNH: 2 DÒNG */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* DÒNG 1: CHỌN NGÀY (CÁC THỨ TÁCH BIỆT THÀNH TỪNG Ô) VÀ TỔNG KHUNG GIỜ */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-foreground shrink-0">Chọn ngày:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {WEEKDAYS.map((day, idx) => {
                const isSelected = selectedDayIndexes.includes(idx)
                return (
                  <button
                    key={day.index}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleToggleDay(idx)}
                    className={cn(
                      'h-7 w-8.5 rounded-md text-xs font-semibold border transition-all cursor-pointer select-none flex items-center justify-center',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-2xs font-bold ring-1 ring-primary/30'
                        : 'border-border/80 bg-background text-foreground/80 hover:border-border hover:bg-muted/60 hover:text-foreground'
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
                  'h-7 px-2.5 rounded-md text-xs font-medium border transition-all cursor-pointer select-none ml-0.5',
                  allSelected
                    ? 'border-primary/50 bg-primary/10 text-primary font-bold'
                    : 'border-dashed border-border/80 bg-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
              >
                {allSelected ? 'Bỏ chọn' : 'Cả tuần'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0 flex-wrap">
            {typeof totalMinutes === 'number' ? (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground/80" />
                  <span>
                    Tổng khung giờ: <strong className="font-semibold text-foreground">{formatMinutes(totalMinutes)}</strong>
                    {typeof registeredMinutes === 'number' && draftMinutes > 0 ? (
                      <span className="text-xs font-normal text-muted-foreground ml-1">
                        (Đã lưu: {formatMinutes(registeredMinutes)})
                      </span>
                    ) : null}
                  </span>
                </div>
                {typeof draftMinutes === 'number' && draftMinutes > 0 ? (
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-in fade-in">
                    ✨ Mới chọn: +{formatMinutes(draftMinutes)}
                  </span>
                ) : null}
              </div>
            ) : null}

            {headerSuffix}
          </div>
        </div>

        {/* DÒNG 2: 3 CA (SÁNG, CHIỀU, TỐI) CHỌN GIỜ TRỰC TIẾP Ở MỖI Ô, KHÔNG (X), KHÔNG NÚT CHỌN RIÊNG */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/30">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="text-xs font-semibold text-foreground shrink-0 mr-0.5">Chọn ca:</span>

            {/* CA SÁNG */}
            <div className="inline-flex items-center gap-1.5 text-xs select-none">
              <button
                type="button"
                disabled={disabled}
                onClick={handleToggleMorning}
                className={cn(
                  'text-xs font-semibold cursor-pointer transition-colors hover:opacity-80 select-none',
                  morningStart ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-muted-foreground'
                )}
                title="Bấm để bật/tắt ca Sáng"
              >
                Sáng
              </button>

              <div className="inline-flex items-center gap-1">
                <select
                  disabled={disabled}
                  value={morningStart}
                  onChange={(e) => handleMorningStartChange(e.target.value)}
                  className={cn(
                    'h-6.5 rounded border border-border/70 bg-background px-1.5 text-xs font-medium outline-none cursor-pointer hover:border-border',
                    morningStart ? 'text-foreground' : 'text-muted-foreground font-normal'
                  )}
                >
                  <option value="">Chọn</option>
                  {MORNING_TIMES.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span className="text-muted-foreground text-xs">–</span>
                <select
                  disabled={disabled || !morningStart}
                  value={morningEnd}
                  onChange={(e) => setMorningEnd(e.target.value)}
                  className={cn(
                    'h-6.5 rounded border border-border/70 bg-background px-1.5 text-xs font-medium outline-none cursor-pointer hover:border-border',
                    morningEnd ? 'text-foreground' : 'text-muted-foreground font-normal'
                  )}
                >
                  <option value="">Chọn</option>
                  {MORNING_TIMES.filter((t) => !morningStart || t > morningStart).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-4 w-px bg-border/60 mx-0.5" />

            {/* CA CHIỀU */}
            <div className="inline-flex items-center gap-1.5 text-xs select-none">
              <button
                type="button"
                disabled={disabled}
                onClick={handleToggleAfternoon}
                className={cn(
                  'text-xs font-semibold cursor-pointer transition-colors hover:opacity-80 select-none',
                  afternoonStart ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-muted-foreground'
                )}
                title="Bấm để bật/tắt ca Chiều"
              >
                Chiều
              </button>

              <div className="inline-flex items-center gap-1">
                <select
                  disabled={disabled}
                  value={afternoonStart}
                  onChange={(e) => handleAfternoonStartChange(e.target.value)}
                  className={cn(
                    'h-6.5 rounded border border-border/70 bg-background px-1.5 text-xs font-medium outline-none cursor-pointer hover:border-border',
                    afternoonStart ? 'text-foreground' : 'text-muted-foreground font-normal'
                  )}
                >
                  <option value="">Chọn</option>
                  {AFTERNOON_TIMES.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span className="text-muted-foreground text-xs">–</span>
                <select
                  disabled={disabled || !afternoonStart}
                  value={afternoonEnd}
                  onChange={(e) => setAfternoonEnd(e.target.value)}
                  className={cn(
                    'h-6.5 rounded border border-border/70 bg-background px-1.5 text-xs font-medium outline-none cursor-pointer hover:border-border',
                    afternoonEnd ? 'text-foreground' : 'text-muted-foreground font-normal'
                  )}
                >
                  <option value="">Chọn</option>
                  {AFTERNOON_TIMES.filter((t) => !afternoonStart || t > afternoonStart).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-4 w-px bg-border/60 mx-0.5" />

            {/* CA TỐI */}
            <div className="inline-flex items-center gap-1.5 text-xs select-none">
              <button
                type="button"
                disabled={disabled}
                onClick={handleToggleEvening}
                className={cn(
                  'text-xs font-semibold cursor-pointer transition-colors hover:opacity-80 select-none',
                  eveningStart ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-muted-foreground'
                )}
                title="Bấm để bật/tắt ca Tối"
              >
                Tối
              </button>

              <div className="inline-flex items-center gap-1">
                <select
                  disabled={disabled}
                  value={eveningStart}
                  onChange={(e) => handleEveningStartChange(e.target.value)}
                  className={cn(
                    'h-6.5 rounded border border-border/70 bg-background px-1.5 text-xs font-medium outline-none cursor-pointer hover:border-border',
                    eveningStart ? 'text-foreground' : 'text-muted-foreground font-normal'
                  )}
                >
                  <option value="">Chọn</option>
                  {EVENING_TIMES.slice(0, -1).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span className="text-muted-foreground text-xs">–</span>
                <select
                  disabled={disabled || !eveningStart}
                  value={eveningEnd}
                  onChange={(e) => setEveningEnd(e.target.value)}
                  className={cn(
                    'h-6.5 rounded border border-border/70 bg-background px-1.5 text-xs font-medium outline-none cursor-pointer hover:border-border',
                    eveningEnd ? 'text-foreground' : 'text-muted-foreground font-normal'
                  )}
                >
                  <option value="">Chọn</option>
                  {EVENING_TIMES.filter((t) => !eveningStart || t > eveningStart).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* NÚT THÊM KHUNG GIỜ */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isAddDisabled}
              onClick={handleAdd}
              className="h-7.5 shrink-0 cursor-pointer font-semibold gap-1.5 px-3 rounded-md bg-primary/10 hover:bg-primary/20 text-primary border-0 active:scale-[0.98] transition-all ml-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Thêm khung giờ
            </Button>
          </div>

          {/* NÚT HÀNH ĐỘNG: XÓA TUẦN (NẾU CÓ) + LƯU ĐĂNG KÝ (DÒNG DƯỚI, CẠNH PHẢI) */}
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
                onClick={handleSubmit}
                className={cn(
                  'h-7.5 px-3.5 text-xs font-semibold cursor-pointer shadow-2xs transition-all',
                  draftMinutes > 0
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground ring-2 ring-primary/20 animate-pulse-once'
                    : ''
                )}
              >
                {draftMinutes > 0
                  ? `Lưu đăng ký (+${formatMinutes(draftMinutes)})`
                  : primaryActionLabel || 'Lưu đăng ký'}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
