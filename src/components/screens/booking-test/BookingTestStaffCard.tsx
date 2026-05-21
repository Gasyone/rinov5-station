'use client'

import { RefreshCw, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/format'
import type { Employee } from '@/mocks/employees'
import { getPersonTitle } from './bookingTestStaffHelpers'

interface BookingTestStaffCardProps {
  label: string
  name?: string
  employee?: Employee | null
  placeholder?: string
  clickable?: boolean
  supporting?: string
  onClick?: () => void
}

export function BookingTestStaffCard({
  label,
  name,
  employee,
  placeholder = 'Chưa phân công',
  clickable,
  supporting,
  onClick,
}: BookingTestStaffCardProps) {
  const displayName = name || employee?.name || placeholder
  const title = supporting ?? getPersonTitle(employee ?? null)
  const initials = displayName ? getInitials(displayName) : '?'
  const canShowChangeIcon = Boolean(clickable && displayName !== placeholder)
  const content = (
    <>
      <Avatar className="h-10 w-10 rounded-lg">
        <AvatarImage src={employee?.avatar} alt={employee?.name ?? displayName} />
        <AvatarFallback className="rounded-lg">
          {displayName === placeholder ? <UserRound className="h-4 w-4" /> : initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-semibold">{displayName}</p>
        {title ? <p className="truncate text-xs text-muted-foreground">{title}</p> : null}
      </div>
      {canShowChangeIcon ? (
        <RefreshCw className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
      ) : null}
    </>
  )

  if (!clickable) {
    return <div className="flex min-w-0 items-center gap-3">{content}</div>
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={cn(
        'flex h-auto min-w-0 items-center justify-start gap-3 whitespace-normal rounded-lg bg-muted/20 p-2 text-left transition',
        'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      {content}
    </Button>
  )
}
