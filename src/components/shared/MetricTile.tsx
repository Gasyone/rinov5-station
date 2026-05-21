'use client'

import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

interface MetricTileProps {
  label: string
  value: ReactNode
  icon?: LucideIcon
  /** Trend indicator — green if `positive`, red otherwise */
  trend?: {
    value: string
    positive?: boolean
    /** Optional label after the trend value, e.g. "this month" */
    description?: string
  }
  /** Click handler — turns the tile into a button */
  onClick?: () => void
  /** Compact mode — smaller padding, text, and icon for dense layouts */
  compact?: boolean
  className?: string
}

/**
 * KPI tile for Dashboard and module overview pages.
 *
 * Layout: large value left, icon chip right, optional trend line below.
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 / Dashboard pattern
 */
export function MetricTile({
  label,
  value,
  icon: Icon,
  trend,
  onClick,
  compact,
  className,
}: MetricTileProps) {
  const interactive = Boolean(onClick)
  const content = (
    <CardContent className={cn('flex items-center justify-between gap-3', compact ? 'px-3 py-2' : 'p-4')}>
      <div className="min-w-0">
        <p className={cn('font-medium uppercase tracking-wide text-muted-foreground', compact ? 'text-[10px]' : 'text-xs')}>
          {label}
        </p>
        <p className={cn('font-semibold', compact ? 'text-lg' : 'mt-1 text-2xl')}>{value}</p>
        {trend ? (
          <p
            className={cn(
              'mt-1 text-xs font-medium',
              // Resolve through statusColors so light/dark contrast follows the same rules as badges.
              trend.positive === false ? getStatusColors('error').text : getStatusColors('success').text
            )}
          >
            {trend.value}
            {trend.description ? (
              <span className="ml-1 text-muted-foreground">{trend.description}</span>
            ) : null}
          </p>
        ) : null}
      </div>
      {Icon ? (
        <div className={cn(
          'shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground',
          compact ? 'flex h-8 w-8' : 'flex h-10 w-10'
        )}>
          <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
        </div>
      ) : null}
    </CardContent>
  )

  if (!interactive) {
    return <Card className={className}>{content}</Card>
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick?.()
        }
      }}
      className={cn(
        'cursor-pointer transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {content}
    </Card>
  )
}
