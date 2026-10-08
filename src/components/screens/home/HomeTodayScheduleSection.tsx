'use client'

import React, { useState } from 'react'
import {
  CalendarDays,
  ArrowUpRight,
  ChevronDown,
  Check,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/shared'
import { SessionCard } from '@/components/screens/calendar/SessionCardV2'
import type { ClassSession } from '@/mocks/calendarSchedule'
import type { TodayScheduleItem } from './homeTypes'

interface HomeTodayScheduleSectionProps {
  sessions: TodayScheduleItem[]
  onOpenSessionDetail: (session: TodayScheduleItem) => void
  onNavigateCalendar: () => void
}

function resolveClassSession(item: TodayScheduleItem): ClassSession {
  if (item.rawSession) return item.rawSession

  return {
    id: item.id,
    classCode: item.classCode,
    className: item.className,
    title: item.lessonTitle || item.className,
    lessonSubtitle: '',
    subject: item.subject,
    teacher: item.teacher,
    substituteTeacher: item.substituteTeacher,
    assistantTeacher: item.assistantTeacher,
    branch: item.branch,
    schoolRoom: item.room,
    level: item.level,
    date: new Date().toISOString().split('T')[0],
    dateDisplay: 'Hôm nay',
    dateBucket: item.status === 'completed' ? 'past' : 'today',
    timeLabel: item.startTime,
    endTimeLabel: item.endTime,
    statusLabel: item.statusLabel,
    type:
      item.type === 'digi_session'
        ? 'digi_session'
        : item.type === 'test_session' || item.type === 'placement_test'
        ? 'test_session'
        : 'class_session',
    typeLabel: item.typeLabel,
    totalStudents: item.totalStudents,
    officialStudents: item.officialStudents,
    trialStudents: item.trialStudents,
    makeUpStudents: item.makeUpStudents,
    attendedStudents: item.status === 'completed' ? item.officialStudents : undefined,
    status:
      item.status === 'completed'
        ? 'completed'
        : item.status === 'cancelled'
        ? 'cancelled'
        : 'confirmed',
  }
}

export function HomeTodayScheduleSection({
  sessions,
  onOpenSessionDetail,
  onNavigateCalendar,
}: HomeTodayScheduleSectionProps) {
  const [filterTab, setFilterTab] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'test'>('all')

  const inProgressCount = sessions.filter((s) => s.status === 'in_progress').length
  const upcomingCount = sessions.filter((s) => s.status === 'upcoming').length
  const testCount = sessions.filter(
    (s) => s.type === 'placement_test' || s.type === 'trial_class' || s.trialStudents > 0
  ).length

  const filteredSessions = sessions.filter((s) => {
    if (filterTab === 'test') {
      return s.type === 'placement_test' || s.type === 'trial_class' || s.trialStudents > 0
    }
    if (filterTab === 'morning') {
      const startH = parseInt(s.startTime.split(':')[0], 10)
      return startH < 12
    }
    if (filterTab === 'afternoon') {
      const startH = parseInt(s.startTime.split(':')[0], 10)
      return startH >= 12 && startH < 18
    }
    if (filterTab === 'evening') {
      const startH = parseInt(s.startTime.split(':')[0], 10)
      return startH >= 18
    }
    return true
  })

  const FILTER_LABELS: Record<'all' | 'morning' | 'afternoon' | 'evening' | 'test', string> = {
    all: 'Tất cả',
    morning: 'Sáng',
    afternoon: 'Chiều',
    evening: 'Tối',
    test: 'Test/Thử',
  }

  return (
    <div className="bg-card border border-border/70 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col h-full space-y-1.5 min-h-0 overflow-hidden">
      {/* Header: Click vào title để mở danh sách, tab lọc dạng selection nhỏ gọn ở bên phải dòng title */}
      <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-border/50 shrink-0">
        <button
          type="button"
          onClick={onNavigateCalendar}
          className="flex items-center gap-1.5 group text-left cursor-pointer hover:opacity-85 transition-opacity min-w-0"
          title="Click để mở lịch chi tiết"
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0">
            <CalendarDays className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors truncate flex items-center gap-1">
            <span>Lịch hôm nay</span>
            <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </h3>
          <Badge variant="secondary" className="text-xs h-4.5 px-1.5 font-normal text-muted-foreground bg-muted/80 rounded-full shrink-0">
            {sessions.length}
          </Badge>
        </button>

        {/* Lọc dạng micro dropdown menu nhỏ gọn, không dùng native select to đùng */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="h-6 px-2 text-xs font-normal text-muted-foreground hover:text-foreground bg-muted/40 hover:bg-muted/70 border border-border/60 rounded-md flex items-center gap-1 transition-colors cursor-pointer select-none shrink-0"
              title="Lọc ca học theo khung giờ"
            >
              <span>{FILTER_LABELS[filterTab]}</span>
              <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[100px] p-1 rounded-lg shadow-md border-border/80">
            {(['all', 'morning', 'afternoon', 'evening', 'test'] as const).map((key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setFilterTab(key)}
                className="text-xs py-1.5 px-2 flex items-center justify-between cursor-pointer font-normal rounded text-muted-foreground hover:text-foreground"
              >
                <span>{FILTER_LABELS[key]}</span>
                {filterTab === key && <Check className="w-3 h-3 text-primary ml-1 shrink-0" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thống kê giản lược tối đa: 1 dòng text siêu gọn, không đóng khung hộp to */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1 py-0.5 shrink-0">
        <span className="truncate">{inProgressCount} đang học</span>
        <span className="text-border/80 shrink-0">•</span>
        <span className="truncate">{upcomingCount} sắp học</span>
        <span className="text-border/80 shrink-0">•</span>
        <span className="truncate">{testCount} test/thử</span>
      </div>

      {/* Sessions list: Tái sử dụng đúng SessionCard từ màn lịch học trung tâm (calendar_class_schedule) */}
      {filteredSessions.length === 0 ? (
        <EmptyState
          title="Không có ca học nào"
          className="py-4 text-xs"
        />
      ) : (
        <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          {filteredSessions.map((session) => {
            const classSession = resolveClassSession(session)

            return (
              <SessionCard
                key={session.id}
                session={classSession}
                onClick={() => onOpenSessionDetail(session)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
