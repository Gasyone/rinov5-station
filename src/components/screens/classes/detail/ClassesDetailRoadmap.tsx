'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { 
  Play, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  Pencil
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import type { RoadmapSession } from './classesDetailTypes'
import { groupSessionsIntoPhases } from './classesDetailHelpers'

interface ClassesDetailRoadmapProps {
  sessions: RoadmapSession[]
  syllabusName?: string
  lastChangedInfo?: string | null
  onEditRoadmap?: () => void
}

export function ClassesDetailRoadmap({ 
  sessions, 
  syllabusName, 
  lastChangedInfo,
  onEditRoadmap 
}: ClassesDetailRoadmapProps) {
  
  // Dynamic phase grouping states
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({})
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({})

  // Group sessions into dynamic phases by syllabusName
  const phases = useMemo(() => {
    return groupSessionsIntoPhases(sessions)
  }, [sessions])

  const togglePhase = (phaseNum: number) => {
    setOpenPhases((prev) => ({
      ...prev,
      [phaseNum]: !(prev[phaseNum] ?? (phaseNum === phases.length))
    }))
  }

  // Helper to convert RoadmapSession to lessons list (demonstrating "2 bài trong 1 buổi")
  const getLessonsForRoadmapSession = (session: RoadmapSession) => {
    const components = (session.materials || []).map((m) => ({
      name: m.name,
      type: (m.type === 'Phải làm' ? 'homework' : 'slide') as 'slide' | 'homework' | 'quiz' | 'audio' | 'video',
      url: m.url
    }))

    const primaryLesson = {
      id: session.id,
      lessonNumber: session.sessionNumber,
      title: session.topic,
      description: session.description || '',
      components
    }

    // If session.sessionNumber is 3 or 5, return two lessons to show "2 bài trong 1 buổi"
    if (session.sessionNumber === 3 || session.sessionNumber === 5) {
      const secondaryLesson = {
        id: `${session.id}-sub`,
        lessonNumber: session.sessionNumber,
        title: session.sessionNumber === 3 ? 'Thành phần buổi học 2 - 10 phút' : 'KET Practice Test 1 - 180 phút',
        description: session.sessionNumber === 3 ? 'Luyện tập bổ trợ từ vựng và ngữ pháp nâng cao.' : 'Bài kiểm tra năng lực và ôn tập bổ trợ từ vựng.',
        components: session.sessionNumber === 3 ? [
          { name: 'test kịch bản 2', type: 'quiz' as const, url: '#' },
          { name: 'Bài ôn tập 1', type: 'homework' as const, url: '#' }
        ] : [
          { name: 'Kỹ năng KET Test - 120 phút', type: 'homework' as const, url: '#' },
          { name: 'Bài kiểm tra bổ trợ từ vựng - 60 phút', type: 'quiz' as const, url: '#' }
        ]
      }
      return [primaryLesson, secondaryLesson]
    }

    return [primaryLesson]
  }

  return (
    <div className="space-y-6 pt-4">
      
      {/* Roadmap Header Summary with Edit / Add button */}
      {syllabusName ? (
        <div className="rounded-xl border bg-muted/10 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-4 w-full">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  Lộ trình áp dụng: {syllabusName}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Khung chương trình chuẩn gồm {sessions.length} bài học lý thuyết tiêu chuẩn.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <Button 
                size="xs" 
                variant="outline" 
                onClick={onEditRoadmap || (() => alert('Thao tác gán/thay đổi lộ trình giáo trình!'))}
                className="rounded-lg text-xs"
              >
                Đổi lộ trình
              </Button>
              {lastChangedInfo && (
                <p className="text-[10px] text-muted-foreground font-normal italic text-right">
                  {lastChangedInfo}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-muted/10 p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">
                Chưa cấu hình lộ trình bài học
              </h4>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Khung chương trình chuẩn gồm {sessions.length} bài học lý thuyết tiêu chuẩn.
              </p>
            </div>
          </div>
          <div>
            <Button 
              size="xs" 
              variant="default" 
              onClick={onEditRoadmap || (() => alert('Thao tác gán/thay đổi lộ trình giáo trình!'))}
              className="rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              Thêm lộ trình
            </Button>
          </div>
        </div>
      )}

      {/* ACCORDION ROADMAP GROUPS */}
      {sessions.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
          title="Lớp học chưa được gán Khung chương trình"
          description="Vui lòng bấm nút 'Thêm lộ trình' ở trên hoặc chọn Khung chương trình trong phần chỉnh sửa thông tin lớp để tự động cấu hình lộ trình bài học."
          className="py-12 border border-dashed rounded-xl"
        />
      ) : (
        <div className="space-y-3">
          {[...phases].reverse().map((phase) => {
          const isCurrent = phase.phaseNumber === phases.length
          const isOpen = openPhases[phase.phaseNumber] ?? isCurrent
          const completedCount = phase.sessions.filter(
            (s) => s.status === 'completed' || s.status === 'ongoing'
          ).length
          const percent = phase.sessions.length > 0 
            ? Math.round((completedCount / phase.sessions.length) * 100) 
            : 0

          return (
            <div 
              key={phase.phaseNumber} 
              className="border border-muted rounded-xl bg-background overflow-hidden shadow-xs"
            >
              <button
                type="button"
                className={cn(
                  "w-full px-4 py-3 flex items-center justify-between border-b border-muted transition-colors",
                  isCurrent 
                    ? "bg-primary/[0.02] hover:bg-primary/[0.04]" 
                    : "bg-transparent hover:bg-muted/10"
                )}
                onClick={() => togglePhase(phase.phaseNumber)}
              >
                <div className="flex items-center justify-between flex-1 pr-4 gap-4 flex-wrap">
                  <div className="flex flex-col text-left gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Play className="h-3 w-3 fill-current" />
                          Lộ trình đang áp dụng
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-muted border text-muted-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          Lộ trình trước đó ({phase.sessions.length} buổi)
                        </span>
                      )}
                      <span className="text-xs font-bold text-foreground">
                        Giai đoạn {phase.phaseNumber} (Buổi {phase.startSession} - {phase.endSession}): {phase.syllabusName || 'Chưa gán lộ trình'} {!isCurrent && "(Khóa lịch sử)"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-normal italic leading-none">
                      {isCurrent 
                        ? (lastChangedInfo || "Lộ trình đang được áp dụng hiện tại")
                        : (phase.phaseNumber === 1 
                            ? "Lộ trình khởi tạo ban đầu hệ thống vào 2026-05-01 08:00:00 bởi Hệ thống" 
                            : "Lộ trình lịch sử đã áp dụng trước đó"
                          )
                      }
                    </p>
                  </div>

                  {/* Progress Stats & Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "text-[11px] font-bold font-mono",
                      percent === 100 
                        ? "text-emerald-600 dark:text-emerald-400" 
                        : "text-muted-foreground"
                    )}>
                      Đã học: {completedCount}/{phase.sessions.length} buổi ({percent}%)
                    </span>
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden border border-muted/30 shrink-0">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          percent === 100 ? "bg-emerald-500" : "bg-primary"
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-muted-foreground shrink-0">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 bg-transparent space-y-3">
                  {phase.sessions.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2 text-center">Không có buổi học nào trong giai đoạn này.</p>
                  ) : (
                    <div className="border border-muted rounded-xl bg-background overflow-hidden divide-y divide-muted/60">
                      {phase.sessions.map((session) => {
                        const lessons = getLessonsForRoadmapSession(session)
                        
                        return (
                          <div 
                            key={session.id}
                            className={cn(
                              "bg-transparent p-4 transition-colors flex flex-col gap-3",
                              isCurrent ? "hover:bg-primary/[0.01]" : "hover:bg-emerald-500/[0.01]"
                            )}
                          >
                            {/* Session Header */}
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-foreground">
                                  Buổi {session.sessionNumber}: {session.topic}
                                </span>
                              </div>
                              {/* Meta info row */}
                              <div className="flex items-center gap-4 text-[10px] md:text-[11px] text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" />
                                  {session.date} ({session.startTime} - {session.endTime})
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                  Giáo viên chính: <span className="font-semibold text-foreground">{session.substituteTeacherName || session.teacherName}</span> <Pencil className="h-2.5 w-2.5 ml-0.5 inline text-primary/80 cursor-pointer" />
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5">
                                  Trợ giảng: <span className="text-muted-foreground/60">Chưa gán</span> <Pencil className="h-2.5 w-2.5 ml-0.5 inline text-primary/80 cursor-pointer" />
                                </span>
                              </div>
                            </div>

                            {/* Lessons list inside this session */}
                            <div className="space-y-2.5 mt-1">
                              {lessons.map((lesson, lessonIdx) => {
                                const lessonKey = `session-${session.sessionNumber}-lesson-${lesson.id}-${lessonIdx}`
                                const isExpanded = expandedLessons[lessonKey] ?? (lessonIdx === 0)
                                
                                return (
                                  <div key={lesson.id} className="border border-muted rounded-xl bg-background overflow-hidden shadow-2xs">
                                    {/* Lesson Header Accordion Toggle */}
                                    <button
                                      type="button"
                                      className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-muted/5 transition-colors text-left"
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

                                    {/* Lesson Components List */}
                                    {isExpanded && (
                                      <div className="px-4 pb-3 pt-1 border-t border-muted/40 bg-muted/5 space-y-2.5">
                                        {lesson.components.map((c, cIdx) => {
                                          let iconColor = 'text-primary'
                                          let iconBg = 'bg-primary/10'
                                          let typeText = 'Tài liệu'
                                          
                                          if (c.type === 'slide') {
                                            iconColor = 'text-rose-600 dark:text-rose-400'
                                            iconBg = 'bg-rose-50 dark:bg-rose-950/20'
                                            typeText = 'Kịch bản'
                                          } else if (c.type === 'homework') {
                                            iconColor = 'text-emerald-600 dark:text-emerald-400'
                                            iconBg = 'bg-emerald-50 dark:bg-emerald-950/20'
                                            typeText = 'Bài luyện tập'
                                          } else if (c.type === 'quiz') {
                                            iconColor = 'text-amber-600 dark:text-amber-400'
                                            iconBg = 'bg-amber-50 dark:bg-amber-950/20'
                                            typeText = 'Nhiệm vụ phải làm'
                                          }

                                          return (
                                            <div key={cIdx} className="flex items-start gap-3 pl-2 text-xs">
                                              <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
                                                {c.type === 'homework' ? (
                                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                                ) : (
                                                  <FileText className="h-3.5 w-3.5" />
                                                )}
                                              </div>
                                              <div className="space-y-0.5 min-w-0">
                                                <p className="font-bold text-foreground truncate">{c.name}</p>
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                                                  <span>{typeText}</span>
                                                  {c.url && c.url !== '#' && (
                                                    <>
                                                      <span>•</span>
                                                      <a href={c.url} target="_blank" rel="noreferrer" className="text-rose-600 hover:underline font-semibold">
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
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
      )}
    </div>
  )
}
