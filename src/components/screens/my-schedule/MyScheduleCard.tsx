'use client'

import {
  BookOpen,
  Check,
  Clock,
  FileText,
  MapPin,
  UserPlus,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { parseScheduleTime } from '@/components/screens/schedule/ScheduleTimeGrid'
import { MyScheduleHoverCard } from './MyScheduleHoverCard'
import type { UnifiedSlot } from './myScheduleTypes'
import { getAssociatedBookingTest } from './myScheduleHelpers'
import { EventCard } from '@/components/screens/calendar/EventCard'
import type { EventSession } from '@/mocks/calendarSchedule'

interface MyScheduleCardProps {
  slot: UnifiedSlot
  compact?: boolean
  isOverlapped?: boolean
  showTime?: boolean
  onClick?: () => void
  activeBranch?: string
}

export function MyScheduleCard({
  slot,
  compact,
  isOverlapped,
  showTime = true,
  onClick,
  activeBranch = 'all',
}: MyScheduleCardProps) {
  const isClass = slot.scheduleType === 'class'
  const isCancelled = slot.status === 'cancelled'

  // Calculate duration to adjust layout responsiveness
  const startMin = slot.startMin
  const endMin = parseScheduleTime(slot.endTimeLabel) || (slot.startMin + 60)
  const duration = endMin - startMin
  const isShort = duration <= 30

  let bgClass = 'bg-card hover:bg-accent/60'
  if (isCancelled) {
    bgClass = 'bg-zinc-50/40 dark:bg-zinc-900/20 opacity-50 border border-zinc-200/40 dark:border-zinc-800/40 cursor-not-allowed select-none pointer-events-none'
  } else if (slot.isOpeningDay) {
    bgClass = 'bg-red-50 hover:bg-red-100/90 dark:bg-red-950/40 dark:hover:bg-red-950/60 border border-red-300 dark:border-red-800 shadow-xs'
  } else if (slot.substituteTeacher) {
    bgClass = 'bg-sky-50 hover:bg-sky-100/90 dark:bg-sky-950/40 dark:hover:bg-sky-950/60 border border-sky-300 dark:border-sky-800/80 shadow-xs'
  } else if (slot.dateBucket === 'past') {
    bgClass = 'bg-zinc-100/90 hover:bg-zinc-200/90 dark:bg-zinc-800/50 dark:hover:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60'
  } else if (slot.dateBucket === 'today') {
    bgClass = 'bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 shadow-xs'
  } else if (slot.dateBucket === 'upcoming') {
    bgClass = 'bg-card hover:bg-accent/60 border border-border dark:border-zinc-800/60 shadow-xs'
  }

  const booking = slot.type === 'placement_test' ? getAssociatedBookingTest(slot) : null

  if (booking) {
    const mappedSession: EventSession = {
      id: slot.id,
      title: slot.title,
      description: slot.note || '',
      date: slot.date,
      dateDisplay: '',
      dateBucket: slot.dateBucket,
      timeLabel: slot.timeLabel,
      endTimeLabel: slot.endTimeLabel,
      branch: slot.branch,
      organizer: slot.personLabel,
      type: 'placement_test',
      typeLabel: slot.typeLabel,
      status: (slot.status || 'scheduled') as EventSession['status'],
      statusLabel: '',
      participants: 0,
      maxParticipants: 0,
      location: slot.subtitle || '',
      note: slot.note || '',
      subject: slot.subject,
    }

    return (
      <MyScheduleHoverCard slot={slot}>
        <EventCard
          session={mappedSession}
          onClick={onClick || (() => {})}
          activeBranch={activeBranch}
          isOverlapped={isOverlapped}
        />
      </MyScheduleHoverCard>
    )
  }

  const newStudentsCount = slot.trialStudents || 0
  const hasNewStudents = newStudentsCount > 0

  return (
    <MyScheduleHoverCard slot={slot}>
      <div
        className={cn(
          'group relative flex min-h-[58px] flex-col overflow-hidden rounded-md text-left shadow-sm transition hover:shadow-md hover:ring-1 hover:ring-primary/40',
          compact ? (slot.isOpeningDay || slot.substituteTeacher ? 'h-full py-2 pr-2 pl-3.5' : 'h-full p-2') : '',
          isOverlapped && 'min-h-[52px]',
          bgClass,
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        {slot.isOpeningDay && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
        )}
        {slot.substituteTeacher && !slot.isOpeningDay && (
          <span className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500" />
        )}
        <div className={compact ? '' : cn('p-3', (slot.isOpeningDay || slot.substituteTeacher) && 'pl-4.5')}>
          {/* Time Bar (If enabled) */}
          {showTime && (
            <div className="mb-1 flex items-center gap-1 min-w-0">
              <div
                className={cn(
                  'flex min-w-0 items-center gap-1 font-bold text-primary',
                  compact ? 'text-[9px]' : 'text-[11px]',
                  isCancelled && 'text-muted-foreground'
                )}
              >
                <Clock className={cn(compact ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0')} />
                <span className="truncate">
                  {compact ? `${slot.timeLabel}-${slot.endTimeLabel}` : `${slot.timeLabel} - ${slot.endTimeLabel}`}
                </span>
              </div>
            </div>
          )}

          {/* Title & Icon học viên mới nằm CÙNG HÀNG */}
          <div className="mb-1 flex items-start justify-between gap-1.5 w-full min-w-0">
            <h4
              className={cn(
                'font-bold leading-tight flex-1 min-w-0 truncate',
                compact ? 'text-[10.5px]' : 'text-[13px]',
                isCancelled && 'line-through text-muted-foreground'
              )}
              title={slot.title}
            >
              {slot.title}
            </h4>

            <div className="flex items-center gap-1 shrink-0 ml-0.5 mt-0.5">
              {slot.type === 'placement_test' && (
                <span className={cn('inline-block shrink-0 rounded border px-1 py-0.5 text-[8px] font-semibold', getStatusBadgeClass(slot.type))}>
                  {slot.typeLabel}
                </span>
              )}
              {/* Icon người có dấu cộng cho học viên mới - CÙNG HÀNG với Title tên bài học */}
              {hasNewStudents && (
                <div
                  className="flex items-center justify-center p-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 shrink-0"
                  title={`Có ${newStudentsCount} học viên mới / học thử trong lớp`}
                >
                  <UserPlus className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
              )}
            </div>
          </div>

          {/* Class Code, Subject, Level, and Badges Line */}
          {isClass ? (
            <div className="mt-1 flex items-center gap-x-1.5 min-w-0 w-full overflow-hidden whitespace-nowrap">
              {slot.classCode && (
                <span className="text-[9px] font-bold text-foreground shrink-0">
                  {slot.classCode}
                </span>
              )}
              {slot.subject && (
                <span className="text-[9px] text-muted-foreground font-medium truncate flex-1 min-w-0" title={`${slot.subject} - ${slot.level}`}>
                  {slot.subject} - {slot.level}
                </span>
              )}
              {slot.isOpeningDay && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800 shrink-0">
                  Khai giảng
                </span>
              )}
            </div>
          ) : (
            slot.isOpeningDay && (
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[7.5px] font-bold uppercase tracking-wider text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800 shrink-0">
                  Khai giảng
                </span>
              </div>
            )
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

                {/* Student Count (với tích V nếu đã hoàn thành điểm danh) & Substitute Teacher */}
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  {isClass && slot.totalStudents !== undefined ? (
                    <div className="flex items-center gap-1 text-[8.5px] truncate">
                      {/* Dấu tích V cho những lớp đã hoàn thành điểm danh */}
                      {slot.attendedStudents !== undefined && (
                        <span
                          title="Đã hoàn thành điểm danh"
                          className="inline-flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 p-0.5 shrink-0"
                        >
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}
                      <Users className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate">
                        {slot.attendedStudents !== undefined
                          ? `${slot.attendedStudents}/${slot.totalStudents} HS`
                          : `${slot.totalStudents} HS`}
                      </span>
                    </div>
                  ) : (
                    <div />
                  )}

                  {slot.substituteTeacher && (
                    <span className="text-[8.5px] font-bold text-sky-700 dark:text-sky-400 shrink-0 truncate" title={`Dạy thay: ${slot.substituteTeacher}`}>
                      Dạy thay: {slot.substituteTeacher}
                    </span>
                  )}
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
                  <div className="flex items-center gap-1 text-[10px]">
                    {/* Dấu tích V cho những lớp đã hoàn thành điểm danh */}
                    {slot.attendedStudents !== undefined && (
                      <span
                        title="Đã hoàn thành điểm danh"
                        className="inline-flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 p-0.5 shrink-0 mr-0.5"
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {slot.attendedStudents !== undefined
                        ? `${slot.attendedStudents}/${slot.totalStudents} HS`
                        : `${slot.totalStudents} HS`}
                    </span>
                  </div>
                ) : (
                  <div />
                )}

                {slot.substituteTeacher && (
                  <span className="text-[9px] font-bold text-sky-700 dark:text-sky-400">
                    Dạy thay: {slot.substituteTeacher}
                  </span>
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
    </MyScheduleHoverCard>
  )
}
