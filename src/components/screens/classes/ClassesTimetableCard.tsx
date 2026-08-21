'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import { CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import type { TimetableSlot } from './classesTimetableHelpers'

interface ClassesTimetableCardProps {
  slot: TimetableSlot
  isHighlighted: boolean
  isDimmed: boolean
  isPinned: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
  onView: (classId: string) => void
  onAddStudent?: (classId: string) => void
}

export function ClassesTimetableCard({
  slot,
  isHighlighted,
  isDimmed,
  isPinned,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onView,
}: ClassesTimetableCardProps) {
  const { cls, availableSlots } = slot

  return (
    <TooltipProvider delayDuration={250}>
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={() => {
          onClick()
          onView(cls.id)
        }}
        className={cn(
          'group relative flex flex-col rounded-md border p-2 transition-all duration-150 cursor-pointer select-none text-left bg-card',
          isHighlighted
            ? 'ring-2 ring-primary border-primary bg-primary/5 dark:bg-primary/15 shadow-sm scale-[1.01] z-20'
            : isDimmed
            ? 'opacity-35 grayscale-[25%] border-border/40 hover:opacity-100 hover:grayscale-0'
            : 'border-border/60 hover:border-primary/60 hover:bg-muted/10 hover:shadow-2xs',
          isPinned && isHighlighted && 'ring-2 ring-primary border-primary'
        )}
      >
        {/* Dòng 1: Thời gian • Phòng • Trạng thái */}
        <div className="flex items-center justify-between gap-1 text-[11px] min-w-0">
          <div className="flex items-center gap-1.5 shrink-0 text-foreground font-semibold">
            <span>{slot.timeLabel}</span>
            <span className="text-muted-foreground font-mono text-[10px]">@{slot.room}</span>
          </div>

          <StatusBadge
            status={cls.status}
            label={CLASS_STATUS_LABELS[cls.status]}
            className="text-[9px] px-1 py-0 h-4 shadow-none shrink-0"
          />
        </div>

        {/* Dòng 2: Tên lớp • Mã lớp */}
        <div className="mt-1 flex items-baseline justify-between gap-1.5 min-w-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <h4 className="font-bold text-xs leading-tight text-foreground group-hover:text-primary transition-colors truncate">
                {cls.name}
              </h4>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              <p className="font-bold">{cls.name}</p>
              <p className="text-muted-foreground">{cls.code} • {cls.level} • {cls.branch}</p>
              <p className="text-muted-foreground">GV: {slot.teacher} • Phòng: {slot.room}</p>
              <p className="text-muted-foreground">Sĩ số: {cls.enrolledStudents}/{cls.maxStudents} (Còn {availableSlots} chỗ)</p>
            </TooltipContent>
          </Tooltip>

          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
            {cls.code}
          </span>
        </div>

        {/* Dòng 3: Giáo viên • Sĩ số / Chỗ trống */}
        <div className="mt-1 flex items-center justify-between gap-1 text-[10.5px] text-muted-foreground border-t border-border/40 pt-1">
          <span className="truncate" title={slot.teacher}>
            {slot.teacher}
          </span>

          <span
            className={cn(
              'shrink-0 text-[10px] font-medium font-mono',
              availableSlots > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            )}
            title={`Sĩ số: ${cls.enrolledStudents}/${cls.maxStudents} (Còn ${availableSlots} chỗ)`}
          >
            {cls.enrolledStudents}/{cls.maxStudents}
            <span className="text-[9.5px] ml-0.5 font-sans">
              ({availableSlots > 0 ? `còn ${availableSlots}` : 'hết'})
            </span>
          </span>
        </div>
      </div>
    </TooltipProvider>
  )
}
