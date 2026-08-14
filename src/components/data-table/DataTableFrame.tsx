'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DataTableFrameProps {
  children: ReactNode
  footer?: ReactNode
  className?: string
  viewportClassName?: string
  footerClassName?: string
}

export function DataTableFrame({
  children,
  footer,
  className,
  viewportClassName,
  footerClassName,
}: DataTableFrameProps) {
  return (
    <div className={cn('flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-card', className)}>
      <div
        className={cn('min-h-0 flex-1 flex flex-col overflow-auto', viewportClassName)}
      >
        {children}
      </div>

      {footer ? (
        <div className={cn('shrink-0 border-t border-border bg-card', footerClassName)}>
          {footer}
        </div>
      ) : null}
    </div>
  )
}
