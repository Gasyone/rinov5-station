'use client'

import React, { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Star } from 'lucide-react'
import { type SessionHistory } from './StudentCareReportTab'

interface ClassEvaluationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regularSessions: SessionHistory[]
  testSessions: SessionHistory[]
  className: string
}

function getDayOfWeek(dateStr: string): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return days[d.getDay()]
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-px">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`}
        />
      ))}
    </div>
  )
}

export function ClassEvaluationDialog({
  open,
  onOpenChange,
  regularSessions,
  testSessions,
  className,
}: ClassEvaluationDialogProps) {
  const allSessions = useMemo(() => {
    return [...regularSessions, ...testSessions].sort((a, b) => a.sessionNumber - b.sessionNumber)
  }, [regularSessions, testSessions])

  // Stats
  const stats = useMemo(() => {
    const rated = allSessions.filter((s) => s.rating > 0)
    const avgRating = rated.length > 0 ? (rated.reduce((sum, s) => sum + s.rating, 0) / rated.length).toFixed(1) : '—'
    const withComment = allSessions.filter((s) => s.comment).length
    return { avgRating, withComment, total: allSessions.length }
  }, [allSessions])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-[90vw] lg:max-w-[780px] select-none text-left">
        <DialogHeader className="p-4 border-b border-border/50 shrink-0 flex flex-row items-center justify-between gap-4 pr-12">
          <div className="min-w-0">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
              Lịch sử đánh giá & nhận xét
            </DialogTitle>
            <p className="text-[10px] text-muted-foreground mt-1 font-semibold leading-none">
              Lớp học: <span className="text-zinc-800 dark:text-zinc-200">{className}</span>
            </p>
          </div>

          {/* Right Header stats */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/30 min-w-[54px]">
              <span className="text-[7.5px] text-amber-600/80 dark:text-amber-400/80 uppercase font-bold tracking-wider leading-none">TB sao</span>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 leading-none">{stats.avgRating} ★</span>
            </div>
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200/50 dark:border-violet-900/30 min-w-[54px]">
              <span className="text-[7.5px] text-violet-600/80 dark:text-violet-400/80 uppercase font-bold tracking-wider leading-none">Nhận xét</span>
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-400 mt-0.5 leading-none">{stats.withComment}/{stats.total}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {allSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              Không có dữ liệu đánh giá nào.
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-border/80 rounded-xl bg-muted/5 dark:bg-zinc-950/20 shadow-3xs">
              <table className="w-full text-[11px] border-collapse bg-transparent table-fixed">
                <thead>
                  <tr className="border-b border-border/85 text-muted-foreground bg-muted/20 dark:bg-zinc-900/40">
                    <th className="py-2.5 px-3 text-left font-bold w-[40px]">#</th>
                    <th className="py-2.5 px-3 text-left font-bold w-[240px]">Nội dung bài học & Thời gian</th>
                    <th className="py-2.5 px-3 text-center font-bold w-[90px]">Đánh giá</th>
                    <th className="py-2.5 px-3 text-left font-bold">Nhận xét của giáo viên</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {allSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors bg-transparent">
                      <td className="py-2.5 px-3 font-mono text-muted-foreground font-normal w-[40px]">{s.sessionNumber}</td>

                      <td className="py-2.5 px-3 w-[240px]">
                        <span className="font-semibold text-foreground">{s.topic}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                          {getDayOfWeek(s.date)}, {s.date}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center w-[90px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <RatingStars rating={s.rating} />
                          <span className="text-[9px] text-muted-foreground font-medium">{s.rating}/5</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        {s.comment ? (
                          <span className="text-foreground font-normal leading-relaxed">{s.comment}</span>
                        ) : (
                          <span className="text-muted-foreground/50 italic text-[10px]">Chưa có nhận xét</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
