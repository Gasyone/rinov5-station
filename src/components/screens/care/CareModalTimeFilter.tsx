'use client'

import React, { useState } from 'react'
import { ChevronDown, Check, Calendar as CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { 
  type TimeRangeKey, 
  TIME_RANGE_OPTIONS 
} from './careModalFilterHelpers'

interface CareModalTimeFilterProps {
  value: TimeRangeKey
  onChange: (value: TimeRangeKey, customStart?: string, customEnd?: string) => void
  customStart?: string
  customEnd?: string
  className?: string
}

export function CareModalTimeFilter({
  value,
  onChange,
  customStart = '',
  customEnd = '',
  className
}: CareModalTimeFilterProps) {
  const [open, setOpen] = useState(false)
  const [isCustomEditing, setIsCustomEditing] = useState(false)
  const [localStart, setLocalStart] = useState(customStart || '2026-07-01')
  const [localEnd, setLocalEnd] = useState(customEnd || '2026-08-25')

  const currentOption = TIME_RANGE_OPTIONS.find((opt) => opt.key === value) || TIME_RANGE_OPTIONS[0]

  const displayLabel = value === 'custom' && customStart && customEnd
    ? `${customStart.split('-').reverse().join('/')} - ${customEnd.split('-').reverse().join('/')}`
    : currentOption.label

  const handleSelectOption = (key: TimeRangeKey) => {
    if (key === 'custom') {
      setIsCustomEditing(true)
    } else {
      setIsCustomEditing(false)
      onChange(key)
      setOpen(false)
    }
  }

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault()
    if (localStart && localEnd) {
      onChange('custom', localStart, localEnd)
      setOpen(false)
      setIsCustomEditing(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) setIsCustomEditing(false)
    }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-8 px-3 py-1 text-xs rounded-lg border bg-background hover:bg-muted/50 text-foreground font-normal transition-all flex items-center justify-between gap-2 cursor-pointer shadow-3xs outline-none select-none",
            open && "border-primary/50 ring-1 ring-primary/20",
            className
          )}
        >
          <span className="truncate max-w-[190px]">{displayLabel}</span>
          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground/80 shrink-0 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-56 p-1 rounded-xl shadow-md border bg-popover text-popover-foreground z-50 text-xs text-left select-none animate-in fade-in-50 zoom-in-95"
      >
        <div className="space-y-0.5">
          {TIME_RANGE_OPTIONS.map((opt) => {
            const isSelected = value === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectOption(opt.key)}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer",
                  isSelected
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-medium"
                    : "text-foreground hover:bg-muted/60"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Custom date range inline editor */}
        {isCustomEditing && (
          <form onSubmit={handleApplyCustom} className="p-2 mt-1 border-t border-border/50 bg-muted/20 rounded-b-lg space-y-2">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                Chọn khoảng ngày:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Từ ngày</span>
                  <input
                    type="date"
                    value={localStart}
                    onChange={(e) => setLocalStart(e.target.value)}
                    className="w-full text-xs px-1.5 py-1 bg-background border border-border/70 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block mb-0.5">Đến ngày</span>
                  <input
                    type="date"
                    value={localEnd}
                    onChange={(e) => setLocalEnd(e.target.value)}
                    className="w-full text-xs px-1.5 py-1 bg-background border border-border/70 rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => setIsCustomEditing(false)}
                className="px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground rounded cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-2.5 py-0.5 text-xs bg-sky-600 text-white rounded font-medium hover:bg-sky-700 cursor-pointer shadow-3xs"
              >
                Áp dụng
              </button>
            </div>
          </form>
        )}
      </PopoverContent>
    </Popover>
  )
}
