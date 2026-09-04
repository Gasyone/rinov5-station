'use client'

import React from 'react'
import { ChevronDown, Check, BookOpen } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { type ClassPackageSummary } from './careModalFilterHelpers'

interface CareModalClassFilterProps {
  classList: ClassPackageSummary[]
  selectedClassId: string // 'all' or packageId
  onChange: (classId: string) => void
  className?: string
}

export function CareModalClassFilter({
  classList,
  selectedClassId,
  onChange,
  className
}: CareModalClassFilterProps) {
  const [open, setOpen] = React.useState(false)

  if (classList.length <= 1) {
    return null
  }

  const selectedClass = classList.find((c) => c.packageId === selectedClassId)
  const displayLabel = selectedClassId === 'all'
    ? `Tất cả các lớp (${classList.length})`
    : selectedClass
      ? `${selectedClass.isCurrentClass ? '[Hiện tại] ' : '[Lớp cũ] '}${selectedClass.classCode || selectedClass.className}`
      : 'Chọn lớp'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-8 px-2.5 py-1 text-xs rounded-lg border bg-background hover:bg-muted/50 text-foreground font-normal transition-all flex items-center justify-between gap-1.5 cursor-pointer shadow-3xs outline-none select-none",
            open && "border-primary/50 ring-1 ring-primary/20",
            className
          )}
        >
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
          <span className="truncate max-w-[170px]">{displayLabel}</span>
          <ChevronDown className={cn("h-3 w-3 text-muted-foreground/80 shrink-0 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-64 p-1 rounded-xl shadow-md border bg-popover text-popover-foreground z-50 text-xs text-left select-none animate-in fade-in-50 zoom-in-95"
      >
        <div className="space-y-0.5">
          {/* All classes option */}
          <button
            type="button"
            onClick={() => {
              onChange('all')
              setOpen(false)
            }}
            className={cn(
              "w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer",
              selectedClassId === 'all'
                ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-medium"
                : "text-foreground hover:bg-muted/60"
            )}
          >
            <div>
              <span className="font-semibold block">Tất cả các lớp</span>
              <span className="text-xs text-muted-foreground font-normal">Toàn bộ lộ trình học tập & chuyển lớp</span>
            </div>
            {selectedClassId === 'all' && <Check className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />}
          </button>

          <div className="h-px bg-border/40 my-1" />

          {/* Individual classes */}
          {classList.map((cls) => {
            const isSelected = selectedClassId === cls.packageId
            return (
              <button
                key={cls.packageId}
                type="button"
                onClick={() => {
                  onChange(cls.packageId)
                  setOpen(false)
                }}
                className={cn(
                  "w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer",
                  isSelected
                    ? "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-medium"
                    : "text-foreground hover:bg-muted/60"
                )}
              >
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={cn(
                      "text-xs px-1 py-0.2 rounded font-semibold",
                      cls.isCurrentClass ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" : "bg-muted text-muted-foreground"
                    )}>
                      {cls.isCurrentClass ? 'Hiện tại' : 'Lớp cũ'}
                    </span>
                    <span className="font-semibold truncate">{cls.className}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    {cls.classCode} • {cls.teacherName || 'GV'}
                  </div>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
