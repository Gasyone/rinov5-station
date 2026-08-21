'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Columns3, Grid } from 'lucide-react'

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
import {
  computeEventScheduleSlots,
  formatMinutesToTime,
  getMonday,
  getSessionPeriod,
  getWeekDays,
  toDateKey,
} from './calendar/calendarEventScheduleHelpers'
import { CalendarEventWeekTimeline } from './calendar/CalendarEventWeekTimeline'
import { CalendarEventDayTimeline } from './calendar/CalendarEventDayTimeline'

const PERIOD_OPTIONS = [
  { value: 'morning', label: 'Sáng' },
  { value: 'afternoon', label: 'Chiều' },
  { value: 'evening', label: 'Tối' },
]

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

export function CalendarEventScheduleScreen() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Real-time clock for current time line (refreshes every 30s)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 30000)
    return () => clearInterval(timer)
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

  const [isMorningOpen, setIsMorningOpen] = useState(true)
  const [isAfternoonOpen, setIsAfternoonOpen] = useState(true)
  const [isEveningOpen, setIsEveningOpen] = useState(true)

  const morningSessionsByDay = useMemo(() => {
    return weekDays.map((day) =>
      filtered.filter((s) => s.date === toDateKey(day) && getSessionPeriod(s.timeLabel) === 'morning')
    )
  }, [weekDays, filtered])

  const afternoonSessionsByDay = useMemo(() => {
    return weekDays.map((day) =>
      filtered.filter((s) => s.date === toDateKey(day) && getSessionPeriod(s.timeLabel) === 'afternoon')
    )
  }, [weekDays, filtered])

  const eveningSessionsByDay = useMemo(() => {
    return weekDays.map((day) =>
      filtered.filter((s) => s.date === toDateKey(day) && getSessionPeriod(s.timeLabel) === 'evening')
    )
  }, [weekDays, filtered])

  const totalMorningCount = useMemo(() => morningSessionsByDay.reduce((acc, curr) => acc + curr.length, 0), [morningSessionsByDay])
  const totalAfternoonCount = useMemo(() => afternoonSessionsByDay.reduce((acc, curr) => acc + curr.length, 0), [afternoonSessionsByDay])
  const totalEveningCount = useMemo(() => eveningSessionsByDay.reduce((acc, curr) => acc + curr.length, 0), [eveningSessionsByDay])

  // Compute dynamic timeline slots (trims empty hours before earliest and after latest events)
  const timelineSlots = useMemo(() => {
    const visibleDays = viewMode === 'day' ? [selectedDate] : weekDays
    return computeEventScheduleSlots(filtered, visibleDays, today, now)
  }, [filtered, viewMode, selectedDate, weekDays, today, now])

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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDate(viewMode === 'day' ? new Date() : getMonday(new Date()))}
          >
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
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <WeekHeader days={[selectedDate]} today={today} hasSpacer sessions={filtered} now={now} />
          <CalendarEventDayTimeline
            date={selectedDate}
            today={today}
            now={now}
            sessions={filtered}
            timelineSlots={timelineSlots}
            activeBranch={activeBranch}
            branchesCount={branches.length}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      ) : (
        displayFormat === 'timeline' ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <WeekHeader days={weekDays} today={today} hasSpacer sessions={filtered} now={now} />
            <CalendarEventWeekTimeline
              days={weekDays}
              today={today}
              now={now}
              sessions={filtered}
              timelineSlots={timelineSlots}
              activeBranch={activeBranch}
              branchesCount={branches.length}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <WeekHeader days={weekDays} today={today} hasSpacer={false} sessions={filtered} now={now} />
            {filtered.length === 0 ? (
              <div className="flex flex-1 items-center justify-center p-8">
                <EmptyState
                  title="Không có lịch test"
                  description="Không tìm thấy lịch test nào trong tuần được chọn hoặc bộ lọc hiện tại."
                />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto min-h-0 bg-background/50 p-3 space-y-4">
                {/* Ca Sáng (Chỉ hiển thị khi có lịch test ca sáng trong tuần) */}
                {totalMorningCount > 0 && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsMorningOpen(!isMorningOpen)}
                      className="flex w-full items-center justify-between rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shrink-0" />
                        <span>Ca Sáng (08:00 - 12:00) ({totalMorningCount} sự kiện)</span>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isMorningOpen && "rotate-90")} />
                    </button>

                    {isMorningOpen && (
                      <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day, idx) => {
                          const daySessions = morningSessionsByDay[idx]
                          const isToday =
                            day.getDate() === today.getDate() &&
                            day.getMonth() === today.getMonth() &&
                            day.getFullYear() === today.getFullYear()
                          return (
                            <div
                              key={day.toISOString()}
                              className={cn(
                                "space-y-2 min-w-0 p-1 rounded-md transition-colors",
                                isToday && "bg-primary/[0.03]"
                              )}
                            >
                              {daySessions.map((session) => (
                                <EventCard
                                  key={session.id}
                                  session={session}
                                  onClick={() => handleSelectEvent(session)}
                                  activeBranch={activeBranch}
                                  branchesCount={branches.length}
                                  showTime
                                />
                              ))}
                              {daySessions.length === 0 && (
                                <div className="text-[10px] text-muted-foreground/30 text-center py-2.5 select-none">
                                  —
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Ca Chiều (Chỉ hiển thị khi có lịch test ca chiều trong tuần) */}
                {totalAfternoonCount > 0 && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsAfternoonOpen(!isAfternoonOpen)}
                      className="flex w-full items-center justify-between rounded-lg bg-sky-500/10 border border-sky-500/20 px-3 py-2 text-xs font-bold text-sky-700 dark:text-sky-400 hover:bg-sky-500/20 transition cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-500 shrink-0" />
                        <span>Ca Chiều (12:00 - 18:00) ({totalAfternoonCount} sự kiện)</span>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isAfternoonOpen && "rotate-90")} />
                    </button>

                    {isAfternoonOpen && (
                      <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day, idx) => {
                          const daySessions = afternoonSessionsByDay[idx]
                          const isToday =
                            day.getDate() === today.getDate() &&
                            day.getMonth() === today.getMonth() &&
                            day.getFullYear() === today.getFullYear()
                          return (
                            <div
                              key={day.toISOString()}
                              className={cn(
                                "space-y-2 min-w-0 p-1 rounded-md transition-colors",
                                isToday && "bg-primary/[0.03]"
                              )}
                            >
                              {daySessions.map((session) => (
                                <EventCard
                                  key={session.id}
                                  session={session}
                                  onClick={() => handleSelectEvent(session)}
                                  activeBranch={activeBranch}
                                  branchesCount={branches.length}
                                  showTime
                                />
                              ))}
                              {daySessions.length === 0 && (
                                <div className="text-[10px] text-muted-foreground/30 text-center py-2.5 select-none">
                                  —
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Ca Tối (Chỉ hiển thị khi có lịch test ca tối trong tuần) */}
                {totalEveningCount > 0 && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsEveningOpen(!isEveningOpen)}
                      className="flex w-full items-center justify-between rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>Ca Tối (18:00 - 22:00) ({totalEveningCount} sự kiện)</span>
                      </div>
                      <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isEveningOpen && "rotate-90")} />
                    </button>

                    {isEveningOpen && (
                      <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day, idx) => {
                          const daySessions = eveningSessionsByDay[idx]
                          const isToday =
                            day.getDate() === today.getDate() &&
                            day.getMonth() === today.getMonth() &&
                            day.getFullYear() === today.getFullYear()
                          return (
                            <div
                              key={day.toISOString()}
                              className={cn(
                                "space-y-2 min-w-0 p-1 rounded-md transition-colors",
                                isToday && "bg-primary/[0.03]"
                              )}
                            >
                              {daySessions.map((session) => (
                                <EventCard
                                  key={session.id}
                                  session={session}
                                  onClick={() => handleSelectEvent(session)}
                                  activeBranch={activeBranch}
                                  branchesCount={branches.length}
                                  showTime
                                />
                              ))}
                              {daySessions.length === 0 && (
                                <div className="text-[10px] text-muted-foreground/30 text-center py-2.5 select-none">
                                  —
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
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
          booking={getAssociatedBookingTest(selectedEvent) || mockBookingTests[0]}
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

function WeekHeader({
  days,
  today,
  hasSpacer = false,
  sessions,
  now,
}: {
  days: Date[]
  today: Date
  hasSpacer?: boolean
  sessions: EventSession[]
  now: Date
}) {
  return (
    <div className="flex bg-muted/30 border-b border-border/40">
      {/* Spacer for hour column */}
      {hasSpacer && <div className="w-16 shrink-0 border-r border-border/40 bg-muted/10" />}
      {/* Columns */}
      <div className={cn("grid flex-1", days.length === 1 ? "grid-cols-1" : "grid-cols-7")}>
        {days.map((day) => {
          const isToday =
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear()
          const daySessions = sessions.filter((s) => s.date === toDateKey(day))
          const count = daySessions.length
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex flex-col items-center justify-center py-2.5 transition-colors",
                isToday && "bg-primary/5"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className={cn('text-[10px] font-semibold uppercase tracking-wider', isToday ? 'text-primary' : 'text-muted-foreground')}>
                  {day.toLocaleDateString('vi-VN', { weekday: 'short' }).replace('.', '')}
                </span>
                <span className={cn('flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold', isToday ? 'bg-primary text-primary-foreground' : 'text-foreground')}>
                  {day.getDate()}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[9.5px] text-muted-foreground font-semibold">
                  {count} sự kiện
                </span>
                {isToday && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-1.5 py-0.2 text-[8px] font-bold text-red-600 dark:text-red-400">
                    <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                    {formatMinutesToTime(now.getHours() * 60 + now.getMinutes())}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
