'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FilterChipOption<T extends string> {
  value: T
  label: string
  count?: number
  disabled?: boolean
}

interface FilterChipGroupProps<T extends string> {
  value: T
  options: readonly FilterChipOption<T>[]
  onValueChange: (value: T) => void
  ariaLabel?: string
  className?: string
  itemClassName?: string
}

export function FilterChipGroup<T extends string>({
  value,
  options,
  onValueChange,
  ariaLabel,
  className,
  itemClassName,
}: FilterChipGroupProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex min-w-0 items-center gap-2 overflow-x-auto pb-0.5', className)}
    >
      {options.map((option) => {
        const active = option.value === value

        return (
          <Button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={option.disabled}
            variant={active ? 'default' : 'ghost'}
            size="xs"
            onClick={() => {
              if (!option.disabled) onValueChange(option.value)
            }}
            className={cn(
              'h-[30px] shrink-0 rounded-[10px] px-3 text-[11px] font-semibold whitespace-nowrap',
              active
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border border-transparent bg-background text-foreground hover:bg-muted',
              itemClassName
            )}
          >
            {option.label}
            {typeof option.count === 'number' ? ` (${option.count})` : null}
          </Button>
        )
      })}
    </div>
  )
}
