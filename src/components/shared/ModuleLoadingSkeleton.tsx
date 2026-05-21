'use client'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface ModuleLoadingSkeletonProps {
  /** Number of skeleton rows to render */
  rows?: number
  /** Number of columns per row */
  columns?: number
  /** Show toolbar skeleton (search + buttons) */
  showToolbar?: boolean
  className?: string
}

/**
 * Standard loading skeleton for data table screens.
 *
 * Renders a shimmer layout that mirrors the List Page Pattern:
 * Toolbar → Table header → Table rows
 *
 * @see docs/DESIGN_SYSTEM.md §4.5 Loading & Empty States
 */
export function ModuleLoadingSkeleton({
  rows = 8,
  columns = 5,
  showToolbar = true,
  className,
}: ModuleLoadingSkeletonProps) {
  return (
    <div
      data-slot="module-loading-skeleton"
      className={cn('flex flex-col gap-4 p-4 lg:p-6', className)}
    >
      {/* Toolbar skeleton */}
      {showToolbar ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-40 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      ) : null}

      {/* Table skeleton */}
      <div className="rounded-lg border">
        {/* Header */}
        <div className="flex items-center gap-3 border-b bg-muted/50 px-3 py-2.5">
          {Array.from({ length: columns }, (_, i) => (
            <Skeleton
              key={`header-${i}`}
              className={cn(
                'h-4 rounded',
                i === 0 ? 'w-48' : i === columns - 1 ? 'w-20' : 'w-32'
              )}
            />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex items-center gap-3 border-b px-3 py-3 last:border-b-0"
          >
            {Array.from({ length: columns }, (_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className={cn(
                  'h-4 rounded',
                  colIndex === 0
                    ? 'w-48'
                    : colIndex === columns - 1
                      ? 'w-20'
                      : 'w-32'
                )}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={`page-${i}`} className="h-8 w-8 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}
