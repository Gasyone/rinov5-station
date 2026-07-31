'use client'

import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  value: string[]
  onValueChange: (value: string[]) => void
  options: Option[]
  placeholder?: string
  className?: string
  disabled?: boolean
  align?: 'start' | 'center' | 'end'
}

export function MultiSelectDropdown({
  value = [],
  onValueChange,
  options = [],
  placeholder = 'Chọn...',
  className,
  disabled,
  align = 'start',
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false)

  const handleToggle = (val: string) => {
    const nextValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val]
    onValueChange(nextValue)
  }

  const displayText = value.length > 0
    ? options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label)
        .join(', ')
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-9 text-xs font-semibold px-3 bg-background border shadow-none hover:bg-background",
            value.length === 0 && "text-muted-foreground font-normal",
            className
          )}
        >
          <span className="block truncate text-left max-w-[calc(100%-16px)]">
            {displayText}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 max-h-[300px] overflow-y-auto custom-scrollbar" align={align}>
        <div className="space-y-1">
          {options.length === 0 ? (
            <div className="p-2 text-center text-xs text-muted-foreground">Không có tùy chọn</div>
          ) : (
            options.map((opt) => {
              const isChecked = value.includes(opt.value)
              return (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 hover:bg-muted select-none text-xs font-medium text-foreground"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(opt.value)}
                  />
                  <span className="truncate">{opt.label}</span>
                </label>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
