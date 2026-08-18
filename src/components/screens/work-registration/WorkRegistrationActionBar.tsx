'use client'

import { Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { formatMinutes } from './workRegistrationHelpers'

interface WorkRegistrationActionBarProps {
  totalMinutes: number
  priorityMinutes: number
  subjectLabel: string
  canMutate: boolean
  primaryLabel: string
  helperText: string
  onClear?: () => void
  onSubmit: () => void
}

export function WorkRegistrationActionBar({
  totalMinutes,
  priorityMinutes,
  subjectLabel,
  canMutate,
  primaryLabel,
  helperText,
  onClear,
  onSubmit,
}: WorkRegistrationActionBarProps) {
  const warning = getStatusColors('warning')

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatMinutes(totalMinutes)}
        </Badge>
        <Badge variant="outline" className={cn('gap-1', warning.text)}>
          <Star className="h-3.5 w-3.5" />
          {formatMinutes(priorityMinutes)} giờ vàng
        </Badge>
        <span className="text-xs text-muted-foreground">{subjectLabel}</span>
        <span className="text-xs text-muted-foreground">{helperText}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        {onClear ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canMutate || totalMinutes === 0}
            onClick={onClear}
          >
            Xóa tuần
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          disabled={!canMutate || totalMinutes === 0}
          onClick={onSubmit}
        >
          {primaryLabel}
        </Button>
      </div>
    </div>
  )
}
