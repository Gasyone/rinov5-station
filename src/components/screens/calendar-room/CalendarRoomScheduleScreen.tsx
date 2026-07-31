'use client'

import { useMemo, useState } from 'react'
import { CalendarRoomToolbar } from './CalendarRoomToolbar'
import { CalendarRoomMatrixTable } from './CalendarRoomMatrixTable'
import { CalendarRoomAssignDialog } from './CalendarRoomAssignDialog'
import { filterRooms, formatLabel, getMockRooms, getMonday, getWeekDays } from './calendarRoomHelpers'
import type { RoomRecord, RoomSessionSlot, RoomStatusTileId } from './calendarRoomTypes'
import { StatusTiles } from '@/components/shared'
import { toast } from 'sonner'

export function CalendarRoomScheduleScreen() {
  const [branch, setBranch] = useState('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week')
  const [activeStatusTile, setActiveStatusTile] = useState<RoomStatusTileId>('all')

  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()))

  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<RoomRecord | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('18:00 - 19:30')

  const allRooms = useMemo(() => getMockRooms(), [])

  // Week days calculation
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  const calendarTitle = useMemo(() => {
    return viewMode === 'day'
      ? formatLabel(selectedDate, { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
      : `${formatLabel(weekDays[0], { day: '2-digit', month: '2-digit' })} - ${formatLabel(weekDays[6], { day: '2-digit', month: '2-digit', year: 'numeric' })}`
  }, [viewMode, selectedDate, weekDays])

  const handleNavigate = (dir: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + (viewMode === 'day' ? dir : dir * 7))
    setSelectedDate(date)
  }

  const handleToday = () => {
    setSelectedDate(viewMode === 'day' ? new Date() : getMonday(new Date()))
  }

  // Count statuses for Status Tiles
  const statusCounts = useMemo(() => {
    let active = 0
    let free = 0
    let conflict = 0

    allRooms.forEach((r) => {
      if (r.sessions.some((s) => s.status === 'conflict')) conflict++
      if (r.sessions.some((s) => s.status === 'active')) active++
      if (r.sessions.length === 0) free++
    })

    return {
      all: allRooms.length,
      active,
      free,
      conflict,
    }
  }, [allRooms])

  const filteredRooms = useMemo(() => {
    return filterRooms(allRooms, {
      search,
      branch,
      statusTile: activeStatusTile,
      roomType: 'all',
    })
  }, [allRooms, search, branch, activeStatusTile])

  const handleSlotClick = (room: RoomRecord, timeSlotOrDay: string) => {
    setSelectedRoom(room)
    setSelectedTimeSlot(timeSlotOrDay)
    setAssignDialogOpen(true)
  }

  const handleSessionClick = (session: RoomSessionSlot) => {
    toast.info(`Lớp ${session.className} (${session.classCode}) - GV ${session.teacherName}`)
  }

  const statusTilesData = [
    {
      id: 'all' as const,
      label: 'Tất cả phòng',
      count: statusCounts.all,
      status: 'active',
    },
    {
      id: 'active' as const,
      label: 'Đang có lớp',
      count: statusCounts.active,
      status: 'active',
    },
    {
      id: 'free' as const,
      label: 'Phòng trống',
      count: statusCounts.free,
      status: 'inactive',
    },
    {
      id: 'conflict' as const,
      label: 'Cảnh báo trùng',
      count: statusCounts.conflict,
      status: 'dropped',
    },
  ]

  return (
    <div className="flex flex-col h-full min-h-0 space-y-3 p-3 lg:p-4 bg-background text-foreground overflow-y-auto">
      {/* Toolbar & Date Timeline Navigator */}
      <CalendarRoomToolbar
        branch={branch}
        onBranchChange={setBranch}
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        calendarTitle={calendarTitle}
        onNavigate={handleNavigate}
        onToday={handleToday}
        onAssignClick={() => {
          setSelectedRoom(allRooms[0] || null)
          setAssignDialogOpen(true)
        }}
      />

      {/* Status Tiles */}
      <StatusTiles
        tiles={statusTilesData}
        activeId={activeStatusTile}
        onSelect={(id) => setActiveStatusTile(id as RoomStatusTileId)}
      />

      {/* Matrix Table */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <CalendarRoomMatrixTable
          rooms={filteredRooms}
          viewMode={viewMode}
          weekDays={weekDays}
          onSlotClick={handleSlotClick}
          onSessionClick={handleSessionClick}
        />
      </div>

      {/* Assign Room Dialog */}
      <CalendarRoomAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        room={selectedRoom}
        initialTimeSlot={selectedTimeSlot}
      />
    </div>
  )
}
