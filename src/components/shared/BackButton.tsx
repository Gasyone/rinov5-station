'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  /** Custom handler — defaults to `router.back()` */
  onClick?: () => void
  /** Override button label (defaults to "Back") */
  label?: string
  className?: string
}

/**
 * Standard back button for Detail Page Pattern.
 * Per DS §4.3 D1: `variant="ghost"` + `<ChevronLeft />`.
 *
 * @see docs/DESIGN_SYSTEM.md §4.3 Detail Page Pattern
 */
export function BackButton({
  onClick,
  label = 'Back',
  className,
}: BackButtonProps) {
  const router = useRouter()
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick ?? (() => router.back())}
      className={cn('gap-1.5 -ml-2', className)}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}
