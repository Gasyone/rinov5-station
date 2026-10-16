'use client'

import React from 'react'
import { HelpCircle, Award, Check } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  MONTHLY_AWARDS_CRITERIA,
  ENGLISH_MONTHLY_AWARDS_CRITERIA,
  MonthlyAwardCriterion,
} from './monthlyReportHelpers'

interface MonthlyAwardCriteriaPopoverProps {
  selectedBadge?: string
  onSelectBadge?: (badgeTitle: string) => void
  isEditing?: boolean
  isMath?: boolean
  className?: string
}

export function MonthlyAwardCriteriaPopover({
  selectedBadge,
  onSelectBadge,
  isEditing = false,
  isMath = true,
  className,
}: MonthlyAwardCriteriaPopoverProps) {
  const [open, setOpen] = React.useState(false)

  const criteriaList = isMath ? MONTHLY_AWARDS_CRITERIA : ENGLISH_MONTHLY_AWARDS_CRITERIA
  const subjectTitle = isMath ? 'Tiêu chí danh hiệu toán học' : 'Tiêu chí danh hiệu tiếng Anh'

  const handleSelect = (title: string) => {
    if (onSelectBadge) {
      onSelectBadge(title)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'inline-flex items-center justify-center h-6 w-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer shrink-0',
            className
          )}
          title={`Xem hướng dẫn tiêu chí chọn danh hiệu môn ${isMath ? 'Toán' : 'Tiếng Anh'}`}
          aria-label="Hướng dẫn tiêu chí danh hiệu"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[310px] sm:w-[330px] p-0 z-50 rounded-xl shadow-xl border border-border/80 bg-popover overflow-hidden flex flex-col max-h-[min(300px,var(--radix-popover-content-available-height,300px))]"
        align="end"
        side="bottom"
        sideOffset={6}
        collisionPadding={16}
        avoidCollisions
      >
        {/* Header: Không chiếm chiều cao */}
        <div className="px-3 py-1.5 border-b border-border/50 flex items-center justify-between bg-muted/30 shrink-0">
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <h4 className="text-xs font-normal text-muted-foreground">
              {subjectTitle}
            </h4>
          </div>
        </div>

        {/* List of Criteria: Gọn gàng, giảm padding & khoảng cách dòng, cuộn mượt nội bộ */}
        <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border/30 p-1.5 space-y-0.5 custom-scrollbar">
          {criteriaList.map((item: MonthlyAwardCriterion) => {
            const isSelected = selectedBadge === item.title

            return (
              <div
                key={item.title}
                className={cn(
                  'p-1.5 px-2 rounded-md transition-all text-left',
                  isSelected
                    ? 'bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/60'
                    : 'hover:bg-muted/50 border border-transparent'
                )}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    {item.title}
                  </span>

                  {isEditing && onSelectBadge && (
                    <button
                      type="button"
                      onClick={() => handleSelect(item.title)}
                      className={cn(
                        'text-[11px] font-normal px-2 py-0.5 rounded-md transition-all cursor-pointer inline-flex items-center gap-1 shrink-0',
                        isSelected
                          ? 'bg-primary text-primary-foreground font-medium shadow-2xs'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      )}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-2.5 w-2.5" />
                          <span>Đang chọn</span>
                        </>
                      ) : (
                        'Chọn'
                      )}
                    </button>
                  )}
                </div>

                <div className="space-y-0.5 mt-0.5">
                  <p className="text-[11.5px] leading-snug text-foreground/85 font-normal">
                    <span className="text-muted-foreground font-medium">Tiêu chí: </span>
                    {item.criteria}
                  </p>

                  <p className="text-[11px] leading-snug text-muted-foreground font-normal">
                    <span className="text-muted-foreground/90 font-medium">Ý nghĩa: </span>
                    <span className="italic">{item.meaning}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="px-2.5 py-1 bg-muted/20 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>Mỗi học viên được trao 01 danh hiệu trong kỳ báo cáo.</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
