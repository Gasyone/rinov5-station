'use client'

import { useMemo } from 'react'
import { Users, AlertTriangle, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PersonnelHoverCard } from '@/components/shared'
import { SessionHoverCard } from './SessionHoverCard'
import type { ClassSession } from '@/mocks/calendarSchedule'

const getInitial = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

const STUDENT_AVATAR_COLORS = [
  'bg-sky-100 text-sky-700 border-sky-300 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-700',
  'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-700',
  'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-700',
  'bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-700',
  'bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-700',
  'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-700',
  'bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-950/70 dark:text-teal-300 dark:border-teal-700',
]

function getStudentInitials(fullName: string): string {
  if (!fullName) return 'HV'
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  const first = parts[0][0]
  const last = parts[parts.length - 1][0]
  return (first + last).toUpperCase()
}

const getTeacherPersonnel = (name: string) => {
  const detailsMap: Record<string, { role: string; phone: string; email: string }> = {
    'Thu Hà': { role: 'Giáo viên Tiếng Anh', phone: '0912345678', email: 'ha.nt@rinoedu.edu.vn' },
    'Mỹ Linh': { role: 'Giáo viên Toán tư duy', phone: '0987654321', email: 'linh.pm@rinoedu.edu.vn' },
    'Coenrad Redman': { role: 'Giáo viên nước ngoài', phone: '0909123456', email: 'coenrad.r@rinoedu.edu.vn' },
    'Hương Ly': { role: 'Giáo viên dạy thay', phone: '0911223344', email: 'ly.lh@rinoedu.edu.vn' },
    'Thanh Bình': { role: 'Giáo viên dạy thay', phone: '0922334455', email: 'binh.nt@rinoedu.edu.vn' },
    'David John': { role: 'Giáo viên nước ngoài (Dạy thay)', phone: '0933445566', email: 'david.j@rinoedu.edu.vn' },
    'Nguyễn Thu Hà': { role: 'Trợ giảng', phone: '0912345678', email: 'ha.nt@rinoedu.edu.vn' },
    'Trần Minh Châu': { role: 'Trợ giảng', phone: '0923456789', email: 'chau.tm@rinoedu.edu.vn' },
    'Lê Hoàng Nam': { role: 'Trợ giảng', phone: '0934567890', email: 'nam.lh@rinoedu.edu.vn' },
    'Phạm Minh Trang': { role: 'Trợ giảng', phone: '0945678901', email: 'trang.pm@rinoedu.edu.vn' },
    'Vũ Hải Đăng': { role: 'Trợ giảng', phone: '0956789012', email: 'dang.vh@rinoedu.edu.vn' },
  }
  const details = detailsMap[name] || {
    role: 'Giáo viên',
    phone: '0909999999',
    email: `${name.toLowerCase().replace(/\s+/g, '')}@rinoedu.edu.vn`,
  }
  return {
    id: `EMP-${name.split(' ').map((n) => n[0]).join('').toUpperCase()}`,
    name,
    role: details.role,
    phone: details.phone,
    email: details.email,
  }
}

export function SessionCard({
  session,
  onClick,
  className,
}: {
  session: ClassSession
  onClick: () => void
  hideBranch?: boolean
  className?: string
}) {
  // For digi sessions, show the assistantTeacher name instead of the generic teacher label
  const displayTeacher = session.type === 'digi_session' && session.assistantTeacher
    ? session.assistantTeacher
    : session.teacher

  const initials = getInitial(displayTeacher)
  const substituteInitials = session.substituteTeacher ? getInitial(session.substituteTeacher) : ''
  
  const activeTeacher = session.substituteTeacher || displayTeacher
  const activeInitials = session.substituteTeacher ? substituteInitials : initials
  
  const isCancelled = session.status === 'cancelled'
  const isFull = Boolean(
    session.type === 'digi_session' &&
    session.totalStudents !== undefined &&
    session.roomCapacity !== undefined &&
    session.totalStudents >= session.roomCapacity
  )
  
  const trialCount = session.trialStudents || 0
  const makeUpCount = session.makeUpStudents || 0
  const newStudentsCount = trialCount + makeUpCount

  const isPast = useMemo(() => {
    if (session.status === 'completed' || session.dateBucket === 'past') return true
    if (session.date) {
      const now = new Date()
      const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      return session.date < todayKey
    }
    return false
  }, [session.dateBucket, session.status, session.date])

  const isToday = useMemo(() => {
    if (session.dateBucket === 'today') return true
    if (session.date) {
      const now = new Date()
      const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
      return session.date === todayKey
    }
    return false
  }, [session.dateBucket, session.date])
  
  let bgClass = 'bg-card hover:bg-accent/60'
  let borderLeftColor = ''

  if (isCancelled) {
    bgClass = 'bg-zinc-100/50 dark:bg-zinc-900/30 opacity-60 border border-zinc-200/50 dark:border-zinc-800/50 cursor-not-allowed select-none pointer-events-none'
  } else if (isPast) {
    bgClass = 'bg-zinc-100 hover:bg-zinc-200/70 dark:bg-zinc-800/70 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 shadow-2xs'
    borderLeftColor = session.substituteTeacher ? 'bg-sky-400' : session.isOpeningDay ? 'bg-red-400' : 'bg-zinc-400 dark:bg-zinc-500'
  } else if (session.isOpeningDay) {
    bgClass = 'bg-red-50/80 hover:bg-red-100/80 dark:bg-red-950/30 dark:hover:bg-red-950/50 border border-red-300 dark:border-red-800 shadow-sm'
    borderLeftColor = 'bg-red-500'
  } else if (session.substituteTeacher && session.type !== 'digi_session') {
    bgClass = 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 shadow-xs'
    borderLeftColor = 'bg-sky-500'
  } else if (isToday) {
    bgClass = 'bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-xs'
    borderLeftColor = 'bg-emerald-500'
  } else {
    // upcoming / default
    bgClass = 'bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-border/80 dark:border-zinc-800 shadow-xs'
  }

  const timeDisplay = session.endTimeLabel ? `${session.timeLabel} - ${session.endTimeLabel}` : session.timeLabel

  const timeColorClass = isCancelled
    ? 'text-zinc-400 line-through dark:text-zinc-500'
    : isPast
    ? 'text-zinc-500 dark:text-zinc-400'
    : 'text-blue-600 dark:text-blue-400'

  return (
    <SessionHoverCard session={session}>
      <div
        onClick={onClick}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-md text-left shadow-2xs transition cursor-pointer hover:shadow-md hover:ring-1 hover:ring-primary/40",
          bgClass,
          className
        )}
      >
      {borderLeftColor && (
        <span className={cn("absolute left-0 top-0 bottom-0 w-1", borderLeftColor)} />
      )}
      <div className={cn("p-1.5 flex flex-col h-full justify-between flex-1", Boolean(borderLeftColor) && "pl-2")}>
        <div>
          <div className="mb-0.5 flex items-center justify-between gap-1">
            <span className={cn(
              "text-[11px] font-medium tracking-tight shrink-0",
              timeColorClass
            )}>
              {timeDisplay}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {newStudentsCount > 0 && (
                <div
                  title={`Có ${newStudentsCount} học sinh thêm mới${
                    trialCount > 0 && makeUpCount > 0
                      ? ` (${trialCount} học thử, ${makeUpCount} học bù)`
                      : trialCount > 0
                      ? ` (${trialCount} học thử)`
                      : ` (${makeUpCount} học bù)`
                  }`}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shrink-0"
                >
                  <UserPlus className="h-2.5 w-2.5 shrink-0 stroke-[2.2]" />
                </div>
              )}
              {isFull && (
                <span
                  title="Ca học đã đầy chỗ"
                  className="inline-flex items-center gap-0.5 rounded px-1 text-[9px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800 shrink-0"
                >
                  <AlertTriangle className="h-2.5 w-2.5 text-rose-600 dark:text-rose-400 shrink-0" />
                  Hết chỗ
                </span>
              )}
            </div>
          </div>

          {/* Dòng 2: Danh sách Avatar Học viên trong ca (thay thế dòng chữ trùng lặp) */}
          {session.type === 'digi_session' ? (
            <div className="my-1 flex flex-col justify-center flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-wider">
                  Học viên ({session.studentList?.length || session.totalStudents || 0})
                </span>
                {session.status === 'completed' ? (
                  <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800/80 px-1 py-0.2 rounded">
                    Đã học
                  </span>
                ) : session.dateBucket === 'today' ? (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                    Đang học
                  </span>
                ) : null}
              </div>

              {/* Student Avatars List */}
              <div className="flex items-center flex-wrap gap-1">
                {(session.studentList || []).slice(0, 5).map((student, sIdx) => {
                  const initials = getStudentInitials(student.name)
                  const colorClass = STUDENT_AVATAR_COLORS[sIdx % STUDENT_AVATAR_COLORS.length]
                  const tooltipText = `${student.name}${student.englishName ? ` (${student.englishName})` : ''}`

                  return (
                    <div
                      key={student.id || sIdx}
                      title={tooltipText}
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border text-[8.5px] font-bold shadow-2xs transition-transform hover:scale-110 cursor-pointer shrink-0',
                        colorClass
                      )}
                    >
                      {initials}
                    </div>
                  )
                })}

                {(session.studentList?.length || 0) > 5 && (
                  <div
                    title={`Còn lại: ${(session.studentList || [])
                      .slice(5)
                      .map((s) => s.name)
                      .join(', ')}`}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[8px] font-bold text-muted-foreground shadow-2xs hover:scale-105 shrink-0"
                  >
                    +{(session.studentList?.length || 0) - 5}
                  </div>
                )}

                {(!session.studentList || session.studentList.length === 0) && (
                  <span className="text-[9px] text-muted-foreground/60 italic">
                    Chưa có học viên
                  </span>
                )}
              </div>
            </div>
          ) : (
            <>
              <h4
                className={cn(
                  'text-xs font-semibold leading-tight block truncate',
                  isCancelled
                    ? 'line-through text-muted-foreground'
                    : isPast
                    ? 'text-zinc-700 dark:text-zinc-300'
                    : 'text-foreground'
                )}
                title={session.title || session.kctName || session.className}
              >
                {session.title || session.kctName || session.className}
              </h4>

              {/* Dòng 3: Mã lớp - Trình độ ở cạnh phải */}
              <div className="mt-0.5 flex items-center justify-between gap-1 text-[11px] min-w-0">
                <span
                  className="truncate flex-1 min-w-0 font-normal text-muted-foreground"
                  title={session.classCode || ''}
                >
                  {session.classCode}
                </span>
                {session.level && (
                  <span
                    className="font-medium text-foreground/75 shrink-0 text-[11px]"
                    title={`Trình độ: ${session.level}`}
                  >
                    {session.level}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer: Sĩ số & Giáo viên / Trợ giảng */}
        <div className="mt-1 pt-1 space-y-0.5 text-[11px] text-muted-foreground border-t border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-2.5 w-2.5 shrink-0 text-foreground/70" />
              <span className={cn("text-[11px] font-medium", isFull ? "text-rose-600 dark:text-rose-400 font-bold" : "text-foreground")}>
                {session.type === 'digi_session' ? (
                  `${session.totalStudents}/${session.roomCapacity || 15} chỗ`
                ) : session.attendedStudents !== undefined ? (
                  <>
                    <span>{session.attendedStudents}/{session.totalStudents}</span>
                    {newStudentsCount > 0 && (
                      <span className="text-amber-600 dark:text-amber-400 font-bold ml-0.5">
                        (+{newStudentsCount})
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span>{session.totalStudents}</span>
                    {newStudentsCount > 0 && (
                      <span className="text-amber-600 dark:text-amber-400 font-bold ml-0.5">
                        (+{newStudentsCount})
                      </span>
                    )}
                  </>
                )}
              </span>
            </div>
            {!activeTeacher || activeTeacher === 'Chưa gán' ? (
              <div className="flex items-center gap-0.5 text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 px-1 py-0.2 rounded text-[8px] shrink-0" title="Chưa gán giáo viên">
                <AlertTriangle className="h-2 w-2 text-amber-500 shrink-0" />
                <span>Chưa gán GV</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 min-w-0 max-w-[55%]" onClick={(e) => e.stopPropagation()}>
                <PersonnelHoverCard person={getTeacherPersonnel(activeTeacher)} align="end">
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border text-[9.5px] font-bold shrink-0 cursor-pointer",
                    session.substituteTeacher
                      ? "border-amber-200 bg-amber-100 text-amber-700"
                      : "border-border bg-muted text-muted-foreground"
                  )} title={session.substituteTeacher ? `Dạy thay: ${session.substituteTeacher} (Chính: ${session.teacher})` : activeTeacher}>
                    {activeInitials}
                  </div>
                </PersonnelHoverCard>
                <span className="text-[11px] text-muted-foreground font-normal truncate" title={activeTeacher}>
                  {activeTeacher}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </SessionHoverCard>
  )
}
