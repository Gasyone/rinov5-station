'use client'

import { Star } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type {
  WorkRegistrationEmployee,
  WorkRegistrationRecord,
} from '@/mocks/workRegistrations'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { getInitials } from './workRegistrationHelpers'

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
  const visible = employees.slice(0, 4)
  const overflow = Math.max(0, employees.length - visible.length)

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
      className="flex h-full min-h-8 w-full items-center justify-center rounded-md border border-border bg-muted/30 px-2 transition-colors hover:bg-accent"
      onClick={onOpen}
    >
      <AvatarGroup>
        {visible.map((employee) => (
          <Avatar key={employee.id} size="sm">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
          </Avatar>
        ))}
        {overflow > 0 ? <AvatarGroupCount>+{overflow}</AvatarGroupCount> : null}
      </AvatarGroup>
      {priority ? <Star className={cn('ml-2 h-3.5 w-3.5', warningTextClass)} /> : null}
    </Button>
  )
}

export function cellClass(
  record: WorkRegistrationRecord | undefined,
  disabled: boolean,
  priority: boolean
) {
  if (record) {
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
