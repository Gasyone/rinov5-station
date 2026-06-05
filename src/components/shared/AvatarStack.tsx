'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export interface AvatarStackItem {
  label: string
  initials: string
}

interface AvatarStackProps {
  items: AvatarStackItem[]
  maxVisible?: number
  size?: 'xs' | 'sm' | 'md'
  variant?: 'default' | 'substitute'
  className?: string
}

const SIZE_MAP = {
  xs: 'h-5 w-5 text-[8px] border',
  sm: 'h-7 w-7 text-xs border-2',
  md: 'h-9 w-9 text-sm border-2',
}

const VARIANT_MAP = {
  default: 'bg-primary/10 text-primary border-card',
  substitute: 'bg-amber-100 text-amber-700 border-dashed border-muted-foreground/30',
}

/**
 * Stack of overlapping avatars — used for showing multiple teachers,
 * staff members, etc. on a table row.
 *
 * Follows the same visual pattern as BookingTest staff column.
 *
 * @see docs/DESIGN_SYSTEM.md §3.4 Avatar Groups
 */
export function AvatarStack({
  items,
  maxVisible = 3,
  size = 'sm',
  variant = 'default',
  className,
}: AvatarStackProps) {
  const visible = items.slice(0, maxVisible)
  const remaining = items.length - maxVisible

  return (
    <div className={cn('flex items-center -space-x-1.5', className)}>
      {visible.map((item) => (
        <Avatar
          key={item.label}
          className={cn(
            'shrink-0 font-bold shrink-0',
            SIZE_MAP[size],
            variant === 'substitute'
              ? 'border-dashed border-muted-foreground/30 bg-amber-100 text-amber-700'
              : 'bg-primary/10 text-primary border-card'
          )}
          title={item.label}
        >
          <AvatarFallback className="font-bold">{item.initials}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-bold',
            SIZE_MAP[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
