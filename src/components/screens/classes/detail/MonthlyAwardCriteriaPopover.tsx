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
        className="w-[320px] sm:w-[350px] p-0 z-50 rounded-xl shadow-lg border border-border/80 bg-popover overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header: Không nền icon, không subtitle, title chữ thường không in đậm, màu nhạt */}
        <div className="px-3 py-2 border-b border-border/50 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <h4 className="text-xs font-normal text-muted-foreground">
              {subjectTitle}
            </h4>
          </div>
        </div>

        {/* List of Criteria: Gọn gàng, giảm padding & khoảng cách */}
        <div className="max-h-[350px] overflow-y-auto divide-y divide-border/40 p-2 space-y-1 custom-scrollbar">
          {criteriaList.map((item: MonthlyAwardCriterion) => {
            const isSelected = selectedBadge === item.title

            return (
              <div
                key={item.title}
                className={cn(
                  'p-2 rounded-lg transition-all space-y-1 text-left',
                  isSelected
                    ? 'bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/60'
                    : 'hover:bg-muted/40 border border-transparent'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    {item.title}
                  </span>

                  {isEditing && onSelectBadge && (
                    <button
                      type="button"
                      onClick={() => handleSelect(item.title)}
                      className={cn(
                        'text-xs font-normal px-2 py-0.5 rounded-md transition-all cursor-pointer inline-flex items-center gap-1',
                        isSelected
                          ? 'bg-primary text-primary-foreground font-medium shadow-2xs'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      )}
                    >
                      {isSelected ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Đang chọn</span>
                        </>
                      ) : (
                        'Chọn'
                      )}
                    </button>
                  )}
                </div>

                <div className="text-xs text-foreground/80 leading-relaxed font-normal">
                  <span className="text-muted-foreground font-medium">Tiêu chí: </span>
                  {item.criteria}
                </div>

                <div className="text-xs text-muted-foreground leading-relaxed font-normal">
                  <span className="text-muted-foreground font-medium">Ý nghĩa: </span>
                  <span className="italic">{item.meaning}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Note */}
        <div className="px-3 py-1.5 bg-muted/20 border-t border-border/40 text-[11.5px] text-muted-foreground flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>Mỗi học viên được trao 01 danh hiệu trong kỳ báo cáo.</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
