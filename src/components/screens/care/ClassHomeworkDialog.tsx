'use client'

import React, { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { type SessionHistory } from './StudentCareReportTab'

interface ClassHomeworkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regularSessions: SessionHistory[]
  className: string
}

function getDayOfWeek(dateStr: string): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return days[d.getDay()]
}

export function ClassHomeworkDialog({
  open,
  onOpenChange,
  regularSessions,
  className
}: ClassHomeworkDialogProps) {
  const sortedSessions = useMemo(() => {
    return [...regularSessions].sort((a, b) => a.sessionNumber - b.sessionNumber)
  }, [regularSessions])

  // Statistics
  const stats = useMemo(() => {
    let submitted = 0
    let late = 0
    let missing = 0

    sortedSessions.forEach((s) => {
      if (s.homework === 'submitted') submitted++
      else if (s.homework === 'late') late++
      else missing++
    })

    const total = sortedSessions.length
    const rate = total > 0 ? Math.round(((submitted + late) / total) * 100) : 0

    return { submitted, late, missing, total, rate }
  }, [sortedSessions])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-[90vw] lg:max-w-[720px] select-none text-left">
        <DialogHeader className="p-4 border-b border-border/50 shrink-0 flex flex-row items-center justify-between gap-4 pr-12">
          <div className="min-w-0">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              Chi tiết Bài tập về nhà
            </DialogTitle>
            <p className="text-[10px] text-muted-foreground mt-1 font-semibold leading-none">
              Lớp học: <span className="text-zinc-800 dark:text-zinc-200">{className}</span>
            </p>
          </div>

          {/* Right Header stats */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 min-w-[54px]">
              <span className="text-[7.5px] text-emerald-600/80 dark:text-emerald-400/80 uppercase font-bold tracking-wider leading-none">Đã nộp</span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 leading-none">{stats.submitted}</span>
            </div>
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/30 min-w-[54px]">
              <span className="text-[7.5px] text-amber-600/80 dark:text-amber-400/80 uppercase font-bold tracking-wider leading-none">Nộp muộn</span>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 leading-none">{stats.late}</span>
            </div>
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/30 min-w-[54px]">
              <span className="text-[7.5px] text-rose-600/80 dark:text-rose-400/80 uppercase font-bold tracking-wider leading-none">Chưa nộp</span>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 mt-0.5 leading-none">{stats.missing}</span>
            </div>
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-w-[54px]">
              <span className="text-[7.5px] text-zinc-500 uppercase font-bold tracking-wider leading-none">Tỷ lệ</span>
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mt-0.5 leading-none">{stats.rate}%</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {sortedSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              Không có dữ liệu bài tập về nhà nào.
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-border/80 rounded-xl bg-muted/5 dark:bg-zinc-950/20 shadow-3xs">
              <table className="w-full text-[11px] border-collapse bg-transparent table-fixed">
                <thead>
                  <tr className="border-b border-border/85 text-muted-foreground bg-muted/20 dark:bg-zinc-900/40">
                    <th className="py-2.5 px-3 text-left font-bold w-[40px]">#</th>
                    <th className="py-2.5 px-3 text-left font-bold w-[340px]">Nội dung bài học & Thời gian</th>
                    <th className="py-2.5 px-3 text-center font-bold w-[120px]">Trạng thái BTVN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {sortedSessions.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors bg-transparent">
                      <td className="py-2.5 px-3 font-mono text-muted-foreground font-normal w-[40px]">{s.sessionNumber}</td>

                      <td className="py-2.5 px-3 w-[340px]">
                        <span className="font-semibold text-foreground">{s.topic}</span>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                          {getDayOfWeek(s.date)}, {s.date}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center w-[120px]">
                        {s.homework === 'submitted' || s.homework === 'late' ? (
                          <button
                            type="button"
                            onClick={() => toast.success(`Đang mở bài làm BT-${String(s.sessionNumber).padStart(2, '0')} của học viên`)}
                            className="text-primary font-normal hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 text-xs"
                          >
                            BT-{String(s.sessionNumber).padStart(2, '0')} <ExternalLink className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground/70 font-normal select-none">
                            BT-{String(s.sessionNumber).padStart(2, '0')}
                          </span>
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
