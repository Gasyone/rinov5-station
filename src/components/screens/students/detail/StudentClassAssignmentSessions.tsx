'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { EmptyState } from '@/components/shared'
import { getInitials } from './studentDetailHelpers'
import type { RoadmapSession } from '@/components/screens/classes/detail/classesDetailTypes'

interface StudentClassAssignmentSessionsProps {
  selectedClassSessions: RoadmapSession[]
  filteredSessions: RoadmapSession[]
  sessionFilter: 'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'
  onSetSessionFilter: (
    filter: 'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'
  ) => void
  startSessionDate: string
  onSelectSession: (val: string) => void
}

export function StudentClassAssignmentSessions({
  selectedClassSessions,
  filteredSessions,
  sessionFilter,
  onSetSessionFilter,
  startSessionDate,
  onSelectSession,
}: StudentClassAssignmentSessionsProps) {
  return (
    <div className="space-y-3 pt-0.5">
      {/* Session Status Tab Filter Bar */}
      <div className="flex flex-wrap gap-1 px-3 py-1 bg-muted/10 rounded-md select-none border">
        {([
          { id: 'all', label: 'Tất cả' },
          { id: 'active', label: 'Đang học/Tiếp theo' },
          { id: 'upcoming', label: 'Sắp tới' },
          { id: 'completed', label: 'Đã học' },
          { id: 'cancelled', label: 'Hủy' },
        ] as const).map((tab) => {
          const count = selectedClassSessions.filter((s) => {
            if (tab.id === 'all') return true
            if (tab.id === 'active') {
              return s.status === 'ongoing' || s.status === 'upcoming'
            }
            return s.status === tab.id
          }).length

          return (
            <button
              key={tab.id}
              onClick={() => onSetSessionFilter(tab.id)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                sessionFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label} ({count})
            </button>
          )
        })}
      </div>

      {filteredSessions.length === 0 ? (
        <EmptyState
          title="Không tìm thấy buổi học"
          description="Hiện tại không có buổi học nào tương ứng với bộ lọc đang chọn."
          className="py-8"
        />
      ) : (
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="w-[5%] text-center px-1 sticky top-0 bg-background z-10 border-b"></TableHead>
              <TableHead className="w-[12%] px-2 sticky top-0 bg-background z-10 border-b">Buổi học</TableHead>
              <TableHead className="w-[20%] px-2 sticky top-0 bg-background z-10 border-b">Thời gian</TableHead>
              <TableHead className="w-[45%] px-2 sticky top-0 bg-background z-10 border-b">Nội dung bài học</TableHead>
              <TableHead className="w-[18%] px-2 pr-4 sticky top-0 bg-background z-10 border-b">Giảng viên</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.map((session: RoadmapSession) => {
              const sessionValStr = `${session.date} (Buổi ${session.sessionNumber}: ${session.topic})`
              const isSelected = startSessionDate === sessionValStr
              return (
                <TableRow
                  key={session.id}
                  onClick={() => onSelectSession(sessionValStr)}
                  className={`cursor-pointer hover:bg-muted/40 align-middle border-b-0 ${
                    isSelected ? 'bg-primary/5 hover:bg-primary/5' : ''
                  }`}
                >
                  <TableCell className="text-center py-2.5 px-1 align-middle" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="radio"
                      name="selectedSession"
                      checked={isSelected}
                      onChange={() => onSelectSession(sessionValStr)}
                      className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="py-2.5 px-2 font-bold text-foreground text-xs align-middle">
                    <span className="text-[10px] font-bold text-primary font-mono uppercase bg-primary/10 px-1.5 py-0.5 rounded border-transparent shrink-0">
                      Buổi {session.sessionNumber}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5 px-2 text-xs font-semibold text-foreground align-middle">
                    <div>{session.date}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-normal">
                      {session.startTime} - {session.endTime}
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5 px-2 text-xs text-foreground align-middle">
                    <div className="font-bold truncate max-w-[280px]" title={session.topic}>
                      {session.topic}
                    </div>
                    {session.description && (
                      <div
                        className="text-[10px] text-muted-foreground mt-0.5 max-w-[280px] truncate"
                        title={session.description}
                      >
                        {session.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 px-2 pr-4 text-xs text-muted-foreground align-middle">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5.5 w-5.5 border bg-primary/10 text-primary text-[9px] font-bold shrink-0">
                        <AvatarFallback className="font-bold">
                          {getInitials(session.substituteTeacherName || session.teacherName)}
                        </AvatarFallback>
                      </Avatar>
                      {session.substituteTeacherName ? (
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="line-through text-muted-foreground/60 truncate max-w-[80px]">
                            {session.teacherName}
                          </span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold truncate max-w-[80px]">
                            {session.substituteTeacherName}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-foreground truncate max-w-[100px]">
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
      )}
    </div>
  )
}
