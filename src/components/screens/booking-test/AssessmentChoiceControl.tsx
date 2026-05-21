'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AssessmentChoiceControlProps {
  checked: boolean
  disabled?: boolean
  label: string
  scoreValue?: number | string
  onToggle: () => void
}

export function AssessmentChoiceControl({
  checked,
  disabled,
  label,
  scoreValue,
  onToggle,
}: AssessmentChoiceControlProps) {
  let checkedColorClass = 'border-primary bg-primary'
  let hoverColorClass = 'hover:border-primary'

  if (scoreValue === 0 || scoreValue === '0') {
    checkedColorClass = 'border-destructive bg-destructive'
    hoverColorClass = 'hover:border-destructive'
  } else if (scoreValue === 0.5 || scoreValue === '0.5') {
    checkedColorClass = 'border-amber-500 bg-amber-500'
    hoverColorClass = 'hover:border-amber-500'
  } else if (scoreValue === 1 || scoreValue === '1') {
    checkedColorClass = 'border-emerald-600 bg-emerald-600'
    hoverColorClass = 'hover:border-emerald-600'
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      role="radio"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition',
        checked ? checkedColorClass : 'border-input bg-background',
        disabled ? 'cursor-not-allowed opacity-50' : cn('cursor-pointer', hoverColorClass)
      )}
    >
      {checked ? <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" /> : null}
    </Button>
  )
}
