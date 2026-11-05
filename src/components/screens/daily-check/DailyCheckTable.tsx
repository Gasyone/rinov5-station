'use client'

import React from 'react'
import {
  Eye,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { DailyCheckSubmission } from '@/mocks/dailyCheck'
import {
  DAILY_SHIFT_LABELS,
  DAILY_STATUS_LABELS,
} from '@/mocks/dailyCheck'
import {
  getDailyStatusBadgeSemantic,
  getDailyShiftBadgeSemantic,
  extractFailedSummary,
} from './dailyCheckHelpers'

export interface DailyCheckTableProps {
  submissions: DailyCheckSubmission[]
  onViewDetail: (sub: DailyCheckSubmission) => void
  onEscalateToQc?: (sub: DailyCheckSubmission) => void
  onZoomImage: (url: string) => void
  page: number
  pageSize: number
  total: number
  onPageChange: (p: number) => void
  onPageSizeChange: (size: number) => void
}

export function DailyCheckTable({
  submissions,
  onViewDetail,
  onEscalateToQc,
  onZoomImage,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: DailyCheckTableProps) {
  if (submissions.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy nhật ký kiểm tra"
        description="Không có bản ghi nào phù hợp với bộ lọc đã chọn."
        className="py-12 border border-border rounded-lg bg-card"
      />
    )
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <DataTableFrame className="flex-1 min-h-0">
        <table className="w-full min-w-[960px] table-fixed text-left border-separate border-spacing-0">
          <colgroup>
            <col className="w-[170px]" />
            <col className="w-[200px]" />
            <col className="w-[140px]" />
            <col className="w-[200px]" />
            <col className="w-[120px]" />
            <col className="w-[110px]" />
            <col className="w-[130px]" />
          </colgroup>
          <thead className="sticky top-0 z-20 bg-muted">
            <tr className="bg-muted hover:bg-muted [&>th]:h-9 [&>th]:py-1.5 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80 [&>th]:whitespace-nowrap">
              <th className="px-3">Thời gian & Ca</th>
              <th className="px-3">Cơ sở & Người nộp</th>
              <th className="px-3">Kết quả</th>
              <th className="px-3">Vấn đề phát hiện</th>
              <th className="px-3">Minh chứng ảnh</th>
              <th className="px-3">Tiến độ nộp</th>
              <th className="px-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs">
            {submissions.map((sub, idx) => {
              const isEven = idx % 2 === 1
              const shiftClass = getStatusBadgeClass(getDailyShiftBadgeSemantic(sub.shift))
              const statusClass = getStatusBadgeClass(getDailyStatusBadgeSemantic(sub.status))
              const failedNames = extractFailedSummary(sub)

              // Collect photos for preview
              const photos: string[] = []
              sub.daytimeItems.forEach((i) => {
                if (i.photos && i.photos.length > 0) {
                  photos.push(...i.photos)
                }
              })

              return (
                <tr
                  key={sub.id}
                  onClick={() => onViewDetail(sub)}
                  className={cn(
                    'group cursor-pointer transition-colors align-middle [&>td]:py-2.5',
                    isEven ? 'bg-slate-50/60 dark:bg-zinc-900/40' : 'bg-background',
                    'hover:bg-slate-100 dark:hover:bg-zinc-800/60'
                  )}
                >
                  {/* Cột 1: Thời gian & Ca */}
                  <td className="px-3 border-b border-border/40">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground text-xs leading-none">
                        {sub.timestamp}
                      </span>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] px-1.5 py-0 h-4.5 font-normal', shiftClass)}
                        >
                          {DAILY_SHIFT_LABELS[sub.shift]}
                        </Badge>
                      </div>
                    </div>
                  </td>

                  {/* Cột 2: Cơ sở & Nhân sự */}
                  <td className="px-3 border-b border-border/40">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-medium text-foreground text-xs truncate" title={sub.branch}>
                        {sub.branch}
                      </span>
                      <span className="text-muted-foreground text-[11px] truncate" title={sub.staffName}>
                        {sub.staffName}
                      </span>
                    </div>
                  </td>

                  {/* Cột 3: Kết quả */}
                  <td className="px-3 border-b border-border/40">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        {sub.failedItemsCount === 0 ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                        )}
                        <span
                          className={cn(
                            'font-semibold text-xs',
                            sub.failedItemsCount === 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          )}
                        >
                          {sub.shift === 'dau_ca'
                            ? `${9 - sub.failedItemsCount}/9 Đạt`
                            : `${9 - sub.failedItemsCount}/9 Xong`}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            sub.passRate === 100
                              ? 'bg-emerald-500'
                              : sub.passRate >= 75
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                          )}
                          style={{ width: `${sub.passRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Cột 4: Vấn đề phát hiện */}
                  <td className="px-3 border-b border-border/40">
                    {failedNames.length === 0 ? (
                      <span className="text-muted-foreground text-[11px] italic">
                        Không phát hiện lỗi
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {failedNames.map((name, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Cột 5: Minh chứng ảnh */}
                  <td
                    className="px-3 border-b border-border/40"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {photos.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onZoomImage(photos[0])}
                          className="h-6 px-1.5 rounded bg-muted hover:bg-muted/80 text-foreground text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors border border-border/60"
                          title="Bấm để xem ảnh minh chứng"
                        >
                          <ImageIcon className="h-3 w-3 text-muted-foreground" />
                          <span>{photos.length} ảnh</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">Không có ảnh</span>
                    )}
                  </td>

                  {/* Cột 6: Tiến độ nộp */}
                  <td className="px-3 border-b border-border/40">
                    <Badge
                      variant="outline"
                      className={cn('text-[10px] px-1.5 py-0 h-4.5 font-normal', statusClass)}
                    >
                      {DAILY_STATUS_LABELS[sub.status]}
                    </Badge>
                  </td>

                  {/* Cột 7: Thao tác */}
                  <td
                    className="px-3 border-b border-border/40 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Xem chi tiết biên bản"
                        onClick={() => onViewDetail(sub)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </DataTableFrame>

      {/* Pagination Footer */}
      <DataTablePagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
