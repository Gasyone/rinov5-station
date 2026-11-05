'use client'

import React, { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Building2,
  Calendar,
  User,
  ClipboardCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import {
  DAILY_SHIFT_LABELS,
  DAILY_STATUS_LABELS,
  DAILY_CATALOG_ITEMS,
  DAILY_CLOSING_TASKS,
  type DailyCheckSubmission,
  type DailyCheckShift,
  type DailyAreaResult,
  type DailyClosingResult,
} from '@/mocks/dailyCheck'
import {
  getDailyStatusBadgeSemantic,
  getDailyShiftBadgeSemantic,
} from './dailyCheckHelpers'

export interface DailyCheckDetailDialogProps {
  submission: DailyCheckSubmission | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onZoomImage: (url: string) => void
  onSwitchToExecution?: (branch: string, shift: DailyCheckShift) => void
}

export function DailyCheckDetailDialog({
  submission,
  open,
  onOpenChange,
  onZoomImage,
  onSwitchToExecution,
}: DailyCheckDetailDialogProps) {
  // Group daytime items by Category
  const groupedDaytimeItems = useMemo(() => {
    if (!submission || submission.shift !== 'dau_ca') return {}
    const groups: Record<string, DailyAreaResult[]> = {}
    for (const item of submission.daytimeItems) {
      const catalogItem = DAILY_CATALOG_ITEMS.find((c) => c.detail === item.name)
      const grp = catalogItem?.group || 'KHU VỰC CHUNG'
      if (!groups[grp]) groups[grp] = []
      groups[grp].push(item)
    }
    return groups
  }, [submission])

  // Group closing tasks by Category
  const groupedClosingTasks = useMemo(() => {
    if (!submission || submission.shift !== 'cuoi_ca') return {}
    const groups: Record<string, DailyClosingResult[]> = {}
    for (const task of submission.closingItems) {
      const catalogTask = DAILY_CLOSING_TASKS.find((c) => c.name === task.name)
      const grp = catalogTask?.group || 'NHIỆM VỤ CHUNG'
      if (!groups[grp]) groups[grp] = []
      groups[grp].push(task)
    }
    return groups
  }, [submission])

  if (!submission) return null

  const shiftClass = getStatusBadgeClass(getDailyShiftBadgeSemantic(submission.shift))
  const statusClass = getStatusBadgeClass(getDailyStatusBadgeSemantic(submission.status))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-4 flex flex-col max-h-[90vh] overflow-hidden text-foreground gap-3 text-left">
        <DialogHeader className="p-0 pb-1 shrink-0 border-b border-border/50">
          <div className="flex items-center justify-between gap-3 pr-8">
            <div className="flex flex-col gap-0.5 min-w-0">
              <DialogTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>Biên bản Kiểm tra: {submission.id}</span>
                <Badge
                  variant="outline"
                  className={cn('text-[10px] px-1.5 py-0 h-4.5 font-normal', shiftClass)}
                >
                  {DAILY_SHIFT_LABELS[submission.shift]}
                </Badge>
              </DialogTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-0.5">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {submission.branch}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {submission.staffName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {submission.timestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Badge
                variant="outline"
                className={cn('text-xs px-2 py-0.5 font-semibold', statusClass)}
              >
                {DAILY_STATUS_LABELS[submission.status]}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body - Items list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-0 text-xs">
          {/* Summary Box */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/60 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {submission.failedItemsCount === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" />
              )}
              <div>
                <p className="font-semibold text-foreground text-xs">
                  {submission.failedItemsCount === 0
                    ? 'Tất cả các hạng mục đạt tiêu chuẩn'
                    : `Phát hiện ${submission.failedItemsCount} hạng mục chưa đạt yêu cầu`}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Tỷ lệ hoàn thành: {submission.passRate}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onSwitchToExecution && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onSwitchToExecution(submission.branch, submission.shift)
                    onOpenChange(false)
                  }}
                  className="h-7 text-xs gap-1.5 cursor-pointer font-medium hover:bg-primary/10 hover:text-primary"
                >
                  <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
                  <span>Xem bảng Tự đánh giá</span>
                </Button>
              )}

            </div>
          </div>

          {/* Daytime check items */}
          {submission.shift === 'dau_ca' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider text-muted-foreground">
                  Chi tiết {submission.daytimeItems.length} hạng mục kiểm tra đầu ca
                </h4>
                <span className="text-[11px] text-muted-foreground">
                  Đạt: {submission.daytimeItems.filter((i) => i.status === 'pass').length} / {submission.daytimeItems.length}
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(groupedDaytimeItems).map(([groupName, items]) => (
                  <div key={groupName} className="rounded-lg border border-border/70 overflow-hidden bg-card shadow-2xs">
                    <div className="bg-muted/50 px-3 py-1.5 border-b border-border/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">
                        {groupName}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {items.filter((i) => i.status === 'pass').length}/{items.length} đạt
                      </span>
                    </div>

                    <div className="divide-y divide-border/40">
                      {items.map((item, idx) => {
                        const isPass = item.status === 'pass'
                        return (
                          <div
                            key={idx}
                            className={cn(
                              'p-2.5 text-xs flex flex-col gap-1.5 transition-colors',
                              isPass ? 'bg-card' : 'bg-rose-50/50 dark:bg-rose-950/20'
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-foreground">
                                {item.name}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[10px] px-1.5 py-0 h-4.5 font-medium',
                                  isPass
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                                )}
                              >
                                {isPass ? 'Đạt' : 'Không đạt'}
                              </Badge>
                            </div>

                            {item.note && (
                              <div className="text-[11px] text-rose-700 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/50 p-1.5 rounded border border-rose-200 dark:border-rose-900/50">
                                <strong>Ghi chú:</strong> {item.note}
                              </div>
                            )}

                            {item.photos && item.photos.length > 0 && (
                              <div className="flex items-center gap-2 pt-1 border-t border-border/30">
                                <span className="text-[11px] text-muted-foreground">Minh chứng ({item.photos.length}):</span>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {item.photos.map((ph, pIdx) => (
                                    <button
                                      key={pIdx}
                                      type="button"
                                      onClick={() => onZoomImage(ph)}
                                      className="h-5 px-1.5 rounded bg-muted hover:bg-muted/80 text-foreground text-[10px] inline-flex items-center gap-1 cursor-pointer transition-colors border border-border/60"
                                    >
                                      <ImageIcon className="h-3 w-3 text-muted-foreground" />
                                      <span>Ảnh {pIdx + 1}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Closing check items */}
          {submission.shift === 'cuoi_ca' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider text-muted-foreground">
                  Chi tiết {submission.closingItems.length} nhiệm vụ chốt ca cuối ngày
                </h4>
                <span className="text-[11px] text-muted-foreground">
                  Đã xong: {submission.closingItems.filter((i) => i.status === 'done').length} / {submission.closingItems.length}
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(groupedClosingTasks).map(([groupName, tasks]) => (
                  <div key={groupName} className="rounded-lg border border-border/70 overflow-hidden bg-card shadow-2xs">
                    <div className="bg-muted/50 px-3 py-1.5 border-b border-border/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">
                        {groupName}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {tasks.filter((t) => t.status === 'done').length}/{tasks.length} xong
                      </span>
                    </div>

                    <div className="divide-y divide-border/40">
                      {tasks.map((task, idx) => {
                        const isDone = task.status === 'done'
                        return (
                          <div
                            key={idx}
                            className={cn(
                              'p-2.5 text-xs flex items-center justify-between gap-2 transition-colors',
                              isDone ? 'bg-card' : 'bg-amber-50/50 dark:bg-amber-950/20'
                            )}
                          >
                            <span className="font-medium text-foreground">
                              {task.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] px-1.5 py-0 h-4.5 font-medium',
                                isDone
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                              )}
                            >
                              {isDone ? 'Đã xong' : 'Chưa xong'}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
