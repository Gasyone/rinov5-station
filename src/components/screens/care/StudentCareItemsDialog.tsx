'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { getStatusColors } from '@/lib/statusColors'
import { CareTagHoverCard } from '@/components/shared'
import { getCareTagAssignees, type CareTag } from './operationsAlertHelpers'

interface StudentCareItemsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentName: string
  studentId: string
  tags: CareTag[]
}

function getCareTagFullLabel(tag: CareTag): string {
  if (tag.label === 'CĐB' || tag.label === 'CSCĐ' || tag.label.startsWith('ĐB')) return 'CĐB - Chăm sóc đặc biệt'
  if (tag.label === 'CGH' || tag.label === 'CSTP') return 'CGH - Chăm sóc gia hạn'
  if (tag.label === 'CĐK' || tag.label.startsWith('ĐK')) return 'CĐK - Chăm sóc định kỳ'
  if (tag.label === 'CBH' || tag.label.startsWith('TB') || tag.label.startsWith('TH')) return 'CBH - Chăm sóc theo buổi học'
  if (tag.label === 'CYC' || tag.label === 'T1') return 'CYC - Chăm sóc theo yêu cầu'
  return `${tag.label}: ${tag.displayLabel || tag.description}`
}

export function StudentCareItemsDialog({
  open,
  onOpenChange,
  studentName,
  studentId,
  tags,
}: StudentCareItemsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md w-full rounded-2xl p-5 border border-border shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="space-y-1.5 text-left border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 text-xs border border-primary/20 bg-primary/10 text-primary font-bold">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {studentName ? studentName.slice(0, 2).toUpperCase() : 'HV'}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                Danh sách thẻ chăm sóc
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Học viên: <span className="font-semibold text-foreground">{studentName}</span> ({studentId})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* List of tags */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {tags.map((tag, idx) => {
            const isSpecialCare = tag.label === 'CĐB' || tag.label.startsWith('ĐB')
            const isOverdue = !tag.isCompleted && tag.isOverdue
            const isDueToday = !tag.isCompleted && tag.isDueToday

            let colorClass =
              'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400'
            if (tag.isCompleted) {
              colorClass =
                'border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-600 line-through'
            } else if (isSpecialCare || tag.semantic === 'error') {
              colorClass = getStatusColors('error').badge
            } else if (tag.semantic === 'purple' || tag.label === 'CĐK' || tag.label.startsWith('ĐK')) {
              colorClass = getStatusColors('purple').badge
            } else if (tag.semantic === 'warning' || tag.label === 'CBH' || tag.label.startsWith('TB')) {
              colorClass = getStatusColors('warning').badge
            } else if (tag.semantic === 'success' || tag.label === 'CGH' || tag.label === 'CSTP') {
              colorClass = getStatusColors('success').badge
            } else if (tag.semantic === 'info' || tag.label === 'CSCĐ') {
              colorClass = getStatusColors('info').badge
            }

            const fullText = getCareTagFullLabel(tag)
            const assignees = getCareTagAssignees(tag)
            const assigneeText = assignees.length > 1 ? 'CS/GV' : assignees[0] || 'CS'

            return (
              <div
                key={idx}
                className="p-2.5 rounded-lg border border-border bg-card/60 flex flex-col gap-1 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <CareTagHoverCard
                    code={tag.label}
                    fullLabel={fullText}
                    colorClass={colorClass}
                    description={tag.description}
                    configRule={tag.configRule}
                    realDataIssue={tag.realDataIssue || tag.description}
                    occurredDate={tag.occurredDate || '20/07/2026'}
                    slaText={tag.slaText}
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs px-2 py-0.5 min-h-[26px] font-normal flex items-center gap-1 shrink-0 shadow-none border w-fit cursor-help rounded-md',
                        colorClass
                      )}
                    >
                      <span className="font-normal text-xs">{tag.label}</span>
                      <span className="text-xs font-normal text-muted-foreground shrink-0 ml-0.5" title={`Người chăm sóc: ${assigneeText}`}>
                        {assigneeText}
                      </span>
                    </Badge>
                  </CareTagHoverCard>

                  {isOverdue && (
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                      Quá hạn
                    </span>
                  )}
                  {isDueToday && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                      Đến hạn hôm nay
                    </span>
                  )}
                </div>

                {tag.description && (
                  <p className="text-xs text-muted-foreground leading-snug font-medium pl-0.5 mt-0.5">
                    {tag.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm" type="button" className="text-xs font-semibold">
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
