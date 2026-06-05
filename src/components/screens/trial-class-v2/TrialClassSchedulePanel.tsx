'use client'

import * as React from 'react'
import { CheckCircle, Clock, Users, ChevronDown, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
import { StatusBadge } from '@/components/shared'
import { MOCK_CLASS_OPTIONS } from './trialClassConstants'
import { getMockSessionsForClass } from '@/mocks/trialClasses'
import { formatTrialDate } from './trialClassHelpers'
import type { TrialSessionSelection } from './trialClassTypes'
import { cn } from '@/lib/utils'

interface TrialClassSchedulePanelProps {
  program: string
  selectedSessions: TrialSessionSelection[]
  onSelectSession: (session: TrialSessionSelection) => void
}

function generateSessionsForClass(
  cls: typeof MOCK_CLASS_OPTIONS[0],
  fromDateStr: string,
  toDateStr: string
) {
  const sessions: Array<{ id: string; name: string; date: string; time: string; attendees: number; capacity: number }> = []

  if (!fromDateStr || !toDateStr) return []

  const fromDate = new Date(fromDateStr)
  const toDate = new Date(toDateStr)

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return []

  // Parse schedule, e.g. "T3/T5/CN 18:00"
  const [daysPart, timePart] = cls.schedule.split(' ')
  const scheduleDays = daysPart.split('/') // ['T3', 'T5', 'CN']
  const time = timePart || '18:00'

  // Weekday mapping: Date.getDay() -> 0 = CN, 1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7
  const weekdayToAbbr = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const current = new Date(fromDate)
  let count = 0

  while (current <= toDate && count < 31) {
    const dayOfWeek = current.getDay()
    const abbr = weekdayToAbbr[dayOfWeek]

    if (scheduleDays.includes(abbr)) {
      const year = current.getFullYear()
      const month = String(current.getMonth() + 1).padStart(2, '0')
      const datePart = String(current.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${datePart}`

      const attendees = Math.floor(Math.random() * 5) + 6 // 6 to 10 attendees
      const capacity = 15
      const sessIndex = sessions.length + 1

      sessions.push({
        id: `SESS-${cls.classId.split('-')[1]}-${datePart}${month}`,
        name: `Buổi ${sessIndex} (${cls.program})`,
        date: dateStr,
        time: time,
        attendees,
        capacity,
      })
    }

    current.setDate(current.getDate() + 1)
    count++
  }

  return sessions
}

const formatRangeDate = (date: Date) => {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

const formatInputDate = (date?: Date) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function TrialClassSchedulePanel({
  program,
  selectedSessions,
  onSelectSession,
}: TrialClassSchedulePanelProps) {
  const matchingClasses = React.useMemo(
    () => (program ? MOCK_CLASS_OPTIONS.filter((c) => c.program === program) : []),
    [program]
  )
  
  // Date range states for the student's desired trial period
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date('2026-05-18'),
    to: new Date('2026-06-05'),
  })

  const fromDate = formatInputDate(dateRange?.from)
  const toDate = formatInputDate(dateRange?.to)

  // Track which class is currently expanded in the accordion
  const [expandedClassId, setExpandedClassId] = React.useState<string | null>(null)
  const activeExpandedClassId = matchingClasses.some((cls) => cls.classId === expandedClassId)
    ? expandedClassId
    : matchingClasses[0]?.classId ?? null

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Lịch khả dụng</h3>
        {program && (
          <Badge variant="outline" className="text-xs font-normal">
            Lọc theo: {program}
          </Badge>
        )}
      </div>

      {program && (
        <div className="mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-9 text-xs"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {dateRange && dateRange.from ? (
                  dateRange.to ? (
                    <>
                      Thời gian học thử: <strong className="text-foreground mx-1">{formatRangeDate(dateRange.from)}</strong> - <strong className="text-foreground ml-1">{formatRangeDate(dateRange.to)}</strong>
                    </>
                  ) : (
                    formatRangeDate(dateRange.from)
                  )
                ) : (
                  <span>Chọn khoảng thời gian học thử mong muốn...</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <ScrollArea className="h-[360px] pr-3">
        {!program ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            <Clock className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm">Vui lòng chọn Chương trình ở bên trái</p>
            <p className="mt-1 text-xs opacity-70">Lịch học trống sẽ tự động hiển thị tại đây.</p>
          </div>
        ) : matchingClasses.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            <p className="text-sm">Không tìm thấy lớp nào phù hợp.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matchingClasses.map((cls) => {
              const isClassFull = cls.enrolledStudents >= cls.maxStudents
              const isExpanded = activeExpandedClassId === cls.classId
              
              // Dynamic session list based on expanded class and chosen date range
              const classSessions = (() => {
                if (!isExpanded) return []
                const generated = generateSessionsForClass(cls, fromDate, toDate)
                if (generated.length > 0) return generated
                
                return getMockSessionsForClass(cls.classId).filter(s => {
                  if (fromDate && s.date < fromDate) return false
                  if (toDate && s.date > toDate) return false
                  return true
                })
              })()

              // Count how many sessions from this class are currently selected
              const selectedCount = selectedSessions.filter(s => s.classId === cls.classId).length

              return (
                <section
                  key={cls.classId}
                  className={cn(
                    "overflow-hidden rounded-lg border transition-all",
                    isClassFull ? "border-border/50 bg-muted/10 opacity-70" : "border-border bg-card",
                    isExpanded ? "ring-1 ring-border/50 shadow-sm" : ""
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedClassId(isExpanded ? null : cls.classId)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3 text-left transition-colors",
                      isExpanded ? "bg-muted/30 border-b" : "hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-muted-foreground shrink-0">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate flex flex-wrap items-center gap-1.5">
                          <span>{cls.className}</span>
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-amber-300/60 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold">
                            Level: {cls.className.split(' ').pop()}
                          </Badge>
                          {cls.classType === 'Lớp Workshop' ? (
                            <StatusBadge status="class_workshop" label="Workshop" className="h-5 px-1.5 text-[10px]" />
                          ) : (
                            <StatusBadge status="class_official" label="Chính thức" className="h-5 px-1.5 text-[10px]" />
                          )}
                          {selectedCount > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary hover:bg-primary/20">
                              Đã chọn {selectedCount}
                            </Badge>
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          GV: <span className="font-medium text-foreground">{cls.teacher}</span> &middot; <span className="font-semibold text-primary">{cls.schedule.split(' ')[0].split('/').length} buổi/tuần</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 pl-3 border-l border-border/40">
                      <div className="text-[10px] font-bold text-foreground bg-muted px-2 py-0.5 rounded-md">
                        Lịch: {cls.schedule.split(' ')[0]}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{cls.enrolledStudents}/{cls.maxStudents}</span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-muted/5 animate-in slide-in-from-top-2">
                      {classSessions.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-2">
                          Lớp không có lịch học khả dụng trong khoảng thời gian được chọn.
                        </p>
                      ) : (
                        <div className="grid gap-2">
                          {classSessions.map((session) => {
                            const isSessionFull = session.attendees >= session.capacity
                            const isSelected = selectedSessions.some(
                              (s) => s.classId === cls.classId && s.sessionId === session.id
                            )

                            return (
                              <Button
                                key={session.id}
                                type="button"
                                variant="ghost"
                                disabled={isSessionFull}
                                onClick={() => {
                                  onSelectSession({
                                    classId: cls.classId,
                                    className: `${cls.className} (${cls.teacher})`,
                                    sessionId: session.id,
                                    sessionName: session.name,
                                    trialDate: `${session.date} ${session.time}`,
                                  })
                                }}
                                className={cn(
                                  "flex h-auto w-full items-center justify-between rounded-md p-2.5 text-left transition-colors",
                                  isSelected
                                    ? "bg-primary/10 text-primary"
                                    : isSessionFull
                                      ? "cursor-not-allowed bg-muted/30 opacity-60"
                                      : "hover:bg-muted/50"
                                )}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={cn(
                                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-primary/20 bg-background",
                                    isSessionFull && "border-muted-foreground/30"
                                  )}>
                                    {isSelected && <CheckCircle className="h-3 w-3" />}
                                  </div>
                                  <div>
                                    <p className={cn("text-xs font-semibold", isSelected ? "text-primary" : "text-foreground")}>
                                      {session.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {formatTrialDate(session.date)} &middot; {session.time}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                    <Users className="h-3 w-3" />
                                    {session.attendees}/{session.capacity}
                                  </div>
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
