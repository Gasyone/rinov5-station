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
  const subjectTitle = isMath ? 'Tiêu chí Danh hiệu Toán học' : 'Tiêu chí Danh hiệu Tiếng Anh'

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
            'inline-flex items-center justify-center h-8 w-8 rounded-full text-amber-900 dark:text-amber-200 hover:bg-amber-400/30 dark:hover:bg-amber-400/20 bg-amber-400/15 border border-amber-400/60 transition-colors cursor-pointer shrink-0 shadow-2xs',
            className
          )}
          title={`Xem hướng dẫn tiêu chí chọn danh hiệu môn ${isMath ? 'Toán' : 'Tiếng Anh'}`}
          aria-label="Hướng dẫn tiêu chí danh hiệu"
        >
          <HelpCircle className="h-4 w-4 text-amber-800 dark:text-amber-300 stroke-[2.2]" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[360px] sm:w-[430px] p-0 z-50 rounded-2xl shadow-xl border-amber-300/70 dark:border-amber-700/70 bg-popover overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="bg-amber-50 dark:bg-amber-950/50 px-4 py-3 border-b border-amber-200/60 dark:border-amber-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-400/25 text-amber-800 dark:text-amber-300">
              <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                {subjectTitle}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Khung hướng dẫn vinh danh & khen thưởng học viên
              </p>
            </div>
          </div>
        </div>

        {/* List of Criteria */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/40 p-2.5 space-y-1.5 custom-scrollbar">
          {criteriaList.map((item: MonthlyAwardCriterion) => {
            const isSelected = selectedBadge === item.title

            return (
              <div
                key={item.title}
                className={cn(
                  'p-3 rounded-xl transition-all space-y-1.5 text-left',
                  isSelected
                    ? 'bg-amber-100/70 dark:bg-amber-950/60 border border-amber-400/60'
                    : 'hover:bg-muted/50 border border-transparent'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black tracking-wide text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                    {item.title}
                  </span>

                  {isEditing && onSelectBadge && (
                    <button
                      type="button"
                      onClick={() => handleSelect(item.title)}
                      className={cn(
                        'text-[11px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer inline-flex items-center gap-1',
                        isSelected
                          ? 'bg-amber-500 text-amber-950 font-black shadow-2xs'
                          : 'bg-muted text-muted-foreground hover:bg-amber-200 hover:text-amber-900'
                      )}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3 w-3 stroke-[3]" />
                          <span>Đang chọn</span>
                        </>
                      ) : (
                        'Chọn'
                      )}
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-foreground/90 leading-relaxed">
                  <strong className="text-muted-foreground font-semibold">Tiêu chí: </strong>
                  {item.criteria}
                </div>

                <div className="text-[10.5px] text-muted-foreground italic leading-relaxed bg-muted/40 p-1.5 rounded-md">
                  <strong className="font-semibold not-italic text-foreground/80">Ý nghĩa: </strong>
                  {item.meaning}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="px-3.5 py-2.5 bg-muted/20 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>Mỗi học viên được trao 01 danh hiệu phù hợp nhất trong kỳ báo cáo tháng.</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
