'use client'

import { useState, useMemo } from 'react'
import { 
  ArrowLeft, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Play,
  CheckCircle2,
  RefreshCw,
  Calendar,
  Pencil
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FieldLabel } from '@/components/shared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockLMSRoadmaps } from '@/mocks/lmsRoadmaps'
import type { RoadmapSession } from './classesDetailTypes'
import { groupSessionsIntoPhases } from './classesDetailHelpers'

interface ClassesRoadmapWizardViewProps {
  sessions: RoadmapSession[]
  classRoom: string
  classTeacher: string
  classNameStr: string
  syllabusName: string
  lastChangedInfo: string | null
  onBack: () => void
  onSave: (updatedSessions: RoadmapSession[], logMessage: string, newSyllabusName: string) => void
}

export function ClassesRoadmapWizardView({
  sessions,
  classRoom,
  classTeacher,
  classNameStr,
  syllabusName,
  lastChangedInfo,
  onBack,
  onSave
}: ClassesRoadmapWizardViewProps) {
  // 1. Calculate stats based on current sessions
  const maxSessionNum = Math.max(...sessions.map((s) => s.sessionNumber), 12)
  const firstUpcomingSession = sessions.find((s) => s.status === 'upcoming')
  const firstUpcomingSessionNum = firstUpcomingSession ? firstUpcomingSession.sessionNumber : maxSessionNum + 1

  // Find current roadmap/syllabus based on the applied syllabusName
  let initialRoadmapId = ''
  let initialSyllabusId = ''
  if (syllabusName) {
    for (const rm of mockLMSRoadmaps) {
      const foundSyll = rm.syllabi.find(
        (s) => s.name === syllabusName || syllabusName.includes(s.name) || s.name.includes(syllabusName)
      )
      if (foundSyll) {
        initialRoadmapId = rm.id
        initialSyllabusId = foundSyll.id
        break
      }
    }
  }
  if (!initialRoadmapId || !initialSyllabusId) {
    const isIelts = classNameStr.toLowerCase().includes('ielts')
    const fallbackRm = mockLMSRoadmaps.find((r) => r.id === (isIelts ? 'rm-ielts-jr' : 'rm-ket')) || mockLMSRoadmaps[0]
    initialRoadmapId = fallbackRm.id
    initialSyllabusId = fallbackRm.syllabi[0].id
  }

  // States
  const [isSelectorsOpen, setIsSelectorsOpen] = useState(false)
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(initialRoadmapId)
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({})
  
  const currentRoadmap = useMemo(() => {
    return mockLMSRoadmaps.find((r) => r.id === selectedRoadmapId) || mockLMSRoadmaps[0]
  }, [selectedRoadmapId])

  const [selectedSyllabusId, setSelectedSyllabusId] = useState(initialSyllabusId)

  const currentSyllabus = useMemo(() => {
    return currentRoadmap.syllabi.find((s) => s.id === selectedSyllabusId) || currentRoadmap.syllabi[0]
  }, [selectedSyllabusId, currentRoadmap])

  const [selectedStartLessonId, setSelectedStartLessonId] = useState(() => {
    const activeRm = mockLMSRoadmaps.find((r) => r.id === initialRoadmapId) || mockLMSRoadmaps[0]
    const activeSyll = activeRm.syllabi.find((s) => s.id === initialSyllabusId) || activeRm.syllabi[0]
    const upcomingSession = sessions.find((s) => s.sessionNumber === firstUpcomingSessionNum)
    if (upcomingSession && activeSyll) {
      const foundLesson = activeSyll.lessons.find((l) => l.title === upcomingSession.topic || upcomingSession.topic?.includes(l.title))
      if (foundLesson) {
        return foundLesson.id
      }
    }
    return activeSyll?.lessons[0]?.id || ''
  })

  const currentStartLesson = useMemo(() => {
    return currentSyllabus.lessons.find((l) => l.id === selectedStartLessonId) || currentSyllabus.lessons[0]
  }, [selectedStartLessonId, currentSyllabus])

  // Dynamic phase grouping states
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({})

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Adjust state during render when syllabusName changes (official React pattern to replace useEffect)
  const [lastSyllabusPropValue, setLastSyllabusPropValue] = useState(syllabusName)
  if (syllabusName !== lastSyllabusPropValue) {
    setLastSyllabusPropValue(syllabusName)
    for (const rm of mockLMSRoadmaps) {
      const foundSyll = rm.syllabi.find(
        (s) => s.name === syllabusName || syllabusName.includes(s.name) || s.name.includes(syllabusName)
      )
      if (foundSyll) {
        setSelectedRoadmapId(rm.id)
        setSelectedSyllabusId(foundSyll.id)
        
        // Reset starting lesson if possible
        const upcomingSession = sessions.find((s) => s.sessionNumber === firstUpcomingSessionNum)
        if (upcomingSession) {
          const foundLesson = foundSyll.lessons.find(
            (l) => l.title === upcomingSession.topic || upcomingSession.topic?.includes(l.title)
          )
          if (foundLesson) {
            setSelectedStartLessonId(foundLesson.id)
          } else {
            setSelectedStartLessonId(foundSyll.lessons[0].id)
          }
        } else {
          setSelectedStartLessonId(foundSyll.lessons[0].id)
        }
        break
      }
    }
  }

  // Handle roadmap change to reset syllabus & start lesson
  const handleRoadmapChange = (roadmapId: string) => {
    setSelectedRoadmapId(roadmapId)
    const nextRoadmap = mockLMSRoadmaps.find((r) => r.id === roadmapId) || mockLMSRoadmaps[0]
    const nextSyllabus = nextRoadmap.syllabi[0]
    setSelectedSyllabusId(nextSyllabus.id)
    setSelectedStartLessonId(nextSyllabus.lessons[0].id)
    setErrors({})
  }

  // Handle syllabus change to reset start lesson
  const handleSyllabusChange = (syllabusId: string) => {
    setSelectedSyllabusId(syllabusId)
    const nextSyllabus = currentRoadmap.syllabi.find((s) => s.id === syllabusId) || currentRoadmap.syllabi[0]
    setSelectedStartLessonId(nextSyllabus.lessons[0].id)
    setErrors({})
  }

  // Map the new LMS lessons to the remaining sessions
  const previewMappedSessions = useMemo(() => {
    const startIndex = currentSyllabus.lessons.findIndex((l) => l.id === selectedStartLessonId)
    if (startIndex === -1) return []

    const mapped: Array<{ 
      sessionNum: number
      lmsLesson: typeof currentSyllabus.lessons[0]
      sessionData?: RoadmapSession
    }> = []
    let currentLmsIndex = startIndex

    for (let sNum = firstUpcomingSessionNum; sNum <= maxSessionNum; sNum++) {
      const sessionData = sessions.find((s) => s.sessionNumber === sNum && s.status === 'upcoming')
      if (sessionData) {
        if (currentLmsIndex < currentSyllabus.lessons.length) {
          mapped.push({
            sessionNum: sNum,
            lmsLesson: currentSyllabus.lessons[currentLmsIndex],
            sessionData
          })
          currentLmsIndex++
        } else {
          // Recycle lessons if there are more remaining sessions than available lessons
          const recycledIndex = (currentLmsIndex - startIndex) % currentSyllabus.lessons.length
          mapped.push({
            sessionNum: sNum,
            lmsLesson: currentSyllabus.lessons[recycledIndex],
            sessionData
          })
          currentLmsIndex++
        }
      }
    }
    return mapped
  }, [currentSyllabus, selectedStartLessonId, firstUpcomingSessionNum, maxSessionNum, sessions])

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

    // If session.sessionNumber is 3, return two lessons to show "2 bài trong 1 buổi"
    if (session.sessionNumber === 3) {
      const secondaryLesson = {
        id: `${session.id}-sub`,
        lessonNumber: session.sessionNumber,
        title: 'Thành phần buổi học 2 - 10 phút',
        description: 'Luyện tập bổ trợ từ vựng và ngữ pháp nâng cao.',
        components: [
          { name: 'test kịch bản 2', type: 'quiz' as const, url: '#' },
          { name: 'Bài ôn tập 1', type: 'homework' as const, url: '#' }
        ]
      }
      return [primaryLesson, secondaryLesson]
    }

    return [primaryLesson]
  }

  const handleSave = () => {
    if (firstUpcomingSessionNum > maxSessionNum) {
      setErrors({ global: 'Không thể đổi lộ trình vì toàn bộ các buổi học đã hoàn thành!' })
      return
    }

    // 1. Separate current sessions into past (keep intact) and upcoming (to be replaced)
    const pastSessions: RoadmapSession[] = []
    const upcomingToReplace: RoadmapSession[] = []

    sessions.forEach((s) => {
      if (s.status !== 'upcoming' || s.sessionNumber < firstUpcomingSessionNum) {
        pastSessions.push(s)
      } else {
        upcomingToReplace.push(s)
      }
    })

    // 2. Convert the upcoming sessions that we are replacing into cancelled historical sessions
    const replacedCancelledSessions: RoadmapSession[] = upcomingToReplace.map((s) => ({
      ...s,
      id: `${s.id}-replaced-${Date.now()}`,
      status: 'cancelled',
      description: s.description ? `${s.description} (Lộ trình này đã được thay thế)` : 'Lộ trình này đã được thay thế'
    }))

    // 3. Create the new upcoming sessions using the previewMappedSessions (the new syllabus lessons)
    const newUpcomingSessions: RoadmapSession[] = upcomingToReplace.map((s) => {
      const mappedPreview = previewMappedSessions.find((p) => p.sessionNum === s.sessionNumber)
      const lmsLesson = mappedPreview?.lmsLesson

      return {
        ...s,
        id: `session-new-${s.sessionNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        topic: lmsLesson ? lmsLesson.title : s.topic,
        description: lmsLesson ? lmsLesson.description : s.description,
        materials: lmsLesson 
          ? lmsLesson.components.map((c) => ({
              name: c.name,
              url: c.url,
              type: c.type === 'slide' ? 'Phải làm' : 'Tham khảo' as 'Phải làm' | 'Tham khảo'
            }))
          : s.materials,
        syllabusName: currentSyllabus.name,
        status: 'upcoming' as const
      }
    })

    // 4. Combine all sessions and sort them
    const combinedSessions = [...pastSessions, ...replacedCancelledSessions, ...newUpcomingSessions]

    combinedSessions.sort((a, b) => {
      if (a.sessionNumber !== b.sessionNumber) {
        return a.sessionNumber - b.sessionNumber
      }
      if (a.status === 'cancelled' && b.status !== 'cancelled') {
        return -1
      }
      if (a.status !== 'cancelled' && b.status === 'cancelled') {
        return 1
      }
      return 0
    })

    const logMessage = `Đã đổi lộ trình giảng dạy sang [${currentRoadmap.name} - ${currentSyllabus.name}] bắt đầu từ buổi ${firstUpcomingSessionNum} (Bài bắt đầu: ${currentStartLesson.title}).`
    onSave(combinedSessions, logMessage, currentSyllabus.name)
    setIsSelectorsOpen(false)
  }

  return (
    <div className="flex h-full flex-col min-h-0 overflow-hidden bg-background">
      
      {/* Header bar within the same Detail modal */}
      <div className="bg-primary/5 px-6 py-4 border-b border-muted flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-primary/10 shrink-0 text-muted-foreground hover:text-foreground"
            onClick={onBack}
            title="Quay lại chi tiết lớp học"
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Thiết lập & Đổi lộ trình giảng dạy
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Lớp học: <strong>{classNameStr}</strong> • Phòng: {classRoom} • Giáo viên: {classTeacher}
            </p>
          </div>
        </div>
      </div>

      {/* Main Single Pane scroll container */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar">
        
        {/* Action strip to expand/collapse change options */}
        <div className="flex items-center justify-between bg-muted/15 p-4 rounded-xl border border-muted/80">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Cấu hình thay đổi lộ trình</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Chọn Lộ trình, Khung chương trình và Bài học xuất phát cho các buổi học tiếp theo.
            </p>
          </div>
          <Button
            variant={isSelectorsOpen ? "outline" : "default"}
            size="xs"
            onClick={() => setIsSelectorsOpen(!isSelectorsOpen)}
            className="rounded-lg text-xs flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {isSelectorsOpen ? "Ẩn tùy chọn chọn" : "Đổi lộ trình"}
          </Button>
        </div>

        {/* Configuration selectors (Only visible when toggled open) */}
        {isSelectorsOpen && (
          <div className="bg-background rounded-xl border border-muted p-4 space-y-4 shadow-sm animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldLabel label="Lộ trình giảng dạy LMS" required>
                <Select value={selectedRoadmapId} onValueChange={handleRoadmapChange}>
                  <SelectTrigger className="w-full min-w-0 rounded-lg shadow-xs border border-muted text-xs bg-background h-9">
                    <SelectValue placeholder="Chọn lộ trình..." className="truncate text-left block w-full min-w-0" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-muted shadow-lg bg-background z-50 w-[var(--radix-select-trigger-width)]">
                    {mockLMSRoadmaps.map((r) => (
                      <SelectItem key={r.id} value={r.id} className="text-xs whitespace-normal py-1.5 text-left leading-normal">
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldLabel>

              <FieldLabel label="Khung giáo trình LMS" required>
                <Select value={selectedSyllabusId} onValueChange={handleSyllabusChange}>
                  <SelectTrigger className="w-full min-w-0 rounded-lg shadow-xs border border-muted text-xs bg-background h-9">
                    <SelectValue placeholder="Chọn giáo trình..." className="truncate text-left block w-full min-w-0" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-muted shadow-lg bg-background z-50 w-[var(--radix-select-trigger-width)]">
                    {currentRoadmap.syllabi.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs whitespace-normal py-1.5 text-left leading-normal">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldLabel>
            </div>

            <FieldLabel label={`Bài học LMS bắt đầu (Áp dụng từ Buổi số ${firstUpcomingSessionNum})`} required>
              <Select value={selectedStartLessonId} onValueChange={setSelectedStartLessonId}>
                <SelectTrigger className="w-full min-w-0 rounded-lg shadow-xs border border-muted text-xs bg-background h-9">
                  <SelectValue placeholder="Chọn bài học xuất phát..." className="truncate text-left block w-full min-w-0" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-muted shadow-lg bg-background z-50 w-[var(--radix-select-trigger-width)]">
                  {currentSyllabus.lessons.map((l) => (
                    <SelectItem key={l.id} value={l.id} className="text-xs whitespace-normal py-1.5 text-left leading-normal">
                      Bài {l.lessonNumber}: {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldLabel>

            {/* Live Configuration Preview Alert (Not Applied yet indicator) */}
            <div className="text-[11px] bg-primary/[0.02] border border-primary/10 rounded-lg p-2.5 space-y-1 animate-in fade-in duration-100">
              <span className="font-bold text-primary flex items-center gap-1">
                📌 Xem trước cấu hình thay đổi (Chưa áp dụng):
              </span>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {currentRoadmap.name} — {currentSyllabus.name} (Bắt đầu từ: Bài {currentStartLesson.lessonNumber}: {currentStartLesson.title})
              </p>
              <p className="text-[10px] text-muted-foreground">
                Thông tin ở Giai đoạn 2 bên dưới vẫn hiển thị cấu hình cũ cho đến khi bạn nhấn nút <strong className="text-primary font-bold">Áp dụng</strong>.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-muted/80">
              <Button
                size="sm"
                onClick={handleSave}
                className="rounded-lg text-xs bg-primary hover:bg-primary/90"
                disabled={firstUpcomingSessionNum > maxSessionNum}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        )}

        {/* ACCORDION ROADMAP GROUPS */}
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
                      : "bg-muted/10 hover:bg-muted/20"
                  )}
                  onClick={() => togglePhase(phase.phaseNumber)}
                >
                  <div className="flex items-center justify-between flex-1 pr-4 gap-4 flex-wrap">
                    <div className="flex flex-col text-left gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Play className="h-3 w-3 fill-current" />
                            {isSelectorsOpen ? "Lộ trình đang cấu hình" : "Lộ trình đang áp dụng"}
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
                  <div className="p-4 bg-muted/10 space-y-3">
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

        {/* Validation Errors display */}
        {errors.global && (
          <p className="text-xs text-destructive font-medium">
            {errors.global}
          </p>
        )}

      </div>



    </div>
  )
}
