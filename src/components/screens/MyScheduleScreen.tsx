'use client'

import { useMemo, useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react'
import {
  BranchSelect,
  ExpandableSearch,
  FilterIconButton,
  IconActionButton,
  SegmentedControl,
} from '@/components/controls'
import { FilterSheetPanel, type FilterSection } from '@/components/filters'
import { Button } from '@/components/ui/button'
import { getMockClassSessions, getMockEventSessions } from '@/mocks/calendarSchedule'
import {
  getScheduleMonday,
  getScheduleWeekDays,
  parseScheduleTime,
  ScheduleTimeGrid,
  toScheduleDateKey,
  type ScheduleGridItem,
} from '@/components/screens/schedule/ScheduleTimeGrid'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

const VIEW_MODES = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
]

const FILTER_BUCKETS = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'upcoming', label: 'Sắp diễn ra' },
]

const SOURCE_FILTERS = [
  { value: 'class', label: 'Lớp học' },
  { value: 'event', label: 'Sự kiện' },
]

interface UnifiedSlot extends ScheduleGridItem {
  id: string
  scheduleType: 'class' | 'event'
  title: string
  subtitle: string
  date: string
  timeLabel: string
  endTimeLabel: string
  branch: string
  personLabel: string
  type: string
  typeLabel: string
  totalStudents?: number
  trialStudents?: number
}

const formatLabel = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString('vi-VN', opts)
const lineClamp2 = 'overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]'

export function MyScheduleScreen() {
  const allClass = useMemo(() => getMockClassSessions(), [])
  const allEvent = useMemo(() => getMockEventSessions(), [])
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [bucketFilters, setBucketFilters] = useState<string[]>([])
  const [sourceFilters, setSourceFilters] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(() => getScheduleMonday(new Date()))

  const today = useMemo(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  }, [])

  const slots = useMemo<UnifiedSlot[]>(() => {
    const merged: UnifiedSlot[] = [
      ...allClass.map((session) => ({
        id: session.id,
        scheduleType: 'class' as const,
        title: session.title,
        subtitle: session.className,
        date: session.date,
        timeLabel: session.timeLabel,
        endTimeLabel: session.endTimeLabel,
        branch: session.branch,
        personLabel: session.teacher,
        type: session.type,
        typeLabel: session.typeLabel,
        totalStudents: session.totalStudents,
        trialStudents: session.trialStudents,
        startMin: parseScheduleTime(session.timeLabel),
      })),
      ...allEvent.map((session) => ({
        id: session.id,
        scheduleType: 'event' as const,
        title: session.title,
        subtitle: session.location,
        date: session.date,
        timeLabel: session.timeLabel,
        endTimeLabel: session.endTimeLabel,
        branch: session.branch,
        personLabel: session.organizer,
        type: session.type,
        typeLabel: session.typeLabel,
        startMin: parseScheduleTime(session.timeLabel),
      })),
    ]

    return merged
      .filter((slot) => {
        if (activeBranch !== 'all' && slot.branch !== activeBranch) return false
        if (bucketFilters.length > 0) {
          const slotDate = new Date(slot.date)
          slotDate.setHours(0, 0, 0, 0)
          const matchesToday = bucketFilters.includes('today') && slot.date === toScheduleDateKey(today)
          const matchesUpcoming = bucketFilters.includes('upcoming') && slotDate > today
          if (!matchesToday && !matchesUpcoming) return false
        }
        if (sourceFilters.length > 0 && !sourceFilters.includes(slot.scheduleType)) return false
        if (search) {
          const query = search.toLowerCase()
          if (
            !slot.title.toLowerCase().includes(query) &&
            !slot.subtitle.toLowerCase().includes(query) &&
            !slot.personLabel.toLowerCase().includes(query)
          ) return false
        }
        return true
      })
      .sort((a, b) => a.startMin - b.startMin || a.date.localeCompare(b.date))
  }, [activeBranch, allClass, allEvent, bucketFilters, search, sourceFilters, today])

  const branches = useMemo(
    () => [...new Set([...allClass.map((session) => session.branch), ...allEvent.map((session) => session.branch)])],
    [allClass, allEvent]
  )
  const activeFilterCount = bucketFilters.length + sourceFilters.length
  const filterSections = useMemo<FilterSection[]>(
    () => [
      {
        id: 'buckets',
        title: 'Khoảng thời gian',
        options: FILTER_BUCKETS.map((bucket) => ({
          value: bucket.value,
          label: bucket.label,
          checked: bucketFilters.includes(bucket.value),
        })),
      },
      {
        id: 'sources',
        title: 'Nguồn lịch',
        options: SOURCE_FILTERS.map((source) => ({
          value: source.value,
          label: source.label,
          checked: sourceFilters.includes(source.value),
        })),
      },
    ],
    [bucketFilters, sourceFilters]
  )

  const titleDate = viewMode === 'day'
    ? formatLabel(selectedDate, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    : `${formatLabel(getScheduleWeekDays(selectedDate)[0], { day: '2-digit', month: 'long' })} - ${formatLabel(getScheduleWeekDays(selectedDate)[6], { day: '2-digit', month: 'short', year: 'numeric' })}`

  const navigate = (dir: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + (viewMode === 'day' ? dir : dir * 7))
    setSelectedDate(date)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between lg:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedDate(viewMode === 'day' ? new Date() : getScheduleMonday(new Date()))}>
            Hôm nay
          </Button>
          <div className="flex items-center gap-0.5">
            <IconActionButton icon={ChevronLeft} label="Trước" onClick={() => navigate(-1)} className="size-7" />
            <IconActionButton icon={ChevronRight} label="Sau" onClick={() => navigate(1)} className="size-7" />
          </div>
          <h2 className="text-sm font-semibold">{titleDate}</h2>
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
            label="Tìm lịch của tôi"
            placeholder="Tìm lịch..."
            inputClassName="sm:w-72"
          />
          <FilterIconButton count={activeFilterCount} label="Lọc lịch của tôi" onClick={() => setIsFilterOpen(true)} />
        </div>
      </div>

      <ScheduleTimeGrid
        items={slots}
        days={viewMode === 'day' ? [selectedDate] : getScheduleWeekDays(selectedDate)}
        today={today}
        renderItem={(slot) => <UnifiedCard slot={slot} compact />}
      />

      <FilterSheetPanel
        open={isFilterOpen}
        title="Bộ lọc lịch của tôi"
        description="Lọc lịch theo thời gian và nguồn lịch."
        sections={filterSections}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          if (sectionId === 'buckets') {
            setBucketFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          }
          if (sectionId === 'sources') {
            setSourceFilters((current) =>
              current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
            )
          }
        }}
        onClearAll={() => {
          setBucketFilters([])
          setSourceFilters([])
        }}
      />
    </div>
  )
}

function UnifiedCard({ slot, compact }: { slot: UnifiedSlot; compact?: boolean }) {
  const isClass = slot.scheduleType === 'class'

  return (
    <div className={cn('group flex min-h-[64px] flex-col overflow-hidden rounded-md bg-card text-left shadow-sm transition hover:bg-accent/60', compact && 'h-full p-2')}>
      <div className={compact ? '' : 'p-3'}>
        <div className="mb-1 flex items-center justify-between gap-2">
          <div className={cn('flex items-center gap-1 font-bold text-primary', compact ? 'text-[10px]' : 'text-[11px]')}>
            <Clock className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            {slot.timeLabel} - {slot.endTimeLabel}
          </div>
          <span className={cn('ml-auto inline-block shrink-0 rounded border px-1 py-0.5 font-semibold', compact ? 'text-[7px]' : 'text-[8px]', getStatusBadgeClass(slot.type))}>
            {slot.typeLabel}
          </span>
        </div>
        <h4 className={cn('font-bold leading-tight', compact ? `text-[10px] ${lineClamp2}` : 'truncate text-[12px]')}>
          {slot.title}
        </h4>
        <div className={cn('mt-1 text-muted-foreground', compact ? 'text-[9px]' : 'space-y-1 text-[10px]')}>
          <div className="flex items-center gap-1">
            {isClass ? <BookOpen className="h-3 w-3 shrink-0" /> : <MapPin className="h-3 w-3 shrink-0" />}
            <span className="truncate">{slot.subtitle}</span>
          </div>
          {!compact && isClass && slot.totalStudents !== undefined ? (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 shrink-0" />
              <span>{slot.totalStudents} học viên ({slot.trialStudents} học thử)</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
