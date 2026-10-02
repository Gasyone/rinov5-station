'use client'

import { useEffect, useMemo, useState } from 'react'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { getMockClassSessions, type ClassSession } from '@/mocks/calendarSchedule'
import { ModuleLoadingSkeleton } from '@/components/shared'
import { toast } from 'sonner'
import { SessionDetailDialog } from './calendar/SessionDetailDialog'
import { DigiSessionDetailDialog } from './calendar/DigiSessionDetailDialog'
import { CalendarClassScheduleToolbar } from './calendar/CalendarClassScheduleToolbar'
import { CalendarClassScheduleWeekView } from './calendar/CalendarClassScheduleWeekView'
import { CalendarClassScheduleDayView } from './calendar/CalendarClassScheduleDayView'
import { CalendarClassScheduleFooter } from './calendar/CalendarClassScheduleFooter'
import { CalendarClassScheduleFilterPanel } from './calendar/CalendarClassScheduleFilterPanel'
import type { ViewMode, FilterState } from './calendar/calendarClassScheduleTypes'
import { DEFAULT_FILTER_STATE } from './calendar/calendarClassScheduleTypes'
import {
  filterSessions,
  formatLabel,
  getMonday,
  getWeekDays,
  countActiveFilters,
} from './calendar/calendarClassScheduleHelpers'

export function CalendarClassScheduleScreen() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const allSessions = useMemo(() => {
    return getMockClassSessions()
      .filter((session) => session.type !== 'digi_session')
      .map((session, idx) => {
        const updatedSession = { ...session }
        if (idx % 7 === 0) {
          updatedSession.status = 'rescheduled' as const
          updatedSession.statusLabel = 'Đổi ngày'
        }
        return updatedSession
      })
  }, [])

  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [search, setSearch] = useState('')
  const [activeBranch, setActiveBranch] = useState(SYSTEM_BRANCHES[0] ?? 'RinoEdu Nguyễn Tuân')
  const [activeSubject, setActiveSubject] = useState('all')
  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()))

  // Bộ lọc đã áp dụng (Chỉ cập nhật khi bấm 'Áp dụng', không lọc realtime)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_FILTER_STATE)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const branches = SYSTEM_BRANCHES

  const roomsByBranch = useMemo(() => {
    const map: Record<string, string[]> = {}
    branches.forEach((b) => {
      const branchRooms = [...new Set(allSessions.filter((s) => s.branch === b).map((s) => s.schoolRoom))].sort()
      map[b] = branchRooms.length > 0 ? branchRooms : ['Phòng 1', 'Phòng 2', 'Phòng 3']
    })
    return map
  }, [branches, allSessions])

  const activeFilterCount = useMemo(() => countActiveFilters(appliedFilters), [appliedFilters])

  const today = useMemo(() => {
    const value = new Date()
    value.setHours(0, 0, 0, 0)
    return value
  }, [])

  const filtered = useMemo(() => {
    let list = filterSessions(allSessions, search, activeBranch, appliedFilters)
    if (activeSubject && activeSubject !== 'all') {
      list = list.filter((session) => session.subject === activeSubject)
    }
    return list
  }, [allSessions, search, activeBranch, activeSubject, appliedFilters])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])
  const subjects = useMemo(() => [...new Set(allSessions.map((session) => session.subject))].sort(), [allSessions])

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

  return (
    <div className="flex h-full min-h-0 flex-col">
      <CalendarClassScheduleToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
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
        onOpenFilter={() => setIsFilterOpen((prev) => !prev)}
      />

      <div className="flex flex-1 min-h-0 w-full gap-3 overflow-hidden">
        <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
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
          ) : (
            <>
              <CalendarClassScheduleWeekView
                weekDays={weekDays}
                today={today}
                filteredSessions={filtered}
                onSelectSession={handleSelectSession}
              />
              <CalendarClassScheduleFooter />
            </>
          )}
        </div>

        {isFilterOpen && (
          <CalendarClassScheduleFilterPanel
            onClose={() => setIsFilterOpen(false)}
            appliedFilters={appliedFilters}
            onApply={(newFilters) => {
              setAppliedFilters(newFilters)
            }}
            allSessions={allSessions}
            branches={branches}
            roomsByBranch={roomsByBranch}
          />
        )}
      </div>

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
