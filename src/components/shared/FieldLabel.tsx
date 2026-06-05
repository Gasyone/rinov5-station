'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FieldLabelProps {
  label: ReactNode
  children: ReactNode
  /** Optional helper text below the label */
  description?: string
  /** Mark field as required (adds red asterisk) */
  required?: boolean
  /** Inline error message — renders below the input in destructive color */
  error?: string
  className?: string
}

/**
 * Stacked form field wrapper. Per DS §4.4 F1: label sits ABOVE input.
 *
 * Replaces repeated field label/control markup across screens
 * so form layout stays consistent (label sizing, error treatment, gap).
 *
 * @see docs/DESIGN_SYSTEM.md §4.4 Form Pattern
 */
export function FieldLabel({
  label,
  children,
  description,
  required,
  error,
  className,
}: FieldLabelProps) {
  return (
    <label className={cn('grid gap-1.5', className)}>
      <span className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {typeof label === 'string' ? (
          <span className="flex items-center gap-1">
            {label}
            {required ? <span className="text-destructive">*</span> : null}
          </span>
        ) : (
          label
        )}
      </span>
      {children}
      {description && !error ? (
        <span className="text-xs text-muted-foreground">{description}</span>
      ) : null}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  )
}

interface InfoFieldProps {
  label: string
  value: ReactNode
  /** Secondary line below the value (timestamp, ID, etc.) */
  supporting?: ReactNode
  icon?: ReactNode
  valueClassName?: string
  className?: string
}

/**
 * Read-only label/value pair used in Detail page sections.
 * Pair with `<Panel />` to build a Detail Page section group.
 *
 * @see docs/DESIGN_SYSTEM.md §4.3 Detail Page Pattern
 */
export function InfoField({
  label,
  value,
  supporting,
  icon,
  valueClassName,
  className,
}: InfoFieldProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className={cn('truncate text-sm font-semibold', valueClassName)}>{value}</div>
      {supporting ? (
        <div className="truncate text-xs text-muted-foreground">{supporting}</div>
      ) : null}
    </div>
  )
}

interface PanelProps {
  title: string
  icon?: ReactNode
  /** Right-aligned slot for actions like "Edit" button */
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * Detail Page section block — uppercase title + optional icon + content.
 *
 * @see docs/DESIGN_SYSTEM.md §4.3 Detail Page Pattern
 */
export function Panel({
  title,
  icon,
  actions,
  children,
  className,
}: PanelProps) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          {icon}
          {title}
        </h3>
        {actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}
