'use client'

import React, { useMemo, useState } from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'

export interface DatePickerProps {
  /** Giá trị ngày định dạng chuẩn ISO YYYY-MM-DD */
  value?: string
  /** Callback khi người dùng chọn ngày mới */
  onChange?: (val: string) => void
  /** Placeholder khi chưa có ngày */
  placeholder?: string
  /** Vô hiệu hóa control */
  disabled?: boolean
  /** ClassName bổ sung cho nút trigger */
  className?: string
  triggerClassName?: string
  /** Căn lề popover so với nút trigger */
  align?: 'start' | 'center' | 'end'
  /** Tháng bắt đầu cho dropdown chọn năm */
  startMonth?: Date
  /** Tháng kết thúc cho dropdown chọn năm */
  endMonth?: Date
  /** Kiểu hiển thị tiêu đề lịch */
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
  /** Hiển thị nút xóa */
  showClear?: boolean
  /** Hiển thị nút chọn ngày hôm nay */
  showToday?: boolean
  /** Nhãn nút xóa */
  clearLabel?: string
  /** Nhãn nút hôm nay */
  todayLabel?: string
}

import {
  formatDateToDisplay,
  formatDateToISO,
  parseDateString,
} from './DateRangePicker'

/**
 * Component DatePicker chọn ngày đơn lẻ chuẩn Rinov5 Design System
 * - Sử dụng Popover + Calendar của hệ thống thay thế input native của browser
 * - Hỗ trợ dropdown chọn năm & tháng nhanh cho ngày sinh hoặc ngày thao tác
 * - Hiển thị định dạng ngày thân thiện DD/MM/YYYY
 */
export function DatePicker({
  value = '',
  onChange,
  placeholder = 'Chọn ngày sinh',
  disabled = false,
  className,
  triggerClassName,
  align = 'end',
  startMonth = new Date(1995, 0),
  endMonth = new Date(2035, 11),
  captionLayout = 'dropdown',
  showClear = true,
  showToday = true,
  clearLabel = 'Xóa',
  todayLabel = 'Hôm nay',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [navMonth, setNavMonth] = useState<Date | undefined>(undefined)

  const selectedDate = useMemo(() => {
    return parseDateString(value) ?? undefined
  }, [value])

  const displayLabel = useMemo(() => {
    if (!value) return placeholder
    const formatted = formatDateToDisplay(value)
    return formatted || placeholder
  }, [value, placeholder])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) {
      setNavMonth(selectedDate)
    }
  }

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(formatDateToISO(date))
      setNavMonth(date)
      setOpen(false)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.('')
    setNavMonth(undefined)
    setOpen(false)
  }

  const handleToday = (e: React.MouseEvent) => {
    e.stopPropagation()
    const today = new Date()
    setNavMonth(today)
    onChange?.(formatDateToISO(today))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-2xs transition-colors hover:bg-muted/40 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none text-left disabled:cursor-not-allowed disabled:opacity-50',
            !value && 'text-muted-foreground',
            triggerClassName,
            className
          )}
        >
          <span
            className={cn(
              'font-medium truncate',
              value ? 'text-foreground font-mono' : 'text-muted-foreground'
            )}
          >
            {displayLabel}
          </span>
          <div className="flex items-center gap-1 shrink-0 ml-1.5 text-muted-foreground">
            {showClear && value && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                title="Xóa ngày đã chọn"
                className="hover:text-foreground p-0.5 rounded cursor-pointer transition-colors"
              >
                <X className="h-3 w-3" />
              </span>
            )}
            <CalendarIcon className="h-3.5 w-3.5" />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={4}
        className="w-auto p-0 z-[9999] shadow-xl border border-border rounded-xl bg-popover overflow-hidden"
      >
        <div className="p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            month={navMonth || selectedDate || new Date(2016, 8, 15)}
            onMonthChange={setNavMonth}
            captionLayout={captionLayout}
            startMonth={startMonth}
            endMonth={endMonth}
          />
        </div>

        {(showClear || showToday) && (
          <div className="p-2 pt-0 flex items-center justify-between border-t border-border/60 text-xs bg-muted/20">
            {showClear ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={!value}
                className="h-6 px-2 text-2xs text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-30"
              >
                {clearLabel}
              </Button>
            ) : (
              <div />
            )}
            {showToday && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleToday}
                className="h-6 px-2 text-2xs text-primary font-medium hover:text-primary/80 cursor-pointer"
              >
                {todayLabel}
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
