'use client'

import React, { useMemo, useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

export function parseDateString(val?: string | null): Date | null {
  if (!val) return null
  const parts = val.split('-')
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const d = parseInt(parts[2], 10)
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d)
    }
  }
  const timestamp = Date.parse(val)
  if (isNaN(timestamp)) return null
  return new Date(timestamp)
}

export function formatDateToDisplay(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? parseDateString(date) : date
  if (!d) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function formatDateToISO(date: Date | null | undefined): string {
  if (!date) return ''
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export interface DateRangePresetOption {
  id: string
  label: string
  startDate?: string
  endDate?: string
}

export const DEFAULT_DATE_PRESETS: DateRangePresetOption[] = [
  { id: 'all', label: 'Tất cả' },
  { id: '7days', label: '7 ngày qua', startDate: '2026-08-19', endDate: '2026-08-25' },
  { id: '30days', label: '30 ngày qua', startDate: '2026-07-27', endDate: '2026-08-25' },
  { id: 'this_month', label: 'Tháng 8/2026', startDate: '2026-08-01', endDate: '2026-08-31' },
  { id: 'last_month', label: 'Tháng trước (T07)', startDate: '2026-07-01', endDate: '2026-07-31' },
  { id: 'this_quarter', label: 'Quý này (Q3/2026)', startDate: '2026-07-01', endDate: '2026-09-30' },
]

export interface DateRangePickerProps {
  startDate?: string
  endDate?: string
  preset?: string
  defaultMonth?: Date
  presets?: DateRangePresetOption[]
  align?: 'start' | 'center' | 'end'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  triggerClassName?: string
  placeholder?: string
  onApply: (values: {
    startDate: string
    endDate: string
    preset: string
    label: string
  }) => void
  onClear?: () => void
}

/**
 * DateRangePicker: Modal / Popover chọn khoảng ngày hiện đại chuẩn Rinov5 Design System
 * - Cột trái: Danh mục khoảng thời gian thiết lập sẵn (KHOẢNG THỜI GIAN)
 * - Cột phải: Lịch tương tác chọn ngày bắt đầu - kết thúc (mode="range") + nút Áp dụng
 */
export function DateRangePicker({
  startDate = '',
  endDate = '',
  preset = 'all',
  defaultMonth,
  presets = DEFAULT_DATE_PRESETS,
  align = 'start',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  trigger,
  triggerClassName,
  placeholder = 'Tất cả thời gian',
  onApply,
  onClear,
}: DateRangePickerProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen
  const setIsOpen = (nextOpen: boolean) => {
    if (isControlled) {
      setControlledOpen?.(nextOpen)
    } else {
      setInternalOpen(nextOpen)
    }
  }

  // Local draft states inside popover
  const [draftPreset, setDraftPreset] = useState<string>(preset)
  const [draftStartDate, setDraftStartDate] = useState<string>(startDate)
  const [draftEndDate, setDraftEndDate] = useState<string>(endDate)

  // Sync draft states when popover opens
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDraftPreset(preset)
      setDraftStartDate(startDate)
      setDraftEndDate(endDate)
    }
    setIsOpen(nextOpen)
  }

  const selectedRange: DateRange | undefined = useMemo(() => {
    const from = draftStartDate ? parseDateString(draftStartDate) ?? undefined : undefined
    const to = draftEndDate ? parseDateString(draftEndDate) ?? undefined : undefined
    if (!from && !to) return undefined
    return { from, to }
  }, [draftStartDate, draftEndDate])

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setDraftStartDate('')
      setDraftEndDate('')
      setDraftPreset('all')
      return
    }
    if (range.from) {
      setDraftStartDate(formatDateToISO(range.from))
      setDraftPreset('custom')
    } else {
      setDraftStartDate('')
    }
    if (range.to) {
      setDraftEndDate(formatDateToISO(range.to))
      setDraftPreset('custom')
    } else {
      setDraftEndDate('')
    }
  }

  const handlePresetSelect = (opt: DateRangePresetOption) => {
    setDraftPreset(opt.id)
    if (opt.id === 'all') {
      setDraftStartDate('')
      setDraftEndDate('')
    } else if (opt.startDate && opt.endDate) {
      setDraftStartDate(opt.startDate)
      setDraftEndDate(opt.endDate)
    }
  }

  const handleApplyClick = () => {
    const matchedPreset = presets.find((p) => p.id === draftPreset)
    let label = placeholder
    if (draftPreset === 'custom' && draftStartDate) {
      label = draftEndDate
        ? `${formatDateToDisplay(draftStartDate)} – ${formatDateToDisplay(draftEndDate)}`
        : `Từ ${formatDateToDisplay(draftStartDate)}`
    } else if (matchedPreset && matchedPreset.id !== 'all') {
      label = matchedPreset.label
    }

    onApply({
      startDate: draftStartDate,
      endDate: draftEndDate,
      preset: draftPreset,
      label,
    })
    setIsOpen(false)
  }

  const handleResetDefault = () => {
    setDraftPreset('all')
    setDraftStartDate('')
    setDraftEndDate('')
    onClear?.()
  }

  const displayLabel = useMemo(() => {
    if (preset === 'custom' && startDate) {
      return endDate
        ? `${formatDateToDisplay(startDate)} – ${formatDateToDisplay(endDate)}`
        : `Từ ${formatDateToDisplay(startDate)}`
    }
    const matched = presets.find((p) => p.id === preset)
    if (matched && matched.id !== 'all') {
      return matched.label
    }
    return placeholder
  }, [preset, startDate, endDate, presets, placeholder])

  const monthToView = useMemo(() => {
    if (draftStartDate) {
      const parsed = parseDateString(draftStartDate)
      if (parsed) return parsed
    }
    return defaultMonth || new Date(2026, 7, 1) // Aug 2026
  }, [draftStartDate, defaultMonth])

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              'h-8 px-2.5 text-xs font-medium border-border/80 bg-background hover:bg-muted rounded-lg gap-1.5 shadow-2xs cursor-pointer text-foreground transition-colors select-none',
              preset !== 'all' &&
                'border-primary/40 bg-primary/8 text-primary font-semibold',
              triggerClassName
            )}
          >
            <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate max-w-[180px]">{displayLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-70 shrink-0 ml-0.5" />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={6}
        className="w-auto p-0 bg-popover rounded-2xl shadow-2xl border border-border z-[9999] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
      >
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {/* Cột trái: KHOẢNG THỜI GIAN (Presets) */}
          <div className="w-full sm:w-44 p-3 bg-muted/20 flex flex-col justify-between shrink-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Khoảng thời gian
                </span>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                {presets.map((p) => {
                  const isActive = draftPreset === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer flex items-center justify-between',
                        isActive
                          ? 'bg-primary/10 text-primary font-bold border border-primary/25'
                          : 'hover:bg-muted text-foreground/85'
                      )}
                    >
                      <span className="truncate">{p.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 ml-1.5" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {draftPreset !== 'all' && (
              <div className="pt-2.5 border-t border-border/60 mt-3">
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Đặt lại mặc định
                </button>
              </div>
            )}
          </div>

          {/* Cột phải: Lịch tương tác (Interactive Calendar Range) */}
          <div className="p-3 space-y-2.5 bg-card">
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="text-xs font-semibold text-foreground truncate">
                {draftStartDate && draftEndDate ? (
                  <span className="text-primary font-bold">
                    {formatDateToDisplay(draftStartDate)} – {formatDateToDisplay(draftEndDate)}
                  </span>
                ) : draftStartDate ? (
                  <span>
                    Từ {formatDateToDisplay(draftStartDate)} (chọn ngày kết thúc)
                  </span>
                ) : (
                  <span className="text-muted-foreground">Chọn khoảng ngày trên lịch:</span>
                )}
              </div>
              {(draftStartDate || draftEndDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setDraftStartDate('')
                    setDraftEndDate('')
                    setDraftPreset('all')
                  }}
                  className="text-[11px] text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Xóa chọn
                </button>
              )}
            </div>

            <div className="rounded-xl border border-border p-1 bg-background">
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={handleRangeSelect}
                defaultMonth={monthToView}
                numberOfMonths={1}
                className="p-1"
              />
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/60 gap-3">
              <span className="text-[11px] text-muted-foreground italic">
                * Click chọn ngày bắt đầu và kết thúc
              </span>
              <Button
                type="button"
                size="sm"
                className="h-7 px-3 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg cursor-pointer shadow-xs shrink-0"
                onClick={handleApplyClick}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
