'use client'

import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  /** Main message displayed below the icon */
  title?: string
  /** Supporting text below the title */
  description?: string
  /** Custom icon — defaults to Inbox */
  icon?: React.ReactNode
  /** Optional call-to-action */
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * Standard empty state component.
 *
 * Use when:
 * - A data table has no records
 * - A search/filter returns no results
 * - A new module has no data yet
 *
 * @see docs/DESIGN_SYSTEM.md §4.5 Loading & Empty States
 */
export function EmptyState({
  title = 'Không có dữ liệu',
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        {icon ?? <Inbox className="h-7 w-7 text-muted-foreground" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Button size="sm" variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  )
}
