'use client'

import { ArrowLeftRight, Clock, Repeat, Users, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PersonnelHoverCard } from '@/components/shared'
import { SessionHoverCard } from './SessionHoverCard'
import type { ClassSession } from '@/mocks/calendarSchedule'

const getInitial = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

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

export function SessionCard({ session, onClick }: { session: ClassSession; onClick: () => void }) {
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
  
  let bgClass = 'bg-card hover:bg-accent/60'
  let borderLeftColor = ''

  if (isCancelled) {
    bgClass = 'bg-zinc-50/40 dark:bg-zinc-900/20 opacity-50 border border-zinc-200/40 dark:border-zinc-800/40 cursor-not-allowed select-none pointer-events-none'
  } else if (session.isOpeningDay) {
    bgClass = 'bg-red-50/80 hover:bg-red-100/80 dark:bg-red-950/30 dark:hover:bg-red-950/50 border border-red-300 dark:border-red-800 shadow-sm'
    borderLeftColor = 'bg-red-500'
  } else if (session.substituteTeacher && session.type !== 'digi_session') {
    bgClass = 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-950/50 border border-sky-200 dark:border-sky-800/60 shadow-xs'
    borderLeftColor = 'bg-sky-500'
  } else if (session.dateBucket === 'today') {
    bgClass = 'bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 shadow-xs'
    borderLeftColor = 'bg-emerald-500'
  } else if (session.dateBucket === 'upcoming') {
    bgClass = 'bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-border/80 dark:border-zinc-800 shadow-xs'
  } else if (session.dateBucket === 'past' || session.status === 'completed') {
    bgClass = 'bg-zinc-50/70 hover:bg-zinc-100/70 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500'
    borderLeftColor = 'bg-zinc-300 dark:bg-zinc-600'
  }

  return (
    <SessionHoverCard session={session}>
      <div
        onClick={onClick}
        className={cn("group relative flex min-h-[76px] flex-col overflow-hidden rounded-md text-left shadow-sm transition cursor-pointer hover:shadow-md hover:ring-1 hover:ring-primary/40", bgClass)}
      >
      {borderLeftColor && (
        <span className={cn("absolute left-0 top-0 bottom-0 w-1", borderLeftColor)} />
      )}
      <div className={cn("p-2.5", Boolean(borderLeftColor) && "pl-3.5")}>
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold",
            session.dateBucket === 'today' ? "text-emerald-700 dark:text-emerald-300" : "text-primary",
            isCancelled && "text-muted-foreground"
          )}>
            {session.status === 'rescheduled' ? (
              <span title="Đổi ngày học" className="shrink-0 flex items-center">
                <ArrowLeftRight className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              </span>
            ) : session.isRecurring ? (
              <span title="Lớp học lặp lại" className="shrink-0 flex items-center">
                <Repeat className="h-3 w-3 text-primary/70" />
              </span>
            ) : (
              <Clock className="h-3 w-3 shrink-0" />
            )}
            {session.timeLabel}
          </div>
          <div className="flex items-center gap-1">
            {isFull && (
              <span
                title="Ca học đã đầy chỗ"
                className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[8px] font-bold bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800 shrink-0"
              >
                <AlertTriangle className="h-2.5 w-2.5 text-rose-600 dark:text-rose-400 shrink-0" />
                Hết chỗ
              </span>
            )}
            {session.typeLabel && session.typeLabel !== 'Chính thức' && session.type !== 'digi_session' && session.typeLabel !== 'Ca tự học Digi' && (
              <span className={cn(
                "inline-flex items-center rounded px-1 py-0.5 text-[8px] font-bold border shrink-0",
                session.type === 'workshop'
                  ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                  : session.type === 'supplementary'
                  ? "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                  : "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800"
              )}>
                {session.typeLabel}
              </span>
            )}
          </div>
        </div>
        <h4 className={cn('text-[11px] font-bold leading-tight block truncate', isCancelled && 'line-through text-muted-foreground')} title={`${session.classCode} - ${session.className}`}>
          {session.type === 'digi_session' ? session.className : `${session.classCode} - ${session.className}`}
        </h4>
        <div className="mt-1 flex items-center gap-x-1 min-w-0 w-full overflow-hidden whitespace-nowrap">
          <span className="text-[9px] text-muted-foreground font-medium truncate flex-1 min-w-0" title={session.branch}>
            {session.branch}
          </span>
          {session.type !== 'digi_session' && (
            <>
              <span className="text-muted-foreground text-[8px] shrink-0">•</span>
              <span className="inline-flex items-center rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50 px-1 py-0.5 text-[8.5px] font-bold shrink-0" title={session.schoolRoom}>
                {session.schoolRoom}
              </span>
            </>
          )}
          {session.isOpeningDay && (
            <span className="inline-flex items-center rounded-full bg-red-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800 shrink-0">
              Khai giảng
            </span>
          )}
        </div>
        <div className="mt-2 space-y-0.5 text-[9px] text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 shrink-0 text-foreground/80" />
              <span className={cn("text-[9.5px] font-bold", isFull ? "text-rose-600 dark:text-rose-400" : "text-foreground")}>
                {session.type === 'digi_session'
                  ? `${session.totalStudents}/${session.roomCapacity || 8} chỗ`
                  : `${session.attendedStudents !== undefined 
                      ? `${session.attendedStudents}/${session.totalStudents} HS`
                      : `${session.totalStudents} HS`}`}
                {session.type !== 'digi_session' && session.trialStudents > 0 && (
                  <span className="text-violet-600 dark:text-violet-400 font-semibold ml-1">
                    ({session.trialStudents} học thử)
                  </span>
                )}
              </span>
            </div>
            {!activeTeacher || activeTeacher === 'Chưa gán' ? (
              <div className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 px-1.5 py-0.5 rounded text-[8.5px] shrink-0" title="Chưa gán giáo viên">
                <AlertTriangle className="h-2.5 w-2.5 text-amber-500 shrink-0" />
                <span>Chưa gán GV</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0 max-w-[50%]" onClick={(e) => e.stopPropagation()}>
                <PersonnelHoverCard person={getTeacherPersonnel(activeTeacher)} align="end">
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold shrink-0 cursor-pointer",
                    session.substituteTeacher
                      ? "border-amber-200 bg-amber-100 text-amber-700"
                      : "border-border bg-muted text-muted-foreground"
                  )} title={session.substituteTeacher ? `Dạy thay: ${session.substituteTeacher} (Chính: ${session.teacher})` : activeTeacher}>
                    {activeInitials}
                  </div>
                </PersonnelHoverCard>
                <span className="text-[9.5px] text-muted-foreground font-medium truncate" title={activeTeacher}>
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
