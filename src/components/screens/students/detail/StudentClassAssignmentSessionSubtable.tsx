'use client'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmptyState } from '@/components/shared'
import { getInitials } from './studentDetailHelpers'
import type { RoadmapSession } from '@/components/screens/classes/detail/classesDetailTypes'

interface StudentClassAssignmentSessionSubtableProps {
  sessions: RoadmapSession[]
  selectedSessionDate: string
  isClassSelected: boolean
  onSelectSession: (val: string) => void
}

function getDayOfWeekFromDateStr(dateStr: string): string {
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    const d = new Date(year, month, day)
    const dayOfWeek = d.getDay()
    const days = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ]
    return days[dayOfWeek] || ''
  }
  return ''
}

export function StudentClassAssignmentSessionSubtable({
  sessions,
  selectedSessionDate,
  isClassSelected,
  onSelectSession,
}: StudentClassAssignmentSessionSubtableProps) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="Chưa có lịch buổi học"
        description="Lớp học này chưa có thông tin buổi học chi tiết."
        className="py-4 text-xs"
      />
    )
  }

  return (
    <div className="w-full">
      <Table className="w-full">
        <TableBody>
          {sessions.map((session: RoadmapSession) => {
            const dayName = getDayOfWeekFromDateStr(session.date)
            const dateDisplay = dayName
              ? `${dayName}, ${session.date}`
              : session.date
            const sessionValStr = `${dateDisplay} (Buổi ${session.sessionNumber}: ${session.topic})`
            const isSelected =
              isClassSelected &&
              (selectedSessionDate === sessionValStr ||
                selectedSessionDate.includes(session.date))

            return (
              <TableRow
                key={session.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectSession(sessionValStr)
                }}
                className={`cursor-pointer hover:bg-primary/5 transition-colors align-middle text-xs border-b border-border/40 last:border-b-0 ${
                  isSelected
                    ? 'bg-primary/10 hover:bg-primary/15 font-medium'
                    : ''
                }`}
              >
                {/* 1. Radio chọn buổi */}
                <TableCell
                  className="w-[45px] text-center py-2 px-1.5 align-middle"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="radio"
                    name="selectedSession"
                    checked={isSelected}
                    onChange={() => onSelectSession(sessionValStr)}
                    className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 cursor-pointer"
                  />
                </TableCell>

                {/* 2. Thời gian: Thứ + Ngày học */}
                <TableCell className="w-[190px] py-2 px-2 align-middle">
                  <div className="font-semibold text-foreground text-xs leading-tight">
                    {dateDisplay}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-normal">
                    {session.startTime} - {session.endTime}
                  </div>
                </TableCell>

                {/* 3. Nội dung bài học */}
                <TableCell className="py-2 px-2 align-middle">
                  <div
                    className="font-semibold text-foreground text-xs truncate max-w-[450px]"
                    title={session.topic}
                  >
                    {session.topic}
                  </div>
                  {session.description && (
                    <div
                      className="text-[11px] text-muted-foreground truncate max-w-[450px]"
                      title={session.description}
                    >
                      {session.description}
                    </div>
                  )}
                </TableCell>

                {/* 4. Giảng viên */}
                <TableCell className="w-[180px] py-2 px-3 align-middle">
                  <div className="flex items-center gap-1.5">
                    <Avatar className="h-5 w-5 border bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                      <AvatarFallback className="font-bold">
                        {getInitials(
                          session.substituteTeacherName || session.teacherName
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {session.substituteTeacherName ? (
                      <div className="flex flex-col gap-0 min-w-0 leading-none">
                        <span className="line-through text-muted-foreground/60 text-[10px] truncate max-w-[100px]">
                          {session.teacherName}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px] truncate max-w-[100px]">
                          {session.substituteTeacherName}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium text-foreground truncate max-w-[120px] text-xs">
                        {session.teacherName}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
