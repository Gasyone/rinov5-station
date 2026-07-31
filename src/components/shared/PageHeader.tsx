'use client'

import { type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from './StatusBadge'
import { BackButton } from './BackButton'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  /** Page or entity title */
  title: ReactNode
  /** Secondary line under the title (program, date range, etc.) */
  description?: ReactNode
  /** Short code or ID (`PER-001`) — rendered as a mono badge */
  code?: string
  /** Entity status — resolves through `getStatusBadgeClass` */
  status?: string
  statusLabel?: string
  /** Right-aligned actions (Edit, Save, More menu, etc.) */
  actions?: ReactNode
  /** Show back button left of the title */
  showBackButton?: boolean
  onBack?: () => void
  className?: string
}

/**
 * Standard header for Detail / Form full-page screens.
 *
 * Layout: [Back] Title + Status Badge + Code Badge ........ [Actions]
 *         Description
 *
 * @see docs/DESIGN_SYSTEM.md §4.3 Detail Page Pattern
 */
export function PageHeader({
  title,
  description,
  code,
  status,
  statusLabel,
  actions,
  showBackButton = false,
  onBack,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-2 px-3 py-3 lg:px-3 md:flex-row md:items-start md:justify-between',
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {showBackButton ? <BackButton onClick={onBack} /> : null}
          <h1 className="text-lg font-semibold leading-tight">{title}</h1>
          {status ? <StatusBadge status={status} label={statusLabel} /> : null}
          {code ? (
            <Badge variant="outline" className="rounded-md font-mono">
              {code}
            </Badge>
          ) : null}
        </div>
        {description ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
