'use client'

import { useState } from 'react'
import { 
  MapPin, 
  User, 
  FileText,
  CalendarX
} from 'lucide-react'
import { EmptyState } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { StudentScheduleSessionV2 } from './studentsV2Helpers'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface StudentDetailScheduleTabProps {
  sessions: StudentScheduleSessionV2[]
}

export function StudentDetailScheduleTab({ sessions }: StudentDetailScheduleTabProps) {
  // Set default filter to 'active' ("Đang học/Tiếp theo")
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'rescheduled' | 'cancelled'>('active')

  // Filter calculations
  const getFilteredSessions = (): StudentScheduleSessionV2[] => {
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
      
      case 'rescheduled':
        return sessions.filter((s) => s.status === 'rescheduled' || !!s.substituteTeacherName)
      
      case 'cancelled':
        return sessions.filter((s) => s.status === 'cancelled')
      
      default:
        return sessions
    }
  }

  const filteredSessions = getFilteredSessions()

  const getSessionStatusLabel = (status: StudentScheduleSessionV2['status']) => {
    switch (status) {
      case 'completed': return 'Đã học'
      case 'ongoing': return 'Đang học'
      case 'upcoming': return 'Chờ diễn ra'
      case 'rescheduled': return 'Đổi lịch'
      case 'cancelled': return 'Đã hủy'
      case 'absent': return 'Xin nghỉ'
      default: return status
    }
  }

  const renderSessionCard = (session: StudentScheduleSessionV2) => {
    const isOngoing = session.status === 'ongoing'
    const isCancelled = session.status === 'cancelled'
    const isAbsent = session.status === 'absent'
    
    return (
      <div 
        key={session.id} 
        className={`p-3 border rounded-xl bg-background shadow-xs transition-all flex flex-col gap-2 w-full ${
          isOngoing 
            ? 'border-primary/40 bg-primary/[0.03] ring-1 ring-primary/10 shadow-sm' 
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
            <span className="text-[10px] font-bold text-muted-foreground font-mono bg-muted/70 px-1.5 py-0.5 rounded truncate max-w-[200px]" title={`${session.className} (${session.classCode})`}>
              {session.className}
            </span>
          </div>

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
            isOngoing 
              ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950'
              : getStatusBadgeClass(session.status)
          }`}>
            {getSessionStatusLabel(session.status)}
          </span>
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

          {/* Action button: Xin nghỉ */}
          {!isCancelled && !isAbsent && session.status !== 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              title="Xin nghỉ học buổi này"
              onClick={() => toast.info('Tính năng xin nghỉ đang được phát triển.')}
              className="h-6 px-2 text-[10px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 gap-1 rounded-md"
            >
              <CalendarX className="h-3.5 w-3.5" /> Xin nghỉ
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-1">
      {/* Sessions segment toolbar filters */}
      <div className="sticky top-0 bg-background z-10 flex flex-wrap items-center justify-between gap-3 pb-3 pt-1 border-b mb-3">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { value: 'all', label: 'Tất cả' },
              { value: 'active', label: 'Đang học/Tiếp theo' },
              { value: 'upcoming', label: 'Sắp tới' },
              { value: 'completed', label: 'Đã học' },
              { value: 'rescheduled', label: 'Đổi lịch' },
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
              if (item.value === 'rescheduled') return sessions.filter((s) => s.status === 'rescheduled' || !!s.substituteTeacherName).length
              if (item.value === 'cancelled') return sessions.filter((s) => s.status === 'cancelled').length
              return 0
            }
            return (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filter === item.value 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
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
    </div>
  )
}
