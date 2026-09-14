'use client'

import React from 'react'
import {
  FileText,
  Copy,
  ExternalLink,
  Calendar,
} from 'lucide-react'
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
import { EmptyState } from '@/components/shared'

export interface HistoricalReportItem {
  id: string
  monthBadge: string
  title: string
  date: string
  teacherName: string
  url?: string
}

interface HistoricalReportsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  className: string
  classCode: string
  items: HistoricalReportItem[]
  onCopyLink: (url: string) => void
}

function parseMonthYearKey(str: string): number {
  const m = str.match(/(?:Tháng\s+)?(\d{1,2})\/(\d{4})/i)
  if (m) {
    return parseInt(m[2], 10) * 100 + parseInt(m[1], 10)
  }
  return 0
}

export function HistoricalReportsDialog({
  open,
  onOpenChange,
  className,
  classCode,
  items,
  onCopyLink,
}: HistoricalReportsDialogProps) {
  // Sort items chronologically descending (newest month first)
  const sortedItems = [...items].sort((a, b) => {
    const keyA = parseMonthYearKey(a.monthBadge) || parseMonthYearKey(a.date) || 0
    const keyB = parseMonthYearKey(b.monthBadge) || parseMonthYearKey(b.date) || 0
    return keyB - keyA
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden sm:rounded-xl">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Danh sách Báo cáo học tập
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Lớp học: <span className="font-semibold text-foreground">{className}</span> ({classCode}) • {items.length} báo cáo
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content: Mỗi báo cáo 1 dòng (không dùng bảng, không có đánh giá định kỳ) */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {sortedItems.length > 0 ? (
            <div className="space-y-2">
              {sortedItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border border-border/80 bg-background hover:bg-muted/30 transition-all select-none text-xs"
                  >
                    {/* Left: Tháng • Tiêu đề • GV & Ngày (Cùng trên 1 hàng) */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Tháng */}
                      <span className="font-semibold text-xs text-foreground shrink-0 flex items-center gap-1.5 whitespace-nowrap bg-muted/50 px-2 py-0.5 rounded">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{item.monthBadge}</span>
                      </span>

                      {/* Tiêu đề & Thông tin (Cùng hàng ngang, không bẻ dòng) */}
                      <div className="flex items-center gap-2 min-w-0 flex-1 truncate">
                        <span className="font-semibold text-foreground truncate">
                          {item.title}
                        </span>

                        <span className="hidden sm:inline text-[11px] text-muted-foreground shrink-0 truncate">
                          • GV: {item.teacherName} • {item.date}
                        </span>
                      </div>
                    </div>

                    {/* Right: Thao tác (Copy & Mở Docs) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.url && (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onCopyLink(item.url!)}
                            className="h-7 px-2 text-xs font-normal text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
                            title="Sao chép liên kết"
                          >
                            <Copy className="h-3 w-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </Button>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 px-2.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer"
                            title="Mở tài liệu Google Docs"
                          >
                            <span>Docs</span>
                            <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <EmptyState
                title="Chưa có báo cáo"
                description="Chưa ghi nhận báo cáo học tập nào cho lớp học này."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-3 px-4 border-t border-border/60 bg-muted/10 flex items-center justify-between sm:justify-between">
          <span className="text-xs text-muted-foreground">
            Tổng cộng: <strong className="text-foreground">{items.length}</strong> báo cáo học tập
          </span>
          <DialogClose asChild>
            <Button type="button" variant="outline" size="sm" className="h-7 px-3 text-xs cursor-pointer">
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
