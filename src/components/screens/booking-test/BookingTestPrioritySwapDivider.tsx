'use client'

import { ArrowUpDown, Clock, UserCheck } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface BookingTestPrioritySwapDividerProps {
  priorityMode: 'slot_first' | 'teacher_first'
  onToggle: () => void
  className?: string
}

export function BookingTestPrioritySwapDivider({
  priorityMode,
  onToggle,
  className,
}: BookingTestPrioritySwapDividerProps) {
  const isSlotFirst = priorityMode === 'slot_first'

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn('relative flex items-center justify-center my-0.5 py-1 select-none', className)}>
        {/* Đường viền phân cách nằm ngang */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-dashed border-border/80" />
        </div>

        {/* Nút tròn nổi ở giữa (Floating Swap Button) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onToggle}
              className={cn(
                'relative z-10 flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold shadow-xs transition-all duration-200 cursor-pointer',
                'bg-card hover:bg-muted text-foreground border-border hover:border-primary/50',
                'active:scale-95 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
            >
              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary shrink-0">
                <ArrowUpDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
              </div>

              <div className="flex items-center gap-1 text-xs min-w-0">
                <span className="text-muted-foreground font-normal">Đổi thứ tự:</span>
                <span className="font-semibold text-primary flex items-center gap-1 truncate">
                  {isSlotFirst ? (
                    <>
                      <UserCheck className="h-3 w-3 inline shrink-0" />
                      <span>Chọn Giáo viên trước</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 inline shrink-0" />
                      <span>Chọn Khung giờ trước</span>
                    </>
                  )}
                </span>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs p-2.5 z-50">
            <p className="font-semibold text-foreground">
              {isSlotFirst
                ? 'Đổi sang: Ưu tiên chọn Giáo viên trước ➔ Xem giờ rảnh'
                : 'Đổi sang: Ưu tiên chọn Khung giờ trước ➔ Xem giáo viên trực ca'}
            </p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {isSlotFirst
                ? 'Phù hợp khi phụ huynh yêu cầu đích danh giáo viên phụ trách'
                : 'Phù hợp khi phụ huynh muốn chốt giờ test trước theo khung giờ rảnh của gia đình'}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
