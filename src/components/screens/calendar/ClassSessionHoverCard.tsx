'use client'

import type { ReactNode } from 'react'
import { BookOpen, Clock, Info, MapPin, UserCheck, UserPlus, Users, AlertTriangle } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { AppAvatar } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import type { GenericSessionData } from './SessionHoverCard'

interface ClassSessionHoverCardProps {
  session: GenericSessionData
  children: ReactNode
  openDelay?: number
  closeDelay?: number
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function ClassSessionHoverCard({
  session,
  children,
  openDelay = 150,
  closeDelay = 100,
  side = 'right',
}: ClassSessionHoverCardProps) {
  const isCancelled = session.status === 'cancelled'

  // Standardize values for Class Session
  const title = session.title || session.className || 'Buổi học'
  const classCode = session.classCode
  const className = session.className || session.subtitle
  const subject = session.subject
  const level = session.level
  const room = session.schoolRoom || session.roomName || session.location
  const branch = session.branch

  // Time & Duration
  const timeDisplay = session.timeSlot 
    ? session.timeSlot 
    : session.timeLabel && session.endTimeLabel 
    ? `${session.timeLabel} - ${session.endTimeLabel}` 
    : session.timeLabel || 'N/A'

  // Teaching Staff
  const primaryTeacher = session.teacher || session.teacherName || session.organizer || session.personLabel
  const subTeacher = session.substituteTeacher
  const taTeacher = session.assistantTeacher || session.taName

  const hasNewStudents = Boolean(session.trialStudents && session.trialStudents > 0)

  // Location formatting: avoid repeating branch if room already contains branch
  let locationDisplay = ''
  if (room && branch) {
    if (room.toLowerCase().includes(branch.toLowerCase()) || branch.toLowerCase().includes(room.toLowerCase())) {
      locationDisplay = room
    } else {
      locationDisplay = `${room} • ${branch}`
    }
  } else {
    locationDisplay = room || branch || ''
  }

  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        side={side}
        align="start"
        sideOffset={8}
        className="w-80 p-0 overflow-hidden rounded-lg shadow-xl border border-border/80 bg-popover z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Top Header Ribbon */}
        <div
          className={cn(
            'px-3.5 py-2.5 flex items-center justify-between border-b text-xs font-semibold',
            isCancelled
              ? 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
              : session.isOpeningDay
              ? 'bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60'
              : subTeacher
              ? 'bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/60'
              : session.dateBucket === 'past'
              ? 'bg-zinc-100/80 text-zinc-700 border-zinc-200 dark:bg-zinc-800/80 dark:text-zinc-300'
              : session.dateBucket === 'today'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60'
              : 'bg-card text-foreground border-border dark:bg-zinc-900'
          )}
        >
          {/* Time & Slot */}
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>{timeDisplay}</span>
          </div>

          {/* Type & Special Status Badges */}
          <div className="flex items-center gap-1.5">
            {hasNewStudents && (
              <div
                title="Có học viên mới / học thử trong lớp"
                className="flex items-center justify-center p-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 shrink-0"
              >
                <UserPlus className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0 stroke-[2.8]" />
              </div>
            )}
            {session.isOpeningDay && (
              <span className="inline-flex items-center rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 uppercase tracking-wider border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800">
                Khai giảng
              </span>
            )}
            {session.typeLabel && session.typeLabel !== 'Chính thức' && !session.isOpeningDay && !subTeacher && (
              <span
                className={cn(
                  'inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-bold',
                  getStatusBadgeClass(session.type || 'class_session')
                )}
              >
                {session.typeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 space-y-2.5 text-xs">
          {/* Main Title & Class Code */}
          <div>
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              {classCode && (
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground border border-border/60">
                  {classCode}
                </span>
              )}
              <h4 className="font-bold text-sm text-foreground leading-tight">
                {className || title}
              </h4>
            </div>
            {title && className && title !== className && (
              <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                {title}
              </p>
            )}
          </div>

          {/* Subject & Level */}
          {(subject || level) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="font-medium text-foreground/90">
                {subject}
                {level && (
                  <>
                    {' - '}
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 underline">
                      {level}
                    </span>
                  </>
                )}
              </span>
            </div>
          )}

          {/* Room & Branch Location */}
          {locationDisplay && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
              <span className="font-medium text-foreground">{locationDisplay}</span>
            </div>
          )}

          {/* Detailed Staff Section for Class (Right-aligned Staff Info) */}
          <div className="border-t border-border/40 pt-2.5 space-y-1.5 text-[11px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Đội ngũ giảng dạy & Quản lý:
            </div>

            {/* Primary Staff / Teacher / Substitute Teacher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>GV:</span>
              </div>
              {!primaryTeacher || primaryTeacher === 'Chưa gán' ? (
                <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 px-2 py-0.5 rounded text-[11px]">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>Chưa gán GV</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  {subTeacher ? (
                    <div className="flex items-center gap-1.5">
                      {primaryTeacher && (
                        <span className="line-through text-muted-foreground">{primaryTeacher}</span>
                      )}
                      <AppAvatar name={subTeacher} size="xs" isSubstitute />
                      <span className="font-semibold text-foreground">{subTeacher}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <AppAvatar name={primaryTeacher} size="xs" />
                      <span className="font-semibold text-foreground">{primaryTeacher}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Teaching Assistant */}
            {taTeacher && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <UserCheck className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <span>TG:</span>
                </div>
                <div className="flex items-center gap-1">
                  <AppAvatar name={taTeacher} size="xs" />
                  <span className="font-semibold text-foreground">{taTeacher}</span>
                </div>
              </div>
            )}
          </div>

          {/* Students & Attendance */}
          {session.totalStudents !== undefined && (
            <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>
                  Sĩ số:{' '}
                  <strong className={cn("font-bold", session.type === 'digi_session' && session.capacity && session.totalStudents >= session.capacity ? "text-rose-600 dark:text-rose-400" : "text-foreground")}>
                    {session.type === 'digi_session'
                      ? `${session.totalStudents}/${session.capacity || 10} chỗ`
                      : session.attendedStudents !== undefined
                      ? `${session.attendedStudents}/${session.totalStudents} học viên`
                      : `${session.totalStudents} học viên`}
                  </strong>
                  {session.trialStudents && session.trialStudents > 0 ? (
                    <span className="text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-0.5 ml-1">
                      <UserPlus className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500 shrink-0 stroke-[2.2]" />
                      ({session.trialStudents} học thử)
                    </span>
                  ) : null}
                </span>
              </div>

              {session.type === 'digi_session' && session.capacity && session.totalStudents >= session.capacity ? (
                <span className="font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                  Hết chỗ
                </span>
              ) : session.attendedStudents !== undefined ? (
                <span className="font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Đã điểm danh
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="bg-muted/40 border-t border-border/60 px-3.5 py-1.5 text-[10px] text-muted-foreground flex items-center gap-1.5">
          <Info className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          <span>Nhấp vào thẻ để mở chi tiết & thao tác</span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
