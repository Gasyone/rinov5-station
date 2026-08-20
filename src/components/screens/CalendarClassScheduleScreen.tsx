'use client'

import { useEffect, useMemo, useState } from 'react'
import { FilterGroupSheetPanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { getMockClassSessions, type ClassSession } from '@/mocks/calendarSchedule'
import { ModuleLoadingSkeleton } from '@/components/shared'
import { toast } from 'sonner'
import { SessionDetailDialog } from './calendar/SessionDetailDialog'
import { DigiSessionDetailDialog } from './calendar/DigiSessionDetailDialog'
import { CalendarClassScheduleToolbar } from './calendar/CalendarClassScheduleToolbar'
import { CalendarClassScheduleListTable } from './calendar/CalendarClassScheduleListTable'
import { CalendarClassScheduleWeekView } from './calendar/CalendarClassScheduleWeekView'
import { CalendarClassScheduleDayView } from './calendar/CalendarClassScheduleDayView'
import { CalendarClassScheduleFooter } from './calendar/CalendarClassScheduleFooter'
import { MyScheduleScreen } from './MyScheduleScreen'
import type { ViewMode, WeekLayoutMode, FilterState } from './calendar/calendarClassScheduleTypes'
import {
  filterSessions,
  formatLabel,
  getMonday,
  getSessionPeriod,
  getWeekDays,
} from './calendar/calendarClassScheduleHelpers'

export function CalendarClassScheduleScreen() {
  const [mounted, setMounted] = useState(false)
  const [isMySchedule, setIsMySchedule] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const allSessions = useMemo(() => {
    return getMockClassSessions()
      .filter((session) => session.type !== 'digi_session')
      .map((session, idx) => {
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

  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [weekLayoutMode, setWeekLayoutMode] = useState<WeekLayoutMode>('shifts')
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeSubject, setActiveSubject] = useState('all')
  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()))

  // Filter States
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

  const filterState: FilterState = useMemo(
    () => ({
      branchFilters,
      levelFilters,
      conditionFilters,
      subjectFilters,
      teacherFilters,
      periodFilters,
      roomFilters,
      trialFilters,
      attendanceFilters,
      capacityFilters,
    }),
    [
      branchFilters,
      levelFilters,
      conditionFilters,
      subjectFilters,
      teacherFilters,
      periodFilters,
      roomFilters,
      trialFilters,
      attendanceFilters,
      capacityFilters,
    ]
  )

  const today = useMemo(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  }, [])

  const filtered = useMemo(() => {
    let list = filterSessions(allSessions, search, activeBranch, filterState)
    if (activeSubject && activeSubject !== 'all') {
      list = list.filter((session) => session.subject === activeSubject)
    }
    return list
  }, [allSessions, search, activeBranch, activeSubject, filterState])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  const subjects = useMemo(() => [...new Set(allSessions.map((session) => session.subject))].sort(), [allSessions])
  const teachers = useMemo(() => [...new Set(allSessions.map((session) => session.teacher))].sort(), [allSessions])
  const branches = SYSTEM_BRANCHES
  const levels = useMemo(() => [...new Set(allSessions.map((session) => session.level))].sort(), [allSessions])
  const rooms = useMemo(() => [...new Set(allSessions.map((session) => session.schoolRoom))].sort(), [allSessions])

  const activeFilterCount =
    branchFilters.length +
    levelFilters.length +
    subjectFilters.length +
    teacherFilters.length +
    periodFilters.length +
    conditionFilters.length +
    roomFilters.length +
    trialFilters.length +
    attendanceFilters.length +
    capacityFilters.length

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
        options: [
          { value: 'morning', label: 'Sáng' },
          { value: 'afternoon', label: 'Chiều' },
          { value: 'evening', label: 'Tối' },
        ],
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
      attendanceFilters, capacityFilters,
    ]
  )

  const calendarTitle =
    viewMode === 'day'
      ? formatLabel(selectedDate, { day: '2-digit', month: 'long', year: 'numeric' })
      : `${formatLabel(weekDays[0], { day: '2-digit', month: 'short' })} - ${formatLabel(weekDays[6], { day: '2-digit', month: 'short' })}`

  const navigate = (dir: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + (viewMode === 'day' ? dir : dir * 7))
    setSelectedDate(date)
  }

  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [isDigiDetailOpen, setIsDigiDetailOpen] = useState(false)

  const handleSelectSession = (session: ClassSession) => {
    setSelectedSession(session)
    if (session.type === 'digi_session') {
      setIsDigiDetailOpen(true)
    } else {
      setDetailOpen(true)
    }
  }

  const handleQuickAttendance = () => {
    toast.success(`Đã mở giao diện điểm danh nhanh cho buổi học: ${selectedSession?.title}`)
    setDetailOpen(false)
  }

  if (!mounted) {
    return <ModuleLoadingSkeleton className="h-full" />
  }

  if (isMySchedule) {
    return (
      <MyScheduleScreen
        isMySchedule={isMySchedule}
        onIsMyScheduleChange={setIsMySchedule}
      />
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <CalendarClassScheduleToolbar
        isMySchedule={isMySchedule}
        onIsMyScheduleChange={setIsMySchedule}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        weekLayoutMode={weekLayoutMode}
        onWeekLayoutModeChange={setWeekLayoutMode}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        onNavigate={navigate}
        calendarTitle={calendarTitle}
        activeBranch={activeBranch}
        onActiveBranchChange={setActiveBranch}
        activeSubject={activeSubject}
        onActiveSubjectChange={setActiveSubject}
        subjects={subjects}
        search={search}
        onSearchChange={setSearch}
        activeFilterCount={activeFilterCount}
        onOpenFilter={() => setIsFilterOpen(true)}
      />

      {viewMode === 'day' ? (
        <>
          <CalendarClassScheduleDayView
            selectedDate={selectedDate}
            today={today}
            filteredSessions={filtered}
            onSelectSession={handleSelectSession}
          />
          <CalendarClassScheduleFooter />
        </>
      ) : viewMode === 'week' ? (
        <>
          <CalendarClassScheduleWeekView
            weekDays={weekDays}
            today={today}
            filteredSessions={filtered}
            weekLayoutMode={weekLayoutMode}
            onSelectSession={handleSelectSession}
          />
          <CalendarClassScheduleFooter />
        </>
      ) : (
        <CalendarClassScheduleListTable
          sessions={filtered}
          onSelectSession={handleSelectSession}
        />
      )}

      <FilterGroupSheetPanel
        open={isFilterOpen}
        title="Bộ lọc lịch học trung tâm"
        description="Lọc buổi học theo chi nhánh, trình độ, môn học và khoảng thời gian."
        groups={filterGroups}
        onOpenChange={setIsFilterOpen}
        onToggle={(sectionId, value) => {
          const toggleHandler = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
            setter((current) => (current.includes(value) ? current.filter((i) => i !== value) : [...current, value]))
          }
          if (sectionId === 'branches') toggleHandler(setBranchFilters)
          else if (sectionId === 'levels') toggleHandler(setLevelFilters)
          else if (sectionId === 'conditions') toggleHandler(setConditionFilters)
          else if (sectionId === 'periods') toggleHandler(setPeriodFilters)
          else if (sectionId === 'subjects') toggleHandler(setSubjectFilters)
          else if (sectionId === 'teachers') toggleHandler(setTeacherFilters)
          else if (sectionId === 'rooms') toggleHandler(setRoomFilters)
          else if (sectionId === 'trial_students') toggleHandler(setTrialFilters)
          else if (sectionId === 'attendance') toggleHandler(setAttendanceFilters)
          else if (sectionId === 'capacity') toggleHandler(setCapacityFilters)
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

      <DigiSessionDetailDialog
        session={selectedSession}
        open={isDigiDetailOpen}
        onOpenChange={setIsDigiDetailOpen}
      />
    </div>
  )
}
