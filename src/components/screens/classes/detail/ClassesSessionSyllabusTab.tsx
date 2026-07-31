'use client'

import { useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  FileText,
  Headphones,
  Video,
  HelpCircle,
  MessageSquareWarning,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoadmapSession } from './classesDetailTypes'
import { cleanTeacherName } from './classesDetailHelpers'
import { getLessonsForRoadmapSession, getSessionStatusLabel } from './classesSessionDetailHelpers'
import { SegmentedControl, type SegmentedControlOption } from '@/components/controls'
import { EmptyState } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { toast } from 'sonner'

interface ClassesSessionSyllabusTabProps {
  session: RoadmapSession
  sessions?: RoadmapSession[]
}

type FilterTab = 'today' | 'next_week' | 'past' | 'all'

const FILTER_OPTIONS: SegmentedControlOption<FilterTab>[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'next_week', label: 'Tuần tới' },
  { value: 'past', label: 'Trước đó' },
  { value: 'all', label: 'Tất cả' },
]

// Robust helper to parse DD/MM/YYYY or YYYY-MM-DD to Date object
function parseDateString(dateStr: string): Date {
  if (!dateStr) return new Date()
  if (dateStr.includes('/')) {
    const [day, month, year] = dateStr.split('/').map(Number)
    return new Date(year, month - 1, day)
  }
  if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(dateStr)
}

export function ClassesSessionSyllabusTab({
  session,
  sessions = [],
}: ClassesSessionSyllabusTabProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('today')
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({})

  const allSessions = sessions.length > 0 ? sessions : [session]
  const currentSessionDate = parseDateString(session.date)

  // Filter sessions relative to current session's date
  const filteredSessions = allSessions.filter((s) => {
    if (activeFilter === 'today') {
      return s.id === session.id
    }
    
    const sDate = parseDateString(s.date)
    // Clear hours for accurate calendar day comparison
    const sTime = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate()).getTime()
    const currTime = new Date(currentSessionDate.getFullYear(), currentSessionDate.getMonth(), currentSessionDate.getDate()).getTime()
    const diffTime = sTime - currTime

    if (activeFilter === 'past') {
      return diffTime < 0
    }
    if (activeFilter === 'next_week') {
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
      return diffTime > 0 && diffTime <= sevenDaysInMs
    }
    if (activeFilter === 'all') {
      return true
    }
    return false
  })

  // Sort sessions chronologically
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    return parseDateString(a.date).getTime() - parseDateString(b.date).getTime()
  })

  const showSessionHeader = activeFilter !== 'today'

  return (
    <div className="space-y-4">
      {/* ── Sub-navigation filter controls ── */}
      <div className="flex justify-start border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <SegmentedControl
          value={activeFilter}
          options={FILTER_OPTIONS}
          onValueChange={setActiveFilter}
          className="bg-transparent p-0 gap-1"
          itemClassName="h-7 px-2.5 text-[11px] border border-transparent [&.bg-background]:border-primary [&.bg-background]:bg-primary [&.bg-background]:text-primary-foreground shadow-none"
        />
      </div>

      {sortedSessions.length > 0 ? (
        <div className="space-y-6">
          {sortedSessions.map((s) => {
            const lessons = getLessonsForRoadmapSession(s)
            
            return (
              <div key={s.id} className="space-y-3">
                {/* ── Elegant Group Header for sessions (used in Past, Next Week, All) ── */}
                {showSessionHeader && (
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">
                        Buổi {s.sessionNumber}: {s.topic}
                      </span>
                      <Badge className={cn("text-[9px] px-1.5 py-0 h-4 font-semibold capitalize shadow-none border", getStatusBadgeClass(s.status))}>
                        {getSessionStatusLabel(s.status)}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <span>{s.date} ({s.startTime} - {s.endTime})</span>
                      <span>•</span>
                      <span>Phòng: {s.room}</span>
                      <span>•</span>
                      <span>GV: {s.substituteTeacherName ? `${cleanTeacherName(s.teacherName)} (Dạy thay: ${cleanTeacherName(s.substituteTeacherName)})` : cleanTeacherName(s.teacherName)}</span>
                    </div>
                  </div>
                )}

                {/* ── Lessons List ── */}
                <div className="space-y-2.5">
                  {lessons.length > 0 ? (
                    lessons.map((lesson, lessonIdx) => {
                      const lessonKey = `session-${s.sessionNumber}-lesson-${lesson.id}-${lessonIdx}`
                      const isExpanded = expandedLessons[lessonKey] ?? (lessonIdx === 0)
                      
                      return (
                        <div key={lesson.id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
                          {/* Lesson Header Accordion Toggle */}
                          <div className="flex items-center justify-between bg-transparent pr-3">
                            <button
                              type="button"
                              className="flex-1 px-4 py-2.5 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors text-left font-semibold cursor-pointer"
                              onClick={() => setExpandedLessons(prev => ({ ...prev, [lessonKey]: !isExpanded }))}
                            >
                              <span className="text-xs font-bold text-foreground">
                                {lesson.title}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                            
                            {/* Curriculum feedback button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.info('Tính năng góp ý giáo trình đang được phát triển!');
                              }}
                              className="text-[10px] text-zinc-400 hover:text-amber-500 font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none p-1 shrink-0 ml-1.5"
                              title="Góp ý giáo trình"
                            >
                              <MessageSquareWarning className="h-3.5 w-3.5" />
                              <span>Góp ý</span>
                            </button>
                          </div>

                          {/* Lesson Components List */}
                          {isExpanded && (
                            <div className="px-4 pb-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 bg-transparent space-y-3">
                              {lesson.components.map((c, cIdx) => {
                                let iconColor = 'text-primary'
                                let iconBg = 'bg-primary/10'
                                let IconComponent = FileText
                                
                                if (c.type === 'slide') {
                                  iconColor = 'text-rose-600 dark:text-rose-400'
                                  iconBg = 'bg-rose-50 dark:bg-rose-950/20'
                                  IconComponent = FileText
                                } else if (c.type === 'homework') {
                                  iconColor = 'text-emerald-600 dark:text-emerald-400'
                                  iconBg = 'bg-emerald-50 dark:bg-emerald-950/20'
                                  IconComponent = CheckCircle2
                                } else if (c.type === 'quiz') {
                                  iconColor = 'text-amber-600 dark:text-amber-400'
                                  iconBg = 'bg-amber-50 dark:bg-amber-950/20'
                                  IconComponent = HelpCircle
                                } else if (c.type === 'audio') {
                                  iconColor = 'text-sky-600 dark:text-sky-400'
                                  iconBg = 'bg-sky-50 dark:bg-sky-950/20'
                                  IconComponent = Headphones
                                } else if (c.type === 'video') {
                                  iconColor = 'text-violet-600 dark:text-violet-400'
                                  iconBg = 'bg-violet-50 dark:bg-violet-950/20'
                                  IconComponent = Video
                                }

                                let line2 = 'File tài liệu tham khảo cho học sinh'
                                let line3 = 'Tài liệu tham khảo'
                                
                                if (c.type === 'homework') {
                                  line2 = 'Bài luyện tập tự học ở nhà'
                                  line3 = 'Nhiệm vụ phải làm'
                                } else if (c.type === 'quiz') {
                                  line2 = 'Bài kiểm tra nhanh đánh giá năng lực'
                                  line3 = 'Nhiệm vụ phải làm'
                                } else if (c.type === 'audio') {
                                  line2 = 'File nghe audio luyện kỹ năng nghe'
                                  line3 = 'Tài liệu nghe bổ trợ'
                                } else if (c.type === 'video') {
                                  line2 = 'Video bài học bổ sung kiến thức'
                                  line3 = 'Tài liệu xem bổ trợ'
                                }

                                const isTask = c.type === 'homework' || c.type === 'quiz'
                                const bottomTextColor = isTask ? 'text-amber-600' : 'text-muted-foreground'
                                const BottomIcon = isTask ? CheckCircle2 : FileText

                                return (
                                  <div key={cIdx} className="flex items-start gap-3 text-xs">
                                    <div className={cn("h-6 w-6 rounded-full flex items-center justify-center shrink-0", iconBg, iconColor)}>
                                      <IconComponent className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                      <p className="font-bold text-foreground text-sm leading-snug">{c.name}</p>
                                      <p className="text-xs text-muted-foreground leading-normal">{line2}</p>
                                      <p className={cn(
                                        "text-[10px] flex items-center gap-1 leading-normal font-medium",
                                        bottomTextColor
                                      )}>
                                        <BottomIcon className="h-3 w-3 shrink-0" />
                                        <span>{line3}</span>
                                        {c.url && c.url !== '#' && (
                                          <>
                                            <span>•</span>
                                            <a href={c.url} target="_blank" rel="noreferrer" className="text-rose-600 hover:underline font-semibold" onClick={(e) => e.preventDefault()}>
                                              Link bài tập
                                            </a>
                                          </>
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="py-6 text-center text-muted-foreground italic text-xs">
                      Không có chương trình học nào được gán cho buổi này.
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── Elegant Empty State for other tabs ── */
        <div className="py-4">
          {activeFilter === 'next_week' && (
            <EmptyState
              title="Không có bài học tuần tới"
              description="Không có buổi học nào được lên lịch trong 7 ngày tới."
            />
          )}
          {activeFilter === 'past' && (
            <EmptyState
              title="Không có bài học trước đó"
              description="Không có buổi học nào diễn ra trước buổi học hiện tại."
            />
          )}
          {activeFilter === 'all' && (
            <EmptyState
              title="Không có bài học nào"
              description="Lớp học này chưa có danh sách bài học và chương trình."
            />
          )}
          {activeFilter === 'today' && (
            <div className="py-8 text-center text-muted-foreground italic text-xs">
              Không có chương trình học nào được gán cho buổi này.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
