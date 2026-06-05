'use client'

import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { BookingTestDetailDialog } from '@/components/screens/booking-test/BookingTestDetailDialog'
import { TrialClassDetailDialog } from '@/components/screens/trial-class/TrialClassDetailDialog'
import { readTrialClasses } from '@/components/screens/trial-class/trialClassHelpers'
import {
  getScheduleMonday,
  getScheduleWeekDays,
  ScheduleTimeGrid,
} from '@/components/screens/schedule/ScheduleTimeGrid'
import { getBookingTests, type BookingTest, mockBookingTests } from '@/mocks/bookingTests'
import { getMockClassSessions, getMockEventSessions } from '@/mocks/calendarSchedule'
import type { TrialClass } from '@/mocks/trialClasses'
import { MyScheduleCard } from './my-schedule-v2/MyScheduleCard'
import {
  buildUnifiedSlots,
  filterMyScheduleSlots,
} from './my-schedule-v2/myScheduleHelpers'
import { MyScheduleToolbar } from './my-schedule-v2/MyScheduleToolbar'
import type { UnifiedSlot } from './my-schedule-v2/myScheduleTypes'

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

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'confirmed', label: 'Đã booking' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'rescheduled', label: 'Đổi ngày' },
]

const TYPE_OPTIONS = [
  { value: 'placement_test', label: 'Lịch Trải nghiệm' },
  { value: 'class_session', label: 'Lịch học' },
]

const SOURCE_FILTERS = [
  { value: 'class', label: 'Lớp học' },
  { value: 'event', label: 'Sự kiện' },
]

const formatLabel = (date: Date, opts: Intl.DateTimeFormatOptions) => date.toLocaleDateString('vi-VN', opts)

export function MyScheduleScreenV2() {
  const allClass = useMemo(() => {
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
  const allEvent = useMemo(() => {
    return getMockEventSessions()
      .filter((session) => session.type === 'placement_test' || session.type === 'event')
      .map((session, idx) => {
        let updatedSession = { ...session }
        if (session.type === 'event') {
          const seed = session.title.charCodeAt(0) + session.title.length
          const maxParticipants = 100 + (seed % 6) * 25
          const participants = maxParticipants - 3 - (seed % 8)
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
  const [bucketFilters, setBucketFilters] = useState<string[]>([])
  const [sourceFilters, setSourceFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [subjectFilters, setSubjectFilters] = useState<string[]>([])
  const [roomFilters, setRoomFilters] = useState<string[]>([])
  const [conditionFilters, setConditionFilters] = useState<string[]>([])

  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => getScheduleMonday(new Date()))
  const [detailBooking, setDetailBooking] = useState<BookingTest | null>(null)
  const [detailTrial, setDetailTrial] = useState<TrialClass | null>(null)
  const [detailNote, setDetailNote] = useState('')
  const [copiedKey, setCopiedKey] = useState('')

  const today = useMemo(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  }, [])

  const slots = useMemo<UnifiedSlot[]>(() => {
    return filterMyScheduleSlots(buildUnifiedSlots(allClass, allEvent), {
      activeBranch,
      bucketFilters,
      sourceFilters,
      statusFilters,
      typeFilters,
      search,
      today,
      subjectFilters,
      roomFilters,
      conditionFilters,
    })
  }, [
    activeBranch, allClass, allEvent, bucketFilters, search, sourceFilters, statusFilters, 
    typeFilters, today, subjectFilters, roomFilters, conditionFilters
  ])

  const branches = useMemo(
    () => [...new Set([...allClass.map((session) => session.branch), ...allEvent.map((session) => session.branch)])],
    [allClass, allEvent]
  )

  const allSubjects = useMemo(() => {
    const subjects = [
      ...allClass.map((s) => s.subject),
      ...allEvent.map((s) => s.subject),
      ...mockBookingTests.map((b) => b.program),
    ].filter(Boolean) as string[]
    return [...new Set(subjects)].sort()
  }, [allClass, allEvent])

  const allRooms = useMemo(() => {
    const rooms = [
      ...allClass.map((s) => s.schoolRoom),
      ...mockBookingTests.map((b) => b.room),
      ...mockBookingTests.map((b) => b.classroom),
    ].filter(Boolean) as string[]
    return [...new Set(rooms)].sort()
  }, [allClass])

  const getAssociatedBookingTest = (slot: UnifiedSlot) => {
    if (slot.id === 'EVT-CUSTOM-001') return mockBookingTests.find(b => b.id === 'E0007')
    if (slot.id === 'EVT-CUSTOM-002') return mockBookingTests.find(b => b.id === 'E0001')
    if (slot.id === 'EVT-CUSTOM-003') return mockBookingTests.find(b => b.id === 'E0006')
    const seed = slot.title.charCodeAt(0) + slot.title.length
    const bookingIdx = seed % mockBookingTests.length
    return mockBookingTests[bookingIdx]
  }

  const activeFilterCount = (
    bucketFilters.length + sourceFilters.length + statusFilters.length + typeFilters.length +
    subjectFilters.length + roomFilters.length + conditionFilters.length
  )
  
  const titleDate = viewMode === 'day'
    ? formatLabel(selectedDate, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    : `${formatLabel(getScheduleWeekDays(selectedDate)[0], { day: '2-digit', month: 'long' })} - ${formatLabel(getScheduleWeekDays(selectedDate)[6], { day: '2-digit', month: 'short', year: 'numeric' })}`

  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'buckets',
        options: PERIOD_OPTIONS,
        selectedValues: bucketFilters,
        getOptionCount: (period) => slots.filter((slot) => getSessionPeriod(slot.timeLabel) === period).length,
      }),
      createFilterGroup({
        id: 'sources',
        title: 'Nguồn lịch',
        options: SOURCE_FILTERS,
        selectedValues: sourceFilters,
      }),
      createFilterGroup({
        id: 'statuses',
        options: STATUS_OPTIONS,
        selectedValues: statusFilters,
        getOptionCount: (status) => slots.filter((slot) => {
          if (status === 'confirmed') {
            return slot.status === 'confirmed' || slot.status === 'scheduled'
          }
          if (status === 'cancelled') {
            return slot.status === 'cancelled' || slot.status === undefined
          }
          return slot.status === status
        }).length,
      }),
      createFilterGroup({
        id: 'types',
        title: 'Loại lịch',
        options: TYPE_OPTIONS,
        selectedValues: typeFilters,
        getOptionCount: (type) => slots.filter((slot) => {
          if (type === 'class_session') {
            return slot.type === 'class_session' || slot.type === 'supplementary' || slot.type === 'planned'
          }
          return slot.type === type
        }).length,
      }),
      createFilterGroup({
        id: 'subjectFilters',
        title: 'Môn học & Chương trình',
        options: allSubjects,
        selectedValues: subjectFilters,
        getOptionCount: (subject) => slots.filter((slot) => {
          if (slot.scheduleType === 'class') return slot.subject === subject
          const booking = getAssociatedBookingTest(slot)
          return slot.subject === subject || (booking && booking.program === subject)
        }).length,
      }),
      createFilterGroup({
        id: 'roomFilters',
        title: 'Phòng học & Vị trí',
        options: allRooms,
        selectedValues: roomFilters,
        getOptionCount: (room) => slots.filter((slot) => {
          if (slot.scheduleType === 'class') return slot.schoolRoom === room
          const booking = getAssociatedBookingTest(slot)
          return (booking && booking.room === room) || (booking && booking.classroom === room)
        }).length,
      }),
      createFilterGroup({
        id: 'conditionFilters',
        title: 'Điều kiện đặc biệt',
        options: [
          {
            value: 'trial',
            label: 'Có học viên học thử',
            count: slots.filter((slot) => slot.scheduleType === 'class' && (slot.trialStudents || 0) > 0).length,
          },
          {
            value: 'substitute',
            label: 'Lớp dạy thay',
            count: slots.filter((slot) => slot.scheduleType === 'class' && slot.substituteTeacher).length,
          },
          {
            value: 'opening',
            label: 'Lớp khai giảng',
            count: slots.filter((slot) => slot.scheduleType === 'class' && slot.isOpeningDay).length,
          },
          {
            value: 'attended',
            label: 'Đã điểm danh (Lớp)',
            count: slots.filter((slot) => slot.scheduleType === 'class' && slot.attendedStudents !== undefined).length,
          },
          {
            value: 'capacity',
            label: 'Sĩ số lớn (từ 15 HS)',
            count: slots.filter((slot) => slot.scheduleType === 'class' && (slot.totalStudents || 0) >= 15).length,
          },
        ],
        selectedValues: conditionFilters,
      }),
    ],
    [bucketFilters, sourceFilters, statusFilters, typeFilters, slots, allSubjects, allRooms, subjectFilters, roomFilters, conditionFilters]
  )

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
    toast.success('Đã sao chép')
  }

  const handleSlotClick = (slot: UnifiedSlot) => {
    if (slot.scheduleType === 'event' && slot.type === 'placement_test') {
      const booking = getBookingTests().find((item) => item.id === slot.id) || getBookingTests()[0]
      if (booking) setDetailBooking(booking)
      return
    }

    if (slot.scheduleType === 'class' && (slot.subtitle.toLowerCase().includes('trial') || slot.typeLabel.toLowerCase().includes('trải nghiệm'))) {
      const trial = readTrialClasses().trials.find((item) => item.id === slot.id) || readTrialClasses().trials[0]
      if (trial) setDetailTrial(trial)
      return
    }

    toast.info('Tính năng đang phát triển cho loại lịch này.')
  }

  const navigate = (direction: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + (viewMode === 'day' ? direction : direction * 7))
    setSelectedDate(date)
  }

  const toggleFilterValue = (
    value: string,
    setter: Dispatch<SetStateAction<string[]>>
  ) => {
    setter((current) => (
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    ))
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <MyScheduleToolbar
        viewMode={viewMode}
        titleDate={titleDate}
        branches={branches}
        activeBranch={activeBranch}
        search={search}
        activeFilterCount={activeFilterCount}
        onViewModeChange={(value) => {
          setViewMode(value)
          if (value === 'day') {
            setSelectedDate(new Date())
          } else {
            setSelectedDate(getScheduleMonday(selectedDate))
          }
        }}
        onBranchChange={setActiveBranch}
        onSearchChange={setSearch}
        onToday={() => setSelectedDate(viewMode === 'day' ? new Date() : getScheduleMonday(new Date()))}
        onNavigate={navigate}
        onFilterOpen={() => setIsFilterOpen(true)}
      />

      <ScheduleTimeGrid
        items={slots}
        days={viewMode === 'day' ? [selectedDate] : getScheduleWeekDays(selectedDate)}
        today={today}
        overlapLayout="columns"
        renderItem={(slot, context) => (
          <MyScheduleCard
            slot={slot}
            compact
            isOverlapped={context.isOverlapped}
            showTime={false}
            onClick={() => handleSlotClick(slot)}
          />
        )}
      />

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc lịch của tôi"
        description="Lọc lịch theo thời gian và nguồn lịch."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'buckets') toggleFilterValue(value, setBucketFilters)
          if (sectionId === 'sources') toggleFilterValue(value, setSourceFilters)
          if (sectionId === 'statuses') toggleFilterValue(value, setStatusFilters)
          if (sectionId === 'types') toggleFilterValue(value, setTypeFilters)
          if (sectionId === 'subjectFilters') toggleFilterValue(value, setSubjectFilters)
          if (sectionId === 'roomFilters') toggleFilterValue(value, setRoomFilters)
          if (sectionId === 'conditionFilters') toggleFilterValue(value, setConditionFilters)
        }}
        onClearAll={() => {
          setBucketFilters([])
          setSourceFilters([])
          setStatusFilters([])
          setTypeFilters([])
          setSubjectFilters([])
          setRoomFilters([])
          setConditionFilters([])
        }}
      />

      <BookingTestDetailDialog
        booking={detailBooking}
        detailNote={detailNote}
        copiedKey={copiedKey}
        onOpenChange={(open) => { if (!open) setDetailBooking(null) }}
        onUpdateBooking={(id, updater) => {
          if (detailBooking && detailBooking.id === id) setDetailBooking(updater(detailBooking))
          toast.success('Đã cập nhật (Demo)')
        }}
        onOpenAssessment={() => toast.info('Mở form đánh giá')}
        onCall={(phone) => toast.info(`Gọi đến ${phone}`)}
        onCopy={(text, key) => Promise.resolve(handleCopy(text, key))}
        onDetailNoteChange={setDetailNote}
        onAddNote={() => {
          if (!detailNote.trim()) return
          toast.success('Đã thêm ghi chú')
          setDetailNote('')
        }}
      />

      <TrialClassDetailDialog
        trial={detailTrial}
        onOpenChange={(open) => { if (!open) setDetailTrial(null) }}
        onCopy={handleCopy}
        copiedKey={copiedKey}

        onRequestReschedule={() => toast.info('Yêu cầu đổi lịch')}
        onUpdateTrial={(id, updater) => {
          if (detailTrial && detailTrial.id === id) setDetailTrial(updater(detailTrial))
          toast.success('Đã cập nhật')
        }}
      />

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
    </div>
  )
}
