'use client'

import { useMemo, useState } from 'react'
import { CalendarClassV2Toolbar } from './CalendarClassV2Toolbar'
import { CalendarClassV2RoomMatrix } from './CalendarClassV2RoomMatrix'
import { CalendarClassV2TeacherMatrix } from './CalendarClassV2TeacherMatrix'
import {
  getMockRoomsV2,
  getMockTeachersV2,
  getMockSessionsV2,
  getMonday,
  getWeekDays,
  formatLabel,
} from './calendarClassV2Helpers'
import type { ClassSessionV2, RoomRowRecord, TeacherRowRecord, ViewTabMode } from './calendarClassV2Types'
import { StatusTiles } from '@/components/shared'
import { toast } from 'sonner'

export function CalendarClassScheduleV2Screen() {
  const [branch, setBranch] = useState('all')
  const [subject, setSubject] = useState('all')
  const [search, setSearch] = useState('')
  const [viewTab, setViewTab] = useState<ViewTabMode>('room_matrix')
  const [activeStatusTile, setActiveStatusTile] = useState('all')

  const [selectedDate, setSelectedDate] = useState(() => getMonday(new Date()))

  const rawSessions = useMemo(() => getMockSessionsV2(), [])
  const rawRooms = useMemo(() => getMockRoomsV2(), [])
  const rawTeachers = useMemo(() => getMockTeachersV2(), [])

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

  const calendarTitle = useMemo(() => {
    return `${formatLabel(weekDays[0], { day: '2-digit', month: '2-digit' })} - ${formatLabel(weekDays[6], { day: '2-digit', month: '2-digit', year: 'numeric' })}`
  }, [weekDays])

  const handleNavigate = (dir: number) => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + dir * 7)
    setSelectedDate(date)
  }

  const handleToday = () => {
    setSelectedDate(getMonday(new Date()))
  }

  // Calculate dynamic status tile counts based on branch, subject, and search
  const statusCounts = useMemo(() => {
    const branchFiltered = rawSessions.filter((s) => {
      if (branch !== 'all' && s.branch !== branch) return false
      if (subject !== 'all' && s.subject !== subject) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          s.className.toLowerCase().includes(q) ||
          s.classCode.toLowerCase().includes(q) ||
          s.teacherName.toLowerCase().includes(q) ||
          s.roomName.toLowerCase().includes(q)
        )
      }
      return true
    })

    let normal = 0
    let substitute = 0
    let opening = 0
    let conflict = 0

    branchFiltered.forEach((s) => {
      if (s.status === 'conflict') conflict++
      else if (s.status === 'substitute' || s.substituteTeacher) substitute++
      else if (s.status === 'opening') opening++
      else normal++
    })

    return {
      all: branchFiltered.length,
      normal,
      substitute,
      opening,
      conflict,
    }
  }, [rawSessions, branch, subject, search])

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rawRooms
      .filter((r) => branch === 'all' || r.branch === branch)
      .map((r) => {
        const matchingSessions = r.sessions.filter((s) => {
          if (subject !== 'all' && s.subject !== subject) return false
          if (search) {
            const q = search.toLowerCase()
            const match =
              r.roomName.toLowerCase().includes(q) ||
              s.className.toLowerCase().includes(q) ||
              s.classCode.toLowerCase().includes(q) ||
              s.teacherName.toLowerCase().includes(q)
            if (!match) return false
          }
          if (activeStatusTile === 'normal') return s.status === 'normal'
          if (activeStatusTile === 'substitute') return s.status === 'substitute' || Boolean(s.substituteTeacher)
          if (activeStatusTile === 'opening') return s.status === 'opening'
          if (activeStatusTile === 'conflict') return s.status === 'conflict'
          return true
        })

        return {
          ...r,
          sessions: matchingSessions,
        }
      })
      .filter((r) => {
        if (subject !== 'all' && r.sessions.length === 0) return false
        if (!search) return true
        const q = search.toLowerCase()
        return r.roomName.toLowerCase().includes(q) || r.sessions.length > 0
      })
  }, [rawRooms, branch, subject, search, activeStatusTile])

  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    return rawTeachers
      .filter((t) => branch === 'all' || t.branch === branch)
      .map((t) => {
        const matchingSessions = t.sessions.filter((s) => {
          if (subject !== 'all' && s.subject !== subject) return false
          if (search) {
            const q = search.toLowerCase()
            const match =
              t.teacherName.toLowerCase().includes(q) ||
              s.className.toLowerCase().includes(q) ||
              s.classCode.toLowerCase().includes(q)
            if (!match) return false
          }
          if (activeStatusTile === 'normal') return s.status === 'normal'
          if (activeStatusTile === 'substitute') return s.status === 'substitute' || Boolean(s.substituteTeacher)
          if (activeStatusTile === 'opening') return s.status === 'opening'
          if (activeStatusTile === 'conflict') return s.status === 'conflict'
          return true
        })

        return {
          ...t,
          sessions: matchingSessions,
        }
      })
      .filter((t) => {
        if (subject !== 'all' && t.sessions.length === 0) return false
        if (!search) return true
        const q = search.toLowerCase()
        return t.teacherName.toLowerCase().includes(q) || t.sessions.length > 0
      })
  }, [rawTeachers, branch, subject, search, activeStatusTile])

  const statusTilesData = [
    {
      id: 'all',
      label: 'Tất cả ca học',
      count: statusCounts.all,
      status: 'active',
    },
    {
      id: 'normal',
      label: 'Bình thường',
      count: statusCounts.normal,
      status: 'active',
    },
    {
      id: 'substitute',
      label: 'Có dạy thay / Thiếu TA',
      count: statusCounts.substitute,
      status: 'pending',
    },
    {
      id: 'opening',
      label: 'Khai giảng',
      count: statusCounts.opening,
      status: 'upcoming',
    },
    {
      id: 'conflict',
      label: 'Cảnh báo trùng',
      count: statusCounts.conflict,
      status: 'dropped',
    },
  ]

  const handleSessionClick = (session: ClassSessionV2) => {
    toast.info(`Lớp ${session.className} (${session.classCode}) - GV: ${session.teacherName} • TA: ${session.taName || 'Chưa gán'}`)
  }

  const handleSlotClick = (room: RoomRowRecord, dayName: string) => {
    toast.success(`Đã mở giao diện gán lớp mới vào ${room.roomName} (${dayName})`)
  }

  const handleAssignSubstitute = (teacher: TeacherRowRecord, dayName: string) => {
    toast.info(`Mở giao diện phân công ca dạy cho ${teacher.teacherName} (${dayName})`)
  }

  return (
    <div className="flex flex-col h-full min-h-0 space-y-3 px-4 py-3 lg:px-6 bg-background text-foreground overflow-hidden">
      {/* Toolbar */}
      <CalendarClassV2Toolbar
        branch={branch}
        onBranchChange={setBranch}
        subject={subject}
        onSubjectChange={setSubject}
        search={search}
        onSearchChange={setSearch}
        viewTab={viewTab}
        onViewTabChange={setViewTab}
        calendarTitle={calendarTitle}
        onNavigate={handleNavigate}
        onToday={handleToday}
      />

      {/* Status Tiles */}
      <StatusTiles
        tiles={statusTilesData}
        activeId={activeStatusTile}
        onSelect={setActiveStatusTile}
      />

      {/* Main View Area */}
      <div className="flex-1 min-h-0 flex flex-col">
        {viewTab === 'room_matrix' && (
          <CalendarClassV2RoomMatrix
            rooms={filteredRooms}
            weekDays={weekDays}
            onSlotClick={handleSlotClick}
            onSessionClick={handleSessionClick}
          />
        )}

        {viewTab === 'teacher_workload' && (
          <CalendarClassV2TeacherMatrix
            teachers={filteredTeachers}
            weekDays={weekDays}
            onSessionClick={handleSessionClick}
            onAssignSubstitute={handleAssignSubstitute}
          />
        )}
      </div>
    </div>
  )
}
