'use client'

import { useMemo, useState } from 'react'
import { ArrowLeftRight, CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Repeat, Users } from 'lucide-react'
import { toast } from 'sonner'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SegmentedControl,
} from '@/components/controls'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { getMockEventSessions, type EventSession } from '@/mocks/calendarSchedule'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { EventDetailDialog } from './calendar/EventDetailDialog'
import { BookingTestDetailDialog } from './booking-test/BookingTestDetailDialog'
import { mockBookingTests } from '@/mocks/bookingTests'

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


const getInitial = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
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
const lineClamp2 = 'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]'
const getAssociatedBookingTest = (session: EventSession) => {
  if (session.type !== 'placement_test') return null
  if (session.id === 'EVT-CUSTOM-001') return mockBookingTests.find(b => b.id === 'E0007') // Gia Bao
  if (session.id === 'EVT-CUSTOM-002') return mockBookingTests.find(b => b.id === 'E0001') // Vu Phuc An
  if (session.id === 'EVT-CUSTOM-003') return mockBookingTests.find(b => b.id === 'E0006') // Minh Khoa
  
  const seed = session.title.charCodeAt(0) + session.title.length
  const bookingIdx = seed % mockBookingTests.length
  return mockBookingTests[bookingIdx]
}

export function CalendarEventScheduleScreenV2() {
  const allSessions = useMemo(() => {
    return getMockEventSessions()
      .filter((session) => session.type === 'placement_test' || session.type === 'event')
      .map((session, idx) => {
        let updatedSession = { ...session }
        if (session.type === 'event') {
          const seed = session.title.charCodeAt(0) + session.title.length
          const maxParticipants = 100 + (seed % 6) * 25 // 100, 125, 150, 175, 200, 225
          const participants = maxParticipants - 3 - (seed % 8) // e.g. 118/125, 92/100, etc.
          updatedSession = {
            ...updatedSession,
            maxParticipants,
            participants,
            typeLabel: 'Sự kiện',
          }
        }
        if (idx % 4 === 0) {
          updatedSession.status = 'rescheduled' as const
          updatedSession.statusLabel = 'Đổi ngày'
        }
        return updatedSession
      })
  }, [])
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
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
          { value: 'started_assessment', label: 'Đang đánh giá' },
          { value: 'completed', label: 'Hoàn tất' },
          { value: 'failed', label: 'Không đạt' },
          { value: 'cancelled', label: 'Đã hủy' },
        ],
        selectedValues: bookingStatusFilters,
        getOptionCount: (status) => allSessions.filter((session) => getAssociatedBookingTest(session)?.status === status).length,
      }),
      createFilterGroup({
        id: 'programs',
        title: 'Khung chương trình',
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
  const [detailOpen, setDetailOpen] = useState(false)
  const [bookingTestOpen, setBookingTestOpen] = useState(false)

  const handleSelectEvent = (session: EventSession) => {
    setSelectedEvent(session)
    if (session.type === 'placement_test') {
      setBookingTestOpen(true)
    } else {
      setDetailOpen(true)
    }
  }

  const handleRegister = () => {
    toast.success(`Đăng ký tham gia thành công sự kiện: ${selectedEvent?.title}`)
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
            label="Tìm lịch trải nghiệm"
            placeholder="Tìm lịch trải nghiệm..."
            inputClassName="sm:w-72"
          />
          <FilterIconButton count={activeFilterCount} label="Lọc lịch trải nghiệm" onClick={() => setIsFilterOpen(true)} />
        </div>
      </div>

      {viewMode === 'day' ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <EventColumn sessions={filtered} date={selectedDate} onSelectEvent={handleSelectEvent} single />
        </div>
      ) : (
        <>
          <WeekHeader days={weekDays} today={today} />
          <div className="grid min-h-0 flex-1 grid-cols-7">
            {weekDays.map((day, index) => (
              <div key={day.toISOString()} className={cn('min-w-0', index < 6 && 'border-r border-border/40')}>
                <div className="h-full overflow-y-auto p-1.5">
                  <EventColumn sessions={filtered} date={day} onSelectEvent={handleSelectEvent} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc lịch trải nghiệm"
        description="Lọc lịch trải nghiệm theo môn học, khoảng thời gian và trạng thái."
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

      <EventDetailDialog
        session={selectedEvent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onRegister={handleRegister}
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
      <div className="border-t border-border/40 bg-muted/20 px-4 py-2.5 lg:px-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">Chú giải màu sắc:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-white border border-border dark:bg-zinc-800" />
            <span>Sự kiện hôm nay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-500 border border-sky-600 dark:bg-sky-400" />
            <span className="font-medium text-sky-600 dark:text-sky-400">Sự kiện sắp diễn ra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-orange-500 border border-orange-600 dark:bg-orange-400" />
            <span className="font-medium text-orange-600 dark:text-orange-400">Sự kiện đã diễn ra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-zinc-400 border border-zinc-50 dark:bg-zinc-600 opacity-75" />
            <span className="line-through font-medium text-zinc-500 dark:text-zinc-400">Sự kiện đã hủy</span>
          </div>
        </div>
      </div>
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

function EventCard({ session, onClick }: { session: EventSession; onClick: () => void }) {
  const initials = getInitial(session.organizer)
  const isCancelled = session.status === 'cancelled'

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
            {session.status === 'rescheduled' ? (
              <span title="Đổi ngày sự kiện" className="shrink-0 flex items-center">
                <ArrowLeftRight className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              </span>
            ) : session.isRecurring ? (
              <span title="Sự kiện lặp lại" className="shrink-0 flex items-center">
                <Repeat className="h-3 w-3 text-primary/70" />
              </span>
            ) : (
              <Clock className="h-3 w-3 shrink-0" />
            )}
            {session.timeLabel} - {session.endTimeLabel}
          </div>
          <div className="flex items-center gap-1">
            <span className={cn('inline-block shrink-0 rounded border px-1 py-0.5 text-[8px] font-semibold', getStatusBadgeClass(session.type))}>
              {session.typeLabel}
            </span>
          </div>
        </div>
        <h4 className={cn('text-[11px] font-bold leading-tight', lineClamp2, isCancelled && 'line-through text-muted-foreground')}>{session.title}</h4>
        {session.type === 'placement_test' && (
          (() => {
            const booking = getAssociatedBookingTest(session)
            if (!booking) return null
            const bookingCode = booking.id
            const bookingLevel = booking.testResult?.level || 'Chờ xác định'
            return (
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="inline-flex items-center rounded bg-muted/60 px-1 py-0.5 text-[8px] font-medium text-foreground/80 border border-border/40">
                  Mã: {bookingCode}
                </span>
                <span className="inline-flex items-center rounded bg-primary/10 px-1 py-0.5 text-[8px] font-medium text-primary border border-primary/20">
                  Level: {bookingLevel}
                </span>
              </div>
            )
          })()
        )}
        <div className="mt-2 space-y-0.5 text-[9px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{session.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 shrink-0" />
              <span>{session.participants}/{session.maxParticipants} đã đăng ký</span>
            </div>
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-muted text-[9px] font-bold text-muted-foreground"
              title={session.organizer}
            >
              {initials}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventColumn({
  sessions,
  date,
  onSelectEvent,
  single,
}: {
  sessions: EventSession[]
  date: Date
  onSelectEvent: (session: EventSession) => void
  single?: boolean
}) {
  const daySessions = sessions.filter((session) => session.date === toDateKey(date))

  if (daySessions.length === 0) {
    return (
      <EmptyState
        className="py-10"
        title="Chưa có sự kiện"
        icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
      />
    )
  }

  return (
    <div className={single ? 'grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'space-y-2'}>
      {daySessions.map((session) => (
        <EventCard key={session.id} session={session} onClick={() => onSelectEvent(session)} />
      ))}
    </div>
  )
}
