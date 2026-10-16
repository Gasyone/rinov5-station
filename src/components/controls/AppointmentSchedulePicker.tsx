'use client'

import React, { useMemo, useState } from 'react'
import { Calendar as CalendarIcon, Clock, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { parseDateString, formatDateToISO, formatDateToDisplay } from './DateRangePicker'

export interface AppointmentSchedulePickerProps {
  /** Giá trị thời gian hẹn định dạng ISO: YYYY-MM-DDTHH:mm hoặc rỗng */
  value?: string
  /** Callback khi thay đổi hoặc xác nhận lịch hẹn */
  onChange?: (val: string) => void
  /** Placeholder khi chưa đặt lịch */
  placeholder?: string
  /** Trạng thái vô hiệu hóa */
  disabled?: boolean
  /** ClassName bổ sung cho container trigger */
  className?: string
  /** Căn lề popover */
  align?: 'start' | 'center' | 'end'
}

const QUICK_DATE_PRESETS = [
  { label: 'Hôm nay', offsetDays: 0 },
  { label: 'Ngày mai', offsetDays: 1 },
  { label: '+2 ngày', offsetDays: 2 },
  { label: '+1 tuần', offsetDays: 7 },
]

const QUICK_TIME_PRESETS = ['09:00', '10:30', '14:00', '16:00', '19:30']

const HOURS_LIST = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES_LIST = ['00', '15', '30', '45']

export function AppointmentSchedulePicker({
  value = '',
  onChange,
  placeholder = 'Lên lịch',
  disabled = false,
  className,
  align = 'end',
}: AppointmentSchedulePickerProps) {
  const [open, setOpen] = useState(false)

  // Parse value
  const parsed = useMemo(() => {
    if (!value) return { date: null, time: '14:00' }
    const parts = value.includes('T') ? value.split('T') : value.split(' ')
    const datePart = parts[0]
    const timePart = parts[1] ? parts[1].slice(0, 5) : '14:00'
    const dateObj = parseDateString(datePart)
    return { date: dateObj, time: timePart }
  }, [value])

  // Internal draft state while popover is open
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState('14')
  const [minute, setMinute] = useState('00')
  const [navMonth, setNavMonth] = useState<Date | undefined>(undefined)

  // Sync internal draft state when popover opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) return
    setOpen(nextOpen)
    if (nextOpen) {
      const initialDate = parsed.date || new Date()
      setTempDate(initialDate)
      setNavMonth(initialDate)
      const [h, m] = parsed.time.split(':')
      setHour((h || '14').padStart(2, '0'))
      setMinute((m || '00').padStart(2, '0'))
    }
  }

  // Display text on trigger button
  const displayLabel = useMemo(() => {
    if (!value) return null
    if (!parsed.date) return value
    const dayStr = formatDateToDisplay(parsed.date)
    return `${dayStr.slice(0, 5)} ${parsed.time}` // e.g. "20/07 14:00"
  }, [value, parsed])

  // Short preview in popover header
  const previewShort = useMemo(() => {
    if (!tempDate) return 'Chưa chọn'
    const dStr = formatDateToDisplay(tempDate)
    return `${dStr.slice(0, 5)} lúc ${hour}:${minute}`
  }, [tempDate, hour, minute])

  const handleSelectQuickDate = (offsetDays: number) => {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    setTempDate(d)
    setNavMonth(d)
  }

  const handleSelectQuickTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':')
    setHour(h)
    setMinute(m)
  }

  const handleConfirm = () => {
    if (!tempDate) return
    const isoDate = formatDateToISO(tempDate)
    const cleanH = hour.padStart(2, '0')
    const cleanM = minute.padStart(2, '0')
    const formatted = `${isoDate}T${cleanH}:${cleanM}`
    onChange?.(formatted)
    setOpen(false)
  }

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    onChange?.('')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          title={value ? `Lịch hẹn: ${displayLabel}. Bấm để đổi` : 'Bấm để đặt lịch hẹn gọi lại'}
          className={cn(
            'inline-flex items-center gap-1.5 bg-background px-2 py-0.5 rounded-md border border-border/70 text-xs shadow-none cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/30 select-none focus:outline-none focus:ring-1 focus:ring-primary/40',
            value && 'border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/20 text-foreground',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
            className
          )}
        >
          <CalendarIcon className={cn('h-3 w-3 shrink-0', value ? 'text-sky-600 dark:text-sky-400' : 'text-muted-foreground')} />
          <span className="text-xs font-normal text-muted-foreground shrink-0">Lịch hẹn:</span>

          {displayLabel ? (
            <span className="font-semibold text-foreground font-mono text-xs truncate max-w-[110px]">
              {displayLabel}
            </span>
          ) : (
            <span className="text-xs font-medium text-primary hover:underline">
              {placeholder}
            </span>
          )}

          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground text-xs p-0.5 rounded cursor-pointer leading-none transition-colors ml-0.5"
              title="Xóa lịch hẹn"
            >
              <X className="h-2.5 w-2.5" />
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={4}
        collisionPadding={16}
        className="w-[275px] p-0 z-[9999] shadow-xl border border-border rounded-xl bg-popover overflow-hidden animate-in fade-in-50 zoom-in-95 text-left"
      >
        {/* 1. Header tinh giản: Tiêu đề + Preview tag nhỏ gọn */}
        <div className="px-2.5 py-1.5 border-b border-border/60 bg-muted/20 flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-primary" />
            Lên lịch hẹn
          </span>
          <span className="font-mono text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            {previewShort}
          </span>
        </div>

        {/* 2. Gợi ý ngày nhanh: 1 dòng cực gọn */}
        <div className="px-2 py-1 border-b border-border/40 bg-background/50 flex items-center justify-between gap-1 text-[11px]">
          {QUICK_DATE_PRESETS.map((p) => {
            const isSelected = tempDate ? (() => {
              const target = new Date()
              target.setDate(target.getDate() + p.offsetDays)
              return (
                target.getDate() === tempDate.getDate() &&
                target.getMonth() === tempDate.getMonth() &&
                target.getFullYear() === tempDate.getFullYear()
              )
            })() : false

            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectQuickDate(p.offsetDays)}
                className={cn(
                  'flex-1 h-5 px-1 rounded text-[10.5px] font-medium transition-colors cursor-pointer border text-center truncate',
                  isSelected
                    ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                    : 'bg-background hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
                )}
              >
                {p.label}
              </button>
            )
          })}
        </div>

        {/* 3. Lịch chọn ngày (Calendar) thu gọn */}
        <div className="p-1 flex justify-center bg-background">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={(d) => {
              if (d) {
                setTempDate(d)
                setNavMonth(d)
              }
            }}
            month={navMonth || tempDate || new Date()}
            onMonthChange={setNavMonth}
            captionLayout="label"
            className="p-1 text-xs [--cell-size:1.75rem]"
          />
        </div>

        {/* 4. Khối chọn giờ hẹn (Gọn gàng trong 1 khu vực nhỏ) */}
        <div className="px-2.5 py-1.5 border-t border-border/60 bg-muted/15 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              Giờ hẹn:
            </span>

            {/* Dropdown Giờ & Phút trực tiếp */}
            <div className="flex items-center gap-1">
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="h-6 px-1 text-xs font-mono font-bold rounded border border-border/80 bg-background text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {HOURS_LIST.map((h) => (
                  <option key={h} value={h}>
                    {h}h
                  </option>
                ))}
              </select>
              <span className="text-xs font-bold text-muted-foreground">:</span>
              <select
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                className="h-6 px-1 text-xs font-mono font-bold rounded border border-border/80 bg-background text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {MINUTES_LIST.map((m) => (
                  <option key={m} value={m}>
                    {m}p
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mốc giờ nhanh: 5 mốc phổ biến nhất trong 1 dòng */}
          <div className="flex items-center justify-between gap-1">
            {QUICK_TIME_PRESETS.map((t) => {
              const isSelected = `${hour}:${minute}` === t

              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSelectQuickTime(t)}
                  className={cn(
                    'flex-1 h-5 text-[10px] font-mono rounded border text-center transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary font-bold shadow-2xs'
                      : 'bg-background border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* 5. Footer tinh giản: Xóa / Hủy / Lưu */}
        <div className="px-2.5 py-1.5 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs">
          <div>
            {value ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleClear()}
                className="h-6 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-[11px] cursor-pointer"
              >
                Xóa
              </Button>
            ) : (
              <span className="text-[10.5px] text-muted-foreground/60 italic">Chọn ngày &amp; giờ</span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-6 px-2 text-[11px] cursor-pointer text-muted-foreground hover:text-foreground"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirm}
              className="h-6 px-3 text-[11px] bg-primary text-primary-foreground font-semibold cursor-pointer shadow-2xs gap-1"
            >
              <Check className="h-3 w-3" />
              <span>Lưu</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
