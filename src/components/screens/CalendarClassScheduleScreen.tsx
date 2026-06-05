'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Clock, Users, Repeat, CalendarClock } from 'lucide-react'
import { BranchSelect, ExpandableSearch, FilterIconButton, IconActionButton, SegmentedControl, SYSTEM_BRANCHES } from '@/components/controls'
import { FilterSheetPanel, type FilterSection } from '@/components/filters'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { getMockClassSessions, type ClassSession } from '@/mocks/calendarSchedule'
import { cn } from '@/lib/utils'
import { SessionDetailDialog } from './calendar/SessionDetailDialog'

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

const formatLabel = (date: Date, opts: Intl.DateTimeFormatOptions) => date.toLocaleDateString('vi-VN', opts)
const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const getMonday = (input: Date) => {
  const date = new Date(input)
  const day = date.getDay()
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  date.setHours(0, 0, 0, 0)
  return date
}
const getWeekDays = (from: Date) =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from)
    date.setDate(date.getDate() + index)
    date.setHours(0, 0, 0, 0)
    return date
  })
const getInitial = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
const lineClamp2 = 'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]'

export function CalendarClassScheduleScreen() {
  const allSessions = useMemo(() => getMockClassSessions(), [])
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState('all')
  const [subjectFilters, setSubjectFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [teacherFilters, setTeacherFilters] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()))

  const today = useMemo(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  }, [])

  const filtered = useMemo(() => {
    return allSessions.filter((session) => {
      if (activeBranch && activeBranch !== 'all' && session.branch !== activeBranch) return false
      if (subjectFilters.length > 0 && !subjectFilters.includes(session.subject)) return false
      if (statusFilters.length > 0 && !statusFilters.includes(session.status as string)) return false
      if (teacherFilters.length > 0 && !teacherFilters.includes(session.teacher)) return false
      if (!search) return true

      const query = search.toLowerCase()
      return (
        session.className.toLowerCase().includes(query) ||
        session.teacher.toLowerCase().includes(query) ||
        session.title.toLowerCase().includes(query) ||
        session.classCode.toLowerCase().includes(query)
      )
    })
  }, [activeBranch, allSessions, search, subjectFilters, statusFilters, teacherFilters])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])
  const subjects = useMemo(() => [...new Set(allSessions.map((session) => session.subject))], [allSessions])
  const statuses = useMemo(() => [...new Map(allSessions.map((session) => [session.status, session.statusLabel])).entries()], [allSessions])
  const teachers = useMemo(() => [...new Set(allSessions.map((session) => session.teacher))], [allSessions])
  const branches = SYSTEM_BRANCHES
  const activeFilterCount = subjectFilters.length + statusFilters.length + teacherFilters.length

  const filterSections = useMemo<FilterSection[]>(
    () => [
      {
        id: 'subjects',
        title: 'Môn học',
        options: subjects.map((subject) => ({
          value: subject,
          label: subject,
          count: allSessions.filter((session) => session.subject === subject).length,
          checked: subjectFilters.includes(subject),
        })),
      },
      {
        id: 'statuses',
        title: 'Trạng thái',
        options: statuses.filter(([value]) => value !== undefined).map(([value, label]) => ({
          value: value as string,
          label: label as string,
          count: allSessions.filter((session) => session.status === value).length,
          checked: statusFilters.includes(value as string),
        })),
      },
      {
        id: 'teachers',
        title: 'Giáo viên',
        options: teachers.map((teacher) => ({
          value: teacher,
          label: teacher,
          count: allSessions.filter((session) => session.teacher === teacher).length,
          checked: teacherFilters.includes(teacher),
        })),
      },
    ],
    [allSessions, subjectFilters, statusFilters, teacherFilters, subjects, statuses, teachers]
  )

  const calendarTitle = viewMode === 'day'
    ? formatLabel(selectedDate, { day: '2-digit', month: 'long', year: 'numeric' })
    : `${formatLabel(weekDays[0], { day: '2-digit', month: 'short' })} - ${formatLabel(weekDays[6], { day: '2-digit', month: 'short' })}`

  const navigate = (dir: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + (viewMode === 'day' ? dir : dir * 7))
    setSelectedDate(date)
  }

  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const handleSelectSession = (session: ClassSession) => {
    setSelectedSession(session)
    setDetailOpen(true)
  }

  const handleQuickAttendance = () => {
    import('sonner').then(({ toast }) => {
      toast.success(`Đã mở giao diện điểm danh nhanh cho buổi học: ${selectedSession?.title}`)
    })
    setDetailOpen(false)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedDate(viewMode === 'day' ? new Date() : getMonday(new Date()))}>
            Hôm nay
          </Button>
          <div className="flex items-center gap-0.5">
            <IconActionButton icon={ChevronLeft} label="Trước" onClick={() => navigate(-1)} className="size-7" />
            <IconActionButton icon={ChevronRight} label="Sau" onClick={() => navigate(1)} className="size-7" />
          </div>
          <h2 className="text-sm font-semibold">{calendarTitle}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            value={viewMode}
            options={VIEW_MODES.map((mode) => ({ value: mode.value as 'day' | 'week', label: mode.label }))}
            onValueChange={setViewMode}
          />
          <BranchSelect
            value={activeBranch}
            branches={branches}
            onValueChange={setActiveBranch}
            className="h-8 min-w-48"
          />
          <ExpandableSearch
            value={search}
            onValueChange={setSearch}
            label="Tìm lớp học"
            placeholder="Tìm lớp, giáo viên..."
            inputClassName="sm:w-72"
          />
          <FilterIconButton count={activeFilterCount} label="Lọc lịch lớp học" onClick={() => setIsFilterOpen(true)} />
        </div>
      </div>

      {viewMode === 'day' ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <DayColumn sessions={filtered} date={selectedDate} onSelectSession={handleSelectSession} single />
        </div>
      ) : (
        <>
          <WeekHeader days={weekDays} today={today} />
          <div className="grid min-h-0 flex-1 grid-cols-7">
            {weekDays.map((day, index) => (
              <div key={day.toISOString()} className={cn('min-w-0', index < 6 && 'border-r border-border/40')}>
                <div className="h-full overflow-y-auto p-1.5">
                  <DayColumn sessions={filtered} date={day} onSelectSession={handleSelectSession} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <FilterSheetPanel
        open={isFilterOpen}
        title="Bộ lọc lịch lớp học"
        description="Lọc buổi học theo môn học."
        sections={filterSections}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'subjects') {
            setSubjectFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'statuses') {
            setStatusFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'teachers') {
            setTeacherFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          }
        }}
        onClearAll={() => {
          setSubjectFilters([])
          setStatusFilters([])
          setTeacherFilters([])
        }}
      />

      <SessionDetailDialog
        session={selectedSession}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onQuickAttendance={handleQuickAttendance}
      />
    </div>
  )
}

function WeekHeader({ days, today }: { days: Date[]; today: Date }) {
  return (
    <div className="grid grid-cols-7 bg-muted/30">
      {days.map((day) => {
        const isToday = day.getTime() === today.getTime()
        return (
          <div key={day.toISOString()} className="flex flex-col items-center justify-center py-2">
            <span className={cn('text-[10px] font-medium uppercase tracking-wider', isToday ? 'text-primary' : 'text-muted-foreground')}>
              {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
            </span>
            <div className={cn('mt-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold', isToday ? 'bg-primary text-primary-foreground' : '')}>
              {day.getDate()}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DayColumn({
  sessions,
  date,
  onSelectSession,
  single,
}: {
  sessions: ClassSession[]
  date: Date
  onSelectSession: (session: ClassSession) => void
  single?: boolean
}) {
  const daySessions = sessions.filter((session) => session.date === toDateKey(date))

  if (daySessions.length === 0) {
    return (
      <EmptyState
        className="py-10"
        title="Chưa có buổi học"
        icon={<Calendar className="h-7 w-7 text-muted-foreground" />}
      />
    )
  }

  return (
    <div className={single ? 'grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'space-y-2'}>
      {daySessions.map((session) => (
        <SessionCard key={session.id} session={session} onClick={() => onSelectSession(session)} />
      ))}
    </div>
  )
}

function SessionCard({ session, onClick }: { session: ClassSession; onClick: () => void }) {
  const initials = getInitial(session.teacher)
  const substituteInitials = session.substituteTeacher ? getInitial(session.substituteTeacher) : ''
  
  const isCancelled = session.status === 'cancelled'
  const isRescheduled = session.status === 'rescheduled'
  
  let bgClass = 'bg-card hover:bg-accent/60'
  if (isCancelled) {
    bgClass = 'bg-zinc-50 dark:bg-zinc-900/50 opacity-75 hover:bg-zinc-100'
  } else if (session.dateBucket === 'past') {
    bgClass = 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50'
  } else if (session.dateBucket === 'upcoming') {
    bgClass = 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-950/50'
  }

  return (
    <div
      onClick={onClick}
      className={cn("group flex min-h-[76px] flex-col overflow-hidden rounded-md text-left shadow-sm transition cursor-pointer", bgClass)}
    >
      <div className="p-2.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className={cn("flex items-center gap-1 text-[10px] font-bold text-primary", isCancelled && "text-muted-foreground")}>
            {isRescheduled ? (
              <CalendarClock className="h-3 w-3 text-amber-600 dark:text-amber-500" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {session.timeLabel} - {session.endTimeLabel}
            {session.isRecurring && <Repeat className="h-3 w-3 text-muted-foreground ml-0.5" />}
          </div>
        </div>
        <h4 className={cn('text-[11px] font-bold leading-tight', lineClamp2, isCancelled && 'line-through text-muted-foreground')}>
          {session.title}
        </h4>
        <div className="mt-2 space-y-0.5 text-[9px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 shrink-0" />
            <span className="truncate">{session.className}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 shrink-0" />
              <span>
                {session.attendedStudents !== undefined 
                  ? `${session.attendedStudents}/${session.totalStudents} HS (${session.trialStudents} học thử)`
                  : `${session.totalStudents} HS (${session.trialStudents} học thử)`}
              </span>
            </div>
            {session.substituteTeacher ? (
              <div className="flex -space-x-1" title={`Dạy thay: ${session.substituteTeacher} (Chính: ${session.teacher})`}>
                <div className="relative z-0 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[9px] font-bold text-muted-foreground opacity-60">
                  {initials}
                </div>
                <div className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-[9px] font-bold text-amber-700">
                  {substituteInitials}
                </div>
              </div>
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[9px] font-bold text-muted-foreground" title={session.teacher}>
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
