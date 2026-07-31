'use client'

import { type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AppAvatar } from './AppAvatar'

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
  userId?: string
  userType?: 'teacher' | 'student' | 'parent' | 'staff'
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
  userId,
  userType,
}: EntityCellProps) {
  const interactive = Boolean(onClick)

  const content = (
    <>
      <AppAvatar
        src={avatar}
        name={name}
        initials={initials}
        size="md"
        shape="circle"
        userId={userId}
        userType={userType}
      />
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
