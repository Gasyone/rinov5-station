'use client'

import { useState, type ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, type buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>['variant']>

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  /** Action label — defaults to "Xác nhận" */
  confirmLabel?: string
  cancelLabel?: string
  confirmDisabled?: boolean
  /** "destructive" shows red action button — use for delete/lock/cancel flows */
  variant?: 'default' | 'destructive'
  /** Called when user confirms. Return a promise to show a loading state. */
  onConfirm: () => void | Promise<void>
  children?: ReactNode
}

/**
 * Confirmation wrapper around shadcn `AlertDialog`.
 *
 * Per DS-P4 Safety + §4.4 F4: every destructive action MUST go through this
 * dialog instead of firing on a single click.
 *
 * @see docs/DESIGN_SYSTEM.md §4.4 Form Pattern, §P4 Safety
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  confirmDisabled,
  variant = 'default',
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)
  const actionVariant: ButtonVariant = variant === 'destructive' ? 'destructive' : 'default'

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription asChild>
              <div className="text-sm text-muted-foreground">{description}</div>
            </AlertDialogDescription>
          ) : null}
          {children ? <div className="space-y-3 pt-1">{children}</div> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={actionVariant}
              disabled={loading || confirmDisabled}
              onClick={handleConfirm}
              className={cn(loading && 'opacity-80')}
            >
              {loading ? 'Đang xử lý...' : confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
