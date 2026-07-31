'use client'

import { useState } from 'react'
import { 
  MapPin, 
  User, 
  FileText,
  CalendarX,
  Eye
} from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { StudentScheduleSession } from './studentDetailTypes'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { SessionDetailDialog } from '@/components/screens/calendar/SessionDetailDialog'
import type { ClassSession } from '@/mocks/calendarSchedule'

interface StudentDetailScheduleProps {
  sessions: StudentScheduleSession[]
}

export function StudentDetailSchedule({ sessions }: StudentDetailScheduleProps) {
  // Set default filter to 'active' ("Đang học/Tiếp theo")
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'>('active')
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Filter calculations
  const getFilteredSessions = (): StudentScheduleSession[] => {
    switch (filter) {
      case 'all':
        return sessions
      
      case 'active': {
        const ongoing = sessions.filter((s) => s.status === 'ongoing')
        const firstUpcoming = sessions.find((s) => s.status === 'upcoming')
        const list = [...ongoing]
        if (firstUpcoming) {
          list.push(firstUpcoming)
        }
        return list
      }
      
      case 'upcoming':
        return sessions.filter((s) => s.status === 'upcoming')
      
      case 'completed':
        return sessions.filter((s) => s.status === 'completed')
      
      case 'cancelled':
        return sessions.filter((s) => s.status === 'cancelled')
      
      default:
        return sessions
    }
  }
 
  const filteredSessions = getFilteredSessions()



  const renderSessionCard = (session: StudentScheduleSession) => {
    const isOngoing = session.status === 'ongoing'
    const isCancelled = session.status === 'cancelled'
    const isAbsent = session.status === 'absent'
    
    return (
      <div 
        key={session.id} 
        className={`p-2.5 px-3 border rounded-xl bg-background shadow-2xs transition-all flex flex-col gap-2 w-full ${
          isOngoing 
            ? 'border-primary/40 bg-primary/[0.03] ring-1 ring-primary/10 shadow-xs' 
            : (isCancelled || isAbsent)
            ? 'border-muted bg-muted/5 opacity-65 border-dashed'
            : 'border-muted hover:border-muted-foreground/30'
        }`}
      >
        {/* Top Header info */}
        <div className="flex items-center justify-between gap-2 border-b border-muted/50 pb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold text-primary font-mono uppercase bg-primary/10 px-1.5 py-0.5 rounded shrink-0 animate-none">
              Buổi {session.sessionNumber}
            </span>
            <span className="text-xs font-semibold text-foreground font-mono shrink-0">
              {session.date} ({session.startTime} - {session.endTime})
            </span>
          </div>

          {session.status === 'absent' && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadgeClass('absent')}`}>
              Xin nghỉ
            </span>
          )}
        </div>

        {/* Topic Title & Subtitle + Teacher/Room consolidated in a single line or tight block */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2.5 my-0.5">
          {/* Topic Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <h5 className={`text-xs font-bold leading-snug ${(isCancelled || isAbsent) ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {session.topic}
            </h5>
            {session.description && (
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal font-normal truncate" title={session.description}>
                {session.description}
              </p>
            )}
          </div>

          {/* Compact Teacher & Room Inline Bar */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs shrink-0 self-center bg-muted/40 px-2 py-0.5 rounded-md border border-muted/30">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">GV:</span>
              <span className="font-semibold text-foreground font-sans">
                {session.substituteTeacherName ? (
                  <span className="flex items-center gap-0.5">
                    <span className="line-through text-muted-foreground/60">{session.teacherName}</span>
                    <span className="text-muted-foreground/50 mx-0.5">→</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{session.substituteTeacherName}</span>
                  </span>
                ) : (
                  session.teacherName
                )}
              </span>
            </span>
            <span className="text-muted-foreground/30 font-mono">|</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Phòng:</span>
              <span className="font-semibold text-foreground font-sans">
                {session.room}
              </span>
            </span>
          </div>
        </div>

        {/* Bottom Panel: Materials */}
        <div className="border-t border-dashed border-muted/70 pt-2 flex flex-wrap items-center justify-between gap-2 mt-0.5">
          <div className="flex flex-wrap gap-1.5 items-center">
            {session.materials && session.materials.length > 0 ? (
              session.materials.map((mat, matIdx) => (
                <div key={matIdx} className="flex items-center gap-1 bg-muted/50 border px-1.5 py-0.5 rounded text-[10px] text-muted-foreground hover:border-primary/30 transition-all">
                  <a 
                    href={mat.url && mat.url !== '#' ? mat.url : undefined} 
                    target="_blank" 
                    rel="noreferrer"
                    className="hover:underline flex items-center gap-1 font-sans font-medium text-primary"
                    onClick={(e) => {
                      if (!mat.url || mat.url === '#') {
                        e.preventDefault()
                        alert('Tài liệu chưa có đường dẫn trực tuyến!')
                      }
                    }}
                  >
                    <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate max-w-[120px]">{mat.name}</span>
                  </a>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-muted-foreground/60 italic">
                {(isCancelled || isAbsent) ? 'Buổi học đã hủy hoặc nghỉ' : 'Chưa có tài liệu'}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <Button
              variant="ghost"
              size="xs"
              className="text-[10px] text-primary hover:text-primary hover:bg-primary/10 cursor-pointer flex items-center gap-1 rounded-md font-semibold"
              onClick={() => {
                const classSession: ClassSession = {
                  id: session.id,
                  classCode: session.classCode,
                  className: session.className,
                  subject: 'Tiếng Anh',
                  teacher: session.teacherName,
                  substituteTeacher: session.substituteTeacherName,
                  branch: 'RinoEdu Nguyễn Tuân',
                  schoolRoom: session.room,
                  level: 'Standard',
                  date: session.date,
                  dateDisplay: session.date,
                  dateBucket: session.status === 'completed' ? 'past' : session.status === 'ongoing' ? 'today' : 'upcoming',
                  timeLabel: session.startTime,
                  endTimeLabel: session.endTime,
                  statusLabel: session.status === 'completed' ? 'Đã học' : session.status === 'ongoing' ? 'Đang học' : 'Chờ diễn ra',
                  type: 'class_session',
                  typeLabel: 'Lớp học',
                  title: session.topic,
                  lessonSubtitle: session.description || '',
                  totalStudents: 12,
                  officialStudents: 10,
                  trialStudents: 2,
                }
                setSelectedSession(classSession)
                setIsDetailOpen(true)
              }}
            >
              <Eye className="h-3.5 w-3.5" /> Xem buổi học
            </Button>

            {!isCancelled && !isAbsent && session.status !== 'completed' && (
              <Button
                variant="ghost"
                size="xs"
                className="text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-1 rounded-md font-semibold"
                onClick={() => {
                  toast.info('Tính năng chưa phát triển')
                }}
              >
                <CalendarX className="h-3.5 w-3.5" /> Xin nghỉ
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-0">
      {/* Sessions segment toolbar filters */}
      <div className="sticky top-0 bg-background z-30 flex flex-wrap items-center justify-between gap-3 pb-3 pt-1 border-b mb-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { value: 'all', label: 'Tất cả' },
              { value: 'active', label: 'Đang học/Tiếp theo' },
              { value: 'upcoming', label: 'Sắp tới' },
              { value: 'completed', label: 'Đã học' },
              { value: 'cancelled', label: 'Hủy' }
            ] as const
          ).map((item) => {
            const getCount = () => {
              if (item.value === 'all') return sessions.length
              if (item.value === 'active') {
                return sessions.filter((s) => s.status === 'ongoing').length + 
                  (sessions.find((s) => s.status === 'upcoming') ? 1 : 0)
              }
              if (item.value === 'upcoming') return sessions.filter((s) => s.status === 'upcoming').length
              if (item.value === 'completed') return sessions.filter((s) => s.status === 'completed').length
              if (item.value === 'cancelled') return sessions.filter((s) => s.status === 'cancelled').length
              return 0
            }
            return (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === item.value 
                    ? 'bg-primary text-primary-foreground shadow-xs' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.label} ({getCount()})
              </button>
            )
          })}
        </div>
      </div>

      {/* List rendering filtered sessions. Wrap in a vertical scrollable view */}
      {filteredSessions.length > 0 ? (
        <div className="flex flex-col gap-4 w-full pt-1">
          {filteredSessions.map((session) => renderSessionCard(session))}
        </div>
      ) : (
        <div className="py-8">
          <EmptyState
            title="Không tìm thấy lịch học"
            description="Hiện tại không có lịch học nào tương ứng với bộ lọc đang chọn."
          />
        </div>
      )}

      <SessionDetailDialog
        session={selectedSession}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  )
}
