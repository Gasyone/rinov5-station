'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight, BookOpen, Calendar, ChevronLeft, ChevronRight, Clock, Repeat, Users } from 'lucide-react'
import { BranchSelect, ExpandableSearch, FilterIconButton, IconActionButton, SegmentedControl, SYSTEM_BRANCHES } from '@/components/controls'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { getMockClassSessions, type ClassSession } from '@/mocks/calendarSchedule'
import { cn } from '@/lib/utils'
import { SessionDetailDialog } from './calendar/SessionDetailDialog'

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

const PERIOD_OPTIONS = [
  { value: 'morning', label: 'Sáng' },
  { value: 'afternoon', label: 'Chiều' },
  { value: 'evening', label: 'Tối' },
]

const getSessionPeriod = (timeLabel: string): 'morning' | 'afternoon' | 'evening' => {
  if (!timeLabel) return 'morning'
  const hour = parseInt(timeLabel.split(':')[0], 10)
  if (isNaN(hour)) return 'morning'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

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

export function CalendarClassScheduleScreenV2() {
  const allSessions = useMemo(() => {
    return getMockClassSessions().map((session, idx) => {
      const updatedSession = { ...session }
      if (idx % 5 === 0) {
        updatedSession.type = 'workshop' as const
        updatedSession.typeLabel = 'Workshop'
      }
      if (idx % 7 === 0) {
        updatedSession.status = 'rescheduled' as const
        updatedSession.statusLabel = 'Đổi ngày'
      }
      return updatedSession
    })
  }, [])
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState('all')
  const [branchFilters, setBranchFilters] = useState<string[]>([])
  const [levelFilters, setLevelFilters] = useState<string[]>([])
  const [conditionFilters, setConditionFilters] = useState<string[]>([])
  const [subjectFilters, setSubjectFilters] = useState<string[]>([])
  const [teacherFilters, setTeacherFilters] = useState<string[]>([])
  const [periodFilters, setPeriodFilters] = useState<string[]>([])
  const [roomFilters, setRoomFilters] = useState<string[]>([])
  const [trialFilters, setTrialFilters] = useState<string[]>([])
  const [attendanceFilters, setAttendanceFilters] = useState<string[]>([])
  const [capacityFilters, setCapacityFilters] = useState<string[]>([])
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
      if (branchFilters.length > 0 && !branchFilters.includes(session.branch)) return false
      if (levelFilters.length > 0 && !levelFilters.includes(session.level)) return false
      if (subjectFilters.length > 0 && !subjectFilters.includes(session.subject)) return false
      if (teacherFilters.length > 0 && !teacherFilters.includes(session.teacher)) return false
      if (periodFilters.length > 0 && !periodFilters.includes(getSessionPeriod(session.timeLabel))) return false
      if (roomFilters.length > 0 && !roomFilters.includes(session.schoolRoom)) return false
      
      if (conditionFilters.length > 0) {
        const matches = conditionFilters.some((cond) => {
          if (cond === 'substitute') return Boolean(session.substituteTeacher)
          if (cond === 'opening') return Boolean(session.isOpeningDay)
          if (cond === 'cancelled') return session.status === 'cancelled'
          return false
        })
        if (!matches) return false
      }

      if (trialFilters.length > 0) {
        const matches = trialFilters.some((trial) => {
          if (trial === 'has_trial') return session.trialStudents > 0
          if (trial === 'no_trial') return session.trialStudents === 0
          return false
        })
        if (!matches) return false
      }

      if (attendanceFilters.length > 0) {
        const matches = attendanceFilters.some((att) => {
          if (att === 'attended') return session.attendedStudents !== undefined
          if (att === 'unattended') return session.attendedStudents === undefined
          return false
        })
        if (!matches) return false
      }

      if (capacityFilters.length > 0) {
        const matches = capacityFilters.some((cap) => {
          if (cap === 'under_15') return session.totalStudents < 15
          if (cap === 'over_15') return session.totalStudents >= 15
          return false
        })
        if (!matches) return false
      }

      if (!search) return true

      const query = search.toLowerCase()
      return (
        session.className.toLowerCase().includes(query) ||
        session.teacher.toLowerCase().includes(query) ||
        session.title.toLowerCase().includes(query) ||
        session.classCode.toLowerCase().includes(query)
      )
    })
  }, [
    activeBranch, branchFilters, levelFilters, allSessions, search, subjectFilters, 
    teacherFilters, periodFilters, conditionFilters, roomFilters, trialFilters, 
    attendanceFilters, capacityFilters
  ])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])
  const subjects = useMemo(() => [...new Set(allSessions.map((session) => session.subject))].sort(), [allSessions])
  const teachers = useMemo(() => [...new Set(allSessions.map((session) => session.teacher))].sort(), [allSessions])
  const branches = SYSTEM_BRANCHES
  const levels = useMemo(() => [...new Set(allSessions.map((session) => session.level))].sort(), [allSessions])
  const rooms = useMemo(() => [...new Set(allSessions.map((session) => session.schoolRoom))].sort(), [allSessions])
  
  const activeFilterCount = (
    branchFilters.length + levelFilters.length + subjectFilters.length + 
    teacherFilters.length + periodFilters.length + conditionFilters.length +
    roomFilters.length + trialFilters.length + attendanceFilters.length + capacityFilters.length
  )

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'branches',
        options: branches,
        selectedValues: branchFilters,
        getOptionCount: (branch) => allSessions.filter((session) => session.branch === branch).length,
      }),
      createFilterGroup({
        id: 'levels',
        options: levels,
        selectedValues: levelFilters,
        getOptionCount: (level) => allSessions.filter((session) => session.level === level).length,
      }),
      createFilterGroup({
        id: 'rooms',
        options: rooms,
        selectedValues: roomFilters,
        getOptionCount: (room) => allSessions.filter((session) => session.schoolRoom === room).length,
      }),
      createFilterGroup({
        id: 'trial_students',
        options: [
          {
            value: 'has_trial',
            label: 'Có học viên học thử',
            count: allSessions.filter((session) => session.trialStudents > 0).length,
          },
          {
            value: 'no_trial',
            label: 'Không có học viên học thử',
            count: allSessions.filter((session) => session.trialStudents === 0).length,
          },
        ],
        selectedValues: trialFilters,
      }),
      createFilterGroup({
        id: 'attendance',
        title: 'Tình trạng điểm danh',
        options: [
          {
            value: 'attended',
            label: 'Đã điểm danh',
            count: allSessions.filter((session) => session.attendedStudents !== undefined).length,
          },
          {
            value: 'unattended',
            label: 'Chưa điểm danh',
            count: allSessions.filter((session) => session.attendedStudents === undefined).length,
          },
        ],
        selectedValues: attendanceFilters,
      }),
      createFilterGroup({
        id: 'capacity',
        options: [
          {
            value: 'under_15',
            label: 'Dưới 15 học sinh',
            count: allSessions.filter((session) => session.totalStudents < 15).length,
          },
          {
            value: 'over_15',
            label: 'Từ 15 học sinh trở lên',
            count: allSessions.filter((session) => session.totalStudents >= 15).length,
          },
        ],
        selectedValues: capacityFilters,
      }),
      createFilterGroup({
        id: 'conditions',
        options: [
          {
            value: 'substitute',
            label: 'Dạy thay',
            count: allSessions.filter((session) => session.substituteTeacher).length,
          },
          {
            value: 'opening',
            label: 'Khai giảng',
            count: allSessions.filter((session) => session.isOpeningDay).length,
          },
          {
            value: 'cancelled',
            label: 'Buổi học đã hủy',
            count: allSessions.filter((session) => session.status === 'cancelled').length,
          },
        ],
        selectedValues: conditionFilters,
      }),
      createFilterGroup({
        id: 'subjects',
        title: 'Chương trình học',
        options: subjects,
        selectedValues: subjectFilters,
        getOptionCount: (subject) => allSessions.filter((session) => session.subject === subject).length,
      }),
      createFilterGroup({
        id: 'periods',
        options: PERIOD_OPTIONS,
        selectedValues: periodFilters,
        getOptionCount: (period) => allSessions.filter((session) => getSessionPeriod(session.timeLabel) === period).length,
      }),
      createFilterGroup({
        id: 'teachers',
        options: teachers,
        selectedValues: teacherFilters,
        getOptionCount: (teacher) => allSessions.filter((session) => session.teacher === teacher).length,
      }),
    ],
    [
      allSessions, branchFilters, levelFilters, subjectFilters, teacherFilters, periodFilters, 
      conditionFilters, branches, levels, subjects, teachers, rooms, roomFilters, trialFilters,
      attendanceFilters, capacityFilters
    ]
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
            onValueChange={(value) => {
              setViewMode(value)
              if (value === 'day') {
                setSelectedDate(new Date())
              } else {
                setSelectedDate(getMonday(selectedDate))
              }
            }}
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

      {/* Chú giải màu sắc footer */}
      <div className="border-t border-border/40 bg-muted/20 px-4 py-2.5 lg:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">Chú giải màu sắc:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-white border border-border dark:bg-zinc-800" />
            <span>Buổi học hôm nay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-500 border border-sky-600 dark:bg-sky-400" />
            <span className="font-medium text-sky-600 dark:text-sky-400">Buổi học sắp diễn ra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-orange-500 border border-orange-600 dark:bg-orange-400" />
            <span className="font-medium text-orange-600 dark:text-orange-400">Buổi học đã diễn ra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-violet-500 border border-violet-600 dark:bg-violet-400" />
            <span className="font-semibold text-violet-700 dark:text-violet-400">Buổi dạy thay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-600 dark:bg-emerald-400 shadow-sm animate-pulse" />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              Ngày khai giảng (Lớp mới) 
              <span className="inline-flex animate-pulse rounded bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black uppercase text-emerald-950">KHAI GIẢNG</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-zinc-400 border border-zinc-50 dark:bg-zinc-600 opacity-75" />
            <span className="line-through font-medium text-zinc-500 dark:text-zinc-400">Buổi học đã hủy</span>
          </div>
        </div>
      </div>

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc lịch lớp học"
        description="Lọc buổi học theo chi nhánh, trình độ, môn học và khoảng thời gian."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'branches') {
            setBranchFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'levels') {
            setLevelFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'conditions') {
            setConditionFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'periods') {
            setPeriodFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'subjects') {
            setSubjectFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'teachers') {
            setTeacherFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'rooms') {
            setRoomFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'trial_students') {
            setTrialFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'attendance') {
            setAttendanceFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'capacity') {
            setCapacityFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          }
        }}
        onClearAll={() => {
          setBranchFilters([])
          setLevelFilters([])
          setConditionFilters([])
          setSubjectFilters([])
          setTeacherFilters([])
          setPeriodFilters([])
          setRoomFilters([])
          setTrialFilters([])
          setAttendanceFilters([])
          setCapacityFilters([])
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
  
  let bgClass = 'bg-card hover:bg-accent/60'
  if (isCancelled) {
    bgClass = 'bg-zinc-50 dark:bg-zinc-900/50 opacity-75 hover:bg-zinc-100'
  } else if (session.isOpeningDay) {
    bgClass = 'bg-gradient-to-br from-emerald-50 via-emerald-50/70 to-teal-50/50 hover:from-emerald-100 hover:to-teal-100 dark:from-emerald-950/30 dark:via-emerald-950/20 dark:to-teal-950/10 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
  } else if (session.substituteTeacher) {
    bgClass = 'bg-violet-100/80 hover:bg-violet-200/50 dark:bg-violet-950/40 dark:hover:bg-violet-950/60 border border-violet-300 dark:border-violet-700 shadow-sm'
  } else if (session.dateBucket === 'past') {
    bgClass = 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50'
  } else if (session.dateBucket === 'upcoming') {
    bgClass = 'bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-950/50'
  }

  return (
    <div
      onClick={onClick}
      className={cn("group relative flex min-h-[76px] flex-col overflow-hidden rounded-md text-left shadow-sm transition cursor-pointer", bgClass)}
    >
      {session.isOpeningDay && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />
      )}
      <div className={cn("p-2.5", session.isOpeningDay && "pl-3.5")}>
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className={cn("flex items-center gap-1 text-[10px] font-bold text-primary", isCancelled && "text-muted-foreground")}>
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
            {session.timeLabel} - {session.endTimeLabel}
          </div>
          <div className="flex items-center gap-1">
            {session.typeLabel && (
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
        <h4 className={cn('text-[11px] font-bold leading-tight', lineClamp2, isCancelled && 'line-through text-muted-foreground')}>
          {session.title}
        </h4>
        <div className="mt-1 flex flex-wrap gap-1">
          <span className="inline-flex items-center rounded bg-muted/60 px-1 py-0.5 text-[8px] font-medium text-foreground/80 border border-border/40">
            {session.classCode}
          </span>
          <span className="inline-flex items-center rounded bg-primary/10 px-1 py-0.5 text-[8px] font-medium text-primary border border-primary/20">
            {session.level}
          </span>
          {session.isOpeningDay && (
            <span className="inline-flex animate-pulse items-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-950 border border-emerald-600 dark:bg-emerald-600 dark:text-emerald-50">
              Khai giảng
            </span>
          )}
        </div>
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
