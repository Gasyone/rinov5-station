'use client'

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { BookingTestDetailDialog } from '@/components/screens/booking-test/BookingTestDetailDialog'
import { TrialClassDetailDialog } from '@/components/screens/trial-class/TrialClassDetailDialog'
import { readTrialClasses } from '@/components/screens/trial-class/trialClassHelpers'
import {
  getScheduleMonday,
  getScheduleWeekDays,
} from '@/components/screens/schedule/ScheduleTimeGrid'
import { getBookingTests, type BookingTest, mockBookingTests } from '@/mocks/bookingTests'
import { getMockClassSessions, getMockEventSessions, type ClassSession } from '@/mocks/calendarSchedule'
import type { TrialClass } from '@/mocks/trialClasses'
import { ModuleLoadingSkeleton } from '@/components/shared'
import { SessionDetailDialog } from '@/components/screens/calendar/SessionDetailDialog'
import { StudentDetailDialog } from '@/components/screens/students/detail/StudentDetailDialog'

import {
  buildUnifiedSlots,
  filterMyScheduleSlots,
} from './my-schedule/myScheduleHelpers'
import { MyScheduleToolbar } from './my-schedule/MyScheduleToolbar'
import type { ScheduleLayoutType, UnifiedSlot } from './my-schedule/myScheduleTypes'
import { MyScheduleMatrixView } from './my-schedule/MyScheduleMatrixView'
import { MySchedule1DView } from './my-schedule/MySchedule1DView'


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

export interface MyScheduleScreenProps {
  isMySchedule?: boolean
  onIsMyScheduleChange?: (val: boolean) => void
}

export function MyScheduleScreen({
  isMySchedule,
  onIsMyScheduleChange,
}: MyScheduleScreenProps = {}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const allClass = useMemo(() => getMockClassSessions().filter((session) => session.type !== 'digi_session'), [])
  const allEvent = useMemo(() => getMockEventSessions().filter((session) => session.type === 'placement_test'), [])
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [layoutType, setLayoutType] = useState<ScheduleLayoutType>('matrix')
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
  const [selectedClassSession, setSelectedClassSession] = useState<ClassSession | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
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
    const bookingId = slot.id.replace('EVT-', '')
    const directMatch = mockBookingTests.find(b => b.id === bookingId || b.id === slot.id)
    if (directMatch) return directMatch
    if (slot.title) {
      const cleanTitle = slot.title.toLowerCase().trim()
      const nameMatch = mockBookingTests.find(b => 
        b.childName.toLowerCase().trim() === cleanTitle ||
        cleanTitle.includes(b.childName.toLowerCase().trim()) ||
        b.childName.toLowerCase().trim().includes(cleanTitle)
      )
      if (nameMatch) return nameMatch
    }
    return null
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

    if (slot.scheduleType === 'class') {
      if (slot.subtitle.toLowerCase().includes('trial') || slot.typeLabel.toLowerCase().includes('trải nghiệm')) {
        const trial = readTrialClasses().trials.find((item) => item.id === slot.id) || readTrialClasses().trials[0]
        if (trial) setDetailTrial(trial)
        return
      }

      const classSession: ClassSession = {
        id: slot.id,
        classCode: slot.classCode || 'SA1_TA_001',
        className: slot.subtitle,
        subject: slot.subject || 'Tiếng Anh',
        teacher: slot.personLabel || '',
        substituteTeacher: slot.substituteTeacher,
        branch: slot.branch,
        schoolRoom: slot.schoolRoom || '',
        level: slot.level || '',
        date: slot.date,
        dateDisplay: slot.date,
        dateBucket: slot.dateBucket || 'upcoming',
        timeLabel: slot.timeLabel,
        endTimeLabel: slot.endTimeLabel,
        statusLabel: slot.status || '',
        type: (slot.type as ClassSession['type']) || 'class_session',
        typeLabel: slot.typeLabel || 'Chính thức',
        title: slot.title,
        lessonSubtitle: slot.note || '',
        totalStudents: slot.totalStudents || 0,
        officialStudents: (slot.totalStudents || 0) - (slot.trialStudents || 0),
        trialStudents: slot.trialStudents || 0,
        attendedStudents: slot.attendedStudents,
        isOpeningDay: slot.isOpeningDay,
      }
      setSelectedClassSession(classSession)
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

  if (!mounted) {
    return <ModuleLoadingSkeleton className="h-full" />
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <MyScheduleToolbar
        isMySchedule={isMySchedule}
        onIsMyScheduleChange={onIsMyScheduleChange}
        viewMode={viewMode}
        layoutType={layoutType}
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
        onLayoutTypeChange={setLayoutType}
        onBranchChange={setActiveBranch}
        onSearchChange={setSearch}
        onToday={() => setSelectedDate(viewMode === 'day' ? new Date() : getScheduleMonday(new Date()))}
        onNavigate={navigate}
        onFilterOpen={() => setIsFilterOpen(true)}
      />

      {layoutType === 'matrix' ? (
        <MyScheduleMatrixView
          slots={slots}
          days={viewMode === 'day' ? [selectedDate] : getScheduleWeekDays(selectedDate)}
          today={today}
          viewMode={viewMode}
          activeBranch={activeBranch}
          onSlotClick={handleSlotClick}
        />
      ) : (
        <MySchedule1DView
          slots={slots}
          days={viewMode === 'day' ? [selectedDate] : getScheduleWeekDays(selectedDate)}
          today={today}
          viewMode={viewMode}
          activeBranch={activeBranch}
          onSlotClick={handleSlotClick}
        />
      )}


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
        onViewStudentDetail={(studentId) => setSelectedStudentId(studentId)}
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

      <SessionDetailDialog
        session={selectedClassSession}
        open={!!selectedClassSession}
        onOpenChange={(open) => { if (!open) setSelectedClassSession(null) }}
      />

      <StudentDetailDialog
        studentId={selectedStudentId}
        open={!!selectedStudentId}
        onOpenChange={(open) => { if (!open) setSelectedStudentId(null) }}
      />

      {/* Chú giải màu sắc footer */}
      <div className="border-t border-border/40 bg-muted/20 px-3 py-2 lg:px-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">Chú giải màu sắc:</span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-600 dark:bg-emerald-400" />
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Buổi học hôm nay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-white border border-border dark:bg-zinc-800" />
            <span>Buổi học sắp diễn ra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-zinc-400 border border-zinc-500 dark:bg-zinc-500" />
            <span className="font-medium text-zinc-600 dark:text-zinc-400">Buổi học đã diễn ra</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sky-500 border border-sky-600 dark:bg-sky-400" />
            <span className="font-semibold text-sky-700 dark:text-sky-400">Buổi dạy thay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500 border border-red-600 dark:bg-red-400 shadow-sm" />
            <span className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-1">
              Ngày khai giảng (Lớp mới) 
              <span className="inline-flex rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-1.5 py-0.5 text-[8px] font-bold uppercase">KHAI GIẢNG</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-zinc-300 border border-zinc-400 dark:bg-zinc-700 opacity-50" />
            <span className="line-through font-medium text-zinc-400 dark:text-zinc-500">Buổi học đã hủy</span>
          </div>
        </div>
      </div>
    </div>
  )
}
