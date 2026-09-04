'use client'

import React, { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Star, Calendar, RefreshCw, ChevronDown, BookOpen } from 'lucide-react'
import { type SessionHistory } from './StudentCareReportTab'
import { 
  type TimeRangeKey, 
  type MultiClassSession, 
  type ClassPackageSummary,
  filterSessionsByTimeRange,
  groupFilteredSessionsByClass
} from './careModalFilterHelpers'
import { CareModalTimeFilter } from './CareModalTimeFilter'
import { cn } from '@/lib/utils'

interface ClassEvaluationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regularSessions?: SessionHistory[]
  testSessions?: SessionHistory[]
  className?: string
  multiClassSessions?: MultiClassSession[]
  classList?: ClassPackageSummary[]
  initialPackageId?: string
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

function EvaluationTable({
  sessions
}: {
  sessions: MultiClassSession[]
}) {
  return (
    <div className="overflow-x-auto w-full border border-border/80 rounded-xl bg-muted/5 dark:bg-zinc-950/20 shadow-3xs">
      <table className="w-full text-xs border-collapse bg-transparent table-fixed">
        <thead>
          <tr className="border-b border-border/85 text-muted-foreground bg-muted/20 dark:bg-zinc-900/40">
            <th className="py-2.5 px-3 text-left font-bold w-[45px]">#</th>
            <th className="py-2.5 px-3 text-left font-bold w-[280px]">Nội dung bài học & Thời gian</th>
            <th className="py-2.5 px-3 text-center font-bold w-[90px]">Đánh giá</th>
            <th className="py-2.5 px-3 text-left font-bold">Nhận xét của giáo viên</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {sessions.map((s, idx) => (
            <tr key={s.id || `eval-row-${idx}`} className="hover:bg-muted/30 transition-colors bg-transparent">
              <td className="py-2.5 px-3 font-mono text-muted-foreground font-normal w-[45px]">{s.sessionNumber}</td>

              <td className="py-2.5 px-3 w-[280px]">
                <span className="font-semibold text-foreground">{s.topic}</span>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {getDayOfWeek(s.date)}, {s.date}
                </div>
              </td>

              <td className="py-2.5 px-3 text-center w-[90px]">
                <div className="flex flex-col items-center gap-0.5">
                  <RatingStars rating={s.rating} />
                  <span className="text-xs text-muted-foreground font-medium">{s.rating}/5</span>
                </div>
              </td>

              <td className="py-2.5 px-3">
                {s.comment ? (
                  <span className="text-foreground font-normal leading-relaxed">{s.comment}</span>
                ) : (
                  <span className="text-muted-foreground/50 italic text-xs">Chưa có nhận xét</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ClassEvaluationDialog({
  open,
  onOpenChange,
  regularSessions = [],
  testSessions = [],
  className = 'Lớp học',
  multiClassSessions,
  classList = [],
  initialPackageId
}: ClassEvaluationDialogProps) {
  // Filter States: Default is 30 days
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('last_30_days')
  const [customStart, setCustomStart] = useState<string>('')
  const [customEnd, setCustomEnd] = useState<string>('')

  // State to toggle expansion of historical classes
  const [expandedHistorical, setExpandedHistorical] = useState<Record<string, boolean>>({})

  const toggleExpand = (packageId: string) => {
    setExpandedHistorical((prev) => ({
      ...prev,
      [packageId]: !prev[packageId]
    }))
  }

  // Merge sessions source
  const rawSessions: MultiClassSession[] = useMemo(() => {
    if (multiClassSessions && multiClassSessions.length > 0) {
      return multiClassSessions
    }
    const combined = [...regularSessions, ...testSessions]
    return combined.map((s) => ({
      ...s,
      className,
      isCurrentClass: true,
    }))
  }, [multiClassSessions, regularSessions, testSessions, className])

  // Filter by Time Range
  const filteredSessions = useMemo(() => {
    const sorted = [...rawSessions].sort((a, b) => a.date.localeCompare(b.date))
    return filterSessionsByTimeRange(sorted, timeRange, customStart, customEnd)
  }, [rawSessions, timeRange, customStart, customEnd])

  // Group by current class vs historical classes
  const { currentClass, currentSessions, historicalClasses } = useMemo(() => {
    return groupFilteredSessionsByClass(filteredSessions, classList, initialPackageId)
  }, [filteredSessions, classList, initialPackageId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-[90vw] lg:max-w-[850px] select-none text-left">
        <DialogHeader className="p-3.5 sm:p-4 border-b border-border/50 shrink-0 flex flex-row items-center justify-between gap-3 pr-10">
          <div className="min-w-0">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
              Lịch sử đánh giá & nhận xét
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1 font-semibold leading-none">
              Lớp hiện tại: <span className="text-zinc-800 dark:text-zinc-200">{currentClass?.className || className}</span>
              {currentClass?.classCode && (
                <span className="font-mono ml-1 text-muted-foreground">({currentClass.classCode})</span>
              )}
            </p>
          </div>

          {/* Right Header: Time Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Thời gian:</span>
            <CareModalTimeFilter
              value={timeRange}
              onChange={(newRange, start, end) => {
                setTimeRange(newRange)
                if (start) setCustomStart(start)
                if (end) setCustomEnd(end)
              }}
              customStart={customStart}
              customEnd={customEnd}
            />
          </div>
        </DialogHeader>

        {/* Modal Body: Flattened Layout with Current Class on top & Expandable Historical Classes below */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0 space-y-5">
          {filteredSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic space-y-2">
              <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p>Không có dữ liệu đánh giá nào trong khoảng thời gian đã chọn.</p>
              <button
                type="button"
                onClick={() => setTimeRange('all')}
                className="text-xs text-sky-600 hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
              >
                <RefreshCw className="h-3 w-3" />
                Xem tất cả thời gian
              </button>
            </div>
          ) : (
            <>
              {/* 1. Lớp hiện tại (Primary Section) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 uppercase tracking-wider">
                      Lớp hiện tại
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {currentClass?.className || className}
                    </span>
                    {currentClass?.classCode && (
                      <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                        {currentClass.classCode}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {currentSessions.length} buổi trong kỳ
                  </span>
                </div>

                {currentSessions.length > 0 ? (
                  <EvaluationTable sessions={currentSessions} />
                ) : (
                  <div className="py-4 text-center text-xs text-muted-foreground italic border rounded-xl border-dashed">
                    Không có buổi học nào của lớp hiện tại trong khoảng thời gian đã chọn.
                  </div>
                )}
              </div>

              {/* 2. Các lớp học trước đó (Expandable / Collapsible Sections Flat Below) */}
              {historicalClasses.length > 0 && (
                <div className="space-y-3 pt-1 border-t border-border/50">
                  <div className="flex items-center gap-1.5 pt-1">
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground/70" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Lịch sử các lớp trước đó
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {historicalClasses.map(({ classInfo, sessions }) => {
                      const isExpanded = expandedHistorical[classInfo.packageId] ?? (sessions.length > 0)
                      return (
                        <div
                          key={classInfo.packageId}
                          className="border border-border/80 rounded-xl overflow-hidden bg-background shadow-3xs"
                        >
                          {/* Collapsible Header */}
                          <button
                            type="button"
                            onClick={() => toggleExpand(classInfo.packageId)}
                            className="w-full flex items-center justify-between p-3 bg-muted/15 hover:bg-muted/25 transition-colors text-left cursor-pointer select-none"
                          >
                            <div className="min-w-0 flex items-center gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                Lớp cũ trước chuyển
                              </span>
                              <span className="text-xs font-semibold text-foreground truncate">
                                {classInfo.className}
                              </span>
                              <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                                {classInfo.classCode}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • {classInfo.teacherName || 'GV'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-medium text-muted-foreground">
                                {sessions.length} buổi
                              </span>
                              <ChevronDown className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                isExpanded && "rotate-180"
                              )} />
                            </div>
                          </button>

                          {/* Collapsible Content */}
                          {isExpanded && (
                            <div className="p-3 bg-background border-t border-border/40 space-y-2">
                              {sessions.length > 0 ? (
                                <EvaluationTable sessions={sessions} />
                              ) : (
                                <div className="py-4 text-center text-xs text-muted-foreground italic">
                                  Không có buổi học nào của lớp này trong khoảng thời gian đã chọn.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
