'use client'

import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FilterClearAllButtonProps {
  disabled?: boolean
  label?: string
  onClick: () => void
}

export function FilterClearAllButton({
  disabled,
  label = 'Xóa tất cả',
  onClick,
}: FilterClearAllButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="flex-1"
      disabled={disabled}
      onClick={onClick}
    >
      <X className="h-4 w-4" />
      {label}
    </Button>
  )
}
