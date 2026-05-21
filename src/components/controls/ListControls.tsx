'use client'

import { useRef, useState } from 'react'
import { Filter, Search, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SegmentedControlOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  value: T
  options: SegmentedControlOption<T>[]
  onValueChange: (value: T) => void
  className?: string
  itemClassName?: string
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onValueChange,
  className,
  itemClassName,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn('inline-flex items-center gap-0.5 rounded-md bg-muted/60 p-0.5', className)}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant="ghost"
          className={cn(
            'h-8 rounded px-3 text-xs font-semibold transition-colors',
            value === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
            itemClassName
          )}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

interface ToolbarSelectOption {
  value: string
  label: string
}

interface ToolbarSelectProps {
  value: string
  options: ToolbarSelectOption[]
  onValueChange: (value: string) => void
  className?: string
  ariaLabel?: string
}

export function ToolbarSelect({
  value,
  options,
  onValueChange,
  className,
  ariaLabel,
}: ToolbarSelectProps) {
  const EMPTY_SENTINEL = '__empty__'

  return (
    <Select
      value={value || EMPTY_SENTINEL}
      onValueChange={(v) => onValueChange(v === EMPTY_SENTINEL ? '' : v)}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        size="sm"
        className={cn('min-w-40 bg-background text-xs shadow-xs', className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value || EMPTY_SENTINEL} value={option.value || EMPTY_SENTINEL}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface InlineSelectProps {
  value: string
  options: ToolbarSelectOption[]
  onValueChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  ariaLabel?: string
  className?: string
}

const EMPTY_SELECT_VALUE = '__empty__'

export function InlineSelect({
  value,
  options,
  onValueChange,
  disabled,
  placeholder,
  ariaLabel,
  className,
}: InlineSelectProps) {
  const selectValue = value || EMPTY_SELECT_VALUE

  return (
    <Select
      value={selectValue}
      disabled={disabled}
      onValueChange={(nextValue) => onValueChange(nextValue === EMPTY_SELECT_VALUE ? '' : nextValue)}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        size="sm"
        className={cn('w-full border-dashed bg-background text-xs shadow-none', className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value || EMPTY_SELECT_VALUE}
            value={option.value || EMPTY_SELECT_VALUE}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface BranchSelectProps {
  value: string
  branches: string[]
  onValueChange: (value: string) => void
  allLabel?: string
  ariaLabel?: string
  className?: string
}

export function BranchSelect({
  value,
  branches,
  onValueChange,
  allLabel = 'Tất cả trung tâm',
  ariaLabel = 'Trung tâm',
  className,
}: BranchSelectProps) {
  return (
    <ToolbarSelect
      value={value}
      ariaLabel={ariaLabel}
      options={[
        { value: '', label: allLabel },
        ...branches.map((branch) => ({ value: branch, label: branch })),
      ]}
      onValueChange={onValueChange}
      className={className}
    />
  )
}

interface IconActionButtonProps {
  icon: LucideIcon
  label: string
  onClick?: () => void
  activeCount?: number
  disabled?: boolean
  className?: string
  iconClassName?: string
}

export function IconActionButton({
  icon: Icon,
  label,
  onClick,
  activeCount,
  disabled,
  className,
  iconClassName,
}: IconActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn('relative bg-transparent shadow-none hover:bg-accent/70', className)}
    >
      <Icon className={cn('h-4 w-4', iconClassName)} />
      {activeCount ? (
        <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[9px] leading-none">
          {activeCount}
        </Badge>
      ) : null}
    </Button>
  )
}

interface FilterIconButtonProps {
  count?: number
  onClick: () => void
  label?: string
  className?: string
}

export function FilterIconButton({
  count,
  onClick,
  label = 'Bộ lọc',
  className,
}: FilterIconButtonProps) {
  return (
    <IconActionButton
      icon={Filter}
      label={label}
      activeCount={count}
      onClick={onClick}
      className={className}
    />
  )
}

interface ExpandableSearchProps {
  value: string
  onValueChange: (value: string) => void
  onSearchOpen?: () => void
  placeholder?: string
  label?: string
  className?: string
  inputClassName?: string
}

export function ExpandableSearch({
  value,
  onValueChange,
  onSearchOpen,
  placeholder = 'Tìm kiếm...',
  label = 'Tìm kiếm',
  className,
  inputClassName,
}: ExpandableSearchProps) {
  const [open, setOpen] = useState(Boolean(value))
  const inputRef = useRef<HTMLInputElement>(null)

  const openSearch = () => {
    setOpen(true)
    onSearchOpen?.()
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <div className={cn('flex items-center gap-1.5', open ? 'w-full sm:w-auto' : '', className)}>
      <IconActionButton icon={Search} label={label} onClick={openSearch} />
      {open ? (
        <Input
          ref={inputRef}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onBlur={(event) => {
            if (!event.currentTarget.value.trim()) setOpen(false)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.currentTarget.blur()
              if (!value.trim()) setOpen(false)
            }
          }}
          placeholder={placeholder}
          className={cn(
            'h-8 w-full min-w-0 border border-input bg-background px-3 text-xs shadow-xs focus-visible:ring-[3px] sm:w-72',
            inputClassName
          )}
        />
      ) : null}
    </div>
  )
}
