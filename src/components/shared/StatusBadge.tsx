'use client'

import { Badge } from '@/components/ui/badge'
import { getStatusBadgeClass, getStatusDotClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  /** Raw status string — passed through `resolveStatusSemantic()` */
  status: string
  /** Human-readable label. Falls back to formatted status. */
  label?: string
  /** Show a colored dot before the label */
  withDot?: boolean
  className?: string
}

const humanize = (s: string) =>
  s
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

/**
 * Single entry point for entity status badges.
 *
 * Resolves color via `@/lib/statusColors` — screens MUST NOT hardcode badge classes.
 *
 * @see docs/DESIGN_SYSTEM.md §3.2 Status Colors
 */
export function StatusBadge({
  status,
  label,
  withDot = false,
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      role="status"
      className={cn(
        'gap-1.5 rounded-full font-medium',
        getStatusBadgeClass(status),
        className
      )}
    >
      {withDot ? (
        <span
          aria-hidden
          className={cn('h-1.5 w-1.5 rounded-full', getStatusDotClass(status))}
        />
      ) : null}
      {label ?? humanize(status)}
    </Badge>
  )
}
