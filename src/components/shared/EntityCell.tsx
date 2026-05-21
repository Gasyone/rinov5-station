'use client'

import { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

interface EntityCellProps {
  /** Primary line — usually the entity name */
  name: string
  /** Secondary line — ID, code, email, etc. */
  supporting?: ReactNode
  /** Avatar image URL */
  avatar?: string | null
  /** Override the auto-generated initials */
  initials?: string
  /** Click handler — turns the cell into a button */
  onClick?: () => void
  className?: string
}

/**
 * Standard table cell: avatar/initials + name + secondary line.
 *
 * Used across List Page Pattern (Students, Employees, Bookings, etc.).
 * Keeps the visual treatment consistent across every entity list.
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern
 */
export function EntityCell({
  name,
  supporting,
  avatar,
  initials,
  onClick,
  className,
}: EntityCellProps) {
  const resolvedInitials = initials ?? getInitials(name)
  const interactive = Boolean(onClick)

  const content = (
    <>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-sm font-bold text-foreground">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden>{resolvedInitials}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        {supporting ? (
          <p className="truncate font-mono text-xs text-muted-foreground">{supporting}</p>
        ) : null}
      </div>
    </>
  )

  if (!interactive) {
    return <div className={cn('flex min-w-0 items-center gap-3', className)}>{content}</div>
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        'flex h-auto min-w-0 items-center justify-start gap-3 whitespace-normal rounded-md p-0 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {content}
    </Button>
  )
}
