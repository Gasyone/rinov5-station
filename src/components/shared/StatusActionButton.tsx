'use client'

import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

type StatusActionTone = 'neutral' | 'primary' | 'warning' | 'destructive'

interface StatusActionButtonProps {
  icon: LucideIcon
  label: string
  tone?: StatusActionTone
  disabled?: boolean
  title?: string
  className?: string
  onClick?: () => void
}

const toneClassName: Record<StatusActionTone, string> = {
  neutral: 'border-border bg-background text-foreground hover:bg-muted',
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  warning: cn(getStatusBadgeClass('tam_dung'), 'hover:bg-muted'),
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

export function StatusActionButton({
  icon: Icon,
  label,
  tone = 'neutral',
  disabled,
  title,
  className,
  onClick,
}: StatusActionButtonProps) {
  return (
    <Button
      type="button"
      variant={tone === 'primary' || tone === 'destructive' ? 'default' : 'outline'}
      size="sm"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={cn(
        'h-7 min-w-0 rounded-lg px-2.5 text-[11px] font-semibold whitespace-nowrap',
        toneClassName[tone],
        className
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </Button>
  )
}
