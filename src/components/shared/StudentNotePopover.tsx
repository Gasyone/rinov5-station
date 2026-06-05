'use client'

import { StickyNote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface StudentNotePopoverProps {
  note?: string
  label?: string
  className?: string
  triggerTextPrefix?: string
}

export function StudentNotePopover({
  note,
  label = 'Ghi chú học viên',
  className,
  triggerTextPrefix = 'Ghi chú: ',
}: StudentNotePopoverProps) {
  if (!note) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="xs"
          className={cn(
            'text-muted-foreground hover:text-foreground rounded-lg text-[10px] h-7 px-2 font-medium flex items-center gap-1.5 max-w-full min-w-0 bg-transparent hover:bg-transparent shadow-none',
            className
          )}
        >
          <StickyNote className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="truncate italic font-normal text-left">
            {triggerTextPrefix}{note}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{label}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-normal whitespace-pre-wrap px-0.5">
            {note}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
