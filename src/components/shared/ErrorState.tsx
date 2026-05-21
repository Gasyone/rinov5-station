'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorStateProps {
  /** Error title */
  title?: string
  /** Error description / message */
  description?: string
  /** Retry handler — shows Retry button when provided */
  onRetry?: () => void
  className?: string
}

/**
 * Standard error state component.
 *
 * Use when:
 * - Data fetch fails
 * - An unexpected error occurs in a module
 *
 * @see docs/DESIGN_SYSTEM.md §4.5 Loading & Empty States
 */
export function ErrorState({
  title = 'Đã xảy ra lỗi',
  description = 'Không thể tải dữ liệu. Vui lòng thử lại.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      className={cn('flex items-center justify-center p-8', className)}
    >
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-1">
          {description}
          {onRetry ? (
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={onRetry}
            >
              Thử lại
            </Button>
          ) : null}
        </AlertDescription>
      </Alert>
    </div>
  )
}
