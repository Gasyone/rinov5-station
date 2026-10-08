'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface DetailCardProps {
  title: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  titleClassName?: string
}

/** Thẻ thông tin nhỏ gọn chuẩn thiết kế Rinov5 */
export function DetailCard({
  title,
  icon,
  badge,
  actions,
  children,
  className,
  titleClassName,
}: DetailCardProps) {
  return (
    <div className={cn('rounded-lg border border-border/70 bg-card overflow-hidden shadow-2xs', className)}>
      <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-muted/50 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className={cn('flex items-center gap-1.5 text-xs font-semibold text-foreground', titleClassName)}>
            {icon}
            <span>{title}</span>
          </h3>
          {badge}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="p-3.5">
        {children}
      </div>
    </div>
  )
}
