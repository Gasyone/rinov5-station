'use client'

import React, { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ExternalLink, Calendar, RefreshCw, ChevronDown, BookOpen } from 'lucide-react'
import { type SessionHistory } from './StudentCareReportTab'
import { mockClassRecords } from '@/mocks/classRecords'
import { 
  type TimeRangeKey, 
  type MultiClassSession, 
  type ClassPackageSummary,
  filterSessionsByTimeRange,
  groupFilteredSessionsByClass
} from './careModalFilterHelpers'
import { CareModalTimeFilter } from './CareModalTimeFilter'
import { cn } from '@/lib/utils'

interface ClassAttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  regularSessions?: SessionHistory[]
  testSessions?: SessionHistory[]
  className?: string
  classCode?: string
  multiClassSessions?: MultiClassSession[]
  classList?: ClassPackageSummary[]
  initialPackageId?: string
  isHistoricalClass?: boolean
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
      <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 text-xs font-normal text-rose-600 border border-rose-200/50 select-none">
        Vắng
      </span>
    )
  }
  if (status === 'excused') {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 text-xs font-normal text-rose-600 border border-rose-200/50 select-none">
          Vắng
        </span>
        {onOpenLeave && (
          <button
            type="button"
            onClick={onOpenLeave}
            className="text-xs font-normal text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-0.5 mt-0.5 shrink-0"
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
      <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 text-xs font-normal text-amber-600 border border-amber-200/50 select-none">
        Đến muộn
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 text-xs font-normal text-emerald-600 border border-emerald-200/50 select-none">
      ✓ Đã đến
    </span>
  )
}

export function HomeworkStatusBadge({ status }: { status?: SessionHistory['homework'] }) {
  if (status === 'submitted') {
    return (
      <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-xs font-normal text-emerald-600 border border-emerald-200/50 select-none">
        ✓ Đã nộp
      </span>
    )
  }
  if (status === 'late') {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 text-xs font-normal text-amber-600 border border-amber-200/50 select-none">
        Nộp muộn
      </span>
    )
  }
  if (status === 'not_submitted') {
    return (
      <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 text-xs font-normal text-rose-600 border border-rose-200/50 select-none">
        Chưa nộp
      </span>
    )
  }
  return <span className="text-muted-foreground/50 text-xs">—</span>
}

export function SessionScoreBadge({ score, overall }: { score?: number | null; overall?: string }) {
  if (score != null) {
    return (
      <span className="inline-flex items-center justify-center font-bold text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded min-w-[32px]">
        {score}
      </span>
    )
  }
  if (overall) {
    return (
      <span className="inline-flex items-center justify-center font-bold text-xs text-foreground bg-muted/60 px-2 py-0.5 rounded min-w-[32px]">
        {overall}
      </span>
    )
  }
  return <span className="text-muted-foreground/50 text-xs">—</span>
}

function AttendanceTable({
  sessions,
  defaultTeachers,
  defaultRoom,
  onOpenLeave
}: {
  sessions: MultiClassSession[]
  defaultTeachers: string[]
  defaultRoom: string
  onOpenLeave?: (date: string) => void
}) {
  return (
    <div className="overflow-x-auto w-full border border-border/80 rounded-xl bg-muted/5 dark:bg-zinc-950/20 shadow-3xs">
      <table className="w-full text-xs border-collapse bg-transparent table-fixed">
        <thead>
          <tr className="border-b border-border/85 text-muted-foreground bg-muted/20 dark:bg-zinc-900/40">
            <th className="py-2.5 px-3 text-left font-bold w-[280px]">Nội dung bài học & Thời gian</th>
            <th className="py-2.5 px-3 text-left font-bold w-[180px]">Giáo viên & Phòng học</th>
            <th className="py-2.5 px-3 text-center font-bold w-[110px]">Điểm danh</th>
            <th className="py-2.5 px-3 text-center font-bold w-[100px]">BTVN</th>
            <th className="py-2.5 px-3 text-center font-bold w-[80px]">Điểm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {sessions.map((s, idx) => {
            const sessionTeacher = s.teacherName || defaultTeachers[s.sessionNumber % defaultTeachers.length] || 'GV Nguyễn Huy Hoàng'
            const sessionRoom = s.room || defaultRoom

            return (
              <tr key={s.id || `att-row-${idx}`} className="hover:bg-muted/30 transition-colors bg-transparent">
                <td className="py-2.5 px-3 w-[280px]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-foreground">{s.topic}</span>
                    {s.type === 'test' && (
                      <span className="text-xs bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded">
                        KT
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {getDayOfWeek(s.date)}, {s.date}
                  </div>
                </td>

                <td className="py-2.5 px-3 w-[180px] text-left leading-normal">
                  <span className="font-medium text-foreground text-xs block">{sessionTeacher}</span>
                  <span className="text-xs text-muted-foreground block mt-0.5">Phòng {sessionRoom}</span>
                </td>

                <td className="py-2.5 px-3 text-center w-[110px]">
                  <AttendanceStatusBadge 
                    status={s.attendance} 
                    onOpenLeave={onOpenLeave ? () => onOpenLeave(s.date) : undefined} 
                  />
                </td>

                <td className="py-2.5 px-3 text-center w-[100px]">
                  <HomeworkStatusBadge status={s.homework} />
                </td>

                <td className="py-2.5 px-3 text-center w-[80px]">
                  <SessionScoreBadge score={s.score} overall={s.overall} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function ClassAttendanceDialog({
  open,
  onOpenChange,
  regularSessions = [],
  testSessions = [],
  className = 'Lớp học',
  classCode = 'CLS-001',
  multiClassSessions,
  classList = [],
  initialPackageId,
  isHistoricalClass = false,
  onOpenLeave
}: ClassAttendanceDialogProps) {
  // Filter States: Default is 'all' for historical classes, 'last_30_days' for active classes
  const [timeRange, setTimeRange] = useState<TimeRangeKey>(isHistoricalClass ? 'all' : 'last_30_days')
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
    if (!isHistoricalClass && multiClassSessions && multiClassSessions.length > 0) {
      return multiClassSessions
    }
    const combined = [...regularSessions, ...testSessions]
    return combined.map((s) => ({
      ...s,
      className,
      classCode,
      isCurrentClass: !isHistoricalClass,
    }))
  }, [isHistoricalClass, multiClassSessions, regularSessions, testSessions, className, classCode])

  // Filter by Time Range
  const filteredSessions = useMemo(() => {
    const sorted = [...rawSessions].sort((a, b) => a.date.localeCompare(b.date))
    return filterSessionsByTimeRange(sorted, timeRange, customStart, customEnd)
  }, [rawSessions, timeRange, customStart, customEnd])

  // Group by current class vs historical classes
  const { currentClass, currentSessions, historicalClasses } = useMemo(() => {
    if (isHistoricalClass) {
      return {
        currentClass: null,
        currentSessions: filteredSessions,
        historicalClasses: []
      }
    }
    return groupFilteredSessionsByClass(filteredSessions, classList, initialPackageId)
  }, [isHistoricalClass, filteredSessions, classList, initialPackageId])

  // Default class details fallback
  const classRecord = useMemo(() => {
    return mockClassRecords.find((c) => c.code === classCode)
  }, [classCode])

  const defaultTeachers = useMemo(() => {
    if (!classRecord?.teacher) return ['GV Nguyễn Huy Hoàng']
    return classRecord.teacher.split(/[,/&]+/).map((t) => t.trim()).filter(Boolean)
  }, [classRecord])

  const defaultRoom = classRecord?.room || 'P.102'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-[90vw] lg:max-w-[900px] select-none text-left">
        <DialogHeader className="p-3.5 sm:p-4 border-b border-border/50 shrink-0 flex flex-row items-center justify-between gap-3 pr-10">
          <div className="min-w-0">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <span className={cn("w-2 h-2 rounded-full shrink-0", isHistoricalClass ? "bg-sky-500" : "bg-rose-500")} />
              Chi tiết chuyên cần {isHistoricalClass ? 'lớp học cũ' : 'học viên'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1 font-semibold leading-none">
              {isHistoricalClass ? 'Lớp học cũ: ' : 'Lớp hiện tại: '}
              <span className="text-zinc-800 dark:text-zinc-200">
                {isHistoricalClass ? className : (currentClass?.className || className)}
              </span>
              {(isHistoricalClass ? classCode : (currentClass?.classCode || classCode)) && (
                <span className="font-mono ml-1 text-muted-foreground">
                  ({isHistoricalClass ? classCode : (currentClass?.classCode || classCode)})
                </span>
              )}
            </p>
          </div>

          {/* Right Header: Time Range Filter */}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0 space-y-5">
          {filteredSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic space-y-2">
              <Calendar className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p>Không có dữ liệu chuyên cần nào trong khoảng thời gian đã chọn.</p>
              <button
                type="button"
                onClick={() => setTimeRange('all')}
                className="text-xs text-sky-600 hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
              >
                <RefreshCw className="h-3 w-3" />
                Xem tất cả thời gian
              </button>
            </div>
          ) : isHistoricalClass ? (
            /* TRƯỜNG HỢP MỞ TỪ LỚP CŨ: CHỈ HIỂN THỊ DUY NHẤT LỚP CŨ NÀY, TUYỆT ĐỐI KHÔNG CÓ LỚP HIỆN TẠI */
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">
                    {className}
                  </span>
                  {classCode && (
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                      {classCode}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {filteredSessions.length} buổi học
                </span>
              </div>

              <AttendanceTable
                sessions={filteredSessions}
                defaultTeachers={defaultTeachers}
                defaultRoom={defaultRoom}
                onOpenLeave={onOpenLeave}
              />
            </div>
          ) : (
            /* TRƯỜNG HỢP MỞ TỪ LỚP HIỆN TẠI: HIỂN THỊ LỚP HIỆN TẠI VÀ LỊCH SỬ CÁC LỚP CŨ BÊN DƯỚI */
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
                    {(currentClass?.classCode || classCode) && (
                      <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                        {currentClass?.classCode || classCode}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {currentSessions.length} buổi trong kỳ
                  </span>
                </div>

                {currentSessions.length > 0 ? (
                  <AttendanceTable
                    sessions={currentSessions}
                    defaultTeachers={defaultTeachers}
                    defaultRoom={defaultRoom}
                    onOpenLeave={onOpenLeave}
                  />
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
                                <AttendanceTable
                                  sessions={sessions}
                                  defaultTeachers={classInfo.teacherName ? [classInfo.teacherName] : defaultTeachers}
                                  defaultRoom={classInfo.room || defaultRoom}
                                  onOpenLeave={onOpenLeave}
                                />
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
