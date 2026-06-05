'use client'

import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { SYSTEM_BRANCHES } from './ListControls'

interface MultiBranchSelectProps {
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiBranchSelect({
  value = [],
  onValueChange,
  placeholder = 'Chọn cơ sở...',
  className,
  disabled
}: MultiBranchSelectProps) {
  const [open, setOpen] = useState(false)

  const handleToggle = (branch: string) => {
    const nextValue = value.includes(branch)
      ? value.filter((v) => v !== branch)
      : [...value, branch]
    onValueChange(nextValue)
  }

  const displayText = value.length > 0
    ? value.join(', ')
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
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {SYSTEM_BRANCHES.map((branch) => {
            const isChecked = value.includes(branch)
            return (
              <label
                key={branch}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 hover:bg-muted select-none text-xs font-medium text-foreground"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(branch)}
                />
                <span className="truncate">{branch}</span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
