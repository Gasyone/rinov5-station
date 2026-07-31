'use client'

import { useRef, useState, type ReactNode } from 'react'
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
  label: ReactNode
  disabled?: boolean
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
          disabled={option.disabled}
          className={cn(
            'h-8 rounded px-3 text-xs font-semibold transition-colors',
            value === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
            option.disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-muted-foreground',
            itemClassName
          )}
          onClick={() => {
            if (!option.disabled) {
              onValueChange(option.value)
            }
          }}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export interface ToolbarSelectOption {
  value: string
  label: string
  selectedLabel?: string
}

interface ToolbarSelectProps {
  value: string
  options: ToolbarSelectOption[]
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export function ToolbarSelect({
  value,
  options,
  onValueChange,
  disabled,
  className,
  ariaLabel,
}: ToolbarSelectProps) {
  const EMPTY_SENTINEL = '__empty__'
  const selectedOpt = options.find(
    (o) => (o.value || EMPTY_SENTINEL) === (value || EMPTY_SENTINEL)
  )

  return (
    <Select
      value={value || EMPTY_SENTINEL}
      disabled={disabled}
      onValueChange={(v) => onValueChange(v === EMPTY_SENTINEL ? '' : v)}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        size="sm"
        className={cn('min-w-40 bg-background text-xs shadow-xs', className)}
      >
        {selectedOpt?.selectedLabel ? (
          <span className="line-clamp-1">{selectedOpt.selectedLabel}</span>
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem key={`${option.value || EMPTY_SENTINEL}-${index}`} value={option.value || EMPTY_SENTINEL}>
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
  variant?: 'solid' | 'dashed'
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
  variant = 'dashed',
}: InlineSelectProps) {
  // Check if there is an empty option in the provided list
  const hasEmptyOption = options.some((opt) => opt.value === '' || opt.value === EMPTY_SELECT_VALUE)
  
  // If there's an empty option, use the sentinel value. Otherwise, use raw value or undefined to show placeholder.
  const selectValue = hasEmptyOption ? (value || EMPTY_SELECT_VALUE) : (value || undefined)

  return (
    <Select
      value={selectValue}
      disabled={disabled}
      onValueChange={(v) => {
        if (hasEmptyOption) {
          onValueChange(v === EMPTY_SELECT_VALUE ? '' : v)
        } else {
          onValueChange(v || '')
        }
      }}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        size="sm"
        className={cn(
          'inline-flex w-full min-w-0 max-w-full items-center justify-between overflow-hidden text-ellipsis whitespace-nowrap bg-background text-xs shadow-none',
          variant === 'dashed' ? 'border-dashed' : 'border-solid',
          className
        )}
      >
        <span className="block truncate text-left max-w-[calc(100%-12px)]">
          <SelectValue placeholder={placeholder} />
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => {
          const itemVal = hasEmptyOption && !option.value ? EMPTY_SELECT_VALUE : option.value
          return (
            <SelectItem
              key={`${itemVal || EMPTY_SELECT_VALUE}-${index}`}
              value={itemVal || EMPTY_SELECT_VALUE}
            >
              {option.label}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

export const SYSTEM_BRANCHES = [
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Linh Đàm',
  'RinoEdu Smart City',
]

interface BranchSelectProps {
  value: string
  branches?: string[]
  onValueChange: (value: string) => void
  allLabel?: string
  allValue?: string
  includeAll?: boolean
  variant?: 'toolbar' | 'inline'
  placeholder?: string
  disabled?: boolean
  ariaLabel?: string
  className?: string
}

export function BranchSelect({
  value,
  branches = SYSTEM_BRANCHES,
  onValueChange,
  allLabel = 'Tất cả cơ sở',
  allValue = 'all',
  includeAll,
  variant = 'toolbar',
  placeholder = 'Chọn cơ sở',
  disabled,
  ariaLabel = 'Cơ sở',
  className,
}: BranchSelectProps) {
  const shouldIncludeAll = includeAll ?? variant === 'toolbar'
  const leadingOption = shouldIncludeAll
    ? { value: allValue, label: allLabel }
    : variant === 'inline'
      ? { value: '', label: placeholder }
      : null
  const options = [
    ...(leadingOption ? [leadingOption] : []),
    ...branches.map((branch) => ({ value: branch, label: branch })),
  ]

  if (variant === 'inline') {
    return (
      <InlineSelect
        value={value}
        ariaLabel={ariaLabel}
        disabled={disabled}
        options={options}
        placeholder={placeholder}
        onValueChange={onValueChange}
        className={className}
      />
    )
  }

  return (
    <ToolbarSelect
      value={value}
      ariaLabel={ariaLabel}
      disabled={disabled}
      options={options}
      onValueChange={onValueChange}
      className={className}
    />
  )
}

interface SubjectSelectProps {
  value: string
  subjects?: string[]
  options?: ToolbarSelectOption[]
  onValueChange: (value: string) => void
  allLabel?: string
  allValue?: string
  includeAll?: boolean
  variant?: 'toolbar' | 'inline'
  placeholder?: string
  disabled?: boolean
  ariaLabel?: string
  className?: string
}

export function SubjectSelect({
  value,
  subjects = [],
  options: customOptions,
  onValueChange,
  allLabel = 'Tất cả môn',
  allValue = 'all',
  includeAll,
  variant = 'toolbar',
  placeholder = 'Chọn môn học',
  disabled,
  ariaLabel = 'Môn học',
  className,
}: SubjectSelectProps) {
  let options = customOptions
  if (!options) {
    if (subjects.length > 0) {
      const shouldIncludeAll = includeAll ?? variant === 'toolbar'
      const leadingOption = shouldIncludeAll
        ? { value: allValue, label: allLabel }
        : variant === 'inline'
          ? { value: '', label: placeholder }
          : null
      options = [
        ...(leadingOption ? [leadingOption] : []),
        ...subjects.map((subject) => ({ value: subject, label: subject })),
      ]
    } else {
      const standardSubjects = [
        { value: 'math', label: 'Toán' },
        { value: 'english', label: 'Tiếng Anh' },
        { value: 'vietnamese', label: 'Tiếng Việt' },
      ]
      const shouldIncludeAll = includeAll ?? variant === 'toolbar'
      const leadingOption = shouldIncludeAll
        ? { value: allValue, label: allLabel }
        : variant === 'inline'
          ? { value: '', label: placeholder }
          : null
      options = [
        ...(leadingOption ? [leadingOption] : []),
        ...standardSubjects,
      ]
    }
  }

  if (variant === 'inline') {
    return (
      <InlineSelect
        value={value}
        ariaLabel={ariaLabel}
        disabled={disabled}
        options={options}
        placeholder={placeholder}
        onValueChange={onValueChange}
        className={className}
      />
    )
  }

  return (
    <ToolbarSelect
      value={value}
      ariaLabel={ariaLabel}
      disabled={disabled}
      options={options}
      onValueChange={onValueChange}
      className={className}
    />
  )
}

interface SubjectSegmentedControlProps<T extends string> {
  value: T
  subjects: readonly T[]
  onValueChange: (value: T) => void
  getLabel?: (subject: T) => string
  disabledSubjects?: readonly T[]
  className?: string
  itemClassName?: string
}

export function SubjectSegmentedControl<T extends string>({
  value,
  subjects,
  onValueChange,
  getLabel = (subject) => subject,
  disabledSubjects = [],
  className,
  itemClassName,
}: SubjectSegmentedControlProps<T>) {
  return (
    <SegmentedControl
      value={value}
      options={subjects.map((subject) => ({
        value: subject,
        label: getLabel(subject),
        disabled: disabledSubjects.includes(subject),
      }))}
      onValueChange={onValueChange}
      className={className}
      itemClassName={itemClassName}
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
