'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Columns3, Grid } from 'lucide-react'

import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SegmentedControl,
} from '@/components/controls'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { EmptyState, ModuleLoadingSkeleton } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { getMockEventSessions, type EventSession } from '@/mocks/calendarSchedule'
import { cn } from '@/lib/utils'
import { BookingTestDetailDialog } from './booking-test/BookingTestDetailDialog'
import { mockBookingTests } from '@/mocks/bookingTests'
import { EventCard, getAssociatedBookingTest } from './calendar/EventCard'

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

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

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

export function CalendarEventScheduleScreen() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const allSessions = useMemo(() => {
    return getMockEventSessions()
      .filter((session) => session.type === 'placement_test')
      .map((session, idx) => {
        const updatedSession = { ...session }
        if (idx % 4 === 0) {
          updatedSession.status = 'rescheduled' as const
          updatedSession.statusLabel = 'Đổi ngày'
        }
        return updatedSession
      })
  }, [])

  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [displayFormat, setDisplayFormat] = useState<'timeline' | 'list'>('timeline')
  const [periodFilters, setPeriodFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [subjectFilters, setSubjectFilters] = useState<string[]>([])
  const [programFilters, setProgramFilters] = useState<string[]>([])
  const [saleFilters, setSaleFilters] = useState<string[]>([])
  const [teacherFilters, setTeacherFilters] = useState<string[]>([])
  const [bookingStatusFilters, setBookingStatusFilters] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()))

  const today = useMemo(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  }, [])

  const branches = useMemo(() => [...new Set(allSessions.map((session) => session.branch))], [allSessions])
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  const filtered = useMemo(() => {
    return allSessions.filter((session) => {
      if (activeBranch !== 'all' && session.branch !== activeBranch) return false
      if (periodFilters.length > 0 && !periodFilters.includes(getSessionPeriod(session.timeLabel))) return false
      if (statusFilters.length > 0 && !statusFilters.includes(session.status)) return false
      if (subjectFilters.length > 0 && !subjectFilters.includes(session.subject as string)) return false
      
      const booking = getAssociatedBookingTest(session)
      if (booking) {
        if (programFilters.length > 0 && !programFilters.includes(booking.program)) return false
        if (saleFilters.length > 0 && !saleFilters.includes(booking.createdBy || '')) return false
        if (teacherFilters.length > 0 && !teacherFilters.includes(booking.teacher || '')) return false
        if (bookingStatusFilters.length > 0 && !bookingStatusFilters.includes(booking.status)) return false
      } else {
        if (programFilters.length > 0 || saleFilters.length > 0 || teacherFilters.length > 0 || bookingStatusFilters.length > 0) return false
      }

      if (!search) return true

      const query = search.toLowerCase()
      return (
        session.title.toLowerCase().includes(query) ||
        session.branch.toLowerCase().includes(query) ||
        session.organizer.toLowerCase().includes(query)
      )
    })
  }, [activeBranch, allSessions, periodFilters, search, statusFilters, subjectFilters, programFilters, saleFilters, teacherFilters, bookingStatusFilters])

  const statuses = useMemo(() => [...new Map(allSessions.map((session) => [session.status, session.statusLabel])).entries()], [allSessions])
  const subjects = useMemo(() => [...new Set(allSessions.map((session) => session.subject).filter(Boolean))], [allSessions])
  
  const activeFilterCount =
    periodFilters.length +
    statusFilters.length +
    subjectFilters.length +
    programFilters.length +
    saleFilters.length +
    teacherFilters.length +
    bookingStatusFilters.length

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'bookingStatuses',
        title: 'Trạng thái lịch test',
        options: [
          { value: 'booked_assessment', label: 'Đã đặt lịch test' },
          { value: 'checkin', label: 'Đã check-in' },
          { value: 'completed', label: 'Hoàn tất' },
          { value: 'failed', label: 'Không đạt' },
          { value: 'cancelled', label: 'Đã hủy' },
        ],
        selectedValues: bookingStatusFilters,
        getOptionCount: (status) => allSessions.filter((session) => getAssociatedBookingTest(session)?.status === status).length,
      }),
      createFilterGroup({
        id: 'programs',
        title: 'Chương trình',
        options: [
          'Station Program',
          'IELTS Foundation',
          'Tiếng Anh thiếu nhi',
          'Toán tư duy',
          'Toán Olympiad',
        ],
        selectedValues: programFilters,
        getOptionCount: (program) => allSessions.filter((session) => getAssociatedBookingTest(session)?.program === program).length,
      }),
      createFilterGroup({
        id: 'sales',
        options: [
          'Hung Dao',
          'Thanh Van',
          'Yen Nhi',
          'Le Hoang Nam',
          'Tran Anh Kiet',
          'Nguyen Thi Ha',
        ],
        selectedValues: saleFilters,
        getOptionCount: (sale) => allSessions.filter((session) => getAssociatedBookingTest(session)?.createdBy === sale).length,
        searchable: true,
        scrollable: true,
      }),
      createFilterGroup({
        id: 'teachers',
        title: 'Giáo viên phụ trách',
        options: [
          'Sarah J.',
          'Robert L.',
          'Emily W.',
          'Thay Hung',
        ],
        selectedValues: teacherFilters,
        getOptionCount: (teacher) => allSessions.filter((session) => getAssociatedBookingTest(session)?.teacher === teacher).length,
      }),
      createFilterGroup({
        id: 'subjects',
        options: subjects.map((subject) => subject as string),
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
        id: 'statuses',
        title: 'Trạng thái sự kiện',
        options: statuses.map(([value, label]) => ({ value, label })),
        selectedValues: statusFilters,
        getOptionCount: (status) => allSessions.filter((session) => session.status === status).length,
      }),
    ],
    [allSessions, periodFilters, statusFilters, subjectFilters, statuses, subjects, programFilters, saleFilters, teacherFilters, bookingStatusFilters]
  )

  const calendarTitle = viewMode === 'day'
    ? selectedDate.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
    : `${weekDays[0].toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })} - ${weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })}`

  const navigate = (dir: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + (viewMode === 'day' ? dir : dir * 7))
    setSelectedDate(date)
  }

  const [selectedEvent, setSelectedEvent] = useState<EventSession | null>(null)
  const [bookingTestOpen, setBookingTestOpen] = useState(false)

  const handleSelectEvent = (session: EventSession) => {
    setSelectedEvent(session)
    if (session.type === 'placement_test') {
      setBookingTestOpen(true)
    }
  }

  if (!mounted) {
    return <ModuleLoadingSkeleton className="h-full" />
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-2 px-3 py-3 md:flex-row md:items-center md:justify-between lg:px-3">
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
          {viewMode === 'week' && (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant={displayFormat === 'timeline' ? 'secondary' : 'ghost'}
                size="icon-xs"
                onClick={() => setDisplayFormat('timeline')}
                className={cn(
                  "h-8 w-8 rounded-md p-0 flex items-center justify-center transition-colors",
                  displayFormat === 'timeline'
                    ? "bg-secondary text-secondary-foreground font-semibold shadow-xs"
                    : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title="Lưới thời gian"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={displayFormat === 'list' ? 'secondary' : 'ghost'}
                size="icon-xs"
                onClick={() => setDisplayFormat('list')}
                className={cn(
                  "h-8 w-8 rounded-md p-0 flex items-center justify-center transition-colors",
                  displayFormat === 'list'
                    ? "bg-secondary text-secondary-foreground font-semibold shadow-xs"
                    : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title="Danh sách cột"
              >
                <Columns3 className="h-4 w-4" />
              </Button>
            </div>
          )}
          <BranchSelect
            value={activeBranch}
            branches={branches}
            onValueChange={setActiveBranch}
            className="h-8 min-w-48"
          />
          <ExpandableSearch
            value={search}
            onValueChange={setSearch}
            label="Tìm lịch test"
            placeholder="Tìm lịch test..."
            inputClassName="sm:w-72"
          />
          <FilterIconButton count={activeFilterCount} label="Lọc lịch test" onClick={() => setIsFilterOpen(true)} />
        </div>
      </div>

      {viewMode === 'day' ? (
        <DayTimelineView sessions={filtered} date={selectedDate} onSelectEvent={handleSelectEvent} activeBranch={activeBranch} />
      ) : (
        displayFormat === 'timeline' ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <WeekHeader days={weekDays} today={today} hasSpacer sessions={filtered} />
            <div className="min-h-0 flex-1 overflow-y-auto">
              {TIMELINE_SLOTS.map((slot) => {
                return (
                  <div key={slot} className="flex min-h-[56px] border-b border-border/30">
                    {/* Hour label */}
                    <div className="flex w-16 shrink-0 items-start justify-end pr-3 pt-2 border-r border-border/40">
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {slot}
                      </span>
                    </div>
                    {/* 7 Columns for this hour */}
                    <div className="grid flex-1 grid-cols-7">
                      {weekDays.map((day, index) => {
                        const dayHourSessions = filtered.filter(
                          (s) => s.date === toDateKey(day) && get30MinSlot(s.timeLabel) === slot
                        )
                        return (
                          <div
                            key={day.toISOString()}
                            className={cn(
                              'p-1.5 flex flex-col gap-1.5 min-w-0 h-full justify-start',
                              index < 6 && 'border-r border-border/30'
                            )}
                          >
                            {dayHourSessions.map((session) => (
                              <EventCard
                                key={session.id}
                                session={session}
                                onClick={() => handleSelectEvent(session)}
                                activeBranch={activeBranch}
                              />
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <WeekHeader days={weekDays} today={today} hasSpacer={false} sessions={filtered} />
            <div className="grid min-h-0 flex-1 grid-cols-7 overflow-y-auto">
              {weekDays.map((day, index) => (
                <div key={day.toISOString()} className={cn('min-w-0', index < 6 && 'border-r border-border/40')}>
                  <div className="h-full overflow-y-auto p-1.5">
                    <EventColumn sessions={filtered} date={day} onSelectEvent={handleSelectEvent} activeBranch={activeBranch} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc lịch test"
        description="Lọc lịch test theo môn học, khoảng thời gian và trạng thái."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'periods') {
            setPeriodFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'statuses') {
            setStatusFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'subjects') {
            setSubjectFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'programs') {
            setProgramFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'sales') {
            setSaleFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'teachers') {
            setTeacherFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'bookingStatuses') {
            setBookingStatusFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          }
        }}
        onClearAll={() => {
          setPeriodFilters([])
          setStatusFilters([])
          setSubjectFilters([])
          setProgramFilters([])
          setSaleFilters([])
          setTeacherFilters([])
          setBookingStatusFilters([])
        }}
      />


      
      {bookingTestOpen && selectedEvent?.type === 'placement_test' && (
        <BookingTestDetailDialog
          booking={getAssociatedBookingTest(selectedEvent) || mockBookingTests[0]} // Mock data for demo
          detailNote=""
          copiedKey=""
          onOpenChange={setBookingTestOpen}
          onUpdateBooking={() => {}}
          onOpenAssessment={() => {}}
          onCall={() => {}}
          onCopy={async () => {}}
          onDetailNoteChange={() => {}}
          onAddNote={() => {}}
        />
      )}

      {/* Chú giải màu sắc footer */}
      <div className="border-t border-border/40 bg-muted/20 px-3 py-2 lg:px-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">Chú giải màu sắc:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-white border border-border dark:bg-zinc-800" />
            <span>Sự kiện hôm nay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-50 border border-sky-600 dark:bg-sky-400" />
            <span className="font-medium text-sky-600 dark:text-sky-400">Sự kiện sắp diễn ra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-orange-50 border border-orange-100 dark:bg-orange-950/30" />
            <span className="font-medium text-orange-600 dark:text-orange-400 font-semibold">Sự kiện đã diễn ra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-zinc-300 border border-zinc-400 dark:bg-zinc-700 opacity-50" />
            <span className="line-through font-medium text-zinc-400 dark:text-zinc-500">Sự kiện đã hủy</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeekHeader({ days, today, hasSpacer = false, sessions }: { days: Date[]; today: Date; hasSpacer?: boolean; sessions: EventSession[] }) {
  return (
    <div className="flex bg-muted/30 border-b border-border/40">
      {/* Spacer for hour column */}
      {hasSpacer && <div className="w-16 shrink-0 border-r border-border/40 bg-muted/10" />}
      {/* Columns */}
      <div className={cn("grid flex-1", days.length === 1 ? "grid-cols-1" : "grid-cols-7")}>
        {days.map((day) => {
          const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear()
          const daySessions = sessions.filter((s) => s.date === toDateKey(day))
          const count = daySessions.length
          return (
            <div key={day.toISOString()} className="flex flex-col items-center justify-center py-2.5">
              <div className="flex items-center gap-1.5">
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isToday ? 'text-primary' : 'text-muted-foreground')}>
                  {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
                </span>
                <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold', isToday ? 'bg-primary text-primary-foreground' : 'text-foreground')}>
                  {day.getDate()}
                </span>
              </div>
              <span className="text-[9.5px] mt-1 text-muted-foreground font-semibold">
                {count} sự kiện
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EventColumn({
  sessions,
  date,
  onSelectEvent,
  activeBranch = 'all',
  single,
}: {
  sessions: EventSession[]
  date: Date
  onSelectEvent: (session: EventSession) => void
  activeBranch?: string
  single?: boolean
}) {
  const daySessions = sessions.filter((session) => session.date === toDateKey(date))

  if (daySessions.length === 0) {
    return (
      <EmptyState
        className="py-10"
        title="Chưa có lịch test"
        icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
      />
    )
  }

  return (
    <div className={single ? 'grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'space-y-2'}>
      {daySessions.map((session) => (
        <EventCard key={session.id} session={session} onClick={() => onSelectEvent(session)} activeBranch={activeBranch} />
      ))}
    </div>
  )
}

const TIMELINE_SLOTS = Array.from({ length: 29 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2)
  const minute = (i % 2) * 30
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
})

const get30MinSlot = (timeLabel: string): string => {
  if (!timeLabel) return '08:00'
  const [hStr, mStr] = timeLabel.split(':')
  const hour = parseInt(hStr, 10)
  const minute = parseInt(mStr, 10)
  if (isNaN(hour) || isNaN(minute)) return '08:00'
  const slotMinute = minute < 30 ? 0 : 30
  return `${String(hour).padStart(2, '0')}:${String(slotMinute).padStart(2, '0')}`
}

function DayTimelineView({
  sessions,
  date,
  onSelectEvent,
  activeBranch = 'all',
}: {
  sessions: EventSession[]
  date: Date
  onSelectEvent: (session: EventSession) => void
  activeBranch?: string
}) {
  const daySessions = sessions
    .filter((session) => session.date === toDateKey(date))
    .sort((a, b) => a.timeLabel.localeCompare(b.timeLabel))

  if (daySessions.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <WeekHeader days={[date]} today={new Date()} hasSpacer sessions={sessions} />
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <EmptyState
            className="py-10"
            title="Chưa có lịch test"
            icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <WeekHeader days={[date]} today={new Date()} hasSpacer sessions={sessions} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="relative">
          {TIMELINE_SLOTS.map((slot) => {
            const slotSessions = daySessions.filter((s) => get30MinSlot(s.timeLabel) === slot)
            return (
              <div key={slot} className="flex min-h-[56px] border-b border-border/30">
                {/* Hour label */}
                <div className="flex w-16 shrink-0 items-start justify-end pr-3 pt-2 border-r border-border/40">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {slot}
                  </span>
                </div>
                {/* Day column (1 column) */}
                <div className="flex-1 p-1.5 flex flex-row flex-wrap gap-1.5 min-w-0 h-full justify-start items-start">
                  {slotSessions.map((session) => (
                    <div key={session.id} className="w-80 shrink-0">
                      <EventCard
                        session={session}
                        onClick={() => onSelectEvent(session)}
                        activeBranch={activeBranch}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
