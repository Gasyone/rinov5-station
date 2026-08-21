'use client'

import { useState, useMemo, useEffect } from 'react'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { ModuleLoadingSkeleton } from '@/components/shared'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { INITIAL_DIGI_BOOKINGS, type DigiStudentBooking } from '@/mocks/digiSchedule'
import { DigiScheduleToolbar } from './DigiScheduleToolbar'
import { DigiScheduleWeekView } from './DigiScheduleWeekView'
import { DigiScheduleFooter } from './DigiScheduleFooter'
import { DigiSessionDetailDialog } from '../calendar/DigiSessionDetailDialog'
import { DigiAddStudentDialog } from '../calendar/DigiAddStudentDialog'
import type { DigiScheduleFilterState, ClassSession } from './DigiScheduleTypes'
import { toast } from 'sonner'
import {
  getMonday,
  getWeekDays,
  formatLabel,
  toDateKey,
  getDigiCalendarSessions,
  filterDigiSessions,
  DIGI_ASSISTANTS,
} from './DigiScheduleHelpers'

export function DigiScheduleScreen() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Core Data State
  const [bookings, setBookings] = useState<DigiStudentBooking[]>(() => INITIAL_DIGI_BOOKINGS)
  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()))

  // Top Filters
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState('all')

  // Filter Sheet Panel States
  const [branchFilters, setBranchFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [assistantFilters, setAssistantFilters] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Dialog States
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null)
  const [isSessionDetailOpen, setIsSessionDetailOpen] = useState(false)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)

  const filterState: DigiScheduleFilterState = useMemo(
    () => ({
      branches: branchFilters,
      statuses: statusFilters,
      assistants: assistantFilters,
    }),
    [branchFilters, statusFilters, assistantFilters]
  )

  const activeFilterCount =
    branchFilters.length + statusFilters.length + assistantFilters.length

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  const calendarTitle = useMemo(() => {
    return `${formatLabel(weekDays[0], { day: '2-digit', month: 'short' })} - ${formatLabel(weekDays[6], { day: '2-digit', month: 'short', year: 'numeric' })}`
  }, [weekDays])

  const navigate = (dir: number) => {
    const next = new Date(selectedDate)
    next.setDate(next.getDate() + dir * 7)
    setSelectedDate(getMonday(next))
  }

  // Calendar Sessions Generation (18:00 - 21:00)
  const allCalendarSessions = useMemo(() => {
    return getDigiCalendarSessions(bookings, selectedDate)
  }, [bookings, selectedDate])

  const filteredSessions = useMemo(() => {
    return filterDigiSessions(allCalendarSessions, search, activeBranch, filterState)
  }, [allCalendarSessions, search, activeBranch, filterState])

  const handleSelectSession = (session: ClassSession) => {
    setSelectedSession(session)
    setIsSessionDetailOpen(true)
  }

  // Filter groups configuration (Bỏ lọc theo phòng học)
  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      createFilterGroup({
        id: 'branches',
        title: 'Chi nhánh cơ sở',
        options: SYSTEM_BRANCHES.map((b) => ({ value: b, label: b })),
        selectedValues: branchFilters,
        getOptionCount: (branch) => allCalendarSessions.filter((s) => s.branch === branch).length,
      }),
      createFilterGroup({
        id: 'assistants',
        title: 'Trợ giảng phụ trách',
        options: DIGI_ASSISTANTS.map((a) => ({ value: a, label: a })),
        selectedValues: assistantFilters,
        getOptionCount: (ast) => allCalendarSessions.filter((s) => s.assistantTeacher === ast).length,
      }),
      createFilterGroup({
        id: 'statuses',
        title: 'Trạng thái ca',
        options: [
          { value: 'confirmed', label: 'Đang diễn ra' },
          { value: 'pending', label: 'Đã lên lịch' },
          { value: 'completed', label: 'Đã hoàn thành' },
        ],
        selectedValues: statusFilters,
        getOptionCount: (st) => allCalendarSessions.filter((s) => s.status === st).length,
      }),
    ],
    [branchFilters, assistantFilters, statusFilters, allCalendarSessions]
  )

  if (!mounted) {
    return <ModuleLoadingSkeleton className="h-full" />
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* 1. Single Row Toolbar */}
      <DigiScheduleToolbar
        onSelectedDateChange={setSelectedDate}
        onNavigate={navigate}
        calendarTitle={calendarTitle}
        activeBranch={activeBranch}
        onActiveBranchChange={setActiveBranch}
        search={search}
        onSearchChange={setSearch}
        activeFilterCount={activeFilterCount}
        onOpenFilter={() => setIsFilterOpen(true)}
        onAddStudent={() => setIsAddStudentOpen(true)}
      />

      {/* 2. Main Week Timeline Calendar with 18h - 21h Time Column */}
      <DigiScheduleWeekView
        weekDays={weekDays}
        today={today}
        filteredSessions={filteredSessions}
        onSelectSession={handleSelectSession}
        hideBranch={activeBranch !== 'all' || branchFilters.length === 1}
      />

      {/* 3. Footer Color Legend */}
      <DigiScheduleFooter />

      {/* 4. Filter Sheet */}
      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc ca học Digi"
        description="Lọc ca tự học Digi theo chi nhánh, trợ giảng và trạng thái ca."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          const toggleHandler = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
            setter((current) => (current.includes(value) ? current.filter((i) => i !== value) : [...current, value]))
          }
          if (sectionId === 'branches') toggleHandler(setBranchFilters)
          else if (sectionId === 'assistants') toggleHandler(setAssistantFilters)
          else if (sectionId === 'statuses') toggleHandler(setStatusFilters)
        }}
        onClearAll={() => {
          setBranchFilters([])
          setAssistantFilters([])
          setStatusFilters([])
        }}
      />

      {/* 5. Session Detail Dialog */}
      <DigiSessionDetailDialog
        session={selectedSession}
        open={isSessionDetailOpen}
        onOpenChange={setIsSessionDetailOpen}
      />

      {/* 6. Add Student Booking Dialog */}
      <DigiAddStudentDialog
        open={isAddStudentOpen}
        onOpenChange={setIsAddStudentOpen}
        roomName="Phòng tự học Digi"
        date={toDateKey(today)}
        existingBookings={bookings}
        onConfirm={(newBookingOrList) => {
          const list = Array.isArray(newBookingOrList) ? newBookingOrList : [newBookingOrList]
          setBookings((prev) => [...prev, ...list])
          if (list.length === 1) {
            toast.success(`Đã thêm lịch cho ${list[0].studentName} thành công!`)
          } else {
            toast.success(`Đã thêm lịch cho ${list.length} học viên thành công!`)
          }
        }}
      />
    </div>
  )
}

