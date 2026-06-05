'use client'

import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

export function AggregateCell({
  records,
  employeeById,
  priority,
  warningTextClass,
  onOpen,
}: {
  records: WorkRegistrationRecord[]
  employeeById: Map<string, WorkRegistrationEmployee>
  priority: boolean
  warningTextClass: string
  onOpen: () => void
}) {
  const employees = records
    .map((record) => employeeById.get(record.employeeId))
    .filter(Boolean) as WorkRegistrationEmployee[]

  if (employees.length === 0) {
    return (
      <div className="flex h-full min-h-8 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
        {priority ? <Star className={cn('h-3.5 w-3.5', warningTextClass)} /> : null}
      </div>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="flex h-full min-h-8 w-full items-center justify-center gap-1.5 rounded-md border border-border bg-muted/30 px-2 transition-colors hover:bg-accent"
      onClick={onOpen}
    >
      <span className="text-xs font-semibold text-foreground/80">
        {employees.length} NV
      </span>
      {priority ? <Star className={cn('h-3.5 w-3.5', warningTextClass)} /> : null}
    </Button>
  )
}

export function cellClass(
  record: WorkRegistrationRecord | undefined,
  disabled: boolean,
  priority: boolean
) {
  if (record) {
    if (record.assignedClass) {
      return cn(
        getStatusBadgeClass('assigned_class'),
        'font-bold',
        priority && 'ring-1 ring-ring',
        disabled && 'cursor-not-allowed opacity-80'
      )
    }
    return cn(
      getStatusBadgeClass(record.status),
      priority && 'ring-1 ring-ring',
      disabled && 'cursor-not-allowed opacity-80'
    )
  }
  if (disabled) return 'cursor-not-allowed border-border bg-muted/50 text-muted-foreground'
  return cn(
    'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground',
    priority && 'ring-1 ring-ring'
  )
}
