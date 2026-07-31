'use client'

import React, { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ExternalLink } from 'lucide-react'
import { type SessionHistory } from './StudentCareReportTab'
import { mockClassRecords } from '@/mocks/classRecords'

interface ClassAttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regularSessions: SessionHistory[]
  testSessions: SessionHistory[]
  className: string
  classCode: string
  onOpenLeave?: (date: string) => void
}

function getDayOfWeek(dateStr: string): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return days[d.getDay()]
}

export function AttendanceStatusBadge({ 
  status, 
  onOpenLeave 
}: { 
  status: SessionHistory['attendance']
  onOpenLeave?: () => void 
}) {
  if (status === 'absent') {
    return (
      <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 text-[10px] font-normal text-rose-600 border border-rose-200/50 select-none">
        Vắng
      </span>
    )
  }
  if (status === 'excused') {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 text-[10px] font-normal text-rose-600 border border-rose-200/50 select-none">
          Vắng
        </span>
        {onOpenLeave && (
          <button
            type="button"
            onClick={onOpenLeave}
            className="text-[9px] font-normal text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-0.5 mt-0.5 shrink-0"
          >
            <span>Nghỉ phép</span>
            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
          </button>
        )}
      </div>
    )
  }
  if (status === 'late') {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 text-[10px] font-normal text-amber-600 border border-amber-200/50 select-none">
        Đến muộn
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 text-[10px] font-normal text-emerald-600 border border-emerald-200/50 select-none">
      ✓ Đã đến
    </span>
  )
}

export function ClassAttendanceDialog({
  open,
  onOpenChange,
  regularSessions,
  testSessions,
  className,
  classCode,
  onOpenLeave
}: ClassAttendanceDialogProps) {
  const allSessions = useMemo(() => {
    return [...regularSessions, ...testSessions].sort((a, b) => a.sessionNumber - b.sessionNumber)
  }, [regularSessions, testSessions])

  // Resolve class details (teachers and room)
  const classRecord = useMemo(() => {
    return mockClassRecords.find((c) => c.code === classCode)
  }, [classCode])

  const teachers = useMemo(() => {
    if (!classRecord?.teacher) return ['GV Nguyễn Huy Hoàng']
    return classRecord.teacher.split(/[,/&]+/).map((t) => t.trim()).filter(Boolean)
  }, [classRecord])

  const room = classRecord?.room || 'P101'

  // Statistics calculation
  const stats = useMemo(() => {
    let presentCount = 0
    let lateCount = 0
    let absentCount = 0

    allSessions.forEach((s) => {
      if (s.attendance === 'present') {
        presentCount++
      } else if (s.attendance === 'late') {
        lateCount++
      } else if (s.attendance === 'absent' || s.attendance === 'excused') {
        absentCount++
      }
    })

    return { presentCount, lateCount, absentCount }
  }, [allSessions])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-[90vw] lg:max-w-[800px] select-none text-left">
        <DialogHeader className="p-4 border-b border-border/50 shrink-0 flex flex-row items-center justify-between gap-4 pr-12">
          <div className="min-w-0">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              Chi tiết chuyên cần học viên
            </DialogTitle>
            <p className="text-[10px] text-muted-foreground mt-1 font-semibold leading-none">
              Lớp học: <span className="text-zinc-800 dark:text-zinc-200">{className}</span>
            </p>
          </div>

          {/* Right Header stats */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 min-w-[54px]">
              <span className="text-[7.5px] text-emerald-600/80 dark:text-emerald-400/80 uppercase font-bold tracking-wider leading-none">Đã đến</span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 leading-none">{stats.presentCount}</span>
            </div>
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/30 min-w-[54px]">
              <span className="text-[7.5px] text-amber-600/80 dark:text-amber-400/80 uppercase font-bold tracking-wider leading-none">Muộn</span>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 leading-none">{stats.lateCount}</span>
            </div>
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/30 min-w-[54px]">
              <span className="text-[7.5px] text-rose-600/80 dark:text-rose-400/80 uppercase font-bold tracking-wider leading-none">Vắng</span>
              <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 mt-0.5 leading-none">{stats.absentCount}</span>
            </div>
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 min-w-[54px]">
              <span className="text-[7.5px] text-zinc-500 uppercase font-bold tracking-wider leading-none">Tổng</span>
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mt-0.5 leading-none">{allSessions.length}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {allSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              Không có dữ liệu chuyên cần nào.
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-border/80 rounded-xl bg-muted/5 dark:bg-zinc-950/20 shadow-3xs">
              <table className="w-full text-[11px] border-collapse bg-transparent table-fixed">
                <thead>
                  <tr className="border-b border-border/85 text-muted-foreground bg-muted/20 dark:bg-zinc-900/40">
                    <th className="py-2.5 px-3 text-left font-bold w-[40px]">#</th>
                    <th className="py-2.5 px-3 text-left font-bold w-[280px]">Nội dung bài học & Thời gian</th>
                    <th className="py-2.5 px-3 text-left font-bold w-[180px]">Giáo viên & Phòng học</th>
                    <th className="py-2.5 px-3 text-center font-bold w-[120px]">Điểm danh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {allSessions.map((s) => {
                    const sessionTeacher = teachers[s.sessionNumber % teachers.length] || 'GV Nguyễn Huy Hoàng'
                    return (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors bg-transparent">
                        <td className="py-2.5 px-3 font-mono text-muted-foreground font-normal w-[40px]">{s.sessionNumber}</td>

                        <td className="py-2.5 px-3 w-[280px]">
                          <span className="font-semibold text-foreground">{s.topic}</span>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                            {getDayOfWeek(s.date)}, {s.date}
                          </div>
                        </td>

                        {/* Giáo viên & Phòng học */}
                        <td className="py-2.5 px-3 w-[180px] text-left leading-normal">
                          <span className="font-medium text-foreground text-xs block">{sessionTeacher}</span>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">Phòng {room}</span>
                        </td>

                        <td className="py-2.5 px-3 text-center w-[120px]">
                          <AttendanceStatusBadge 
                            status={s.attendance} 
                            onOpenLeave={onOpenLeave ? () => onOpenLeave(s.date) : undefined} 
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
