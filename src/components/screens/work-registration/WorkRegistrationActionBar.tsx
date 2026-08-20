'use client'

import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatMinutes } from './workRegistrationHelpers'

interface WorkRegistrationActionBarProps {
  totalMinutes: number
  priorityMinutes?: number
  subjectLabel?: string
  canMutate: boolean
  primaryLabel: string
  helperText?: string
  onClear?: () => void
  onSubmit: () => void
}

export function WorkRegistrationActionBar({
  totalMinutes,
  subjectLabel,
  canMutate,
  primaryLabel,
  helperText,
  onClear,
  onSubmit,
}: WorkRegistrationActionBarProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatMinutes(totalMinutes)}
        </Badge>
        {subjectLabel ? <span className="text-xs text-muted-foreground">{subjectLabel}</span> : null}
        {helperText ? <span className="text-xs text-muted-foreground">{helperText}</span> : null}
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
