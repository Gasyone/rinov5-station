'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Users, CalendarClock } from 'lucide-react'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SegmentedControl,
} from '@/components/controls'
import { FilterSheetPanel, type FilterSection } from '@/components/filters'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { getMockEventSessions, type EventSession } from '@/mocks/calendarSchedule'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'
import { EventDetailDialog } from './calendar/EventDetailDialog'
import { BookingTestDetailDialog } from './booking-test/BookingTestDetailDialog'
import { mockBookingTests } from '@/mocks/bookingTests'

const FILTER_BUCKETS = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'upcoming', label: 'Sắp diễn ra' },
  { value: 'past', label: 'Đã qua' },
]

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

const EVENT_TYPES = [
  { value: 'event', label: 'Sự kiện' },
  { value: 'placement_test', label: 'Trải nghiệm' },
  { value: 'workshop', label: 'Hội thảo' },
  { value: 'consultation', label: 'Tư vấn' },
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

export function CalendarEventScheduleScreen() {
  const allSessions = useMemo(() => getMockEventSessions(), [])
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [bucketFilters, setBucketFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [organizerFilters, setOrganizerFilters] = useState<string[]>([])
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
      if (bucketFilters.length > 0 && !bucketFilters.includes(session.dateBucket)) return false
      if (typeFilters.length > 0 && !typeFilters.includes(session.type)) return false
      if (statusFilters.length > 0 && !statusFilters.includes(session.status)) return false
      if (organizerFilters.length > 0 && !organizerFilters.includes(session.organizer)) return false
      if (!search) return true

      const query = search.toLowerCase()
      return (
        session.title.toLowerCase().includes(query) ||
        session.branch.toLowerCase().includes(query) ||
        session.organizer.toLowerCase().includes(query)
      )
    })
  }, [activeBranch, allSessions, bucketFilters, search, typeFilters, statusFilters, organizerFilters])

  const statuses = useMemo(() => [...new Map(allSessions.map((session) => [session.status, session.statusLabel])).entries()], [allSessions])
  const organizers = useMemo(() => [...new Set(allSessions.map((session) => session.organizer))], [allSessions])
  const activeFilterCount = bucketFilters.length + typeFilters.length + statusFilters.length + organizerFilters.length
  const filterSections = useMemo<FilterSection[]>(
    () => [
      {
        id: 'buckets',
        title: 'Khoảng thời gian',
        options: FILTER_BUCKETS.map((bucket) => ({
          value: bucket.value,
          label: bucket.label,
          count: allSessions.filter((session) => session.dateBucket === bucket.value).length,
          checked: bucketFilters.includes(bucket.value),
        })),
      },
      {
        id: 'types',
        title: 'Loại sự kiện',
        options: EVENT_TYPES.map((type) => ({
          value: type.value,
          label: type.label,
          count: allSessions.filter((session) => session.type === type.value).length,
          checked: typeFilters.includes(type.value),
        })),
      },
      {
        id: 'statuses',
        title: 'Trạng thái',
        options: statuses.map(([value, label]) => ({
          value,
          label,
          count: allSessions.filter((session) => session.status === value).length,
          checked: statusFilters.includes(value),
        })),
      },
      {
        id: 'organizers',
        title: 'Người tổ chức',
        options: organizers.map((organizer) => ({
          value: organizer,
          label: organizer,
          count: allSessions.filter((session) => session.organizer === organizer).length,
          checked: organizerFilters.includes(organizer),
        })),
      },
    ],
    [allSessions, bucketFilters, typeFilters, statusFilters, organizerFilters, statuses, organizers]
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
    import('sonner').then(({ toast }) => {
      toast.success(`Đăng ký tham gia thành công sự kiện: ${selectedEvent?.title}`)
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
            label="Tìm sự kiện"
            placeholder="Tìm sự kiện..."
            inputClassName="sm:w-72"
          />
          <FilterIconButton count={activeFilterCount} label="Lọc sự kiện" onClick={() => setIsFilterOpen(true)} />
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

      <FilterSheetPanel
        open={isFilterOpen}
        title="Bộ lọc lịch sự kiện"
        description="Lọc sự kiện theo thời gian và loại sự kiện."
        sections={filterSections}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'buckets') {
            setBucketFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'types') {
            setTypeFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'statuses') {
            setStatusFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          } else if (sectionId === 'organizers') {
            setOrganizerFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          }
        }}
        onClearAll={() => {
          setBucketFilters([])
          setTypeFilters([])
          setStatusFilters([])
          setOrganizerFilters([])
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
          booking={mockBookingTests[0]} // Mock data for demo
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

function EventCard({ session, onClick }: { session: EventSession; onClick: () => void }) {
  const initials = getInitial(session.organizer)
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
          </div>
          <span className={cn('ml-auto inline-block shrink-0 rounded border px-1 py-0.5 text-[8px] font-semibold', getStatusBadgeClass(session.type))}>
            {session.typeLabel}
          </span>
        </div>
        <h4 className={cn('text-[11px] font-bold leading-tight', lineClamp2, isCancelled && 'line-through text-muted-foreground')}>{session.title}</h4>
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
