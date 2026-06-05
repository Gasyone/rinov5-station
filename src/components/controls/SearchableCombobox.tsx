'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'

export interface ComboboxOption {
  id: string
  label: string
  subLabel?: string
  avatar?: string
  initials?: string
}

interface SearchableComboboxProps<T extends string | string[]> {
  options: ComboboxOption[]
  value: T
  onChange: (value: T) => void
  placeholder?: string
  multiple?: boolean
  disabled?: boolean
  className?: string
}

export function SearchableCombobox<T extends string | string[]>({
  options,
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  multiple = false,
  disabled = false,
  className,
}: SearchableComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Derived selected options
  const selectedOptions = React.useMemo(() => {
    if (multiple) {
      const vals = Array.isArray(value) ? (value as string[]) : []
      return options.filter((opt) => vals.includes(opt.id))
    } else {
      return options.filter((opt) => opt.id === value)
    }
  }, [options, value, multiple])
  const singleSearchValue = !multiple && !open ? selectedOptions[0]?.label ?? '' : search

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    // Alphabetically sorted options (Vietnamese locale-aware)
    const sorted = [...options].sort((a, b) => a.label.localeCompare(b.label, 'vi'))
    if (!search) return sorted
    const q = search.toLowerCase()
    return sorted.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subLabel && opt.subLabel.toLowerCase().includes(q))
    )
  }, [options, search])

  const handleSelect = (id: string) => {
    if (multiple) {
      const currentVals = Array.isArray(value) ? (value as string[]) : []
      const nextVals = currentVals.includes(id)
        ? currentVals.filter((v) => v !== id)
        : [...currentVals, id]
      onChange(nextVals as T)
      setSearch('') // Clear search on select for multi-select
    } else {
      onChange(id as T)
      setSearch(options.find((o) => o.id === id)?.label || '')
      setOpen(false)
    }
  }

  // Handle backspace to delete last tag
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (multiple && e.key === 'Backspace' && !search) {
      const currentVals = Array.isArray(value) ? (value as string[]) : []
      if (currentVals.length > 0) {
        onChange(currentVals.slice(0, -1) as T)
      }
    }
  }

  const getInitials = (name: string) => {
    if (!name) return '?'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {multiple ? (
          // MULTIPLE MODE TRIGGER (TAG INPUT)
          <div
            onClick={() => {
              if (disabled) return
              setOpen(true)
              containerRef.current?.querySelector('input')?.focus()
            }}
            ref={containerRef}
            className={cn(
              "flex flex-wrap gap-1.5 min-h-[36px] w-full p-1.5 rounded-md border border-input bg-background items-center cursor-text hover:border-accent hover:bg-muted/10 transition-colors",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {selectedOptions.map((opt) => (
              <span
                key={opt.id}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium px-2 py-0.5 rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                {opt.label}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelect(opt.id)
                  }}
                  className="hover:bg-primary/20 text-primary/70 rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold text-[9px] cursor-pointer ml-1"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              disabled={disabled}
              value={open ? search : ''}
              onChange={(e) => {
                setSearch(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={selectedOptions.length === 0 ? placeholder : 'Thêm...'}
              className="flex-1 min-w-[80px] bg-transparent border-0 p-0 text-xs focus:ring-0 focus:outline-none"
            />
          </div>
        ) : (
          // SINGLE MODE TRIGGER (INPUT FIELD)
          <div className={cn("relative w-full", className)}>
            <Input
              disabled={disabled}
              value={singleSearchValue}
              onChange={(e) => {
                setSearch(e.target.value)
                if (!open) setOpen(true)
              }}
              onFocus={() => {
                setOpen(true)
                setSearch('') // Clear search on focus to show all alphabetical options
              }}
              placeholder={placeholder}
              className="w-full pr-8 text-sm bg-background h-9 border border-input rounded-md"
            />
            <span className="absolute right-2.5 top-2.5 text-muted-foreground text-xs pointer-events-none">🔍</span>
          </div>
        )}
      </PopoverTrigger>

      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] max-h-[260px] flex flex-col p-2 overflow-hidden bg-background border rounded-xl shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150"
        align="start"
      >
        <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar max-h-[240px]">
          {filteredOptions.length === 0 ? (
            <div className="text-center py-4 text-xs text-muted-foreground">
              Không tìm thấy kết quả nào
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = multiple
                ? (value as string[]).includes(opt.id)
                : value === opt.id
              const initials = opt.initials || getInitials(opt.label)
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50 text-foreground'
                  }`}
                >
                  {multiple && (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => handleSelect(opt.id)}
                      className="pointer-events-none shrink-0"
                    />
                  )}

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                    isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {initials}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="truncate font-semibold">{opt.label}</span>
                    {opt.subLabel && (
                      <span className="truncate text-[10px] text-muted-foreground">{opt.subLabel}</span>
                    )}
                  </div>

                  {!multiple && isSelected && (
                    <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-auto" />
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
