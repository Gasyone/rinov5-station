'use client'

import {
  ArrowLeftRight,
  BookOpen,
  Clock,
  FileText,
  MapPin,
  Repeat,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { parseScheduleTime } from '@/components/screens/schedule/ScheduleTimeGrid'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { UnifiedSlot } from './myScheduleTypes'

interface MyScheduleCardProps {
  slot: UnifiedSlot
  compact?: boolean
  isOverlapped?: boolean
  showTime?: boolean
  onClick?: () => void
}

const lineClamp2 = 'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]'

export function MyScheduleCard({
  slot,
  compact,
  isOverlapped,
  showTime = true,
  onClick,
}: MyScheduleCardProps) {
  const isClass = slot.scheduleType === 'class'
  const initials = getInitial(slot.personLabel)
  const substituteInitials = slot.substituteTeacher ? getInitial(slot.substituteTeacher) : ''
  const isCancelled = slot.status === 'cancelled'

  // Calculate duration to adjust layout responsiveness
  const startMin = slot.startMin
  const endMin = parseScheduleTime(slot.endTimeLabel) || (slot.startMin + 60)
  const duration = endMin - startMin
  const isShort = duration <= 30

  let bgClass = 'bg-card hover:bg-accent/60'
  if (isCancelled) {
    bgClass = 'bg-zinc-50 dark:bg-zinc-900/50 opacity-75 hover:bg-zinc-100'
  } else if (slot.isOpeningDay) {
    bgClass = 'bg-gradient-to-br from-emerald-50 via-emerald-50/70 to-teal-50/50 hover:from-emerald-100 hover:to-teal-100 dark:from-emerald-950/30 dark:via-emerald-950/20 dark:to-teal-950/10 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
  } else if (slot.substituteTeacher) {
    bgClass = 'bg-violet-100/80 hover:bg-violet-200/50 dark:bg-violet-950/40 dark:hover:bg-violet-950/60 border border-violet-300 dark:border-violet-700 shadow-sm'
  } else if (slot.dateBucket === 'past') {
    bgClass = 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50'
  } else if (slot.dateBucket === 'upcoming') {
    bgClass = 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-950/50'
  }

  return (
    <div
      className={cn(
        'group relative flex min-h-[58px] flex-col overflow-hidden rounded-md text-left shadow-sm transition',
        compact ? (slot.isOpeningDay ? 'h-full py-2 pr-2 pl-3.5' : 'h-full p-2') : '',
        isOverlapped && 'min-h-[52px]',
        bgClass,
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {slot.isOpeningDay && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
      )}
      <div className={compact ? '' : cn('p-3', slot.isOpeningDay && 'pl-4.5')}>
        {/* Top bar: Time */}
        <div className="mb-1 flex items-center gap-1.5 flex-wrap justify-between w-full">
          <div className="flex items-center gap-1 min-w-0">
            {showTime && (
              <div
                className={cn(
                  'flex min-w-0 items-center gap-1 font-bold text-primary',
                  compact ? 'text-[9px]' : 'text-[11px]',
                  isCancelled && 'text-muted-foreground'
                )}
              >
                {slot.status === 'rescheduled' ? (
                  <span title={slot.scheduleType === 'class' ? "Đổi ngày học" : "Đổi ngày sự kiện"} className="shrink-0 flex items-center">
                    <ArrowLeftRight className={cn('text-amber-600 dark:text-amber-400', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
                  </span>
                ) : slot.isRecurring ? (
                  <span title={slot.scheduleType === 'class' ? "Lớp học lặp lại" : "Sự kiện lặp lại"} className="shrink-0 flex items-center">
                    <Repeat className={cn('text-primary/70', compact ? 'h-3 w-3' : 'h-3.5 w-3.5')} />
                  </span>
                ) : (
                  <Clock className={cn(compact ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0')} />
                )}
                <span className="truncate">
                  {compact ? `${slot.timeLabel}-${slot.endTimeLabel}` : `${slot.timeLabel} - ${slot.endTimeLabel}`}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {slot.typeLabel && (
              <span className={cn(
                'inline-block shrink-0 rounded border px-1 py-0.5 text-[8.5px] font-bold',
                slot.type === 'workshop'
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : slot.type === 'supplementary'
                  ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                  : slot.type === 'class_session'
                  ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800'
                  : slot.type === 'event'
                  ? 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                  : getStatusBadgeClass(slot.type)
              )}>
                {slot.typeLabel}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h4
          className={cn(
            'font-bold leading-tight mb-1',
            compact ? `text-[10.5px] ${lineClamp2}` : 'truncate text-[13px]',
            isCancelled && 'line-through text-muted-foreground'
          )}
        >
          {slot.title}
        </h4>

        {/* Class Code & Level Badges */}
        {((isClass && (slot.classCode || slot.level)) || slot.isOpeningDay) && (
          <div className="mb-1 flex flex-wrap gap-1">
            {isClass && slot.classCode && (
              <span className="inline-flex items-center rounded bg-muted/60 px-1 py-0.5 text-[8px] font-medium text-foreground/80 border border-border/40 shrink-0">
                {slot.classCode}
              </span>
            )}
            {isClass && slot.level && (
              <span className="inline-flex items-center rounded bg-primary/10 px-1 py-0.5 text-[8px] font-medium text-primary border border-primary/20 shrink-0">
                {slot.level}
              </span>
            )}
            {slot.isOpeningDay && (
              <span className="inline-flex animate-pulse items-center rounded-full bg-emerald-500 px-1 py-0.5 text-[7.5px] font-black uppercase tracking-wider text-emerald-950 border border-emerald-600 dark:bg-emerald-600 dark:text-emerald-50 shrink-0">
                Khai giảng
              </span>
            )}
          </div>
        )}

        {/* Dynamic Supporting Lines */}
        {compact ? (
          /* Compact view layout (within grid columns) */
          isShort ? (
            /* Very short slot (e.g. 30 mins) - only 1 small meta line */
            <div className="flex items-center gap-1 text-[8.5px] text-muted-foreground truncate">
              {isClass ? (
                <BookOpen className="h-2.5 w-2.5 shrink-0" />
              ) : (
                <MapPin className="h-2.5 w-2.5 shrink-0" />
              )}
              <span className="truncate">{slot.subtitle}</span>
              {slot.branch && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="truncate">{slot.branch}</span>
                </>
              )}
            </div>
          ) : (
            /* Regular compact slot (60 mins+) - multiple small lines stacked */
            <div className="space-y-1 text-[9px] text-muted-foreground">
              {/* Room & Branch */}
              <div className="flex items-center gap-1 truncate">
                {isClass ? (
                  <BookOpen className="h-2.5 w-2.5 shrink-0" />
                ) : (
                  <MapPin className="h-2.5 w-2.5 shrink-0" />
                )}
                <span className="truncate">{slot.subtitle}</span>
                {slot.branch && (
                  <>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="truncate">{slot.branch}</span>
                  </>
                )}
              </div>

              {/* Student Count & Teacher */}
              <div className="flex items-center justify-between gap-1 mt-0.5">
                {isClass && slot.totalStudents !== undefined ? (
                  <div className="flex items-center gap-0.5 text-[8.5px] truncate">
                    <Users className="h-2.5 w-2.5 shrink-0" />
                    <span className="truncate">
                      {slot.attendedStudents !== undefined
                        ? `${slot.attendedStudents}/${slot.totalStudents} HS`
                        : `${slot.totalStudents} HS`}
                      {slot.trialStudents ? ` (${slot.trialStudents} thử)` : ''}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-1 text-[8.5px] shrink-0 font-medium">
                  {slot.substituteTeacher ? (
                    <div className="flex -space-x-1 shrink-0" title={`Dạy thay: ${slot.substituteTeacher} (Chính: ${slot.personLabel})`}>
                      <Avatar className="h-4 w-4 border border-background shadow-xs shrink-0">
                        <AvatarFallback
                          className="text-[7px] font-bold"
                          style={{
                            backgroundColor: getTeacherColor(slot.personLabel),
                            color: getTeacherTextColor(slot.personLabel)
                          }}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <Avatar className="h-4 w-4 border border-violet-200 shadow-xs relative z-10 shrink-0">
                        <AvatarFallback
                          className="text-[7px] font-bold bg-violet-100 text-violet-700 border border-violet-200"
                        >
                          {substituteInitials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <Avatar className="h-4 w-4 border border-background shadow-xs shrink-0">
                      <AvatarFallback
                        className="text-[7px] font-bold"
                        style={{
                          backgroundColor: getTeacherColor(slot.personLabel),
                          color: getTeacherTextColor(slot.personLabel)
                        }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  )}

                </div>
              </div>
              {slot.note && (
                <div className="flex items-start gap-1 text-[8.5px] text-muted-foreground/90 mt-1 border-t border-border/20 pt-0.5">
                  <FileText className="h-2.5 w-2.5 shrink-0 mt-0.5 text-muted-foreground/60" />
                  <span className="line-clamp-1 italic truncate" title={slot.note}>
                    {slot.note}
                  </span>
                </div>
              )}
            </div>
          )
        ) : (
          /* Full expanded view layout */
          <div className="mt-1.5 space-y-1 text-[10px] text-muted-foreground">
            <div className="flex min-w-0 items-center gap-1.5">
              {isClass ? (
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <MapPin className="h-3.5 w-3.5 shrink-0" />
              )}
              <span className="truncate">{slot.subtitle} {slot.branch ? `• ${slot.branch}` : ''}</span>
            </div>

            <div className="flex items-center justify-between mt-1">
              {isClass && slot.totalStudents !== undefined ? (
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {slot.attendedStudents !== undefined
                      ? `${slot.attendedStudents}/${slot.totalStudents} HS (${slot.trialStudents} học thử)`
                      : `${slot.totalStudents} HS (${slot.trialStudents} học thử)`}
                  </span>
                </div>
              ) : (
                <div />
              )}

              {slot.substituteTeacher ? (
                <div className="flex -space-x-1.5" title={`Dạy thay: ${slot.substituteTeacher} (Chính: ${slot.personLabel})`}>
                  <Avatar className="h-5 w-5 border border-background shadow-xs shrink-0">
                    <AvatarFallback
                      className="text-[8px] font-bold uppercase opacity-60"
                      style={{
                        backgroundColor: getTeacherColor(slot.personLabel),
                        color: getTeacherTextColor(slot.personLabel)
                      }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="h-5 w-5 border border-violet-200 shadow-xs relative z-10 shrink-0">
                    <AvatarFallback
                      className="text-[8px] font-bold uppercase bg-violet-100 text-violet-700 border border-violet-200"
                    >
                      {substituteInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <Avatar className="h-5 w-5 border border-background shadow-xs shrink-0">
                  <AvatarFallback
                    className="text-[8.5px] font-bold uppercase"
                    style={{
                      backgroundColor: getTeacherColor(slot.personLabel),
                      color: getTeacherTextColor(slot.personLabel)
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            {slot.note && (
              <div className="flex items-start gap-1.5 text-[9px] text-muted-foreground/90 mt-1.5 border-t border-border/20 pt-1">
                <FileText className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground/60" />
                <span className="line-clamp-2 italic" title={slot.note}>
                  {slot.note}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function getInitial(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function getTeacherColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = Math.abs(hash) % 360
  return `hsl(${h}, 75%, 93%)`
}

function getTeacherTextColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const h = Math.abs(hash) % 360
  return `hsl(${h}, 80%, 30%)`
}
