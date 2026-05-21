'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Calendar, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react'
import { BranchSelect, ExpandableSearch, FilterIconButton, IconActionButton, SegmentedControl } from '@/components/controls'
import { FilterSheetPanel, type FilterSection } from '@/components/filters'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { getMockClassSessions, type ClassSession } from '@/mocks/calendarSchedule'
import { getStatusBadgeClass } from '@/lib/statusColors'
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()))

  const today = useMemo(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  }, [])

  const filtered = useMemo(() => {
    return allSessions.filter((session) => {
      if (activeBranch !== 'all' && session.branch !== activeBranch) return false
      if (subjectFilters.length > 0 && !subjectFilters.includes(session.subject)) return false
      if (!search) return true

      const query = search.toLowerCase()
      return (
        session.className.toLowerCase().includes(query) ||
        session.teacher.toLowerCase().includes(query) ||
        session.title.toLowerCase().includes(query) ||
        session.classCode.toLowerCase().includes(query)
      )
    })
  }, [activeBranch, allSessions, search, subjectFilters])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])
  const subjects = useMemo(() => [...new Set(allSessions.map((session) => session.subject))], [allSessions])
  const branches = useMemo(() => [...new Set(allSessions.map((session) => session.branch))], [allSessions])
  const activeFilterCount = subjectFilters.length

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
    ],
    [allSessions, subjectFilters, subjects]
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
            allLabel="Tất cả trung tâm"
            ariaLabel="Trung tâm"
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
          }
        }}
        onClearAll={() => {
          setSubjectFilters([])
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

  return (
    <div
      onClick={onClick}
      className="group flex min-h-[76px] flex-col overflow-hidden rounded-md bg-card text-left shadow-sm transition hover:bg-accent/60 cursor-pointer"
    >
      <div className="p-2.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
            <Clock className="h-3 w-3" />
            {session.timeLabel} - {session.endTimeLabel}
          </div>
          <span className={cn('ml-auto inline-block shrink-0 rounded border px-1 py-0.5 text-[8px] font-semibold', getStatusBadgeClass(session.type))}>
            {session.typeLabel}
          </span>
        </div>
        <h4 className={cn('text-[11px] font-bold leading-tight', lineClamp2)}>{session.title}</h4>
        <div className="mt-2 space-y-0.5 text-[9px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3 shrink-0" />
            <span className="truncate">{session.className}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 shrink-0" />
              <span>{session.totalStudents} HS ({session.trialStudents} học thử)</span>
            </div>
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[9px] font-bold text-muted-foreground" title={session.teacher}>
              {initials}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
