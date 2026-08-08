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
  if (tag.label === 'CSCĐ') return 'CSCĐ: Cảnh báo học thuật'
  if (tag.label === 'ĐB1' || tag.label.startsWith('ĐB')) return `${tag.label}: CS Đặc biệt`
  if (tag.label === 'ĐK1') return 'ĐK1: CS học tập Định kỳ'
  if (tag.label === 'ĐK2') return 'ĐK2: CS học phí Định kỳ'
  if (tag.label === 'TB1') return 'TB1: CS chuyên cần & gói phí'
  if (tag.label === 'TB2') return 'TB2: CS bài tập về nhà'
  if (tag.label === 'CSTP') return 'CSTP: Chăm sóc Tái phí'
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
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>Hạng mục chăm sóc</span>
            <span className="text-xs text-muted-foreground font-mono font-normal">
              ({studentName} - {studentId})
            </span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Danh sách tất cả {tags.length} hạng mục chăm sóc cần xử lý
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2 max-h-[60vh] overflow-y-auto pr-1">
          {tags.map((tag, idx) => {
            const isSpecialCare = tag.label.startsWith('ĐB')
            const isOverdue = !tag.isCompleted && tag.isOverdue
            const isDueToday = !tag.isCompleted && tag.isDueToday

            let colorClass =
              'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400'
            if (tag.isCompleted) {
              colorClass =
                'border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-600 line-through'
            } else if (isSpecialCare || tag.semantic === 'error') {
              colorClass = getStatusColors('error').badge
            } else if (tag.semantic === 'purple' || tag.label.startsWith('ĐK')) {
              colorClass = getStatusColors('purple').badge
            } else if (tag.semantic === 'warning' || tag.label.startsWith('TB')) {
              colorClass = getStatusColors('warning').badge
            } else if (tag.semantic === 'success' || tag.label === 'CSTP') {
              colorClass = getStatusColors('success').badge
            } else if (tag.semantic === 'info' || tag.label === 'CSCĐ') {
              colorClass = getStatusColors('info').badge
            }

            const fullText = getCareTagFullLabel(tag)
            const assignees = getCareTagAssignees(tag)

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
                        'text-xs px-2.5 py-1 min-h-[28px] font-bold flex items-center gap-2 shrink-0 shadow-2xs border w-fit cursor-help rounded-md',
                        colorClass
                      )}
                    >
                      {!tag.isCompleted && (
                        <>
                          {isOverdue && (
                            <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-red-600 shadow-3xs animate-pulse" title="Quá hạn" />
                          )}
                          {isDueToday && (
                            <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500 shadow-3xs" title="Đến hạn hôm nay" />
                          )}
                        </>
                      )}
                      <span className="font-extrabold tracking-wide text-[11.5px]">{tag.label}</span>
                      <span className="text-[10.5px] font-bold text-muted-foreground shrink-0 ml-1" title={`Phụ trách: ${assignees.join(' · ')}`}>
                        {assignees.length > 1 ? 'CS · GV' : assignees[0] || 'CS'}
                      </span>
                    </Badge>
                  </CareTagHoverCard>

                  {isOverdue && (
                    <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                      Quá hạn
                    </span>
                  )}
                  {isDueToday && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                      Đến hạn hôm nay
                    </span>
                  )}
                </div>

                {tag.description && (
                  <p className="text-[11px] text-muted-foreground leading-snug font-medium pl-0.5 mt-0.5">
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
