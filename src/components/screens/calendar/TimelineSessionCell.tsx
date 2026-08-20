'use client'

import { Clock, Users, ArrowLeftRight, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ClassSession } from './calendarClassScheduleTypes'
import { SessionHoverCard } from './SessionHoverCard'
import { TimelineGroupHoverCard } from './TimelineGroupHoverCard'
import { parseScheduleTime as parseTime } from '@/components/screens/schedule/ScheduleTimeGrid'

interface TimelineSessionCellProps {
  sessions: ClassSession[]
  onSelectSingle: (session: ClassSession) => void
}

export function TimelineSessionCell({
  sessions,
  onSelectSingle,
}: TimelineSessionCellProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="h-10 flex items-center justify-center text-[10px] text-muted-foreground/30 italic select-none">
        —
      </div>
    )
  }

  // CASE 1: Single session (1 lớp trong khung giờ)
  if (sessions.length === 1) {
    const session = sessions[0]
    const isCancelled = session.status === 'cancelled'
    const hasSubstitute = Boolean(session.substituteTeacher)
    const activeTeacher = session.substituteTeacher || session.teacher

    let bgClass = 'bg-card hover:bg-accent/60 border-border dark:border-zinc-800/60 shadow-2xs'
    if (isCancelled) {
      bgClass = 'bg-zinc-50/40 dark:bg-zinc-900/20 opacity-50 border-zinc-200/40 dark:border-zinc-800/40 cursor-not-allowed select-none'
    } else if (session.isOpeningDay) {
      bgClass = 'bg-red-50/80 hover:bg-red-100/80 dark:bg-red-950/30 dark:hover:bg-red-950/50 border-red-300 dark:border-red-800 shadow-2xs'
    } else if (hasSubstitute) {
      bgClass = 'bg-sky-50/90 hover:bg-sky-100/90 dark:bg-sky-950/30 dark:hover:bg-sky-950/50 border-sky-300 dark:border-sky-800/80 shadow-2xs'
    } else if (session.dateBucket === 'today') {
      bgClass = 'bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800/80 shadow-2xs'
    }

    return (
      <SessionHoverCard session={session}>
        <div
          onClick={() => onSelectSingle(session)}
          className={cn(
            "group relative flex flex-col justify-center gap-1 overflow-hidden rounded-md p-1.5 transition cursor-pointer border text-[10px] leading-tight select-none min-h-[44px] w-full",
            bgClass
          )}
        >
          {session.isOpeningDay && (
            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500" />
          )}

          {/* Dòng 1: Giờ bắt đầu - giờ kết thúc, Sĩ số */}
          <div className={cn("flex items-center justify-between gap-1 text-[10px]", session.isOpeningDay && "pl-1")}>
            <div className="flex items-center gap-1 font-bold text-primary dark:text-primary/90">
              <Clock className="h-3 w-3 shrink-0" />
              <span>{session.timeLabel} - {session.endTimeLabel}</span>
            </div>
            <div className="flex items-center gap-0.5 font-bold text-foreground/90 shrink-0">
              <Users className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span>{session.totalStudents} HS</span>
              {session.trialStudents > 0 && (
                <span className="text-[9px] text-violet-600 dark:text-violet-400 font-semibold" title={`${session.trialStudents} học thử`}>
                  (+{session.trialStudents})
                </span>
              )}
            </div>
          </div>

          {/* Dòng 2: Giáo viên, đổi giáo viên (Không icon GV, không mã/tên lớp) */}
          <div className={cn("flex items-center justify-between text-[9.5px]", session.isOpeningDay && "pl-1")}>
            {hasSubstitute ? (
              <div className="flex items-center gap-1 text-sky-700 dark:text-sky-400 font-semibold truncate" title={`Dạy thay: ${session.substituteTeacher} (Chính: ${session.teacher})`}>
                <ArrowLeftRight className="h-2.5 w-2.5 shrink-0 text-sky-600" />
                <span className="truncate">{session.substituteTeacher}</span>
                <span className="text-[8.5px] text-muted-foreground font-normal truncate">(thay {session.teacher})</span>
              </div>
            ) : (
              <span className="font-medium text-foreground/80 truncate" title={`Giáo viên: ${activeTeacher}`}>
                {activeTeacher}
              </span>
            )}
            <span className="text-[8.5px] text-muted-foreground truncate shrink-0 ml-1">
              {session.schoolRoom}
            </span>
          </div>
        </div>
      </SessionHoverCard>
    )
  }

  // CASE 2: Multiple sessions in same time slot (Gom lại thành nhóm)
  const minStartTime = sessions[0]?.timeLabel || ''
  const maxEndTime = sessions.reduce((latest, current) => {
    if (!latest) return current.endTimeLabel
    return parseTime(current.endTimeLabel) > parseTime(latest) ? current.endTimeLabel : latest
  }, sessions[0]?.endTimeLabel || '')

  // Format distinct teachers for summary label without GV icon
  const teacherSummary = sessions
    .map((s) => (s.substituteTeacher ? `${s.substituteTeacher} (thay ${s.teacher})` : s.teacher))
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(', ')

  return (
    <TimelineGroupHoverCard sessions={sessions} onSelectSession={onSelectSingle}>
      <div
        className="group relative flex flex-col justify-center gap-1 overflow-hidden rounded-md p-1.5 transition cursor-pointer border border-indigo-200/80 bg-indigo-50/70 hover:bg-indigo-100/80 dark:border-indigo-800/60 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 shadow-2xs text-[10px] leading-tight select-none min-h-[44px] w-full"
      >
        {/* Dòng 1: Giờ bắt đầu, kết thúc của lớp cuối - Sĩ số đổi thành số lớp */}
        <div className="flex items-center justify-between gap-1 text-[10px]">
          <div className="flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-300">
            <Clock className="h-3 w-3 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>{minStartTime} - {maxEndTime}</span>
          </div>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-200/80 dark:bg-indigo-900/80 border border-indigo-300 dark:border-indigo-700 px-1.5 py-0.2 text-[9px] font-bold text-indigo-800 dark:text-indigo-200 shrink-0">
            <Layers className="h-2.5 w-2.5 shrink-0" />
            {sessions.length} lớp
          </span>
        </div>

        {/* Dòng 2: Liệt kê các cô giáo của từng lớp (Không icon GV, không mã lớp) */}
        <div className="flex items-center justify-between text-[9.5px] text-muted-foreground">
          <span className="text-[9px] font-medium text-foreground/90 truncate flex-1 min-w-0" title={`Giáo viên: ${teacherSummary}`}>
            {teacherSummary}
          </span>
          <span className="text-[8.5px] font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 ml-1 group-hover:underline">
            Chi tiết
          </span>
        </div>
      </div>
    </TimelineGroupHoverCard>
  )
}
