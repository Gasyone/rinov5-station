'use client'

import { useState, useMemo, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface SearchableInlineOption {
  value: string
  label: string
  subText?: string
  isConflict?: boolean
  conflictText?: string
}

export interface SearchableInlineSelectProps {
  value: string
  options: SearchableInlineOption[]
  placeholder: string
  onValueChange: (val: string) => void
  disabled?: boolean
  className?: string
}

export function DirectSearchableSelect({
  value,
  options,
  placeholder,
  onValueChange,
  disabled,
  className,
}: SearchableInlineSelectProps) {
  const selectedOption = options.find((opt) => opt.value === value)
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(selectedOption?.label || '')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setInputValue(selectedOption?.label || '')
    }
  }, [value, selectedOption, isFocused])

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim() || (selectedOption && inputValue === selectedOption.label)) {
      return options
    }
    const q = inputValue.toLowerCase()
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subText && opt.subText.toLowerCase().includes(q))
    )
  }, [options, inputValue, selectedOption])

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            value={inputValue}
            disabled={disabled}
            placeholder={placeholder}
            onFocus={() => {
              setIsFocused(true)
              setOpen(true)
            }}
            onBlur={() => {
              setIsFocused(false)
            }}
            onChange={(e) => {
              const val = e.target.value
              setInputValue(val)
              if (!open) setOpen(true)
              if (!val) {
                onValueChange('')
              }
            }}
            className={cn(
              'h-8 text-[12px] bg-background pr-7 text-left font-normal truncate',
              selectedOption?.isConflict &&
                'border-red-400 bg-red-50/50 text-red-700 dark:bg-red-950/20 dark:text-red-300 font-medium',
              className
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-muted-foreground">
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-1.5 z-50 bg-background border rounded-xl shadow-xl"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-[200px] overflow-y-auto space-y-0.5 custom-scrollbar">
          {value ? (
            <div
              onMouseDown={(e) => {
                e.preventDefault()
                onValueChange('')
                setInputValue('')
                setOpen(false)
              }}
              className="p-1.5 rounded-md cursor-pointer text-[11px] text-muted-foreground hover:bg-muted/60 transition-colors italic"
            >
              -- Bỏ chọn / Chưa gán --
            </div>
          ) : null}
          {filteredOptions.length === 0 ? (
            <div className="text-center py-3 text-xs text-muted-foreground">
              Không tìm thấy dữ liệu
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === value
              return (
                <div
                  key={opt.value}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onValueChange(opt.value)
                    setInputValue(opt.label)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex flex-col gap-0.5 p-2 rounded-lg cursor-pointer transition-colors text-xs',
                    isSelected
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted/50 text-foreground'
                  )}
                >
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    <span className="truncate font-semibold">{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </div>
                  {opt.subText && (
                    <span className="truncate text-[10px] text-muted-foreground">
                      {opt.subText}
                    </span>
                  )}
                  {opt.isConflict && opt.conflictText && (
                    <span className="text-[10px] text-red-500 font-semibold mt-0.5 truncate">
                      Trùng: {opt.conflictText}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
